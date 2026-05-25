# Faculty Profile — MyJKKN Sync Process

**Scope:** JKKN College of Engineering and Technology (Engineering site only).
**Status:** Production.
**Owner of source data:** MyJKKN Staff API.
**Owner of cache:** Engineering Supabase (`public.faculty` table).
**Last verified against code:** 2026-05-23.

---

## 1. One-paragraph summary

The public Engineering site does **not** edit faculty data. MyJKKN is the single source of truth.
Every 15 minutes (and on demand), a Vercel Cron job pulls all active HODs + the Principal of the
Engineering institution from the MyJKKN Staff API, transforms each row into our local schema,
re-hosts the profile photo to our own Supabase Storage bucket, runs a **completeness rule** to
decide whether the row is publishable, then upserts into `public.faculty`. Rows that disappear
from the API are soft-deleted locally. Slug renames are recorded so middleware can 301-redirect
old URLs. The public site reads `public.faculty` exactly as before — it has no idea sync exists.

---

## 2. Architectural decisions (why it looks the way it does)

| Decision | Rationale |
|---|---|
| **Pull, not push** | MyJKKN webhooks aren't built yet. A 15-min cron is the smallest reliable interval Vercel offers and is acceptable RPO for a public marketing site. |
| **Replace, don't merge** | Local `faculty` table is a pure cache for API-managed rows. No `source` column, no manual edits to synced rows. Manual edits are not detectable/mergeable; allowing them creates undefined behavior. |
| **One adapter, one boundary** | All shape-translation lives in `lib/adapters/staff-to-faculty.ts`. If MyJKKN's contract changes, exactly one file changes. |
| **Photo re-hosting** | MyJKKN serves photos from their own Supabase bucket. If their bucket goes down, our public site stays up because `faculty.photo_url` points at ours. |
| **Auto-draft on incomplete data** | A published MyJKKN row missing photo/summary/qualifications/email/designation/department becomes `status='draft'` locally. Public pages filter `status='published'`, so drafts are invisible. Forcing function for data quality. |
| **Soft-delete orphans, never hard-delete** | Preserves FK integrity with `faculty_achievements` and is fully reversible (re-activating in MyJKKN restores the row on next tick). |
| **Slug-collision guard** | The `faculty` table has `UNIQUE(slug)`. If a manual legacy row holds the slug an API row wants, the legacy row is renamed `…-legacy-<id8>` and soft-deleted so the upsert can land. |

---

## 3. Trigger surface (3 entry points → 1 orchestrator)

All three paths call `syncFacultyFromMyJKKN()` in `lib/sync/faculty-sync.ts`.

| Path | File | Auth | When it fires |
|---|---|---|---|
| **Scheduled** | `app/api/cron/sync-faculty-from-api/route.ts` | `Authorization: Bearer ${CRON_SECRET}` | Every 15 min via `vercel.json` cron `*/15 * * * *` |
| **HMAC / webhook** | `app/api/sync-faculty-now/route.ts` | `x-sync-secret` header, constant-time compared to `FACULTY_SYNC_SECRET` | Ad-hoc; reserved for a future MyJKKN webhook |
| **Admin button** | `app/(admin)/admin/api/trigger-sync/route.ts` | Logged-in user with `@jkkn.ac.in` email | "Sync from MyJKKN" button in `/admin/faculty`. Secret is never sent to the browser — the route runs the sync inline. |

★ Insight ─────────────────────────────────────
The admin proxy exists specifically so the browser never sees `FACULTY_SYNC_SECRET`. The button POSTs to a same-origin route that re-uses the existing session cookie for auth, then calls the orchestrator directly. This avoids any "leak secret to client" footgun.
─────────────────────────────────────────────────

---

## 4. The pipeline, step by step

`syncFacultyFromMyJKKN()` (in `lib/sync/faculty-sync.ts`) runs:

```
1. Pull API rows
       │  listEngineeringLeadership()  ← HODs + Principal, deduped by UUID
       ▼
2. Snapshot local slugs for rename detection
       │  SELECT id, slug FROM faculty WHERE synced_from_api = true
       ▼
3. FOR EACH api row:
       │
       │  3a. Adapt        →  staffToFacultyRow(apiRow)
       │       │              15 shape transformations (see §6)
       │       ▼
       │  3b. Rehost photo →  rehostFacultyPhoto(apiUrl, staffId, apiUuid)
       │       │              Download from MyJKKN → upload to our bucket
       │       │              Soft-fails to null on any error
       │       ▼
       │  3c. Completeness →  checkFacultyCompleteness(formData, photoUrl)
       │       │              status = 'published' only if
       │       │                isComplete && apiStatus === 'published'
       │       │              else 'draft'
       │       ▼
       │  3d. Slug rename →  if local.slug != api.slug
       │       │              UPSERT faculty_slug_history(old_slug → new_slug)
       │       ▼
       │  3e. Slug collision →  if non-API row holds api.slug
       │       │                rename it `<slug>-legacy-<id8>`, soft-delete
       │       ▼
       │  3f. Upsert      →   INSERT … ON CONFLICT (id) DO UPDATE
       │                       id = api UUID  (stable identity across renames)
       │
4. Orphan sweep:
       │  any local synced row whose id is no longer in the API payload
       │  → UPDATE is_active=false, status='draft'
       │  Never touches synced_from_api=false rows.
       ▼
5. Structured log line:
       JSON: { event: "faculty_sync_completed", fetched, upserted,
               drafts, published, orphansSoftDeleted, slugRenames,
               errors[], rows[], durationMs, ts }
```

### Return shape (`SyncReport`)

```ts
{
  fetched: number              // API rows pulled
  upserted: number             // local rows written
  drafts: number               // of which marked draft
  published: number            // of which marked published
  orphansSoftDeleted: number   // local rows hidden because API no longer returns them
  slugRenames: number          // history records created
  errors: string[]             // per-row error messages (sync continues past failures)
  rows: { id, name, status, missing }[]
  durationMs: number
}
```

---

## 5. Source-of-truth API call

`lib/services/staff-api.ts` is the **only** module that calls MyJKKN. Two calls per tick:

```
GET https://www.jkkn.ai/api/api-management/staff
    ?institution_id=5de4fba1-4564-41ed-8c73-5d948b74b843
    &role_key=hod
    &is_active=true
    &has_extended_profile=true
    &all=true

GET https://www.jkkn.ai/api/api-management/staff
    ?institution_id=5de4fba1-4564-41ed-8c73-5d948b74b843
    &role_key=principal
    &is_active=true
    &has_extended_profile=true
    &all=true

Authorization: Bearer ${JKKN_API_KEY}
```

Calls run in parallel via `Promise.all`, then are deduped by `id` (Principal-first wins on the unlikely off-chance the same UUID appears in both buckets).

### Quirks worth knowing

- **Always use `www.jkkn.ai`.** Bare `jkkn.ai` returns 307; cross-domain redirects strip the `Authorization` header.
- **PowerShell `Invoke-RestMethod` silently drops `Authorization`.** Use `curl.exe` for manual probes from Windows.
- **429 handling** — `staff-api.ts` honors `Retry-After` and re-issues once. (No exponential backoff beyond that; one retry is enough for the documented MyJKKN rate-limit pattern.)

---

## 6. Adapter — 15 shape transformations

`lib/adapters/staff-to-faculty.ts` does every translation. Summary table:

| # | API field | Local field | Transformation |
|---|---|---|---|
| 1 | `first_name + " " + last_name` | `full_name` | trim, collapse internal whitespace |
| 2 | `designation` | `designation` | title-case if all-uppercase (`"ASSOCIATE PROFESSOR"` → `"Associate Professor"`) |
| 3 | `department.department_name` | `department` | flatten embed |
| 4 | `institution_email` ∥ `email` | `email` | prefer institution_email; fall back |
| 5 | `qualification_summary` | `qualification` | rename (singular text) |
| 6 | `badges[].label` | `badges[]` | flatten `[{label}]` → `string[]` |
| 7 | `qualifications[{year, degree, institution, specialization}]` | `qualifications[{degree, specialisation, university, year}]` | rename `institution→university`, `specialization→specialisation` (fixes JSON-LD `alumniOf`) |
| 8 | `specialisations[{name}]` | `specialisations[]` | flatten |
| 9 | `experience_entries[{from, to, role, organisation, description}]` | `experience_entries[{type, start_year, end_year, role, institution, description}]` | API stores enum value in `description`; lift it to `type`, blank `description` |
| 10 | `research_focus_areas[{area}]` | `research_focus_areas[]` | flatten |
| 11 | `publications[{doi, url?, year, title, journal}]` | `publications[{title, authors, journal, year, doi_url, pubmed_url}]` | DOI → `https://doi.org/<doi>` if not already a URL; `authors` defaults `""` |
| 12 | `funded_projects[{title, agency, amount, status}]` | `funded_projects[{title, agency, amount, period, status}]` | `period` defaults `""`; `status` normalized to `Ongoing` / `Completed` |
| 13 | `certifications[{name, issuer, year?}]` | `certifications[{name, organisation, year}]` | rename `issuer→organisation` |
| 14 | `awards[{year, title, awarded_by}]` | `awards[{name, body, year}]` | rename `title→name`, `awarded_by→body` |
| 15 | `memberships[{body, role, since:int}]` | `memberships[{organisation, type, since:string}]` | rename + stringify since |

Plus `phd_scholars_list` (`{name, topic, status}` → `{scholar_name, research_topic, status}`),
`profile_picture → photo_url` (empty string → `null`), and pass-through scalars
(`experience_years`, `display_order`, `is_active`, social links, FAQs, etc).

★ Insight ─────────────────────────────────────
Transformation #7 isn't cosmetic — it fixes a **Schema.org JSON-LD bug**. The faculty page emits `alumniOf` from `qualifications[].university`. If we'd left the API field name as `institution`, `alumniOf` would be empty and Google Rich Results would lose the credentials signal. Schema renames usually feel pedantic; this one has measurable SEO impact.
─────────────────────────────────────────────────

---

## 7. Completeness rule (auto-draft)

`lib/sync/draft-rule.ts` — `checkFacultyCompleteness(formData, rehostedPhotoUrl)`.

A row is **published** locally if and only if **all** of these are non-empty:

1. `photo_url` (after rehost — checked against the rehosted URL, not the upstream one)
2. `professional_summary`
3. `qualifications[]` (at least one entry)
4. `email` (institution_email or fallback)
5. `designation`
6. `department`

…**and** MyJKKN's `status === 'published'`.

Anything else → `status='draft'` locally. The `missing[]` array is returned and surfaced in the sync report so admins know which fields to fix in MyJKKN.

| MyJKKN status | Local completeness | Result |
|---|---|---|
| published | complete | **published** |
| published | missing fields | **draft** (forcing function) |
| draft | complete | **draft** (we never auto-publish a MyJKKN draft) |
| draft | incomplete | **draft** |

Cycle: admin sees draft → fixes fields in MyJKKN → next 15-min tick auto-publishes.

---

## 8. Photo re-hosting

`lib/sync/photo-rehost.ts` — `rehostFacultyPhoto(apiUrl, staffId, apiUuid)`.

1. If `apiUrl` is null/empty → return `null` (row will be marked draft by completeness rule).
2. `fetch(apiUrl)` from MyJKKN's Supabase Storage bucket.
3. On any failure (network, 4xx/5xx) → log warning, return `null`. **Never throws.**
4. Upload buffer to **`faculty-photos` bucket** in Engineering Supabase.
   - Object key: `<staff_id>.jpg` (falls back to `<api_uuid>.jpg` if staff_id is null).
   - `upsert: true`, `cacheControl: '3600'`.
5. Return `getPublicUrl(key).publicUrl`.

