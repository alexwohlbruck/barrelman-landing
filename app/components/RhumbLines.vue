<script setup lang="ts">
/**
 * The rhumb-line network — the web of loxodromes radiating from wind roses
 * that covers every portolan chart, and the single feature that makes a
 * drawing read as a sea chart rather than a map.
 *
 * The colouring is the historical convention, not decoration: the eight
 * principal winds are inked, the eight half-winds green, the sixteen
 * quarter-winds red. Rendering all thirty-two the same weight would give a
 * starburst; the three-tier hierarchy is what makes it legible as a network.
 *
 * Generated from angles so the geometry stays exact, and rendered on the
 * server — this is static markup in the built page, not a runtime cost.
 */
import { computed } from 'vue'

/**
 * The viewBox aspect is deliberately close to the hero's own.
 *
 * `slice` scales to cover, so the zoom factor is the *larger* of the two axis
 * ratios — a wide 1200x700 artwork in a tall hero was magnified over 2x, and
 * the rose swelled to dominate the page at some widths while looking right at
 * others. Keeping the artwork tallish holds the scale near 1 across the range.
 */
const W = 1200
const H = 1000

/** Hubs, placed off the centre line so the web doesn't look symmetrical. */
const hubs = [
  // Kept high and right: low enough and the rose is sliced in half by the
  // opaque log book, which reads as a clipping bug rather than as layering.
  { x: 890, y: 320, r: 1800 },
  { x: 200, y: 170, r: 1500 },
  { x: 400, y: 870, r: 1500 },
]

/** Radius of the drawn rose at the principal hub. */
const ROSE = 104

interface Line {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
  cls: 'principal' | 'half' | 'quarter'
}

const lines = computed<Line[]>(() =>
  hubs.flatMap((hub, h) =>
    Array.from({ length: 32 }, (_, i) => {
      const deg = i * 11.25
      const rad = (deg * Math.PI) / 180
      // Every 90° is a principal wind, every 45° a half-wind, rest quarters.
      const cls = deg % 90 === 0 ? 'principal' : deg % 45 === 0 ? 'half' : 'quarter'
      return {
        key: `${h}-${i}`,
        x1: hub.x,
        y1: hub.y,
        x2: +(hub.x + hub.r * Math.sin(rad)).toFixed(1),
        y2: +(hub.y - hub.r * Math.cos(rad)).toFixed(1),
        cls,
      } as Line
    }),
  ),
)
</script>

<template>
  <svg
    :viewBox="`0 0 ${W} ${H}`"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g v-for="line in lines" :key="line.key">
      <line
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        :stroke="
          line.cls === 'principal'
            ? 'var(--ink)'
            : line.cls === 'half'
              ? 'var(--verdigris)'
              : 'var(--rubric)'
        "
        :stroke-width="line.cls === 'principal' ? 1 : 0.7"
        :opacity="line.cls === 'principal' ? 0.26 : line.cls === 'half' ? 0.2 : 0.15"
      />
    </g>

    <!-- Plain rings mark the secondary hubs; the principal one gets the rose,
         so a ring there would only double its outer limb. -->
    <circle
      v-for="(hub, i) in hubs.slice(1)"
      :key="`hub-${i}`"
      :cx="hub.x"
      :cy="hub.y"
      r="46"
      stroke="var(--ink)"
      stroke-width="0.8"
      opacity="0.24"
    />

    <!--
      The principal hub gets a drawn rose. Nested inside this SVG rather than
      positioned beside it in the page, because the whole point is that the
      lines spring *from* the rose — aligning two separately-positioned
      elements would have been guesswork that broke at every viewport width.
    -->
    <CompassRose
      :x="hubs[0]!.x - ROSE"
      :y="hubs[0]!.y - ROSE"
      :width="ROSE * 2"
      :height="ROSE * 2"
      class="text-ink"
      style="opacity: 0.3"
    />
  </svg>
</template>
