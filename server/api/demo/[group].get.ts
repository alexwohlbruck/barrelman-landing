import { defineEventHandler, createError, getRouterParam, getRequestIP, setHeader } from 'h3'

/**
 * The hero demo's data source.
 *
 * This is deliberately *not* a proxy. The browser sends a group name and
 * nothing else; the request that goes upstream is fixed here, in server code.
 * A passthrough proxy on a public marketing page would be an open, unmetered
 * front door to a paid API, and no amount of throttling makes that safe.
 *
 * Every response is cached, and that is load-bearing rather than an
 * optimisation. Upstream sees one IP for the whole internet, so without a
 * cache a modest burst of visitors trips the per-address rate limit and then
 * the penalty box, and the demo breaks for everyone at once. With fixed
 * requests and a five minute TTL the upstream cost is a handful of calls per
 * interval no matter how much traffic arrives.
 *
 * The key is server-only. It never reaches the browser.
 */

interface DemoRequest {
  path: string
  method: 'GET' | 'POST'
  body?: unknown
}

/** Times Square. The local dataset only covers nyc-metro. */
const LAT = 40.758
const LNG = -73.9855

const DEMOS: Record<string, DemoRequest> = {
  search: {
    path: '/search',
    method: 'POST',
    body: { query: 'coffee', lat: LAT, lng: LNG, limit: 4 },
  },
  geocode: {
    path: `/geocode/reverse?lat=${LAT}&lng=${LNG}`,
    method: 'GET',
  },
  spatial: {
    path: `/contains?lat=${LAT}&lng=${LNG}`,
    method: 'GET',
  },
  isochrone: {
    path: `/isochrone?lat=${LAT}&lng=${LNG}&mode=foot&minutes=10`,
    method: 'GET',
  },
}

/**
 * Long, because the requests are fixed and the answers barely move. The point
 * is to need upstream as rarely as possible: inside compose every container
 * shares one source address as far as the API is concerned, so the demo
 * competes with the console and the ops worker for a single rate-limit bucket
 * and only wins occasionally.
 */
const CACHE_MS = 30 * 60_000
const cache = new Map<string, { at: number; status: number; payload: unknown }>()

/**
 * Back off after an upstream failure.
 *
 * Without this the route retries on every single request while upstream is
 * unhappy, and those retries are exactly what the API's penalty box counts:
 * a brief blip escalates into a temporary block that outlasts the blip by a
 * wide margin. Found the hard way, by doing it to the dev API.
 *
 * Short enough that recovery is quick, long enough to stop a hot loop.
 */
const FAIL_BACKOFF_MS = 30_000
const failures = new Map<string, number>()

/**
 * A light per-address limit on this route. The cache already protects the API;
 * this protects the landing server from being used as a traffic amplifier.
 */
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 60
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
  const demo = DEMOS[group]
  if (!demo) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown demo' })
  }

  const cached = cache.get(group)
  if (cached && Date.now() - cached.at < CACHE_MS) {
    setHeader(event, 'x-demo-cache', 'hit')
    return cached.payload
  }

  const failedAt = failures.get(group)
  if (failedAt && Date.now() - failedAt < FAIL_BACKOFF_MS) {
    // Stale beats broken. Inside compose every container shares one source
    // address as far as the API is concerned, so the demo competes with the
    // console and the ops worker for a single rate-limit bucket and only wins
    // occasionally. A rate-limited minute should not empty the hero when we
    // are holding a perfectly good answer from earlier.
    if (cached) {
      setHeader(event, 'x-demo-cache', 'stale')
      return cached.payload
    }
    throw createError({
      statusCode: 503,
      statusMessage: 'Demo temporarily unavailable',
    })
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (rateLimited(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Slow down' })
  }

  const { barrelmanApiUrl, barrelmanDemoKey } = useRuntimeConfig()
  if (!barrelmanDemoKey) {
    // Without a key the demo cannot run. Say so plainly rather than letting
    // the hero render an upstream 401 as though the API were broken.
    throw createError({
      statusCode: 503,
      statusMessage: 'Demo key not configured',
    })
  }

  let res: Response
  try {
    res = await fetch(`${barrelmanApiUrl}${demo.path}`, {
      method: demo.method,
      headers: {
        authorization: `Bearer ${barrelmanDemoKey}`,
        ...(demo.body ? { 'content-type': 'application/json' } : {}),
      },
      ...(demo.body ? { body: JSON.stringify(demo.body) } : {}),
      signal: AbortSignal.timeout(8_000),
    })
  } catch {
    failures.set(group, Date.now())
    // Stale beats broken. Inside compose every container shares one source
    // address as far as the API is concerned, so the demo competes with the
    // console and the ops worker for a single rate-limit bucket and only wins
    // occasionally. A rate-limited minute should not empty the hero when we
    // are holding a perfectly good answer from earlier.
    if (cached) {
      setHeader(event, 'x-demo-cache', 'stale')
      return cached.payload
    }
    throw createError({
      statusCode: 504,
      statusMessage: 'Upstream did not answer',
    })
  }

  if (!res.ok) {
    failures.set(group, Date.now())
    // Stale beats broken. Inside compose every container shares one source
    // address as far as the API is concerned, so the demo competes with the
    // console and the ops worker for a single rate-limit bucket and only wins
    // occasionally. A rate-limited minute should not empty the hero when we
    // are holding a perfectly good answer from earlier.
    if (cached) {
      setHeader(event, 'x-demo-cache', 'stale')
      return cached.payload
    }
    throw createError({
      statusCode: 502,
      statusMessage: 'Upstream unavailable',
    })
  }

  const payload = await res.json().catch(() => null)
  failures.delete(group)

  // Don't hold an empty result for the full TTL. The API answers 200 with an
  // empty list while it is still warming, and caching that pinned the hero to
  // "no results" for five minutes after every restart.
  const empty = payload == null || (Array.isArray(payload) && payload.length === 0)
  if (!empty) cache.set(group, { at: Date.now(), status: res.status, payload })
  setHeader(event, 'x-demo-cache', 'miss')
  return payload
})
