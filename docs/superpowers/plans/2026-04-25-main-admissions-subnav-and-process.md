# Main Admissions Submenu, Hub Pages, and 6-Step Process — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the in-flight Admissions subnav + Fee/Scholarship hub + 6-step process work for the **main** institution by applying the already-documented SQL migrations to Main Supabase, resolving an unfinished routing decision (F1 subdomain vs F2 internal fallback), drafting and applying Unit D.2 (CMS `/admissions` block parity), and smoke-testing.

**Architecture:** TSX changes for Unit D.1 are already in place — `app/(public)/admissions/_main-page.tsx` has the new 6-step array (lines 180–187), `lib/cms/registry-types.ts` line 1256 has `link: z.string().optional()` on `AdmissionStepSchema`, and `components/cms-blocks/admissions/admission-process-timeline.tsx` already imports `UserPlus`/`CreditCard`/`FileCheck`/`GraduationCap`, has them in `ICON_MAP` (lines 22–32), and renders `<a>` for steps with `link` (lines 265–284). Two migrations are fully documented but unapplied: `29-admissions-submenu-and-fee-cards-internal.sql` (Unit A nav + Unit B internal fee links), and `30-scholarships-hub-and-per-college-pages.sql` (Unit C scholarships hub + 7 child pages, 21 blocks). One file is stuck in editor-temp state — `31-fee-structure-cards-revert-to-subdomain-urls.sql.tmp.16172.1777093983153` — and reflects an unfinalized decision to flip Unit B back to subdomain URLs (F1) once the user creates `/fee-structure` pages on each college subdomain in parallel. Unit D.2 (sync the CMS `/admissions` page's `AdmissionProcessTimeline` block props to the new 6 steps so a future CMS migration of `/admissions` doesn't regress) has no SQL drafted yet.

**Tech Stack:** Supabase (Main project `pmqodbfhsejbvfbmsfeq`) via `mcp__Main_Supabase_Project__*` tools; Next.js 16 App Router; CMS-driven `[...slug]/page.tsx` for `/fee-structure` and `/scholarships`, hardcoded `_main-page.tsx` for `/admissions`. Verified IDs: Admissions page `4f96c885-1ae9-41c3-b017-51d7bfae3a87`; Fee Structure page `34a92672-94aa-4237-9afc-0bf1e6cd23c1`; Scholarships page `206d9a67-2729-4a95-8074-48535214696c`; Fee CollegesGrid block `d6c16510-8002-4dfe-acff-36e974630ca9`.

---

## File / Migration Map

| Path | Responsibility | State at plan time |
|------|----------------|-------------------|
| `docs/database/main-supabase/29-admissions-submenu-and-fee-cards-internal.sql` | Unit A nav reparenting + Unit B internal `/fee-structure/{college}` link rewrite | ✅ Documented · ❌ Unapplied |
| `docs/database/main-supabase/30-scholarships-hub-and-per-college-pages.sql` | Unit C.1 + C.2 + C.3 — scholarships hub CollegesGrid insert + 7 per-college pages + 21 blocks | ✅ Documented · ❌ Unapplied |
| `docs/database/main-supabase/31-fee-structure-cards-revert-to-subdomain-urls.sql.tmp.16172.1777093983153` | Optional — flip fee CollegesGrid links from internal to subdomain URLs (F1 mode) | ⚠️ Stuck as editor `.tmp` file · DECISION PENDING |
| `docs/database/main-supabase/32-cms-admissions-process-timeline-six-step-parity.sql` | Unit D.2 — sync CMS `/admissions` `AdmissionProcessTimeline` block props to the new 6 steps | ❌ Does not exist · MUST WRITE |
| `app/(public)/admissions/_main-page.tsx` | Hardcoded admissions page rendered for `institutionId=main`. 6-step `AdmissionProcessTimeline` array. | ✅ Already updated (lines 180–187) |
| `lib/cms/registry-types.ts` | `AdmissionStepSchema` (line 1251) + `AdmissionProcessTimelinePropsSchema` defaults (lines 1260–1291) | ✅ Already updated — `link` field added, defaults reflect 6 steps |
| `components/cms-blocks/admissions/admission-process-timeline.tsx` | Renders steps; maps icon strings to Lucide components; wraps in `<a>` when `link` is present | ✅ Already updated — 9 icons in `ICON_MAP`, anchor wrapping wired |

---

## Task 1: Confirm migration application status against Main Supabase

**Files:** read-only, no edits.

- [ ] **Step 1: Query Main Supabase for the four affected DB rows**