**Idempotent.** Same key on every tick = overwrite-in-place. No orphan objects accumulate.

The bucket is created by `docs/database/engineering-college/20-faculty-api-sync.sql`:
- `public: true` (so `<img src>` works without signed URLs)
- 5 MB size limit
- Allowed MIME: `image/jpeg`, `image/png`, `image/webp`
- RLS: public read, service-role-only write

---

## 9. Slug history & redirects

When a MyJKKN admin renames a faculty member's slug, the sync engine detects
`local.slug !== api.slug` (for the same UUID) and writes:

```sql
INSERT INTO faculty_slug_history (old_slug, new_slug, faculty_id, changed_at)
ON CONFLICT (old_slug) DO UPDATE SET new_slug = EXCLUDED.new_slug, …
```

`middleware.ts` looks this up on request and 301-redirects `/faculty/<old-slug>` → `/faculty/<new-slug>`. Search engines preserve link equity through the rename.

Slug history is public-read RLS so middleware can resolve without an auth session.

---

## 10. Identity & integrity model

| Concept | Implementation |
|---|---|
| Stable identity | `faculty.id` UUID **equals** the MyJKKN staff UUID. ON CONFLICT (id) DO UPDATE means renames/changes never create duplicates. |
| API vs manual rows | `faculty.synced_from_api boolean`. Sync engine only mutates `synced_from_api = true` rows; manual legacy rows are untouched (except for the slug-collision rename in §4 step 3e). |
| Human-readable ID | `faculty.staff_id` stores MyJKKN's display ID (`CET245`) for debugging/UI. Not a FK. |
| Audit | `faculty.last_synced_at` updated on every successful upsert. |
| Index | `faculty_synced_from_api_idx` — partial index `WHERE synced_from_api = true` (queried on every sync tick). |

---

## 11. Database additions

`docs/database/engineering-college/20-faculty-api-sync.sql` adds:

1. **Columns on `public.faculty`:**
   - `synced_from_api boolean NOT NULL DEFAULT false`
   - `staff_id text`
   - `last_synced_at timestamptz`
2. **Table `public.faculty_slug_history`** (old_slug PK, new_slug, faculty_id FK, changed_at).
3. **Storage bucket `faculty-photos`** with RLS (public read, service-role write).

Subsequent migrations cover one-off cleanup:
- `26-faculty-sync-sathyaseelan-cet018.sql`
- `27-faculty-publish-rajesh-cet225.sql`
- `28-faculty-sync-balakumaran-cet134.sql`
- `29-faculty-cleanup-legacy-duplicates.sql`

---

## 12. Environment variables

| Var | Purpose | Required in |
|---|---|---|
| `JKKN_API_KEY` | Bearer token for MyJKKN Staff API | Production + dev (for live syncs) |
| `JKKN_API_BASE_URL` | API base (defaults to `https://www.jkkn.ai/api`) | Optional |
| `JKKN_ENGINEERING_INSTITUTION_ID` | `5de4fba1-4564-41ed-8c73-5d948b74b843` | Required |
| `CRON_SECRET` | Auth for Vercel Cron path | Production |
| `FACULTY_SYNC_SECRET` | Auth for HMAC manual trigger | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | Target Supabase project | Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role for upserts + storage writes | Required |

Local dev: switch to Engineering with `npm run dev:engineering`, then add `JKKN_API_KEY` and `FACULTY_SYNC_SECRET` to `.env.local` manually if you want to test live syncs.

---

## 13. Admin UX

`/admin/faculty` and `/faculty-admin/manage/faculty`:

- List view is **read-only**. No New / Edit / Delete buttons for synced rows.
- Per row: **"Synced from MyJKKN" badge**, `staff_id` shown, **"Edit in MyJKKN"** deep-link button.
- **"Sync from MyJKKN"** action button calls `POST /admin/api/trigger-sync` (same-origin, session-auth, secret stays server-side).
- The sync report (`SyncReport`) renders in-place after the call: counts, errors, and per-row `missing[]` so admins can fix incomplete profiles directly in MyJKKN.

