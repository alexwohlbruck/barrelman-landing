<script setup lang="ts">
/**
 * The frame every legal page shares: nav, a section head, the draft notice,
 * the body, and the footer.
 *
 * The draft notice stays until the texts have been through legal review. It
 * sits above the body so nobody reads a clause without first knowing that.
 */
const props = defineProps<{
  title: string
  /** ISO date of the last substantive change, shown as "Last updated". */
  updated: string
  /** One-line summary for the meta description. */
  description: string
}>()

useHead({
  title: `${props.title} · Barrelman`,
  meta: [{ name: 'description', content: props.description }],
})

const updatedLabel = new Date(`${props.updated}T00:00:00Z`).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
</script>

<template>
  <div>
    <SiteNav />
    <main>
      <div class="relative">
        <div class="neatline" aria-hidden="true" />
        <section class="band pt-32 sm:pt-36">
          <div class="measure">
            <SectionHead label="Legal" :title="title" />
            <p class="caption mt-4">
              Last updated <time :datetime="updated">{{ updatedLabel }}</time>
            </p>

            <aside
              class="mt-8 max-w-2xl rounded-md border border-rubric/40 bg-paper-aged px-4 py-3
                text-body leading-relaxed text-ink"
            >
              <p>
                <span class="font-medium text-rubric">Draft pending legal review.</span>
                This text has not yet been reviewed by a lawyer and may change before it takes
                effect. Questions go to
                <a href="mailto:support@barrelman.dev" class="underline underline-offset-2"
                  >support@barrelman.dev</a
                >.
              </p>
            </aside>

            <article class="legal-prose mt-4">
              <slot />
            </article>
          </div>
        </section>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
