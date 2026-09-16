-- ============================================
-- Migration 47 — Parent site (jkkn.ac.in) published-fact conflicts
-- ============================================
-- Purpose: A live audit of https://www.jkkn.ac.in on 2026-09-12 checked 93
--   published claims against the seven colleges' own sites, the parent's own
--   JSON-LD and llms.txt, nirfindia.org, Google Business Profile and OSRM
--   road routing. 36 were CONFLICTS (two surfaces, two answers), 7 were WRONG
--   (the college's own site contradicts the parent) and 2 were dead links.
--
--   Roughly half of those strings live in CODE and are fixed in the same
--   branch as this file (fix/parent-fact-conflicts-2026-09-12). The other
--   half live in CMS rows — cms_page_blocks.props (JSONB) and
--   cms_seo_metadata — and this migration fixes those.
--
-- Rulings taken from the user on 2026-09-12 (AskUserQuestion, in-chat):
--   * NAAC grade        = A       (A+ was wrong wherever it appeared)
--   * Group founded     = 1952    (1965 on /our-trust was wrong)
--   * Campus size       = 70 acres (55 / 60+ / 100+ were wrong)
--   * Recruiters        = 100+    (follows lib/constants/institutional-data.ts)
--   * Placement rate, highest package, library volumes, hospital beds:
--                         LEFT UNTOUCHED — no source; flagged UNRESOLVED.
--
-- Measured facts used below (not opinions):
--   * dental.jkkn.ac.in/academics: "5 DCI-approved MDS specializations" —
--     Orthodontics, Prosthodontics, Periodontics, Endodontics, Oral Medicine
--   * edu.jkkn.ac.in: B.Ed only, 14 specialisations. No M.Ed, no D.El.Ed.
--   * nursing.sresakthimayeil.jkkn.ac.in: GNM appears only as an ENTRY
--     qualification for Post Basic B.Sc; GNM/ANM are not offered.
--   * ahs.jkkn.ac.in/departments: 9 B.Sc programmes, none of them MLT,
--     Optometry or Physiotherapy.
--   * engg.jkkn.ac.in: the branch is AI/ML, not AI&DS.
--   * nursing.jkkn.ac.in resolves to 103.235.105.121 and does not accept
--     connections (3/3 timeouts). Live host: nursing.sresakthimayeil.jkkn.ac.in
--   * Road distances from the campus pin (11.4454, 77.7306) via OSRM,
--     2026-09-12: Erode 18.4 km, Salem 57.6 km, Coimbatore 114.4 km,
--     Namakkal 61.8 km. The old "Salem 45 / Coimbatore 70 / Namakkal 40"
--     were SHORTER than the straight-line distance, i.e. impossible.
--   * nirfindia.org 2025 published lists (Pharmacy 1-100 + band 102-125,
--     Dental 1-40, Engineering 1-100, Overall College 1-100): zero JKKN
--     entries. "NIRF Ranked" is therefore not supportable; "participates" is.
--
-- Created: 2026-09-12   (file written 2026-09-16 in the same worktree)
-- Author: Digital Optimization (claude-opus-5)
--
-- Strategy: identical to migration 38 — cast props to text, REPLACE the exact
--   live string, cast back to jsonb. Every REPLACE is a no-op where the string
--   is absent, so the file is idempotent and safe to re-run. Long, specific
--   strings are used so nothing else can match by accident.
--
-- HOW TO RUN
--   1. Run PART A (dry-run SELECTs) first. It prints every block that WILL
--      change and how many times each string occurs. Zero rows for a string
--      means it lives in code, not CMS — that is expected for some entries.
--   2. Run PART B inside the transaction. COMMIT is left commented out on
--      purpose: inspect, then commit by hand.
--   3. Re-run PART A afterwards. Every count must read 0.
--
-- Rollback: reverse each REPLACE (old <-> new). The old strings are factually
--   wrong, so no reverse migration is shipped.
-- ============================================


-- ════════════════════════════════════════════════════════════════════
-- PART A — DRY RUN. Read-only. Run this first and again after PART B.
-- ════════════════════════════════════════════════════════════════════
WITH needles(label, needle) AS (VALUES
  ('C-01 dental affiliation (our-colleges/courses-offered grid)', 'Bharathidasan University affiliated'),
  ('C-01 dental affiliation (rankings page)',                     'affiliated to Bharathidasan University'),
  ('C-02 pharmacy TNPSC (grid)',                                  'PCI Approved, TNPSC recognised'),
  ('C-02 pharmacy TNPSC (rankings page)',                         'programmes are TNPSC recognised'),
  ('C-03 AHS UGC approved (grid)',                                'OT Technology. UGC approved'),
  ('C-04 nursing TNNCHN (grid)',                                  'INC and TNNCHN approved'),
  ('L-01 nursing dead host (grid link)',                          'https://nursing.jkkn.ac.in/admissions/'),
  ('C-05 education M.Ed/D.El.Ed (grid)',                          'B.Ed (2 yrs), M.Ed (2 yrs), D.El.Ed (2 yrs)'),
  ('C-05 education M.Ed (homepage FAQ)',                          'Education (B.Ed, M.Ed)'),
  ('C-07 MDS names (grid)',                                       'MDS — Orthodontics, Prosthodontics, Periodontics, Oral Surgery'),
  ('C-10 engineering AI&DS (grid)',                               'Mechanical, Civil, EEE, AI&DS'),
  ('C-09 AHS programme list (grid)',                              'B.Sc — MLT, Radiology, Optometry, Cardiac Technology, Dialysis Technology, OT Technology'),
  ('G-09 NAAC A+ (accreditation hero)',                           'NAAC A+, NIRF, DCI, PCI, INC, AICTE, UGC and more'),
  ('G-09 NAAC A+ (accreditation FAQ)',                            'holds NAAC A+ accreditation from the National Assessment and Accreditation Council. NAAC A+ is the second-highest tier and signals'),
  ('G-09 NAAC A+ (nirf page)',                                    'NAAC A+ accreditation and active NIRF participation'),
  ('G-11 NAAC A+ (homepage news card)',                           'NAAC A+ Accreditation Achieved'),
  ('G-24 NIRF ranked (rankings hero)',                            '| NIRF Ranked |'),
  ('G-24 NIRF appear (accreditation FAQ)',                        'Yes. Multiple JKKN institutions appear in the National Institutional Ranking Framework (NIRF)'),
  ('X-15 nirf hero 7 institutions',                               'across JKKN''s 7 institutions'),
  ('G-13 campus 60+ acres (homepage FAQ)',                        'spans over 60+ acres'),
  ('G-13 campus 100+ acre (how-to-reach)',                        'our 100+ acre campus'),
  ('G-03 founded 1965 (our-trust story)',                         'initiated a girls'' school in the town in 1965, four years before the inception of the trust'),
  ('G-01 ten institutions (our-trust story)',                     'there are ten institutions, including Dental, Pharmacy, Nursing, Education, Engineering, Arts, and Science colleges'),
  ('G-06 trust title Nattraja (seo title)',                       'J.K.K. Nattraja Charitable Trust'),
  ('G-08 73+ years (homepage FAQ)',                               '73+ years of educational legacy'),
  ('G-16 dental chairs 100+ (homepage FAQ)',                      'Dental hospital with 100+ dental chairs'),
  ('T-03 distances (homepage FAQ)',                               '30 km from Erode, 45 km from Salem, 70 km from Coimbatore'),
  ('T-03 distances (about FAQ)',                                  'Erode (25 km), Salem (45 km), and Namakkal (40 km)'),
  ('G-01 9 institutions and 2 schools (about body)',              'across 9 institutions and 2 schools'),
  ('A-01 jkkn.in apply link (homepage FAQ)',                      'https://jkkn.in/admission-form'),
  ('A-02 admissions 2025-26 (homepage FAQ)',                      'Admissions for 2025-26 are now open!'),
  ('P-04 500+ recruiting companies (placements)',                 '500+ Recruiting Companies'),
  ('P-04 500+ recruiting partners (placements)',                  '500+ Recruiting Partners'),
  ('P-04 500+ companies annually (placements FAQ)',               '500+ companies annually'),
  ('P-04 500+ more (placements)',                                 'and 500+ more'),
  ('P-04 500+ recruiting partners lowercase (placements)',        '500+ recruiting partners'),
  ('G-25 100 years of excellence (homepage hero/meta)',           'Celebrating 100 Years of Excellence'),
  ('A-03 fee title 2025-26 (seo title)',                          'JKKN Fee Structure 2025-26')
)
SELECT n.label,
       b.page_id,
       b.id            AS block_id,
       b.component_type,
       (LENGTH(b.props::text) - LENGTH(REPLACE(b.props::text, n.needle, ''))) / LENGTH(n.needle) AS occurrences
FROM needles n
JOIN cms_page_blocks b ON b.props::text LIKE '%' || n.needle || '%'
ORDER BY n.label, b.page_id;

-- SEO metadata rows (title tags) — checked separately because they are not JSONB
SELECT 'G-06 our-trust title'  AS label, page_id, meta_title FROM cms_seo_metadata WHERE meta_title LIKE '%J.K.K. Nattraja Charitable Trust%'
UNION ALL
SELECT 'A-03 fee-structure title', page_id, meta_title FROM cms_seo_metadata WHERE meta_title LIKE '%Fee Structure 2025-26%';


-- ════════════════════════════════════════════════════════════════════
-- PART B — THE FIX. Wrapped in a transaction; COMMIT left to a human.
-- ════════════════════════════════════════════════════════════════════
BEGIN;

-- ── B1. Regulator facts the colleges' own sites contradict (WRONG, P0) ──
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'DCI Approved, Bharathidasan University affiliated.',
  'DCI Approved, affiliated to The Tamil Nadu Dr. M.G.R. Medical University.')::jsonb
