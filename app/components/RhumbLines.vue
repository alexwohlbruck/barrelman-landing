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
 * Generated from angles so the geometry stays exact.
 *
 * The one moving part is a slow sway of each rose, driven by the cursor and by
 * how far the hero has scrolled. It has to clear two thresholds at once: large
 * enough to register at all — the first pass ran at two degrees and was
 * invisible, because the lines are hairlines at 15-26% opacity and a two-degree
 * turn moves them less than their own stroke width near the hub — and small
 * enough that it never pulls the eye off the headline sitting on top of it. Six
 * degrees, eased slowly, is where a chart reads as being turned on a table
 * rather than as a video.
 *
 * Scroll matters for more than variety: `pointermove` never fires on a touch
 * screen and rarely for someone navigating by keyboard, so cursor alone left
 * the chart frozen for both. An earlier version covered that with a permanent
 * idle drift, which bought it with a sixty-times-a-second repaint of the most
 * expensive region on the page. Scroll gives the same reassurance that the
 * page is alive and costs nothing while the page is still.
 */
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

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
 * other instead of turning as a single rigid sheet.
 *
 * The closing band's sky answers the same two drivers, and deliberately does
 * not do this: those stars are one sphere at one distance, so they turn
 * together and the depth comes from how far each sits from the meridian. Three
 * charts on a table may slide over each other; a sky may not.
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

/**
 * Each bundle is drawn zoomed by this much about its own hub.
 *
 * It began as a fix for a seam: rotating a *rasterised* layer swings its far
 * edge inward and shows the empty corner it came from. Redrawing the geometry
 * every frame cannot produce that seam, so nothing here needs it any more —
 * but the zoom had been in the shipped look for long enough to be the look,
 * and dropping it pulls the whole network 18% smaller. Kept deliberately, as
 * composition rather than as a workaround.
 */
const OVERSCAN = 1.18

/** Radius of the drawn rose at the principal hub. */
const ROSE = 104

/**
 * A viewBox that bakes the overscan in, so the no-script fallback below needs
 * no transform and no JS to match what the canvas draws.
 *
 * Zooming by S about a point h is exactly the viewBox `h - h/S` sized `W/S`:
 * both put artwork point p at `off + (p-h)·s·S + h·s`, and the `slice` offset
 * comes out identical because the scale rises by S as the region shrinks by S.
 */
function frame(hub: { x: number; y: number }): string {
  const f = (n: number) => +n.toFixed(2)
  return [
    f(hub.x - hub.x / OVERSCAN),
    f(hub.y - hub.y / OVERSCAN),
    f(W / OVERSCAN),
    f(H / OVERSCAN),
  ].join(' ')
}

/**
 * The three weights, in draw order. Grouping by weight rather than by angle is
 * what makes a bundle three stroke calls instead of thirty-two.
 */
const TIERS = [
  { key: 'principal', cssVar: '--ink', width: 1, alpha: 0.26 },
  { key: 'half', cssVar: '--verdigris', width: 0.7, alpha: 0.2 },
  { key: 'quarter', cssVar: '--rubric', width: 0.7, alpha: 0.15 },
] as const

interface Seg {
  x1: number
  y1: number
  x2: number
  y2: number
}

/** One bundle of 32 loxodromes per hub, so each can be turned on its own. */
const bundles = hubs.map((hub) => {
  const r = reach(hub)
  const tiers = TIERS.map((t) => ({ ...t, segs: [] as Seg[] }))
  const byKey = { principal: tiers[0]!, half: tiers[1]!, quarter: tiers[2]! }

  for (let i = 0; i < 32; i++) {
    const deg = i * 11.25
    const rad = (deg * Math.PI) / 180
    // Every 90° is a principal wind, every 45° a half-wind, rest quarters.
    const key = deg % 90 === 0 ? 'principal' : deg % 45 === 0 ? 'half' : 'quarter'
    byKey[key].segs.push({
      x1: hub.x,
      y1: hub.y,
      x2: +(hub.x + r * Math.sin(rad)).toFixed(1),
      y2: +(hub.y - r * Math.cos(rad)).toFixed(1),
    })
  }

  return { hub, tiers, viewBox: frame(hub) }
})

// ── Sway ────────────────────────────────────────────────────────────────

