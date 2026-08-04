<script setup lang="ts">
/**
 * Floating nav. Same glassy pill as Parchment's, but squared off and darker —
 * the shape is familiar, the material is not.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const { public: config } = useRuntimeConfig()

const links = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#pricing', label: 'Pricing' },
  { href: config.docsUrl, label: 'Docs', external: true },
  { href: config.githubUrl, label: 'GitHub', external: true },
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
    class="fixed inset-x-0 top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-5xl transition-all duration-300"
    :class="scrolled ? 'top-2' : 'top-4'"
    aria-label="Primary"
  >
    <div
      class="rounded-lg border px-4 py-2.5 transition-all duration-300"
      :class="
        scrolled
          ? 'border-border-strong bg-background/85 shadow-lg shadow-black/30 backdrop-blur-xl'
          : 'border-border bg-surface/50 backdrop-blur-md'
      "
    >
      <div class="flex items-center justify-between gap-4">
        <a href="#top" class="flex items-center gap-2.5 font-semibold tracking-tight">
          <BrandMark class="size-7" />
          <span>Barrelman</span>
        </a>

        <ul class="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <li v-for="link in links" :key="link.label">
            <a
              :href="link.href"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener' : undefined"
              class="transition-colors hover:text-foreground"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>

        <div class="flex items-center gap-2">
          <a
            :href="config.consoleUrl"
            class="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Sign in
          </a>
          <a
            :href="config.consoleUrl"
            class="rounded-md bg-signal px-3.5 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Get a key
          </a>
          <button
            class="rounded-md p-1.5 text-muted-foreground md:hidden"
            :aria-expanded="open"
            aria-label="Toggle navigation"
            @click="open = !open"
          >
            <X v-if="open" class="size-5" />
            <Menu v-else class="size-5" />
          </button>
        </div>
      </div>

      <ul v-if="open" class="mt-3 flex flex-col gap-1 border-t border-border pt-3 md:hidden">
        <li v-for="link in links" :key="link.label">
          <a
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener' : undefined"
            class="block rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            @click="open = false"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
