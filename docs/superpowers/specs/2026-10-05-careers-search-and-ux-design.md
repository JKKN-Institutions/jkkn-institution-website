# Careers: search, filters and job pages (v3)

**Routes:** `/careers`, `/careers/<job>`
**Replaces:** "JKKN Careers Portal, User-First Advanced Search & UI Specification" (v2, 60 sections)
**Date:** 2026-10-05
**Status:** Agreed with the product owner; implemented on branch `feat/careers-search-ux`

The goal is unchanged from v2: a candidate types what they are looking for in
their own words, narrows the list, checks whether they qualify, and applies.
What changed is that v2 was written without looking at where jobs come from or
what the job data contains. This version is written against the live feed.

---

## 1. Decisions that differ from v2

| Topic | v2 said | v3 does | Why |
|---|---|---|---|
| Search engine | Postgres full-text search, `pg_trgm`, GIN indexes in Supabase | Ranking, synonyms and typo tolerance in TypeScript on this site's server, over the cached MyJKKN feed | Jobs are not in this site's database (section 2). 367 jobs fit in memory; MyJKKN already filters in memory itself. |
| Job type and Location filters | P0, always shown | A filter is shown only when the current jobs have two or more values for it | Every job is full-time and in one town today. |
| Qualification filter | Fixed list | Derived from each job's free-text qualifications | Only 58 of 367 jobs have the structured education level. |
| Apply flow | Login, 4-step wizard, "View Application" | The existing single form with no account, plus a sticky Apply button and a fuller confirmation | MyJKKN has no candidate accounts and no application lookup. |
| Save job | Login to save | Saved in the candidate's browser | Same reason. |
| Job URL | `/careers/assistant-professor-computer-science` | `/careers/<title>-<department>-<job code number>`; old UUID URLs redirect | The API has no slug, and 58 open jobs are titled just "Professor". |
| Search analytics | Own tables and an HR report | Events sent to the Google Analytics already on the site | No database change needed; HR report is deferred (section 10). |
| Match score | "94% match" optional | One plain label per card ("Strong match", "Matches your qualification"), only while a search is active | As v2 recommended. |
| Experience typed into the search ("3 years") | Becomes a filter | Changes ranking only; never removes jobs | 131 jobs have no experience data and would silently vanish. |

## 2. Ground truth

**Architecture.** Job data belongs to MyJKKN, HR's system. This site reads
`GET {MYJKKN}/api/public/careers/jobs` on the server (cached 300 s) and the
candidate's browser posts the application straight to MyJKKN. This site's
Supabase holds nothing about jobs. The main site shows every institution; a
college site is pinned to its own institution by `MYJKKN_INSTITUTION_ID`.

**Live feed, measured 2026-10-05** (367 open jobs, 11 institutions, one 1.15 MB response):

