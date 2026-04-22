-- ============================================
-- Scholarships Page — PDF-Driven Content Update
-- ============================================
-- Purpose: Rebuild the /scholarships CMS page content to reflect the
--          official JKKN "Scholarship Details" sheet.
-- Created: 2026-04-17
-- Modified: —
-- Dependencies:
--   - cms_pages (slug = 'scholarships') must exist — seeded in 11-phase1-aeo-pages-seed.sql
--   - cms_page_blocks (parent page)
--   - Registry component 'ScholarshipMatrix' (new) must exist in
--     lib/cms/component-registry.ts before the page is rendered.
-- Security: No RLS change. Uses SECURITY INVOKER (default) via DO block.
-- Idempotency: Yes — UPDATEs are convergent, DELETE before INSERT prevents
--              duplicate ScholarshipMatrix blocks on repeated runs.
--
-- What this migration does:
--   1. REPLACES the props of the existing ScholarshipsSection block (sort_order=2)
--      with 6 real scholarship schemes: PMSS, Maintenance, First Graduate,
--      BC/MBC Community, JKKN Trust (Merit), and Naan Mudhalvan.
--   2. SHIFTS FAQSectionBlock from sort_order=3 → 4 and CallToAction from
--      sort_order=4 → 5 to make room for the new matrix.
--   3. INSERTS a new ScholarshipMatrix block at sort_order=3 containing the
--      full 12-row × 7-column entitlement matrix (Dental BDS … AHS All Branches)
--      exactly as printed in "SCHOLARSHIP DETAILS (1).pdf".
--
-- Source of truth for values: SCHOLARSHIP DETAILS (1).pdf supplied 2026-04-17.
-- Conventions applied when transcribing the PDF:
--   - "5K<10K / Yr"  → "₹5K–10K / yr"   (range, em-dash)
--   - "<5K / Yr"     → "< ₹5K / yr"
--   - "5K<100% / Yr" → "₹5K – up to 100% / yr"
--   - Blank / "-"     → "—" (em dash)
--   - "PMSS" merged cell → pmssGQ = value, pmssMQ = value, pmssMerged = true.
-- ============================================

DO $$
DECLARE
    v_page_id UUID;
