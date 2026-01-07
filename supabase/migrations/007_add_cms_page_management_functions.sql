-- ============================================
-- Migration: Add CMS Page Management Functions
-- ============================================
-- Purpose: Add missing CMS functions to support page management
-- Created: 2026-01-07
-- Institution: All institutions (multi-tenant)
-- Functions Added: 6
-- ============================================
-- ISSUE: Dental College admin panel pages not displaying
-- ROOT CAUSE: CMS functions missing from dental Supabase project
-- FIX: Add all 6 CMS page management functions
-- ============================================


-- Function 1: get_page_statistics
-- Returns page counts by status (total, published, draft, scheduled)
CREATE OR REPLACE FUNCTION public.get_page_statistics()
RETURNS TABLE(total bigint, published bigint, draft bigint, scheduled bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total,
    COUNT(*) FILTER (WHERE status = 'published')::BIGINT AS published,
    COUNT(*) FILTER (WHERE status = 'draft')::BIGINT AS draft,
    COUNT(*) FILTER (WHERE status = 'scheduled')::BIGINT AS scheduled
  FROM cms_pages
  WHERE deleted_at IS NULL; -- Exclude soft-deleted pages
END;
$function$;


-- Function 2: get_trash_statistics
-- Returns trash statistics (total deleted pages, expiring soon count)
CREATE OR REPLACE FUNCTION public.get_trash_statistics()
RETURNS TABLE(total_in_trash bigint, expiring_soon bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_in_trash,
    COUNT(*) FILTER (
      WHERE deleted_at < NOW() - INTERVAL '23 days' -- 30 - 7 = 23 days (expiring within 7 days)
    )::BIGINT AS expiring_soon
  FROM cms_pages
  WHERE deleted_at IS NOT NULL;
END;
$function$;


-- Function 3: restore_page
-- Restores a soft-deleted page from trash
CREATE OR REPLACE FUNCTION public.restore_page(page_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Restore the page by clearing deleted_at and deleted_by
  UPDATE cms_pages
  SET
    deleted_at = NULL,
    deleted_by = NULL,
    updated_at = NOW()
  WHERE id = page_uuid
    AND deleted_at IS NOT NULL; -- Only restore if it's deleted

  RETURN FOUND;
END;
$function$;


-- Function 4: permanently_delete_page
-- Permanently deletes a page and all related records (hard delete)
-- WARNING: This is irreversible - all page data is permanently lost
CREATE OR REPLACE FUNCTION public.permanently_delete_page(page_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- First delete related records (cascade delete)
  DELETE FROM cms_page_blocks WHERE page_id = page_uuid;
  DELETE FROM cms_seo_metadata WHERE page_id = page_uuid;
  DELETE FROM cms_page_fab_config WHERE page_id = page_uuid;
  DELETE FROM cms_page_versions WHERE page_id = page_uuid;

  -- Then delete the page itself
  DELETE FROM cms_pages WHERE id = page_uuid;

  RETURN FOUND;
END;
$function$;


-- Function 5: get_next_page_version_number
-- Gets the next version number for a CMS page
CREATE OR REPLACE FUNCTION public.get_next_page_version_number(p_page_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM public.cms_page_versions
  WHERE page_id = p_page_id;

  RETURN next_version;
END;
$function$;


-- Function 6: auto_purge_deleted_pages
-- Auto-purges pages that have been in trash for more than 30 days
-- Used by background cron job (scheduled task)
CREATE OR REPLACE FUNCTION public.auto_purge_deleted_pages()
RETURNS TABLE(purged_count bigint, purged_titles text[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_purged_count BIGINT;
  v_purged_titles TEXT[];
BEGIN
  -- Collect titles of pages to be purged (for logging)
  SELECT ARRAY_AGG(title)
  INTO v_purged_titles
  FROM cms_pages
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '30 days';

  -- Delete related records for pages older than 30 days
  DELETE FROM cms_page_blocks
  WHERE page_id IN (
    SELECT id FROM cms_pages
    WHERE deleted_at IS NOT NULL
      AND deleted_at < NOW() - INTERVAL '30 days'
  );

  DELETE FROM cms_seo_metadata
  WHERE page_id IN (
    SELECT id FROM cms_pages
    WHERE deleted_at IS NOT NULL
      AND deleted_at < NOW() - INTERVAL '30 days'
  );

  DELETE FROM cms_page_fab_config
  WHERE page_id IN (
    SELECT id FROM cms_pages
    WHERE deleted_at IS NOT NULL
      AND deleted_at < NOW() - INTERVAL '30 days'
  );

  DELETE FROM cms_page_versions
  WHERE page_id IN (
    SELECT id FROM cms_pages
    WHERE deleted_at IS NOT NULL
      AND deleted_at < NOW() - INTERVAL '30 days'
  );

  -- Now delete the pages themselves
  WITH deleted AS (
    DELETE FROM cms_pages
    WHERE deleted_at IS NOT NULL
      AND deleted_at < NOW() - INTERVAL '30 days'
    RETURNING id
  )
  SELECT COUNT(*) INTO v_purged_count FROM deleted;

  RETURN QUERY SELECT v_purged_count, v_purged_titles;
END;
$function$;


-- ============================================
-- End of Migration
-- ============================================
