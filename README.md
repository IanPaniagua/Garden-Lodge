# Garden Lodge — website

The public website for **Garden Lodge**, a community garden in Hamburg run as a
small agile project. Built with **Astro** (static) + **Tailwind CSS**, with a
trilingual garden-knowledge library backed by **Insforge**. Local JSON files are
kept as seed/fallback data so the site still builds without credentials.

The design follows [`brand/garden-lodge-brand-kit.md`](brand/garden-lodge-brand-kit.md)
(the binding design system) and the build spec in [`BUILD-BRIEF.md`](BUILD-BRIEF.md).

---

## Run it locally

Requires **Node ≥ 20** and **pnpm**.

```bash
pnpm install      # first time only
pnpm dev          # start the dev server → http://localhost:4321
pnpm build        # production build → ./dist
pnpm preview      # preview the production build locally
pnpm check        # type-check + diagnostics
pnpm seed:insforge # upload data/learn seed cards to Insforge
```

> The first install builds native deps (`sharp`, `esbuild`). They're pre-approved
> in `pnpm-workspace.yaml` (`allowBuilds`), so no prompt is needed.

---

## Project structure

```
garden-lodge-site/
├── content/                  ← editable copy (markdown)
│   ├── vision-mission.md
│   ├── how-we-work.md
│   └── progress-log/         ← one markdown file per blog entry
├── data/                     ← seed data + Insforge schema notes
│   ├── insforge/learn_cards.sql
│   ├── learn/{tools,vegetables,flowers,fauna}.json
│   └── labels.json           ← code → EN/ES/DE label dictionary
├── src/
│   ├── assets/{learn,progress,site}/   ← drop photos here (optimised at build)
│   ├── components/           ← Glass hero, cards, nav, footer, language toggle…
│   ├── content.config.ts     ← collections + Zod schemas (validation)
│   ├── layouts/Base.astro    ← head, SEO/OG, fonts, nav + footer
│   ├── lib/                  ← i18n, image resolver, helpers
│   ├── pages/                ← index, /learn, /learn/[id], /progress, /progress/[slug]
│   └── styles/global.css     ← brand tokens + component CSS
├── public/                   ← favicon, og image, robots, _headers
└── astro.config.mjs
```

Content authoring folders (`content/`, `data/`) stay at the repo root so they're
easy to edit; Astro's loaders read them from there.

---

## How to add content

### Admin studio

The private operations dashboard lives at `/admin` and is intentionally not linked
from the public navigation. It is `noindex` and is for Garden Lodge maintainers.

It connects to InsForge and currently manages:

- epics/sprints with the Garden Lodge loop: set a goal, learn how it's done,
  apply it, leave it better
- backlog items
- progress media uploads to the `garden-media` bucket

The backend tables are `epics`, `backlog_items` and `media_assets`. Public reads
are limited by RLS, while inserts/updates/deletes require an authenticated
InsForge user. `/progress`, `/sprints` and `/backlog` read public records from
InsForge during dev/build and fall back to local repo content if InsForge cannot
be reached.

### A new progress-log entry
1. Add a markdown file to [`content/progress-log/`](content/progress-log), e.g.
   `03-composting.md`:
   ```markdown
   ---
   title: Composting, properly
   date: 2026-05-10
   sprint: Sprint 3
   cover: progress/sprint-3-compost.jpg
   summary: One-line summary shown on the cards.
   ---

   Body text in markdown…
   ```
2. Drop the cover photo at `src/assets/progress/sprint-3-compost.jpg`
   (filename must match `cover`, minus the `progress/` prefix).
3. Rebuild. Entries sort newest-first automatically.

### Insforge learning database

The learning library reads from the Insforge table `learn_cards` when these
environment variables are set:

```bash
INSFORGE_URL=http://localhost:7130
INSFORGE_API_KEY=your-server-admin-key
INSFORGE_LEARN_REGION=hamburg
```

Create the table with [`data/insforge/learn_cards.sql`](data/insforge/learn_cards.sql),
then seed the current Hamburg cards:

```bash
pnpm seed:insforge
```

If Insforge is not configured, Astro falls back to the local seed files under
`data/learn`. Set `INSFORGE_STRICT=true` in CI/production if a DB error should
fail the build instead of falling back.

### Support payment link

The public support button redirects to a hosted payment page. By default it uses
the Garden Lodge PayPal link, and it can be overridden with this public build
environment variable in Cloudflare:

```bash
PUBLIC_DONATION_URL=https://paypal.me/ianpaniagua
```

Accepted public payment links start with `https://paypal.me/`,
`https://www.paypal.com/`, or `https://buy.stripe.com/`. If the variable is
missing or does not match one of those providers, the support button falls back
to the default PayPal link. Do not add payment-provider secret keys to
frontend/public environment variables.

