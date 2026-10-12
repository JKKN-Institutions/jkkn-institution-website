import Anthropic from '@anthropic-ai/sdk'
import { describe, expect, it, vi } from 'vitest'
import type { ResumeExtraction } from '@/lib/schemas/resume-extraction'
import { MAX_RESUME_BYTES } from '@/lib/services/public-careers-apply'
import { RESUME_MODEL, handleResumeAutofill, readResume } from '@/lib/services/resume-autofill'
import { SMALL_DOCX, makeZip } from './zip-fixture'

const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37])
const DOCX = SMALL_DOCX
const DOC = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1])
const NOW = () => new Date('2026-10-12T04:00:00Z')

const EXTRACTION: ResumeExtraction = {
  first_name: 'Priya', last_name: 'R', email: 'priya@example.com', phone: '9876543210',
  highest_qualification: 'M.Pharm', total_experience_months: 24, current_job_title: null,
  current_company: null, current_job_duration_months: null, worked_cities: [],
}

type ParseParams = {
  model: string
  max_tokens: number
  fallbacks: unknown
  betas: string[]
  output_config: { effort: string }
  messages: Array<{ role: string; content: Array<Record<string, unknown>> }>
}
type ParseOptions = { signal?: AbortSignal }

function fakeClient(impl: () => unknown) {
  const parse = vi.fn(async (_params: ParseParams, _options: ParseOptions) => impl())
  return { client: { beta: { messages: { parse } } } as unknown as Anthropic, parse }
}
const reply = (parsed: ResumeExtraction | null, stop_reason = 'end_turn') => ({ parsed_output: parsed, stop_reason })

describe('readResume', () => {
  it('sends a PDF as a document block, with today\'s date and the agreed settings', async () => {
    const { client, parse } = fakeClient(() => reply(EXTRACTION))
    const result = await readResume(PDF, { client, now: NOW })

    expect(result).toEqual({
      ok: true,
      values: {
        first_name: 'Priya', last_name: 'R', email: 'priya@example.com', phone: '9876543210',
        qualification: 'M.Pharm', experience_months: '24',
      },
      filled: ['first_name', 'last_name', 'email', 'phone', 'qualification', 'experience_months'],
    })
    const [params, options] = parse.mock.calls[0]
    expect(params.model).toBe(RESUME_MODEL)
    expect(params.max_tokens).toBe(16000) // thinking shares this budget; 4096 could cut the JSON
    expect(RESUME_MODEL).toBe('claude-opus-5-5')
    expect(params.output_config.effort).toBe('low')
    expect(params.fallbacks).toBe('default')
    expect(params.betas).toEqual(['server-side-fallback-2026-07-01'])
    expect(params.messages[0].content[0]).toEqual({
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: Buffer.from(PDF).toString('base64') },
    })
    expect(params.messages[0].content[1].text).toContain('2026-10-12')
    expect(options.signal).toBeInstanceOf(AbortSignal)
  })

  it('sends DOCX as text', async () => {
    const { client, parse } = fakeClient(() => reply(EXTRACTION))
    await readResume(DOCX, { client, now: NOW, docxToText: async () => 'Priya R\npriya@example.com' })
    const text = parse.mock.calls[0][0].messages[0].content[0]
    expect(text.type).toBe('text')
    expect(String(text.text)).toContain('priya@example.com')
  })

  it('does not call Claude for .doc, empty DOCX text or a DOCX that will not open', async () => {
    const { client, parse } = fakeClient(() => reply(EXTRACTION))
    expect(await readResume(DOC, { client })).toEqual({ ok: false, reason: 'unsupported_type' })
    expect(await readResume(DOCX, { client, docxToText: async () => '   ' })).toEqual({ ok: false, reason: 'unreadable' })
    expect(await readResume(DOCX, { client, docxToText: async () => { throw new Error('not a docx') } }))
      .toEqual({ ok: false, reason: 'unreadable' })
    expect(await readResume(DOCX, { client, docxToText: async () => 'x'.repeat(100_001) }))
      .toEqual({ ok: false, reason: 'unreadable' })
    expect(parse).not.toHaveBeenCalled()
  })

  it('treats a refusal, an empty answer or nothing usable as unreadable', async () => {
    for (const answer of [reply(EXTRACTION, 'refusal'), reply(null), reply({ ...EXTRACTION, first_name: null, last_name: null, email: null, phone: null, highest_qualification: null, total_experience_months: null })]) {
      const { client } = fakeClient(() => answer)
      expect(await readResume(PDF, { client, now: NOW })).toEqual({ ok: false, reason: 'unreadable' })
    }
  })

  it('reports an encrypted or corrupt PDF (400) as unreadable, not as an outage', async () => {
    const { client } = fakeClient(() => {
      throw new Anthropic.BadRequestError(400, undefined, 'The PDF could not be processed', new Headers())
    })
    expect(await readResume(PDF, { client, now: NOW })).toEqual({ ok: false, reason: 'unreadable' })
  })

  it('reports a 400 that is not about the file (configuration) as unavailable', async () => {
    const { client } = fakeClient(() => {
      throw new Anthropic.BadRequestError(400, undefined, 'fallbacks: not enabled for this organization', new Headers())
    })
    expect(await readResume(PDF, { client, now: NOW })).toEqual({ ok: false, reason: 'unavailable' })
  })

  it('refuses a DOCX that inflates past the limit (zip bomb) before extracting text', async () => {
    const { client, parse } = fakeClient(() => reply(EXTRACTION))
    const docxToText = vi.fn(async () => 'Priya R')
    const bomb = makeZip([{ name: 'word/document.xml', content: Buffer.alloc(25 * 1024 * 1024) }])
    expect(await readResume(bomb, { client, docxToText })).toEqual({ ok: false, reason: 'unreadable' })
    expect(docxToText).not.toHaveBeenCalled()
    expect(parse).not.toHaveBeenCalled()
  })

  it('refuses a PDF longer than 20 pages without calling Claude', async () => {
    const { client, parse } = fakeClient(() => reply(EXTRACTION))
    const long = new TextEncoder().encode('%PDF-1.7\n<</Type /Pages /Count 120>>\n%%EOF')
    expect(await readResume(long, { client, now: NOW })).toEqual({ ok: false, reason: 'unreadable' })
    expect(parse).not.toHaveBeenCalled()
  })

  it('reports timeouts and service errors as unavailable', async () => {
    const { client } = fakeClient(() => { throw new Anthropic.APIConnectionTimeoutError() })
    expect(await readResume(PDF, { client, now: NOW })).toEqual({ ok: false, reason: 'unavailable' })
  })
})

