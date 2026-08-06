import { d as defineEventHandler, g as getRouterParam, a as getQuery, c as createError, s as setHeader, u as useRuntimeConfig, b as getRequestHeader, e as getRequestIP } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const PLACES = {
  "times-square": { label: "Times Square", lat: 40.758, lng: -73.9855 },
  "brooklyn-bridge": { label: "Brooklyn Bridge", lat: 40.7061, lng: -73.9969 },
  "central-park": { label: "Central Park", lat: 40.7812, lng: -73.9665 },
  "jfk-airport": { label: "JFK Airport", lat: 40.6413, lng: -73.7781 }
};
const MODES = ["foot", "bike", "car"];
const MINUTES = [5, 10, 15, 20];
const QUERY_OK = /^[\p{L}\p{N} '&.,-]{1,48}$/u;
const OSM_ID_OK = /^(node|way|relation)\/\d{1,20}$/;
function placeKey(raw) {
  const key = String(raw != null ? raw : "times-square");
  return key in PLACES ? key : "times-square";
}
function coord(raw, limit) {
  const n = Number(raw);
  if (!Number.isFinite(n) || Math.abs(n) > limit) return null;
  return Math.round(n * 1e4) / 1e4;
}
function origin(q) {
  const lat = coord(q.lat, 90);
  const lng = coord(q.lng, 180);
  if (lat !== null && lng !== null) return { lat, lng, tag: `${lat},${lng}` };
  const p = placeKey(q.place);
  return { ...PLACES[p], tag: p };
}
function resolve(group, q) {
  var _a, _b, _c;
  const { lat, lng, tag } = origin(q);
  switch (group) {
    case "search": {
      const query = String((_a = q.q) != null ? _a : "coffee").trim() || "coffee";
      if (!QUERY_OK.test(query)) {
        throw createError({ statusCode: 400, statusMessage: "Unsupported query" });
      }
      return {
        path: "/search",
        method: "POST",
        body: { query, lat, lng, limit: 4 },
        key: `search:${tag}:${query.toLowerCase()}`
      };
    }
    case "geocode":
      return {
        path: `/geocode/reverse?lat=${lat}&lng=${lng}`,
        method: "GET",
        key: `geocode:${tag}`
      };
    case "isochrone": {
      const mode = MODES.includes(String(q.mode)) ? String(q.mode) : "foot";
      const minutes = MINUTES.includes(Number(q.minutes)) ? Number(q.minutes) : 10;
      return {
        path: `/isochrone?lat=${lat}&lng=${lng}&mode=${mode}&durations=${minutes * 60}`,
        method: "GET",
        key: `isochrone:${tag}:${mode}:${minutes}`
      };
    }
    // Areas containing the point, smallest first.
    case "parents":
      return {
        path: `/contains?lat=${lat}&lng=${lng}`,
        method: "GET",
        key: `parents:${tag}`
      };
    // What sits inside a given area. Two steps, because /children needs an
    // area to descend from and the demo starts from a point.
    case "children": {
      const id = String((_b = q.id) != null ? _b : "");
      if (!OSM_ID_OK.test(id)) {
        throw createError({ statusCode: 400, statusMessage: "Unsupported id" });
      }
      return {
        path: `/children?id=${encodeURIComponent(id)}&limit=6`,
        method: "GET",
        key: `children:${id}`
      };
    }
    // A single place, by OSM id. Backs the detail view in the search tab.
    case "place": {
      const id = String((_c = q.id) != null ? _c : "");
      if (!OSM_ID_OK.test(id)) {
        throw createError({ statusCode: 400, statusMessage: "Unsupported id" });
      }
      return {
        path: `/place/${id}`,
        method: "GET",
        key: `place:${id}`
      };
    }
    default:
      return null;
  }
}
const CACHE_MS = 30 * 6e4;
const CACHE_MAX = 300;
const cache = /* @__PURE__ */ new Map();
const FAIL_BACKOFF_MS = 3e4;
const FAIL_MAX_KEYS = 1e3;
const failures = /* @__PURE__ */ new Map();
const RATE_WINDOW_MS = 6e4;
const RATE_MAX = 30;
const RATE_MAX_KEYS = 5e3;
const hits = /* @__PURE__ */ new Map();
function callerAddress(event) {
  var _a;
  const forwarded = getRequestHeader(event, "x-forwarded-for");
  if (forwarded) {
    const chain = forwarded.split(",").map((entry) => entry.trim()).filter(Boolean);
    const trusted = chain[chain.length - 1];
    if (trusted) return trusted;
  }
  return (_a = getRequestIP(event)) != null ? _a : "unknown";
}
function rateLimited(ip) {
  const now = Date.now();
  const seen = hits.get(ip);
  if (!seen || now - seen.at > RATE_WINDOW_MS) {
    if (hits.size >= RATE_MAX_KEYS) sweepExpired(hits, RATE_WINDOW_MS, now, RATE_MAX_KEYS);
    hits.set(ip, { at: now, count: 1 });
    return false;
  }
  seen.count += 1;
  return seen.count > RATE_MAX;
}
function noteFailure(key) {
  const now = Date.now();
  if (failures.size >= FAIL_MAX_KEYS) sweepExpired(failures, FAIL_BACKOFF_MS, now, FAIL_MAX_KEYS);
  failures.set(key, { at: now });
}
function sweepExpired(map, ttlMs, now, cap) {
  for (const [key, entry] of map) {
    if (now - entry.at > ttlMs) map.delete(key);
  }
  if (map.size < cap) return;
  let dropped = 0;
  for (const key of map.keys()) {
    map.delete(key);
    if (++dropped >= Math.ceil(cap / 10)) break;
  }
}
const _group__get = defineEventHandler(async (event) => {
  var _a, _b;
  const group = (_a = getRouterParam(event, "group")) != null ? _a : "";
  const req = resolve(group, getQuery(event));
  if (!req) {
    throw createError({ statusCode: 404, statusMessage: "Unknown demo" });
  }
  const cached = cache.get(req.key);
  if (cached && Date.now() - cached.at < CACHE_MS) {
    setHeader(event, "x-demo-cache", "hit");
    return cached.payload;
  }
  const stale = () => {
    if (!cached) return null;
    setHeader(event, "x-demo-cache", "stale");
    return cached.payload;
  };
  const failedAt = (_b = failures.get(req.key)) == null ? void 0 : _b.at;
  if (failedAt && Date.now() - failedAt < FAIL_BACKOFF_MS) {
    const s = stale();
    if (s) return s;
    throw createError({ statusCode: 503, statusMessage: "Demo temporarily unavailable" });
  }
  if (rateLimited(callerAddress(event))) {
    throw createError({ statusCode: 429, statusMessage: "Slow down" });
  }
  const { barrelmanApiUrl, barrelmanDemoKey } = useRuntimeConfig();
  if (!barrelmanDemoKey) {
    throw createError({ statusCode: 503, statusMessage: "Demo key not configured" });
  }
  let res;
  try {
    res = await fetch(`${barrelmanApiUrl}${req.path}`, {
      method: req.method,
      headers: {
        authorization: `Bearer ${barrelmanDemoKey}`,
        ...req.body ? { "content-type": "application/json" } : {}
      },
      ...req.body ? { body: JSON.stringify(req.body) } : {},
      signal: AbortSignal.timeout(8e3)
    });
  } catch {
    noteFailure(req.key);
    const s = stale();
    if (s) return s;
    throw createError({ statusCode: 504, statusMessage: "Upstream did not answer" });
  }
  if (!res.ok) {
    noteFailure(req.key);
    const s = stale();
    if (s) return s;
    throw createError({ statusCode: 502, statusMessage: "Upstream unavailable" });
  }
  const payload = await res.json().catch(() => null);
  failures.delete(req.key);
  const empty = payload == null || Array.isArray(payload) && payload.length === 0;
  if (!empty) {
    if (cache.size >= CACHE_MAX) {
      const oldest = cache.keys().next().value;
      if (oldest) cache.delete(oldest);
    }
    cache.set(req.key, { at: Date.now(), payload });
  }
  setHeader(event, "x-demo-cache", "miss");
  return payload;
});

export { _group__get as default };
//# sourceMappingURL=_group_.get.mjs.map
