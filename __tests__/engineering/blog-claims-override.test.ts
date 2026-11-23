import { describe, expect, it } from 'vitest'
import {
  ENGG_BLOG_CLAIM_RULES,
  applyEngineeringBlogClaims,
  engineeringBlogExcerpt,
} from '@/lib/institutions/engineering/blog-claims-override'

const SUFFIX = '-at-jkkn-career-curriculum-fees-admission-guide-for-2026'
const html = (post: { content?: unknown }) => (post.content as { html: string }).html

// Rows exactly as the live posts served them on 2026-11-21.
const CSE_METRICS =
  '<tbody><tr><td><p>Placement Rate</p></td><td><p>92%+</p></td></tr><tr><td><p>Recruiters Visiting Campus</p></td><td><p>60+</p></td></tr><tr><td><p>Average Package</p></td><td><p>₹3.5 LPA</p></td></tr><tr><td><p>Highest Package</p></td><td><p>₹8.5 LPA+</p></td></tr><tr><td><p>Internship Requirement</p></td><td><p>Mandatory 8-week internship</p></td></tr></tbody>'
const MECH_HIGHLIGHTS =
  '<tr><td><p><strong>Sanctioned Seats</strong></p></td><td><p>120</p></td></tr><tr><td><p><strong>Placement Rate</strong></p></td><td><p>85%+</p></td></tr><tr><td><p><strong>Management Quota Tuition</strong></p></td><td><p>₹45K/year</p></td></tr>'
const ECE_LINES =
  '<p></p><p>Average Salary Package: ₹3.5 LPA</p><p></p><p>Highest Package: ₹7.5 LPA+ for VLSI and Embedded Systems roles</p><p></p><p>Mandatory Internship: 8-week internship during Semester 7</p>'

