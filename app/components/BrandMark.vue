<script setup lang="ts">
/**
 * The mark: a crow's nest seen head on — a ring on a mast, with the lantern lit.
 * Deliberately simple line-work so it survives being rendered at 20px in a nav
 * bar, and so replacing it with a real logo later is a one-file change.
 */
</script>

<template>
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <!-- Mast -->
    <path d="M16 13v16" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.55" />
    <!-- Basket -->
    <path
      d="M7 13h18l-2.2 8.2a2 2 0 0 1-1.93 1.48H11.13a2 2 0 0 1-1.93-1.48L7 13Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <!-- Horizon line through the basket -->
    <path d="M8.6 17.4h14.8" stroke="currentColor" stroke-width="1.5" opacity="0.45" />
    <!-- The lantern -->
    <circle cx="16" cy="7" r="3.4" fill="var(--signal)" />
    <circle cx="16" cy="7" r="6.4" stroke="var(--signal)" stroke-width="1.2" opacity="0.32" />
  </svg>
</template>
