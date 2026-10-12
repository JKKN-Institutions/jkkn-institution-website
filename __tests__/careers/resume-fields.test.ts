import { describe, expect, it } from 'vitest'
import type { ResumeExtraction } from '@/lib/schemas/resume-extraction'
import { autofillWrites, detectResumeKind, normalizeResumeFields, pdfPageCount } from '@/lib/utils/resume-fields'

const EMPTY: ResumeExtraction = {
  first_name: null, last_name: null, email: null, phone: null, highest_qualification: null,
  total_experience_months: null, current_job_title: null, current_company: null,
  current_job_duration_months: null, worked_cities: [],
}
const bytes = (...b: number[]) => new Uint8Array([...b, 0, 0, 0])

describe('detectResumeKind', () => {
  it('reads PDF and DOCX by their bytes, whatever the file is called', () => {
    expect(detectResumeKind(bytes(0x25, 0x50, 0x44, 0x46, 0x2d))).toBe('pdf')
    expect(detectResumeKind(bytes(0x50, 0x4b, 0x03, 0x04))).toBe('docx')
  })
  it('refuses legacy .doc, images and empty files', () => {
    expect(detectResumeKind(bytes(0xd0, 0xcf, 0x11, 0xe0))).toBeNull()
    expect(detectResumeKind(bytes(0x89, 0x50, 0x4e, 0x47))).toBeNull()
    expect(detectResumeKind(new Uint8Array())).toBeNull()
  })
})

describe('normalizeResumeFields', () => {
  it('maps a full extraction onto the form fields', () => {
    const r = normalizeResumeFields({
      first_name: ' Priya ', last_name: 'R', email: 'priya@example.com', phone: '+91-98765 43210',
      highest_qualification: 'M.E.  Computer Science', total_experience_months: 30.4,
      current_job_title: 'Assistant Professor', current_company: 'ABC College',
      current_job_duration_months: 14, worked_cities: ['Salem', 'Erode'],
    })
    expect(r.values).toEqual({
      first_name: 'Priya', last_name: 'R', email: 'priya@example.com', phone: '+91-98765 43210',
      qualification: 'M.E. Computer Science', experience_months: '30',
      current_job_title: 'Assistant Professor', current_company: 'ABC College',
      current_job_duration_months: '14', worked_cities: 'Salem, Erode',
    })
    expect(r.filled).toHaveLength(10)
  })

  it('drops values that break the form rules instead of repairing them', () => {
    const r = normalizeResumeFields({
      ...EMPTY,
      email: 'priya at example',
      phone: '98765 43210 / 91234 56789', // two numbers: never merged
      total_experience_months: 800,
      current_job_duration_months: -3,
      first_name: 'x'.repeat(101),
    })
    expect(r).toEqual({ values: {}, filled: [] })
  })

  it('keeps a one-word name as the first name only', () => {
    expect(normalizeResumeFields({ ...EMPTY, first_name: 'Priya' }))
      .toEqual({ values: { first_name: 'Priya' }, filled: ['first_name'] })
  })

  it('keeps zero experience for freshers', () => {
    expect(normalizeResumeFields({ ...EMPTY, total_experience_months: 0 }).values)
      .toEqual({ experience_months: '0' })
  })

  it('de-duplicates cities and cuts at the last whole city that fits', () => {
    expect(normalizeResumeFields({ ...EMPTY, worked_cities: ['Salem', 'salem ', ' Erode', ''] }).values.worked_cities)
      .toBe('Salem, Erode')
    const many = Array.from({ length: 200 }, (_, i) => `City${String(i).padStart(3, '0')}`)
    const joined = normalizeResumeFields({ ...EMPTY, worked_cities: many }).values.worked_cities as string
    expect(joined.length).toBeLessThanOrEqual(1000)
    expect(joined.split(', ').every(c => /^City\d{3}$/.test(c))).toBe(true)
  })
})

describe('autofillWrites', () => {
  const incoming = { first_name: 'Priya', email: 'priya@example.com', phone: '9876543210' }

  it('fills empty fields', () => {
    expect(autofillWrites({}, new Set(), incoming)).toEqual(incoming)
  })
  it('never overwrites what the candidate typed, even while the resume was being read', () => {
    expect(autofillWrites({ first_name: 'Priyanka', email: '  ' }, new Set(), incoming))
      .toEqual({ email: 'priya@example.com', phone: '9876543210' })
  })
  it('replaces values from an earlier resume that the candidate did not edit', () => {
    expect(autofillWrites({ first_name: 'Old', email: 'old@example.com' }, new Set(['first_name'] as const), incoming))
      .toEqual({ first_name: 'Priya', phone: '9876543210' })
  })
})

describe('pdfPageCount', () => {
  const pdf = (body: string) => new TextEncoder().encode(`%PDF-1.4
${body}
%%EOF`)
  it('counts page objects, not the page tree', () => {
    expect(pdfPageCount(pdf('<</Type /Pages /Kids [3 0 R 4 0 R] /Count 2>> <</Type /Page>> <</Type/Page /Parent 2 0 R>>'))).toBe(2)
  })
  it('trusts a larger /Count when page objects are hidden in object streams', () => {
    expect(pdfPageCount(pdf('<</Type /Pages /Count 48>> <</Type /ObjStm /N 60>>'))).toBe(48)
  })
  it('returns 0 when the bytes say nothing about pages', () => {
    expect(pdfPageCount(pdf('<</Type /ObjStm>>'))).toBe(0)
  })
})
