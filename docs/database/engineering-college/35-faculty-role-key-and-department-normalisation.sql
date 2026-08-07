-- ============================================
-- faculty.role_key + legacy department normalisation
-- ============================================
-- Purpose: Enable the /faculty directory to rank people by institutional role
--          (Principal → HOD → senior learners) and to stop showing duplicate
--          department filter pills.
-- Created: 2026-08-07
-- Modified: —
-- Dependencies: public.faculty
-- Used by: app/actions/faculty.ts (getPublishedFaculty ordering),
--          components/public/faculty/faculty-listing-client.tsx (leadership band),
--          lib/sync/faculty-sync.ts (writes role_key on every upsert)
-- Security: No RLS change. faculty already has RLS enabled; role_key is a
--           non-sensitive public attribute exposed by the same SELECT policy
--           that already returns designation and department.
-- Institution(s): engineering-college
--
-- CONTEXT
-- -------
-- 1. role_key
--    MyJKKN distinguishes Principal / HOD / faculty via staff.role_key, but the
--    sync discarded it. Designation cannot substitute: zero published rows
--    contain "Head" in designation, so HODs were indistinguishable from
--    Assistant Professors locally. Nullable because the two hand-entered legacy
--    rows (synced_from_api = false) have no MyJKKN counterpart.
--
-- 2. Department normalisation
--    The same two legacy rows carry department strings that predate the MyJKKN
--    sync and do not match its canonical names, so the directory rendered 9
--    department filter pills for 7 real departments:
--      'Department of Electrical & Electronics Engineering' (1 legacy row)
--        vs 'Electrical and Electronics Engineering'        (10 synced rows)
--      'MBA'                                                (1 legacy row)
--        vs 'Master of Business Administration (PG)'        (6 synced rows)
--    Rewriting the legacy values is safe: the sync never touches
--    synced_from_api = false rows, so this will not be reverted on the next tick.
-- ============================================

-- ── 1. role_key column ──────────────────────────────────────────────────────
ALTER TABLE public.faculty
  ADD COLUMN IF NOT EXISTS role_key text;

COMMENT ON COLUMN public.faculty.role_key IS
  'MyJKKN staff.role_key (principal | hod | faculty | admission_counselor | coe | ...). '
  'Drives directory ranking. NULL for manually-entered legacy rows.';

-- Partial index: the directory only ever filters on the two leadership roles,
-- and they are a tiny fraction of the table.
CREATE INDEX IF NOT EXISTS idx_faculty_role_key_leadership
  ON public.faculty (role_key)
  WHERE role_key IN ('principal', 'hod');

-- ── 2. Normalise legacy department names ────────────────────────────────────
UPDATE public.faculty
SET department = 'Electrical and Electronics Engineering'
WHERE department = 'Department of Electrical & Electronics Engineering'
  AND synced_from_api = false;

UPDATE public.faculty
SET department = 'Master of Business Administration (PG)'
WHERE department = 'MBA'
  AND synced_from_api = false;

-- ── 3. Verification ─────────────────────────────────────────────────────────
-- Expect 7 distinct departments (was 9), and role_key present on all synced rows
-- after the next forced sync:
--   SELECT department, count(*) FROM public.faculty
--   WHERE is_active AND status = 'published' GROUP BY department ORDER BY 1;
--
--   SELECT role_key, count(*) FROM public.faculty
--   WHERE synced_from_api GROUP BY role_key ORDER BY 2 DESC;

-- End of faculty.role_key + legacy department normalisation
-- ============================================
