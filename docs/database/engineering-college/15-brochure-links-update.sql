-- ============================================
-- Migration 15: Brochure Links Update
-- ============================================
-- Purpose: Point every "Download Brochure" CTA on the Engineering College
--          website at a single canonical PDF served from /pdfs/brochure.pdf.
--          Previously, two blocks carried a '#' placeholder and two BE-Mechanical
--          blocks pointed at a non-existent '/downloads/be-mechanical-brochure.pdf'.
-- Created: 2026-04-21
-- Project: Engineering College Supabase (kyvfkyjmdbtyimtedkie)
-- Dependencies: cms_page_blocks table, cms_pages table
-- Affected blocks:
--   1. Home page  -> EngineeringAdmissionSection  -> secondaryCtaButton.link
--   2. courses-offered/pg/me-cse       -> MECSECoursePage      -> hero.ctaButtons[1].link
--   3. courses-offered/ug/be-mechanical -> BEMechanicalCoursePage -> heroCTAs[1].link
--   4. programs/be-mechanical-engineering -> BEMechanicalCoursePage -> heroCTAs[1].link
-- Security: Executes as DDL-equivalent DML; respects existing RLS. No schema change.
-- ============================================

-- 1. Home: EngineeringAdmissionSection.secondaryCtaButton
UPDATE public.cms_page_blocks
SET props = jsonb_set(props, '{secondaryCtaButton,link}', '"/pdfs/brochure.pdf"'::jsonb, false),
    updated_at = now()
WHERE id = '763d38d6-4a44-4cc8-967d-2f2f80b752f6';

-- 2. M.E CSE: hero.ctaButtons[1].link  (index 1 = "Download Brochure")
UPDATE public.cms_page_blocks
SET props = jsonb_set(props, '{hero,ctaButtons,1,link}', '"/pdfs/brochure.pdf"'::jsonb, false),
    updated_at = now()
WHERE id = '0b85fd82-fef5-4d4e-a6ec-6b5de85b4d53';

-- 3. BE Mechanical (courses-offered/ug/be-mechanical): heroCTAs[1].link
UPDATE public.cms_page_blocks
SET props = jsonb_set(props, '{heroCTAs,1,link}', '"/pdfs/brochure.pdf"'::jsonb, false),
    updated_at = now()
WHERE id = 'fd0e2ccf-43f5-4991-a05a-00e791562628';

-- 4. BE Mechanical (programs/be-mechanical-engineering): heroCTAs[1].link
UPDATE public.cms_page_blocks
SET props = jsonb_set(props, '{heroCTAs,1,link}', '"/pdfs/brochure.pdf"'::jsonb, false),
    updated_at = now()
WHERE id = '00fe5f60-cfdb-46e8-9696-024ab729ee06';

-- Verification:
-- SELECT id, jsonb_path_query_first(props, '$.** ? (@.label == "Download Brochure")') AS brochure_btn
-- FROM public.cms_page_blocks
-- WHERE id IN ('763d38d6-4a44-4cc8-967d-2f2f80b752f6',
--              '0b85fd82-fef5-4d4e-a6ec-6b5de85b4d53',
--              'fd0e2ccf-43f5-4991-a05a-00e791562628',
--              '00fe5f60-cfdb-46e8-9696-024ab729ee06');
-- Expected: every row's link = "/pdfs/brochure.pdf"

-- End of Migration 15
-- ============================================
