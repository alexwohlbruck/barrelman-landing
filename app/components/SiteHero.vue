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

/**
 * The most recent shipped endpoint, for the announcement chip.
 *
 * Hand-maintained. Nothing generates release notes yet, so this is the one
 * place on the site that goes stale on its own: update it when something
 * ships, and delete the chip rather than leave a six-month-old "New" on it.
 */
const latest = {
  title: 'Reverse geocoding: every place at a coordinate',
  href: `${config.docsUrl}#tag/geocoding`,
}

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
      <!--
        The announcement chip.

        This said "Open source, self-host the whole thing", which is a claim
        the page makes twice more further down and told a returning visitor
        nothing. It now carries whatever shipped most recently. There are no
        release notes to drive it, so `latest` below is hand-maintained: edit
        it when something lands, and point `href` at the docs section for it.
      -->
      <div v-motion v-bind="fadeUp(0)" class="flex justify-center">
        <a
          :href="latest.href"
          class="depth group inline-flex max-w-full items-center gap-2.5 rounded-full border border-rule-strong bg-paper/75 py-1 pl-1 pr-3 backdrop-blur-sm transition-all duration-150 hover:border-ink-soft hover:bg-paper-aged"
        >
          <span class="legend rounded-full bg-rubric/10 px-2 py-1 text-rubric">New</span>
          <span class="truncate text-caption text-ink-soft transition-colors group-hover:text-ink">
            {{ latest.title }}
          </span>
          <ArrowRight
            class="size-3.5 shrink-0 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:text-ink-soft"
            stroke-width="1.5"
          />
        </a>
      </div>

      <h1
        v-motion
        v-bind="fadeUp(0.08)"
        class="display mx-auto mt-7 max-w-4xl text-balance text-center text-[clamp(2.2rem,5.2vw,3.9rem)] text-ink"
      >
        From a coordinate<br />
        <span class="text-brand">to a live timetable.</span>
      </h1>

      <p
        v-motion
        v-bind="fadeUp(0.16)"
        class="mx-auto mt-7 max-w-2xl text-center text-lead leading-relaxed text-ink-soft"
      >
        Isochrones, multimodal transit with live departures, shared-mobility
        availability and point-in-polygon queries against real OSM geometry.
        One key, open data, and the source to read.
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

      <!-- The log book -->
      <div v-motion v-bind="fadeUp(0.38)" class="mx-auto mt-14 max-w-3xl">
        <CodeWindow />
      </div>
    </div>
  </section>
</template>
