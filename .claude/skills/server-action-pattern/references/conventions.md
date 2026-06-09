# Server Action Conventions (JKKN)

Source of truth: files under `app/actions/`. Read `app/actions/videos.ts` (simple result shape)
and `app/actions/users.ts` (FormState shape + admin client + permissions) before writing.

## Supabase client choice (`lib/supabase/server.ts`)

- `createServerSupabaseClient()` — **default.** Runs as the signed-in user; RLS is enforced. Both
  functions are async — always `await` them.
- `createAdminSupabaseClient()` — service role, **bypasses RLS**. Use only for legitimate admin
  operations (creating auth users, cross-user reads). Never return its data paths to untrusted callers
  and never import it into client code.

## Two accepted return shapes (be consistent within a file)

1. Simple (most action files, e.g. `videos.ts`):
   ```ts
   { success: boolean; error?: string; data?: T }
   ```
2. `FormState` for `useActionState`/`useFormState` forms (e.g. `users.ts`):
   ```ts
   type FormState = {
     success?: boolean
     message?: string
     errors?: Record<string, string[]>   // field -> messages (from zod flatten)
     errorCode?: string
     errorDetails?: string
     correlationId?: string
   }
   ```
   With `FormState`, signature is `(prevState: FormState, formData: FormData) => Promise<FormState>`.

## Validation

- One Zod schema per mutation (or a shared schema with `.partial()` for updates).
- Parse INSIDE a `try/catch`; catch `z.ZodError` and surface `error.issues[0].message` (simple shape)
  or `error.flatten().fieldErrors` (FormState shape).
- Domain rule example (JKKN email): `z.string().email().refine(e => e.endsWith('@jkkn.ac.in'), {...})`.

## Activity logging (`lib/utils/activity-logger.ts`)

`logActivity({ userId, action, module, resourceType?, resourceId?, metadata?, description? })`.
It never throws (failures are swallowed and logged), so it cannot break the main mutation.

- `action` (`ActivityAction`): `create | update | delete | view | login | logout | export | import |
  publish | unpublish | approve | reject | assign | unassign` (or any string).
- `module` (`ActivityModule`): `users | roles | cms | pages | media | events | announcements |
  dashboard | settings | auth` (or any string).
- Prefer a prebuilt helper from `ActivityHelpers` when one fits (e.g. `ActivityHelpers.pageCreated`,
  `userCreated`, `roleCreated`).

## Permissions (`app/actions/permissions.ts`)

- Format: `module:resource:action` (e.g. `users:profiles:edit`, `cms:widgets:create`).
- Server-side is authoritative. Client `usePermission` hooks are for UI affordances only.

## Revalidation

- Call `revalidatePath` for EVERY route whose data changed. Mutations that affect both admin and
  public views revalidate both (e.g. `revalidatePath('/admin/videos')` AND `revalidatePath('/')`).
- Use `revalidatePath('/path', 'layout')` when a layout-level segment must refresh.

## Don'ts

- Don't create `app/api/.../route.ts` for CRUD — Server Actions only.
- Don't mutate before the auth check.
- Don't validate only on the client.
- Don't forget `created_by: user.id` on inserts where the column exists.
