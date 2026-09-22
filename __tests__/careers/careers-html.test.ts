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
    expect(out).toContain('<br>')
  })

  it('passes a real MyJKKN description through intact', () => {
    const real = '<p><strong>About the Institution:</strong></p><p></p><p>JKKN Educational Institutions is a group.</p><ul><li><p>Monitor live CCTV feeds.</p></li><li><p>Report suspicious activity.</p></li></ul>'
    expect(sanitizeJobHtml(real)).toBe(real)
  })

  it('strips scripts, event handlers and unknown tags', () => {
    const out = sanitizeJobHtml('<p onclick="x()">ok</p><script>alert(1)</script><img src=x onerror=alert(1)><iframe src="https://evil"></iframe>')
    expect(out).toBe('<p>ok</p>')
  })

  it('drops every attribute, even on allowed tags', () => {
    expect(sanitizeJobHtml('<p style="color:red" class="x" data-y="1">t</p>')).toBe('<p>t</p>')
    expect(sanitizeJobHtml('<strong onmouseover="alert(1)">b</strong>')).toBe('<strong>b</strong>')
  })

  it('keeps safe links and hardens them', () => {
    const out = sanitizeJobHtml('<a href="https://jkkn.ac.in/x" onclick="y()">site</a><a href="javascript:alert(1)">bad</a>')
    expect(out).toContain('href="https://jkkn.ac.in/x"')
    expect(out).toContain('rel="noopener noreferrer"')
    expect(out).not.toContain('javascript:')
    expect(out).not.toContain('onclick')
    expect(sanitizeJobHtml("<a href='mailto:hr@jkkn.ac.in'>mail</a>")).toBe('<a href="mailto:hr@jkkn.ac.in" rel="noopener noreferrer" target="_blank">mail</a>')
  })

  it('neutralises comments, stray angle brackets and attribute injection', () => {
    expect(sanitizeJobHtml('<p>a</p><!-- <script>x</script> --><p>b</p>')).toBe('<p>a</p><p>b</p>')
    expect(sanitizeJobHtml('<p>1 &lt; 2</p> and 3 < 4')).toBe('<p>1 &lt; 2</p> and 3 &lt; 4')
    expect(sanitizeJobHtml('<a href="https://x/?q=1&r=2" title="a>b">t</a>')).toContain('href="https://x/?q=1&amp;r=2"')
    expect(sanitizeJobHtml('<p <script>alert(1)</script>x</p>')).not.toContain('<script')
  })
})
