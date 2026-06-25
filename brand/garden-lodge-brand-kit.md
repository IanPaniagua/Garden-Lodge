# Garden Lodge — Brand Kit & Design System

> **For the AI build agent:** This file is the single source of truth for all visual design.
> Read it before generating any page, layout, or component. Every new component you create
> must follow the rules in **§13 Component creation rules**. Never invent colors, fonts,
> radii, or shadows that are not defined here. When in doubt, prefer restraint.

The brand is inspired by an old **leaded stained-glass window**: jewel tones — aubergine,
indigo, blue, emerald, teal, amber — held together by dark lead lines and lit from behind.
The feeling is **alive, crafted, rooted, and warm** — a gardener's hands, not a corporate lawn-care chain.

---

## 1. Brand essence

| | |
|---|---|
| **Personality** | Crafted · grounded · warm · honest · a little artisanal |
| **Evoke** | Sunlight through old glass, hands in soil, patient seasonal work, quiet quality |
| **Avoid** | Sterile corporate green, clip-art leaves, neon "eco" gradients, stock-photo gloss |
| **One line** | "We tend gardens the way you tend soil." |

Design tension to hold: **vivid but earthy**. Colors are saturated and luminous (like lit glass),
never muddy — but the layout stays calm, spacious, and unpretentious.

---

## 2. Color palette

All brand color comes from the stained-glass window. These are the **exact, approved** values.

### Core jewel tones
| Token | Hex | Name | Primary use |
|---|---|---|---|
| `--gl-emerald` | `#1C7A4E` | Emerald green | **Primary** — the brand's anchor (gardening) |
| `--gl-moss` | `#4E8B3E` | Moss green | Supporting green, fills, illustration |
| `--gl-teal` | `#117E8B` | Petrol teal | Bridge between green & blue, secondary accents |
| `--gl-indigo` | `#21458F` | Deep indigo | **Secondary** — depth, headers, footers |
| `--gl-blue` | `#2E6BC6` | Glass blue | Luminous blue, links, highlights |
| `--gl-aubergine` | `#6A2A55` | Aubergine | **Signature** — the differentiator, use it visibly |
| `--gl-plum` | `#8A3A6E` | Living plum | Aubergine's brighter sibling, accents |
| `--gl-amber` | `#D49A2F` | Amber gold | **Accent / CTA** — warm, reserved for action & key highlights |

### Neutrals
| Token | Hex | Name | Use |
|---|---|---|---|
| `--gl-cream` | `#F6F1E6` | Glass cream | Default page background |
| `--gl-surface` | `#FFFFFF` | White | Cards, raised surfaces |
| `--gl-cream-2` | `#FCF9F2` | Soft cream | Alt sections / subtle banding |
| `--gl-ink` | `#241D26` | Ink (plum-black) | Default text color |
| `--gl-ink-soft` | `#5C5650` | Soft ink | Secondary text, captions |
| `--gl-lead` | `#16121A` | Lead | Stained-glass cames, dark frame, deepest contrast |

### State / hover shades
| Token | Hex | Use |
|---|---|---|
| `--gl-emerald-dark` | `#155E3C` | Emerald hover/active |
| `--gl-amber-dark` | `#B07F1E` | Amber hover/active |
| `--gl-indigo-dark` | `#193672` | Indigo hover/active |

### Tinted backgrounds (for pills, badges, soft cards)
| Token | Hex | Pair text with |
|---|---|---|
| `--gl-emerald-tint` | `#E3F1EA` | `--gl-emerald` |
| `--gl-teal-tint` | `#E6F4F6` | `--gl-teal` |
| `--gl-indigo-tint` | `#E7EEFB` | `--gl-indigo` |
| `--gl-blue-tint` | `#EAF1FC` | `--gl-indigo` |
| `--gl-aubergine-tint` | `#F3E6EF` | `--gl-aubergine` |
| `--gl-amber-tint` | `#FAEFD7` | `#3A2607` |

