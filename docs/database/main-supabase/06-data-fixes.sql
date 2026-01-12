-- ============================================
-- DATA FIXES: Allied Health Science → Allied Health Sciences
-- ============================================
-- Purpose: Ensure consistent terminology across all database content
--          Replace singular "Allied Health Science" with plural "Allied Health Sciences"
-- Created: 2026-01-12
-- Modified: 2026-01-12
-- Tables affected: cms_pages (metadata), cms_page_blocks (props)
-- Impact: SEO URLs, college names, course descriptions, FAQ content
-- Security: Uses standard UPDATE operations, no RLS bypass needed
-- ============================================

-- ============================================
-- Part 1: Fix cms_pages metadata
-- ============================================
-- Update metadata.original_slug fields that contain old singular slug references
-- These are legacy references that should match the current plural form

UPDATE cms_pages
SET metadata = jsonb_set(
  metadata,
  '{original_slug}',
  '"allied-health-sciences-courses"'::jsonb
)
WHERE id = '9bb0b9d4-57f7-4b06-b820-d5121e522c9c'
  AND metadata->>'original_slug' = 'allied-health-science-courses';

UPDATE cms_pages
SET metadata = jsonb_set(
  metadata,
  '{original_slug}',
  '"jkkn-college-of-allied-health-sciences"'::jsonb
)
WHERE id = 'e0463871-4a4b-4440-a7a8-c1915d25e7f3'
  AND metadata->>'original_slug' = 'jkkn-college-of-allied-health-science';

-- ============================================
-- Part 2: Fix cms_page_blocks props
-- ============================================
-- Replace all occurrences in JSON props fields
-- This handles: FAQ content, college grids, course pages, admission forms
-- Strategy: Text replacement in JSONB, only where singular form exists

UPDATE cms_page_blocks
SET props = replace(
  props::text,
  'Allied Health Science',
  'Allied Health Sciences'
)::jsonb
WHERE props::text LIKE '%Allied Health Science%'
  AND props::text NOT LIKE '%Allied Health Sciences%';

-- Also handle case variations
UPDATE cms_page_blocks
SET props = replace(
  props::text,
  'allied health science',
  'allied health sciences'
)::jsonb
WHERE props::text LIKE '%allied health science%'
  AND props::text NOT LIKE '%allied health sciences%';

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify the changes were successful
-- All queries should return 0 rows after migration

-- Check cms_pages for remaining singular references
-- Expected: 0 rows
SELECT
  'cms_pages' as table_name,
  id,
  title,
  slug,
  metadata
FROM cms_pages
WHERE
  (title ILIKE '%allied health science%' AND title NOT ILIKE '%sciences%')
  OR (slug ILIKE '%allied health science%' AND slug NOT ILIKE '%sciences%')
  OR (metadata::text ILIKE '%allied health science%' AND metadata::text NOT ILIKE '%sciences%');

-- Check cms_page_blocks for remaining singular references
-- Expected: 0 rows
SELECT
  'cms_page_blocks' as table_name,
  id,
  component_name,
  LEFT(props::text, 100) as props_preview
FROM cms_page_blocks
WHERE props::text ILIKE '%allied health science%'
  AND props::text NOT ILIKE '%sciences%';

-- Count of records updated (for audit log)
-- This shows how many records were affected
SELECT
  'cms_pages' as table_name,
  COUNT(*) as records_with_corrections
FROM cms_pages
WHERE id IN (
  '9bb0b9d4-57f7-4b06-b820-d5121e522c9c',
  'e0463871-4a4b-4440-a7a8-c1915d25e7f3'
);

SELECT
  'cms_page_blocks' as table_name,
  COUNT(*) as records_with_corrections
FROM cms_page_blocks
WHERE props::text ILIKE '%allied health sciences%';

-- ============================================
-- Rollback Plan (Emergency Use Only)
-- ============================================
-- If something goes wrong, use these to rollback
-- CAUTION: Only use if the migration causes issues

/*
-- Rollback cms_pages metadata
UPDATE cms_pages
SET metadata = jsonb_set(
  metadata,
  '{original_slug}',
  '"allied-health-science-courses"'::jsonb
)
WHERE id = '9bb0b9d4-57f7-4b06-b820-d5121e522c9c';

UPDATE cms_pages
SET metadata = jsonb_set(
  metadata,
  '{original_slug}',
  '"jkkn-college-of-allied-health-science"'::jsonb
)
WHERE id = 'e0463871-4a4b-4440-a7a8-c1915d25e7f3';

-- Rollback cms_page_blocks props
UPDATE cms_page_blocks
SET props = replace(
  props::text,
  'Allied Health Sciences',
  'Allied Health Science'
)::jsonb
WHERE props::text LIKE '%Allied Health Sciences%';
*/

-- End of Data Fix
-- ============================================

-- ============================================
-- Migration Notes
-- ============================================
-- 1. This is a data correction migration, not a schema change
-- 2. No indexes, constraints, or RLS policies are affected
-- 3. Changes are idempotent - safe to run multiple times
-- 4. Affects 2 cms_pages records + 8 cms_page_blocks records
-- 5. No downtime required - changes are instant
-- 6. SEO impact: Minimal (URLs already use plural form)
-- 7. Multi-institution: Apply same fix to other institution databases if needed
-- ============================================
