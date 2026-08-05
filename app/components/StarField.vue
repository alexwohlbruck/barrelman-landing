<script setup lang="ts">
/**
 * The night sky over the closing band — stars on a celestial sphere, turning.
 *
 * Two things had to be true at once, and they pull against each other.
 *
 * **Sparkle** is stars going off at different times. A stack of
 * `radial-gradient`s, which this used to be, can only be animated as one
 * thing, so every star in it brightens on the same clock; at any amplitude
 * worth seeing that reads as the whole panel pulsing. So each star is an
 * element, with its own duration and a negative delay that drops it at a
 * random point in its cycle.
 *
 * **Drift** is the sky turning overhead. Sliding the field sideways is the
 * cheap version and looks it, because everything moves at one speed. Real
 * stars sit on a sphere: they accelerate through the meridian and slow toward
 * the horizon, and that foreshortening is the whole tell. So each star has a
 * longitude and a latitude, the longitude advances, and the projection does
 * the rest — `x = cos(lat)·sin(lon)` is fastest at `lon = 0` and stalls at the
 * limb for free.
 *
 * The two are kept apart so neither has to know about the other: the outer
 * element is position, written from the animation loop, and the inner one is
 * sparkle, left entirely to CSS. Both want the `transform` property, and one
 * would otherwise overwrite the other every frame.
 */

/** mulberry32 — small, fast, and identical on both sides of the render. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * A full turn of the sky, in seconds. About an hour: at the width of this band
 * that is a couple of pixels a second, which is under the rate at which motion
 * registers as motion. You should never catch a star moving — you should only
 * notice, coming back, that the sky is not where you left it.
 */
const PERIOD_S = 3600

/**
 * How much of the sphere's width the band shows. At 1 the limb sits exactly on
 * the left and right edges, so stars fade out precisely as they leave; wider
 * than that and they would wink out mid-air.
 */
const SPREAD_X = 1
/** Latitude is squashed: the band is far wider than it is tall. */
const SPREAD_Y = 0.62

/**
 * Tilt of the pole, radians. Without it every star travels dead horizontally
 * and the sphere collapses back into a sideways slide — the speed still
 * varies, but nothing curves, and curvature is what the eye actually reads as
 * rotation. Matching the globe's own 23.5° would be too steep for a band this
 * shallow; ten degrees is enough to bend the paths.
 */
const TILT = 0.175
const COS_TILT = Math.cos(TILT)
const SIN_TILT = Math.sin(TILT)

/**
 * A point on the sphere, projected into the band as percentages.
 *
 * Orthographic, which is right for something meant to be at infinity, and
 * means the only depth cue is `z` — used to fade stars out as they reach the
 * limb rather than to scale them.
 */
function project(star: { lon: number; cosLat: number; sinLat: number }, turn: number) {
  const lon = star.lon + turn
  const x = star.cosLat * Math.sin(lon)
  const y = star.sinLat
  return {
    x: (x * COS_TILT - y * SIN_TILT) * 50 * SPREAD_X,
    y: (x * SIN_TILT + y * COS_TILT) * 50 * SPREAD_Y,
    z: star.cosLat * Math.cos(lon),
  }
}

interface Star {
  /** Longitude at t=0, radians. Advances with the turn. */
  lon: number
  cosLat: number
  sinLat: number
  size: string
  opacity: number
  duration: string
  delay: string
  glow: string
  sparkle: boolean
  /** Projected position at t=0, so the server can place it. */
  left: string
  top: string
}

/**
 * Three tiers, because a sky has depth and one size of dot does not. Only the
 * near ones sparkle: every star twinkling is noise, and a handful doing it
 * against a still field is what the eye reads as a night sky.
 */
const TIERS = [
  { count: 100, min: 0.9, max: 1.6, opacity: [0.18, 0.42], sparkle: false, glow: 0 },
  { count: 48, min: 1.4, max: 2.3, opacity: [0.35, 0.64], sparkle: false, glow: 2 },
  { count: 16, min: 2.0, max: 3.2, opacity: [0.7, 1], sparkle: true, glow: 6 },
]