Use `mcp__Main_Supabase_Project__execute_sql` with this exact query:

```sql
SELECT
  (SELECT COUNT(*) FROM cms_pages
     WHERE id = '34a92672-94aa-4237-9afc-0bf1e6cd23c1'
       AND parent_id = '4f96c885-1ae9-41c3-b017-51d7bfae3a87'
       AND show_in_navigation = true
       AND navigation_label = 'Fee Structure') AS unit_a_fee_applied,
  (SELECT COUNT(*) FROM cms_pages
     WHERE id = '206d9a67-2729-4a95-8074-48535214696c'
       AND parent_id = '4f96c885-1ae9-41c3-b017-51d7bfae3a87'
       AND show_in_navigation = true
       AND navigation_label = 'Scholarships') AS unit_a_scholar_applied,
  (SELECT COUNT(*) FROM cms_page_blocks
     WHERE id = 'd6c16510-8002-4dfe-acff-36e974630ca9'
       AND props->'colleges'->0->>'link' = '/fee-structure/engineering') AS unit_b_internal_applied,
  (SELECT COUNT(*) FROM cms_page_blocks
     WHERE id = 'd6c16510-8002-4dfe-acff-36e974630ca9'
       AND props->'colleges'->0->>'link' = 'https://engg.jkkn.ac.in/fee-structure') AS unit_b_subdomain_applied,
  (SELECT COUNT(*) FROM cms_page_blocks
     WHERE page_id = '206d9a67-2729-4a95-8074-48535214696c'
       AND component_name = 'CollegesGrid') AS unit_c1_grid_inserted,
  (SELECT COUNT(*) FROM cms_pages
     WHERE slug LIKE 'scholarships/%'
       AND parent_id = '206d9a67-2729-4a95-8074-48535214696c') AS unit_c2_child_pages_count;
```

Expected outputs interpreted:

| Result | Meaning | Effect on later tasks |
|--------|---------|------------------------|
| `unit_a_fee_applied = 1` AND `unit_a_scholar_applied = 1` | Unit A already applied | Skip Task 3 |
| `unit_b_internal_applied = 1` | Migration 29 Unit B applied (internal links) | Skip Task 3, evaluate Task 4 |
| `unit_b_subdomain_applied = 1` | Migration 31 already applied (subdomain links) | Skip Tasks 3 + 4 |
| `unit_c1_grid_inserted = 1` AND `unit_c2_child_pages_count = 7` | Migration 30 applied | Skip Task 5 |
| Anything 0 | That migration has not been applied yet | Run that migration |

- [ ] **Step 2: Record results in plan execution log (append to your subagent task report or `TaskUpdate` description)**

Write the six count values inline so the next task can branch on them without re-querying.

- [ ] **Step 3: Commit nothing — this task is read-only**

No file changes; nothing to commit.

---

## Task 2: Resolve F1 vs F2 routing decision (DECISION POINT — MAY REQUIRE USER INPUT)

**Files:**
- Inspect: `docs/database/main-supabase/31-fee-structure-cards-revert-to-subdomain-urls.sql.tmp.16172.1777093983153`

The `.tmp.16172.1777093983153` suffix is a VS Code in-progress save backup that was abandoned. Its file header says: *"User confirmed they will create the fee-structure pages on each subdomain in parallel. This restores the F1 (subdomain-direct) pattern over the F2 (subdomain + internal fallback) pattern Migration 29 used."*

This contradicts the spec's recorded decision (F2). The plan must not silently apply the `.tmp` file — it could overturn intent the user does not currently hold.

- [ ] **Step 1: Read the tmp file and confirm contents match the F1 revert pattern**

Path: `docs/database/main-supabase/31-fee-structure-cards-revert-to-subdomain-urls.sql.tmp.16172.1777093983153`

Confirm the SQL is a single `UPDATE cms_page_blocks SET props = jsonb_set(props, '{colleges}', ...)` against block id `d6c16510-8002-4dfe-acff-36e974630ca9` with these 7 subdomain URLs:

```
https://engg.jkkn.ac.in/fee-structure
https://arts.jkkn.ac.in/fee-structure
https://edu.jkkn.ac.in/fee-structure
https://dental.jkkn.ac.in/fee-structure
https://pharmacy.jkkn.ac.in/fee-structure
https://nursing.jkkn.ac.in/fee-structure
https://ahs.jkkn.ac.in/fee-structure
```

If the contents differ from this list, stop and ask the user.

