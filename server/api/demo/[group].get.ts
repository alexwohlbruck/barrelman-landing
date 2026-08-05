import {
  defineEventHandler,
  createError,
  getRouterParam,
  getQuery,
  getRequestHeader,
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

/**
 * An OSM element reference. Narrow on purpose: this value is interpolated into
 * the upstream path, so anything looser would be a path-traversal surface.
 */
const OSM_ID_OK = /^(node|way|relation)\/\d{1,20}$/

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
    case 'isochrone': {
      const mode = MODES.includes(String(q.mode)) ? String(q.mode) : 'foot'
      const minutes = MINUTES.includes(Number(q.minutes)) ? Number(q.minutes) : 10
      // `durations` in seconds, not `minutes`. Sending the wrong parameter was
      // silently ignored, so every duration came back as the 15-minute default
      // and the control appeared to do nothing.
      return {
        path: `/isochrone?lat=${lat}&lng=${lng}&mode=${mode}&durations=${minutes * 60}`,
        method: 'GET',
        key: `isochrone:${tag}:${mode}:${minutes}`,
      }
    }

    // Areas containing the point, smallest first.
    case 'parents':
      return {
        path: `/contains?lat=${lat}&lng=${lng}`,
        method: 'GET',
        key: `parents:${tag}`,
      }

    // What sits inside a given area. Two steps, because /children needs an
    // area to descend from and the demo starts from a point.
    case 'children': {
      const id = String(q.id ?? '')
      if (!OSM_ID_OK.test(id)) {
        throw createError({ statusCode: 400, statusMessage: 'Unsupported id' })
      }
      return {
        path: `/children?id=${encodeURIComponent(id)}&limit=6`,
        method: 'GET',
        key: `children:${id}`,
      }
    }

    // A single place, by OSM id. Backs the detail view in the search tab.
    case 'place': {
      const id = String(q.id ?? '')
      if (!OSM_ID_OK.test(id)) {
        throw createError({ statusCode: 400, statusMessage: 'Unsupported id' })
      }
      return {
        path: `/place/${id}`,
        method: 'GET',
        key: `place:${id}`,
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
const FAIL_MAX_KEYS = 1_000
const failures = new Map<string, { at: number }>()

/**
 * Tighter than it needed to be for fixed requests. Free text means the cache
 * no longer absorbs everything, so this is the real ceiling on what the demo
 * can cost.
 */
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 30
const RATE_MAX_KEYS = 5_000
const hits = new Map<string, { at: number; count: number }>()

/**
 * The caller's address, as far as it can be trusted.
 *
 * `getRequestIP(event, { xForwardedFor: true })` reads the *first* entry of
 * `X-Forwarded-For`, which is the one the caller wrote. A script sending a
 * different value per request then gets a fresh bucket every time and this
 * limiter does nothing at all. Counting in from the right lands on the entry
 * our own proxy appended, which is the first one that was observed rather than
 * claimed.
 *
 * One hop, matching a single reverse proxy in front of the site. With no proxy
 * there is no header and h3 falls back to the socket address.
 */
function callerAddress(event: Parameters<typeof getRequestIP>[0]): string {
  const forwarded = getRequestHeader(event, 'x-forwarded-for')
  if (forwarded) {
    const chain = forwarded
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
    const trusted = chain[chain.length - 1]
    if (trusted) return trusted
  }
  return getRequestIP(event) ?? 'unknown'
}

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const seen = hits.get(ip)
  if (!seen || now - seen.at > RATE_WINDOW_MS) {
    // Bounded, like the response cache: addresses are attacker-supplied in
    // practice, so an unbounded map is a slow memory leak with a trigger.
    if (hits.size >= RATE_MAX_KEYS) sweepExpired(hits, RATE_WINDOW_MS, now, RATE_MAX_KEYS)
    hits.set(ip, { at: now, count: 1 })
    return false
  }
  seen.count += 1
  return seen.count > RATE_MAX
}

/**
 * Bounded for the same reason as the cache: the key embeds free text and
 * marker coordinates, so a caller cycling queries against a failing upstream
 * adds an entry per request that nothing would ever read again.
 */
function noteFailure(key: string): void {
  const now = Date.now()
  if (failures.size >= FAIL_MAX_KEYS) sweepExpired(failures, FAIL_BACKOFF_MS, now, FAIL_MAX_KEYS)
  failures.set(key, { at: now })
}

/**
 * Drop entries whose window has passed, then the oldest tenth if that was not
 * enough. `cap` is a parameter rather than a constant because the two callers
 * hold different ones — reading the wrong map's cap here would leave the
 * smaller map growing past its own limit, which is the bug this whole function
 * exists to prevent.
 */
function sweepExpired(map: Map<string, { at: number }>, ttlMs: number, now: number, cap: number): void {
  for (const [key, entry] of map) {
    if (now - entry.at > ttlMs) map.delete(key)
  }
  if (map.size < cap) return

  let dropped = 0
  for (const key of map.keys()) {
    map.delete(key)
    if (++dropped >= Math.ceil(cap / 10)) break
  }
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

  const failedAt = failures.get(req.key)?.at
  if (failedAt && Date.now() - failedAt < FAIL_BACKOFF_MS) {
    const s = stale()
    if (s) return s
    throw createError({ statusCode: 503, statusMessage: 'Demo temporarily unavailable' })
  }

  if (rateLimited(callerAddress(event))) {
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
    noteFailure(req.key)
    const s = stale()
    if (s) return s
    throw createError({ statusCode: 504, statusMessage: 'Upstream did not answer' })
  }

  if (!res.ok) {
    noteFailure(req.key)
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