### Usage ratio (60 / 30 / 10)
- **60 %** neutral — cream / white backgrounds, ink text.
- **30 %** jewel tones — emerald, indigo, aubergine, teal, blue distributed across sections, cards, the glass motif.
- **10 %** amber — primary buttons, key highlights, active states. **Amber must stay rare** or it stops feeling special.

**Make aubergine, blue, and green all clearly present** on every full page — never let it become a one-green site.

### Text-on-color rules (accessibility)
Never use pure black or generic gray on a colored fill. Use these safe pairings:

| Background | Text color |
|---|---|
| Emerald, teal, indigo, blue, aubergine, plum, ink, lead (any dark jewel) | `--gl-cream` `#F6F1E6` or `#FFFFFF` |
| Amber `#D49A2F` | dark `#3A2607` |
| Cream / white / soft cream | `--gl-ink` `#241D26` (body) or a jewel tone (headings) |
| Any tint (`*-tint`) | the matching dark hue from the table above |

Target **WCAG AA** (≥ 4.5:1 for body text). The light jewel-blue `--gl-blue` on cream is fine for large text/links but use `--gl-indigo` for small body links to be safe.

---

## 3. Design tokens — CSS (paste into `:root`)

```css
:root {
  /* jewel tones */
  --gl-emerald:#1C7A4E; --gl-moss:#4E8B3E; --gl-teal:#117E8B;
  --gl-indigo:#21458F;  --gl-blue:#2E6BC6; --gl-aubergine:#6A2A55;
  --gl-plum:#8A3A6E;    --gl-amber:#D49A2F;
  /* neutrals */
  --gl-cream:#F6F1E6; --gl-cream-2:#FCF9F2; --gl-surface:#FFFFFF;
  --gl-ink:#241D26;   --gl-ink-soft:#5C5650; --gl-lead:#16121A;
  /* states */
  --gl-emerald-dark:#155E3C; --gl-amber-dark:#B07F1E; --gl-indigo-dark:#193672;
  /* tints */
  --gl-emerald-tint:#E3F1EA; --gl-teal-tint:#E6F4F6; --gl-indigo-tint:#E7EEFB;
  --gl-blue-tint:#EAF1FC; --gl-aubergine-tint:#F3E6EF; --gl-amber-tint:#FAEFD7;
  /* type */
  --font-display:'Fraunces', Georgia, serif;
  --font-ui:'Outfit', system-ui, sans-serif;
  /* radius */
  --r-sm:8px; --r-md:12px; --r-lg:16px; --r-xl:24px; --r-pill:999px;
  /* shadow */
  --shadow-sm:0 4px 14px rgba(36,29,38,.10);
  --shadow-md:0 6px 18px rgba(36,29,38,.12);
  --shadow-lg:0 18px 50px rgba(36,29,38,.30);
  /* spacing scale (rem) */
  --sp-1:.25rem; --sp-2:.5rem; --sp-3:.75rem; --sp-4:1rem;
  --sp-6:1.5rem; --sp-8:2rem; --sp-12:3rem; --sp-16:4rem; --sp-24:6rem;
  /* layout */
  --container:1120px;
}
body { background:var(--gl-cream); color:var(--gl-ink); font-family:var(--font-ui); line-height:1.6; }
```

---