BEGIN
    SELECT id INTO v_page_id FROM cms_pages WHERE slug = 'scholarships';

    IF v_page_id IS NULL THEN
        RAISE EXCEPTION 'cms_pages row with slug=scholarships not found — run 11-phase1-aeo-pages-seed.sql first';
    END IF;

    -- ----------------------------------------
    -- 1. Refresh ScholarshipsSection block (sort_order=2) with 6 real schemes
    -- ----------------------------------------
    UPDATE cms_page_blocks
    SET props = jsonb_build_object(
        'badge', 'FINANCIAL AID',
        'title', 'Scholarship Schemes at JKKN',
        'titleAccentWord', 'Schemes',
        'subtitle', 'Community, merit, first-graduate and state schemes — exact amounts per course are listed in the matrix below.',
        'scholarships', jsonb_build_array(
            jsonb_build_object(
                'icon', 'Trophy',
                'title', 'Post-Matric Scholarship (PMSS)',
                'description', 'Central & State community scholarship covering full tuition for SC / SCA / ST / BC-CC learners — available in both Government and Management quotas for eligible courses.',
                'eligibility', jsonb_build_array(
                    'SC / SCA / ST / BC-CC communities',
                    'Family income within notified ceiling',
                    'Apply via TN e-Sevai or National Scholarship Portal'
                ),
                'type', 'government'
            ),
            jsonb_build_object(
                'icon', 'Heart',
                'title', 'Maintenance Scholarship',
                'description', 'Additional GQ support of up to ₹10,000 per year for day-to-day college expenses — paired alongside PMSS disbursement.',
                'eligibility', jsonb_build_array(
                    'Government Quota admission',
                    'SC / SCA / ST / BC-CC categories',
                    'Paired with PMSS disbursement'
                ),
                'type', 'need-based'
            ),
            jsonb_build_object(
                'icon', 'Award',
                'title', 'First Graduate Scholarship',
                'description', 'State scheme for BC / MBC / DNC / BCM learners who are the first in their family to pursue a degree. Covers ₹18K–₹40K per year depending on the course.',
                'eligibility', jsonb_build_array(
                    'BC / MBC / DNC / BCM communities',
                    'First graduate in the family (parental affidavit)',
                    'Government Quota admission'
                ),
                'type', 'government'
            ),
            jsonb_build_object(
                'icon', 'Building2',
                'title', 'BC / MBC Community Scholarship',
                'description', 'Supplementary aid of ₹5,000–₹10,000 per year for BC / MBC / DNC / BCM learners in Government Quota across nearly every JKKN course.',
                'eligibility', jsonb_build_array(
                    'BC / MBC / DNC / BCM communities',
                    'Government Quota admission',
                    'Annual income proof'
                ),
                'type', 'government'
            ),
            jsonb_build_object(
                'icon', 'Trophy',
                'title', 'JKKN Trust Scholarship (Merit)',
                'description', 'Institutional merit award from the J.K.K. Rangammal Charitable Trust. Pharm D, B.Pharm, Nursing, Engineering and AHS learners are eligible — Engineering toppers can receive up to 100% tuition waiver.',
                'eligibility', jsonb_build_array(
                    'Strong academic or entrance-exam performance',
                    'Both MQ and GQ admissions eligible',
                    'Renewable on maintaining CGPA'
                ),
                'type', 'merit'
            ),
            jsonb_build_object(
                'icon', 'Medal',
                'title', 'Naan Mudhalvan Scholarship',
                'description', '₹1,000 per month stipend for learners from Government / Government-Aided Tamil Medium schools (classes 6 to 12). All communities eligible — both boys and girls.',
                'eligibility', jsonb_build_array(
                    'Studied in Govt / Govt-Aided school, 6th–12th',
                    'Tamil medium education',
                    'All communities eligible'
                ),
                'type', 'government'
            )
        ),
        'showCTA', true,
        'ctaText', 'Apply for Admission',
        'ctaLink', '/admissions',
        'columns', '4',
        'backgroundColor', 'gradient-light',
        'showAnimations', true,
        'accentColor', 'var(--gold-on-light)'
    )
    WHERE page_id = v_page_id AND component_name = 'ScholarshipsSection';

    -- ----------------------------------------
    -- 2. Shift later blocks downward so we can insert the matrix at sort_order=3
    --    Update CTA first (was 4, becomes 5) to avoid a collision with FAQ.
    -- ----------------------------------------
    UPDATE cms_page_blocks SET sort_order = 5
    WHERE page_id = v_page_id AND component_name = 'CallToAction' AND sort_order = 4;

    UPDATE cms_page_blocks SET sort_order = 4
    WHERE page_id = v_page_id AND component_name = 'FAQSectionBlock' AND sort_order = 3;

    -- ----------------------------------------
    -- 3. Remove any prior ScholarshipMatrix block (idempotency for re-runs)
    -- ----------------------------------------
    DELETE FROM cms_page_blocks
    WHERE page_id = v_page_id AND component_name = 'ScholarshipMatrix';

    -- ----------------------------------------
    -- 4. Insert ScholarshipMatrix block (sort_order=3) with full PDF data
    -- ----------------------------------------
    INSERT INTO cms_page_blocks (page_id, component_name, props, sort_order) VALUES
    (v_page_id, 'ScholarshipMatrix', jsonb_build_object(
        'badge', 'SCHOLARSHIP MATRIX',
        'title', 'Scholarship Amounts by Course',
        'titleAccentWord', 'by Course',
        'subtitle', 'Annual scholarship entitlements across all JKKN colleges — at a glance.',
        'backgroundColor', 'gradient-dark',
        'showAnimations', true,
        'accentColor', 'var(--gold-on-light)',
        'rows', jsonb_build_array(
            jsonb_build_object('college','Dental',     'course','BDS',         'pmssGQ','₹2.5L / yr','pmssMQ','₹6L / yr',    'pmssMerged',false,'maintenance','₹5K–10K / yr','firstGraduate','₹40K / yr','community','₹5K–10K / yr','trust','—',                       'naanMudhalvan','₹1,000 / month'),
            jsonb_build_object('college','Pharmacy',   'course','Pharm D',     'pmssGQ','₹2L / yr',  'pmssMQ','₹5.25L / yr','pmssMerged',false,'maintenance','₹5K–10K / yr','firstGraduate','—',         'community','—',              'trust','₹15K–20K / yr',             'naanMudhalvan','₹1,000 / month'),
            jsonb_build_object('college','Pharmacy',   'course','B.Pharm',     'pmssGQ','₹43K / yr', 'pmssMQ','₹43K / yr',  'pmssMerged',true, 'maintenance','₹5K–10K / yr','firstGraduate','₹18K / yr','community','₹5K–10K / yr','trust','₹5K–10K / yr',              'naanMudhalvan','₹1,000 / month'),
            jsonb_build_object('college','Pharmacy',   'course','M.Pharm',     'pmssGQ','₹70K / yr', 'pmssMQ','₹70K / yr',  'pmssMerged',true, 'maintenance','₹5K–10K / yr','firstGraduate','—',         'community','₹5K–10K / yr','trust','—',                       'naanMudhalvan','—'),
            jsonb_build_object('college','Nursing',    'course','B.Sc (N)',    'pmssGQ','₹45K / yr', 'pmssMQ','₹45K / yr',  'pmssMerged',true, 'maintenance','₹5K–10K / yr','firstGraduate','₹20K / yr','community','₹5K–10K / yr','trust','₹5K–10K / yr',              'naanMudhalvan','₹1,000 / month'),
            jsonb_build_object('college','Nursing',    'course','M.Sc (N)',    'pmssGQ','₹75K / yr', 'pmssMQ','₹75K / yr',  'pmssMerged',true, 'maintenance','₹5K–10K / yr','firstGraduate','—',         'community','₹5K–10K / yr','trust','—',                       'naanMudhalvan','—'),
            jsonb_build_object('college','Nursing',    'course','PB.B.Sc (N)', 'pmssGQ','—',         'pmssMQ','—',          'pmssMerged',false,'maintenance','< ₹5K / yr',   'firstGraduate','—',         'community','—',              'trust','—',                       'naanMudhalvan','—'),
            jsonb_build_object('college','Engineering','course','B.E / B.Tech','pmssGQ','₹50K / yr', 'pmssMQ','₹50K / yr',  'pmssMerged',true, 'maintenance','₹5K–10K / yr','firstGraduate','₹25K / yr','community','₹5K–10K / yr','trust','₹5K – up to 100% / yr','naanMudhalvan','₹1,000 / month'),
            jsonb_build_object('college','Engineering','course','MBA',         'pmssGQ','₹35K / yr', 'pmssMQ','₹35K / yr',  'pmssMerged',true, 'maintenance','₹5K–10K / yr','firstGraduate','—',         'community','₹5K–10K / yr','trust','—',                       'naanMudhalvan','—'),
            jsonb_build_object('college','Engineering','course','M.E',         'pmssGQ','₹50K / yr', 'pmssMQ','₹50K / yr',  'pmssMerged',true, 'maintenance','₹5K–10K / yr','firstGraduate','—',         'community','₹5K–10K / yr','trust','—',                       'naanMudhalvan','—'),
            jsonb_build_object('college','Education',  'course','B.Ed',        'pmssGQ','₹30K / yr', 'pmssMQ','₹30K / yr',  'pmssMerged',true, 'maintenance','< ₹5K / yr',   'firstGraduate','—',         'community','—',              'trust','—',                       'naanMudhalvan','—'),
            jsonb_build_object('college','AHS',        'course','All Branches','pmssGQ','—',         'pmssMQ','—',          'pmssMerged',false,'maintenance','—',            'firstGraduate','—',         'community','—',              'trust','₹5K–10K / yr',              'naanMudhalvan','₹1,000 / month')
        ),
        'footerNotes', jsonb_build_array(
            'GQ — Government Quota · MQ — Management Quota · PMSS — Post-Matric Scholarship Scheme.',
            'All amounts are per academic year unless stated otherwise; "—" means the scheme is not applicable for that course.',
            'Slab values such as "₹5K–10K / yr" indicate the disbursed range; confirm exact eligibility with the JKKN scholarship cell.',
            'Scholarships can often be combined subject to scheme-specific rules — the scholarship cell advises the optimal legal mix.'
        )
    ), 3);

END $$;

-- End of 18-scholarships-page-update.sql
-- ============================================
