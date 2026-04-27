-- ============================================
-- Migration 30 — Scholarships Hub Restructure + 7 Per-College Detail Pages
-- ============================================
-- Purpose: Implements Unit C of the 2026-04-24 main-admissions-subnav-and-process spec.
--   C.1: Insert a CollegesGrid block at sort_order 2 on the /scholarships page
--        (between AdmissionHero and the existing ScholarshipsSection). Existing blocks
--        at sort 2..5 are bumped to 3..6.
--   C.2: Create 7 new cms_pages rows under /scholarships (one per college) with
--        slug pattern scholarships/{college} and parent_id = scholarships page id.
--   C.3: Seed 3 blocks per child page: AdmissionHero, TextEditor (HTML scholarship
--        table derived from ScholarshipMatrix rows), and CallToAction.
--   Arts & Science fallback: ScholarshipMatrix has no row for this college, so its
--        TextEditor uses the cross-college schemes fallback copy specified in §5.C.3.
--
-- Created: 2026-04-25
-- Spec: docs/superpowers/specs/2026-04-24-main-admissions-subnav-and-process-design.md (§5.C)
-- Dependencies: cms_pages, cms_page_blocks, ScholarshipsSection.scholarships data
-- Verified IDs:
--   - scholarships page = 206d9a67-2729-4a95-8074-48535214696c
--   - created_by user   = bdf878d6-75b6-4568-9d35-afb30ff38759 (matches existing seeds)
-- Affects: /scholarships hub UI; 7 new public URLs (/scholarships/{college})
-- Security: All pages status='published', visibility='public'; no RLS changes
-- Rollback: DELETE FROM cms_pages WHERE slug LIKE 'scholarships/%';
--           DELETE FROM cms_page_blocks WHERE component_name='CollegesGrid'
--             AND page_id='206d9a67-2729-4a95-8074-48535214696c';
--           UPDATE cms_page_blocks SET sort_order = sort_order - 1
--             WHERE page_id='206d9a67-2729-4a95-8074-48535214696c' AND sort_order >= 3;
-- ============================================

-- ─── C.1 — Bump existing scholarships blocks 2..5 → 3..6, insert CollegesGrid at 2 ────
UPDATE cms_page_blocks
SET sort_order = sort_order + 1
WHERE page_id = '206d9a67-2729-4a95-8074-48535214696c'
  AND sort_order >= 2;

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
VALUES (
  '206d9a67-2729-4a95-8074-48535214696c',
  'CollegesGrid',
  2,
  jsonb_build_object(
    'badge', 'CHOOSE YOUR COLLEGE',
    'title', 'Scholarships by College',
    'titleAccentWord', 'College',
    'subtitle', 'Select a college to view course-specific scholarship amounts and eligibility.',
    'columns', '3',
    'colleges', jsonb_build_array(
      jsonb_build_object('link','/scholarships/engineering','name','JKKN College of Engineering','description','PMSS, First-Graduate, Trust merit awards up to 100% for B.E / B.Tech / M.E / MBA','headerColor','#0b6d41'),
      jsonb_build_object('link','/scholarships/arts-and-science','name','JKKN College of Arts & Science','description','Cross-college government and Naan Mudhalvan schemes for UG / PG learners','headerColor','#0b6d41'),
      jsonb_build_object('link','/scholarships/education','name','JKKN College of Education','description','Government Quota PMSS and maintenance support for B.Ed candidates','headerColor','#0b6d41'),
      jsonb_build_object('link','/scholarships/dental','name','JKKN Dental College & Hospital','description','PMSS up to ₹6L / yr, First-Graduate ₹40K / yr, Naan Mudhalvan for BDS','headerColor','#0b6d41'),
      jsonb_build_object('link','/scholarships/pharmacy','name','JKKN College of Pharmacy','description','PMSS, Trust and First-Graduate aid for Pharm D / B.Pharm / M.Pharm','headerColor','#0b6d41'),
      jsonb_build_object('link','/scholarships/nursing','name','JKKN College of Nursing','description','PMSS, First-Graduate, Naan Mudhalvan for B.Sc / M.Sc / PB.B.Sc Nursing','headerColor','#0b6d41'),
      jsonb_build_object('link','/scholarships/allied-health','name','JKKN College of Allied Health Sciences','description','Trust scholarship and Naan Mudhalvan for paramedical learners','headerColor','#0b6d41')
    ),
    'accentColor', '#0b6d41',
    'showAnimations', true,
    'backgroundColor', 'gradient-light'
  )
);

