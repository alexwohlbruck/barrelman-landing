<script setup lang="ts">
/**
 * The mark: an eight-point rose with a ring at its centre — the crow's nest
 * seen from above, sitting where the axis of the compass would be. The
 * barrelman is the man at the middle of the rose, which is the whole joke.
 *
 * Hand-authored rather than reusing <CompassRose>: that one's limb and
 * thirty-two points turn to mud below about 40px, and this has to survive
 * 20px in a nav bar. The two halves of each point are filled at different
 * opacities instead of fill-versus-stroke, because a hairline stroke
 * disappears entirely at that size.
 */
</script>

<template>
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <g fill="currentColor">
      <!-- Ordinal points, behind. -->
      <path d="M16 16 L16 13 L22.72 9.28 Z" opacity="0.75" />
      <path d="M16 16 L22.72 9.28 L19 16 Z" opacity="0.35" />
      <path d="M16 16 L19 16 L22.72 22.72 Z" opacity="0.75" />
      <path d="M16 16 L22.72 22.72 L16 19 Z" opacity="0.35" />
      <path d="M16 16 L16 19 L9.28 22.72 Z" opacity="0.75" />
      <path d="M16 16 L9.28 22.72 L13 16 Z" opacity="0.35" />
      <path d="M16 16 L13 16 L9.28 9.28 Z" opacity="0.75" />
      <path d="M16 16 L9.28 9.28 L16 13 Z" opacity="0.35" />

      <!-- Cardinals. North is rubricated, as it is on the chart. -->
      <path d="M16 16 L12.82 12.82 L16 1 Z" fill="var(--rubric, #b4472e)" />
      <path d="M16 16 L16 1 L19.18 12.82 Z" fill="var(--rubric, #b4472e)" opacity="0.45" />
      <path d="M16 16 L19.18 12.82 L31 16 Z" />
      <path d="M16 16 L31 16 L19.18 19.18 Z" opacity="0.45" />
      <path d="M16 16 L19.18 19.18 L16 31 Z" />
      <path d="M16 16 L16 31 L12.82 19.18 Z" opacity="0.45" />
      <path d="M16 16 L12.82 19.18 L1 16 Z" />
      <path d="M16 16 L1 16 L12.82 12.82 Z" opacity="0.45" />
    </g>

    <!-- The nest. Filled so the points don't read through it. -->
    <circle cx="16" cy="16" r="3.6" fill="var(--nest-fill, #fff9f3)" />
    <circle cx="16" cy="16" r="3.6" stroke="currentColor" stroke-width="1.1" />
  </svg>
</template>
