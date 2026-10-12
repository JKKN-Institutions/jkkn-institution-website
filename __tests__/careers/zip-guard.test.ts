import { describe, expect, it } from 'vitest'
import { zipInflatesWithin } from '@/lib/utils/zip-guard'
import { SMALL_DOCX, makeZip } from './zip-fixture'

const MB = 1024 * 1024

describe('zipInflatesWithin', () => {
  it('accepts an ordinary DOCX-sized zip', () => {
    expect(zipInflatesWithin(SMALL_DOCX, 20 * MB)).toBe(true)
  })

  it('accepts stored (uncompressed) entries within the limit', () => {
    expect(zipInflatesWithin(makeZip([{ name: 'a.xml', content: Buffer.alloc(1000), stored: true }]), 20 * MB)).toBe(true)
  })

  it('refuses a zip bomb: a few KB that inflates past the limit', () => {
    const bomb = makeZip([{ name: 'word/document.xml', content: Buffer.alloc(25 * MB) }])
    expect(bomb.byteLength).toBeLessThan(200 * 1024)
    expect(zipInflatesWithin(bomb, 20 * MB)).toBe(false)
  })

  it('counts every entry towards the limit', () => {
    const many = makeZip([
      { name: 'a.xml', content: Buffer.alloc(12 * MB) },
      { name: 'b.xml', content: Buffer.alloc(12 * MB) },
    ])
    expect(zipInflatesWithin(many, 20 * MB)).toBe(false)
  })

  it('refuses bytes that are not a readable zip', () => {
    expect(zipInflatesWithin(new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1, 2, 3]), 20 * MB)).toBe(false)
    expect(zipInflatesWithin(new Uint8Array(), 20 * MB)).toBe(false)
  })
})
