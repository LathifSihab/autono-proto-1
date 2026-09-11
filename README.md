# Prototype 1 — Basic package (€499)

A single-page marketing site with a contact form for **Prestige Automobile**, in
**Dutch**, built on the LuxAuto design system in `../../`. One of three prototypes sharing one visual
identity; this is the smallest scope in that set.

**Stack:** plain HTML, CSS and JS. No build step, no framework, no package manager.
Open `index.html` in a browser, or copy this folder onto any static host as-is.

---

## What is here

```
01-basic/
├── index.html            the one page
├── favicon.ico           16/32/48 px
├── apple-touch-icon.png  180 px
├── css/
│   ├── tokens.css        design-system tokens, copied verbatim from ../../tokens/
│   └── site.css          page styles, composed entirely from those tokens
├── js/
│   └── site.js           menu, scroll reveal, form validation (~200 lines, no deps)
└── assets/
    ├── brand/            logo-mark.svg, logo-mark-yellow.svg, favicon.svg, app-icon-512.png
    ├── cars/             six vehicle photographs, 600 w and 1200 w
    ├── hero-car-*.jpg    1400 w and 2400 w
    ├── showcase-*.jpg    1400 w and 2400 w
    └── og-image.jpg      1200 × 630 social card
```

Total page weight on first load is about 300 KB, of which roughly 240 KB is imagery.
The only external request is the Urbanist webfont from Google Fonts, inherited from
the design system's `tokens/fonts.css`.

---

## Scope

### In scope, and built

- One HTML page.
- A contact form on that page, with validation, inline errors and a confirmation state.
- Responsive from 320 px to 1440 px and beyond.
- Basic on-page metadata: title, description, canonical, favicon set, Open Graph and
  Twitter card, `theme-color`.

### Out of scope, and deliberately absent

Their absence is what makes the tier ladder legible, so please do not quietly add them:

- No CMS, no admin interface.
- No second page. No blog, no case studies, no separate privacy document. The footer
  says "Privacy statement and terms of sale available on request" rather than linking
  to a page that does not exist.
- No third-party integrations. Not even an icon CDN — see *Iconography* below.
- No SEO package: no keyword work, no structured data, no `sitemap.xml`, no
  `robots.txt` strategy. The metadata above is hygiene, not optimisation. That line is
  the difference between this tier and Prototype 2.
- No webshop, cart, prices-as-transactions, or payment.
- No multilingual support. The page is `lang="nl"` and single-language — Dutch only,
  with no language switcher, no `hreflang`, and no translated duplicate.

---

## The contact form

**This prototype does not send anything.** There is no endpoint and no network request.
`js/site.js` validates the input, shows inline errors, and swaps in a local
confirmation panel. This is deliberate: it demonstrates the full interaction without
requiring an inbox to be provisioned for a demo.

Validation covers: required name, valid email, optional-but-checked telephone, a
chosen enquiry type, a message of at least ten characters, and the consent checkbox.
Errors appear on blur and clear as soon as the field becomes valid — not on every
keystroke. Invalid submits move focus to the first bad field.

### Making it live

1. Create a form endpoint (Formspree, Web3Forms, or your own handler).
2. Add `action` and `method="post"` to `<form id="contact-form">` in `index.html`.
3. In `js/site.js`, replace the `window.setTimeout(...)` block in the submit handler
   with a `fetch()` to that endpoint, calling `showSuccess()` on a successful response
   and surfacing a failure message otherwise.

The markup already carries correct `name` attributes on every field, so most handlers
will work with no further changes.

---

## Design-system adherence

Everything is composed from `css/tokens.css`, which is a verbatim concatenation of
`../../tokens/*.css` in the order `../../styles.css` imports them. Re-copy that file
if the design system's tokens change; do not hand-edit it.

Rules taken directly from the system and honoured here:

| Rule | Where |
|---|---|
| Two stacked hairline header rows | `.site-header` |
| Nothing is sticky | **departed from** — see below |
| Chrome word once per page, above the fold, eclipsed by the car | `.hero__chrome` |
| Yellow appears at most once per viewport | hero CTA, band CTA, submit button — never two together |
| Hairlines only, `.08` → `.16` on hover; no card shadows | `.vehicle-card`, `.assurance`, every divider |
| Cards: `#0C0C0C`, 12 px radius, 12 px pad, 8 px media, photo scales 1.04, ↗ fills yellow on hover | `.vehicle-card` |
| 999 px radius on every interactive control | `.btn`, `.icon-btn`, `.field__control` |
| Blurred capsule over photography, veil under paragraphs | `.vehicle-card__year`, `.showcase::after` |
| 12 columns, 24 px gutters, 84 px margins, 1176 px max | `.container` |
| Grid 3 up desktop / 2 tablet / 1 mobile; 80 px between sections | `.card-grid`, `.section` |
| Motion: 120/200/400/700 ms on `cubic-bezier(.4,0,.2,1)`; reveals fade + 12 px rise | `.reveal`, all transitions |
| Voice: Title Case headlines, no exclamation marks, no emoji | all copy |
| Hamburger visible at desktop | **departed from** — see below |

