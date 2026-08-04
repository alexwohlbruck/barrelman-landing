<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const { public: config } = useRuntimeConfig()
</script>

<template>
  <section class="relative overflow-hidden border-t border-border py-24">
    <div class="lantern-glow pointer-events-none absolute inset-0 -z-10 rotate-180" />

    <div class="mx-auto max-w-2xl px-6 text-center">
      <h2 class="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
        100,000 credits, no card.
      </h2>
      <p class="mt-4 text-muted-foreground">
        Enough to build the whole integration before you decide anything. The
        free tier stops when it runs out — it will not quietly bill you.
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          :href="config.consoleUrl"
          class="group inline-flex items-center gap-2 rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Create an API key
          <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <a
          :href="config.docsUrl"
          class="inline-flex items-center gap-2 rounded-md border border-border-strong px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
        >
          Read the docs
        </a>
      </div>
    </div>
  </section>
</template>
