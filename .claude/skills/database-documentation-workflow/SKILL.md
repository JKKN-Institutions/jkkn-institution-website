---
name: database-documentation-workflow
description: Enforce the JKKN project's MANDATORY document-first database workflow. This skill should be used before/when the user asks to "run a migration", "apply SQL", "add a table/column", "create an RLS policy", "add a function or trigger", "seed CMS data", "publish a page via SQL", or make any schema or data change to a Supabase project. It requires documenting the SQL in the docs/database project folder BEFORE executing it via the Supabase MCP tools, then syncing the change across institution databases. Covers the numbered-file convention, file mapping, per-institution MCP tool prefixes/project IDs, and the multi-institution sync protocol. Pairs with supabase-expert (for writing the SQL itself) and server-action-pattern (when a new table backs an action).
---

# Database Documentation Workflow (JKKN — DOCUMENT FIRST, EXECUTE SECOND)

## Purpose

This project keeps each Supabase change replayable and traceable because there is **no shared
database** — six institutions each have their own Supabase project, and changes must be re-applied to
each one. The rule (from CLAUDE.md, marked NON-NEGOTIABLE) is: **write the SQL into the docs folder
first, then run the migration.** This skill encodes that order plus the file mapping and sync steps.

## The rule

> DOCUMENT FIRST → EXECUTE SECOND → SYNC TO OTHER INSTITUTIONS.

Never call an `apply_migration` / `execute_sql` MCP tool before the SQL exists in
`docs/database/<project>/`. Documentation is the source of truth; the live DB is downstream of it.

## When to use

Any database change, including data-only seeds:

- "Add a table / column / index"
- "Create / change an RLS policy, function, or trigger"
- "Seed a CMS page / publish a page / insert rows via SQL"
- "Run this migration on Main / Engineering / Dental"

## Step-by-step

### Step 0 — Pick the target project + its docs folder

| Institution | Project ID | MCP tool prefix | Docs folder |
|-------------|-----------|-----------------|-------------|
| Main | `pmqodbfhsejbvfbmsfeq` | `mcp__Main_Supabase_Project__` | `docs/database/main-supabase/` |
| Engineering | `kyvfkyjmdbtyimtedkie` | `mcp__Engineering_College_Supabase_Project__` | `docs/database/engineering-college/` |
| Dental | `wnmyvbnqldukeknnmnpl` | `mcp__Dental_College_Supabase_Project__` | `docs/database/dental-supabase/` |

(Pharmacy, Arts & Science, Nursing: see CLAUDE.md; create the folder mirroring this structure when set up.)

### Step 1 — Document the SQL FIRST

Choose the file by change type (see `references/file-mapping.md`):

| Change type | File |
|-------------|------|
| New table | `00-tables.sql` |
| Function | `01-functions.sql` |
| RLS policy | `02-rls-policies.sql` |
| Trigger | `03-triggers.sql` |
| Foreign key | `04-foreign-keys.sql` |
| Index | `05-indexes.sql` |
| Data fix / seed / feature change | next **numbered** file, e.g. `41-<description>.sql` |

For structural objects, append to the matching base file. For a discrete migration/seed/feature, create
the **next sequential numbered** file (look at the highest existing number in the folder and add one —
Main is past `40-…`, Engineering past `33-…`). Prepend the header block from
`templates/migration-doc-header.sql` (purpose, date, dependencies, security).

### Step 2 — Execute the migration

Only after the SQL is saved:

- DDL / multi-statement → `mcp__<Project>__apply_migration({ name, query })`. Migration `name` should be
  snake_case and mirror the doc filename's description.
- Single-row inserts / quick data fixes → `mcp__<Project>__execute_sql({ query })`.

Verify success (`list_migrations`, or `get_advisors` / `get_logs` if something looks off).

### Step 3 — Generate types (schema changes only)

After a structural change, regenerate TS types: `mcp__<Project>__generate_typescript_types`.

### Step 4 — Sync to other institutions (when applicable)

If the change should exist on every institution (most schema changes; some content):

1. Copy the SQL into each target institution's docs folder (same numbered convention there).
2. Apply via that institution's MCP prefix.
3. Document any per-institution variation in that folder's `SYNC-LOG.md`.

Content/SEO seeds are often **institution-specific** (each DB has its own content) — sync only when it
truly applies everywhere.

## Verification / red-flag checklist

- [ ] SQL written to `docs/database/<project>/` BEFORE running any MCP migration?
- [ ] Correct file chosen (base file for objects, next numbered file for migrations/seeds)?
- [ ] Header block filled in (purpose, date, dependencies, security)?
- [ ] Used the correct MCP prefix for the intended project?
- [ ] New table → RLS enabled + policies documented in `02-rls-policies.sql`?
- [ ] Schema change → regenerated TypeScript types?
- [ ] Multi-institution change → applied + logged for each institution?

## Bundled resources

- `templates/migration-doc-header.sql` — the required doc header + a worked example.
- `references/file-mapping.md` — full file map, numbering rules, project IDs, sync protocol, RLS reminder.
