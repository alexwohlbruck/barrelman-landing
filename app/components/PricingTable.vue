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
    blurb: 'Evaluation, prototypes, local development.',
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
    blurb: 'Production traffic, sensibly priced.',
    credits: '1,000,000 credits',
    rate: '900 req/min',
    overage: '$0.03 / 1k after',
    commercial: true,
    cta: 'Choose Developer',
    href: config.consoleUrl,
    featured: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '$99',
    cadence: '/mo',
    blurb: 'Room to grow without a call.',
    credits: '10,000,000 credits',
    rate: '1,800 req/min',
    overage: '$0.018 / 1k after',
    commercial: true,
    cta: 'Choose Business',
    href: config.consoleUrl,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '$299',
    cadence: '/mo',
    blurb: 'High volume, priority capacity.',
    credits: '40,000,000 credits',
    rate: '6,000 req/min',
    overage: '$0.012 / 1k after',
    commercial: true,
    cta: 'Choose Scale',
    href: config.consoleUrl,
  },
]
</script>

<template>
  <section id="pricing" class="band border-t border-rule">
    <!-- A rose watermark, as a chart carries in an empty quarter of the sea. -->
    <CompassRose
      class="pointer-events-none absolute -left-32 bottom-12 hidden w-[26rem] text-ink opacity-[0.07] xl:block"
    />

    <div class="measure relative">
      <SectionHead label="Rates" title="One balance, every endpoint.">
        Everything draws on the same balance, so you are not buying a separate
        plan for each thing you do. Heavier endpoints simply draw more of it.
      </SectionHead>

      <div class="depth mt-14 grid overflow-hidden rounded-lg border border-rule-strong md:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="tier in tiers"
          :key="tier.id"
          class="relative flex flex-col border-b border-r border-rule-strong p-6"
          :class="tier.featured ? 'bg-paper-aged' : 'bg-paper'"
        >
          <!-- Rubricated: the one entry the chartmaker inked in red.
               Bled a pixel past each side so it covers the column rules and
               reads as the top edge of the column, not a bar floating inside
               it — `inset-x-0` stops at the padding box and left a gap. -->
          <div v-if="tier.featured" class="absolute -left-px -right-px top-0 h-[3px] bg-rubric" />
          <span
            v-if="tier.featured"
            class="legend absolute right-4 top-3.5 text-rubric"
          >
            Most popular
          </span>

          <h3 class="font-medium tracking-tight text-ink">{{ tier.name }}</h3>
          <div class="mt-3 flex items-baseline gap-1">
            <span class="display text-4xl text-ink">{{ tier.price }}</span>
            <span v-if="tier.cadence" class="text-sm text-ink-soft">{{ tier.cadence }}</span>
          </div>
          <p class="mt-3 text-body leading-relaxed text-ink-soft">{{ tier.blurb }}</p>

          <ul class="mb-6 mt-5 flex flex-col gap-2.5 text-body">
            <li class="flex items-start gap-2">
              <Check class="mt-0.5 size-4 shrink-0 text-verdigris" stroke-width="1.5" />
              <span class="font-mono text-fine text-ink">{{ tier.credits }}</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="mt-0.5 size-4 shrink-0 text-verdigris" stroke-width="1.5" />
              <span class="font-mono text-fine text-ink">{{ tier.rate }}</span>
            </li>
            <li class="flex items-start gap-2 text-ink-soft">
              <Check
                v-if="tier.commercial"
                class="mt-0.5 size-4 shrink-0 text-verdigris"
                stroke-width="1.5"
              />
              <Minus v-else class="mt-0.5 size-4 shrink-0 text-ink-soft opacity-60" stroke-width="1.5" />
              <span>{{ tier.commercial ? 'Commercial use' : 'Non-commercial use' }}</span>
            </li>
            <li class="flex items-start gap-2 text-ink-soft">
              <Check
                v-if="tier.commercial"
                class="mt-0.5 size-4 shrink-0 text-verdigris"
                stroke-width="1.5"
              />
              <Minus v-else class="mt-0.5 size-4 shrink-0 text-ink-soft opacity-60" stroke-width="1.5" />
              <span>{{ tier.overage }}</span>
            </li>
          </ul>

          <!-- mt-auto pins the CTA to the foot of the column, so the row of
               buttons stays level however many lines a blurb runs to. The
               previous `min-h-10` on the blurb only papered over the two-line
               case and would have broken on a third. -->
          <a
            :href="tier.href"
            class="mt-auto"
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
          <p class="mt-1.5 max-w-xl text-body leading-relaxed text-ink-soft">
            Custom volume, an SLA, and a dedicated or self-hosted deployment. Up to
            and including the whole stack on your own hardware.
          </p>
        </div>
        <a href="mailto:sales@barrelman.dev?subject=Enterprise%20plan" class="btn-rule shrink-0">
          Talk to us
        </a>
      </div>

      <!-- Left-aligned to match the section head and the capability grid's
           footnote; centred, it was the only stray axis on the page. -->
      <p class="caption mt-6">
        Prices in USD. Overage is metered per credit, never rounded up to a
        block.
      </p>
    </div>
  </section>
</template>