## 4. Design tokens — Tailwind (extend `theme`)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        emerald:{ DEFAULT:'#1C7A4E', dark:'#155E3C', tint:'#E3F1EA' },
        moss:'#4E8B3E',
        teal:{ DEFAULT:'#117E8B', tint:'#E6F4F6' },
        indigo:{ DEFAULT:'#21458F', dark:'#193672', tint:'#E7EEFB' },
        glassblue:{ DEFAULT:'#2E6BC6', tint:'#EAF1FC' },
        aubergine:{ DEFAULT:'#6A2A55', tint:'#F3E6EF' },
        plum:'#8A3A6E',
        amber:{ DEFAULT:'#D49A2F', dark:'#B07F1E', tint:'#FAEFD7' },
        cream:{ DEFAULT:'#F6F1E6', 2:'#FCF9F2' },
        ink:{ DEFAULT:'#241D26', soft:'#5C5650' },
        lead:'#16121A',
      },
      fontFamily:{ display:['Fraunces','Georgia','serif'], ui:['Outfit','system-ui','sans-serif'] },
      borderRadius:{ sm:'8px', md:'12px', lg:'16px', xl:'24px' },
      boxShadow:{
        soft:'0 4px 14px rgba(36,29,38,.10)',
        card:'0 6px 18px rgba(36,29,38,.12)',
        glass:'0 18px 50px rgba(36,29,38,.30)',
      },
      maxWidth:{ container:'1120px' },
    },
  },
};
```

---

## 5. Typography

Two families only.

- **Fraunces** (serif) — display & headings. Warm, organic, a little old-world. Weights 600 / 700.
- **Outfit** (sans) — all UI, body, labels, buttons. Clean and friendly. Weights 300 / 400 / 500 / 600.

Load:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### Type scale
| Role | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Display / hero | Fraunces | `clamp(40px, 6vw, 64px)` | 700 | letter-spacing −.5px, line-height 1.05 |
| H1 | Fraunces | 40px | 600 | line-height 1.1 |
| H2 | Fraunces | 30px | 600 | line-height 1.15 |
| H3 | Outfit | 22px | 600 | UI section titles |
| H4 / lead-in | Outfit | 18px | 500 | |
| Body | Outfit | 17px | 400 | line-height 1.6, max-width ~68ch |
| Small / caption | Outfit | 14px | 400 | color `--gl-ink-soft` |
| Button / label | Outfit | 15px | 500 | |
| Eyebrow / overline | Outfit | 12px | 500 | letter-spacing .08em, may be UPPERCASE (the only allowed uppercase) |

### Rules
- Headlines = Fraunces. Everything functional = Outfit. Don't mix differently.
- **Sentence case everywhere** except tiny eyebrows.
- Two weights max per block. Never use weight 700 outside the hero display.
- Headings may be set in a jewel tone (emerald / indigo / aubergine); body stays ink.

---

## 6. The signature element — leaded stained glass

This is the **one motif that makes the brand recognizable.** Use it with intent, not everywhere.

**Where to use it:**
- The homepage hero (full glass panel behind the brand name). ✅
- Slim section dividers / banners between content blocks. ✅
- A single feature accent (e.g. behind a stat or quote). ✅

**Where NOT to use it:**
- Behind body text that must be read. ❌
- On every card or repeated tightly. ❌ (it becomes noise)
- More than ~1 large + 1 small instance per page. ❌

**Recipe (CSS):**
```css
.glass {
  position:relative; overflow:hidden;
  border-radius:var(--r-xl);
  border:6px solid var(--gl-lead);
  box-shadow:var(--shadow-glass, 0 18px 50px rgba(36,29,38,.30));
  background:var(--gl-lead);
}
.glass__panes {
  display:grid; gap:5px; background:var(--gl-lead);
  grid-template-columns:repeat(6, 1fr);   /* desktop: 6 cols */
  grid-auto-rows:1fr; min-height:340px;
}
.glass__pane { position:relative; }
/* the "light through glass" sheen — keep subtle */
.glass__pane::after {
  content:""; position:absolute; inset:0;
  background:linear-gradient(150deg, rgba(255,255,255,.32), rgba(255,255,255,0) 42%);
}
/* readable overlay for text on top of the panes */
.glass__overlay {
  position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center;
  padding:0 var(--sp-12);
  background:linear-gradient(90deg, rgba(22,18,26,.82) 0%, rgba(22,18,26,.55) 48%, rgba(22,18,26,.12) 100%);
}
@media (max-width:620px){ .glass__panes{ grid-template-columns:repeat(3,1fr); } }
```

**Pane color rules:** distribute the jewel tones so **aubergine, indigo, blue, emerald, teal, plum, moss, amber all appear**; scatter them (don't cluster all greens). Lead lines are always `--gl-lead`. The diagonal sheen stays low (≤ .35 alpha) — it's a hint of light, not a shine.

A working reference implementation lives in `brand-vivo.html` (the approved hero). Reuse its structure.

---

## 7. Spacing & layout

- **Scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 px (use the `--sp-*` tokens).
- **Container:** max-width `1120px`, centered, ≥ 18px side padding on mobile.
- **Section rhythm:** vertical padding `--sp-16` (4rem) desktop, `--sp-12` (3rem) mobile.
- **Generous whitespace is part of the brand.** When unsure, add more space, not more decoration.
- Alternate section backgrounds between `--gl-cream` and `--gl-surface` (or `--gl-cream-2`) for gentle banding.

---

## 8. Radius & elevation

- **Radius:** cards `--r-lg` (16px), inputs/small `--r-md` (12px), pills/buttons `--r-pill`. The glass panel uses `--r-xl` (24px).
- **No rounded corners on single-sided borders** (a `border-left` accent stays square).
- **Shadows are soft and low.** Use `--shadow-sm` / `--shadow-md` for cards, `--shadow-lg` only for the glass hero. No hard or neon shadows, no glow.

---

## 9. Buttons

Three variants. Primary action = **amber** (it pops against the cool palette).

```css
.btn { font-family:var(--font-ui); font-size:15px; font-weight:500;
  border-radius:var(--r-pill); padding:13px 26px; display:inline-block;
  cursor:pointer; border:1.5px solid transparent; transition:.15s ease; }