- [ ] **Step 2: Ask the user for the routing-mode decision**

Verbatim prompt:

> "Routing decision needed before applying migration 31.
> The `.tmp` file in `docs/database/main-supabase/` contains a complete migration that **reverts** the fee-structure CollegesGrid card links from internal `/fee-structure/{college}` (Migration 29 / F2) **back to subdomain URLs** like `https://engg.jkkn.ac.in/fee-structure` (F1).
> Its header says you confirmed wanting this revert in the prior session, alongside creating those subdomain pages in parallel.
>
> Which one do you want?
> **A. Apply migration 31 (F1 subdomain-direct)** — Cards link to subdomains; assumes the subdomain pages will exist. Rename `.tmp` file to a final filename before applying.
> **B. Discard migration 31 (stay on F2 internal fallback)** — Cards keep linking to `/fee-structure/{college}`. Delete the `.tmp` file.
> **C. Hybrid** — Pick which subdomains are live now and which stay internal. Tell me which subdomains.
>
> Please answer A, B, or C."

- [ ] **Step 3: Branch based on the answer**

- If **A**: rename the tmp file to `31-fee-structure-cards-revert-to-subdomain-urls.sql` (drop the `.tmp.<numbers>` suffix). Continue to Task 6 with this migration in the apply queue. Do not change any TSX or seed data on subdomain Supabase projects in this plan — that is parallel work.
- If **B**: delete the tmp file (it is editor noise, not real source). Skip Task 6.
- If **C**: do not auto-edit. Ask the user to enumerate the live subdomains, then write a fresh `31-…-partial.sql` with only those rows. Treat this as a one-off blocker; pause the plan until the SQL exists.

- [ ] **Step 4: Commit only the rename or deletion (not the apply)**

If A: `git mv "docs/database/main-supabase/31-fee-structure-cards-revert-to-subdomain-urls.sql.tmp.16172.1777093983153" "docs/database/main-supabase/31-fee-structure-cards-revert-to-subdomain-urls.sql"` then `git add` the renamed path. Do not commit yet — Task 9 batches the commit. If B: `rm` the tmp file; do not stage the deletion until Task 9.

---

## Task 3: Apply Migration 29 to Main Supabase (Unit A nav + Unit B internal links)

**Files:**
- Apply: `docs/database/main-supabase/29-admissions-submenu-and-fee-cards-internal.sql`

**Skip if:** Task 1 reported `unit_a_fee_applied = 1` AND `unit_a_scholar_applied = 1` AND `unit_b_internal_applied = 1`.

- [ ] **Step 1: Apply the migration via MCP**

Use `mcp__Main_Supabase_Project__apply_migration` with:
- `name`: `admissions_submenu_and_fee_cards_internal`
- `query`: the **executable SQL only** (lines 30–67 of the documented file — the three `UPDATE` statements). Do not include the comment header in the migration body.

Exact SQL to pass:

```sql
UPDATE cms_pages
SET
  parent_id          = '4f96c885-1ae9-41c3-b017-51d7bfae3a87',
  show_in_navigation = true,
  navigation_label   = 'Fee Structure',
  sort_order         = 1
WHERE id = '34a92672-94aa-4237-9afc-0bf1e6cd23c1';

UPDATE cms_pages
SET
  parent_id          = '4f96c885-1ae9-41c3-b017-51d7bfae3a87',
  show_in_navigation = true,
  navigation_label   = 'Scholarships',
  sort_order         = 2
WHERE id = '206d9a67-2729-4a95-8074-48535214696c';

UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{colleges}',
  '[
    {"link":"/fee-structure/engineering","name":"JKKN College of Engineering","description":"B.E / B.Tech / M.E / MBA — Fees from ₹30,000/yr","headerColor":"#0b6d41"},
    {"link":"/fee-structure/arts-and-science","name":"JKKN College of Arts & Science","description":"UG & PG in arts, science, commerce, design — from ₹20,000/yr","headerColor":"#0b6d41"},
    {"link":"/fee-structure/education","name":"JKKN College of Education","description":"B.Ed — TNTEU counselling; MQ ₹35,000/yr","headerColor":"#0b6d41"},
    {"link":"/fee-structure/dental","name":"JKKN Dental College & Hospital","description":"BDS (5 yrs) & MDS (3 yrs) — Fees from ₹4,50,000/yr","headerColor":"#0b6d41"},
    {"link":"/fee-structure/pharmacy","name":"JKKN College of Pharmacy","description":"B.Pharm / Pharm.D / M.Pharm — Fees from ₹70,000/yr","headerColor":"#0b6d41"},
    {"link":"/fee-structure/nursing","name":"JKKN College of Nursing","description":"B.Sc / PB B.Sc / M.Sc Nursing — Fees from ₹65,000/yr","headerColor":"#0b6d41"},
    {"link":"/fee-structure/allied-health","name":"JKKN College of Allied Health Sciences","description":"Cardiac / OTA / Radiology / Dialysis & more — from ₹60,000/yr","headerColor":"#0b6d41"}
  ]'::jsonb
)
WHERE id = 'd6c16510-8002-4dfe-acff-36e974630ca9';
```

