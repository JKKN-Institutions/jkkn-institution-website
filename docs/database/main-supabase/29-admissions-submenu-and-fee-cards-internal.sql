-- ============================================
-- Migration 29 — Admissions Submenu Wiring + Fee CollegesGrid Cards Routed Internally
-- ============================================
-- Purpose: Implements Units A and B of the 2026-04-24 main-admissions-subnav-and-process spec.
--   Unit A: Reparents `fee-structure` and `scholarships` CMS pages under the `admissions`
--           page so they appear as children of the Admissions top-level nav menu.
--   Unit B: Updates the CollegesGrid block on `/fee-structure` to route each college card
--           to its internal /fee-structure/{college} CMS page (F2 fallback architecture).
--           Each subdomain URL (engg.jkkn.ac.in/fee-structure, etc.) currently 404s.
--
-- Created: 2026-04-25
-- Spec: docs/superpowers/specs/2026-04-24-main-admissions-subnav-and-process-design.md
-- Dependencies: cms_pages, cms_page_blocks (Unit A); CollegesGrid block on fee-structure page (Unit B)
-- Verified IDs:
--   - admissions      page = 4f96c885-1ae9-41c3-b017-51d7bfae3a87
--   - fee-structure   page = 34a92672-94aa-4237-9afc-0bf1e6cd23c1
--   - scholarships    page = 206d9a67-2729-4a95-8074-48535214696c
--   - CollegesGrid block on fee-structure = d6c16510-8002-4dfe-acff-36e974630ca9
-- Affects: Top-level navigation tree (getPublicNavigation server action), fee-structure hub page UI
-- URL changes: NONE — slugs stay at root (/fee-structure, /scholarships)
-- Security: No RLS impact (UPDATE on already-public published pages and a public block)
-- Rollback: Migration 30 if needed (set parent_id back to NULL, restore subdomain links from migrations 27 + 28)
-- ============================================

-- ─── Unit A — Reparent Fee Structure and Scholarships under Admissions ───────
-- After this runs, getPublicNavigation() returns Admissions with two children:
-- "Fee Structure" (sort_order 1) and "Scholarships" (sort_order 2).
-- URLs remain /fee-structure and /scholarships (no path inheritance from parent slug).

UPDATE cms_pages
SET
  parent_id          = '4f96c885-1ae9-41c3-b017-51d7bfae3a87',  -- Admissions
  show_in_navigation = true,
  navigation_label   = 'Fee Structure',
  sort_order         = 1
WHERE id = '34a92672-94aa-4237-9afc-0bf1e6cd23c1';              -- fee-structure

UPDATE cms_pages
SET
  parent_id          = '4f96c885-1ae9-41c3-b017-51d7bfae3a87',  -- Admissions
  show_in_navigation = true,
  navigation_label   = 'Scholarships',
  sort_order         = 2
WHERE id = '206d9a67-2729-4a95-8074-48535214696c';              -- scholarships

-- ─── Unit B — Update CollegesGrid props on /fee-structure hub ────────────────
-- Each card's `link` field is rewritten to its internal /fee-structure/{college}
-- destination so users land on the seeded per-college fee tables.
-- The subdomain destinations (engg.jkkn.ac.in/fee-structure, etc.) all 404 today;
-- when each subdomain ships its own /fee-structure, flip the relevant card's
-- link field back via the admin page builder — no code change.

UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{colleges}',
  '[
    {"link":"/fee-structure/engineering","name":"JKKN College of Engineering","description":"B.E / B.Tech / M.E / MBA — Fees from ₹30,000/yr","headerColor":"#0b6d41"},
    {"link":"/fee-structure/arts-and-science","name":"JKKN College of Arts & Science","description":"UG & PG in arts, science, commerce, design — from ₹20,000/yr","headerColor":"#0b6d41"},
    {"link":"/fee-structure/education","name":"JKKN College of Education","description":"B.Ed — TNTEU counselling; MQ ₹35,000/yr","headerColor":"#0b6d41"},
    {"link":"/fee-structure/dental","name":"JKKN Dental College & Hospital","description":"BDS (5 yrs) & MDS (3 yrs) — Fees from ₹4,50,000/yr","headerColor":"#0b6d41"},
    {"link":"/fee-structure/pharmacy","name":"JKKN College of Pharmacy","description":"B.Pharm / Pharm.D / M.Pharm — Fees from ₹70,000/yr","headerColor":"#0b6d41"},
    {"link":"/fee-structure/nursing","name":"JKKN College of Nursing","description":"B.Sc / PB B.Sc / M.Sc Nursing — Fees from ₹65,000/yr","headerColor":"#0b6d41"},
    {"link":"/fee-structure/allied-health","name":"JKKN College of Allied Health Sciences","description":"Cardiac / OTA / Radiology / Dialysis & more — from ₹60,000/yr","headerColor":"#0b6d41"}
  ]'::jsonb
)
WHERE id = 'd6c16510-8002-4dfe-acff-36e974630ca9';              -- CollegesGrid on fee-structure

-- End of Migration 29
-- ============================================
