import {
  defineEventHandler,
  createError,
  getRouterParam,
  getQuery,
  getRequestIP,
  setHeader,
} from 'h3'

/**
 * The hero demo's data source.
 *
 * The demo is interactive, so part of the request does come from the browser.
 * That makes the validation here the whole security story, and the rule is
 * that the request *shape* is fixed in server code and only leaf values vary:
 *
 *  - the endpoint, the method and every parameter not listed below are fixed
 *  - free text is length-capped and character-restricted by an allowlist
 *  - enums are chosen from a fixed set, never parsed out of input
 *  - coordinates are bounded and rounded, since a dragged marker sends them
 *
 * A passthrough proxy would be an open, unmetered front door to a paid API.
 * This is a search box with four knobs.
 *
 * The key is server-only and never reaches the browser.
 */

/** Origins the demo can query. Presets, so nobody picks arbitrary coordinates. */
const PLACES = {
  'times-square': { label: 'Times Square', lat: 40.758, lng: -73.9855 },
  'brooklyn-bridge': { label: 'Brooklyn Bridge', lat: 40.7061, lng: -73.9969 },
  'central-park': { label: 'Central Park', lat: 40.7812, lng: -73.9665 },
  'jfk-airport': { label: 'JFK Airport', lat: 40.6413, lng: -73.7781 },
} as const

const MODES = ['foot', 'bike', 'car']
const MINUTES = [5, 10, 15, 20]

/**
 * Letters, digits, spaces and a little punctuation. Deliberately an allowlist:
 * anything not named here cannot reach the API.
 */
