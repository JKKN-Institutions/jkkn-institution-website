-- ============================================
-- Pharmacy College Supabase Database Functions
-- ============================================
-- Project: JKKN Pharmacy College Supabase (rwskookarbolpmtolqkd)
-- Created: 2026-01-08
-- Purpose: PostgreSQL functions for Pharmacy College database
-- Note: Synced from Main Supabase project
-- ============================================


-- ============================================
-- get_trash_statistics
-- ============================================
-- Purpose: Returns trash statistics (total deleted pages, expiring soon count)
-- Created: 2026-01-08
-- Modified: N/A
-- Dependencies: cms_pages table
-- Used by: Admin panel pages list trash section
-- Security: SECURITY DEFINER (bypasses RLS)
-- Returns: TABLE(total_in_trash bigint, expiring_soon bigint)
-- Note: Expiring soon = pages deleted more than 23 days ago (7 days until auto-purge)
-- ============================================

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

-- End of get_trash_statistics
-- ============================================


-- ============================================
-- restore_page
-- ============================================
-- Purpose: Restores a soft-deleted page from trash
-- Created: 2026-01-08
-- Modified: N/A
-- Dependencies: cms_pages table
-- Used by: Trash management Server Actions
-- Security: SECURITY DEFINER (bypasses RLS)
-- Parameters: page_uuid (UUID) - ID of the page to restore
-- Returns: boolean - TRUE if page was restored, FALSE if not found or not deleted
-- ============================================

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

-- End of restore_page
-- ============================================


-- ============================================
-- permanently_delete_page
-- ============================================
-- Purpose: Permanently deletes a page and all related records (hard delete)
-- Created: 2026-01-08
-- Modified: N/A
-- Dependencies: cms_pages, cms_page_blocks, cms_seo_metadata, cms_page_fab_config, cms_page_versions tables
-- Used by: Trash management - permanent deletion Server Actions
-- Security: SECURITY DEFINER (bypasses RLS)
-- Parameters: page_uuid (UUID) - ID of the page to permanently delete
-- Returns: boolean - TRUE if page was deleted, FALSE if not found
-- WARNING: This is irreversible - all page data is permanently lost
-- ============================================

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

-- End of permanently_delete_page
-- ============================================


-- ============================================
-- auto_purge_deleted_pages
-- ============================================
-- Purpose: Auto-purges pages that have been in trash for more than 30 days
-- Created: 2026-01-08
-- Modified: N/A
-- Dependencies: cms_pages, cms_page_blocks, cms_seo_metadata, cms_page_fab_config, cms_page_versions tables
-- Used by: Background cron job (scheduled task)
-- Security: SECURITY DEFINER (bypasses RLS)
-- Returns: TABLE(purged_count bigint, purged_titles text[]) - Count and titles of purged pages
-- Note: Automatically called by cron job daily to clean up old deleted pages
-- ============================================

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

-- End of auto_purge_deleted_pages
-- ============================================
