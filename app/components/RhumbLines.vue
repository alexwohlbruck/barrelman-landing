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
  { x: 890, y: 320, sway: 6 },
  { x: 200, y: 170, sway: -4.2 },
  { x: 400, y: 870, sway: 3.1 },
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
 * Each bundle gets its own `<svg>` element, and that is the whole trick.
 *
 * Three attempts got here, and the two failures are worth recording because
 * the standard advice caused one of them.
 *
 * A reactive `angles` array assigned inside the frame loop invalidated the
 * component every frame, so Vue re-rendered and diffed ninety-six `<line>`
 * vnodes sixty times a second on the main thread.
 *
 * Replacing that with `will-change: transform` on each `<g>` was worse. Inside
 * an SVG, a layer is sized from the element's *geometry* bounding box, and
 * lines radiating from a hub cover several times the artwork, so the three
 * layers came to 92 megapixels of texture — rasterised in tiles as the hero
 * scrolled into view, which is why it got worse the further down you got.
 *
 * The distinction that matters is not SVG versus canvas, it is which kind of
 * element carries the hint. An `<svg>` is a replaced element in the HTML box
 * tree, so *its* layer is sized from its CSS box. One `<svg>` per bundle,
 * stacked and each `absolute inset-0`, gives three layers of about two
 * megapixels each that rasterise once and then cost a matrix apiece — and
 * because they are separate elements, they can hold separate angles.
 *
 * Canvas would mean re-stroking ninety-six antialiased lines over ~8 megapixels
 * every frame, which is more work than compositing three static layers, and it
 * would give up resolution independence. WebGL would mean a second GL context
 * for ninety-six lines. Neither buys anything the box tree does not.
 */
const svgs: SVGSVGElement[] = []
const setSvg = (el: unknown, i: number) => {
  if (el) svgs[i] = el as SVGSVGElement
}

/**
 * Rotating about a hub swings the far edge of the artwork inward, which would
 * show as a diagonal seam where the lines stop. Scaling out from the *same*
 * origin covers it, and does so at every distance at once: a point `d` from
 * the origin is swept `d·sin θ` by the rotation and pushed `d·(S−1)` by the
 * scale, so `S − 1 ≥ sin θ_max` covers the whole plane regardless of viewport
 * or where the hub landed.
 *
 * Worst case here is 6° of sway plus 0.9° of drift, so sin θ ≈ 0.12; 0.18
 * leaves room. It matters because `slice` can crop a hub off the visible box
 * entirely — on a wide screen one origin sits 300px below it — and then every
 * pixel on screen is far from the pivot.
 *
 * Constant, so it is baked in when the layer rasterises and costs nothing.
 */
const OVERSCAN = 1.18

/** Cursor position as -1..1 from the centre of the viewport. */
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
let frameId: number | null = null
let visible = true
let observer: IntersectionObserver | null = null
let sizeObserver: ResizeObserver | null = null
/** The wrapper, for observing size and visibility once for all three layers. */
const root = ref<HTMLElement | null>(null)

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

  const lean = currentX * 0.8 + currentY * 0.2

  for (let i = 0; i < hubs.length; i++) {
    const hub = hubs[i]!
    const svg = svgs[i]
    if (!svg) continue
    svg.style.transform = `rotate(${(hub.sway * lean).toFixed(3)}deg) scale(${OVERSCAN})`
  }

  // Stop once the easing has arrived. Without this the loop runs for the life
  // of the page, and an unpromoted rotation repaints — so a hero that nobody
  // is touching would repaint sixty times a second forever. The idle drift
  // that used to live here is gone for exactly that reason: it was a
  // guaranteed, permanent repaint in the most expensive region of the page,
  // bought for motion nobody was looking at.
  const settled = Math.abs(targetX - currentX) < 0.0015 && Math.abs(targetY - currentY) < 0.0015
  frameId = settled ? null : requestAnimationFrame(tick)
}

/**
 * Put each element's rotation origin on its own hub.
 *
 * The hub is a viewBox coordinate and `transform-origin` wants a CSS one, so
 * the `slice` mapping has to be undone by hand: scale is the larger axis ratio
 * (that is what "cover" means), and `xMidYMid` centres the overflow. Recomputed
 * on resize, because the mapping changes with the box.
 */
function placeOrigins() {
  for (let i = 0; i < hubs.length; i++) {
    const hub = hubs[i]!
    const svg = svgs[i]
    if (!svg) continue
    const box = svg.getBoundingClientRect()
    if (!box.width || !box.height) continue
    const scale = Math.max(box.width / W, box.height / H)
    const x = (box.width - W * scale) / 2 + hub.x * scale
    const y = (box.height - H * scale) / 2 + hub.y * scale
    svg.style.transformOrigin = `${x.toFixed(1)}px ${y.toFixed(1)}px`
  }
}

onMounted(() => {
  placeOrigins()

  // A chart that drifts under the cursor is decoration, and decoration is the
  // first thing to drop for a reader who asked for less motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Scrolled past, this is three matrices a frame for nobody.
  observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true
    if (visible) start()
    else if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
  })
  if (root.value) observer.observe(root.value)

  sizeObserver = new ResizeObserver(placeOrigins)
  if (root.value) sizeObserver.observe(root.value)

  window.addEventListener('pointermove', onPointerMove, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  observer?.disconnect()
  sizeObserver?.disconnect()
  if (frameId !== null) cancelAnimationFrame(frameId)
})
</script>

<template>
  <div ref="root">
    <!--
      One `<svg>` per hub, stacked, each turning about its own rose.

      The three used to be `<g>`s inside a single `<svg>`, which is the natural
      way to draw this and the wrong way to animate it: `will-change` on a `<g>`
      sizes its layer from the *geometry* bounding box, and lines radiating from
      a hub cover several times the artwork, so the three came to 92 megapixels.
      An `<svg>` is a replaced element in the HTML box tree, so its layer is its
      CSS box — one hero, about two megapixels — and being separate elements is
      also what lets each hold its own angle.

      The rose and the ring travel with their own bundle. They are the thing the
      lines spring from, and leaving them fixed while the lines turn misaligns
      the spokes by a few pixels at the rose's radius — small, but exactly the
      kind of small that reads as broken rather than as motion.

      Opacity sits on each layer rather than on the wrapper. A translucent
      parent of three composited children forces the browser to render them
      into an offscreen buffer to apply the group opacity, which is precisely
      the extra pass all of this exists to avoid.
    -->
    <svg
      v-for="(bundle, b) in bundles"
      :key="`bundle-${b}`"
      :ref="(el) => setSvg(el, b)"
      class="absolute inset-0 h-full w-full opacity-45 sm:opacity-100"
      :viewBox="`0 0 ${W} ${H}`"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ transform: `scale(${OVERSCAN})` }"
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
    </svg>
  </div>
</template>