/**
 * Evaluated once at module scope, from a fixed seed, so the server and the
 * client generate the same sky and the markup hydrates without a mismatch.
 * `Math.random()` here would repaint every star on hydration.
 */
const stars: Star[] = (() => {
  const rand = rng(20260805)
  const out: Star[] = []

  for (const tier of TIERS) {
    for (let i = 0; i < tier.count; i++) {
      // Longitude over the near hemisphere plus a margin either side, so there
      // is always a supply of stars about to rotate into view rather than a
      // visibly empty edge.
      const lon = (rand() * 2 - 1) * (Math.PI / 2 + 0.5)
      // `asin` of a uniform value, not a uniform angle: uniform latitude
      // bunches stars toward the poles, which here means a visible seam of
      // them along the top and bottom edges.
      const lat = Math.asin(rand() * 2 - 1) * 0.85
      const cosLat = Math.cos(lat)
      const sinLat = Math.sin(lat)
      const size = tier.min + rand() * (tier.max - tier.min)

      out.push({
        lon,
        cosLat,
        sinLat,
        size: `${size.toFixed(2)}px`,
        opacity: +(tier.opacity[0]! + rand() * (tier.opacity[1]! - tier.opacity[0]!)).toFixed(2),
        // Durations spread wide and delays pulled backwards over a longer
        // span, so no two stars share a phase and the field never
        // resynchronises into a visible beat.
        duration: `${(2.4 + rand() * 5.5).toFixed(2)}s`,
        delay: `${(rand() * -9).toFixed(2)}s`,
        glow: tier.glow
          ? `0 0 ${tier.glow}px ${(tier.glow / 2).toFixed(1)}px rgba(255,249,243,0.35)`
          : 'none',
        sparkle: tier.sparkle,
        // Filled in below, from the same projection the loop uses. Computing
        // it by hand here would be a second copy of the maths, and the two
        // would disagree on the first frame — as a visible jolt of the entire
        // sky the moment the page hydrates.
        left: '',
        top: '',
      })
    }
  }

  for (const star of out) {
    const p = project(star, 0)
    star.left = `${(50 + p.x).toFixed(3)}%`
    star.top = `${(50 + p.y).toFixed(3)}%`
  }
  return out
})()

// ── The turn ────────────────────────────────────────────────────────────

const root = ref<HTMLElement | null>(null)
/**
 * Collected by `:ref`, and written to directly rather than through reactive
 * style bindings. Vue would re-render 164 components every frame to move them;
 * a bare `style.transform` write does not touch the framework at all.
 */
const nodes: HTMLElement[] = []
const setNode = (el: unknown, i: number) => {
  if (el) nodes[i] = el as HTMLElement
}

let frameId: number | null = null
let observer: IntersectionObserver | null = null
let sizeObserver: ResizeObserver | null = null
let width = 0
let height = 0
let startedAt = 0

/**
 * Pixel offsets the server already placed each star at. The loop writes
 * *deltas* from these, so the transform is zero on the first frame and nothing
 * jumps when the static markup hydrates.
 */
const baseX: number[] = []
const baseY: number[] = []

function measure() {
  if (!root.value) return
  width = root.value.clientWidth
  height = root.value.clientHeight
}

function cacheBase() {
  for (let i = 0; i < stars.length; i++) {
    const p = project(stars[i]!, 0)
    baseX[i] = (p.x * width) / 100
    baseY[i] = (p.y * height) / 100
  }
}

/**
 * The sky turns once an hour, which is about a pixel a second at this width.
 * Recomputing 164 positions sixty times a second to move each of them a
 * sixtieth of a pixel is work nobody can see; at 10fps the step is a tenth of
 * a pixel, still under what a screen can show, for a sixth of the cost.
 *
 * The sparkle is unaffected — that is CSS, running on its own clock at full
 * rate, which is where the frame budget should actually go.
 */
const POSITION_FPS = 10
let lastMoveAt = 0

