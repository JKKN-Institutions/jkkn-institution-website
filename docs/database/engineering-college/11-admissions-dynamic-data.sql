-- ============================================
-- Engineering Admissions Page — Dynamic Data Seed
-- ============================================
-- Purpose: Seeds all engineering admissions page content into site_settings
--          so the page can be updated via MCP without code changes.
-- Created: 2026-03-29
-- Category: admissions (is_public = true → readable by anonymous/ISR)
-- Used by: app/(public)/admissions/engineering/_engineering-page.tsx
-- Security: Public read (is_public = true), write requires settings:site:manage
-- Sections stored:
--   admissions_overview, admissions_programs, admissions_eligibility,
--   admissions_steps, admissions_guidelines, admissions_documents,
--   admissions_fee_structure, admissions_dates, admissions_scholarship_groups,
--   admissions_faqs
-- ============================================

INSERT INTO public.site_settings (setting_key, setting_value, category, description, is_public)
VALUES

-- ── Overview ──────────────────────────────────────────────────────────────────
(
  'admissions_overview',
  to_jsonb($overview$JKKN College of Engineering and Technology (JKCET) offers admissions to undergraduate (B.E / B.Tech) and postgraduate (M.E & MBA) programmes. Admissions are governed by TNEA counselling administered by Anna University, Chennai, and direct admission under Management Quota as per AICTE and Tamil Nadu Government norms.

The college is AICTE approved, NAAC A accredited, and Autonomous — affiliated to Anna University. Students benefit from a placement-oriented curriculum, experienced faculty, state-of-the-art laboratories, and fully-residential hostel facilities for boys and girls.$overview$),
  'admissions',
  'Overview paragraph shown at the top of the admissions page',
  true
),

-- ── Programmes Table ──────────────────────────────────────────────────────────
(
  'admissions_programs',
  $json$[
    {"programme":"B.E Computer Science & Engineering","duration":"4 Years","intake":60,"annualFee":95000,"level":"UG"},
    {"programme":"B.E Electrical & Electronics Engineering","duration":"4 Years","intake":60,"annualFee":95000,"level":"UG"},
    {"programme":"B.E Electronics & Communication Engineering","duration":"4 Years","intake":60,"annualFee":95000,"level":"UG"},
    {"programme":"B.E Mechanical Engineering","duration":"4 Years","intake":120,"annualFee":95000,"level":"UG"},
    {"programme":"B.Tech Information Technology","duration":"4 Years","intake":60,"annualFee":95000,"level":"UG"},
    {"programme":"M.E Computer Science & Engineering","duration":"2 Years","intake":60,"annualFee":85000,"level":"PG"},
    {"programme":"M.B.A \u2014 Master of Business Administration","duration":"2 Years","intake":120,"annualFee":80000,"level":"PG"}
  ]$json$::jsonb,
  'admissions',
  'Programmes table with fees and intake — shown in the Programmes Offered section',
  true
),

-- ── Detailed Eligibility ──────────────────────────────────────────────────────
(
  'admissions_eligibility',
  $json$[
    {
      "programme": "For B.E / B.Tech \u2014 All Branches",
      "criteria": [
        "Passed 10+2 (HSC) with Physics, Chemistry, and Mathematics from a recognized Board",
        "Minimum 45% aggregate marks (40% for SC / ST / OBC / MBC reserved categories)",
        "Admission through TNEA counselling (Anna University) or direct Management Quota",
        "Age: 17\u201325 years as of July 1 of the admission year"
      ]
    },
    {
      "programme": "For M.E Computer Science & Engineering",
      "criteria": [
        "B.E / B.Tech in a relevant Engineering discipline from a recognized university",
        "Minimum 50% aggregate marks in the qualifying degree",
        "TANCET score preferred; direct merit-based admission also available",
        "Must satisfy subject equivalency norms as per Anna University regulations"
      ]
    },
    {
      "programme": "For M.B.A \u2014 Master of Business Administration",
      "criteria": [
        "Bachelor\u2019s degree in any discipline from a recognized university",
        "Minimum 50% aggregate marks in the qualifying degree",
        "Valid score in TANCET / CAT / MAT / XAT (any one)",
        "Shortlisted candidates appear for Group Discussion (GD) + Personal Interview (PI)"
      ]
    }
  ]$json$::jsonb,
  'admissions',
  'Detailed eligibility criteria per programme',
  true
),

