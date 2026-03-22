---
title: "JKKN Institutions — Unified SEO + GEO + AEO Audit"
date: 2026-03-15
type: audit
tags: [seo, geo, aeo, local-seo, jkkn, audit, answer-engine, ai-search]
status: complete
---

# JKKN Institutions — Unified SEO + GEO + AEO Audit

**Website:** https://www.jkkn.ac.in/
**Audit Date:** 2026-03-15
**Target Keyword:** "Best College in Erode"
**Institution:** 11 properties — 9 institutions (7 colleges, 2 schools) + 1 placements portal + 1 main domain, Komarapalayam, Namakkal District, Tamil Nadu

---

## Master Scorecard

| Dimension | Score | Grade | Verdict |
|-----------|-------|-------|---------|
| **Traditional SEO** | 61/100 | C+ | Solid infrastructure, empty content |
| **GEO (AI Search)** | 61/100 | C+ | Crawlers invited, nothing to crawl |
| **AEO (Answer Engine)** | 38/100 | D+ | Zero featured snippets, missing critical pages |
| **Local SEO** | 47/100 | D+ | Wrong city claim, thin citations |
| **Overall** | **52/100** | **C** | **Great plumbing, no water** |

### Sub-Scores (Detailed)

| Category | Score | Notes |
|----------|-------|-------|
| AI Crawlability | 92/100 | Best-in-class robots.txt — 30+ AI bots allowed |
| Schema / Structured Data | 80/100 | EducationalOrganization, Course, BreadcrumbList, VideoObject |
| Site Architecture | 65/100 | Next.js, sitemap index, clean URLs |
| NAP Consistency | 61/100 | Two phone numbers, address spelling varies |
| Technical SEO | 58/100 | www vs non-www canonical split |
| E-E-A-T Signals | 55/100 | 70 years history but zero faculty pages |
| On-Page SEO | 55/100 | Missing H1s, 1-word title tags |
| Content Citability | 52/100 | Great claims buried in schema, not HTML |
| Content Quality | 50/100 | Multiple pages literally say "no content yet" |
| Local Content Strategy | 48/100 | Blog is dental-only, no local intent content |
| Q&A / FAQ Format | 45/100 | FAQ schema on 2 pages out of 77 |
| Geographic Keywords | 44/100 | Claims "Erode" while address says "Namakkal" |
| Local Schema | 42/100 | No GeoCoordinates, no areaServed, wrong streetAddress |
| Brand Entity Strength | 38/100 | No Wikipedia, inconsistent founding date |
| Citation / Directory Presence | 35/100 | CollegeDunia, Shiksha, Careers360 — all unverified |
| Multi-Location SEO | 30/100 | 9 institutions share one schema block |
| Featured Snippet Readiness | 6/20 | Zero snippet-format content anywhere |
| Voice Search | 4/15 | No speakable schema, no conversational answers |

---

## The One-Paragraph Diagnosis

JKKN has made a sophisticated technical investment — Next.js App Router, 4-part sitemap index, robots.txt that invites 30+ AI crawlers, and schema markup broader than most Indian colleges. But those AI crawlers arrive and find pages with no meta descriptions, no H1 tags, a founding date that contradicts itself three times (1952, 1969, 1994), a streetAddress field that says the organization name instead of a street, and a "Best College in Erode" title tag on a campus that's in Namakkal District. **The infrastructure says "world-class." The content says "under construction."** Close that gap and rankings will follow.

---

## CRITICAL ISSUES (11 findings)

### C1 — /admission and /fee-structure Return 404
**Priority: P0 | Impact: SEO + AEO + GEO | Effort: 2-3 days**

The two highest-converting URLs a prospective student would visit don't exist. Every day these pages are missing, aggregator sites (CollegeDunia, Shiksha) own the answer.

- `/admission` — no page, no sitemap entry, no redirect
- `/fee-structure` — 404, no content anywhere on site
- `/courses` — 404 (actual page lives at `/courses-offered`)

**Fix:**
- Create `/admission` with HowTo schema (5-step process), eligibility bullets, FAQPage (6 Q&As)
- Create `/fee-structure` with HTML table (not PDF), Course schema with `offers.price`
- 301 redirect `/courses` → `/courses-offered`