| Field | Coverage | Consequence |
|---|---|---|
| `title` | 367, 198 distinct; "PROFESSOR"/"Professor" 58 times; many in capitals | Cards must show department and institution; titles are tidied for display |
| `description` | 367; 335 are a single plain paragraph, 32 are HTML | Section headings can only come from inline labels |
| `role_category` | 367: teaching 301, non-teaching 49, leadership 15, medical 2 | Drives the category tiles and filter |
| `qualifications` | 323 jobs, 158 distinct strings | Qualification filter is derived from this text |
| `min/max_experience_years` | 236 jobs; almost all open-ended ("5+") | Experience filter means "jobs you qualify for" |
| `department` | 170 jobs, 45 names | Department filter covers under half the jobs |
| `education_level` | 58 jobs | Not usable as a filter by itself |
| `job_type` | 367, all `full_time` | Filter hidden until values vary |
| `city` | "Kumarapalayam" 332, "Komarapalayam" 35 | One town; spelling is unified to "Komarapalayam" (the site's usual spelling) |
| `skills` | 0 jobs | No skill chips, no "matches your skills" until HR fills it |
| `closes_at` | 0 jobs | No "closes in N days", no `validThrough` |
| `salary` | 4 jobs | Shown when present, as today |
| `posted_at` | 335 jobs; 332 older than a year, oldest May 2022 | See section 9 |
| `job_code` | 333 jobs, shaped `Assistant__1746249092` | The trailing number is unique and is used in the URL |

## 3. Scope

**In this build:** everything v2 marked P0, plus from P1: synonyms, typo
tolerance, suggestions, popular searches, category tiles, related jobs, save,
share, shareable URL state, GA4 events, SEO metadata, JobPosting fixes and a
jobs sitemap.

**Not in this build:** candidate accounts, application status, job alerts,
saved searches, semantic or AI search, an HR analytics report, Work mode and
Experience level filters (MyJKKN has no such fields).

## 4. Listing page `/careers`

### 4.1 Layout

```
Hero: heading, one line of support text, search box + [Search jobs]
Popular searches (chips)            } only while no search
Explore opportunities (tiles)       } or filter is active
Toolbar: result count · [Saved] · sort · [Filters n] (below md)
Active filter chips · Clear all
Filters panel on the left (md and up)  |  Job cards on the right, 24 per page, pagination
```

Heading: "Find Your Next Opportunity at JKKN". Support text names the scope
from configuration: "across JKKN institutions" on the main site, the
institution's own name on a college site. Nothing institution-specific is
hardcoded.

### 4.2 Search

- One box, placeholder "Search by job title, department, qualification or keyword". Submitted with Enter or the button; it is a real GET form, so it works without JavaScript and Back returns to the previous search.
- Searched fields and weights: title 10, department 6, category 5, institution 4, qualifications 4, skills 4, education 3, location 2, description 1.
- Text is normalised before matching: case, punctuation, `&`, and dotted degrees (`M.Tech`, `Ph.D`, `M.D.S` become `mtech`, `phd`, `mds`). Plurals are folded.
- Filler words are ignored ("I am looking for", "jobs", "in"), so "I am looking for teaching jobs in computer science" searches for *teaching, computer, science*.
- A word matches a field exactly (full weight), through a synonym (0.7), as the start of a word (0.6, three letters or more), or, only when the word appears nowhere in any job, through a spelling near-miss (0.45).
- Synonyms are a maintained list in `lib/utils/careers-synonyms.ts`: HR and Human Resources, CSE and Computer Science, ECE, EEE, IT, AI, ML, MBA, MCA, M.E and M.Tech, Ph.D and doctorate, teaching, faculty, lecturer and professor, admin and administration, nursing and nurse, lab and laboratory, and similar.
- **All words must match.** If no job matches every word, jobs matching some of the words are shown, most words first, under a notice that says so. If nothing matches at all, the no-result state appears (4.8).
- Ranking: sum of the best field match per word, a small addition for further fields, a bonus when the words appear together in the title, then newest first.
- "3 years", "5 yrs" or "fresher" in the query is read as the candidate's experience. Jobs they qualify for move up and jobs asking for more move down. Nothing is removed. The one exception is a query that is only an experience statement ("fresher"): with no words to match, it lists the jobs that fit.
- Broad words expand one way only: "teaching" and "faculty" also find professors, lecturers and tutors, but "professor" does not find every tutor.
- Two-letter words ("IT", "AI", "M.E") are matched in titles, departments and qualifications but not inside description prose, where they are ordinary English.

### 4.3 Suggestions

Up to five, shown after two characters, built from the real titles,
departments, institutions and derived qualifications of open jobs, each with
its job count. The list is sent with the page, so typing makes no network
calls. The first row is always `Search for "<text>"`. The control is an ARIA
combobox: arrow keys move, Enter selects, Escape closes.

### 4.4 Popular searches and category tiles

Popular searches are a curated list (Assistant Professor, Professor, Computer
Science, Engineering, Nursing, Pharmacy, Dental, HR, Administration, Freshers,
Lab Technician). A chip is shown only if it currently returns at least one job
on this site. Tiles show Teaching, Non-teaching, Leadership and any other
category present, each with its live count.

### 4.5 Filters

**Rule:** a filter group is shown only if the jobs on this site have at least
two values for it. Within a group, options with no matching jobs are hidden.
Counts beside each option reflect the current search and the other filters.

| Filter | Type | Source | Shown today |
|---|---|---|---|
| Category | multi | `role_category` | yes |
| Institution | multi | `institution` (main site only) | yes |
| Department | multi | `department.name`, grouped by name | yes |
| Your experience | single | Fresher (min is 0), 0–2, 2–5, 5–10, 10+ years; a job matches when its range overlaps the bucket | yes |
| Qualification | multi | degrees recognised in `qualifications` and `education_level` | yes |
| Job type | multi | `job_type` | no (one value) |
| Location | multi | `city`, spelling unified | no (one value) |
| Posted | single | last 1, 3, 7, 30 days | no (one recent job) |

Options within one filter are alternatives (OR); different filters combine
(AND) with each other and with the search. Jobs with no experience data never
match an experience bucket.

Tablet and desktop (`md`, 768px, and up): a sticky "All Filters" card to the
left of the results, with the job cards stacked in one column to its right.
The product owner supplied a reference for this pattern (a Naukri results
page): group titles with a chevron, a checkbox per option, and each option's
job count in brackets after its label. Each group
is collapsible (the first three open by default, plus any group with a
selection) and shows how many of its options are ticked. Groups with nine or
more options have their own "Find…" box; long groups show six options with
"Show all".
Below `md` (phones): a "Filters (n)" button opens a bottom sheet with the same
controls, a Reset button, and a primary button reading "Show N jobs" that
closes the sheet. Changes apply at once, so N is the real count.

Sticky positioning needs the page root to carry `data-sticky-root`; the public
layout's `<main>` otherwise clips with `overflow-x: hidden`, which disables
sticky for everything inside it.

Active filters appear as removable chips under the toolbar with "Clear all".

### 4.6 URL state

`/careers?q=python+teaching&department=computer-science-and-engineering&experience=2-5&sort=newest&page=2`

Multiple values are comma-separated. Refresh, Back and a shared link reproduce
the same view. The older `institution_id` and `job_type` parameters still work.
Any listing URL with parameters is `noindex, follow` with a canonical of
`/careers`.

### 4.7 Result count, sort, pagination

Count wording: "367 open positions" with nothing applied; "6 jobs found for
"python teaching"" with a search; "8 jobs found" with filters only; "67 partial
matches for …" when no job matched every word. Sort
options: Relevance (default with a search), Newest (default otherwise),
Oldest, Job title. 24 cards per page with numbered pagination links.

### 4.8 Job card

One wide card per row. Tidied title; institution and department beneath it;
one line of facts (experience, qualification summary of up to three recognised
degrees, location); a footer line with category, job type and openings;
"New" for jobs posted in the last 7 days and "Posted N days ago" up to 30 days
(older dates appear on the job page only); the match label when searching; a
Save button. No description text, no salary unless public, at most one badge.

### 4.9 Empty, error and loading states

- **No results:** names the query, lists what to try, offers "Clear filters" with the count that would bring back when filters are the cause, and shows popular searches.
- **No open jobs:** "No open positions right now."
- **Feed unreachable:** "We couldn't load jobs right now" with a Try again button. No technical detail is shown.
- **Loading:** card skeletons; the heading and search box render immediately.

## 5. Job page `/careers/<job>`

### 5.1 URL

`<title>[-<department>]-<key>`, where the key is the number at the end of the
job code, or the first eight characters of the id when there is no usable
code. The job is found by its key, so when HR edits a title the old link
redirects (308) to the new one. `/careers/<uuid>` redirects the same way.
Example: `/careers/professor-pharmaceutics-1667974658`. The route folder is
still `app/(public)/careers/[id]`; the segment carries the slug.

### 5.2 Order of content

1. Breadcrumb: Home, Careers, job title
2. Category, title, institution and department
3. Apply now and Save
4. Key facts (definition list): institution, department, location, job type, experience, qualification, openings, salary if public, posted date, apply-by date if set, job code
5. "Am I eligible?": required qualifications and experience, restated from the job's own fields. It summarises; it does not judge the candidate. Omitted when the job has neither.
6. About the role
7. About the institution
8. Share
9. The application form, in a sticky column beside the content on desktop and after it on mobile
10. Similar jobs (up to four: same department first, then same institution and category, then similar titles)

**Description formatting.** HTML descriptions are sanitised and shown as
written. Plain-text descriptions are split into headed sections at the labels
HR already types ("Job Description:", "Responsibilities:", "Qualifications:",
"Note:" and similar), and any "About the college" section moves below the role
content. No wording is added or removed.

### 5.3 Apply

The form is unchanged in fields and submission. Added: an "Apply now" button
in the header; on screens below `lg`, a floating "Apply now" button that
scrolls to the form and focuses its first field. It shows only while neither
the header button nor the form is on screen;
after success, the reference number, a note that a confirmation email was
sent, and a "Back to careers" link.

### 5.4 Save and share

Save stores the job's link, title and institution in `localStorage`; the
listing toolbar shows "Saved (n)" which opens the list. Share offers WhatsApp,
LinkedIn, Email and Copy link, always with the canonical URL.

## 6. SEO and GEO

- Job page: title "`<job title>` at `<institution>`", description built from title, department, location, experience and qualification; canonical URL; Open Graph tags; one `h1`.
- `JobPosting` JSON-LD on job pages only, never on the listing. Changes: title matches the visible title; `educationRequirements` uses Google's allowed categories; `hiringOrganization` carries the site URL; **no JSON-LD is emitted for a job with no posted date** (previously today's date was substituted, which misstates the posting).
- `BreadcrumbList` JSON-LD on job pages.
- New `/sitemap-careers.xml` lists every open job, with the posted date as `lastmod` when known. It is added to the sitemap index. If MyJKKN is unreachable it answers 503 rather than an empty file.
- The key-facts block states position, organisation, location, employment type, experience and qualification as labelled values, readable by people and by AI systems.

