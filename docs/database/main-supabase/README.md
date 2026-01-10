# Main Supabase Database Documentation

This folder contains the complete database schema documentation for the **Main JKKN Institution** Supabase project.

**Project ID:** `pmqodbfhsejbvfbmsfeq`

## Purpose

This documentation serves as the **single source of truth** for all database objects in the Main Supabase project. All database changes MUST be documented here BEFORE being executed.

## File Structure

| File | Description | Count |
|------|-------------|-------|
| `00-tables.sql` | **ALL table definitions** (CREATE TABLE statements) | **52 tables** |
| `01-functions.sql` | All PostgreSQL functions | ~51 functions |
| `02-rls-policies.sql` | All Row Level Security policies | ~126 policies |
| `03-triggers.sql` | All database triggers | ~41 triggers |
| `04-foreign-keys.sql` | All foreign key relationships | ~48 foreign keys |

**IMPORTANT:** `00-tables.sql` is the **foundation** - always document table structures here first before adding functions, policies, triggers, or foreign keys.

## Workflow

### Adding New Database Objects

1. **Document FIRST** - Add the SQL to the appropriate file
2. **Execute SECOND** - Apply migration via MCP
3. **Verify** - Confirm migration succeeded

### Syncing to Other Institutions

After Main Supabase is updated:
1. Review the documented SQL
2. Apply to other institution databases
3. Document any institution-specific variations

## Documentation Format

All SQL should follow this format:

```sql
-- ============================================
-- Object Name
-- ============================================
-- Purpose: [Brief description]
-- Created: [Date]
-- Modified: [Date if updated]
-- Dependencies: [List any dependencies]
-- Used by: [List tables/functions that use this]
-- Security: [SECURITY DEFINER / INVOKER if applicable]
-- ============================================

[SQL CODE HERE]

-- End of Object Name
-- ============================================
```

## Critical Functions

These functions are essential for the permission system:

| Function | Purpose | Security |
|----------|---------|----------|
| `is_super_admin(uuid)` | Check if user is super admin | SECURITY DEFINER |
| `has_permission(uuid, text)` | Check if user has specific permission | SECURITY DEFINER |
| `get_user_roles(uuid)` | Get all roles for a user | SECURITY DEFINER |
| `get_dashboard_stats()` | Get dashboard statistics | SECURITY DEFINER |
| `get_recent_activity_with_profiles(int)` | Get recent activity with user info | SECURITY DEFINER |

## RLS Policy Patterns

### Super Admin Access
```sql
-- Use is_super_admin() function for super admin checks
USING (is_super_admin(auth.uid()))
```

### Self-Access
```sql
-- Allow users to access their own records
USING (user_id = auth.uid())
```

### Combined Access
```sql
-- Super admin OR self access
USING (is_super_admin(auth.uid()) OR user_id = auth.uid())
```

## Important Notes

1. **SECURITY DEFINER functions** bypass RLS - use carefully
2. **Always test RLS policies** before deploying
3. **Document all changes** with proper metadata
4. **Keep Main Supabase as the reference** - sync others from it

## Last Updated

- **Date:** 2026-01-10
- **Updated By:** Claude Code (Custom URL Override Feature)
- **Reason:** Added slug_overridden and hierarchical_slug columns to cms_pages table for custom URL support
