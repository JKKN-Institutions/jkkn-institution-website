# Engineering Homepage — Latest Buzz Activation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Activate the Latest Buzz carousel on the engineering homepage by flipping its existing CMS block to visible, replacing its props to mirror the main institution site, and seeding 4 placeholder blog posts in engineering Supabase under the `latest-buzz` category.

**Architecture:** Data + configuration only. Single SQL migration applied to Engineering Supabase project (`kyvfkyjmdbtyimtedkie`). One `UPDATE` on `cms_page_blocks` (id-scoped) plus four `INSERT … ON CONFLICT (slug) DO NOTHING` rows on `blog_posts`. No application code changes.

**Tech Stack:** Supabase (PostgreSQL), Next.js 16 (already-deployed), MCP tooling (`mcp__Engineering_College_Supabase_Project__*`).

**Spec reference:** `docs/superpowers/specs/2026-04-27-engineering-latest-buzz-activation-design.md`

---

## File Structure

| Path | Purpose | Action |
|---|---|---|
| `docs/database/engineering-college/17-latest-buzz-homepage-activation.sql` | Canonical documented SQL for this migration (per CLAUDE.md "Document First, Execute Second") | **Create** |
| `cms_page_blocks` (engineering Supabase) | Existing LatestBuzz block on homepage | **Update 1 row** (id-scoped) |
| `blog_posts` (engineering Supabase) | Seed 4 placeholder posts under `latest-buzz` category | **Insert 4 rows** (idempotent) |

No source code files are created or modified. The `LatestBuzz` React component, registry entry, and homepage CMS renderer are already in production at HEAD.

**Constants used throughout this plan (verified against engineering Supabase at design time):**
- Engineering homepage `cms_pages.id`: `2e6304f1-2940-4e8d-8347-ee845a9aa309`
- `latest-buzz` blog_categories.id: `48e5c55d-196b-43ed-8d5c-9d905106d553`

---

### Task 1: Pre-flight schema discovery

**Files:** *(no files written this task — pure discovery)*

This task captures unknowns we cannot assume: the exact `id` of the LatestBuzz block row, every NOT NULL column on `blog_posts`, whether `slug` has a UNIQUE constraint, and any author/foreign-key requirements. Without these, the INSERTs in Task 3 may fail mid-migration.

- [ ] **Step 1: Capture the exact `cms_page_blocks.id` for the LatestBuzz block on the engineering homepage**

Run via MCP:

```sql
SELECT id, sort_order, is_visible
FROM cms_page_blocks
WHERE page_id = '2e6304f1-2940-4e8d-8347-ee845a9aa309'
  AND component_name = 'LatestBuzz';
```

Expected: exactly one row with `is_visible = false`. **Record the returned `id` value.** It will be referenced in Task 2 as `<LATEST_BUZZ_BLOCK_ID>`.

- [ ] **Step 2: Discover all NOT NULL / required columns on `blog_posts`**

Run via MCP:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'blog_posts'
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

Expected: list of every column. Read `is_nullable = 'NO'` rows carefully and note any without a `column_default` — those *must* be supplied in INSERT. Common ones to watch for: `author_id`, `content`, `published_at`.

- [ ] **Step 3: Verify `blog_posts.slug` has a UNIQUE constraint (required for `ON CONFLICT (slug)`)**

Run via MCP:

```sql
SELECT conname, pg_get_constraintdef(oid) AS def
FROM pg_constraint
WHERE conrelid = 'public.blog_posts'::regclass
  AND contype IN ('u', 'p')
ORDER BY conname;
```

Expected: at least one constraint definition that mentions `(slug)` — either a primary key on `slug` (unlikely) or a `UNIQUE (slug)` constraint. **If no such constraint exists, switch the migration in Task 2 to use a self-checking pattern instead** — use `INSERT … SELECT … WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = …)` for each row.

- [ ] **Step 4: Confirm a usable `author_id` value (if author_id is NOT NULL)**

If Step 2 showed `author_id` is NOT NULL with no default, run via MCP:

```sql
SELECT id, email FROM auth.users
WHERE email LIKE '%@jkkn.ac.in'
ORDER BY created_at ASC
LIMIT 5;
```

Pick a stable author UUID (e.g. the engineering admin or a content-team account). **Record this UUID** — it will be referenced in Task 2 as `<SEED_AUTHOR_ID>`. If `author_id` is nullable, this step is skipped.

- [ ] **Step 5: Capture findings inline**