-- ─── C.2 — Insert 7 per-college scholarship pages ────────────────────────────
INSERT INTO cms_pages (
  title, slug, parent_id, status, visibility,
  show_in_navigation, sort_order, created_by, published_at
) VALUES
  ('Engineering Scholarships 2026-27 | JKKN College of Engineering Financial Aid',
    'scholarships/engineering', '206d9a67-2729-4a95-8074-48535214696c',
    'published', 'public', false, 1,
    'bdf878d6-75b6-4568-9d35-afb30ff38759', now()),
  ('Pharmacy Scholarships 2026-27 | JKKN Pharm D, B.Pharm, M.Pharm Aid',
    'scholarships/pharmacy', '206d9a67-2729-4a95-8074-48535214696c',
    'published', 'public', false, 2,
    'bdf878d6-75b6-4568-9d35-afb30ff38759', now()),
  ('Dental Scholarships 2026-27 | JKKN Dental College BDS Financial Aid',
    'scholarships/dental', '206d9a67-2729-4a95-8074-48535214696c',
    'published', 'public', false, 3,
    'bdf878d6-75b6-4568-9d35-afb30ff38759', now()),
  ('Nursing Scholarships 2026-27 | JKKN B.Sc / M.Sc / PB.B.Sc Nursing Aid',
    'scholarships/nursing', '206d9a67-2729-4a95-8074-48535214696c',
    'published', 'public', false, 4,
    'bdf878d6-75b6-4568-9d35-afb30ff38759', now()),
  ('Allied Health Scholarships 2026-27 | JKKN Paramedical Financial Aid',
    'scholarships/allied-health', '206d9a67-2729-4a95-8074-48535214696c',
    'published', 'public', false, 5,
    'bdf878d6-75b6-4568-9d35-afb30ff38759', now()),
  ('Education Scholarships 2026-27 | JKKN B.Ed Financial Aid',
    'scholarships/education', '206d9a67-2729-4a95-8074-48535214696c',
    'published', 'public', false, 6,
    'bdf878d6-75b6-4568-9d35-afb30ff38759', now()),
  ('Arts & Science Scholarships 2026-27 | JKKN UG and PG Aid',
    'scholarships/arts-and-science', '206d9a67-2729-4a95-8074-48535214696c',
    'published', 'public', false, 7,
    'bdf878d6-75b6-4568-9d35-afb30ff38759', now());

-- ─── C.3 — Insert 3 blocks per page (AdmissionHero + TextEditor + CallToAction) ────
-- Helper: each AdmissionHero, TextEditor, CallToAction reuses the same shape
-- as existing seeds. The TextEditor `content` is HTML derived from ScholarshipMatrix rows.
-- Fee-table column order: Course · PMSS GQ · PMSS MQ · Community · Maintenance · First-Graduate · Naan Mudhalvan · Trust

-- ─── Engineering ─────────────────────────────────────────────────────────────
INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'AdmissionHero', 1,
  jsonb_build_object(
    'badge', jsonb_build_object('text','Engineering Scholarships'),
    'title', 'JKKN Engineering — Scholarships & Financial Aid',
    'subtitle', 'Annual scholarship entitlements for B.E / B.Tech, M.E, and MBA learners — including JKKN Trust merit awards up to 100% tuition waiver.',
    'ctaButtons', jsonb_build_array(
      jsonb_build_object('icon','arrow','link','/admissions','label','Apply for Admission','variant','primary'),
      jsonb_build_object('icon','none','link','/contact','label','Talk to Scholarship Cell','variant','secondary')
    ),
    'backgroundColor', 'gradient-dark'
  )
