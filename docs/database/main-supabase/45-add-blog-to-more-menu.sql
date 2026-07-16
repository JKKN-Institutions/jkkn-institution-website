-- ============================================
-- Migration 45 — Add Blog to the MORE navigation menu (Main site)
-- ============================================
-- Purpose: Surface the existing /blog page in the MORE dropdown on jkkn.ac.in.
--   The Blog page row already exists in cms_pages
--   (id a351f6b2-931c-4907-ab40-15f18504f105, slug='blog') but is invisible in
--   navigation for two independent reasons:
--     1. status='draft'  — getPublicNavigation() filters on status='published',
--        so the row is excluded outright.
--     2. parent_id=NULL  — it sits at the TOP level (sort_order 6), not under
--        the MORE page, so even once published it would render as a top-level
--        nav item rather than a MORE dropdown entry.
--   This migration publishes the row and re-parents it under MORE.
--
-- Created: 2026-07-16
-- Spec: User request 2026-07-16 — "main website i need the blog page add in the
--   more menu update the navigation". Position confirmed with user: directly
--   AFTER Careers. Scope confirmed: Main Supabase only (not synced to other
--   institutions — see "Sync" below).
--
-- Affects (DB):
--   1. cms_pages — UPDATE Blog row (slug='blog'):
--        parent_id     NULL  → MORE page id (f8b4c54e-066d-4512-ba74-9d1c1f652ffc)
--        status        draft → published
--        published_at  NULL  → NOW()
--        sort_order    6     → 3  (slot directly after Careers)
--      slug is deliberately NOT changed. MORE's children use FLAT slugs
--      ('careers', 'placements', 'privacy-policy', 'terms-and-conditions'), unlike
--      OUR COLLEGES' children which use hierarchical slugs ('our-colleges/dental').
--      Keeping slug='blog' means buildNavTree() derives href='/blog', which is what
--      the real route expects.
--   2. cms_pages — UPDATE MORE's existing children with sort_order >= 3, shifting
--      each +1 to open the slot at 3:
--        Placements          3 → 4
--        Privacy Policy      4 → 5
--        Terms & Conditions  5 → 6
--      (Gallery=1 and Careers=2 are untouched. Gallery is status='draft' and stays
--      that way — out of scope for this change.)
--
--   Resulting MORE dropdown order:
--        1 Gallery (draft — not rendered)
--        2 Careers
--        3 Blog            ← this migration
--        4 Placements
--        5 Privacy Policy
--        6 Terms & Conditions
--
-- Affects (code): NONE. Every piece of supporting code already exists:
--   - app/(public)/blog/page.tsx — the real route. It is a STATIC App Router
--     segment, so it takes precedence over app/(public)/[...slug]/page.tsx. The
--     published cms_pages row drives navigation only; it does not need blocks and
--     will not be rendered by the catch-all.
--   - components/navigation/bottom-nav/public/cms-icon-mapper.ts:99 — 'blog' →
--     FileText, so the mobile bottom-nav icon resolves automatically.
--   - components/public/site-header.tsx:83 fallbackNavigation already lists Blog,
--     but that array is only used when the CMS returns ZERO rows; it is not the
--     production path and needs no edit.
--
-- Affects (SEO): No duplicate sitemap URLs. /blog is already declared as a static
--   entry in lib/config/sitemaps.config.ts:338, and app/sitemap-pages.xml/route.ts
--   de-dupes CMS-derived slugs against that static config (staticSlugs set). The
--   only net effect is that /blog's <lastmod> now resolves from the DB row's real
--   updated_at/published_at instead of the hardcoded TODAY constant.
--
-- Sort_order strategy: MORE's children are cleanly numbered 1..5 with no ties, so
--   a simple "+1 shift for everything >= 3, then place Blog at 3" keeps them
--   contiguous. (This is unlike the TOP level, which has known duplicate
--   sort_orders — see Migration 39's header. Those are untouched here; vacating
--   Blog from top-level sort_order 6 incidentally removes one of them.)
--
-- Idempotency: Yes. The whole block early-RETURNs if Blog is already parented to
--   MORE, so the +1 shift cannot be applied twice. Re-running after a successful
--   run is a no-op.
--
-- Security: No RLS, policy, function, or schema changes. Data-only UPDATEs to
--   existing cms_pages rows. No new table, so no policy work required.
--
-- Sync: Main only. Navigation content is institution-specific — each institution
--   has its own cms_pages rows, its own MORE menu composition, and its own blog
--   content. Do NOT replay this on Engineering/Dental without first inspecting
--   their nav trees (their MORE children and sort_orders differ).
--
-- Rollback:
--   DO $$
--   DECLARE v_more_id UUID;
--   BEGIN
--     SELECT id INTO v_more_id FROM cms_pages WHERE slug = 'more' AND parent_id IS NULL;
--     UPDATE cms_pages
--        SET parent_id = NULL, sort_order = 6, status = 'draft', published_at = NULL
--      WHERE slug = 'blog';
--     UPDATE cms_pages SET sort_order = sort_order - 1
--      WHERE parent_id = v_more_id AND sort_order >= 4;
--   END $$;
-- ============================================

