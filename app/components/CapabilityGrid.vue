<script setup lang="ts">
/**
 * The endpoint groups, which double as the billing groups — so this grid is
 * also the credit price list. Showing both together is the honest version:
 * "here is what it does" and "here is what it costs" are the same question for
 * a metered API.
 *
 * Costs mirror CREDIT_COSTS in barrelman's src/billing/plans.ts. They are
 * duplicated here rather than fetched so the page renders as a static site with
 * no API dependency; if they drift, the pricing table at /account/plans wins.
 */
import { Bike, Clock, Layers, MapPin, Navigation, Search, Shapes, Waypoints } from 'lucide-vue-next'

const groups = [
  {
    icon: Search,
    name: 'Search',
    credits: 6,
    blurb: 'Full-text, trigram, abbreviation and semantic layers over 20M+ named places. Built for autocomplete.',
  },
  {
    icon: MapPin,
    name: 'Geocoding',
    credits: 5,
    blurb: 'Forward and reverse. Coordinates to an address, or an address to a point, with the admin hierarchy attached.',
  },
  {
    icon: Layers,
    name: 'Vector tiles',
    credits: 1,
    blurb: 'POIs, roads, buildings, water and boundaries as MVT, straight from PostGIS. Style them however you like.',
  },
  {
    icon: Navigation,
    name: 'Routing',
    credits: 12,
    blurb: 'Turn-by-turn for car, bike and foot, with custom vehicle profiles and elevation.',
  },
  {
    icon: Waypoints,
    name: 'Transit',
    credits: 20,
    blurb: 'Multimodal trip planning across GTFS schedules, with GTFS-RT vehicle positions and live departures.',
  },
  {
    icon: Clock,
    name: 'Isochrones',
    credits: 40,
    blurb: 'Reachability polygons for any mode and duration — where can you get in fifteen minutes?',
  },
  {
    icon: Shapes,
    name: 'Spatial',
    credits: 3,
    blurb: 'Point-in-polygon containment and children-of-an-area queries against real OSM geometry.',
  },
  {
    icon: Bike,
    name: 'Shared mobility',
    credits: 20,
    blurb: 'GBFS bike and scooter systems, stations and live availability, folded into trip planning.',
  },
]
</script>

<template>
  <section id="capabilities" class="border-t border-border py-24">
    <div class="mx-auto max-w-5xl px-6">
      <p class="eyebrow">Capabilities</p>
      <h2 class="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
        Eight groups of endpoints. One key.
      </h2>
      <p class="mt-4 max-w-2xl text-muted-foreground">
        Each group has a credit price, so you are never paying tile rates for a
        routing solve — or routing rates for a tile.
      </p>

      <div class="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="group in groups"
          :key="group.name"
          class="group bg-surface p-5 transition-colors hover:bg-surface-raised"
        >
          <div class="flex items-center justify-between">
            <component :is="group.icon" class="size-5 text-signal" />
            <span class="font-mono text-xs text-muted-foreground">
              {{ group.credits }} cr
            </span>
          </div>
          <h3 class="mt-4 font-medium">{{ group.name }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">{{ group.blurb }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
