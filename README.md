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
