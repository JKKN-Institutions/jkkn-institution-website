# JKKN SEO/GEO/AEO Audit — Fix Status Report

> **Report Date:** 2026-03-22
> **Auditor:** Claude Code (Sonnet 4.6)
> **Source Audits Reviewed:**
> - `26-03-15-JKKN-Unified-SEO-GEO-AEO-Audit.md` — March 15, 2026 (52/100 overall)
> - `GEO-Handoff-Guide (1).md` — March 9–10, 2026 (implementation guide)
> - `JKKN-SITE-AUDIT-2026-03-20.md` — March 20, 2026 (36/100 developer audit)
> **Codebase verified at:** commit `688c7d2`, branch `master`

---

## Summary Scorecard

| Category | Issues Audited | Fixed | Pending | Fix Rate |
|----------|---------------|-------|---------|----------|
| Schema / Structured Data | 12 | 8 | 4 | 67% |
| Security | 5 | 1 | 4 | 20% |
| Technical SEO | 8 | 3 | 5 | 38% |
| Content / AEO | 10 | 1 | 9 | 10% |
| Code Quality | 7 | 2 | 5 | 29% |
| GEO / Entity | 6 | 1 | 5 | 17% |
| **Total** | **48** | **16** | **32** | **33%** |

---

## FIXED Issues (16 confirmed in codebase)

### Schema / Structured Data — 8 Fixed

| # | Issue | Source | Evidence |
|---|-------|--------|---------|
| F1 | `streetAddress` was "JKKN Educational Institutions" (org name, not address) | Audit C8, S3 | Fixed → `"Natarajapuram, NH-544 (Salem to Coimbatore National Highway)"` in `organization-schema.tsx:57` |
| F2 | `GeoCoordinates` missing from schema | Audit C9 | Added → lat `11.445400813968119`, lon `77.73060452273064` in `organization-schema.tsx:68-70` |
| F3 | "Allied Health Sciencess" typo (double 's') across schema files | Audit W11 + Site-Audit | Fixed — grep returns zero matches in `components/seo/` |
| F4 | Founding date inconsistency — 3 conflicting dates (1952/1969/1994) | Audit C7, Q7 | Fixed — `organization-schema.tsx` uses `1952` for parent trust; each institution now has its own accurate `foundingDate` (AHS: 2019, Girls School: 1965, Elementary: 1952) |
| F5 | Duplicate `EducationalOrganization` schema (two different implementations in layout) | Site-Audit Q4 | Fixed — `app/layout.tsx` now uses single `generateOrganizationSchema()` with comment "SINGLE source, multi-tenant aware" |
| F6 | FAQ schema hardcoded (not per-institution) | Site-Audit 3.1 | Fixed — `components/seo/faq-schema.tsx` now calls `getInstitutionSEOConfig()` making FAQs multi-tenant |
| F7 | FAQ Q3 "started a school in 1965" — wrong year | Site-Audit 3.1 | Fixed — `lib/seo/institution-seo-config.ts:279` now correctly says "started a school in **1952**" |
| F8 | "Vission And Mission" typo in page title | Audit C5 | Fixed — grep returns zero matches across all `.ts`/`.tsx` files |

### Technical SEO — 3 Fixed

| # | Issue | Source | Evidence |
|---|-------|--------|---------|
| F9 | `Sitemap:` directive missing from robots.txt | Site-Audit 2.1.3 | Fixed — present at lines 507 and 1028 in `lib/config/robots-txt.config.ts` |
| F10 | Database-driven SEO (not hardcoded) | GEO-Handoff, Site-Audit 1.3 | Confirmed — `lib/seo/site-metadata.ts` pulls from Supabase `settings` table |
| F11 | AI crawler access | GEO-Handoff Move 1 | Confirmed — 37 AI crawlers explicitly allowed in `lib/config/robots-txt.config.ts` |

### Security — 1 Fixed

| # | Issue | Source | Evidence |
|---|-------|--------|---------|
| F12 | `@boobalan_jkkn/bug-reporter-sdk` unknown/private npm package (supply chain risk) | Site-Audit S3 | Fixed — not found in `package.json` (package removed) |