WHERE props::text LIKE '%DCI Approved, Bharathidasan University affiliated.%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'approved by the Dental Council of India (DCI) and affiliated to Bharathidasan University.',
  'approved by the Dental Council of India (DCI) and affiliated to The Tamil Nadu Dr. M.G.R. Medical University.')::jsonb
WHERE props::text LIKE '%affiliated to Bharathidasan University.%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'PCI Approved, TNPSC recognised.',
  'PCI Approved, affiliated to The Tamil Nadu Dr. M.G.R. Medical University.')::jsonb
WHERE props::text LIKE '%PCI Approved, TNPSC recognised.%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'D.Pharm, B.Pharm, M.Pharm and Pharm.D programmes are TNPSC recognised.',
  'D.Pharm, B.Pharm, M.Pharm and Pharm.D programmes are affiliated to The Tamil Nadu Dr. M.G.R. Medical University.')::jsonb
WHERE props::text LIKE '%programmes are TNPSC recognised.%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'INC and TNNCHN approved.',
  'INC approved, registered with the Tamil Nadu Nurses and Midwives Council (TNNMC).')::jsonb
WHERE props::text LIKE '%INC and TNNCHN approved.%';

-- AHS: the six names listed were mostly programmes AHS does not run
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'Programmes: B.Sc — MLT, Radiology, Optometry, Cardiac Technology, Dialysis Technology, OT Technology. UGC approved.',
  'Programmes: B.Sc — Cardiac Technology, Critical Care, Dialysis, OT & Anaesthesia, Radiology & Imaging, Physician Assistant, Respiratory Therapy, Accident & Emergency Care, Medical Record Science. Affiliated to The Tamil Nadu Dr. M.G.R. Medical University.')::jsonb
