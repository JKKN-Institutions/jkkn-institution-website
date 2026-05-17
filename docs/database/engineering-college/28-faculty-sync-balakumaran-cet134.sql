-- ============================================
-- Migration 28 — One-Off Faculty Sync: BALAKUMARAN B (CET134, role_key=faculty)
-- ============================================
-- Purpose: Mirror the production sync pipeline (lib/sync/faculty-sync.ts) for a
--   single MyJKKN staff record outside the regular sync's HOD+Principal scope.
--   Same pattern as Migration 26 (Sathyaseelan G.M.).
--
--   Target person:
--     MyJKKN UUID  : 16d90ab2-24e7-484f-883f-99ced9ad38c0
--     staff_id     : CET134
--     name         : MR. BALAKUMARAN B
--     email        : balakumaran@jkkn.ac.in
--     institution  : JKKN College of Engineering and Technology
--     department   : Information Technology
--     role_key     : faculty (display "Facilitator")
--     designation  : ASSISTANT PROFESSOR -> normalized to "Assistant Professor"
--
--   Operations applied (mirrors faculty-sync.ts steps in order):
--     1. Slug-collision guard (lib/sync/faculty-sync.ts:109-138)
--        — Free slug "balakumaranb" by renaming the legacy row to
--          "balakumaranb-legacy-fe4e3eed" and soft-deleting it
--          (is_active=false, status=draft). Legacy row preserved for audit.
--     2. Photo rehost (lib/sync/photo-rehost.ts)
--        — DONE OUT-OF-BAND before this migration. Photo downloaded from
--          MyJKKN bucket and uploaded to faculty-photos/CET134.jpg.
--          Bytes confirmed identical to legacy photo (both 33,050 bytes),
--          so no quality regression.
--     3. Adapter (lib/adapters/staff-to-faculty.ts — all 15 field mappings).
--     4. Completeness check (lib/sync/draft-rule.ts)
--        — All 6 required fields populated (photo, summary, qualifications,
--          email, designation, department) -> status='published'.
--     5. Upsert into faculty (id = MyJKKN UUID, synced_from_api=true).
--
-- Created: 2026-05-17
-- Dependencies:
--   - faculty table (created in 13-faculty-system.sql)
--   - faculty-photos Storage bucket (created in 06-storage-buckets.sql)
--   - Photo at https://kyvfkyjmdbtyimtedkie.supabase.co/storage/v1/object/public/faculty-photos/CET134.jpg
--     (verified HTTP 200, content-type=image/jpeg, content-length=33050)
-- Affects:
--   - /faculty/balakumaranb now renders the MyJKKN-sourced row with the correct
--     department ("Information Technology", was "Department of Information Technology")
--     and the cleaner MyJKKN-curated professional summary.
--   - Legacy row (fe4e3eed-...) hidden, slug renamed for audit.
-- Security: No RLS impact.
-- Rollback:
--   UPDATE public.faculty SET slug='balakumaranb', is_active=true, status='published'
--     WHERE id='fe4e3eed-3534-47f9-b8e3-976d751ff844';
--   DELETE FROM public.faculty WHERE id='16d90ab2-24e7-484f-883f-99ced9ad38c0';
-- ============================================

-- ─── Step 1: Slug-collision guard ──────────────────────────────────────────
UPDATE public.faculty
SET
  slug      = 'balakumaranb-legacy-fe4e3eed',
  is_active = false,
  status    = 'draft'
WHERE id = 'fe4e3eed-3534-47f9-b8e3-976d751ff844';