-- ── Admission Steps ───────────────────────────────────────────────────────────
(
  'admissions_steps',
  $json$[
    {"number":1,"title":"Check Eligibility","description":"Review the eligibility criteria for your chosen programme. Confirm you meet the minimum educational qualification, marks percentage, and age requirements before applying."},
    {"number":2,"title":"Fill Application Form","description":"Apply online via the JKKN Admissions Portal or collect and submit the printed application form at the campus admissions counter. No application fee is charged."},
    {"number":3,"title":"Submit Required Documents","description":"Upload clear scanned copies of all required academic and personal documents with your online application. Physical originals must be produced during in-person verification."},
    {"number":4,"title":"Application Screening","description":"The admissions team verifies eligibility and document completeness. You will receive notification of your screening result within 3 working days of submission."},
    {"number":5,"title":"Counselling & Selection","description":"UG candidates attend TNEA counselling conducted by Anna University. Management Quota and PG candidates attend direct counselling / GD+PI at the JKKN campus."},
    {"number":6,"title":"Fee Payment & Enrolment","description":"Complete fee payment via DD, NEFT, or online transfer. Submit original documents for university verification, collect your enrolment confirmation and student ID card."}
  ]$json$::jsonb,
  'admissions',
  'Step-by-step admission process timeline',
  true
),

-- ── Process Guidelines ────────────────────────────────────────────────────────
(
  'admissions_guidelines',
  $json$[
    "The college follows Tamil Nadu Government and AICTE reservation norms and fee regulations strictly. No donation or capitation fee is charged.",
    "Admission is provisional until Anna University verifies original documents and confirms eligibility for the programme.",
    "Admissions will be cancelled without notice if submitted documents are found to be forged or incorrect.",
    "Fees paid are non-refundable after enrolment except as per AICTE / Government guidelines for seat cancellation.",
    "Under Management Quota, seats are allotted on a merit-cum-preference basis \u2014 no assurance of a specific preferred branch.",
    "Direct admission (Management Quota) windows open concurrently with TNEA counselling. Contact the admissions office for current seat availability."
  ]$json$::jsonb,
  'admissions',
  'Important process guidelines shown in the admission process section',
  true
),

-- ── Required Documents ────────────────────────────────────────────────────────
(
  'admissions_documents',
  $json${
    "common": [
      {"name":"10th Standard Marksheet & Passing Certificate"},
      {"name":"Transfer Certificate (TC)"},
      {"name":"Community Certificate"},
      {"name":"Passport Size Photographs","note":"6 copies, recent"},
      {"name":"Conduct Certificate","note":"From last institution attended"},
      {"name":"Aadhaar Card","note":"Self + parent"},
      {"name":"Income Certificate","note":"Required for scholarship application"}
    ],
    "ugOnly": [
      {"name":"12th Standard (HSC) Marksheet & Certificate"},
      {"name":"Eligibility Certificate","note":"If from a different state Board"},
      {"name":"TNEA Rank Card / Allotment Order","note":"For TNEA counselling seats"},
      {"name":"Special Category Certificate","note":"Sports / Ex-serviceman / NCC, if applicable"}
    ],
    "pgOnly": [
      {"name":"Degree Certificate & Consolidated Marksheet"},
      {"name":"TANCET / CAT / MAT / XAT Score Card"},
      {"name":"Character Certificate","note":"From graduating college"},
      {"name":"Migration Certificate","note":"If from outside Tamil Nadu"}
    ]
  }$json$::jsonb,
  'admissions',
  'Required documents checklist — common, UG-only, and PG-only',
  true
),

