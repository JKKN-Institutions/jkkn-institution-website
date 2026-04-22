-- ============================================
-- Fee Structure — Point College Cards at Subdomain Fee URLs
-- ============================================
-- Purpose: Update the CollegesGrid props on /fee-structure so each
--          card's `link` points to the respective college's own
--          subdomain /fee-structure page (opens in a new tab).
--          Colleges without a dedicated subdomain (Education,
--          Allied Health) continue pointing at the internal fallback
--          pages seeded in migration 25.
--
--          This pairs with a component-level patch in
--          components/cms-blocks/admissions/colleges-grid.tsx that
--          renders the card root as a raw <a target="_blank"> when
--          the link is an absolute http(s) URL, and falls back to
--          Next <Link> for relative URLs.
--
--          Subdomain mapping (source: CLAUDE.md multi-institution table):
--            engineering    → https://engg.jkkn.ac.in/fee-structure
--            arts & science → https://arts.jkkn.ac.in/fee-structure
--            dental         → https://dental.jkkn.ac.in/fee-structure
--            pharmacy       → https://pharmacy.jkkn.ac.in/fee-structure
--            nursing        → https://nursing.jkkn.ac.in/fee-structure
--            education      → /fee-structure/education       (no subdomain)
--            allied health  → /fee-structure/allied-health   (no subdomain)
-- Created: 2026-04-21
-- Dependencies:
--   - Migration 26 (created the CollegesGrid row on /fee-structure)
--   - components/cms-blocks/admissions/colleges-grid.tsx
--     (external-link branch via `isExternalLink = /^https?:\/\//i.test(link)`)
-- Used by: /fee-structure public page
-- Security: Standard RLS UPDATE on cms_page_blocks (admin role only)
-- Rollback: rerun migration 26 to replace the colleges array with the
--           original internal /fee-structure/[slug] links, OR apply the
--           inverse jsonb_set below:
--           UPDATE cms_page_blocks SET props = jsonb_set(
--             props, '{colleges}', '[...original 7 internal links...]'::jsonb
--           ) WHERE page_id = (SELECT id FROM cms_pages WHERE slug='fee-structure')
--             AND component_name = 'CollegesGrid';
-- Note: The 7 internal /fee-structure/[college] pages from migration 25
--       are NOT deleted. They remain as SEO-indexed fallback pages and
--       serve as destinations for Education and Allied Health cards.
-- ============================================

UPDATE cms_page_blocks
SET
  props = jsonb_set(
    props,
    '{colleges}',
    jsonb_build_array(
      jsonb_build_object(
        'name',        'JKKN College of Engineering',
        'description', 'B.E / B.Tech / M.E / MBA — Fees from ₹30,000/yr',
        'headerColor', '#0b6d41',
        'link',        'https://engg.jkkn.ac.in/fee-structure'
      ),
      jsonb_build_object(
        'name',        'JKKN College of Arts & Science',
        'description', 'UG & PG in arts, science, commerce, design — from ₹20,000/yr',
        'headerColor', '#0b6d41',
        'link',        'https://arts.jkkn.ac.in/fee-structure'
      ),
      jsonb_build_object(
        'name',        'JKKN College of Education',
        'description', 'B.Ed — TNTEU counselling; MQ ₹35,000/yr',
        'headerColor', '#0b6d41',
        'link',        '/fee-structure/education'
      ),
      jsonb_build_object(
        'name',        'JKKN Dental College & Hospital',
        'description', 'BDS (5 yrs) & MDS (3 yrs) — Fees from ₹4,50,000/yr',
        'headerColor', '#0b6d41',
        'link',        'https://dental.jkkn.ac.in/fee-structure'
      ),
      jsonb_build_object(
        'name',        'JKKN College of Pharmacy',
        'description', 'B.Pharm / Pharm.D / M.Pharm — Fees from ₹70,000/yr',
        'headerColor', '#0b6d41',
        'link',        'https://pharmacy.jkkn.ac.in/fee-structure'
      ),
      jsonb_build_object(
        'name',        'JKKN College of Nursing',
        'description', 'B.Sc / PB B.Sc / M.Sc Nursing — Fees from ₹65,000/yr',
        'headerColor', '#0b6d41',
        'link',        'https://nursing.jkkn.ac.in/fee-structure'
      ),
      jsonb_build_object(
        'name',        'JKKN College of Allied Health Sciences',
        'description', 'Cardiac / OTA / Radiology / Dialysis & more — from ₹60,000/yr',
        'headerColor', '#0b6d41',
        'link',        '/fee-structure/allied-health'
      )
    ),
    false
  ),
  updated_at = now()
WHERE page_id = (SELECT id FROM cms_pages WHERE slug = 'fee-structure')
  AND component_name = 'CollegesGrid';

-- Verification (run separately):
--   SELECT
--     idx,
--     c->>'name' AS college,
--     c->>'link' AS href,
--     CASE WHEN c->>'link' ~* '^https?://' THEN 'external' ELSE 'internal' END AS link_type
--   FROM cms_page_blocks,
--        LATERAL jsonb_array_elements(props->'colleges') WITH ORDINALITY AS arr(c, idx)
--   WHERE page_id = (SELECT id FROM cms_pages WHERE slug='fee-structure')
--     AND component_name = 'CollegesGrid'
--   ORDER BY idx;
-- Expected: 5 'external' rows + 2 'internal' rows.

-- End of Fee Structure — Cards Link to Subdomain Fee URLs
-- ============================================
