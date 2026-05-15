-- ============================================
-- Engineering Site — Admissions Submenu (cms_pages, CORRECT TABLE)
-- ============================================
-- Purpose: Reparent the `fee-structure` and `scholarships` CMS pages under
--          the `admissions` page so they appear as children of the
--          ADMISSIONS top-level nav menu. Add an "Admission Guide" shortcut
--          child that links back to /admissions itself.
--
-- Why this exists (and why migration 22 was wrong):
--   Migration 22 mutated `cms_nav_items`, which migration 18's header
--   comments incorrectly described as "the source of truth for nav".
--   The actual navigation on the Engineering site is built by
--   `app/actions/cms/navigation.ts → getPublicNavigation()` which queries
--   `cms_pages` (filtered by status=published, visibility=public,
--   show_in_navigation=true) and builds a tree from `parent_id` +
--   `sort_order`. `cms_nav_items` is referenced only in legacy /scripts/
--   files — no runtime reader. This migration corrects that mistake by
--   updating the table the SiteHeader actually consumes.
--
-- Before (current state on Engineering):
--   /admissions     → top-level nav item, no children
--   /fee-structure  → top-level OR hidden from nav (depends on seed)
--   /scholarships   → may or may not have a cms_pages row yet
--
-- After this migration:
--   ADMISSIONS (parent, top-level, label from existing page)
--    ├─ Admission Guide → /admissions          (sort_order 1, shadow entry)
--    ├─ Fee Structure   → /fee-structure       (sort_order 2)
--    └─ Scholarship     → /scholarships        (sort_order 3)
--
--   The "Admission Guide" child is a shadow cms_pages row:
--   slug = 'admission-guide', external_url = '/admissions'. When users hit
--   /admission-guide directly, the catch-all redirects them to /admissions
--   via the existing `metadata.redirect_url` mechanism in
--   app/(public)/[...slug]/page.tsx. So both the dropdown link and any
--   direct URL access lead to the same canonical /admissions page.
--
-- Created: 2026-05-14
-- Institution: Engineering College (kyvfkyjmdbtyimtedkie)
-- Dependencies:
--   • cms_pages table with show_in_navigation, parent_id, sort_order,
--     navigation_label, external_url, metadata columns.
--   • An existing `admissions` cms_pages row (required — migration aborts
--     if missing). This row is the dropdown's parent anchor.
--   • app/actions/cms/navigation.ts (getPublicNavigation reads this table).
--   • app/(public)/scholarships/page.tsx (static React page that the
--     /scholarships slug resolves to).
-- Used by:
--   • components/public/site-header.tsx (renders the dropdown).
--   • Engineering Supabase project kyvfkyjmdbtyimtedkie only.
-- Security: Standard cms_pages RLS (anon SELECT for published+public rows,
--           authenticated mutate). All INSERTs/UPDATEs run as
--           service-role through Supabase Studio.
-- Idempotency: All operations are guarded — re-running this migration
--              leaves the table in the same final state. Safe to retry.
-- Rollback:
--   UPDATE cms_pages SET parent_id=NULL, sort_order=NULL,
--                        show_in_navigation=false, navigation_label=NULL
--     WHERE slug IN ('fee-structure','scholarships','admission-guide');
--   DELETE FROM cms_pages WHERE slug='admission-guide';  -- shadow entry
-- ============================================

DO $$
DECLARE
  v_admissions_id     UUID;
  v_fee_structure_id  UUID;
  v_scholarships_id   UUID;
  v_admission_guide_id UUID;
  v_creator           UUID;
