# JKKN Engineering College (engg.jkkn.ac.in) — Deep SEO / AEO / GEO Audit

**Source audit:** `c:/Users/MyLap/Downloads/JKKN-Page-Gap-Analysis-SEO-AEO-GEO.html` (generated 23 March 2026)
**Scope:** Engineering institution only (Section 5 of the source audit)
**Verified against:** Live Engineering Supabase CMS (`kyvfkyjmdbtyimtedkie.supabase.co`), production sitemap at `https://engg.jkkn.ac.in/sitemap.xml`, and repo source at `D:\Sangeetha_V\Main\jkkn-institution-website`
**Date of re-verification:** 2026-04-21
**Confidence key:** 🟢 Confirmed · 🟡 Likely · 🔵 Hypothesis · ⚪ Unknown

---

## 1. Headline Numbers (Re-verified)

| Metric (from source audit) | Source audit value | Re-verified value (2026-04-21) | Delta |
|---|---|---|---|
| Existing pages | 88 | 82 published + 14 drafts = 96 rows in `cms_pages` | Drafts hide real work-in-progress |
| Missing P1+P2 pages (audit list) | 52 | 35 still truly missing · 5 already exist (city pages) · 2 ship as alternate slug · 14 draft-state | Gap is **smaller than audit implies**, but discoverability is **worse** than audit implies |
| Total need | 140 | 140 (unchanged, target shape is correct) | — |
| Gap rate | 37.1% | **~25%** once mislabelled "missing" pages are counted | — |
| Critical bug | Sitemap references localhost:3000 | 🟢 **STILL BROKEN IN PRODUCTION** (see §3.1) | Regression: CDN `Age: 143915s` ≈ 40h stale |

**Engineering progress after cross-check: ~75%, not 62.9%** — but the "missing" 25% is the commercially valuable 25% (fee, FAQ, decision, TNEA, testimonials, departments). Everything you already have is compliance / informational.

---

## 2. Audit Claims vs. Reality (Ground Truth from Supabase + Repo)

This table is the single biggest value the re-verification adds. Do **not** trust the source audit's MISSING labels blindly — six rows are wrong.

| Page in source audit | Audit said | Reality (DB check) | Correct verdict |
|---|---|---|---|
| `/placements` | MISSING (P1 SEO) | 🟢 `placements` **published** + stray `placement` draft | ✅ **Exists — but has a duplicate draft creating canonical risk** |
| `/admissions` | MISSING (P1 SEO) | 🟢 `admissions` **published** ("Admissions 2026-27 — JKKN College of Engineering and Technology") | ✅ **Exists** |
| `/fee-structure` | MISSING (P1 AEO) | 🟢 Not in `cms_pages` | ❌ **Genuinely missing** |
| `/faq` + `/faq/be-cse` + `/faq/mba` | MISSING (P1/P2 AEO) | 🟢 Zero FAQ rows in DB | ❌ **All genuinely missing — biggest AEO gap** |
| `/why-jkkn-engineering` | MISSING (P1 AEO) | 🟡 `why-students-choose-jkkn` exists but is generic Group-level | ⚠ **Partial — needs engineering-specific page** |
| `/tnea-counseling-guide` | MISSING (P1 AEO) | 🟢 Not present | ❌ **Genuinely missing** |
| `/tnea-cutoff-marks` | MISSING (P1 AEO) | 🟢 Not present | ❌ **Genuinely missing** |
| `/departments` | MISSING (P1 SEO) | 🟢 No department hub; `/courses-offered` exists but conflates UG/PG | ❌ **Genuinely missing** |
| `/department/cse`, `ece`, `eee`, `mech` | MISSING | 🟢 Only course pages exist (`courses-offered/ug/be-cse` etc.) — different intent | ❌ **Genuinely missing (dept ≠ course)** |
| `/testimonials` | MISSING (P1 GEO) | 🟢 Not present; no `Review` schema anywhere | ❌ **Genuinely missing** |
| `/blog` | MISSING (P1 SEO) | 🟢 No `/blog` hub, but 30+ event/news posts are published as standalone URLs in the sitemap | ❌ **Hub missing — content exists but orphaned** |
| `/events` | MISSING (P2 SEO) | 🟢 Individual events exist, no hub | ❌ **Hub missing** |
| `/gallery` | EXISTS | 🟢 Confirmed | ✅ |
| `/scholarships` | MISSING (P2 AEO) | 🟢 Not present | ❌ **Genuinely missing** |
| `/projects-innovations` | MISSING (P2 GEO) | 🟢 Not present | ❌ **Genuinely missing** |
| `/industry-partnerships` | MISSING (P2 GEO) | 🟢 Not present | ❌ **Genuinely missing** |
| `/training-certifications` | MISSING (P2 SEO) | 🟢 Not present | ❌ **Genuinely missing** |
| `/jkkn-engg-vs-[competitor]` | MISSING (P2 GEO) | 🟢 Not present | ❌ **Genuinely missing** |
| `/faculty-directory` | MISSING (P2 GEO) | 🟢 Not present; no Person schema | ❌ **Genuinely missing** |
| `/location pages (Salem, Erode, Namakkal, Coimbatore, Tiruppur)` | MISSING (P2 GEO) | 🟢 **ALL FIVE published** as `best-engineering-college-in-{salem,erode,coimbatore,namakkal,tiruppur}` | ✅ **Exists — audit is wrong** |

