# Engineering College Database Sync Instructions

**IMPORTANT:** These instructions must be followed AFTER restarting Claude Code to enable the Engineering College Supabase MCP server tools.

## Context

Engineering College has been successfully added to the multi-institution architecture with:

- ✅ Institution switcher configured
- ✅ npm script `dev:engineering` added
- ✅ Service key file created
- ✅ Documentation infrastructure created
- ✅ MCP server configured in `.mcp.json`
- ❌ **Database schema NOT yet synced** (requires MCP tools)

## Why Restart is Needed

The Engineering College Supabase MCP server is configured in `.mcp.json` but not loaded in the current Claude Code session. Restarting Claude Code will:

1. Detect the new "Engineering College Supabase Project" MCP server
2. Load the MCP tools with prefix `mcp__Engineering_College_Supabase_Project__`
3. Enable database operations on the Engineering Supabase project

## Steps to Complete After Restart

### Step 1: Verify MCP Tools are Available

After restarting Claude Code, verify the Engineering MCP tools are loaded:

```typescript
// Try listing tables - this should work after restart
mcp__Engineering_College_Supabase_Project__list_tables()
```

**Expected:** Returns list of tables (may be empty if fresh project)

### Step 2: Check Current Database State

```typescript
// Check existing tables
mcp__Engineering_College_Supabase_Project__list_tables()

// Check existing migrations
mcp__Engineering_College_Supabase_Project__list_migrations()

// Check for security advisories
mcp__Engineering_College_Supabase_Project__get_advisors({ type: "security" })
```

### Step 3: Read Main Supabase Documentation

Read the source of truth files from Main Supabase:

1. `docs/database/main-supabase/01-functions.sql` (~51 functions)
2. `docs/database/main-supabase/02-rls-policies.sql` (~126 policies)
3. `docs/database/main-supabase/03-triggers.sql` (~41 triggers)
4. `docs/database/main-supabase/04-foreign-keys.sql` (~48 foreign keys)

### Step 4: Determine Migration Strategy

**Option A: If Engineering database is EMPTY (no tables exist)**

You need to apply table creation migrations first from Main Supabase:

```typescript
// Get list of all migrations from Main
mcp__Main_Supabase_Project__list_migrations()

// Identify and apply table creation migrations to Engineering
// (This will require manual SQL extraction and application)
```

**Option B: If Engineering database has tables already**

Skip to applying functions, RLS policies, triggers, and foreign keys.

### Step 5: Apply Functions (CRITICAL - Must be First)

Functions must be created before RLS policies because policies reference functions like `is_super_admin()` and `has_permission()`.

```typescript
// Read the functions documentation
Read({ file_path: "docs/database/main-supabase/01-functions.sql" })

// Apply all functions via migration
mcp__Engineering_College_Supabase_Project__apply_migration({
  name: "001_initial_functions_from_main",
  query: `[SQL from 01-functions.sql - FULL CONTENT]`
})

// Verify critical functions exist
mcp__Engineering_College_Supabase_Project__execute_sql({
  query: `
    SELECT proname, prokind
    FROM pg_proc
    WHERE proname IN (
      'is_super_admin',
      'has_permission',
      'get_user_roles',
      'get_dashboard_stats'
    )
    ORDER BY proname;
  `
})
```

### Step 6: Apply RLS Policies

```typescript
// Read the RLS policies documentation
Read({ file_path: "docs/database/main-supabase/02-rls-policies.sql" })

// Apply all RLS policies via migration
mcp__Engineering_College_Supabase_Project__apply_migration({
  name: "002_initial_rls_policies_from_main",
  query: `[SQL from 02-rls-policies.sql - FULL CONTENT]`
})

// Verify policies exist
mcp__Engineering_College_Supabase_Project__execute_sql({
  query: "SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public' LIMIT 20;"
})
```

### Step 7: Apply Triggers

```typescript
// Read the triggers documentation
Read({ file_path: "docs/database/main-supabase/03-triggers.sql" })

// Apply all triggers via migration
mcp__Engineering_College_Supabase_Project__apply_migration({
  name: "003_initial_triggers_from_main",
  query: `[SQL from 03-triggers.sql - FULL CONTENT]`
})

// Verify triggers exist
mcp__Engineering_College_Supabase_Project__execute_sql({
  query: "SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public' LIMIT 20;"
})
```

