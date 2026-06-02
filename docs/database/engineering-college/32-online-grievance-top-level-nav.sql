-- ============================================
-- Engineering Site — Promote "Online Grievance and Redressal" to the Main Menu
-- ============================================
-- Purpose: Surface "Online Grievance and Redressal" as a TOP-LEVEL item on the
--          main navigation bar (not buried inside the OTHERS dropdown). The page
--          itself is a first-party branded page that embeds the institution's
--          Google grievance form:
--            • app/(public)/online-grievance-and-redressal/page.tsx
--
--          Supersedes the earlier same-session change that had merely re-shown
--          the item inside the OTHERS dropdown. Here we re-parent the existing
--          cms_pages row to the root (parent_id = NULL) and give it a sort_order
--          between MANDATORY DISCLOSURE (11) and CONTACT, nudging CONTACT to 13
--          so it stays last.
--
--          Public navigation is built by getPublicNavigation() in
--          app/actions/cms/navigation.ts (status='published' AND
--          visibility='public' AND show_in_navigation=true). buildNavTree()
--          treats parent_id = NULL rows as root items; the row's href stays
--          /online-grievance-and-redressal, which resolves to the static page
--          above (static routes shadow the cms_pages catch-all).
--
-- Target row (Engineering DB, confirmed 2026-06-02):
--   id    = f486db1b-2566-44ee-a404-9e7e4963c78d
--   slug  = 'online-grievance-and-redressal'
--   was:  parent_id = fdb4f5a6-... (OTHERS), sort_order 10, show_in_navigation
--         had been toggled true earlier this session.
--   now:  parent_id = NULL, sort_order 12, show_in_navigation = true.
--
-- Created: 2026-06-02
-- Institution: Engineering College (kyvfkyjmdbtyimtedkie)
-- Dependencies: public.cms_pages (slug, parent_id, sort_order,
--               show_in_navigation, updated_at).
-- Used by: app/actions/cms/navigation.ts → getPublicNavigation()
--          → components/public/site-header.tsx.
-- Security: Standard cms_pages RLS.
-- Idempotency: Matched by slug; re-runs converge to the same state.
-- Rollback (return it to the OTHERS dropdown, restore CONTACT):
--   UPDATE public.cms_pages
--      SET parent_id = 'fdb4f5a6-c211-4636-9b55-01edc071dc45'::uuid,
--          sort_order = 10, updated_at = now()
--    WHERE slug = 'online-grievance-and-redressal';
--   UPDATE public.cms_pages
--      SET sort_order = 12, updated_at = now()
--    WHERE slug = 'contact' AND parent_id IS NULL;
-- ============================================

BEGIN;

-- Keep CONTACT last by shifting it down one slot.
UPDATE public.cms_pages
   SET sort_order = 13,
       updated_at = now()
 WHERE slug = 'contact'
   AND parent_id IS NULL;

-- Promote the grievance page to a top-level main-menu item.
UPDATE public.cms_pages
   SET parent_id          = NULL,
       sort_order         = 12,
       show_in_navigation = true,
       updated_at         = now()
 WHERE slug = 'online-grievance-and-redressal';

COMMIT;

-- ── Verification ───────────────────────────────────────────────────────────
-- SELECT title, slug, parent_id, sort_order, show_in_navigation
-- FROM   public.cms_pages
-- WHERE  parent_id IS NULL AND show_in_navigation = true AND status = 'published'
-- ORDER  BY sort_order;
--
-- Expected tail: ... MANDATORY DISCLOSURE (11),
--                    Online Grievance and Redressal (12, parent_id NULL),
--                    CONTACT (13).

-- End of 32-online-grievance-top-level-nav.sql
-- ============================================
