import { describe, expect, it } from 'vitest'
import {
  buildDesignationFaqs, buildDesignationLanding, buildFaqJsonLd, buildLandingJsonLd, buildNonTeachingFaqs,
  buildNonTeachingLanding, buildTeachingFaqs, buildTeachingLanding, groupNote, isLabOrLibrary, isLeadership,
  nonTeachingBucket,
  onDesignationPage, splitSummary, teachingBucket,
  type LandingJob,
} from '@/lib/utils/careers-landing'

const job = (title: string, over: Partial<LandingJob> = {}): LandingJob => ({
  title, roleCategory: 'teaching_faculty', qualification: '', experience: '', closesAt: null, ...over,
})

describe('careers-landing', () => {
  it('sorts faculty grades by title, including the misspelt ones on the live feed', () => {
    expect(teachingBucket(job('Assistant Professor - Physics'))).toBe('assistant-professor')
    expect(teachingBucket(job('Asst Prof - Pharmacology - Cop'))).toBe('assistant-professor')
    expect(teachingBucket(job('AP - ECE - CET - Asst Prof'))).toBe('assistant-professor')
    expect(teachingBucket(job('Assistant Profesor- Pedagogy of History'))).toBe('assistant-professor')
    expect(teachingBucket(job('Associate Prfessor'))).toBe('professor')
    expect(teachingBucket(job('Assoicate Professor'))).toBe('professor')
    expect(teachingBucket(job('Profeesor'))).toBe('professor')
    expect(teachingBucket(job('Professor of Practice'))).toBe('professor')
    expect(teachingBucket(job('Senior Lecturer'))).toBe('lecturer')
    expect(teachingBucket(job('Reader - Phd - Dch'))).toBe('lecturer')
    expect(teachingBucket(job('Nursing Tutor'))).toBe('tutor')
    // "Lab" in a faculty title must not hide the post (it did until 2026-10-07).
    expect(teachingBucket(job('Assistant Professor Clinical Lab Technology'))).toBe('assistant-professor')
    expect(nonTeachingBucket(job('Assistant Professor Clinical Lab Technology'))).toBeNull()
  })

  it('recognises a faculty grade outside the teaching category, but never in leadership', () => {
    expect(teachingBucket(job('Lecturer with MBBS', { roleCategory: 'medical' }))).toBe('lecturer')
    expect(teachingBucket(job('Professor', { roleCategory: 'senior_leadership' }))).toBeNull()
  })

  it('groups school and trainer roles, and leaves non-teaching roles out', () => {
    expect(teachingBucket(job('Post Graduate Assistant in Maths'))).toBe('higher-secondary')
    expect(teachingBucket(job('B T Assistant in Biology'))).toBe('high-school')
    expect(teachingBucket(job('Secondary School Teacher - Physics'))).toBe('high-school')
    expect(teachingBucket(job('Computer Teacher'))).toBe('high-school')
    expect(teachingBucket(job('Aptitude Trainer'))).toBe('trainers')
    expect(teachingBucket(job('Physical Educator'))).toBe('trainers')
    expect(teachingBucket(job('Kg Teacher'))).toBe('primary')
    expect(teachingBucket(job('Vice Principal'))).toBeNull()
    expect(teachingBucket(job('Non teaching staff'))).toBeNull()
    expect(teachingBucket(job('Human Resources Coordinator(HR)'))).toBeNull()
    expect(teachingBucket(job('Lab Assistant'))).toBeNull()
    expect(teachingBucket(job('Senior Librarian'))).toBeNull()
    expect(teachingBucket(job('Accountant', { roleCategory: 'non_teaching' }))).toBeNull()
  })

  const board = [
    job('Primary Teacher'),
    job('B T Assistant in Tamil', { qualification: 'B.A / B.Ed', experience: '1+ years' }),
    job('B T Assistant in Maths', { qualification: 'B.Sc / B.Ed', experience: '1+ years' }),
    job('Physical Educator', { experience: 'Freshers welcome' }),
    job('Assistant Professor'),
    job('Assistant Professor - Zoology'),
    job('Professor'),
    job('Tutor'),
    job('Accountant', { roleCategory: 'non_teaching' }),
  ]

  it('builds the page from the feed: listed jobs, faculty counts and a total that adds up', () => {
    const landing = buildTeachingLanding(board)
    expect(landing.groups.map(g => [g.key, g.jobs.length])).toEqual([['primary', 1], ['high-school', 2], ['trainers', 1]])
    expect(landing.groups[1].jobs.map(j => j.title)).toEqual(['B T Assistant in Maths', 'B T Assistant in Tamil'])
    expect(landing.faculty.map(f => [f.key, f.count])).toEqual([['assistant-professor', 2], ['professor', 1], ['tutor', 1]])
    expect(landing.listed).toHaveLength(4)
    expect(landing.facultyTotal).toBe(4)
    expect(landing.total).toBe(8)
  })

  it('writes a group note only from what the listings show', () => {
    expect(groupNote([job('A', { qualification: 'B.Ed', experience: '1+ years' }), job('B')])).toBe(
      '2 roles listed. Qualification shown on the listings: B.Ed. Experience shown: 1+ years. 1 listing does not show a qualification line, so read the job description.',
    )
    expect(groupNote([job('A')])).toBe('1 role listed. 1 listing does not show a qualification line, so read the job description.')
  })

  it('answers with live counts and never mentions salary, hours or benefits', () => {
    const landing = buildTeachingLanding(board)
    const faqs = buildTeachingFaqs(landing, '6 October 2026')
    expect(faqs).toHaveLength(7)
    expect(faqs[0].answer).toContain('8 teaching openings')
    expect(faqs[1].answer).toContain('4 are school teacher, trainer and physical education roles, and 4 are college faculty roles')
    expect(faqs[2].answer).toContain('B.A / B.Ed; B.Sc / B.Ed')
    expect(faqs[3].answer).toContain('1 current listing states that freshers are welcome')
    expect(faqs[6].answer).toContain('do not show a closing date')
    const text = faqs.map(f => f.answer).join(' ').toLowerCase()
    for (const word of ['salary', 'working hours', 'pf', 'hostel']) expect(text).not.toContain(word)
  })

  it('stops saying there is no closing date once a listed job has one', () => {
    const landing = buildTeachingLanding([job('Primary Teacher', { closesAt: '2026-12-31T00:00:00Z' })])
    expect(buildTeachingFaqs(landing, '6 October 2026')[6].answer).toContain('Some listings show a closing date')
  })

  it('sorts non-teaching roles into four groups and keeps other pages\' roles out', () => {
    const nt = (title: string) => nonTeachingBucket(job(title, { roleCategory: 'non_teaching' }))
    expect(nt('Accountant')).toBe('office')
    expect(nt('Cashier')).toBe('office')
    expect(nt('Marketing Manager')).toBe('office')
    expect(nt('Placement Officer & Corporate Relations')).toBe('office')
    expect(nt('Sytem Administrator')).toBe('technical')
    expect(nt('Computer Technician/Assistant')).toBe('technical')
    expect(nt('CCTV Monitoring Operator - Main Office')).toBe('technical')
    expect(nt('Civil Supervisor')).toBe('technical')
    expect(nt('Pharmacist')).toBe('hospital')
    expect(nt('Ceramic Technician')).toBe('hospital')
    expect(nt('Dental Mechanic')).toBe('hospital')
    expect(nt('Hospital Manager')).toBe('hospital')
    expect(nt('Hostel Warden')).toBe('campus')
    expect(nt('House Keeping Supervisor Ladies Hostel')).toBe('campus')
    expect(nt('Store Keeper - Pharmacy')).toBe('campus')
    expect(nt('Stores Incharge')).toBe('campus')
    // HR files these two under teaching; they are office roles.
    expect(nonTeachingBucket(job('Non teaching staff'))).toBe('office')
    expect(nonTeachingBucket(job('Human Resources Coordinator(HR)'))).toBe('office')
    // Listed elsewhere: teaching, leadership, lab and library.
    expect(nonTeachingBucket(job('Primary Teacher'))).toBeNull()
    expect(nt('Assistant Professor')).toBeNull()
    expect(nt('Lab Assistant')).toBeNull()
    expect(nt('Lab Technician/Research Assistant')).toBeNull()
    expect(nt('Senior Librarian')).toBeNull()
    expect(nt('Vice Principal')).toBeNull()
    expect(nonTeachingBucket(job('Chief Operations Officer (COO)', { roleCategory: 'senior_leadership' }))).toBeNull()
  })

  it('never lists one job on both the teaching and the non-teaching page', () => {
    const titles = ['Accountant', 'Primary Teacher', 'Assistant Professor', 'Tutor', 'Non teaching staff', 'Lab Assistant',
      'Hostel Warden', 'Aptitude Trainer', 'Vice Principal', 'Lecturer with MBBS', 'Pharmacist']
    for (const roleCategory of ['teaching_faculty', 'non_teaching', 'medical', 'senior_leadership']) {
      for (const title of titles) {
        const j = job(title, { roleCategory })
        expect(Boolean(teachingBucket(j)) && Boolean(nonTeachingBucket(j)), `${title} / ${roleCategory}`).toBe(false)
      }
    }
  })

  it('builds the non-teaching page and its answers from the feed', () => {
    const nt = (title: string, over: Partial<LandingJob> = {}) => job(title, { roleCategory: 'non_teaching', ...over })
    const landing = buildNonTeachingLanding([
      nt('Cashier', { qualification: 'Any degree', experience: 'Freshers welcome' }),
      nt('Accountant', { qualification: 'M.Com / B.Com', experience: '2+ years' }),
      nt('Hostel Warden'),
      nt('Pharmacist'),
      nt('Lab Assistant'),
      job('Primary Teacher'),
    ])
    expect(landing.groups.map(g => [g.key, g.jobs.map(j => j.title)])).toEqual([
      ['office', ['Accountant', 'Cashier']], ['hospital', ['Pharmacist']], ['campus', ['Hostel Warden']],
    ])
    expect(landing.total).toBe(4)
    const faqs = buildNonTeachingFaqs(landing, '7 October 2026')
    expect(faqs).toHaveLength(7)
    expect(faqs[0].answer).toContain('4 non-teaching openings')
    expect(faqs[1].answer).toContain('2 in office and administration, 1 in hospital and clinical support and 1 in hostel, stores and campus')
    expect(faqs[2].answer).toContain('Any degree; M.Com / B.Com')
    expect(faqs[3].answer).toContain('1 current listing states that freshers are welcome')
    const text = faqs.map(f => f.answer).join(' ').toLowerCase()
    for (const word of ['salary', 'working hours', 'pf']) expect(text).not.toContain(word)
  })

  it('puts lab and library support roles on their own page, never faculty or leadership', () => {
    const nt = (title: string) => job(title, { roleCategory: 'non_teaching' })
    for (const title of ['Lab Assistant', 'Lab Assisstant-Pharmacy', 'Lab technician', 'Lab Technician/Research Assistant',
      'Librarian', 'Senior Librarian - Engineering College', 'Library Attender', 'Assistant Librarian']) {
      expect(isLabOrLibrary(nt(title)), title).toBe(true)
      expect(nonTeachingBucket(nt(title)), title).toBeNull()
    }
    expect(isLabOrLibrary(job('Assistant Professor Clinical Lab Technology'))).toBe(false)
    expect(isLabOrLibrary(nt('Accountant'))).toBe(false)
    expect(isLabOrLibrary(job('Lab Director', { roleCategory: 'senior_leadership' }))).toBe(false)
  })

  it('groups a faculty designation by college, largest first, from the feed', () => {
    const at = (title: string, institution: string | null, over: Partial<LandingJob> = {}) => job(title, { institution, ...over })
    const jobs = [
      at('Assistant Professor - Physics', 'JKKN College of Arts and Science (Self)'),
      at('Assistant Professor', 'JKKN College of Pharmacy', { qualification: 'M.Pharm', experience: 'Freshers welcome' }),
      at('Asst Prof - Pharmacology - Cop', 'JKKN College of Pharmacy', { qualification: 'Ph.D' }),
      at('Assistant Professor', null),
      at('Senior Lecturer', 'JKKN Dental College and Hospital'),
      at('Reader', 'JKKN Dental College and Hospital'),
      at('Professor', 'JKKN Dental College and Hospital'),
      job('Lab Assistant', { roleCategory: 'non_teaching', institution: 'JKKN College of Pharmacy' }),
    ]
    const ap = buildDesignationLanding('assistant-professor', jobs, 'Assistant Professor')
    expect(ap.groups.map(g => [g.heading, g.jobs.length])).toEqual([
      ['Assistant Professor jobs at JKKN College of Pharmacy', 2],
      ['Assistant Professor jobs at JKKN College of Arts and Science (Self)', 1],
      ['Assistant Professor jobs at Other JKKN institutions', 1],
    ])
    expect(ap.total).toBe(4)
    expect(splitSummary(ap.groups, 'at')).toBe(
      '2 at JKKN College of Pharmacy, 1 at JKKN College of Arts and Science (Self) and 1 at Other JKKN institutions',
    )
    const lect = buildDesignationLanding('lecturer', jobs, 'Lecturer and Reader')
    expect(lect.listed.map(j => j.title)).toEqual(['Reader', 'Senior Lecturer'])
    const lab = buildDesignationLanding('lab-library', [...jobs, job('Librarian', { roleCategory: 'non_teaching' })], 'Lab and library')
    expect(lab.groups.map(g => [g.key, g.jobs.length]).sort()).toEqual([['lab', 1], ['library', 1]])

    const faqs = buildDesignationFaqs('assistant-professor', ap, '7 October 2026', 'Assistant Professor')
    expect(faqs).toHaveLength(7)
    expect(faqs[0].question).toBe('Are there assistant professor jobs near Erode and Namakkal?')
    expect(faqs[0].answer).toContain('4 assistant professor openings')
    expect(faqs[2].answer).toContain('M.Pharm; Ph.D')
    expect(faqs[3].answer).toContain('1 current listing states that freshers are welcome')
    const text = faqs.map(f => f.answer).join(' ').toLowerCase()
    for (const word of ['salary', 'working hours', 'ugc']) expect(text).not.toContain(word)
  })

  it('summarises more than three groups as the top three plus a remainder', () => {
    const g = (label: string, n: number) => ({ key: label, heading: label, label, note: '', jobs: Array.from({ length: n }, () => job('x')) })
    expect(splitSummary([g('A', 16), g('B', 14), g('C', 12), g('D', 9), g('E', 1)], 'at')).toBe(
      '16 at A, 14 at B, 12 at C and 10 at other JKKN institutions',
    )
  })

  it('lists every job on at most one of the designation and non-teaching pages', () => {
    const titles = ['Assistant Professor', 'Reader', 'Lab Assistant', 'Librarian', 'Accountant', 'Tutor', 'Primary Teacher']
    for (const roleCategory of ['teaching_faculty', 'non_teaching', 'medical']) {
      for (const title of titles) {
        const j = job(title, { roleCategory })
        const pages = [onDesignationPage('assistant-professor', j), onDesignationPage('lecturer', j),
          onDesignationPage('lab-library', j), Boolean(nonTeachingBucket(j))].filter(Boolean).length
        expect(pages, `${title} / ${roleCategory}`).toBeLessThanOrEqual(1)
      }
    }
  })

  it('lists professors, tutors and leadership on their own pages', () => {
    const at = (title: string, institution: string, over: Partial<LandingJob> = {}) => job(title, { institution, ...over })
    const lead = (title: string) => job(title, { roleCategory: 'senior_leadership', institution: 'JKKN Main Office' })
    const jobs = [
      at('Professor', 'JKKN Dental College and Hospital'),
      at('Associate Prfessor', 'JKKN College of Pharmacy'),
      at('Professor of Practice', 'JKKN Dental College and Hospital'),
      at('Assistant Professor', 'JKKN College of Pharmacy'),
      at('Tutor', 'JKKN College of Allied Health Sciences'),
      at('Nursing Tutor', 'JKKN College of Nursing and Research'),
      lead('Principal JKKN College of Pharmacy'),
      lead('Chief Operations Officer (COO)'),
      at('Vice Principal', 'JKKN College of Education'),
    ]
    const prof = buildDesignationLanding('professor', jobs, 'Professor and Associate Professor')
    expect(prof.groups.map(g => [g.label, g.jobs.length])).toEqual([
      ['JKKN Dental College and Hospital', 2], ['JKKN College of Pharmacy', 1],
    ])
    expect(buildDesignationLanding('tutor', jobs, 'Tutor').listed.map(j => j.title).sort()).toEqual(['Nursing Tutor', 'Tutor'])
    const leadership = buildDesignationLanding('leadership', jobs, 'Principal and leadership')
    expect(leadership.groups.map(g => [g.key, g.jobs.map(j => j.title)])).toEqual([
      ['principal', ['Principal JKKN College of Pharmacy', 'Vice Principal']],
      ['group', ['Chief Operations Officer (COO)']],
    ])
    expect(splitSummary(leadership.groups, 'in')).toBe('2 in principal roles and 1 in group leadership roles')
    // A "Vice Principal" HR filed under teaching is leadership, and on no other page.
    const vp = at('Vice Principal', 'JKKN College of Education')
    expect(isLeadership(vp)).toBe(true)
    expect(teachingBucket(vp)).toBeNull()
    expect(nonTeachingBucket(vp)).toBeNull()
    expect(isLabOrLibrary(vp)).toBe(false)
  })

  it('lists every job on exactly one list page, or on none', () => {
    const keys = ['assistant-professor', 'professor', 'lecturer', 'tutor', 'lab-library', 'leadership'] as const
    const titles = ['Assistant Professor', 'Professor', 'Associate Professor', 'Reader', 'Tutor', 'Lab Assistant', 'Librarian',
      'Accountant', 'Primary Teacher', 'Vice Principal', 'Principal', 'Chief Executive Officer', 'Aptitude Trainer']
    for (const roleCategory of ['teaching_faculty', 'non_teaching', 'medical', 'senior_leadership']) {
      for (const title of titles) {
        const j = job(title, { roleCategory })
        const bucket = teachingBucket(j)
        const listedOnTeaching = bucket === 'primary' || bucket === 'high-school' || bucket === 'higher-secondary' || bucket === 'trainers'
        const pages = keys.filter(k => onDesignationPage(k, j)).length + (nonTeachingBucket(j) ? 1 : 0) + (listedOnTeaching ? 1 : 0)
        expect(pages, `${title} / ${roleCategory}`).toBeLessThanOrEqual(1)
      }
    }
  })

  it('emits ItemList for the listed jobs and no JobPosting on the list page', () => {
    const pageUrl = 'https://www.jkkn.ac.in/careers/teaching-jobs'
    const ld = buildLandingJsonLd({
      pageUrl, name: 'Teaching Jobs', description: 'd', crumb: 'Teaching Jobs',
      jobs: [{ title: 'Primary Teacher', url: 'https://www.jkkn.ac.in/careers/primary-teacher-1' }],
    })
    expect(ld.map(x => x['@type'])).toEqual(['CollectionPage', 'ItemList', 'BreadcrumbList'])
    expect(ld[0].mainEntity).toEqual({ '@id': `${pageUrl}#jobs` })
    expect(JSON.stringify(ld)).not.toContain('JobPosting')
    const empty = buildLandingJsonLd({ pageUrl, name: 'Teaching Jobs', description: 'd', crumb: 'Teaching Jobs', jobs: [] })
    expect(empty.map(x => x['@type'])).toEqual(['CollectionPage', 'BreadcrumbList'])
    expect(empty[0].mainEntity).toBeUndefined()
    expect(buildFaqJsonLd([{ question: 'Q', answer: 'A' }])).toMatchObject({
      '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'Q', acceptedAnswer: { '@type': 'Answer', text: 'A' } }],
    })
  })
})