const QUERY_OK = /^[\p{L}\p{N} '&.,-]{1,48}$/u

type PlaceKey = keyof typeof PLACES

function placeKey(raw: unknown): PlaceKey {
  const key = String(raw ?? 'times-square')
  return (key in PLACES ? key : 'times-square') as PlaceKey
}

/**
 * A dragged marker sends its own coordinates, so this is the one place the
 * caller picks a point rather than choosing from a list. Bounded and rounded
 * rather than allowlisted, because "anywhere on earth" is the demo.
 *
 * Four decimals is about 11 metres, which is finer than a marker drag is
 * meaningful and keeps the cache from growing a key per pixel.
 */
function coord(raw: unknown, limit: number): number | null {
  const n = Number(raw)
  if (!Number.isFinite(n) || Math.abs(n) > limit) return null
  return Math.round(n * 1e4) / 1e4
}

/** The origin: a dragged marker if it sent one, otherwise the chosen preset. */
function origin(q: Record<string, unknown>): { lat: number; lng: number; tag: string } {
  const lat = coord(q.lat, 90)
  const lng = coord(q.lng, 180)
  if (lat !== null && lng !== null) return { lat, lng, tag: `${lat},${lng}` }
  const p = placeKey(q.place)
  return { ...PLACES[p], tag: p }
}

interface Resolved {
  path: string
  method: 'GET' | 'POST'
  body?: unknown
  /** Identifies this exact request in the cache. */
  key: string
}

function resolve(group: string, q: Record<string, unknown>): Resolved | null {
  const { lat, lng, tag } = origin(q)

  switch (group) {
    case 'search': {
      const query = String(q.q ?? 'coffee').trim() || 'coffee'
      if (!QUERY_OK.test(query)) {
        throw createError({ statusCode: 400, statusMessage: 'Unsupported query' })
      }
      return {
        path: '/search',
        method: 'POST',
        body: { query, lat, lng, limit: 4 },
        key: `search:${tag}:${query.toLowerCase()}`,
      }
    }
    case 'geocode':
      return {
        path: `/geocode/reverse?lat=${lat}&lng=${lng}`,
        method: 'GET',
        key: `geocode:${tag}`,
      }
    case 'spatial':
      return {
        path: `/contains?lat=${lat}&lng=${lng}`,
        method: 'GET',
        key: `spatial:${tag}`,
      }
    case 'isochrone': {
      const mode = MODES.includes(String(q.mode)) ? String(q.mode) : 'foot'
      const minutes = MINUTES.includes(Number(q.minutes)) ? Number(q.minutes) : 10
      return {
        path: `/isochrone?lat=${lat}&lng=${lng}&mode=${mode}&minutes=${minutes}`,
        method: 'GET',
        key: `isochrone:${tag}:${mode}:${minutes}`,
      }
    }
    default:
      return null
  }
}

/**
 * Long, because the answers barely move. The point is to need upstream as
 * rarely as possible: inside compose every container shares one source address
 * as far as the API is concerned, so the demo competes with the console and
 * the ops worker for a single rate-limit bucket and only wins occasionally.
 */
const CACHE_MS = 30 * 60_000
const CACHE_MAX = 300
const cache = new Map<string, { at: number; payload: unknown }>()

/**
 * Back off after an upstream failure. Retrying on every request is exactly
 * what the API's penalty box counts, so a brief blip escalates into a block
 * that far outlasts it. Found by doing it to the dev API.
 */
const FAIL_BACKOFF_MS = 30_000
const failures = new Map<string, number>()

/**
 * Tighter than it needed to be for fixed requests. Free text means the cache
 * no longer absorbs everything, so this is the real ceiling on what the demo
 * can cost.
 */
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 30
const hits = new Map<string, { at: number; count: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const seen = hits.get(ip)
  if (!seen || now - seen.at > RATE_WINDOW_MS) {
    hits.set(ip, { at: now, count: 1 })
    return false
  }
  seen.count += 1
  return seen.count > RATE_MAX
}

export default defineEventHandler(async (event) => {
  const group = getRouterParam(event, 'group') ?? ''
  const req = resolve(group, getQuery(event) as Record<string, unknown>)
  if (!req) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown demo' })
  }

  const cached = cache.get(req.key)
  if (cached && Date.now() - cached.at < CACHE_MS) {
    setHeader(event, 'x-demo-cache', 'hit')
    return cached.payload
  }

  /** Stale beats broken: losing the race for the rate-limit bucket should not empty the hero. */
  const stale = () => {
    if (!cached) return null
    setHeader(event, 'x-demo-cache', 'stale')
    return cached.payload
  }

  const failedAt = failures.get(req.key)
  if (failedAt && Date.now() - failedAt < FAIL_BACKOFF_MS) {
    const s = stale()
    if (s) return s
    throw createError({ statusCode: 503, statusMessage: 'Demo temporarily unavailable' })
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (rateLimited(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Slow down' })
  }

  const { barrelmanApiUrl, barrelmanDemoKey } = useRuntimeConfig()
  if (!barrelmanDemoKey) {
    throw createError({ statusCode: 503, statusMessage: 'Demo key not configured' })
  }

  let res: Response
  try {
    res = await fetch(`${barrelmanApiUrl}${req.path}`, {
      method: req.method,
      headers: {
        authorization: `Bearer ${barrelmanDemoKey}`,
        ...(req.body ? { 'content-type': 'application/json' } : {}),
      },
      ...(req.body ? { body: JSON.stringify(req.body) } : {}),
      signal: AbortSignal.timeout(8_000),
    })
  } catch {
    failures.set(req.key, Date.now())
    const s = stale()
    if (s) return s
    throw createError({ statusCode: 504, statusMessage: 'Upstream did not answer' })
  }

  if (!res.ok) {
    failures.set(req.key, Date.now())
    const s = stale()
    if (s) return s
    throw createError({ statusCode: 502, statusMessage: 'Upstream unavailable' })
  }

  const payload = await res.json().catch(() => null)
  failures.delete(req.key)

  // An empty list is usually the API still warming rather than a real answer.
  // Holding it for the full TTL pinned the hero to "no results" after restarts.
  const empty = payload == null || (Array.isArray(payload) && payload.length === 0)
  if (!empty) {
    // Free text means unbounded keys, so evict oldest-first: a bot typing
    // nonsense should not be able to grow this without limit.
    if (cache.size >= CACHE_MAX) {
      const oldest = cache.keys().next().value
      if (oldest) cache.delete(oldest)
    }
    cache.set(req.key, { at: Date.now(), payload })
  }

  setHeader(event, 'x-demo-cache', 'miss')
  return payload
})
