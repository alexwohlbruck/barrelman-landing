<script setup lang="ts">
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
  <footer class="border-t border-border py-14">
    <div class="mx-auto max-w-5xl px-6">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="#top" class="flex items-center gap-2.5 font-semibold tracking-tight">
            <BrandMark class="size-7" />
            Barrelman
          </a>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            The sailor in the crow's nest, watching the horizon. Named for the
            job, built for the same one.
          </p>
        </div>

        <div v-for="column in columns" :key="column.title">
          <h3 class="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {{ column.title }}
          </h3>
          <ul class="mt-4 flex flex-col gap-2.5 text-sm">
            <li v-for="link in column.links" :key="link.label">
              <a
                :href="link.href"
                class="text-muted-foreground transition-colors hover:text-foreground"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center"
      >
        <p>&copy; {{ year }} Barrelman. Powers <a href="https://parchment.app" class="underline underline-offset-2 hover:text-foreground">Parchment</a>.</p>
        <p>
          Map data from
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener"
            class="underline underline-offset-2 hover:text-foreground"
          >
            OpenStreetMap contributors
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>
