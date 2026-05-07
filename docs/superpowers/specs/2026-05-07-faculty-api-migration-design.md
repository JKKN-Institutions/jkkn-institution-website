# Faculty API Migration — Design Spec

**Date:** 2026-05-07
**Owner:** Sangeetha V (aicse@jkkn.ac.in)
**Status:** Draft — awaiting user review
**Related:** `docs/admin/staff-api-documentation.md`

---

## 1. Goal

Replace the Engineering Supabase `faculty` table + admin CRUD module with a read-only consumer of the MyJKKN Staff API (`https://jkkn.ai/api/api-management/staff`). Faculty data is authored exclusively in MyJKKN; the Engineering public website renders from the API; Engineering admins no longer maintain a parallel copy.

**Non-goal (this PR):** rolling the same change out to the other 5 institutions. That happens after Engineering proves stable in production for 1–2 weeks.

## 2. User-confirmed decisions (revised 2026-05-07 after pre-migration test fetch)

| # | Decision | Choice |
|---|---|---|
| 1 | Rollout scope | **Engineering only** (engg.jkkn.ac.in) |
| 2 | Architecture | **Strategy D** — Vercel Cron pulls from MyJKKN every 15 min, upserts into local `faculty` table. Public site reads from local DB unchanged. API-down-tolerant by design. |
| 3 | Source-of-truth model | **REPLACE** — local `faculty` table is purely a cache of MyJKKN data. Zero manual writes. No `source` column needed (everything is API-sourced). |
| 4 | Role filter | Only `role_key=hod` and `role_key=principal` (two API calls, merge client-side) |
| 5 | Existing 4 non-HOD/non-Principal local rows | **Soft-delete** (`is_active=false`) — keeps `faculty_achievements` FK intact, fully reversible |
| 6 | `faculty_achievements` table | Keep as-is. `faculty_id` already holds the UUID that matches MyJKKN. Add nightly orphan-sweep job. |
| 7 | Slug policy | Pin first-seen slug locally; record renames in `faculty_slug_history`; auto-301 redirect on rename |
| 8 | Self-service portal `/faculty-admin/manage/faculty/*` | Read-only "Verify your profile" view + deep-link to MyJKKN |
| 9 | Email policy | `institution_email` preferred, fall back to `email` |
| 10 | `has_extended_profile=false` rows | Excluded by sync (only `has_extended_profile=true` rows are pulled) |
| 11 | **Auto-draft rule** | If any of `{photo_url, professional_summary, qualifications, email, designation, department}` is missing/empty → set `status='draft'` regardless of MyJKKN's status. User fixes in MyJKKN; next sync auto-publishes. |
| 12 | Photo strategy | **Rehost** — sync downloads `profile_picture` from MyJKKN's Supabase bucket, uploads to Engineering Supabase Storage at `faculty-photos/<staff_id>.jpg`. Public site reads from our bucket. Decouples uptime. |
| 13 | API key strategy | Per-institution keys (`JKKN_API_KEY` set on the Engineering Vercel project only) |
| 14 | Engineering `institution_id` | `5de4fba1-4564-41ed-8c73-5d948b74b843` (verified via API) |
| 15 | Manual sync trigger | "Sync now" button in admin (HMAC-secured `/api/sync-faculty-now`) for impatient editors |

## 3. Architecture

### 3.1 Data flow

```
[MyJKKN admin edits staff row]
        │
        ▼
[MyJKKN Postgres — source of truth]
        │
        │  HTTPS GET (Bearer JKKN_API_KEY)
        ▼
[Engineering site Server Component]──▶'use cache'──▶[Vercel cache]
        │                                                  │
        │  read JSONB / scalars                            │
        ▼                                                  │
[Adapter: Staff → FacultyRow]                              │
        │                                                  │
        ▼                                                  │
[Existing UI components (unchanged)]◀─── revalidateTag ◀───┘
                                          │
                                          ├── manual /api/revalidate/faculty (HMAC)
                                          ├── Vercel Cron every 15 min (safety net)
                                          └── future MyJKKN webhook
```

### 3.2 Boundary contracts (each unit, what it does, what it depends on)

**`lib/services/staff-api.ts`** — single network boundary. Exports `listStaff(filters)` and `getStaffById(id)`. Wraps fetch with `Authorization: Bearer ${JKKN_API_KEY}`, retry-on-429 honoring `Retry-After`, Zod parse on response. Depends on env (`JKKN_API_KEY`, `JKKN_API_BASE_URL`, `JKKN_INSTITUTION_ID`). Never imported from client components.

