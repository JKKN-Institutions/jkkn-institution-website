-- ============================================
-- Migration 37 — Autonomous Badge on Engineering & Arts & Science Cards
-- ============================================
-- Purpose: Set badge="Autonomous" on the two CollegesGrid cards (JKKN College
--   of Engineering and JKKN College of Arts & Science) inside both the Fee
--   Structure CollegesGrid block and the Scholarships CollegesGrid block on
--   the main institution site. This visually flags the autonomous-status
--   colleges on the public hub pages without altering name, description,
--   header colour, or link of any card.
--
--   Requires the matching schema/component change shipped in the same commit:
--     • lib/cms/registry-types.ts — adds optional `badge` field to
--       CollegeItemSchema.
--     • components/cms-blocks/admissions/colleges-grid.tsx — renders a small
--       gold pill (bg-secondary + text-primary) at the card's top-right when
--       `college.badge` is set, and folds the badge into the card's aria-label
--       for screen-reader users.
--
-- Created: 2026-05-15
-- Dependencies:
--   • cms_page_blocks rows seeded by Migrations 26, 30, 31, 34, 36.
--   • Schema/component changes listed above must ship together — without them
--     the new `badge` JSONB key is harmless (component ignores unknown keys via
--     z.string().optional()), but the pill won't render.
-- Verified IDs (re-confirmed via execute_sql before this migration):
--   • CollegesGrid on /fee-structure = d6c16510-8002-4dfe-acff-36e974630ca9
--   • CollegesGrid on /scholarships  = 6751a7e0-7ab2-44fa-ade8-6a7a4d20d89d
-- Affects: /fee-structure and /scholarships hub pages on the main institution
--   site only. The 5 other cards (Education, Dental, Pharmacy, Nursing, Allied
--   Health) and the entire ordering of the array are preserved byte-for-byte
--   from Migration 36.
-- Security: No RLS impact (UPDATE on public-published blocks).
-- Strategy: Full-array overwrite of `props.colleges` mirrors the style used by
--   Migrations 31, 34, and 36 — safer than per-index jsonb_set because it
--   preserves the entire ordered tuple atomically and makes the new state
--   self-evident in the migration body.
-- Rollback: Re-apply Migration 36 to restore the previous state. The `badge`
--   field will simply be absent and the React component will render no pill
--   when the value is undefined.
-- ============================================

-- ─── Fee Structure CollegesGrid — add badge="Autonomous" to Engineering & Arts ─
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{colleges}',
  '[
    {"link":"https://engg.jkkn.ac.in/fee-structure","name":"JKKN College of Engineering","description":"B.E / B.Tech / M.E / MBA — Fees from ₹30,000/yr","headerColor":"#0b6d41","badge":"Autonomous"},
    {"link":"https://cas.jkkn.ac.in/fee-structure","name":"JKKN College of Arts & Science","description":"UG & PG in arts, science, commerce, design — from ₹20,000/yr","headerColor":"#0b6d41","badge":"Autonomous"},
    {"link":"https://edu.jkkn.ac.in/fee-structure","name":"JKKN College of Education","description":"B.Ed — TNTEU counselling; MQ ₹35,000/yr","headerColor":"#0b6d41"},
    {"link":"https://dental.jkkn.ac.in/fees-structure/","name":"JKKN Dental College & Hospital","description":"BDS (5 yrs) & MDS (3 yrs) — Fees from ₹4,50,000/yr","headerColor":"#0b6d41"},
    {"link":"https://pharmacy.jkkn.ac.in/fee-structure/","name":"JKKN College of Pharmacy","description":"B.Pharm / Pharm.D / M.Pharm — Fees from ₹70,000/yr","headerColor":"#0b6d41"},
    {"link":"https://nursing.sresakthimayeil.jkkn.ac.in/fee-structure","name":"JKKN College of Nursing","description":"B.Sc / PB B.Sc / M.Sc Nursing — Fees from ₹65,000/yr","headerColor":"#0b6d41"},
    {"link":"https://ahs.jkkn.ac.in/fee-structure","name":"JKKN College of Allied Health Sciences","description":"Cardiac / OTA / Radiology / Dialysis & more — from ₹60,000/yr","headerColor":"#0b6d41"}
  ]'::jsonb
)
WHERE id = 'd6c16510-8002-4dfe-acff-36e974630ca9';

-- ─── Scholarships CollegesGrid — add badge="Autonomous" to Engineering & Arts ─
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{colleges}',
  '[
    {"link":"https://engg.jkkn.ac.in/scholarships","name":"JKKN College of Engineering","description":"PMSS, First-Graduate, Trust merit awards up to 100% for B.E / B.Tech / M.E / MBA","headerColor":"#0b6d41","badge":"Autonomous"},
    {"link":"https://cas.jkkn.ac.in/scholarships","name":"JKKN College of Arts & Science","description":"Cross-college government and Naan Mudhalvan schemes for UG / PG learners","headerColor":"#0b6d41","badge":"Autonomous"},
    {"link":"https://edu.jkkn.ac.in/scholarships","name":"JKKN College of Education","description":"Government Quota PMSS and maintenance support for B.Ed candidates","headerColor":"#0b6d41"},
    {"link":"https://dental.jkkn.ac.in/scholarships/","name":"JKKN Dental College & Hospital","description":"PMSS up to ₹6L / yr, First-Graduate ₹40K / yr, Naan Mudhalvan for BDS","headerColor":"#0b6d41"},
    {"link":"https://pharmacy.jkkn.ac.in/scholarships/","name":"JKKN College of Pharmacy","description":"PMSS, Trust and First-Graduate aid for Pharm D / B.Pharm / M.Pharm","headerColor":"#0b6d41"},
    {"link":"https://nursing.sresakthimayeil.jkkn.ac.in/scholarships","name":"JKKN College of Nursing","description":"PMSS, First-Graduate, Naan Mudhalvan for B.Sc / M.Sc / PB.B.Sc Nursing","headerColor":"#0b6d41"},
    {"link":"https://ahs.jkkn.ac.in/scholarships","name":"JKKN College of Allied Health Sciences","description":"Trust scholarship and Naan Mudhalvan for paramedical learners","headerColor":"#0b6d41"}
  ]'::jsonb
)
WHERE id = '6751a7e0-7ab2-44fa-ade8-6a7a4d20d89d';

-- End of Migration 37
-- ============================================
