<script setup lang="ts">
/**
 * The hero demo. Type in it, drag the pin, click a result.
 *
 * Everything goes through /api/demo/<group>, which fixes the endpoint and the
 * request shape server-side and validates every value it accepts. Nothing here
 * can widen that surface by editing the page, which is what keeps an
 * interactive demo from being a free API console.
 *
 * The curl sample is generated from the same state that drives the fetch, so
 * what you read is what was sent. Two sources would drift within a week.
 */
import { ref, computed, watch, onMounted } from 'vue'
import { ArrowLeft, Check, Copy, Loader, Search as SearchIcon } from 'lucide-vue-next'
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
  { id: 'search', label: 'Search' },
  { id: 'geocode', label: 'Geocode' },
  { id: 'spatial', label: 'Spatial' },
  { id: 'isochrone', label: 'Isochrones' },
  { id: 'tiles', label: 'Tiles' },
]

const active = ref('search')
const query = ref('coffee')
const place = ref('times-square')
const mode = ref('foot')
const minutes = ref(10)

/** Spatial reads in two directions: what contains the point, and what it holds. */
const direction = ref<'parents' | 'children'>('parents')
/** The area whose children are being listed, picked from the parents list. */
const parent = ref<Place | null>(null)
/** A place opened from a search result. */
const detail = ref<Place | null>(null)

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

/** Which endpoint the current view actually calls. */
const group = computed(() => {
  if (detail.value) return 'place'
  if (active.value === 'spatial') return direction.value
  return active.value
})

const request = computed(() => {
  const { lat, lng } = origin.value
  const auth = '  -H "Authorization: Bearer brm_live_..."'
  const base = 'https://api.barrelman.dev'
  switch (group.value) {
    case 'place':
      return `curl "${base}/place/${detail.value?.id}" \\\n${auth}`
    case 'search':
      return `curl "${base}/search" \\\n${auth} \\\n  -d '{"query":"${query.value || 'coffee'}","lat":${lat},"lng":${lng}}'`
    case 'geocode':
      return `curl "${base}/geocode/reverse\\\n?lat=${lat}&lng=${lng}" \\\n${auth}`
    case 'parents':
      return `curl "${base}/contains?lat=${lat}&lng=${lng}" \\\n${auth}`
    case 'children':
      return `curl "${base}/children?id=${parent.value?.id ?? '…'}" \\\n${auth}`
    case 'isochrone':
      return `curl "${base}/isochrone?lat=${lat}&lng=${lng}\\\n&mode=${mode.value}&durations=${minutes.value * 60}" \\\n${auth}`
    default:
      return `map.addSource("barrelman", {\n  type: "vector",\n  tiles: [\n    "${base}/tiles/parchment_roads/" +\n    "{z}/{x}/{y}?api_key=brm_live_..."\n  ]\n})`
  }
})

const caption = computed(() => {
  switch (group.value) {
    case 'place':
      return 'One place, by OSM id.'
    case 'search':
      return 'Ranked by text match and distance. Pick one to look it up.'
    case 'geocode':
      return 'Every area containing the point, smallest first.'
    case 'parents':
      return 'Areas containing the pin. Pick one to look inside it.'
    case 'children':
      return `Inside ${parent.value?.name ?? 'the area'}.`
    case 'isochrone':
      return 'Reachable area, drawn from the GeoJSON polygon.'
    default:
      return 'Vector tiles straight out of PostGIS.'
  }
})

/** Groups whose response is a list of places, rendered as cards. */
const CARD_GROUPS = new Set(['search', 'geocode', 'parents', 'children'])

const places = computed<Place[]>(() => {
  const s = state.value
  if (s.status !== 'ok' || !CARD_GROUPS.has(group.value)) return []
  return (Array.isArray(s.body) ? s.body : []).slice(0, 4) as Place[]
})

/** The opened place, once its own record comes back. */
const detailPlace = computed<Place | null>(() => {
  const s = state.value
  if (group.value !== 'place') return null
  return s.status === 'ok' ? ((s.body as Place) ?? detail.value) : detail.value
})

