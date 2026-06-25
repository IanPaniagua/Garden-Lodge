# BUILD BRIEF — Garden Lodge website

**Agent: read this file first, then `brand/garden-lodge-brand-kit.md`.** This brief
defines what to build. The brand kit defines how everything must look. Treat both as
binding. When a request conflicts with the brand kit, follow the brand kit and flag it.

---

## 1. What this is

The public website for **Garden Lodge** — a community garden in Hamburg run as a small
agile project (sprints, backlog, progress log). The site tells the story, shows the work,
and hosts a growing, multilingual garden-knowledge library. It is **not** a commercial
services site yet; a Gartenpflege/services page may be added later.

**Project name:** Garden Lodge (keep this name in all languages).

**Content language:** the source content provided here is in English. The intended public
audience is Hamburg, so **German is the recommended primary language**. Confirm with the
owner before translating the marketing pages. The **Learning library is already trilingual
(EN/ES/DE)** and must stay that way with a language toggle.

---

## 2. Stack (use exactly this unless told otherwise)

- **Astro** (static output) + **Tailwind CSS**.
- **Content collections** for markdown (`content/`) and **data collections** (`type: 'data'`)
  with a **Zod schema** for the learning JSON (`data/learn/`) so a malformed entry fails the
  build loudly instead of silently.
- **No database, no backend.** All content is files in the repo.
- **Images:** committed to the repo; optimise with `astro:assets` (`<Image>`), serving
  webp/avif + lazy-load. Put source images under `src/assets/` (or `public/` for ones that
  don't need processing).
- **Video:** never self-hosted — embed YouTube/Vimeo.
- **Deploy:** Cloudflare Pages or Netlify (static). Set up a simple deploy and document it.

Initialise Tailwind from the tokens in the brand kit (§3 CSS variables and §4 Tailwind
config). Load Fraunces + Outfit per the brand kit. Honour `prefers-reduced-motion`.

---

## 3. Design system

`brand/garden-lodge-brand-kit.md` is the single source of truth for color, type, spacing,
radius, shadows, buttons, cards, pills, and the leaded-glass motif. Key reminders:

- 60/30/10 ratio; **aubergine, blue and green all clearly present** on every full page.
- Amber is the rare CTA accent — one per view.
- Headings in Fraunces, everything else in Outfit. Sentence case.
- The **stained-glass hero** is the signature — `brand/brand-vivo.html` is the approved
  reference implementation. Reuse its structure for the hero. Use the glass motif sparingly
  (one large + at most one small per page; never behind reading text).
- Follow the **§13 component-creation checklist** in the brand kit for every new component.

---

## 4. Sitemap & sections

A single long **Home** (anchored sections) plus a **Progress Log** blog. Wireframes are in
`wireframes/` — use them for layout intent, not the literal placeholder copy.

### Home
1. **Header / nav** — "Garden Lodge" wordmark with a small glass motif. Links: Why · How we work · Progress · Get involved. Language toggle EN/ES/DE.
2. **Hero (stained glass)** — brand name, one-line vision, one amber CTA, one secondary link. Based on `brand/brand-vivo.html`.
3. **Vision & mission** — from `content/vision-mission.md`. Two columns: text + a real garden photo.
4. **How we work** — the 4-step loop as icon cards (rotate jewel tones), from `content/how-we-work.md`.
5. **We work in sprints** — Sprint board + Backlog & ideas summary, with buttons that **link to the public Notion views** (placeholders for now — owner will supply URLs).
6. **Garden stages** — an illustrative band: sow → transplant → train → harvest (wireframe 04, top).
7. **Learning together** — the data-driven library (see §5). Show a preview here, full library on its own route.
8. **Latest from the Progress Log** — newest 3 entries with cover image, linking to the blog.
9. **Get involved** — join the group, WhatsApp, email, YouTube. One CTA.
10. **Footer** — brand mark, nav, social, credits.

> The wireframes also show a 4-quadrant "goals" grid with startup-style metrics
> (e.g. "1,000 active projects"). **Do not build that as-is** — it clashes with the brand
> voice. Replace with a short, honest "where we're heading" block, or omit. Confirm with owner.

### Progress Log (`/progress`)
- **Index:** cards in reverse-chronological order — date, cover image, sprint tag, summary. Source: `content/progress-log/*.md`.
- **Entry:** title, date, sprint tag, photos, body, prev/next.

### Learning library (`/learn`)
See §5.

---

## 5. Learning library — data-driven (important)

A growing, **standardised, multilingual** card library of garden knowledge. The owner adds
and removes entries over time by editing JSON and dropping an image in the repo — no code
changes. This is the one genuinely data-driven part of the site.

**Data location:** `data/learn/{tools,vegetables,flowers,fauna}.json` + `data/labels.json`.
Move these into the Astro project (e.g. `src/data/learn/`) and load via a data collection.

**Entry shape:** every entry shares a base (`id`, `category`, `name {en,es,de}`, `image`,
`summary {en,es,de}`, `tags`) plus a category-specific `data` block. Free text is `{en,es,de}`;
structured values are **codes** (e.g. `sun:"partial_sun"`, `sowMonths:[3,4,5]`) translated once
via `data/labels.json`. See the seed files for the exact fields per category.

**UI requirements:**
- A **category filter** (Tools · Vegetables · Flowers · Fauna) and a **language toggle (EN/ES/DE)**
  that switches every label and text field via `labels.json` + the `{en,es,de}` fields.
- **Standard card:** image + name (active language) + 3–4 key "useful data" badges
  (e.g. sun, water, sowing window for plants; role/affects for fauna; powered/own-or-rent for
  tools) + summary. The card shape is the same across categories; only which badges show adapts
  by category.
- **Detail view** (modal or `/learn/[id]`): full data rendered in the active language —
  months rendered from the `months` dictionary, companions, tips, etc.
- **Validation:** define a Zod schema (discriminated union on `category`) so an invalid entry
  fails the build with a clear message.
- **Adding an entry (document this in the repo README):** add an object to the right category
  JSON, drop `image` into the learn images folder, rebuild. New categories = new JSON file +
  add to the category dictionary in `labels.json`.

Images referenced by the seed data (`lettuce-lollo-bionda.jpg`, `hedge-trimmer.jpg`, etc.) are
placeholders — wire up graceful fallbacks for missing images so the build never breaks, and
list the expected filenames so the owner can supply photos.

---

## 6. Build order (suggested)

1. Scaffold Astro + Tailwind; wire brand tokens, fonts, base layout, `prefers-reduced-motion`.
2. Build the **stained-glass hero** from the reference; get it pixel-right and responsive (6→3 panes).
3. Base components: button variants, card, pill, section wrapper, nav + footer, language toggle.
4. Home sections 3–9 in order, pulling from `content/`.
5. Progress Log collection + index + entry pages.
6. Learning library: data collection + Zod schema + filter + language toggle + card + detail.
7. SEO basics (titles, meta, Open Graph, sitemap), accessibility pass (AA contrast, focus rings, alt text, keyboard nav).
8. Deploy to Cloudflare Pages/Netlify; document the deploy + "how to add content" in the repo README.

---

## 7. Definition of done

- Matches the brand kit (run the §13 checklist on each component).
- All three signature hues visible on the Home page; amber used only for CTAs.
- Learning library filters by category and toggles EN/ES/DE correctly, driven entirely by the JSON.
- Adding a progress entry = one markdown file; adding a learn card = one JSON object + one image.
- Lighthouse: green on performance and accessibility. No console errors.
- A repo `README.md` explains how to run, add content, and deploy.
