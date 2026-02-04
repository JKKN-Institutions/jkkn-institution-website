-- ============================================
-- NAVIGATION SYSTEM SETUP
-- ============================================
-- Purpose: Create cms_nav_items table and populate with courses menu
-- Created: 2026-01-17
-- Institution: Engineering College (kyvfkyjmdbtyimtedkie)
-- ============================================

-- ============================================
-- CREATE: cms_nav_items table
-- ============================================

CREATE TABLE IF NOT EXISTS public.cms_nav_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_homepage BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES public.cms_nav_items(id) ON DELETE CASCADE,
  external_url TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Unique constraint: same parent can't have duplicate labels
  CONSTRAINT unique_label_per_parent UNIQUE (parent_id, label)
);

-- Add indexes for performance
CREATE INDEX idx_cms_nav_items_parent_id ON public.cms_nav_items(parent_id);
CREATE INDEX idx_cms_nav_items_display_order ON public.cms_nav_items(display_order);
CREATE INDEX idx_cms_nav_items_is_active ON public.cms_nav_items(is_active);

-- Enable RLS
ALTER TABLE public.cms_nav_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Public read access (everyone can see navigation)
CREATE POLICY "Anyone can view active navigation items"
ON public.cms_nav_items FOR SELECT
USING (is_active = true);

-- Only authenticated users can manage navigation
CREATE POLICY "Authenticated users can insert navigation items"
ON public.cms_nav_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update navigation items"
ON public.cms_nav_items FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete navigation items"
ON public.cms_nav_items FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- INSERT: Sample Navigation Structure
-- ============================================
-- Structure:
-- HOME | ABOUT | COURSES OFFERED | GALLERY | FACILITIES | POLICY | IQAC | CONTACT
--   - COURSES OFFERED > UG/PG > [Individual Courses]
--   - IQAC > NAAC, NIRF

WITH main_items AS (
  INSERT INTO public.cms_nav_items (label, href, display_order, is_homepage, parent_id)
  VALUES
    ('HOME', '/', 1, true, NULL),
    ('ABOUT', '/about', 2, false, NULL),
    ('COURSES OFFERED', '/courses', 3, false, NULL),
    ('GALLERY', '/gallery', 4, false, NULL),
    ('FACILITIES', '/facilities', 5, false, NULL),
    ('POLICY', '/policy', 6, false, NULL),
    ('IQAC', '/iqac', 7, false, NULL),
    ('CONTACT', '/contact', 8, false, NULL)
  RETURNING id, label
),
courses_id AS (
  SELECT id FROM main_items WHERE label = 'COURSES OFFERED'
),
-- Insert UG and PG categories
categories AS (
  INSERT INTO public.cms_nav_items (label, href, display_order, is_homepage, parent_id)
  SELECT * FROM (VALUES
    ('UG', '/courses/ug', 1, false, (SELECT id FROM courses_id)),
    ('PG', '/courses/pg', 2, false, (SELECT id FROM courses_id))
  ) AS t(label, href, display_order, is_homepage, parent_id)
  RETURNING id, label
),
ug_id AS (
  SELECT id FROM categories WHERE label = 'UG'
),
pg_id AS (
  SELECT id FROM categories WHERE label = 'PG'
),
-- Insert UG courses
ug_courses AS (
  INSERT INTO public.cms_nav_items (label, href, display_order, is_homepage, parent_id)
  SELECT * FROM (VALUES
    ('B.E CSE', '/courses/ug/cse', 1, false, (SELECT id FROM ug_id)),
    ('B.TECH IT', '/courses/ug/it', 2, false, (SELECT id FROM ug_id)),
    ('B.E Mechanical', '/courses/ug/mechanical', 3, false, (SELECT id FROM ug_id)),
    ('B.E EEE', '/courses/ug/eee', 4, false, (SELECT id FROM ug_id)),
    ('B.E ECE', '/courses/ug/ece', 5, false, (SELECT id FROM ug_id)),
    ('S&H', '/courses/ug/sh', 6, false, (SELECT id FROM ug_id))
  ) AS t(label, href, display_order, is_homepage, parent_id)
  RETURNING id
),
-- Insert PG courses
pg_courses AS (
  INSERT INTO public.cms_nav_items (label, href, display_order, is_homepage, parent_id)
  SELECT * FROM (VALUES
    ('M.E CSE', '/courses/pg/cse', 1, false, (SELECT id FROM pg_id)),
    ('M.E Power Systems', '/courses/pg/power-systems', 2, false, (SELECT id FROM pg_id)),
    ('M.E Embedded Systems', '/courses/pg/embedded-systems', 3, false, (SELECT id FROM pg_id)),
    ('MBA', '/courses/pg/mba', 4, false, (SELECT id FROM pg_id))
  ) AS t(label, href, display_order, is_homepage, parent_id)
  RETURNING id
),
-- Get IQAC parent ID
iqac_id AS (
  SELECT id FROM main_items WHERE label = 'IQAC'
),
-- Insert IQAC submenu items
iqac_submenus AS (
  INSERT INTO public.cms_nav_items (label, href, display_order, is_homepage, parent_id)
  SELECT * FROM (VALUES
    ('NAAC', '/iqac/naac', 1, false, (SELECT id FROM iqac_id)),
    ('NIRF', '/iqac/nirf', 2, false, (SELECT id FROM iqac_id))
  ) AS t(label, href, display_order, is_homepage, parent_id)
  RETURNING id
)
-- Return summary
SELECT
  (SELECT COUNT(*) FROM main_items) AS main_menu_items,
  (SELECT COUNT(*) FROM categories) AS categories,
  (SELECT COUNT(*) FROM ug_courses) + (SELECT COUNT(*) FROM pg_courses) AS total_courses,
  (SELECT COUNT(*) FROM iqac_submenus) AS iqac_items;

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- View the complete navigation tree
-- Run this separately to view the structure:

/*
SELECT
  COALESCE(parent.label, 'ROOT') AS "Main Menu",
  child1.label AS "Category",
  child1.display_order AS "Cat Order",
  child2.label AS "Course",
  child2.href AS "URL",
  child2.display_order AS "Order"
FROM cms_nav_items parent
LEFT JOIN cms_nav_items child1 ON child1.parent_id = parent.id
LEFT JOIN cms_nav_items child2 ON child2.parent_id = child1.id
WHERE parent.parent_id IS NULL
ORDER BY parent.display_order, child1.display_order NULLS FIRST, child2.display_order NULLS FIRST;
*/

-- End of Navigation System Setup
-- ============================================
