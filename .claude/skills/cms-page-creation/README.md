# cms-page-creation

Human-facing quick reference for the `cms-page-creation` skill.

## What it does

Orchestrates the creation of a new CMS-driven page on the JKKN site by chaining:

1. `ultra-ui-ux-designer` (layout & UX)
2. `brand-styling` (JKKN tokens)
3. Zod block component → registry entry → documented SQL → DB rows → verification

## Trigger phrases

- "Create a new page for X"
- "Add a CMS page for the Y department"
- "Build a landing page for Z"
- "Scaffold a page under app/(public)/"

## Files produced per run

| File / Row | Location |
|---|---|
| Block component | `components/cms-blocks/content/{slug}-page.tsx` |
| Registry entry | `lib/cms/component-registry.ts` (edit) |
| SQL docs | `docs/database/main-supabase/*.sql` |
| DB rows | `cms_pages`, `cms_page_blocks`, `cms_seo_metadata` (+ optional `cms_page_fab_config`) |

## Not for

- Admin panel pages (`app/(admin)/`)
- Reusable sub-blocks (future `cms-block-builder` skill)

See `SKILL.md` for the full workflow.
