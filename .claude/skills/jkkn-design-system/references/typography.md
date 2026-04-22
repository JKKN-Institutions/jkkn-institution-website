# Typography — Fonts & Font Sizes

## Font Family

**Primary font:** Poppins — the only font loaded by default.

### Loader (already in place)

`app/layout.tsx` loads Poppins once via `next/font/google`:

```typescript
import { Poppins } from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  adjustFontFallback: true,
  preload: false,
});
```

Only weights **400**, **600**, and **700** are bundled. Do not use 300, 500, 800, or 900 — they will fall back to the nearest available weight.

The `poppins.variable` is applied to `<body className={poppins.variable}>` in `app/layout.tsx`, exposing `--font-poppins` globally.

### Accessing Poppins in Code

Use any of these — **do not re-import the font**:

| Context         | Preferred form                          |
|-----------------|-----------------------------------------|
| Tailwind class  | `font-sans` (mapped to `--font-poppins` via `@theme inline`) |
| Inline style    | `fontFamily: 'var(--font-poppins)'`     |
| Plain CSS       | `font-family: var(--font-poppins), 'Poppins', ui-sans-serif, system-ui, sans-serif;` |

`body`, `h1`–`h6`, and the `.ProseMirror` editor all default to Poppins already.

### Additional Font-Family Stacks (Page-Level Override Only)

`app/globals.css :root` exposes alternate stacks for the CMS page-builder font picker. They are NOT loaded by default — they only apply when explicitly set on a `.page-font-wrapper` element by a CMS editor. Do not reference these for regular components.

| CSS variable               | Stack                                                 |
|----------------------------|-------------------------------------------------------|
| `--font-stack-poppins`     | `'Poppins', ui-sans-serif, system-ui, sans-serif`     |
| `--font-stack-inter`       | `'Inter', ui-sans-serif, system-ui, sans-serif`       |
| `--font-stack-roboto`      | `'Roboto', ui-sans-serif, system-ui, sans-serif`      |
| `--font-stack-montserrat`  | `'Montserrat', ui-sans-serif, system-ui, sans-serif`  |
| `--font-stack-open-sans`   | `'Open Sans', ui-sans-serif, system-ui, sans-serif`   |
| `--font-stack-lato`        | `'Lato', ui-sans-serif, system-ui, sans-serif`        |
| `--font-stack-playfair`    | `'Playfair Display', ui-serif, Georgia, serif`        |

Non-Poppins fonts are loaded on-demand by `DynamicFontLoader` only when a page-level setting requires them.

### Monospace

For `code`, `pre`, `kbd`:

```css
font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
```

This is applied automatically inside `[data-page-builder-block]` and `.ProseMirror` — no action needed.

---

## Font Weights

| Weight | Tailwind class  | Usage                                      |
|--------|-----------------|--------------------------------------------|
| 400    | `font-normal`   | Body copy, paragraphs                      |
| 600    | `font-semibold` | Subheadings, h1–h6 default, card titles    |
| 700    | `font-bold`     | Emphatic headings, stat numbers, badges    |

Headings `h1`–`h6` receive `font-semibold tracking-tight` automatically via the base layer.

---

## Heading Scale (Auto-Applied)

`app/globals.css @layer base` attaches responsive sizes to every heading element. These cascade — do **not** re-specify them on individual headings unless the design genuinely diverges.

| Element | Mobile (default) | `sm:` (≥640px) | `md:` (≥768px) | `lg:` (≥1024px) |
|---------|------------------|----------------|----------------|-----------------|
| `h1`    | `text-2xl` (1.5rem / 24px)   | `text-3xl` (30px) | `text-4xl` (36px) | `text-5xl` (48px) |
| `h2`    | `text-xl` (1.25rem / 20px)   | `text-2xl` (24px) | `text-3xl` (30px) | `text-4xl` (36px) |
| `h3`    | `text-lg` (1.125rem / 18px)  | `text-xl` (20px)  | `text-2xl` (24px) | `text-3xl` (30px) |
| `h4`    | `text-base` (1rem / 16px)    | `text-lg` (18px)  | `text-xl` (20px)  | `text-2xl` (24px) |
| `h5`    | `text-sm` (0.875rem / 14px)  | `text-base` (16px) | `text-lg` (18px) | `text-xl` (20px) |
| `h6`    | `text-sm` (14px)             | `text-base` (16px) | `text-lg` (18px) | —               |

