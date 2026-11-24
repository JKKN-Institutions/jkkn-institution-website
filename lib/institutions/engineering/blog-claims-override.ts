// F10 of the engineering perception audit (user's choice 2026-11-21: "Edu + NIRF line" - remove the claims no
// document supports; where a salary was printed, print the NIRF median instead). The seven 2026 course guides on
// engg.jkkn.ac.in/blog printed placement rates of 85-92%+, average packages of Rs 3.0-4 LPA, highest packages of
// Rs 6-8.5 LPA and "60+ recruiters". The college's own NIRF 2026 filings say otherwise:
//   - Engineering (UG, all branches): 23 of the 53 graduates of 2024-25 placed, median salary Rs 2,40,000.
//   - Management (MBA): 1 of 20 placed in 2024-25 (Rs 2,80,000); 4 of 10 in 2023-24 (median Rs 3,00,000).
// Three posts also gave the wrong sanctioned intake. AICTE EOA 2026-27 (letter printed 23 March 2026): every
// B.E. / B.Tech branch 60, MBA 60, M.E. CSE 12 - not Mechanical 120, MBA 120, M.E. CSE 60.
//
// Same contract as the other engineering overrides: exact strings read from the live posts on 2026-11-21, swapped
// at render time. A post edited in the CMS / MyJKKN no longer matches, so the edit always wins. Nothing is written
// to any database. Recruiter lists and the scholarship lines are NOT touched here (management memo, skipped).
//
// User's choice 2026-11-24: the website shows no placement numbers at all - no placed count, rate, salary or
// recruiter count, and no market salary figure. The 2026-11-21 NIRF rows are therefore dropped too: the placement
// rows are removed, recruiter names and the other table rows stay.

type Rule = readonly [old: string, next: string]

const row = (label: string, value: string, strong = false) =>
  strong
    ? `<tr><td><p><strong>${label}</strong></p></td><td><p>${value}</p></td></tr>`
    : `<tr><td><p>${label}</p></td><td><p>${value}</p></td></tr>`

/** "Placement Rate | 85%+" in a highlights table -> the row is removed. */
const placementRate = (rate: string, strong = false): Rule => [row('Placement Rate', rate, strong), '']

/** "Average Package" + "Highest Package" rows -> both rows are removed. */
const packages = (average: string, highest: string, strong = false): Rule => [
  row('Average Package', average, strong) + row('Highest Package', highest, strong),
  '',
]

const SLUG_SUFFIX = '-at-jkkn-career-curriculum-fees-admission-guide-for-2026'

// User's choice 2026-11-23: no comparison with other colleges (no document supports it); the fee page does show
// EEE and Mechanical at Rs 45,000 against CSE / IT Rs 80,000 and ECE Rs 70,000. M.E. CSE (Rs 30,000) is lower, so
// the line says "B.E. / B.Tech branches".
const LOWEST_UG_FEE_LINE =
  "<p>At ₹45,000 a year, EEE and Mechanical have the lowest Management Quota tuition among JKKN's B.E. / B.Tech branches.</p>"

