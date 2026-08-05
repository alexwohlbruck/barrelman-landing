<script setup lang="ts">
/**
 * The endpoint groups.
 *
 * Drawn as a chart legend: one table on bare paper, no cards, no gaps.
 *
 * The per-group credit cost used to sit in a gutter here as a depth sounding.
 * It is gone — this section answers "what does it do", and the pricing table
 * two sections down answers "what does it cost". Splitting them also removes
 * the one place on the page that duplicated CREDIT_COSTS from barrelman's
 * src/billing/plans.ts and could silently drift out of date.
 *
 * Rows are shaded in alternation rather than ruled. With the sounding column
 * gone there is no gutter holding the eye to the left edge, and a stripe tracks
 * a long blurb back to its name better than a hairline between rows does.
 */
import { Bike, Clock, Layers, MapPin, Navigation, Search, Shapes, Waypoints } from 'lucide-vue-next'

const groups = [
  {
    icon: Search,
    name: 'Search',
    blurb:
      'Full-text, trigram, abbreviation and semantic layers over 20M+ named places. Fast enough for autocomplete.',
  },
  {
    icon: MapPin,
    name: 'Geocoding',
    blurb:
      'Forward and reverse, with the full admin hierarchy attached to every result.',
  },
  {
    icon: Layers,
    name: 'Vector tiles',
    blurb:
      'POIs, roads, buildings, water and boundaries as MVT, straight out of PostGIS. Style them yourself.',
  },
  {
    icon: Navigation,
    name: 'Routing',
    blurb: 'Turn-by-turn for car, bike and foot. Custom vehicle profiles and elevation included.',
  },
  {
    icon: Waypoints,
    name: 'Transit',
    blurb:
      'Multimodal trip planning over GTFS, with GTFS-RT positions and live departures.',
  },
  {
    icon: Clock,
    name: 'Isochrones',
    blurb:
      'Reachability polygons for any mode and duration. Where can you get in fifteen minutes?',
  },
  {
    icon: Shapes,
    name: 'Spatial',
    blurb: 'Point-in-polygon and children-of-an-area queries against real OSM geometry.',
  },
  {
    icon: Bike,
    name: 'Shared mobility',
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
      <SectionHead label="Capabilities" title="The map stack you were going to build">
          Barrelman provides the core mapping APIs behind modern geospatial applications. We created the infrastructure we wished already existed, so you don't have to.
      </SectionHead>

      <!--
        A legend, not a card grid.

        This was eight cells in a 4x2 table, which put it two sections away
        from the pricing table — also four ruled columns — and the page read
        as the same layout twice. A chart's legend is a single column: symbol,
        name, gloss, one row each. It suits the content better too, since the
        blurbs are sentences rather than labels and were wrapping to five lines
        in a 216px cell.

        Striping instead of rules: `odd:` on the row itself rather than a
        `:class` on the index, so the alternation follows the DOM and cannot
        fall out of step if the list is ever filtered or reordered.
      -->
      <dl class="depth mt-12 overflow-hidden rounded-lg border border-rule-strong bg-paper">
        <div
          v-for="group in groups"
          :key="group.name"
          class="grid items-baseline gap-x-4 px-5 py-4 odd:bg-paper-aged
            sm:grid-cols-[11rem_1fr] sm:gap-x-6 sm:py-3.5"
        >
          <dt class="flex items-baseline gap-2.5 font-medium tracking-tight text-ink">
            <component
              :is="group.icon"
              class="size-4 shrink-0 translate-y-0.5 text-ink-soft"
              stroke-width="1.5"
            />
            {{ group.name }}
          </dt>

          <dd class="mt-1.5 text-body leading-relaxed text-ink-soft sm:mt-0">
            {{ group.blurb }}
          </dd>
        </div>
      </dl>

    </div>
  </section>
</template>
