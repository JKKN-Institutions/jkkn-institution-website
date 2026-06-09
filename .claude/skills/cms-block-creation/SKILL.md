---
name: cms-block-creation
description: Create a new reusable CMS page-builder block component for the JKKN institution website. This skill should be used when the user asks to "create a CMS block", "add a page-builder block/section", "make a new block component", "add a component to the registry", or build any reusable component under components/cms-blocks/ that editors can drop into pages. Produces a Zod-validated, default-exported block component, its lazy import, and its COMPONENT_REGISTRY entry in lib/cms/component-registry.ts. This is the "cms-block-builder" that the cms-page-creation skill defers to; use cms-page-creation instead when assembling a whole page rather than one block.
---

# CMS Block Creation (JKKN Institution Website)

## Purpose

Create one reusable page-builder block the way every existing block in this repo is built, so it appears in the admin block picker, validates its props with Zod, and renders inside any CMS page through `PageRenderer`. A block is "done" only when three things exist together: the component file, a lazy import, and a `COMPONENT_REGISTRY` entry. Missing the registry entry means the editor cannot place the block; missing the lazy import breaks the build.

## When to use

Invoke when the request concerns a single reusable block/section:

- "Create a CMS block for X" / "add a new section component"
- "Add a block to the page builder / component registry"
- "Make a testimonials / stats / gallery block editors can reuse"

Do **not** invoke for:

- Assembling a whole page from blocks → use `cms-page-creation`
- Admin panel screens → use `admin-crud-pages`
- shadcn wrapper blocks (those live in `components/cms-blocks/shadcn/` and register in `lib/cms/shadcn-components-registry.ts`)

## Prerequisite skills (invoke first when writing UI/copy)

- `jkkn-design-system` (or `brand-styling`) — for exact brand colors and typography. Default brand tokens seen across blocks: primary green `#0b6d41`, accent gold/yellow `#ffde59`, dark text `#171717`.
- `jkkn-terminologies` — before writing any default user-facing copy (e.g. use "Learners", not "students").

## The three-part workflow

A block is incomplete unless all three parts exist. See `references/conventions.md` for full rules and `templates/` for copy-paste starting points.

### Part 1 — Create the component file

Create `components/cms-blocks/<category>/<block-name>.tsx` from `templates/block-component.template.tsx`. Categories: `content`, `media`, `layout`, `data`, `admissions`. Required shape:

- First line `'use client'` (blocks are client components; they animate and read interaction state).
- A named Zod schema `<BlockName>PropsSchema` where **every field has `.default(...)`** and a `.describe(...)` (the description text is surfaced to editors).
- Exported type: `export type <BlockName>Props = z.infer<typeof <BlockName>PropsSchema> & BaseBlockProps` (import `BaseBlockProps` from `@/lib/cms/registry-types`).
- **`export default function <BlockName>(props)`** — the default export is mandatory because the registry lazy-imports it.
- Icons referenced by name (string) and resolved through a local `iconMap` of Lucide icons (see `components/cms-blocks/content/vision-mission.tsx`).
- Mobile-first responsive, dark-mode safe, semantic headings, alt text on images.

### Part 2 — Add the lazy import

In `lib/cms/component-registry.ts`, in the lazy-import block (near line ~520, where the other `const X = lazy(() => import(...))` lines live), add:

```ts
const <BlockName> = lazy(() => import('@/components/cms-blocks/<category>/<block-name>'))
```

### Part 3 — Add the registry entry

In the same file, inside `export const COMPONENT_REGISTRY: ComponentRegistry = { ... }` (starts ~line 703), add an entry under the matching category section using `templates/registry-entry.template.ts`. Required keys: `name`, `displayName`, `category`, `description`, `icon` (Lucide name string), `component`, `propsSchema` (cast `as any`), `defaultProps`, `supportsChildren`, and `editableProps` (drives the editor form). Add `isFullWidth: true` for full-bleed sections (hero/banners). Keep the object key, `name`, and the imported component identifier identical and in PascalCase. Do not duplicate an existing `name`.

## Verification (do not claim done until all pass)

- `npm run build` compiles (TypeScript + Next.js).
- The block appears in the admin block picker under its category.
- Placing it on a page renders with default props and no console/hydration errors.
- Editing each `editableProps` field updates the preview.
- Mobile (375px) and dark mode look correct.

## Red-flag checklist

Stop if any answer is "no":

- [ ] Invoked `jkkn-design-system`/`brand-styling` before writing Tailwind/colors?
- [ ] Does every Zod field have `.default()` and `.describe()`?
- [ ] Is the component a **default export**?
- [ ] Added the `lazy(() => import(...))` line?
- [ ] Added the `COMPONENT_REGISTRY` entry with `editableProps`?
- [ ] Is the `name` unique, PascalCase, matching filename + import?
- [ ] Does default copy follow `jkkn-terminologies`?

## Bundled resources

- `templates/block-component.template.tsx` — starter block component.
- `templates/registry-entry.template.ts` — lazy import + registry entry snippet.
- `references/conventions.md` — schema, editableProps types, defaultProps, brand tokens, full-width and animation rules.