export const ENGG_BLOG_CLAIM_RULES: Readonly<Record<string, readonly Rule[]>> = {
  [`b-e-cse${SLUG_SUFFIX}`]: [
    placementRate('92%+', true),
    [
      row('Placement Rate', '92%+') +
        row('Recruiters Visiting Campus', '60+') +
        row('Average Package', '₹3.5 LPA') +
        row('Highest Package', '₹8.5 LPA+'),
      '',
    ],
    [
      '<p>A ₹3.5 LPA fresher package is currently the baseline for many IT-services roles. However, learners who build:</p>',
      '<p>Starting salaries in many IT-services roles are modest. However, learners who build:</p>',
    ],
  ],
  [`b-e-ece${SLUG_SUFFIX}`]: [
    placementRate('85%+'),
    ['<p>Average Salary Package: ₹3.5 LPA</p><p></p>', ''],
    ['<p>Highest Package: ₹7.5 LPA+ for VLSI and Embedded Systems roles</p><p></p>', ''],
  ],
  [`b-e-eee${SLUG_SUFFIX}`]: [
    placementRate('88%+'),
    packages('₹3.2 LPA', '₹6.5 LPA+'),
    [
      '<p>At ₹45,000 per year under Management Quota, B.E EEE is among the most affordable engineering programmes in western Tamil Nadu.</p>',
      LOWEST_UG_FEE_LINE,
    ],
  ],
  [`b-e-mechanical${SLUG_SUFFIX}`]: [
    [row('Sanctioned Seats', '120', true), row('Sanctioned Seats', '60', true)],
    placementRate('85%+', true),
    packages('₹3.0 LPA', '₹6 LPA+', true),
    [
      '<p>At ₹45,000/year under Management Quota, B.E Mechanical at JKKN is among the most affordable engineering programs in western Tamil Nadu.</p>',
      LOWEST_UG_FEE_LINE,
    ],
    [
      '<h2>1. Largest Mechanical Batch</h2><p>With 120 sanctioned seats, JKKN Mechanical has one of the largest engineering batches on campus. A larger batch creates:</p><p></p><p>Stronger peer learning</p><p>Bigger alumni networks</p><p>Active SAE &amp; ASME learner chapters</p><p>Better project collaboration</p>',
      '<h2>1. Batch Size</h2><p>AICTE has approved 60 seats a year for B.E. Mechanical Engineering at JKKN (approval for 2026-27). A batch of this size supports:</p><p></p><p>Peer learning</p><p>Project collaboration</p>',
    ],
  ],
  [`b-tech-it${SLUG_SUFFIX}`]: [placementRate('90%+', true), packages('₹3.5 LPA', '₹8 LPA+', true)],
  [`m-e-cse${SLUG_SUFFIX}`]: [
    [row('Sanctioned Seats', '60'), row('Sanctioned Seats', '12')],
    [
      'With a tuition fee of only ₹30,000 per year, JKKN offers one of the most affordable M.E CSE programs in Tamil Nadu.',
      'The M.E. CSE tuition fee at JKKN is ₹30,000 a year.',
    ],
  ],
  [`mba${SLUG_SUFFIX}`]: [
    [
      '<tr><th colspan="1" rowspan="1"><p>Category</p></th><th colspan="1" rowspan="1"><p>Package</p></th></tr>' +
        row('Average Package', '₹4 LPA+') +
        row('Highest Package', '₹7–8 LPA'),
      '<tr><th colspan="1" rowspan="1"><p>Category</p></th><th colspan="1" rowspan="1"><p>Details</p></th></tr>',
    ],
    // The table keeps only its "Top Domains" row, so the heading no longer promises salaries.
    ['<h3>Salary Insights</h3>', '<h3>Career Domains</h3>'],
    [
      '<p>With 120 sanctioned seats, the MBA program offers a diverse peer</p>',
      '<p>With 60 seats a year approved by AICTE, the MBA program offers a diverse peer</p>',
    ],
  ],
}

/** Summary-line fixes (post excerpt / SEO description, also shown on the /blog cards). */
const EXCERPT_RULES: Readonly<Record<string, Rule>> = {
  [`m-e-cse${SLUG_SUFFIX}`]: ['most affordable PG engineering at ₹30,000/year', 'tuition ₹30,000 a year'],
}

function replaceAll(text: string, rules: readonly Rule[]): string {
  return rules.reduce((out, [old, next]) => (out.includes(old) ? out.split(old).join(next) : out), text)
}

/** The excerpt of one of the seven guides, without the unsourced "most affordable". */
export function engineeringBlogExcerpt<T extends string | null | undefined>(slug: string, excerpt: T): T {
  const rule = EXCERPT_RULES[slug]
  return rule && typeof excerpt === 'string' ? (replaceAll(excerpt, [rule]) as T) : excerpt
}

interface BlogPostLike {
  content?: unknown
  excerpt?: string | null
  seo_description?: string | null
}

/** Returns a copy of the post with the known claims swapped; any other slug, or an edited post, passes through. */
export function applyEngineeringBlogClaims<T extends BlogPostLike>(slug: string, post: T): T {
  const rules = ENGG_BLOG_CLAIM_RULES[slug]
  if (!rules && !EXCERPT_RULES[slug]) return post
  const out: T = { ...post }
  const content = post.content
  if (rules && typeof content === 'object' && content !== null && typeof (content as { html?: unknown }).html === 'string') {
    const html = (content as { html: string }).html
    const next = replaceAll(html, rules)
    if (next !== html) out.content = { ...(content as object), html: next }
  }
  if ('excerpt' in post) out.excerpt = engineeringBlogExcerpt(slug, post.excerpt)
  if ('seo_description' in post) out.seo_description = engineeringBlogExcerpt(slug, post.seo_description)
  return out
}
