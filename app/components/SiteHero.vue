<script setup lang="ts">
/**
 * Hero.
 *
 * Parchment leads with a rendered globe; this leads with a chart and a request
 * on it, because the audience is someone deciding whether to spend an
 * afternoon integrating. The rose sits behind the title rather than beside it —
 * on a real chart the rose is *under* the lettering, and letting the type
 * cross it is what makes the sheet feel drawn rather than assembled.
 */
import { usePreferredReducedMotion } from '@vueuse/core'
import { ArrowRight, BookOpen } from 'lucide-vue-next'

const { public: config } = useRuntimeConfig()

/**
 * v-motion animates inline styles from JS, so the reduced-motion media query
 * in the stylesheet cannot reach it — the variants have to be withheld here
 * instead. Passing no variants leaves the element in its natural state, which
 * is visible, so nothing is stranded at `opacity: 0`.
 */
const reducedMotion = usePreferredReducedMotion()

const fadeUp = (delay: number) =>
  reducedMotion.value === 'reduce'
    ? ({} as const)
    : ({
        initial: { opacity: 0, y: 18 },
        enter: { opacity: 1, y: 0, transition: { duration: 0.7, delay } },
      } as const)
</script>

<template>
  <!-- Extra top padding only: the fixed nav sits over this band, and nothing
       else on the page has to clear it. -->
  <section id="top" class="band overflow-hidden pt-32 sm:pt-36">
    <!--
      The chart under the type: graticule, rhumb network, and the rose.

      z-0 rather than -z-10: a negative z-index puts this behind <body>'s own
      background, which paints later in the block-background phase, and the
      whole network vanished. Explicit layers instead of relying on that order.
    -->
    <div class="pointer-events-none absolute inset-0 z-0">
      <div class="graticule absolute inset-0 opacity-70" />
      <!-- The viewBox is sliced to cover, so on a phone the network is
           magnified into a few heavy diagonals across the headline. Fading it
           back there keeps the texture without the interference. -->
      <RhumbLines class="absolute inset-0 h-full w-full opacity-45 sm:opacity-100" />
      <!--
        A wash to lift the type off the linework. Kept weak and pushed to the
        centre: at anything stronger it bleached the rhumb network out
        entirely, which is the one thing on the page that has to survive.
      -->
      <div
        class="absolute inset-0"
        style="
          background: radial-gradient(
            ellipse 58% 42% at 50% 32%,
            rgba(255, 249, 243, 0.88) 0%,
            rgba(255, 249, 243, 0.74) 34%,
            rgba(255, 249, 243, 0.38) 62%,
            transparent 88%
          );
        "
      />
    </div>

    <div class="measure relative z-10">
      <div v-motion v-bind="fadeUp(0)" class="flex justify-center">
        <a
          :href="config.githubUrl"
          target="_blank"
          rel="noopener"
          class="depth group inline-flex items-center gap-3 rounded-md border border-rule-strong bg-paper/75 py-1.5 pl-3 pr-3.5 backdrop-blur-sm transition-all duration-150 hover:border-ink-soft hover:bg-paper-aged"
        >
          <span class="size-[5px] shrink-0 rotate-45 bg-rubric" />
          <span
            class="legend whitespace-nowrap text-ink-soft transition-colors group-hover:text-ink"
          >
            Open source
          </span>
          <!-- The descriptor is dropped on a phone: at 390px the chip wrapped
               to two ragged lines and broke "OPEN SOURCE" across them. -->
          <span class="hidden h-3 w-px bg-rule-strong sm:block" />
          <span class="hidden text-caption text-ink-soft sm:block">
            Engine, meter and all
          </span>
        </a>
      </div>

      <h1
        v-motion
        v-bind="fadeUp(0.08)"
        class="display mx-auto mt-7 max-w-4xl text-balance text-center text-[clamp(2.2rem,5.2vw,3.9rem)] text-ink"
      >
        The whole map.<br />
        <!-- nowrap: on a phone this otherwise breaks at the hyphen, leaving a
             line ending "map-" and a line reading "tax." -->
        <span class="text-brand">One key.</span>
      </h1>

      <p
        v-motion
        v-bind="fadeUp(0.16)"
        class="mx-auto mt-7 max-w-2xl text-center text-lead leading-relaxed text-ink-soft"
      >
        Search, geocoding, vector tiles, routing and live transit, from one
        endpoint. Built on OpenStreetMap. Metered by what a request actually
        costs to serve.
      </p>

      <div
        v-motion
        v-bind="fadeUp(0.24)"
        class="mt-9 flex flex-wrap items-center justify-center gap-3"
      >
        <!-- Full width below sm: stacked at two different widths they read as
             a mis-set pair rather than as primary and secondary. -->
        <a :href="config.consoleUrl" class="btn-ink group max-sm:w-full">
          Start free
          <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" stroke-width="1.5" />
        </a>
        <a :href="config.docsUrl" class="btn-rule max-sm:w-full">
          <BookOpen class="size-4" stroke-width="1.5" />
          Read the docs
        </a>
      </div>

      <p
        v-motion
        v-bind="fadeUp(0.3)"
        class="caption mt-5 text-center"
      >
        100,000 credits a month. No card.
      </p>

      <!-- The log book -->
      <div v-motion v-bind="fadeUp(0.38)" class="mx-auto mt-14 max-w-3xl">
        <CodeWindow />
      </div>
    </div>
  </section>
</template>