-- ─── Step 2: Insert MyJKKN-sourced row ─────────────────────────────────────
INSERT INTO public.faculty (
  id, full_name, slug, designation, department, qualification, email, photo_url,
  experience_years, research_papers, phd_scholars, awards_won, display_order,
  is_active, status, badges, professional_summary, qualifications, specialisations,
  experience_entries, research_focus_areas, publications, funded_projects,
  google_scholar_url, researchgate_url, orcid_url, certifications, awards,
  memberships, mentoring_description, phd_scholars_list, pg_dissertations_guided,
  ug_projects_guided, faqs, synced_from_api, staff_id, last_synced_at
) VALUES (
  '16d90ab2-24e7-484f-883f-99ced9ad38c0',
  'MR. BALAKUMARAN B',
  'balakumaranb',
  'Assistant Professor',                       -- titleCase("ASSISTANT PROFESSOR")
  'Information Technology',
  'M.Tech IT',
  'balakumaran@jkkn.ac.in',
  'https://kyvfkyjmdbtyimtedkie.supabase.co/storage/v1/object/public/faculty-photos/CET134.jpg',
  10, 4, 0, 1, 0,                              -- experience_years, research_papers, phd_scholars, awards_won, display_order
  true,
  'published',
  '[]'::jsonb,                                 -- badges (API empty)
  'Mr. Balakumaran serves as an Assistant Professor in the Department of Information Technology at JKKN College of Engineering and Technology. He actively contributes as a member/coordinator of the Entrepreneurship Development Cell (EDC), fostering innovation and an entrepreneurial mindset among students. His areas of expertise include artificial intelligence, machine learning, and data science. He plays a vital role in curriculum development, ensuring alignment with current industry trends and technological advancements.',
  '[
    {"degree":"M.Tech","specialisation":"Information Technology","university":"Anna University","year":"2014"},
    {"degree":"B.Tech","specialisation":"Information Technology","university":"Anna University","year":"2008"}
  ]'::jsonb,
  '["Artificial Intelligence","Machine Learning","Data Science"]'::jsonb,
  '[
    {"type":"Teaching","start_year":"2024","end_year":"Present","role":"Assistant Professor","institution":"JKK Nataraja College of Engineering and Technology","description":""},
    {"type":"Teaching","start_year":"2022","end_year":"2024","role":"Assistant Professor","institution":"M. P. Nachimuthu M. Jaganathan Engineering College","description":""},
    {"type":"Teaching","start_year":"2015","end_year":"2021","role":"Assistant Professor","institution":"Jairupaa College of Engineering","description":""}
  ]'::jsonb,
  '[]'::jsonb,                                 -- research_focus_areas (empty in MyJKKN)
  '[
    {"title":"Theory of Computation","authors":"","journal":"Charulatha Publications, Chennai. ISBN: 978-93-6260-453-8","year":"2025","doi_url":"","pubmed_url":""}
  ]'::jsonb,
  '[]'::jsonb,                                 -- funded_projects (empty)
  '',                                          -- google_scholar_url (empty)
  '',                                          -- researchgate_url (empty)
  '',                                          -- orcid_url (empty)
  '[
    {"name":"E-Cell Coordinators Workshop","organisation":"TNYIEDP","year":"2025"},
    {"name":"Next Gen in AI/ML and IoT","organisation":"AICTE","year":"2025"},
    {"name":"AI Assisted Development of Fast & Secure IoT for Agriculture and Textile Industries","organisation":"AICTE","year":"2025"},
    {"name":"Generative AI","organisation":"Kangeyam Institute of Technology, Tirupur","year":"2025"},
    {"name":"Generative AI with LLM","organisation":"NITK","year":"2025"},
    {"name":"The Fusion of AI and Quantum Computing","organisation":"Excel Engineering College Autonomous","year":"2025"},
    {"name":"Cyber Security with Kali Linux","organisation":"IBM SkillsBuild for Adults / TNSDC","year":"2024"},
    {"name":"Full Stack Web Development","organisation":"Microsoft, SAP, Tamil Nadu Skill Development Corporation","year":"2024"}
  ]'::jsonb,
  '[
    {"name":"E-Cell Coordinators Award","body":"Tamil Nadu Youth Innovation and Entrepreneurship Development","year":"2026"}
  ]'::jsonb,
  '[]'::jsonb,                                 -- memberships (empty)
  '',                                          -- mentoring_description (empty)
  '[]'::jsonb,                                 -- phd_scholars_list (empty)
  0,                                           -- pg_dissertations_guided
  0,                                           -- ug_projects_guided
  '[]'::jsonb,                                 -- faqs (empty)
  true,                                        -- synced_from_api
  'CET134',
  NOW()
);

-- End of Migration 28
-- ============================================
