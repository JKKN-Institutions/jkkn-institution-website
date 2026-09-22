import { describe, expect, it } from 'vitest'
import { looksLikeHtml, sanitizeJobHtml } from '@/lib/utils/careers-html'

describe('looksLikeHtml', () => {
  it('detects editor markup and ignores plain text', () => {
    expect(looksLikeHtml('<p>Hi</p>')).toBe(true)
    expect(looksLikeHtml('Plain text\nwith lines')).toBe(false)
    expect(looksLikeHtml('a < b and b > c')).toBe(false)
  })
})

describe('sanitizeJobHtml', () => {
  it('keeps the editor formatting tags', () => {
    const out = sanitizeJobHtml('<p>Intro <strong>bold</strong> <em>em</em></p><ul><li><p>one</p></li></ul><h3>Head</h3><br>')
    expect(out).toContain('<strong>bold</strong>')
    expect(out).toContain('<ul><li><p>one</p></li></ul>')
    expect(out).toContain('<h3>Head</h3>')
  })
  it('strips scripts, event handlers and unknown tags', () => {
    const out = sanitizeJobHtml('<p onclick="x()">ok</p><script>alert(1)</script><img src=x onerror=alert(1)><iframe src="https://evil"></iframe>')
    expect(out).toBe('<p>ok</p>')
  })
  it('keeps safe links and hardens them', () => {
    const out = sanitizeJobHtml('<a href="https://jkkn.ac.in/x" onclick="y()">site</a><a href="javascript:alert(1)">bad</a>')
    expect(out).toContain('href="https://jkkn.ac.in/x"')
    expect(out).toContain('rel="noopener noreferrer"')
    expect(out).not.toContain('javascript:')
    expect(out).not.toContain('onclick')
  })
})
