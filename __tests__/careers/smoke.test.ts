import { describe, expect, it } from 'vitest'

describe('vitest wiring', () => {
  it('resolves the @ alias and runs', async () => {
    const mod = await import('@/lib/utils')
    expect(typeof mod.cn).toBe('function')
  })
})
