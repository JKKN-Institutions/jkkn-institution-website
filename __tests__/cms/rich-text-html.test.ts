import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { sanitizeRichTextHtml } from '@/lib/utils/rich-text-html'

describe('sanitizeRichTextHtml', () => {
  it('passes real CMS course-page markup through unchanged', () => {
    const title = '<p style="text-align: left;"><span style="color: rgb(22, 101, 52);">JKKN College of Pharmacy</span></p>'
    const body = '<p style="text-align: left;"><span style="font-size: 16px;">At </span><span style="font-size: 16px;">JKKN </span></p>'
    expect(sanitizeRichTextHtml(title)).toBe(title)
    expect(sanitizeRichTextHtml(body)).toBe(body)
  })

  it('leaves plain text alone', () => {
    const text = 'JKKN College of Education is a premier institution, Established in 2016.'
    expect(sanitizeRichTextHtml(text)).toBe(text)
  })

  it('keeps the formatting the editor can emit', () => {
    const html = '<p><strong>b</strong> <em>i</em> <u>u</u> <s>s</s></p><ul><li><p>one</p></li></ul><blockquote><p>q</p></blockquote><hr><br>'
    expect(sanitizeRichTextHtml(html)).toBe(html)
  })

  it('strips scripts, event handlers and unknown tags', () => {
    const out = sanitizeRichTextHtml('<p onclick="x()">ok</p><script>alert(1)</script><img src=x onerror=alert(1)><iframe src="https://evil"></iframe>')
    expect(out).toBe('<p>ok</p>')
  })

  it('drops style values that can carry code or remote loads', () => {
    expect(sanitizeRichTextHtml('<p style="background-color: url(https://evil/x.png)">t</p>')).toBe('<p>t</p>')
    expect(sanitizeRichTextHtml('<p style="color: expression(alert(1))">t</p>')).toBe('<p>t</p>')
    expect(sanitizeRichTextHtml('<p style="position: fixed; color: red;">t</p>')).toBe('<p style="color: red;">t</p>')
    expect(sanitizeRichTextHtml('<p class="x" id="y" data-z="1">t</p>')).toBe('<p>t</p>')
  })

  it('keeps safe links and refuses script links', () => {
    expect(sanitizeRichTextHtml('<a href="https://jkkn.ac.in/x" target="_blank" onclick="y()">s</a>')).toBe(
      '<a href="https://jkkn.ac.in/x" target="_blank" rel="noopener noreferrer">s</a>',
    )
    expect(sanitizeRichTextHtml('<a href="/admissions">s</a>')).toBe('<a href="/admissions">s</a>')
    expect(sanitizeRichTextHtml('<a href="javascript:alert(1)">s</a>')).toBe('<a>s</a>')
    expect(sanitizeRichTextHtml('<a href="&#106;avascript:alert(1)">s</a>')).toBe('<a>s</a>')
    expect(sanitizeRichTextHtml('<a href=" JaVaScRiPt:alert(1)">s</a>')).toBe('<a>s</a>')
  })

  it('never lets text become markup', () => {
    expect(sanitizeRichTextHtml('a < b')).toBe('a &lt; b')
    // An unterminated tag at the end must not join the markup that follows it in the page.
    expect(sanitizeRichTextHtml('<p>x</p><img src=x onerror=alert(1)')).toBe('<p>x</p>&lt;img src=x onerror=alert(1)')
    expect(sanitizeRichTextHtml('<!-- c --><p>x</p><!-- open')).toBe('<p>x</p>&lt;!-- open')
    const nested = sanitizeRichTextHtml('<scr<script></script>ipt>alert(1)</script>')
    expect(nested).not.toMatch(/<script/i)
  })

  it('cannot be broken out of an attribute', () => {
    const out = sanitizeRichTextHtml('<a href="https://x/" title="a>b" onclick="alert(1)">s</a>')
    expect(out.match(/</g)?.length).toBe(2) // only the rebuilt <a ...> and </a>
    expect(out).not.toMatch(/<[^>]*onclick/i)
  })
})

describe('CoursePage server render', () => {
  it('does not import isomorphic-dompurify (jsdom fails the server render in production)', () => {
    const src = readFileSync(join(process.cwd(), 'components/cms-blocks/content/course-page.tsx'), 'utf8')
    expect(src).not.toContain('isomorphic-dompurify')
  })
})