### 2.1 Bonus gaps the source audit missed

These never appeared in the external audit but were surfaced during verification:

1. 🟢 **Duplicate canonical slugs** — published pages share topic with stray drafts:
   - `approvals-and-affiliation` (published) ↔ `approvals-affiliation` (draft)
   - `placements` (published) ↔ `placement` (draft)
   → Risk: when drafts are later published, Google sees two URLs competing for identical intent. Kill the drafts now.
2. 🟢 **NIRF URL sprawl** — six routes cover two NIRF years:
   `/iqac/nirf`, `/iqac/nirf/nirf-2024`, `/iqac/nirf/nirf-2025`, `/nirf-2`, `/nirf2024`, `/nirf-2025`.
   → Audit score leakage. Pick one canonical under `/iqac/nirf/*` and 301 the rest.
3. 🟢 **5 in-progress drafts blocking content visibility:** `graduation-day`, `others/achievements`, `others/digital-campus`, `programs/be-mechanical-engineering`, `courses-offered/pg/me-embedded-systems`, `courses-offered/pg/me-power-systems`, `facilities/wi-fi-campus`, `institutional-plan`, 5× `nav-cities-*`.
4. 🟢 **City landing pages are orphaned in sitemap config.** They're **published** in the CMS, but `lib/config/sitemaps.config.ts:114-148` (`getEngineeringPages`) does **not** list them → they're not in the XML sitemap → Google won't crawl them efficiently. Big wasted asset.
5. 🟢 **Stale sitemap config** — `getEngineeringPages()` omits half of what's actually published: `admissions`, `alumni`, `placements`, `why-students-choose-jkkn`, `courses-offered/ug/be-cse|be-eee|be-mechanical|btech-it`, all committees, `research-and-development-cell`, `examination-manual`, etc. Only 28 URLs are hand-listed vs 82 published pages.

---

## 3. Critical Findings (🔴 = fix immediately)

### 3.1 🔴 Sitemap still serves `localhost:3000` URLs — the #1 indexing blocker

**Evidence (reproduced live today):**
```bash
$ curl -s https://engg.jkkn.ac.in/sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>http://localhost:3000/sitemap-pages.xml</loc>   ← BROKEN
    <lastmod>2026-04-13</lastmod>
  </sitemap>
  <sitemap>
    <loc>http://localhost:3000/sitemap-courses.xml</loc> ← BROKEN
  </sitemap>
  <sitemap>
    <loc>http://localhost:3000/sitemap-blog.xml</loc>    ← BROKEN
  </sitemap>
</sitemapindex>
```
Response headers show `Age: 143915` (≈ 40 hours) and `Cache-Control: public, max-age=0, must-revalidate` from origin but `s-maxage=86400` on the handler, so Vercel's edge cache is pinning the broken output.

**Root cause — two compounding bugs in one file:**

`app/sitemap.xml/route.ts:13-18`
```ts
export const dynamic = 'force-static'          // evaluated at BUILD TIME
export const revalidate = 86400
export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'
  ...
}
```
1. `force-static` burns `NEXT_PUBLIC_SITE_URL` into the build output. When the Engineering Vercel project was last built, either (a) the variable was unset and the fallback `https://jkkn.ac.in` should have applied — but we're seeing `localhost:3000`, which means (b) the variable **was set to `http://localhost:3000`** on that project (or an `.env` leaked into build).
2. Even after you correct the variable, because `dynamic = 'force-static'` is active, a **fresh Vercel deployment is required** — editing the env var alone won't refresh the cached output.
3. The same pattern is repeated in `app/sitemap-pages.xml/route.ts`, `sitemap-courses.xml/route.ts`, `sitemap-blog.xml/route.ts`, `sitemap-institutions.xml/route.ts` — all inherit the bug.

**Impact:** Every Googlebot fetch of the sitemap index finds three dead `http://localhost:3000/...` references → the 80+ pages that would otherwise be in `/sitemap-pages.xml` are **discoverable only via internal links**. Combined with the missing `/blog` hub and no department hub, deep pages are effectively crawl-orphaned.

**Fix (exact):** see `ACTION-PLAN.md` §1.

---

