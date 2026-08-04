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
