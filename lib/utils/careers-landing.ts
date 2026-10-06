// lib/utils/careers-landing.ts
//
// Pure helpers for the /careers/teaching-jobs landing page: which open jobs
// belong on it, how they are grouped, and the question-and-answer block.
// Everything is derived from the live MyJKKN feed, so a job HR opens or closes
// moves on and off the page with no edit here. Nothing in the copy states a
// salary, working hours or benefit — the feed does not carry them.

/** The campus, as published in the site-wide organisation markup and llms.txt. */
export const CAMPUS = {
  name: 'JKKN Institutions',
  street: 'Natarajapuram, NH-544 (Salem to Coimbatore National Highway)',
  locality: 'Komarapalayam',
  district: 'Namakkal District',
  region: 'Tamil Nadu',
  postalCode: '638183',
  country: 'IN',
  phone: '+91 93458 55001',
  phoneHref: 'tel:+919345855001',
  email: 'info@jkkn.ac.in',
  founded: '1952',
  nearestCity: 'Erode',
  nearestCityKm: 18,
} as const

/** What the grouping reads from a job. Card data from the careers service satisfies it. */
export interface LandingJob {
  title: string
  roleCategory: string
  qualification: string
  experience: string
  closesAt: string | null
}

export type FacultyKey = 'assistant-professor' | 'professor' | 'lecturer' | 'tutor'
export type SchoolKey = 'primary' | 'high-school' | 'higher-secondary' | 'trainers'
export type TeachingBucket = FacultyKey | SchoolKey

const FACULTY: { key: FacultyKey; label: string; search: string }[] = [
  { key: 'assistant-professor', label: 'Assistant Professor', search: 'Assistant Professor' },
  { key: 'professor', label: 'Professor and Associate Professor', search: 'Professor' },
  { key: 'lecturer', label: 'Lecturer, Senior Lecturer and Reader', search: 'Lecturer' },
  { key: 'tutor', label: 'Tutor', search: 'Tutor' },
]

const SCHOOL: { key: SchoolKey; heading: string }[] = [
  { key: 'primary', heading: 'Kindergarten, primary and middle school teacher vacancies' },
  { key: 'high-school', heading: 'High school and secondary teacher vacancies' },
  { key: 'higher-secondary', heading: 'Higher secondary (PG Assistant) teacher vacancies' },
  { key: 'trainers', heading: 'Trainer and physical education vacancies' },
]

// Order matters: "Assistant Professor" before "Professor", and the misspelt
// "Associate Prfessor" / "Assoicate Professor" titles on the live feed still land.
const FACULTY_RULES: [RegExp, FacultyKey][] = [
  [/ass(?:istan|t)\w*\.?\s*prof|^ap\b/, 'assistant-professor'],
  [/asso\w*\s*pr|prof/, 'professor'],
  [/lecturer|reader/, 'lecturer'],
  [/tutor/, 'tutor'],
]
const NOT_TEACHING = /principal|non[\s-]?teaching|human resources|\blab\b|librar/

/**
 * The teaching group a job belongs to, or null when it is not a teaching role.
 * Faculty grades are recognised by title in any category except leadership;
 * every other role must be in HR's teaching category to be listed.
 */
export function teachingBucket(job: Pick<LandingJob, 'title' | 'roleCategory'>): TeachingBucket | null {
  const title = job.title.toLowerCase()
  if (job.roleCategory === 'senior_leadership' || NOT_TEACHING.test(title)) return null
  for (const [pattern, key] of FACULTY_RULES) if (pattern.test(title)) return key
  if (job.roleCategory !== 'teaching_faculty') return null
  if (/post\s*graduate assistant|\bpg assistant|\bpgt\b/.test(title)) return 'higher-secondary'
  if (/b\.?\s?t\.? assistant|high school|secondary|computer teacher|\btgt\b/.test(title)) return 'high-school'
  if (/trainer|coach|physical/.test(title)) return 'trainers'
  return 'primary'
}

