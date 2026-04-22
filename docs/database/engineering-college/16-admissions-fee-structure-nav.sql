-- ============================================
-- Engineering College — Admissions Nav + Fee Structure Subpage
-- ============================================
-- Purpose: Add an "ADMISSIONS" top-level navigation item with two children:
--          "OVERVIEW" -> /admissions
--          "FEE STRUCTURE" -> /admissions/fee-structure
-- Created: 2026-04-21
-- Institution: Engineering College (kyvfkyjmdbtyimtedkie)
-- Dependencies: public.cms_nav_items (created in 07-navigation-system.sql)
-- Used by: components/public/site-header.tsx — navigation is fetched from
--          cms_nav_items at request time, filtered by is_active = true,
--          and rendered via NavDropdownItem / NavMobileItem.
-- Security: INSERT uses the existing anon-SELECT / authenticated-write RLS.
-- Idempotency: Safe to re-run — guarded with NOT EXISTS on label.
-- ============================================

-- Place ADMISSIONS between COURSES (display_order 3) and GALLERY (display_order 4)
-- by inserting at display_order = 4 and shifting the subsequent items down.

BEGIN;

-- ── 1. Shift existing top-level items from display_order 4..9 down by 1 ──────
UPDATE public.cms_nav_items
SET    display_order = display_order + 1,
       updated_at    = now()
WHERE  parent_id IS NULL
  AND  display_order >= 4
  AND  label <> 'ADMISSIONS';

-- ── 2. Insert ADMISSIONS parent + two children ──────────────────────────────
WITH admissions_parent AS (
  INSERT INTO public.cms_nav_items (label, href, display_order, is_homepage, parent_id, is_active)
  SELECT 'ADMISSIONS', '/admissions', 4, false, NULL, true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.cms_nav_items
    WHERE label = 'ADMISSIONS' AND parent_id IS NULL
  )
  RETURNING id
),
parent_ref AS (
  SELECT id FROM admissions_parent
  UNION ALL
  SELECT id FROM public.cms_nav_items
  WHERE label = 'ADMISSIONS' AND parent_id IS NULL
  LIMIT 1
)
INSERT INTO public.cms_nav_items (label, href, display_order, is_homepage, parent_id, is_active)
SELECT child.label, child.href, child.display_order, false, (SELECT id FROM parent_ref), true
FROM (VALUES
  ('OVERVIEW',      '/admissions',                 1),
  ('FEE STRUCTURE', '/admissions/fee-structure',   2)
) AS child(label, href, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.cms_nav_items existing
  WHERE existing.parent_id = (SELECT id FROM parent_ref)
    AND existing.label = child.label
);

COMMIT;

-- ── Verification (run manually after migration) ─────────────────────────────
-- SELECT n.label, n.href, n.display_order, p.label AS parent
-- FROM   public.cms_nav_items n
-- LEFT JOIN public.cms_nav_items p ON p.id = n.parent_id
-- WHERE  n.label = 'ADMISSIONS'
--    OR  p.label = 'ADMISSIONS'
-- ORDER BY n.parent_id NULLS FIRST, n.display_order;

-- End of 16-admissions-fee-structure-nav.sql
-- ============================================