describe('handleResumeAutofill', () => {
  // Uint8Array<ArrayBuffer>: TS 5.9 only accepts ArrayBuffer-backed arrays as BlobParts.
  const file = (data: Uint8Array<ArrayBuffer>, name = 'cv.pdf') => new File([data], name)

  it('does nothing when auto-fill is off', async () => {
    const { client, parse } = fakeClient(() => reply(EXTRACTION))
    expect(await handleResumeAutofill(file(PDF), '1.2.3.4', { enabled: false, client }))
      .toEqual({ ok: false, reason: 'unavailable' })
    expect(parse).not.toHaveBeenCalled()
  })

  it('rejects a missing, empty or oversize file without using a rate-limit slot', async () => {
    const allow = vi.fn(() => true)
    expect(await handleResumeAutofill(null, 'ip', { enabled: true, allow })).toEqual({ ok: false, reason: 'unsupported_type' })
    expect(await handleResumeAutofill('text', 'ip', { enabled: true, allow })).toEqual({ ok: false, reason: 'unsupported_type' })
    expect(await handleResumeAutofill(file(new Uint8Array()), 'ip', { enabled: true, allow }))
      .toEqual({ ok: false, reason: 'unsupported_type' })
    expect(await handleResumeAutofill(file(new Uint8Array(MAX_RESUME_BYTES + 1)), 'ip', { enabled: true, allow }))
      .toEqual({ ok: false, reason: 'too_large' })
    expect(allow).not.toHaveBeenCalled()
  })

  it('refuses a file type it cannot read without using a rate-limit slot', async () => {
    const allow = vi.fn(() => true)
    expect(await handleResumeAutofill(file(DOC, 'cv.doc'), 'ip', { enabled: true, allow }))
      .toEqual({ ok: false, reason: 'unsupported_type' })
    expect(allow).not.toHaveBeenCalled()
  })

  it('stops at the rate limit before calling Claude', async () => {
    const { client, parse } = fakeClient(() => reply(EXTRACTION))
    expect(await handleResumeAutofill(file(PDF), 'ip', { enabled: true, allow: () => false, client }))
      .toEqual({ ok: false, reason: 'rate_limited' })
    expect(parse).not.toHaveBeenCalled()
  })

  it('judges a renamed file by its bytes', async () => {
    const { client } = fakeClient(() => reply(EXTRACTION))
    expect(await handleResumeAutofill(file(DOC, 'cv.docx'), 'ip', { enabled: true, allow: () => true, client }))
      .toEqual({ ok: false, reason: 'unsupported_type' })
    const docxAsPdf = await handleResumeAutofill(file(DOCX, 'cv.pdf'), 'ip', {
      enabled: true, allow: () => true, client, now: NOW, docxToText: async () => 'Priya R',
    })
    expect(docxAsPdf.ok).toBe(true)
  })

  it('reads an allowed file', async () => {
    const { client } = fakeClient(() => reply(EXTRACTION))
    const result = await handleResumeAutofill(file(PDF), 'ip', { enabled: true, allow: () => true, client, now: NOW })
    expect(result.ok).toBe(true)
  })
})
