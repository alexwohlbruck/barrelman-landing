# barrelman-landing

Marketing site for the Barrelman API. Nuxt 4 + Tailwind v4, deployed as a
static/SSR build.

```bash
bun install
bun run dev        # http://localhost:5200
bun run build
```

## Design

Deliberately the inverse of [parchment-landing](../parchment-landing): that is a
consumer map — warm paper, brown ink, cool blue accent, display serif. This is
the engine sold to developers, so it runs dark like the tools its buyers live
in, uses tight Inter instead of a serif, and puts a mono face on anything
numeric.

The palette is the crow's nest at night: deep ink sea (`--background`) with a
signal amber lantern (`--signal`). Amber-on-ink inverts Parchment's
blue-on-paper, which keeps the two recognisably related without either looking
like a restyle of the other.

Tokens live in `app/assets/css/tailwind.css` under `@theme inline`, the same
structure Parchment uses — so anything learned there transfers.

## Structure

Each section is a self-contained component; reorder or drop them in
`app/pages/index.vue` without touching the others.

| Component | Purpose |
|---|---|
| `SiteNav` | Floating nav, condenses on scroll |
| `SiteHero` | Headline, CTAs, and the request/response sample |
| `CodeWindow` | Tabbed curl samples with per-request credit cost |
| `CapabilityGrid` | The eight endpoint groups, doubling as the price list |
| `OpenSourceBand` | The self-host argument |
| `PricingTable` | Four purchasable tiers plus Enterprise |
| `ClosingCta` | Final sign-up |
| `SiteFooter` | Links, attribution |
| `BrandMark` | The logo — one file, swap freely |

## Known gaps

Deliberate, so they are easy to find later:

- **Pricing is duplicated.** `PricingTable` and `CapabilityGrid` restate the
  figures from barrelman's `src/billing/plans.ts` so the site builds statically
  with no API dependency. `GET /account/plans` is the source of truth if they
  drift — wire them up if that becomes a problem.
- **No `/terms` or `/privacy` pages.** The footer links to them and they 404.
  Barrelman gates API-key creation on terms acceptance via `BARRELMAN_TOS_URL`,
  so these need writing before launch.
- **No deploy config.** Parchment uses Netlify with `nitro.preset: 'netlify'`.
- **The hero graticule is CSS**, standing in for something bespoke.
- **No analytics, no OG image, no sitemap.**

## Environment

```dotenv
NUXT_PUBLIC_CONSOLE_URL=https://api.barrelman.dev/console
NUXT_PUBLIC_DOCS_URL=https://api.barrelman.dev/docs
NUXT_PUBLIC_API_URL=https://api.barrelman.dev
```
