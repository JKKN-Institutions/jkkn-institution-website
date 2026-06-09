---
name: admin-crud-pages
description: Scaffold an admin CRUD module for the JKKN institution website following the repeated four-route pattern under app/(admin)/admin/. This skill should be used when the user asks to "add an admin page", "create a management screen", "build a CRUD module", "add a list/table page in the admin panel", "let admins manage an entity", or add admin UI for a new entity. Produces a server-component list page (glass-card header + stat cards + TanStack table), plus new and [id]/edit form pages, all wired to Server Actions. Composes server-action-pattern (the data layer), advanced-tables-components (the table), and database-documentation-workflow (if a new table is needed).
---

# Admin CRUD Pages (JKKN Institution Website)

## Purpose

Add a complete admin management module the same way every existing one is built (users, roles, blog,
videos, components, templates). Each entity gets the same four routes, a server-component list page that
fetches via a Server Action and renders a header + stat cards + a client table, and form pages for
create/edit. Following the pattern keeps the admin panel consistent and lets the table, actions, and
permissions reuse existing infrastructure.

## When to use

- "Add an admin page / management screen for <entity>"
- "Build a CRUD module" / "let admins manage <entity>"
- "Add a list + table page in the admin panel"

Do **not** use for:

- Public marketing pages → `cms-page-creation`
- A single reusable display block → `cms-block-creation`
- The mutation logic itself → `server-action-pattern` (this skill calls those actions)

## Prerequisite / companion skills

- **`advanced-tables-components`** (MANDATORY for the table) — TanStack Table v8, server-side
  pagination/sort/filter, row selection, bulk actions, export. Load it before writing the table.
- **`server-action-pattern`** — for `getX`/`createX`/`updateX`/`deleteX`. Build/verify these first; the
  list page calls `getX`, the forms call the mutations.
- **`database-documentation-workflow`** — if the entity needs a new table, document + migrate FIRST.
- **`jkkn-design-system`** — for the glass-card / brand styling used across admin pages.

## The four-route pattern

Under `app/(admin)/admin/<entity>/`:

| Route | File | Type | Purpose |
|-------|------|------|---------|
| `/admin/<entity>` | `page.tsx` | Server Component | List: header + stat cards + table |
| `/admin/<entity>/new` | `new/page.tsx` | mostly Client | Create form → `createX` |
| `/admin/<entity>/[id]` | `[id]/page.tsx` | Server Component | Detail (optional for simple entities) |
| `/admin/<entity>/[id]/edit` | `[id]/edit/page.tsx` | mostly Client | Edit form → `updateX` |

The table itself is a co-located **client** component, conventionally `<entity>-table.tsx` in the same
folder (e.g. `app/(admin)/admin/videos/videos-table.tsx`).

## Workflow

1. **Data layer first.** Ensure Server Actions exist (`server-action-pattern`). If a new table is
   needed, run `database-documentation-workflow` before anything else.
2. **List page** — from `templates/list-page.template.tsx`: `async` server component, `await getX()`,
   render the glass-card header (icon tile + title + "Add" button linking to `/new`), stat cards, and
   the client table inside a `glass-card` wrapper.
3. **Table** — from `templates/table.template.tsx`, but follow `advanced-tables-components` for the real
   implementation (columns, server-side ops, selection, bulk delete, export). Wire row actions to
   `updateX`/`deleteX`.
4. **Forms** — `new/page.tsx` and `[id]/edit/page.tsx`. Use React Hook Form + Zod (mirroring the
   action's schema) and submit through the Server Action. Show success/error from the action result;
   `router.push('/admin/<entity>')` on success.
5. **Permissions** — gate sensitive operations server-side in the actions
   (`module:resource:action`); use `usePermission` only to hide/disable UI.
6. **Navigation** — add the entity to the admin sidebar/nav config so the page is reachable.

## Verification

- `npm run build` compiles.
- `/admin/<entity>` lists rows; stat cards show correct counts.
- Create → row appears (revalidation works); edit → changes persist; delete → row removed.
- Table sort/filter/pagination work (server-side per `advanced-tables-components`).
- Unauthorized/guest users are blocked by middleware + action checks.
- Mobile + dark mode render correctly.

## Red-flag checklist

- [ ] Did I load `advanced-tables-components` before building the table?
- [ ] Do the Server Actions exist and follow `server-action-pattern`?
- [ ] New table → documented + migrated via `database-documentation-workflow` first?
- [ ] Are all needed routes present (list, new, edit; detail if applicable)?
- [ ] Is the table a client component, the list page a server component?
- [ ] Permissions enforced server-side, not just hidden in UI?
- [ ] Entity added to admin navigation?

## Bundled resources

- `templates/list-page.template.tsx` — server-component list page (header + stats + table).
- `templates/table.template.tsx` — client table skeleton (expand via `advanced-tables-components`).
- `references/route-structure.md` — routes, naming, glass-card markup, form + nav wiring.
