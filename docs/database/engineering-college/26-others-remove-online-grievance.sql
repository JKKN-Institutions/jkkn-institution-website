-- ============================================
-- Engineering Site — Remove "Online Grievance and Redressal" from OTHERS Menu
-- ============================================
-- Purpose: Hide the "Online Grievance and Redressal" entry from the global
--          header's OTHERS dropdown on the Engineering site. The grievance
--          form is now surfaced as a dedicated section inside the Mandatory
--          Disclosure page (app/(public)/mandatory-disclosure/page.tsx via
--          components/cms-blocks/shared/online-form-section.tsx), so the
--          standalone OTHERS menu item is redundant.
--
--          Public navigation is built by getPublicNavigation() in
--          app/actions/cms/navigation.ts, which selects cms_pages rows where
--          status='published' AND visibility='public' AND show_in_navigation
--          = true. Setting show_in_navigation = false removes the row from the
--          menu while KEEPING the page row and its content/route intact
--          (the internal page /online-grievance-and-redressal remains
--          reachable by direct URL). This is the same, reversible mechanism the
--          admin panel uses — preferred over a hard DELETE.
--
-- Target row (Engineering DB, confirmed 2026-06-01):
--   id        = f486db1b-2566-44ee-a404-9e7e4963c78d
--   title     = 'Online Grievance and Redressal'
--   slug      = 'online-grievance-and-redressal'
--   parent_id = fdb4f5a6-c211-4636-9b55-01edc071dc45  (OTHERS dropdown)
--   sort_order= 10, status=published, visibility=public, external_url=NULL
--
-- Created: 2026-06-01
-- Institution: Engineering College (kyvfkyjmdbtyimtedkie)
-- Dependencies:
--   • public.cms_pages table (columns: slug, parent_id, show_in_navigation,
--     updated_at — all verified present).
--   • OTHERS parent row (id fdb4f5a6-c211-4636-9b55-01edc071dc45).
-- Used by: app/actions/cms/navigation.ts → getPublicNavigation()
--          → buildNavTree(), consumed by components/public/site-header.tsx
--          and components/public/nav-dropdown-item.tsx.
-- Security: Standard cms_pages RLS.
-- Idempotency: Matched by (parent_id, slug) — not the generated row id — and
--              guarded by `show_in_navigation = true`, so re-runs are no-ops.
-- Rollback (restore the menu item):
--   UPDATE public.cms_pages
--      SET show_in_navigation = true, updated_at = now()
--    WHERE parent_id = 'fdb4f5a6-c211-4636-9b55-01edc071dc45'::uuid
--      AND slug = 'online-grievance-and-redressal';
-- ============================================

BEGIN;

UPDATE public.cms_pages
   SET show_in_navigation = false,
       updated_at         = now()
 WHERE parent_id          = 'fdb4f5a6-c211-4636-9b55-01edc071dc45'::uuid
   AND slug               = 'online-grievance-and-redressal'
   AND show_in_navigation = true;

COMMIT;

-- ── Verification ───────────────────────────────────────────────────────────
-- SELECT title, slug, sort_order, show_in_navigation, status, visibility
-- FROM   public.cms_pages
-- WHERE  parent_id = 'fdb4f5a6-c211-4636-9b55-01edc071dc45'::uuid
-- ORDER  BY sort_order;
--
-- Expected: the "Online Grievance and Redressal" row now has
--           show_in_navigation = false; all other OTHERS children unchanged.

-- End of 26-others-remove-online-grievance.sql
-- ============================================
