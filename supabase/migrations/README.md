# Database Migrations

This directory contains SQL migrations for setting up the complete authentication and user management system for the JKKN Institution Website.

## 📋 Migration Order

Execute the migrations in this exact order:

1. **001_create_base_auth_tables.sql** - Base authentication tables (approved_emails, profiles, roles, user_roles, user_role_changes, members)
2. **002_create_user_management_tables.sql** - USER-001 tables (role_permissions, user_activity_logs, system_modules)
3. **003_create_database_functions.sql** - Database functions (has_permission, get_user_permissions, etc.)
4. **004_seed_default_roles.sql** - Seed 5 default roles
5. **005_seed_default_permissions.sql** - Seed default permissions for each role
6. **006_seed_system_modules.sql** - Seed system modules (dashboard, users, content, analytics, settings)

## 🚀 How to Apply Migrations

### Option 1: Using Supabase Dashboard (Recommended for First Setup)

1. Go to your Supabase project: https://supabase.com/dashboard/project/pmqodbfhsejbvfbmsfeq
2. Click on **SQL Editor** in the left sidebar
3. Copy and paste each migration file content in order (001 → 006)
4. Click **Run** for each migration
5. Verify success by checking the **Database** tab

### Option 2: Using Supabase CLI

```bash
# 1. Link your project (if not already linked)
npx supabase link --project-ref pmqodbfhsejbvfbmsfeq

# 2. Apply all migrations
npx supabase db push

# 3. Generate TypeScript types
npx supabase gen types typescript --project-id pmqodbfhsejbvfbmsfeq > types/database.ts
```

### Option 3: Manual Execution via psql

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.pmqodbfhsejbvfbmsfeq.supabase.co:5432/postgres"