---

### C2 — Multiple High-Priority Pages Are Empty
**Priority: P0 | Impact: SEO + GEO + AEO | Effort: 3-5 days**

Confirmed empty or near-empty:
- `/about` — ~50-100 words, no H1, no meta description
- `/placements` — shows "This page has no content yet" while FAQPage schema claims 95% placement rate
- `/engineering-courses` — ~150 words, template-thin
- Individual college pages — blank JS shells, no static HTML

**The schema tells Google a great story. The HTML tells Google nothing.** Google ranks the HTML.

---

### C3 — Missing H1 Tags on 4 Key Pages
**Priority: P0 | Impact: SEO + AEO | Effort: 1 hour**

Pages missing H1: `/about`, `/placements`, `/courses-offered`, `/engineering-courses`

Homepage has TWO H1s ("JKKN Institutions" + "Excellence in Education") — consolidate to one.

**Recommended H1s:**

| Page | H1 |
|------|-----|
| / | "JKKN Institutions — Best College Near Erode, Tamil Nadu" |
| /about | "About JKKN Institutions — Premier College Group Since 1952" |
| /placements | "Campus Placements at JKKN — 95%+ Success Rate, 100+ Recruiters" |
| /courses-offered | "Courses Offered at JKKN Institutions — 50+ Programs" |
| /engineering-courses | "B.E & B.Tech Engineering Courses at JKKN, Near Erode" |

---

### C4 — www vs non-www Canonical Split
**Priority: P1 | Impact: SEO | Effort: 2 hours**

- Homepage canonical: `https://www.jkkn.ac.in` (with www)
- All 4 sitemaps: `https://jkkn.ac.in/` (no www)
- robots.txt Sitemap directive: no www

Google sees two different versions of the site. Link equity is split.

**Fix:** Enforce `https://www.jkkn.ac.in/` everywhere — 301 redirects, update all sitemaps, update robots.txt.

---

### C5 — "Vission And Mission" Typo in Title Tag
**Priority: P1 | Impact: SEO | Effort: 5 minutes**

The `/vision-and-mission` page title has a double-s typo. This is what Google displays in search results.

---

### C6 — No Google Analytics (Only Facebook Pixel)
**Priority: P1 | Impact: All | Effort: 1 hour**

Without GA4: no organic traffic tracking, no Core Web Vitals data, no conversion measurement, no GSC audience data.

**Fix:** GA4 property + GTM container. Set up conversion events: form_submit, phone_click, whatsapp_click.

---

### C7 — Founding Date Contradicts Itself 3 Times
**Priority: P1 | Impact: GEO + AEO | Effort: 1 hour**

| Source | Year |
|--------|------|
| Homepage schema | 1952 |
| Trust page | 1969 |
| Accreditation meta description | 1994 |
| Vision page ("57+ years") | ~1969 |

AI systems cannot confidently cite an entity that disagrees with itself about when it was founded. **Pick 1952 and apply everywhere.**

---

### C8 — streetAddress Schema Says Organization Name, Not Address
**Priority: P1 | Impact: Local SEO + GEO | Effort: 10 minutes**

`"streetAddress": "JKKN Educational Institutions"` → should be `"Natarajapuram, NH-544"`

---

### C9 — No GeoCoordinates in Schema
**Priority: P1 | Impact: Local SEO + GEO | Effort: 10 minutes**

Google Maps embed has coordinates (11.445180, 77.726549) but they're not in schema markup. Add:

```json
"geo": {
  "@type": "GeoCoordinates",
  "latitude": "11.445180",
  "longitude": "77.726549"
}
```

---

### C10 — Two Phone Numbers Create NAP Fragmentation
**Priority: P1 | Impact: Local SEO | Effort: 30 minutes**

Schema: +91-4288-234001 (landline). Displayed: +91 93458 55001 (mobile). Pick ONE and use it identically across site, schema, GBP, and all directories.

---

### C11 — "Best College in Erode" — But Address Says Namakkal
**Priority: P1 | Impact: Local SEO + GEO | Effort: Strategic**

JKKN is in Komarapalayam, Namakkal District — not Erode District. The title tag says "Erode" but the address says "Namakkal." Google's local algorithm reads both. This mismatch is an active liability that grows riskier as algorithms mature.

