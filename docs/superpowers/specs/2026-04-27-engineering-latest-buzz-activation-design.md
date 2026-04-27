# Engineering Homepage — Latest Buzz Section Activation

**Date:** 2026-04-27
**Author:** Sangeetha V (with Claude Code)
**Status:** Approved (pending user review of this spec)
**Target site:** `engg.jkkn.ac.in` (engineering institution)
**Target Supabase:** Engineering College Project (`kyvfkyjmdbtyimtedkie`)

---

## 1. Goal

Render the **Latest Buzz** carousel section on the engineering homepage, visually mirroring the main institution site (`jkkn.ac.in`) — light cream background, simple cards, gold-italic header — and seeded with 4 engineering-flavored placeholder blog posts so the carousel ships with content from day one. Editors will replace placeholder content (titles, excerpts, images) via the admin panel after launch.

This change is **data + configuration only**. No code changes are required. The `LatestBuzz` React component, registry entry, and homepage CMS renderer are already in production.

## 2. Background

A `LatestBuzz` row already exists in the engineering Supabase `cms_page_blocks` table for the homepage (`page_id = 2e6304f1-2940-4e8d-8347-ee845a9aa309`, `sort_order = 5`). Someone configured it previously with `variant: modern-dark` + `cardStyle: overlay` props and then set `is_visible = false`. The `latest-buzz` blog category exists (`id = 48e5c55d-196b-43ed-8d5c-9d905106d553`, `is_active = true`) but contains zero published posts. Activating the section therefore requires both a props rewrite *and* a content seed.

## 3. Architecture

```
engineering Supabase (kyvfkyjmdbtyimtedkie)
│
├── cms_page_blocks  (1 UPDATE)
│     WHERE id of the existing LatestBuzz block on homepage
│     SET is_visible = true,
│         props = <main-site-mirror props, see §4>
│
└── blog_posts       (4 INSERTs, ON CONFLICT DO NOTHING)
      category_id = '48e5c55d-196b-43ed-8d5c-9d905106d553'
      status = 'published',  visibility = 'public'
      published_at = NOW(),  is_pinned = false
      featured_image = stable Unsplash placeholder URL (replaced post-launch)
```

The `LatestBuzz` component reads via `getBlogPostsByCategory('latest-buzz', 6)` defined in `app/actions/cms/homepage-blog.ts`, which joins `blog_posts` to `blog_categories` on `category_id` and orders by `is_pinned DESC, published_at DESC`. No code path needs modification.

## 4. CMS block props (mirror main site exactly, with engineering subtitle)

```json
{
  "layout": "carousel",
  "columns": "3",
  "maxItems": 6,
  "subtitle": "What's trending at JKKN Engineering",
  "buzzItems": [],
  "cardStyle": "simple",
  "accentColor": "#0b6d41",
  "headerPart1": "Latest",
  "headerPart2": "Buzz",
  "viewAllLink": "/blog/category/latest-buzz",
  "categorySlug": "latest-buzz",
  "autoplaySpeed": 3000,
  "useDynamicData": true,
  "backgroundColor": "#f9f9f9",
  "headerPart1Color": "#ffde59",
  "headerPart2Color": "#ffde59",
  "headerPart2Italic": true,
  "showViewAllButton": false
}
```

Sole difference vs. main: `subtitle` reads *"What's trending at JKKN Engineering"* (main reads *"What's trending at JKKN"*).

## 5. Seed posts (4 placeholders)

| # | Title | Slug | Excerpt | Image (Unsplash, stable) |
|---|---|---|---|---|
| 1 | Campus Recruitment Drive 2026 — TCS, Infosys & Wipro Onsite | `campus-recruitment-drive-2026` | Final-year students secured offers as top IT firms visited campus this placement season. | `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80` |
| 2 | AICTE Innovation Cell Hackathon — Engineering Team Wins Regional Round | `aicte-hackathon-regional-winners` | Our students claimed first place at the regional AICTE Innovation Cell hackathon, advancing to nationals. | `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80` |
| 3 | Industry Visit to L&T Construction Site | `industry-visit-lt-construction` | Civil and Mechanical students gained on-site exposure to large-scale infrastructure execution. | `https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80` |
| 4 | NIRF Engineering Ranking 2026 — JKKN in Top Tier of Tamil Nadu Colleges | `nirf-engineering-ranking-2026` | National rankings recognise consistent academic and research performance across departments. | `https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80` |

