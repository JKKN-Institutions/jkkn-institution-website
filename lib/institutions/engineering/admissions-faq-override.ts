// F1 + F11 of the engineering perception audit (user's choices 2026-11-21). The /admissions FAQ (also served
// at /admission-guide and /admissions/engineering) comes from Supabase site_settings 'admissions_faqs'. The live
// rows read on 2026-11-21 still said "92%+ placement rate (verified 2025) ... 500+ companies", "annual tuition
// is ₹95,000 ... hostel ₹60,000 ... total ₹1,55,000" and "Around 75% of students receive some form of financial
// aid". None has a source; the first two contradict the college's own NIRF 2026 filing and its fee page.
// This maps those answers to sourced text at render time and adds the three questions parents search for
// (Search Console, 12 months: "autonomous or not", NAAC grade, counselling code). No database row is edited.
// The FAQPage JSON-LD on the page is built from the same list, so it follows automatically.
//
// Sources: fee page /admissions/fee-structure (2026-27); /scholarships; bus fee ₹5,500 a year on every route =
// college office via the user, 2026-11-21; NAAC / UGC / DoTE facts = ./official-data.ts.
//
// User's choice 2026-11-24: the website shows no placement numbers at all (no placed count, rate or salary). The
// placement answer therefore names the Training and Placement Cell only. The mapping itself stays: without it the
// unsourced "92%+ placement rate" row in Supabase would show again.
import type { FAQItem } from './admissions-data'
import { APPROVALS_FAQS } from './official-data'

export const PLACEMENT_CELL_ANSWER =
  'JKKN College of Engineering and Technology has a Training and Placement Cell that runs placement training and organises campus recruitment drives for final-year learners.'

export const COST_ANSWER =
  'For 2026-27, Management Quota tuition is ₹80,000 a year for B.E. CSE and B.Tech IT, ₹70,000 for ECE and ₹45,000 for EEE and Mechanical; Government Quota tuition is as per Government norms. The college bus costs ₹5,500 a year on every route. For the hostel fee (food included), please ask the admissions office on +91 93458 55001. Examination fees, the caution deposit and other university fees are charged separately.'

export const SCHOLARSHIP_ANSWER =
  "Yes. Government scholarships (Post-Matric, First Graduate and community scholarships) are available to eligible learners, and the JKKN Trust merit scholarship ranges from ₹5,000 up to the full tuition fee. In the college's NIRF 2026 data, 120 undergraduate learners received full tuition reimbursement from the State or Central Government."

const PLACEMENT_QUESTION = /placed after graduation/i
const UNSOURCED_PLACEMENT = /\d{2}\s?%\+?\s*placement|500\+ companies/i
const COST_QUESTION = /total cost of education/i
const SCHOLARSHIP_QUESTION = /scholarships? for financially weaker/i

// The approvals page FAQ already holds the sourced answers; reuse them so the two pages never disagree.
const ADDED_QUESTIONS: { match: RegExp; source: RegExp }[] = [
  { match: /autonomous/i, source: /autonomous college\?$/i },
  { match: /\bNAAC\b/i, source: /NAAC grade/i },
  { match: /counselling code|TNEA code/i, source: /TNEA counselling code/i },
]

function addedFaqs(existing: FAQItem[]): FAQItem[] {
  const out: FAQItem[] = []
  for (const { match, source } of ADDED_QUESTIONS) {
    if (existing.some((faq) => match.test(faq?.question ?? ''))) continue
    const official = APPROVALS_FAQS.find((faq) => source.test(faq.question))
    if (official) out.push({ question: official.question, answer: official.answer, audience: 'parent' })
  }
  return out
}

function honestAnswer(faq: FAQItem): FAQItem {
  const question = faq?.question ?? ''
  const answer = faq?.answer ?? ''
  if (PLACEMENT_QUESTION.test(question) || UNSOURCED_PLACEMENT.test(answer)) {
    return { ...faq, answer: PLACEMENT_CELL_ANSWER }
  }
  if (COST_QUESTION.test(question)) return { ...faq, answer: COST_ANSWER }
  if (SCHOLARSHIP_QUESTION.test(question)) return { ...faq, answer: SCHOLARSHIP_ANSWER }
  return faq
}

/** Returns a new list: unsourced answers replaced, the three official questions appended once. */
export function withHonestAdmissionsFaqs(faqs: FAQItem[]): FAQItem[] {
  if (!Array.isArray(faqs)) return faqs
  const mapped = faqs.map((faq) => (faq ? honestAnswer(faq) : faq))
  return [...mapped, ...addedFaqs(mapped)]
}
