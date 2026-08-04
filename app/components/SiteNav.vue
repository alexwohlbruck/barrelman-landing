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
    :class="scrolled ? 'bg-paper/90 backdrop-blur-md' : 'bg-transparent'"
    aria-label="Primary"
  >
    <div class="mx-auto max-w-6xl px-4 sm:px-8">
      <div class="flex items-center justify-between gap-6 py-3">
        <a href="#top" class="flex items-center gap-2.5 text-ink">
          <BrandMark class="size-7" />
          <span class="display text-[1.35rem]">Barrelman</span>
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
          <a :href="config.consoleUrl" class="btn-ink px-4 py-2 text-[13px]">Get a key</a>
          <button
            class="-mr-1 p-1.5 text-ink-soft md:hidden"
            :aria-expanded="open"
            aria-label="Toggle navigation"
            @click="open = !open"
          >
            <X v-if="open" class="size-5" />
            <Menu v-else class="size-5" />
          </button>
        </div>
      </div>

      <!-- The double rule that closes the title band. -->
      <div
        class="transition-opacity duration-300"
        :class="scrolled ? 'opacity-100' : 'opacity-0'"
      >
        <div class="h-px bg-rule-strong" />
        <div class="mt-[3px] h-px bg-rule" />
      </div>

      <ul v-if="open" class="flex flex-col gap-1 bg-paper/95 pb-3 pt-2 md:hidden">
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
