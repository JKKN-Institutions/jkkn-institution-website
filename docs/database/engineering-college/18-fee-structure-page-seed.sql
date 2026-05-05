-- ============================================
-- Engineering Site — Seed /fee-structure CMS Page
-- ============================================
-- Purpose: Create the /fee-structure page on the Engineering site
--          (engg.jkkn.ac.in) so it stops 404-ing. Closes ACTION-PLAN §2.1
--          and FULL-AUDIT-REPORT §3.4 ("genuinely missing — every day
--          without these pages, the traffic flows to College Dunia").
--
--          Composition mirrors the per-college engineering fee page
--          already published on the Main site (created in
--          docs/database/main-supabase/25-fee-structure-per-college-pages.sql).
--          Two blocks:
--            1. AdmissionHero (gradient-dark, badge "Engineering Fees
--               2026-27", title "JKKN College of Engineering — Fee
--               Structure", CTAs to /admissions and /contact).
--            2. TextEditor   (fee tables HTML — UG / Lateral Entry / PG —
--               with Government Quota labelled "As per Government Norms"
--               per memory observation 278; Management Quota in INR).
--
--          Data parity: the HTML tables are byte-identical to the Main
--          per-college engineering page so editors only see one set of
--          truth at seed time. Future edits will diverge naturally
--          through the admin panel on each Supabase project.
--
--          SEO additions over the Main per-college page:
--            • structured_data populated with BreadcrumbList + Course
--              JSON-LD (ACTION-PLAN §2.1 explicitly requires both).
--            • Robots: index, follow.
--          (Main's per-college subpage shipped with structured_data=[].)
-- Created: 2026-04-28
-- Dependencies:
--   - cms_pages, cms_page_blocks, cms_seo_metadata tables exist on the
--     Engineering Supabase project (kyvfkyjmdbtyimtedkie).
--   - components/cms-blocks/admissions/admission-hero.tsx
--     (reads props.backgroundColor + ctaButtons + badge/title/subtitle)
--   - components/cms-blocks/content/text-editor.tsx
--     (renders trusted HTML; sanitization handled by isomorphic-dompurify
--      in the renderer per existing CMS contract)
--   - lib/cms/component-registry.ts entries for AdmissionHero + TextEditor.
--   - Engineering site nav already references /fee-structure as an
--     ADMISSIONS submenu child (seeded in migration 16). This page
--     completes that link so the nav stops pointing at a 404.
-- Used by: https://engg.jkkn.ac.in/fee-structure (rendered through the
--          [...slug] catch-all at app/(public)/[...slug]/page.tsx)
-- Security: Standard RLS INSERTs on cms_pages / cms_page_blocks /
--           cms_seo_metadata (admin role only — runs as service-role via
--           MCP migration tool).
-- Idempotency: IF EXISTS guard short-circuits if /fee-structure already
--              exists. To refresh, DELETE FROM cms_pages WHERE slug=
--              'fee-structure' (FK CASCADE removes blocks + SEO row),
--              then re-run.
-- Rollback:
--   DELETE FROM cms_pages WHERE slug = 'fee-structure';
-- Implementation notes:
--   • created_by/updated_by resolve to engg@jkkn.ac.in (the Engineering
--     site service account) when present; falls back to oldest user.
--     RAISES if no auth users exist (NOT NULL constraint would fail
--     anyway — this gives a clearer message).
--   • parent_id is NULL — there is no /fee-structure hub on Engineering
--     (this IS the page, unlike Main where /fee-structure is a hub
--     above /fee-structure/{college} subpages).
--   • show_in_navigation=false — navigation_items table (seeded in
--     migration 16) is the source of truth for nav; cms_pages flag is
--     redundant on Engineering.
--   • status='published' — this is shipping immediately, not a staged
--     draft. ACTION-PLAN P1 priority is "this week".
-- ============================================

DO $$
DECLARE
  v_page_id UUID;
  v_creator UUID;
BEGIN
  -- 1. Resolve creator UUID (prefer institution service account)
  SELECT id INTO v_creator
  FROM auth.users
  WHERE email = 'engg@jkkn.ac.in'
  LIMIT 1;

  IF v_creator IS NULL THEN
    SELECT id INTO v_creator FROM auth.users ORDER BY created_at LIMIT 1;
  END IF;

  IF v_creator IS NULL THEN
    RAISE EXCEPTION
      'No auth.users on Engineering Supabase — cannot satisfy NOT NULL created_by';
  END IF;

  -- 2. Idempotency guard
  IF EXISTS (SELECT 1 FROM cms_pages WHERE slug = 'fee-structure') THEN
    RAISE NOTICE
      '/fee-structure already exists on Engineering Supabase — skipping seed';
    RETURN;
  END IF;

  -- 3. Page row
  INSERT INTO cms_pages (
    slug, title, description, status, visibility,
    show_in_navigation, parent_id, published_at,
    created_by, updated_by
  )
  VALUES (
    'fee-structure',
    'Engineering Fee Structure 2026-27 | JKKN College of Engineering',
    'Course-wise fee breakdown for JKKN College of Engineering and Technology for AY 2026-27. Covers B.E, B.Tech, M.E, and MBA programs. Government Quota as per Tamil Nadu government norms.',
    'published',
    'public',
    false,
    NULL,
    now(),
    v_creator,
    v_creator
  )
  RETURNING id INTO v_page_id;

  -- 4. Block 1: AdmissionHero (mirrors Main per-college engineering page)
  INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props, is_visible)
  VALUES (
    v_page_id, 'AdmissionHero', 1,
    jsonb_build_object(
      'badge',           jsonb_build_object('text', 'Engineering Fees 2026-27'),
      'title',           'JKKN College of Engineering — Fee Structure',
      'titleAccentWord', 'Fee Structure',
      'subtitle',        'Course-wise fees for B.E / B.Tech / M.E / MBA programs for academic year 2026-27. Government Quota follows Tamil Nadu government norms; Management Quota fees are shown below.',
      'backgroundColor', 'gradient-dark',
      'ctaButtons',
        '[{"label":"Apply Now","link":"/admissions","variant":"primary","icon":"arrow"},{"label":"Talk to Counsellor","link":"/contact","variant":"secondary","icon":"none"}]'::jsonb
    ),
    true
  );

  -- 5. Block 2: TextEditor with fee tables HTML (verbatim from Main)
  INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props, is_visible)
  VALUES (
    v_page_id, 'TextEditor', 2,
    jsonb_build_object(
      'content', $html$<h3>Engineering UG (B.E / B.Tech — 4 Years)</h3><table><thead><tr><th>Program</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>B.E. CSE</td><td>As per Government Norms</td><td>₹80,000</td><td>Per year</td></tr><tr><td>B.Tech IT</td><td>As per Government Norms</td><td>₹80,000</td><td>Per year</td></tr><tr><td>B.E. ECE</td><td>As per Government Norms</td><td>₹70,000</td><td>Per year</td></tr><tr><td>B.E. EEE</td><td>As per Government Norms</td><td>₹45,000</td><td>Per year</td></tr><tr><td>B.E. Mechanical</td><td>As per Government Norms</td><td>₹45,000</td><td>Per year</td></tr></tbody></table><h3>Engineering Lateral Entry (2nd year direct)</h3><table><thead><tr><th>Program</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>B.E. CSE</td><td>As per Government Norms</td><td>₹60,000</td><td>Per year</td></tr><tr><td>B.Tech IT</td><td>As per Government Norms</td><td>₹60,000</td><td>Per year</td></tr><tr><td>B.E. ECE</td><td>As per Government Norms</td><td>₹60,000</td><td>Per year</td></tr><tr><td>B.E. EEE</td><td>As per Government Norms</td><td>₹60,000</td><td>Per year</td></tr><tr><td>B.E. Mechanical</td><td>As per Government Norms</td><td>₹60,000</td><td>Per year</td></tr></tbody></table><h3>Engineering PG</h3><table><thead><tr><th>Program</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>MBA</td><td>As per Government Norms</td><td>₹65,000</td><td>Per year</td></tr><tr><td>M.E. CSE</td><td>As per Government Norms</td><td>₹30,000</td><td>Per year</td></tr></tbody></table>$html$,
      'alignment', 'left',
      'maxWidth',  'full'
    ),
    true
  );

  -- 6. SEO metadata + structured data (Course + BreadcrumbList per ACTION-PLAN §2.1)
  INSERT INTO cms_seo_metadata (
    page_id, meta_title, meta_description,
    og_title, og_description, og_type,
    twitter_card, twitter_title, twitter_description,
    robots_directive, structured_data
  )
  VALUES (
    v_page_id,
    'Engineering Fee Structure 2026-27 | JKKN',
    'B.E, B.Tech, M.E, MBA course-wise fees at JKKN College of Engineering for academic year 2026-27. Government Quota as per Tamil Nadu government norms.',
    'Engineering Fee Structure 2026-27 | JKKN',
    'B.E, B.Tech, M.E, MBA course-wise fees at JKKN College of Engineering for academic year 2026-27.',
    'website',
    'summary_large_image',
    'Engineering Fee Structure 2026-27 | JKKN',
    'B.E, B.Tech, M.E, MBA course-wise fees at JKKN College of Engineering for AY 2026-27.',
    'index, follow',
    jsonb_build_array(
      -- BreadcrumbList: Home → Fee Structure
      jsonb_build_object(
        '@context', 'https://schema.org',
        '@type', 'BreadcrumbList',
        'itemListElement', jsonb_build_array(
          jsonb_build_object('@type','ListItem','position',1,'name','Home','item','https://engg.jkkn.ac.in/'),
          jsonb_build_object('@type','ListItem','position',2,'name','Fee Structure','item','https://engg.jkkn.ac.in/fee-structure')
        )
      ),
      -- Course schema with per-program offers (Management Quota INR amounts)
      jsonb_build_object(
        '@context', 'https://schema.org',
        '@type', 'Course',
        'name', 'Engineering Programs at JKKN College of Engineering and Technology',
        'description', 'Undergraduate and postgraduate engineering programs at JKKN — B.E. CSE / ECE / EEE / Mechanical, B.Tech IT, M.E. CSE, and MBA — with course-wise fees for academic year 2026-27.',
        'provider', jsonb_build_object(
          '@type', 'CollegeOrUniversity',
          'name', 'JKKN College of Engineering and Technology',
          'sameAs', 'https://engg.jkkn.ac.in'
        ),
        'inLanguage', 'en',
        'educationalLevel', jsonb_build_array('Undergraduate', 'Postgraduate'),
        'offers', jsonb_build_array(
          jsonb_build_object('@type','Offer','category','Tuition (Management Quota)','price','80000','priceCurrency','INR','description','B.E. CSE — per year (Management); Government Quota as per Tamil Nadu government norms'),
          jsonb_build_object('@type','Offer','category','Tuition (Management Quota)','price','80000','priceCurrency','INR','description','B.Tech IT — per year (Management); Government Quota as per Tamil Nadu government norms'),
          jsonb_build_object('@type','Offer','category','Tuition (Management Quota)','price','70000','priceCurrency','INR','description','B.E. ECE — per year (Management); Government Quota as per Tamil Nadu government norms'),
          jsonb_build_object('@type','Offer','category','Tuition (Management Quota)','price','45000','priceCurrency','INR','description','B.E. EEE — per year (Management); Government Quota as per Tamil Nadu government norms'),
          jsonb_build_object('@type','Offer','category','Tuition (Management Quota)','price','45000','priceCurrency','INR','description','B.E. Mechanical — per year (Management); Government Quota as per Tamil Nadu government norms'),
          jsonb_build_object('@type','Offer','category','Tuition (Management Quota)','price','65000','priceCurrency','INR','description','MBA — per year (Management); Government Quota as per Tamil Nadu government norms'),
          jsonb_build_object('@type','Offer','category','Tuition (Management Quota)','price','30000','priceCurrency','INR','description','M.E. CSE — per year (Management); Government Quota as per Tamil Nadu government norms')
        )
      )
    )
  );

  RAISE NOTICE 'Created /fee-structure on Engineering Supabase (page_id %)', v_page_id;
END $$;

-- Verification (run separately after migration applies):
--   SELECT slug, title, status, published_at IS NOT NULL AS published
--   FROM cms_pages
--   WHERE slug = 'fee-structure';
--
--   SELECT b.component_name, b.sort_order, b.is_visible,
--          length(b.props::text) AS props_len
--   FROM cms_page_blocks b
--   JOIN cms_pages p ON p.id = b.page_id
--   WHERE p.slug = 'fee-structure'
--   ORDER BY b.sort_order;
--   -- Expected: 2 rows; AdmissionHero (sort=1), TextEditor (sort=2).
--
--   SELECT meta_title,
--          jsonb_array_length(structured_data) AS schema_count,
--          structured_data->0->>'@type'        AS first_schema,
--          structured_data->1->>'@type'        AS second_schema
--   FROM cms_seo_metadata s
--   JOIN cms_pages p ON p.id = s.page_id
--   WHERE p.slug = 'fee-structure';
--   -- Expected: schema_count=2, first_schema=BreadcrumbList, second_schema=Course.

-- End of Engineering Site — Seed /fee-structure CMS Page
-- ============================================