/**
 * The network is redrawn into one canvas, and that is the whole trick.
 *
 * Four attempts got here, and the three failures are worth recording because
 * the standard advice caused two of them.
 *
 * A reactive `angles` array assigned inside the frame loop invalidated the
 * component every frame, so Vue re-rendered and diffed ninety-six `<line>`
 * vnodes sixty times a second.
 *
 * `will-change: transform` on each `<g>` was worse. Inside an SVG a layer is
 * sized from the element's *geometry* bounding box, and lines radiating from a
 * hub cover several times the artwork, so three layers came to 92 megapixels.
 *
 * Moving the hint to the `<svg>` — a replaced element, so its layer is its CSS
 * box — got that down to 28 device megapixels across three layers. Still 5.6x
 * the viewport, ~112MB of texture for a background of hairlines, and paid
 * again on every re-raster as the hero scrolled. Dropping the promotion traded
 * that for a full repaint of the hero on every frame of the sway instead:
 * measured under a driven cursor, 475 paints and 618 raster tasks a second.
 *
 * The mistake common to all three is treating this as a *transform* problem.
 * It is not: the artwork is ninety-six hairlines, and the reason moving it is
 * expensive is that the renderer is obliged to keep a pixel-exact copy of a
 * five-megapixel vector scene on either side of the move. Redraw it instead
 * and there is nothing to preserve — a clear and nine stroke calls, into a
 * single buffer the size of the hero and no larger. No layout, no display list
 * to rebuild, no layer tree to recommit, and no texture held open while idle.
 *
 * The earlier note here dismissed canvas as "re-stroking ninety-six lines over
 * ~8 megapixels every frame". That conflated the size of the buffer with the
 * pixels a stroke actually touches: hairlines cover a thousandth of it, and
 * the clear is a fill the GPU does not feel.
 */
const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const roseEl = ref<HTMLElement | null>(null)

/**
 * Swapped on at mount, which drops the server-rendered SVG fallback and puts
 * the canvas in its place. Vue flushes that DOM change on a microtask and the
 * first draw happens in the same task, so both land before the browser paints
 * and the exchange is never visible. With JS off the fallback simply stays.
 */
const live = ref(false)

let ctx: CanvasRenderingContext2D | null = null
/** Resolved once: canvas takes colours, not `var()` references. */
let inks: string[] = []

/** The `slice` mapping from viewBox units to CSS pixels, recomputed on resize. */
let scale = 1
let offsetX = 0
let offsetY = 0
let dpr = 1

/** Cursor position as -1..1 from the centre of the viewport. */
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
/** How far the hero has scrolled past, 0..1. */
let targetScroll = 0
let currentScroll = 0
/** Where the hero sits in the document, so the scroll handler reads no layout. */
let heroTop = 0
let heroHeight = 1
let frameId: number | null = null
let visible = true
let observer: IntersectionObserver | null = null
let sizeObserver: ResizeObserver | null = null
let dprQuery: MediaQueryList | null = null

/**
 * Read `var(--ink)` and friends through a probe element rather than off the
 * root's computed style: `--ink` is itself `var(--base-dark)`, and a probe
 * resolves any depth of indirection to the `rgb()` canvas actually wants.
 */
function resolveInks() {
  const probe = document.createElement('span')
  probe.style.display = 'none'
  document.body.appendChild(probe)
  inks = TIERS.map((t) => {
    probe.style.color = `var(${t.cssVar})`
    return getComputedStyle(probe).color
  })
  probe.remove()
}

/**
 * Size the buffer and place the rose.
 *
 * The hub is a viewBox coordinate and the rose is a positioned element, so the
 * `slice` mapping has to be undone by hand: scale is the larger axis ratio
 * (that is what "cover" means), and `xMidYMid` centres the overflow.
 *
 * Device pixel ratio is capped at 2. Past that the buffer grows quadratically
 * to hold detail nobody can see in a hairline at 15% opacity.
 */
function layout() {
  const el = canvas.value
  const box = root.value?.getBoundingClientRect()
  if (!el || !box || !box.width || !box.height) return

  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const bw = Math.round(box.width * dpr)
  const bh = Math.round(box.height * dpr)
  // Assigning width/height clears the buffer, so only touch it on a real change.
  if (el.width !== bw || el.height !== bh) {
    el.width = bw
    el.height = bh
  }

  scale = Math.max(box.width / W, box.height / H)
  offsetX = (box.width - W * scale) / 2
  offsetY = (box.height - H * scale) / 2

  // Cached here so the scroll handler can work from `scrollY` alone.
  heroTop = box.top + window.scrollY
  heroHeight = box.height || 1
  readScroll()

  const rose = roseEl.value
  const hub = hubs[0]!
  if (rose) {
    // The rose sits on the principal hub and is zoomed with its own bundle, so
    // it scales by the overscan and turns about its own centre.
    const size = 2 * ROSE * scale * OVERSCAN
    rose.style.left = `${(offsetX + hub.x * scale - size / 2).toFixed(1)}px`
    rose.style.top = `${(offsetY + hub.y * scale - size / 2).toFixed(1)}px`
    rose.style.width = `${size.toFixed(1)}px`
    rose.style.height = `${size.toFixed(1)}px`
  }

  draw()
}