WHERE props::text LIKE '%OT Technology. UGC approved.%';

-- Education: B.Ed only (edu.jkkn.ac.in lists 14 B.Ed specialisations and nothing else)
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'Programmes: B.Ed (2 yrs), M.Ed (2 yrs), D.El.Ed (2 yrs).',
  'Programmes: B.Ed (2 yrs) — 14 specialisations.')::jsonb
WHERE props::text LIKE '%B.Ed (2 yrs), M.Ed (2 yrs), D.El.Ed (2 yrs).%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'Education (B.Ed, M.Ed)',
  'Education (B.Ed)')::jsonb
WHERE props::text LIKE '%Education (B.Ed, M.Ed)%';

-- MDS: five DCI-approved specialisations per dental.jkkn.ac.in; "Oral Surgery" is not one of them
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'MDS — Orthodontics, Prosthodontics, Periodontics, Oral Surgery.',
  'MDS — Orthodontics, Prosthodontics, Periodontics, Endodontics, Oral Medicine.')::jsonb
WHERE props::text LIKE '%MDS — Orthodontics, Prosthodontics, Periodontics, Oral Surgery.%';

-- Engineering branch name per engg.jkkn.ac.in
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'Mechanical, Civil, EEE, AI&DS',
  'Mechanical, Civil, EEE, AI/ML')::jsonb
WHERE props::text LIKE '%Mechanical, Civil, EEE, AI&DS%';

-- ── B2. Dead / wrong links (WRONG LINK, P0) ──
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'https://nursing.jkkn.ac.in/admissions/',
  'https://nursing.sresakthimayeil.jkkn.ac.in/admissions')::jsonb
WHERE props::text LIKE '%https://nursing.jkkn.ac.in/admissions/%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'https://jkkn.in/admission-form',
  'https://www.jkkn.ai/apply/jkkn-admission-2026')::jsonb
