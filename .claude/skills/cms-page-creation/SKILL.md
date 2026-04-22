---
name: cms-page-creation
description: End-to-end workflow for creating a new CMS-driven page on the JKKN institution website. Orchestrates ultra-ui-ux-designer (layout/UX discovery) and brand-styling (design tokens) as prerequisites, then produces a Zod-validated block component in components/cms-blocks/content/, a registry entry in lib/cms/component-registry.ts, documented SQL in docs/database/main-supabase/, and the cms_pages + cms_page_blocks + cms_seo_metadata rows. This skill should be used when the user asks to "create a new page", "add a CMS page", "build a landing page", "add a marketing page", or scaffold any page under app/(public)/ that should be editor-managed or SEO-indexed.
---

# CMS Page Creation (JKKN Institution Website)

## Purpose

Create a new CMS-driven page on the JKKN site using a consistent, brand-aligned, SEO-complete workflow. This skill is an **orchestrator** — it does not replace design creativity or database expertise; it enforces the correct *order* of existing skills and required deliverables so new pages do not drift from established patterns.

## When to use

Invoke this skill when the user requests any of:

- "Create / add / build a new page" under `app/(public)/`
- A landing page, marketing page, department page, or facility page
- A page that needs SEO metadata, editor management, or registration in the CMS block registry
- A replacement for an existing static page that should become CMS-driven

Do **not** invoke for:

- Reusable sub-block components (future `cms-block-builder` skill)
- Admin panel pages under `app/(admin)/`
- Pure Next.js routing changes without CMS content

## Prerequisite skills (MUST invoke in order)

Before producing any page code, invoke these skills in sequence:

1. **`ultra-ui-ux-designer`** — for layout, hierarchy, section breakdown, hero treatment, CTA strategy. Output: a section-by-section wireframe spec.
2. **`brand-styling`** — for JKKN color palette, typography scale, spacing, dark-mode behavior. Output: Tailwind class mappings for each section using tokens from `lib/cms/brand-colors.ts`.

Only after both prerequisites produce their outputs, proceed to Step 1 below.

## Workflow

### Step 1 — Decide page type

Consult `references/01-decision-tree.md` to choose between:

- **Static file page** — `app/(public)/{slug}/page.tsx` with the block component imported directly. Use for fixed pages rarely edited by non-developers.
- **DB-driven page** — row in `cms_pages` + blocks in `cms_page_blocks`, rendered through `app/(public)/[...slug]/page.tsx`. Use for editor-managed pages (default for new pages).

Ask the user to confirm the choice if ambiguous.

### Step 2 — Build the page block component

Create `components/cms-blocks/content/{page-name}-page.tsx` using `templates/page-block.template.tsx` as a starting point.

Required shape:

- Named Zod schema: `{PageName}PageSchema` with all props
- Type exported: `{PageName}PageProps = z.infer<typeof {PageName}PageSchema>`
- Default export function accepts the validated props
- Uses brand tokens from Step 0 (no hardcoded hex)
- Responsive (mobile-first) and dark-mode compatible
- Semantic heading order (single `h1`, no skipped levels)
- Accessible (aria-labels for interactive elements, alt text on images)
- Loading and empty states handled

Reference existing exemplars before writing new code:

- `components/cms-blocks/content/digital-classroom-page.tsx`
- `components/cms-blocks/content/facility-page.tsx`
- `components/cms-blocks/content/ambulance-service-page.tsx`

### Step 3 — Register in component registry

Edit `lib/cms/component-registry.ts`. Add a new entry following `templates/registry-entry.template.ts`:

- `name` — matches component filename (PascalCase)
- `component` — the imported React component
- `propsSchema` — the Zod schema from Step 2
- `category` — `content` (or `layout`/`media`/`data` if appropriate)
- `icon` — Lucide icon name
- `defaultProps` — sensible starter values
- `description` — one line, used in the admin block picker

Do not duplicate existing registry names.

### Step 4 — Database rows (FOLLOWS project's Database Documentation Workflow)

This step is governed by the project CLAUDE.md rule: **document SQL FIRST, then execute**.

1. Add the SQL to `docs/database/main-supabase/` using the format in `references/04-database-rows.md` (header comment block + SQL).
2. Apply the migration via `mcp__Main_Supabase_Project__apply_migration` or `mcp__Main_Supabase_Project__execute_sql` (single-row inserts).
3. Required rows:
   - `cms_pages` — slug, title, status (`draft` initially), institution scope
   - `cms_page_blocks` — one row per block with `component_name`, `props` (JSON), `order`
   - `cms_seo_metadata` — title, description, og_title, og_description, og_image, schema.org JSON-LD
4. Optional: `cms_page_fab_config` if the page needs a floating action button.
5. Check `jkkn-terminologies` skill rules before writing any user-facing copy.

### Step 5 — Verification (delegate to `superpowers:verification-before-completion` if available)

Before claiming the page is complete, verify all of the following:

- `npm run build` passes (TypeScript compiles)
- Visit `/{slug}` in `npm run dev` — page renders
- Mobile (375px), tablet (768px), desktop (1440px) all look correct
- Dark mode toggle works without contrast regressions
- Lighthouse accessibility score ≥ 90
- Lighthouse SEO score ≥ 90
- SEO metadata appears in page `<head>` (view source)
- No console errors or hydration warnings

Optionally run the `Agentic-SEO-Skill` for a deeper SEO pass.

### Step 6 — Multi-institution consideration

If the page is intended for all 6 institutions, the same `cms_pages` + blocks SQL must be applied to each institution's Supabase project (see CLAUDE.md multi-institution section). The component file only needs to be created once — it is shared across all deployments.

## Red-flag checklist

Stop and reconsider if any answer is "no":

- [ ] Did I invoke `ultra-ui-ux-designer` before writing UI code?
- [ ] Did I invoke `brand-styling` before writing Tailwind classes?
- [ ] Does the block have a Zod schema with exported type?
- [ ] Is the component registered in `lib/cms/component-registry.ts`?
- [ ] Did I document SQL in `docs/database/main-supabase/` BEFORE running the migration?
- [ ] Are `cms_pages`, `cms_page_blocks`, and `cms_seo_metadata` rows all present?
- [ ] Does user-facing copy follow `jkkn-terminologies` rules?
- [ ] Did I test mobile + dark mode + build passing?

## Bundled resources

- `references/01-decision-tree.md` — static vs. DB-driven page
- `references/02-block-schema.md` — Zod schema conventions
- `references/03-registry-entry.md` — component-registry.ts conventions
- `references/04-database-rows.md` — SQL format + required columns
- `references/05-integration-points.md` — how prerequisite skills plug in
- `references/06-examples.md` — walk-through of existing pages
- `templates/page-block.template.tsx` — starter component file
- `templates/registry-entry.template.ts` — starter registry snippet
- `templates/seo-metadata.template.sql` — starter SEO row SQL

## Out of scope

- Building reusable sub-block components (future `cms-block-builder` skill)
- Automating multi-institution SQL sync (future `multi-institution-sync` skill)
- Replacing design judgment from `ultra-ui-ux-designer`
