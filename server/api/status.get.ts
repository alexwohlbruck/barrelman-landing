/**
 * The status page's data: the public API's /health, reduced to what a reader
 * needs to know whether their endpoints work.
 *
 * Cached for 30 seconds so a busy status page (which is exactly when people
 * open one) costs the API one probe per half minute, not one per visitor.
 *
 * Latencies, uptime and optional dependencies are dropped here. /health
 * publishes them for operators; on a public page they invite reading noise as
 * an incident.
 */

type Status = 'ok' | 'degraded' | 'down'

export interface StatusReport {
  /** False when /health itself could not be reached or parsed. */
  reachable: boolean
  status: Status
  checkedAt: string
  endpoints: { group: string; paths: string[]; status: Status; message?: string }[]
  dependencies: { name: string; status: Status }[]
}

interface Health {
  status?: string
  checkedAt?: string
  dependencies?: Record<string, { status?: string; optional?: boolean }>
  endpoints?: { group?: string; paths?: string[]; status?: string; message?: string }[]
}

/** /health speaks `ok | degraded | unavailable | error`; the page speaks three words. */
function normalise(raw: unknown): Status {
  if (raw === 'ok') return 'ok'
  if (raw === 'degraded') return 'degraded'
  return 'down'
}

export default defineCachedEventHandler(
  async (): Promise<StatusReport> => {
    const { public: config } = useRuntimeConfig()
    const now = new Date().toISOString()

    let health: Health
    try {
      // /health answers 503 with a full body when something is down, so the
      // body is read whatever the status code.
      const res = await fetch(`${config.apiUrl}/health`, {
        signal: AbortSignal.timeout(8000),
        headers: { accept: 'application/json' },
      })
      health = (await res.json()) as Health
    } catch {
      return { reachable: false, status: 'down', checkedAt: now, endpoints: [], dependencies: [] }
    }

    return {
      reachable: true,
      status: normalise(health.status),
      checkedAt: health.checkedAt ?? now,
      endpoints: (health.endpoints ?? []).map((e) => ({
        group: String(e.group ?? ''),
        paths: Array.isArray(e.paths) ? e.paths.map(String) : [],
        status: normalise(e.status),
        ...(e.status !== 'ok' && e.message ? { message: String(e.message) } : {}),
      })),
      dependencies: Object.entries(health.dependencies ?? {})
        .filter(([, dep]) => !dep.optional)
        .map(([name, dep]) => ({ name, status: normalise(dep.status) })),
    }
  },
  { maxAge: 30, name: 'status', getKey: () => 'health' },
)