/* primary CTA */
.btn--cta { background:var(--gl-amber); color:#3A2607; }
.btn--cta:hover { background:var(--gl-amber-dark); }

/* solid secondary */
.btn--solid { background:var(--gl-emerald); color:var(--gl-cream); }
.btn--solid:hover { background:var(--gl-emerald-dark); }

/* ghost / outline */
.btn--ghost { background:transparent; color:var(--gl-ink); border-color:var(--gl-ink); }
.btn--ghost:hover { background:var(--gl-ink); color:var(--gl-cream); }

/* text link with underline accent */
.btn--link { padding:13px 4px; color:var(--gl-ink);
  border-bottom:2px solid var(--gl-amber); border-radius:0; }

/* focus ring (always) */
.btn:focus-visible { outline:none; box-shadow:0 0 0 3px rgba(212,154,47,.5); }
```

Rule: **one amber CTA per view.** Everything else is solid/ghost/link.

---

## 10. Cards

```css
.card { background:var(--gl-surface); border:1px solid #E7E1D2;
  border-radius:var(--r-lg); padding:var(--sp-6); box-shadow:var(--shadow-md); }
.card__icon { width:46px; height:46px; border-radius:var(--r-md);
  display:flex; align-items:center; justify-content:center; color:#fff; margin-bottom:var(--sp-4); }
.card h3 { font-family:var(--font-ui); font-size:18px; font-weight:600; margin:0 0 6px; }
.card p  { font-size:14px; color:var(--gl-ink-soft); margin:0; }
```

- Each card's icon chip uses **one jewel tone**; rotate tones across a card grid so a row shows green, aubergine, indigo, teal — never all the same.
- Card heading color may match its icon-chip tone.

---

## 11. Pills / badges / tags

```css
.pill { font-size:12px; font-weight:500; padding:5px 13px; border-radius:var(--r-pill);
  display:inline-block; margin:0 6px 6px 0; }
/* example */
.pill--emerald   { background:var(--gl-emerald-tint);   color:var(--gl-emerald); }
.pill--aubergine { background:var(--gl-aubergine-tint);  color:var(--gl-aubergine); }
.pill--indigo    { background:var(--gl-indigo-tint);     color:var(--gl-indigo); }
.pill--amber     { background:var(--gl-amber-tint);      color:#3A2607; }
```

Always pair a `*-tint` background with its matching dark hue for text (see §2 table).

---

## 12. Icons, imagery & illustration

- **Icons:** outline style, ~1.75px stroke, single color (ink or a jewel tone). Consistent set — pick one library (e.g. Lucide / Tabler outline) and stick to it.
- **Photography:** real, natural-light garden/soil/plant photos. Warm, unstaged. Avoid glossy stock and heavy filters. If a photo sits behind text, add the same lead-toned overlay used in `.glass__overlay`.
- **Illustration / shapes:** organic, leaf/seed forms in jewel tones over cream; flat, no skeuomorphism.
- **Never:** rainbow gradients, drop-shadowed clip-art, AI-glossy "eco" imagery.

---

## 13. Component creation rules ⭐ (apply every time you build anything new)

Before shipping any new component, confirm **all** of these:

1. **Colors only from tokens** — no raw hex outside the defined palette. Pull from `--gl-*`.
2. **60/30/10 respected** — mostly neutral, jewel tones for character, amber rare (≤ one CTA per view).
3. **All three signature hues present on a full page** — aubergine, blue, and green must each appear; don't drift to all-green.
4. **Type rule** — headings in Fraunces, everything else in Outfit. Sentence case. Two weights max.
5. **Radius & shadow from the scale** — `--r-*` and the three soft shadows only. No glow, no hard shadows.
6. **Spacing from the scale** — `--sp-*`. Err toward more whitespace.
7. **Contrast AA** — use only the approved text-on-color pairings (§2). Mentally test on the darkest jewel.
8. **Focus states** — every interactive element gets the amber focus ring.
9. **Glass motif used sparingly** — at most one large + one small instance per page, never behind reading text.
10. **Responsive** — glass panes collapse 6→3 cols; type uses `clamp()`; container padding holds on mobile.
11. **Voice** — warm, honest, unpretentious (see §15). No corporate jargon, no over-promising.
12. **Restraint test** — if a component has more than 2 jewel tones competing for attention, remove one.

If a request conflicts with these rules, follow the rules and flag the conflict.

---

## 14. Accessibility checklist

- Body text ≥ 4.5:1 contrast; large text ≥ 3:1.
- Don't rely on color alone to convey meaning (pair with icon/label).
- Focus-visible ring on all interactive elements.
- Hit targets ≥ 44×44px.
- Respect `prefers-reduced-motion` — disable the sheen animation / transitions if set.
- Alt text on all meaningful images.

---

## 15. Voice & tone

Warm, grounded, plain-spoken. The brand is a person who learns by doing and respects the seasons.

- **Do:** speak simply and honestly; lead with care and craft; use concrete garden language.
- **Don't:** use buzzwords ("synergy", "best-in-class"), over-promise, or sound like a franchise.
- **Example line:** "We tend gardens the way you tend soil — patiently, every season."

**Language:** the brand name stays **"Garden Lodge"** in all languages. Client-facing website copy
should be written in the site's target language (for Hamburg, German); keep tone identical across languages.
(This brand-kit document itself is kept in English as the project convention.)

---

## 16. Quick reference

```
PRIMARY      emerald   #1C7A4E
SECONDARY    indigo    #21458F
SIGNATURE    aubergine #6A2A55
ACCENT/CTA   amber     #D49A2F     (rare)
BRIDGE       teal      #117E8B
LIGHT BLUE   blue      #2E6BC6
BG           cream     #F6F1E6   |  surface #FFFFFF
TEXT         ink       #241D26   |  soft #5C5650
LEAD/FRAME   lead      #16121A

DISPLAY/HEAD  Fraunces 600–700
UI/BODY       Outfit  300–600
RADIUS        8 / 12 / 16 / 24 / pill
SHADOW        soft only
RATIO         60 neutral · 30 jewel · 10 amber
MOTIF         leaded stained glass — sparingly
```

*Reference implementation: `brand-vivo.html`. Palette swatches: `paleta-viva.png`.*
