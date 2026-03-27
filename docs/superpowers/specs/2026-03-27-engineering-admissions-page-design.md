# Engineering Admissions Page — Design Spec
**Date:** 2026-03-27
**Status:** Approved
**Route:** `/admissions/engineering`
**Institution:** JKKN College of Engineering and Technology

---

## 1. Overview

A dedicated, public-facing admissions information page for the engineering college. The page is purely informational — no form, no mutations — and funnels prospective students and parents to the external admission portal.

**Goal:** Give a prospective student (or parent) every piece of information they need to decide to apply, then send them to the external portal with one clear CTA.

**Not in scope:**
- Admission inquiry form (removed by user decision)
- Interactive eligibility checker (deferred to Phase 2)
- Campus tour / video embed (Phase 2)
- Alumni profiles (Phase 2)

---

## 2. Route & File Structure

```
app/(public)/admissions/engineering/
├── page.tsx                          ← RSC page entry, metadata, schema markup

lib/institutions/engineering/
└── admissions-data.ts                ← All static content (programs, eligibility,
                                         fees, scholarships, FAQs, dates)
```

### Existing components reused (no new components needed):
```
components/cms-blocks/admissions/
├── admission-hero.tsx                ← Section 1
├── eligibility-criteria-table.tsx   ← Section 3
├── admission-dates-table.tsx         ← Section 5

components/public/admissions/
├── admissions-courses-tab.tsx        ← Section 4
├── admissions-faq.tsx                ← Section 7
```

### New lightweight components to build:
```
components/public/admissions/
├── trust-bar.tsx                     ← Section 2 (3-stat micro-section)
├── fee-scholarships-section.tsx      ← Section 6 (fee table + scholarship cards)
├── admissions-final-cta.tsx          ← Section 7 bottom (Apply Online button)
```

---

## 3. Page Sections (7 Core Sections)

### Section 1 — Hero
**Component:** `admission-hero.tsx` (existing)
**Type:** RSC
**Content:**
- Headline: `"Engineering Admissions 2026–27"`
- Accent word: `"2026–27"` in JKKN Green
- Subtitle: `"AICTE Approved · Autonomous · Affiliated to Anna University"`
- Trust badges: NAAC A Accredited, AICTE Approved, UGC Recognized, 74+ Years
- Primary CTA: `"Apply Online"` → `https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8` (opens in new tab)
- Secondary CTA: `"Download Brochure"` (links to PDF if available, else hidden)
- Background: JKKN Green gradient (`#0b6d41`)

---

### Section 2 — Trust Bar *(new micro-section)*
**Component:** `trust-bar.tsx` (new, ~40 lines)
**Type:** RSC
**Content:** 3 stat cards in a horizontal row:
| Stat | Value | Note |
|------|-------|------|
| Placement Rate | 92%+ | Verified by Placement Committee |
| Accreditation | NAAC A | Current cycle |
| Average Package | ₹3.5L | 2024–25 batch |

**Layout:** 3 equal columns on desktop, stacked on mobile
**Background:** White card on cream (`#fbfbee`)
**Note for implementer:** Each stat must include a `verifiedOn` prop displayed as small subtext (e.g., "as of 2025"). Avoids legal liability from unattributed claims.

---

### Section 3 — Eligibility Criteria
**Component:** `eligibility-criteria-table.tsx` (existing)
**Type:** RSC
**Content (from `admissions-data.ts`):**

**UG Programs (B.E / B.Tech):**
- Qualification: 10+2 with Physics, Chemistry, Mathematics
- Minimum marks: 45% aggregate (40% for reserved categories)
- Entry mode: TNEA Counselling or Direct Admission (Management Quota)
- Age: 17 years as of July 1st of admission year

**PG Programs (M.E / MBA):**
- Qualification: Bachelor's degree with minimum 50% marks
- Entrance: TANCET / CAT / MAT / XAT score
- Selection: Group Discussion + Personal Interview

**Mobile layout:** Accordion by program category (UG / PG), not a horizontal table scroll.

---

### Section 4 — Programs Offered
**Component:** `admissions-courses-tab.tsx` (existing)
**Type:** Client (`'use client'` — tab state)
**Content (from `admissions-data.ts`):**

**Tab 1: UG Programs (4 Years)**
| Program | Seats | Specialization Focus |
|---------|-------|----------------------|
| B.E Computer Science & Engineering | 60 | AI, ML, Cloud Computing |
| B.E Electrical & Electronics Engineering | 60 | Power Systems, Smart Grid |
| B.E Electronics & Communication Engineering | 60 | VLSI, Embedded Systems |
| B.E Mechanical Engineering | 120 | CAD/CAM, Thermal Engineering |
| B.Tech Information Technology | 60 | Networking, Cybersecurity |

