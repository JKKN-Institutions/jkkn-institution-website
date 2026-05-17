-- ============================================
-- Migration 27 — Publish DR. RAJESH K.P (CET225) after MyJKKN admin added professional_summary
-- ============================================
-- Purpose: Manually run the equivalent of one sync tick for staff CET225 so this
--   HOD goes live on the public site immediately instead of waiting up to 15
--   minutes for the next Vercel cron at "*/15 * * * *".
--
--   Background:
--     - DR. RAJESH K.P (role_key=hod) was already in the engineering faculty
--       table via the regular sync (last sync 2026-05-16 06:56:45 UTC).
--     - status was 'draft' because the auto-draft rule in lib/sync/draft-rule.ts
--       requires professional_summary to be non-empty, and MyJKKN had an empty
--       value for that field.
--     - The ECE department / MyJKKN admin pasted the drafted summary into
--       MyJKKN's professional_summary field for staff CET225 at
--       2026-05-17 06:25:51 UTC (verified via /api-management/staff/{id} fetch).
--     - All six completeness-rule fields (photo, professional_summary,
--       qualifications, email, designation, department) are now populated.
--   This migration:
--     1. Updates professional_summary from MyJKKN's freshly-saved value (with
--        clean() whitespace normalization applied — matches what the regular
--        sync would store).
--     2. Promotes status from 'draft' to 'published' (matches what
--        finalStatus computation in faculty-sync.ts:85-86 would produce now).
--     3. Bumps last_synced_at to NOW() so audit logs show the verification time.
--
-- Created: 2026-05-17
-- Dependencies:
--   - Migration 20 (faculty-api-sync schema)
--   - Row id 32b36acd-14a0-4e2b-8de6-7283621dcfeb already present in faculty table
--     (inserted by the regular cron sync; not by a one-off migration).
-- Verified IDs:
--   - faculty.id = 32b36acd-14a0-4e2b-8de6-7283621dcfeb
--   - staff_id   = CET225
-- Affects: /faculty/dr-rajesh-kp goes live on the public site (status published,
--   is_active true, all six completeness fields populated).
-- Security: No RLS impact. UPDATE on a sync-managed public.faculty row.
-- Rollback:
--   UPDATE public.faculty SET status='draft' WHERE id='32b36acd-14a0-4e2b-8de6-7283621dcfeb';
--   (professional_summary stays populated; only the visibility flip reverts.)
-- ============================================

UPDATE public.faculty
SET
  professional_summary = 'Dr. K.P. Rajesh serves as Associate Professor and Head of the Department of Electronics and Communication Engineering at JKKN College of Engineering and Technology. He holds a Ph.D. in 5G from Noorul Islam Centre for Higher Education (2021), an M.E. in Applied Electronics (2010) and a B.E. in Electronics and Communication Engineering (2008) from Anna University, and brings 14 years of teaching and research experience across leading engineering institutions including Sri Krishna College of Technology and Noorul Islam Centre for Higher Education. His research interests centre on 5G wireless communication, massive MIMO systems, spectral-efficiency optimisation, and intelligent base-station design, with peer-reviewed publications in IJITEE, IJRTE, and the IEEE International Conference on Circuits and Systems. He is a Life Member of INEAG and continues to drive curriculum innovation and applied research in next-generation wireless technologies at the department.',
  status               = 'published',
  last_synced_at       = NOW()
WHERE id = '32b36acd-14a0-4e2b-8de6-7283621dcfeb';

-- End of Migration 27
-- ============================================
