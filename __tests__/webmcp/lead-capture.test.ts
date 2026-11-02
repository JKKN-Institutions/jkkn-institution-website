import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// 2026-11-02: the WebMCP request_callback tool wrote admission leads into this site's own
// admission_inquiries table, which the jkkn.ai CRM never reads. It is removed; a student who wants
// a call back gets the CRM enquiry link (start_application), tagged like every other apply link.

vi.mock('@/app/actions/webmcp-leads', () => ({
  submitWebMCPNewsletterSubscription: vi.fn(async () => ({ success: true, message: 'ok' })),
}))

type Tool = { name: string; execute: (input: unknown) => Promise<string> }

const tools: Tool[] = []

function stubWindow(pathname: string, search = '') {
  const store = new Map<string, string>()
  vi.stubGlobal('window', {
    location: { pathname, search },
    sessionStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    },
  })
}

async function registered(): Promise<Map<string, Tool>> {
  const { registerLeadCaptureTools } = await import('@/lib/webmcp/tools/lead-capture')
  registerLeadCaptureTools()
  return new Map(tools.map((t) => [t.name, t]))
}

beforeEach(() => {
  tools.length = 0
  vi.stubEnv('NEXT_PUBLIC_INSTITUTION_ID', 'main')
  vi.stubGlobal('navigator', { modelContext: { registerTool: (t: Tool) => void tools.push(t) } })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('WebMCP lead capture tools', () => {
  it('registers no request_callback tool', async () => {
    const byName = await registered()
    expect([...byName.keys()].sort()).toEqual(['start_application', 'subscribe_newsletter'])
  })

  it('start_application gives the CRM enquiry link tagged with this site and page', async () => {
    stubWindow('/admissions/')
    const start = (await registered()).get('start_application')!
    const out = JSON.parse(await start.execute({ course: 'B.E. CSE' }))
    const url = new URL(out.application_url)
    expect(`${url.origin}${url.pathname}`).toBe('https://www.jkkn.ai/apply/jkkn-admission-2026')
    expect(url.searchParams.get('utm_source')).toBe('www.jkkn.ac.in')
    expect(url.searchParams.get('utm_campaign')).toBe('main-webmcp-admissions')
    expect(url.searchParams.get('utm_medium')).toBeNull()
    expect(url.searchParams.get('course')).toBe('B.E. CSE')
    // No timed call-back promise the CRM follow-up data does not support.
    expect(out.instructions).not.toMatch(/\d+\s*hours/i)
  })

  it("start_application keeps an ad visitor's own campaign tags", async () => {
    stubWindow('/', '?utm_source=facebook&utm_medium=paid&utm_campaign=nov-dental')
    const start = (await registered()).get('start_application')!
    const url = new URL(JSON.parse(await start.execute({})).application_url)
    expect(url.searchParams.get('utm_source')).toBe('facebook')
    expect(url.searchParams.get('utm_medium')).toBe('paid')
    expect(url.searchParams.get('utm_campaign')).toBe('nov-dental')
  })

  it('the API route refuses request_callback, so nothing is written for it', async () => {
    const { POST } = await import('@/app/api/webmcp/route')
    const req = new Request('http://localhost/api/webmcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'request_callback', data: { name: 'Test', phone: '9876543210' } }),
    })
    const res = await POST(req as never)
    expect(res.status).toBe(400)
  })

  it('the API route still serves the newsletter', async () => {
    const { POST } = await import('@/app/api/webmcp/route')
    const req = new Request('http://localhost/api/webmcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'subscribe_newsletter', data: { email: 'test@example.com' } }),
    })
    const res = await POST(req as never)
    expect(res.status).toBe(200)
    expect((await res.json()).success).toBe(true)
  })
})