**Fix:** Pivot to "Best College **Near** Erode" — honest, defensible, still captures traffic intent. Add `areaServed` schema listing Erode as a service area:

```json
"areaServed": [
  {"@type": "City", "name": "Erode"},
  {"@type": "City", "name": "Salem"},
  {"@type": "City", "name": "Coimbatore"},
  {"@type": "AdministrativeArea", "name": "Namakkal District"}
]
```

---

## WARNINGS (10 findings)

### W1 — Inner Page Title Tags Are 1-2 Words
Generic titles waste 50-60 characters of prime SERP real estate. `/about` → "About", `/placements` → "Placements", `/courses-offered` → "COURSES OFFERED" (all caps).

**Fix pattern:** `[Topic] | JKKN [College] — [City/Benefit]`

---

### W2 — Missing Meta Descriptions on Most Inner Pages
Missing on: `/about`, `/placements`, `/engineering-courses`, `/vision-and-mission`, all college pages, all course pages. These are what AI systems use as summary text.

---

### W3 — No FAQPage Schema on Most Pages
FAQ exists only on `/placements` (5 Q&As) and `dental.jkkn.ac.in` (6 Q&As). Every other major page — Engineering, Pharmacy, Nursing, Allied Health, Arts & Science, About — has none. **This is the single highest-impact AEO fix.**

---

### W4 — Blog Not in Main Navigation
35 blog posts with strong keyword slugs exist but aren't linked from navigation. Blog content provides topical authority signals. Add "Blog" to nav + "Recent Posts" section on homepage.

---

### W5 — Course Pages Are Thin (~150 words)
Template-generated pages with course names and durations only. Need 400-600 words covering: why study this field, JKKN's strengths, facilities, placement outcomes, FAQ section.

---

### W6 — FAQ Schema Content Not Rendered as HTML
FAQ content exists in JSON-LD but is invisible on the page. Google requires FAQ content to be visible to users, not schema-only.

---

### W7 — Duplicate /home and / in Sitemap
Both `https://jkkn.ac.in` and `https://jkkn.ac.in/home` listed with `priority=1.0`.

---

### W8 — All Sitemaps Use Static lastmod Date
Every URL shows `lastmod: 2026-02-16` — a build-time stamp, not actual update dates. Configure dynamic lastmod.

---

### W9 — Komarapalayam vs Kumarapalayam Spelling Inconsistency
Both spellings appear on the site. Pick one, use it 100% consistently.

---

### W10 — Facebook sameAs URL Suspicious
Schema lists `facebook.com/jkaboratory` — doesn't match JKKN branding. If wrong, this actively weakens entity resolution.

---

## OPPORTUNITIES (15 findings)

### High Impact

| # | Opportunity | Type | Expected Impact |
|---|------------|------|-----------------|
| O1 | Create `/best-college-near-erode` landing page | SEO + AEO | Dedicated keyword page > homepage doing double duty |
| O2 | Add FAQPage schema to all 8 course pages (5 Q&As each) | AEO + GEO | Direct PAA box appearances within weeks |
| O3 | Create Wikipedia article for JKKN Institutions | GEO + AEO | Strongest knowledge panel signal available |
| O4 | Add AggregateRating schema after collecting Google reviews | SEO + AEO | Star ratings in SERPs — major CTR boost |
| O5 | Create `/rankings-and-recognitions` page | GEO + AEO | Canonical citation source for AI systems |

### Medium Impact

| # | Opportunity | Type | Expected Impact |
|---|------------|------|-----------------|
| O6 | Optimize Google Business Profile for each of 9 institutions | Local SEO | Local Pack ranking for "college near erode" |
| O7 | Add BlogPosting schema to all 35 blog posts | GEO + AEO | Blog becomes AI-citable |
| O8 | Create `/how-to-reach` page with distance tables | Local SEO + AEO | Rank for "distance from Erode to JKKN" |
| O9 | Add faculty pages with Person schema | GEO (E-E-A-T) | YMYL content requires demonstrated expertise |
| O10 | Individual EducationalOrganization schema per college | GEO + Local | 9 colleges need 9 entity profiles |
| O11 | Core Web Vitals audit (PageSpeed target 75+ mobile) | SEO | Page Experience ranking signals |