WHERE props::text LIKE '%https://jkkn.in/admission-form%';

-- ── B3. NAAC grade = A (user ruling) ──
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'NAAC A+, NIRF, DCI, PCI, INC, AICTE, UGC and more',
  'NAAC A, DCI, PCI, INC, AICTE, UGC and more')::jsonb          -- NIRF is a ranking, not an approval body
WHERE props::text LIKE '%NAAC A+, NIRF, DCI, PCI, INC, AICTE, UGC and more%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'holds NAAC A+ accreditation from the National Assessment and Accreditation Council. NAAC A+ is the second-highest tier and signals',
  'holds NAAC A accreditation from the National Assessment and Accreditation Council. NAAC A signals')::jsonb
WHERE props::text LIKE '%holds NAAC A+ accreditation from the National Assessment and Accreditation Council.%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'NAAC A+ accreditation and active NIRF participation',
  'NAAC A accreditation and active NIRF participation')::jsonb
WHERE props::text LIKE '%NAAC A+ accreditation and active NIRF participation%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'NAAC A+ Accreditation Achieved',
  'NAAC A Accreditation Achieved')::jsonb
WHERE props::text LIKE '%NAAC A+ Accreditation Achieved%';

-- ── B4. NIRF: participation, not ranking (nirfindia.org 2025: zero JKKN entries) ──
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  '| NIRF Ranked |',
  '| NIRF Participant |')::jsonb
WHERE props::text LIKE '%| NIRF Ranked |%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'Yes. Multiple JKKN institutions appear in the National Institutional Ranking Framework (NIRF)',
  'JKKN''s Pharmacy, Dental, Nursing and Engineering colleges participate in the National Institutional Ranking Framework (NIRF) by submitting their data each year')::jsonb
WHERE props::text LIKE '%Yes. Multiple JKKN institutions appear in the National Institutional Ranking Framework (NIRF)%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'across JKKN''s 7 institutions',
  'across JKKN''s 7 colleges')::jsonb
WHERE props::text LIKE '%across JKKN''s 7 institutions%';

-- ── B5. Campus size = 70 acres (user ruling) ──
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'spans over 60+ acres',
  'spans 70 acres')::jsonb
WHERE props::text LIKE '%spans over 60+ acres%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'our 100+ acre campus',
  'our 70-acre campus')::jsonb
WHERE props::text LIKE '%our 100+ acre campus%';

-- ── B6. Founding year = 1952 (user ruling); interval recomputed against the 1969 trust ──
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'initiated a girls'' school in the town in 1965, four years before the inception of the trust',
  'initiated a girls'' school in the town in 1952, seventeen years before the inception of the trust')::jsonb
WHERE props::text LIKE '%initiated a girls'' school in the town in 1965%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  '73+ years of educational legacy',
  '74+ years of educational legacy')::jsonb
WHERE props::text LIKE '%73+ years of educational legacy%';

-- ── B7. Institution count = 9, and Allied Health was missing from the trust's own list ──
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'there are ten institutions, including Dental, Pharmacy, Nursing, Education, Engineering, Arts, and Science colleges',
  'there are nine institutions, including Dental, Pharmacy, Nursing, Allied Health Sciences, Education, Engineering, and Arts and Science colleges')::jsonb
WHERE props::text LIKE '%there are ten institutions, including Dental%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'across 9 institutions and 2 schools',
  'across 9 institutions — 7 colleges and 2 schools')::jsonb
WHERE props::text LIKE '%across 9 institutions and 2 schools%';

-- ── B8. Distances — measured by road, OSRM 2026-09-12 ──
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  '30 km from Erode, 45 km from Salem, 70 km from Coimbatore',
  '18 km from Erode, 58 km from Salem, 114 km from Coimbatore by road')::jsonb
WHERE props::text LIKE '%30 km from Erode, 45 km from Salem, 70 km from Coimbatore%';

UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'Erode (25 km), Salem (45 km), and Namakkal (40 km)',
  'Erode (18 km), Salem (58 km), and Namakkal (62 km) by road')::jsonb
WHERE props::text LIKE '%Erode (25 km), Salem (45 km), and Namakkal (40 km)%';

-- ── B9. Dental chairs: dental.jkkn.ac.in publishes 200+ ──
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'Dental hospital with 100+ dental chairs',
  'Dental hospital with 200+ dental chairs')::jsonb
WHERE props::text LIKE '%Dental hospital with 100+ dental chairs%';

-- ── B10. Admissions year inside the 2026-27 FAQ ──
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'Admissions for 2025-26 are now open!',
  'Admissions for 2026-27 are now open!')::jsonb
