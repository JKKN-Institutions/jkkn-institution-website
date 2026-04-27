-- ============================================
-- Migration 32 — CMS /admissions AdmissionProcessTimeline 6-Step Parity
-- ============================================
-- Purpose: Implements Unit D.2 of the 2026-04-24 main-admissions-subnav-and-process spec.
--   The CMS /admissions page (id 4f96c885-1ae9-41c3-b017-51d7bfae3a87) is currently
--   shadowed by hardcoded _main-page.tsx for institutionId=main, but the CMS block
--   stores the previous 5-step admission process (starting with "Explore"). When the
--   page is migrated to CMS rendering (tracked separately as obs 19), this stale
--   data would surface. This migration syncs the CMS block to the new 6 steps so
--   the data is correct regardless of which renderer wins.
--
-- Created: 2026-04-25
-- Spec: docs/superpowers/specs/2026-04-24-main-admissions-subnav-and-process-design.md (§5.D.2)
-- Dependencies: cms_page_blocks (AdmissionProcessTimeline block on /admissions page)
-- Verified IDs:
--   - admissions page                = 4f96c885-1ae9-41c3-b017-51d7bfae3a87
--   - AdmissionProcessTimeline block = 56a251a9-57c9-4e32-bbb3-af10b5a5ab6c
-- Affects: CMS data only — no public URL behavior changes today (hardcoded route still wins).
-- Security: No RLS impact (UPDATE on a public-published block).
-- Rollback: Restore previous props from a Supabase point-in-time snapshot, or
--   reapply the original 5-step seed if needed.
-- ============================================

UPDATE cms_page_blocks
SET props = props || jsonb_build_object(
  'subtitle', 'Your journey to JKKN in 6 simple steps',
  'steps', jsonb_build_array(
    jsonb_build_object(
      'number', 1,
      'title', 'Learner''s Registration',
      'description', 'Register online to start your admission journey. Create your profile with basic details and your chosen college.',
      'icon', 'UserPlus',
      'link', 'https://www.jkkn.ai/apply/jkkn-admission-2026'
    ),
    jsonb_build_object(
      'number', 2,
      'title', 'Online Application Submission',
      'description', 'Complete the application form with personal, academic, and program details.',
      'icon', 'FileText'
    ),
    jsonb_build_object(
      'number', 3,
      'title', 'Payment Process',
      'description', 'Pay the application fee securely online to lock your submission.',
      'icon', 'CreditCard'
    ),
    jsonb_build_object(
      'number', 4,
      'title', 'Admission Confirmation',
      'description', 'Receive your provisional admission letter after document screening.',
      'icon', 'CheckCircle'
    ),
    jsonb_build_object(
      'number', 5,
      'title', 'Certificate Submission',
      'description', 'Submit originals — 10th, 12th, transfer, community certificates — to the admissions office.',
      'icon', 'FileCheck'
    ),
    jsonb_build_object(
      'number', 6,
      'title', 'Final Enrollment',
      'description', 'Pay tuition, collect ID card, and join orientation to complete enrollment.',
      'icon', 'GraduationCap'
    )
  )
)
WHERE id = '56a251a9-57c9-4e32-bbb3-af10b5a5ab6c';

-- End of Migration 32
-- ============================================
