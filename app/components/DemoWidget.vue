<script setup lang="ts">
/**
 * The hero demo. Type in it, change the knobs, watch the request and the
 * response both update.
 *
 * Input goes through /api/demo/<group>, which fixes the endpoint and the
 * request shape server-side and validates every value it accepts. Nothing
 * here can widen that surface by editing the page, which is what keeps an
 * interactive demo from being a free API console.
 *
 * The curl sample is generated from the same state that drives the fetch, so
 * what you read is what was sent. Two sources would drift within a week.
 */
import { ref, computed, watch, onMounted } from 'vue'
import { Check, Copy, Loader, Search as SearchIcon } from 'lucide-vue-next'
import type { Place } from './PlaceCard.vue'

const PLACES = [
  { id: 'times-square', label: 'Times Square', lat: 40.758, lng: -73.9855 },
  { id: 'brooklyn-bridge', label: 'Brooklyn Bridge', lat: 40.7061, lng: -73.9969 },
  { id: 'central-park', label: 'Central Park', lat: 40.7812, lng: -73.9665 },
  { id: 'jfk-airport', label: 'JFK Airport', lat: 40.6413, lng: -73.7781 },
]
const MODES = ['foot', 'bike', 'car']
const MINUTES = [5, 10, 15, 20]

const tabs = [
  { id: 'search', label: 'Search', live: true },
  { id: 'geocode', label: 'Geocode', live: true },
  { id: 'spatial', label: 'Spatial', live: true },
  { id: 'isochrone', label: 'Isochrones', live: true },
  { id: 'tiles', label: 'Tiles', live: false },
]

const active = ref('search')
const query = ref('coffee')
const place = ref('times-square')
const mode = ref('foot')
const minutes = ref(10)

/**
 * Where the query is anchored. A dragged marker wins over the preset until the
 * visitor picks a different preset, which clears it.
 */
const dragged = ref<{ lat: number; lng: number } | null>(null)
const preset = computed(() => PLACES.find((p) => p.id === place.value) ?? PLACES[0]!)
const origin = computed(() => dragged.value ?? preset.value)

function onMarkerMove(lat: number, lng: number) {
  dragged.value = { lat: Math.round(lat * 1e4) / 1e4, lng: Math.round(lng * 1e4) / 1e4 }
}

type State =
  | { status: 'loading' }
  | { status: 'ok'; body: unknown }
  | { status: 'error'; message: string }

const state = ref<State>({ status: 'loading' })
const copied = ref(false)

/** The request as the user would write it. Generated from the live state. */
const request = computed(() => {
  const { lat, lng } = origin.value
  const auth = '  -H "Authorization: Bearer brm_live_..."'
  switch (active.value) {
    case 'search':
      return `curl "https://api.barrelman.dev/search" \\\n${auth} \\\n  -d '{"query":"${query.value || 'coffee'}","lat":${lat},"lng":${lng}}'`
    case 'geocode':
      return `curl "https://api.barrelman.dev/geocode/reverse\\\n?lat=${lat}&lng=${lng}" \\\n${auth}`
    case 'spatial':
      return `curl "https://api.barrelman.dev/contains\\\n?lat=${lat}&lng=${lng}" \\\n${auth}`
    case 'isochrone':
      return `curl "https://api.barrelman.dev/isochrone?lat=${lat}\\\n&lng=${lng}&mode=${mode.value}&minutes=${minutes.value}" \\\n${auth}`
    default:
      return `map.addSource("barrelman", {\n  type: "vector",\n  tiles: [\n    "https://api.barrelman.dev/tiles/pois/" +\n    "{z}/{x}/{y}?api_key=brm_live_..."\n  ]\n})`
  }
})

const caption = computed(() => {
  switch (active.value) {
    case 'search':
      return 'Ranked by text match and distance.'
    case 'geocode':
      return 'Every area containing the point, smallest first.'
    case 'spatial':
      return 'Point-in-polygon against real OSM geometry.'
    case 'isochrone':
      return 'Reachable area, as a GeoJSON polygon.'
    default:
      return 'Vector tiles straight out of PostGIS.'
  }
})

const places = computed<Place[]>(() => {
  const s = state.value
  if (s.status !== 'ok') return []
  if (active.value !== 'search' && active.value !== 'geocode') return []
  return (Array.isArray(s.body) ? s.body : []).slice(0, 4) as Place[]
})

/**
 * The isochrone response already carries a FeatureCollection under
 * `isochrones`, so it goes straight to MapLibre. Shape-checked rather than
 * assumed: a response change should mean "no overlay", not a throw inside the
 * map. An earlier version treated `isochrones` as an array of bands and drew
 * nothing, because it is an object.
 */
const overlay = computed<unknown>(() => {
  const s = state.value
  if (active.value !== 'isochrone' || s.status !== 'ok') return undefined
  const iso = (s.body as { isochrones?: { type?: string; features?: unknown[] } })?.isochrones
  return iso?.type === 'FeatureCollection' && iso.features?.length ? iso : undefined
})

/**
 * Left is what you send, right is what comes back.
 *
 * On the geographic tabs the map *is* the input, so it sits under the request
 * with a pin you drag. On the tiles tab the map is the output, so it moves to
 * the right and the request stays a code sample.
 */
