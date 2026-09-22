import { afterEach, describe, expect, it, vi } from 'vitest'
import { getMyJkknBaseUrl, getPublicJob, isUuid, listPublicJobs } from '@/lib/services/public-careers-api'

const JOB_ID = '11111111-1111-4111-8111-111111111111'
const INST_ID = '22222222-2222-4222-8222-222222222222'
const JOB = {
  id: JOB_ID, job_code: 'JOB-007', title: 'Lab Assistant', role_category: 'non_teaching', job_type: 'full_time',
  description: 'Run the lab.', institution: { id: 'i1', name: 'JKKN College of Pharmacy' }, department: null,
  city: 'Komarapalayam', state: 'Tamil Nadu', country: 'India', education_level: 'bachelors',
  min_experience_years: 1, max_experience_years: 3, qualifications: ['B.Pharm'], skills: [],
  positions_open: 1, posted_at: '2026-09-01T00:00:00Z', closes_at: null, salary: null,
}

function fetchStub(status: number, body: unknown) {
  const calls: string[] = []
  const impl = vi.fn(async (input: RequestInfo | URL) => {
    calls.push(String(input))
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
  }) as unknown as typeof fetch
  return { impl, calls }
}

afterEach(() => {
  delete process.env.NEXT_PUBLIC_MYJKKN_URL
  delete process.env.MYJKKN_INSTITUTION_ID
})

describe('getMyJkknBaseUrl', () => {
  it('defaults and strips a trailing slash', () => {
    expect(getMyJkknBaseUrl()).toBe('https://www.jkkn.ai')
    process.env.NEXT_PUBLIC_MYJKKN_URL = 'http://localhost:4000/'
    expect(getMyJkknBaseUrl()).toBe('http://localhost:4000')
  })
})

describe('isUuid', () => {
  it('validates', () => {
    expect(isUuid(JOB_ID)).toBe(true)
    expect(isUuid('nope')).toBe(false)
  })
})

describe('listPublicJobs', () => {
  it('builds the query string from filters and parses the envelope', async () => {
    const { impl, calls } = fetchStub(200, { data: [JOB], institutions: [{ id: 'i1', name: 'X', open_jobs: 1 }] })
    const res = await listPublicJobs({ q: 'lab', jobType: 'full_time', institutionId: INST_ID }, impl)
    expect(res.data[0].title).toBe('Lab Assistant')
    expect(res.institutions[0].open_jobs).toBe(1)
    const url = new URL(calls[0])
    expect(url.pathname).toBe('/api/public/careers/jobs')
    expect(url.searchParams.get('q')).toBe('lab')
    expect(url.searchParams.get('job_type')).toBe('full_time')
    expect(url.searchParams.get('institution_id')).toBe(INST_ID)
  })
  it('drops unknown job types and blank filters', async () => {
    const { impl, calls } = fetchStub(200, { data: [], institutions: [] })
    await listPublicJobs({ q: '  ', jobType: 'evil', institutionId: '' }, impl)
    expect(new URL(calls[0]).search).toBe('')
  })
  it('throws on a non-2xx response', async () => {
    const { impl } = fetchStub(500, { error: 'boom' })
    await expect(listPublicJobs({}, impl)).rejects.toThrow(/500/)
  })
})

describe('getPublicJob', () => {
  it('returns null for a malformed id without fetching', async () => {
    const { impl } = fetchStub(200, { data: JOB })
    expect(await getPublicJob('x', impl)).toBeNull()
    expect(impl).not.toHaveBeenCalled()
  })
  it('returns null on 404', async () => {
    const { impl } = fetchStub(404, { error: 'Job not found.' })
    expect(await getPublicJob(JOB_ID, impl)).toBeNull()
  })
  it('returns the parsed job on 200', async () => {
    const { impl } = fetchStub(200, { data: JOB })
    expect((await getPublicJob(JOB_ID, impl))?.job_code).toBe('JOB-007')
  })
})
