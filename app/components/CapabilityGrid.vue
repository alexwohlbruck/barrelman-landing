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
      'Full-text, trigram, abbreviation and semantic layers over 20M+ named places. Fast enough for autocomplete.',
  },
  {
    icon: MapPin,
    name: 'Geocoding',
    credits: 5,
    blurb:
      'Forward and reverse, with the full admin hierarchy attached to every result.',
  },
  {
    icon: Layers,
    name: 'Vector tiles',
    credits: 1,
    blurb:
      'POIs, roads, buildings, water and boundaries as MVT, straight out of PostGIS. Style them yourself.',
  },
  {
    icon: Navigation,
    name: 'Routing',
    credits: 12,
    blurb: 'Turn-by-turn for car, bike and foot. Custom vehicle profiles and elevation included.',
  },
  {
    icon: Waypoints,
    name: 'Transit',
    credits: 20,
    blurb:
      'Multimodal trip planning over GTFS, with GTFS-RT positions and live departures.',
  },
  {
    icon: Clock,
    name: 'Isochrones',
    credits: 40,
    blurb:
      'Reachability polygons for any mode and duration. Where can you get in fifteen minutes?',
  },
  {
    icon: Shapes,
    name: 'Spatial',
    credits: 3,
    blurb: 'Point-in-polygon and children-of-an-area queries against real OSM geometry.',
  },
  {
    icon: Bike,
    name: 'Shared mobility',
    credits: 20,
    blurb: 'GBFS systems, stations and live availability, folded into trip planning.',
  },
]
</script>

<template>
  <section id="capabilities" class="band border-t border-rule">
    <!-- z-0, not -z-10: see the note in SiteHero — a negative index hides this
         behind <body>'s background entirely. -->
    <div class="hatch pointer-events-none absolute inset-0 z-0 opacity-25" />

    <div class="measure relative z-10">
      <SectionHead label="Capabilities" title="Everything you would otherwise stitch together.">
        Eight groups behind one key. No separate vendor for tiles, another for
        routing and a third for transit, and no glue code holding them
        together.
      </SectionHead>

      <!--
        A legend, not a card grid.

        This was eight cells in a 4x2 table, which put it two sections away
        from the pricing table — also four ruled columns — and the page read
        as the same layout twice. A chart's legend is a single ruled column:
        symbol, name, gloss, one row each. It suits the content better too,
        since the blurbs are sentences rather than labels and were wrapping to
        five lines in a 216px cell.
      -->
      <dl class="depth mt-12 overflow-hidden rounded-lg border border-rule-strong bg-paper">
        <div
          v-for="group in groups"
          :key="group.name"
          class="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 border-b border-rule px-5 py-4 last:border-b-0
            sm:grid-cols-[3.5rem_11rem_1fr] sm:gap-x-6 sm:py-3.5"
        >
          <!-- The sounding, in the gutter where a chart puts its depths. -->
          <span class="font-mono text-micro tabular-nums text-rubric">
            {{ group.credits }}<span class="ml-px text-ink-soft">cr</span>
          </span>

          <dt class="flex items-baseline gap-2.5 font-medium tracking-tight text-ink">
            <component
              :is="group.icon"
              class="size-4 shrink-0 translate-y-0.5 text-ink-soft"
              stroke-width="1.5"
            />
            {{ group.name }}
          </dt>

          <dd class="col-span-2 mt-1.5 text-body leading-relaxed text-ink-soft sm:col-span-1 sm:mt-0">
            {{ group.blurb }}
          </dd>
        </div>
      </dl>

      <p class="caption mt-4">
        Prices in credits. One credit is one vector tile.
      </p>
    </div>
  </section>
</template>