**`lib/adapters/faculty-from-staff.ts`** — pure function `staffToFacultyRow(staff: StaffApiRecord): FacultyRow`. Maps:
- `first_name + " " + last_name` → `full_name`
- `qualification_summary` → `qualification`
- `profile_picture` → `photo_url`
- `department.department_name` → `department`
- `qualifications[].institution` → `qualifications[].university` (preserves existing JSON-LD shape; flagged for follow-up to fix `alumniOf` to read `.institution` instead, but the adapter keeps the visible contract stable)
- pass-through for the 22 direct-match fields
- adds `_source: 'api'`, `_fetched_at: Date` for debugging

This adapter is the *only* place that knows about API field names. Replacing the API later means rewriting this file, nothing else.

**`app/actions/faculty.ts` (rewritten)** — keeps the same exported signatures (`getPublishedFaculty`, `getFacultyBySlug`, `getRelatedFaculty`, `getFacultyDepartments`) but routes through `staff-api.ts` + adapter instead of Supabase. Write actions (`createFaculty`, `updateFaculty`, `deleteFaculty`, `uploadFacultyPhoto`) are deleted. Pages and components consuming these actions don't change.

**`lib/cache/faculty-cache.ts`** — Cache Components helpers. Wraps each read with `'use cache'`, `cacheLife({ revalidate: 300, expire: 86400 })`, `cacheTag('faculty-list')` for the directory and `cacheTag('faculty-' + slug)` per profile.

**`app/api/revalidate/faculty/route.ts`** — POST handler. Verifies `X-Revalidate-Secret` (constant-time compare). Accepts `{ slug?, all? }`. Calls `revalidateTag(...)`. Returns 401/400/200. Logs every call.

**`app/api/cron/revalidate-faculty/route.ts`** — Vercel Cron, every 15 min. Hits `revalidateTag('faculty-list')` so worst-case staleness is bounded even if no manual revalidation happens.

**`engineering-supabase: faculty_slug_cache` + `faculty_slug_history`** — two new local tables (the only writes we still own):
- `faculty_slug_cache(staff_id UUID PK, slug TEXT, updated_at TIMESTAMPTZ, snapshot JSONB)` — last-known good copy, used as fallback when API is down.
- `faculty_slug_history(old_slug TEXT PK, new_slug TEXT, staff_id UUID, changed_at TIMESTAMPTZ)` — drives 301 redirects.

Both populated by a periodic sync action (`/api/cron/sync-faculty-slugs`, 30 min).

**`faculty_achievements` (existing table)** — no schema change. Its `faculty_id` column already holds the UUID that matches the API's `staff.id`. Add a nightly orphan-sweep job that flags rows whose `staff_id` no longer exists in the API.

**`app/(public)/faculty/page.tsx` + `app/(public)/faculty/[slug]/page.tsx`** — minor edits only:
- Slug page: fix `alumniOf` to read `q.institution` (with `q.university` fallback for legacy data).
- Add fallback to `faculty_slug_cache` when the API errors during `generateStaticParams` / sitemap generation.
- Build-time guard: if faculty count drops > 20% from `.faculty-count.lock`, fail the build.

**`app/sitemap.ts`** — add faculty profile URLs with `lastmod = updated_at`. Falls back to `faculty_slug_cache` snapshot if the API is unreachable.

**`next.config.ts`** — add the API's image host to `images.remotePatterns`. (Exact host TBD at deploy time when we hit the API once and inspect a real `profile_picture` URL.)

**Admin retirement** — delete `app/(admin)/admin/faculty/{page.tsx,new/,[id]/,faculty-form.tsx,faculty-table.tsx}`. Delete `lib/schemas/faculty.ts` write-side (keep type definitions used by public components, or move them to `lib/types/faculty.ts`). Delete write paths in `app/actions/faculty.ts`.

**Self-service portal** — `app/(faculty-admin)/faculty-admin/manage/faculty/{page,new,[id]}/page.tsx` becomes a read-only "Verify your profile" view with an Edit button that deep-links to MyJKKN.

**Database cleanup** — `DROP TABLE faculty CASCADE` is the LAST step. Before that: verify `faculty_achievements.faculty_id` UUIDs all exist in the API; rename column to `staff_id`; document SQL in `docs/database/engineering-college/`.

### 3.3 Data freshness

| Mechanism | Window | Notes |
|---|---|---|
| `'use cache'` + `revalidate=300` | ≤ 5 min | Default for visitors |
| Vercel Cron `/api/cron/revalidate-faculty` | every 15 min | Safety net |
| Manual `/api/revalidate/faculty` (HMAC) | ~1s | Force-refresh button + future webhook |
| Future MyJKKN webhook | ~1s | Drop the cron once available |

### 3.4 Failure modes

