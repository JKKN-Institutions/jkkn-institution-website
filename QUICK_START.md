# 🚀 Quick Start - Authentication Setup

## ⚡ 5-Minute Setup

### 1️⃣ Open Supabase Dashboard
https://supabase.com/dashboard/project/pmqodbfhsejbvfbmsfeq → SQL Editor

### 2️⃣ Run Migrations (Copy-Paste Each)

```sql
-- MIGRATION 1: Base Tables (30 seconds)
-- Copy from: supabase/migrations/001_create_base_auth_tables.sql
-- Paste in SQL Editor → Run

-- MIGRATION 2: User Management Tables (10 seconds)
-- Copy from: supabase/migrations/002_create_user_management_tables.sql
-- Paste in SQL Editor → Run

-- MIGRATION 3: Functions (20 seconds)
-- Copy from: supabase/migrations/003_create_database_functions.sql
-- Paste in SQL Editor → Run

-- MIGRATION 4: Roles (5 seconds)
-- Copy from: supabase/migrations/004_seed_default_roles.sql
-- Paste in SQL Editor → Run

-- MIGRATION 5: Permissions (10 seconds)
-- Copy from: supabase/migrations/005_seed_default_permissions.sql
-- Paste in SQL Editor → Run

-- MIGRATION 6: Modules (5 seconds)
-- Copy from: supabase/migrations/006_seed_system_modules.sql
-- Paste in SQL Editor → Run
```

### 3️⃣ Add Your Email

```sql
-- Replace with YOUR email
INSERT INTO approved_emails (email, status)
VALUES ('your.email@jkkn.ac.in', 'active');
```

### 4️⃣ Test Login

```bash
npm run dev
# Go to: http://localhost:3000/auth/login
# Sign in with your @jkkn.ac.in email
```

### 5️⃣ Get Your User ID

After login:
```sql
SELECT id, email FROM auth.users
WHERE email = 'your.email@jkkn.ac.in';
```

### 6️⃣ Promote to Super Admin

```sql
-- Remove guest role
DELETE FROM user_roles
WHERE user_id = 'YOUR_USER_ID'::uuid;

-- Add super_admin role
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT 'YOUR_USER_ID'::uuid, id, 'YOUR_USER_ID'::uuid
FROM roles WHERE name = 'super_admin';
```

### 7️⃣ Generate Types

```bash
npx supabase gen types typescript --project-id pmqodbfhsejbvfbmsfeq > types/database.ts
```

## ✅ Verification

```sql
-- Should return 9 tables
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public';

-- Should return 5 roles
SELECT COUNT(*) FROM roles;

-- Should return your super_admin role
SELECT r.name FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'your.email@jkkn.ac.in';

-- Should return true
SELECT has_permission(
  (SELECT id FROM auth.users WHERE email = 'your.email@jkkn.ac.in'),
  'users:profiles:edit'
);
```

## 🎉 Done!

Your authentication system is ready!

**Need detailed instructions?** → `supabase/setup-database.md`

**What's next?** → `docs/IMPLEMENTATION_PLAN.md` (USER-009 onwards)

**Full summary?** → `SETUP_COMPLETE.md`
