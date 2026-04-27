# Engineering (engg.jkkn.ac.in) — Prioritized Action Plan

Companion to `FULL-AUDIT-REPORT.md`. Every item includes exact file paths, SQL targets, or commands so an engineer with zero context can pick it up.

**Legend:** 🔴 P0 same-day · 🔥 P1 this week · 🟡 P2 within a month · 🟢 P3 next quarter

---

## 1. 🔴 P0 — Fix the sitemap bug (TODAY — blocks everything downstream)

### 1.1 Patch the route handlers

**File:** `app/sitemap.xml/route.ts` (and each of `app/sitemap-pages.xml/route.ts`, `sitemap-courses.xml/route.ts`, `sitemap-blog.xml/route.ts`, `sitemap-institutions.xml/route.ts`)

**Change:**
```ts
// BEFORE
export const dynamic = 'force-static'
export const revalidate = 86400

// AFTER
export const dynamic = 'force-dynamic'   // read env vars at request time
export const revalidate = 3600           // 1-hour edge cache (honor updates quickly)
```

**Why this specific change:** `force-static` bakes the site URL into the build artifact, which is why the Engineering deployment is still serving `http://localhost:3000/...` 40 hours later despite having the right env var today. `force-dynamic` makes the handler re-read `NEXT_PUBLIC_SITE_URL` on every request, so a misconfigured build can never poison the sitemap again. Edge caching stays acceptable at 1 hour.

### 1.2 Verify the Vercel env var on the Engineering project

In the Engineering Vercel project settings:
```
NEXT_PUBLIC_SITE_URL=https://engg.jkkn.ac.in   # (no trailing slash, no http://)
NEXT_PUBLIC_INSTITUTION_ID=engineering
```
If either is missing or wrong → re-add → redeploy.

### 1.3 Make the sitemap query the CMS instead of hardcoded arrays

**File to change:** `lib/config/sitemaps.config.ts` functions `getEngineeringPages`, `getEngineeringCourses`, `getEngineeringBlog`.

**Replace the hard-coded arrays with a Supabase query in the route handler:**

```ts
// app/sitemap-pages.xml/route.ts
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data } = await supabase
    .from('cms_pages')
    .select('slug, updated_at')
    .eq('status', 'published')
  // ...map to SitemapEntry[], emit XML
}
```

**Payoff:** The moment a new page is published in the CMS (fee-structure, FAQ, testimonials, etc.), it enters the sitemap automatically. No more 28-of-82 coverage.

### 1.4 Post-deploy verification (must all pass)

```bash
curl -s https://engg.jkkn.ac.in/sitemap.xml | head -20         # no "localhost"
curl -s https://engg.jkkn.ac.in/sitemap-pages.xml | wc -l      # should be >= 80 URLs
curl -sI https://engg.jkkn.ac.in/sitemap.xml | grep -i age     # Age: small (fresh)
```
Then in Search Console → Sitemaps → Remove old → Re-submit `https://engg.jkkn.ac.in/sitemap.xml`.

**Definition of done:** zero `localhost` substrings returned by any of the five sitemap URLs, and Search Console shows "Success" within 24h.

---

## 2. 🔥 P1 — Unblock AEO / "Decision-intent" traffic (this week)

All five items below reuse existing block patterns already in the repo. Minimal net new engineering.

### 2.1 Build `/fee-structure` for Engineering

Model exactly on what Main already ships. The blocks and prop shape already exist and were updated in SQL migrations 18-24.

**Steps:**
1. Copy block JSON for Main's fee-structure page (seeds in `docs/database/main-supabase/19-22-fee-structure-*.sql`).
2. Swap in engineering-specific program rows (BE CSE, ECE, EEE, Mech, BTech IT, MBA, ME CSE).
3. Use the existing `TabsBlock` with two tabs: Management Quota vs Government Quota (Government column → "As per Government Norms" label, per memory 278).
4. Write a new SQL seed at `docs/database/main-supabase/25-engineering-fee-structure-seed.sql` (per your mandatory documentation workflow).
5. Apply via `mcp__Engineering_College_Supabase_Project__apply_migration`.

**Schema to add inline:** `Course` + `BreadcrumbList`. Do **not** add HowTo or FAQPage at this stage.

### 2.2 Build the FAQ cluster — `/faq`, `/faq/be-cse`, `/faq/mba`

This is the single highest-ROI unlock (§3.2 of the audit report).

**Content source:** most answers already exist inside your admission, placement, and course pages — just need to be re-surfaced as Q/A.

**Page structure per FAQ:**
```
- H1: "Engineering Admission FAQ – JKKN College of Engineering"
- 15–20 Q/A pairs targeting high-volume PAAs:
   * "What is TNEA cutoff for JKKN Engineering?"
   * "What is the fee for BE CSE at JKKN?"
   * "What is the highest package at JKKN Engineering placements?"
   * "How do I apply to JKKN Engineering through TNEA?"
   * "Is JKKN approved by AICTE?"
```

