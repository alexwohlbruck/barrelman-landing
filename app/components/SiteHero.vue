<script setup lang="ts">
/**
 * Hero. Parchment leads with a 3D globe; this leads with a request and its
 * response, because the audience is someone deciding whether to spend an
 * afternoon integrating.
 */
import { ArrowRight, Terminal } from 'lucide-vue-next'

const { public: config } = useRuntimeConfig()

const fadeUp = (delay: number) =>
  ({
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
  }) as const
</script>

<template>
  <section id="top" class="relative overflow-hidden pb-24 pt-36 sm:pb-32 sm:pt-44">
    <!-- Background: graticule under a warm bloom -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="graticule absolute inset-0 opacity-60" />
      <div class="lantern-glow absolute inset-0" />
    </div>

    <div class="mx-auto max-w-5xl px-6">
      <div v-motion v-bind="fadeUp(0)" class="flex justify-center">
        <a
          :href="config.githubUrl"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur transition-colors hover:border-border-strong hover:text-foreground"
        >
          <span class="size-1.5 rounded-full bg-signal" />
          Open source · self-host the whole thing
        </a>
      </div>

      <h1
        v-motion
        v-bind="fadeUp(0.08)"
        class="mx-auto mt-6 max-w-3xl text-center text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-6xl"
      >
        The open geospatial API
        <span class="block text-muted-foreground">without the map-tax.</span>
      </h1>

      <p
        v-motion
        v-bind="fadeUp(0.16)"
        class="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground"
      >
        Search, geocoding, vector tiles, routing and live transit — built on
        OpenStreetMap, served from one API. Priced in credits, so a tile costs
        what a tile costs.
      </p>

      <div v-motion v-bind="fadeUp(0.24)" class="mt-9 flex flex-wrap items-center justify-center gap-3">
        <a
          :href="config.consoleUrl"
          class="group inline-flex items-center gap-2 rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Start free — 100,000 credits
          <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <a
          :href="config.docsUrl"
          class="inline-flex items-center gap-2 rounded-md border border-border-strong px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
        >
          <Terminal class="size-4" />
          Read the docs
        </a>
      </div>

      <p v-motion v-bind="fadeUp(0.3)" class="mt-4 text-center text-xs text-muted-foreground">
        No card required. The free tier stops at its limit — it never bills you for overage.
      </p>

      <!-- Request / response -->
      <div v-motion v-bind="fadeUp(0.38)" class="mx-auto mt-16 max-w-3xl">
        <CodeWindow />
      </div>
    </div>
  </section>
</template>
