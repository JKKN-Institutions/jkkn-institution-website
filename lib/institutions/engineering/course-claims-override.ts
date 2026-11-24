// F10 of the engineering perception audit (user's choice 2026-11-21): course pages keep only what a document
// supports. The B.Tech IT page printed market salary ranges per role (₹4-15 LPA ... ₹10-30 LPA) next to the
// college's name; the B.E. Mechanical page said "projects funded by government agencies" and "strong
// partnerships with leading automotive, aerospace ... companies". The college's NIRF 2026 filing records
// sponsored research of ₹20,000 (2024-25).
//
// User's choice 2026-11-24: the website shows no placement numbers at all, so the B.Tech IT placement FAQ no
// longer gains a NIRF placed-count / median-salary line; its own Training & Placement Cell answer stays.
//
// The template data files hold Tamil-script subject titles, and a local guard blocks edits to such files, so the
// pages map the data at render time instead. Exact-match rules: a line already edited stays as it is.

interface CareerPath {
  avgSalary?: string
}
interface Benefit {
  title: string
  description: string
}

/** B.Tech IT: no per-role salary ranges. */
export function withVerifiedItClaims<T extends { careerPaths?: CareerPath[] }>(data: T): T {
  return {
    ...data,
    careerPaths: data.careerPaths?.map(({ avgSalary: _avgSalary, ...path }) => path),
  }
}

const MECH_BENEFIT_FIXES: Record<string, { old: string; description: string }> = {
  'Expert Senior Learners': {
    old: 'Learn from senior learners with M.E. and Ph.D. qualifications, industry experience, and active research in areas like thermal engineering, design optimization, and advanced manufacturing technologies.',
    description:
      'Learn from senior learners with M.E. and Ph.D. qualifications and industry experience in thermal engineering, design and manufacturing.',
  },
  'Research Opportunities': {
    old: 'Active research culture with projects funded by government agencies. Learners participate in conferences, publish papers, and work on cutting-edge technologies in renewable energy, automotive systems, and smart manufacturing.',
    description:
      'Final-year projects and conference papers give learners room to work on renewable energy, automotive systems and smart manufacturing.',
  },
  'Industry Collaborations': {
    old: 'Strong partnerships with leading automotive, aerospace, manufacturing, and energy companies. Regular industry visits, guest lectures, internships, and live projects provide real-world exposure and networking opportunities.',
    description: 'Industry visits, guest lectures and internships give learners real-world exposure.',
  },
}

/** B.E. Mechanical: three "Why choose" lines without the unsupported research / partnership claims. */
export function withVerifiedMechanicalClaims<T extends { benefits?: Benefit[] }>(data: T): T {
  return {
    ...data,
    benefits: data.benefits?.map((benefit) => {
      const fix = MECH_BENEFIT_FIXES[benefit.title]
      return fix && benefit.description === fix.old ? { ...benefit, description: fix.description } : benefit
    }),
  }
}
