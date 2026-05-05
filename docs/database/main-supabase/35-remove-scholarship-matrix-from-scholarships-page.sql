-- ============================================
-- Migration 35 — Remove ScholarshipMatrix block from /scholarships hub page
-- ============================================
-- Purpose: Removes the "SCHOLARSHIP MATRIX" section from the main website's
--          /scholarships page. The 12-row × 7-column entitlement matrix that
--          was seeded by migration 18 (and shifted to sort_order=4 by
--          migration 30) is no longer wanted on the hub page — per-college
--          scholarship detail pages already carry course-specific tables.
--
-- Created: 2026-04-27
-- Modified: —
-- Spec: User request — remove SCHOLARSHIP MATRIX section from main scholarships page.
-- Affects: /scholarships hub UI only. Per-college pages (/scholarships/engineering,
--          /scholarships/dental, etc.) are untouched — they use their own TextEditor
--          tables, not the ScholarshipMatrix block.
--
-- Dependencies:
--   - cms_pages row with slug='scholarships' (id=206d9a67-2729-4a95-8074-48535214696c)
--   - cms_page_blocks row with component_name='ScholarshipMatrix' on that page
--     (current id=ec52fa9e-ece1-4079-a9ad-b69977c770bc, sort_order=4 after migration 30)
--
-- Block layout BEFORE this migration (after migrations 18 + 30):
--   sort_order 1: AdmissionHero
--   sort_order 2: CollegesGrid
--   sort_order 3: ScholarshipsSection
--   sort_order 4: ScholarshipMatrix          ← DELETED by this migration
--   sort_order 5: FAQSectionBlock
--   sort_order 6: CallToAction
--
-- Block layout AFTER this migration:
--   sort_order 1: AdmissionHero
--   sort_order 2: CollegesGrid
--   sort_order 3: ScholarshipsSection
--   sort_order 4: FAQSectionBlock            ← shifted down from 5
--   sort_order 5: CallToAction               ← shifted down from 6
--
-- Idempotency: Yes. The DELETE is convergent (no rows = nothing happens). The
--   sort_order shift is gated on the ScholarshipMatrix being absent: it only
--   runs when there is a gap at sort_order=4, which the DELETE just opened. If
--   re-run, the gap is already closed and the WHERE clause matches nothing.
--
-- Security: No RLS or policy changes. Standard cms_page_blocks ownership applies.
-- Rollback: Re-run migration 18 (it idempotently re-inserts the ScholarshipMatrix
--   block at sort_order=3 and shifts FAQ/CTA back to 4/5) followed by migration 30
--   (which bumps everything ≥2 by +1). Note that re-running both will require manual
--   verification because the live page already has CollegesGrid present.
--
-- Component note: The React component components/cms-blocks/admissions/scholarship-matrix.tsx
--   and its registry entry in lib/cms/component-registry.ts are intentionally
--   preserved. After this migration the block has zero instances in cms_page_blocks,
--   but remains available for editors to re-add via the page builder if needed.
-- ============================================

DO $$
DECLARE
    v_page_id UUID;
    v_deleted INT;
BEGIN
    SELECT id INTO v_page_id FROM cms_pages WHERE slug = 'scholarships';

    IF v_page_id IS NULL THEN
        RAISE EXCEPTION 'cms_pages row with slug=scholarships not found';
    END IF;

    -- 1. Delete the ScholarshipMatrix block instance(s) on this page.
    DELETE FROM cms_page_blocks
    WHERE page_id = v_page_id
      AND component_name = 'ScholarshipMatrix';

    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RAISE NOTICE 'Deleted % ScholarshipMatrix block(s) from /scholarships page', v_deleted;

    -- 2. Compact the sort_order so there is no gap where ScholarshipMatrix sat.
    --    FAQSectionBlock 5 → 4, CallToAction 6 → 5.
    --    Guarded so it only runs when there is no block at sort_order=4 (i.e.
    --    immediately after the DELETE has opened the gap, or after a prior run).
    IF NOT EXISTS (
        SELECT 1 FROM cms_page_blocks
        WHERE page_id = v_page_id AND sort_order = 4
    ) THEN
        UPDATE cms_page_blocks
        SET sort_order = sort_order - 1
        WHERE page_id = v_page_id
          AND sort_order >= 5;
    END IF;
END $$;

-- End of 35-remove-scholarship-matrix-from-scholarships-page.sql
-- ============================================
