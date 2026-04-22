# Database Rows for a New CMS Page

All SQL in this reference must be documented in `docs/database/main-supabase/` BEFORE execution, per the project Database Documentation Workflow (CLAUDE.md).

## Tables involved

| Table | Purpose | Required |
|---|---|---|
| `cms_pages` | Page metadata (slug, title, status) | Yes |
| `cms_page_blocks` | Ordered blocks with component name + props JSON | Yes |
| `cms_seo_metadata` | `<head>` tags and schema.org JSON-LD | Yes |
| `cms_page_fab_config` | Floating action button config | Optional |
| `cms_page_versions` | Snapshots of previous block configurations | Created by trigger |

## Column expectations (verify against live schema)

Run `mcp__Main_Supabase_Project__list_tables` with schemas `['public']` before inserting to confirm current column names. Schema may evolve.

Typical `cms_pages` columns: `id`, `slug`, `title`, `status` (`draft|published|archived`), `meta`, `created_at`, `updated_at`.

Typical `cms_page_blocks` columns: `id`, `page_id`, `component_name`, `props` (jsonb), `order`, `is_visible`.

Typical `cms_seo_metadata` columns: `id`, `page_id`, `title`, `description`, `og_title`, `og_description`, `og_image`, `canonical_url`, `schema_jsonld` (jsonb), `robots`.

## Documentation-first pattern

Add an entry to `docs/database/main-supabase/` in the appropriate file (e.g., a new file `docs/database/main-supabase/06-cms-pages-seed.sql` or append to an existing seed file):

```sql
-- ============================================
-- CMS Page: {Page Name}
-- ============================================
-- Purpose: Seeds CMS page rows for the /{slug} public route
-- Created: YYYY-MM-DD
-- Dependencies: cms_pages, cms_page_blocks, cms_seo_metadata
-- Component used: {ComponentName} (registered in lib/cms/component-registry.ts)
-- ============================================

WITH new_page AS (
  INSERT INTO public.cms_pages (slug, title, status)
  VALUES ('{slug}', '{Title}', 'draft')
  RETURNING id
)
INSERT INTO public.cms_page_blocks (page_id, component_name, props, "order")
SELECT id, '{ComponentName}', '{...props JSON...}'::jsonb, 1
FROM new_page;

INSERT INTO public.cms_seo_metadata (page_id, title, description, og_title, og_description, og_image)
SELECT id, '{SEO Title}', '{Meta description ≤160 chars}', '{OG title}', '{OG description}', '{OG image URL}'
FROM public.cms_pages WHERE slug = '{slug}';

-- End of {Page Name}
-- ============================================
```

## Execution order

1. Document SQL in `docs/database/main-supabase/` — **mandatory first step**
2. Apply with `mcp__Main_Supabase_Project__apply_migration` (named migration) or `mcp__Main_Supabase_Project__execute_sql` (ad-hoc seed insert)
3. Verify with `SELECT * FROM cms_pages WHERE slug = '{slug}'`
4. Multi-institution: repeat for each institution project only if the page should appear on their domain

## Gotchas

- Props JSON must exactly satisfy the block's Zod schema — validate locally with `{Schema}.parse({...})` before inserting
- `order` starts at 1, increments per block
- `status='draft'` hides the page from public rendering — flip to `'published'` only after verification
- Slugs are unique per institution; kebab-case, no leading slash