All 4 posts: `status='published'`, `visibility='public'`, `published_at = NOW()`, `category_id='48e5c55d-196b-43ed-8d5c-9d905106d553'`. Editors will replace `featured_image` URLs with self-hosted assets after upload via `/admin/blog`.

## 6. Documentation

Per CLAUDE.md "Document First, Execute Second" rule, the SQL is recorded *before* it runs, in:

```
docs/database/engineering-college/17-latest-buzz-homepage-activation.sql
```

(Folder convention: `engineering-college/`. Next sequential number is `17`, following `16-admissions-fee-structure-nav.sql`.)

The file includes purpose, dependencies, security notes, idempotency strategy, and a rollback section.

## 7. Idempotency & error handling

- **`blog_posts` inserts:** `ON CONFLICT (slug) DO NOTHING` — re-runs are safe, will not duplicate or overwrite editor changes.
- **`cms_page_blocks` update:** scoped by `id` (the known existing LatestBuzz block row). Setting `is_visible = true` repeatedly is idempotent.
- **Empty data fallback:** the `LatestBuzz` component already renders a `defaultBuzz` placeholder array if dynamic fetch returns zero rows, so even a partial failure cannot blank the homepage.
- **Missing image fallback:** the `BuzzCard` component already renders a green gradient + Sparkles icon if `featured_image` is empty/null.

## 8. Verification

After applying the migration:

1. **DB verification queries (Engineering Supabase):**
   ```sql
   SELECT is_visible, props->>'subtitle' AS subtitle
   FROM cms_page_blocks
   WHERE component_name = 'LatestBuzz'
     AND page_id = '2e6304f1-2940-4e8d-8347-ee845a9aa309';

   SELECT slug, title, status, published_at IS NOT NULL AS has_publish_date
   FROM blog_posts
   WHERE category_id = '48e5c55d-196b-43ed-8d5c-9d905106d553'
   ORDER BY published_at DESC;
   ```
   Expect: 1 row with `is_visible=true`, subtitle = *"What's trending at JKKN Engineering"*; ≥ 4 published posts.

2. **Local dev verification:**
   - `npm run dev:engineering` (switches `.env.local` to engineering Supabase + starts dev server)
   - Open `http://localhost:3000/`
   - Confirm Latest Buzz section renders between *Why Choose* and *Placements*, with cream background, gold "Latest *Buzz*" header, 3-column carousel of 4 cards, autoplay every 3 s.
   - Click each card → URL resolves to `/blog/<slug>`, post detail page loads.

3. **Production verification (after Vercel auto-deploys engineering site):**
   - Visit `https://engg.jkkn.ac.in/`
   - Verify section visible and styled as intended.

## 9. Rollback

Single SQL transaction. Reversible at any time:

```sql
-- Re-hide the section
UPDATE cms_page_blocks
SET is_visible = false
WHERE component_name = 'LatestBuzz'
  AND page_id = '2e6304f1-2940-4e8d-8347-ee845a9aa309';

-- Remove only the seeded posts (preserves any editor-created posts)
DELETE FROM blog_posts
WHERE category_id = '48e5c55d-196b-43ed-8d5c-9d905106d553'
  AND slug IN (
    'campus-recruitment-drive-2026',
    'aicte-hackathon-regional-winners',
    'industry-visit-lt-construction',
    'nirf-engineering-ranking-2026'
  );
```

## 10. Out of scope

- Adding seed posts to other institution Supabase projects (main, dental, pharmacy, etc.) — they manage their own content.
- Modifying the `LatestBuzz` React component or registry — already correct.
- Adding a `latest-buzz` listing route at `/blog/category/latest-buzz` — already exists per CMS routing; `viewAllLink` references it but `showViewAllButton: false` hides the button anyway.
- Hosting placeholder images locally in `public/images/` — explicitly deferred to editors via post-launch admin uploads.

## 11. Risk assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| Unsplash URLs become unstable | Low | Stable photo IDs, will be replaced post-launch |
| `latest-buzz` category somehow disabled | Very low | Verified `is_active=true` at design time; SQL re-checks |
| Engineering homepage page_id changes | Negligible | Identifier captured as constant; SQL would no-op if missing |
| Visual regression on existing homepage flow | Low | Section was already pre-positioned at `sort_order=5`, only flipping visibility |

## 12. Implementation handoff

Next step: invoke the `writing-plans` skill to produce a detailed step-by-step implementation plan covering (a) creation of the SQL doc file, (b) MCP migration application, (c) verification queries, (d) optional dev-server smoke test.
