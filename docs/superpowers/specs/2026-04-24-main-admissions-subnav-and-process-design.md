# Main Site — Admissions Submenu, Fee / Scholarship Hub Pages, and 6-Step Admission Process

**Date:** 2026-04-24
**Scope:** Main institution only (`jkkn.ac.in` / `NEXT_PUBLIC_INSTITUTION_ID=main`).
**Target Supabase:** Main project `pmqodbfhsejbvfbmsfeq`.
**Status:** Design — awaiting user approval before planning.

---

## 1. Problem Statement

The main JKKN institution website has three gaps in the admissions journey:

1. **Navigation:** The `Admissions` top-level menu has no children. Two published CMS pages (`/fee-structure`, `/scholarships`) already exist but are hidden from navigation and unreachable from the menu.
2. **Fee / Scholarship college drill-down:** Visitors on `/fee-structure` should be able to click a college card and land on that college's fee page. The main Supabase already has 7 per-college fee pages seeded; but the CollegesGrid currently links to subdomain URLs that return 404 (no subdomain has the target page). The `/scholarships` page has no CollegesGrid at all, and no per-college scholarship detail pages exist.
3. **Admission process:** The current 5-step `AdmissionProcessTimeline` on `/admissions` does not reflect the new 6-step process (Learner's Registration → Online Application Submission → Payment Process → Admission Confirmation → Certificate Submission → Final Enrollment).

## 2. Goals / Non-Goals

### Goals

- Make `Fee Structure` and `Scholarships` discoverable under the `Admissions` top-level menu.
- Ensure every college card on the two hub pages leads to a working destination — subdomain URL where available, internal main-site page as fallback (F2 pattern).
- Replace the 5-step admission process on `/admissions` with the new 6-step process, including the external registration form link for step 1.
- Keep the design wire-compatible with future subdomain rollout: flipping a card from internal to subdomain should be a single props edit, not a grid rewrite.

### Non-Goals

- **No URL changes.** `/fee-structure` and `/scholarships` stay at root. No redirects, no slug rewrites, no SEO churn.
- **No subdomain Supabase work.** We are not building fee-structure or scholarships pages on Engineering / Dental / Pharmacy Supabase in this change. That is a parallel track.
- **No architectural change to `/admissions` rendering.** The page continues to render via hardcoded `_main-page.tsx`. Migrating `/admissions` to the CMS page builder is out of scope (tracked separately as obs 19 — "hardcoded institution-specific content" risk).
- **No component changes.** `AdmissionProcessTimeline` already accepts arbitrary step counts and icon names. No new React component code.

## 3. Current State (verified against Main Supabase at design time)

| Artifact | Location | Current State |
|---|---|---|
| `/admissions` (main) | `app/(public)/admissions/_main-page.tsx` | Hardcoded. AdmissionProcessTimeline passes 5-step array (Choose Program → Apply Online → Document Verification → Counselling → Confirmation). |
| `/admissions` CMS page | `cms_pages.id = 4f96c885-1ae9-41c3-b017-51d7bfae3a87` | Published, 15 blocks seeded, but **never rendered on main** (hardcoded route wins). Kept for parity with future CMS migration. |
| `/fee-structure` CMS page | `cms_pages.id = 34a92672-94aa-4237-9afc-0bf1e6cd23c1` | Published. `show_in_navigation = false`, `parent_id = null`. Blocks: `AdmissionHero`, `CollegesGrid` (7 cards → subdomain URLs), `FAQSectionBlock`, `CallToAction`. |
| `/fee-structure/{college}` × 7 | CMS child pages | Published. Each: `AdmissionHero` + `TextEditor` with GQ/MQ fee tables. Slugs: `fee-structure/allied-health`, `fee-structure/arts-and-science`, `fee-structure/dental`, `fee-structure/education`, `fee-structure/engineering`, `fee-structure/nursing`, `fee-structure/pharmacy`. |
| `/scholarships` CMS page | `cms_pages.id = 206d9a67-2729-4a95-8074-48535214696c` | Published. `show_in_navigation = false`, `parent_id = null`. Blocks: `AdmissionHero`, `ScholarshipsSection`, `ScholarshipMatrix`, `FAQSectionBlock`, `CallToAction`. **No CollegesGrid.** |
| `/scholarships/{college}` × 7 | — | **None exist.** Must be created. |
| Subdomain audit | Engineering / Dental / Pharmacy Supabase | None have published `/fee-structure` or `/scholarships` pages. Arts & Science, Nursing, Allied Health, Education have no Supabase project at all. |

## 4. Design Decisions (from brainstorm)

| # | Decision | Chosen | Rationale |
|---|---|---|---|
| 1 | URL placement | **Approach A** — keep URLs at root, reparent under `Admissions` in navigation only | Zero SEO risk; pages are already indexed at their current URLs. |
| 2 | Card routing model | **F2** — subdomain if live, internal fallback otherwise | User decision. Effectively 100% internal fallback today (subdomain pages don't exist) but architecture stays flexible. |
| 3 | Per-college scholarship content | **C1** — pre-fill from existing `ScholarshipMatrix` row data | Matrix already encodes which schemes apply to each college; zero new content to author. |
| 4 | Step 1 CTA target | External registration form `https://www.jkkn.ai/apply/jkkn-admission-2026` | User provided. |

## 5. Solution Overview

Three logical units, each independently shippable if needed.

### Unit A — Navigation wiring

SQL-only change to Main Supabase:

```sql
UPDATE cms_pages SET
  parent_id         = '4f96c885-1ae9-41c3-b017-51d7bfae3a87',  -- Admissions
  show_in_navigation = true,
  navigation_label   = 'Fee Structure',
  sort_order         = 1
WHERE slug = 'fee-structure';

UPDATE cms_pages SET
  parent_id         = '4f96c885-1ae9-41c3-b017-51d7bfae3a87',
  show_in_navigation = true,
  navigation_label   = 'Scholarships',
  sort_order         = 2
WHERE slug = 'scholarships';
```

`getPublicNavigation()` in `app/actions/cms/navigation.ts` builds the tree from `parent_id` + `sort_order`. After this SQL runs, the `Admissions` dropdown shows two children. URLs unchanged.

### Unit B — Fee-structure hub card routing

Update the `CollegesGrid` block on the `/fee-structure` CMS page so each college card resolves via the **card-target resolver rules** in the table below. Implementation is a single `UPDATE cms_page_blocks SET props = ...` on the CollegesGrid block (sort_order 2) for page id `34a92672-...`.

Card-target resolver (today):

| College | Card link target |
|---|---|
| Engineering | `/fee-structure/engineering` (internal) |
| Arts & Science | `/fee-structure/arts-and-science` (internal) |
| Dental | `/fee-structure/dental` (internal) |
| Pharmacy | `/fee-structure/pharmacy` (internal) |
| Nursing | `/fee-structure/nursing` (internal) |
| Allied Health | `/fee-structure/allied-health` (internal) |
| Education | `/fee-structure/education` (internal) |

Future rollout: when (say) Engineering's subdomain publishes its own `/fee-structure`, change the Engineering card's `link` prop from `/fee-structure/engineering` to `https://engg.jkkn.ac.in/fee-structure` via the admin page builder — a single props edit, no code change.

### Unit C — Scholarships hub restructure + 7 per-college pages

C.1 — Rewire `/scholarships`: Insert a new `CollegesGrid` block between the hero (sort_order 1) and the existing `ScholarshipsSection` (sort_order 2). After insert, block order becomes:

1. `AdmissionHero` (existing)
2. `CollegesGrid` **(new)** — 7 cards pointing to internal `/scholarships/{college}`
3. `ScholarshipsSection` (existing, sort_order shifted)
4. `ScholarshipMatrix` (existing)
5. `FAQSectionBlock` (existing)
6. `CallToAction` (existing)

C.2 — Create 7 new CMS pages under `/scholarships` as children. Slugs mirror the hyphenated pattern used for per-college fee pages:

| College | Slug | Matrix rows available |
|---|---|---|
| Allied Health | `scholarships/allied-health` | 1 (`AHS` → All Branches) |
| Arts & Science | `scholarships/arts-and-science` | **0 — use cross-college fallback** |
| Dental | `scholarships/dental` | 1 (BDS) |
| Education | `scholarships/education` | 1 (B.Ed) |
| Engineering | `scholarships/engineering` | 3 (B.E/B.Tech, MBA, M.E) |
| Nursing | `scholarships/nursing` | 3 (B.Sc(N), M.Sc(N), PB.B.Sc(N)) |
| Pharmacy | `scholarships/pharmacy` | 3 (Pharm D, B.Pharm, M.Pharm) |

Each `cms_pages` row:
- `slug` as above
- `parent_id = 206d9a67-2729-4a95-8074-48535214696c` (scholarships page)
- `status = 'published'`
- `show_in_navigation = false` (reachable only via card click)

Each page seeds 3 blocks:
- `AdmissionHero` — "JKKN {College Name} — Scholarships & Financial Aid" with subtitle listing the specific courses covered.
- `TextEditor` — HTML table derived from that college's `ScholarshipMatrix` rows. Columns: Course · PMSS GQ · PMSS MQ · Community · Maintenance · First-Graduate · Naan Mudhalvan · Trust. Rows filtered by `college` field.
- `CallToAction` — "Talk to Scholarship Cell" with `/contact` and `tel:+914222661100` buttons.

C.3 — Arts & Science fallback: Since `ScholarshipMatrix` has no row for this college, its detail page's TextEditor block shows a note — *"Institutional scholarship scheme for Arts & Science is under finalization for AY 2026–27. Government schemes below apply to all eligible JKKN students"* — followed by the standard four scheme descriptions (PMSS, First-Graduate, Community, Naan Mudhalvan) carried across from the main `/scholarships` `ScholarshipsSection`.

### Unit D — Admission Process 6-step rewrite

Two edits, one ships the user-facing change, the other keeps CMS data consistent with the hardcoded route (for eventual CMS migration):

D.1 — Edit `app/(public)/admissions/_main-page.tsx`: Replace the 5-step array passed to `<AdmissionProcessTimeline>` with the 6-step array below.

D.2 — Update `cms_page_blocks.props` for the `AdmissionProcessTimeline` block on the `/admissions` CMS page (page id `4f96c885-...`, sort_order 5): same 6-step array.

6-step data:

| # | Title | Description | Icon (Lucide) | CTA (where applicable) |
|---|---|---|---|---|
| 1 | Learner's Registration | Register online to start your admission journey. Create your profile with basic details and your chosen college. | `UserPlus` | Link: `https://www.jkkn.ai/apply/jkkn-admission-2026` |
| 2 | Online Application Submission | Complete the application form with personal, academic, and program details. | `FileText` | — |
| 3 | Payment Process | Pay the application fee securely online to lock your submission. | `CreditCard` | — |
| 4 | Admission Confirmation | Receive your provisional admission letter after document screening. | `CheckCircle` | — |
| 5 | Certificate Submission | Submit originals — 10th, 12th, transfer, community certificates — to the admissions office. | `FileCheck` | — |
| 6 | Final Enrollment | Pay tuition, collect ID card, and join orientation to complete enrollment. | `GraduationCap` | — |

`AdmissionProcessTimeline` currently maps icon names via an internal Lucide map (`admission-process-timeline.tsx`). Verify `UserPlus`, `CreditCard`, `FileCheck`, `GraduationCap` are mapped; add missing entries in a minimal supporting edit to the component if needed.

## 6. Data Flow / Rendering

```
jkkn.ac.in/admissions
  ├─ Next.js route: app/(public)/admissions/page.tsx
  └─ Institution = "main" → renders hardcoded _main-page.tsx
       └─ <AdmissionProcessTimeline steps={NEW_6_STEPS} />   ← edit here

jkkn.ac.in/fee-structure  (no explicit route file)
  └─ [...slug]/page.tsx fetches cms_pages.slug = 'fee-structure'
       └─ renders blocks: AdmissionHero, CollegesGrid (updated props), FAQ, CTA

jkkn.ac.in/fee-structure/engineering   (and 6 others)
  └─ [...slug]/page.tsx → fetches cms_pages.slug = 'fee-structure/engineering'
       └─ renders AdmissionHero + TextEditor (unchanged, already seeded)

jkkn.ac.in/scholarships
  └─ [...slug]/page.tsx fetches cms_pages.slug = 'scholarships'
       └─ renders blocks: Hero, CollegesGrid (new), ScholarshipsSection, Matrix, FAQ, CTA

jkkn.ac.in/scholarships/engineering  (and 6 others)
  └─ [...slug]/page.tsx → fetches cms_pages.slug = 'scholarships/engineering'
       └─ renders AdmissionHero + TextEditor + CallToAction (new)

Navigation (top nav + footer)
  └─ getPublicNavigation() reads cms_pages where show_in_navigation = true
       └─ After Unit A: Admissions gains children Fee Structure + Scholarships
```

## 7. Error Handling / Edge Cases

- **Subdomain resolver is just a props map.** If a link ever becomes `about:blank` or empty, CollegesGrid already short-circuits to `<div>` (no `CardRoot` anchor wrap). Safe.
- **Missing scholarship data for a college.** The `ScholarshipMatrix` covers 6 of 7 colleges; only **Arts & Science** has no row. For that one college, the detail page uses the Arts & Science fallback copy defined in §5 C.3.
- **Icon name mismatch.** If any of `UserPlus` / `CreditCard` / `FileCheck` / `GraduationCap` is missing from `AdmissionProcessTimeline`'s Lucide map, the step falls back to a generic circled number. Fix preemptively in D.1 to avoid this.
- **Step 1 external link.** `https://www.jkkn.ai/apply/jkkn-admission-2026` opens in the same tab (intentional — this IS the next step of the journey). If the timeline component doesn't already accept per-step `link` + `target`, the spec extends the component schema with optional `link?: string` on `StepItem` (backwards-compatible default = inline text, no anchor).

## 8. Testing

- **Navigation:** Load `/` on `institutionId = main`, open Admissions dropdown, verify `Fee Structure` and `Scholarships` appear as children.
- **Fee hub:** Load `/fee-structure`, click each of 7 cards. Each should navigate to `/fee-structure/{college}` and render the existing seeded detail page.
- **Scholarship hub:** Load `/scholarships`. New CollegesGrid appears between hero and existing sections. Click each card, confirm `/scholarships/{college}` renders the new detail page.
- **Admission process:** Load `/admissions`, scroll to the process section. 6 steps in order. Step 1 CTA opens the external form URL.
- **CMS parity:** In admin page builder, open `/admissions` CMS page → `AdmissionProcessTimeline` block → verify 6 steps match `_main-page.tsx`.
- **Regression sweep:** Verify no other menus broke (Courses Offered, Facilities, etc.). Verify the existing `/fee-structure` hero + FAQ + CTA still render unchanged.

## 9. Deliverables (in order)

1. **SQL migration** documented in `docs/database/main-supabase/05-migrations/` per the CLAUDE.md documentation-first rule, with the following blocks:
   - Unit A — two `UPDATE cms_pages` statements (nav wiring).
   - Unit B — one `UPDATE cms_page_blocks` on CollegesGrid props.
   - Unit C.1 — one `INSERT cms_page_blocks` for new CollegesGrid + one `UPDATE cms_page_blocks` bumping `sort_order` on the existing scholarships blocks.
   - Unit C.2 — 7 × `INSERT cms_pages` + 21 × `INSERT cms_page_blocks` for the per-college scholarship detail pages.
   - Unit D.2 — one `UPDATE cms_page_blocks` on `/admissions` AdmissionProcessTimeline props.
2. **Apply migration** to Main Supabase via `mcp__Main_Supabase_Project__apply_migration`.
3. **Code edit:** `app/(public)/admissions/_main-page.tsx` — replace the 5-step array with the 6-step array. Confirm icon map support in `components/cms-blocks/admissions/admission-process-timeline.tsx`.
4. **Smoke test** each acceptance scenario in §8 on local dev (`npm run dev:main`).
5. **Commit** the code edit and SQL docs in one logical commit; do not mix unrelated working-tree changes from the earlier uncommitted backlog.

## 10. Out of Scope (called out explicitly)

- Engineering / Dental / Pharmacy subdomain `/fee-structure` and `/scholarships` pages — parallel track, not this change.
- Migrating `/admissions` from hardcoded TSX to CMS rendering — tracked separately (obs 19).
- Updating the `_main-page.tsx` CollegesGrid (lines 95–138) which still points to `/admission` subdomain URLs for the apply-now funnel — different surface, different decision.
- Sitemap and FAQ JSON-LD updates to reflect new menu structure — recommended as a follow-up for SEO completeness, but not blocking.

## 11. Risks

| Risk | Mitigation |
|---|---|
| The `AdmissionProcessTimeline` component doesn't support per-step `link` prop, breaking Step 1 CTA | Verify in implementation phase; if missing, add optional `link` to the Zod schema (backwards-compatible). |
| Existing `/fee-structure` CollegesGrid uses props shape that differs from what the `cms_blocks` `CollegesGridPropsSchema` expects after the update | Re-use the exact existing `colleges[]` array shape from the current block (only the `link` field changes per card). |
| SEO regression on `/fee-structure` from parenting under `/admissions` in navigation | None expected — URL unchanged, canonical unchanged. Breadcrumb JSON-LD (if present) may need a one-line update to reflect the new parent in hierarchy. |
| Per-college scholarship content is underspecified for colleges with blank rows in `ScholarshipMatrix` | Use the "see cross-college schemes below" fallback copy from §7. |

## 12. Open Questions

None. All four brainstorm decisions are resolved (URL placement, routing model, scholarship content sourcing, step 1 CTA target). If the user reviewing this spec wants to change any, we revise and re-review before writing the implementation plan.
