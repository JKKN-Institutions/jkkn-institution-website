-- ============================================
-- Migration 40 — Fix Institution Count in Home Page FAQ Blocks
-- ============================================
-- Purpose: Correct "11 institutions (7 colleges + 4 schools)" to
--          "9 institutions (7 colleges + 2 schools)" across two FAQ blocks
--          on the home page. JKKN has 7 colleges and 2 schools (not 4).
--
-- Created: 2026-05-20
-- Spec: User request with screenshot showing incorrect count in home FAQ.
--
-- Affects (DB):
--   1. cms_page_blocks id=f245b9ff-58ad-4be3-bbdc-4eacc911fb8e (home, sort_order 16)
--      - faq index 0: "11 institutions (7 colleges and 4 schools) offering..."
--        → "9 institutions (7 colleges and 2 schools) offering..."
--      - faq index 8: "11 institutions (7 colleges + 4 schools) under one roof..."
--        → "9 institutions (7 colleges + 2 schools) under one roof..."
--   2. cms_page_blocks id=db99af45-d188-4d1b-a25d-188da7e58c2b (home, sort_order 19)
--      - faq index 8: "11 institutions (7 colleges + 4 schools) under one roof..."
--        → "9 institutions (7 colleges + 2 schools) under one roof..."
--
-- Strategy: Two text REPLACE passes per block — one for the "and" variant,
--   one for the "+" variant. A REPLACE is a no-op when the substring is absent,
--   so applying both patterns to both blocks is safe.
--
-- Idempotency: Yes. REPLACE is a no-op once the old substring is gone.
-- Security: No RLS or policy changes.
-- Rollback:
--   UPDATE cms_page_blocks
--   SET props = REPLACE(REPLACE(props::text,
--     '9 institutions (7 colleges and 2 schools)', '11 institutions (7 colleges and 4 schools)'),
--     '9 institutions (7 colleges + 2 schools)',   '11 institutions (7 colleges + 4 schools)')::jsonb
--   WHERE id IN ('f245b9ff-58ad-4be3-bbdc-4eacc911fb8e',
--                'db99af45-d188-4d1b-a25d-188da7e58c2b');
-- ============================================

-- Block 1: Home FAQ (sort_order 16) — has both "and" and "+" variants
UPDATE cms_page_blocks
SET props = REPLACE(
  REPLACE(
    props::text,
    '11 institutions (7 colleges and 4 schools)',
    '9 institutions (7 colleges and 2 schools)'
  ),
  '11 institutions (7 colleges + 4 schools)',
  '9 institutions (7 colleges + 2 schools)'
)::jsonb
WHERE id = 'f245b9ff-58ad-4be3-bbdc-4eacc911fb8e';

-- Block 2: Home FAQ (sort_order 19) — has "+" variant only
UPDATE cms_page_blocks
SET props = REPLACE(
  props::text,
  '11 institutions (7 colleges + 4 schools)',
  '9 institutions (7 colleges + 2 schools)'
)::jsonb
WHERE id = 'db99af45-d188-4d1b-a25d-188da7e58c2b';

-- End of Migration 40
-- ============================================
