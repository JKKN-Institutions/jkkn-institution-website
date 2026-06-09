# Database Docs: File Mapping, Numbering & Sync (JKKN)

Source of truth: `docs/database/` and CLAUDE.md "Mandatory Database Documentation Workflow".

## Folder structure (per Supabase project)

```
docs/database/
├── main-supabase/            # Main (pmqodbfhsejbvfbmsfeq)
│   ├── 00-tables.sql
│   ├── 01-functions.sql
│   ├── 02-rls-policies.sql
│   ├── 03-triggers.sql
│   ├── 04-foreign-keys.sql
│   ├── 05-indexes.sql
│   ├── NN-<description>.sql   # sequential migrations / seeds / feature changes
│   └── README.md
├── engineering-college/      # Engineering (kyvfkyjmdbtyimtedkie) + SYNC-LOG.md
└── dental-supabase/          # Dental (wnmyvbnqldukeknnmnpl)
```

## File mapping by change type

| Change type | Documentation file |
|-------------|-------------------|
| New table | `00-tables.sql` (+ RLS in `02`, triggers in `03`, FKs in `04`, indexes in `05`) |
| Function | `01-functions.sql` |
| RLS policy | `02-rls-policies.sql` |
| Trigger | `03-triggers.sql` |
| Foreign key | `04-foreign-keys.sql` |
| Index | `05-indexes.sql` |
| Data fix / content seed / page publish / feature change | next `NN-<description>.sql` |

## Numbering rule for `NN-` files

- These are an append-only, ordered ledger (a poor-man's migration history) because changes must be
  replayed across separate databases.
- Pick the next number by inspecting the highest existing file in that folder, then +1. Zero-pad to two
  digits. As of recent history: `main-supabase/` is past `40-…`, `engineering-college/` past `33-…`.
- Name describes the change, kebab-case: `41-add-scholarship-banner.sql`.
- Never renumber or edit an already-applied file's SQL; add a new file for follow-up changes.

## Project IDs & MCP tool prefixes

| Institution | Project ID | MCP prefix |
|-------------|-----------|------------|
| Main | `pmqodbfhsejbvfbmsfeq` | `mcp__Main_Supabase_Project__` |
| Engineering | `kyvfkyjmdbtyimtedkie` | `mcp__Engineering_College_Supabase_Project__` |
| Dental | `wnmyvbnqldukeknnmnpl` | `mcp__Dental_College_Supabase_Project__` |
| Pharmacy | `rwskookarbolpmtolqkd` | (configure when active) |
| Arts & Science | TBD | (setup pending) |
| Nursing | TBD | (setup pending) |

Useful MCP tools per project: `apply_migration`, `execute_sql`, `list_migrations`, `list_tables`,
`generate_typescript_types`, `get_advisors`, `get_logs`.

## Multi-institution sync protocol

1. Document + apply on **Main** first; verify.
2. For each other institution the change applies to: copy the SQL into that folder (same `NN-`
   convention), apply via its MCP prefix, and note it in that folder's `SYNC-LOG.md`.
3. Record any per-institution variation explicitly.
4. Content/SEO seeds are usually institution-specific (each DB owns its content) — sync structural
   changes broadly, content selectively.

## RLS reminder (new tables)

Every new table must have RLS enabled and policies documented in `02-rls-policies.sql`. Check policies
with the project's `get_advisors` (security) after applying. For writing policies/functions safely,
load the `supabase-expert` skill.

## Apply-vs-execute

- `apply_migration({ name, query })` — DDL or multi-statement migrations (recorded in migration history).
- `execute_sql({ query })` — one-off single-row inserts / quick data fixes.
