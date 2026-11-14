import { describe, expect, it, vi } from 'vitest'
import {
  buildApplyFormData, MAX_RESUME_BYTES, resumeClientError, submitApplication,
} from '@/lib/services/public-careers-apply'

const PDF = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46])], 'cv.pdf', { type: 'application/pdf' })
const VALUES = {
  first_name: 'Priya', last_name: 'R', email: 'priya@example.com', phone: '9876543210',
  qualification: 'M.Pharm', experience_months: 24, consent: true, resume: PDF,
  current_job_title: '', worked_cities: 'Salem, Erode', utm_source: 'jkkn.ac.in',
}

function fetchStub(status: number, body: unknown) {
  const seen: { url: string; init?: RequestInit }[] = []
  const impl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    seen.push({ url: String(input), init })
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
  }) as unknown as typeof fetch
  return { impl, seen }
}

describe('resumeClientError', () => {
  it('accepts pdf/doc/docx under 2 MB', () => {
    expect(resumeClientError(PDF)).toBeNull()
    expect(resumeClientError(new File(['x'], 'cv.DOCX'))).toBeNull()
  })
  it('rejects missing, oversize and wrong extensions', () => {
    expect(resumeClientError(null)).toMatch(/attach/i)
    expect(resumeClientError(new File([new Uint8Array(MAX_RESUME_BYTES + 1)], 'cv.pdf'))).toMatch(/2 MB/)
    expect(resumeClientError(new File(['x'], 'cv.exe'))).toMatch(/PDF, DOC or DOCX/)
  })
})

describe('buildApplyFormData', () => {
  it('uses the exact API field names and stringifies consent/numbers', () => {
    const fd = buildApplyFormData(VALUES)
    expect(fd.get('first_name')).toBe('Priya')
    expect(fd.get('experience_months')).toBe('24')
    expect(fd.get('consent')).toBe('true')
    expect(fd.get('worked_cities')).toBe('Salem, Erode')
    expect(fd.get('utm_source')).toBe('jkkn.ac.in')
    expect((fd.get('resume') as File).name).toBe('cv.pdf')
    expect(fd.get('website')).toBe('')          // honeypot always present, always empty
    expect(fd.has('current_job_title')).toBe(false) // blanks are omitted
  })
})

describe('submitApplication', () => {
  const JOB = '11111111-1111-4111-8111-111111111111'

  it('posts multipart without a manual Content-Type and returns the reference', async () => {
    const { impl, seen } = fetchStub(201, { reference: 'JOB-007-AB12CD34' })
    const r = await submitApplication('https://my.example', JOB, buildApplyFormData(VALUES), impl)
    expect(r).toEqual({ ok: true, reference: 'JOB-007-AB12CD34' })
    expect(seen[0].url).toBe(`https://my.example/api/public/careers/jobs/${JOB}/apply`)
    expect(seen[0].init?.method).toBe('POST')
    expect(seen[0].init?.body).toBeInstanceOf(FormData)
    expect(seen[0].init?.headers).toBeUndefined()
  })

  it.each([
    [400, { error: 'Fix fields', fields: { email: 'Enter a valid email address.' } }, 'validation'],
    [403, { error: 'Origin not allowed.' }, 'origin'],
    [404, { error: 'Closed' }, 'not_found'],
    [409, { error: 'Already applied' }, 'duplicate'],
    [429, { error: 'Slow down' }, 'rate_limited'],
    [503, { error: 'Down' }, 'unavailable'],
    [500, { error: 'Oops' }, 'error'],
  ])('maps %s to %s', async (status, body, kind) => {
    const { impl } = fetchStub(status, body)
    const r = await submitApplication('https://my.example', JOB, new FormData(), impl)
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.kind).toBe(kind)
    expect(r.message).toBe((body as { error: string }).error)
    if (status === 400) expect(r.fields.email).toMatch(/valid email/)
  })

  it('maps a network failure to error without throwing', async () => {
    const impl = vi.fn(async () => { throw new TypeError('Failed to fetch') }) as unknown as typeof fetch
    const r = await submitApplication('https://my.example', JOB, new FormData(), impl)
    expect(r).toMatchObject({ ok: false, kind: 'error' })
  })
})

// ── Work history, education and skills (Director, 14 Nov 2026) ──────────────
// Ships OFF: the form sends resume_lists only once MyJKKN's resume-read has
// said the feature is on. With it absent the request must be exactly what it
// was before this existed, or every applicant on every one of the six sites is
// affected by a feature nobody has switched on.

describe('buildApplyFormData — the three lists', () => {
  const KEYS_WITHOUT_LISTS = [
    'first_name', 'last_name', 'email', 'phone', 'qualification', 'experience_months',
    'worked_cities', 'utm_source', 'consent', 'website', 'resume',
  ]

  it('sends no list field at all when MyJKKN has the switch off', () => {
    const fd = buildApplyFormData(VALUES)
    expect([...fd.keys()].sort()).toEqual([...KEYS_WITHOUT_LISTS].sort())
    expect(fd.get('work_history')).toBeNull()
    expect(fd.get('education')).toBeNull()
    expect(fd.get('skills')).toBeNull()
  })

  it('sends nothing extra when the switch is on but the applicant left all three empty', () => {
    const fd = buildApplyFormData({
      ...VALUES,
      resume_lists: { work_history: [], education: [], skills: '' },
    })
    expect([...fd.keys()].sort()).toEqual([...KEYS_WITHOUT_LISTS].sort())
  })

  it('sends the lists in the shape MyJKKN parses: JSON arrays, skills as a line', () => {
    const fd = buildApplyFormData({
      ...VALUES,
      resume_lists: {
        work_history: [{ employer: 'ABC College', role: 'Assistant Professor', from: '2019-06', to: 'present' }],
        education: [{ degree: 'M.Pharm', subject: 'Pharmaceutics', institution: 'JKKN', year: '2021' }],
        skills: 'HPLC, Teaching',
      },
    })
    expect(JSON.parse(String(fd.get('work_history')))).toEqual([
      { employer: 'ABC College', role: 'Assistant Professor', from: '2019-06', to: 'present' },
    ])
    expect(JSON.parse(String(fd.get('education')))).toEqual([
      { degree: 'M.Pharm', subject: 'Pharmaceutics', institution: 'JKKN', year: '2021' },
    ])
    expect(fd.get('skills')).toBe('HPLC, Teaching')
    // The rest of the application is untouched.
    expect(fd.get('first_name')).toBe('Priya')
    expect(fd.get('consent')).toBe('true')
  })

  it('sends only the lists that have something in them', () => {
    const fd = buildApplyFormData({
      ...VALUES,
      resume_lists: { work_history: [], education: [], skills: 'HPLC' },
    })
    expect(fd.get('skills')).toBe('HPLC')
    expect(fd.get('work_history')).toBeNull()
    expect(fd.get('education')).toBeNull()
  })
})
