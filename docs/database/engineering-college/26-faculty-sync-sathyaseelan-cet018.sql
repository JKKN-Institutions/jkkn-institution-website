-- ============================================
-- Migration 26 — One-Off Faculty Sync: SATHYASEELAN G.M. (CET018, role_key=faculty)
-- ============================================
-- Purpose: Manually mirror what the production sync pipeline (lib/sync/faculty-sync.ts)
--   would do for a single MyJKKN staff record, without expanding the regular sync's
--   role-set (which is currently restricted to role_key IN ('hod','principal')).
--
--   Target person:
--     MyJKKN UUID  : ff098fc7-67c2-4ca0-b9f3-9ecafe4a3464
--     staff_id     : CET018
--     name         : MR. SATHYASEELAN G.M.
--     email        : sathyaseelan.g@jkkn.ac.in
--     institution  : JKKN College of Engineering and Technology
--     department   : Information Technology
--     role_key     : faculty (display "Facilitator")
--     designation  : ASSISTANT PROFESSOR -> normalized to "Assistant Professor"
--
--   Operations applied (mirrors faculty-sync.ts steps in order):
--     1. Slug-collision guard (lib/sync/faculty-sync.ts:109-138)
--        — Free slug "gmsathyaseelan" by renaming the existing legacy row to
--          "gmsathyaseelan-legacy-5a101d54" and soft-deleting it
--          (is_active=false, status=draft). Legacy row preserved for audit.
--     2. Photo rehost (lib/sync/photo-rehost.ts)
--        — DONE OUT-OF-BAND via direct Supabase Storage REST API call before this
--          migration. Photo downloaded from MyJKKN bucket and uploaded to engineering
--          faculty-photos bucket at key CET018.jpg.
--          Public URL embedded below.
--     3. Adapter (lib/adapters/staff-to-faculty.ts — all 15 field mappings applied)
--     4. Completeness check (lib/sync/draft-rule.ts)
--        — All 6 required fields populated (photo, summary, qualifications, email,
--          designation, department) -> status='published'.
--     5. Upsert into faculty (id = MyJKKN UUID, synced_from_api=true).
--
-- Created: 2026-05-17
-- Dependencies:
--   - faculty table (created in 13-faculty-system.sql)
--   - faculty-photos Storage bucket (in 06-storage-buckets.sql)
--   - Photo at https://kyvfkyjmdbtyimtedkie.supabase.co/storage/v1/object/public/faculty-photos/CET018.jpg
--     (verified HTTP 200, content-type=image/jpeg, content-length=13829 before this migration)
-- Affects:
--   - Public site: /faculty/gmsathyaseelan now renders the MyJKKN-sourced row
--     with the correct department ("Information Technology") and full extended profile.
--   - Legacy row (5a101d54-...) hidden from public site, slug renamed for audit.
-- Security: No RLS impact. UPDATE + INSERT on public.faculty.
-- Rollback:
--   UPDATE public.faculty SET slug='gmsathyaseelan', is_active=true, status='published'
--     WHERE id='5a101d54-37cb-4f4a-bb96-00d28bbd460b';
--   DELETE FROM public.faculty WHERE id='ff098fc7-67c2-4ca0-b9f3-9ecafe4a3464';
--   (Storage object faculty-photos/CET018.jpg can stay; it's idempotent — same key on next sync.)
-- ============================================

-- ─── Step 1: Slug-collision guard (free "gmsathyaseelan" from the legacy row) ──
UPDATE public.faculty
SET
  slug      = 'gmsathyaseelan-legacy-5a101d54',
  is_active = false,
  status    = 'draft'
WHERE id = '5a101d54-37cb-4f4a-bb96-00d28bbd460b';

-- ─── Step 2: Insert MyJKKN-sourced row with adapter-transformed fields ───────
INSERT INTO public.faculty (
  id,
  full_name,
  slug,
  designation,
  department,
  qualification,
  email,
  photo_url,
  experience_years,
  research_papers,
  phd_scholars,
  awards_won,
  display_order,
  is_active,
  status,
  badges,
  professional_summary,
  qualifications,
  specialisations,
  experience_entries,
  research_focus_areas,
  publications,
  funded_projects,
  google_scholar_url,
  researchgate_url,
  orcid_url,
  certifications,
  awards,
  memberships,
  mentoring_description,
  phd_scholars_list,
  pg_dissertations_guided,
  ug_projects_guided,
  faqs,
  synced_from_api,
  staff_id,
  last_synced_at
) VALUES (
  'ff098fc7-67c2-4ca0-b9f3-9ecafe4a3464',
  'MR. SATHYASEELAN G.M.',
  'gmsathyaseelan',
  'Assistant Professor',                      -- titleCase("ASSISTANT PROFESSOR")
  'Information Technology',
  'M.Tech-IT., (Ph.D)',
  'sathyaseelan.g@jkkn.ac.in',
  'https://kyvfkyjmdbtyimtedkie.supabase.co/storage/v1/object/public/faculty-photos/CET018.jpg',
  13,                                          -- experience_years
  20,                                          -- research_papers
  0,                                           -- phd_scholars
  0,                                           -- awards_won
  0,                                           -- display_order
  true,
  'published',
  '["AI, Big Data & Cloud Computing"]'::jsonb, -- badges (API [{label}] -> [string])
  'Mr. G. M. Sathyaseelan serves as an Assistant Professor in the Department of Computer Science and Engineering at JKKN College of Engineering and Technology. He holds several key institutional roles including Alumni Coordinator, MYJKKN Coordinator, CAMU Coordinator, TLEC Coordinator, and AI Project Coordinator. His academic and research domains encompass Artificial Intelligence, Machine Learning, Deep Learning, Data Science, IoT, and Educational Technology. He demonstrates a strong inclination towards intelligent systems and the integration of advanced technological tools in pedagogy.',
  '[
    {"degree":"M.Tech","specialisation":"Information Technology","university":"Anna University, Chennai","year":"2012"},
    {"degree":"B.Tech","specialisation":"Information Technology","university":"Anna University, Chennai","year":"2008"}
  ]'::jsonb,
  '["Cloud Computing, Big Data & AI","Computer Networks","Cybersecurity & Network Security","Machine Learning"]'::jsonb,
  '[
    {"type":"Teaching","start_year":"2012","end_year":"Present","role":"Assistant Professor","institution":"J.K.K. Nattraja College of Engineering and Technology","description":""},
    {"type":"Industry","start_year":"2008","end_year":"2010","role":"Technical Engineer","institution":"Maintech Pvt Ltd, Bangalore","description":""}
  ]'::jsonb,
  '["AI & Big Data","Machine Learning"]'::jsonb,
  '[
    {"title":"9th International Conference on Computational Intelligence in Data Science (ICCIDS), pp. 1-6","authors":"","journal":"","year":"2026","doi_url":"","pubmed_url":"https://ieeexplore.ieee.org/abstract/document/11407824"},
    {"title":"5th International Conference on Evolutionary Computing and Mobile Sustainable Networks (ICECMSN), pp. 612-618","authors":"","journal":"","year":"2025","doi_url":"","pubmed_url":"https://ieeexplore.ieee.org/abstract/document/11383278"},
    {"title":"8th International Conference on I-SMAC (IoT in Social, Mobile, Analytics and Cloud), pp. 1778-1781","authors":"","journal":"","year":"2024","doi_url":"","pubmed_url":"https://ieeexplore.ieee.org/abstract/document/10714660"}
  ]'::jsonb,
  '[]'::jsonb,                                 -- funded_projects (empty)
  'https://scholar.google.com/citations?user=rqn0TZQAAAAJ&hl=en',
  'https://www.researchgate.net/profile/G-Sathyaseelan?ev=hdr_xprf',
  'https://orcid.org/0009-0008-1921-8356',
  '[
    {"name":"Design Thinking and Innovation","organisation":"SWAYAM","year":"2025"},
    {"name":"AI Assisted Development of Fast & Secure IoT for Agriculture and Textile Industries","organisation":"ATAL","year":"2025"},
    {"name":"Generative AI and Prompt Engineering","organisation":"ATAL","year":"2025"},
    {"name":"Emerging Paradigms in AI: Concepts and Challenges for Educators","organisation":"ATAL","year":"2025"},
    {"name":"Quantum Computing''s Impact on Cryptography and Cyber Security in Defence","organisation":"ATAL","year":"2025"},
    {"name":"Next Gen in AI/ML and IoT","organisation":"ATAL","year":"2025"},
    {"name":"Testing","organisation":"","year":"2026"}
  ]'::jsonb,
  '[]'::jsonb,                                 -- awards (empty)
  '[
    {"organisation":"CSI","type":"Annual Membership","since":"2025"},
    {"organisation":"IFERP","type":"Life Member","since":"2018"},
    {"organisation":"IAENG Societies","type":"Life Member","since":"2019"},
    {"organisation":"ISACA","type":"Life Member","since":"2022"}
  ]'::jsonb,
  '',                                          -- mentoring_description (API null)
  '[]'::jsonb,                                 -- phd_scholars_list (empty)
  10,                                          -- pg_dissertations_guided
  25,                                          -- ug_projects_guided
  '[]'::jsonb,                                 -- faqs (empty)
  true,                                        -- synced_from_api
  'CET018',
  NOW()
);

-- End of Migration 26
-- ============================================