### Lower Impact / Long-Term

| # | Opportunity | Type | Expected Impact |
|---|------------|------|-----------------|
| O12 | Tamil language pages with hreflang tags | Local SEO | Vernacular search advantage |
| O13 | Image alt text audit across all pages | SEO + AEO | Google Image traffic + accessibility |
| O14 | Add Speakable schema to college pages | AEO | Voice search / Google Assistant extraction |
| O15 | Subdomain SEO audit and consolidation | SEO | Stop 7 subdomains from cannibalizing main site |

---

## The 3 Patterns That Explain Everything

### Pattern 1: Schema Says It, HTML Doesn't
The schema markup claims 95% placements, NAAC A, ₹12 LPA packages, 50,000 alumni. But the actual HTML pages are empty. AI and Google rank the HTML. Schema is a trust signal, not a substitute for content.

### Pattern 2: Infrastructure Without Content
robots.txt invites 30+ AI crawlers. Sitemap has 77 URLs. Next.js App Router is modern. But the pages those crawlers visit have no H1s, no meta descriptions, and "This page has no content yet" as visible text.

### Pattern 3: Claiming What You're Not
"Best College in Erode" + Address: Namakkal District. Two phone numbers. Three founding dates. Two URL schemes (www vs non-www). Google rewards consistency. Every contradiction splits authority.

---

## Unified Priority Roadmap

### Week 1 — Fix the Foundation (12 actions)

| # | Action | Source | Time |
|---|--------|--------|------|
| 1 | Fix "Vission" typo in title tag | C5 | 5 min |
| 2 | Fix streetAddress in schema (name → actual address) | C8 | 10 min |
| 3 | Add GeoCoordinates to schema | C9 | 10 min |
| 4 | Standardize founding date to 1952 everywhere | C7 | 1 hr |
| 5 | Pick one phone number, apply everywhere | C10 | 30 min |
| 6 | Standardize Komarapalayam spelling | W9 | 30 min |
| 7 | Fix www/non-www — enforce www canonical + 301 + sitemaps | C4 | 2 hr |
| 8 | Add H1 to /about, /placements, /courses-offered, /engineering | C3 | 1 hr |
| 9 | Consolidate homepage to single H1 | C3 | 30 min |
| 10 | 301 redirect /courses → /courses-offered | C1 | 10 min |
| 11 | Remove /home from sitemap | W7 | 10 min |
| 12 | Install GA4 + GTM | C6 | 1 hr |

### Week 2 — Create Critical Missing Pages (5 actions)

| # | Action | Source | Time |
|---|--------|--------|------|
| 13 | Create /admission page with HowTo schema + FAQPage | C1, AEO | 1 day |
| 14 | Create /fee-structure page with HTML tables + Course schema | C1, AEO | 1 day |
| 15 | Write real content for /about (600+ words) | C2 | 3 hr |
| 16 | Write real content for /placements (stats + testimonials as HTML) | C2, W6 | 3 hr |
| 17 | Update all inner page title tags and meta descriptions | W1, W2 | 3 hr |

### Week 3-4 — AEO + GEO Content Layer (7 actions)

| # | Action | Source | Time |
|---|--------|--------|------|
| 18 | Add FAQPage schema + visible HTML FAQs to all 8 course pages | W3, W6, O2 | 3 days |
| 19 | Add BlogPosting schema to all 35 blog posts | O7 | 1 day |
| 20 | Add FAQ section to blog post template (4 Q&As per post) | AEO | 1 day |
| 21 | Fix definition placement in blog posts (answer in sentence 1) | AEO | 1 day |
| 22 | Add Blog to main navigation + homepage "Recent Posts" section | W4 | 2 hr |
| 23 | Expand course category pages to 400-600 words | W5 | 3 days |
| 24 | Pivot "Best College in Erode" → "Best College Near Erode" + areaServed | C11 | 2 hr |

### Month 2 — Entity & Local (8 actions)