FROM cms_pages WHERE slug = 'scholarships/engineering';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'TextEditor', 2,
  jsonb_build_object(
    'content', '<h3>Course-wise Scholarship Amounts (per academic year)</h3><table><thead><tr><th>Course</th><th>PMSS GQ</th><th>PMSS MQ</th><th>Community</th><th>Maintenance</th><th>First-Graduate</th><th>Naan Mudhalvan</th><th>JKKN Trust (Merit)</th></tr></thead><tbody><tr><td>B.E / B.Tech</td><td>₹50K / yr</td><td>₹50K / yr</td><td>₹5K–10K / yr</td><td>₹5K–10K / yr</td><td>₹25K / yr</td><td>₹1,000 / month</td><td>₹5K – up to 100% / yr</td></tr><tr><td>MBA</td><td>₹35K / yr</td><td>₹35K / yr</td><td>₹5K–10K / yr</td><td>₹5K–10K / yr</td><td>—</td><td>—</td><td>—</td></tr><tr><td>M.E</td><td>₹50K / yr</td><td>₹50K / yr</td><td>₹5K–10K / yr</td><td>₹5K–10K / yr</td><td>—</td><td>—</td><td>—</td></tr></tbody></table><p><strong>Notes:</strong> GQ = Government Quota · MQ = Management Quota · PMSS = Post-Matric Scholarship Scheme. Engineering merit performers can receive up to 100% tuition waiver via the JKKN Trust scholarship — confirm exact eligibility with the Scholarship Cell.</p>',
    'maxWidth', 'full',
    'alignment', 'left'
  )
FROM cms_pages WHERE slug = 'scholarships/engineering';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'CallToAction', 3,
  jsonb_build_object(
    'title', 'Talk to the JKKN Scholarship Cell',
    'description', 'Our team helps you maximise the legal combination of merit, government, and trust scholarships for your engineering programme.',
    'primaryButton', jsonb_build_object('link','/contact','label','Contact Scholarship Cell'),
    'secondaryButton', jsonb_build_object('link','tel:+914222661100','label','Call +91 422 266 1100')
  )
FROM cms_pages WHERE slug = 'scholarships/engineering';

-- ─── Pharmacy ────────────────────────────────────────────────────────────────
INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'AdmissionHero', 1,
  jsonb_build_object(
    'badge', jsonb_build_object('text','Pharmacy Scholarships'),
    'title', 'JKKN Pharmacy — Scholarships & Financial Aid',
    'subtitle', 'Annual scholarship entitlements across Pharm D, B.Pharm and M.Pharm programmes — including PMSS, JKKN Trust, and Naan Mudhalvan schemes.',
    'ctaButtons', jsonb_build_array(
      jsonb_build_object('icon','arrow','link','/admissions','label','Apply for Admission','variant','primary'),
      jsonb_build_object('icon','none','link','/contact','label','Talk to Scholarship Cell','variant','secondary')
    ),
    'backgroundColor', 'gradient-dark'
  )
FROM cms_pages WHERE slug = 'scholarships/pharmacy';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'TextEditor', 2,
  jsonb_build_object(
    'content', '<h3>Course-wise Scholarship Amounts (per academic year)</h3><table><thead><tr><th>Course</th><th>PMSS GQ</th><th>PMSS MQ</th><th>Community</th><th>Maintenance</th><th>First-Graduate</th><th>Naan Mudhalvan</th><th>JKKN Trust</th></tr></thead><tbody><tr><td>Pharm D</td><td>₹2L / yr</td><td>₹5.25L / yr</td><td>—</td><td>₹5K–10K / yr</td><td>—</td><td>₹1,000 / month</td><td>₹15K–20K / yr</td></tr><tr><td>B.Pharm</td><td>₹43K / yr</td><td>₹43K / yr</td><td>₹5K–10K / yr</td><td>₹5K–10K / yr</td><td>₹18K / yr</td><td>₹1,000 / month</td><td>₹5K–10K / yr</td></tr><tr><td>M.Pharm</td><td>₹70K / yr</td><td>₹70K / yr</td><td>₹5K–10K / yr</td><td>₹5K–10K / yr</td><td>—</td><td>—</td><td>—</td></tr></tbody></table><p><strong>Notes:</strong> GQ = Government Quota · MQ = Management Quota · PMSS = Post-Matric Scholarship Scheme. Pharm D learners receive the highest PMSS MQ award at JKKN.</p>',
    'maxWidth', 'full',
    'alignment', 'left'
  )
FROM cms_pages WHERE slug = 'scholarships/pharmacy';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'CallToAction', 3,
  jsonb_build_object(
    'title', 'Talk to the JKKN Scholarship Cell',
    'description', 'Get help selecting the optimal Pharmacy scholarship combination for your eligibility.',
    'primaryButton', jsonb_build_object('link','/contact','label','Contact Scholarship Cell'),
    'secondaryButton', jsonb_build_object('link','tel:+914222661100','label','Call +91 422 266 1100')
  )
FROM cms_pages WHERE slug = 'scholarships/pharmacy';

