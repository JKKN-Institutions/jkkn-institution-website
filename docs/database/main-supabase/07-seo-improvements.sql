-- ============================================
-- SEO IMPROVEMENTS: Unified SEO/GEO/AEO Audit Fixes
-- ============================================
-- Purpose: Fix SEO issues identified in the 2026-03-15 Unified SEO Audit
--          Addresses critical findings C5, C7, C8, W1, W2
-- Created: 2026-03-20
-- Applied to: Main Supabase (pmqodbfhsejbvfbmsfeq)
--             Engineering Supabase (kyvfkyjmdbtyimtedkie)
-- Impact: Page titles, meta descriptions, site settings, SEO metadata
-- Reference: docs/seo/26-03-15-JKKN-Unified-SEO-GEO-AEO-Audit.md
-- ============================================

-- ===========================================
-- MAIN SUPABASE: cms_seo_metadata fixes
-- ===========================================

-- C5: Fix "Vission" typo in vision-and-mission page meta title
-- Also add missing meta description
UPDATE cms_seo_metadata SET
  meta_title = 'Vision and Mission | JKKN Institutions — Our Educational Philosophy',
  meta_description = 'Discover the vision and mission of JKKN Institutions. Established in 1952, JKKN is committed to providing quality education, fostering innovation, and building future-ready professionals in Tamil Nadu.'
WHERE page_id = (SELECT id FROM cms_pages WHERE slug = 'vision-and-mission' LIMIT 1);

-- W1/W2: Fix 1-2 word titles and missing meta descriptions on key pages
-- Pattern: [Topic] | JKKN [Institution] — [Benefit/Location]

UPDATE cms_seo_metadata SET
  meta_title = 'About JKKN Institutions — Premier College Group Since 1952',
  meta_description = 'Learn about JKKN Institutions, a premier educational group near Erode with 74+ years of excellence. 7 colleges, 50+ programs, 50,000+ alumni, NAAC accredited. Located in Komarapalayam, Tamil Nadu.',
  og_title = 'About JKKN Institutions — Premier College Group Since 1952'
WHERE page_id = (SELECT id FROM cms_pages WHERE slug = 'about' LIMIT 1);

UPDATE cms_seo_metadata SET
  meta_title = 'Contact JKKN Institutions — Admissions & Enquiry',
  meta_description = 'Contact JKKN Institutions for admissions, campus visits, and enquiries. Located on NH-544, Komarapalayam, 15 km from Erode. Call +91-9345855001 or email info@jkkn.ac.in.',
  og_title = 'Contact JKKN Institutions — Admissions & Enquiry'
WHERE page_id = (SELECT id FROM cms_pages WHERE slug = 'contact' LIMIT 1);

UPDATE cms_seo_metadata SET
  meta_title = 'Courses Offered at JKKN Institutions — 50+ Programs',
  meta_description = 'Explore 50+ career-focused courses at JKKN Institutions near Erode: Dental (BDS/MDS), Pharmacy (B.Pharm/M.Pharm), Engineering (B.E./B.Tech), Nursing, Allied Health Sciences, Arts & Science, Education.',
  og_title = 'Courses Offered at JKKN Institutions — 50+ Programs'
WHERE page_id = (SELECT id FROM cms_pages WHERE slug = 'courses-offered' LIMIT 1);

UPDATE cms_seo_metadata SET
  meta_title = 'Engineering Courses at JKKN — B.E., B.Tech, MBA Programs',
  meta_description = 'Explore engineering courses at JKKN College of Engineering: B.E. CSE, ECE, EEE, Mechanical, B.Tech IT, M.E. CSE, MBA. AICTE approved, Anna University affiliated. 95%+ placement rate.',
  og_title = 'Engineering Courses at JKKN — B.E., B.Tech, MBA Programs'
WHERE page_id = (SELECT id FROM cms_pages WHERE slug = 'engineering-courses' LIMIT 1);

-- Placements page: insert or update
INSERT INTO cms_seo_metadata (page_id, meta_title, meta_description, og_title, robots_directive)
SELECT id,
  'Campus Placements at JKKN — 95%+ Success Rate, 100+ Recruiters',
  'JKKN Institutions placement record: 95%+ placement rate, highest package ₹12 LPA, 100+ recruiting companies including TCS, Infosys, Wipro, Cognizant, Amazon.',
  'Campus Placements at JKKN — 95%+ Success Rate, 100+ Recruiters',
  'index, follow'
FROM cms_pages WHERE slug = 'placements'
ON CONFLICT (page_id) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  og_title = EXCLUDED.og_title;

-- ===========================================
-- MAIN SUPABASE: site_settings fixes
-- ===========================================

-- C7: Fix founding date "1975" → "1952" in site settings
UPDATE site_settings SET setting_value = '"Excellence in Education since 1952"'
WHERE setting_key = 'site_description' AND category = 'general';

UPDATE site_settings SET setting_value = '"JKKN Group of Institutions - A leading educational institution in Tamil Nadu offering quality education since 1952. NAAC accredited with 50,000+ alumni worldwide."'
WHERE setting_key = 'default_meta_description' AND category = 'seo';

-- C8: Fix streetAddress (was org name, now actual street)
UPDATE site_settings SET setting_value = '{"line1": "Natarajapuram, NH-544 (Salem To Coimbatore National Highway),", "line2": "Komarapalayam (TK),", "city": "Namakkal (DT),", "state": "Tamil Nadu", "country": "India", "pincode": "638183"}'::jsonb
WHERE setting_key = 'address' AND category = 'general';

-- Populate analytics IDs (were empty)
UPDATE site_settings SET setting_value = '"G-CHXSXSC9YY"'
WHERE setting_key = 'google_analytics_id' AND category = 'seo';

-- Add new SEO settings
INSERT INTO site_settings (id, setting_key, setting_value, category, description, is_public, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'google_site_verification', '"y27BHDBypTLPOsApWrsud0u-UDAAT62rIvfM46VcID8"', 'seo', 'Google Search Console verification code', true, now(), now()),
  (gen_random_uuid(), 'meta_pixel_id', '"779817005468177"', 'seo', 'Meta/Facebook Pixel tracking ID', true, now(), now()),
  (gen_random_uuid(), 'canonical_base', '"https://www.jkkn.ac.in"', 'seo', 'Canonical base URL for SEO', true, now(), now()),
  (gen_random_uuid(), 'title_template', '"%s | JKKN Institutions"', 'seo', 'Page title template pattern', true, now(), now())
ON CONFLICT DO NOTHING;


-- ===========================================
-- ENGINEERING SUPABASE: Same pattern applied
-- ===========================================
-- (Applied separately via mcp__Engineering_College_Supabase_Project__execute_sql)
-- See 07-seo-improvements.sql in engineering docs for details

-- End of SEO Improvements
-- ============================================