**Tab 2: PG Programs (2 Years)**
| Program | Seats |
|---------|-------|
| M.E Computer Science & Engineering | 60 |
| M.B.A (Master of Business Administration) | 120 |

Each program card links to its existing course detail page under `/courses-offered/`.

---

### Section 5 — Admission Dates
**Component:** `admission-dates-table.tsx` (existing)
**Type:** RSC
**Content (from `admissions-data.ts`):**

| Event | Date | Status |
|-------|------|--------|
| Application Portal Opens | April 1, 2026 | upcoming |
| Last Date to Apply | May 31, 2026 | upcoming |
| TNEA Counselling | June–July 2026 | upcoming |
| Direct Admission Window | May 1 – July 31, 2026 | upcoming |
| Classes Commence | August 2026 | upcoming |

**Status badge colors:**
- `upcoming` → JKKN Yellow (`#ffde59`)
- `open` → JKKN Green (`#0b6d41`)
- `closed` → Red (`#DC2626`)
- `extended` → Orange (`#EA580C`)

**Note:** Dates stored in `admissions-data.ts` as ISO strings. A developer updates this file each admission cycle (June). Phase 2 will migrate to `current_application_window` Supabase table.

---

### Section 6 — Fee Structure + Scholarships
**Component:** `fee-scholarships-section.tsx` (new, ~80 lines)
**Type:** RSC
**Layout:** Two subsections stacked vertically

**6A — Fee Structure:**

| Program | Annual Tuition | Hostel (Optional) |
|---------|---------------|-------------------|
| B.E / B.Tech (all branches) | ₹95,000 | ₹60,000 |
| M.E CSE | ₹85,000 | ₹60,000 |
| M.B.A | ₹80,000 | ₹60,000 |

Lead text: *"Fees shown per academic year. Hostel is optional and all-inclusive (meals + utilities)."*

**6B — Scholarships (4 cards):**
| Type | Benefit | Eligibility |
|------|---------|-------------|
| Merit Scholarship | Up to 100% tuition waiver | 90%+ in 10+2 / rank holders |
| Government Scholarship | Direct bank transfer | SC / ST / OBC / MBC / EWS / Minority |
| Need-Based Aid | Up to 50% fee waiver | Family income criteria |
| Sports & Cultural | Special quota + fee benefit | State / National achievers |

Each card has: Icon + Title + Benefit + Eligibility line + `"Check Eligibility →"` link (links to relevant govt. scholarship portal or admissions office contact).

Lead text above cards: *"75% of JKKN students receive some form of scholarship or financial aid."*

---

### Section 7 — FAQ + Final CTA
**Component:** `admissions-faq.tsx` (existing) + `admissions-final-cta.tsx` (new, ~20 lines)
**Type:** Client (accordion state)
**Content (from `admissions-data.ts`):**

**Student FAQs (5):**
1. What is the eligibility for B.E / B.Tech admission?
2. How does TNEA counselling work for engineering seats?
3. Is there a management quota for direct admission?
4. What entrance exams are accepted for M.E / MBA?
5. Can students from outside Tamil Nadu apply?

**Parent FAQs (5):**
1. What is the total cost of education including hostel?
2. What percentage of students get placed after graduation?
3. Is the campus safe? What are the hostel facilities?
4. Are there scholarships for financially weaker families?
5. How do I contact the admissions office?

**Final CTA (below FAQ):**
```
┌──────────────────────────────────────────────────┐
│  Ready to Apply?                                  │
│  Complete your application on the official        │
│  JKKN Admissions Portal.                         │
│                                                   │
│  [Apply Online →]  (JKKN Yellow button)          │
│  Opens: https://admission.jkkn.ac.in/form/...    │
│                                                   │
│  Questions? Call: +91-XXXXXXXXXX                  │
└──────────────────────────────────────────────────┘
```

---

## 4. Persistent UI Elements

**Sticky Header (all viewports):**
```
[JKKN Logo]  ────────────────────  [Apply Online ▶]
```
- Background: JKKN Green (`#0b6d41`)
- CTA: JKKN Yellow button (`#ffde59`) with green text
- On scroll: Adds drop shadow

**Mobile Sticky Footer (≤768px):**
```
[ 📞 Call Now ]  [ 💬 WhatsApp ]  [ 📝 Apply Online ]
```
- 3 equal-width buttons
- Background: White with top border
- Phone + WhatsApp deep-link to admissions contact number

---

## 5. SEO & Metadata