**Open question:** the same job is reachable on the main site and on its
college's site. Each currently declares itself canonical. Choosing one host
per job needs a mapping from MyJKKN institution ids to site domains, which
does not exist yet.

## 7. Analytics (GA4)

| Event | When | Parameters |
|---|---|---|
| `search` | A search is run | `search_term`, `result_count`, `match_mode` |
| `careers_no_results` | A search or filter set returns nothing | `search_term`, `filters` |
| `careers_filter` | A filter is changed | `filter_name`, `filter_value`, `action` |
| `careers_job_view` | A job page opens | `job_id`, `job_title`, `institution` |
| `careers_job_save` | Save or unsave | `job_id`, `action` |
| `share` | A share option is used | `method`, `content_type: job`, `item_id` |
| `careers_apply_click` | Apply now is pressed | `job_id`, `placement` |
| `careers_apply_start` | First interaction with the form | `job_id` |
| `careers_apply_complete` | Application accepted | `job_id` |

Search terms are truncated to 100 characters. No applicant details are sent.

## 8. Quality requirements

- **Accessibility:** search, suggestions, filters, sheet, pagination, save and share all work by keyboard with visible focus; filter groups are fieldsets with legends; result count changes are announced; touch targets are at least 44 px; no meaning is carried by colour alone; no horizontal scroll at 320 px.
- **Performance:** one cached feed request serves every search and filter; the built index is reused for 300 s; cards are server-rendered; the browser never receives job descriptions on the listing.
- **Security:** only what MyJKKN publishes is shown; descriptions pass the existing sanitiser; no upstream error text reaches the page.

