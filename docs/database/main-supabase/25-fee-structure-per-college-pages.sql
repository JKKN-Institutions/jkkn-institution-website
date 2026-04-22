-- ============================================
-- Fee Structure — Seed 7 per-college fee pages under /fee-structure/[slug]
-- ============================================
-- Purpose: Create 7 new CMS pages, one per JKKN college, at
--          /fee-structure/{engineering,arts-and-science,education,
--                          dental,pharmacy,nursing,allied-health}.
--          Each page renders:
--            1. AdmissionHero (college-specific badge/title/subtitle)
--            2. TextEditor   (fee HTML lifted verbatim from the existing
--                             /fee-structure TabsBlock by tab label)
--          Plus a cms_seo_metadata row with title/description/OG tags.
--
--          These pages are the redirect targets for the new CollegesGrid
--          cards that will replace the TabsBlock on /fee-structure in
--          migration 26.
--
--          MUST run BEFORE migration 26 — migration 26 deletes the
--          source TabsBlock row that this migration joins against.
-- Created: 2026-04-21
-- Dependencies:
--   - cms_page_blocks row 'd951788a-74ad-4fad-badf-beb960ecfd8e'
--     (the TabsBlock on /fee-structure — SOURCE OF TRUTH for fee HTML)
--   - cms_pages row with slug = 'fee-structure'
--     (provides parent_id for hierarchy AND created_by for audit chain)
--   - components/cms-blocks/admissions/admission-hero.tsx
--   - components/cms-blocks/content/text-editor.tsx
-- Used by: /fee-structure/[college] public pages
-- Security: Standard RLS INSERT on cms_pages / cms_page_blocks /
--           cms_seo_metadata (admin role only).
-- Idempotency: The IF EXISTS guard inside the loop means re-running is
--              safe but will NOT refresh content for pages that already
--              exist. To refresh a page, DELETE it first (FK CASCADE
--              removes its blocks + SEO row) then re-run this migration.
-- Rollback:
--   DELETE FROM cms_pages WHERE slug IN
--     ('fee-structure/engineering','fee-structure/arts-and-science',
--      'fee-structure/education','fee-structure/dental',
--      'fee-structure/pharmacy','fee-structure/nursing',
--      'fee-structure/allied-health');
-- Implementation notes:
--   • created_by / updated_by are inherited from the parent
--     /fee-structure page so the audit chain stays consistent and so
--     the NOT NULL constraint on cms_pages.created_by is satisfied.
--   • Fee HTML is pulled at INSERT time via a correlated subquery on
--     the live TabsBlock — no HTML is duplicated in this file. This
--     keeps the migration compact and ensures the source of truth is
--     the TabsBlock itself until migration 26 removes it.
-- ============================================

DO $$
DECLARE
  v_page_id   UUID;
  v_parent_id UUID;
  v_creator   UUID;
  v_cfg       RECORD;
