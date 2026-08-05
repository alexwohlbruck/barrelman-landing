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
 * server — the network is static markup in the built page.
 *
 * The one moving part is a slow sway of each rose as the cursor crosses the
 * page. It has to clear two thresholds at once: large enough to register at
 * all — the first pass ran at two degrees and was invisible, because the lines
 * are hairlines at 15-26% opacity and a two-degree turn moves them less than
 * their own stroke width near the hub — and small enough that it never pulls
 * the eye off the headline sitting on top of it. Six degrees, eased slowly, is
 * where a chart reads as being turned on a table rather than as a video.
 *
 * There is also a very slow idle drift, so the page is not perfectly still
 * before the cursor moves and does not look broken to someone arriving by
 * keyboard or on a touch screen, where `pointermove` may never fire.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

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

/**
 * Hubs, placed off the centre line so the web doesn't look symmetrical.
 *
 * `sway` is how many degrees each rose turns at the extremes of the viewport.
 * They differ, and one runs backwards, so the three networks slide across each
 * other instead of turning as a single rigid sheet — the same reason the sky
 * in the closing band has three layers.
 */
const hubs = [
  // Kept high and right: low enough and the rose is sliced in half by the
  // opaque log book, which reads as a clipping bug rather than as layering.
  { x: 890, y: 320, r: 1800, sway: 6, drift: 0.9, phase: 0 },
  { x: 200, y: 170, r: 1500, sway: -4.2, drift: -0.7, phase: 2.1 },
  { x: 400, y: 870, r: 1500, sway: 3.1, drift: 0.5, phase: 4.3 },
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

/** One bundle of 32 loxodromes per hub, so each can be rotated on its own. */
const bundles = computed(() =>
  hubs.map((hub, h) => ({
    hub,
    lines: Array.from({ length: 32 }, (_, i) => {
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
  })),
)

// ── Sway ────────────────────────────────────────────────────────────────

/**
 * Zero on the server and on the first client frame, so the hydrated markup
 * matches what was rendered and the artwork is exactly today's without JS.
 */
const angles = ref(hubs.map(() => 0))

/** Cursor position as -1..1 from the centre of the viewport. */
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
let frameId: number | null = null
let visible = true
let observer: IntersectionObserver | null = null
const root = ref<SVGSVGElement | null>(null)

function onPointerMove(event: PointerEvent) {
  // Read only. Everything else happens on the next frame — a pointermove
  // handler that writes to the DOM fires far more often than the display
  // refreshes, and does the work several times per painted frame.
  targetX = (event.clientX / window.innerWidth) * 2 - 1
  targetY = (event.clientY / window.innerHeight) * 2 - 1
  start()
}

function start() {
  if (frameId === null && visible) frameId = requestAnimationFrame(tick)
}

function tick(now: number) {
  // Ease toward the cursor rather than tracking it. Following exactly makes
  // the chart feel stuck to the pointer; the lag is what makes it feel heavy.
  currentX += (targetX - currentX) * 0.045
  currentY += (targetY - currentY) * 0.045

  // Idle drift, on a period slow enough (~40s) that it is never caught in the
  // act. It keeps the loop running, which is the point: the alternative is a
  // page that is completely frozen until the cursor happens to cross it.
  const t = now / 40000

  angles.value = hubs.map((hub) =>
    +(hub.sway * (currentX * 0.8 + currentY * 0.2) + hub.drift * Math.sin(t + hub.phase)).toFixed(3),
  )

  frameId = requestAnimationFrame(tick)
}

onMounted(() => {
  // A chart that drifts under the cursor is decoration, and decoration is the
  // first thing to drop for a reader who asked for less motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Scrolled past, this is 32 lines being retransformed for nobody.
  observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true
    if (visible) start()
    else if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
  })
  if (root.value) observer.observe(root.value)

  window.addEventListener('pointermove', onPointerMove, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  observer?.disconnect()
  if (frameId !== null) cancelAnimationFrame(frameId)
})
</script>

<template>
  <svg
    ref="root"
    :viewBox="`0 0 ${W} ${H}`"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!--
      One group per hub, rotated about that hub's own centre. Rotating the
      whole SVG instead would swing the far ends of every line through the
      viewport, which at this scale is a lurch rather than a sway; turning each
      rose in place leaves the hubs where they were drawn and only the network
      between them shifts.

      The rose and the ring travel with their own bundle. They are the thing the
      lines spring from, and leaving them fixed while the lines turn misaligns
      the spokes by a few pixels at the rose's radius — small, but exactly the
      kind of small that reads as broken rather than as motion.
    -->
    <g
      v-for="(bundle, b) in bundles"
      :key="`bundle-${b}`"
      :transform="`rotate(${angles[b] ?? 0} ${bundle.hub.x} ${bundle.hub.y})`"
    >
      <line
        v-for="line in bundle.lines"
        :key="line.key"
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

      <!-- Plain rings mark the secondary hubs; the principal one gets the rose,
           so a ring there would only double its outer limb. -->
      <circle
        v-if="b > 0"
        :cx="bundle.hub.x"
        :cy="bundle.hub.y"
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
        v-else
        :x="bundle.hub.x - ROSE"
        :y="bundle.hub.y - ROSE"
        :width="ROSE * 2"
        :height="ROSE * 2"
        class="text-ink"
        style="opacity: 0.3"
      />
    </g>
  </svg>
</template>
