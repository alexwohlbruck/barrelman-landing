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

const W = 1200
const H = 700

/** Hubs, placed off the centre line so the web doesn't look symmetrical. */
const hubs = [
  { x: 880, y: 300, r: 1500 },
  { x: 230, y: 120, r: 1100 },
  { x: 380, y: 640, r: 1100 },
]

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

    <!-- Small roses marking the hubs the lines spring from. -->
    <circle
      v-for="(hub, i) in hubs"
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
      :x="hubs[0].x - 132"
      :y="hubs[0].y - 132"
      width="264"
      height="264"
      class="text-ink"
      style="opacity: 0.3"
    />
  </svg>
</template>
