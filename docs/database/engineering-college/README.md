# Engineering College Supabase Database Documentation

This folder contains the complete database schema documentation for the **JKKN College of Engineering and Technology** Supabase project.

**Project ID:** `kyvfkyjmdbtyimtedkie`

## Purpose

This documentation tracks all database objects synced from Main Supabase and any Engineering-specific customizations.

## File Structure

| File | Description | Status |
|------|-------------|--------|
| `01-functions.sql` | PostgreSQL functions synced from Main | Synced from Main |
| `02-rls-policies.sql` | Row Level Security policies | Synced from Main |
| `03-triggers.sql` | Database triggers | Synced from Main |
| `04-foreign-keys.sql` | Foreign key relationships | Synced from Main |
| `SYNC-LOG.md` | Migration sync history | Maintained |

## Sync Source

All database objects are synced from `docs/database/main-supabase/` unless noted otherwise.

## Database Statistics

- **Total Tables:** 49 (matches Main Supabase)
- **Total Functions:** 51 (17 original + 34 migrated)
- **Total Triggers:** 12 on newly migrated tables
- **Total RLS Policies:** 47 on newly migrated tables
- **Feature Parity Status:** ✅ **COMPLETE**

## Last Synced

- **Date:** 2026-01-16
- **Synced By:** Claude Code
- **Source:** Main Supabase (pmqodbfhsejbvfbmsfeq)
- **Migration:** Complete Feature Parity (9-phase migration)

## Features Added (2026-01-16)

### Complete Blog System
- **Tables:** 8 (posts, comments, likes, tags, versions, subscriptions)
- **Functions:** 9 (versioning, counters, statistics)
- **Triggers:** 7 (auto-updates, counts)
- **RLS Policies:** 21

### Advanced CMS Features
- **Functions:** 6 (trash/restore, versioning, statistics)
- **Security Fix:** cms_pages and cms_page_blocks policies now properly restrictive

### Analytics & Tracking
- **Tables:** 1 (page_views)
- **Functions:** 7 (pageview stats, traffic sources, visitor overview, activity heatmaps)

### Forms Management
- **Tables:** 2 (admission_inquiries, contact_submissions)
- **Functions:** 3 (duplicate checking, reference number generation, statistics)
- **Triggers:** 2 (auto-updates)

### Institutional Data
- **Tables:** 3 (colleges, courses, education_videos)
- **RLS Policies:** 6

### Notifications & Tracking
- **Tables:** 3 (in_app_notifications, email_delivery_tracking, imported_master_templates)
- **RLS Policies:** 9