### Three deliberate departures from the system

1. **The hamburger is mobile-only.** The design system says "the hamburger stays
   visible at desktop width", copied from a source screenshot where it is decorative.
   Here it is a real control, and beside a visible nav it is redundant — so it is
   hidden from 901 px up, exactly where the nav links appear. The two are mutually
   exclusive at every width; verified below.
2. **No Oxford comma.** The system mandates it, but that is an English convention —
   in Dutch, a comma before *en* in a plain list is incorrect. Dutch punctuation wins:
   "kwaliteit, authenticiteit en ongeëvenaarde verfijning".
3. **The header is sticky and hides on scroll.** The system says nothing is sticky.
   Here the header follows the page, fading and lifting away when you scroll down and
   returning when you scroll up, on every width. See below for how it stays on-system.

### Extrapolations, and why

The design system states plainly that **no forms, inputs, selects, checkboxes or
validation states appear anywhere in its source material**, so this tier had to invent
them. Each one is built from parts the system already defines, and each is flagged in
`css/site.css`:

- **Text fields and selects** — pill radius, 4 % white fill, hairline border, exactly
  like a quiet button. The select chevron is an inlined data-URI SVG.
- **Textarea** — cannot be a pill, so it takes `--radius-lg`, the system's large-panel
  radius.
- **Focus ring** — a 3 px yellow ring at 18 % opacity. The full `--glow-brand` is
  reserved by the system for a focused primary CTA, so fields get a restrained
  version rather than borrowing it.
- **Checkbox** — hairline box, brand yellow with a black check when selected.
- **Error text colour** — `--action-danger` (`#e82127`) clears 3:1 as a *border* but
  reaches only ~4.1:1 as small *text* on `#0E0E0E`. Error copy therefore uses a
  lightened derivation, `#f4595e`; the border still uses the token unchanged.

### The sticky header

The header sits at `position: sticky; top: 0` and carries two state classes, both set
by `js/site.js` from a `requestAnimationFrame`-throttled passive scroll listener:

- **`.is-stuck`** — past 8 px. The header stops being part of the page ground and
  becomes chrome floating over it, so it takes the system's blur-capsule treatment:
  `rgba(14,14,14,.72)` with `blur(12px)`, the same move and the same 72 % opacity as
  the spec pills on the vehicle cards. It also compacts, 72/60 px of row height down
  to 58/48, giving about 26 px back to the viewport.
- **`.is-hidden`** — scrolling down past 180 px. Fades to `opacity: 0` and lifts out on
  `translateY(-100%)`, both over `--dur-base` (200 ms) on `--ease-standard`, the
  system's own control timing. Any upward scroll brings it straight back.

At the very top of the page it is indistinguishable from the original static header:
full height, flat `--surface-page` ground, no blur, no shadow. The hero is never
covered.

Guards, each verified:

- It never hides while the mobile menu is open, or the panel would leave with it.
- It never hides while focus is inside it, and tabbing into a hidden header reveals it
  — otherwise a keyboard user would tab into something invisible.
- It never hides in the first 180 px, so a short page cannot hide its own navigation.
- Direction needs 6 px of travel to register, so scroll jitter cannot flicker it.
- `pageYOffset` is clamped at 0 against iOS rubber-band overscroll.
- `prefers-reduced-motion: reduce` drops the transition to nil via the existing global
  rule, so the header snaps rather than animating.

Two supporting changes were needed:

- `body` uses `overflow-x: clip` rather than `hidden`. `hidden` makes the body a scroll
  container, which silently breaks `position: sticky` on its children. `clip` does not.
- `section[id]` carries `scroll-margin-top`, so in-page links land clear of the header
  when a target is approached from below.

### Iconography

The design system ships Lucide from unpkg as CSS masks. A CDN request would violate
this tier's "no third-party integrations" line and would break a site dropped on an
offline host, so the twelve glyphs actually used are **inlined as an SVG sprite** at
the top of `index.html` and referenced with `<use>`. Lucide is ISC-licensed, so this
is permitted. No icon requests leave the page.

---

## The logo

The design system's mark is a bull-horn/steering-wheel hybrid belonging to *LuxAuto*,
supplied only as a soft 876 × 828 raster. This prototype is branded **Prestige
Automobile**, so a new mark was drawn as vector from scratch:

**The crest** — a flat-top shield tapering to a point, containing three grille slats
with the centre slat longest. Shield for prestige, grille for automobile. Drawn on a
64-unit grid with 4-unit strokes (the system's 1.5 px-on-24 px icon ratio exactly),
round caps and joins, so it sits in the same geometric family as the iconography.

It is monochrome and inherits `currentColor`, so it tints to any colour; it appears in
brand yellow in the header, footer and app icon. It stays legible down to 16 px.

Files: `assets/brand/logo-mark.svg` (tintable), `logo-mark-yellow.svg`,
`favicon.svg` (crest on a rounded dark tile), `app-icon-512.png`, plus `favicon.ico`
and `apple-touch-icon.png` at the root.

Three earlier directions were drawn and rejected: a ring-with-an-A (read as an anarchy
symbol), a hexagon-with-an-A (collided with the Angular logo), and a double chevron
(read as a scroll-to-top button).

The wordmark is set live in Urbanist — "PRESTIGE" at 600 weight and `.14em` tracking,
"AUTOMOBILE" beneath at 500 and `.34em` — rather than baked into the SVG, so it stays
sharp at every size.

---

## Photography

The design system's own car assets are 480 × 288, which is too low-resolution to look
like paid work. All imagery here was replaced with **Unsplash** photographs
(free for commercial use, no attribution required), chosen against the system's own
imagery rules: studio car photography on dark seamless, cool key light, deep contact
shadow, three-quarter front or profile.

They are downloaded, cropped and re-encoded locally — nothing hotlinks a CDN — and
served through `srcset`/`sizes` at two widths each, progressive JPEG, quality 84.

The hero photograph is a rectangle on a studio backdrop rather than a cutout, so its
edges are feathered away with a CSS `mask-image`: the centre stays opaque and eclipses
the chrome word exactly as the system describes, while the outer band dissolves into
the page.

---

## Language

The page is written in Dutch throughout: copy, form labels, validation messages,
`alt` text, `aria-label`s, metadata, and the text baked into the Open Graph image.

Localisation details worth keeping if the copy is rewritten:

- Prices use Dutch number formatting with a full stop as the thousands separator and a
  non-breaking space after the euro sign — `€ 189.500`, not `€189,500`.
- `lang="nl"` and `og:locale="nl_NL"`; the domain and email were moved to `.nl`.
- The confirmation sentence is assembled in `js/site.js` rather than slotting a name
  into fixed markup, because "Dank u wel, {naam}." needs the comma and full stop to
  move with the name — and reads correctly as plain "Dank u wel." when it is absent.
- The footer heading is "Snelle Links". The system's source says "Quick Link", singular,
  and instructs consumers to copy that quirk verbatim; an English typo is not worth
  reproducing in a Dutch translation.

The formal register (*u*, never *je*) matches the system's showroom-formal voice.

## Placeholder content

**Every business detail on this page is invented for demonstration and must be
replaced before the site goes live:**

- Company name, address (Gustav Mahlerlaan 24, Amsterdam), telephone, email, domain.
  A live Dutch site would also need a KvK number, a BTW number and a real
  privacy statement — none of which this tier includes.
- All six listings — models, years and prices. Four of the six photographs show cars
  that could be identified with confidence and are named accordingly; two show
  stylised studio shots whose model could not be verified, so those are listed under
  neutral descriptors ("Grand Tourer Coupé", "Mid-Engine Roadster") rather than
  asserting a marque that might be wrong.
- The statistics in the hero (48 automobiles, 19 marques, since 2012) and the
  two-hundred-point inspection claim.

---

## Verified

Checked in Chrome via the DevTools Protocol at real device metrics:

- No horizontal overflow at 320, 360, 390, 414, 620, 768, 900, 1100, 1280 or 1440 px.
- The hamburger and the nav links are never both visible and never both hidden. The
  handover is clean across the boundary: 898 px and 900 px show the hamburger,
  901 px and up show the nav links.
- The card grid steps 1-up → 2-up → 3-up and the contact grid 1-col → 2-col at the
  intended widths.
- The sticky header resolves to `position: sticky` and actually sticks (`top: 0`) at
  both 1440 px and 390 px; it hides on scroll down, returns on scroll up including on a
  40 px upward nudge, and un-sticks to full height back at the top.
- It stays visible when the menu is open and the page is scrolled down, and a hidden
  header reveals itself when focus enters it.
- Every in-page link lands with its heading clear of the header, approached from above
  and from below, at both widths.
- All eight images decode and the correct `srcset` candidate is selected at each width.
- Submitting the empty form flags exactly five fields; telephone is correctly optional.
- A filled form reaches the confirmation panel, personalised with the sender's first
  name ("Dank u wel, Anna.").
- A select value that is not one of the offered options is rejected rather than accepted.
- The menu panel opens and closes, and closes on Escape or an outside click.

Keyboard and assistive support: skip link, visible focus rings throughout, labels tied
to every control, `aria-invalid` and `aria-describedby` on errored fields, `role="status"`
on the confirmation, `aria-expanded`/`aria-controls` on the menu toggle, and decorative
SVG hidden with `aria-hidden`.

`prefers-reduced-motion: reduce` disables smooth scrolling, scroll reveals and the card
photo scale.
#   a u t o n o - p r o t o - 1  
 