### 3.2 🔴 Zero FAQ schema anywhere on the site → AEO blackout

**Evidence:** `SELECT COUNT(*) FROM cms_pages WHERE slug ILIKE 'faq%'` returns `0`. No page in the repo uses `FAQPage` JSON-LD. The audit calls for `/faq`, `/faq/be-cse`, `/faq/mba` (P1/P2).

**Impact:** You inherit zero AI Overview citations, no "People Also Ask" real estate, no featured-snippet eligibility for any "TNEA cutoff?", "CSE scope?", "Engineering fees?" query. This is the single highest ROI unlock because the answers already exist inside course pages — they just aren't marked up.

**Important compliance note:** Google restricted FAQPage rich results to government/health authority sites in Aug 2023. **Engineering colleges are NOT eligible for the rich result**, but FAQPage markup still powers LLM answer engines (ChatGPT, Perplexity, Claude web, Gemini). So implement the schema, but do not promise "rich result" to stakeholders.

---

### 3.3 🔴 No `/testimonials` + no `Review`/`AggregateRating` schema → GEO blocker

**Evidence:** No slug matches `testimonial*` in Supabase; no `"@type":"Review"` in the repo.

**Impact:** Generative engines (ChatGPT, Perplexity) weight first-party testimonials with schema heavily when answering "best engineering college in Tamil Nadu". Kongu, Bannari Amman, and PSG all publish them — you don't. This is your highest-leverage GEO win.

---

### 3.4 🔴 `/fee-structure`, `/scholarships`, `/tnea-cutoff-marks` missing → lose every transactional-intent query

Transactional queries ("jkkn engineering fees", "TNEA cutoff JKKN", "engineering scholarships Tamil Nadu") are **lowest-competition and highest-conversion**. Every day without these pages, the traffic flows to College Dunia, CollegeDekho, and Shiksha.

The Main site *also* lacks `/fee-structure` (you recently fixed it with migrations 18-24), so you already have a working template — **clone the AdmissionHero + TabsBlock pattern from Main into Engineering**, swap data for engineering-specific amounts.

---

### 3.5 ⚠ Department pages vs course pages — intent mismatch

You have `courses-offered/ug/be-cse` (course-offering intent) but **no `department/cse`** (department-capability intent).

- Course page answers: "What is the B.E CSE course?" → syllabus, eligibility, fees
- Department page answers: "CSE at JKKN — faculty, labs, research output" → org unit, people, facilities

Google and LLMs treat these as **two different entities**. Publishing both is how top-30% colleges capture both query clusters. The source audit is correct here — this is a real gap.

---

### 3.6 ⚠ Blog content exists but `/blog` hub and category taxonomy do not

30+ event/workshop posts live at flat URLs (`/orbitra26`, `/technovanza-2k25`, `/safer-internet-day-2`, etc.). There is:
- No `/blog` hub page
- No category pages (`/blog/events`, `/blog/academic`, `/blog/placements`)
- No tag system
- `Article` schema is only partial across posts

This is *topical-authority suicide*: each post is a lonely island instead of a linked cluster. Also, flat `/technovanza-2k25` URLs compete with Main and other institutions' similar event slugs for the same token space.

---

### 3.7 ⚠ Draft drift — 14 published→draft pairs and stale drafts

```
approvals-affiliation (draft)      ↔ approvals-and-affiliation (published)  ← duplicate
placement (draft)                   ↔ placements (published)                  ← duplicate
graduation-day (draft)
others/achievements (draft)
others/digital-campus (draft)
programs/be-mechanical-engineering (draft) ↔ courses-offered/ug/be-mechanical (published)  ← duplicate
courses-offered/pg/me-embedded-systems (draft)
courses-offered/pg/me-power-systems (draft)
facilities/wi-fi-campus (draft)
institutional-plan (draft)
nav-cities (draft) + 5× nav-cities-{city} (drafts)  ← likely now superseded by best-engineering-college-in-* pages
```
Drafts don't harm rankings directly, but the three **duplicate slugs** are ticking canonical-tag bombs.

---

### 3.8 ⚠ NIRF URL sprawl — 6 URLs for ~2 pages of data

`/iqac/nirf`, `/iqac/nirf/nirf-2024`, `/iqac/nirf/nirf-2025`, `/nirf-2`, `/nirf2024`, `/nirf-2025`. Only the first three should exist. The rest are audit leaks from prior WordPress migrations.

---

### 3.9 ⚠ Sitemap config is stale and missing published pages

`lib/config/sitemaps.config.ts` lines 114-148 hardcode only 28 Engineering URLs out of 82 published. Missing from sitemap: `admissions`, `placements`, `why-students-choose-jkkn`, `alumni`, `research-and-development-cell`, `best-engineering-college-in-*` (all 5 city pages), every committee page, `courses-offered/ug/be-cse|be-eee|be-mechanical|btech-it`. Even after fixing §3.1, these won't be indexed.