-- ─── Dental ──────────────────────────────────────────────────────────────────
INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'AdmissionHero', 1,
  jsonb_build_object(
    'badge', jsonb_build_object('text','Dental Scholarships'),
    'title', 'JKKN Dental — Scholarships & Financial Aid',
    'subtitle', 'BDS scholarship entitlements at JKKN Dental College & Hospital — PMSS up to ₹6L per year and First-Graduate aid of ₹40K per year.',
    'ctaButtons', jsonb_build_array(
      jsonb_build_object('icon','arrow','link','/admissions','label','Apply for Admission','variant','primary'),
      jsonb_build_object('icon','none','link','/contact','label','Talk to Scholarship Cell','variant','secondary')
    ),
    'backgroundColor', 'gradient-dark'
  )
FROM cms_pages WHERE slug = 'scholarships/dental';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'TextEditor', 2,
  jsonb_build_object(
    'content', '<h3>Course-wise Scholarship Amounts (per academic year)</h3><table><thead><tr><th>Course</th><th>PMSS GQ</th><th>PMSS MQ</th><th>Community</th><th>Maintenance</th><th>First-Graduate</th><th>Naan Mudhalvan</th><th>JKKN Trust</th></tr></thead><tbody><tr><td>BDS</td><td>₹2.5L / yr</td><td>₹6L / yr</td><td>₹5K–10K / yr</td><td>₹5K–10K / yr</td><td>₹40K / yr</td><td>₹1,000 / month</td><td>—</td></tr></tbody></table><p><strong>Notes:</strong> GQ = Government Quota · MQ = Management Quota · PMSS = Post-Matric Scholarship Scheme. The BDS PMSS MQ amount of ₹6L per year is the highest scholarship disbursement at JKKN. MDS specialisations are eligible for the same government schemes; confirm exact amounts with the Scholarship Cell.</p>',
    'maxWidth', 'full',
    'alignment', 'left'
  )
FROM cms_pages WHERE slug = 'scholarships/dental';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'CallToAction', 3,
  jsonb_build_object(
    'title', 'Talk to the JKKN Scholarship Cell',
    'description', 'BDS PMSS applications open on the National Scholarship Portal each August — our team helps with category certificates and tracking.',
    'primaryButton', jsonb_build_object('link','/contact','label','Contact Scholarship Cell'),
    'secondaryButton', jsonb_build_object('link','tel:+914222661100','label','Call +91 422 266 1100')
  )
FROM cms_pages WHERE slug = 'scholarships/dental';

-- ─── Nursing ─────────────────────────────────────────────────────────────────
INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'AdmissionHero', 1,
  jsonb_build_object(
    'badge', jsonb_build_object('text','Nursing Scholarships'),
    'title', 'JKKN Nursing — Scholarships & Financial Aid',
    'subtitle', 'Scholarship entitlements for B.Sc Nursing, M.Sc Nursing, and Post-Basic B.Sc Nursing — including PMSS, First-Graduate, and Naan Mudhalvan schemes.',
    'ctaButtons', jsonb_build_array(
      jsonb_build_object('icon','arrow','link','/admissions','label','Apply for Admission','variant','primary'),
      jsonb_build_object('icon','none','link','/contact','label','Talk to Scholarship Cell','variant','secondary')
    ),
    'backgroundColor', 'gradient-dark'
  )
FROM cms_pages WHERE slug = 'scholarships/nursing';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'TextEditor', 2,
  jsonb_build_object(
    'content', '<h3>Course-wise Scholarship Amounts (per academic year)</h3><table><thead><tr><th>Course</th><th>PMSS GQ</th><th>PMSS MQ</th><th>Community</th><th>Maintenance</th><th>First-Graduate</th><th>Naan Mudhalvan</th><th>JKKN Trust</th></tr></thead><tbody><tr><td>B.Sc (N)</td><td>₹45K / yr</td><td>₹45K / yr</td><td>₹5K–10K / yr</td><td>₹5K–10K / yr</td><td>₹20K / yr</td><td>₹1,000 / month</td><td>₹5K–10K / yr</td></tr><tr><td>M.Sc (N)</td><td>₹75K / yr</td><td>₹75K / yr</td><td>₹5K–10K / yr</td><td>₹5K–10K / yr</td><td>—</td><td>—</td><td>—</td></tr><tr><td>PB.B.Sc (N)</td><td>—</td><td>—</td><td>—</td><td>&lt; ₹5K / yr</td><td>—</td><td>—</td><td>—</td></tr></tbody></table><p><strong>Notes:</strong> GQ = Government Quota · MQ = Management Quota · PMSS = Post-Matric Scholarship Scheme. Post-Basic B.Sc Nursing learners are eligible for nominal maintenance support; PMSS does not apply to this programme.</p>',
    'maxWidth', 'full',
    'alignment', 'left'
  )