/**
 * The isochrone response already carries a FeatureCollection under
 * `isochrones`, so it goes straight to MapLibre. Shape-checked rather than
 * assumed: a response change should mean "no overlay", not a throw.
 */
const overlay = computed<unknown>(() => {
  const s = state.value
  if (active.value !== 'isochrone' || s.status !== 'ok') return undefined
  const iso = (s.body as { isochrones?: { type?: string; features?: unknown[] } })?.isochrones
  return iso?.type === 'FeatureCollection' && iso.features?.length ? iso : undefined
})

/**
 * Isochrones are a shape on a map, so the map takes the whole panel and the
 * request sits above it. Splitting the panel gave the polygon a third of the
 * width and raw JSON two thirds, which is backwards for the one endpoint whose
 * answer is a picture.
 */
const mapOnly = computed(() => active.value === 'isochrone')
const mapIsOutput = computed(() => active.value === 'tiles')
const pinnable = computed(() => !detail.value && ['geocode', 'spatial'].includes(active.value))

const body = computed(() => {
  const s = state.value
  if (s.status !== 'ok') return ''
  const text = JSON.stringify(s.body, null, 2)
  return text.length > 900 ? `${text.slice(0, 900)}\n…` : text
})

let seq = 0

async function load() {
  const g = group.value
  if (g === 'tiles') return
  if (g === 'children' && !parent.value) return
  const mine = ++seq
  state.value = { status: 'loading' }
  try {
    const params: Record<string, string> = { place: place.value }
    if (dragged.value) {
      params.lat = String(dragged.value.lat)
      params.lng = String(dragged.value.lng)
    }
    if (g === 'search') params.q = query.value || 'coffee'
    if (g === 'isochrone') {
      params.mode = mode.value
      params.minutes = String(minutes.value)
    }
    if (g === 'children') params.id = parent.value!.id
    if (g === 'place') params.id = detail.value!.id

    const data = await $fetch(`/api/demo/${g}`, { params })
    // A slower earlier request must not overwrite a newer answer.
    if (mine === seq) state.value = { status: 'ok', body: data }
  } catch {
    if (mine === seq) {
      state.value = { status: 'error', message: 'Live response unavailable right now.' }
    }
  }
}

let debounce: ReturnType<typeof setTimeout> | undefined
function loadSoon(delay = 350) {
  clearTimeout(debounce)
  debounce = setTimeout(load, delay)
}

function openTab(id: string) {
  // Leaving a tab drops what it had drilled into, so returning lands at the top
  // level rather than somewhere the visitor has forgotten navigating to.
  detail.value = null
  parent.value = null
  direction.value = 'parents'
  active.value = id
}

function onSelect(p: Place) {
  if (active.value === 'search') detail.value = p
  else if (active.value === 'spatial' && direction.value === 'parents') {
    parent.value = p
    direction.value = 'children'
  }
}

function back() {
  if (detail.value) detail.value = null
  else if (direction.value === 'children') {
    direction.value = 'parents'
    parent.value = null
  }
}

const canGoBack = computed(() => !!detail.value || direction.value === 'children')

