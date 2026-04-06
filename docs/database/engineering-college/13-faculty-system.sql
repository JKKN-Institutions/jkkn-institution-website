-- ============================================
-- FACULTY MANAGEMENT SYSTEM
-- ============================================
-- Purpose: Complete faculty management with profiles, CRUD admin panel,
--          and public faculty pages with rich profile data
-- Created: 2026-04-06
-- Target: Engineering College Supabase (kyvfkyjmdbtyimtedkie)
-- Dependencies: auth.users, storage buckets
-- ============================================

-- ============================================
-- 1. FACULTY TABLE
-- ============================================
-- Single table with JSONB columns for repeatable groups.
-- Faculty data is always fetched as a complete record,
-- so JSONB avoids unnecessary multi-table joins.
-- ============================================

CREATE TABLE IF NOT EXISTS public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core identity
  full_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  designation TEXT NOT NULL DEFAULT 'Assistant Professor',
  department TEXT NOT NULL,
  qualification TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  photo_url TEXT,

  -- Numeric stats (for bento cards on public page)
  experience_years INTEGER NOT NULL DEFAULT 0,
  research_papers INTEGER NOT NULL DEFAULT 0,
  phd_scholars INTEGER NOT NULL DEFAULT 0,
  awards_won INTEGER NOT NULL DEFAULT 0,

  -- Display & status
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),

  -- Badges/chips shown in hero section
  badges JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Tab 2: Academic
  professional_summary TEXT NOT NULL DEFAULT '',
  qualifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Each: { degree, specialisation, university, year }
  specialisations JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Array of strings

  -- Tab 3: Experience
  experience_entries JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Each: { type, start_year, end_year, role, institution, description }

  -- Tab 4: Research
  research_focus_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Array of strings
  publications JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Each: { title, authors, journal, year, doi_url, pubmed_url }
  funded_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Each: { title, agency, amount, period, status }
  google_scholar_url TEXT,
  researchgate_url TEXT,
  orcid_url TEXT,

  -- Tab 5: Achievements
  certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Each: { name, organisation, year }
  awards JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Each: { name, body, year }
  memberships JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Each: { organisation, type, since }

  -- Tab 6: Mentoring
  mentoring_description TEXT NOT NULL DEFAULT '',
  phd_scholars_list JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Each: { scholar_name, research_topic, status }
  pg_dissertations_guided INTEGER NOT NULL DEFAULT 0,
  ug_projects_guided INTEGER NOT NULL DEFAULT 0,

  -- Tab 7: FAQs
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Each: { question, answer }

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 2. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_faculty_slug ON public.faculty (slug);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON public.faculty (department);
CREATE INDEX IF NOT EXISTS idx_faculty_status ON public.faculty (status);
CREATE INDEX IF NOT EXISTS idx_faculty_display_order ON public.faculty (display_order);
CREATE INDEX IF NOT EXISTS idx_faculty_active_published ON public.faculty (is_active, status)
  WHERE is_active = true AND status = 'published';

-- ============================================
-- 3. UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION public.update_faculty_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_faculty_updated_at ON public.faculty;
CREATE TRIGGER trigger_faculty_updated_at
  BEFORE UPDATE ON public.faculty
  FOR EACH ROW
  EXECUTE FUNCTION public.update_faculty_updated_at();

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

-- Public can read published + active faculty
CREATE POLICY "Public can view active published faculty"
  ON public.faculty
  FOR SELECT
  USING (is_active = true AND status = 'published');

-- Authenticated users can view all faculty (admin panel)
CREATE POLICY "Authenticated users can view all faculty"
  ON public.faculty
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert faculty
CREATE POLICY "Authenticated users can insert faculty"
  ON public.faculty
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update faculty
CREATE POLICY "Authenticated users can update faculty"
  ON public.faculty
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete faculty
CREATE POLICY "Authenticated users can delete faculty"
  ON public.faculty
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 5. STORAGE BUCKET FOR FACULTY PHOTOS
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'faculty-photos',
  'faculty-photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view faculty photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'faculty-photos');

CREATE POLICY "Authenticated users can upload faculty photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'faculty-photos');

CREATE POLICY "Authenticated users can update faculty photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'faculty-photos');

CREATE POLICY "Authenticated users can delete faculty photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'faculty-photos');

-- End of Faculty Management System
-- ============================================