All write Server Actions (`createFaculty`, `updateFaculty`, `deleteFaculty`, `uploadFacultyPhoto`) have been removed from the codebase. There is no path to edit faculty data on this site.

---

## 14. Operational runbook

### How to verify the sync is healthy

1. Vercel → project → **Logs** → filter for `faculty_sync_completed`.
2. Each entry is a single JSON line with all counters; visually scan for non-zero `errors[]` or unexpected `orphansSoftDeleted` spikes.
3. SQL spot-check:
   ```sql
   SELECT id, full_name, status, last_synced_at, synced_from_api
   FROM faculty
   WHERE synced_from_api = true
   ORDER BY last_synced_at DESC NULLS LAST
   LIMIT 20;
   ```
   `last_synced_at` should be within the last 15–30 minutes for every API-managed row.

### How to force a sync

- **Admin UI:** `/admin/faculty` → "Sync from MyJKKN" button.
- **From server:** `POST https://engg.jkkn.ac.in/api/sync-faculty-now` with `x-sync-secret: $FACULTY_SYNC_SECRET`.

### What if MyJKKN is down?

- Sync throws on the API call → cron returns 500 → cached `faculty` rows remain untouched → public site stays online.
- Photos already in `faculty-photos` bucket continue to serve.

### What if a faculty member disappears from MyJKKN?

- Next tick's orphan sweep sets `is_active = false`, `status = 'draft'` on the local row.
- Public site queries (`status = 'published' AND is_active = true`) immediately hide them.
- Row is preserved (FK-safe). Re-activating in MyJKKN restores them on the next tick.

### Common error pathologies

| Symptom | Likely cause | Fix |
|---|---|---|
| All rows error with `[staff-api] JKKN_API_KEY is not set` | Env var missing in Vercel | Add `JKKN_API_KEY` to project env |
| 401 from MyJKKN | Rotated API key | Regenerate, update env |
| Single row error with `upsert <uuid>: …unique slug…` | Slug collision the guard didn't catch (race) | Manually free the slug in `faculty` or rename in MyJKKN |
| Photos missing | MyJKKN bucket 404s | Rehost soft-fails to null; row drafts itself; visible in `report.rows[].missing` |
| `slug history <uuid>: …` errors | `faculty_slug_history` constraint or RLS | Inspect; usually a stale row with a unique constraint conflict |

---

## 15. Out of scope

- **Other 5 institutions** (Arts & Science, Dental, Pharmacy, Nursing, Main) — Phase 2 after Engineering proves stable for ~30 days.
- **MyJKKN webhooks** — Filed as a request to MyJKKN; will eventually replace the 15-min cron.
- **`faculty_achievements` migration** — Currently a local table; could move to MyJKKN's `achievements` JSONB in Phase 3.
- **Non-leadership faculty** (`role_key='faculty'`) — Filter is HOD + Principal only. Expanding is a 1-line change in `listEngineeringLeadership()` if MyJKKN ever asks for it.

---

## 16. Key files (verified 2026-05-23)

| Layer | Path |
|---|---|
| Orchestrator | `lib/sync/faculty-sync.ts` |
| API client | `lib/services/staff-api.ts` |
| Schemas (API) | `lib/schemas/staff-api.ts` |
| Schemas (local) | `lib/schemas/faculty.ts` |
| Adapter | `lib/adapters/staff-to-faculty.ts` |
| Photo rehost | `lib/sync/photo-rehost.ts` |
| Completeness rule | `lib/sync/draft-rule.ts` |
| Cron entry | `app/api/cron/sync-faculty-from-api/route.ts` |
| HMAC entry | `app/api/sync-faculty-now/route.ts` |
| Admin proxy | `app/(admin)/admin/api/trigger-sync/route.ts` |
| Cron schedule | `vercel.json` |
| DB schema | `docs/database/engineering-college/20-faculty-api-sync.sql` |
| Design spec | `docs/superpowers/specs/2026-05-07-faculty-api-migration-design.md` |