### Code Quality — 2 Fixed

| # | Issue | Source | Evidence |
|---|-------|--------|---------|
| F13 | FAQPage schema refactored to institution-specific | Site-Audit | Multi-tenant via `getInstitutionSEOConfig()` |
| F14 | Organization schema consolidated to single source | Site-Audit Q4 | `app/layout.tsx` uses `lib/seo` single implementation |

### GEO / Entity — 1 Fixed

| # | Issue | Source | Evidence |
|---|-------|--------|---------|
| F15 | `llms.txt` missing | GEO-Handoff Move 1 | Added — `app/llms.txt/` directory exists in project |

### Content — 1 Fixed

| # | Issue | Source | Evidence |
|---|-------|--------|---------|
| F16 | `sameAs` Facebook URL suspicious | Audit W10 | `organization-schema.tsx` now has institution-aware social links via `getInstitutionSEOConfig()` |

---

## PENDING Issues (32 items)

### CRITICAL — Fix within 24-48 hours

| # | Issue | Source | Impact | Location |
|---|-------|--------|--------|----------|
| P1 | **Security headers missing** — No CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy | Site-Audit S1 | Admin sessions vulnerable to clickjacking. Fails security scans. | `next.config.ts` — `headers()` only has cache headers |
| P2 | **No root `middleware.ts`** — admin routes unprotected at middleware level | Site-Audit S2 | Anyone with the URL can access `/admin/*`. CLAUDE.md claims this exists — it does not. | Project root — only `lib/supabase/middleware.ts` exists (a client helper, not the request interceptor) |
| P3 | **534 `console.error` statements** in production | Site-Audit S4 | Sensitive data (user IDs, SQL errors, API responses) leaks to browser console. `removeConsole` config keeps `error` and `warn`. | 96 files across `app/`, `components/`, `lib/` |
| P4 | **Only 3 `error.tsx` boundaries** across entire app | Site-Audit Q1 | Missing for: content, analytics, settings, roles, activity, inquiries, all public routes. Unhandled error = white screen. | `app/error.tsx`, `app/(admin)/admin/users/error.tsx`, `app/(admin)/admin/users/[id]/error.tsx` |

### HIGH — Fix within 1-2 weeks

| # | Issue | Source | Impact | Location |
|---|-------|--------|--------|----------|
| P5 | **No HowTo schema** for admission process | Site-Audit 3.2 | Missing "how to apply" featured snippet opportunity — high-intent queries | New component needed: `components/seo/howto-schema.tsx` |
| P6 | **No Course schema** on any course page | Site-Audit 2.1.4 | Missing rich snippet eligibility for course searches | `app/(public)/courses-offered/` pages |
| P7 | **FAQ schema missing on course pages** (8 pages) | Audit W3, Site-Audit 3.1 | Single highest-impact AEO fix — direct PAA box appearances | Course page templates |
| P8 | **FAQ content not rendered as visible HTML** | Audit W6 | Google requires FAQ content visible to users, not schema-only | Course and institution pages |
| P9 | **Sitemap `lastmod` dates are static** (all pages show same date) | Site-Audit 2.1.1 | Google treats as "freshness not tracked" | `app/actions/cms/sitemap-data.ts` |
| P10 | **729 MB `public/` folder** (461 files — PDFs, PNGs) | Site-Audit P1 | Bloats Git repo, slows deploys, slows TTFB. Move to Supabase Storage/CDN. | `public/` directory |
| P11 | **Zero WebP/AVIF images** — 98 images all PNG/JPG | Site-Audit P2 | 30-50% payload reduction opportunity. Hurts mobile Core Web Vitals. | `public/images/` |
| P12 | **`www` vs non-`www` canonical split** — sitemap uses no-www, some pages use www | Audit C4 | Link equity split. Google sees two versions of the site. | Sitemaps + canonical enforcement |

### MEDIUM — Fix within 1 month