-- ── Fee Structure ─────────────────────────────────────────────────────────────
(
  'admissions_fee_structure',
  $json$[
    {"program":"B.E / B.Tech (all branches)","annualTuition":95000,"hostelFee":60000},
    {"program":"M.E Computer Science & Engineering","annualTuition":85000,"hostelFee":60000},
    {"program":"M.B.A","annualTuition":80000,"hostelFee":60000}
  ]$json$::jsonb,
  'admissions',
  'Fee structure table — tuition and hostel fees per programme',
  true
),

-- ── Admission Dates ───────────────────────────────────────────────────────────
(
  'admissions_dates',
  $json$[
    {"event":"Application Portal Opens","date":"April 1, 2026","status":"upcoming"},
    {"event":"Last Date to Apply (Regular)","date":"May 31, 2026","status":"upcoming"},
    {"event":"TNEA Counselling (Anna University)","date":"June \u2013 July 2026","status":"upcoming"},
    {"event":"Direct / Management Quota Window","date":"May 1 \u2013 July 31, 2026","status":"upcoming"},
    {"event":"Document Verification","date":"July \u2013 August 2026","status":"upcoming"},
    {"event":"Fee Payment Deadline","date":"August 15, 2026","status":"upcoming"},
    {"event":"Classes Commence","date":"August 2026 (as per Anna University)","status":"upcoming"}
  ]$json$::jsonb,
  'admissions',
  'Important admission dates timeline',
  true
),

-- ── Scholarship Groups ────────────────────────────────────────────────────────
(
  'admissions_scholarship_groups',
  $json$[
    {
      "title": "Government Scholarships",
      "description": "Funded by Tamil Nadu and Central Government schemes, disbursed directly to student bank accounts. Our admissions office assists with the complete application process at no charge.",
      "schemes": [
        {"name":"BC / MBC / DNC Scholarship","benefit":"Full / partial tuition fee coverage","eligibility":"BC, MBC, and Denotified Communities as per TN Government norms"},
        {"name":"SC / ST Scholarship","benefit":"Full tuition fee + additional stipend","eligibility":"Scheduled Castes and Scheduled Tribes (State + Central)"},
        {"name":"Minority Scholarship (Central)","benefit":"Up to \u20b925,000 per year","eligibility":"Religious minority students with family income below \u20b92L"},
        {"name":"Post-Matric Scholarship (EBC)","benefit":"Partial tuition support","eligibility":"Economically Backward Classes with annual income below \u20b91L","ctaUrl":"https://www.scholarship.gov.in/"}
      ]
    },
    {
      "title": "Merit-Based Scholarships",
      "description": "Awarded by JKKN Institutions directly to high-achieving students. Applied automatically at the time of admission \u2014 no separate application required.",
      "schemes": [
        {"name":"District / State Rank Holder Scholarship","benefit":"Up to 100% tuition fee waiver","eligibility":"State board district or state rank holders in 10+2 examination"},
        {"name":"Academic Excellence Scholarship","benefit":"25% \u2013 50% tuition fee reduction","eligibility":"90%+ aggregate in qualifying examination"},
        {"name":"TNEA High-Rank Scholarship","benefit":"Up to 50% tuition fee reduction","eligibility":"TNEA cutoff score 190+ (combined PCM)"}
      ]
    },
    {
      "title": "Special Category Support",
      "description": "Dedicated support for students from specific backgrounds \u2014 sports achievers, NCC, and families with genuine financial need.",
      "schemes": [
        {"name":"Sports & Cultural Achievement","benefit":"Special seat quota + fee benefit","eligibility":"State / National level achievers (certificate from competent authority)"},
        {"name":"NCC / NSS Scholarship","benefit":"Fee concession up to \u20b910,000","eligibility":"Active NCC / NSS members with relevant participation certificate"},
        {"name":"Need-Based Financial Aid","benefit":"Up to 50% tuition fee reduction","eligibility":"Family annual income below \u20b92.5 lakhs (income certificate required)","ctaUrl":"/admissions#contact"}
      ]
    }
  ]$json$::jsonb,
  'admissions',
  'Scholarship groups with schemes — government, merit-based, and special category',
  true
),

