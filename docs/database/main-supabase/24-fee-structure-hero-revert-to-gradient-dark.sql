-- ============================================
-- Fee Structure — Revert Hero Background to Dark Green Gradient
-- ============================================
-- Purpose: Flip the /fee-structure AdmissionHero `backgroundColor` prop
--          from `"solid"` (pure #ffffff) back to the original
--          `"gradient-dark"` (#0b6d41 → #085032 → #032816).
--
--          Context: Migration 22 switched this hero from gradient-dark
--          to gradient-light. Migration 23 then pushed it to "solid"
--          (pure white) paired with a component-level patch that
--          suppresses decorative layers on solid/transparent surfaces.
--          User feedback after seeing the flat-white result: prefer the
--          original dark green gradient. This migration restores that.
-- Created: 2026-04-21
-- Dependencies:
--   - cms_page_blocks row id = '003be9c7-9768-4cc4-842f-c49a14f04352'
--     (AdmissionHero on page slug = 'fee-structure')
--   - components/cms-blocks/admissions/admission-hero.tsx
--       (needsDecorativeLayers gate — on gradient-dark the flag is true,
--        so the dark vignette + gold accent + dot pattern all render as
--        they did pre-migration-22. No component change required here.)
-- Used by: /fee-structure public page hero
-- Security: Standard RLS UPDATE on cms_page_blocks (admin role only)
-- Rollback: UPDATE cms_page_blocks
--           SET props = jsonb_set(props, '{backgroundColor}', '"solid"'::jsonb, false)
--           WHERE id = '003be9c7-9768-4cc4-842f-c49a14f04352';
-- Note: The academic-year swap (2025-26 → 2026-27) from migration 23 is
--       PRESERVED. This migration only touches backgroundColor.
-- ============================================

-- Step 1: Revert backgroundColor to the original dark green gradient.
UPDATE cms_page_blocks
SET
  props = jsonb_set(
    props,
    '{backgroundColor}',
    '"gradient-dark"'::jsonb,
    false
  ),
  updated_at = now()
WHERE id = '003be9c7-9768-4cc4-842f-c49a14f04352'
  AND component_name = 'AdmissionHero';

-- Step 2: Verification — must return 'gradient-dark' and AY 2026-27 text intact.
-- SELECT props->>'backgroundColor'    AS bg,
--        props->'badge'->>'text'      AS badge_text,
--        left(props->>'subtitle', 90) AS subtitle_preview
-- FROM cms_page_blocks
-- WHERE id = '003be9c7-9768-4cc4-842f-c49a14f04352';

-- End of Fee Structure — Revert Hero to Gradient Dark
-- ============================================
