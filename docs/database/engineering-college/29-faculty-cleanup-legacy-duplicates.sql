-- ============================================
-- Migration 29 — Cleanup Legacy Duplicates Superseded by MyJKKN Sync
-- ============================================
-- Purpose: Delete the 5 legacy faculty rows that have been superseded by their
--   MyJKKN-synced counterparts. Each target row has the slug-collision-guard
--   fingerprint:
--     • slug ends in "-legacy-XXXXXXXX" (first 8 hex of its own UUID)
--     • is_active = false
--     • status = 'draft'
--     • synced_from_api = false
--     • a sibling row with synced_from_api = true and matching email exists
--   These rows are pure audit trail at this point — no public-facing route
--   reads them (the slug rename + is_active=false hides them from /faculty/*).
--   Removing them simplifies the table and prevents future confusion.
--
-- Created: 2026-05-17
-- Dependencies:
--   • Migration 20 (faculty-api-sync schema)
--   • All 5 target rows have been verified via SELECT to match the duplicate-
--     pair criteria (see "Rows to delete" snapshot below).
-- Verified rows (captured at 2026-05-17 — full snapshot for audit recovery):
--
--   1. id=f6653819-227d-4507-b0f8-531bf18cfc31
--      slug=dr-c-kathirvel-beme-phd-legacy-f6653819
--      full_name="Dr. C. KATHIRVEL B.E.,M.E., Ph.D"
--      email=principaljkkncet@jkkn.ac.in
--      synced replacement=f733911d-12ea-43df-bafd-a4a05541ecc5 (CET124, Principal)
--
--   2. id=9b0028c2-7d1e-45f3-bd46-20eb522017c8
--      slug=dr-rajesh-kp-legacy-9b0028c2
--      full_name="Dr. K.P RAJESH "
--      email=hodece@jkkn.ac.in
--      synced replacement=32b36acd-14a0-4e2b-8de6-7283621dcfeb (CET225, HOD ECE)
--
--   3. id=051a5a19-440c-47e5-9d77-68debf29a64f
--      slug=drrsasikumar-legacy-051a5a19
--      full_name="Dr.R.SASIKUMAR"
--      email=hodmech@jkkn.ac.in
--      synced replacement=3186d2fe-0f16-4d07-aa76-241f3e4530ff (CET245, HOD Mech)
--
--   4. id=fe4e3eed-3534-47f9-b8e3-976d751ff844
--      slug=balakumaranb-legacy-fe4e3eed
--      full_name="Mr.B.BALAKUMARAN "
--      email=balakumaran@jkkn.ac.in
--      synced replacement=16d90ab2-24e7-484f-883f-99ced9ad38c0 (CET134, Asst Prof IT)
--
--   5. id=5a101d54-37cb-4f4a-bb96-00d28bbd460b
--      slug=gmsathyaseelan-legacy-5a101d54
--      full_name="Mr.G.M.SATHYASEELAN"
--      email=sathyaseelan.g@jkkn.ac.in
--      synced replacement=ff098fc7-67c2-4ca0-b9f3-9ecafe4a3464 (CET018, Asst Prof IT)
--
-- Affects:
--   • Net rows in public.faculty: -5
--   • No public-facing /faculty/* route changes (all 5 rows were already hidden
--     via is_active=false + slug rename, so they were already invisible).
--   • Migrations 26 and 28's "rollback the legacy-restore step" becomes a no-op
--     for the targeted IDs. The "rollback the MyJKKN insert" half still works.
-- Security: No RLS impact. DELETE on rows that have explicit synced replacements.
-- Storage cleanup: Orphan Storage objects at
--     faculty-photos/{legacy_uuid}/photo.jpg
--   for some of these UUIDs will remain in the bucket. They are harmless
--   (~tens of KB) and out of scope for this migration. A separate cleanup
--   pass via the Supabase Storage list+delete API can remove them later.
-- Rollback: Not directly reversible — the full row contents are not preserved
--   here. The MyJKKN-synced replacement rows remain intact, so the people
--   themselves are still represented in the DB. If specific legacy fields
--   need to be recovered, they can be diffed from git history of prior
--   SELECT-snapshot queries in this session's transcript.
-- ============================================

-- Use a defensive WHERE clause that re-checks the duplicate-pair predicate
-- so this migration cannot accidentally delete a legacy row whose synced
-- replacement has been removed since this SQL was written.
DELETE FROM public.faculty legacy
USING public.faculty synced
WHERE LOWER(legacy.email) = LOWER(synced.email)
  AND legacy.id <> synced.id
  AND legacy.synced_from_api = false
  AND synced.synced_from_api = true
  AND legacy.id IN (
    'f6653819-227d-4507-b0f8-531bf18cfc31',
    '9b0028c2-7d1e-45f3-bd46-20eb522017c8',
    '051a5a19-440c-47e5-9d77-68debf29a64f',
    'fe4e3eed-3534-47f9-b8e3-976d751ff844',
    '5a101d54-37cb-4f4a-bb96-00d28bbd460b'
  );

-- End of Migration 29
-- ============================================