- [ ] **Step 2: Verify by re-running the audit query from Task 1 Step 1**

Expected: `unit_a_fee_applied = 1`, `unit_a_scholar_applied = 1`, `unit_b_internal_applied = 1`.

If any value is still `0`, stop and inspect the Supabase response payload for an error message; do not move on.

- [ ] **Step 3: Commit nothing yet**

Migration is server-side state. Do not stage anything in this task; the documentation file is already on disk.

---

## Task 4: Apply Migration 31 if Task 2 chose Option A

**Files:**
- Apply: `docs/database/main-supabase/31-fee-structure-cards-revert-to-subdomain-urls.sql` (renamed in Task 2)

**Skip if:** Task 2 chose B or C, or Task 1 reported `unit_b_subdomain_applied = 1`.

- [ ] **Step 1: Apply the migration via MCP**

Use `mcp__Main_Supabase_Project__apply_migration` with:
- `name`: `fee_structure_cards_revert_to_subdomain_urls`
- `query`: the executable `UPDATE` statement only (lines 34–48 of the file).

Exact SQL to pass:

```sql
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{colleges}',
  '[
    {"link":"https://engg.jkkn.ac.in/fee-structure","name":"JKKN College of Engineering","description":"B.E / B.Tech / M.E / MBA — Fees from ₹30,000/yr","headerColor":"#0b6d41"},
    {"link":"https://arts.jkkn.ac.in/fee-structure","name":"JKKN College of Arts & Science","description":"UG & PG in arts, science, commerce, design — from ₹20,000/yr","headerColor":"#0b6d41"},
    {"link":"https://edu.jkkn.ac.in/fee-structure","name":"JKKN College of Education","description":"B.Ed — TNTEU counselling; MQ ₹35,000/yr","headerColor":"#0b6d41"},
    {"link":"https://dental.jkkn.ac.in/fee-structure","name":"JKKN Dental College & Hospital","description":"BDS (5 yrs) & MDS (3 yrs) — Fees from ₹4,50,000/yr","headerColor":"#0b6d41"},
    {"link":"https://pharmacy.jkkn.ac.in/fee-structure","name":"JKKN College of Pharmacy","description":"B.Pharm / Pharm.D / M.Pharm — Fees from ₹70,000/yr","headerColor":"#0b6d41"},
    {"link":"https://nursing.jkkn.ac.in/fee-structure","name":"JKKN College of Nursing","description":"B.Sc / PB B.Sc / M.Sc Nursing — Fees from ₹65,000/yr","headerColor":"#0b6d41"},
    {"link":"https://ahs.jkkn.ac.in/fee-structure","name":"JKKN College of Allied Health Sciences","description":"Cardiac / OTA / Radiology / Dialysis & more — from ₹60,000/yr","headerColor":"#0b6d41"}
  ]'::jsonb
)
WHERE id = 'd6c16510-8002-4dfe-acff-36e974630ca9';
```

- [ ] **Step 2: Verify subdomain link is in place**

Query:

```sql
SELECT props->'colleges'->0->>'link' AS first_card_link
FROM cms_page_blocks
WHERE id = 'd6c16510-8002-4dfe-acff-36e974630ca9';
```

Expected: `https://engg.jkkn.ac.in/fee-structure`. If still internal, abort and re-check the apply call.

- [ ] **Step 3: Commit nothing yet**

---

## Task 5: Apply Migration 30 to Main Supabase (Unit C scholarships)

**Files:**
- Apply: `docs/database/main-supabase/30-scholarships-hub-and-per-college-pages.sql`

**Skip if:** Task 1 reported `unit_c1_grid_inserted = 1` AND `unit_c2_child_pages_count = 7`.

- [ ] **Step 1: Apply the migration via MCP in one call**