# Execute each migration
\i supabase/migrations/001_create_base_auth_tables.sql
\i supabase/migrations/002_create_user_management_tables.sql
\i supabase/migrations/003_create_database_functions.sql
\i supabase/migrations/004_seed_default_roles.sql
\i supabase/migrations/005_seed_default_permissions.sql
\i supabase/migrations/006_seed_system_modules.sql
```

## ✅ Post-Migration Verification

After applying all migrations, run these SQL queries in the SQL Editor to verify:

### 1. Check Tables Created
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- approved_emails
- members
- profiles
- role_permissions
- roles
- system_modules
- user_activity_logs
- user_role_changes
- user_roles

### 2. Check Roles Seeded
```sql
SELECT name, display_name, is_system_role
FROM roles
ORDER BY name;
```

Expected: 5 roles (super_admin, director, chair, member, guest)

### 3. Check Permissions Seeded
```sql
SELECT
  r.name as role_name,
  COUNT(rp.id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.id, r.name
ORDER BY r.name;
```

Expected counts:
- super_admin: 1 (wildcard *:*:*)
- director: 17 permissions
- chair: 9 permissions
- member: 4 permissions
- guest: 1 permission

### 4. Check Functions Created
```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

Expected functions:
- check_email_approved
- get_role_users_count
- get_user_activity_stats
- get_user_permissions
- get_user_roles
- handle_new_user
- has_permission
- is_user_guest_only
- log_role_change
- log_user_activity
- update_updated_at_column

### 5. Check System Modules
```sql
SELECT module_key, name, is_enabled, route_path
FROM system_modules
ORDER BY order_index;
```

Expected: 5 modules (dashboard, users, content, analytics, settings)

### 6. Test Permission Function
```sql
-- This should return true if super_admin exists
SELECT has_permission(
  (SELECT ur.user_id FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE r.name = 'super_admin' LIMIT 1),
  'users:profiles:view'
);
```

## 🔐 Adding Your First Super Admin

After migrations are complete, you need to add your email to approved_emails and assign super_admin role:

```sql
-- 1. Add your email to approved list
INSERT INTO approved_emails (email, status, notes)
VALUES ('your.email@jkkn.ac.in', 'active', 'First super admin');

-- 2. After logging in, assign super_admin role
-- (Replace YOUR_USER_ID with your actual user ID from auth.users)
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT
  'YOUR_USER_ID'::uuid,
  r.id,
  'YOUR_USER_ID'::uuid
FROM roles r
WHERE r.name = 'super_admin';

-- 3. Verify
SELECT
  u.email,
  r.name as role_name
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'your.email@jkkn.ac.in';
```

## 🔄 Generating TypeScript Types

After successful migration, generate TypeScript types:

### Using Supabase CLI
```bash
npx supabase gen types typescript --project-id pmqodbfhsejbvfbmsfeq > types/database.ts
```

### Or using the MCP Server (if configured)
```typescript
// In your application
await mcp__supabase__generate_typescript_types()
```

## 🧪 Testing the Authentication Flow

1. **Add test email to whitelist** (see above)
2. **Navigate to** `http://localhost:3000/auth/login`
3. **Click** "Sign in with Google"
4. **Use** your @jkkn.ac.in email
5. **Verify**:
   - Redirects to `/admin/dashboard`
   - Profile created in `profiles` table
   - Member created in `members` table
   - Guest role assigned in `user_roles` table
   - Activity logged in `user_activity_logs` table

## 📊 Database Schema Overview

### Core Authentication Tables
- **approved_emails** - Email whitelist (@jkkn.ac.in only)
- **profiles** - Extended user information
- **members** - Member-specific data
- **roles** - Role definitions (5 default roles)
- **user_roles** - User-to-role assignments (many-to-many)
- **user_role_changes** - Audit trail for role changes

### User Management Tables (USER-001)
- **role_permissions** - Permissions per role (format: module:resource:action)
- **user_activity_logs** - Comprehensive activity tracking
- **system_modules** - Module enable/disable management

### Key Functions
- **has_permission(user_id, permission)** - Check if user has permission (supports wildcards)
- **get_user_permissions(user_id)** - Get all permissions for user
- **get_user_roles(user_id)** - Get all roles for user
- **is_user_guest_only(user_id)** - Check if user only has guest role
- **check_email_approved(email)** - Check if email is in whitelist
- **log_user_activity(...)** - Log user activity

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:
- **Public read** for published/approved content
- **Self-edit** for own profile/data
- **Role-based access** for administrative operations
- **Super admin** has full access to everything

## 📝 Permission Format

Permissions follow the format: `module:resource:action`

Examples:
- `users:profiles:view` - View user profiles
- `content:pages:edit` - Edit pages
- `dashboard:widgets:manage` - Manage dashboard widgets

Wildcards are supported:
- `*:*:*` - All permissions (super_admin)
- `users:*:*` - All user management permissions
- `users:profiles:*` - All actions on user profiles

## 🐛 Troubleshooting

### Migration Fails
1. Check if tables already exist: `SELECT * FROM information_schema.tables WHERE table_schema = 'public'`
2. Drop existing tables if needed (⚠️ **This will delete data**):
   ```sql
   DROP TABLE IF EXISTS user_activity_logs, role_permissions, user_role_changes, user_roles, roles, members, profiles, approved_emails, system_modules CASCADE;
   ```
3. Re-run migrations

### Functions Not Working
1. Check function exists: `SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public'`
2. Check function permissions: `GRANT EXECUTE ON FUNCTION has_permission TO authenticated;`
3. Test function directly in SQL Editor

### RLS Blocking Queries
1. Temporarily disable RLS for testing: `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;`
2. Check policy: `SELECT * FROM pg_policies WHERE tablename = 'table_name';`
3. Re-enable after fixing: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`

## 📚 Next Steps

After successful migration:

1. ✅ **Generate TypeScript types**
2. ✅ **Add your email to approved_emails**
3. ✅ **Assign yourself super_admin role**
4. ✅ **Test authentication flow**
5. ✅ **Start implementing USER-007 and beyond** (see docs/IMPLEMENTATION_PLAN.md)

## 🔗 Related Documentation

- **Implementation Plan**: `docs/IMPLEMENTATION_PLAN.md`
- **Product Requirements**: `docs/PRD.md`
- **Architecture Guide**: `CLAUDE.md`
- **Supabase Project**: https://supabase.com/dashboard/project/pmqodbfhsejbvfbmsfeq