FROM cms_pages WHERE slug = 'scholarships/nursing';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'CallToAction', 3,
  jsonb_build_object(
    'title', 'Talk to the JKKN Scholarship Cell',
    'description', 'Our team helps Nursing learners apply via TN e-Sevai and the National Scholarship Portal each cycle.',
    'primaryButton', jsonb_build_object('link','/contact','label','Contact Scholarship Cell'),
    'secondaryButton', jsonb_build_object('link','tel:+914222661100','label','Call +91 422 266 1100')
  )
FROM cms_pages WHERE slug = 'scholarships/nursing';

-- ─── Allied Health Sciences ──────────────────────────────────────────────────
INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'AdmissionHero', 1,
  jsonb_build_object(
    'badge', jsonb_build_object('text','Allied Health Scholarships'),
    'title', 'JKKN Allied Health Sciences — Scholarships & Financial Aid',
    'subtitle', 'Cross-branch scholarships for paramedical learners — including JKKN Trust support and the Naan Mudhalvan scheme for Tamil-medium school graduates.',
    'ctaButtons', jsonb_build_array(
      jsonb_build_object('icon','arrow','link','/admissions','label','Apply for Admission','variant','primary'),
      jsonb_build_object('icon','none','link','/contact','label','Talk to Scholarship Cell','variant','secondary')
    ),
    'backgroundColor', 'gradient-dark'
  )
FROM cms_pages WHERE slug = 'scholarships/allied-health';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'TextEditor', 2,
  jsonb_build_object(
    'content', '<h3>Course-wise Scholarship Amounts (per academic year)</h3><table><thead><tr><th>Course</th><th>PMSS GQ</th><th>PMSS MQ</th><th>Community</th><th>Maintenance</th><th>First-Graduate</th><th>Naan Mudhalvan</th><th>JKKN Trust</th></tr></thead><tbody><tr><td>All AHS Branches (Cardiac, OTA, Radiology, Dialysis, etc.)</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>₹1,000 / month</td><td>₹5K–10K / yr</td></tr></tbody></table><p><strong>Notes:</strong> Allied Health learners admitted via TN Directorate of Medical Education are eligible for the same government schemes that apply across paramedical programmes; PMSS variants depend on community category and are confirmed during admission counselling. The JKKN Trust supplement and Naan Mudhalvan stipend are available across all AHS branches.</p>',
    'maxWidth', 'full',
    'alignment', 'left'
  )
FROM cms_pages WHERE slug = 'scholarships/allied-health';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'CallToAction', 3,
  jsonb_build_object(
    'title', 'Talk to the JKKN Scholarship Cell',
    'description', 'AHS-specific government quota scholarship eligibility is confirmed during counselling — our team helps with documentation.',
    'primaryButton', jsonb_build_object('link','/contact','label','Contact Scholarship Cell'),
    'secondaryButton', jsonb_build_object('link','tel:+914222661100','label','Call +91 422 266 1100')
  )
FROM cms_pages WHERE slug = 'scholarships/allied-health';

-- ─── Education ───────────────────────────────────────────────────────────────
INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'AdmissionHero', 1,
  jsonb_build_object(
    'badge', jsonb_build_object('text','Education Scholarships'),
    'title', 'JKKN Education — Scholarships & Financial Aid',
    'subtitle', 'B.Ed scholarship entitlements at JKKN College of Education — Government Quota PMSS and maintenance support.',
    'ctaButtons', jsonb_build_array(
      jsonb_build_object('icon','arrow','link','/admissions','label','Apply for Admission','variant','primary'),
      jsonb_build_object('icon','none','link','/contact','label','Talk to Scholarship Cell','variant','secondary')
    ),
    'backgroundColor', 'gradient-dark'
  )
