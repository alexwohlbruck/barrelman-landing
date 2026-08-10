<script setup lang="ts">
/**
 * The nav: a floating glass pill.
 *
 * This and parchment-landing's <UiNavbar> are the same component written
 * twice, and every class string in the template below is byte-identical to the
 * one over there. They differ in three things only: the mark, the labels, and
 * the hrefs. If you change a size or a colour here, change it there.
 *
 * The links used to be the middle child of a `justify-between` row, which does
 * not centre them — it centres the gap left over after the brand and the
 * actions, and those are different widths on the two sites. Measured, this bar
 * sat 24px left of its own axis. They are absolutely positioned at 50% now.
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
  // The sibling site. Barrelman is the API; Parchment is the map drawn from
  // it, and each site links to the other.
  { href: config.parchmentUrl, label: 'Parchment', external: true },
]

const open = ref(false)
</script>

<template>
  <nav
    class="nav-pill"
    :class="{ 'nav-pill-open': open }"
    aria-label="Primary"
  >
    <!--
      `gap-3` below sm. The brand and the actions are both `shrink-0` — a
      wordmark that truncates and a CTA that wraps are both worse than a tight
      bar — so nothing in this row can give, and a 24px minimum gap it cannot
      afford is the difference between fitting and overflowing. Measured at
      320px this row overflowed by 8px; parchment-landing's, whose CTA is a
      longer phrase, overflowed by 43 and pushed the menu button clean out of
      the pill.
    -->
    <div class="relative flex items-center justify-between gap-3 sm:gap-6">
      <!-- The mark holds at 1.375rem; it is the lockup's anchor and reads as
           the object it is, so it is sized by eye rather than chased to the
           cap band. The wordmark is what was oversized: at text-xl it ran
           1.43x the 14px links beside it and the lockup shouted over the rest
           of the bar. text-lg brings it to 1.29x — still plainly the brand,
           no longer the loudest thing in the pill. leading-none drops the
           28px of baked-in leading so the lockup's box is its ink. -->
      <a href="#top" class="flex shrink-0 items-center gap-2 text-ink">
        <BrandMark class="size-[1.375rem]" />
        <!-- Below 360 the mark carries the lockup alone, as it does on
             parchment-landing: at that width the wordmark is width the bar
             does not have, and the choice is between dropping it and pushing
             the menu button out of the pill. -->
        <span class="display text-lg leading-none max-[359px]:hidden">Barrelman</span>
      </a>

      <!--
        Absolutely centred, so the group sits on the pill's axis rather than
        wherever the brand and the actions happen to leave room. `md:flex`
        keeps it off the phone, where there is no axis to sit on.
      -->
      <ul
        class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-ink-soft md:flex"
      >
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
        <!-- Barrelman has a second action where Parchment has one; that is a
             difference in what the sites have to offer, not in how the bar is
             built. It costs the centring nothing now the links no longer
             depend on what is either side of them. -->
        <a
          :href="config.consoleUrl"
          class="hidden rounded-full px-3 py-1.5 text-ink-soft transition-colors hover:bg-ink/5
            hover:text-ink sm:block"
        >
          Sign in
        </a>
        <!-- .btn-ink carries the lit interaction model; only the radius is
             overridden, so it reads as a pill nested in a pill. -->
        <a :href="config.consoleUrl" class="btn-base btn-ink rounded-full px-4 py-1.5">Get a key</a>
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
