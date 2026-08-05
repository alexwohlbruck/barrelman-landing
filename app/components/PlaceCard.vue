<script setup lang="ts">
/**
 * A place, rendered the way the Parchment app renders one.
 *
 * Not a port. The app's PlaceCard is 295 lines wired into vue-i18n, a place
 * service, a theme store and two internal primitives, none of which exist
 * here. This is a reimplementation of its *shape* against the same scale
 * table (components/ui/item-row/scale.ts): circle icon, semibold title, and
 * detail lines a step down, on a lit card at the app's radius.
 *
 * It takes the API response verbatim, which is the point of showing it in the
 * demo. What you see is what /search returns.
 */
import { computed } from 'vue'
import { MapPin } from 'lucide-vue-next'

interface PlaceAddress {
  housenumber?: string | null
  street?: string | null
  city?: string | null
  state?: string | null
  postcode?: string | null
}

export interface Place {
  id: string
  name: string
  categories?: string[] | null
  address?: PlaceAddress | null
  hours?: string | null
  distance_m?: number | null
}

const props = defineProps<{ place: Place }>()

/**
 * `amenity/cafe` reads as a database row, not a label. The app resolves these
 * through i18n; here the tail of the pair is close enough and stays honest
 * about what the API returned.
 */
const placeType = computed(() => {
  const raw = props.place.categories?.[0]
  if (!raw) return null
  const leaf = raw.split('/').pop() ?? raw
  return leaf.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())
})

const street = computed(() => {
  const a = props.place.address
  if (!a?.street) return null
  return [a.housenumber, a.street].filter(Boolean).join(' ')
})

const distance = computed(() => {
  const m = props.place.distance_m
  if (m == null) return null
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`
})
</script>

<template>
  <article class="depth flex items-start gap-2.5 rounded-lg border border-rule bg-paper px-2.5 py-2">
    <span
      class="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand"
    >
      <MapPin class="size-4" stroke-width="1.5" />
    </span>

    <div class="min-w-0 flex-1">
      <h4 class="truncate text-sm font-semibold text-ink">{{ place.name }}</h4>

      <p class="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-ink-soft">
        <span v-if="placeType">{{ placeType }}</span>
        <span v-if="placeType && distance" class="text-ink-faint">&middot;</span>
        <span v-if="distance" class="tabular-nums">{{ distance }}</span>
      </p>

      <p v-if="street" class="mt-0.5 truncate text-xs text-ink-soft">{{ street }}</p>
    </div>
  </article>
</template>