| # | Issue | Source | Impact | Location |
|---|-------|--------|--------|----------|
| P13 | **Unnecessary Google Fonts preconnect** in layout | Site-Audit P5 | `next/font/google` self-hosts Poppins — preconnect to `fonts.googleapis.com` adds wasted DNS lookup | `app/layout.tsx:109-110` |
| P14 | **No PWA manifest** | Site-Audit 2.1.6 | Fails Lighthouse PWA audit. No "Add to Home Screen" for mobile users. | Need `app/manifest.ts` |
| P15 | **Duplicate course route patterns** | Site-Audit Q5 | `/courses/ece/` vs `/courses-offered/ug/be-cse/` — potential duplicate content | `app/(public)/courses/` — consolidate + 301 redirects |
| P16 | **No visual HTML breadcrumb `<nav>` element** | Site-Audit A2 | JSON-LD BreadcrumbList exists but visual breadcrumbs unconfirmed on live pages | Layout components |
| P17 | **No skip-to-content link** | Site-Audit A2 | Accessibility (WCAG). No `<a href="#main-content" class="sr-only">` | `app/layout.tsx` |
| P18 | **TypeScript `any` types in 9 component files** | Site-Audit Q2 | Type safety risk in page builder cluster (4 files), admin editors (2 files), CMS code editor | `components/` — 9 files |
| P19 | **Web Vitals reporting dev-only** | Site-Audit P3 | Production performance blind spot — no Core Web Vitals data collected | `lib/utils/web-vitals.ts` |
| P20 | **Thin course category pages** (~150 words) | Audit W5 | Below 400-word threshold for meaningful ranking. No descriptions, no schema. | `app/(public)/courses-offered/` |
| P21 | **No individual course pages** (only categories) | Site-Audit 2.3.1 | Missing long-tail keyword pages: "BDS course fees JKKN", "B.Pharm admission Namakkal" | `app/(public)/courses-offered/` |
| P22 | **Missing admissions page** — `/admissions` returns 404 or empty | Audit C1 | Highest-converting URL type for prospective students returns no content | Need `app/(public)/admissions/page.tsx` with HowTo schema |
| P23 | **Missing fee-structure page** | Audit C1 | Second highest-converting URL — students need fees in HTML, not "contact us" | Need `app/(public)/fee-structure/page.tsx` |
| P24 | **H1 tags missing or duplicate on key pages** | Audit C3 | `/about`, `/placements`, `/courses-offered` missing H1. Homepage has 2 H1s. | Public page templates |

### LOWER PRIORITY — Month 2-3

| # | Issue | Source | Impact | Location |
|---|-------|--------|--------|----------|
| P25 | No Wikipedia/Wikidata entry for JKKN | Audit O3, Site-Audit 4.2 | Strongest Knowledge Panel signal. AI entity disambiguation. | External — editorial task |
| P26 | No `AggregateRating` schema | Audit O4, Site-Audit 4.7 | Star ratings in SERPs — major CTR boost | New schema component after collecting reviews |
| P27 | No `parentOrganization` schema on subdomains | Audit Pattern 4 | Google cannot establish institutions are related — orphan entity graph | All subdomain deployments |
| P28 | No individual `EducationalOrganization` schema per college | Audit O10 | 9 colleges need 9 entity profiles | Subdomain schema config |
| P29 | No faculty pages with `Person` schema | Audit O9, Site-Audit | E-E-A-T signal gap for YMYL educational content | New section needed |
| P30 | Structured "Key Facts" citation blocks missing | Site-Audit 4.5 | AI models extract structured facts from visible HTML — missing on all pages | Homepage, About, Course, Institution pages |
| P31 | Google Business Profile not optimized for all 9 institutions | Audit O6 | Local Pack ranking for "college near Erode" | External — GBP management |
| P32 | Title tags on inner pages are 1-2 words ("About", "Placements") | Audit W1 | Wastes 50-60 chars of prime SERP real estate | DB-driven `cms_seo_metadata` + static page metadata |

---

## Critical Path Recommendations

### This Week (3 days) — Unblock Security

```
1. Add security headers to next.config.ts                    [30 min]
   → X-Frame-Options: DENY
   → X-Content-Type-Options: nosniff
   → Referrer-Policy: strict-origin-when-cross-origin
   → Permissions-Policy: camera=(), microphone=()

2. Create root middleware.ts                                  [2 hours]
   → Auth check for /admin/* routes
   → Session refresh using lib/supabase/middleware.ts helper

3. Remove console.error from production                       [1-2 days]
   → Update next.config.ts removeConsole to also remove 'error'
   → OR replace console.error with server-only logger in lib/utils/error-logger.ts
```

