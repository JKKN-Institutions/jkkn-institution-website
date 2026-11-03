// MBA admission facts for Engineering, from official sources only - Step 6 of the 10,300-lead plan
// (GL6-376). User, 2026-11-03: "official source la ena solrangalo athu use paniko".
//
// Sources (copies in the SEO project, artefacts/keywords/engg-mba-entrance-sources-2026-11-03/):
// - Eligibility: Tamil Nadu MBA / MCA Admissions 2026 information (Directorate of Technical Education +
//   Directorate of Collegiate Education), clause 2.2 - a recognised bachelor's degree of at least 3 years with
//   50% marks, 45% for Tamil Nadu candidates of the BC, BCM, MBC & DNC, SC, SCA and ST communities. AICTE's
//   Approval Process Handbook 2024-27 (p.122, MBA/MMS row) sets the same 50% / 45% and no entrance test.
// - Government Quota: the same TN document, clause 2.4 (a TANCET (MBA) mark sheet is compulsory) and clause 4
//   (merit list on TANCET marks). The single window also fills the seats self-financing colleges surrender;
//   JKKNCET is college code 2647 in it (2026 vacancy list). Clause 2.5: no age limit.
// - Management Quota: no official document states JKKNCET's rule. Tamil Nadu's admissions Committee lets the
//   TNSF Consortium admit on its common entrance test in MEMBER colleges, and JKKNCET is not on the 2026 member
//   list. So the site names no exam for Management Quota and sends the reader to the admission office. The
//   earlier lines - "TANCET / CAT / MAT / XAT required", "score preferred", "limited seats without entrance",
//   "GD + PI final selection" - had no source and contradicted each other.

/** Full eligibility sentence (TN MBA / MCA Admissions 2026, clause 2.2). */
export const MBA_ELIGIBILITY =
  "A bachelor's degree of at least 3 years from a recognised university with 50% marks (45% for Tamil Nadu candidates of the BC, BCM, MBC & DNC, SC, SCA and ST communities)"

/** Government Quota route (clauses 2.4 and 4). */
export const MBA_GOVT_QUOTA =
  'Government Quota seats are allotted through Tamil Nadu MBA / MCA Admissions, the single-window counselling of the Directorate of Technical Education, on TANCET (MBA) marks. Write TANCET, then choose JKKN College of Engineering and Technology, college code 2647.'

/** Management Quota - no published rule for this college, so no exam is named. */
export const MBA_MGMT_QUOTA =
  'Management Quota seats are filled by the college. Ask the admission office (+91 93458 55001) about the current process and the entrance scores it accepts.'

/** One-line version for grids and structured data. */
export const MBA_ELIGIBILITY_SHORT =
  "Any bachelor's degree (3 years) with 50% marks (45% for reserved communities of Tamil Nadu); TANCET (MBA) for Government Quota seats"

/**
 * The combined "MBA / M.E Programs" eligibility card of the homepage admission block. Its live text comes from
 * CMS block props ("Valid TANCET / CAT / MAT / XAT score", "Group discussion and personal interview clearance"),
 * so it is replaced at render time; no CMS record is edited, and this is a no-op once the CMS text changes.
 */
export const MBA_ME_CARD_CRITERIA: ReadonlyArray<string> = [
  "MBA: any bachelor's degree (3 years) with 50% marks (45% for reserved communities of Tamil Nadu)",
  'MBA Government Quota: TANCET (MBA) marks in Tamil Nadu MBA / MCA Admissions, college code 2647',
  'Management Quota and M.E.: ask the admission office about the entrance test it accepts',
]

const UNSOURCED_PG_ENTRANCE_LINE = /TANCET\s*\/\s*CAT\s*\/\s*MAT/i

export function officialPgCriteria(criteria: string[]): string[] {
  return criteria.some((c) => UNSOURCED_PG_ENTRANCE_LINE.test(c)) ? [...MBA_ME_CARD_CRITERIA] : criteria
}
