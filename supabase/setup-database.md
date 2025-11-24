# Database Setup Guide

This guide will walk you through setting up the complete authentication system for the JKKN Institution Website.

## 📋 Prerequisites

- Access to Supabase Dashboard: https://supabase.com/dashboard/project/pmqodbfhsejbvfbmsfeq
- A @jkkn.ac.in email address
- Super Admin privileges (or ability to execute SQL in Supabase)

## 🚀 Quick Start (5 Minutes)

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard/project/pmqodbfhsejbvfbmsfeq
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Execute Migrations (Copy-Paste Each)

Execute these SQL files **one by one** in order. After pasting each one, click **Run** (or press Ctrl+Enter).

#### Migration 1: Base Auth Tables ✅
```sql
-- Copy entire content from: supabase/migrations/001_create_base_auth_tables.sql
-- This creates: approved_emails, profiles, roles, user_roles, user_role_changes, members
```

**Verify Migration 1:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('approved_emails', 'profiles', 'roles', 'user_roles', 'members')
ORDER BY table_name;
```
✅ Should return 5 tables

---

#### Migration 2: User Management Tables ✅
```sql
-- Copy entire content from: supabase/migrations/002_create_user_management_tables.sql
-- This creates: role_permissions, user_activity_logs, system_modules
```

**Verify Migration 2:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('role_permissions', 'user_activity_logs', 'system_modules')
ORDER BY table_name;
```
✅ Should return 3 tables

---

#### Migration 3: Database Functions ✅
```sql
-- Copy entire content from: supabase/migrations/003_create_database_functions.sql
-- This creates: has_permission(), get_user_permissions(), etc.
```

**Verify Migration 3:**
```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
AND routine_name LIKE '%permission%'
ORDER BY routine_name;
```
✅ Should return functions like has_permission, get_user_permissions

---

#### Migration 4: Seed Default Roles ✅
```sql
-- Copy entire content from: supabase/migrations/004_seed_default_roles.sql
-- This creates: super_admin, director, chair, member, guest roles
```

**Verify Migration 4:**
```sql
SELECT name, display_name, is_system_role FROM roles ORDER BY name;
```
✅ Should return 5 roles

---

#### Migration 5: Seed Default Permissions ✅
```sql
-- Copy entire content from: supabase/migrations/005_seed_default_permissions.sql
-- This assigns permissions to each role
```

**Verify Migration 5:**
```sql
SELECT r.name, COUNT(rp.id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.id, r.name
ORDER BY r.name;
```
✅ Should show:
- super_admin: 1 permission (*:*:*)
- director: 17 permissions
- chair: 9 permissions
- member: 4 permissions
- guest: 1 permission

---

#### Migration 6: Seed System Modules ✅
```sql
-- Copy entire content from: supabase/migrations/006_seed_system_modules.sql
-- This creates: dashboard, users, content, analytics, settings modules
```

**Verify Migration 6:**
```sql
SELECT module_key, name, is_enabled FROM system_modules ORDER BY order_index;
```
✅ Should return 5 modules (dashboard, users, settings enabled)

---

### Step 3: Add Your Email to Whitelist

Replace `your.email@jkkn.ac.in` with your actual email:

```sql
INSERT INTO approved_emails (email, status, notes)
VALUES ('your.email@jkkn.ac.in', 'active', 'First super admin')
ON CONFLICT (email) DO NOTHING;
```

**Verify:**
```sql
SELECT email, status FROM approved_emails WHERE email = 'your.email@jkkn.ac.in';
```
✅ Should return your email with status 'active'

---

### Step 4: Test Authentication

1. Open your Next.js app: http://localhost:3000
2. Navigate to: http://localhost:3000/auth/login
3. Click **"Sign in with Google"**
4. Use your @jkkn.ac.in email (the one you added to whitelist)
5. You should be redirected to: http://localhost:3000/admin/dashboard

**After Login - Verify Auto-Creation:**
```sql
-- Check your profile was created
SELECT id, email, full_name FROM profiles
WHERE email = 'your.email@jkkn.ac.in';

-- Check guest role was assigned
SELECT
  u.email,
  r.name as role_name,
  ur.assigned_at
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'your.email@jkkn.ac.in';
```
✅ Should show your profile and guest role

