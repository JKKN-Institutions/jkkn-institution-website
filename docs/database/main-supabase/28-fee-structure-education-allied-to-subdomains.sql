-- ============================================
-- Fee Structure — Point Education + Allied Health Cards at New Subdomains
-- ============================================
-- Purpose: Migration 27 kept Education and Allied Health on internal
--          fallback URLs because no dedicated subdomains had been
--          provisioned for them. User has now confirmed the two
--          subdomains are live:
--             Education     → https://edu.jkkn.ac.in/fee-structure
--             Allied Health → https://ahs.jkkn.ac.in/fee-structure
--          This migration flips those two card links to the new
--          subdomains so all 7 cards on /fee-structure now redirect
--          externally (open in a new tab via the <a target="_blank">
--          branch in colleges-grid.tsx).
--
--          Surgical approach: use jsonb_set on specific array indexes
--          so the update touches exactly two keys and the audit diff
--          makes the intent obvious. Array indexes in the CollegesGrid
--          block's `colleges` array (zero-based):
--            0 engineering    1 arts-and-science   2 EDUCATION
--            3 dental         4 pharmacy           5 nursing
--            6 ALLIED HEALTH
-- Created: 2026-04-21
-- Dependencies:
--   - Migration 27 (set the initial 7-card array; this migration
--     assumes Education is at idx 2 and Allied Health at idx 6)
--   - components/cms-blocks/admissions/colleges-grid.tsx
--     (external-link branch already in place from migration 27's pair)
-- Used by: /fee-structure public page
-- Security: Standard RLS UPDATE on cms_page_blocks (admin role only)
-- Rollback:
--   UPDATE cms_page_blocks
--   SET props = jsonb_set(
--     jsonb_set(props, '{colleges,2,link}', '"/fee-structure/education"'::jsonb, false),
--     '{colleges,6,link}', '"/fee-structure/allied-health"'::jsonb, false)
--   WHERE page_id = (SELECT id FROM cms_pages WHERE slug='fee-structure')
--     AND component_name = 'CollegesGrid';
-- ============================================

UPDATE cms_page_blocks
SET
  props = jsonb_set(
    jsonb_set(
      props,
      '{colleges,2,link}',
      '"https://edu.jkkn.ac.in/fee-structure"'::jsonb,
      false
    ),
    '{colleges,6,link}',
    '"https://ahs.jkkn.ac.in/fee-structure"'::jsonb,
    false
  ),
  updated_at = now()
WHERE page_id = (SELECT id FROM cms_pages WHERE slug = 'fee-structure')
  AND component_name = 'CollegesGrid';

-- Verification (run separately):
--   SELECT idx, c->>'name' AS college, c->>'link' AS href,
--          CASE WHEN c->>'link' ~* '^https?://' THEN 'external' ELSE 'internal' END AS link_type
--   FROM cms_page_blocks,
--        LATERAL jsonb_array_elements(props->'colleges') WITH ORDINALITY AS arr(c, idx)
--   WHERE page_id = (SELECT id FROM cms_pages WHERE slug='fee-structure')
--     AND component_name = 'CollegesGrid'
--   ORDER BY idx;
-- Expected: 7 rows, ALL link_type = 'external'.

-- End of Fee Structure — Education + Allied Health Subdomain Routing
-- ============================================
