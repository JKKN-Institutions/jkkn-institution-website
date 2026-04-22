-- ============================================
-- Fee Structure — Hero Background to White (gradient-light)
-- ============================================
-- Purpose: Flip the /fee-structure AdmissionHero from the dark green
--          gradient (`gradient-dark`) to the component's light-mode
--          variant (`gradient-light`), which renders as ~95% pure white
--          with an imperceptible 5% brand-green corner tint.
--
--          This completes the light-mode visual treatment for the Fee
--          Structure page — migrations 19/20/21 already switched all
--          content, FAQ, and scholarship sections to light backgrounds;
--          the hero was the last remaining dark block.
-- Created: 2026-04-21
-- Dependencies:
--   - cms_page_blocks row id = '003be9c7-9768-4cc4-842f-c49a14f04352'
--     (AdmissionHero on page slug = 'fee-structure')
--   - components/cms-blocks/admissions/admission-hero.tsx
--     (reads props.backgroundColor; flips text/CTA/pattern colors via
--      isDarkBackground() helper — no component change required)
-- Used by: /fee-structure public page hero section
-- Security: Standard RLS UPDATE on cms_page_blocks (admin role only)
-- Rollback: UPDATE ... SET props = jsonb_set(props, '{backgroundColor}',
--           '"gradient-dark"'::jsonb) WHERE id = '003be9c7-...';
-- ============================================

-- Step 1: Update the hero block's backgroundColor prop to gradient-light.
-- Uses jsonb_set so the rest of the props JSONB (badge, title, subtitle,
-- ctaButtons) is preserved byte-for-byte.
UPDATE cms_page_blocks
SET
  props = jsonb_set(
    props,
    '{backgroundColor}',
    '"gradient-light"'::jsonb,
    false -- do not create the key if it's missing; it already exists
  ),
  updated_at = now()
WHERE id = '003be9c7-9768-4cc4-842f-c49a14f04352'
  AND component_name = 'AdmissionHero';

-- Step 2: Verification query — must return 'gradient-light'.
-- SELECT props->>'backgroundColor' AS bg
-- FROM cms_page_blocks
-- WHERE id = '003be9c7-9768-4cc4-842f-c49a14f04352';

-- End of Fee Structure — Hero Background to White
-- ============================================