---

### Step 5: Promote Yourself to Super Admin

Get your user ID first:
```sql
SELECT id, email FROM auth.users WHERE email = 'your.email@jkkn.ac.in';
```

Copy your user ID, then run (replace `YOUR_USER_ID_HERE`):
```sql
-- Remove guest role
DELETE FROM user_roles
WHERE user_id = 'YOUR_USER_ID_HERE'::uuid
AND role_id = (SELECT id FROM roles WHERE name = 'guest');

-- Add super_admin role
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT
  'YOUR_USER_ID_HERE'::uuid,
  r.id,
  'YOUR_USER_ID_HERE'::uuid
FROM roles r
WHERE r.name = 'super_admin';
```

**Verify Super Admin:**
```sql
SELECT
  u.email,
  r.name as role_name
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'your.email@jkkn.ac.in';
```
✅ Should show 'super_admin' role

**Test Permission Function:**
```sql
SELECT has_permission(
  (SELECT id FROM auth.users WHERE email = 'your.email@jkkn.ac.in'),
  'users:profiles:edit'
);
```
✅ Should return `true`

---

### Step 6: Generate TypeScript Types

Run this in your project terminal:

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Link project
npx supabase link --project-ref pmqodbfhsejbvfbmsfeq

# Generate types
npx supabase gen types typescript --project-id pmqodbfhsejbvfbmsfeq > types/database.ts
```

---

## ✅ Final Verification Checklist

Run this comprehensive check:

```sql
-- 1. Tables (Should return 9 tables)
SELECT COUNT(*) as table_count FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'approved_emails', 'profiles', 'roles', 'user_roles', 'user_role_changes',
  'members', 'role_permissions', 'user_activity_logs', 'system_modules'
);

-- 2. Roles (Should return 5)
SELECT COUNT(*) as role_count FROM roles;

-- 3. Permissions (Should return 32 total)
SELECT COUNT(*) as permission_count FROM role_permissions;

-- 4. Modules (Should return 5)
SELECT COUNT(*) as module_count FROM system_modules;

-- 5. Functions (Should return 8+)
SELECT COUNT(*) as function_count FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
AND routine_name IN (
  'has_permission', 'get_user_permissions', 'get_user_roles',
  'is_user_guest_only', 'check_email_approved', 'log_user_activity',
  'get_user_activity_stats', 'get_role_users_count'
);

-- 6. Your Super Admin Access
SELECT
  u.email,
  r.name as role,
  has_permission(u.id, 'users:profiles:edit') as can_edit_users,
  has_permission(u.id, 'content:pages:create') as can_create_pages
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'your.email@jkkn.ac.in';
```

**Expected Results:**
- ✅ table_count: 9
- ✅ role_count: 5
- ✅ permission_count: 32
- ✅ module_count: 5
- ✅ function_count: 8+
- ✅ Your super_admin role with both permissions = true

---

## 🎉 Success!

Your authentication system is now fully set up! You can now:

1. ✅ Login with Google OAuth (@jkkn.ac.in emails)
2. ✅ Email whitelist checking works
3. ✅ Role-based access control (RBAC) is active
4. ✅ Permission system is functional
5. ✅ Activity tracking is enabled
6. ✅ User profiles auto-create on first login

## 📝 Next Steps

Continue with the Implementation Plan:

1. **USER-009**: Create User List Page with Advanced Table
2. **USER-010**: Create User Server Actions
3. **USER-013**: Create Role List Page
4. See `docs/IMPLEMENTATION_PLAN.md` for complete roadmap

## 🐛 Troubleshooting

### "Email not approved" error
- Make sure your email is in `approved_emails` table with `status = 'active'`
- Check: `SELECT * FROM approved_emails WHERE email = 'your.email@jkkn.ac.in';`

### "Access denied" after login
- You might have guest role only
- Promote to super_admin using Step 5 above

### Functions not found
- Re-run Migration 3
- Check: `GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;`

### RLS blocks queries
- Check if you're logged in: `SELECT auth.uid();`
- Verify role assignment: `SELECT * FROM user_roles WHERE user_id = auth.uid();`

### Need help?
Check `supabase/migrations/README.md` for detailed troubleshooting.
