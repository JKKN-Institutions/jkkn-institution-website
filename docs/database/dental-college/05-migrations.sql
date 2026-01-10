-- ============================================
-- DENTAL COLLEGE SUPABASE MIGRATIONS
-- ============================================
-- This file documents all migrations applied to the Dental College Supabase project
-- Project ID: wnmyvbnqldukeknnmnpl
-- ============================================

-- ============================================
-- Migration: add_category_type_to_blog_categories
-- ============================================
-- Purpose: Add missing category_type column to align schema with Main Supabase
-- Created: 2026-01-09
-- Issue: Schema drift - Dental College was missing category_type column
-- Dependencies: blog_categories table must exist
-- Impact: Fixes error "column blog_categories.category_type does not exist"
-- ============================================

-- Add missing category_type column
ALTER TABLE blog_categories
ADD COLUMN IF NOT EXISTS category_type varchar(20) NOT NULL DEFAULT 'blog';

-- Remove extra columns that don't match main schema
ALTER TABLE blog_categories
DROP COLUMN IF EXISTS featured_image,
DROP COLUMN IF EXISTS seo_title,
DROP COLUMN IF EXISTS seo_description,
DROP COLUMN IF EXISTS created_by;

-- Ensure column types match main schema
ALTER TABLE blog_categories
ALTER COLUMN name TYPE varchar(100),
ALTER COLUMN slug TYPE varchar(100),
ALTER COLUMN icon TYPE varchar(50),
ALTER COLUMN color TYPE varchar(7);

-- Add comment for tracking
COMMENT ON COLUMN blog_categories.category_type IS 'Separates blog categories from life_at_jkkn categories. Values: blog, life_at_jkkn';

-- End of add_category_type_to_blog_categories
-- ============================================
