-- ============================================
-- Migration 38 — Remove /eligibility-criteria page + repoint inbound references
-- ============================================
-- Purpose: Removes the standalone /eligibility-criteria CMS page from the Main
--          institution website. The page was seeded by migration 11 (Phase 1
--          AEO pages, Page 6 of 7) as an AEO FAQPage surface targeting
--          course-wise eligibility search intent. It is no longer wanted as a
--          standalone page — eligibility content lives elsewhere (the
--          EligibilityCriteriaTable section embedded on /admissions stays
--          intact and continues to serve this content).
--
-- Created: 2026-05-19
-- Modified: —
-- Spec: User request — remove standalone /eligibility-criteria page from main
--       institution website. Confirmed scope via clarifying question:
--         (a) Remove standalone page only (NOT the section on /admissions)
--         (b) Rewrite inbound CTAs to /admissions instead of leaving broken links
--
-- Affects (DB):
--   1. cms_pages row with slug='eligibility-criteria'
--      (id=6cca49ff-7e4d-4008-816f-16a098bec909, status=published)
--      → DELETE. Cascades to:
--        - cms_page_blocks (3 rows: AdmissionHero, FAQSectionBlock, CallToAction)
--        - cms_seo_metadata (1 row, canonical_url=https://jkkn.ac.in/eligibility-criteria)
--        - cms_page_fab_config (0 rows)
--        - cms_page_reviews (0 rows)
--        - cms_page_versions (0 rows)
--        - cms_preview_links (0 rows)
--   2. /admission-guide page — AdmissionHero block
--      (id=618f2da9-9626-4499-b57d-d815fe99cb68)
--      ctaButtons[1] currently { label: 'Check Eligibility', link: '/eligibility-criteria' }
--      → repointed to '/admissions' so the secondary hero button stays useful.
--   3. /why-jkkn page — FAQSectionBlock block
--      (id=247c444f-4fbb-498c-bb33-882d60b42758)
--      faqs[5].answer mentions '/eligibility-criteria' inline in prose:
--      "verify your program's specific eligibility on /eligibility-criteria, check fees..."
--      → URL substring is repointed to '/admissions'. This was not in the
--      user's original two-CTA scope but is fixed under the same intent —
--      avoid broken internal links to the deleted page.
--
-- Affects (sitemap / SEO):
--   - Dynamic sitemap is generated from cms_pages rows; deleting the row removes
--     the page from the sitemap automatically. No app/sitemap.ts edit needed.
--   - FAQPage JSON-LD for this slug was injected via lib/seo/schema-resolver.ts
--     (a hardcoded `if (slug === 'eligibility-criteria')` branch). That branch
--     is removed in a separate code commit alongside this migration.
--   - canonical URL https://jkkn.ac.in/eligibility-criteria becomes a 404 after
--     deploy. Google will eventually drop the URL from the index; no 301 is
--     configured because /admissions is not a direct content equivalent.
--
-- Idempotency: Yes. All steps are convergent:
--   - The REPLACE on props is a no-op once the substring is gone.
--   - The DELETE is a no-op once the row is gone.
--
-- Security: No RLS or policy changes. Standard cms_pages ownership applies.
-- Rollback: Re-run migration 11 (it re-seeds Page 6 idempotently and re-inserts
--   the eligibility-criteria slug + 3 blocks + cms_seo_metadata). Then manually
--   restore the two inbound references with:
--     UPDATE cms_page_blocks
--     SET props = REPLACE(props::text, '/admissions', '/eligibility-criteria')::jsonb
--     WHERE id IN ('618f2da9-9626-4499-b57d-d815fe99cb68',
--                  '247c444f-4fbb-498c-bb33-882d60b42758');
--   ⚠ Caveat: the reverse REPLACE above would also rewrite legitimate
--   '/admissions' references on those blocks. If a rollback is ever needed,
--   apply jsonb_set on the exact subpaths (ctaButtons->1->link and faqs->5->answer)
--   instead of a blanket REPLACE.
--
-- Component note: The React component
--   components/cms-blocks/admissions/eligibility-criteria-table.tsx and its
--   registry entry in lib/cms/component-registry.ts are PRESERVED. The
--   <EligibilityCriteriaTable /> section embedded on /admissions
--   (app/(public)/admissions/_main-page.tsx line ~313) continues to render
--   course-wise eligibility data on the admissions page. Only the standalone
--   CMS page surface is removed.
-- ============================================

DO $$
DECLARE
    v_page_id UUID;
    v_deleted INT;
BEGIN
    -- ----------------------------------------
    -- Step 1: Repoint inbound references BEFORE deleting the page.
    -- Order matters only for clarity (single transaction commits atomically).
    -- A blanket text REPLACE on the JSON props is safe here because:
    --   - On both target blocks, '/eligibility-criteria' appears exactly once.
    --   - There is no longer substring that could collide
    --     (e.g. '/eligibility-criteria-old' does not exist anywhere).
    -- ----------------------------------------

    -- 1a. /admission-guide hero — secondary CTA "Check Eligibility"
    UPDATE cms_page_blocks
    SET props = REPLACE(props::text, '/eligibility-criteria', '/admissions')::jsonb
    WHERE id = '618f2da9-9626-4499-b57d-d815fe99cb68'
      AND props::text LIKE '%/eligibility-criteria%';

    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RAISE NOTICE 'Repointed /admission-guide AdmissionHero CTA: % row(s) updated', v_deleted;

    -- 1b. /why-jkkn FAQ — inline prose URL reference
    UPDATE cms_page_blocks
    SET props = REPLACE(props::text, '/eligibility-criteria', '/admissions')::jsonb
    WHERE id = '247c444f-4fbb-498c-bb33-882d60b42758'
      AND props::text LIKE '%/eligibility-criteria%';

    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RAISE NOTICE 'Repointed /why-jkkn FAQ inline reference: % row(s) updated', v_deleted;

    -- ----------------------------------------
    -- Step 2: Delete the cms_pages row. ON DELETE CASCADE on all FK children
    -- (cms_page_blocks, cms_seo_metadata, cms_page_fab_config, cms_page_reviews,
    -- cms_page_versions, cms_preview_links) cleans them up automatically.
    -- The cms_pages.parent_id self-reference is ON DELETE SET NULL — but no
    -- child pages currently point to this slug as parent (verified pre-flight).
    -- ----------------------------------------

    SELECT id INTO v_page_id FROM cms_pages WHERE slug = 'eligibility-criteria';

    IF v_page_id IS NULL THEN
        RAISE NOTICE 'cms_pages row with slug=eligibility-criteria already absent — nothing to delete';
    ELSE
        DELETE FROM cms_pages WHERE id = v_page_id;
        GET DIAGNOSTICS v_deleted = ROW_COUNT;
        RAISE NOTICE 'Deleted cms_pages row % (eligibility-criteria) — % row(s) including cascades', v_page_id, v_deleted;
    END IF;
END $$;

-- ============================================
-- Verification (run separately as SELECT):
--   SELECT slug, title, status FROM cms_pages WHERE slug='eligibility-criteria';
--   -- Expected: 0 rows
--
--   SELECT props->'ctaButtons'->1->>'link' AS link
--   FROM cms_page_blocks WHERE id='618f2da9-9626-4499-b57d-d815fe99cb68';
--   -- Expected: /admissions
--
--   SELECT props->'faqs'->5->>'answer' AS answer
--   FROM cms_page_blocks WHERE id='247c444f-4fbb-498c-bb33-882d60b42758';
--   -- Expected: mentions /admissions, no longer /eligibility-criteria
-- ============================================

-- End of 38-remove-eligibility-criteria-page.sql
-- ============================================