FROM cms_pages WHERE slug = 'scholarships/education';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'TextEditor', 2,
  jsonb_build_object(
    'content', '<h3>Course-wise Scholarship Amounts (per academic year)</h3><table><thead><tr><th>Course</th><th>PMSS GQ</th><th>PMSS MQ</th><th>Community</th><th>Maintenance</th><th>First-Graduate</th><th>Naan Mudhalvan</th><th>JKKN Trust</th></tr></thead><tbody><tr><td>B.Ed</td><td>₹30K / yr</td><td>₹30K / yr</td><td>—</td><td>&lt; ₹5K / yr</td><td>—</td><td>—</td><td>—</td></tr></tbody></table><p><strong>Notes:</strong> GQ = Government Quota · MQ = Management Quota. B.Ed is admitted through the TNTEU counselling process; PMSS amounts apply uniformly to GQ and MQ candidates from eligible communities. Maintenance support is nominal at this programme level.</p>',
    'maxWidth', 'full',
    'alignment', 'left'
  )
FROM cms_pages WHERE slug = 'scholarships/education';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'CallToAction', 3,
  jsonb_build_object(
    'title', 'Talk to the JKKN Scholarship Cell',
    'description', 'B.Ed scholarship documentation is processed each cycle by our scholarship cell — get in touch to start.',
    'primaryButton', jsonb_build_object('link','/contact','label','Contact Scholarship Cell'),
    'secondaryButton', jsonb_build_object('link','tel:+914222661100','label','Call +91 422 266 1100')
  )
FROM cms_pages WHERE slug = 'scholarships/education';

-- ─── Arts & Science (no matrix row — fallback copy per spec §5.C.3) ──────────
INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'AdmissionHero', 1,
  jsonb_build_object(
    'badge', jsonb_build_object('text','Arts & Science Scholarships'),
    'title', 'JKKN Arts & Science — Scholarships & Financial Aid',
    'subtitle', 'Cross-college government schemes available for UG and PG learners while the institutional scheme for Arts & Science is finalised for AY 2026-27.',
    'ctaButtons', jsonb_build_array(
      jsonb_build_object('icon','arrow','link','/admissions','label','Apply for Admission','variant','primary'),
      jsonb_build_object('icon','none','link','/contact','label','Talk to Scholarship Cell','variant','secondary')
    ),
    'backgroundColor', 'gradient-dark'
  )
FROM cms_pages WHERE slug = 'scholarships/arts-and-science';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'TextEditor', 2,
  jsonb_build_object(
    'content', '<p><em>The institutional scholarship scheme for Arts &amp; Science is under finalisation for AY 2026–27. The government schemes below apply to all eligible JKKN students across colleges, including Arts &amp; Science.</em></p><h3>Government and Trust Schemes Applicable to Arts &amp; Science</h3><ul><li><strong>Post-Matric Scholarship (PMSS):</strong> Central &amp; State community scholarship covering full tuition for SC / SCA / ST / BC-CC learners — apply via TN e-Sevai or the National Scholarship Portal.</li><li><strong>First-Graduate Scholarship:</strong> State scheme for BC / MBC / DNC / BCM learners who are first-in-family graduates — covers ₹18K–₹40K per year depending on the course (final amount confirmed at counselling for Arts &amp; Science programmes).</li><li><strong>BC / MBC Community Scholarship:</strong> Supplementary aid of ₹5,000–₹10,000 per year for BC / MBC / DNC / BCM learners.</li><li><strong>Naan Mudhalvan:</strong> ₹1,000 per month stipend for learners who studied 6th–12th in Government / Government-Aided Tamil-medium schools — open to all communities.</li></ul><p><strong>Note:</strong> Exact eligibility for each scheme is confirmed by the JKKN Scholarship Cell during admission. Once the AY 2026–27 institutional scheme for Arts &amp; Science is published, this page will be updated with the course-specific amount table.</p>',
    'maxWidth', 'full',
    'alignment', 'left'
  )
FROM cms_pages WHERE slug = 'scholarships/arts-and-science';

INSERT INTO cms_page_blocks (page_id, component_name, sort_order, props)
SELECT id, 'CallToAction', 3,
  jsonb_build_object(
    'title', 'Talk to the JKKN Scholarship Cell',
    'description', 'Get notified when the AY 2026–27 Arts &amp; Science institutional scheme is finalised, and apply for current government schemes today.',
    'primaryButton', jsonb_build_object('link','/contact','label','Contact Scholarship Cell'),
    'secondaryButton', jsonb_build_object('link','tel:+914222661100','label','Call +91 422 266 1100')
  )
FROM cms_pages WHERE slug = 'scholarships/arts-and-science';

-- End of Migration 30
-- ============================================