```typescript
export const metadata: Metadata = {
  title: 'Engineering Admissions 2026-27 | JKKN College of Engineering',
  description: 'Apply to JKKN College of Engineering — AICTE approved, Anna University affiliated. B.E/B.Tech in CSE, ECE, EEE, Mechanical, IT. MBA & M.E postgraduate programs. 92%+ placements.',
  openGraph: {
    title: 'JKKN Engineering Admissions 2026-27',
    description: 'NAAC A accredited. 5 UG + 2 PG programs. 92%+ placement. Apply now.',
    url: 'https://engg.jkkn.ac.in/admissions/engineering',
    type: 'website',
    images: [{ url: '/og/engineering-admissions.jpg', width: 1200, height: 630 }]
  },
  alternates: { canonical: '/admissions/engineering' }
}
```

**Schema.org markup (inline JSON-LD in page.tsx):**
- `FAQPage` — drives Google rich results for FAQ
- `BreadcrumbList` — Home → Admissions → Engineering
- `EducationalOrganization` — JKKN Engineering college details
- `Course` — One entry per UG/PG program (name, duration, provider)

---

## 6. Static Data File Contract

```typescript
// lib/institutions/engineering/admissions-data.ts

export interface AdmissionProgram {
  id: string
  name: string
  level: 'UG' | 'PG'
  duration: string
  seats: number
  specializations: string[]
  coursePageUrl: string  // links to /courses-offered/...
}

export interface EligibilityCriteria {
  level: 'UG' | 'PG'
  qualification: string
  minimumMarks: string
  entryMode: string
  ageLimit?: string
  entranceExams?: string[]
}

export interface AdmissionDate {
  event: string
  date: string           // ISO date string "2026-04-01"
  status: 'upcoming' | 'open' | 'closed' | 'extended'
}

export interface FeeEntry {
  program: string
  annualTuition: number
  hostelFee: number
}

export interface ScholarshipScheme {
  id: string
  name: string
  benefit: string
  eligibility: string
  ctaUrl?: string
}

export interface FAQItem {
  question: string
  answer: string
  audience: 'student' | 'parent'
}

export interface TrustStat {
  label: string
  value: string
  verifiedOn: string   // "2025" or "April 2025"
}

export const TRUST_STATS: TrustStat[]
export const PROGRAMS: AdmissionProgram[]
export const ELIGIBILITY: EligibilityCriteria[]
export const ADMISSION_DATES: AdmissionDate[]
export const FEE_STRUCTURE: FeeEntry[]
export const SCHOLARSHIPS: ScholarshipScheme[]
export const FAQS: FAQItem[]
```

---

## 7. Rendering Architecture

| Section | Component Type | Data Source | Cache |
|---------|---------------|-------------|-------|
| 1. Hero | RSC | Static props | SSG |
| 2. Trust Bar | RSC | `admissions-data.ts` | SSG |
| 3. Eligibility | RSC | `admissions-data.ts` | SSG |
| 4. Programs | Client (tabs) | `admissions-data.ts` | SSG |
| 5. Dates | RSC | `admissions-data.ts` | SSG |
| 6. Fee + Scholarships | RSC | `admissions-data.ts` | SSG |
| 7. FAQ + CTA | Client (accordion) | `admissions-data.ts` | SSG |

**Page-level:** `export const revalidate = 86400` (daily ISR rebuild)
No Supabase reads. No Server Actions. Fully static on first deploy.

---

## 8. Design System

**Colors:**
- Primary green: `#0b6d41` — hero, header, CTA shadows, eligibility checkmarks
- Action yellow: `#ffde59` — all CTA buttons, deadline badges
- Background cream: `#fbfbee` — trust bar, alternating section bg
- Text dark: `#171717` — all body text
- Deadline red: `#DC2626` — closed status badges only

**Typography (Tailwind):**
- H1: `text-4xl md:text-5xl font-bold`
- H2: `text-2xl md:text-3xl font-bold`
- Body: `text-base leading-relaxed text-gray-700`
- Stat numbers: `text-3xl font-bold text-gray-900`

**Spacing:** 24px section gap on mobile (`py-12`), 48px on desktop (`md:py-24`)

---

## 9. Out of Scope (Phase 2)

- Interactive eligibility checker widget
- Live countdown timer (requires DB-driven deadline)
- Virtual campus tour / video embed
- Alumni profile cards
- WhatsApp chatbot integration
- A/B testing infrastructure
- Analytics scroll-depth tracking
- Migration of dates/fees to Supabase `admission_config` table

---

## 10. Implementation Notes

1. The external apply link (`https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8`) must open in a new tab with `rel="noopener noreferrer"`.
2. All `<Image>` tags for hero background and recruiter logos must use `priority` for LCP images and `loading="lazy"` for below-fold images.
3. The sticky mobile footer must use `z-index: 50` and account for iPhone safe area (`pb-safe`).
4. Phone number in Final CTA must be a real admissions number — confirm with JKKN team before deploy.
5. The `verifiedOn` field on TrustStat must never be omitted — it is a legal protection measure.
