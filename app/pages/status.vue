<script setup lang="ts">
/**
 * Public status page, rendered from /api/status (a cached, reduced copy of
 * the API's /health). Server-rendered so it reads correctly without
 * JavaScript, then refreshed in the browser while it stays open.
 */
import type { StatusReport } from '~~/server/api/status.get'

type Status = StatusReport['status']

useHead({
  title: 'Status · Barrelman',
  meta: [{ name: 'description', content: 'Current availability of the Barrelman API, by endpoint group.' }],
})

const { data, refresh } = await useFetch<StatusReport>('/api/status')

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => refresh(), 60_000)
})
onBeforeUnmount(() => clearInterval(timer))

const WORDS: Record<Status, string> = { ok: 'Operational', degraded: 'Degraded', down: 'Down' }
const DOTS: Record<Status, string> = { ok: 'bg-verdigris', degraded: 'bg-brass', down: 'bg-rubric' }

const SUMMARY: Record<Status, string> = {
  ok: 'All systems operational',
  degraded: 'Some features are degraded',
  down: 'Part of the API is down',
}

/** Display names for the required dependencies /health reports. */
const DEPENDENCY_NAMES: Record<string, string> = {
  database: 'Database',
  martin: 'Tile server',
  graphhopper: 'Street routing',
  motis: 'Transit routing',
}

const GROUP_NAMES: Record<string, string> = {
  tiles: 'Tiles',
  search: 'Search',
  geocode: 'Geocoding',
  isochrone: 'Isochrones',
  transit: 'Transit',
  routing: 'Routing',
  spatial: 'Spatial',
  places: 'Places',
}

function groupName(group: string) {
  return GROUP_NAMES[group] ?? group.charAt(0).toUpperCase() + group.slice(1)
}

const summary = computed(() => {
  if (!data.value) return 'Status unavailable'
  if (!data.value.reachable) return 'The API is not responding'
  return SUMMARY[data.value.status]
})

const overall = computed<Status>(() => data.value?.status ?? 'down')

const checkedLabel = computed(() => {
  if (!data.value) return ''
  return new Date(data.value.checkedAt).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
})
</script>

<template>
  <div>
    <SiteNav />
    <main>
      <div class="relative">
        <div class="neatline" aria-hidden="true" />
        <section class="band pt-32 sm:pt-36">
          <div class="measure">
            <SectionHead label="Status" title="API status" />

            <div class="mt-10 max-w-2xl rounded-lg border border-rule-strong bg-paper-aged px-5 py-4">
              <p class="flex items-center gap-3 text-lg font-medium text-ink">
                <span class="size-2.5 shrink-0 rounded-full" :class="DOTS[overall]" aria-hidden="true" />
                {{ summary }}
              </p>
              <p v-if="data" class="caption mt-1 pl-5.5">
                Last checked <time :datetime="data.checkedAt">{{ checkedLabel }}</time>
              </p>
            </div>

            <template v-if="data?.reachable">
              <h3 class="legend mt-12 text-ink-soft">Endpoints</h3>
              <ul class="mt-3 max-w-2xl divide-y divide-rule border-y border-rule">
                <li v-for="e in data.endpoints" :key="e.group" class="py-3">
                  <div class="flex items-baseline justify-between gap-4">
                    <div class="min-w-0">
                      <p class="text-body font-medium text-ink">{{ groupName(e.group) }}</p>
                      <p class="mt-0.5 truncate font-mono text-fine text-ink-soft">
                        {{ e.paths.join('  ') }}
                      </p>
                    </div>
                    <p class="flex shrink-0 items-center gap-2 text-body text-ink">
                      <span class="size-2 rounded-full" :class="DOTS[e.status]" aria-hidden="true" />
                      {{ WORDS[e.status] }}
                    </p>
                  </div>
                  <p v-if="e.message" class="caption mt-1">{{ e.message }}</p>
                </li>
              </ul>

              <h3 class="legend mt-12 text-ink-soft">Services</h3>
              <ul class="mt-3 max-w-2xl divide-y divide-rule border-y border-rule">
                <li
                  v-for="d in data.dependencies"
                  :key="d.name"
                  class="flex items-center justify-between gap-4 py-3"
                >
                  <p class="text-body text-ink">{{ DEPENDENCY_NAMES[d.name] ?? d.name }}</p>
                  <p class="flex items-center gap-2 text-body text-ink">
                    <span class="size-2 rounded-full" :class="DOTS[d.status]" aria-hidden="true" />
                    {{ WORDS[d.status] }}
                  </p>
                </li>
              </ul>
            </template>

            <p class="caption mt-10 max-w-2xl">
              This page refreshes every minute. To report a problem, email
              <a href="mailto:support@barrelman.dev" class="link">support@barrelman.dev</a> with the
              <code class="font-mono text-fine">X-Request-Id</code> header from the failing response.
            </p>
          </div>
        </section>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
