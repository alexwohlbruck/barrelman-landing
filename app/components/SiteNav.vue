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

/** How long the sheet takes to collapse. Must match `duration-200` below. */
const CLOSE_MS = 200

/**
 * Whether the pill wears its panel shape — which is not the same question as
 * whether the menu is open.
 *
 * `.nav-pill` is `rounded-full`, and on a tall box that resolves to a stadium:
 * the corners clamp to half the height. `.nav-pill-open` squares it off to
 * 24px, and dropping that class the instant somebody taps close put the
 * stadium back *while the panel was still collapsing through it* — the same
 * bulge the radius transition used to cause, arriving from the opposite
 * direction.
 *
 * Opening, the two agree already: the square radius applies immediately and
 * the box grows from nothing, so there is no tall box wearing a round corner
 * at any point. Only the closing direction needs the shape held back, until
 * the height it was chosen for has gone.
 */
const expanded = ref(false)
let collapseTimer: ReturnType<typeof setTimeout> | undefined

watch(open, isOpen => {
  clearTimeout(collapseTimer)
  if (isOpen) {
    expanded.value = true
    return
  }
  collapseTimer = setTimeout(() => (expanded.value = false), CLOSE_MS)
})

onBeforeUnmount(() => clearTimeout(collapseTimer))
</script>

<template>
  <nav
    class="nav-pill"
    :class="{ 'nav-pill-open': expanded }"
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
          <!--
            Both icons are always mounted and cross-faded through a quarter
            turn, rather than swapped with `v-if`. A swap is instant by
            definition — there is no pair of states for CSS to interpolate
            between if one of them was never in the DOM.
          -->
          <span class="relative block size-5">
            <Menu
              class="absolute inset-0 size-5 transition-all duration-200 ease-out motion-reduce:transition-none"
              :class="open ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'"
              stroke-width="1.5"
            />
            <X
              class="absolute inset-0 size-5 transition-all duration-200 ease-out motion-reduce:transition-none"
              :class="open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'"
              stroke-width="1.5"
            />
          </span>
        </button>
      </div>
    </div>

    <!--
      The sheet.

      Height animates through `grid-template-rows: 0fr → 1fr`, which is the one
      way to animate to a height nobody has measured. `height: auto` is not
      interpolable, and animating to a large `max-height` instead makes the
      duration a lie: the panel reaches its real height early and then spends
      the rest of the time animating empty space, so menus of different lengths
      open at visibly different speeds. An `fr` track resolves against the
      content's own height every frame.

      Kept mounted rather than `v-if`, because a panel that is not in the DOM
      has no closed state to animate *from* — the same reason both icons above
      are mounted. `inert` takes it out of the tab order and off the
      accessibility tree while it is shut, which `v-if` used to do for free.

      Opening at 300ms on a strong decelerate, so almost all of the distance is
      covered early and the panel reads as arriving rather than travelling.
      Closing at 200ms and accelerating: a reader who has decided to dismiss
      something is done with it and should not have to watch it leave.
    -->
    <div
      class="grid transition-[grid-template-rows] motion-reduce:transition-none md:hidden"
      :class="
        open
          ? 'grid-rows-[1fr] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]'
          : 'grid-rows-[0fr] duration-200 ease-[cubic-bezier(0.4,0,1,1)]'
      "
      :inert="!open"
    >
      <div class="min-h-0 overflow-hidden">
        <ul class="mt-1 flex flex-col border-t border-rule pt-1">
          <!--
            Staggered, so the rows arrive as a list being dealt rather than as
            one block sliding. The delay only applies on the way in: on the way
            out they leave together, because a stagger in reverse reads as the
            panel struggling to close.
          -->
          <li
            v-for="(link, i) in links"
            :key="link.label"
            class="transition-all duration-300 ease-out motion-reduce:transition-none"
            :class="open ? 'translate-y-0 opacity-100' : '-translate-y-1.5 opacity-0'"
            :style="{ transitionDelay: open ? `${70 + i * 45}ms` : '0ms' }"
          >
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
      </div>
    </div>
  </nav>
</template>