Use `mcp__Main_Supabase_Project__apply_migration` with:
- `name`: `scholarships_hub_and_per_college_pages`
- `query`: copy lines 31–337 of `30-scholarships-hub-and-per-college-pages.sql` verbatim — that is the full executable body covering C.1 (UPDATE + INSERT for the new CollegesGrid), C.2 (one INSERT INTO cms_pages with 7 VALUES rows), and C.3 (21 INSERT INTO cms_page_blocks blocks across 7 colleges).

Read the file once with `Read` to capture the exact body; do not retype, since the HTML strings inside `TextEditor` props contain HTML entities and `<sup>`/`<sub>` tags that are easy to corrupt.

- [ ] **Step 2: Verify the inserts**

Query:

```sql
SELECT
  (SELECT COUNT(*) FROM cms_page_blocks
     WHERE page_id = '206d9a67-2729-4a95-8074-48535214696c'
       AND component_name = 'CollegesGrid') AS new_grid,
  (SELECT COUNT(*) FROM cms_pages
     WHERE slug LIKE 'scholarships/%'
       AND parent_id = '206d9a67-2729-4a95-8074-48535214696c') AS child_pages,
  (SELECT COUNT(*) FROM cms_page_blocks pb
     JOIN cms_pages p ON p.id = pb.page_id
     WHERE p.slug LIKE 'scholarships/%') AS child_blocks,
  (SELECT MIN(sort_order) FROM cms_page_blocks
     WHERE page_id = '206d9a67-2729-4a95-8074-48535214696c'
       AND component_name = 'ScholarshipsSection') AS scholarships_section_sort_order;
```

Expected: `new_grid = 1`, `child_pages = 7`, `child_blocks = 21`, `scholarships_section_sort_order = 3` (it was bumped from 2 to 3 by C.1).

If `child_blocks` is 0 even though `child_pages = 7`, the `INSERT … SELECT id … FROM cms_pages WHERE slug = '…'` joins did not match — usually a slug typo. Inspect each WHERE clause and re-run only the missing inserts.

- [ ] **Step 3: Commit nothing yet**

---

## Task 6: Draft Migration 32 for Unit D.2 (CMS `/admissions` 6-step parity)

**Files:**
- Create: `docs/database/main-supabase/32-cms-admissions-process-timeline-six-step-parity.sql`

The CMS `/admissions` page (`4f96c885-1ae9-41c3-b017-51d7bfae3a87`) has its own `AdmissionProcessTimeline` block. Even though `/admissions` renders from hardcoded `_main-page.tsx` for `institutionId=main`, the spec §5.D.2 requires the CMS block to mirror the new 6 steps so a future migration of `/admissions` to CMS rendering doesn't regress the user-facing copy.

- [ ] **Step 1: Locate the CMS `AdmissionProcessTimeline` block id and current props**

Use `mcp__Main_Supabase_Project__execute_sql`:

```sql
SELECT id, sort_order, jsonb_pretty(props) AS props
FROM cms_page_blocks
WHERE page_id = '4f96c885-1ae9-41c3-b017-51d7bfae3a87'
  AND component_name = 'AdmissionProcessTimeline';
```

Record the returned `id` value — it is required for the WHERE clause in Step 2. Confirm only **one** row is returned. If 0 rows, the CMS page never had this block; skip Tasks 6–7 entirely.

- [ ] **Step 2: Write the migration file**

Create `docs/database/main-supabase/32-cms-admissions-process-timeline-six-step-parity.sql` with this exact content (replace `<BLOCK_ID>` with the id from Step 1):

