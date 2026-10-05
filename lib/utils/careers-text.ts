// lib/utils/careers-text.ts
//
// Text normalisation shared by careers search, suggestions, facets and slugs.
// Pure and dependency-free: safe on the server and in client components.

const ENTITIES: Record<string, string> = { '&amp;': '&', '&nbsp;': ' ', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" }

/** Tags → spaces and the handful of entities MyJKKN's editor emits. */
export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, ' ').replace(/&(amp|nbsp|lt|gt|quot|#39);/g, m => ENTITIES[m] ?? ' ')
}

/**
 * Lowercase, fold accents, and collapse dotted degrees so that
 * "M.Tech", "Ph.D", "M.D.S" and "Pharm.D" become mtech / phd / mds / pharmd.
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/([a-z])\.(?=[a-z])/g, '$1')
    .replace(/[^a-z0-9+]+/g, ' ')
    .trim()
}

/** Folds plurals only — enough for "professors", "freshers", "technologies". */
export function stem(token: string): string {
  if (token.length <= 3) return token
  if (token.endsWith('ies')) return `${token.slice(0, -3)}y`
  if (token.endsWith('s') && !/(ss|us|is)$/.test(token)) return token.slice(0, -1)
  return token
}

export function tokenize(text: string): string[] {
  const norm = normalizeText(text)
  return norm ? norm.split(' ').map(stem) : []
}

export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Uppercase words that must survive title tidying.
const ACRONYMS = new Set([
  'JKKN', 'CCTV', 'HR', 'IT', 'CSE', 'ECE', 'EEE', 'MBA', 'MCA', 'AI', 'ML', 'PG', 'UG', 'HOD', 'NSS', 'NCC', 'PRO',
  'ERP', 'CEO', 'COO', 'CFO', 'CTO', 'DTO', 'IQAC', 'NAAC', 'NBA', 'OKR', 'PA', 'MDS', 'BDS', 'MBBS', 'ICU', 'OT',
  'GNM', 'ANM', 'SEO', 'UI', 'UX', 'II', 'III', 'IV', 'PET', 'AHS', 'CAS', 'CET',
])
const SMALL_WORDS = new Set(['of', 'and', 'in', 'for', 'the', 'to', 'at', 'on', 'cum', 'or'])

/**
 * Display-only tidy-up of HR's titles: "SENIOR LECTURER" → "Senior Lecturer",
 * "Vice Principal," → "Vice Principal", "CEO_JKKN" → "CEO – JKKN".
 * Mixed-case titles are left as HR typed them, apart from shouted words.
 */
export function formatJobTitle(title: string): string {
  const cleaned = title
    .replace(/_+/g, ' – ')
    .replace(/\s+/g, ' ')
    .replace(/[\s,.;:\-–—]+$/g, '')
    .trim()
  if (!cleaned) return title.trim()
  const shouting = !/[a-z]/.test(cleaned)
  return cleaned
    .split(' ')
    .map((word, i) => {
      const letters = word.replace(/[^A-Za-z]/g, '')
      const isUpper = letters.length > 1 && letters === letters.toUpperCase()
      if (!isUpper || /[.\d]/.test(word) || ACRONYMS.has(letters)) return word
      if (!shouting && letters.length < 3) return word
      const lower = word.toLowerCase()
      if (i > 0 && SMALL_WORDS.has(lower)) return lower
      return lower.replace(/(^|[/(-])([a-z])/g, (_, lead: string, c: string) => lead + c.toUpperCase())
    })
    .join(' ')
}
