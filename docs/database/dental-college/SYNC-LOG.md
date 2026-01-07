# Dental College Database Sync Log

This log tracks all migrations and fixes applied to sync Dental College Supabase with Main Supabase.

**Dental College Project ID:** `wnmyvbnqldukeknnmnpl`
**Main Supabase Project ID:** `pmqodbfhsejbvfbmsfeq`

---

## 2026-01-07

### Migration: `add_cms_page_management_functions` + `add_cms_pages_soft_delete_columns`

**Issue:** Admin panel at `/admin/content/pages` showed all statistics as 0 (Total Pages, Published, Drafts, Scheduled) and table displayed "No results found" despite having 117 pages in the database.

**Root Cause Analysis:**

Using deep sequential thinking (ultrathink), identified two missing components:

1. **Missing CMS Functions (6 total):**
   - `get_page_statistics()` - Called by page.tsx to display statistics cards
   - `get_trash_statistics()` - Called by page.tsx for trash section
   - `restore_page()` - Restore soft-deleted pages
   - `permanently_delete_page()` - Hard delete pages from trash
   - `get_next_page_version_number()` - Version numbering system
   - `auto_purge_deleted_pages()` - Background job for auto-cleanup

2. **Missing Table Columns:**
   - `deleted_at` - Soft delete timestamp
   - `deleted_by` - User who deleted the page

**Database Verification:**

```sql
-- Confirmed: cms_pages table EXISTS with 117 rows
SELECT COUNT(*) FROM cms_pages; -- Result: 117

-- Confirmed: RLS policies are correct
-- "Authenticated can manage pages" - ALL operations for authenticated users

-- Issue: Functions missing
SELECT routine_name FROM information_schema.routines
WHERE routine_name LIKE '%page%'; -- Result: 0 functions found

-- Issue: Soft delete columns missing
SELECT column_name FROM information_schema.columns
WHERE table_name = 'cms_pages' AND column_name IN ('deleted_at', 'deleted_by');
-- Result: 0 columns found
```

**Comparison:**

| Component | Main Supabase | Dental College (Before) | Dental College (After) |
|-----------|---------------|------------------------|----------------------|
| `get_page_statistics()` | ✅ Exists | ❌ Missing | ✅ Added |
| `get_trash_statistics()` | ✅ Exists | ❌ Missing | ✅ Added |
| `restore_page()` | ✅ Exists | ❌ Missing | ✅ Added |
| `permanently_delete_page()` | ✅ Exists | ❌ Missing | ✅ Added |
| `get_next_page_version_number()` | ✅ Exists | ❌ Missing | ✅ Added |
| `auto_purge_deleted_pages()` | ✅ Exists | ❌ Missing | ✅ Added |
| `cms_pages.deleted_at` | ✅ Exists | ❌ Missing | ✅ Added |
| `cms_pages.deleted_by` | ✅ Exists | ❌ Missing | ✅ Added |

**Fix Applied:**

**Migration 1: Add CMS Functions**
```sql
-- Created: supabase/migrations/007_add_cms_page_management_functions.sql
-- Added all 6 CMS page management functions with SECURITY DEFINER and proper search_path
```

**Migration 2: Add Soft Delete Columns**
```sql
ALTER TABLE public.cms_pages
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN deleted_by UUID REFERENCES auth.users(id);

CREATE INDEX idx_cms_pages_deleted_at ON public.cms_pages(deleted_at)
WHERE deleted_at IS NOT NULL;
```

**Verification Results:**

```sql
-- Test 1: Verify all 6 functions exist
SELECT routine_name FROM information_schema.routines
WHERE routine_name IN (
  'get_page_statistics', 'get_trash_statistics', 'restore_page',
  'permanently_delete_page', 'get_next_page_version_number', 'auto_purge_deleted_pages'
);
-- Result: 6 functions returned ✅

-- Test 2: Test get_page_statistics()
SELECT * FROM get_page_statistics();
-- Result: {total: 117, published: 117, draft: 0, scheduled: 0} ✅

-- Test 3: Test get_trash_statistics()
SELECT * FROM get_trash_statistics();
-- Result: {total_in_trash: 0, expiring_soon: 0} ✅
```

**Documentation Updates:**

- ✅ Functions documented in `docs/database/main-supabase/01-functions.sql`
- ✅ Updated function count from 51 to 56
- ✅ Migration files created in `supabase/migrations/`
- ✅ Sync log updated (this entry)

**Impact:**

Admin panel now correctly displays:
- ✅ Total Pages: 117 (was showing 0)
- ✅ Published: 117 (was showing 0)
- ✅ Drafts: 0 (correct)
- ✅ Scheduled: 0 (correct)
- ✅ Table displays all 117 pages (was showing "No results found")
- ✅ Trash functionality enabled with soft delete support

**Status:** ✅ Complete - Admin panel fully functional

**Note:** This fix highlighted the importance of the MANDATORY database documentation workflow (CLAUDE.md). Functions existed in Main Supabase but were never formally documented or synced. Future development MUST follow: **Document → Migrate → Sync** workflow.

---

## 2026-01-03