```sql
-- ============================================
-- Migration 32 — CMS /admissions AdmissionProcessTimeline 6-Step Parity
-- ============================================
-- Purpose: Implements Unit D.2 of the 2026-04-24 main-admissions-subnav-and-process spec.
--   The CMS /admissions page (id 4f96c885-1ae9-41c3-b017-51d7bfae3a87) is currently
--   shadowed by hardcoded _main-page.tsx for institutionId=main, but the CMS block
--   stores the previous 5-step admission process. When the page is migrated to
--   CMS rendering (tracked separately as obs 19), this stale data would surface.
--   This migration syncs the CMS block to the new 6 steps so the data is correct
--   regardless of which renderer wins.
--
-- Created: 2026-04-25
-- Spec: docs/superpowers/specs/2026-04-24-main-admissions-subnav-and-process-design.md (§5.D.2)
-- Dependencies: cms_page_blocks (AdmissionProcessTimeline block on /admissions page)
-- Verified IDs:
--   - admissions page                = 4f96c885-1ae9-41c3-b017-51d7bfae3a87
--   - AdmissionProcessTimeline block = <BLOCK_ID>
-- Affects: CMS data only — no public URL behavior changes today (hardcoded route still wins).
-- Security: No RLS impact (UPDATE on a public-published block).
-- Rollback: Restore previous props from a Supabase point-in-time snapshot, or
--   reapply the original 5-step seed if needed.
-- ============================================

UPDATE cms_page_blocks
SET props = props || jsonb_build_object(
  'subtitle', 'Your journey to JKKN in 6 simple steps',
  'steps', jsonb_build_array(
    jsonb_build_object(
      'number', 1,
      'title', 'Learner''s Registration',
      'description', 'Register online to start your admission journey. Create your profile with basic details and your chosen college.',
      'icon', 'UserPlus',
      'link', 'https://www.jkkn.ai/apply/jkkn-admission-2026'
    ),
    jsonb_build_object(
      'number', 2,
      'title', 'Online Application Submission',
      'description', 'Complete the application form with personal, academic, and program details.',
      'icon', 'FileText'
    ),
    jsonb_build_object(
      'number', 3,
      'title', 'Payment Process',
      'description', 'Pay the application fee securely online to lock your submission.',
      'icon', 'CreditCard'
    ),
    jsonb_build_object(
      'number', 4,
      'title', 'Admission Confirmation',
      'description', 'Receive your provisional admission letter after document screening.',
      'icon', 'CheckCircle'
    ),
    jsonb_build_object(
      'number', 5,
      'title', 'Certificate Submission',
      'description', 'Submit originals — 10th, 12th, transfer, community certificates — to the admissions office.',
      'icon', 'FileCheck'
    ),
    jsonb_build_object(
      'number', 6,
      'title', 'Final Enrollment',
      'description', 'Pay tuition, collect ID card, and join orientation to complete enrollment.',
      'icon', 'GraduationCap'
    )
  )
)
WHERE id = '<BLOCK_ID>';

-- End of Migration 32
-- ============================================
```

`★ Insight ─────────────────────────────────────`
The `props || jsonb_build_object(...)` operator does a shallow merge — replaces `subtitle` and `steps` keys while leaving `badge`, `title`, `titleAccentWord`, `backgroundColor`, `stepColor`, `activeColor`, `accentColor`, `showAnimations`, and any colour overrides untouched. That preserves whatever the editor has already tuned in the admin UI. Using `jsonb_set` per-key would be safer against typos but more verbose for replacing a whole array; `||` is the right tool here.
`─────────────────────────────────────────────────`

- [ ] **Step 3: Sanity-read the file you just wrote**

Use `Read` on the new path. Confirm:
- The `<BLOCK_ID>` placeholder has been replaced with the actual UUID from Step 1.
- `Learner''s` (two single quotes) appears in the SQL — `Learner's` would terminate the string early.

- [ ] **Step 4: Commit nothing yet**

---

## Task 7: Apply Migration 32 to Main Supabase

**Files:**
- Apply: `docs/database/main-supabase/32-cms-admissions-process-timeline-six-step-parity.sql`

- [ ] **Step 1: Apply via MCP**

Use `mcp__Main_Supabase_Project__apply_migration` with:
- `name`: `cms_admissions_process_timeline_six_step_parity`
- `query`: the `UPDATE …` statement only from the file (everything from `UPDATE cms_page_blocks` through the closing `WHERE id = '<UUID>';`). Skip the comment header.

- [ ] **Step 2: Verify**

Query:

```sql
SELECT
  jsonb_array_length(props->'steps') AS step_count,
  props->'steps'->0->>'title' AS step_1_title,
  props->'steps'->0->>'link' AS step_1_link,
  props->'steps'->5->>'title' AS step_6_title
FROM cms_page_blocks
WHERE page_id = '4f96c885-1ae9-41c3-b017-51d7bfae3a87'
  AND component_name = 'AdmissionProcessTimeline';
```

Expected: `step_count = 6`, `step_1_title = "Learner's Registration"`, `step_1_link = "https://www.jkkn.ai/apply/jkkn-admission-2026"`, `step_6_title = 'Final Enrollment'`.

- [ ] **Step 3: Commit nothing yet**

---

## Task 8: Smoke test against spec §8 acceptance scenarios

**Files:** read-only, dev server running.

- [ ] **Step 1: Start the dev server pointed at Main Supabase**

```
npm run dev:main
```

Wait for `Ready in XXX ms`. The console must show `INSTITUTION_ID=main`. If it shows another id, check `.env.local` was regenerated by the switcher.