BEGIN
  -- Inherit parent page id + creator for hierarchy + audit
  SELECT id, created_by INTO v_parent_id, v_creator
  FROM cms_pages
  WHERE slug = 'fee-structure';

  IF v_parent_id IS NULL THEN
    RAISE EXCEPTION 'Parent page /fee-structure not found — aborting seed';
  END IF;

  -- Per-college seed data: (slug, source-tab label, hero_badge, hero_title,
  --                         hero_subtitle, page_title, page_description,
  --                         seo_title, seo_description)
  FOR v_cfg IN
    SELECT * FROM (VALUES
      ('fee-structure/engineering',     'Engineering & Tech', 'Engineering Fees 2026-27',    'JKKN College of Engineering — Fee Structure',              'Course-wise fees for B.E / B.Tech / M.E / MBA programs for academic year 2026-27. Government Quota follows Tamil Nadu government norms; Management Quota fees are shown below.',                                                                  'Engineering Fee Structure 2026-27 | JKKN College of Engineering',            'Course-wise fee breakdown for JKKN College of Engineering and Technology for AY 2026-27. Covers B.E, B.Tech, M.E, and MBA programs. Government Quota as per Tamil Nadu government norms.',                          'Engineering Fee Structure 2026-27 | JKKN',    'B.E, B.Tech, M.E, MBA course-wise fees at JKKN College of Engineering for academic year 2026-27.'),
      ('fee-structure/arts-and-science','Arts & Science',     'Arts & Science Fees 2026-27', 'JKKN College of Arts & Science — Fee Structure',           'Course-wise fees for UG and PG programs across arts, science, commerce, and design for academic year 2026-27. Government Quota as per Tamil Nadu government norms.',                                                                            'Arts & Science Fee Structure 2026-27 | JKKN College of Arts and Science',    'UG and PG fees for JKKN College of Arts and Science for AY 2026-27. B.A, B.Sc, B.Com, B.B.A, B.C.A, and M.Sc / M.Com / M.A programs across arts, science, commerce, and design.',                                    'Arts & Science Fee Structure 2026-27 | JKKN', 'UG and PG fees at JKKN College of Arts and Science for AY 2026-27. B.A / B.Sc / B.Com / BCA / BBA and M.A / M.Sc / M.Com.'),
      ('fee-structure/education',       'Education',          'Education Fees 2026-27',      'JKKN College of Education — Fee Structure',                'B.Ed fee structure for academic year 2026-27. Admissions are through Tamil Nadu Teachers Education University (TNTEU) counselling; Government Quota follows state regulation.',                                                                  'Education Fee Structure 2026-27 | JKKN College of Education',                'B.Ed fee structure at JKKN College of Education for AY 2026-27. Admissions through Tamil Nadu Teachers Education University (TNTEU).',                                                                                'Education Fee Structure 2026-27 | JKKN',       'B.Ed fees at JKKN College of Education for AY 2026-27. TNTEU counselling admissions.'),
      ('fee-structure/dental',          'Dental',             'Dental Fees 2026-27',         'JKKN Dental College — Fee Structure',                      'BDS (5 years) and MDS (3 years) course-wise fees for academic year 2026-27. Government Quota follows TN Medical Counselling Committee (TN MCC) norms.',                                                                                          'Dental Fee Structure 2026-27 | JKKN Dental College and Hospital',            'BDS and MDS course-wise fees at JKKN Dental College & Hospital for AY 2026-27. Government Quota as per TN Medical Counselling Committee norms.',                                                                      'Dental Fee Structure 2026-27 | JKKN',          'BDS and MDS course-wise fees at JKKN Dental College for academic year 2026-27.'),
      ('fee-structure/pharmacy',        'Pharmacy',           'Pharmacy Fees 2026-27',       'JKKN College of Pharmacy — Fee Structure',                 'B.Pharm (4 years), Pharm.D (6 years) and M.Pharm (2 years) course-wise fees for academic year 2026-27. Government Quota follows Pharmacy Council of India (PCI) regulation.',                                                                    'Pharmacy Fee Structure 2026-27 | JKKN College of Pharmacy',                  'B.Pharm, Pharm.D, and M.Pharm fees at JKKN College of Pharmacy for AY 2026-27. PCI approved programs.',                                                                                                               'Pharmacy Fee Structure 2026-27 | JKKN',        'B.Pharm, Pharm.D, and M.Pharm course-wise fees at JKKN College of Pharmacy for AY 2026-27.'),
      ('fee-structure/nursing',         'Nursing',            'Nursing Fees 2026-27',        'JKKN College of Nursing — Fee Structure',                  'B.Sc Nursing, Post-Basic B.Sc Nursing, and M.Sc Nursing course-wise fees for academic year 2026-27. Fees include uniform, hospital training and nursing kit where applicable.',                                                                  'Nursing Fee Structure 2026-27 | JKKN College of Nursing',                    'B.Sc Nursing, Post-Basic B.Sc Nursing, and M.Sc Nursing fees at JKKN for AY 2026-27. Approved by Indian Nursing Council (INC).',                                                                                       'Nursing Fee Structure 2026-27 | JKKN',         'B.Sc / PB B.Sc / M.Sc Nursing course-wise fees at JKKN College of Nursing for AY 2026-27.'),
      ('fee-structure/allied-health',   'Allied Health',      'Allied Health Fees 2026-27',  'JKKN College of Allied Health Sciences — Fee Structure',   'Course-wise fees for allied health programs across cardiac technology, anaesthesia, radiology, dialysis, and more, for academic year 2026-27. Government Quota follows TN Directorate of Medical Education norms.',                              'Allied Health Fee Structure 2026-27 | JKKN College of Allied Health Sciences','Cardiac Technology, Operation Theatre & Anaesthesia Technology, Radiology & Imaging, Physician Assistant, Dialysis, and more — fees at JKKN for AY 2026-27.',                                                          'Allied Health Fee Structure 2026-27 | JKKN',  'Course-wise allied health fees at JKKN for AY 2026-27. Cardiac, OTA, Radiology, Physician Assistant, Dialysis, and more.')
    ) AS t(slug, tab_label, hero_badge, hero_title, hero_subtitle, page_title, page_desc, seo_title, seo_desc)
  LOOP
    IF EXISTS (SELECT 1 FROM cms_pages WHERE slug = v_cfg.slug) THEN
      RAISE NOTICE 'Page % already exists, skipping', v_cfg.slug;
      CONTINUE;
    END IF;

    INSERT INTO cms_pages (slug, title, description, status, show_in_navigation, parent_id, published_at, created_by, updated_by)
    VALUES (v_cfg.slug, v_cfg.page_title, v_cfg.page_desc, 'published', false, v_parent_id, now(), v_creator, v_creator)
    RETURNING id INTO v_page_id;

    -- Block 1: AdmissionHero (college-specific)
    INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props, is_visible)
    VALUES (
      v_page_id, 'AdmissionHero', 1,
      jsonb_build_object(
        'badge',           jsonb_build_object('text', v_cfg.hero_badge),
        'title',           v_cfg.hero_title,
        'titleAccentWord', 'Fee Structure',
        'subtitle',        v_cfg.hero_subtitle,
        'backgroundColor', 'gradient-dark',
        'ctaButtons',      '[{"label":"Apply Now","link":"/admissions","variant":"primary","icon":"arrow"},{"label":"Talk to Counsellor","link":"/contact","variant":"secondary","icon":"none"}]'::jsonb
      ),
      true
    );

    -- Block 2: TextEditor with fee HTML copied from matching TabsBlock tab
    INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props, is_visible)
    VALUES (
      v_page_id, 'TextEditor', 2,
      jsonb_build_object(
        'content', (
          SELECT tab->>'content'
          FROM cms_page_blocks,
               LATERAL jsonb_array_elements(props->'tabs') AS t(tab)
          WHERE id = 'd951788a-74ad-4fad-badf-beb960ecfd8e'
            AND tab->>'label' = v_cfg.tab_label
        ),
        'alignment', 'left',
        'maxWidth',  'full'
      ),
      true
    );

    -- SEO row
    INSERT INTO cms_seo_metadata (page_id, meta_title, meta_description, og_title, og_description, og_type, robots_directive)
    VALUES (v_page_id, v_cfg.seo_title, v_cfg.seo_desc, v_cfg.seo_title, v_cfg.seo_desc, 'website', 'index, follow');

    RAISE NOTICE 'Created page % (id %)', v_cfg.slug, v_page_id;
  END LOOP;
END $$;

-- Verification (run separately):
--   SELECT p.slug, p.title,
--          (SELECT count(*) FROM cms_page_blocks WHERE page_id = p.id) AS block_count,
--          (SELECT count(*) FROM cms_seo_metadata WHERE page_id = p.id) AS seo_count
--   FROM cms_pages p
--   WHERE p.slug LIKE 'fee-structure/%'
--   ORDER BY p.slug;
-- Expected: 7 rows, each block_count=2 and seo_count=1.

-- End of Fee Structure — Seed 7 per-college fee pages
-- ============================================
