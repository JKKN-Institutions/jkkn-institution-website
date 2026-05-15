-- ============================================
-- 21 — Engineering Homepage: White Backgrounds for Latest Buzz & FAQ
-- ============================================
-- Purpose: Switch the Latest Buzz and FAQ sections on the engineering
--   homepage to pure white (#ffffff) backgrounds. Both blocks were
--   previously rendering on the dark green gradient because:
--     1. LatestBuzz had no `backgroundColor` prop in its Zod schema,
--        so the value set in 17-latest-buzz-homepage-activation.sql
--        (#f9f9f9) was silently dropped.
--     2. FAQAccordion had no `backgroundColor` prop at all, so the
--        section rendered with a transparent background and inherited
--        whatever the page wrapper had.
--   Component changes (commit alongside this migration) extend all three
--   blocks (LatestBuzz, FAQSectionBlock, FAQAccordion) to honor a hex/rgb
--   backgroundColor as an inline CSS color.
-- Created: 2026-05-12
-- Dependencies:
--   - components/cms-blocks/content/latest-buzz.tsx (schema + render
--     updated to accept `backgroundColor` + auto-light theme)
--   - components/cms-blocks/content/faq-section-block.tsx (render
--     updated to treat hex `backgroundColor` as inline style + light)
--   - components/cms-blocks/content/faq-accordion.tsx (schema +
--     render updated to accept `backgroundColor` inline style)
--   - lib/cms/registry-types.ts (FAQAccordionPropsSchema gains
--     `backgroundColor` field)
--   - cms_page_blocks row for LatestBuzz (id =
--     27031ffb-a3b6-41fb-b3f7-b619f16c2a73, sort_order=5)
--   - cms_page_blocks row for FAQAccordion (id =
--     c580992b-3dcb-4d50-a31b-84c97f009f4f, sort_order=9) on the
--     engineering homepage (page_id = 2e6304f1-2940-4e8d-8347-ee845a9aa309)
-- Idempotency: jsonb concat (`||`) overwrites only the listed keys
--   and leaves all other props untouched. Re-running is a no-op.
-- Rollback: see end of file (commented out for safety).
-- ============================================

BEGIN;

-- 1) Latest Buzz: white background + modern-light variant so the
--    text, dots, and badge auto-flip to dark-on-light styling.
UPDATE cms_page_blocks
SET props = props
       || jsonb_build_object(
            'variant',         'modern-light',
            'backgroundColor', '#ffffff'
          ),
    updated_at = NOW()
WHERE id = '27031ffb-a3b6-41fb-b3f7-b619f16c2a73';

-- 2) FAQ Section: white background. Component now detects the leading
--    '#' and applies it as inline CSS background + forces isDark=false.
UPDATE cms_page_blocks
SET props = props
       || jsonb_build_object(
            'backgroundColor', '#ffffff'
          ),
    updated_at = NOW()
WHERE page_id = '2e6304f1-2940-4e8d-8347-ee845a9aa309'
  AND component_name = 'FAQAccordion';

COMMIT;

-- ============================================
-- VERIFICATION (run after migration)
-- ============================================
-- SELECT id, component_name, sort_order, is_visible,
--        props->>'variant'         AS variant,
--        props->>'backgroundColor' AS background_color
-- FROM cms_page_blocks
-- WHERE page_id = '2e6304f1-2940-4e8d-8347-ee845a9aa309'
--   AND component_name IN ('LatestBuzz', 'FAQAccordion')
-- ORDER BY sort_order;
--
-- Expected: both rows show backgroundColor = '#ffffff'.
-- LatestBuzz should also show variant = 'modern-light'.
-- ============================================

-- ============================================
-- ROLLBACK (run only if you need to revert)
-- ============================================
-- BEGIN;
-- UPDATE cms_page_blocks
-- SET props = (props - 'backgroundColor') || jsonb_build_object('variant', 'modern-dark'),
--     updated_at = NOW()
-- WHERE id = '27031ffb-a3b6-41fb-b3f7-b619f16c2a73';
--
-- UPDATE cms_page_blocks
-- SET props = props || jsonb_build_object('backgroundColor', 'gradient-dark'),
--     updated_at = NOW()
-- WHERE page_id = '2e6304f1-2940-4e8d-8347-ee845a9aa309'
--   AND component_name = 'FAQAccordion';
-- COMMIT;
-- ============================================
-- End of 21 — Engineering Homepage: White Backgrounds for Latest Buzz & FAQ
-- ============================================
