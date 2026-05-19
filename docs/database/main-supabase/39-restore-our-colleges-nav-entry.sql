-- ============================================
-- Migration 39 — Restore "Our Colleges" top-level nav entry + 7 college subdomain submenus
-- ============================================
-- Purpose: Add the missing "OUR COLLEGES" top-level navigation entry on the
--   Main institution website (jkkn.ac.in). The codebase has long anticipated
--   this entry — there are forward-looking icon and label mappings in
--   components/navigation/bottom-nav/public/cms-icon-mapper.ts ('our-colleges'
--   → GraduationCap) and use-public-nav-data.ts ('OUR COLLEGES' → 'Colleges'
--   mobile shortener) — but no cms_pages row has ever existed to populate it.
--   This migration seeds the parent page, 7 child pages (one per JKKN
--   college subdomain), a CollegesGrid block, and SEO metadata.
--
--   User framed this as a "revert" because they expected the entry to be
--   present already; technically it is a forward seed of content that should
--   have been there.
--
-- Created: 2026-05-19
-- Spec: User request 2026-05-19 — restore 'Our Colleges' as top-level nav
--   item (option: create new /our-colleges page; submenus: 7 subdomain
--   children; position: right before OUR SCHOOLS, push OUR SCHOOLS to
--   sort_order 4).
--
-- Affects (DB):
--   1. cms_pages — NEW row, slug='our-colleges', sort_order=3, title='OUR COLLEGES',
--      published, show_in_navigation=true. Mirrors the OUR SCHOOLS row's structure
--      (id cfc9f376-bb19-4dc2-89b9-4723a93cf3e9) which serves as the canonical
--      template for "external-redirect submenu groups".
--   2. cms_pages — UPDATE existing OUR SCHOOLS row (cfc9f376-bb19-4dc2-89b9-4723a93cf3e9)
--      sort_order 3 → 4 to make room for OUR COLLEGES above it.
--   3. cms_pages — 7 NEW child rows under OUR COLLEGES, one per college subdomain,
--      with hierarchical slugs (our-colleges/<college>) and external_url pointing
--      to the bare subdomain root (matching the OUR SCHOOLS children pattern,
--      which use external_url=https://school.jkkn.ac.in/ etc.).
--   4. cms_page_blocks — ONE CollegesGrid block on the new /our-colleges page.
--      Props mirror the existing "Our 7 Colleges" block on /courses-offered
--      (block id 37ff106d-cab8-4616-b2fc-a874f92fb9e9) so desktop visitors land
--      on the familiar grid.
--   5. cms_seo_metadata — ONE row with meta title, description, canonical, OG.
--
-- Affects (code): None required. The forward-looking icon + label mappings
--   already exist:
--     - components/navigation/bottom-nav/public/cms-icon-mapper.ts:124
--       ('our-colleges' → GraduationCap)
--     - components/navigation/bottom-nav/public/use-public-nav-data.ts:23
--       ('OUR COLLEGES' → 'Colleges' mobile label shortener)
--   The dynamic [...slug]/page.tsx route handles the page render automatically
--   from cms_pages + cms_page_blocks.
--
-- Sort_order strategy: this site already has multiple duplicate sort_orders at
--   the top level (admissions/courses-offered both =4, facilities and a draft
--   both =5, more/blog/draft all =6). The CMS resolves ties deterministically
--   and the user is aware. I only shift OUR SCHOOLS 3→4; the duplicates that
--   were already there stay as-is.
--
-- created_by: bdf878d6-75b6-4568-9d35-afb30ff38759 — the seed/admin user
--   used by every prior seed migration on this database (home, about, our-schools,
--   fee-structure, scholarships, admission-guide all use the same UUID).
--
-- Idempotency: Yes. Each step is guarded by a WHERE NOT EXISTS / lookup-by-slug
--   pattern. Re-running the migration is a no-op after the first successful run.
--
-- Security: No RLS or policy changes. Standard cms_pages ownership applies.
-- Rollback:
--   DELETE FROM cms_pages WHERE slug = 'our-colleges';  -- cascades children,
--                                                        -- blocks, SEO row.
--   UPDATE cms_pages SET sort_order = 3 WHERE slug = 'our-schools';
-- ============================================

DO $$
DECLARE
    v_creator UUID := 'bdf878d6-75b6-4568-9d35-afb30ff38759';
    v_our_colleges_id UUID;
BEGIN
    -- ----------------------------------------
    -- Step 1: Make room — push OUR SCHOOLS to sort_order 4.
    -- ----------------------------------------
    UPDATE cms_pages SET sort_order = 4
    WHERE slug = 'our-schools' AND sort_order = 3;

    -- ----------------------------------------
    -- Step 2: Insert the OUR COLLEGES parent page (idempotent on slug).
    -- ----------------------------------------
    INSERT INTO cms_pages (
        slug, title, description, status, visibility, parent_id, sort_order,
        show_in_navigation, navigation_label, created_by, published_at
    )
    VALUES (
        'our-colleges',
        'OUR COLLEGES',
        'Explore the seven JKKN colleges — Engineering, Arts & Science, Education, Dental, Pharmacy, Nursing, and Allied Health Sciences. Each operates as a dedicated campus with its own website.',
        'published',
        'public',
        NULL,
        3,
        TRUE,
        NULL,
        v_creator,
        NOW()
    )
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO v_our_colleges_id;

    -- Re-resolve if INSERT was skipped due to ON CONFLICT.
    IF v_our_colleges_id IS NULL THEN
        SELECT id INTO v_our_colleges_id FROM cms_pages WHERE slug = 'our-colleges';
    END IF;

    RAISE NOTICE 'OUR COLLEGES parent page id: %', v_our_colleges_id;

    -- ----------------------------------------
    -- Step 3: Insert the 7 college submenu pages (idempotent on slug).
    -- Each uses external_url to point at the college subdomain root, mirroring
    -- the OUR SCHOOLS children pattern. Order matches the OUR 7 COLLEGES grid
    -- on /courses-offered for visual consistency.
    -- ----------------------------------------
    INSERT INTO cms_pages (
        slug, title, status, visibility, parent_id, sort_order,
        show_in_navigation, external_url, created_by, published_at
    )
    VALUES
      ('our-colleges/dental',         'JKKN Dental College and Hospital',         'published', 'public', v_our_colleges_id, 1, TRUE, 'https://dental.jkkn.ac.in/',                       v_creator, NOW()),
      ('our-colleges/engineering',    'JKKN College of Engineering and Technology','published', 'public', v_our_colleges_id, 2, TRUE, 'https://engg.jkkn.ac.in/',                         v_creator, NOW()),
      ('our-colleges/pharmacy',       'JKKN College of Pharmacy',                 'published', 'public', v_our_colleges_id, 3, TRUE, 'https://pharmacy.jkkn.ac.in/',                     v_creator, NOW()),
      ('our-colleges/nursing',        'JKKN College of Nursing',                  'published', 'public', v_our_colleges_id, 4, TRUE, 'https://nursing.sresakthimayeil.jkkn.ac.in/',      v_creator, NOW()),
      ('our-colleges/arts-and-science','JKKN College of Arts and Science',        'published', 'public', v_our_colleges_id, 5, TRUE, 'https://cas.jkkn.ac.in/',                          v_creator, NOW()),
      ('our-colleges/allied-health-sciences','JKKN College of Allied Health Sciences','published','public',v_our_colleges_id, 6, TRUE, 'https://ahs.jkkn.ac.in/',                       v_creator, NOW()),
      ('our-colleges/education',      'JKKN College of Education',                'published', 'public', v_our_colleges_id, 7, TRUE, 'https://edu.jkkn.ac.in/',                          v_creator, NOW())
    ON CONFLICT (slug) DO NOTHING;

    -- ----------------------------------------
    -- Step 4: Insert ONE CollegesGrid block onto /our-colleges. Props mirror
    -- the canonical "Our 7 Colleges" block on /courses-offered (id
    -- 37ff106d-cab8-4616-b2fc-a874f92fb9e9) — same order, same colours, same
    -- descriptions, same /admissions/ deep-links. Idempotent on (page_id,
    -- component_name, sort_order).
    -- ----------------------------------------
    IF NOT EXISTS (
        SELECT 1 FROM cms_page_blocks
        WHERE page_id = v_our_colleges_id
          AND component_name = 'CollegesGrid'
          AND sort_order = 1
    ) THEN
        INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
        VALUES (
            v_our_colleges_id,
            'CollegesGrid',
            1,
            jsonb_build_object(
                'badge', 'OUR 7 COLLEGES',
                'title', 'Our 7 Colleges',
                'titleAccentWord', '7 Colleges',
                'subtitle', 'Choose your path from our diverse range of specialised colleges, each committed to excellence in their field.',
                'columns', '3',
                'accentColor', '#D4AF37',
                'backgroundColor', 'gradient-light',
                'showAnimations', TRUE,
                'colleges', jsonb_build_array(
                    jsonb_build_object('link','https://dental.jkkn.ac.in/admissions/',  'name','JKKN Dental College and Hospital',          'description','Shape Smiles, Transform Lives. Programmes: BDS (5 yrs), MDS — Orthodontics, Prosthodontics, Periodontics, Oral Surgery. DCI Approved, Bharathidasan University affiliated.','headerColor','#0b6d41'),
                    jsonb_build_object('link','https://engg.jkkn.ac.in/admissions/',    'name','JKKN College of Engineering and Technology','description','Innovate, Engineer, Lead. Programmes: B.E/B.Tech — CSE, ECE, Mechanical, Civil, EEE, AI&DS | M.E/M.Tech | Ph.D. AICTE Approved, Anna University affiliated.','headerColor','#7c2d12'),
                    jsonb_build_object('link','https://pharmacy.jkkn.ac.in/admissions/','name','JKKN College of Pharmacy',                  'description','Heal Through Pharmaceutical Excellence. Programmes: D.Pharm (2 yrs), B.Pharm (4 yrs), M.Pharm, Pharm.D (6 yrs), Ph.D. PCI Approved, TNPSC recognised.','headerColor','#1e3a8a'),
                    jsonb_build_object('link','https://nursing.jkkn.ac.in/admissions/', 'name','JKKN College of Nursing',                   'description','Care with Compassion. Programmes: B.Sc Nursing (4 yrs), M.Sc Nursing, Post Basic B.Sc Nursing. INC and TNNCHN approved. Clinical training at attached hospital.','headerColor','#0f766e'),
                    jsonb_build_object('link','https://cas.jkkn.ac.in/admissions/',     'name','JKKN College of Arts and Science',          'description','Discover Knowledge, Embrace Possibilities. Programmes: B.Sc, B.Com, BBA, BCA, B.A | M.Sc, M.Com, MBA, MCA, M.A | Ph.D. Periyar University affiliated.','headerColor','#6b21a8'),
                    jsonb_build_object('link','https://ahs.jkkn.ac.in/admissions/',     'name','JKKN College of Allied Health Sciences',    'description','The Future of Healthcare. Programmes: B.Sc — MLT, Radiology, Optometry, Cardiac Technology, Dialysis Technology, OT Technology. UGC approved.','headerColor','#b91c1c'),
                    jsonb_build_object('link','https://edu.jkkn.ac.in/admissions/',     'name','JKKN College of Education',                 'description','Shaping Tomorrow Educators. Programmes: B.Ed (2 yrs), M.Ed (2 yrs), D.El.Ed (2 yrs). Affiliated to Tamil Nadu Teachers Education University (TNTEU).','headerColor','#0369a1')
                )
            )
        );
    END IF;

    -- ----------------------------------------
    -- Step 5: Insert SEO metadata. Idempotent on page_id (unique).
    -- ----------------------------------------
    IF NOT EXISTS (SELECT 1 FROM cms_seo_metadata WHERE page_id = v_our_colleges_id) THEN
        INSERT INTO cms_seo_metadata (
            page_id, meta_title, meta_description, meta_keywords,
            canonical_url, robots_directive,
            og_title, og_description, og_image, og_type,
            twitter_card, twitter_title, twitter_description, twitter_image
        )
        VALUES (
            v_our_colleges_id,
            'Our Colleges | JKKN Institutions — 7 Campuses, One Family',
            'Explore JKKN''s seven autonomous colleges — Engineering, Arts & Science, Dental, Pharmacy, Nursing, Allied Health Sciences, and Education. NAAC accredited, AICTE/DCI/PCI/INC approved.',
            ARRAY['JKKN colleges', 'JKKN campuses', 'JKKN institutions', 'Tamil Nadu colleges', 'autonomous colleges'],
            'https://jkkn.ac.in/our-colleges',
            'index, follow',
            'Our 7 Colleges | JKKN Institutions',
            'Discover the seven JKKN colleges spanning engineering, healthcare, education and the arts.',
            'https://jkkn.ac.in/images/og/our-colleges.jpg',
            'website',
            'summary_large_image',
            'Our 7 Colleges | JKKN',
            'Engineering, Arts, Dental, Pharmacy, Nursing, Allied Health and Education — under one trust.',
            'https://jkkn.ac.in/images/og/our-colleges.jpg'
        );
    END IF;

    RAISE NOTICE 'Migration 39 complete. Verify with:';
    RAISE NOTICE '  SELECT slug, title, sort_order FROM cms_pages WHERE slug IN (''our-colleges'',''our-schools'') ORDER BY sort_order;';
    RAISE NOTICE '  SELECT slug, title, external_url FROM cms_pages WHERE parent_id = % ORDER BY sort_order;', v_our_colleges_id;
END $$;

-- End of Migration 39
-- ============================================
