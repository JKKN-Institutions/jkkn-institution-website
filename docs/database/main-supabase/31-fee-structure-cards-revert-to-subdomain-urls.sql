-- ============================================
-- Migration 31 — Revert Fee CollegesGrid Cards to Subdomain URLs (All 7 Colleges)
-- ============================================
-- Purpose: Switch the CollegesGrid block on /fee-structure back from internal
--   /fee-structure/{college} links (set in Migration 29 Unit B) to the institution
--   subdomain URLs (https://{college}.jkkn.ac.in/fee-structure for each).
--
--   Trigger: User confirmed they will create the fee-structure pages on each
--   subdomain in parallel. This restores the F1 (subdomain-direct) pattern
--   over the F2 (subdomain + internal fallback) pattern Migration 29 used.
--
--   The 7 internal /fee-structure/{college} CMS pages remain published but
--   unreachable from navigation — they act as a safety net for any cached
--   external links until explicitly unpublished.
--
-- Created: 2026-04-25
-- Spec: docs/superpowers/specs/2026-04-24-main-admissions-subnav-and-process-design.md (§5 Unit B / §11 Risks)
-- Dependencies: cms_page_blocks (CollegesGrid block on /fee-structure)
-- Verified IDs:
--   - CollegesGrid block on /fee-structure = d6c16510-8002-4dfe-acff-36e974630ca9
-- Affects: /fee-structure hub page card click destinations
-- Security: No RLS impact (UPDATE on a public block)
-- Subdomain map confirmed at design time (matches Migration 27 + 28):
--   engineering       → engg.jkkn.ac.in
--   arts-and-science  → arts.jkkn.ac.in
--   education         → edu.jkkn.ac.in
--   dental            → dental.jkkn.ac.in
--   pharmacy          → pharmacy.jkkn.ac.in
--   nursing           → nursing.jkkn.ac.in
--   allied-health     → ahs.jkkn.ac.in
-- Rollback: Re-apply Migration 29 Unit B's CollegesGrid props update.
-- ============================================

UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{colleges}',
  '[
    {"link":"https://engg.jkkn.ac.in/fee-structure","name":"JKKN College of Engineering","description":"B.E / B.Tech / M.E / MBA — Fees from ₹30,000/yr","headerColor":"#0b6d41"},
    {"link":"https://arts.jkkn.ac.in/fee-structure","name":"JKKN College of Arts & Science","description":"UG & PG in arts, science, commerce, design — from ₹20,000/yr","headerColor":"#0b6d41"},
    {"link":"https://edu.jkkn.ac.in/fee-structure","name":"JKKN College of Education","description":"B.Ed — TNTEU counselling; MQ ₹35,000/yr","headerColor":"#0b6d41"},
    {"link":"https://dental.jkkn.ac.in/fee-structure","name":"JKKN Dental College & Hospital","description":"BDS (5 yrs) & MDS (3 yrs) — Fees from ₹4,50,000/yr","headerColor":"#0b6d41"},
    {"link":"https://pharmacy.jkkn.ac.in/fee-structure","name":"JKKN College of Pharmacy","description":"B.Pharm / Pharm.D / M.Pharm — Fees from ₹70,000/yr","headerColor":"#0b6d41"},
    {"link":"https://nursing.jkkn.ac.in/fee-structure","name":"JKKN College of Nursing","description":"B.Sc / PB B.Sc / M.Sc Nursing — Fees from ₹65,000/yr","headerColor":"#0b6d41"},
    {"link":"https://ahs.jkkn.ac.in/fee-structure","name":"JKKN College of Allied Health Sciences","description":"Cardiac / OTA / Radiology / Dialysis & more — from ₹60,000/yr","headerColor":"#0b6d41"}
  ]'::jsonb
)
WHERE id = 'd6c16510-8002-4dfe-acff-36e974630ca9';

-- End of Migration 31
-- ============================================