onMounted(load)
watch([active, direction, detail, parent], () => load())
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
        @click="openTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="depth overflow-hidden rounded-lg border border-rule-strong bg-paper-aged">
      <!-- Controls. What you change here is what goes over the wire. -->
      <div class="flex h-[46px] items-center gap-2 overflow-x-auto border-b border-rule px-4">
        <button
          v-if="canGoBack"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-fine text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
          @click="back"
        >
          <ArrowLeft class="size-3.5" stroke-width="1.5" />
          Back
        </button>

        <div v-if="active === 'search' && !detail" class="relative min-w-0 flex-1">
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
          v-if="active !== 'tiles' && !detail"
          v-model="place"
          aria-label="Origin"
          :class="control"
          class="ml-auto"
        >
          <option v-for="p in PLACES" :key="p.id" :value="p.id">{{ p.label }}</option>
        </select>

        <button
          class="shrink-0 p-1 text-ink-soft transition-colors hover:text-ink"
          :class="active === 'tiles' || detail ? 'ml-auto' : ''"
          :aria-label="copied ? 'Copied' : 'Copy request'"
          @click="copy"
        >
          <Check v-if="copied" class="size-3.5 text-verdigris" stroke-width="1.5" />
          <Copy v-else class="size-3.5" stroke-width="1.5" />
        </button>
      </div>

      <!--
        One fixed height for every tab, with the panes scrolling inside it.
        `min-h` was not enough: each tab carries different content, so the panel
        still ranged from 500px to 726px and moving between tabs dragged the
        whole page up and down under the cursor.
      -->
      <div class="h-[360px] overflow-hidden">
        <!-- Isochrones: the answer is a shape, so the map gets the panel. -->
        <div v-if="mapOnly" class="flex h-full flex-col">
          <pre
            class="ruled overflow-x-auto border-b border-rule px-5 font-mono text-[12px] leading-[22px] text-ink"
            style="padding-top: 14px; padding-bottom: 14px; background-position: 0 14px"
          ><code>{{ request }}</code></pre>
          <div class="flex min-h-0 flex-1 flex-col p-3">
            <DemoMap
              :lat="origin.lat"
              :lng="origin.lng"
              :overlay="overlay"
              draggable
              class="min-h-0 flex-1"
              @move="onMarkerMove"
            />
            <p class="caption mt-1.5">
              {{ caption }} Drag the pin.
              <span class="font-mono">{{ origin.lat }}, {{ origin.lng }}</span>
            </p>
          </div>
        </div>

        <div v-else class="grid h-full md:grid-cols-2">
          <!-- Left: what you send. -->
          <div class="flex flex-col overflow-y-auto border-b border-rubric/30 md:border-b-0 md:border-r">
            <pre
              class="ruled overflow-x-auto px-5 font-mono text-[12px] leading-[22px] text-ink"
              style="padding-top: 14px; padding-bottom: 14px; background-position: 0 14px"
            ><code>{{ request }}</code></pre>

            <div v-if="pinnable" class="flex min-h-0 flex-1 flex-col border-t border-rule px-4 pb-3 pt-3">
              <DemoMap
                :lat="origin.lat"
                :lng="origin.lng"
                draggable
                class="min-h-[120px] flex-1"
                @move="onMarkerMove"
              />
              <p class="caption mt-1.5">
                Drag the pin.
                <span class="font-mono">{{ origin.lat }}, {{ origin.lng }}</span>
              </p>
            </div>
          </div>

          <!-- Right: what comes back. -->
          <div class="flex flex-col overflow-y-auto px-5 py-3.5">
            <p class="caption mb-2">{{ caption }}</p>

            <DemoMap v-if="mapIsOutput" :lat="origin.lat" :lng="origin.lng" class="h-[240px] shrink-0" />

            <div
              v-else-if="state.status === 'loading'"
              class="flex items-center gap-2 text-ink-soft"
            >
              <Loader class="size-3.5 animate-spin" stroke-width="1.5" />
              <span class="caption">Calling the API…</span>
            </div>

            <p v-else-if="state.status === 'error'" class="caption">{{ state.message }}</p>

            <!-- A single place, opened from a search result. -->
            <div v-else-if="detailPlace" class="flex flex-col gap-2">
              <PlaceCard :place="detailPlace" />
              <pre
                class="overflow-x-auto font-mono text-[12px] leading-[22px] text-ink-soft"
              ><code>{{ body }}</code></pre>
            </div>

            <div v-else-if="places.length" class="flex flex-col gap-1.5">
              <PlaceCard
                v-for="p in places"
                :key="p.id"
                :place="p"
                :clickable="active === 'search' || (active === 'spatial' && direction === 'parents')"
                @select="onSelect"
              />
            </div>

            <p v-else-if="!body || body === '[]'" class="caption">Nothing here.</p>

            <pre
              v-else
              class="overflow-x-auto font-mono text-[12px] leading-[22px] text-ink-soft"
            ><code>{{ body }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