describe('engineering blog claims (F10)', () => {
  it('covers the seven 2026 course guides', () => {
    expect(Object.keys(ENGG_BLOG_CLAIM_RULES).sort()).toEqual(
      ['b-e-cse', 'b-e-ece', 'b-e-eee', 'b-e-mechanical', 'b-tech-it', 'm-e-cse', 'mba'].map((s) => s + SUFFIX)
    )
  })

  it('CSE: rate, recruiters, average and highest become the NIRF 2026 placed count and median', () => {
    const out = applyEngineeringBlogClaims(`b-e-cse${SUFFIX}`, { content: { type: 'html', html: CSE_METRICS } })
    const text = html(out)
    expect(text).toContain('<td><p>Placed (all UG branches, 2024-25, NIRF 2026)</p></td><td><p>23 of 53 graduates</p></td>')
    expect(text).toContain('<td><p>Median salary (all UG branches, 2024-25, NIRF 2026)</p></td><td><p>₹2.4 LPA</p></td>')
    for (const gone of ['92%+', 'Recruiters Visiting', 'Average Package', 'Highest Package', '8.5 LPA']) {
      expect(text).not.toContain(gone)
    }
    expect(text).toContain('Mandatory 8-week internship')
  })

  it('Mechanical: AICTE intake 60, bold rows stay bold', () => {
    const out = applyEngineeringBlogClaims(`b-e-mechanical${SUFFIX}`, { content: { type: 'html', html: MECH_HIGHLIGHTS } })
    expect(html(out)).toBe(
      '<tr><td><p><strong>Sanctioned Seats</strong></p></td><td><p>60</p></td></tr><tr><td><p><strong>Placed (all UG branches, 2024-25, NIRF 2026)</strong></p></td><td><p>23 of 53 graduates</p></td></tr><tr><td><p><strong>Management Quota Tuition</strong></p></td><td><p>₹45K/year</p></td></tr>'
    )
  })

  it('ECE: the salary line becomes the NIRF median and the highest-package line goes', () => {
    const out = applyEngineeringBlogClaims(`b-e-ece${SUFFIX}`, { content: { type: 'html', html: ECE_LINES } })
    expect(html(out)).toBe(
      '<p></p><p>Median salary, all UG branches, 2024-25: ₹2.4 LPA (NIRF 2026 filing)</p><p></p><p>Mandatory Internship: 8-week internship during Semester 7</p>'
    )
  })

  it('M.E. CSE: intake 12 and no "most affordable" in the summary', () => {
    const slug = `m-e-cse${SUFFIX}`
    const excerpt =
      'The complete guide to pursuing M.E Computer Science & Engineering at JKKN College of Engineering & Technology, Komarapalayam — most affordable PG engineering at ₹30,000/year, with AICTE scholarship eligibility.'
    const out = applyEngineeringBlogClaims(slug, {
      content: { type: 'html', html: '<tr><td><p>Sanctioned Seats</p></td><td><p>60</p></td></tr>' },
      excerpt,
      seo_description: null,
    })
    expect(html(out)).toBe('<tr><td><p>Sanctioned Seats</p></td><td><p>12</p></td></tr>')
    expect(out.excerpt).toContain('Komarapalayam — tuition ₹30,000 a year, with AICTE scholarship eligibility.')
    expect(out.excerpt).not.toContain('affordable')
    expect(out.seo_description).toBeNull()
    expect(engineeringBlogExcerpt(slug, excerpt)).toBe(out.excerpt)
  })

  it('MBA: NIRF 2026 Management figures replace the package rows', () => {
    const live =
      '<tr><th colspan="1" rowspan="1"><p>Category</p></th><th colspan="1" rowspan="1"><p>Package</p></th></tr><tr><td><p>Average Package</p></td><td><p>₹4 LPA+</p></td></tr><tr><td><p>Highest Package</p></td><td><p>₹7–8 LPA</p></td></tr>'
    const text = html(applyEngineeringBlogClaims(`mba${SUFFIX}`, { content: { type: 'html', html: live } }))
    expect(text).toContain('<td><p>Graduated 2024-25</p></td><td><p>1 of 20, salary ₹2.8 LPA</p></td>')
    expect(text).toContain('<td><p>Graduated 2023-24</p></td><td><p>4 of 10, median salary ₹3 LPA</p></td>')
    expect(text).not.toMatch(/LPA\+|7–8/)
  })

  it('EEE, Mechanical and M.E. CSE: no comparison with other colleges, only the fee-page fact', () => {
    const line = "<p>At ₹45,000 a year, EEE and Mechanical have the lowest Management Quota tuition among JKKN's B.E. / B.Tech branches.</p>"
    const eee = '<p>At ₹45,000 per year under Management Quota, B.E EEE is among the most affordable engineering programmes in western Tamil Nadu.</p>'
    const mech = '<p>At ₹45,000/year under Management Quota, B.E Mechanical at JKKN is among the most affordable engineering programs in western Tamil Nadu.</p>'
    expect(html(applyEngineeringBlogClaims(`b-e-eee${SUFFIX}`, { content: { type: 'html', html: eee } }))).toBe(line)
    expect(html(applyEngineeringBlogClaims(`b-e-mechanical${SUFFIX}`, { content: { type: 'html', html: mech } }))).toBe(line)
    const me = '<p>With a tuition fee of only ₹30,000 per year, JKKN offers one of the most affordable M.E CSE programs in Tamil Nadu. Combined with the AICTE PG Scholarship, many learners can complete their postgraduate education with minimal financial burden.</p>'
    expect(html(applyEngineeringBlogClaims(`m-e-cse${SUFFIX}`, { content: { type: 'html', html: me } }))).toBe(
      '<p>The M.E. CSE tuition fee at JKKN is ₹30,000 a year. Combined with the AICTE PG Scholarship, many learners can complete their postgraduate education with minimal financial burden.</p>'
    )
  })

  it('lets an edited post win and leaves other posts alone', () => {
    const edited = { content: { type: 'html', html: '<tr><td><p>Placement Rate</p></td><td><p>See NIRF</p></td></tr>' } }
    expect(applyEngineeringBlogClaims(`b-e-eee${SUFFIX}`, edited).content).toBe(edited.content)
    const other = { content: { type: 'html', html: CSE_METRICS }, excerpt: 'x' }
    expect(applyEngineeringBlogClaims('some-other-post', other)).toBe(other)
    expect(engineeringBlogExcerpt('some-other-post', 'most affordable PG engineering at ₹30,000/year')).toBe(
      'most affordable PG engineering at ₹30,000/year'
    )
  })

  it('does not mutate the post it is given', () => {
    const post = { content: { type: 'html', html: CSE_METRICS } }
    applyEngineeringBlogClaims(`b-e-cse${SUFFIX}`, post)
    expect(post.content.html).toBe(CSE_METRICS)
  })
})