| # | Action | Source | Time |
|---|--------|--------|------|
| 25 | Create individual EducationalOrganization schema per college | O10 | 2 days |
| 26 | Create /rankings-and-recognitions page | O5 | 1 day |
| 27 | Create /how-to-reach page with distance tables + Google Maps | O8 | 1 day |
| 28 | Create /best-college-near-erode landing page | O1 | 2 days |
| 29 | GBP audit and optimization for each institution | O6 | 3 days |
| 30 | Verify/claim CollegeDunia, Shiksha, Careers360 listings | Local | 2 days |
| 31 | Verify/correct Facebook sameAs URL in schema | W10 | 30 min |
| 32 | Add Speakable schema to college pages | O14 | 2 hr |

### Month 3 — Growth & Authority (8 actions)

| # | Action | Source | Time |
|---|--------|--------|------|
| 33 | Create Wikipedia stub for JKKN Institutions | O3 | 2 days |
| 34 | Add AggregateRating schema (after collecting reviews) | O4 | 1 day |
| 35 | Add faculty pages with Person schema | O9 | 3 days |
| 36 | Image alt text audit and update across all pages | O13 | 1 day |
| 37 | Core Web Vitals audit — target 75+ mobile on PageSpeed | O11 | 2 days |
| 38 | Internal linking audit: blog posts → conversion pages | SEO | 1 day |
| 39 | Subdomain SEO audit + consolidation strategy | O15 | 3 days |
| 40 | Evaluate Tamil language pages (hreflang) | O12 | Strategic |

---

## Projected Improvement

| Dimension | Current | After Month 1 | After Month 3 |
|-----------|---------|---------------|---------------|
| Traditional SEO | 61 | ~75 | ~82 |
| GEO (AI Search) | 61 | ~72 | ~80 |
| AEO (Answer Engine) | 38 | ~58 | ~72 |
| Local SEO | 47 | ~60 | ~70 |
| **Overall** | **52** | **~66** | **~76** |

---

## Key Strengths to Build On

1. **robots.txt is world-class** — 30+ AI crawlers explicitly allowed. This is rare globally, let alone in Indian education
2. **Schema breadth exceeds competitors** — EducationalOrganization, Course, EducationalOccupationalProgram, VideoObject, BreadcrumbList, FAQPage all deployed
3. **Blog keyword strategy is sophisticated** — slugs like "dental-braces-before-and-after-complete-transformation-guide-2026" show real SEO thinking
4. **dental.jkkn.ac.in is the template** — CollegeOrUniversity schema + 6 FAQs + definitional H1 + specific stats. Copy this exact pattern to all 7 college pages
5. **Modern tech stack** — Next.js App Router positions well for future Core Web Vitals optimization
6. **Real differentiators exist** — "India's First AI-Integrated Campus", NAAC A, 70+ years, NIRF Top 50 Pharmacy (2018). These just need to be surfaced in content, not just schema

---

---

## PART 2: Per-Institution Audit (All 9 Institutions + Placements Portal)

### Institution Scorecard

| # | Institution | Subdomain | SEO | GEO | AEO | Overall* | Grade |
|---|------------|-----------|-----|-----|-----|---------|-------|
| 1 | **Pharmacy** | pharmacy.jkkn.ac.in | 78 | 74 | 80 | **77** | B+ |
| 2 | **Allied Health Sciences** | ahs.jkkn.ac.in | 75 | 85 | 80 | **75** | B |
| 3 | **Placements Portal** | placements.jkkn.ac.in | 71 | 58 | 68 | **66** | C+ |
| 4 | **Nursing** | nursing.sresakthimayeil.jkkn.ac.in | 69 | 70 | 52 | **64** | C+ |
| 5 | **Dental** | dental.jkkn.ac.in | 62 | 68 | 58 | **63** | C |
| 6 | **Engineering** | engg.jkkn.ac.in | 61 | 72 | 44 | **59** | C |
| 7 | **Education** | edu.jkkn.ac.in | 62 | 44 | 55 | **54** | C |
| 8 | **Arts & Science** | cas.jkkn.ac.in | 47 | 55 | 38 | **44** | D |
| 9 | **Matric School** | school.jkkn.ac.in | 28 | 18 | 12 | **19** | F |
| 10 | **Nattraja Vidhyalya** | nv.jkkn.ac.in | 22 | 15 | 10 | **16** | F |
| | **Main Domain** | jkkn.ac.in | 61 | 61 | 38 | **52** | C |