/**
 * How much of the sway scroll is allowed to take.
 *
 * A blend rather than a sum. Summing lets the two drivers stack to twelve
 * degrees on the principal hub, and six is the ceiling the whole effect is
 * built around — past it the chart stops reading as a sheet being turned and
 * starts competing with the headline. Scroll reads zero at the top of the
 * page, so a hero nobody has touched still arrives square.
 *
 * Weighted toward scroll, which is the driver everyone has. The cursor is the
 * better one — two axes, and it points at something — but it only exists for a
 * reader on a pointing device, so a share spent on it is a share spent on
 * nothing for anyone on a phone or a keyboard. Six degrees is still the whole
 * budget; this only decides which driver gets to spend it.
 */
const SCROLL_SHARE = 0.6

/**
 * How fast each driver is chased.
 *
 * The cursor's lag is the point: a chart that tracks the pointer exactly feels
 * stuck to it, and the weight comes from arriving late. Scrolling is not that.
 * The hero is already travelling at the speed of the wheel, and a sway easing
 * in at a twentieth of the gap per frame is still on its way when the reader
 * has stopped — so the turn lands on a chart nobody is looking at any more,
 * and the drivers that cannot use a cursor get the worst of it. Twice the rate
 * still trails the scroll enough to read as a sheet with some mass to it.
 */
const EASE = 0.045
const EASE_SCROLL = 0.09

/** The single scalar every bundle's angle is a multiple of. */
function lean(): number {
  return (currentX * 0.8 + currentY * 0.2) * (1 - SCROLL_SHARE) + currentScroll * SCROLL_SHARE
}

/** A clear and nine strokes. This is the whole per-frame cost. */
function draw() {
  if (!ctx || !canvas.value) return
  const c = canvas.value

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, c.width, c.height)

  const turn = lean()

  for (let i = 0; i < bundles.length; i++) {
    const { hub, tiers } = bundles[i]!

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.translate(offsetX, offsetY)
    ctx.scale(scale, scale)
    // Rotate and zoom about this bundle's own hub. Both are uniform, so the
    // order between them does not matter; what matters is the shared origin.
    ctx.translate(hub.x, hub.y)
    ctx.rotate((hub.sway * turn * Math.PI) / 180)
    ctx.scale(OVERSCAN, OVERSCAN)
    ctx.translate(-hub.x, -hub.y)

    for (let t = 0; t < tiers.length; t++) {
      const tier = tiers[t]!
      ctx.beginPath()
      for (const s of tier.segs) {
        ctx.moveTo(s.x1, s.y1)
        ctx.lineTo(s.x2, s.y2)
      }
      ctx.strokeStyle = inks[t]!
      // Stroke width is in viewBox units, so the CTM scales it exactly as the
      // SVG did — no need to divide the device ratio back out.
      ctx.lineWidth = tier.width
      ctx.globalAlpha = tier.alpha
      ctx.stroke()
    }

    // Plain rings mark the secondary hubs; the principal one gets the rose,
    // so a ring there would only double its outer limb.
    if (i > 0) {
      ctx.beginPath()
      ctx.arc(hub.x, hub.y, 46, 0, Math.PI * 2)
      ctx.strokeStyle = inks[0]!
      ctx.lineWidth = 0.8
      ctx.globalAlpha = 0.24
      ctx.stroke()
    }
  }

  ctx.globalAlpha = 1
}

function onDpr() {
  watchDpr()
  layout()
}

function watchDpr() {
  dprQuery?.removeEventListener('change', onDpr)
  dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
  dprQuery.addEventListener('change', onDpr)
}

function onPointerMove(event: PointerEvent) {
  // Read only. Everything else happens on the next frame — a pointermove
  // handler that writes to the DOM fires far more often than the display
  // refreshes, and does the work several times per painted frame.
  targetX = (event.clientX / window.innerWidth) * 2 - 1
  targetY = (event.clientY / window.innerHeight) * 2 - 1
  start()
}

/** How far the hero has scrolled past, 0 at the top and 1 once it is clear. */
function readScroll() {
  const p = (window.scrollY - heroTop) / heroHeight
  targetScroll = p < 0 ? 0 : p > 1 ? 1 : p
}

function onScroll() {
  // Read only, and only `scrollY`. Measuring the hero here instead would force
  // a layout on every scroll event, which is the usual way a scroll handler
  // ends up costing more than the thing it drives.
  readScroll()
  start()
}

function start() {
  if (frameId === null && visible) frameId = requestAnimationFrame(tick)
}

