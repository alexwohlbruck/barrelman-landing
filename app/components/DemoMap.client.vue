<script setup lang="ts">
/**
 * A real map, drawn from Barrelman's own vector tiles.
 *
 * `.client` because MapLibre touches `window` at import time and would break
 * the SSR pass. That also keeps ~200KB out of the initial payload: the hero
 * renders and only pays for the map when someone opens the tab that needs it.
 *
 * The style is written here rather than fetched. A style endpoint would be one
 * more thing to keep in step, and the point of this map is to show the tiles,
 * not to be a finished basemap.
 */
import { ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
// MapLibre 6 ships named exports only; there is no default.
import { Map as MapLibreMap, Marker, NavigationControl, type GeoJSONSource } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const props = defineProps<{
  lat: number
  lng: number
  /** GeoJSON to draw over the tiles, e.g. an isochrone polygon. */
  overlay?: unknown
  /** Show a marker the visitor can drag to move the query point. */
  draggable?: boolean
}>()

const emit = defineEmits<{ move: [lat: number, lng: number] }>()

const { public: config } = useRuntimeConfig()

/**
 * Height comes from the class the caller passes, so the root sets none.
 *
 * Two ways that broke, both worth remembering. `h-full` on the root fought the
 * caller's `h-[150px]`, won the cascade, and resolved to 100% of an auto-height
 * parent, i.e. zero. Then explaining that in an HTML comment above the root
 * turned the template into a fragment, at which point Vue stopped applying
 * fallthrough attributes at all and the height vanished again. Hence the note
 * living here.
 */
const el = ref<HTMLDivElement | null>(null)
const map = shallowRef<MapLibreMap | null>(null)
const marker = shallowRef<Marker | null>(null)
const failed = ref(false)

/** Ink on paper, matching the sheet rather than a stock basemap. */
const PAPER = '#fff9f3'
const RULE = '#ded0ba'
const INK_SOFT = '#7b674f'
const BRAND = '#0093f2'
const RUBRIC = '#b4472e'

/**
 * Tiles authenticate with an ordinary API key. A map library cannot set an
 * Authorization header, so it goes in the URL, which means it is readable by
 * anyone viewing the page — hence a key scoped to `tiles` and nothing else.
 */
function tileUrl(source: string) {
  const key = config.tileKey
  return `${config.apiUrl}/tiles/${source}/{z}/{x}/{y}${key ? `?api_key=${key}` : ''}`
}

onMounted(() => {
  if (!el.value) return
  try {
    const m = new MapLibreMap({
      container: el.value,
      center: [props.lng, props.lat],
      zoom: 14,
      attributionControl: { compact: true },
      style: {
        version: 8,
        sources: {
          water: { type: 'vector', tiles: [tileUrl('parchment_water')], maxzoom: 14 },
          roads: { type: 'vector', tiles: [tileUrl('parchment_roads')], maxzoom: 14 },
          buildings: { type: 'vector', tiles: [tileUrl('parchment_buildings')], maxzoom: 14 },
        },
        layers: [
          { id: 'bg', type: 'background', paint: { 'background-color': PAPER } },
          {
            id: 'water',
            type: 'fill',
            source: 'water',
            'source-layer': 'parchment_water',
            paint: { 'fill-color': '#a9c6da' },
          },
          {
            id: 'buildings',
            type: 'fill',
            source: 'buildings',
            'source-layer': 'parchment_buildings',
            paint: { 'fill-color': '#cbb69a', 'fill-opacity': 0.9 },
          },
          {
            id: 'roads',
            type: 'line',
            source: 'roads',
            'source-layer': 'parchment_roads',
            // Weights tuned for a 150px map rather than a full-page one.
            paint: { 'line-color': INK_SOFT, 'line-width': 1.3, 'line-opacity': 0.9 },
          },
        ],
      },
    })

    m.addControl(new NavigationControl({ showCompass: false }), 'top-right')

    if (props.draggable) {
      const pin = new Marker({ color: '#b4472e', draggable: true })
        .setLngLat([props.lng, props.lat])
        .addTo(m)
      // `dragend` rather than `drag`: firing per frame would put a request on
      // the wire for every pixel of the drag.
      pin.on('dragend', () => {
        const { lat, lng } = pin.getLngLat()
        emit('move', lat, lng)
      })
      marker.value = pin
    }
    // A tile 404 or a throttled key should leave the panel legible, not blank.
    // Log the reason too: swallowing it turned "the map is blank" into a
    // guessing game, which cost more time than the bug did.
    m.on('error', (e: { error?: { message?: string } }) => {
      failed.value = true
      console.error('[DemoMap]', e?.error?.message ?? e?.error ?? e)
    })
    m.on('load', () => drawOverlay(m))
    map.value = m
    if (import.meta.dev) (window as unknown as { __demoMap?: unknown }).__demoMap = m
  } catch {
    failed.value = true
  }
})

function drawOverlay(m: MapLibreMap) {
  const data = props.overlay as GeoJSON.GeoJSON | undefined
  const existing = m.getSource('overlay') as GeoJSONSource | undefined

  if (!data) {
    if (existing) {
      for (const id of ['overlay-fill', 'overlay-line']) if (m.getLayer(id)) m.removeLayer(id)
      m.removeSource('overlay')
    }
    return
  }

  if (existing) {
    existing.setData(data)
    return
  }

  m.addSource('overlay', { type: 'geojson', data })
  m.addLayer({
    id: 'overlay-fill',
    type: 'fill',
    source: 'overlay',
    paint: { 'fill-color': BRAND, 'fill-opacity': 0.16 },
  })
  m.addLayer({
    id: 'overlay-line',
    type: 'line',
    source: 'overlay',
    paint: { 'line-color': RUBRIC, 'line-width': 1.4 },
  })
}

watch(
  () => props.overlay,
  () => {
    const m = map.value
    if (m?.isStyleLoaded()) drawOverlay(m)
  },
)

watch(
  () => [props.lat, props.lng],
  ([lat, lng]) => {
    // Driven from outside, e.g. the origin selector. Move the pin to match,
    // but do not emit: that would loop straight back into another fetch.
    marker.value?.setLngLat([lng!, lat!])
    map.value?.easeTo({ center: [lng!, lat!], duration: 600 })
  },
)

onBeforeUnmount(() => {
  marker.value?.remove()
  marker.value = null
  map.value?.remove()
  map.value = null
})
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-md border border-rule">
    <div ref="el" class="h-full w-full" />
    <p
      v-if="failed"
      class="caption absolute inset-x-0 bottom-0 bg-paper/90 px-3 py-1.5 text-center"
    >
      Tiles unavailable right now.
    </p>
  </div>
</template>

<style>
/* The default controls are a white plastic card on a paper sheet. */
.maplibregl-ctrl-group {
  background: var(--paper);
  border: 1px solid var(--rule-strong);
  box-shadow: none;
}
.maplibregl-ctrl-group button + button {
  border-top-color: var(--rule);
}
.maplibregl-ctrl-attrib {
  background: color-mix(in srgb, var(--paper) 85%, transparent);
  font-size: 10px;
}
</style>
