<script setup lang="ts">
/**
 * The provenance of the chart: where the data actually comes from.
 *
 * Every endpoint above is only as good as the map underneath it, and that map
 * is OpenStreetMap — surveyed by hand, given freely, owned by no one. This band
 * names the source and says why it is the reason the rest of the page can make
 * the promises it does: global reach, current data, and no basemap to rent.
 *
 * The three figures are set as soundings — the mariner's depth marks — in the
 * same mono/rubric vocabulary the capability legend uses, so they read as
 * measurements taken off the chart rather than marketing numerals.
 */
import { ArrowUpRight, Globe, Scale, Users } from 'lucide-vue-next'

const soundings = [
  {
    icon: Users,
    figure: '10M+',
    label: 'Mapmakers',
    body: 'A worldwide community keeps it current: survey agencies, cyclists, and locals adding the street they live on.',
  },
  {
    icon: Globe,
    figure: 'Global',
    label: 'Coverage',
    body: 'Every country, down to footpaths, building entrances and platform edges. No regions to license around.',
  },
  {
    icon: Scale,
    figure: 'Open',
    label: 'License',
    body: 'Free and openly licensed under the ODbL. Your app is never renting the basemap by the view.',
  },
]
</script>

<template>
  <section class="band border-t border-rule-strong bg-paper-deep/70">
    <!-- Engraved hatching on a deeper paper stock, so the band reads as its own
         plate against the paper sections around it. -->
    <div class="hatch pointer-events-none absolute inset-0 z-0 opacity-70" />

    <div class="measure relative z-10">
      <SectionHead label="Built on OpenStreetMap" title="The whole world, mapped by hand">
        Barrelman is built on OpenStreetMap, the free, openly licensed map of the
        world maintained by a global community. It is why coverage reaches every
        country, why the data stays current, and why you never rent the basemap.
      </SectionHead>

      <!-- Soundings: three measurements taken off the chart. -->
      <dl class="depth mt-12 grid overflow-hidden rounded-lg border border-rule-strong bg-paper sm:grid-cols-3">
        <div
          v-for="sounding in soundings"
          :key="sounding.label"
          class="border-b border-rule p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:p-7 sm:last:border-r-0"
        >
          <dd class="font-mono text-[1.75rem] leading-none tabular-nums text-rubric">
            {{ sounding.figure }}
          </dd>
          <dt class="mt-3 flex items-center gap-2">
            <component :is="sounding.icon" class="size-3.5 shrink-0 text-ink-soft" stroke-width="1.5" />
            <span class="legend text-ink-soft">{{ sounding.label }}</span>
          </dt>
          <p class="mt-2.5 text-body leading-relaxed text-ink-soft">{{ sounding.body }}</p>
        </div>
      </dl>

      <!-- Attribution is a licence term, not decoration: OSM data must be
           credited. Carrying it here doubles as a mark of provenance. -->
      <div class="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p class="caption">
          Map data © OpenStreetMap contributors, under the Open Database License.
        </p>
        <a
          href="https://www.openstreetmap.org/about"
          target="_blank"
          rel="noopener"
          class="link group inline-flex items-center gap-1.5 text-sm font-medium text-rubric"
        >
          About OpenStreetMap
          <ArrowUpRight class="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" stroke-width="1.5" />
        </a>
      </div>
    </div>
  </section>
</template>