*Overall uses each component report's full multi-dimension scoring (6 dimensions for colleges, 4 dimensions for main domain including Local SEO), not a simple average of the three columns shown.

### Visual: The JKKN SEO Maturity Spectrum

```
Pharmacy ████████████████████████████████████████ 77  ← Template for all others
AHS      ███████████████████████████████████████  75  ← Deep course content works
Placements ██████████████████████████████████     66
Nursing  ████████████████████████████████         64
Dental   ███████████████████████████████          63  ← Flagship college, not flagship SEO
Engg     ██████████████████████████████           59  ← localhost sitemap breaking it
Education ████████████████████████████            54
Main     ██████████████████████████               52  ← Parent domain behind children
CAS      ██████████████████████                   44  ← Emergency: 404s in sitemap
School   ██████████████                           19  ← Template placeholder
NV       ████████████                             16  ← Template placeholder
```

---

### The 5 Patterns Across All 9 Institutions

#### Pattern 1: Whoever Built AHS and Pharmacy Understood SEO — Nobody Else Got the Memo

Pharmacy and AHS share: FAQPage schema, 2,500+ word course pages, salary/placement data in HTML tables, HowTo schema for admissions, and named hospital/company partners. **These two sites are proof that JKKN knows how to do this.** The problem is that this expertise was not applied to the other 7 properties.

**Action:** Use Pharmacy and AHS as literal templates. Copy their page structure, schema pattern, and content depth to every other institution.

#### Pattern 2: Every Subdomain Missing robots.txt and Sitemap → Invisible to AI

Education, both Schools, and Placements have **no robots.txt and no sitemap.xml at all.** This means:
- No AI crawler permissions (GPTBot, ClaudeBot blocked by default)
- No sitemap for Google Search Console
- Google discovers pages only by crawling, not by submission

Engineering's sitemap is worse — it exists but all URLs point to `http://localhost:3000/` (dev environment leak).

**Action:** Deploy robots.txt + sitemap.xml to all 10 properties. Use the AHS/Pharmacy robots.txt as the template. One-day task.

#### Pattern 3: Main Domain Stub Pages Are Dead Weight

Every institution has a page on jkkn.ac.in (e.g., `/jkkn-dental-college`, `/jkkn-college-of-pharmacy`). **Every single one says "This page has no content yet"** or renders as an empty JS skeleton. No canonical tag points to the subdomain. No link equity flows.

Google is indexing these empty pages AND the subdomain homepages, creating duplicate entity confusion for every institution.

**Action:** Either (a) add canonical tags pointing to the subdomains, or (b) write real content on these pages that complements (not duplicates) the subdomain.

#### Pattern 4: No `parentOrganization` Schema → Broken Entity Graph

Not a single subdomain declares `parentOrganization: JKKN Institutions` in its schema. Google's Knowledge Graph cannot establish that these 9 institutions are related. Each one is an orphan entity with no group authority.

**Action:** Add to every subdomain's schema:
```json
"parentOrganization": {
  "@type": "EducationalOrganization",
  "@id": "https://www.jkkn.ac.in/#organization",
  "name": "JKKN Institutions",
  "url": "https://www.jkkn.ac.in"
}
```

#### Pattern 5: Founding Date Wrong on Most Subdomains

