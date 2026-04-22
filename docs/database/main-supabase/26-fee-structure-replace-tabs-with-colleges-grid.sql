-- ============================================
-- Fee Structure — Replace TabsBlock with CollegesGrid (card selector)
-- ============================================
-- Purpose: On /fee-structure, replace the single TabsBlock
--          (component_name='TabsBlock', sort_order=2) with a
--          CollegesGrid block showing 7 clickable cards, one per
--          JKKN college. Each card redirects to its own per-college
--          fee-structure page seeded in migration 25.
--
--          UX change: users now land on a "choose your college"
--          selector instead of scrolling through 7 tabs of fees;
--          each college page is SEO-focused ("Engineering fees 2026-27"
--          ranks far better than a single all-colleges tab).
--
--          MUST run AFTER migration 25 (which seeds the per-college
--          pages that these cards link to) — if run before 25, the
--          card links will 404.
-- Created: 2026-04-21
-- Dependencies:
--   - Migration 25 (creates /fee-structure/{engineering, arts-and-science,
--                                           education, dental, pharmacy,
--                                           nursing, allied-health})
--   - components/cms-blocks/admissions/colleges-grid.tsx
--     (patched in this session so the whole card becomes a <Link>
--      when college.link is set — enabling full-card click targets)
--   - cms_page_blocks row 'd951788a-74ad-4fad-badf-beb960ecfd8e'
--     (the TabsBlock being removed)
-- Used by: /fee-structure public page
-- Security: Standard RLS DELETE + INSERT on cms_page_blocks (admin role only)
-- Rollback: Restore the TabsBlock by re-running migration 11
--           (docs/database/main-supabase/11-phase1-aeo-pages-seed.sql)
--           or by reinserting the TabsBlock row from git history.
-- ============================================

-- Step 1: Delete the existing TabsBlock row.
DELETE FROM cms_page_blocks
WHERE id = 'd951788a-74ad-4fad-badf-beb960ecfd8e'
  AND component_name = 'TabsBlock';

-- Step 2: Insert the CollegesGrid block at the same sort_order (2).
-- Props define the 7 clickable cards pointing at the new per-college
-- pages seeded in migration 25. All card accent bars use JKKN primary
-- green (#0b6d41) to keep visual consistency with the brand.
INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props, is_visible)
SELECT
  p.id,
  'CollegesGrid',
  2,
  jsonb_build_object(
    'badge', 'CHOOSE YOUR COLLEGE',
    'title', 'Fee Structure by College',
    'titleAccentWord', 'College',
    'subtitle', 'Select a college to view detailed course-wise fees for academic year 2026-27.',
    'colleges', jsonb_build_array(
      jsonb_build_object('name', 'JKKN College of Engineering',              'description', 'B.E / B.Tech / M.E / MBA — Fees from ₹30,000/yr',         'headerColor', '#0b6d41', 'link', '/fee-structure/engineering'),
      jsonb_build_object('name', 'JKKN College of Arts & Science',           'description', 'UG & PG in arts, science, commerce, design — from ₹20,000/yr', 'headerColor', '#0b6d41', 'link', '/fee-structure/arts-and-science'),
      jsonb_build_object('name', 'JKKN College of Education',                'description', 'B.Ed — TNTEU counselling; MQ ₹35,000/yr',                'headerColor', '#0b6d41', 'link', '/fee-structure/education'),
      jsonb_build_object('name', 'JKKN Dental College & Hospital',           'description', 'BDS (5 yrs) & MDS (3 yrs) — Fees from ₹4,50,000/yr',     'headerColor', '#0b6d41', 'link', '/fee-structure/dental'),
      jsonb_build_object('name', 'JKKN College of Pharmacy',                 'description', 'B.Pharm / Pharm.D / M.Pharm — Fees from ₹70,000/yr',     'headerColor', '#0b6d41', 'link', '/fee-structure/pharmacy'),
      jsonb_build_object('name', 'JKKN College of Nursing',                  'description', 'B.Sc / PB B.Sc / M.Sc Nursing — Fees from ₹65,000/yr',   'headerColor', '#0b6d41', 'link', '/fee-structure/nursing'),
      jsonb_build_object('name', 'JKKN College of Allied Health Sciences',   'description', 'Cardiac / OTA / Radiology / Dialysis & more — from ₹60,000/yr', 'headerColor', '#0b6d41', 'link', '/fee-structure/allied-health')
    ),
    'columns', '3',
    'backgroundColor', 'gradient-light',
    'showAnimations', true,
    'accentColor', '#0b6d41'
  ),
  true
FROM cms_pages p
WHERE p.slug = 'fee-structure';

-- Step 3: Verification (run separately after the migration):
--   SELECT sort_order, component_name,
--          COALESCE(jsonb_array_length(props->'colleges'), 0) AS college_count
--   FROM cms_page_blocks
--   WHERE page_id = (SELECT id FROM cms_pages WHERE slug = 'fee-structure')
--   ORDER BY sort_order;
-- Expected rows:
--   1  AdmissionHero    0
--   2  CollegesGrid     7   ← new
--   3  FAQSectionBlock  0
--   4  CallToAction     0

-- End of Fee Structure — Replace TabsBlock with CollegesGrid
-- ============================================