### Migration: `add_approved_emails_super_admin_policy`

**Issue:** Super admin could not add new approved emails. Toast showed success but no row was inserted.

**Root Cause:** Missing RLS policy for INSERT/UPDATE/DELETE on `approved_emails` table.

**Comparison:**

| Policy | Main Supabase | Dental College (Before) |
|--------|--------------|------------------------|
| SELECT (public check) | `Public can check if email is approved` | `Public can check if email is approved` |
| ALL (super_admin manage) | `Only super_admin can manage approved emails` | **MISSING** |

**Fix Applied:**

```sql
CREATE POLICY "Only super_admin can manage approved emails"
ON public.approved_emails
FOR ALL
TO public
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));
```

**Status:** Fixed

---

### Migration: `fix_user_roles_user_id_fkey_reference`

**Issue:** Users page showed stats (Total Users: 2, Active Users: 2) but table showed "No results found".

**Root Cause:** The `user_roles_user_id_fkey` foreign key referenced `auth.users(id)` instead of `profiles(id)`.

**Why This Broke the Query:**
- The `getUsers` function uses Supabase relation hints: `user_roles!user_roles_user_id_fkey`
- PostgREST uses the FK to resolve which table to join
- When FK pointed to `auth.users`, the join to `profiles` failed silently
- Stats worked because they used different queries without relation hints

**Comparison:**

| FK Definition | Main Supabase | Dental College (Before) |
|--------------|---------------|------------------------|
| `user_roles_user_id_fkey` | `REFERENCES profiles(id)` | `REFERENCES auth.users(id)` |

**Fix Applied:**

```sql
-- Drop the existing FK that references auth.users
ALTER TABLE public.user_roles
DROP CONSTRAINT user_roles_user_id_fkey;

-- Add new FK that references profiles (same as Main Supabase)
ALTER TABLE public.user_roles
ADD CONSTRAINT user_roles_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;
```

**Status:** Fixed

---

### Migration: `fix_fks_to_reference_profiles_instead_of_auth_users`

**Issue:** Multiple tables had foreign keys referencing `auth.users(id)` instead of `profiles(id)`, which breaks PostgREST relation queries.

**Root Cause:** When tables were created, FKs were set to reference `auth.users` directly instead of `profiles`. This causes PostgREST relation hints to fail silently.

**FKs Fixed (10 total):**

| Table | FK Name | Before | After |
|-------|---------|--------|-------|
| `approved_emails` | `approved_emails_added_by_fkey` | `auth.users(id)` | `profiles(id)` |
| `blog_posts` | `blog_posts_author_id_fkey` | `auth.users(id)` | `profiles(id)` |
| `blog_comments` | `blog_comments_author_id_fkey` | `auth.users(id)` | `profiles(id)` |
| `blog_comments` | `blog_comments_moderated_by_fkey` | `auth.users(id)` | `profiles(id)` |
| `blog_post_versions` | `blog_post_versions_created_by_fkey` | `auth.users(id)` | `profiles(id)` |
| `career_jobs` | `career_jobs_created_by_fkey` | `auth.users(id)` | `profiles(id)` |
| `career_jobs` | `career_jobs_updated_by_fkey` | `auth.users(id)` | `profiles(id)` |
| `career_jobs` | `career_jobs_hiring_manager_id_fkey` | `auth.users(id)` | `profiles(id)` |
| `career_application_history` | `career_application_history_changed_by_fkey` | `auth.users(id)` | `profiles(id)` |
| `career_email_templates` | `career_email_templates_created_by_fkey` | `auth.users(id)` | `profiles(id)` |

**Fix Applied:**

```sql
-- Pattern for each FK:
ALTER TABLE public.{table_name} DROP CONSTRAINT IF EXISTS {fk_name};
ALTER TABLE public.{table_name}
ADD CONSTRAINT {fk_name}
FOREIGN KEY ({column_name}) REFERENCES public.profiles(id) ON DELETE {action};
```

**Status:** Fixed

---

## 2026-01-02

### Initial Setup: Core Functions Added

**Functions added to match Main Supabase:**

1. `is_super_admin(uuid)` - Check if user is super admin
2. `has_permission(uuid, text)` - Check if user has specific permission
3. `get_user_roles(uuid)` - Get all roles for a user
4. `get_dashboard_stats()` - Get dashboard statistics
5. `get_recent_activity_with_profiles(int)` - Get recent activity with user info
6. Additional dashboard and user functions

**RLS Policies added:**

1. `user_roles` table policies for super admin access
2. Basic policies for profiles, members tables

**Status:** Completed (partial sync)

---

## Pending Sync Items

The following items may need to be synced from Main Supabase:

1. **Triggers:** Verify all triggers match Main Supabase
2. **Functions:** Compare complete function list
3. **RLS Policies:** Full audit of all table policies
4. **Foreign Keys:** Audit remaining FKs for correct references

---

## Notes

- Always test changes in Dental College after applying migrations
- Some FKs may reference `auth.users` in Dental College but `profiles` in Main - this is a known pattern issue
- When in doubt, check Main Supabase schema first
