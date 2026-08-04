<script setup lang="ts">
/**
 * Pricing, set as a table of rates rather than four floating cards — the
 * columns share their rules, so it reads as one printed schedule.
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
  <section id="pricing" class="relative border-t border-rule py-24">
    <!-- A rose watermark, as a chart carries in an empty quarter of the sea. -->
    <CompassRose
      class="pointer-events-none absolute -left-32 bottom-12 hidden w-[26rem] text-ink opacity-[0.07] xl:block"
    />

    <div class="relative mx-auto max-w-5xl px-6">
      <SectionHead label="Rates" title="Pay for what the request actually costs.">
        Every plan draws on the same credit pool. A tile is one credit, an
        isochrone is forty, and you are never billed for overage you did not opt
        into.
      </SectionHead>

      <div class="mt-14 grid border-l border-t border-rule-strong md:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="tier in tiers"
          :key="tier.id"
          class="relative flex flex-col border-b border-r border-rule-strong p-6"
          :class="tier.featured ? 'bg-paper-aged' : 'bg-paper'"
        >
          <!-- Rubricated: the one entry the chartmaker inked in red. -->
          <div v-if="tier.featured" class="absolute inset-x-0 top-0 h-[3px] bg-rubric" />
          <span
            v-if="tier.featured"
            class="absolute right-4 top-3 font-hand text-[13px] italic tracking-[0.14em] text-rubric uppercase"
          >
            Most taken
          </span>

          <h3 class="font-medium tracking-tight text-ink">{{ tier.name }}</h3>
          <div class="mt-3 flex items-baseline gap-1">
            <span class="display text-4xl text-ink">{{ tier.price }}</span>
            <span v-if="tier.cadence" class="text-sm text-ink-soft">{{ tier.cadence }}</span>
          </div>
          <p class="mt-3 min-h-10 text-sm leading-relaxed text-ink-soft">{{ tier.blurb }}</p>

          <ul class="mt-5 flex flex-col gap-2.5 text-sm">
            <li class="flex items-start gap-2">
              <Check class="mt-0.5 size-4 shrink-0 text-verdigris" stroke-width="2" />
              <span class="font-mono text-[12.5px] text-ink">{{ tier.credits }}</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="mt-0.5 size-4 shrink-0 text-verdigris" stroke-width="2" />
              <span class="font-mono text-[12.5px] text-ink">{{ tier.rate }}</span>
            </li>
            <li class="flex items-start gap-2 text-ink-soft">
              <Check
                v-if="tier.commercial"
                class="mt-0.5 size-4 shrink-0 text-verdigris"
                stroke-width="2"
              />
              <Minus v-else class="mt-0.5 size-4 shrink-0 text-ink-faint" />
              <span>{{ tier.commercial ? 'Commercial use' : 'Non-commercial use' }}</span>
            </li>
            <li class="flex items-start gap-2 text-ink-soft">
              <Check
                v-if="tier.commercial"
                class="mt-0.5 size-4 shrink-0 text-verdigris"
                stroke-width="2"
              />
              <Minus v-else class="mt-0.5 size-4 shrink-0 text-ink-faint" />
              <span>{{ tier.overage }}</span>
            </li>
          </ul>

          <a
            :href="tier.href"
            class="mt-6"
            :class="tier.featured ? 'btn-ink w-full' : 'btn-rule w-full'"
          >
            {{ tier.cta }}
          </a>
        </article>
      </div>

      <!-- Enterprise, set apart the way a chart's terms sit outside the neatline. -->
      <div
        class="cartouche mt-8 flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8"
      >
        <div>
          <h3 class="font-medium tracking-tight text-ink">Enterprise</h3>
          <p class="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-soft">
            Custom volume, an SLA, and a dedicated or self-hosted deployment —
            including running the whole stack on your own hardware, since it is
            all open source.
          </p>
        </div>
        <a href="mailto:sales@barrelman.dev?subject=Enterprise%20plan" class="btn-rule shrink-0">
          Talk to us
        </a>
      </div>

      <p class="mt-6 text-center font-hand text-[15px] italic text-ink-soft">
        Prices in USD. Metered overage is reported per credit, so you are billed
        for what you used — not rounded up to a block.
      </p>
    </div>
  </section>
</template>