export interface SchoolGroup<T> { key: SchoolKey; heading: string; jobs: T[]; note: string }
export interface FacultyTile { key: FacultyKey; label: string; search: string; count: number }
export interface TeachingLanding<T> {
  groups: SchoolGroup<T>[]
  faculty: FacultyTile[]
  /** Jobs listed on the page itself. */
  listed: T[]
  facultyTotal: number
  total: number
}

const unique = (values: string[]) => [...new Set(values.filter(Boolean))]
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/** One factual line under a group heading, built only from what the listings show. */
export function groupNote(jobs: Pick<LandingJob, 'qualification' | 'experience'>[]): string {
  const parts = [`${plural(jobs.length, 'role', 'roles')} listed.`]
  const quals = unique(jobs.map(j => j.qualification)).sort()
  const exps = unique(jobs.map(j => j.experience)).sort()
  if (quals.length) parts.push(`Qualification shown on the listings: ${quals.slice(0, 5).join('; ')}.`)
  if (exps.length) parts.push(`Experience shown: ${exps.slice(0, 4).join('; ')}.`)
  const blank = jobs.filter(j => !j.qualification).length
  if (blank) parts.push(`${plural(blank, 'listing does', 'listings do')} not show a qualification line, so read the job description.`)
  return parts.join(' ')
}

export function buildTeachingLanding<T extends LandingJob>(jobs: T[]): TeachingLanding<T> {
  const buckets = new Map<TeachingBucket, T[]>()
  for (const job of jobs) {
    const key = teachingBucket(job)
    if (key) buckets.set(key, [...(buckets.get(key) ?? []), job])
  }
  const groups = SCHOOL
    .map(({ key, heading }) => {
      const list = [...(buckets.get(key) ?? [])].sort((a, b) => a.title.localeCompare(b.title))
      return { key, heading, jobs: list, note: groupNote(list) }
    })
    .filter(g => g.jobs.length > 0)
  const faculty = FACULTY.map(f => ({ ...f, count: buckets.get(f.key)?.length ?? 0 })).filter(f => f.count > 0)
  const listed = groups.flatMap(g => g.jobs)
  const facultyTotal = faculty.reduce((sum, f) => sum + f.count, 0)
  return { groups, faculty, listed, facultyTotal, total: listed.length + facultyTotal }
}

export interface Faq { question: string; answer: string }

/**
 * The visible question-and-answer block, also emitted as FAQPage markup.
 * Answers quote only the address, the apply form and what the current
 * listings show; counts and the date come from the feed at request time.
 */
