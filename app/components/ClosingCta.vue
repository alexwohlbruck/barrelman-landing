<script setup lang="ts">
/**
 * The page turns to night here, and stays there through the footer.
 *
 * Parchment's --space is the ground: one dark region, at the end, where the
 * lookout actually works. It earns the name — everything above is the chart on
 * the table, this is the watch — and it gives the closing ask the only real
 * contrast on the page without introducing a colour the brand doesn't own.
 *
 * The globe sits under the ask, cropped by the bottom edge so only its upper
 * limb shows. A whole planet floating in the middle would be a logo; a horizon
 * is a place, which is the word the headline is trading on. It also puts the
 * atmosphere's rim light exactly where the section meets the footer, so the two
 * dark bands read as one sky rather than two panels.
 */
import { ArrowRight } from 'lucide-vue-next'

const { public: config } = useRuntimeConfig()

/** Three's payload arrives late; fade the globe in rather than popping it. */
const globeReady = ref(false)

/**
 * Start the globe's textures downloading with the page, not with the globe.
 *
 * `ClosingGlobe` is `.client`, so nothing it asks for can be requested until
 * ~600KB of three has been fetched, parsed and run. Measured cold, that put the
 * first byte of a texture at 2.4s against a load event at 0.44s — two seconds
 * where the connection is idle and the globe is a blank hole at the foot of the
 * page. Anyone who scrolled straight down watched it assemble, which is why it
 * read as loading *on* scroll; it never was gated on scroll.
 *
 * Declared here rather than in the globe for exactly that reason: this
 * component is server-rendered, so the links are in the markup the parser sees
 * and the fetches overlap the three chunk instead of queueing behind it.
 *
 * `fetchpriority: low` because 1.2MB of planet five screens down must never
 * compete with the hero, and `crossorigin` because three's ImageLoader sets
 * `crossOrigin = 'anonymous'` — without it the preload key does not match the
 * image request and the browser downloads both textures a second time.
 */
useHead({
  link: [
    { rel: 'preload', as: 'image', type: 'image/webp', href: '/textures/earth_albedo.webp', crossorigin: '', fetchpriority: 'low' },
    { rel: 'preload', as: 'image', type: 'image/webp', href: '/textures/clouds.webp', crossorigin: '', fetchpriority: 'low' },
  ],
})
</script>

<template>
  <section class="nightfall relative overflow-hidden">
    <!-- Faint gradient haze, then ~150 individual stars over it. The haze is
         the unresolvable background glow; the elements are the stars you can
         actually pick out, and the only ones that move. -->
    <div class="starfield pointer-events-none absolute inset-0" />
    <StarField />

    <div class="relative z-10 mx-auto max-w-2xl px-6 pb-16 pt-28 text-center">
      <h2 class="display mt-5 text-[clamp(2rem,4.4vw,3.2rem)] text-paper">
        The world is waiting
      </h2>
      <p class="mt-5 text-lead leading-relaxed text-fog">
        Everything is mapped, go build something worth the trip.
      </p>
      <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
        <a :href="config.consoleUrl" class="btn-base btn-brass group">
          Create an API key
          <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" stroke-width="1.5" />
        </a>
        <a :href="config.docsUrl" class="btn-base btn-night">Read the docs</a>
      </div>
    </div>

    <!--
      The horizon. The globe is square and always wider than the viewport, so
      what lands in this box is the top of the curve and the rest is below the
      fold of the section.

      Two numbers do the work:

      `--globe` is the canvas edge. `max()` against the viewport, never `min()`,
      because the arc has to reach both edges — cap it in pixels and a wide
      monitor gets a whole planet sitting in the middle with night either side.

      `0.1204` lifts the box so the limb clears the top of it. Both numbers are
      the projection rather than values found by nudging, and the projection is
      a perspective one: from a finite distance a sphere's silhouette is at
      `asin(r/z)`, not at `r/z`. Taking it as `r/z` — which the earlier
      derivation here did — understates the planet and, worse, understated the
      atmosphere enough to hide that the shell does not fit a 45° frame at all.
      It now sees 48.5° (see <ClosingGlobe>), through which the r=1.06 sphere
      covers tan(asin(1.06/3.1)) / tan(24.25°) = 0.808 of the frame, leaving
      0.096 of it above the limb. The remaining 0.024 is the lift that keeps
      the arc riding high on a wide screen, where the canvas is several times
      the height of this band; the `3rem` then lowers the whole thing to leave
      the atmosphere room to reach up into the text, which is the part that
      should touch it.

      Centring is `left-1/2` + `-translate-x-1/2`, not `inset-x-0 mx-auto`:
      auto margins resolve to zero once the box is wider than its container, so
      the earlier version pinned the globe to the left edge and pushed the
      whole horizon off-centre by the overflow.
    -->
    <div class="relative h-[clamp(7.5rem,18vw,15rem)] select-none" style="--globe: max(117.5vw, 50rem)">
      <div
        class="absolute left-1/2 aspect-square w-[var(--globe)] -translate-x-1/2 transition-opacity duration-1000 ease-out"
        :class="globeReady ? 'opacity-100' : 'opacity-0'"
        style="top: calc(var(--globe) * -0.1204 + 3rem)"
      >
        <ClosingGlobe @ready="globeReady = true" />
      </div>

      <!--
        No fade at the bottom edge. A gradient here smeared the lit surface
        into the footer over a hundred-odd pixels, which turned a clean crop
        into a grey wash. The section just ends: the planet runs under the
        footer the way it runs under everything else.
      -->
    </div>
  </section>
</template>
