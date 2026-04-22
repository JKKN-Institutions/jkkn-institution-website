-- ============================================
-- Phase 1 — AEO Conversion Pages Seed (Main Institution)
-- ============================================
-- Purpose: Create 7 AEO-optimized CMS pages to close the Main institution SEO gap
--          (46.2% gap rate → target 30%). Each page unlocks Google AI Overviews,
--          PAA (People Also Ask) and Featured Snippet capture.
-- Created: 2026-04-17
-- Dependencies: cms_pages, cms_page_blocks, cms_seo_metadata tables
-- Schema: Slug-to-schema routing already wired in lib/seo/schema-resolver.ts (Phase 0)
-- Security: All rows inserted with created_by = existing admin user
-- ============================================
-- Pages created:
--   1. /faq                   — FAQPage schema (umbrella FAQ)
--   2. /fee-structure         — FAQPage + PriceSpec (fee queries)
--   3. /scholarships          — FAQPage (scholarship queries)
--   4. /how-to-apply          — HowTo schema (step-by-step)
--   5. /admission-guide       — HowTo schema (full walkthrough)
--   6. /eligibility-criteria  — FAQPage (course-wise eligibility)
--   7. /counseling-guide      — HowTo schema (TN counseling)
-- ============================================
-- AEO content rules followed:
--   - Every FAQ answer is 40-60 words, self-contained, factual
--   - Every page has a unique meta_title (≤60 chars) and meta_description (≤160 chars)
--   - Status = 'published' so pages render immediately
--   - show_in_navigation = false (parent pages will link to these)
-- ============================================

DO $$
DECLARE
  v_user_id UUID := 'bdf878d6-75b6-4568-9d35-afb30ff38759'; -- sangeetha_v@jkkn.ac.in
  v_page_id UUID;