function tick(now: number) {
  if (!startedAt) startedAt = now

  if (now - lastMoveAt < 1000 / POSITION_FPS) {
    frameId = requestAnimationFrame(tick)
    return
  }
  lastMoveAt = now

  const turn = ((now - startedAt) / 1000 / PERIOD_S) * Math.PI * 2

  for (let i = 0; i < stars.length; i++) {
    const node = nodes[i]
    if (!node) continue

    const p = project(stars[i]!, turn)

    // Behind the sphere. Hiding rather than letting it run off-screen keeps a
    // star from sliding back across the band the wrong way as longitude wraps.
    if (p.z <= 0) {
      node.style.opacity = '0'
      continue
    }

    const dx = (p.x * width) / 100 - baseX[i]!
    const dy = (p.y * height) / 100 - baseY[i]!
    node.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`
    // Fade through the limb rather than cutting out at it.
    node.style.opacity = Math.min(1, p.z / 0.3).toFixed(3)
  }

  frameId = requestAnimationFrame(tick)
}

function start() {
  if (frameId === null) frameId = requestAnimationFrame(tick)
}
function stop() {
  if (frameId !== null) cancelAnimationFrame(frameId)
  frameId = null
}

onMounted(() => {
  measure()
  cacheBase()

  // A sky that drifts is decoration, and decoration is the first thing to drop
  // for a reader who asked for less motion. The field stays; it holds still.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Scrolled past, this is 164 elements being moved for nobody.
  observer = new IntersectionObserver(([entry]) => {
    const onScreen = entry?.isIntersecting ?? false
    onScreen ? start() : stop()
    // Stop the CSS animations too, not just the position loop. A running
    // opacity animation keeps its element promoted, so 164 of them off screen
    // is 164 compositor layers held open for the whole page — and this band is
    // at the very bottom, so that is nearly all of the time.
    root.value?.classList.toggle('paused', !onScreen)
  })
  if (root.value) observer.observe(root.value)

  sizeObserver = new ResizeObserver(() => {
    measure()
    cacheBase()
  })
  if (root.value) sizeObserver.observe(root.value)
})

onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
  sizeObserver?.disconnect()
})
</script>

<template>
  <div ref="root" class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <span
      v-for="(star, i) in stars"
      :key="i"
      :ref="(el) => setNode(el, i)"
      class="absolute"
      :style="{ left: star.left, top: star.top, opacity: 1 }"
    >
      <span
        class="star block rounded-full bg-paper"
        :class="star.sparkle ? 'star-bright' : ''"
        :style="{
          width: star.size,
          height: star.size,
          boxShadow: star.glow,
          '--star-opacity': star.opacity,
          '--star-duration': star.duration,
          '--star-delay': star.delay,
        }"
      />
    </span>
  </div>
</template>

<style scoped>
/**
 * Opacity and transform only — both composited, so a hundred and sixty stars
 * animating at once cost the main thread nothing. Animating width, height or
 * box-shadow instead would lay out and repaint the section every frame, and
 * this sits directly above the page's tallest scroll region.
 */
/*
 * No `will-change`. It was here on the reasoning that an animated property
 * should be promoted, but this selector matches 164 elements, and promoting
 * 164 elements means 164 permanent compositor layers to allocate, track and
 * blend — for dots two pixels across. Browsers already promote an element for
 * the duration of an opacity animation; the hint only makes it permanent.
 */
.star {
  opacity: var(--star-opacity);
  animation: twinkle var(--star-duration) ease-in-out var(--star-delay) infinite;
}

/* The bright few also breathe in size, which is what separates a sparkle from
   a fade. Kept under 1.4x: past that they read as pulsing dots. */
.star-bright {
  animation-name: sparkle;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: calc(var(--star-opacity) * 0.25);
  }
  50% {
    opacity: var(--star-opacity);
  }
}

@keyframes sparkle {
  0%,
  100% {
    opacity: calc(var(--star-opacity) * 0.3);
    transform: scale(0.7);
  }
  50% {
    opacity: var(--star-opacity);
    transform: scale(1.35);
  }
}

/* Off screen: hold every star still so none of them stay promoted. */
.paused .star {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .star {
    animation: none;
  }
}
</style>
