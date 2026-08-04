<script setup lang="ts">
/**
 * The nav is a ruled strip across the head of the sheet, not a floating pill.
 *
 * Parchment's is a glassy rounded capsule hovering over a photograph; a chart
 * has no such thing. This is the title band an engraver would rule across the
 * top before lettering it — hairline double rule beneath, and translucent
 * paper so the graticule shows faintly through as you scroll under it.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const { public: config } = useRuntimeConfig()

const links = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#pricing', label: 'Pricing' },
  { href: config.docsUrl, label: 'Docs', external: true },
  { href: config.githubUrl, label: 'Source', external: true },
]

const scrolled = ref(false)
const open = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <nav
    class="fixed inset-x-4 top-4 z-40 transition-all duration-300"
    :class="
      /* `open` matters as much as `scrolled`: at the top of the page the bar is
         deliberately transparent so the chart shows through it, and the expanded
         menu inherited that — the hero headline read straight through the links.
         An opaque bar while the menu is open is the fix; the 95% keeps a hint
         of paper texture rather than looking like a pasted-on panel. */
      scrolled || open ? 'bg-paper/95 backdrop-blur-md' : 'bg-transparent'
    "
    aria-label="Primary"
  >
    <!-- Same container as every section, so the wordmark sits on the same left
         edge as every heading below it. It was on a 6xl/px-8 grid while the
         page ran 5xl/px-6, and nothing in the header lined up with anything. -->
    <div class="measure">
      <div class="flex items-center justify-between gap-6 py-3">
        <a href="#top" class="flex items-center gap-2.5 text-ink">
          <BrandMark class="size-7" />
          <span class="display text-xl">Barrelman</span>
        </a>

        <ul class="hidden items-center gap-8 text-sm text-ink-soft md:flex">
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

        <div class="flex items-center gap-3">
          <a
            :href="config.consoleUrl"
            class="hidden text-sm text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Sign in
          </a>
          <a :href="config.consoleUrl" class="btn-ink px-4 py-2">Get a key</a>
          <button
            class="-mr-1 p-1.5 text-ink-soft transition-colors hover:text-ink md:hidden"
            :aria-expanded="open"
            aria-label="Toggle navigation"
            @click="open = !open"
          >
            <X v-if="open" class="size-5" stroke-width="1.5" />
            <Menu v-else class="size-5" stroke-width="1.5" />
          </button>
        </div>
      </div>

      <!-- The double rule that closes the title band. Drawn while the menu is
           open too, so the expanded panel has an edge to sit against. -->
      <div
        class="transition-opacity duration-300"
        :class="scrolled || open ? 'opacity-100' : 'opacity-0'"
      >
        <div class="h-px bg-rule-strong" />
        <div class="mt-[3px] h-px bg-rule" />
      </div>

      <ul v-if="open" class="flex flex-col gap-1 pb-3 pt-2 md:hidden">
        <li v-for="link in links" :key="link.label">
          <a
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener' : undefined"
            class="block py-2 text-sm text-ink-soft transition-colors hover:text-ink"
            @click="open = false"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
