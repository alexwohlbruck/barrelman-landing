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
            class="flex items-center gap-2 text-paper"
            style="--nest-fill: #081628; --rubric: #e0714f"
          >
            <!-- Same cap-height ratio as the nav lockup, scaled for the
                 slightly larger wordmark here. -->
            <BrandMark class="size-6" />
            <span class="display text-[1.35rem]">Barrelman</span>
          </a>
          <p class="mt-4 max-w-xs text-body leading-relaxed text-fog">
              A crew member stationed in a ship's crow's nest, serving as a navigational aid by surveying the horizon.
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

      <!--
        No OSM credit on this line. The licence obligation is met twice over
        already — <OpenStreetMapBand> carries the full ODbL notice, and the demo
        map draws its own attribution control — so a third copy in the colophon
        was clutter, not compliance. If the band is ever removed, the credit has
        to come back here.
      -->
      <div class="mt-14 border-t border-paper/10 pt-6 text-caption text-fog">
        <p>&copy; {{ year }} Barrelman</p>
      </div>
    </div>
  </footer>
</template>
