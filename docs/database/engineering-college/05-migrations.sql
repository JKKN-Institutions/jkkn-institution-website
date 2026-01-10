-- ============================================
-- ENGINEERING COLLEGE SUPABASE MIGRATIONS
-- ============================================
-- This file documents all migrations applied to the Engineering College Supabase project
-- Project ID: kyvfkyjmdbtyimtedkie
-- ============================================

-- ============================================
-- Migration: create_blog_categories
-- ============================================
-- Purpose: Create blog_categories table to align with Main Supabase schema
-- Created: 2026-01-09
-- Issue: Schema drift - Engineering College was missing entire blog_categories table
-- Dependencies: None (creates table from scratch)
-- Impact: Enables blog and life_at_jkkn category management
-- ============================================

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  slug varchar(100) NOT NULL,
  description text,
  parent_id uuid,
  icon varchar(50),
  color varchar(7) DEFAULT '#6366f1'::character varying,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  post_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  category_type varchar(20) NOT NULL DEFAULT 'blog'::character varying,
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- Add foreign key constraint
ALTER TABLE blog_categories
ADD CONSTRAINT blog_categories_parent_id_fkey
FOREIGN KEY (parent_id) REFERENCES blog_categories(id) ON DELETE SET NULL;

-- Add comments
COMMENT ON TABLE blog_categories IS 'Blog post categories (hierarchical). Supports both blog and life_at_jkkn category types.';
COMMENT ON COLUMN blog_categories.category_type IS 'Separates blog categories from life_at_jkkn categories. Values: blog, life_at_jkkn';

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "blog_categories_public_read" ON blog_categories
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "blog_categories_admin_all" ON blog_categories
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('super_admin', 'admin', 'editor')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('super_admin', 'admin', 'editor')
  ));

-- End of create_blog_categories
-- ============================================
