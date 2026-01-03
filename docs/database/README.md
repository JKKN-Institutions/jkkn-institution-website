# Database Documentation

This folder contains complete database schema documentation for all JKKN Institution Supabase projects.

## Folder Structure

```
docs/database/
├── README.md                 # This file
├── main-supabase/           # Main Supabase (Source of Truth)
│   ├── README.md
│   ├── 01-functions.sql     # 51 functions
│   ├── 02-rls-policies.sql  # 126+ policies
│   ├── 03-triggers.sql      # 41 triggers
│   └── 04-foreign-keys.sql  # 48 foreign keys
└── dental-college/          # Dental College Supabase
    ├── README.md
    └── SYNC-LOG.md          # Migration/fix history
```

## Supabase Projects

| Institution | Project ID | Status |
|-------------|-----------|--------|
| **Main (Reference)** | `pmqodbfhsejbvfbmsfeq` | Source of Truth |
| Dental College | `wnmyvbnqldukeknnmnpl` | Syncing |
| Arts & Science | TBD | Not Started |
| Engineering | TBD | Not Started |
| Pharmacy | TBD | Not Started |
| Nursing | TBD | Not Started |

## Workflow

### Making Database Changes

1. **Document FIRST** in `main-supabase/` folder
2. **Execute** via Supabase MCP on Main project
3. **Verify** the change works
4. **Sync** to other institution databases
5. **Log** sync in each institution's `SYNC-LOG.md`

### Syncing to Other Institutions

1. Check `main-supabase/` for the correct SQL
2. Apply migration to target institution via MCP
3. Document in institution's `SYNC-LOG.md`
4. Test the change works in that institution

## Key Files

| File | Purpose |
|------|---------|
| `main-supabase/01-functions.sql` | All PostgreSQL functions |
| `main-supabase/02-rls-policies.sql` | All RLS policies |
| `main-supabase/03-triggers.sql` | All triggers |
| `main-supabase/04-foreign-keys.sql` | All foreign key relationships |
| `dental-college/SYNC-LOG.md` | Dental College migration history |

## Critical Functions

These functions are essential for the permission system:

| Function | Purpose | Security |
|----------|---------|----------|
| `is_super_admin(uuid)` | Check if user is super admin | SECURITY DEFINER |
| `has_permission(uuid, text)` | Check if user has permission | SECURITY DEFINER |
| `get_user_roles(uuid)` | Get all roles for a user | SECURITY DEFINER |

## Common Issues & Fixes

### User List Not Showing

**Cause:** `user_roles_user_id_fkey` references `auth.users` instead of `profiles`

**Fix:**
```sql
ALTER TABLE public.user_roles DROP CONSTRAINT user_roles_user_id_fkey;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
```

### Cannot Add Approved Emails

**Cause:** Missing RLS policy for super_admin INSERT

**Fix:**
```sql
CREATE POLICY "Only super_admin can manage approved emails"
ON public.approved_emails FOR ALL TO public
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));
```

## Last Updated

- **Date:** 2026-01-03
- **Updated By:** Claude Code