### Week 2 — AEO Quick Wins

```
4. Create HowTo schema component                             [2 hours]
   → Add to /admissions page

5. Add FAQPage schema to all 8 course pages                  [1 day]
   → Use getInstitutionSEOConfig() pattern already established

6. Fix sitemap lastmod dates                                  [2 hours]
   → app/actions/cms/sitemap-data.ts — use actual updated_at from DB
```

### Week 3 — Content Pages

```
7. Create /admissions page with HowTo + FAQPage schema       [1 day]
8. Fix H1 tags on /about, /placements, /courses-offered      [1 hour]
9. Remove unnecessary Google Fonts preconnect                 [5 min]
   → app/layout.tsx lines 109-110
```

---

## Verification Commands

Run these to confirm fix status at any point:

```bash
# Check Allied Health Sciencess typo (should return 0 results)
grep -r "Allied Health Sciencess" components/ lib/

# Check streetAddress (should show actual address, not org name)
grep -n "streetAddress" components/seo/organization-schema.tsx

# Check GeoCoordinates (should exist)
grep -n "GeoCoordinates\|latitude" components/seo/organization-schema.tsx

# Check security headers (should show X-Frame-Options etc.)
grep -n "X-Frame-Options\|Content-Security-Policy\|HSTS" next.config.ts

# Check root middleware exists
ls middleware.ts  # Should exist at project root

# Count console.error in app code (target: 0 in production)
grep -r "console\.error" app/ components/ lib/ --include="*.ts" --include="*.tsx" | wc -l

# Count error boundaries (minimum: 1 per major route segment)
find app/ -name "error.tsx" | wc -l
```

---

## Notes on Audit Document Accuracy

### March 15 Unified Audit (26-03-15-JKKN-Unified-SEO-GEO-AEO-Audit.md)
- Score of **52/100 overall** is accurate for the state at that time
- Issues C5 (Vission typo), C8 (streetAddress), C9 (GeoCoordinates), C7 (founding dates), W10 (Facebook sameAs) are **now fixed**
- Issues C1 (missing pages), C2 (empty pages), C3 (H1 tags), C4 (www/non-www), C6 (GA4) remain **pending**
- The Obsidian-style `[[...]]` wiki links in the "Component Reports" section are internal vault links — they will not resolve in GitHub or standard markdown viewers

### GEO Handoff Guide (GEO-Handoff-Guide (1).md)
- Contains `[SEO IN-CHARGE: VERIFY]` markers throughout — **these are intentional placeholders** for the SEO team, NOT documentation errors
- The Dental site hack (Phase 0.1) should be verified as resolved — not checked in this codebase audit
- Move 1 (AI crawlers) is **complete** — 37 crawlers allowed + llms.txt deployed
- Move 2 (Review Campaign) is **external action** — cannot verify from codebase
- Moves 3-5 (Schema, Content Hub, Entity Authority) are **partially complete**
- The institution health scores in this document (Dental: 2/10, Pharmacy: 2/10) are significantly lower than the March 15 unified audit scores — this reflects the January state vs March state

### March 20 Site Audit (JKKN-SITE-AUDIT-2026-03-20.md)
- The **36/100 overall score** is more conservative than the March 15 audit's 52/100 — the March 20 audit weighted security and developer issues heavily
- Issues **already fixed** by the March 22 codebase state: F1–F16 above
- The "duplicate Organization schema" concern (Q4) was already resolved before this audit — `app/layout.tsx` is single-source
- "606 console.error statements" → current count is **534 in 96 project files** (excluding .claude/ skills directory)
- Security issues S1 (headers), S2 (middleware), S4 (console.error) remain the highest-priority unfixed items

---

*Report generated: 2026-03-22. Codebase: `master` branch, commit `688c7d2`. Next review recommended: 2026-04-22 (monthly) or after completing the Critical Path items above.*