DO $$
DECLARE
    v_more_id UUID;
    v_blog_id UUID;
    v_already_done BOOLEAN;
BEGIN
    -- ----------------------------------------
    -- Step 0: Resolve the MORE parent and Blog rows by slug.
    -- Resolved by slug (not hardcoded UUID) so this migration stays replayable
    -- against a restored/reseeded database where ids may differ.
    -- ----------------------------------------
    SELECT id INTO v_more_id
    FROM cms_pages
    WHERE slug = 'more' AND parent_id IS NULL;

    SELECT id INTO v_blog_id
    FROM cms_pages
    WHERE slug = 'blog';

    IF v_more_id IS NULL THEN
        RAISE EXCEPTION 'Migration 45 aborted: no top-level cms_pages row with slug=''more''.';
    END IF;

    IF v_blog_id IS NULL THEN
        RAISE EXCEPTION 'Migration 45 aborted: no cms_pages row with slug=''blog''.';
    END IF;

    -- ----------------------------------------
    -- Step 1: Idempotency guard. If Blog already hangs off MORE, this migration
    -- has run — bail out BEFORE the +1 shift, which is not safe to repeat.
    -- ----------------------------------------
    SELECT EXISTS (
        SELECT 1 FROM cms_pages WHERE id = v_blog_id AND parent_id = v_more_id
    ) INTO v_already_done;

    IF v_already_done THEN
        RAISE NOTICE 'Migration 45: Blog is already a child of MORE — no-op.';
        RETURN;
    END IF;

    -- ----------------------------------------
    -- Step 2: Open the slot at sort_order 3 (directly after Careers=2) by
    -- shifting Placements/Privacy Policy/Terms down one each.
    -- ----------------------------------------
    UPDATE cms_pages
    SET sort_order = sort_order + 1
    WHERE parent_id = v_more_id
      AND sort_order >= 3;

    -- ----------------------------------------
    -- Step 3: Re-parent Blog under MORE and publish it.
    -- COALESCE on published_at preserves any pre-existing publish timestamp
    -- rather than resetting it (defensive; this row currently has NULL).
    -- ----------------------------------------
    UPDATE cms_pages
    SET parent_id          = v_more_id,
        sort_order         = 3,
        status             = 'published',
        published_at       = COALESCE(published_at, NOW()),
        show_in_navigation = TRUE,
        visibility         = 'public'
    WHERE id = v_blog_id;

    RAISE NOTICE 'Migration 45 complete. Blog re-parented under MORE (%) at sort_order 3.', v_more_id;
    RAISE NOTICE 'Verify with:';
    RAISE NOTICE '  SELECT title, slug, sort_order, status FROM cms_pages WHERE parent_id = ''%'' ORDER BY sort_order;', v_more_id;
END $$;

-- End of Migration 45
-- ============================================
