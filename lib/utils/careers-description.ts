// lib/utils/careers-description.ts
//
// Most MyJKKN descriptions are one unbroken paragraph with the section names
// typed inline: "About the College : … Job Description : … Responsibilities: …".
// This splits such text into headed sections at those labels so the job page
// can show role content first and "about the college" last (spec §5.2).
// It only re-arranges HR's own words — nothing is added, dropped or rewritten.

export interface DescriptionSection {
  /** HR's label as typed, or null for text before the first label. */
  heading: string | null
  body: string
  /** True for "About the college/institution" — shown after the role content. */
  about: boolean
}

// Only labels that reliably start a section. Short field-like labels
// ("Department:", "Location:") are left inline on purpose.
const LABELS = [
  'About the College', 'About the Institution', 'About the Organization', 'About the Organisation', 'About Us',
  'Job Description', 'Job Summary', 'Role Summary', 'Role Overview',
  'Roles and Responsibilities', 'Roles & Responsibilities', 'Duties and Responsibilities', 'Key Responsibilities',
  'Responsibilities',
  'Required Qualifications', 'Preferred Qualifications', 'Educational Qualifications', 'Educational Qualification',
  'Qualifications', 'Qualification', 'Eligibility', 'Requirements',
  'Skills Required', 'Required Skills', 'Skills', 'Benefits', 'How to Apply', 'Note',
]

// Longest first so "Key Responsibilities" wins over "Responsibilities".
const LABEL_RE = new RegExp(
  `(^|[\\s.;])(${[...LABELS].sort((a, b) => b.length - a.length).map(l => l.replace(/ /g, '\\s+')).join('|')})\\s*:`,
  'gi',
)

const ABOUT_RE = /^about\b/i

export function splitPlainDescription(text: string): DescriptionSection[] {
  const source = text.trim()
  const marks: Array<{ start: number; bodyStart: number; heading: string }> = []
  for (const m of source.matchAll(LABEL_RE)) {
    const heading = m[2]
    // A real label is capitalised; "…meets the requirements: …" mid-sentence is not.
    if (heading[0] !== heading[0].toUpperCase()) continue
    const start = (m.index ?? 0) + m[1].length
    marks.push({ start, bodyStart: (m.index ?? 0) + m[0].length, heading: heading.replace(/\s+/g, ' ') })
  }
  if (marks.length === 0) return [{ heading: null, body: source, about: false }]

  const sections: DescriptionSection[] = []
  const lead = source.slice(0, marks[0].start).trim()
  if (lead) sections.push({ heading: null, body: lead, about: false })
  marks.forEach((mark, i) => {
    const body = source.slice(mark.bodyStart, marks[i + 1]?.start ?? source.length).trim()
    if (body) sections.push({ heading: mark.heading, body, about: ABOUT_RE.test(mark.heading) })
  })
  return sections
}