| Failure | Handling |
|---|---|
| API down at request time | Stale-while-revalidate: visitor sees cached page; next successful fetch refreshes. |
| API down at build time | `generateStaticParams` falls back to `faculty_slug_cache`. Build proceeds. |
| API count drops > 20% | Build-time guard fails the deploy. Alert. |
| API returns NOT_FOUND on detail | Render `notFound()` immediately (revalidate inline). |
| `JKKN_API_KEY` revoked (401) | Sentry alert + fallback to cache. Site stays alive on stale data. |
| Slug renamed upstream | `faculty_slug_history` 301 redirect — no 404. |
| Image host not in `remotePatterns` | Pre-flight check at deploy gates this; not a runtime concern. |

## 4. Observability

- Structured log every API call (status, duration, retry count).
- Sentry alert on 401, 403, 5xx.
- Sentry alert on revalidate endpoint failures (3 consecutive).
- `/healthz` endpoint pings the API; surfaced in Vercel monitoring.
- Build-time `.faculty-count.lock` snapshot (committed) — guards against silent de-indexing.

## 5. Security

- `JKKN_API_KEY` and `REVALIDATE_SECRET`: Vercel encrypted env vars, server-only. Never imported from `'use client'` files.
- Revalidate endpoint: HMAC verify (`X-Revalidate-Secret` header) with constant-time compare. Rate-limited.
- Cron endpoints: Vercel-signed (`x-vercel-cron` header check).
- Deletion of write actions removes attack surface.

## 6. Out of scope (this PR)

- Other 5 institutions (Phase 2).
- Webhook integration with MyJKKN (Phase 2 — file feature request now).
- Migrating `faculty_achievements` into MyJKKN's `achievements` jsonb (Phase 3 if ever).
- Admin UI to view sync status (could be added later if useful).

## 7. Testing strategy

- **Unit:** Zod schema parses real API sample fixture; adapter idempotency on missing fields; HMAC verifier rejects tampered payloads.
- **Integration:** Server Action against a mock fetch; revalidate endpoint flow.
- **Manual:** with a real key in a preview deploy, verify list page, slug page, sitemap, JSON-LD via Google Rich Results test, og:image preview, force-refresh button.
- **SEO:** check Search Console for indexation; verify `lastmod` accuracy in sitemap.

## 8. Rollback

The migration is reversible up to the final `DROP TABLE faculty` step. Sequence:
1. Phases 1–6 are additive (new files, no destructive changes). Disable by toggling `NEXT_PUBLIC_FACULTY_SOURCE=local`.
2. Phase 7 (admin retirement) and Phase 8 (drop table) are destructive. Run only after 1 week of green metrics.
3. Rollback after Phase 8 = restore from Supabase point-in-time backup; revert PR.

## 9. Open questions to resolve before implementation

| # | Question | Owner |
|---|---|---|
| Q1 | Engineering institution UUID in MyJKKN | User to provide |
| Q2 | `JKKN_API_KEY` (with `read` permission for staff module) | User to generate via MyJKKN API Management |
| Q3 | Image host for `profile_picture` (likely `jkkn.ai` or its CDN) | Resolve at deploy time by inspecting one row |
| Q4 | `REVALIDATE_SECRET` value | Generate at deploy time (`openssl rand -hex 32`) |

## 10. Implementation phases (preview — full plan generated by `writing-plans` skill after approval)

1. **Pre-flight** — env vars, `next.config.ts` `remotePatterns`, sample-row inspection.
2. **API client** — `lib/services/staff-api.ts` + Zod schema for `StaffApiRecord`.
3. **Adapter** — `lib/adapters/faculty-from-staff.ts`.
4. **Server actions rewrite** — re-implement `app/actions/faculty.ts` against API.
5. **Cache + revalidate** — `'use cache'` directives, revalidate endpoint, cron.
6. **SEO hardening** — `faculty_slug_cache`, `faculty_slug_history`, sitemap fallback, build-time count guard, JSON-LD `alumniOf` fix.
7. **Admin retirement + self-service read-only** — delete admin module, convert self-service to read-only.
8. **Database cleanup** — `faculty_achievements` rename, drop `faculty` table (documented in `docs/database/engineering-college/`).

Each phase is independently reviewable and revertible.

---

## Self-review checklist (filled by author)

- [x] Placeholder scan — only `<UUID>` etc. for deploy-time values, called out in §9.
- [x] Internal consistency — architecture in §3 matches phases in §10.
- [x] Scope check — single PR, single institution, ~10 files touched. Tractable.
- [x] Ambiguity — all Yes/No defaults explicitly noted ("recommended; flag if you disagree").