- [ ] **Step 2: Navigation test**

In the browser, load `http://localhost:3000/`. Hover or click the **Admissions** menu. Confirm it shows two children in this order:
1. Fee Structure
2. Scholarships

Click each and confirm the URLs are `/fee-structure` and `/scholarships` (no `/admissions/` prefix). If either child is missing or the URL is wrong, re-run Task 1 audit query to confirm Unit A applied; if it did apply, suspect navigation cache — run `revalidatePath('/')` from a server action or restart the dev server.

- [ ] **Step 3: Fee hub click-through test**

Load `/fee-structure`. The CollegesGrid block shows 7 cards. Click each card.

Expected destinations depend on Task 2 outcome:
- **F2 (internal — Migration 29 only)**: `/fee-structure/engineering`, `/fee-structure/arts-and-science`, `/fee-structure/education`, `/fee-structure/dental`, `/fee-structure/pharmacy`, `/fee-structure/nursing`, `/fee-structure/allied-health`. Each must render the per-college fee table page.
- **F1 (subdomain — Migration 31 applied)**: `https://engg.jkkn.ac.in/fee-structure` and 6 siblings. They will 404 today unless the subdomain pages have been seeded — that is expected and out of scope; just confirm the click navigates to the subdomain URL.

- [ ] **Step 4: Scholarship hub click-through test**

Load `/scholarships`. Confirm block order:
1. Hero
2. **CollegesGrid (new — 7 cards)** ← from Migration 30 C.1
3. ScholarshipsSection
4. ScholarshipMatrix
5. FAQ
6. CallToAction

Click each of the 7 cards. Each must navigate to `/scholarships/{college}` and render `AdmissionHero` + scholarship table + CallToAction.

For `scholarships/arts-and-science`, the body should be the cross-college fallback copy (no per-course table) per spec §5.C.3 — confirm it explicitly mentions "under finalisation for AY 2026–27" and lists PMSS / First-Graduate / Community / Naan Mudhalvan schemes.

- [ ] **Step 5: Admission process test**

Load `/admissions`. Scroll to the "Admission Process" section. Confirm:
1. Section subtitle reads "Your journey to JKKN in 6 simple steps".
2. Six step circles render with these icons in order: UserPlus, FileText, CreditCard, CheckCircle, FileCheck, GraduationCap.
3. Step 1 ("Learner's Registration") is wrapped in an anchor — hover state shows underline / cursor pointer; clicking opens `https://www.jkkn.ai/apply/jkkn-admission-2026` in the same tab (intentional per spec §7).
4. Steps 2–6 render as plain `<div>` (no anchor wrap) — inspect the DOM to confirm.

- [ ] **Step 6: Regression sweep**

- Open every other top-level menu (Home, About, Academics, Courses Offered, Facilities, Campus Life, Contact). Confirm none broke. Subnav children for any other menu must still appear.
- Reload `/fee-structure` and confirm the existing hero + FAQ + CTA all render (no missing-block errors in console).
- Mobile viewport (DevTools, 375px wide): the Admissions menu must still expand to show Fee Structure + Scholarships in the mobile nav drawer.

- [ ] **Step 7: Record outcomes**

Append a short pass/fail summary to your task report:
- Nav A test: PASS / FAIL
- Fee hub test: PASS / FAIL
- Scholarship hub test: PASS / FAIL
- Admission process test: PASS / FAIL
- Regression test: PASS / FAIL

If anything fails, do **not** advance to Task 9. Diagnose, fix, re-test. Common failures:
- "Submenu missing" → cache; restart dev server with `rm -rf .next && npm run dev:main`.
- "Step 1 not clickable" → `link` field missing from migrated props or schema; check the verify query in Task 7 Step 2.

- [ ] **Step 8: Commit nothing in this task**

---

## Task 9: Commit the work as one logical commit

**Files staged:**
- `app/(public)/admissions/_main-page.tsx` — 6-step array (already on disk)
- `lib/cms/registry-types.ts` — `AdmissionStepSchema.link` + 6-step defaults (already on disk)
- `components/cms-blocks/admissions/admission-process-timeline.tsx` — icon map + per-step `link` rendering (already on disk)
- `docs/database/main-supabase/29-admissions-submenu-and-fee-cards-internal.sql`
- `docs/database/main-supabase/30-scholarships-hub-and-per-college-pages.sql`
- `docs/database/main-supabase/32-cms-admissions-process-timeline-six-step-parity.sql`
- (If Task 2 → A) `docs/database/main-supabase/31-fee-structure-cards-revert-to-subdomain-urls.sql`
- (If Task 2 → B) deletion of the `.tmp` file
- `docs/superpowers/plans/2026-04-25-main-admissions-subnav-and-process.md` (this plan)
- `docs/superpowers/specs/2026-04-24-main-admissions-subnav-and-process-design.md` (the spec, if untracked)