function tick() {
  // Ease toward the cursor rather than tracking it. Following exactly makes
  // the chart feel stuck to the pointer; the lag is what makes it feel heavy.
  currentX += (targetX - currentX) * EASE
  currentY += (targetY - currentY) * EASE
  currentScroll += (targetScroll - currentScroll) * EASE_SCROLL

  draw()

  // The rose is the one thing still moved rather than redrawn: it is a
  // detailed little drawing, its box is a fiftieth of the hero's, and at that
  // size a promoted layer is about a megabyte and turns for free.
  const rose = roseEl.value
  if (rose) rose.style.transform = `rotate(${(hubs[0]!.sway * lean()).toFixed(3)}deg)`

  // Stop once the easing has arrived. Without this the loop runs for the life
  // of the page, and a hero nobody is touching would redraw sixty times a
  // second forever.
  const settled =
    Math.abs(targetX - currentX) < 0.0015 &&
    Math.abs(targetY - currentY) < 0.0015 &&
    Math.abs(targetScroll - currentScroll) < 0.0015
  frameId = settled ? null : requestAnimationFrame(tick)
}

onMounted(async () => {
  resolveInks()

  live.value = true
  await nextTick()

  ctx = canvas.value?.getContext('2d') ?? null
  layout()
  // Arriving part-way down the page — a refresh, or a link to an anchor — must
  // not ease in from square, which would read as the chart settling on load.
  currentScroll = targetScroll
  draw()

  // Resizing is not animation: a canvas whose buffer no longer matches its box
  // is stretched and blurred, so these two are set up for everyone, including
  // readers who have asked for no motion at all.
  sizeObserver = new ResizeObserver(layout)
  if (root.value) sizeObserver.observe(root.value)

  // A ResizeObserver never fires for a window dragged to a display of a
  // different density, and the buffer would stay at the old ratio and blur.
  // The query has to be rebuilt each time, because it can only ever ask about
  // the one ratio it was created with.
  watchDpr()

  // A chart that drifts under the cursor is decoration, and decoration is the
  // first thing to drop for a reader who asked for less motion. The network is
  // drawn by now; only the sway is withheld.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Scrolled past, this is a redraw a frame for nobody.
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
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
  sizeObserver?.disconnect()
  dprQuery?.removeEventListener('change', onDpr)
  if (frameId !== null) cancelAnimationFrame(frameId)
})
</script>

<template>
  <div ref="root">
    <!--
      The server-rendered network, and what anyone with JS off keeps.

      The overscan is baked into each viewBox rather than applied as a CSS
      transform, so this needs no script to match the canvas — the old version
      set `transform-origin` from JS on mount, which meant the markup arrived
      zoomed about the wrong point and jumped when it hydrated.
    -->
    <template v-if="!live">
      <svg
        v-for="(bundle, b) in bundles"
        :key="`bundle-${b}`"
        class="absolute inset-0 h-full w-full opacity-45 sm:opacity-100"
        :viewBox="bundle.viewBox"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g v-for="tier in bundle.tiers" :key="tier.key" :stroke="`var(${tier.cssVar})`">
          <line
            v-for="(seg, s) in tier.segs"
            :key="`${tier.key}-${s}`"
            :x1="seg.x1"
            :y1="seg.y1"
            :x2="seg.x2"
            :y2="seg.y2"
            :stroke-width="tier.width"
            :opacity="tier.alpha"
          />
        </g>

        <circle
          v-if="b > 0"
          :cx="bundle.hub.x"
          :cy="bundle.hub.y"
          r="46"
          stroke="var(--ink)"
          stroke-width="0.8"
          opacity="0.24"
        />

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
    </template>

    <!--
      Live: one buffer the size of the hero, redrawn only while the sway is
      easing. Opacity sits on the canvas itself — a translucent parent of
      several children forces an offscreen buffer to apply the group opacity,
      which is precisely the extra pass all of this exists to avoid.
    -->
    <template v-else>
      <canvas
        ref="canvas"
        class="absolute inset-0 h-full w-full opacity-45 sm:opacity-100"
        aria-hidden="true"
      />

      <!--
        The rose travels with its own bundle. It is the thing the lines spring
        from, and leaving it fixed while they turn misaligns the spokes by a
        few pixels at the rose's radius — small, but exactly the kind of small
        that reads as broken rather than as motion.

        Its own element rather than strokes in the canvas: it is thirty-two
        points, a graduated limb and a fleur-de-lis, and redrawing all of that
        every frame would cost more than the whole rhumb network. Positioned
        and sized from the same mapping, so it lands on the hub exactly.
      -->
      <div
        ref="roseEl"
        class="absolute opacity-[0.135] will-change-transform sm:opacity-30"
        aria-hidden="true"
      >
        <CompassRose class="h-full w-full text-ink" />
      </div>
    </template>
  </div>
</template>
