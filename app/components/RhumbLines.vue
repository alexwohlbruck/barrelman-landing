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
  { x: 890, y: 320, sway: 6, drift: 0.9, phase: 0 },
  { x: 200, y: 170, sway: -4.2, drift: -0.7, phase: 2.1 },
  { x: 400, y: 870, sway: 3.1, drift: 0.5, phase: 4.3 },
]

/**
 * How far each bundle's lines actually need to run: to the corner of the
 * artwork furthest from that hub, plus a margin so the sway cannot swing an
 * endpoint inside the frame and open a wedge at a corner.
 *
 * These used to be flat 1500 and 1800, which is far past the edge of a
 * 1200x1000 viewBox — most of every line was drawn and then thrown away by the
 * clip. That is wasted rasterisation on its own, and it made each group's
 * bounding box three times the artwork, which is how a promoted layer here
 * reached 6205x6205.
 */
const SWAY_MARGIN = 1.08
function reach(hub: { x: number; y: number }): number {
  const corners = [
    [0, 0],
    [W, 0],
    [0, H],
    [W, H],
  ]
  return (
    Math.max(...corners.map(([cx, cy]) => Math.hypot(cx! - hub.x, cy! - hub.y))) * SWAY_MARGIN
  )
}

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
  hubs.map((hub, h) => {
    const r = reach(hub)
    return {
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
          x2: +(hub.x + r * Math.sin(rad)).toFixed(1),
          y2: +(hub.y - r * Math.cos(rad)).toFixed(1),
          cls,
        } as Line
      }),
    }
  }),
)

// ── Sway ────────────────────────────────────────────────────────────────

/**
 * Two earlier versions of this were slow, and both were slow for reasons worth
 * writing down, because the obvious fix was wrong twice.
 *
 * First it was a reactive `angles` array assigned inside the frame loop. That
 * invalidated the component every frame, so Vue re-rendered and diffed
 * ninety-six `<line>` vnodes sixty times a second on the main thread.
 *
 * Then the three bundles were rotated individually with
 * `will-change: transform` on each `<g>`. Promoting an animated element is the
 * standard advice, and inside an SVG it is a trap: a layer is sized from the
 * element's *geometry* bounding box, and lines radiating from a hub cover
 * several times the artwork, so the three layers came to 92 megapixels of
 * texture. The browser rasterises that in tiles as they scroll into view,
 * which is exactly why the hero got worse the more of it you could see.
 *
 * The fix is to promote the `<svg>` element instead of the groups inside it.
 * An `<svg>` is a replaced element in the HTML box tree, so its layer is sized
 * from its *CSS box* — here `absolute inset-0`, one hero, about two
 * megapixels. It rasterises once and every frame after that is a matrix on the
 * compositor, which is what a rotation should have cost all along.
 *
 * The price is that all three roses now turn together, and the hubs shift
 * rather than spinning in place. That is a fair description of a chart being
 * turned on a table, so it is the better reading anyway.
 */
const root = ref<SVGSVGElement | null>(null)

/**
 * Degrees at the extremes of the viewport, and of the idle drift.
 *
 * Smaller than the six the per-hub version used, because the whole network
 * turns now instead of three roses turning in place — the same angle moves far
 * more ink, and past about three degrees the background visibly slides under
 * the headline.
 */
const SWAY_DEG = 2.6
const IDLE_DEG = 0.45

/**
 * Rotating a rectangle about its centre pulls its corners inside its own box,
 * which would show as the artwork's edges sweeping into the hero. Scaling up
 * by a hair covers that. It is constant, so it is baked in when the layer is
 * rasterised and costs nothing per frame.
 */
const OVERSCAN = 1.06

/** Cursor position as -1..1 from the centre of the viewport. */
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
let frameId: number | null = null
let visible = true
let observer: IntersectionObserver | null = null

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

/**
 * Full rate. The whole point of promoting the `<svg>` is that a frame costs a
 * matrix multiply on the compositor rather than a repaint, so there is nothing
 * left to save by dropping frames — and the earlier 30fps cap was visible as a
 * faint stutter on the sway, which is the one thing this is for.
 */
function tick(now: number) {
  // Ease toward the cursor rather than tracking it. Following exactly makes
  // the chart feel stuck to the pointer; the lag is what makes it feel heavy.
  currentX += (targetX - currentX) * 0.045
  currentY += (targetY - currentY) * 0.045

  // Idle drift, on a period slow enough (~40s) that it is never caught in the
  // act. It keeps the loop running, which is the point: the alternative is a
  // page that is completely frozen until the cursor happens to cross it.
  const drift = Math.sin(now / 40000) * IDLE_DEG
  const deg = SWAY_DEG * (currentX * 0.8 + currentY * 0.2) + drift

  // One write, one composited matrix. `scale` is constant and rides along so
  // the corners stay covered — see the template.
  if (root.value) root.value.style.transform = `rotate(${deg.toFixed(3)}deg) scale(${OVERSCAN})`

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
  <!--
    `will-change` belongs here, on the `<svg>`, and nowhere inside it.

    An `<svg>` is a replaced element in the HTML box tree, so its layer is
    sized from its CSS box — one hero, about two megapixels. Put the same hint
    on a `<g>` and the layer is sized from the *geometry* bounding box instead,
    which for lines radiating out of a hub is several times the artwork: the
    three bundles came to 92 megapixels between them, rasterised in tiles as
    the hero scrolled into view. Same one-word hint, two orders of magnitude
    apart.

    Rasterised once, then every frame is a matrix on the compositor.
  -->
  <svg
    ref="root"
    :viewBox="`0 0 ${W} ${H}`"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    :style="{ willChange: 'transform', transform: `scale(${OVERSCAN})` }"
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
    <g v-for="(bundle, b) in bundles" :key="`bundle-${b}`">
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
