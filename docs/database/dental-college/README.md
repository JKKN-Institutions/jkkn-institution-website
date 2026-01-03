# Dental College Supabase Database Documentation

This folder contains database documentation and sync logs for the **Dental College** Supabase project.

**Project ID:** `wnmyvbnqldukeknnmnpl`

## Purpose

This documentation tracks:
1. Migrations applied to sync with Main Supabase
2. Fixes for issues discovered in Dental College
3. Any institution-specific customizations

## Reference

The **Main Supabase** (`pmqodbfhsejbvfbmsfeq`) is the source of truth for database schema. All schema objects should match Main Supabase unless there's a documented reason for divergence.

See `docs/database/main-supabase/` for the complete schema documentation.

## File Structure

| File | Description |
|------|-------------|
| `README.md` | This file - overview and purpose |
| `SYNC-LOG.md` | Log of all migrations/fixes applied |

## Sync Status

| Object Type | Synced | Notes |
|------------|--------|-------|
| Functions | Partial | Some functions added on 2026-01-02 |
| RLS Policies | Partial | `approved_emails` policy added 2026-01-03 |
| Triggers | Partial | `on_auth_user_created` exists |
| Foreign Keys | Synced | `user_roles_user_id_fkey` fixed 2026-01-03 |

## Last Updated

- **Date:** 2026-01-03
- **Updated By:** Claude Code
- **Reason:** Document FK and RLS policy fixes