-- ── FAQs ──────────────────────────────────────────────────────────────────────
(
  'admissions_faqs',
  $json$[
    {"question":"What is the application fee for engineering programmes?","answer":"There is no application fee. Apply online at the JKKN Admissions Portal or directly at the campus admissions office free of charge.","audience":"student"},
    {"question":"What is the eligibility for B.E / B.Tech admission?","answer":"You must have passed 10+2 with Physics, Chemistry and Mathematics with a minimum of 45% aggregate marks (40% for SC/ST/OBC reserved categories). Admission is through TNEA counselling or direct Management Quota.","audience":"student"},
    {"question":"Can I apply for multiple programmes with one application?","answer":"Yes. You may indicate your programme preference order during TNEA counselling. For Management Quota, contact the admissions office to check availability across programmes.","audience":"student"},
    {"question":"How does TNEA counselling work for engineering seats?","answer":"TNEA is conducted by Anna University. After registering on the TNEA portal, a merit rank is generated based on your 10+2 marks. You participate in online counselling, choose JKKN College of Engineering as your preferred college, and seats are allotted based on rank and availability.","audience":"student"},
    {"question":"Is it mandatory to appear for TNEA for UG admission?","answer":"For government quota seats, TNEA counselling is mandatory. However, Management Quota seats are available for direct admission \u2014 contact the admissions office for current availability.","audience":"student"},
    {"question":"Can I get admission after the last date?","answer":"Late applications may be considered subject to seat availability, especially under Management Quota. Contact the admissions office directly to check if seats are still open.","audience":"student"},
    {"question":"How are seats allocated for different categories?","answer":"Seats are allocated strictly as per Tamil Nadu Government and AICTE reservation norms: General, BC, MBC/DNC, SC/ST, and other categories. Sports, NCC, and Ex-serviceman quotas are also available as per government guidelines.","audience":"student"},
    {"question":"What documents are needed for B.E / B.Tech admission?","answer":"10th and 12th marksheets, Transfer Certificate, Community Certificate, 6 passport photos, Conduct Certificate, Aadhaar Card, TNEA Rank Card (for counselling seats), and Income Certificate (for scholarships). PG candidates additionally need Degree Certificate, consolidated marksheet, and entrance score card.","audience":"student"},
    {"question":"What is the total cost of education including hostel?","answer":"For B.E / B.Tech programs, annual tuition is \u20b995,000. Hostel accommodation (optional, all-inclusive with meals and utilities) is \u20b960,000 per year \u2014 total \u20b91,55,000 per year. Scholarships can significantly reduce tuition costs; approximately 75% of students receive some form of financial aid.","audience":"parent"},
    {"question":"What percentage of students get placed after graduation?","answer":"JKKN College of Engineering maintains a 92%+ placement rate (verified 2025). Top recruiters include TCS, Infosys, Wipro, Cognizant, HCL, and 500+ companies. Average package: \u20b93.5L per annum; highest: \u20b98.5L+.","audience":"parent"},
    {"question":"Is the campus safe? What are the hostel facilities?","answer":"The campus has 24/7 CCTV surveillance, security personnel, and controlled entry. Separate hostels for boys and girls include Wi-Fi, hygienic mess (3 meals/day), recreation areas, and health check-ups. An on-campus medical clinic is available at all times.","audience":"parent"},
    {"question":"Are there scholarships for financially weaker families?","answer":"Yes. Need-Based Financial Aid is available for families with annual income below \u20b92.5L \u2014 up to 50% tuition reduction. Government scholarships (SC/ST/OBC/MBC/EWS/Minority) are supported with direct bank transfer. Around 75% of students receive some form of financial aid.","audience":"parent"}
  ]$json$::jsonb,
  'admissions',
  'FAQs for students and parents — shown in the FAQ section',
  true
)

ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at    = now();

-- End of Engineering Admissions Dynamic Data Seed
-- ============================================
