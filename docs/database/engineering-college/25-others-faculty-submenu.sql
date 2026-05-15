-- ============================================
-- Engineering Site — Add Faculty Link Under OTHERS Dropdown
-- ============================================
-- Purpose: Surface the existing static /faculty listing page from the global
--          header by adding a Faculty entry under the OTHERS dropdown.
--
--          Discovery (2026-05-15): public navigation is built by
--          getPublicNavigation() in app/actions/cms/navigation.ts, which reads
--          rows from public.cms_pages — NOT from public.cms_nav_items. The
--          cms_nav_items table exists (created in mig-07) but no code path
--          consumes it; it is vestigial. The visible OTHERS dropdown in the
--          live header is built from cms_pages rows whose parent_id points to
--          the OTHERS cms_pages row (id fdb4f5a6-c211-4636-9b55-01edc071dc45).
--
-- Live state of OTHERS children at time of writing (13 rows, sort_order 0-12):
--   Gallery, Achievements (draft), Academic Calendar, Digital Campus (draft),
--   Examination, Examination Manual, Minority Committee, NSS,
--   Drug Free Tamilnadu Orientation Program, Privacy Policy,
--   Online Grievance and Redressal, Research and Development Cell,
--   Why Students Choose JKKN?
--
-- After this migration:
--   • A new cms_pages row 'Faculty' is added at sort_order 13 (last position
--     under OTHERS), with external_url = '/faculty'. The page itself is a
--     static React page at app/(public)/faculty/page.tsx; the cms_pages row
--     is a "shadow nav shortcut" — same pattern as the admission-guide row
--     documented in observation 2950.
--   • The earlier insert into cms_nav_items (OTHERS top-level + Faculty
--     child) is reverted. cms_nav_items.CONTACT.display_order is also
--     restored from 11 back to 10. Those rows were noise that no code reads.
--
-- Rationale:
--   • Stakeholder direction: Faculty belongs under OTHERS, not as its own
--     top-level menu.
--   • external_url = '/faculty' tells buildNavTree() to ignore the
--     slug-derived href and link directly to the static route. The slug
--     'faculty' is kept consistent with the URL it points to, though only
--     external_url is functionally significant for nav rendering.
--   • sort_order 13 puts Faculty at the end of the existing dropdown so we
--     don't reshuffle muscle memory for users of the other 13 items.
-- Created: 2026-05-15
-- Institution: Engineering College (kyvfkyjmdbtyimtedkie)
-- Dependencies:
--   • public.cms_pages table.
--   • OTHERS parent row (id fdb4f5a6-c211-4636-9b55-01edc071dc45) — present
--     in production, seeded outside the documented migration chain.
--   • A valid auth.users row referenced by created_by — reused from the
--     OTHERS parent's created_by (b92f8ccd-b811-4c5a-a93d-1eed2b5f4a60).
--   • /faculty static React page (app/(public)/faculty/page.tsx).
-- Used by: app/actions/cms/navigation.ts → getPublicNavigation()
--          → buildNavTree(), consumed by components/public/site-header.tsx
--          and components/public/nav-dropdown-item.tsx.
-- Security: Standard cms_pages RLS.
-- Idempotency: INSERT guarded by NOT EXISTS on (parent_id, title); rollback
--              statements on cms_nav_items are guarded by label/href filters.
--              Safe to re-run.
-- Rollback:
--   DELETE FROM cms_pages
--    WHERE title='Faculty' AND parent_id='fdb4f5a6-c211-4636-9b55-01edc071dc45';
-- ============================================

BEGIN;

-- ── 1. Insert Faculty as a child of OTHERS in cms_pages (idempotent) ───────
INSERT INTO public.cms_pages
  (title, slug, navigation_label, parent_id, sort_order,
   show_in_navigation, status, visibility, is_homepage, external_url,
   created_by)
SELECT
  'Faculty',
  'faculty',
  NULL,                                                -- fall back to title
  'fdb4f5a6-c211-4636-9b55-01edc071dc45'::uuid,       -- OTHERS parent
  13,                                                  -- last in dropdown
  true,
  'published',
  'public',
  false,
  '/faculty',                                          -- shadow nav shortcut
  'b92f8ccd-b811-4c5a-a93d-1eed2b5f4a60'::uuid        -- inherit OTHERS owner
WHERE NOT EXISTS (
  SELECT 1 FROM public.cms_pages
  WHERE  title     = 'Faculty'
    AND  parent_id = 'fdb4f5a6-c211-4636-9b55-01edc071dc45'::uuid
);

-- ── 2. Revert earlier (incorrect) writes to cms_nav_items ──────────────────
-- The previous attempt inserted an OTHERS top-level and a Faculty child into
-- cms_nav_items, and bumped CONTACT.display_order from 10 to 11. None of
-- those changes are visible in the UI (cms_nav_items is not consumed), but
-- we clean them up so the table reflects pre-attempt state.
DELETE FROM public.cms_nav_items
 WHERE label    = 'Faculty'
   AND parent_id IN (
     SELECT id FROM public.cms_nav_items
     WHERE label = 'OTHERS' AND parent_id IS NULL
   );

DELETE FROM public.cms_nav_items
 WHERE label = 'OTHERS' AND parent_id IS NULL;

UPDATE public.cms_nav_items
   SET display_order = 10,
       updated_at    = now()
 WHERE label         = 'CONTACT'
   AND parent_id IS NULL
   AND display_order = 11;

COMMIT;

-- ── Verification ───────────────────────────────────────────────────────────
-- SELECT title, slug, sort_order, show_in_navigation, status, external_url
-- FROM   public.cms_pages
-- WHERE  parent_id = 'fdb4f5a6-c211-4636-9b55-01edc071dc45'::uuid
-- ORDER  BY sort_order;
--
-- Expected: 14 rows, with Faculty at sort_order 13, status=published,
--           show_in_navigation=true, external_url=/faculty.

-- End of 25-others-faculty-submenu.sql
-- ============================================
