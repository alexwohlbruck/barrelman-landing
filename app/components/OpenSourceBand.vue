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
    body: 'Docker Compose, a PBF extract and one command. The hosted API is the same code, saving you the import.',
  },
  {
    icon: Boxes,
    title: 'No proprietary lock',
    body: 'OpenStreetMap data and OSM IDs throughout. Nothing you build here is stranded if you leave.',
  },
  {
    icon: Github,
    title: 'Read the meter',
    body: 'The billing, throttling and credit accounting are all in the open repository. Audit what you are charged.',
  },
]
</script>

<template>
  <section class="relative border-t border-rule-strong bg-paper-deep/70 py-24">
    <div class="hatch pointer-events-none absolute inset-0 opacity-70" />

    <div class="relative mx-auto max-w-5xl px-6">
      <div class="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <SectionHead label="Open source" title="The door is unlocked." measure="max-w-md">
            Barrelman is the engine behind Parchment, and it is open source. Use
            the hosted API because running a planet-scale PostGIS import is a
            weekend you would rather spend elsewhere — not because you have no
            choice.
          </SectionHead>
          <a
            :href="config.githubUrl"
            target="_blank"
            rel="noopener"
            class="group mt-7 inline-flex items-center gap-2 border-b border-rubric/40 pb-0.5 text-sm font-medium text-rubric transition-colors hover:border-rubric"
          >
            Browse the source
            <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
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
                <p class="mt-1 text-sm leading-relaxed text-ink-soft">{{ point.body }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
