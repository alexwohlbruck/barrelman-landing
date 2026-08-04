<script setup lang="ts">
/**
 * The page turns to night here, and stays there through the footer.
 *
 * Parchment's --space is the ground: one dark region, at the end, where the
 * lookout actually works. It earns the name — everything above is the chart on
 * the table, this is the watch — and it gives the closing ask the only real
 * contrast on the page without introducing a colour the brand doesn't own.
 */
import { ArrowRight } from 'lucide-vue-next'

const { public: config } = useRuntimeConfig()
</script>

<template>
  <section class="nightfall relative overflow-hidden">
    <div class="starfield pointer-events-none absolute inset-0" />
    <!-- The horizon: the sea sits a shade darker than the sky above it. -->
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
      style="background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.35))"
    />
    <!-- Sunk further and faded: brass is far lighter than the navy, so at the
         opacity that reads as a watermark on paper it was throwing points
         straight through the headline and the buttons. -->
    <CompassRose
      :rubric-north="false"
      class="pointer-events-none absolute -bottom-56 left-1/2 w-[34rem] -translate-x-1/2 text-brass opacity-[0.08]"
    />

    <div class="relative mx-auto max-w-2xl px-6 py-28 text-center">
      <p class="legend text-brass">
        Land ho
      </p>
      <h2 class="display mt-5 text-[clamp(2rem,4.4vw,3.2rem)] text-paper">
        100,000 credits, no card.
      </h2>
      <p class="mt-5 text-lead leading-relaxed text-fog">
        Enough to build the whole integration before you decide anything. The
        free tier stops when it runs out — it will not quietly bill you.
      </p>
      <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
        <a :href="config.consoleUrl" class="btn-brass group">
          Create an API key
          <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" stroke-width="1.5" />
        </a>
        <a :href="config.docsUrl" class="btn-night">Read the docs</a>
      </div>
    </div>
  </section>
</template>