Multiple subdomains use `foundingDate: 1952` (the trust's founding year) even when the college was established decades later. AHS was founded in 2019 but claims 1952. This is a verifiable factual error that damages AI trust scores.

**Action:** Each institution needs its own accurate founding date in schema.

---

### Per-Institution Critical Findings

#### 1. Pharmacy (77/100) — The Gold Standard

**What it does right:** FAQPage schema on homepage + 3 inner pages, HowTo schema on admissions, actual fee data in HTML tables, 124 sitemap URLs (5x more than Dental), Course schema with specializations.

**What needs fixing:**
- NIRF Top 50 ranking buried in PDFs — not in any HTML page. AI can't cite PDFs
- No `sameAs` pointing to PCI registry or parent JKKN
- No AggregateRating schema

**Use this as the template for all other institutions.**

---

#### 2. Allied Health Sciences (75/100) — Deep Content Works

**What it does right:** 2,500-3,000 word course pages, salary tables (₹3-15 LPA per role), 8 FAQs per course page, named hospital partners (Apollo, MIOT, Fortis, Manipal), excellent AI crawler policy.

**What needs fixing:**
- `foundingDate: 1952` is wrong — AHS was established 2019
- `/departments` returns 404 but is in navigation
- `/our-management` duplicates homepage title and meta
- No Person schema for named management

---

#### 3. Placements Portal (66/100) — Good Content, No Schema

**What it does right:** Strong homepage title/meta, real placement statistics, company logos, good content depth.

**What needs fixing:**
- Two H1 tags on homepage
- No year attribution on any placement statistic — AI citations are temporally ambiguous
- No FAQPage schema despite having FAQ content
- Education College missing from the college listing
- No robots.txt or sitemap

---

#### 4. Nursing (64/100) — Great Claims, Empty Proof Pages

**What it does right:** Homepage claims 98%+ placements, 80+ recruiting partners including NHS UK and Cleveland Clinic Abu Dhabi, salary ranges up to ₹25L. Excellent AI crawler policy.

**What needs fixing:**
- `/placement` page is blank despite incredible stats on homepage
- Homepage FAQ section has no FAQPage schema (visual FAQ exists, JSON-LD missing — 1-hour fix)
- No `/admissions` page (404)
- Main domain stub page is empty with no canonical to subdomain

---

#### 5. Dental (63/100) — Flagship College, Not Flagship SEO

**What it does right:** CollegeOrUniversity schema (correct type), FAQPage with 6 Q&As, definitional content.

**What needs fixing:**
- H1 has zero keywords — "Transform Your Future at Tamil Nadu's Premier Dental College"
- No fee data anywhere — "Contact Admissions" instead of an HTML table
- Only 25 sitemap URLs (Pharmacy has 124)
- No `sameAs` linking to DCI registry or parent JKKN
- Main domain page `/jkkn-dental-college` is a dead JS skeleton

---

#### 6. Engineering (59/100) — Localhost Sitemap Is an Emergency

**What it does right:** Good AI crawler permissions, decent robots.txt, course content exists.

**What needs fixing:**
- **EMERGENCY:** Sitemap URLs all point to `http://localhost:3000/` — development leak. Google can't use this sitemap at all
- `Host` directive in robots.txt also points to localhost
- No `/admissions` page (404)
- No FAQPage schema anywhere
- Main domain stub page empty

---

#### 7. Education (54/100) — All 14 Departments Share One Title Tag

**What it does right:** Content exists, some FAQs visible, 14 B.Ed specializations listed.

**What needs fixing:**
- All 14+ department pages have identical title: "JKKN College of Education" — severe keyword cannibalization
- All pages share identical meta description
- Zero schema markup anywhere
- Placement rate stated as 95% on Tamil page, 98% on English page — factual inconsistency
- No robots.txt or sitemap

---

#### 8. Arts & Science (44/100) — Emergency Intervention Needed

**What it does right:** Excellent robots.txt (same as AHS), autonomous status, 27 programs, ₹18 LPA highest package.

**What needs fixing:**
- **EMERGENCY:** Title tag is just "JKKN College" (12 characters) — invisible to every search query
- Course pages returning 404 while listed in sitemap at priority 0.9 — actively damaging crawl frequency
- Zero schema markup on homepage
- No CollegeOrUniversity, no Course, no FAQPage schema
- 27 programs and autonomous status — the data is compelling, the implementation is absent

---

#### 9. Matric School (19/100) — Template Placeholder

**What needs fixing (everything):**
- Meta description is a generic template: "A modern, interactive school website providing quality education..."
- No H1 tag on homepage
- No content about grades, board affiliation, fees, admission, or faculty
- No robots.txt or sitemap
- Shares identical template meta with Nattraja Vidhyalya — duplicate content risk

---

#### 10. Nattraja Vidhyalya (16/100) — Template Placeholder

**What needs fixing (everything):**
- Same template meta as Matric School — "A modern, interactive school website..."
- Title says "NV School" but institution is "Nattraja Vidhyalya" — brand mismatch
- Client-side rendered (Next.js) — Googlebot may be indexing an empty page
- No robots.txt or sitemap

---

### Cross-Institution Priority Roadmap

#### Emergency (This Week)

| # | Action | Institutions Affected | Impact |
|---|--------|----------------------|--------|
| 1 | Fix Engineering sitemap — replace localhost URLs with production | Engineering | Critical — sitemap completely broken |
| 2 | Fix CAS title tag — "JKKN College" → full name with programs | Arts & Science | Critical — invisible to all searches |
| 3 | Fix CAS 404 course pages still in sitemap | Arts & Science | Critical — damaging crawl frequency |
| 4 | Deploy robots.txt to Education, Schools, Placements | 4 subdomains | High — enables AI crawler access |
| 5 | Deploy sitemaps to all subdomains missing them | 4 subdomains | High — enables Google indexing |

#### Week 2

| # | Action | Institutions Affected |
|---|--------|-----------------------|
| 6 | Add canonical tags on all main domain stub pages → point to subdomains | All 9 |
| 7 | Add `parentOrganization` schema on all subdomains | All 9 |
| 8 | Fix founding dates — each institution gets its own accurate year | All 9 |
| 9 | Add FAQPage schema to Nursing homepage (FAQ content already exists) | Nursing |
| 10 | Fix Education title/meta — unique per department page | Education |

#### Month 1

| # | Action | Institutions Affected |
|---|--------|-----------------------|
| 11 | Replicate Pharmacy content pattern to Dental, Engineering, Nursing, Education | 4 institutions |
| 12 | Create /admissions page on every subdomain (HowTo schema) | All that lack it |
| 13 | Publish fee data in HTML tables (not "Contact Admissions") | Dental, Engineering, Nursing |
| 14 | Move placement stats from homepage to /placement page (Nursing) | Nursing |
| 15 | Add NIRF ranking data in HTML (not just PDF) | Pharmacy |

#### Month 2-3

| # | Action | Institutions Affected |
|---|--------|-----------------------|
| 16 | Add `sameAs` schema linking to regulatory registries (DCI, PCI, AICTE, INC) | All colleges |
| 17 | Write real content for both school subdomains | Schools |
| 18 | Add Person schema for HODs/management on all subdomains | All |
| 19 | Create AggregateRating schema on institutions with Google reviews | Top 5 |
| 20 | Subdomain consolidation strategy review — are 10 subdomains helping or hurting? | Strategic |

---

## Revised Overall Scorecard (Including All Properties)

| Property | Overall | Grade |
|----------|---------|-------|
| Pharmacy | 77 | B+ |
| Allied Health | 75 | B |
| Placements | 66 | C+ |
| Nursing | 64 | C+ |
| Dental | 63 | C |
| Engineering | 59 | C |
| Education | 54 | C |
| **Main Domain** | **52** | **C** |
| Arts & Science | 44 | D |
| Matric School | 19 | F |
| Nattraja Vidhyalya | 16 | F |
| **JKKN Network Average** | **54** | **C** |

---

## Component Reports

### Main Domain Audits
- [[26-03-15-SEO-Audit-JKKN|Traditional SEO Audit]] — 461 lines, technical + on-page + content analysis
- [[26-03-15-GEO-Local-Audit-JKKN|GEO + Local SEO Audit]] — 682 lines, AI search + local + competitive landscape
- [[26-03-15-AEO-Audit-JKKN|AEO Audit]] — 527 lines, featured snippets + PAA + voice + answer engines

### Per-Institution Audits
- [[26-03-15-Audit-JKKN-Dental-Pharmacy|Dental + Pharmacy]] — SEO/GEO/AEO deep-dive
- [[26-03-15-Audit-JKKN-Engineering-Nursing|Engineering + Nursing]] — SEO/GEO/AEO deep-dive
- [[26-03-15-Audit-JKKN-AlliedHealth-ArtsScience|Allied Health + Arts & Science]] — SEO/GEO/AEO deep-dive
- [[26-03-15-Audit-JKKN-Education-Schools-Placements|Education + Schools + Placements]] — SEO/GEO/AEO deep-dive

---

*Audit conducted 2026-03-15. 11 properties audited (1 main domain + 7 college subdomains + 2 school subdomains + 1 placements portal). Sources: live site crawl, robots.txt analysis, sitemap analysis, JSON-LD schema extraction, competitor research, directory presence checks. All data current as of audit date.*
