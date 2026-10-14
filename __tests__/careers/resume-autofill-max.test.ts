import { describe, expect, it, vi } from 'vitest'
import { maxResultToValues, readResumeViaMax, type MaxResumeFill } from '@/lib/services/resume-autofill-max'

const BASE = 'https://www.jkkn.ai/'
const FILE = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])], 'cv.pdf', { type: 'application/pdf' })
const QUICK = { email: 'priya@example.com', phone: '9876543210' }
const FILL: MaxResumeFill = {
  first_name: 'Priya', last_name: 'R', qualification: 'M.Pharm', experience_months: 42,
  current_job_title: 'Assistant Professor', current_company: 'ABC College of Pharmacy',
  current_job_duration_months: 18, worked_cities: ['Salem', 'Chennai'],
}

const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status })

/** A fake MyJKKN: the POST reply, then one reply per poll. */
function fakeMyJkkn(post: Response, polls: Array<Response | Error>) {
  const calls: string[] = []
  const fetchImpl = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    calls.push(`${init?.method ?? 'GET'} ${String(url)}`)
    if (init?.method === 'POST') return post
    const next = polls.shift()
    if (!next) throw new Error('no more polls scripted')
    if (next instanceof Error) throw next
    return next
  }) as unknown as typeof fetch
  let t = 0
  return {
    calls,
    opts: { baseUrl: BASE, fetchImpl, now: () => t, sleep: async (ms: number) => { t += ms } },
  }
}

describe('maxResultToValues', () => {
  it('maps MyJKKN keys onto the form and applies its rules', () => {
    const r = maxResultToValues(QUICK, FILL)
    expect(r).toMatchObject({ ok: true })
    if (!r?.ok) throw new Error('expected ok')
    expect(r.values).toMatchObject({
      first_name: 'Priya', email: 'priya@example.com', phone: '9876543210',
      qualification: 'M.Pharm', experience_months: '42', worked_cities: 'Salem, Chennai',
    })
  })

  it('is null when nothing usable came back', () => {
    expect(maxResultToValues(null, null)).toBeNull()
  })
})

describe('readResumeViaMax', () => {
  it('posts to MyJKKN, reports email/phone early, then returns the full fill', async () => {
    const { calls, opts } = fakeMyJkkn(
      reply(202, { status: 'pending', job_id: 'job-1', token: 'tok', quick: QUICK }),
      [reply(202, { status: 'pending' }), reply(200, { status: 'done', fill: FILL })],
    )
    const onQuick = vi.fn()
    const r = await readResumeViaMax(FILE, { ...opts, onQuick })

    expect(calls[0]).toBe('POST https://www.jkkn.ai/api/public/careers/resume-read')
    expect(calls[1]).toBe('GET https://www.jkkn.ai/api/public/careers/resume-read?job=job-1&t=tok')
    expect(onQuick).toHaveBeenCalledTimes(1)
    expect(onQuick.mock.calls[0][0].filled).toEqual(['email', 'phone'])
    expect(r.ok && r.filled.length).toBe(10)
  })

  it('keeps email/phone when MyJKKN cannot read the text (scan)', async () => {
    const { opts } = fakeMyJkkn(reply(200, { status: 'manual', reason: 'no_text', quick: QUICK }), [])
    const r = await readResumeViaMax(FILE, opts)
    expect(r).toMatchObject({ ok: true, filled: ['email', 'phone'] })
  })

  it('maps a scan with nothing to read to unreadable', async () => {
    const { opts } = fakeMyJkkn(reply(200, { status: 'manual', reason: 'no_text', quick: { email: null, phone: null } }), [])
    expect(await readResumeViaMax(FILE, opts)).toEqual({ ok: false, reason: 'unreadable' })
  })

  it('maps MyJKKN file errors to the panel reasons', async () => {
    expect(await readResumeViaMax(FILE, fakeMyJkkn(reply(413, {}), []).opts)).toEqual({ ok: false, reason: 'too_large' })
    expect(await readResumeViaMax(FILE, fakeMyJkkn(reply(400, {}), []).opts)).toEqual({ ok: false, reason: 'unsupported_type' })
    expect(await readResumeViaMax(FILE, fakeMyJkkn(reply(403, {}), []).opts)).toEqual({ ok: false, reason: 'unavailable' })
  })

  it('gives up at the deadline, keeping email/phone', async () => {
    const polls = Array.from({ length: 40 }, () => reply(202, { status: 'pending' }))
    const { opts } = fakeMyJkkn(reply(202, { status: 'pending', job_id: 'j', token: 't', quick: QUICK }), polls)
    const r = await readResumeViaMax(FILE, { ...opts, deadlineMs: 60_000 })
    expect(r).toMatchObject({ ok: true, filled: ['email', 'phone'] })
  })

  it('survives a dropped poll', async () => {
    const { opts } = fakeMyJkkn(
      reply(202, { status: 'pending', job_id: 'j', token: 't', quick: null }),
      [new Error('offline'), reply(200, { status: 'done', fill: FILL })],
    )
    const r = await readResumeViaMax(FILE, opts)
    expect(r.ok).toBe(true)
  })

  it('reports a failed AI job as unreadable', async () => {
    const { opts } = fakeMyJkkn(
      reply(202, { status: 'pending', job_id: 'j', token: 't', quick: null }),
      [reply(200, { status: 'manual', reason: 'model_error' })],
    )
    expect(await readResumeViaMax(FILE, opts)).toEqual({ ok: false, reason: 'unreadable' })
  })

  it('stops polling when the candidate moves on', async () => {
    const { calls, opts } = fakeMyJkkn(reply(202, { status: 'pending', job_id: 'j', token: 't', quick: null }), [])
    await readResumeViaMax(FILE, { ...opts, isCurrent: () => false })
    expect(calls).toHaveLength(1)
  })
})