WHERE props::text LIKE '%Admissions for 2025-26 are now open!%';

-- ── B11. Recruiters = 100+ (canonical constants; user ruling) ──
UPDATE cms_page_blocks SET props = REPLACE(props::text, '500+ Recruiting Companies', '100+ Recruiting Companies')::jsonb
WHERE props::text LIKE '%500+ Recruiting Companies%';
UPDATE cms_page_blocks SET props = REPLACE(props::text, '500+ Recruiting Partners',  '100+ Recruiting Partners')::jsonb
WHERE props::text LIKE '%500+ Recruiting Partners%';
UPDATE cms_page_blocks SET props = REPLACE(props::text, '500+ recruiting partners',  '100+ recruiting partners')::jsonb
WHERE props::text LIKE '%500+ recruiting partners%';
UPDATE cms_page_blocks SET props = REPLACE(props::text, '500+ companies annually',   '100+ companies annually')::jsonb
WHERE props::text LIKE '%500+ companies annually%';
UPDATE cms_page_blocks SET props = REPLACE(props::text, 'and 500+ more',             'and 100+ more')::jsonb
WHERE props::text LIKE '%and 500+ more%';

-- ── B12. JKKN100 is the founder's birth centenary, not the institution's ──
UPDATE cms_page_blocks SET props = REPLACE(props::text,
  'Celebrating 100 Years of Excellence',
  'Celebrating 100 Years Since Our Founder''s Birth')::jsonb
WHERE props::text LIKE '%Celebrating 100 Years of Excellence%';

-- ── B13. Title tags (cms_seo_metadata) ──
UPDATE cms_seo_metadata SET meta_title = REPLACE(meta_title, 'J.K.K. Nattraja Charitable Trust', 'J.K.K. Rangammal Charitable Trust')
WHERE meta_title LIKE '%J.K.K. Nattraja Charitable Trust%';

UPDATE cms_seo_metadata SET meta_title = REPLACE(meta_title, 'JKKN Fee Structure 2025-26', 'JKKN Fee Structure 2026-27')
WHERE meta_title LIKE '%JKKN Fee Structure 2025-26%';

-- COMMIT;   -- <- uncomment after reviewing the row counts above
-- ROLLBACK; -- <- or this


-- ════════════════════════════════════════════════════════════════════
-- PART C — NOT AUTOMATED. Counter/milestone blocks whose JSON shape was
-- not visible from outside the database. Locate them with these SELECTs,
-- then edit the specific prop by hand in the admin panel.
-- ════════════════════════════════════════════════════════════════════
--  1. /our-trust stat counter "7,000+ Current Learners" -> 5,000+
--     (institutional-data.ts currentStudents = '5,000+'; /about says 5,000+)
--  2. /our-trust stat counter "1,952 Year Established" -> renders the year
--     with a thousands separator. Fix the component's number formatting or
--     store it as text.
--  3. /our-trust milestone card "1965 — Girls School Founded" -> 1952
--  4. /rankings-and-recognitions counter "A+ NAAC Grade" -> "A"
--  5. /rankings-and-recognitions counter "6+ Regulatory Approvals" -> the
--     strip on the same page lists 7
--  6. /placements "Placement Highlights 2025-26" counters render 0+ / 0% /
--     Rs 0.0 LPA on the live page — a component bug, not a content bug.
SELECT id, page_id, component_type, LEFT(props::text, 200) AS props_head
FROM cms_page_blocks
WHERE props::text LIKE '%7,000%'
   OR props::text LIKE '%"1952"%'
   OR props::text LIKE '%1965%'
   OR (props::text LIKE '%NAAC Grade%' AND props::text LIKE '%A+%')
   OR props::text LIKE '%Regulatory Approvals%'
ORDER BY page_id, id;

-- ════════════════════════════════════════════════════════════════════
-- LEFT UNTOUCHED ON PURPOSE (no source; user ruling 2026-09-12 = flag only)
--   * Placement rate 92% (pharmacy's own site says 78%, education's 98%)
--   * Highest package 8.5 LPA / average 3.5 LPA
--   * Library 50,000+ books vs 100,000+ volumes
--   * Teaching hospital 350-bed vs 500+ bed
--   * NBA accreditation on /rankings-and-recognitions — unverified, not
--     refuted; asked separately.
--   * Nursing college name (3 variants live) — a branding call.
--   * Komarapalayam vs Kumarapalayam spelling — a NAP call.
-- ════════════════════════════════════════════════════════════════════
