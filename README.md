# barrelman-landing

Marketing site for the Barrelman API. Nuxt 4 + Tailwind v4, deployed as a
static/SSR build.

```bash
bun install
bun run dev        # http://localhost:5200
bun run build
```

## Design

Barrelman wears the Parchment brand, drawn as a **sea chart**.

The palette, the paper and the display face are shared with
[parchment-landing](../parchment-landing) — the same warm paper (`#fff9f3`),
brown ink (`#3f2f1e`), blue (`#0093f2`) and Exposure titling. What differs is
the *document*. Parchment's site is a modern map with a rendered globe on it;
this is the 17th-century portolan the map was drawn from: neatline border,
rhumb-line network, compass rose, engraved rules, and a rubricated red for the
things a cartographer would have inked in red.

So the two read as the same house without either looking like a restyle of the
other: one is the map, this is the chart.

### Palette

| Token | Value | Use |
|---|---|---|
| `--paper` / `--paper-aged` / `--paper-deep` | `#fff9f3` … `#eddfc9` | Ground, panels, bands |
| `--ink` / `--ink-soft` / `--ink-faint` | `#3f2f1e` … `#cbbdad` | Type, three weights |
| `--rule` / `--rule-strong` | tans | Hairline rules — the whole layout is ruled, not carded |
| `--brand` | `#0093f2` | Parchment's blue: water, links, live data |
| `--rubric` | `#b4472e` | The vermilion a chartmaker reserved for hazards and initials. Barrelman's own accent |
| `--verdigris` | `#56795e` | Portolan half-winds, and affirmative ticks |
| `--space` / `--fog` / `--brass` | `#081628`, … | The night band at the foot of the page |

`--space` is Parchment's token too, used here for one dark region at the end —
the watch, which is when a barrelman actually works.

### Type

| Face | Role |
|---|---|
| **Exposure** | Titling. Parchment's variable display face, self-hosted from `/fonts`, at `EXPO -12` |
| **Inter** | Interface and body |
| **EB Garamond**, italic | Engraved chart labels and captions — Garamond is period-correct for the charts this borrows from |
| **IBM Plex Mono** | Code, and the credit "soundings" |

### Two things to know before editing

- **Background layers must not use a negative z-index.** `-z-10` puts them
  behind `<body>`'s own background, which paints later, and they vanish
  completely. Use `z-0` on the layer and `relative z-10` on the content.
- **The `.ruled` feint lines are period-locked to 22px**, matching the
  `line-height` of the mono text sitting on them. Change one and you must
  change the other or the ink drifts off the rule.

Tokens live in `app/assets/css/tailwind.css` under `@theme inline`, the same
structure Parchment uses — so anything learned there transfers.

## Structure

Each section is a self-contained component; reorder or drop them in
`app/pages/index.vue` without touching the others.

| Component | Purpose |
|---|---|
| `SiteNav` | Ruled title band; gains paper and a double rule on scroll |
| `SiteHero` | Headline and CTAs over the chart |
| `RhumbLines` | The loxodrome network, with `CompassRose` nested at its principal hub |
| `CompassRose` | 32-point rose, generated from angles |
| `CodeWindow` | Request and reply as a ship's log — ruled leaves, index tabs |
| `SectionHead` | The shared legend-label / fleuron / title block |
| `CapabilityGrid` | The eight endpoint groups as a ruled chart legend, priced in soundings |
| `OpenSourceBand` | The self-host argument, set in a cartouche |
| `PricingTable` | Four purchasable tiers plus Enterprise, as a table of rates |
| `ClosingCta` | Final sign-up, on the night band |
| `SiteFooter` | Links, attribution — continues the night band |
| `BrandMark` | The logo — a rose with the crow's nest at its axis. One file, swap freely |

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
- **The chart is generated, not drawn.** The rhumb network and rose are SVG
  built from angles, and the paper is `feTurbulence`. That is deliberate — it
  costs nothing to ship — but a real engraved coastline would beat it.
- **No analytics, no OG image, no sitemap.**

## Environment

```dotenv
NUXT_PUBLIC_CONSOLE_URL=https://api.barrelman.dev/console
NUXT_PUBLIC_DOCS_URL=https://api.barrelman.dev/docs
NUXT_PUBLIC_API_URL=https://api.barrelman.dev
```
