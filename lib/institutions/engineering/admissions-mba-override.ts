// The /admissions hub reads its sections from Supabase site_settings (category 'admissions'), and the live MBA
// rows there still carry the unsourced lines that commit 20fca53 removed from the static data: "Valid score in
// TANCET / CAT / MAT / XAT", "Group Discussion (GD) + Personal Interview (PI)", "direct counselling / GD+PI" and a
// "TANCET / CAT / MAT / XAT Score Card". This maps those rows to the official static text at render time (same
// pattern as officialPgCriteria for the homepage card). No database row is edited; once the rows are corrected the
// patterns stop matching and this is a no-op. Only MBA text is touched - the M.E. eligibility card is left as it is.
// Sources: lib/institutions/engineering/mba-admission-facts.ts (Step 6, GL6-376, 2026-11-03).
import {
  ADMISSION_STEPS,
  DETAILED_ELIGIBILITY,
  REQUIRED_DOCUMENTS,
  type AdmissionStep,
  type DetailedEligibilityItem,
  type DocumentItem,
} from './admissions-data'

const MBA_PROGRAMME = /M\.?\s?B\.?\s?A\b/i
const UNSOURCED_MBA_LINE = /\b(CAT|XAT|MAT|CMAT|ATMA)\b|Group Discussion|\bGD\s*\+?\s*PI\b|\(GD\)/i
const UNSOURCED_SCORE_CARD = /\b(CAT|XAT|MAT|CMAT|ATMA)\b/i

export interface MbaHubSections {
  eligibility: DetailedEligibilityItem[]
  steps: AdmissionStep[]
  documents: { common: DocumentItem[]; ugOnly: DocumentItem[]; pgOnly: DocumentItem[] }
}

const STATIC_MBA_ELIGIBILITY = DETAILED_ELIGIBILITY.find((e) => MBA_PROGRAMME.test(e.programme))
const STATIC_TANCET_DOC = REQUIRED_DOCUMENTS.pgOnly.find((d) => /TANCET/.test(d.name))

function officialEligibility(items: DetailedEligibilityItem[]): DetailedEligibilityItem[] {
  if (!Array.isArray(items) || !STATIC_MBA_ELIGIBILITY) return items
  return items.map((item) =>
    item && MBA_PROGRAMME.test(item.programme ?? '') && (item.criteria ?? []).some((c) => UNSOURCED_MBA_LINE.test(c))
      ? { ...item, criteria: [...STATIC_MBA_ELIGIBILITY.criteria] }
      : item
  )
}

function officialSteps(steps: AdmissionStep[]): AdmissionStep[] {
  if (!Array.isArray(steps)) return steps
  return steps.map((step) => {
    if (!step || !UNSOURCED_MBA_LINE.test(step.description ?? '')) return step
    const fix = ADMISSION_STEPS.find((s) => s.title === step.title) ?? ADMISSION_STEPS.find((s) => s.number === step.number)
    return fix && !UNSOURCED_MBA_LINE.test(fix.description) ? { ...step, description: fix.description } : step
  })
}

function officialPgDocuments(docs: DocumentItem[]): DocumentItem[] {
  if (!Array.isArray(docs) || !STATIC_TANCET_DOC) return docs
  return docs.map((doc) => (doc && UNSOURCED_SCORE_CARD.test(doc.name ?? '') ? { ...STATIC_TANCET_DOC } : doc))
}

/** Returns a copy with the unsourced MBA lines replaced; the input is not changed. */
export function withOfficialMbaText<T extends MbaHubSections>(data: T): T {
  const documents = data.documents
  return {
    ...data,
    eligibility: officialEligibility(data.eligibility),
    steps: officialSteps(data.steps),
    documents: documents && { ...documents, pgOnly: officialPgDocuments(documents.pgOnly) },
  }
}
