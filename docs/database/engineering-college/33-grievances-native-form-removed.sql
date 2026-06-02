-- ============================================
-- Engineering Site — Remove the native grievances table (reverted approach)
-- ============================================
-- Purpose: Drop the `public.grievances` table and its reference-number trigger
--          function. Earlier this session a native, DB-backed grievance form was
--          built (table + RLS + BEFORE INSERT reference-number trigger, plus a
--          React form/Server Action). The approach was then changed: the
--          /online-grievance-and-redressal page now EMBEDS the institution's
--          Google grievance form instead of storing submissions in this DB.
--
--          The table was created and never received real submissions
--          (row_count = 0, verified 2026-06-02), so dropping it is a clean
--          revert of an unused, same-session change — no submission data is lost.
--          The accompanying application files were also removed:
--            • app/actions/grievance.ts
--            • components/public/grievance/grievance-form.tsx
--            • lib/config/grievance.ts
--
-- Created: 2026-06-02
-- Institution: Engineering College (kyvfkyjmdbtyimtedkie)
-- Dependencies: none remaining (no FKs referenced this table; the trigger and
--               its function are dropped together via CASCADE / DROP FUNCTION).
-- Used by: nothing after this migration (the page uses an embedded Google Form).
-- Security: n/a (object removal).
-- Idempotency: IF EXISTS guards make this safe to re-run.
-- Note: This is a destructive DROP. It is intentional and limited to the empty,
--       unused table introduced earlier in the same session.
-- ============================================

BEGIN;

DROP TABLE IF EXISTS public.grievances CASCADE;
DROP FUNCTION IF EXISTS public.generate_grievance_reference_number();

COMMIT;

-- ── Verification ───────────────────────────────────────────────────────────
-- SELECT EXISTS (
--   SELECT 1 FROM information_schema.tables
--   WHERE table_schema = 'public' AND table_name = 'grievances'
-- ) AS table_still_exists;   -- expect false

-- End of 33-grievances-native-form-removed.sql
-- ============================================
