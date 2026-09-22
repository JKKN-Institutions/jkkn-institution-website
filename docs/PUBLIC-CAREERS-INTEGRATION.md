# Public Careers Integration (jkkn.ac.in ↔ MyJKKN)

`/careers` and `/careers/[id]` read open, public jobs from the MyJKKN Public Careers API and post
applications directly from the applicant's browser. This site stores nothing: HR manages jobs and
screens applications in MyJKKN (`/hr/recruitment`).

## Endpoints used

| Call | Where it runs | Notes |
|---|---|---|
| `GET  {NEXT_PUBLIC_MYJKKN_URL}/api/public/careers/jobs?institution_id&q&job_type` | server | `next: { revalidate: 300 }` |
| `GET  {NEXT_PUBLIC_MYJKKN_URL}/api/public/careers/jobs/{id}` | server | `404` → `notFound()` |
| `POST {NEXT_PUBLIC_MYJKKN_URL}/api/public/careers/jobs/{id}/apply` | **browser only** | multipart; see below |

Contract: MyJKKN `docs/public-careers-api.md`.

## Environment (per Vercel project)

| Var | Main site | College sites |
|---|---|---|
| `NEXT_PUBLIC_MYJKKN_URL` | `https://www.jkkn.ai` | same |
| `MYJKKN_INSTITUTION_ID` | *(empty — all colleges, with a filter)* | that college's MyJKKN `institutions.id` |

Locally, put both in `.env.<institution>.jkkn-api`; `npm run switch <institution>` merges them into
`.env.local`. The `institutions` array in the list response gives every college's id.

## Why the apply POST is not a Server Action

MyJKKN rate-limits applications per IP (5/hour). A Server Action would send every applicant from
one Vercel egress IP and lock everyone out after five. This is a deliberate exception to the
project's "mutations via Server Actions" rule; see `lib/services/public-careers-apply.ts`.

## Prerequisites on the MyJKKN side

1. Branch `feat/public-careers-api` merged and deployed; its migration applied.
2. HR turns on **Show on website (jkkn.ac.in)** for a job with status **Open**.
3. For local dev / Vercel previews: `PUBLIC_CAREERS_EXTRA_ORIGINS=http://localhost:3000,https://<preview>.vercel.app`
   on MyJKKN (production origins `https://jkkn.ac.in` and `https://*.jkkn.ac.in` are built in).
   Without it the apply form shows "This form can only be submitted from the JKKN website" (403).

## Code map

| File | Role |
|---|---|
| `lib/schemas/public-careers.ts` | Zod contract (`PublicJob`, envelopes, `JOB_TYPES`) |
| `lib/services/public-careers-api.ts` | server reads (`listPublicJobs`, `getPublicJob`) |
| `lib/services/public-careers-apply.ts` | browser apply + status → result mapping |
| `lib/utils/careers-format.ts` | display formatters |
| `components/public/careers/*` | listing cards/filters, detail, apply form |
| `components/seo/job-posting-schema.tsx` | Google for Jobs `JobPosting` JSON-LD |
| `app/(public)/careers/**` | routes — they shadow the CMS `careers` page, which still holds the old CVViz iframe |
| `__tests__/careers/*` | unit tests (`npm run test:unit`) |

## Failure behaviour

- MyJKKN unreachable on `/careers` → "Job listings are temporarily unavailable" panel; header still renders.
- MyJKKN unreachable on `/careers/[id]` → route error boundary (never a false 404).
- Apply: `400` field errors appear under the inputs; `403/404/409/429/503/500` show a titled banner.

## History

The native careers module (own tables + admin) was removed on 2026-01-08 (`docs/CAREER-MODULE-REMOVAL.md`).
From 2026-01 to 2026-09 `/careers` was a CMS page embedding `jobs.cvviz.com`. The orphaned
`components/public/resume-file-upload.tsx` from the old module was deleted with this integration.
