-- ============================================
-- ⛔ MOOT — DO NOT RUN (marked 2026-08-25)
-- ============================================
-- Migration 46 is SUPERSEDED by 47-canonical-url-cleanup.sql, which has been
-- applied. Running this rollback would re-introduce the apex-host canonicals
-- (and the leading-space value) that 47 deliberately cleared, and the rows
-- would then be rewritten again by 47's normalize_canonical_url() trigger.
--
-- Note a discrepancy worth recording: this file's header says the snapshot was
-- taken "immediately before Migration 46 was applied", but when 47 audited the
-- table on 2026-08-25 all 34 apex-host rows were still present — so 46 was
-- either never applied, or applied and then rolled back with this file. Either
-- way the observed pre-47 state is authoritative and is captured row-by-row in
-- cms_seo_metadata_canonical_backup_20260825, which is the snapshot to restore
-- from if anything needs reversing. Use that, not this file.
-- ============================================
--
-- Migration 46 — EXACT ROLLBACK (row-level snapshot)
-- ============================================
-- Purpose: Restore cms_seo_metadata.canonical_url to its exact pre-migration
--   value for every row touched by Migration 46, addressed by primary key.
--   Unlike the prefix-based inverse noted at the bottom of
--   46-canonical-url-www-normalization.sql, this file is precise: it cannot
--   accidentally move the 22 rows that were already on the www host.
--
-- Snapshot taken: 2026-08-25, immediately before Migration 46 was applied.
-- Target: Main Supabase (pmqodbfhsejbvfbmsfeq) ONLY.
-- Rows: 35 (34 apex-host rewrites + 1 leading-whitespace trim).
--
-- NOTE: restoring the our-management row re-introduces the LEADING SPACE that
--   made its canonical_url an invalid URL. That is intentional — this file is a
--   faithful snapshot, not a corrected one. Drop that single statement if you are
--   rolling back the host change but want to keep the trim.
--
-- Usage: run the whole file, or the individual statements you need.
-- ============================================

UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/accreditation' WHERE id = '2daedba2-5ed0-4771-80e4-293f296e3260'; -- accreditation
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/admission-guide' WHERE id = '85d04546-d4c4-4cae-af19-1ea7600ca1a2'; -- admission-guide
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/ai-campus' WHERE id = '9d43ffe8-ea6d-48a2-9494-ad65cca7b6c3'; -- ai-campus
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/alumni-success-stories' WHERE id = '0e5456f4-4c4a-4b7a-ba3e-53ab05b72de6'; -- alumni-success-stories
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/campus-tour' WHERE id = '7eae2b10-fa33-41d5-8de9-c8262b90f0b0'; -- campus-tour
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/careers-support' WHERE id = 'fa13a5ad-8ea5-42fc-b0b2-a50be1eea91b'; -- careers-support
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/chairman-message' WHERE id = '3e6e1322-016e-4c60-bc45-31bdcfdb8028'; -- chairman-message
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/coimbatore' WHERE id = 'cd31c467-2edc-4c72-b931-7ea78587a2c3'; -- coimbatore
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/community-outreach' WHERE id = '0bbc3a7f-c91a-408f-b497-ba6a8ec44678'; -- community-outreach
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/counseling-guide' WHERE id = '244442c5-be93-4219-bdef-cab072078945'; -- counseling-guide
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/erode' WHERE id = 'd8d9b4b3-572f-48dd-9480-019117707806'; -- erode
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/events' WHERE id = '118e47b0-eb9a-4b10-9cbf-a6bf11761dc1'; -- events
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/faculty-directory' WHERE id = '595946b0-5de6-4800-9a8c-d0c2a810f971'; -- faculty-directory
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/faq' WHERE id = 'ae41a3c5-ea49-4b48-83e4-cfba5188df7b'; -- faq (draft)
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/fee-structure' WHERE id = '3bfaad78-c6a9-4291-b09b-0c21503fa718'; -- fee-structure
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/gallery' WHERE id = '7b2491f8-cfa9-4263-b21a-abaeb3e2373a'; -- gallery (draft)
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/hospital' WHERE id = 'ddfcd826-462f-4434-bbec-d511238c7920'; -- hospital
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/how-to-apply' WHERE id = '50e45063-104f-4cf5-9430-a761caa26ce6'; -- how-to-apply
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/industry-partnerships' WHERE id = 'decf322d-7a17-46bb-873f-7413840d6c60'; -- industry-partnerships
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/international-exchange' WHERE id = 'a0947d31-0839-4256-9e7a-3513984fd16a'; -- international-exchange
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/international-placements' WHERE id = '79c0467d-dca2-4c6a-a47e-91aac1307415'; -- international-placements
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/namakkal' WHERE id = '8cd1ba38-2adb-4368-992e-713e823a01f0'; -- namakkal
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/news' WHERE id = '87885980-5725-40d0-bb27-4de6152c1d12'; -- news
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/nirf' WHERE id = '346eb5b6-d385-41bb-9440-5f3734584311'; -- nirf
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/our-colleges' WHERE id = '6ebd741d-ba50-48b6-8171-f8ba19263003'; -- our-colleges
UPDATE cms_seo_metadata SET canonical_url = ' https://www.jkkn.ac.in/about/our-management' WHERE id = 'b038aa0c-a62a-40a7-91a1-f337e4368577'; -- our-management (NOTE: restores the leading space)
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/recruiters' WHERE id = 'dc3cc41a-3f6e-4a0a-a9a2-4e3d5a18f501'; -- recruiters
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/research-overview' WHERE id = '5c1af4aa-a0de-4416-85fc-0bca4b4dc094'; -- research-overview
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/salem' WHERE id = 'ae43d45f-6dbf-49ce-a906-5bd60a5b53c8'; -- salem
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/scholarships' WHERE id = 'b65f7d63-f031-4695-90ca-418484b8f872'; -- scholarships
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/sports-activities' WHERE id = 'bec026ed-0f4f-490c-a370-de7da63d4497'; -- sports-activities
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/student-life' WHERE id = '6a887e61-5473-432c-b350-8530ec0c1fdb'; -- student-life
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/testimonials' WHERE id = 'd057da31-ea79-45d4-a086-5c5b499da8f0'; -- testimonials
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/tiruppur' WHERE id = 'f35c02d0-c1f2-4d09-bdb2-c43c4173ccbd'; -- tiruppur
UPDATE cms_seo_metadata SET canonical_url = 'https://jkkn.ac.in/why-jkkn' WHERE id = '07d029d1-0115-4bd0-bb0b-ee82ecff644b'; -- why-jkkn

-- End of Migration 46 rollback snapshot
-- ============================================