**Schema:** inject `FAQPage` JSON-LD **even though rich result is ineligible for commercial sites** — LLM answer engines (ChatGPT, Perplexity, Gemini, Claude web) still weight it heavily for citations.

**Registry:** add a `FAQBlock` to `lib/cms/component-registry.ts` if not present, using the existing `TabsBlock`'s Zod pattern as scaffold.

### 2.3 Build `/testimonials` with `Review` + `AggregateRating` schema

**Content requirement:** 8–12 student quotes + 3–5 alumni quotes with full name, course, graduation year, current employer, and (ideally) photo.

**Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "mainEntity": {
    "@type": "Organization",
    "name": "JKKN College of Engineering",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.5", "reviewCount": "128" },
    "review": [{ "@type": "Review", "author": {"@type":"Person","name":"..."}, "reviewBody":"...", "reviewRating":{"@type":"Rating","ratingValue":"5"} }, ...]
  }
}
```

**GEO payoff:** this is what gets you cited in ChatGPT's "what students say about JKKN Engineering" answers.

### 2.4 Build `/why-jkkn-engineering` (engineering-specific decision page)

`why-students-choose-jkkn` already exists but it's Group-level generic. Clone it and specialize:
- Specific placement stats (12 LPA highest, TCS/Infosys/Foxconn)
- CSE-specific coding culture, lab count, hackathon wins
- Unique USP: Foxconn MoU, 500-bed hospital adjacent, AICTE + NAAC grades
- 3 data-rich comparison bullets vs Kongu / Bannari Amman

### 2.5 Publish `/tnea-counseling-guide` + `/tnea-cutoff-marks`

These are **featured-snippet bait** for Tamil Nadu-wide engineering searches (very low competition because most colleges don't target them).

- `/tnea-counseling-guide`: step-by-step walkthrough (registration → certificate verification → tentative allotment → confirmation → reporting). Pure SEO content, 1500+ words.
- `/tnea-cutoff-marks`: year-on-year cutoff table per branch (use a `TableBlock` if you have one, else `TabsBlock`). Target: one-number-answer snippet.

**Schema:** `BreadcrumbList` only. (Do not use HowTo — deprecated Sept 2023.)

---

## 3. 🟡 P2 — Department hub + topical clusters (within 1 month)

### 3.1 Build `/departments` hub + 5 department pages

Audit correctly identified this. Note the crucial distinction from course pages:

| Course page (already exists) | Department page (to build) |
|---|---|
| `courses-offered/ug/be-cse` | `department/cse` |
| "What is the B.E CSE program?" | "Who are the CSE faculty? What labs?" |
| Syllabus, eligibility, fees | Org unit, research output, events, contact |

**5 deliverables:** `/departments` (hub), `/department/cse`, `/department/ece`, `/department/eee`, `/department/mech`. Add `/department/it` if you want IT separate from CSE.

**Internal linking rule:** every department page links to its course page and vice versa. This is what builds topical authority.

### 3.2 Build `/blog` hub + clean up orphaned flat URLs

Two moves:

1. **Create `/blog` hub** that paginates all posts with category filters (Events, Academic, Placements, Workshops). Add `Blog` + `Breadcrumb` schema to the hub.
2. **Redirect flat URLs to `/blog/[slug]`** for 30+ existing posts (`/orbitra26`, `/technovanza-2k25`, `/safer-internet-day-2`, etc.). Use 301 redirects in `next.config.ts` so you preserve any existing link equity.

**Author schema:** every post needs `"author": {"@type":"Person","name":"..."}` — pulls from a new `faculty_directory` table or inline for now.

### 3.3 Build `/faculty-directory` + Person schema

Essential E-E-A-T move (§3.10). Start with department heads (5–10 profiles) as MVP:
- Name, designation, qualifications, experience, specialization, Google Scholar / ORCID links
- `Person` schema on each profile
- `sameAs` array linking to LinkedIn / Scholar / ResearchGate

### 3.4 Kill duplicates + consolidate NIRF URLs

**Delete from `cms_pages`:**
```sql
DELETE FROM cms_pages WHERE slug IN (
  'approvals-affiliation',          -- duplicate of approvals-and-affiliation
  'placement',                      -- duplicate of placements
  'programs/be-mechanical-engineering',  -- duplicate of courses-offered/ug/be-mechanical
  'nav-cities', 'nav-cities-salem', 'nav-cities-erode',
  'nav-cities-namakkal', 'nav-cities-coimbatore', 'nav-cities-tiruppur'
  -- superseded by best-engineering-college-in-* pages
);
```
(Document this first under `docs/database/main-supabase/25-engineering-cleanup-duplicates.sql` per workflow.)

**NIRF consolidation — keep only:**
- `iqac/nirf` (hub)
- `iqac/nirf/nirf-2024`
- `iqac/nirf/nirf-2025`

**301-redirect from `next.config.ts`:** `/nirf-2`, `/nirf2024`, `/nirf-2025` → `/iqac/nirf/nirf-2025`

### 3.5 Expose city landing pages in the sitemap

Already covered by 1.3 (switch to CMS-backed sitemap). If you're deferring 1.3, manually add to `getEngineeringPages()`:
```ts
{ loc: `${siteUrl}/best-engineering-college-in-salem`, ... },
{ loc: `${siteUrl}/best-engineering-college-in-erode`, ... },
{ loc: `${siteUrl}/best-engineering-college-in-coimbatore`, ... },
{ loc: `${siteUrl}/best-engineering-college-in-namakkal`, ... },
{ loc: `${siteUrl}/best-engineering-college-in-tiruppur`, ... },
```

### 3.6 Publish waiting drafts (or delete them)

Make a call on each:
- `graduation-day`, `others/achievements`, `others/digital-campus`, `facilities/wi-fi-campus`, `institutional-plan` → either complete and publish, or delete.
- `courses-offered/pg/me-embedded-systems`, `courses-offered/pg/me-power-systems` → if these programs are real, publish; if discontinued, delete.

Drafts sitting indefinitely are a governance smell, not an SEO problem — but fixing them closes out §3.7 of the audit.

### 3.7 Build `/scholarships` + `/industry-partnerships`

Short pages (600-1000 words each). `Scholarships` is conversion-intent. `Industry partnerships` is GEO bait — mention Foxconn, TCS, Infosys explicitly so LLMs cite you when students search "engineering colleges with Foxconn MoU".

---

## 4. 🟢 P3 — Growth & authority (next quarter)

- `/events` hub + Event schema on each tech fest / hackathon.
- `/projects-innovations` — student hackathon wins, patents, IoT projects (GEO gold).
- `/training-certifications` — placement training, coding bootcamps, MoUs.
- 2–3 `/jkkn-engineering-vs-kongu`, `/jkkn-engineering-vs-bannari-amman` comparison pages. These capture the #1 highest-intent queries in the sector. Keep them balanced (don't trash-talk) so you don't lose trust signals.
- Campus tour / virtual tour page with `VideoObject` schema.
- Blog authorship: establish 3 recurring internal authors with bylines + faculty directory backlinks.

---

## 5. Recommended sequencing (first 4 weeks)

| Week | Items | Expected impact |
|---|---|---|
| Day 1 | §1.1, §1.2, §1.4 (sitemap patch + redeploy + GSC resubmit) | Unlock 80 pages for indexing within 7–14 days |
| Week 1 | §2.1 fee-structure, §2.4 why-jkkn-engineering | Capture decision/transactional queries |
| Week 2 | §2.2 FAQ cluster + §2.3 testimonials | AEO + GEO unlock |
| Week 3 | §2.5 TNEA pages + §3.4 duplicate cleanup + §3.5 city pages in sitemap | Long-tail + local capture |
| Week 4 | §3.1 department pages + §1.3 CMS-backed sitemap | Topical authority |

Track in Search Console: **Indexed pages count**, **Impressions**, **Total clicks** — baseline before Day 1, then weekly.

---

## 6. Things NOT to do

- ❌ Don't add `HowTo` schema anywhere — deprecated September 2023, zero rich-result benefit.
- ❌ Don't promise "FAQ rich results" to stakeholders — non-government sites were restricted in August 2023. Add FAQPage schema for **LLM answer engine** citation benefit only.
- ❌ Don't reference `FID` anywhere. It was removed September 9, 2024 — the sole interactivity metric is now **INP**.
- ❌ Don't clone this audit's competitor-comparison recommendations into **trash-talk**. Stay factual; Google and LLMs penalize hostile comparison content.
- ❌ Don't add `Review` schema with fake or synthetic testimonials. Every `Review` must be a real person attributed with real permission — Google's spam systems detect fabricated review schema.
- ❌ Don't hand-list sitemap URLs going forward (§1.3). Every time the CMS grows, manual sitemap maintenance creates the exact kind of drift that caused §3.9.

---

## 7. Open questions requiring your decision

1. Do we keep **`be-mechanical-engineering` (draft)** or delete it in favor of the already-published `courses-offered/ug/be-mechanical`? (Recommendation: delete draft.)
2. Are ME Embedded Systems and ME Power Systems programs **still offered**? Drives whether §3.6 publishes or deletes them.
3. Do you want **engineering-specific blog posts** (coding tips, career guides) in addition to the existing event recap posts? If yes, we plan topic clusters during §3.2.
4. Should location pages target **"best engineering college in X"** (current slugs) or also add **"engineering college near X"** and **"B.E admission X"** variants?

---

**Owner:** Engineering site lead + CMS editor + one dev for §1 and §3.5.
**Effort estimate:** 30–40 engineer-hours for P0+P1; another 40–60 for P2. Content creation (FAQ, testimonials, department pages) is the time sink, not the code.

