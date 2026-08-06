import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Geist is self-hosted from @fontsource, the same weights the Parchment app
  // loads — no third-party font request, and the two stay in step.
  css: [
    '@fontsource/geist-sans/400.css',
    '@fontsource/geist-sans/500.css',
    '@fontsource/geist-sans/600.css',
    '@fontsource/geist-sans/700.css',
    '@fontsource/geist-mono/400.css',
    '@fontsource/geist-mono/500.css',
    '~/assets/css/tailwind.css',
  ],
  // Flat component imports, so <SiteNav /> resolves without a directory prefix.
  components: [{ path: '~/components', extensions: ['vue'], pathPrefix: false }],
  vite: { plugins: [tailwindcss()] },
  modules: ['@vueuse/motion/nuxt'],

  runtimeConfig: {
    // Server-only. The demo route calls the API with this; it never reaches
    // the browser. Without it the hero demo answers 503 rather than rendering
    // an upstream 401 as though the API were down.
    barrelmanDemoKey: process.env.BARRELMAN_DEMO_KEY || '',
    // Where *this server* calls barrelman. Distinct from public.apiUrl below:
    // this one may be an internal address the browser cannot reach.
    barrelmanApiUrl: process.env.BARRELMAN_API_URL || 'http://localhost:5001',

    public: {
      // Where the console and docs live. Split out so a staging deploy can
      // point at a staging API without a rebuild of every link.
      //
      // Each is its own host, not a path on the API. They were previously
      // api.barrelman.dev/console and /docs, from when the API served all
      // three — both of those 404 now: the console is served from its own
      // origin so the session cookie stays same-origin with it, and the docs
      // are a separate Netlify site.
      //
      // These read BARRELMAN_* rather than NUXT_PUBLIC_* to match the
      // server-only names above. Nuxt still maps NUXT_PUBLIC_CONSOLE_URL and
      // friends onto these keys at runtime — that binding follows the key
      // name, not the expression here — so either name works, and the
      // NUXT_PUBLIC_ form is the one that applies without a rebuild.
      consoleUrl: process.env.BARRELMAN_CONSOLE_URL || 'https://console.barrelman.dev',
      docsUrl: process.env.BARRELMAN_DOCS_URL || 'https://docs.barrelman.dev',
      // Not BARRELMAN_API_URL: that name is taken by the server-only value
      // above, and the two are allowed to differ. Sharing one variable would
      // force the browser through whatever address the server uses.
      apiUrl: process.env.BARRELMAN_PUBLIC_API_URL || 'https://api.barrelman.dev',
      // Tiles are fetched by MapLibre in the browser, so this key is public by
      // necessity. It is scoped to `tiles` alone, revocable on its own, and
      // sits on an unmetered `demo`-plan account bounded per visitor — so the
      // worst case is someone else's basemap, not someone else's bill.
      tileKey: process.env.NUXT_PUBLIC_TILE_KEY || '',
      githubUrl: 'https://github.com/alexwohlbruck/barrelman',
    },
  },

  app: {
    head: {
      title: 'Barrelman',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'A geospatial data API for search, geocoding, vector tiles, routing, isochrones and live transit. Open data, open standards, open source.',
        },
        { name: 'theme-color', content: '#fff9f3' },
      ],
      link: [
        {
          // Without this the hero title reflows once Exposure arrives, because
          // the @font-face is only discovered after the CSS parses.
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/Exposure.woff2',
          crossorigin: 'anonymous',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
})