Append a short notes block at the top of this plan file (or in your scratchpad) listing:
- `<LATEST_BUZZ_BLOCK_ID>`: (uuid)
- `blog_posts` required columns without defaults: (list)
- `slug` unique-constraint name: (or "missing — using NOT EXISTS pattern")
- `<SEED_AUTHOR_ID>`: (uuid or "nullable")

These four facts feed every subsequent task. No commit yet.

---

### Task 2: Write the SQL documentation file

**Files:**
- Create: `docs/database/engineering-college/17-latest-buzz-homepage-activation.sql`

Per CLAUDE.md "Document First, Execute Second" rule, the SQL is recorded in version control *before* it executes against the live database. The file follows the format established by `01-functions.sql` … `16-admissions-fee-structure-nav.sql` in the same folder.

- [ ] **Step 1: Create the SQL documentation file with header**

Write the following to `docs/database/engineering-college/17-latest-buzz-homepage-activation.sql`. **Substitute** `<LATEST_BUZZ_BLOCK_ID>` and `<SEED_AUTHOR_ID>` with the values captured in Task 1 Step 5. Substitute `<CONTENT_PLACEHOLDER>` with `'<p>Placeholder content — editors will replace via /admin/blog.</p>'` if `content` is required, otherwise drop the column from the INSERT list.

```sql
-- ============================================
-- 17 — Latest Buzz Homepage Activation
-- ============================================
-- Purpose: Activate the LatestBuzz CMS block on the engineering
--   homepage and seed 4 placeholder blog posts so the carousel
--   renders content from day one. Mirrors main institution site
--   styling (light cream background, simple cards, gold-italic
--   header) with an engineering-specific subtitle.
-- Created: 2026-04-27
-- Spec: docs/superpowers/specs/2026-04-27-engineering-latest-buzz-activation-design.md
-- Plan: docs/superpowers/plans/2026-04-27-engineering-latest-buzz-activation.md
-- Dependencies:
--   - cms_pages row for engineering homepage (id = 2e6304f1-2940-4e8d-8347-ee845a9aa309)
--   - blog_categories row 'latest-buzz' (id = 48e5c55d-196b-43ed-8d5c-9d905106d553, is_active=true)
--   - Existing cms_page_blocks row (LatestBuzz, sort_order=5, currently is_visible=false)
-- Idempotency: blog_posts inserts use ON CONFLICT (slug) DO NOTHING.
--   cms_page_blocks UPDATE is id-scoped and idempotent.
-- Rollback: see end of file.
-- ============================================

BEGIN;

-- 1) Activate the LatestBuzz block and replace its props with main-site-mirror config
UPDATE cms_page_blocks
SET is_visible = true,
    props = jsonb_build_object(
      'layout',              'carousel',
      'columns',             '3',
      'maxItems',            6,
      'subtitle',            'What''s trending at JKKN Engineering',
      'buzzItems',           '[]'::jsonb,
      'cardStyle',           'simple',
      'accentColor',         '#0b6d41',
      'headerPart1',         'Latest',
      'headerPart2',         'Buzz',
      'viewAllLink',         '/blog/category/latest-buzz',
      'categorySlug',        'latest-buzz',
      'autoplaySpeed',       3000,
      'useDynamicData',      true,
      'backgroundColor',     '#f9f9f9',
      'headerPart1Color',    '#ffde59',
      'headerPart2Color',    '#ffde59',
      'headerPart2Italic',   true,
      'showViewAllButton',   false
    ),
    updated_at = NOW()
WHERE id = '<LATEST_BUZZ_BLOCK_ID>';

-- 2) Seed 4 placeholder blog posts under the 'latest-buzz' category
-- Editors will replace titles, excerpts, and featured_image via /admin/blog after upload.

INSERT INTO blog_posts (
  title, slug, excerpt, featured_image,
  category_id, author_id,
  status, visibility, published_at,
  is_pinned, content
)
VALUES
  (
    'Campus Recruitment Drive 2026 — TCS, Infosys & Wipro Onsite',
    'campus-recruitment-drive-2026',
    'Final-year students secured offers as top IT firms visited campus this placement season.',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    '48e5c55d-196b-43ed-8d5c-9d905106d553',
    '<SEED_AUTHOR_ID>',
    'published', 'public', NOW(),
    false,
    '<p>Placeholder content — editors will replace via /admin/blog.</p>'
  ),
  (
    'AICTE Innovation Cell Hackathon — Engineering Team Wins Regional Round',
    'aicte-hackathon-regional-winners',
    'Our students claimed first place at the regional AICTE Innovation Cell hackathon, advancing to nationals.',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    '48e5c55d-196b-43ed-8d5c-9d905106d553',
    '<SEED_AUTHOR_ID>',
    'published', 'public', NOW(),
    false,
    '<p>Placeholder content — editors will replace via /admin/blog.</p>'
  ),
  (
    'Industry Visit to L&T Construction Site',
    'industry-visit-lt-construction',
    'Civil and Mechanical students gained on-site exposure to large-scale infrastructure execution.',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    '48e5c55d-196b-43ed-8d5c-9d905106d553',
    '<SEED_AUTHOR_ID>',
    'published', 'public', NOW(),
    false,
    '<p>Placeholder content — editors will replace via /admin/blog.</p>'
  ),
  (
    'NIRF Engineering Ranking 2026 — JKKN in Top Tier of Tamil Nadu Colleges',
    'nirf-engineering-ranking-2026',
    'National rankings recognise consistent academic and research performance across departments.',
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    '48e5c55d-196b-43ed-8d5c-9d905106d553',
    '<SEED_AUTHOR_ID>',
    'published', 'public', NOW(),
    false,
    '<p>Placeholder content — editors will replace via /admin/blog.</p>'
  )
ON CONFLICT (slug) DO NOTHING;

COMMIT;

-- ============================================
-- ROLLBACK (run only if you need to revert)
-- ============================================
-- BEGIN;
-- UPDATE cms_page_blocks SET is_visible = false, updated_at = NOW()
-- WHERE id = '<LATEST_BUZZ_BLOCK_ID>';
--
-- DELETE FROM blog_posts
-- WHERE category_id = '48e5c55d-196b-43ed-8d5c-9d905106d553'
--   AND slug IN (
--     'campus-recruitment-drive-2026',
--     'aicte-hackathon-regional-winners',
--     'industry-visit-lt-construction',
--     'nirf-engineering-ranking-2026'
--   );
-- COMMIT;
-- ============================================
-- End of 17 — Latest Buzz Homepage Activation
-- ============================================
```

