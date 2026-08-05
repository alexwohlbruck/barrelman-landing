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
import { Map as MapLibreMap, NavigationControl, type GeoJSONSource } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const props = defineProps<{
  lat: number
  lng: number
  /** GeoJSON to draw over the tiles, e.g. an isochrone polygon. */
  overlay?: unknown
}>()

const { public: config } = useRuntimeConfig()

const el = ref<HTMLDivElement | null>(null)
const map = shallowRef<MapLibreMap | null>(null)
const failed = ref(false)

/** Ink on paper, matching the sheet rather than a stock basemap. */
const PAPER = '#fff9f3'
const RULE = '#ded0ba'
const INK_SOFT = '#7b674f'
const BRAND = '#0093f2'
const RUBRIC = '#b4472e'

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
            paint: { 'fill-color': '#dbe7ef' },
          },
          {
            id: 'buildings',
            type: 'fill',
            source: 'buildings',
            'source-layer': 'parchment_buildings',
            paint: { 'fill-color': RULE, 'fill-opacity': 0.55 },
          },
          {
            id: 'roads',
            type: 'line',
            source: 'roads',
            'source-layer': 'parchment_roads',
            paint: { 'line-color': INK_SOFT, 'line-width': 0.7, 'line-opacity': 0.5 },
          },
        ],
      },
    })

    m.addControl(new NavigationControl({ showCompass: false }), 'top-right')
    // A tile 404 or a throttled key should leave the panel legible, not blank.
    m.on('error', () => (failed.value = true))
    m.on('load', () => drawOverlay(m))
    map.value = m
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
  ([lat, lng]) => map.value?.easeTo({ center: [lng!, lat!], duration: 600 }),
)

onBeforeUnmount(() => {
  map.value?.remove()
  map.value = null
})
</script>

<template>
  <div class="relative h-full min-h-[200px] w-full overflow-hidden rounded-md border border-rule">
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
