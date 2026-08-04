<script setup lang="ts">
/**
 * The differentiator against Mapbox and Google, and the reason someone would
 * pick this over the incumbents: the exit door is open.
 *
 * Set in a cartouche — the ornamented box an engraver put the map's title and
 * terms in. Fitting, since that is exactly what this band is: the terms on
 * which you are being sold the chart.
 */
import { ArrowRight, Boxes, Github, Server } from 'lucide-vue-next'

const { public: config } = useRuntimeConfig()

const points = [
  {
    icon: Server,
    title: 'Run it yourself',
    body: 'Docker Compose, a PBF extract, one command. The hosted API runs the same code.',
  },
  {
    icon: Boxes,
    title: 'No proprietary lock',
    body: 'OSM IDs, GTFS, GBFS, MVT and GeoJSON throughout. Nothing you build here is stranded.',
  },
  {
    icon: Github,
    title: 'Read the meter',
    body: 'Billing, throttling and credit accounting are all in the repository. Audit what you are charged.',
  },
]
</script>

<template>
  <section class="band border-t border-rule-strong bg-paper-deep/70">
    <div class="hatch pointer-events-none absolute inset-0 opacity-70" />

    <div class="measure relative">
      <div class="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <SectionHead label="Open source" title="Read it. Run it. Leave whenever." measure="max-w-md">
            Every line of the engine is public, billing and throttling included. Run
            it on your own hardware with a PBF extract and one command, or use the
            hosted API and skip the import.
          </SectionHead>
          <a
            :href="config.githubUrl"
            target="_blank"
            rel="noopener"
            class="link group mt-7 inline-flex items-center gap-2 text-sm font-medium text-rubric"
          >
            Read the source
            <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" stroke-width="1.5" />
          </a>
        </div>

        <div class="cartouche p-6 sm:p-8">
          <ul class="relative flex flex-col">
            <li
              v-for="(point, i) in points"
              :key="point.title"
              class="flex items-start gap-4 py-4"
              :class="i > 0 ? 'border-t border-rule' : ''"
            >
              <component :is="point.icon" class="mt-0.5 size-5 shrink-0 text-ink" stroke-width="1.5" />
              <div>
                <h3 class="font-medium tracking-tight text-ink">{{ point.title }}</h3>
                <p class="mt-1 text-body leading-relaxed text-ink-soft">{{ point.body }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
