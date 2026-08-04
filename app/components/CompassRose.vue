<script setup lang="ts">
/**
 * A compass rose, constructed rather than drawn.
 *
 * Thirty-two points, a graduated limb and the fleur-de-lis north — the whole
 * thing is generated from angles, so it stays exact at any size and the ratios
 * can be tuned in one place. Hand-authoring 32 paths would have been the same
 * picture and unmaintainable.
 *
 * Every point is two triangles meeting at the axis: the anticlockwise half
 * inked, the clockwise half left as paper. That alternation is what makes a
 * rose read as three-dimensional on a flat sheet, and it is why the shape
 * survives being shrunk to 20px in a nav bar.
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Draw the limb: outer circles and the degree graduations. */
    graduated?: boolean
    /** Ink the northern point in rubric red, as a chartmaker would. */
    rubricNorth?: boolean
  }>(),
  { graduated: true, rubricNorth: true },
)

const C = 100

/** Polar to cartesian, with 0° at north and angles running clockwise. */
function at(deg: number, r: number): string {
  const rad = (deg * Math.PI) / 180
  return `${(C + r * Math.sin(rad)).toFixed(2)} ${(C - r * Math.cos(rad)).toFixed(2)}`
}

interface Point {
  deg: number
  dark: string
  light: string
}

/** One point of the rose: tip at `reach`, shoulders at `waist` either side. */
function point(deg: number, reach: number, waist: number, spread: number): Point {
  const tip = at(deg, reach)
  return {
    deg,
    dark: `M${C} ${C} L${at(deg - spread, waist)} L${tip} Z`,
    light: `M${C} ${C} L${tip} L${at(deg + spread, waist)} Z`,
  }
}

/* Three orders of point, each shorter and narrower than the last — the
   hierarchy is what stops 32 spikes from turning into a starburst. */
const cardinals = computed(() => [0, 90, 180, 270].map((d) => point(d, 82, 26, 45)))
const ordinals = computed(() => [45, 135, 225, 315].map((d) => point(d, 58, 18, 45)))
const halves = computed(() =>
  [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((d) => point(d, 46, 11, 22.5)),
)
const quarters = computed(() =>
  Array.from({ length: 16 }, (_, i) => 11.25 + i * 22.5).map((d) => point(d, 34, 6, 11.25)),
)

/** Graduations on the limb: every 5°, longer on each 30°. */
const ticks = computed(() =>
  Array.from({ length: 72 }, (_, i) => {
    const deg = i * 5
    const major = deg % 30 === 0
    return { deg, from: at(deg, major ? 86 : 89), to: at(deg, 93), major }
  }),
)
</script>

<template>
  <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <g v-if="props.graduated" stroke="currentColor">
      <circle cx="100" cy="100" r="95" stroke-width="0.8" opacity="0.65" />
      <circle cx="100" cy="100" r="93" stroke-width="0.5" opacity="0.4" />
      <circle cx="100" cy="100" r="86" stroke-width="0.5" opacity="0.4" />
      <circle cx="100" cy="100" r="60" stroke-width="0.4" opacity="0.25" />
      <path
        v-for="tick in ticks"
        :key="tick.deg"
        :d="`M${tick.from} L${tick.to}`"
        :stroke-width="tick.major ? 0.9 : 0.5"
        :opacity="tick.major ? 0.7 : 0.35"
      />
    </g>

    <!-- Smallest points first, so the cardinals sit on top of them. -->
    <g opacity="0.5">
      <template v-for="p in quarters" :key="`q${p.deg}`">
        <path :d="p.dark" fill="currentColor" opacity="0.55" />
        <path :d="p.light" fill="none" stroke="currentColor" stroke-width="0.4" />
      </template>
    </g>

    <g opacity="0.75">
      <template v-for="p in halves" :key="`h${p.deg}`">
        <path :d="p.dark" fill="currentColor" opacity="0.6" />
        <path :d="p.light" fill="none" stroke="currentColor" stroke-width="0.5" />
      </template>
    </g>

    <template v-for="p in ordinals" :key="`o${p.deg}`">
      <path :d="p.dark" fill="currentColor" opacity="0.8" />
      <path :d="p.light" fill="none" stroke="currentColor" stroke-width="0.7" />
    </template>

    <template v-for="p in cardinals" :key="`c${p.deg}`">
      <path
        :d="p.dark"
        :fill="props.rubricNorth && p.deg === 0 ? 'var(--rubric)' : 'currentColor'"
      />
      <path
        :d="p.light"
        fill="none"
        stroke="currentColor"
        stroke-width="0.9"
      />
    </template>

    <!-- North star above the limb, the way a rose is finished. -->
    <path
      v-if="props.graduated"
      d="M100 2 L103.4 11.4 L100 8.6 L96.6 11.4 Z"
      :fill="props.rubricNorth ? 'var(--rubric)' : 'currentColor'"
    />

    <circle cx="100" cy="100" r="3.4" fill="currentColor" />
    <circle cx="100" cy="100" r="6.5" stroke="currentColor" stroke-width="0.6" />
  </svg>
</template>
