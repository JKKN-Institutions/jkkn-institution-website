-- ============================================
-- Migration 33 — Surface "Admission Guide" Submenu Linking to /admissions
-- ============================================
-- Purpose: Adds a third child to the Admissions top-level menu that links back to
--   /admissions. The existing "Complete Admission Guide" CMS row (id 5f1809bd-...,
--   slug 'admission-guide', published 2026-04-17) already had real content blocks
--   — AdmissionHero, AdmissionProcessTimeline, FAQSectionBlock, CallToAction — but
--   was hidden from navigation (parent_id=null, show_in_navigation=false).
--
--   User decision (2026-04-25): override the link target so the menu item leads to
--   /admissions (the hardcoded _main-page.tsx for institutionId=main) rather than
--   /admission-guide. The page row is reused as the navigation anchor; its blocks
--   remain in place but the menu link bypasses them via external_url.
--
--   Final Admissions submenu order after this migration:
--     1. Admission Guide  → /admissions       (this migration)
--     2. Fee Structure    → /fee-structure    (Migration 29)
--     3. Scholarships     → /scholarships     (Migration 29)
--
--   The buildNavTree function in app/actions/cms/navigation.ts already prefers
--   external_url over slug-derived hrefs (line 34), and 10 existing pages use
--   this pattern for subdomain college sites — no code change required.
--
-- Created: 2026-04-25
-- Spec: docs/superpowers/specs/2026-04-24-main-admissions-subnav-and-process-design.md (§5.A — extended at execution)
-- Dependencies: cms_pages
-- Verified IDs:
--   - admissions page             = 4f96c885-1ae9-41c3-b017-51d7bfae3a87
--   - existing admission-guide    = 5f1809bd-8eea-4630-a048-76c035bc1dc2
-- Affects: Admissions submenu (one new visible child item)
-- URL changes: NONE — /admissions and /admission-guide both remain reachable.
-- Security: No RLS impact (UPDATE on already-public published page).
-- Rollback:
--   UPDATE cms_pages
--   SET parent_id = NULL, show_in_navigation = false, external_url = NULL,
--       sort_order = 0
--   WHERE id = '5f1809bd-8eea-4630-a048-76c035bc1dc2';
-- ============================================

UPDATE cms_pages
SET
  parent_id          = '4f96c885-1ae9-41c3-b017-51d7bfae3a87',  -- Admissions
  show_in_navigation = true,
  navigation_label   = 'Admission Guide',
  sort_order         = 0,                                        -- first under Admissions
  external_url       = '/admissions'                             -- nav bypass: link goes to /admissions
WHERE id = '5f1809bd-8eea-4630-a048-76c035bc1dc2';

-- End of Migration 33
-- ============================================