---

## Tailwind Font-Size Scale (for non-heading text)

Standard Tailwind v4 ramp — use these for body, captions, labels, buttons.

| Class       | Value (rem) | Pixels |
|-------------|-------------|--------|
| `text-xs`   | `0.75rem`   | 12px   |
| `text-sm`   | `0.875rem`  | 14px   |
| `text-base` | `1rem`      | 16px   |
| `text-lg`   | `1.125rem`  | 18px   |
| `text-xl`   | `1.25rem`   | 20px   |
| `text-2xl`  | `1.5rem`    | 24px   |
| `text-3xl`  | `1.875rem`  | 30px   |
| `text-4xl`  | `2.25rem`   | 36px   |
| `text-5xl`  | `3rem`      | 48px   |
| `text-6xl`  | `3.75rem`   | 60px   |
| `text-7xl`  | `4.5rem`    | 72px   |

---

## Responsive Body Utilities (Custom)

`app/globals.css @layer utilities` defines pre-baked responsive ramps. Prefer these for CMS block body text so mobile/tablet/desktop scale in sync with headings.

| Utility                  | Expands to                              |
|--------------------------|-----------------------------------------|
| `.text-responsive-xs`    | `text-xs sm:text-sm`                    |
| `.text-responsive-sm`    | `text-sm sm:text-base`                  |
| `.text-responsive-base`  | `text-sm sm:text-base lg:text-lg`       |
| `.text-responsive-lg`    | `text-base sm:text-lg lg:text-xl`       |
| `.text-responsive-xl`    | `text-lg sm:text-xl lg:text-2xl`        |
| `.text-responsive-2xl`   | `text-xl sm:text-2xl lg:text-3xl`       |
| `.text-responsive-3xl`   | `text-2xl sm:text-3xl lg:text-4xl`      |
| `.text-responsive-4xl`   | `text-2xl sm:text-4xl lg:text-5xl`      |
| `.text-responsive-5xl`   | `text-3xl sm:text-4xl lg:text-5xl xl:text-6xl` |
| `.text-responsive-6xl`   | `text-3xl sm:text-5xl lg:text-6xl xl:text-7xl` |

---

## Prose (Tailwind Typography) Overrides

`.prose` content has customized responsive sizing (see `app/globals.css :208-283`):

| Element                 | Responsive size                          |
|-------------------------|------------------------------------------|
| `.prose` (base)         | `text-sm sm:text-base lg:text-lg`        |
| `.prose h1`             | `text-2xl sm:text-3xl md:text-4xl`       |
| `.prose h2`             | `text-xl sm:text-2xl md:text-3xl`        |
| `.prose h3`             | `text-lg sm:text-xl md:text-2xl`         |
| `.prose h4`             | `text-base sm:text-lg md:text-xl`        |
| `.prose p`, `.prose li`, `.prose blockquote` | `text-sm sm:text-base lg:text-lg` |

Use `.prose` for any long-form rich-text content (CMS body copy, blog posts).

---

## Stat Number Class

For large metric displays on the homepage and dashboards:

```css
.stat-number {
  font-family: 'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif;
  /* Responsive: text-xl min-[400px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold */
  font-variant-numeric: tabular-nums;
}
```

`tabular-nums` prevents CLS (Cumulative Layout Shift) when animating counters.

---

## Decision Flowchart

```
Need to style text?
│
├── Is it h1-h6?                      → Do nothing; base layer handles it.
│
├── Is it inside .prose content?      → Do nothing; .prose handles it.
│
├── Is it a stat/metric number?       → Use `.stat-number`.
│
├── Is it body text that should
│   scale responsively with headings? → Use `.text-responsive-*`.
│
└── Otherwise                         → Use plain Tailwind `text-{size}` + `font-{weight}`.
```
