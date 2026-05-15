-- ============================================
-- Engineering Site — Seed /scholarships CMS Page (admin visibility)
-- ============================================
-- Purpose: Register the /scholarships route in `cms_pages` on the Engineering
--          Supabase project so it appears in the admin panel Content → Pages
--          table. The public route itself is rendered by a static React
--          component (app/(public)/scholarships/page.tsx →
--          _engineering-scholarship.tsx) which pulls typed data from
--          lib/institutions/engineering/admissions-data.ts (SCHOLARSHIP_TABLE).
--
--          This migration follows the same "static-rendered, CMS-tracked"
--          pattern that migration 23 introduced for the scholarships row,
--          but goes further by:
--            • Populating a rich title + description that mirrors the
--              metadata defined in app/(public)/scholarships/page.tsx
--              (generateMetadata → engineering branch).
--            • Seeding cms_seo_metadata with full meta tags + a
--              BreadcrumbList JSON-LD that mirrors BreadcrumbSchema()
--              already emitted by the React page.
--            • Recording in metadata that the route is "code-rendered" so
--              future block-editor work knows blocks here would be ignored
--              by the public site (Next.js routes the static folder first;
--              the [...slug] catch-all never fires for /scholarships).
--
--          Why a row in cms_pages at all when the page is hard-coded:
--            1. Admin panel inventory — editors expect every public URL to
--               appear in the Pages table for governance & SEO oversight.
--            2. Navigation wiring — getPublicNavigation() in
--               app/actions/cms/navigation.ts builds the ADMISSIONS dropdown
--               by joining cms_pages rows on parent_id. Without a row,
--               /scholarships cannot live under that dropdown.
--            3. SEO metadata is database-driven for the rest of the site;
--               keeping this page in the same store avoids a code/db split.
--
-- Created: 2026-05-14
-- Institution: Engineering College (kyvfkyjmdbtyimtedkie)
-- Dependencies:
--   • cms_pages and cms_seo_metadata tables exist (foundation migrations).
--   • An `admissions` row in cms_pages (required for parent_id linkage —
--     migration aborts if missing, matching migration 23's guard).
--   • app/(public)/scholarships/page.tsx (static React page that owns the
--     /scholarships URL; cms_page_blocks intentionally NOT seeded here
--     because they would never render).
--   • At least one row in auth.users so created_by/updated_by can satisfy
--     their NOT NULL constraints.
-- Used by:
--   • Admin panel: app/(admin)/content/pages/* (displays cms_pages rows).
--   • Public navigation: components/public/site-header.tsx → ADMISSIONS
--     dropdown via getPublicNavigation().
--   • SEO: read by the static React page if it ever switches to fetch
--     metadata from cms_seo_metadata (currently metadata is inline).
-- Security: Standard cms_pages / cms_seo_metadata RLS — anon SELECT for
--           published+public rows, authenticated mutate. This migration
--           runs as service-role through Supabase Studio / MCP.
-- Idempotency: All operations are guarded. Re-running this migration:
--                • UPDATEs the existing scholarships row instead of
--                  inserting a duplicate.
--                • UPSERTs the cms_seo_metadata row keyed on page_id.
--              Safe to retry. Harmonizes with migration 23 (which only
--              created a minimal row) by enriching the same row.
-- Rollback:
--   DELETE FROM cms_seo_metadata
--     WHERE page_id = (SELECT id FROM cms_pages WHERE slug='scholarships');
--   DELETE FROM cms_pages WHERE slug = 'scholarships';
-- ============================================

DO $$
DECLARE
  v_page_id       UUID;
  v_admissions_id UUID;
  v_creator       UUID;
BEGIN
  -- ── 1. Resolve creator UUID (prefer engineering service account) ────
  SELECT id INTO v_creator
  FROM   auth.users
  WHERE  email = 'engg@jkkn.ac.in'
  LIMIT  1;

  IF v_creator IS NULL THEN
    SELECT id INTO v_creator FROM auth.users ORDER BY created_at LIMIT 1;
  END IF;

  IF v_creator IS NULL THEN
    RAISE EXCEPTION
      'No auth.users on Engineering Supabase — cannot satisfy NOT NULL created_by';
  END IF;

  -- ── 2. Resolve admissions parent (for the ADMISSIONS dropdown) ──────
  SELECT id INTO v_admissions_id
  FROM   cms_pages
  WHERE  slug = 'admissions'
  LIMIT  1;

  IF v_admissions_id IS NULL THEN
    RAISE EXCEPTION
      'No /admissions cms_page on Engineering Supabase — seed it first (migration 11) before wiring /scholarships under it.';
  END IF;

  -- ── 3. UPSERT the scholarships page row ────────────────────────────
  SELECT id INTO v_page_id FROM cms_pages WHERE slug = 'scholarships' LIMIT 1;

  IF v_page_id IS NULL THEN
    INSERT INTO cms_pages (
      slug, title, description, status, visibility,
      show_in_navigation, parent_id, navigation_label, sort_order,
      metadata, published_at,
      created_by, updated_by
    )
    VALUES (
      'scholarships',
      'Scholarship Details 2026-27 | JKKN College of Engineering and Technology',
      'Government, Trust, and Naan Mudhalvan scholarship details for B.E / B.Tech, M.B.A, and M.E programmes at JKKN Engineering College. Covers PMSS (SC/SCA/ST/BC-CC), First Graduate (BC/MBC/DNC/BCM), Maintenance, and Merit-based Trust Scholarship.',
      'published',
      'public',
      true,
      v_admissions_id,
      'Scholarship',
      3,
      jsonb_build_object(
        'render_mode',   'code',
        'render_source', 'app/(public)/scholarships/page.tsx',
        'note',          'Page rendered by static React component; cms_page_blocks for this slug are not used on the public site (Next.js routes the explicit folder before the [...slug] catch-all).'
      ),
      now(),
      v_creator,
      v_creator
    )
    RETURNING id INTO v_page_id;

    RAISE NOTICE 'Inserted scholarships cms_page (id %)', v_page_id;
  ELSE
    UPDATE cms_pages
    SET    title              = 'Scholarship Details 2026-27 | JKKN College of Engineering and Technology',
           description        = 'Government, Trust, and Naan Mudhalvan scholarship details for B.E / B.Tech, M.B.A, and M.E programmes at JKKN Engineering College. Covers PMSS (SC/SCA/ST/BC-CC), First Graduate (BC/MBC/DNC/BCM), Maintenance, and Merit-based Trust Scholarship.',
           status             = 'published',
           visibility         = 'public',
           show_in_navigation = true,
           parent_id          = v_admissions_id,
           navigation_label   = 'Scholarship',
           sort_order         = 3,
           metadata           = COALESCE(metadata, '{}'::jsonb)
                                || jsonb_build_object(
                                     'render_mode',   'code',
                                     'render_source', 'app/(public)/scholarships/page.tsx',
                                     'note',          'Page rendered by static React component; cms_page_blocks for this slug are not used on the public site (Next.js routes the explicit folder before the [...slug] catch-all).'
                                   ),
           published_at       = COALESCE(published_at, now()),
           updated_by         = v_creator,
           updated_at         = now()
    WHERE  id = v_page_id;

    RAISE NOTICE 'Updated existing scholarships cms_page (id %)', v_page_id;
  END IF;

  -- ── 4. UPSERT SEO metadata (mirrors React metadata + JSON-LD) ──────
  IF EXISTS (SELECT 1 FROM cms_seo_metadata WHERE page_id = v_page_id) THEN
    UPDATE cms_seo_metadata
    SET    meta_title           = 'Scholarship Details 2026-27 | JKKN College of Engineering and Technology',
           meta_description     = 'Government, Trust, and Naan Mudhalvan scholarship details for B.E / B.Tech, M.B.A, and M.E programmes at JKKN Engineering College. Covers PMSS (SC/SCA/ST/BC-CC), First Graduate (BC/MBC/DNC/BCM), Maintenance, and Merit-based Trust Scholarship.',
           canonical_url        = 'https://engg.jkkn.ac.in/scholarships',
           og_title             = 'Scholarship Details 2026-27 — JKKN College of Engineering and Technology',
           og_description       = 'Complete scholarship details for engineering programmes — Government schemes, Trust Merit Scholarship, and Naan Mudhalvan benefits.',
           og_type              = 'website',
           og_image             = '/og/engineering-admissions.jpg',
           twitter_card         = 'summary_large_image',
           twitter_title        = 'Scholarship Details 2026-27 | JKKN Engineering',
           twitter_description  = 'Government, Trust, and Naan Mudhalvan scholarship details for B.E / B.Tech, M.B.A, and M.E programmes at JKKN Engineering College.',
           robots_directive     = 'index, follow',
           structured_data      = jsonb_build_array(
             jsonb_build_object(
               '@context', 'https://schema.org',
               '@type',    'BreadcrumbList',
               'itemListElement', jsonb_build_array(
                 jsonb_build_object('@type','ListItem','position',1,'name','Home','item','https://engg.jkkn.ac.in/'),
                 jsonb_build_object('@type','ListItem','position',2,'name','Admissions','item','https://engg.jkkn.ac.in/admissions'),
                 jsonb_build_object('@type','ListItem','position',3,'name','Scholarships','item','https://engg.jkkn.ac.in/scholarships')
               )
             )
           )
    WHERE  page_id = v_page_id;

    RAISE NOTICE 'Updated cms_seo_metadata for scholarships';
  ELSE
    INSERT INTO cms_seo_metadata (
      page_id, meta_title, meta_description, canonical_url,
      og_title, og_description, og_type, og_image,
      twitter_card, twitter_title, twitter_description,
      robots_directive, structured_data
    )
    VALUES (
      v_page_id,
      'Scholarship Details 2026-27 | JKKN College of Engineering and Technology',
      'Government, Trust, and Naan Mudhalvan scholarship details for B.E / B.Tech, M.B.A, and M.E programmes at JKKN Engineering College. Covers PMSS (SC/SCA/ST/BC-CC), First Graduate (BC/MBC/DNC/BCM), Maintenance, and Merit-based Trust Scholarship.',
      'https://engg.jkkn.ac.in/scholarships',
      'Scholarship Details 2026-27 — JKKN College of Engineering and Technology',
      'Complete scholarship details for engineering programmes — Government schemes, Trust Merit Scholarship, and Naan Mudhalvan benefits.',
      'website',
      '/og/engineering-admissions.jpg',
      'summary_large_image',
      'Scholarship Details 2026-27 | JKKN Engineering',
      'Government, Trust, and Naan Mudhalvan scholarship details for B.E / B.Tech, M.B.A, and M.E programmes at JKKN Engineering College.',
      'index, follow',
      jsonb_build_array(
        jsonb_build_object(
          '@context', 'https://schema.org',
          '@type',    'BreadcrumbList',
          'itemListElement', jsonb_build_array(
            jsonb_build_object('@type','ListItem','position',1,'name','Home','item','https://engg.jkkn.ac.in/'),
            jsonb_build_object('@type','ListItem','position',2,'name','Admissions','item','https://engg.jkkn.ac.in/admissions'),
            jsonb_build_object('@type','ListItem','position',3,'name','Scholarships','item','https://engg.jkkn.ac.in/scholarships')
          )
        )
      )
    );

    RAISE NOTICE 'Inserted cms_seo_metadata for scholarships';
  END IF;

  RAISE NOTICE 'Scholarships page is now registered in cms_pages (id %) under admissions (id %)',
    v_page_id, v_admissions_id;
END $$;

-- ── Verification (run separately after migration applies) ──────────────
-- 1) Confirm the page row exists and is wired correctly:
--    SELECT p.slug, p.title, p.status, p.visibility, p.show_in_navigation,
--           p.navigation_label, p.sort_order,
--           parent.slug AS parent_slug,
--           p.metadata->>'render_mode' AS render_mode
--    FROM   cms_pages p
--    LEFT JOIN cms_pages parent ON parent.id = p.parent_id
--    WHERE  p.slug = 'scholarships';
--    -- Expected: published / public / true / 'Scholarship' / 3 / admissions / code
--
-- 2) Confirm SEO metadata + structured data:
--    SELECT meta_title,
--           canonical_url,
--           robots_directive,
--           jsonb_array_length(structured_data) AS schema_count,
--           structured_data->0->>'@type'        AS first_schema
--    FROM   cms_seo_metadata s
--    JOIN   cms_pages p ON p.id = s.page_id
--    WHERE  p.slug = 'scholarships';
--    -- Expected: schema_count=1, first_schema=BreadcrumbList
--
-- 3) Confirm the admin ADMISSIONS dropdown children are in order:
--    SELECT slug, navigation_label, sort_order
--    FROM   cms_pages
--    WHERE  parent_id = (SELECT id FROM cms_pages WHERE slug='admissions')
--      AND  show_in_navigation = true
--    ORDER BY sort_order NULLS LAST;
--    -- Expected (3 rows): admission-guide=1, fee-structure=2, scholarships=3

-- End of 24-scholarships-cms-page-seed.sql
-- ============================================
