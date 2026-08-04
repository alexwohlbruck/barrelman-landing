<script setup lang="ts">
/**
 * The endpoint groups, which double as the billing groups — so this grid is
 * also the credit price list. Showing both together is the honest version:
 * "here is what it does" and "here is what it costs" are the same question for
 * a metered API.
 *
 * Drawn as a chart legend: one ruled table on bare paper, no cards, no gaps.
 * The credit price sits in each cell as a depth sounding, which is the same
 * idea a chart uses it for — a number telling you how deep you are going.
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
    blurb:
      'Full-text, trigram, abbreviation and semantic layers over 20M+ named places. Built for autocomplete.',
  },
  {
    icon: MapPin,
    name: 'Geocoding',
    credits: 5,
    blurb:
      'Forward and reverse. Coordinates to an address, or an address to a point, with the admin hierarchy attached.',
  },
  {
    icon: Layers,
    name: 'Vector tiles',
    credits: 1,
    blurb:
      'POIs, roads, buildings, water and boundaries as MVT, straight from PostGIS. Style them however you like.',
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
    blurb:
      'Multimodal trip planning across GTFS schedules, with GTFS-RT vehicle positions and live departures.',
  },
  {
    icon: Clock,
    name: 'Isochrones',
    credits: 40,
    blurb:
      'Reachability polygons for any mode and duration — where can you get in fifteen minutes?',
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
  <section id="capabilities" class="relative border-t border-rule py-24">
    <!-- z-0, not -z-10: see the note in SiteHero — a negative index hides this
         behind <body>'s background entirely. -->
    <div class="hatch pointer-events-none absolute inset-0 z-0 opacity-25" />

    <div class="relative z-10 mx-auto max-w-5xl px-6">
      <SectionHead label="Capabilities" title="Eight groups of endpoints. One key.">
        Each group has a credit price, so you are never paying tile rates for a
        routing solve — or routing rates for a tile.
      </SectionHead>

      <!-- One ruled table: hairline borders shared between cells, not eight cards. -->
      <div
        class="mt-12 grid border-l border-t border-rule-strong bg-paper sm:grid-cols-2 lg:grid-cols-4"
      >
        <article
          v-for="group in groups"
          :key="group.name"
          class="group relative border-b border-r border-rule-strong p-5 transition-colors hover:bg-paper-aged"
        >
          <div class="flex items-center justify-between gap-3">
            <component :is="group.icon" class="size-5 text-ink" stroke-width="1.5" />
            <!-- The sounding. `cr` was set in ink-faint, which is a rule
                 colour — 1.7:1 against paper, and effectively invisible. -->
            <span class="font-mono text-[11px] leading-none text-rubric">
              {{ group.credits }}<span class="ml-px text-ink-soft">cr</span>
            </span>
          </div>
          <h3 class="mt-4 font-medium tracking-tight text-ink">{{ group.name }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">{{ group.blurb }}</p>
        </article>
      </div>

      <p class="caption mt-4">
        Soundings in credits. One credit is one vector tile.
      </p>
    </div>
  </section>
</template>
