-- ============================================
-- Migration 34 — Scholarships CollegesGrid Cards → Subdomain URLs (All 7 Colleges)
-- ============================================
-- Purpose: Switch the CollegesGrid block on /scholarships from internal
--   /scholarships/{college} links (set in Migration 30 Unit C.1) to the
--   institution subdomain URLs (https://{college}.jkkn.ac.in/scholarships).
--
--   This mirrors Migration 31 (which did the same flip for /fee-structure)
--   so that visitors see a consistent destination domain pattern across the
--   two Admissions sub-hubs.
--
--   The 7 internal /scholarships/{college} CMS pages remain published but
--   unreachable from navigation (parent_id set, show_in_navigation=false) —
--   they act as a safety net for any cached or external links until
--   explicitly unpublished. The Arts & Science fallback page in particular
--   stays valuable as the "AY 2026-27 institutional scheme is being finalised"
--   landing.
--
-- Created: 2026-04-25
-- Spec: docs/superpowers/specs/2026-04-24-main-admissions-subnav-and-process-design.md
--       (extended at execution per user request 2026-04-25)
-- Dependencies: cms_page_blocks (CollegesGrid block on /scholarships)
-- Verified IDs:
--   - CollegesGrid block on /scholarships = 6751a7e0-7ab2-44fa-ade8-6a7a4d20d89d
-- Affects: /scholarships hub page card click destinations
-- Security: No RLS impact (UPDATE on a public-published block).
-- Subdomain map (mirrors Migration 31 — same simplified aliases for cards):
--   engineering       → engg.jkkn.ac.in
--   arts-and-science  → arts.jkkn.ac.in     [alias of cas.jkkn.ac.in]
--   education         → edu.jkkn.ac.in
--   dental            → dental.jkkn.ac.in
--   pharmacy          → pharmacy.jkkn.ac.in
--   nursing           → nursing.jkkn.ac.in  [alias of nursing.sresakthimayeil.jkkn.ac.in]
--   allied-health     → ahs.jkkn.ac.in
-- Rollback: Re-apply Migration 30 Unit C.1's CollegesGrid props (or run the
--   inverse UPDATE pointing each link back to /scholarships/{college}).
-- ============================================

UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{colleges}',
  '[
    {"link":"https://engg.jkkn.ac.in/scholarships","name":"JKKN College of Engineering","description":"PMSS, First-Graduate, Trust merit awards up to 100% for B.E / B.Tech / M.E / MBA","headerColor":"#0b6d41"},
    {"link":"https://arts.jkkn.ac.in/scholarships","name":"JKKN College of Arts & Science","description":"Cross-college government and Naan Mudhalvan schemes for UG / PG learners","headerColor":"#0b6d41"},
    {"link":"https://edu.jkkn.ac.in/scholarships","name":"JKKN College of Education","description":"Government Quota PMSS and maintenance support for B.Ed candidates","headerColor":"#0b6d41"},
    {"link":"https://dental.jkkn.ac.in/scholarships","name":"JKKN Dental College & Hospital","description":"PMSS up to ₹6L / yr, First-Graduate ₹40K / yr, Naan Mudhalvan for BDS","headerColor":"#0b6d41"},
    {"link":"https://pharmacy.jkkn.ac.in/scholarships","name":"JKKN College of Pharmacy","description":"PMSS, Trust and First-Graduate aid for Pharm D / B.Pharm / M.Pharm","headerColor":"#0b6d41"},
    {"link":"https://nursing.jkkn.ac.in/scholarships","name":"JKKN College of Nursing","description":"PMSS, First-Graduate, Naan Mudhalvan for B.Sc / M.Sc / PB.B.Sc Nursing","headerColor":"#0b6d41"},
    {"link":"https://ahs.jkkn.ac.in/scholarships","name":"JKKN College of Allied Health Sciences","description":"Trust scholarship and Naan Mudhalvan for paramedical learners","headerColor":"#0b6d41"}
  ]'::jsonb
)
WHERE id = '6751a7e0-7ab2-44fa-ade8-6a7a4d20d89d';

-- End of Migration 34
-- ============================================