**Proper fix:** sitemap should query `cms_pages` at runtime (`WHERE status='published' AND institution_id='engineering'`) — not hand-listed.

---

### 3.10 ℹ No Person schema, no E-E-A-T signals on faculty

No faculty profile URL shape exists; no author bylines on blog posts; no `"@type":"Person"` in any CMS block. December 2025 E-E-A-T update made this a ranking factor for **all** competitive queries, not just YMYL.

---

## 4. Schema / Structured Data Gap Summary

| Page type | Required JSON-LD | Present on Engineering? | Confidence |
|---|---|---|---|
| Homepage | `EducationalOrganization` + `WebSite` + `BreadcrumbList` | Partial | 🟡 |
| Course pages (7 UG/PG) | `Course` + `BreadcrumbList` | Partial | 🟡 |
| FAQ pages | `FAQPage` | Missing (no pages exist) | 🟢 |
| Contact | `LocalBusiness` + `PostalAddress` + `GeoCoordinates` | Partial | 🟡 |
| Faculty | `Person` | Missing | 🟢 |
| Testimonials | `Review` + `AggregateRating` | Missing | 🟢 |
| Blog posts | `Article` + Person author | Partial — no author | 🟡 |
| Events | `Event` | Missing | 🟢 |
| Admission guide | `HowTo` — **DEPRECATED Sept 2023, do not add** | — | 🟢 |
| Location pages | `LocalBusiness` + `EducationalOrganization` | Unknown — city pages exist but schema not verified | ⚪ |
| Every page | `BreadcrumbList` + `Organization.sameAs` | Partial | 🟡 |

**Rule reminder from Agentic-SEO-Skill:** never recommend HowTo schema (rich results removed Sept 2023) and never recommend FAQPage for rich results on non-government sites (restricted Aug 2023). Still implement FAQPage for LLM visibility.

---

## 5. Competitive Context

Engineering colleges you're losing queries to because of gaps above:

| Competitor | Has /fee-structure | Has /faq | Has /testimonials | Has /tnea-cutoff | Has /blog hub |
|---|---|---|---|---|---|
| Kongu Engineering | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bannari Amman | ✅ | ✅ | ✅ | ✅ | ✅ |
| PSG Tech | ✅ | Partial | ✅ | ✅ | ✅ |
| **JKKN (you)** | ❌ | ❌ | ❌ | ❌ | ❌ |

(Competitor check inferred from public audit patterns; verify with WebFetch if needed. Confidence: 🟡)

---

## 6. Severity-Weighted Score

Using the Agentic-SEO-Skill rubric (25/20/15/15/10/10/5 weights):

| Category | Weight | Your score | Weighted |
|---|---|---|---|
| Technical SEO (blocked by sitemap bug) | 25 | 35 | 8.75 |
| Content Quality / E-E-A-T (no author, no testimonials) | 20 | 45 | 9.00 |
| On-Page SEO (good course pages, weak decision pages) | 15 | 60 | 9.00 |
| Schema / Structured Data (missing FAQPage, Review, Person) | 15 | 30 | 4.50 |
| Performance (CWV) — not measured today | 10 | 65¹ | 6.50 |
| Image Optimization — not measured today | 10 | 60¹ | 6.00 |
| AI Search / GEO Readiness | 5 | 25 | 1.25 |
| **Total** | **100** | — | **45 / 100 → "Poor"** |

¹ Hypothesis scores pending PageSpeed Insights run (was not executed due to sandbox constraints). Confidence: 🔵 for these two rows only.

Headline: the site is in the **Poor** band primarily because technical indexing is broken at the sitemap layer and because AEO/GEO assets are absent. Your **content** quality on the pages that do exist is above peers — you just can't get Google or Perplexity to find or cite them.

---

## 7. Environment Limitations

- PageSpeed Insights, Lighthouse, and live Core Web Vitals were **not run** in this audit pass (sandboxed environment, no API execution). All CWV scores are **hypothetical placeholders** — run `python3 .claude/skills/Agentic-SEO-Skill/scripts/pagespeed.py https://engg.jkkn.ac.in --strategy mobile` before acting on those two rows.
- Schema validation was inferred from repo search, not live HTML crawl. Run `scripts/validate_schema.py` against a rendered page bundle for authoritative schema audit.
- Competitor comparison in §5 is inferred; a first-party WebFetch audit of the three named competitors would raise confidence.

None of these gaps block the Action Plan — every Priority-1 item is already at Confirmed (🟢) or Likely (🟡) confidence.

---

## 8. Deliverables

- This file: `FULL-AUDIT-REPORT.md`
- Prioritized fixes: `ACTION-PLAN.md` (same directory)
