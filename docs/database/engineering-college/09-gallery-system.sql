-- ============================================
-- GALLERY SYSTEM DATABASE SCHEMA
-- ============================================
-- Project: JKKN Engineering College Website
-- Created: 2026-01-19
-- Purpose: Image gallery with category-based organization
-- ============================================

-- ============================================
-- TABLE: gallery_categories
-- ============================================
-- Purpose: Stores gallery category information (e.g., "Annual Day", "Sports Day")
-- Created: 2026-01-19
-- Dependencies: None
-- Used by: Gallery page, admin panel
-- ============================================

CREATE TABLE IF NOT EXISTS public.gallery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                     -- Display name (e.g., "16th Annual Day")
  slug TEXT NOT NULL UNIQUE,              -- URL-friendly slug (e.g., "16th-annual-day")
  description TEXT,                       -- Optional description
  cover_image TEXT,                       -- Cover image URL for category
  sort_order INTEGER DEFAULT 0,           -- Display order (lower = first)
  is_active BOOLEAN DEFAULT true,         -- Whether category is visible
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.gallery_categories IS 'Gallery categories for organizing images by event/occasion';
COMMENT ON COLUMN public.gallery_categories.name IS 'Display name of the category';
COMMENT ON COLUMN public.gallery_categories.slug IS 'URL-friendly identifier';
COMMENT ON COLUMN public.gallery_categories.sort_order IS 'Display order (0 = first)';

-- Create index for sorting and filtering
CREATE INDEX IF NOT EXISTS idx_gallery_categories_sort
  ON public.gallery_categories(sort_order, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_categories_active
  ON public.gallery_categories(is_active) WHERE is_active = true;

-- End of gallery_categories
-- ============================================


-- ============================================
-- TABLE: gallery_images
-- ============================================
-- Purpose: Stores individual gallery images linked to categories
-- Created: 2026-01-19
-- Dependencies: gallery_categories table
-- Used by: Gallery page, admin panel
-- ============================================

CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.gallery_categories(id) ON DELETE CASCADE,
  title TEXT,                             -- Optional image title
  alt_text TEXT,                          -- Alt text for accessibility
  caption TEXT,                           -- Optional caption/description
  image_url TEXT NOT NULL,                -- Full image URL
  thumbnail_url TEXT,                     -- Optional thumbnail URL
  sort_order INTEGER DEFAULT 0,           -- Display order within category
  is_active BOOLEAN DEFAULT true,         -- Whether image is visible
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.gallery_images IS 'Individual images within gallery categories';
COMMENT ON COLUMN public.gallery_images.category_id IS 'Reference to parent category';
COMMENT ON COLUMN public.gallery_images.image_url IS 'Full-size image URL';
COMMENT ON COLUMN public.gallery_images.thumbnail_url IS 'Optional optimized thumbnail';

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_gallery_images_category
  ON public.gallery_images(category_id);

CREATE INDEX IF NOT EXISTS idx_gallery_images_sort
  ON public.gallery_images(category_id, sort_order, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_images_active
  ON public.gallery_images(is_active) WHERE is_active = true;

-- End of gallery_images
-- ============================================


-- ============================================
-- TRIGGER: update_gallery_categories_updated_at
-- ============================================
-- Purpose: Auto-update updated_at timestamp on gallery_categories
-- Created: 2026-01-19
-- ============================================

CREATE OR REPLACE FUNCTION public.update_gallery_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_gallery_categories_updated_at
  BEFORE UPDATE ON public.gallery_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_gallery_categories_updated_at();

-- End of trigger
-- ============================================


-- ============================================
-- RLS POLICIES: gallery_categories
-- ============================================
-- Purpose: Row-level security for gallery categories
-- Created: 2026-01-19
-- Security: Public SELECT active, authenticated full access
-- Note: Simplified policies used since is_super_admin() not available
-- ============================================

-- Enable RLS
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;

-- Public can view active categories
CREATE POLICY "Public can view active gallery categories"
  ON public.gallery_categories
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can view all categories (for admin)
CREATE POLICY "Authenticated can view all gallery categories"
  ON public.gallery_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can manage categories (for admin)
CREATE POLICY "Authenticated can manage gallery categories"
  ON public.gallery_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- End of gallery_categories RLS
-- ============================================


-- ============================================
-- RLS POLICIES: gallery_images
-- ============================================
-- Purpose: Row-level security for gallery images
-- Created: 2026-01-19
-- Security: Public SELECT active in active categories, authenticated full access
-- Note: Simplified policies used since is_super_admin() not available
-- ============================================

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Public can view active images in active categories
CREATE POLICY "Public can view active gallery images"
  ON public.gallery_images
  FOR SELECT
  TO public
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.gallery_categories
      WHERE id = gallery_images.category_id
      AND is_active = true
    )
  );

-- Authenticated users can view all images (for admin)
CREATE POLICY "Authenticated can view all gallery images"
  ON public.gallery_images
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can manage images (for admin)
CREATE POLICY "Authenticated can manage gallery images"
  ON public.gallery_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- End of gallery_images RLS
-- ============================================


-- ============================================
-- SAMPLE DATA (For Testing)
-- ============================================
-- Note: Execute this separately if needed for testing
-- ============================================

/*
-- Sample Categories
INSERT INTO public.gallery_categories (name, slug, description, sort_order) VALUES
  ('16th Annual Day', '16th-annual-day', 'Celebrating our 16th Annual Day event', 1),
  ('Founder''s Day', 'founders-day', 'Honoring our founders and their vision', 2),
  ('Pongal', 'pongal', 'Pongal festival celebrations at campus', 3),
  ('Vollymania 2023', 'vollymania-2023', 'Inter-college volleyball tournament 2023', 4);

-- Sample Images (add after categories are created)
-- Note: Replace with actual image URLs from Supabase Storage
*/

-- End of gallery-system.sql
-- ============================================
