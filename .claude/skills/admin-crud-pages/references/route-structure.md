# Admin CRUD Route Structure & Conventions (JKKN)

Source of truth: existing modules under `app/(admin)/admin/` — `users/`, `roles/`, `blog/`,
`videos/`, `content/components/`, `content/templates/`. Read `videos/` for the simplest complete example.

## Routes per entity

```
app/(admin)/admin/<entity>/
├── page.tsx              # Server Component — list (header + stat cards + <Entity>Table)
├── <entity>-table.tsx    # Client Component — the table (TanStack via advanced-tables-components)
├── new/
│   └── page.tsx          # Create form (client) -> createX server action
├── [id]/
│   ├── page.tsx          # Detail view (optional; skip for simple entities)
│   └── edit/
│       └── page.tsx      # Edit form (client) -> updateX server action
```

Bulk/secondary screens seen in the codebase (add as needed): `categories/`, `tags/`, `trash/`,
`[id]/activity/`, `approved-emails/`.

## Server vs client split

- **List + detail pages are Server Components.** They `await getX()` directly (no `useEffect`).
- **Tables and forms are Client Components** (`'use client'`) — they need state, transitions, and
  event handlers.
- Server Actions already `revalidatePath('/admin/<entity>')`, so after a mutation call
  `router.refresh()` (or rely on navigation) to re-fetch.

## Glass-card header markup (used across admin pages)

- Outer: `glass-card rounded-2xl p-6`.
- Icon tile: `w-12 h-12 rounded-xl bg-gradient-to-br from-<color>-500 to-<color>-600 ...` with a white
  Lucide icon.
- Title `text-2xl font-bold text-foreground`; subtitle `text-sm text-muted-foreground`.
- Primary action: `<Button asChild>` wrapping `<Link href="/admin/<entity>/new">` with a `Plus` icon.
- Stat cards: `grid grid-cols-1 sm:grid-cols-3 gap-4`, each a `glass-card rounded-xl p-4`.

## Forms

- React Hook Form + Zod resolver; mirror the Zod schema from the Server Action so client and server
  validation agree.
- Submit by calling the Server Action (pass `FormData` or typed values per the action's signature).
- Read `{ success, error }` (or `FormState`) from the result; show errors inline; on success
  `router.push('/admin/<entity>')`.

## Permissions

- Enforce server-side in the actions/middleware using `module:resource:action`
  (e.g. `widgets:items:edit`). The `usePermission` hook only hides/disables UI — never the sole guard.
- Guests are limited by middleware; admin routes are already protected at the route-group level.

## Navigation

- Register the new entity in the admin sidebar/nav config so it is reachable (search the repo for where
  existing admin links like `/admin/videos` are defined and add the new entry alongside).

## Table (delegate to advanced-tables-components)

The bundled `table.template.tsx` is only a skeleton. For production tables — server-side pagination,
sorting, filtering, row selection, bulk delete, and CSV/Excel export — follow the
`advanced-tables-components` skill. Wire row-level edit to `/admin/<entity>/[id]/edit` and delete/bulk
actions to the `deleteX` server action.
