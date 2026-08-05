<script setup lang="ts">
/**
 * The nav, matching Parchment's: a floating glass pill.
 *
 * This was a ruled title band that started transparent and only gained a
 * background once you scrolled — which meant that at the top of the page, the
 * one place everyone sees first, the links sat directly on the rhumb network
 * with nothing behind them. It is now filled at all times, the way Parchment's
 * is, so there is no state in which it is unreadable.
 *
 * Two deliberate deviations from Parchment's version:
 *
 * - Paper rather than white glass. Parchment floats over a photographic map,
 *   so `bg-white/40` reads as glass there; over this sheet, which is already
 *   near-white, white-on-white would leave the pill invisible again. Tinted
 *   paper plus a rule gives it an edge.
 * - Capped at the content measure. Parchment's `lg:w-[60%]` has no content
 *   below it to relate to; here it would be narrower than the page at 1440
 *   and wider than it at 1920. `max-w-5xl` pins it to the same column
 *   everything else uses once the viewport is wide enough to matter.
 *
 * The pill is the one rounded thing on an otherwise squared sheet. That is the
 * point — it floats above the chart rather than being drawn on it.
 */
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const { public: config } = useRuntimeConfig()

const links = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#pricing', label: 'Pricing' },
  { href: config.docsUrl, label: 'Docs', external: true },
  { href: config.githubUrl, label: 'Source', external: true },
]

const open = ref(false)
</script>

<template>
  <nav
    class="nav-pill"
    :class="{ 'nav-pill-open': open }"
    aria-label="Primary"
  >
    <div class="flex items-center justify-between gap-6">
      <!-- The mark holds at 1.375rem; it is the lockup's anchor and reads as
           the object it is, so it is sized by eye rather than chased to the
           cap band. The wordmark is what was oversized: at text-xl it ran
           1.43x the 14px links beside it and the lockup shouted over the rest
           of the bar. text-lg brings it to 1.29x — still plainly the brand,
           no longer the loudest thing in the pill. leading-none drops the
           28px of baked-in leading so the lockup's box is its ink. -->
      <a href="#top" class="flex shrink-0 items-center gap-2 text-ink">
        <BrandMark class="size-[1.375rem]" />
        <span class="display text-lg leading-none">Barrelman</span>
      </a>

      <ul class="hidden items-center gap-7 text-ink-soft md:flex">
        <li v-for="link in links" :key="link.label">
          <a
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener' : undefined"
            class="transition-colors hover:text-ink"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>

      <div class="flex shrink-0 items-center gap-1">
        <a
          :href="config.consoleUrl"
          class="hidden rounded-full px-3 py-1.5 text-ink-soft transition-colors hover:bg-ink/5
            hover:text-ink sm:block"
        >
          Sign in
        </a>
        <!-- .btn-ink carries the lit interaction model; only the radius is
             overridden, so it reads as a pill nested in a pill. -->
        <a :href="config.consoleUrl" class="btn-ink rounded-full px-4 py-1.5">Get a key</a>
        <button
          class="ml-1 rounded-full p-1.5 text-ink-soft transition-colors hover:bg-ink/5
            hover:text-ink md:hidden"
          :aria-expanded="open"
          aria-label="Toggle navigation"
          @click="open = !open"
        >
          <X v-if="open" class="size-5" stroke-width="1.5" />
          <Menu v-else class="size-5" stroke-width="1.5" />
        </button>
      </div>
    </div>

    <ul v-if="open" class="mt-1 flex flex-col border-t border-rule pt-1 md:hidden">
      <li v-for="link in links" :key="link.label">
        <a
          :href="link.href"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener' : undefined"
          class="block rounded-lg px-2 py-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          @click="open = false"
        >
          {{ link.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>