const draggableMap = computed(() => active.value !== 'search' && active.value !== 'tiles')
const mapIsOutput = computed(() => active.value === 'tiles')

const body = computed(() => {
  const s = state.value
  if (s.status !== 'ok') return ''
  const text = JSON.stringify(s.body, null, 2)
  return text.length > 1200 ? `${text.slice(0, 1200)}\n…` : text
})

let seq = 0

async function load() {
  const tab = active.value
  if (tab === 'tiles') return
  const mine = ++seq
  state.value = { status: 'loading' }
  try {
    const params: Record<string, string> = { place: place.value }
    if (dragged.value) {
      params.lat = String(dragged.value.lat)
      params.lng = String(dragged.value.lng)
    }
    if (tab === 'search') params.q = query.value || 'coffee'
    if (tab === 'isochrone') {
      params.mode = mode.value
      params.minutes = String(minutes.value)
    }
    const data = await $fetch(`/api/demo/${tab}`, { params })
    // A slower earlier request must not overwrite a newer answer.
    if (mine === seq) state.value = { status: 'ok', body: data }
  } catch {
    if (mine === seq) {
      state.value = { status: 'error', message: 'Live response unavailable right now.' }
    }
  }
}

/** Typing should not fire a request per keystroke. */
let debounce: ReturnType<typeof setTimeout> | undefined
function loadSoon(delay = 350) {
  clearTimeout(debounce)
  debounce = setTimeout(load, delay)
}

onMounted(load)
watch(active, () => load())
watch(place, () => ((dragged.value = null), loadSoon(0)))
watch([mode, minutes, dragged], () => loadSoon(0))
watch(query, () => loadSoon())

async function copy() {
  try {
    await navigator.clipboard.writeText(request.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    // Clipboard is unavailable over plain HTTP; the text is selectable.
  }
}

const control =
  'rounded-md border border-rule-strong bg-paper px-2 py-1 text-fine text-ink transition-colors hover:border-ink-soft focus:outline-none focus-visible:outline-2 focus-visible:outline-rubric'
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
      <!-- Controls. What you change here is what goes over the wire. -->
      <div class="flex flex-wrap items-center gap-2 border-b border-rule px-4 py-2.5">
        <div v-if="active === 'search'" class="relative min-w-0 flex-1">
          <SearchIcon
            class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-faint"
            stroke-width="1.5"
          />
          <input
            v-model="query"
            type="text"
            maxlength="48"
            spellcheck="false"
            aria-label="Search query"
            placeholder="coffee"
            :class="control"
            class="w-full !pl-8"
          />
        </div>

        <template v-if="active === 'isochrone'">
          <select v-model="mode" aria-label="Travel mode" :class="control">
            <option v-for="m in MODES" :key="m" :value="m">{{ m }}</option>
          </select>
          <select v-model.number="minutes" aria-label="Minutes" :class="control">
            <option v-for="m in MINUTES" :key="m" :value="m">{{ m }} min</option>
          </select>
        </template>

        <select
          v-if="active !== 'tiles'"
          v-model="place"
          aria-label="Origin"
          :class="control"
          class="ml-auto"
        >
          <option v-for="p in PLACES" :key="p.id" :value="p.id">{{ p.label }}</option>
        </select>

        <span v-else class="caption">Rendered client-side. Nothing to fetch.</span>

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
        <div class="border-b border-rubric/30 md:border-b-0 md:border-r">
          <pre
            class="ruled overflow-x-auto px-5 font-mono text-[12px] leading-[22px] text-ink"
            style="padding-top: 14px; padding-bottom: 14px; background-position: 0 14px"
          ><code>{{ request }}</code></pre>

          <!-- The input map. Dragging the pin is what changes the request. -->
          <div v-if="draggableMap" class="border-t border-rule px-4 pb-3.5 pt-3">
            <DemoMap
              :lat="origin.lat"
              :lng="origin.lng"
              :overlay="overlay"
              draggable
              class="h-[150px]"
              @move="onMarkerMove"
            />
            <p class="caption mt-1.5">
              Drag the pin.
              <span class="font-mono">{{ origin.lat }}, {{ origin.lng }}</span>
            </p>
          </div>
        </div>

        <div class="min-h-[228px] px-5 py-3.5">
          <p class="caption mb-2">{{ caption }}</p>

          <DemoMap
            v-if="mapIsOutput"
            :lat="origin.lat"
            :lng="origin.lng"
            class="h-[196px]"
          />

          <div
            v-else-if="state.status === 'loading'"
            class="flex items-center gap-2 text-ink-soft"
          >
            <Loader class="size-3.5 animate-spin" stroke-width="1.5" />
            <span class="caption">Calling the API…</span>
          </div>

          <p v-else-if="state.status === 'error'" class="caption">{{ state.message }}</p>

          <div v-else-if="places.length" class="flex flex-col gap-1.5">
            <PlaceCard v-for="p in places" :key="p.id" :place="p" />
          </div>

          <p v-else-if="!body || body === '[]'" class="caption">No results for that one.</p>

          <pre
            v-else
            class="overflow-x-auto font-mono text-[12px] leading-[22px] text-ink-soft"
          ><code>{{ body }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>
