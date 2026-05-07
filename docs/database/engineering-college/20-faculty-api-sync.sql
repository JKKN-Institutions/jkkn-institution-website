-- ============================================
-- Faculty API Sync — Schema Additions
-- ============================================
-- Purpose: Add metadata columns so the sync job can distinguish API-managed faculty
--          rows from legacy manual rows; record slug renames so middleware can 301
--          redirect old URLs to current ones; create a Storage bucket to host
--          rehosted faculty profile photos (decoupled from MyJKKN's bucket).
-- Created: 2026-05-07
-- Dependencies: public.faculty (existing)
-- Used by: lib/sync/faculty-sync.ts (writes), middleware.ts (slug redirect lookup),
--          public faculty pages (read photo_url from faculty-photos bucket)
-- Security:
--   - faculty.synced_from_api / staff_id / last_synced_at: existing RLS on faculty inherits.
--   - faculty_slug_history: public-read RLS so middleware can look up redirects without auth;
--     writes happen via service role from the sync engine.
--   - faculty-photos bucket: public-read so <img src> works without signed URLs;
--     writes are service-role-only (sync engine uses SUPABASE_SERVICE_ROLE_KEY).
-- ============================================

-- ── 1. Sync-tracking columns on existing faculty table ───────────────────────
ALTER TABLE public.faculty
  ADD COLUMN IF NOT EXISTS synced_from_api BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS staff_id TEXT,
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

-- Partial index — only API-managed rows are queried by the sync engine on every run
CREATE INDEX IF NOT EXISTS faculty_synced_from_api_idx
  ON public.faculty (synced_from_api)
  WHERE synced_from_api = true;

COMMENT ON COLUMN public.faculty.synced_from_api IS 'True when this row was upserted from MyJKKN Staff API. Sync engine only mutates rows where this is true.';
COMMENT ON COLUMN public.faculty.staff_id IS 'MyJKKN human-readable staff ID (e.g. CET245). Display + debugging only; not a foreign key.';
COMMENT ON COLUMN public.faculty.last_synced_at IS 'Wall-clock timestamp of the most recent successful sync touching this row.';

-- ── 2. Slug-rename history for 301 redirects ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.faculty_slug_history (
  old_slug TEXT PRIMARY KEY,
  new_slug TEXT NOT NULL,
  faculty_id UUID NOT NULL REFERENCES public.faculty(id) ON DELETE CASCADE,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS faculty_slug_history_new_slug_idx
  ON public.faculty_slug_history (new_slug);

ALTER TABLE public.faculty_slug_history ENABLE ROW LEVEL SECURITY;

-- Public read so middleware can look up redirects without an authenticated session
CREATE POLICY "Public read slug history"
  ON public.faculty_slug_history FOR SELECT
  USING (true);

COMMENT ON TABLE public.faculty_slug_history IS 'Maps old faculty profile slugs to current slugs. Populated by the sync engine when MyJKKN admins rename a faculty slug; consumed by middleware.ts for 301 redirects.';

-- ── 3. faculty-photos Storage bucket (rehost target) ─────────────────────────
-- Sync engine downloads from MyJKKN's bucket and re-uploads here so the public
-- site stays online if MyJKKN's bucket goes down.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'faculty-photos',
  'faculty-photos',
  true,
  5242880,                                                -- 5 MB max per file
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Public read so <img src="..."> works without signed URLs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'Public read faculty photos'
  ) THEN
    CREATE POLICY "Public read faculty photos"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'faculty-photos');
  END IF;
END $$;

-- Service role write only — sync engine uses SUPABASE_SERVICE_ROLE_KEY
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'Service role write faculty photos'
  ) THEN
    CREATE POLICY "Service role write faculty photos"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'faculty-photos' AND auth.role() = 'service_role');
  END IF;
END $$;

-- End of Faculty API Sync schema additions
-- ============================================