## 9. Data items for HR

These are visible on the public page today and cannot be fixed in the website.

1. **Test data is public:** the job with code `JOB-TEST001` ("Assistant Professor — Computer Science & Engineering", 3 openings, JKKN College of Engineering and Technology). The "JKKN Testing Institution" job was closed during this build. HR to close the remaining one in MyJKKN.
2. **Stale postings:** 332 of 335 dated jobs were posted more than a year ago and none has a closing date. Google for Jobs treats old postings without an end date as expired. HR to close filled roles and re-date live ones.
3. **Skills are empty on every job.** Skill search works only through description text until this is filled.
4. **Experience is missing on 131 jobs and department on 197.** Those jobs cannot be found through those filters.
5. **Titles:** many are in capitals or carry suffixes ("Vice Principal,", "Chief Executive Officer_JKKN Institutions"), and several are misspelt ("Profeesor", "Associtate Professor", "Lab Assisstant"). The site tidies capitals and suffixes for display only; spelling needs fixing at source.
6. **Analytics delivery:** the browser console shows requests to `https://www.google.com/g/collect` being refused on every page. That host is not in the site's Content-Security-Policy `connect-src` (only `www.google-analytics.com` and `analytics.google.com` are). Confirm in GA4 Realtime that events arrive before relying on the numbers in section 7.

## 10. Later, in MyJKKN

- Move search to Postgres full-text search when open jobs exceed about 2,000 or the feed exceeds 2 MB (Next.js does not cache larger responses).
- Add `slug`, `work_mode` and `experience_level` to the public job shape; fill `skills`.
- A search-log table and an HR view of top and no-result searches.
- Application status lookup by reference, if "View application" is wanted.

## 11. Acceptance scenarios

1. **Exact title:** "Assistant Professor" lists Assistant Professor jobs first.
2. **Keyword in any field:** "python" returns the jobs whose description mentions Python.
3. **Several words:** "python AI teaching" ranks jobs matching more of the words above jobs matching fewer, and says so when no job matches all three.
4. **Qualification:** "M.Tech CSE" returns Computer Science jobs that accept M.E or M.Tech.
5. **Abbreviation:** "MBA HR" matches "Human Resources" and "Master of Business Administration".
6. **Typo:** "nursng" returns nursing jobs.
7. **Search plus filters:** "professor", Department: Pharmaceutics, Experience: 5–10 years leaves only jobs meeting all three, and the chips show each one.
8. **No results:** a word that appears in no job ("astronaut") shows the no-result state with suggestions, never a blank page.
9. **Natural language:** "I am looking for teaching jobs in computer science" behaves like "teaching computer science".
10. **Mobile:** at 360 px the search box is visible without scrolling, filters open in a sheet whose button shows the count, cards are one column, the job page has a floating Apply button, and nothing scrolls sideways.
10a. **Tablet and zoomed laptops:** from 768 px the filter panel is on the left and the results on the right.
11. **Sharing:** Copy link on a job yields a URL that opens the same job.
12. **Back:** search, filter, open a job, press Back: the search and filters are intact.
13. **Old links:** `/careers/<uuid>` redirects to the readable URL.
