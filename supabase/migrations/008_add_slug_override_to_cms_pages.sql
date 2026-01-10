-- ============================================================================
-- Migration: Add Custom URL Override Support to cms_pages
-- ============================================================================
-- Purpose: Allow pages to have custom URLs independent of navigation hierarchy
-- Created: 2026-01-10
--
-- Use Case: A page can appear in a parent menu (e.g., "More") but have a
--           different URL (e.g., /boobal instead of /more/boobal)
--
-- New Columns:
--   - slug_overridden: Flag indicating if slug is custom (default: false)
--   - hierarchical_slug: Auto-calculated hierarchical path for navigation
-- ============================================================================

-- Add new columns to cms_pages table
ALTER TABLE cms_pages
  ADD COLUMN slug_overridden BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN hierarchical_slug VARCHAR(500) NULL;

-- Create index for performance on override flag
CREATE INDEX idx_cms_pages_slug_overridden
  ON cms_pages(slug_overridden)
  WHERE slug_overridden = TRUE;

-- Populate hierarchical_slug with current slug values (backward compatibility)
-- All existing pages use hierarchical structure, so hierarchical_slug = slug
UPDATE cms_pages
SET hierarchical_slug = slug
WHERE hierarchical_slug IS NULL;

-- Add database comments for documentation
COMMENT ON COLUMN cms_pages.slug_overridden IS
  'When TRUE, slug is custom and independent of parent hierarchy. When FALSE (default), slug follows parent/child structure.';

COMMENT ON COLUMN cms_pages.hierarchical_slug IS
  'Auto-calculated hierarchical slug based on parent_id chain. Used for navigation breadcrumbs and context even when slug_overridden is TRUE.';

-- ============================================================================
-- End of Migration
-- ============================================================================
