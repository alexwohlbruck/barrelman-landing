import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  // Flat component imports, so <SiteNav /> resolves without a directory prefix.
  components: [{ path: '~/components', extensions: ['vue'], pathPrefix: false }],
  vite: { plugins: [tailwindcss()] },
  modules: ['@vueuse/motion/nuxt'],

  runtimeConfig: {
    public: {
      // Where the console and docs live. Split out so a staging deploy can
      // point at a staging API without a rebuild of every link.
      consoleUrl: process.env.NUXT_PUBLIC_CONSOLE_URL || 'https://api.barrelman.dev/console',
      docsUrl: process.env.NUXT_PUBLIC_DOCS_URL || 'https://api.barrelman.dev/docs',
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'https://api.barrelman.dev',
      githubUrl: 'https://github.com/alexwohlbruck/barrelman',
    },
  },

  app: {
    head: {
      title: 'Barrelman — the open geospatial API',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Search, geocoding, tiles, routing and transit from OpenStreetMap. One API, priced in credits, with a free tier that stops instead of billing you.',
        },
        { name: 'theme-color', content: '#fff9f3' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          // Inter for the interface, IBM Plex Mono for code and soundings, and
          // EB Garamond italic for the engraved chart labels — Garamond is
          // period-correct for the charts this borrows from. Exposure, the
          // titling face, is self-hosted from /fonts and preloaded below.
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@1,400;1,500&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap',
        },
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
