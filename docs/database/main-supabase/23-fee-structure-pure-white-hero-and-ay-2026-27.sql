-- ============================================
-- Fee Structure — Pure-White Hero (#ffffff) + Academic Year 2026-27
-- ============================================
-- Purpose: (1) Flip the /fee-structure AdmissionHero from `gradient-light`
--              to `solid` so the base background is pure #ffffff (bg-white).
--              Paired with a small component patch to skip the two dark
--              vignette overlays on `solid`/`transparent` backgrounds, which
--              guarantees every pixel of the hero surface is #ffffff.
--          (2) Update all four occurrences of the "2025-26" academic year
--              string to "2026-27" across the hero badge, hero subtitle,
--              FAQ subtitle, and the Engineering FAQ answer.
--
--          Migration 22 switched the hero to `gradient-light` (near-white
--          with 5% brand-green corner tint). This migration finalizes the
--          white treatment to perfect #ffffff and bumps the AY.
-- Created: 2026-04-21
-- Dependencies:
--   - cms_page_blocks rows:
--       * '003be9c7-9768-4cc4-842f-c49a14f04352' — AdmissionHero (hero)
--       * 'fd10c88a-7692-4e13-a0bd-7af2278ef7dd' — FAQSectionBlock
--   - components/cms-blocks/admissions/admission-hero.tsx
--       (needsDarkOverlay gate — only renders the two dark overlays when
--        backgroundColor !== 'solid' && backgroundColor !== 'transparent')
--   - components/cms-blocks/admissions/shared/admission-glass-styles.ts
--       (backgroundStyles.solid = 'bg-white' = #ffffff)
-- Used by: /fee-structure public page
-- Security: Standard RLS UPDATE on cms_page_blocks (admin role only)
-- Rollback:
--   UPDATE cms_page_blocks
--   SET props = jsonb_set(
--                 replace(props::text, '2026-27', '2025-26')::jsonb,
--                 '{backgroundColor}',
--                 '"gradient-light"'::jsonb,
--                 false
--               )
--   WHERE id = '003be9c7-9768-4cc4-842f-c49a14f04352';
--   UPDATE cms_page_blocks
--   SET props = replace(props::text, '2026-27', '2025-26')::jsonb
--   WHERE id = 'fd10c88a-7692-4e13-a0bd-7af2278ef7dd';
-- ============================================

-- Step 1: Hero block — replace 2025-26 → 2026-27 (badge.text, subtitle),
--                      then flip backgroundColor to "solid" (#ffffff).
-- Composed in a single expression so both transformations apply to the
-- same source JSONB in the correct order (text replace first, then
-- structural jsonb_set on the result).
UPDATE cms_page_blocks
SET
  props = jsonb_set(
    replace(props::text, '2025-26', '2026-27')::jsonb,
    '{backgroundColor}',
    '"solid"'::jsonb,
    false
  ),
  updated_at = now()
WHERE id = '003be9c7-9768-4cc4-842f-c49a14f04352'
  AND component_name = 'AdmissionHero';

-- Step 2: FAQ block — replace 2025-26 → 2026-27 (subtitle + Engineering FAQ answer).
UPDATE cms_page_blocks
SET
  props = replace(props::text, '2025-26', '2026-27')::jsonb,
  updated_at = now()
WHERE id = 'fd10c88a-7692-4e13-a0bd-7af2278ef7dd'
  AND component_name = 'FAQSectionBlock';

-- Step 3: Verification — must return 0 residual '2025-26' strings across the page.
-- SELECT SUM((length(b.props::text) - length(replace(b.props::text, '2025-26', ''))) / length('2025-26'))
--          AS residual_2025_26
-- FROM cms_page_blocks b
-- JOIN cms_pages p ON p.id = b.page_id
-- WHERE p.slug = 'fee-structure';
--
-- SELECT props->>'backgroundColor' AS hero_bg
-- FROM cms_page_blocks
-- WHERE id = '003be9c7-9768-4cc4-842f-c49a14f04352';

-- End of Fee Structure — Pure-White Hero + AY 2026-27
-- ============================================