export function buildTeachingFaqs<T extends LandingJob>(landing: TeachingLanding<T>, asOf: string): Faq[] {
  const { total, listed, facultyTotal } = landing
  const where = `${CAMPUS.locality}, ${CAMPUS.district}`
  const quals = unique(listed.map(j => j.qualification)).sort().slice(0, 6)
  const freshers = listed.filter(j => j.experience === 'Freshers welcome').length
  const closing = listed.some(j => j.closesAt)

  return [
    {
      question: 'Are there teaching jobs near Erode and Namakkal?',
      answer: `Yes. JKKN Institutions lists teaching jobs at its campus in ${where}, which is ${CAMPUS.nearestCityKm} km by road from ${CAMPUS.nearestCity} city. As of ${asOf} the careers page shows ${plural(total, 'teaching opening', 'teaching openings')}, covering school teacher vacancies and college faculty roles. All of them are based at ${CAMPUS.locality}.`,
    },
    {
      question: 'What teaching jobs are open at JKKN Institutions in Komarapalayam?',
      answer: `As of ${asOf}, the JKKN Institutions careers page lists ${plural(total, 'teaching opening', 'teaching openings')}. ${listed.length} are school teacher, trainer and physical education roles, and ${facultyTotal} are college faculty roles such as Assistant Professor, Associate Professor, Professor, Reader, Senior Lecturer, Lecturer and Tutor. All are based in ${where}.`,
    },
    {
      question: 'What qualification do I need for a school teacher job at JKKN?',
      answer: `Each listing states its own requirement.${quals.length ? ` The current school teacher listings show: ${quals.join('; ')}.` : ''} Check the Qualification line on the job page before you apply, because it differs by subject and class level.`,
    },
    {
      question: 'Can freshers apply for teaching jobs at JKKN?',
      answer: `It depends on the role. Each listing shows the experience it asks for${freshers ? `, and ${plural(freshers, 'current listing states', 'current listings state')} that freshers are welcome` : ''}. The online application form accepts zero months of experience, so a fresher can submit an application for any role and state that clearly.`,
    },
    {
      question: 'How do I apply for a teaching job at JKKN Institutions?',
      answer: 'Apply online from the job page on jkkn.ac.in/careers. Open the role, select Apply now, then enter your name, email, phone number, highest qualification and total experience. Upload a resume in PDF, DOC or DOCX format of up to 2 MB and submit. You do not need to create an account.',
    },
    {
      question: 'Where is JKKN Institutions, and how far is it from Erode?',
      answer: `JKKN Institutions is at Natarajapuram on NH-544, the Salem to Coimbatore National Highway, in ${where}, ${CAMPUS.region} ${CAMPUS.postalCode}. The campus is ${CAMPUS.nearestCityKm} km by road from ${CAMPUS.nearestCity} city. Every teaching role listed on this page is based at this one ${CAMPUS.locality} campus.`,
    },
    {
      question: 'Is there a last date to apply for JKKN teaching jobs?',
      answer: closing
        ? 'Some listings show a closing date on the job page and others do not. Open the role you want and check the job page before you apply, and mention the job title exactly as it is listed.'
        : 'The job listings on the JKKN careers page do not show a closing date. Each listing shows the institution, the qualification and the number of openings. If a role matters to you, apply through the online form and mention the job title exactly as it is listed.',
    },
  ]
}

// ── Structured data ─────────────────────────────────────────────────────────
// A list page carries ItemList, not JobPosting: Google wants JobPosting only on
// the page of the single job, and each job page already has it.

export function buildFaqJsonLd(faqs: Faq[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  }
}

export function buildLandingJsonLd(input: {
  pageUrl: string
  name: string
  description: string
  crumb: string
  jobs: { title: string; url: string }[]
}): Record<string, unknown>[] {
  const { pageUrl, name, description, crumb, jobs } = input
  const origin = new URL(pageUrl).origin
  const item = (position: number, label: string, url: string) => ({ '@type': 'ListItem', position, name: label, item: url })
  const organisation = {
    '@type': 'EducationalOrganization',
    name: CAMPUS.name,
    url: `${origin}/`,
    telephone: CAMPUS.phone,
    email: CAMPUS.email,
    foundingDate: CAMPUS.founded,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CAMPUS.street,
      addressLocality: CAMPUS.locality,
      addressRegion: CAMPUS.region,
      postalCode: CAMPUS.postalCode,
      addressCountry: CAMPUS.country,
    },
  }
  const page: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#webpage`,
    name,
    url: pageUrl,
    description,
    inLanguage: 'en-IN',
    breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
    isPartOf: { '@type': 'WebSite', name: CAMPUS.name, url: `${origin}/` },
    about: organisation,
    publisher: { '@type': 'EducationalOrganization', name: CAMPUS.name, url: `${origin}/` },
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [item(1, 'Home', origin), item(2, 'Careers', `${origin}/careers`), item(3, crumb, pageUrl)],
  }
  if (jobs.length === 0) return [page, breadcrumb]
  page.mainEntity = { '@id': `${pageUrl}#jobs` }
  const list = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${pageUrl}#jobs`,
    name,
    numberOfItems: jobs.length,
    itemListElement: jobs.map((j, i) => ({ '@type': 'ListItem', position: i + 1, name: j.title, url: j.url })),
  }
  return [page, list, breadcrumb]
}
