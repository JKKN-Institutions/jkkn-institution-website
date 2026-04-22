---
name: jkkn-design-system
description: JKKN institution website design tokens — brand colors (primary green, secondary gold/yellow, cream), Poppins typography, and responsive font sizes as implemented in app/globals.css. Use this skill when building, editing, or reviewing any UI component, page, block, or style for the JKKN institution website (public site, admin panel, CMS blocks) to ensure colors and typography match the codebase exactly. Load whenever writing Tailwind classes, CSS variables, inline styles, or font declarations for this project.
---

# JKKN Design System — Colors & Typography

## Purpose

Provide the exact color palette, font family, and font size scale used by the JKKN institution website, so every component built matches the existing system byte-for-byte. Source of truth for these tokens is `app/globals.css` and `app/layout.tsx`.

This skill is a **reference lookup**, not a setup guide. The tokens are already wired up in the codebase — the goal here is to use them correctly rather than hardcode hex values or re-import fonts.

## When to Use

Invoke this skill when:

- Writing any JSX/TSX for a page, block, or component in this repository
- Adding or editing CSS in `styles/`, `app/globals.css`, or inline styles
- Creating CMS block components under `components/cms-blocks/`
- Reviewing a PR that touches UI and verifying brand compliance
- Explaining to a user which color or font size to use for a design

Do NOT invoke for non-visual work (Server Actions, RLS policies, database migrations, API integrations).

## Core Rules

1. **Never hardcode brand hex values in components.** Reference the CSS variables (`var(--brand-primary)`) or the Tailwind utility classes (`bg-primary`, `text-secondary`, `bg-background`) that are already mapped in `@theme inline` inside `app/globals.css`.
2. **Never import fonts directly in a component.** Poppins is loaded once via `next/font/google` in `app/layout.tsx` and exposed through the `--font-poppins` CSS variable. Reference it via `var(--font-poppins)` or the `font-sans` Tailwind utility.
3. **Never use a gold hex directly for text.** The gold palette has WCAG accessibility tiers (`--gold-text`, `--gold-decorative`, `--gold-text-large`) — pick the variant that matches the contrast context. See `references/colors.md`.
4. **Match the responsive heading scale already defined in `app/globals.css`.** Headings `h1`–`h6` have responsive sizes applied globally; do not override unless building a block with a specific design requirement.

## Quick Reference

**Brand triad (light mode):**

| Token             | Hex       | Semantic Tailwind | Usage                                           |
|-------------------|-----------|-------------------|-------------------------------------------------|
| Primary Green     | `#0b6d41` | `bg-primary`      | CTAs, active states, brand accents, ring, charts |
| Secondary Yellow  | `#ffde59` | `bg-secondary`    | Highlights, badges, gold accents                 |
| Background Cream  | `#fbfbee` | `bg-background`   | Page backgrounds                                 |

**Font:** Poppins (400, 600, 700). CSS var: `var(--font-poppins)`. Tailwind: `font-sans`.

**Base heading scale** (auto-applied to `h1`–`h6` in `app/globals.css`):

| Element | Mobile    | Tablet    | Desktop   |
|---------|-----------|-----------|-----------|
| `h1`    | `text-2xl` | `sm:text-3xl md:text-4xl` | `lg:text-5xl` |
| `h2`    | `text-xl`  | `sm:text-2xl md:text-3xl` | `lg:text-4xl` |
| `h3`    | `text-lg`  | `sm:text-xl md:text-2xl`  | `lg:text-3xl` |
| `h4`    | `text-base` | `sm:text-lg md:text-xl`  | `lg:text-2xl` |
| `h5`    | `text-sm`   | `sm:text-base md:text-lg` | `lg:text-xl`  |
| `h6`    | `text-sm`   | `sm:text-base md:text-lg` | —             |

## How to Apply

**Picking a color:**

1. Open `references/colors.md`.
2. Locate the token for the use case (primary action, secondary accent, muted text, gold decoration, gold text, chart series, sidebar, destructive).
3. Use the Tailwind utility if it exists (preferred), otherwise reference the CSS variable.

**Picking a font size:**

1. If the element is a heading (`h1`–`h6`), the responsive size is already applied — do nothing.
2. For body text inside CMS blocks or custom sections, use the `.text-responsive-*` utilities defined in `app/globals.css` (e.g. `.text-responsive-lg` = `text-base sm:text-lg lg:text-xl`).
3. Otherwise use plain Tailwind sizing (`text-sm`, `text-base`, `text-lg`, etc.) — do NOT invent custom font-size values.

**Opening the detailed references:**

- `references/colors.md` — full palette: primary tints, secondary tints, semantic (shadcn-mapped) colors, chart series, sidebar, destructive, accessible gold system, dark-mode overrides.
- `references/typography.md` — Poppins loader config, font-family stacks available in `:root`, full heading scale, responsive body utilities, `.text-responsive-*` reference.

## Dark Mode

Dark mode is supported via the `.dark` class on an ancestor element (typically `<html>`). All brand, shadcn-mapped, and sidebar tokens have dark variants already defined — using the semantic Tailwind utilities (`bg-primary`, `text-foreground`, `bg-card`) automatically adapts. Do not write `dark:bg-...` overrides for brand colors; the CSS variables switch under `.dark` on their own.

See `references/colors.md` for the full dark-mode value table.

## Anti-Patterns

Reject these patterns on sight:

- Hardcoding `#0b6d41`, `#ffde59`, `#fbfbee`, or any brand hex in a TSX file
- Importing Poppins (or any font) from `next/font/google` in a component — it's already loaded in `app/layout.tsx`
- Using `color: gold` or `color: #D4AF37` for gold text without checking contrast tiers in `references/colors.md`
- Writing `font-family: 'Poppins', sans-serif` inline — use `var(--font-poppins)` or `font-sans`
- Adding a new color token without adding it to `:root` AND `.dark` in `app/globals.css` AND the `@theme inline` block
