<script setup lang="ts">
/**
 * The hero demo. Real requests, real responses, rendered the way the app
 * would render them.
 *
 * Data comes from /api/demo/<group>, which holds the request server-side and
 * caches it. Nothing here can choose what gets asked upstream, so the widget
 * cannot be turned into a free API console by editing the page.
 *
 * Fetching is lazy and per-tab: the first tab loads on mount, the rest when
 * you open them, and each result is kept so switching back is instant.
 */
import { ref, computed, onMounted, watch } from 'vue'
import { Check, Copy, Loader } from 'lucide-vue-next'
import type { Place } from './PlaceCard.vue'

interface Tab {
  id: string
  label: string
  /** null for tabs that have no live endpoint yet. */
  group: string | null
  request: string
  /** How to present the response body. */
  render: 'places' | 'json'
  caption: string
}

const tabs: Tab[] = [
  {
    id: 'search',
    label: 'Search',
    group: 'search',
    request: `curl "https://api.barrelman.dev/search" \\
  -H "Authorization: Bearer brm_live_..." \\
  -d '{"query":"coffee","lat":40.758,"lng":-73.99}'`,
    render: 'places',
    caption: 'Ranked by text match and distance.',
  },
  {
    id: 'geocode',
    label: 'Geocode',
    group: 'geocode',
    request: `curl "https://api.barrelman.dev/geocode/reverse\\
?lat=40.758&lng=-73.9855" \\
  -H "Authorization: Bearer brm_live_..."`,
    render: 'places',
    caption: 'Every area containing the point, smallest first.',
  },
  {
    id: 'spatial',
    label: 'Spatial',
    group: 'spatial',
    request: `curl "https://api.barrelman.dev/contains\\
?lat=40.758&lng=-73.9855" \\
  -H "Authorization: Bearer brm_live_..."`,
    render: 'json',
    caption: 'Point-in-polygon against real OSM geometry.',
  },
  {
    id: 'isochrone',
    label: 'Isochrones',
    group: 'isochrone',
    request: `curl "https://api.barrelman.dev/isochrone\\
?lat=40.758&lng=-73.9855&mode=foot&minutes=10" \\
  -H "Authorization: Bearer brm_live_..."`,
    render: 'json',
    caption: 'Ten minutes on foot, as a GeoJSON polygon.',
  },
  {
    id: 'tiles',
    label: 'Tiles',
    group: null,
    request: `map.addSource("barrelman", {
  type: "vector",
  tiles: [
    "https://api.barrelman.dev/tiles/pois/" +
    "{z}/{x}/{y}?api_key=brm_live_..."
  ]
})`,
    render: 'json',
    caption: 'Vector tiles straight out of PostGIS.',
  },
]

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; body: unknown }
  | { status: 'error'; message: string }

const active = ref(tabs[0]!.id)
const states = ref<Record<string, State>>({})
const copied = ref(false)

const current = computed(() => tabs.find((t) => t.id === active.value) ?? tabs[0]!)
const state = computed<State>(() => states.value[active.value] ?? { status: 'idle' })

/** The response, pretty-printed. Truncated so one verbose result can't stretch the hero. */
const body = computed(() => {
  const s = state.value
  if (s.status !== 'ok') return ''
  const text = JSON.stringify(s.body, null, 2)
  return text.length > 1400 ? `${text.slice(0, 1400)}\n…` : text
})

const places = computed<Place[]>(() => {
  const s = state.value
  if (s.status !== 'ok' || current.value.render !== 'places') return []
  return (Array.isArray(s.body) ? s.body : []).slice(0, 4) as Place[]
})

async function load(tab: Tab) {
  if (!tab.group || states.value[tab.id]?.status === 'ok') return
  states.value = { ...states.value, [tab.id]: { status: 'loading' } }
  try {
    const body = await $fetch(`/api/demo/${tab.group}`)
    states.value = { ...states.value, [tab.id]: { status: 'ok', body } }
  } catch {
    // The demo is a nicety, not the product. Say it plainly and let the rest
    // of the page carry on.
    states.value = {
      ...states.value,
      [tab.id]: { status: 'error', message: 'Live response unavailable right now.' },
    }
  }
}

onMounted(() => load(tabs[0]!))
watch(active, (id) => {
  const tab = tabs.find((t) => t.id === id)
  if (tab) load(tab)
})

async function copy() {
  try {
    await navigator.clipboard.writeText(current.value.request)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    // Clipboard is unavailable over plain HTTP; the text is selectable.
  }
}
</script>

<template>
  <div>
    <div class="relative z-10 -mb-px flex items-end gap-1 overflow-x-auto pl-5">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="shrink-0 rounded-t-md border px-4 pb-2 font-mono text-fine transition-colors"
        :class="
          active === tab.id
            ? 'border-b-0 border-rule-strong bg-paper-aged pt-2 text-ink'
            : 'border-rule bg-paper-deep/60 pt-1.5 text-ink-soft hover:bg-paper-deep hover:text-ink'
        "
        :aria-pressed="active === tab.id"
        @click="active = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="depth overflow-hidden rounded-lg border border-rule-strong bg-paper-aged">
      <div class="flex items-center justify-between gap-3 border-b border-rule px-5 py-2">
        <span class="caption truncate">{{ current.caption }}</span>
        <button
          class="shrink-0 p-1 text-ink-soft transition-colors hover:text-ink"
          :aria-label="copied ? 'Copied' : 'Copy request'"
          @click="copy"
        >
          <Check v-if="copied" class="size-3.5 text-verdigris" stroke-width="1.5" />
          <Copy v-else class="size-3.5" stroke-width="1.5" />
        </button>
      </div>

      <div class="grid md:grid-cols-2">
        <pre
          class="ruled overflow-x-auto border-b border-rubric/30 px-5 font-mono text-[12px] leading-[22px] text-ink md:border-b-0 md:border-r"
          style="padding-top: 14px; padding-bottom: 14px; background-position: 0 14px"
        ><code>{{ current.request }}</code></pre>

        <div class="min-h-[220px] px-5 py-3.5">
          <div v-if="state.status === 'loading'" class="flex items-center gap-2 text-ink-soft">
            <Loader class="size-3.5 animate-spin" stroke-width="1.5" />
            <span class="caption">Calling the API…</span>
          </div>

          <p v-else-if="state.status === 'error'" class="caption">{{ state.message }}</p>

          <p v-else-if="!current.group" class="caption">
            Rendered client-side from vector tiles. Nothing to fetch.
          </p>

          <div v-else-if="places.length" class="flex flex-col gap-1.5">
            <PlaceCard v-for="place in places" :key="place.id" :place="place" />
          </div>

          <pre
            v-else-if="state.status === 'ok'"
            class="overflow-x-auto font-mono text-[12px] leading-[22px] text-ink-soft"
          ><code>{{ body }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>