### A new learning-library card
1. Add one object to the right file in [`data/learn/`](data/learn) (matching the
   shape of the existing entries — `id`, `category`, `name {en,es,de}`, `image`,
   `summary {en,es,de}`, optional `scientificName`, `tags`, and a
   category-specific `data` block).
2. Drop the photo at `src/assets/learn/<image>.jpg` (filename must match `image`).
3. Run `pnpm seed:insforge` when the card is ready for the shared database.
4. Rebuild. The card and its `/learn/<id>` detail page are generated, and it stays
   trilingual via `data/labels.json`.

Structured values are **codes** (e.g. `"sun": "partial_sun"`) translated once in
`labels.json` — never hardcode translated words in the entry except in the free-text
`{en,es,de}` fields (`summary`, `tips`, `use`, `howTo`, …).

> **Validation:** a malformed entry **fails the build** with a clear message
> (Zod discriminated union on `category`). That's intentional — a typo can't ship
> silently.

### A new learning category
1. Create `data/learn/<category>.json` and add `<category>` to the `learnFiles`
   list in [`src/content.config.ts`](src/content.config.ts) plus a schema branch.
2. Add the category to the `categories` block in `labels.json`.
3. Add a tone in `categoryTone` and badges in `cardBadges`
   ([`src/lib/learn.ts`](src/lib/learn.ts)).

### Videos
Upload to YouTube/Vimeo and embed — never commit video files (brief §2).

### Notion links (sprint board / backlog)
Placeholders for now. Set the real public Notion URLs in
[`src/lib/site.ts`](src/lib/site.ts) (`links.sprintBoard`, `links.backlog`), plus
the WhatsApp / email / YouTube / join links there.

---

## Images still needed

Filenames are referenced by the seed content. Until supplied, the site renders a
graceful placeholder (the build never breaks). Drop real photos at these paths and
rebuild:

| Path | Used by |
|---|---|
| `src/assets/site/vision-garden.jpg` | Vision & mission section |
| `src/assets/progress/sprint-1-clearing.jpg` | Progress entry 1 cover |
| `src/assets/progress/sprint-2-plantings.jpg` | Progress entry 2 cover |
| `src/assets/learn/lettuce-lollo-bionda.jpg` | Learn card |
| `src/assets/learn/lettuce-eichenlaub.jpg` | Learn card |
| `src/assets/learn/potato-bag.jpg` | Learn card |
| `src/assets/learn/marigold.jpg` | Learn card |
| `src/assets/learn/sunflower.jpg` | Learn card |
| `src/assets/learn/hand-trowel.jpg` | Learn card |
| `src/assets/learn/garden-rake.jpg` | Learn card |
| `src/assets/learn/hedge-trimmer.jpg` | Learn card |
| `src/assets/learn/ladybug.jpg` | Learn card |
| `src/assets/learn/earthworm.jpg` | Learn card |
| `src/assets/learn/aphid.jpg` | Learn card |

Use real, natural-light garden photos (brand kit §12). Landscape ~4:3 works best
for cards; the vision photo can be portrait.

For plants, crops and fauna, verify the photo by scientific name first, then add
`imageSource`, `imageCredit` and `imageLicense` when the image is not owned by
Garden Lodge. Prefer this order: own Hamburg/Garden Lodge photos, Wikimedia
Commons/iNaturalist/PlantNet/GBIF with license checked, and AI images only for
non-species-specific educational illustrations.

The social preview image (`public/og-default.png`) is generated from the brand
palette with `pnpm og` — re-run if you change the wordmark/tagline.

---

## Deploy — Cloudflare Pages

Static output, no adapter needed.

**Via the dashboard (recommended):**
1. Push this repo to GitHub/GitLab.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist`
   - **Environment variable:** `NODE_VERSION = 20` (also pinned in `.nvmrc`)
4. Deploy. Cloudflare gives you a `*.pages.dev` URL; add a custom domain later.

**Before going live:** set the real domain in `site:` in
[`astro.config.mjs`](astro.config.mjs) and the `Sitemap:` line in
[`public/robots.txt`](public/robots.txt) so canonical URLs, the sitemap and OG
tags are correct.

**CLI alternative:** `pnpm build && pnpm dlx wrangler pages deploy dist`.

---

## Notes

- **Languages:** marketing pages are English; the learning library is fully
  EN/ES/DE with a toggle (top-right). The toggle flips `html[data-lang]`, which is
  remembered in `localStorage`. Works with JavaScript disabled (defaults to English).
- **Accessibility:** AA contrast pairings, focus rings, skip link, keyboard-friendly
  nav/filter, `prefers-reduced-motion` honoured (the glass sheen stops).
- **The stained-glass hero** is the signature element — reference build is
  [`brand/brand-vivo.html`](brand/brand-vivo.html). Use the motif sparingly
  (one large + at most one small per page).
