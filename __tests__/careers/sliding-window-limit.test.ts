import { describe, expect, it } from 'vitest'
import { createRateLimiter } from '@/lib/utils/sliding-window-limit'

describe('createRateLimiter', () => {
  it('allows `limit` hits per key per window, then refuses until the oldest expires', () => {
    const allow = createRateLimiter(2, 1000)
    expect(allow('a', 0)).toBe(true)
    expect(allow('a', 10)).toBe(true)
    expect(allow('a', 20)).toBe(false)
    expect(allow('b', 20)).toBe(true) // keys are independent
    expect(allow('a', 1001)).toBe(true) // the hit at 0 has expired
    expect(allow('a', 1002)).toBe(false)
  })
})
