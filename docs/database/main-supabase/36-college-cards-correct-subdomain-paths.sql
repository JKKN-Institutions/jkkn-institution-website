-- ============================================
-- Migration 36 — Correct Subdomain Paths on Fee Structure & Scholarships CollegesGrid Cards
-- ============================================
-- Purpose: Update the `link` field of each card in the two CollegesGrid blocks
--   on the Main institution site so that visitors land on the actual live page
--   that exists on each college subdomain. Migrations 31 (fee-structure) and
--   34 (scholarships) wired all 7 cards to the simplified alias pattern
--   `https://{slug}.jkkn.ac.in/{section}` — but several institutions publish
--   these pages on different hosts or path spellings. This migration corrects
--   five cards to the URLs the institutions actually serve, per user-supplied
--   list dated 2026-04-27.
--
--   Changes applied (link field only — name/description/headerColor untouched):
--
--   FEE STRUCTURE block (id d6c16510-8002-4dfe-acff-36e974630ca9):
--     Arts & Science : https://arts.jkkn.ac.in/fee-structure
--                    → https://cas.jkkn.ac.in/fee-structure
--     Dental         : https://dental.jkkn.ac.in/fee-structure
--                    → https://dental.jkkn.ac.in/fees-structure/   [note: "fees" + trailing slash]
--     Pharmacy       : https://pharmacy.jkkn.ac.in/fee-structure
--                    → https://pharmacy.jkkn.ac.in/fee-structure/
--     Nursing        : https://nursing.jkkn.ac.in/fee-structure
--                    → https://nursing.sresakthimayeil.jkkn.ac.in/fee-structure
--     Allied Health  : (unchanged — already https://ahs.jkkn.ac.in/fee-structure)
--     Engineering    : (untouched — not in user list)
--     Education      : (untouched — not in user list)
--
--   SCHOLARSHIPS block (id 6751a7e0-7ab2-44fa-ade8-6a7a4d20d89d):
--     Arts & Science : https://arts.jkkn.ac.in/scholarships
--                    → https://cas.jkkn.ac.in/scholarships
--     Dental         : https://dental.jkkn.ac.in/scholarships
--                    → https://dental.jkkn.ac.in/scholarships/
--     Pharmacy       : https://pharmacy.jkkn.ac.in/scholarships
--                    → https://pharmacy.jkkn.ac.in/scholarships/
--     Nursing        : https://nursing.jkkn.ac.in/scholarships
--                    → https://nursing.sresakthimayeil.jkkn.ac.in/scholarships
--     Allied Health  : (unchanged — already https://ahs.jkkn.ac.in/scholarships)
--     Engineering    : (untouched — not in user list)
--     Education      : (untouched — not in user list)
--
-- Created: 2026-04-27
-- Source: User-confirmed live URLs (2026-04-27 chat).
-- Dependencies: cms_page_blocks rows seeded by Migrations 26, 30, 31, 34.
-- Verified IDs (re-confirmed via execute_sql before this migration):
--   - CollegesGrid on /fee-structure  = d6c16510-8002-4dfe-acff-36e974630ca9
--   - CollegesGrid on /scholarships   = 6751a7e0-7ab2-44fa-ade8-6a7a4d20d89d
-- Affects: /fee-structure and /scholarships hub-page card click destinations.
-- Security: No RLS impact (UPDATE on public-published blocks).
-- Strategy: Full-array overwrite of `props.colleges` (mirrors the style used by
--   Migrations 31 and 34) — safer than per-index jsonb_set because it preserves
--   the entire ordered tuple atomically and makes the new state self-evident
--   in the migration body.
-- Rollback: Re-apply Migration 31 (fee-structure) and Migration 34 (scholarships)
--   in that order to restore the simplified-alias URLs.
-- ============================================

-- Fee Structure CollegesGrid — links corrected for Arts (CAS), Dental, Pharmacy, Nursing
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{colleges}',
  '[
    {"link":"https://engg.jkkn.ac.in/fee-structure","name":"JKKN College of Engineering","description":"B.E / B.Tech / M.E / MBA — Fees from ₹30,000/yr","headerColor":"#0b6d41"},
    {"link":"https://cas.jkkn.ac.in/fee-structure","name":"JKKN College of Arts & Science","description":"UG & PG in arts, science, commerce, design — from ₹20,000/yr","headerColor":"#0b6d41"},
    {"link":"https://edu.jkkn.ac.in/fee-structure","name":"JKKN College of Education","description":"B.Ed — TNTEU counselling; MQ ₹35,000/yr","headerColor":"#0b6d41"},
    {"link":"https://dental.jkkn.ac.in/fees-structure/","name":"JKKN Dental College & Hospital","description":"BDS (5 yrs) & MDS (3 yrs) — Fees from ₹4,50,000/yr","headerColor":"#0b6d41"},
    {"link":"https://pharmacy.jkkn.ac.in/fee-structure/","name":"JKKN College of Pharmacy","description":"B.Pharm / Pharm.D / M.Pharm — Fees from ₹70,000/yr","headerColor":"#0b6d41"},
    {"link":"https://nursing.sresakthimayeil.jkkn.ac.in/fee-structure","name":"JKKN College of Nursing","description":"B.Sc / PB B.Sc / M.Sc Nursing — Fees from ₹65,000/yr","headerColor":"#0b6d41"},
    {"link":"https://ahs.jkkn.ac.in/fee-structure","name":"JKKN College of Allied Health Sciences","description":"Cardiac / OTA / Radiology / Dialysis & more — from ₹60,000/yr","headerColor":"#0b6d41"}
  ]'::jsonb
)
WHERE id = 'd6c16510-8002-4dfe-acff-36e974630ca9';

