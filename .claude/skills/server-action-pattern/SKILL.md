---
name: server-action-pattern
description: Create or modify a Next.js Server Action for the JKKN institution website following the project's mandatory pattern. This skill should be used when the user asks to "add a server action", "create a mutation", "wire up a form submit", "add create/update/delete logic", "save/update/delete an entity", or any data-writing function under app/actions/. Enforces the project rule that CRUD uses Server Actions (never API routes): 'use server', Zod validation, the Supabase server client, an auth check, revalidatePath, and activity logging via logActivity. Pairs with admin-crud-pages (which consumes these actions) and database-documentation-workflow (when the action needs a new table).
---

# Server Action Pattern (JKKN Institution Website)

## Purpose

Write data-mutating logic the single way this codebase does it. Every file in `app/actions/` is a
`'use server'` module that validates input with Zod, talks to Supabase through the server client,
checks auth, revalidates affected paths, and logs the activity. Following this exactly keeps mutations
secure (server-side validation, RLS-protected) and consistent with ~46 existing action files.

## Hard rules (from CLAUDE.md — non-negotiable)

1. **No API routes for CRUD.** All create/update/delete go through Server Actions.
2. **Server-side validation always.** Never trust client input — parse with Zod inside the action.
3. **Auth check before mutating.** `supabase.auth.getUser()`; bail if no user.
4. **Activity logging** for create/update/delete via `logActivity` (or an `ActivityHelpers.*` helper).
5. **Revalidate** every path whose data changed with `revalidatePath(...)`.

## When to use

- "Add a server action to save/update/delete X"
- "Wire up this form to submit" / "handle form submission"
- "Create the mutation for <entity>"
- Any new function under `app/actions/` (or `app/actions/cms/` for CMS-scoped actions)

Do **not** use for:

- Pure read-only Server Components fetching data inline (no mutation) — though shared read helpers
  (`getX`) commonly live in the same action file.
- Admin page/table scaffolding → use `admin-crud-pages` (it calls these actions).

## Workflow

Start from `templates/server-action.template.ts`. Steps:

1. **Place the file.** `app/actions/<entity>.ts`, or `app/actions/cms/<entity>.ts` for CMS features.
   Group reads (`getX`) and writes (`createX`, `updateX`, `deleteX`) for one entity in one file.
2. **`'use server'`** as the first line.
3. **Import the server client** from `@/lib/supabase/server`:
   - `createServerSupabaseClient()` — default; respects the signed-in user + RLS.
   - `createAdminSupabaseClient()` — service role, bypasses RLS. Use ONLY for admin operations that
     legitimately must (e.g. creating users). Never expose to the client.
4. **Define a Zod schema** per mutation. Enforce domain rules (e.g. emails end with `@jkkn.ac.in`
   via `.refine(...)`).
5. **Auth check:** `const { data: { user } } = await supabase.auth.getUser()`; return `Unauthorized`
   if missing.
6. **(Optional) permission check:** `checkPermission(user.id, 'module:resource:action')` from
   `./permissions` for protected operations.
7. **Validate** `formData`/args with `schema.parse(...)` inside a `try/catch` (catch `z.ZodError`).
8. **Mutate** via Supabase; handle `error` explicitly.
9. **Log activity** with `logActivity({ userId, action, module, resourceType, resourceId, metadata })`.
10. **`revalidatePath(...)`** for each affected route (e.g. the admin list AND the public page).
11. **Return a typed result.** Two shapes exist in the codebase — pick one and be consistent within
    the file: simple `{ success: boolean; error?: string; data?: T }` (see `app/actions/videos.ts`)
    or the richer `FormState` used with `useActionState`/`useFormState` (see `app/actions/users.ts`).

If the action requires a **new table/column/policy**, follow `database-documentation-workflow` FIRST
(document the SQL, then apply the migration) before writing the action.

## Verification

- `npm run build` compiles.
- Unauthenticated call returns the unauthorized result (does not mutate).
- Invalid input returns the Zod message (does not mutate).
- After a successful mutation the list/public page reflects the change (revalidation works).
- A row appears in `user_activity_logs`.

## Red-flag checklist

- [ ] First line is `'use server'`?
- [ ] Did I avoid creating an API route for this CRUD?
- [ ] Zod schema validates every input server-side?
- [ ] Auth checked before the mutation?
- [ ] `logActivity` called for create/update/delete?
- [ ] `revalidatePath` for every affected route?
- [ ] Consistent return shape within the file?
- [ ] If a new table was needed, did I document+migrate via `database-documentation-workflow` first?

## Bundled resources

- `templates/server-action.template.ts` — full read+create+update+delete action module.
- `references/conventions.md` — client choice, return shapes, logActivity enums, permission format.
