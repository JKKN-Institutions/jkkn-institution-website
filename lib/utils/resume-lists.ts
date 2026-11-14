// lib/utils/resume-lists.ts
//
// The three lists a careers applicant checks and corrects before submitting:
// WORK HISTORY, EDUCATION and SKILLS (Director, 14 Nov 2026 — "extract at the
// time of submission by the submitter itself").
//
// MIRROR, not an import: these types and caps are copied from MyJKKN's
// lib/hr/recruitment/resume-lists.ts and lib/services/hr/public-careers/
// resume-autofill.ts at commit 448b793538ac0223015fcb245d7ada28a8567c8d
// (PR #5643). The two repos deploy separately, so keep them in step by hand.
// If MyJKKN's caps change, change them here too.
//
// MyJKKN re-cleans everything this file sends (normalizeResumeLists), so the
// browser's job is not validation — it is to keep the applicant inside the
// caps, show them what was read, and never block a submit. A row that MyJKKN
// decides it cannot read is dropped there, silently and by design: the three
// lists must never stop an application.

/** One job. from / to are free text here; MyJKKN turns them into 'YYYY' or 'YYYY-MM' ('present' for an open end). */
export interface ResumeWorkItem {
  employer: string
  role: string
  from: string
  to: string
}

/** One degree. year is free text here; MyJKKN keeps a bare 4-digit year between 1950 and 2100. */
export interface ResumeEducationItem {
  degree: string
  subject: string
  institution: string
  year: string
}

export interface ResumeLists {
  work_history: ResumeWorkItem[]
  education: ResumeEducationItem[]
  skills: string
}

/** MyJKKN's RESUME_LIST_LIMITS. Rows past the cap are dropped by MyJKKN, so the editor stops the applicant first. */
export const RESUME_LIST_LIMITS = {
  workItems: 15,
  educationItems: 10,
  skills: 30,
  employer: 150,
  role: 150,
  degree: 150,
  subject: 150,
  institution: 200,
  skill: 60,
} as const

/** MyJKKN drops a whole list field longer than this rather than trimming it. */
export const RESUME_LIST_FIELD_MAX_CHARS = 20_000

export const EMPTY_WORK_ITEM: ResumeWorkItem = { employer: '', role: '', from: '', to: '' }
export const EMPTY_EDUCATION_ITEM: ResumeEducationItem = { degree: '', subject: '', institution: '', year: '' }
export const EMPTY_RESUME_LISTS: ResumeLists = { work_history: [], education: [], skills: '' }

const text = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : ''

/** A row the applicant has not filled in at all. MyJKKN drops these; so do we, on submit. */
export const workItemIsEmpty = (w: ResumeWorkItem): boolean =>
  !w.employer.trim() && !w.role.trim() && !w.from.trim() && !w.to.trim()

export const educationItemIsEmpty = (e: ResumeEducationItem): boolean =>
  !e.degree.trim() && !e.subject.trim() && !e.institution.trim() && !e.year.trim()

/**
 * MyJKKN keeps a work row only when it has an employer or a role, and an
 * education row only when it has a degree or an institution. A row with just
 * dates would vanish server-side, so warn the applicant instead.
 */
export const workItemWouldBeDropped = (w: ResumeWorkItem): boolean =>
  !workItemIsEmpty(w) && !w.employer.trim() && !w.role.trim()

export const educationItemWouldBeDropped = (e: ResumeEducationItem): boolean =>
  !educationItemIsEmpty(e) && !e.degree.trim() && !e.institution.trim()

/** MyJKKN's `fill` keys, when the reading carried the lists. All optional: an older MyJKKN sends none. */
export interface MaxResumeFillLists {
  work_history?: unknown
  education?: unknown
  skills?: unknown
}

/** One reading's lists → editable rows, held to the caps so the editor can never start over them. */
export function listsFromFill(fill: MaxResumeFillLists | null | undefined): ResumeLists {
  const rows = (v: unknown): Record<string, unknown>[] =>
    Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x)) : []

  const work_history = rows(fill?.work_history)
    .map(o => ({
      employer: text(o.employer, RESUME_LIST_LIMITS.employer),
      role: text(o.role, RESUME_LIST_LIMITS.role),
      from: text(o.from, 30),
      to: text(o.to, 30),
    }))
    .filter(w => !workItemIsEmpty(w))
    .slice(0, RESUME_LIST_LIMITS.workItems)

  const education = rows(fill?.education)
    .map(o => ({
      degree: text(o.degree, RESUME_LIST_LIMITS.degree),
      subject: text(o.subject, RESUME_LIST_LIMITS.subject),
      institution: text(o.institution, RESUME_LIST_LIMITS.institution),
      year: typeof o.year === 'number' ? String(o.year) : text(o.year, 4),
    }))
    .filter(e => !educationItemIsEmpty(e))
    .slice(0, RESUME_LIST_LIMITS.educationItems)

  const skillList = (Array.isArray(fill?.skills) ? fill.skills : typeof fill?.skills === 'string' ? fill.skills.split(',') : [])
    .map(s => text(s, RESUME_LIST_LIMITS.skill))
    .filter(Boolean)
  const seen = new Set<string>()
  const skills: string[] = []
  for (const s of skillList) {
    const key = s.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    skills.push(s)
    if (skills.length >= RESUME_LIST_LIMITS.skills) break
  }

  return { work_history, education, skills: skills.join(', ') }
}

export const resumeListsAreEmpty = (l: ResumeLists): boolean =>
  l.work_history.every(workItemIsEmpty) && l.education.every(educationItemIsEmpty) && !l.skills.trim()

/**
 * The three fields the apply POST carries, in the shape MyJKKN's
 * parseResumeListsForm reads: work_history and education as JSON arrays,
 * skills as a comma-separated line. A field over MyJKKN's 20,000-character
 * limit would be dropped whole, so it is left out here instead — the rest of
 * the application still goes.
 */
export function serializeResumeLists(lists: ResumeLists): Record<string, string> {
  const out: Record<string, string> = {}
  const put = (key: string, value: string) => {
    if (value && value.length <= RESUME_LIST_FIELD_MAX_CHARS) out[key] = value
  }

  const work = lists.work_history.filter(w => !workItemIsEmpty(w)).slice(0, RESUME_LIST_LIMITS.workItems)
  if (work.length) put('work_history', JSON.stringify(work))

  const education = lists.education.filter(e => !educationItemIsEmpty(e)).slice(0, RESUME_LIST_LIMITS.educationItems)
  if (education.length) put('education', JSON.stringify(education))

  put('skills', lists.skills.trim())
  return out
}
