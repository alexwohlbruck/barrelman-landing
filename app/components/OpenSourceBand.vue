<script setup lang="ts">
/**
 * The differentiator against Mapbox and Google, and the reason someone would
 * pick this over the incumbents: the exit door is open. Kept as a plain band
 * rather than a feature grid so it reads as a statement, not a checklist.
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
  <section class="border-t border-border py-24">
    <div class="mx-auto max-w-5xl px-6">
      <div class="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p class="eyebrow">Open source</p>
          <h2 class="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            The door is unlocked.
          </h2>
          <p class="mt-4 text-muted-foreground">
            Barrelman is the engine behind Parchment, and it is open source. Use
            the hosted API because running a planet-scale PostGIS import is a
            weekend you would rather spend elsewhere — not because you have no
            choice.
          </p>
          <a
            :href="config.githubUrl"
            target="_blank"
            rel="noopener"
            class="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-signal"
          >
            Browse the source
            <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div class="flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-border">
          <div v-for="point in points" :key="point.title" class="bg-surface p-5">
            <div class="flex items-start gap-4">
              <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-signal-soft">
                <component :is="point.icon" class="size-4 text-signal" />
              </div>
              <div>
                <h3 class="font-medium">{{ point.title }}</h3>
                <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{{ point.body }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
