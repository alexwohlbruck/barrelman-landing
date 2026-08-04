<script setup lang="ts">
/**
 * Pricing.
 *
 * These figures mirror PLANS in barrelman's src/billing/plans.ts. They are
 * duplicated rather than fetched so the marketing site stays a static build
 * with no runtime dependency on the API — but that means a repricing has to be
 * copied here. `GET /account/plans` is the source of truth if the two ever
 * disagree.
 */
import { Check, Minus } from 'lucide-vue-next'

const { public: config } = useRuntimeConfig()

interface Tier {
  id: string
  name: string
  price: string
  cadence?: string
  blurb: string
  credits: string
  rate: string
  overage: string
  commercial: boolean
  cta: string
  href: string
  featured?: boolean
}

const tiers: Tier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    blurb: 'Evaluation, prototypes and local development.',
    credits: '100,000 credits',
    rate: '300 req/min',
    overage: 'Stops at the limit',
    commercial: false,
    cta: 'Get a key',
    href: config.consoleUrl,
  },
  {
    id: 'developer',
    name: 'Developer',
    price: '$19',
    cadence: '/mo',
    blurb: 'Production apps with moderate traffic.',
    credits: '1,000,000 credits',
    rate: '900 req/min',
    overage: '$0.03 / 1k after',
    commercial: true,
    cta: 'Start on Developer',
    href: config.consoleUrl,
    featured: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '$99',
    cadence: '/mo',
    blurb: 'Growing products that need headroom.',
    credits: '10,000,000 credits',
    rate: '1,800 req/min',
    overage: '$0.018 / 1k after',
    commercial: true,
    cta: 'Start on Business',
    href: config.consoleUrl,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '$299',
    cadence: '/mo',
    blurb: 'High volume, with priority capacity.',
    credits: '40,000,000 credits',
    rate: '6,000 req/min',
    overage: '$0.012 / 1k after',
    commercial: true,
    cta: 'Start on Scale',
    href: config.consoleUrl,
  },
]
</script>

<template>
  <section id="pricing" class="border-t border-border py-24">
    <div class="mx-auto max-w-5xl px-6">
      <p class="eyebrow">Pricing</p>
      <h2 class="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
        Pay for what the request actually costs.
      </h2>
      <p class="mt-4 max-w-2xl text-muted-foreground">
        Every plan draws on the same credit pool. A tile is one credit, an
        isochrone is forty, and you are never billed for overage you did not opt
        into.
      </p>

      <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="tier in tiers"
          :key="tier.id"
          class="relative flex flex-col rounded-xl border p-6 transition-colors"
          :class="
            tier.featured
              ? 'border-signal/50 bg-surface-raised shadow-lg shadow-black/20'
              : 'border-border bg-surface hover:border-border-strong'
          "
        >
          <span
            v-if="tier.featured"
            class="absolute -top-2.5 left-6 rounded-full bg-signal px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-background"
          >
            Most popular
          </span>

          <h3 class="font-medium">{{ tier.name }}</h3>
          <div class="mt-3 flex items-baseline gap-1">
            <span class="text-3xl font-semibold tracking-tight">{{ tier.price }}</span>
            <span v-if="tier.cadence" class="text-sm text-muted-foreground">{{ tier.cadence }}</span>
          </div>
          <p class="mt-3 min-h-10 text-sm text-muted-foreground">{{ tier.blurb }}</p>

          <ul class="mt-5 flex flex-col gap-2.5 text-sm">
            <li class="flex items-start gap-2">
              <Check class="mt-0.5 size-4 shrink-0 text-signal" />
              <span class="font-mono text-[13px]">{{ tier.credits }}</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="mt-0.5 size-4 shrink-0 text-signal" />
              <span class="font-mono text-[13px]">{{ tier.rate }}</span>
            </li>
            <li class="flex items-start gap-2 text-muted-foreground">
              <Check v-if="tier.commercial" class="mt-0.5 size-4 shrink-0 text-signal" />
              <Minus v-else class="mt-0.5 size-4 shrink-0 opacity-40" />
              <span>{{ tier.commercial ? 'Commercial use' : 'Non-commercial use' }}</span>
            </li>
            <li class="flex items-start gap-2 text-muted-foreground">
              <Check v-if="tier.commercial" class="mt-0.5 size-4 shrink-0 text-signal" />
              <Minus v-else class="mt-0.5 size-4 shrink-0 opacity-40" />
              <span>{{ tier.overage }}</span>
            </li>
          </ul>

          <a
            :href="tier.href"
            class="mt-6 rounded-md py-2 text-center text-sm font-medium transition-opacity hover:opacity-90"
            :class="
              tier.featured
                ? 'bg-signal text-background'
                : 'border border-border-strong text-foreground hover:bg-muted'
            "
          >
            {{ tier.cta }}
          </a>
        </article>
      </div>

      <!-- Enterprise -->
      <div
        class="mt-4 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center"
      >
        <div>
          <h3 class="font-medium">Enterprise</h3>
          <p class="mt-1 max-w-xl text-sm text-muted-foreground">
            Custom volume, an SLA, and a dedicated or self-hosted deployment —
            including running the whole stack on your own hardware, since it is
            all open source.
          </p>
        </div>
        <a
          href="mailto:sales@barrelman.dev?subject=Enterprise%20plan"
          class="shrink-0 rounded-md border border-border-strong px-5 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Talk to us
        </a>
      </div>

      <p class="mt-6 text-center text-xs text-muted-foreground">
        Prices in USD. Metered overage is reported per credit, so you are billed
        for what you used — not rounded up to a block.
      </p>
    </div>
  </section>
</template>
