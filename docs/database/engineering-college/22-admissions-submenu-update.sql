-- ============================================
-- Engineering Site — Admissions Submenu Update
-- ============================================
-- Purpose: Restructure the ADMISSIONS top-level nav dropdown to expose three
--          child entries: ADMISSION GUIDE, FEE STRUCTURE, SCHOLARSHIP.
--
--          Before this migration (post-16):
--            ADMISSIONS (parent)
--             ├─ OVERVIEW       → /admissions
--             └─ FEE STRUCTURE  → /admissions/fee-structure
--
--          After this migration:
--            ADMISSIONS (parent)
--             ├─ ADMISSION GUIDE → /admissions
--             ├─ FEE STRUCTURE   → /fee-structure
--             └─ SCHOLARSHIP     → /scholarships
--
--          Rationale:
--            • Migration 18 seeded a top-level /fee-structure CMS page on the
--              Engineering Supabase (kyvfkyjmdbtyimtedkie). The previously
--              wired `/admissions/fee-structure` href was a static React page
--              still served from the codebase — both exist, but /fee-structure
--              is the canonical SEO-indexed page. Repoint the nav so users land
--              on the canonical CMS page first.
--            • OVERVIEW was a placeholder label. "Admission Guide" matches the
--              content actually shown at /admissions (process, eligibility,
--              counselling info) and is consistent with the surrounding nav
--              labels used by sibling JKKN institution sites.
--            • A SCHOLARSHIP entry surfaces the new /scholarships page
--              (introduced in app/(public)/scholarships/) that previously had
--              no nav entry. Without this nav row, the page existed but was
--              undiscoverable from the global header.
-- Created: 2026-05-14
-- Institution: Engineering College (kyvfkyjmdbtyimtedkie)
-- Dependencies:
--   • public.cms_nav_items table (created in 07-navigation-system.sql).
--   • ADMISSIONS parent row + OVERVIEW + FEE STRUCTURE child rows
--     (seeded in 16-admissions-fee-structure-nav.sql). This migration
--     mutates those rows; it will be a no-op for rows that don't exist
--     (UPDATE skips, INSERT is NOT-EXISTS guarded).
--   • /fee-structure CMS page (seeded in 18-fee-structure-page-seed.sql).
--   • /scholarships static React page (app/(public)/scholarships/page.tsx).
-- Used by: components/public/site-header.tsx — reads cms_nav_items at request
--          time, filtered by is_active = true; renders the dropdown via
--          NavDropdownItem / NavMobileItem.
-- Security: Standard cms_nav_items RLS (anon SELECT, authenticated mutate).
-- Idempotency: All statements are guarded — re-running this migration leaves
--              the table in the same final state. Safe to run repeatedly.
-- Rollback: To revert to the migration-16 state:
--             UPDATE cms_nav_items SET label='OVERVIEW', href='/admissions'
--               WHERE parent_id=(SELECT id FROM cms_nav_items
--                 WHERE label='ADMISSIONS' AND parent_id IS NULL)
--               AND  href='/admissions';
--             UPDATE cms_nav_items SET href='/admissions/fee-structure'
--               WHERE parent_id=(SELECT id FROM cms_nav_items
--                 WHERE label='ADMISSIONS' AND parent_id IS NULL)
--               AND  label='FEE STRUCTURE';
--             DELETE FROM cms_nav_items
--               WHERE label='SCHOLARSHIP'
--               AND  parent_id=(SELECT id FROM cms_nav_items
--                 WHERE label='ADMISSIONS' AND parent_id IS NULL);
-- ============================================

BEGIN;

-- ── 1. Rename OVERVIEW → "Admission Guide" ─────────────────────────────────
-- Use the CMS-friendly title-case label. Keep the existing href so the link
-- target doesn't break.
UPDATE public.cms_nav_items
SET    label      = 'Admission Guide',
       updated_at = now()
WHERE  label    = 'OVERVIEW'
  AND  href     = '/admissions'
  AND  parent_id = (
    SELECT id FROM public.cms_nav_items
    WHERE  label = 'ADMISSIONS' AND parent_id IS NULL
  );

-- ── 2. Repoint FEE STRUCTURE → canonical /fee-structure CMS page ───────────
-- The /admissions/fee-structure URL is still served by a static React page,
-- but the SEO-indexed CMS page lives at /fee-structure (seeded in 18).
UPDATE public.cms_nav_items
SET    href       = '/fee-structure',
       label      = 'Fee Structure',
       updated_at = now()
WHERE  label IN ('FEE STRUCTURE', 'Fee Structure')
  AND  parent_id = (
    SELECT id FROM public.cms_nav_items
    WHERE  label = 'ADMISSIONS' AND parent_id IS NULL
  );

-- ── 3. Insert SCHOLARSHIP child (idempotent) ───────────────────────────────
INSERT INTO public.cms_nav_items
  (label, href, display_order, is_homepage, parent_id, is_active)
SELECT 'Scholarship',
       '/scholarships',
       3,
       false,
       (SELECT id FROM public.cms_nav_items
        WHERE label = 'ADMISSIONS' AND parent_id IS NULL),
       true
WHERE NOT EXISTS (
  SELECT 1
  FROM   public.cms_nav_items
  WHERE  label IN ('SCHOLARSHIP', 'Scholarship')
    AND  parent_id = (
      SELECT id FROM public.cms_nav_items
      WHERE  label = 'ADMISSIONS' AND parent_id IS NULL
    )
);

-- ── 4. Normalize display_order so the three items appear in the intended
--      sequence regardless of what migration 16 inserted ────────────────────
UPDATE public.cms_nav_items
SET    display_order = 1,
       updated_at    = now()
WHERE  label = 'Admission Guide'
  AND  parent_id = (
    SELECT id FROM public.cms_nav_items
    WHERE  label = 'ADMISSIONS' AND parent_id IS NULL
  );

UPDATE public.cms_nav_items
SET    display_order = 2,
       updated_at    = now()
WHERE  label = 'Fee Structure'
  AND  parent_id = (
    SELECT id FROM public.cms_nav_items
    WHERE  label = 'ADMISSIONS' AND parent_id IS NULL
  );

UPDATE public.cms_nav_items
SET    display_order = 3,
       updated_at    = now()
WHERE  label = 'Scholarship'
  AND  parent_id = (
    SELECT id FROM public.cms_nav_items
    WHERE  label = 'ADMISSIONS' AND parent_id IS NULL
  );

COMMIT;

-- ── Verification (run manually after migration) ────────────────────────────
-- SELECT n.label, n.href, n.display_order, n.is_active,
--        p.label AS parent
-- FROM   public.cms_nav_items n
-- LEFT JOIN public.cms_nav_items p ON p.id = n.parent_id
-- WHERE  n.label = 'ADMISSIONS'
--    OR  p.label = 'ADMISSIONS'
-- ORDER BY n.parent_id NULLS FIRST, n.display_order;
--
-- Expected result (4 rows):
--   ADMISSIONS        | /admissions    | 4 | t | (null)
--   Admission Guide   | /admissions    | 1 | t | ADMISSIONS
--   Fee Structure     | /fee-structure | 2 | t | ADMISSIONS
--   Scholarship       | /scholarships  | 3 | t | ADMISSIONS

-- End of 22-admissions-submenu-update.sql
-- ============================================
