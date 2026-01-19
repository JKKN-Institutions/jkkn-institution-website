-- ============================================
-- STORAGE BUCKETS CONFIGURATION
-- ============================================
-- Purpose: Configure all storage buckets for Engineering College Supabase
-- Created: 2026-01-17
-- Institution: Engineering College (kyvfkyjmdbtyimtedkie)
-- Dependencies: Supabase Storage, auth schema
-- ============================================
-- Buckets:
--   1. media (primary CMS bucket) - 50 MB, public
--   2. avatars - 5 MB, public
--   3. previews - 5 MB, public
--   4. resumes - 10 MB, private
-- ============================================

-- ============================================
-- 1. MEDIA BUCKET (Primary CMS Media Library)
-- ============================================
-- Purpose: Store all CMS media (images, videos, PDFs, SVGs)
-- Size: 50 MB per file
-- Access: Public read, authenticated upload
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50 MB in bytes
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ]
);

-- RLS Policies for media bucket
CREATE POLICY "Public read access on media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload to media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Users can update own media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND auth.uid() = owner);

CREATE POLICY "Users can delete own media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND auth.uid() = owner);

-- ============================================
-- 2. AVATARS BUCKET (User Profile Pictures)
-- ============================================
-- Purpose: Store user avatar images
-- Size: 5 MB per file
-- Access: Public read, authenticated upload
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5 MB in bytes
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
);

-- RLS Policies for avatars bucket
CREATE POLICY "Public read access on avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- ============================================
-- 3. PREVIEWS BUCKET (Page Builder Previews)
-- ============================================
-- Purpose: Store component preview thumbnails
-- Size: 5 MB per file
-- Access: Public read, authenticated upload
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'previews',
  'previews',
  true,
  5242880, -- 5 MB in bytes
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp'
  ]
);

-- RLS Policies for previews bucket
CREATE POLICY "Public read access on previews"
ON storage.objects FOR SELECT
USING (bucket_id = 'previews');

CREATE POLICY "Authenticated users can upload previews"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'previews');

CREATE POLICY "Users can update own previews"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'previews' AND auth.uid() = owner);

CREATE POLICY "Users can delete own previews"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'previews' AND auth.uid() = owner);

-- ============================================
-- 4. RESUMES BUCKET (Job Application Resumes)
-- ============================================
-- Purpose: Store private job application resumes
-- Size: 10 MB per file
-- Access: PRIVATE - authenticated users only
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false, -- PRIVATE bucket
  10485760, -- 10 MB in bytes
  ARRAY['application/pdf']
);

-- RLS Policies for resumes bucket (PRIVATE)
CREATE POLICY "Authenticated users can read resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Users can update own resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes' AND auth.uid() = owner);

CREATE POLICY "Users can delete own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes' AND auth.uid() = owner);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify buckets created
-- SELECT id, name, public, file_size_limit, allowed_mime_types
-- FROM storage.buckets
-- ORDER BY name;

-- Verify RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'objects'
-- ORDER BY policyname;

-- ============================================
-- End of Storage Buckets Configuration
-- ============================================