### Step 8: Apply Foreign Keys

```typescript
// Read the foreign keys documentation
Read({ file_path: "docs/database/main-supabase/04-foreign-keys.sql" })

// Apply all foreign keys via migration
mcp__Engineering_College_Supabase_Project__apply_migration({
  name: "004_initial_foreign_keys_from_main",
  query: `[SQL from 04-foreign-keys.sql - FULL CONTENT]`
})

// Verify foreign keys exist
mcp__Engineering_College_Supabase_Project__execute_sql({
  query: `
    SELECT
      tc.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
    LIMIT 20;
  `
})
```

### Step 9: Update Engineering Documentation Files

After each migration succeeds, update the corresponding Engineering documentation file:

1. Copy the full SQL from Main documentation
2. Paste into Engineering documentation file (01-functions.sql, 02-rls-policies.sql, etc.)
3. Keep header metadata (sync date, source)
4. Update SYNC-LOG.md with migration details

### Step 10: Generate TypeScript Types

```typescript
mcp__Engineering_College_Supabase_Project__generate_typescript_types()
```

This generates TypeScript types for the Engineering schema that will be used when `NEXT_PUBLIC_INSTITUTION_ID=engineering`.

### Step 11: Final Verification

```typescript
// List all tables
mcp__Engineering_College_Supabase_Project__list_tables()

// Check function count
mcp__Engineering_College_Supabase_Project__execute_sql({
  query: "SELECT count(*) as function_count FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');"
})

// Check RLS policy count
mcp__Engineering_College_Supabase_Project__execute_sql({
  query: "SELECT count(*) as policy_count FROM pg_policies WHERE schemaname = 'public';"
})

// Check trigger count
mcp__Engineering_College_Supabase_Project__execute_sql({
  query: "SELECT count(*) as trigger_count FROM information_schema.triggers WHERE trigger_schema = 'public';"
})

// Security check
mcp__Engineering_College_Supabase_Project__get_advisors({ type: "security" })
```

**Expected Results:**
- ~60+ tables (same as Main Supabase)
- ~51 functions
- ~126 RLS policies
- ~41 triggers
- No critical security advisories

### Step 12: Test Local Development Switcher

```bash
# Test switching to Engineering
npm run dev:engineering
```

Verify `.env.local` is generated with:
- `NEXT_PUBLIC_INSTITUTION_ID=engineering`
- `NEXT_PUBLIC_SUPABASE_URL=https://kyvfkyjmdbtyimtedkie.supabase.co`
- Correct anon key and service key

### Step 13: Update SYNC-LOG.md

Mark all verification checkboxes as complete in `docs/database/engineering-college/SYNC-LOG.md`.

## Important Notes

### Migration Order Matters

**Correct Order:**
1. Tables (if missing)
2. Functions (dependencies for RLS)
3. RLS Policies
4. Triggers
5. Foreign Keys

**Why:** RLS policies reference functions, so functions must exist first. Triggers and foreign keys can come last.

### Handling Errors

**If migration fails:**
1. Read the error message carefully
2. Check if dependencies are missing (e.g., tables, functions)
3. Apply missing dependencies first
4. Retry the migration

**Common Issues:**
- **"function does not exist"** → Apply functions first
- **"table does not exist"** → Apply table creation migrations first
- **"duplicate object"** → Object already exists, skip or use `IF NOT EXISTS`

### Idempotency

Use `CREATE OR REPLACE FUNCTION` and `IF NOT EXISTS` clauses where possible to make migrations idempotent (safe to run multiple times).

## Success Criteria

- [x] Configuration files updated
- [x] Documentation infrastructure created
- [ ] MCP tools available after restart
- [ ] Database schema synced from Main
- [ ] All verification checks pass
- [ ] Local development switcher works
- [ ] Application connects to Engineering database

## Next Steps After Completion

1. **Test the application locally with Engineering database**
2. **Create Vercel project for Engineering College**
3. **Configure custom domain: engg.jkkn.ac.in**
4. **Update GitHub Actions for migration sync**
5. **Share service key securely with team**

---

**Last Updated:** 2026-01-03
**Status:** Awaiting Claude Code restart and database sync
