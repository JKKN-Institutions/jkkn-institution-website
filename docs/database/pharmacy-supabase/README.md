# Pharmacy College Supabase Database Documentation

This folder contains database documentation and sync logs for the **JKKN College of Pharmacy** Supabase project.

**Project ID:** `rwskookarbolpmtolqkd`

## Purpose

This documentation tracks:
1. Migrations applied to sync with Main Supabase
2. Fixes for issues discovered in Pharmacy College
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
| Functions | ✅ Complete | All 51 functions synced |
| RLS Policies | ✅ Complete | All policies using is_super_admin() |
| Triggers | ✅ Complete | Auth triggers, updated_at triggers |
| Foreign Keys | ✅ Complete | FK pattern: user_roles → profiles |
| Tables | ✅ Complete | 45 tables created |
| Storage Buckets | ✅ Complete | avatars, media, resumes |
| Seed Data | ✅ Complete | Roles, permissions, college, courses |

## Schema Statistics

| Category | Count |
|----------|-------|
| Tables | 45 |
| Storage Buckets | 3 |
| Roles | 5 |
| Permissions | 34 |
| Colleges | 1 (JKKN College of Pharmacy) |
| Courses | 7 |
| Page Templates | 5 |
| Blog Categories | 4 |
| Career Departments | 3 |

## Last Updated

- **Date:** 2026-01-03
- **Updated By:** Claude Code
- **Reason:** Complete database schema sync from Main Supabase
