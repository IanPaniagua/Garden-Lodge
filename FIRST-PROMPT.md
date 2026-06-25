# First prompt for Claude Code

Open Claude Code in this folder and paste the message below as your first prompt.

---

You are building the Garden Lodge website. Before writing any code:

1. Read `BUILD-BRIEF.md` in full.
2. Read `brand/garden-lodge-brand-kit.md` — this is the binding design system.
3. Look at the wireframes in `wireframes/` for layout intent (ignore their placeholder copy).
4. Skim `content/`, `data/learn/` and `data/labels.json` to understand the content and the
   learning-library data model.

Then confirm back to me, in a short plan:
- the stack you'll set up (Astro + Tailwind per the brief),
- the folder structure you'll create,
- the build order,
- and any decisions you need from me (e.g. content language — English source is provided,
  German is recommended for the Hamburg audience; the site name is "Garden Lodge").

Do not start coding until I approve the plan. Once approved, start with:
(a) scaffolding Astro + Tailwind wired to the brand tokens and fonts, and
(b) the stained-glass hero, using `brand/brand-vivo.html` as the reference implementation.

Keep every component compliant with the §13 checklist in the brand kit. Use placeholder
fallbacks for any missing images so the build never breaks, and keep a running list of image
filenames I still need to supply.