**If Task 1 Step 2 revealed extra NOT NULL columns** (e.g., `subtitle`, `meta_description`, `tags`), add them to the INSERT column list with sensible defaults (`''`, `'{}'`, etc.). **If `slug` did NOT have a UNIQUE constraint** (Task 1 Step 3), replace the `INSERT … ON CONFLICT` block with four separate `INSERT … SELECT … WHERE NOT EXISTS` statements, one per slug.

- [ ] **Step 2: Read the file back to confirm exact content**

Confirm the file was written correctly and that all `<LATEST_BUZZ_BLOCK_ID>` and `<SEED_AUTHOR_ID>` placeholders have been replaced with real UUIDs. The file should not contain any angle-bracket placeholders.

Run via Read tool: read `docs/database/engineering-college/17-latest-buzz-homepage-activation.sql` and visually confirm.

- [ ] **Step 3: Do NOT commit yet**

The plan commits the SQL doc file *after* the migration successfully applies, not before. This keeps the documented file in sync with what actually ran.

---

### Task 3: Apply the migration to Engineering Supabase

**Files:** *(no file writes — MCP-based DB operation)*

- [ ] **Step 1: Capture the pre-state of the LatestBuzz block (the "red" assertion)**

Run via MCP `mcp__Engineering_College_Supabase_Project__execute_sql`:

```sql
SELECT id, is_visible, props->>'subtitle' AS subtitle
FROM cms_page_blocks
WHERE id = '<LATEST_BUZZ_BLOCK_ID>';
```

Expected: `is_visible = false`, subtitle reflects the old preset (`Trending stories, events and announcements from JKKN Engineering`). Save this output — if rollback is needed later, this is the prior state.

- [ ] **Step 2: Capture the pre-state count of latest-buzz posts**

Run via MCP `mcp__Engineering_College_Supabase_Project__execute_sql`:

```sql
SELECT COUNT(*) AS post_count
FROM blog_posts
WHERE category_id = '48e5c55d-196b-43ed-8d5c-9d905106d553';
```

Expected: `post_count = 0` (verified at design time; if it has changed, the new posts will be added on top of existing ones — review with user before continuing).

- [ ] **Step 3: Apply the migration via MCP `apply_migration`**

Run via MCP `mcp__Engineering_College_Supabase_Project__apply_migration`:

- `name`: `latest_buzz_homepage_activation`
- `query`: paste the full SQL body from `docs/database/engineering-college/17-latest-buzz-homepage-activation.sql` between the `BEGIN;` and `COMMIT;` lines (inclusive). Do **not** include the `-- ROLLBACK` comment block.

Expected: migration applies without error. If it fails, examine the error message:
- `null value in column … violates not-null constraint` → revisit Task 1 Step 2; add the missing column to the INSERT list and retry
- `duplicate key value violates unique constraint` → migration was already applied; confirm desired state and skip
- `insert or update … violates foreign key constraint` → likely a stale `author_id`; revisit Task 1 Step 4

- [ ] **Step 4: Capture the post-state of the LatestBuzz block (the "green" assertion)**

Run via MCP `mcp__Engineering_College_Supabase_Project__execute_sql`:

```sql
SELECT id, is_visible,
       props->>'subtitle'         AS subtitle,
       props->>'cardStyle'        AS card_style,
       props->>'backgroundColor'  AS bg_color,
       props->>'columns'          AS columns
FROM cms_page_blocks
WHERE id = '<LATEST_BUZZ_BLOCK_ID>';
```

Expected:
- `is_visible = true`
- `subtitle = What's trending at JKKN Engineering`
- `card_style = simple`
- `bg_color = #f9f9f9`
- `columns = 3`

- [ ] **Step 5: Capture the post-state of the seed posts**

Run via MCP `mcp__Engineering_College_Supabase_Project__execute_sql`:

```sql
SELECT slug, title, status, visibility,
       (featured_image IS NOT NULL) AS has_image,
       published_at
FROM blog_posts
WHERE category_id = '48e5c55d-196b-43ed-8d5c-9d905106d553'
ORDER BY published_at DESC;
```

Expected: 4 rows. All four with `status='published'`, `visibility='public'`, `has_image=true`, recent `published_at`. Slugs match: `campus-recruitment-drive-2026`, `aicte-hackathon-regional-winners`, `industry-visit-lt-construction`, `nirf-engineering-ranking-2026`.

If any expectation fails, **STOP** and run the rollback block from the bottom of the SQL file before fixing and retrying.

---

### Task 4: Local dev smoke test

**Files:** *(no file writes — visual verification)*

- [ ] **Step 1: Switch dev environment to Engineering Supabase**

Run in terminal:

```bash
npm run dev:engineering
```

Expected: terminal output shows the institution-switch script ran, `.env.local` was rewritten to point at `kyvfkyjmdbtyimtedkie`, and the Next.js dev server is listening (default `http://localhost:3000`).

- [ ] **Step 2: Open the homepage in a browser**

Navigate to `http://localhost:3000/`. Wait for the page to fully load (cream cards take ~1s to fade in via the IntersectionObserver animation).

- [ ] **Step 3: Verify section position**

Scroll past the hero, accreditations bar, About, Programs, and Why Choose. The Latest Buzz section should appear next, before the Placements section.

- [ ] **Step 4: Verify section styling**

Confirm visually:
- Background is light gray/cream (`#f9f9f9`)
- Header reads **Latest Buzz** with both words in gold (`#ffde59`)
- Subtitle reads *"What's trending at JKKN Engineering"*
- 3 cards visible at desktop width (carousel autoplays every 3 s)
- Cards have a clean white background with image on top, title and "View Details" below (cardStyle: `simple`)
- "Trending Now" badge with TrendingUp icon visible above the header

- [ ] **Step 5: Verify dynamic data loaded**

Confirm card titles match the seeded posts (Campus Recruitment Drive, AICTE Hackathon, L&T Industry Visit, NIRF Ranking). If you see "Campus Drive 2025" or "Placement Day Celebration" instead, the component fell back to its hard-coded defaults — meaning `getBlogPostsByCategory('latest-buzz', 6)` returned empty. In that case, re-run Task 3 Step 5 to confirm the posts exist; if they do, check the browser console for fetch errors (likely an RLS policy blocking anonymous reads).

- [ ] **Step 6: Click a card to verify routing**

Click the first card (Campus Recruitment Drive). Expected: browser navigates to `http://localhost:3000/blog/campus-recruitment-drive-2026` and the post detail page renders without 404. Use back button to return to the homepage.

- [ ] **Step 7: Stop the dev server**

Press `Ctrl+C` in the terminal running `npm run dev:engineering`.

---

### Task 5: Commit the SQL documentation file

**Files:**
- Add: `docs/database/engineering-college/17-latest-buzz-homepage-activation.sql`