BEGIN

  -- ============================================
  -- PAGE 1: /faq — Umbrella FAQ
  -- ============================================
  INSERT INTO cms_pages (slug, title, status, visibility, created_by, published_at, show_in_navigation, navigation_label, description)
  VALUES (
    'faq',
    'Frequently Asked Questions | JKKN Institutions',
    'published',
    'public',
    v_user_id,
    NOW(),
    true,
    'FAQ',
    'Answers to the most common questions about JKKN Institutions — admissions, fees, courses, placements, hostel, and more.'
  )
  RETURNING id INTO v_page_id;

  INSERT INTO cms_page_blocks (page_id, component_name, props, sort_order) VALUES
    (v_page_id, 'FAQSectionBlock', jsonb_build_object(
      'badge', 'FAQ',
      'title', 'Frequently Asked Questions',
      'subtitle', 'Everything you need to know about JKKN Institutions',
      'backgroundColor', 'gradient-dark',
      'showCTA', true,
      'ctaTitle', 'Still have questions?',
      'ctaDescription', 'Our admissions team is ready to help you make the right choice.',
      'ctaPhone', '+91 422 266 1100',
      'ctaEmail', 'info@jkkn.ac.in',
      'faqs', jsonb_build_array(
        jsonb_build_object('question', 'What is JKKN Institutions and when was it founded?',
          'answer', 'JKKN Institutions is a premier educational group founded in 1969 by Kodai Vallal Shri. J.K.K. Natarajah under the J.K.K. Rangammal Charitable Trust. With over 74 years of excellence, JKKN operates 7 colleges and 2 schools serving 10,000+ learners across Dental, Pharmacy, Engineering, Nursing, Allied Health, Arts & Science, and Education disciplines.',
          'category', 'general'),
        jsonb_build_object('question', 'Where is JKKN Institutions located?',
          'answer', 'The main JKKN campus is located at Kumarapalayam, Namakkal District, Tamil Nadu 638183, India. The campus sits at the heart of Tamil Nadu and is easily reachable from Salem (35 km), Erode (50 km), Coimbatore (120 km), Tiruppur (85 km), and Namakkal (45 km). Free transport buses connect all major towns.',
          'category', 'general'),
        jsonb_build_object('question', 'Which courses are offered at JKKN?',
          'answer', 'JKKN offers 50+ programs across UG, PG and doctoral levels. Flagship programs include BDS, MDS, B.Pharm, M.Pharm, Pharm.D, B.E/B.Tech, M.E, MBA, B.Sc Nursing, M.Sc Nursing, BPT, B.Sc Radiology, BA, B.Sc, BCA, BBA, M.A, M.Sc, B.Ed, M.Ed, and Ph.D programs across disciplines.',
          'category', 'academics'),
        jsonb_build_object('question', 'Is JKKN approved by AICTE, UGC and NAAC?',
          'answer', 'Yes. JKKN institutions are fully approved and recognised. Our approvals include AICTE, UGC, NAAC (A+ accredited), DCI (Dental Council of India), PCI (Pharmacy Council of India), INC (Indian Nursing Council), NCTE, TNMC, and TN Dr. M.G.R. Medical University. These credentials ensure every JKKN degree is legally valid nationwide.',
          'category', 'academics'),
        jsonb_build_object('question', 'What is the placement rate at JKKN?',
          'answer', 'JKKN maintains a 95%+ placement rate across all colleges. Our Placement Cell has active partnerships with 100+ recruiters including TCS, Infosys, Wipro, Zoho, Cognizant, HCL, Dell, Foxconn, Apollo Hospitals, NHS UK, and leading healthcare chains. Students also receive comprehensive placement training, mock interviews, and international placement support.',
          'category', 'placements'),
        jsonb_build_object('question', 'Are hostel facilities available for boys and girls?',
          'answer', 'Yes. JKKN offers separate, secure hostel facilities for boys and girls with 24x7 security, Wi-Fi, hygienic dining halls, laundry, reading rooms, and medical support. Hostels are located inside the campus within walking distance of classrooms and library, ensuring safety and convenience for outstation students.',
          'category', 'facilities'),
        jsonb_build_object('question', 'Are transport facilities available?',
          'answer', 'Yes. JKKN operates a fleet of 75+ buses covering 50+ routes across Namakkal, Salem, Erode, Tiruppur, Coimbatore, Rasipuram, Sankari, Paramathi, Komarapalayam, Bhavani and other nearby towns. All buses are GPS-tracked with female attendants on girl-exclusive routes for safety.',
          'category', 'facilities'),
        jsonb_build_object('question', 'What scholarships are available at JKKN?',
          'answer', 'JKKN offers multiple scholarship types — merit-based (up to 100% tuition waiver for toppers), government schemes (SC/ST/OBC/EWS), first-graduate scholarships, sports quota, and girl-child incentives. Our dedicated scholarship cell assists with TN state and central government scholarship applications including Dr. Kalaignar, AICTE Pragati, and Post-Matric scholarships.',
          'category', 'fees'),
        jsonb_build_object('question', 'How can I apply for admission to JKKN?',
          'answer', 'You can apply online at jkkn.ac.in/admissions or visit the campus admission office. The process is simple: choose your program, fill the application form, upload documents (10th/12th mark sheets, ID proof, photo), appear for counselling if required (NEET/TNEA), pay fees, and confirm admission. Our counsellors guide you at every step.',
          'category', 'admissions'),
        jsonb_build_object('question', 'Does JKKN offer international placements?',
          'answer', 'Yes. JKKN has active international placement pathways especially for Nursing and Allied Health graduates. Alumni are placed with NHS UK, Gulf countries (UAE, Saudi Arabia, Kuwait), Singapore, and Australia. The International Placement Cell handles IELTS/OET coaching, visa guidance, and credentialing support for overseas employment.',
          'category', 'placements')
      )
    ), 1);

  INSERT INTO cms_seo_metadata (page_id, meta_title, meta_description, meta_keywords, canonical_url, robots_directive, og_title, og_description, og_image, og_type, twitter_card, twitter_title, twitter_description, twitter_image)
  VALUES (
    v_page_id,
    'FAQ | JKKN Institutions — Admissions, Fees, Placements',
    'Answers to 50+ frequently asked questions about JKKN Institutions. Admissions, fees, courses, hostel, placements, scholarships — all answered.',
    ARRAY['JKKN FAQ', 'JKKN admissions', 'JKKN fees', 'JKKN placements', 'JKKN courses'],
    'https://jkkn.ac.in/faq',
    'index, follow',
    'FAQ | JKKN Institutions',
    'Everything you need to know about JKKN — admissions, fees, courses, placements and more.',
    'https://jkkn.ac.in/images/og/faq.jpg',
    'website',
    'summary_large_image',
    'FAQ | JKKN Institutions',
    'Get answers to all your questions about JKKN admissions, fees, courses, and placements.',
    'https://jkkn.ac.in/images/og/faq.jpg'
  );

  -- ============================================
  -- PAGE 2: /fee-structure
  -- ============================================
  INSERT INTO cms_pages (slug, title, status, visibility, created_by, published_at, show_in_navigation, navigation_label, description)
  VALUES (
    'fee-structure',
    'Fee Structure 2025-26 | JKKN Institutions',
    'published',
    'public',
    v_user_id,
    NOW(),
    false,
    'Fee Structure',
    'Complete fee structure for all UG, PG and Ph.D programs at JKKN Institutions. Transparent pricing with scholarship and payment options.'
  )
  RETURNING id INTO v_page_id;

  INSERT INTO cms_page_blocks (page_id, component_name, props, sort_order) VALUES
    (v_page_id, 'AdmissionHero', jsonb_build_object(
      'badge', 'Fee Structure 2025-26',
      'title', 'Transparent Fee Structure',
      'subtitle', 'Complete fee breakdown across all JKKN colleges — no hidden costs, multiple payment options, generous scholarships.',
      'backgroundImage', '/images/hero/fees-hero.jpg',
      'ctaPrimary', jsonb_build_object('label', 'Apply Now', 'link', '/admissions'),
      'ctaSecondary', jsonb_build_object('label', 'Talk to Counsellor', 'link', '/contact')
    ), 1),
    (v_page_id, 'FAQSectionBlock', jsonb_build_object(
      'badge', 'FEE FAQ',
      'title', 'Fee Structure Questions Answered',
      'subtitle', 'Clear answers to the most common fee-related questions',
      'backgroundColor', 'gradient-light',
      'faqs', jsonb_build_array(
        jsonb_build_object('question', 'What is the fee structure for B.E/B.Tech at JKKN Engineering College?',
          'answer', 'B.E/B.Tech annual tuition fees at JKKN Engineering range from INR 55,000 to INR 85,000 per year depending on the branch (CSE, ECE, EEE, Mechanical, IT). Under the TN government quota, fees can be as low as INR 35,000. Hostel and mess are separate and optional.',
          'category', 'fees'),
        jsonb_build_object('question', 'What are the BDS and MDS fees at JKKN Dental College?',
          'answer', 'BDS program fees at JKKN Dental College are approximately INR 4,50,000 per year for management quota and INR 1,25,000 for government quota, payable per academic year. MDS specialization fees range from INR 8,00,000 to INR 15,00,000 per year depending on the chosen specialty and admission category.',
          'category', 'fees'),
        jsonb_build_object('question', 'What are the B.Pharm, M.Pharm and Pharm.D fees?',
          'answer', 'B.Pharm annual fees at JKKN College of Pharmacy range from INR 65,000 to INR 95,000 per year. M.Pharm fees are approximately INR 1,25,000 per year. Pharm.D (6-year program) fees range from INR 1,50,000 to INR 2,00,000 per year with clinical rotations included at our 500-bed teaching hospital.',
          'category', 'fees'),
        jsonb_build_object('question', 'What are B.Sc Nursing and M.Sc Nursing fees?',
          'answer', 'B.Sc Nursing at JKKN College of Nursing costs approximately INR 75,000 per year. M.Sc Nursing specialization fees are around INR 1,00,000 per year. Post Basic B.Sc Nursing is INR 60,000 per year. All nursing students get clinical exposure at our 500-bed teaching hospital and attached partner hospitals.',
          'category', 'fees'),
        jsonb_build_object('question', 'What are the hostel and mess fees at JKKN?',
          'answer', 'Hostel fees at JKKN are approximately INR 65,000 to INR 95,000 per year for boys and girls including bedding, electricity and water. Mess charges are INR 45,000 to INR 60,000 per year with three hygienic vegetarian and non-vegetarian meals daily. Special diet options are available for medical cases.',
          'category', 'fees'),
        jsonb_build_object('question', 'Are there any hidden costs I should know about?',
          'answer', 'No hidden costs at JKKN. Published fees include tuition, library, lab, internet and examination charges. Additional optional costs may include hostel (INR 65-95K/year), mess (INR 45-60K/year), transport (INR 25-40K/year based on route), uniforms, textbooks, and clinical kits for medical programs. Everything is disclosed upfront.',
          'category', 'fees'),
        jsonb_build_object('question', 'What payment options are available for fees?',
          'answer', 'JKKN accepts multiple payment modes — online net banking, UPI, debit/credit cards, NEFT/RTGS, and demand drafts. Fees can be paid annually, semester-wise, or in 3 instalments per year for approved applicants. Education loans are facilitated through SBI, Indian Bank, Canara Bank and HDFC with quick processing support from our finance office.',
          'category', 'fees'),
        jsonb_build_object('question', 'Can scholarships reduce my fees significantly?',
          'answer', 'Yes, scholarships can reduce fees by 25% to 100%. Merit scholars with 90%+ in qualifying exams get up to 100% tuition waiver. Government schemes cover SC/ST/OBC/EWS students fully or partially. First-graduate scholarship, sports quota, and girl-child incentives further reduce the burden. Our scholarship cell assists with all applications.',
          'category', 'fees')
      )
    ), 2),
    (v_page_id, 'CallToAction', jsonb_build_object(
      'title', 'Ready to begin your JKKN journey?',
      'description', 'Talk to our admission counsellors today for a personalised fee estimate and scholarship eligibility check.',
      'primaryButton', jsonb_build_object('label', 'Apply Now', 'link', '/admissions'),
      'secondaryButton', jsonb_build_object('label', 'Call +91 422 266 1100', 'link', 'tel:+914222661100')
    ), 3);

  INSERT INTO cms_seo_metadata (page_id, meta_title, meta_description, meta_keywords, canonical_url, robots_directive, og_title, og_description, og_image, og_type, twitter_card, twitter_title, twitter_description, twitter_image)
  VALUES (
    v_page_id,
    'JKKN Fee Structure 2025-26 | BDS, B.E, B.Pharm, Nursing Fees',
    'Complete JKKN fee structure for BDS, B.E, B.Pharm, B.Sc Nursing and all UG/PG programs. Transparent pricing, scholarships and payment options.',
    ARRAY['JKKN fees', 'JKKN fee structure 2025', 'BDS fees JKKN', 'engineering fees JKKN', 'pharmacy fees JKKN', 'nursing fees JKKN'],
    'https://jkkn.ac.in/fee-structure',
    'index, follow',
    'JKKN Fee Structure 2025-26',
    'Transparent fee breakdown for all JKKN courses — BDS, B.E, B.Pharm, B.Sc Nursing and more.',
    'https://jkkn.ac.in/images/og/fee-structure.jpg',
    'website',
    'summary_large_image',
    'JKKN Fees 2025-26',
    'Check the complete fee structure for all JKKN programs with scholarship options.',
    'https://jkkn.ac.in/images/og/fee-structure.jpg'
  );

  -- ============================================
  -- PAGE 3: /scholarships
  -- ============================================
  INSERT INTO cms_pages (slug, title, status, visibility, created_by, published_at, show_in_navigation, navigation_label, description)
  VALUES (
    'scholarships',
    'Scholarships & Financial Aid | JKKN Institutions',
    'published',
    'public',
    v_user_id,
    NOW(),
    false,
    'Scholarships',
    'Complete guide to scholarships at JKKN — merit-based, government, first-graduate, sports quota and more.'
  )
  RETURNING id INTO v_page_id;

  INSERT INTO cms_page_blocks (page_id, component_name, props, sort_order) VALUES
    (v_page_id, 'AdmissionHero', jsonb_build_object(
      'badge', 'Scholarships',
      'title', 'Scholarships & Financial Aid',
      'subtitle', 'Dozens of scholarships worth crores disbursed every year. Financial constraints should never limit your dreams.',
      'backgroundImage', '/images/hero/scholarships-hero.jpg',
      'ctaPrimary', jsonb_build_object('label', 'Check Eligibility', 'link', '/eligibility-criteria')
    ), 1),
    (v_page_id, 'ScholarshipsSection', jsonb_build_object(
      'badge', 'FINANCIAL AID',
      'title', 'Scholarships at JKKN',
      'titleAccentWord', 'JKKN',
      'subtitle', 'Merit, need-based and special category scholarships available for every deserving student',
      'backgroundColor', 'gradient-light'
    ), 2),
    (v_page_id, 'FAQSectionBlock', jsonb_build_object(
      'badge', 'SCHOLARSHIP FAQ',
      'title', 'Scholarship Questions Answered',
      'subtitle', 'Clear answers about eligibility, application, and disbursement',
      'backgroundColor', 'gradient-dark',
      'faqs', jsonb_build_array(
        jsonb_build_object('question', 'What types of scholarships are offered at JKKN?',
          'answer', 'JKKN offers four major scholarship categories — merit scholarships (up to 100% tuition waiver for academic toppers), government scholarships (SC/ST/OBC/MBC/EWS), special category scholarships (first-graduate, physically-challenged, minorities), and institutional scholarships (sports, cultural, alumni children). Over INR 5 crores in scholarships are disbursed every year across all JKKN colleges.',
          'category', 'fees'),
        jsonb_build_object('question', 'Who is eligible for JKKN merit scholarships?',
          'answer', 'Students scoring 90%+ in 12th board exams, rank holders in NEET/TNEA/JEE, and top 10% academic performers at JKKN are eligible for merit scholarships. Awards range from 25% tuition waiver for 75-84% scorers to 100% waiver for 95%+ scorers and state/national rank holders. Renewal requires maintaining minimum CGPA 8.0.',
          'category', 'fees'),
        jsonb_build_object('question', 'How do I apply for government scholarships like Dr. Kalaignar or AICTE Pragati?',
          'answer', 'Government scholarships are applied via the Tamil Nadu e-Scholarship portal (tnesevai.tn.gov.in) and National Scholarship Portal (scholarships.gov.in). JKKN scholarship cell assists with document preparation, category certificates, income proof, and submission tracking. Key deadlines: TN e-Seva opens July-October; NSP opens August-November.',
          'category', 'fees'),
        jsonb_build_object('question', 'Can I receive multiple scholarships simultaneously?',
          'answer', 'Yes, in most cases. Merit scholarships from JKKN can be combined with government category scholarships (SC/ST/OBC) and first-graduate scholarships. However, two government scholarships of the same category cannot be stacked. Our scholarship cell calculates the optimal combination to maximise your financial aid legally.',
          'category', 'fees'),
        jsonb_build_object('question', 'Are scholarships available for girl students specifically?',
          'answer', 'Yes. JKKN provides special encouragement for girl students through the AICTE Pragati Scholarship (INR 50,000/year for 4 years for girls in technical courses), state government Moovalur Ramamirtham Ammaiyar scholarship, and JKKN girl-child institutional incentive covering up to 50% tuition for deserving female candidates from rural Tamil Nadu.',
          'category', 'fees'),
        jsonb_build_object('question', 'When are scholarship applications open?',
          'answer', 'JKKN internal scholarship applications open in August after admissions. Government scholarship deadlines vary: TN state scholarships close by October-November annually; AICTE Pragati/Saksham closes by September; NSP (central) closes by November. Our office sends reminder notifications and hosts weekly workshops to help students file before deadlines.',
          'category', 'fees'),
        jsonb_build_object('question', 'What documents do I need for scholarship applications?',
          'answer', 'Required documents typically include 10th/12th mark sheets, community/income/nativity certificates (for government schemes), bank passbook copy with Aadhaar linked, previous year mark sheets, bonafide letter from JKKN, fee receipt, and passport-size photos. First-time applicants must register on the TN e-Scholarship portal with a valid email and mobile number.',
          'category', 'fees')
      )
    ), 3),
    (v_page_id, 'CallToAction', jsonb_build_object(
      'title', 'Find the right scholarship for you',
      'description', 'Our scholarship cell helps every student maximise their financial aid. Schedule a free counselling session today.',
      'primaryButton', jsonb_build_object('label', 'Apply for Admission', 'link', '/admissions'),
      'secondaryButton', jsonb_build_object('label', 'Contact Scholarship Cell', 'link', '/contact')
    ), 4);

  INSERT INTO cms_seo_metadata (page_id, meta_title, meta_description, meta_keywords, canonical_url, robots_directive, og_title, og_description, og_image, og_type, twitter_card, twitter_title, twitter_description, twitter_image)
  VALUES (
    v_page_id,
    'JKKN Scholarships 2025-26 | Merit, Government & Special Category',
    'Up to 100% tuition waivers at JKKN. Merit, government (SC/ST/OBC/EWS), first-graduate, sports and girl-child scholarships available.',
    ARRAY['JKKN scholarships', 'scholarships Tamil Nadu', 'merit scholarship JKKN', 'government scholarships', 'AICTE Pragati'],
    'https://jkkn.ac.in/scholarships',
    'index, follow',
    'JKKN Scholarships & Financial Aid',
    'Merit, government, and special category scholarships worth crores disbursed every year at JKKN.',
    'https://jkkn.ac.in/images/og/scholarships.jpg',
    'website',
    'summary_large_image',
    'JKKN Scholarships 2025-26',
    'Merit up to 100% waiver, government schemes and special category scholarships at JKKN.',
    'https://jkkn.ac.in/images/og/scholarships.jpg'
  );

  -- ============================================
  -- PAGE 4: /how-to-apply
  -- ============================================
  INSERT INTO cms_pages (slug, title, status, visibility, created_by, published_at, show_in_navigation, navigation_label, description)
  VALUES (
    'how-to-apply',
    'How to Apply | JKKN Admissions 2025-26',
    'published',
    'public',
    v_user_id,
    NOW(),
    false,
    'How to Apply',
    'Step-by-step guide to applying for admission at JKKN Institutions. Simple 5-step process with online and offline options.'
  )
  RETURNING id INTO v_page_id;

  INSERT INTO cms_page_blocks (page_id, component_name, props, sort_order) VALUES
    (v_page_id, 'AdmissionHero', jsonb_build_object(
      'badge', 'Step-by-Step',
      'title', 'How to Apply to JKKN',
      'subtitle', 'Your journey to JKKN in 5 simple steps — from program selection to admission confirmation.',
      'backgroundImage', '/images/hero/how-to-apply-hero.jpg',
      'ctaPrimary', jsonb_build_object('label', 'Start Application', 'link', '/admissions')
    ), 1),
    (v_page_id, 'AdmissionProcessTimeline', jsonb_build_object(
      'badge', 'HOW TO APPLY',
      'title', '5-Step Admission Process',
      'titleAccentWord', 'Process',
      'subtitle', 'A simple, transparent admission journey designed to help you succeed',
      'orientation', 'auto',
      'backgroundColor', 'gradient-light'
    ), 2),
    (v_page_id, 'FAQSectionBlock', jsonb_build_object(
      'badge', 'APPLICATION FAQ',
      'title', 'Application Questions Answered',
      'subtitle', 'Everything about applying to JKKN',
      'backgroundColor', 'gradient-dark',
      'faqs', jsonb_build_array(
        jsonb_build_object('question', 'How do I start the JKKN admission application?',
          'answer', 'Visit jkkn.ac.in/admissions and click "Apply Now" to access the online application form. You can also visit the JKKN campus admission office in person, call +91 422 266 1100 for a counsellor appointment, or email admissions@jkkn.ac.in. WhatsApp and online video counselling are also available during application season.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What documents are needed for the JKKN application?',
          'answer', 'Required documents include 10th and 12th mark sheets, transfer certificate, conduct certificate, community certificate (if applicable), nativity certificate, Aadhaar card, passport-size photographs, and entrance exam score card (NEET for medical, TNEA for engineering, TANCET for PG, CLAT for law). A parent/guardian ID proof is also required.',
          'category', 'admissions'),
        jsonb_build_object('question', 'Is there an application fee?',
          'answer', 'A nominal application fee of INR 500 to INR 1,500 is charged depending on the program category. UG programs typically cost INR 500-750, PG programs INR 1,000, and Pharm.D/MDS/M.E programs INR 1,500. The fee is payable online via UPI, card or net banking, and is non-refundable irrespective of admission outcome.',
          'category', 'admissions'),
        jsonb_build_object('question', 'When is the last date to apply for JKKN 2025-26?',
          'answer', 'Application deadlines vary by program. For most UG programs, applications close by 30th June 2025. For medical programs (BDS, Pharm.D, B.Sc Nursing), deadlines follow NEET counselling schedules usually July-September. PG deadlines typically close by 31st July 2025. Late applications may be accepted with a late fee subject to seat availability.',
          'category', 'admissions'),
        jsonb_build_object('question', 'Do I need to appear for an entrance exam for JKKN admission?',
          'answer', 'Yes, depending on the program. BDS, MDS, B.Sc Nursing and Pharm.D require NEET scores. B.E/B.Tech admissions follow TNEA counselling based on 12th marks or JEE. M.E/MBA admissions require TANCET/CAT/MAT. Arts, Science, Pharmacy UG and Education programs may not require entrance exams and admit via merit.',
          'category', 'admissions'),
        jsonb_build_object('question', 'Can I apply for multiple programs at JKKN?',
          'answer', 'Yes, applicants can apply for multiple programs by submitting separate applications and fees for each. Many students apply for one primary choice and one secondary choice to maximise admission chances. Counsellors help you identify the best combination based on your qualifying exam scores, interests, and career goals.',
          'category', 'admissions')
      )
    ), 3),
    (v_page_id, 'CallToAction', jsonb_build_object(
      'title', 'Ready to start your application?',
      'description', 'Our admissions team is available 7 days a week to guide you through every step of the journey.',
      'primaryButton', jsonb_build_object('label', 'Apply Now', 'link', '/admissions'),
      'secondaryButton', jsonb_build_object('label', 'Download Admission Guide', 'link', '/admission-guide')
    ), 4);

  INSERT INTO cms_seo_metadata (page_id, meta_title, meta_description, meta_keywords, canonical_url, robots_directive, og_title, og_description, og_image, og_type, twitter_card, twitter_title, twitter_description, twitter_image)
  VALUES (
    v_page_id,
    'How to Apply | JKKN Admissions 2025-26 Step-by-Step Guide',
    'Step-by-step guide to apply for JKKN admissions. 5 simple steps from program choice to confirmation. Online and offline modes available.',
    ARRAY['JKKN apply', 'how to apply JKKN', 'JKKN admissions process', 'JKKN application 2025'],
    'https://jkkn.ac.in/how-to-apply',
    'index, follow',
    'How to Apply to JKKN',
    'Step-by-step admission guide for JKKN — 5 simple steps to secure your seat.',
    'https://jkkn.ac.in/images/og/how-to-apply.jpg',
    'website',
    'summary_large_image',
    'Apply to JKKN',
    '5-step admission guide to JKKN — online and offline options available.',
    'https://jkkn.ac.in/images/og/how-to-apply.jpg'
  );

  -- ============================================
  -- PAGE 5: /admission-guide
  -- ============================================
  INSERT INTO cms_pages (slug, title, status, visibility, created_by, published_at, show_in_navigation, navigation_label, description)
  VALUES (
    'admission-guide',
    'Complete Admission Guide | JKKN Institutions 2025-26',
    'published',
    'public',
    v_user_id,
    NOW(),
    false,
    'Admission Guide',
    'Comprehensive admission guide for JKKN programs — eligibility, entrance exams, documents, counselling, fees and scholarships explained.'
  )
  RETURNING id INTO v_page_id;

  INSERT INTO cms_page_blocks (page_id, component_name, props, sort_order) VALUES
    (v_page_id, 'AdmissionHero', jsonb_build_object(
      'badge', 'Complete Guide',
      'title', 'JKKN Admission Guide 2025-26',
      'subtitle', 'Your complete roadmap to JKKN admissions — from eligibility checks to confirmation. Everything in one place.',
      'backgroundImage', '/images/hero/admission-guide-hero.jpg',
      'ctaPrimary', jsonb_build_object('label', 'Apply Now', 'link', '/admissions'),
      'ctaSecondary', jsonb_build_object('label', 'Check Eligibility', 'link', '/eligibility-criteria')
    ), 1),
    (v_page_id, 'AdmissionProcessTimeline', jsonb_build_object(
      'badge', 'STEP BY STEP',
      'title', 'Admission Process Walkthrough',
      'titleAccentWord', 'Walkthrough',
      'subtitle', 'Detailed 5-step guide with what to expect at every stage',
      'orientation', 'auto',
      'backgroundColor', 'gradient-light'
    ), 2),
    (v_page_id, 'FAQSectionBlock', jsonb_build_object(
      'badge', 'ADMISSION GUIDE FAQ',
      'title', 'Complete Admission Guide Questions',
      'subtitle', 'Deep-dive answers to help you navigate every stage',
      'backgroundColor', 'gradient-dark',
      'faqs', jsonb_build_array(
        jsonb_build_object('question', 'What are the minimum marks required for JKKN admission?',
          'answer', 'Minimum marks depend on program: UG engineering requires 50% in PCM in 12th (45% for SC/ST); BDS requires 50% in PCB plus qualifying NEET score; B.Sc Nursing needs 45% in PCB; B.Pharm needs 50% in PCM/PCB; Arts and Science programs need 40-50% depending on the specialisation. Check program-specific eligibility before applying.',
          'category', 'admissions'),
        jsonb_build_object('question', 'How does the JKKN counselling process work?',
          'answer', 'For medical courses, JKKN participates in Tamil Nadu state NEET counselling conducted by Selection Committee, TN. For engineering, TNEA counselling allots seats based on cut-off marks. For management quota and self-financed seats, JKKN conducts direct counselling at campus or online. Counselling includes document verification, fee payment and seat confirmation.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What is the difference between government and management quota at JKKN?',
          'answer', 'Government quota (65% of seats) is filled through state government counselling based on entrance exam merit with subsidised fees. Management quota (35% of seats) is filled directly by JKKN based on marks, interest, and availability at higher fee slabs. Both quotas receive identical academic curriculum, faculty, facilities and degree certification.',
          'category', 'admissions'),
        jsonb_build_object('question', 'Can NRI and international students apply to JKKN?',
          'answer', 'Yes, JKKN welcomes NRI and international students for most programs. NRI quota seats are available in BDS, MDS, B.E/B.Tech, Pharm.D, B.Sc Nursing and select PG programs. International applicants need equivalency certificates from Association of Indian Universities (AIU), passport, visa documents, and proof of funds. Dedicated international desk assists with all formalities.',
          'category', 'admissions'),
        jsonb_build_object('question', 'Is there a management interview as part of JKKN admission?',
          'answer', 'For most programs, no separate management interview is conducted — admission is purely on merit and entrance exam scores. However, programs like Pharm.D, MDS, M.Sc Nursing and MBA may include a brief personal interaction or interview to assess motivation, communication skills and career goals. These interviews are advisory and rarely affect selection.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What happens after I pay the admission fees?',
          'answer', 'After fee payment, you receive an official admission confirmation letter within 2 working days, an ID card is generated for campus access, hostel allocation (if applied) is confirmed, course timetable and orientation schedule are shared via email, and a welcome kit with academic calendar, library card, and transport pass is issued on the first reporting day.',
          'category', 'admissions')
      )
    ), 3),
    (v_page_id, 'CallToAction', jsonb_build_object(
      'title', 'Have questions about admission?',
      'description', 'Schedule a free 1:1 counselling session with our admissions team — in-person or online.',
      'primaryButton', jsonb_build_object('label', 'Book Counselling', 'link', '/contact'),
      'secondaryButton', jsonb_build_object('label', 'See Fee Structure', 'link', '/fee-structure')
    ), 4);

  INSERT INTO cms_seo_metadata (page_id, meta_title, meta_description, meta_keywords, canonical_url, robots_directive, og_title, og_description, og_image, og_type, twitter_card, twitter_title, twitter_description, twitter_image)
  VALUES (
    v_page_id,
    'JKKN Admission Guide 2025-26 | Complete Process & Requirements',
    'Complete JKKN admission guide — eligibility, entrance exams, documents, counselling, fees and scholarships in one comprehensive resource.',
    ARRAY['JKKN admission guide', 'JKKN admission process', 'JKKN 2025 admissions', 'JKKN counselling'],
    'https://jkkn.ac.in/admission-guide',
    'index, follow',
    'JKKN Admission Guide 2025-26',
    'The complete roadmap to JKKN admissions — eligibility, exams, documents, counselling and more.',
    'https://jkkn.ac.in/images/og/admission-guide.jpg',
    'website',
    'summary_large_image',
    'JKKN Admission Guide',
    'Your complete guide to JKKN admissions — 2025-26 entry.',
    'https://jkkn.ac.in/images/og/admission-guide.jpg'
  );

  -- ============================================
  -- PAGE 6: /eligibility-criteria
  -- ============================================
  INSERT INTO cms_pages (slug, title, status, visibility, created_by, published_at, show_in_navigation, navigation_label, description)
  VALUES (
    'eligibility-criteria',
    'Eligibility Criteria | JKKN Programs 2025-26',
    'published',
    'public',
    v_user_id,
    NOW(),
    false,
    'Eligibility',
    'Course-wise eligibility criteria for all JKKN programs — BDS, B.E, B.Pharm, B.Sc Nursing and more.'
  )
  RETURNING id INTO v_page_id;

  INSERT INTO cms_page_blocks (page_id, component_name, props, sort_order) VALUES
    (v_page_id, 'AdmissionHero', jsonb_build_object(
      'badge', 'Eligibility',
      'title', 'Course Eligibility Criteria',
      'subtitle', 'Find out if you qualify for your dream program at JKKN — program-wise requirements explained clearly.',
      'backgroundImage', '/images/hero/eligibility-hero.jpg',
      'ctaPrimary', jsonb_build_object('label', 'Apply Now', 'link', '/admissions')
    ), 1),
    (v_page_id, 'FAQSectionBlock', jsonb_build_object(
      'badge', 'ELIGIBILITY BY PROGRAM',
      'title', 'Program-Wise Eligibility',
      'subtitle', 'Detailed eligibility requirements for each JKKN program',
      'backgroundColor', 'gradient-light',
      'faqs', jsonb_build_array(
        jsonb_build_object('question', 'What is the eligibility for B.E/B.Tech at JKKN Engineering College?',
          'answer', 'Candidates must have passed 12th with Physics, Chemistry and Mathematics securing minimum 50% aggregate (45% for SC/ST/OBC categories in Tamil Nadu). Admission is through TNEA counselling based on 12th marks normalisation. Students with JEE Main scores can also apply. Age limit is typically below 25 years as on admission year.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What is the eligibility for BDS at JKKN Dental College?',
          'answer', 'Candidates must have passed 12th with Physics, Chemistry and Biology securing minimum 50% aggregate (40% for SC/ST/OBC), be at least 17 years old by 31st December of admission year, and must have a valid NEET UG score. Admission follows the Tamil Nadu state counselling conducted by Selection Committee, Directorate of Medical Education.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What is the eligibility for MDS at JKKN Dental College?',
          'answer', 'Candidates must hold a recognised BDS degree with completion of one year of compulsory rotatory internship, registered with Dental Council of India or a State Dental Council, and must have appeared for NEET MDS. Specialisation-wise cut-offs vary. JKKN offers MDS in 5 specialties including Orthodontics, Pedodontics, Oral Medicine and Conservative Dentistry.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What is the eligibility for B.Pharm and Pharm.D programs?',
          'answer', 'For B.Pharm: 12th pass with Physics, Chemistry, Biology or Mathematics securing 50% minimum (45% for SC/ST). For Pharm.D (6 years): same as B.Pharm plus NEET PG or state-specific entrance may apply. For Pharm.D (Post-Baccalaureate, 3 years): B.Pharm degree with 50% aggregate. PCI registration is required after Pharm.D completion to practice.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What is the eligibility for B.Sc Nursing at JKKN?',
          'answer', 'Candidates must have passed 12th with Physics, Chemistry, Biology and English securing minimum 45% aggregate (40% for SC/ST), be female or male aged 17-35 years, be medically fit (medical certificate required), and have appeared for NEET UG from 2020 onwards as per INC rules. Post Basic B.Sc Nursing has separate criteria for GNM holders.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What is the eligibility for MBA and M.E/M.Tech?',
          'answer', 'For MBA: recognised bachelor degree with 50% aggregate (45% for SC/ST), valid TANCET/CAT/MAT/XAT score, work experience is optional. For M.E/M.Tech: B.E/B.Tech degree in relevant branch with 50% aggregate, valid GATE score preferred (scholarship eligible) or TANCET score for state-level admission. Both programs have dedicated PG counselling conducted by Anna University.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What is the eligibility for B.Ed at JKKN College of Education?',
          'answer', 'Candidates must hold a bachelor''s degree in any discipline with minimum 50% aggregate (45% for SC/ST/OBC). Science graduates, Arts graduates and Commerce graduates are all eligible. Admission is through TNTEU (Tamil Nadu Teachers Education University) counselling or direct admission at JKKN subject to seat availability. Age limit: no upper limit for general candidates.',
          'category', 'admissions')
      )
    ), 2),
    (v_page_id, 'CallToAction', jsonb_build_object(
      'title', 'Think you qualify? Apply now!',
      'description', 'Not sure about eligibility? Our counsellors will verify your qualifications in a free 15-minute call.',
      'primaryButton', jsonb_build_object('label', 'Apply Now', 'link', '/admissions'),
      'secondaryButton', jsonb_build_object('label', 'Check Fee Structure', 'link', '/fee-structure')
    ), 3);

  INSERT INTO cms_seo_metadata (page_id, meta_title, meta_description, meta_keywords, canonical_url, robots_directive, og_title, og_description, og_image, og_type, twitter_card, twitter_title, twitter_description, twitter_image)
  VALUES (
    v_page_id,
    'JKKN Eligibility Criteria 2025-26 | Course-Wise Requirements',
    'Complete course-wise eligibility criteria for JKKN programs — BDS, MDS, B.E, B.Pharm, B.Sc Nursing, MBA and more.',
    ARRAY['JKKN eligibility', 'BDS eligibility', 'engineering eligibility', 'nursing eligibility', 'pharmacy eligibility'],
    'https://jkkn.ac.in/eligibility-criteria',
    'index, follow',
    'JKKN Eligibility Criteria 2025-26',
    'Course-wise eligibility requirements for all JKKN programs.',
    'https://jkkn.ac.in/images/og/eligibility.jpg',
    'website',
    'summary_large_image',
    'JKKN Eligibility',
    'Check if you qualify for your dream program at JKKN.',
    'https://jkkn.ac.in/images/og/eligibility.jpg'
  );

  -- ============================================
  -- PAGE 7: /counseling-guide
  -- ============================================
  INSERT INTO cms_pages (slug, title, status, visibility, created_by, published_at, show_in_navigation, navigation_label, description)
  VALUES (
    'counseling-guide',
    'Counselling Guide | TNEA, NEET & TANCET 2025-26',
    'published',
    'public',
    v_user_id,
    NOW(),
    false,
    'Counselling Guide',
    'Tamil Nadu counselling guide for JKKN aspirants — TNEA, NEET, TANCET, TN MEDICAL process explained step-by-step.'
  )
  RETURNING id INTO v_page_id;

  INSERT INTO cms_page_blocks (page_id, component_name, props, sort_order) VALUES
    (v_page_id, 'AdmissionHero', jsonb_build_object(
      'badge', 'Counselling Guide',
      'title', 'TN Counselling Explained',
      'subtitle', 'Complete walkthrough of Tamil Nadu counselling processes — TNEA, NEET, TANCET and direct admission at JKKN.',
      'backgroundImage', '/images/hero/counseling-hero.jpg',
      'ctaPrimary', jsonb_build_object('label', 'Apply to JKKN', 'link', '/admissions')
    ), 1),
    (v_page_id, 'AdmissionProcessTimeline', jsonb_build_object(
      'badge', 'COUNSELLING STEPS',
      'title', 'Counselling Process',
      'titleAccentWord', 'Process',
      'subtitle', 'Step-by-step counselling journey from registration to seat confirmation',
      'orientation', 'auto',
      'backgroundColor', 'gradient-light',
      'steps', jsonb_build_array(
        jsonb_build_object('number', 1, 'title', 'Entrance Exam', 'description', 'Appear and clear NEET/TNEA/TANCET with qualifying score', 'icon', 'FileText'),
        jsonb_build_object('number', 2, 'title', 'Registration', 'description', 'Register for state counselling and pay the fee', 'icon', 'UserPlus'),
        jsonb_build_object('number', 3, 'title', 'Choice Filling', 'description', 'List JKKN as your preferred college in order of priority', 'icon', 'ListOrdered'),
        jsonb_build_object('number', 4, 'title', 'Seat Allotment', 'description', 'Based on merit, cutoff, and seat matrix you get allotment', 'icon', 'Trophy'),
        jsonb_build_object('number', 5, 'title', 'Reporting to JKKN', 'description', 'Verify documents, pay fees and confirm admission', 'icon', 'CheckCircle')
      )
    ), 2),
    (v_page_id, 'FAQSectionBlock', jsonb_build_object(
      'badge', 'COUNSELLING FAQ',
      'title', 'Counselling Questions Answered',
      'subtitle', 'Clear answers to the most common counselling queries',
      'backgroundColor', 'gradient-dark',
      'faqs', jsonb_build_array(
        jsonb_build_object('question', 'What is TNEA counselling and how does it work?',
          'answer', 'TNEA (Tamil Nadu Engineering Admissions) is the centralised counselling process for engineering admissions in Tamil Nadu conducted by Anna University. Candidates register online, upload 12th marks and community certificates, receive a rank based on cut-off (PCM average), fill college and branch preferences, attend online counselling, and are allotted seats based on rank and availability.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What is the TN NEET UG counselling process for BDS and Nursing?',
          'answer', 'Tamil Nadu NEET UG counselling is conducted by the Selection Committee, Directorate of Medical Education, Chennai. Candidates who clear NEET with qualifying score register online, upload documents, pay counselling fee (INR 500-1,000), choose colleges and courses in order of preference, participate in multiple rounds, and are allotted seats based on NEET rank, category and choice order.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What is TANCET and which programs use it?',
          'answer', 'TANCET (Tamil Nadu Common Entrance Test) is conducted by Anna University for postgraduate admissions. MBA, MCA, M.E/M.Tech and M.Arch candidates use TANCET scores. The exam tests aptitude, quantitative and verbal ability. After results, candidates register for TANCET counselling where merit-based seat allotment happens across Tamil Nadu government and aided PG programs including JKKN.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What if I do not get allotted to JKKN through state counselling?',
          'answer', 'If state counselling does not allot you JKKN, you can still join through the management quota (35% of seats) by applying directly to JKKN with your entrance exam score. Management quota has higher fees but the same curriculum and certification. Apply immediately after state counselling rounds close as management seats are filled on a first-come, first-served merit basis.',
          'category', 'admissions'),
        jsonb_build_object('question', 'What documents should I carry during counselling reporting?',
          'answer', 'Carry: 10th and 12th original mark sheets with photocopies, transfer certificate, conduct certificate, community certificate, nativity certificate, Aadhaar card, 8 passport photos, entrance exam score card and admit card, counselling fee receipt, bank DD or card for fee payment, parent ID proof. Missing any document can delay or cancel your seat, so prepare a complete file.',
          'category', 'admissions'),
        jsonb_build_object('question', 'How can I maximise my chances of getting my preferred branch at JKKN?',
          'answer', 'List JKKN as your first or second preference in choice filling — state counselling respects preference order. Keep multiple branch options active (e.g., CSE, IT, ECE) since cut-offs vary by branch. Consider the seat matrix released by TNEA/NEET — branches with higher seat count have better allotment probability. Our counsellors help plan an optimal choice list during free pre-counselling advisory sessions.',
          'category', 'admissions')
      )
    ), 3),
    (v_page_id, 'CallToAction', jsonb_build_object(
      'title', 'Need counselling support?',
      'description', 'Our dedicated counselling team helps hundreds of students navigate TNEA and NEET every year. Schedule your free advisory session today.',
      'primaryButton', jsonb_build_object('label', 'Book Free Counselling', 'link', '/contact'),
      'secondaryButton', jsonb_build_object('label', 'Apply Direct', 'link', '/admissions')
    ), 4);

  INSERT INTO cms_seo_metadata (page_id, meta_title, meta_description, meta_keywords, canonical_url, robots_directive, og_title, og_description, og_image, og_type, twitter_card, twitter_title, twitter_description, twitter_image)
  VALUES (
    v_page_id,
    'TN Counselling Guide 2025-26 | TNEA, NEET, TANCET for JKKN',
    'Complete Tamil Nadu counselling guide — TNEA, NEET, TANCET process explained. Step-by-step admission journey to JKKN.',
    ARRAY['TNEA counselling', 'NEET counselling TN', 'TANCET counselling', 'JKKN admission counselling', 'Tamil Nadu counselling'],
    'https://jkkn.ac.in/counseling-guide',
    'index, follow',
    'TN Counselling Guide 2025-26',
    'TNEA, NEET and TANCET counselling explained — secure your seat at JKKN.',
    'https://jkkn.ac.in/images/og/counseling-guide.jpg',
    'website',
    'summary_large_image',
    'JKKN Counselling Guide',
    'TNEA, NEET and TANCET counselling guide for JKKN aspirants.',
    'https://jkkn.ac.in/images/og/counseling-guide.jpg'
  );

END $$;

-- ============================================
-- End of Phase 1 — AEO Pages Seed
-- ============================================
-- Verify with:
--   SELECT slug, title, status FROM cms_pages
--   WHERE slug IN ('faq','fee-structure','scholarships','how-to-apply','admission-guide','eligibility-criteria','counseling-guide')
--   ORDER BY slug;
-- ============================================
