<script setup lang="ts">
/**
 * Continues the night band from <ClosingCta> — one dark region at the foot of
 * the sheet rather than two, so the page reads as chart-then-watch instead of
 * alternating stripes.
 */
const { public: config } = useRuntimeConfig()

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Capabilities', href: '#capabilities' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Console', href: config.consoleUrl },
      { label: 'Status', href: `${config.apiUrl}/health` },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'API reference', href: config.docsUrl },
      { label: 'GitHub', href: config.githubUrl },
      { label: 'Self-hosting', href: `${config.githubUrl}#quick-start-production` },
      { label: 'Changelog', href: `${config.githubUrl}/releases` },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Attribution', href: 'https://www.openstreetmap.org/copyright' },
    ],
  },
]

const year = new Date().getFullYear()
</script>

<template>
  <footer class="nightfall border-t border-paper/10 py-16">
    <div class="measure">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a
            href="#top"
            class="flex items-center gap-2.5 text-paper"
            style="--nest-fill: #081628; --rubric: #e0714f"
          >
            <BrandMark class="size-7" />
            <span class="display text-[1.35rem]">Barrelman</span>
          </a>
          <p class="mt-4 max-w-xs text-body leading-relaxed text-fog">
            Named for the lookout who sights land first. Open source, top to bottom.
          </p>
        </div>

        <div v-for="column in columns" :key="column.title">
          <h3 class="legend text-brass">
            {{ column.title }}
          </h3>
          <ul class="mt-4 flex flex-col gap-2.5 text-sm">
            <li v-for="link in column.links" :key="link.label">
              <a :href="link.href" class="text-fog transition-colors hover:text-paper">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-14 flex flex-col items-start justify-between gap-3 border-t border-paper/10 pt-6 text-caption text-fog sm:flex-row sm:items-center"
      >
        <p>&copy; {{ year }} Barrelman</p>
        <p>
          Map data from
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener"
            class="link hover:text-paper"
          >
            OpenStreetMap contributors
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>