Now that the migration has been applied and verified end-to-end, commit the documentation file so the repository's git history matches the live database state.

- [ ] **Step 1: Stage the SQL file**

```bash
git add docs/database/engineering-college/17-latest-buzz-homepage-activation.sql
```

- [ ] **Step 2: Confirm staged content**

```bash
git status --short
```

Expected: exactly one line, `A  docs/database/engineering-college/17-latest-buzz-homepage-activation.sql`. If other unrelated files are staged, unstage them with `git reset HEAD <file>`.

- [ ] **Step 3: Commit with descriptive message**

```bash
git commit -m "$(cat <<'EOF'
feat(engineering): activate Latest Buzz homepage section

Flip the existing pre-positioned LatestBuzz CMS block to visible,
mirror main institution site styling (light cream, simple cards,
gold-italic header), and seed 4 placeholder blog posts under the
latest-buzz category so the carousel renders real content.

SQL recorded in docs/database/engineering-college/17-* per
CLAUDE.md document-first workflow. Migration already applied to
Engineering Supabase (kyvfkyjmdbtyimtedkie).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds, single-file change recorded.

- [ ] **Step 4: Push to origin**

```bash
git push origin master
```

Expected: push succeeds. Vercel will pick up the docs change but no application code changed, so production behaviour was already updated the moment the SQL applied to engineering Supabase.

---

### Task 6: Final verification & cleanup

**Files:** *(no file writes)*

- [ ] **Step 1: Production smoke test**

Visit `https://engg.jkkn.ac.in/` in a fresh browser window (or incognito to bypass CDN cache). Confirm the same visual outcome as Task 4 Step 4. If a CDN cache delay shows the old version, wait ~2 minutes and reload.

- [ ] **Step 2: Update task tracker**

In the parent session's TaskList:

- Mark task `Hand off to writing-plans skill` as completed.
- If implementation tasks were tracked, mark them completed.

- [ ] **Step 3: Report outcome to user**

Summarise back to the user:
- Section now live on engineering homepage
- 4 placeholder posts seeded — list slugs so editor knows what to replace
- Editor workflow: log into `/admin/blog`, edit each post to upload real `featured_image` + revise excerpt/title/content
- Rollback path on file at end of `17-latest-buzz-homepage-activation.sql`

---

## Self-Review

Reviewing the plan against the spec:

| Spec section | Plan task(s) covering it | Status |
|---|---|---|
| §1 Goal | Tasks 2-4 (migration + smoke test) | ✅ |
| §2 Background (already-positioned block) | Task 1 Step 1 (capture id), Task 3 Step 1 (pre-state) | ✅ |
| §3 Architecture (1 UPDATE + 4 INSERTs) | Task 2 (SQL doc), Task 3 (apply) | ✅ |
| §4 Props (mirror main + engineering subtitle) | Task 2 Step 1 (jsonb_build_object), Task 3 Step 4 (verify) | ✅ |
| §5 Seed posts (4 with Unsplash) | Task 2 Step 1 (INSERT block), Task 3 Step 5 (verify) | ✅ |
| §6 Documentation (engineering-college/17-…) | Task 2, Task 5 | ✅ |
| §7 Idempotency | Task 2 Step 1 (`ON CONFLICT DO NOTHING`), Task 3 Step 3 (apply_migration) | ✅ |
| §8 Verification | Tasks 3, 4, 6 | ✅ |
| §9 Rollback | Task 2 Step 1 (rollback section in SQL file) | ✅ |
| §10 Out of scope | (informational, no task needed) | ✅ |
| §11 Risk assessment | Task 1 (pre-flight discovery mitigates) | ✅ |
| §12 Implementation handoff | This plan itself | ✅ |

**Placeholder scan:** No `TBD`, `TODO`, or `implement later` text anywhere. The only angle-bracket markers are `<LATEST_BUZZ_BLOCK_ID>` and `<SEED_AUTHOR_ID>`, which are explicit "fill from Task 1 outputs" — these are values discovered at runtime, not authorial placeholders.

**Type/identifier consistency:** UUID literals (`2e6304f1-2940-4e8d-8347-ee845a9aa309`, `48e5c55d-196b-43ed-8d5c-9d905106d553`) appear identically across Task 1, 2, 3, 4, and 6. Slug strings appear identically in Task 2 INSERT, Task 3 Step 5 expected output, and Task 6 rollback section.

**Spec coverage gaps:** None. Every numbered spec section maps to at least one task step.