BEGIN
  -- ── 1. Resolve the ADMISSIONS parent page ────────────────────────────
  SELECT id INTO v_admissions_id
  FROM   cms_pages
  WHERE  slug = 'admissions'
  LIMIT  1;

  IF v_admissions_id IS NULL THEN
    RAISE EXCEPTION
      'No cms_pages row with slug=admissions on Engineering Supabase — cannot build dropdown. Seed the admissions page first.';
  END IF;

  -- Ensure the admissions page is published and visible as a nav parent
  UPDATE cms_pages
  SET    show_in_navigation = true,
         navigation_label   = COALESCE(navigation_label, 'Admissions'),
         updated_at         = now()
  WHERE  id = v_admissions_id;

  -- ── 2. Resolve creator UUID (for any future INSERT below) ────────────
  SELECT id INTO v_creator FROM auth.users WHERE email = 'engg@jkkn.ac.in' LIMIT 1;
  IF v_creator IS NULL THEN
    SELECT id INTO v_creator FROM auth.users ORDER BY created_at LIMIT 1;
  END IF;

  IF v_creator IS NULL THEN
    RAISE EXCEPTION
      'No auth.users on Engineering Supabase — cannot satisfy NOT NULL created_by';
  END IF;

  -- ── 3. Reparent FEE STRUCTURE under ADMISSIONS ───────────────────────
  -- Accept both slug variants: the canonical /fee-structure (per migration
  -- 18) AND the legacy /admissions/fee-structure path that the Engineering
  -- site actually uses today. Whichever exists, reparent + relabel it.
  SELECT id INTO v_fee_structure_id
  FROM   cms_pages
  WHERE  slug IN ('fee-structure', 'admissions/fee-structure')
  LIMIT  1;

  IF v_fee_structure_id IS NOT NULL THEN
    UPDATE cms_pages
    SET    parent_id          = v_admissions_id,
           show_in_navigation = true,
           navigation_label   = COALESCE(navigation_label, 'Fee Structure'),
           sort_order         = 2,
           updated_at         = now()
    WHERE  id = v_fee_structure_id;
  ELSE
    RAISE NOTICE
      'No fee-structure cms_page found (tried both slug variants) — skipping.';
  END IF;

  -- ── 4. Reparent or CREATE SCHOLARSHIPS under ADMISSIONS ──────────────
  SELECT id INTO v_scholarships_id FROM cms_pages WHERE slug = 'scholarships' LIMIT 1;

  IF v_scholarships_id IS NOT NULL THEN
    -- Existing row — just reparent and label it
    UPDATE cms_pages
    SET    parent_id          = v_admissions_id,
           show_in_navigation = true,
           navigation_label   = 'Scholarship',
           sort_order         = 3,
           updated_at         = now()
    WHERE  id = v_scholarships_id;
  ELSE
    -- No row exists — create a published row whose slug resolves to the
    -- static React page at app/(public)/scholarships/page.tsx
    INSERT INTO cms_pages (
      slug, title, description, status, visibility,
      show_in_navigation, parent_id, navigation_label, sort_order,
      published_at, created_by, updated_by
    )
    VALUES (
      'scholarships',
      'Scholarships | JKKN College of Engineering',
      'Scholarship programs available to students at JKKN College of Engineering and Technology.',
      'published', 'public',
      true, v_admissions_id, 'Scholarship', 3,
      now(), v_creator, v_creator
    );
  END IF;

  -- ── 5. INSERT (or update) the "Admission Guide" shadow shortcut ──────
  -- This is a nav-only entry: it links to /admissions (via external_url),
  -- and if someone hits /admission-guide directly the [...slug] catch-all
  -- redirects them to /admissions through the metadata.redirect_url hook.
  SELECT id INTO v_admission_guide_id FROM cms_pages WHERE slug = 'admission-guide' LIMIT 1;

  IF v_admission_guide_id IS NOT NULL THEN
    UPDATE cms_pages
    SET    parent_id          = v_admissions_id,
           show_in_navigation = true,
           navigation_label   = 'Admission Guide',
           external_url       = '/admissions',
           sort_order         = 1,
           status             = 'published',
           visibility         = 'public',
           metadata           = COALESCE(metadata, '{}'::jsonb)
                                || jsonb_build_object('redirect_url', '/admissions'),
           updated_at         = now()
    WHERE  id = v_admission_guide_id;
  ELSE
    INSERT INTO cms_pages (
      slug, title, description, status, visibility,
      show_in_navigation, parent_id, navigation_label, sort_order,
      external_url, metadata,
      published_at, created_by, updated_by
    )
    VALUES (
      'admission-guide',
      'Admission Guide — shortcut to /admissions',
      'Navigation shortcut. Redirects to /admissions.',
      'published', 'public',
      true, v_admissions_id, 'Admission Guide', 1,
      '/admissions',
      jsonb_build_object('redirect_url', '/admissions'),
      now(), v_creator, v_creator
    );
  END IF;

  RAISE NOTICE
    'Admissions dropdown wired on Engineering Supabase. Parent: %, fee-structure: %, scholarships: %',
    v_admissions_id, v_fee_structure_id, v_scholarships_id;
END $$;

-- ── Verification (run separately after migration) ──────────────────────
-- SELECT slug, navigation_label, sort_order, external_url,
--        metadata->>'redirect_url' AS redirect_url,
--        show_in_navigation
-- FROM   cms_pages
-- WHERE  slug = 'admissions'
--    OR  parent_id = (SELECT id FROM cms_pages WHERE slug='admissions')
-- ORDER BY parent_id NULLS FIRST, sort_order NULLS LAST;
--
-- Expected (4 rows):
--   admissions       | (Admissions)     | NULL | NULL          | NULL        | t
--   admission-guide  | Admission Guide  | 1    | /admissions   | /admissions | t
--   fee-structure    | Fee Structure    | 2    | NULL          | NULL        | t
--   scholarships     | Scholarship      | 3    | NULL          | NULL        | t

-- End of 23-admissions-cms-submenu-wiring.sql
-- ============================================