**NOT staged:** any other items in `git status` from earlier branches (admissions main page, sitemap routes, `ACTION-PLAN.md`, `FULL-AUDIT-REPORT.md`, weekly reports). Those are unrelated to this work and must not piggyback this commit.

- [ ] **Step 1: Inspect status before staging**

```
git status
git diff --stat
```

Confirm the changes you expect, no surprise deletions, no `.env*` files, no service keys.

- [ ] **Step 2: Stage only this work's files**

Run these `git add` calls — list each path explicitly to avoid sweeping unrelated changes:

```
git add app/(public)/admissions/_main-page.tsx
git add lib/cms/registry-types.ts
git add components/cms-blocks/admissions/admission-process-timeline.tsx
git add docs/database/main-supabase/29-admissions-submenu-and-fee-cards-internal.sql
git add docs/database/main-supabase/30-scholarships-hub-and-per-college-pages.sql
git add docs/database/main-supabase/32-cms-admissions-process-timeline-six-step-parity.sql
git add docs/superpowers/plans/2026-04-25-main-admissions-subnav-and-process.md
git add docs/superpowers/specs/2026-04-24-main-admissions-subnav-and-process-design.md
```

If Task 2 → A: also `git add docs/database/main-supabase/31-fee-structure-cards-revert-to-subdomain-urls.sql` and `git rm` the original `.tmp.16172.1777093983153` path (the `git mv` already prepared this).

If Task 2 → B: `git rm docs/database/main-supabase/31-fee-structure-cards-revert-to-subdomain-urls.sql.tmp.16172.1777093983153`.

- [ ] **Step 3: Confirm staging**

```
git status
```

Expected: only the listed files are staged. If anything else is staged, `git restore --staged <path>` to unstage it.

- [ ] **Step 4: Commit with the heredoc message format**

```
git commit -m "$(cat <<'EOF'
feat(admissions): add subnav children, internal/subdomain fee + scholarship hubs, and 6-step process

Wires Fee Structure and Scholarships under the Admissions top-level menu, makes every
college card on the two hubs land on a working destination (internal CMS pages by
default, subdomain URLs when chosen), and replaces the 5-step admission process with
the new 6-step journey ending at Final Enrollment. Step 1 deep-links into the
external registration form. CMS /admissions block is kept in lockstep so a future
CMS-only migration of the page does not regress.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: Verify commit**

```
git log -1 --stat
```

Confirm the file list matches what was staged in Step 2.

- [ ] **Step 6: Do not push**

Per project rules, do not push without explicit user approval. End the plan here.

---

## Self-Review Checklist (Plan Author)

- [x] **Spec coverage:** Unit A → Tasks 1, 3 (verify + apply). Unit B (F2) → Task 3. Unit B revert (F1) → Task 4 gated by Task 2. Unit C.1+C.2+C.3 → Tasks 1, 5. Unit D.1 → already in TSX (file map). Unit D.2 → Tasks 6, 7. Acceptance §8 → Task 8. Deliverable §9 commit → Task 9.
- [x] **Placeholder scan:** All "decide", "if needed" branches are tied to a concrete query result or user prompt. No "TBD" or "implement later".
- [x] **Type / id consistency:** Page id `4f96c885-1ae9-41c3-b017-51d7bfae3a87`, fee page `34a92672-…`, scholarships page `206d9a67-…`, fee CollegesGrid block `d6c16510-…` referenced consistently across tasks. Migration 32's block id is intentionally derived at runtime in Task 6 because the CMS block id was not pre-verified at plan time.
- [x] **Risk coverage:** F1 vs F2 ambiguity surfaced as Task 2 user gate. The orphaned `.tmp` file is handled (rename or delete). Skip-conditions on Tasks 3, 4, 5 prevent re-applying already-applied migrations.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-25-main-admissions-subnav-and-process.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Best when each task is independent and you want isolated context per step.

**2. Inline Execution** — Execute tasks in this session using the `superpowers:executing-plans` skill, batching tasks with checkpoints between them. Best when you want to watch the work happen and answer the F1/F2 question (Task 2) live.

Which approach?
