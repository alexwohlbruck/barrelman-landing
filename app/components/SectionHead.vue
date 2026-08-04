<script setup lang="ts">
/**
 * The heading block every section opens with, kept in one place so the three
 * of them can't drift apart: engraved legend label, a ruled fleuron, the
 * title in Exposure, and the lede.
 */
defineProps<{
  /** The legend label above the title, e.g. "Capabilities". */
  label: string
  title: string
  /** Constrain the lede to a readable measure; sections set their own. */
  measure?: string
}>()
</script>

<template>
  <header :class="measure ?? 'max-w-2xl'">
    <p class="eyebrow">{{ label }}</p>
    <div class="fleuron mt-3 max-w-24">
      <span class="size-1.5 rotate-45 bg-rule-strong" />
    </div>
    <!-- text-balance: without it "Eight groups of endpoints. One key." breaks
         after "One" and orphans "key." on its own line. -->
    <h2 class="display mt-5 text-balance text-[clamp(1.9rem,3.6vw,2.9rem)] text-ink">
      {{ title }}
    </h2>
    <p v-if="$slots.default" class="mt-4 text-lead leading-relaxed text-ink-soft">
      <slot />
    </p>
  </header>
</template>
