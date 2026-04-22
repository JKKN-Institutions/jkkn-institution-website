-- ============================================
-- Migration: Soften Fee Structure & Scholarships page backgrounds
-- ============================================
-- Purpose: Switch content-section backgrounds on the /fee-structure
--          and /scholarships CMS pages from the dark brand gradient
--          ('gradient-dark' → #0b6d41 → #032816) to the mild brand-tinted
--          light gradient ('gradient-light' → brand-primary/5 → white).
--
-- Scope (2 pages, 3 blocks):
--   • /fee-structure  → FAQSectionBlock     (sort_order = 3)
--   • /scholarships   → ScholarshipMatrix   (sort_order = 3)
--   • /scholarships   → FAQSectionBlock     (sort_order = 4)
--
-- NOT changed:
--   • AdmissionHero blocks on both pages — they overlay a background
--     image with white text; a light gradient would wreck contrast.
--   • ScholarshipsSection on /scholarships (already 'gradient-light').
--   • Blocks with NULL backgroundColor (TabsBlock, CallToAction).
--
-- Created: 2026-04-20
-- Dependencies: cms_pages, cms_page_blocks (JSONB props column)
-- Security: None — UPDATE on content rows only, no schema change.
-- Idempotency: Yes — filtered by backgroundColor = 'gradient-dark',
--              so re-running after success is a no-op.
-- ============================================

DO $$
DECLARE
    v_fee_page_id          UUID;
    v_scholarships_page_id UUID;
    v_rows_updated         INTEGER := 0;
    v_total_updated        INTEGER := 0;
BEGIN
    -- ----------------------------------------
    -- Resolve page IDs by slug
    -- ----------------------------------------
    SELECT id INTO v_fee_page_id
    FROM cms_pages
    WHERE slug = 'fee-structure';

    SELECT id INTO v_scholarships_page_id
    FROM cms_pages
    WHERE slug = 'scholarships';

    IF v_fee_page_id IS NULL THEN
        RAISE EXCEPTION 'Page with slug "fee-structure" not found';
    END IF;

    IF v_scholarships_page_id IS NULL THEN
        RAISE EXCEPTION 'Page with slug "scholarships" not found';
    END IF;

    -- ----------------------------------------
    -- 1. /fee-structure → FAQSectionBlock (sort_order = 3)
    -- ----------------------------------------
    UPDATE cms_page_blocks
    SET props = props || jsonb_build_object('backgroundColor', 'gradient-light'),
        updated_at = NOW()
    WHERE page_id = v_fee_page_id
      AND component_name = 'FAQSectionBlock'
      AND sort_order = 3
      AND props->>'backgroundColor' = 'gradient-dark';

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    v_total_updated := v_total_updated + v_rows_updated;
    RAISE NOTICE 'fee-structure FAQSectionBlock: % row(s) updated', v_rows_updated;

    -- ----------------------------------------
    -- 2. /scholarships → ScholarshipMatrix (sort_order = 3)
    -- ----------------------------------------
    UPDATE cms_page_blocks
    SET props = props || jsonb_build_object('backgroundColor', 'gradient-light'),
        updated_at = NOW()
    WHERE page_id = v_scholarships_page_id
      AND component_name = 'ScholarshipMatrix'
      AND sort_order = 3
      AND props->>'backgroundColor' = 'gradient-dark';

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    v_total_updated := v_total_updated + v_rows_updated;
    RAISE NOTICE 'scholarships ScholarshipMatrix: % row(s) updated', v_rows_updated;

    -- ----------------------------------------
    -- 3. /scholarships → FAQSectionBlock (sort_order = 4)
    -- ----------------------------------------
    UPDATE cms_page_blocks
    SET props = props || jsonb_build_object('backgroundColor', 'gradient-light'),
        updated_at = NOW()
    WHERE page_id = v_scholarships_page_id
      AND component_name = 'FAQSectionBlock'
      AND sort_order = 4
      AND props->>'backgroundColor' = 'gradient-dark';

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    v_total_updated := v_total_updated + v_rows_updated;
    RAISE NOTICE 'scholarships FAQSectionBlock: % row(s) updated', v_rows_updated;

    RAISE NOTICE 'Total rows updated: % (expected 3 on first run, 0 on re-runs)', v_total_updated;
END $$;

-- End of migration
-- ============================================