-- Scholarships CollegesGrid — links corrected for Arts (CAS), Dental, Pharmacy, Nursing
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{colleges}',
  '[
    {"link":"https://engg.jkkn.ac.in/scholarships","name":"JKKN College of Engineering","description":"PMSS, First-Graduate, Trust merit awards up to 100% for B.E / B.Tech / M.E / MBA","headerColor":"#0b6d41"},
    {"link":"https://cas.jkkn.ac.in/scholarships","name":"JKKN College of Arts & Science","description":"Cross-college government and Naan Mudhalvan schemes for UG / PG learners","headerColor":"#0b6d41"},
    {"link":"https://edu.jkkn.ac.in/scholarships","name":"JKKN College of Education","description":"Government Quota PMSS and maintenance support for B.Ed candidates","headerColor":"#0b6d41"},
    {"link":"https://dental.jkkn.ac.in/scholarships/","name":"JKKN Dental College & Hospital","description":"PMSS up to ₹6L / yr, First-Graduate ₹40K / yr, Naan Mudhalvan for BDS","headerColor":"#0b6d41"},
    {"link":"https://pharmacy.jkkn.ac.in/scholarships/","name":"JKKN College of Pharmacy","description":"PMSS, Trust and First-Graduate aid for Pharm D / B.Pharm / M.Pharm","headerColor":"#0b6d41"},
    {"link":"https://nursing.sresakthimayeil.jkkn.ac.in/scholarships","name":"JKKN College of Nursing","description":"PMSS, First-Graduate, Naan Mudhalvan for B.Sc / M.Sc / PB.B.Sc Nursing","headerColor":"#0b6d41"},
    {"link":"https://ahs.jkkn.ac.in/scholarships","name":"JKKN College of Allied Health Sciences","description":"Trust scholarship and Naan Mudhalvan for paramedical learners","headerColor":"#0b6d41"}
  ]'::jsonb
)
WHERE id = '6751a7e0-7ab2-44fa-ade8-6a7a4d20d89d';

-- End of Migration 36
-- ============================================
