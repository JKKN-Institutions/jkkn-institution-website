import { describe, expect, it } from 'vitest'
import { AUTOFILL_FIELDS, applyFormSchema } from '@/lib/schemas/careers-apply-form'

const VALID = {
  first_name: 'Priya', last_name: 'R', email: 'priya@example.com', phone: '+91 98765 43210',
  qualification: 'M.Pharm', experience_months: '24', current_job_title: '', current_company: '',
  current_job_duration_months: '', worked_cities: '', consent: true, website: '',
}

describe('applyFormSchema', () => {
  it('accepts a complete application', () => {
    expect(applyFormSchema.safeParse(VALID).success).toBe(true)
  })

  it.each([
    ['phone', '12345'],
    ['email', 'not-an-email'],
    ['experience_months', '721'],
    ['experience_months', '2.5'],
    ['current_job_duration_months', 'x'],
    ['website', 'spam'],
  ])('rejects %s = %j', (field, value) => {
    expect(applyFormSchema.safeParse({ ...VALID, [field]: value }).success).toBe(false)
  })

  it('lists every typed field as auto-fillable, and nothing else', () => {
    for (const f of AUTOFILL_FIELDS) expect(applyFormSchema.shape[f]).toBeDefined()
    expect(AUTOFILL_FIELDS).toHaveLength(10)
    expect(AUTOFILL_FIELDS).not.toContain('consent')
    expect(AUTOFILL_FIELDS).not.toContain('website')
  })
})
