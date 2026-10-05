// lib/utils/careers-search.ts
//
// In-memory search over the MyJKKN job feed (spec §4.2). The feed is a few
// hundred jobs and already arrives whole, so ranking here is cheaper and far
// easier to tune than a database round-trip. Pure functions, no I/O — the
// service layer (public-careers-search.ts) owns fetching and caching.
//
// Matching, per query word and per field:
//   exact word 1.0 · synonym 0.7 · word prefix 0.6 · spelling near-miss 0.45
// A job's score is the best field per word (× field weight) plus a little for
// every other field that also matched. All words must match; if no job does,
// jobs matching some words are returned and flagged as `partial`.

import type { PublicJob } from '@/lib/schemas/public-careers'
import {
  collectLabels, deriveFacetValues, type FacetLabelMap, type FacetValues,
} from '@/lib/utils/careers-facets'
import { jobSlug } from '@/lib/utils/careers-slug'
import { synonymsFor } from '@/lib/utils/careers-synonyms'
import { formatJobTitle, stripHtml, tokenize } from '@/lib/utils/careers-text'

export type SearchField =
  | 'title' | 'department' | 'category' | 'institution' | 'qualification' | 'skills' | 'education' | 'location' | 'description'

export const FIELD_WEIGHTS: Record<SearchField, number> = {
  title: 10, department: 6, category: 5, institution: 4, qualification: 4, skills: 4, education: 3, location: 2, description: 1,
}
const FIELDS = Object.keys(FIELD_WEIGHTS) as SearchField[]

const QUALITY = { exact: 1, synonym: 0.7, prefix: 0.6, fuzzy: 0.45 } as const
const SECONDARY_FIELD_SHARE = 0.1
const TITLE_PHRASE_BONUS = 8
const TITLE_EXACT_BONUS = 6
const MAX_TERMS = 8

// Words a candidate would use for each category beyond its label.
const CATEGORY_KEYWORDS: Record<string, string> = {
  teaching_faculty: 'teaching faculty',
  non_teaching: 'nonteaching staff support',
  senior_leadership: 'leadership senior',
  medical: 'medical clinical',
}

/** "non teaching" must not match "teaching", so it is indexed as one word. */
function searchTokens(text: string): string[] {
  return tokenize(text.replace(/\bnon[\s-]*teaching\b/gi, 'nonteaching'))
}

// ── Index ───────────────────────────────────────────────────────────────────

export interface IndexedJob {
  job: PublicJob
  slug: string
  /** Tidied for display; also what the title field indexes. */
  title: string
  titleTokens: string[]
  fields: Record<SearchField, Set<string>>
  facets: FacetValues
  /** ms since epoch, 0 when HR left the date empty. */
  postedTime: number
}

export interface CareersIndex {
  jobs: IndexedJob[]
  /** token → number of jobs containing it, across all fields. */
  vocabulary: Map<string, number>
  labels: FacetLabelMap
}

export function buildIndex(jobs: PublicJob[], now: Date = new Date()): CareersIndex {
  const vocabulary = new Map<string, number>()
  const indexed = jobs.map((job): IndexedJob => {
    const title = formatJobTitle(job.title)
    const titleTokens = searchTokens(title)
    const fields: Record<SearchField, Set<string>> = {
      title: new Set(titleTokens),
      department: new Set(searchTokens(job.department?.name ?? '')),
      category: new Set(searchTokens(`${job.role_category.replace(/_/g, ' ')} ${CATEGORY_KEYWORDS[job.role_category] ?? ''}`)),
      institution: new Set(searchTokens(job.institution?.name ?? '')),
      qualification: new Set(searchTokens(job.qualifications.join(' '))),
      skills: new Set(searchTokens(job.skills.join(' '))),
      education: new Set(searchTokens((job.education_level ?? '').replace(/_/g, ' '))),
      location: new Set(searchTokens([job.city, job.state].filter(Boolean).join(' '))),
      description: new Set(searchTokens(stripHtml(job.description ?? ''))),
    }
    const seen = new Set<string>()
    for (const f of FIELDS) for (const t of fields[f]) seen.add(t)
    for (const t of seen) vocabulary.set(t, (vocabulary.get(t) ?? 0) + 1)

    const posted = job.posted_at ? new Date(job.posted_at).getTime() : 0
    return {
      job, title, titleTokens, fields,
      slug: jobSlug(job),
      facets: deriveFacetValues(job, now),
      postedTime: Number.isNaN(posted) ? 0 : posted,
    }
  })
  return { jobs: indexed, vocabulary, labels: collectLabels(jobs) }
}

// ── Query parsing ───────────────────────────────────────────────────────────

// Conversational filler ("I am looking for teaching jobs in computer science").
// Stored stemmed, because tokens are compared after stemming.
const STOPWORDS = new Set([
  'i', 'am', 'a', 'an', 'the', 'for', 'in', 'at', 'of', 'on', 'to', 'with', 'and', 'or', 'is', 'are', 'any', 'my',
  'we', 'looking', 'look', 'want', 'need', 'find', 'search', 'show', 'job', 'vacancy', 'opening', 'position', 'role',
  'career', 'year', 'yr', 'yrs', 'experience', 'exp', 'jkkn', 'please', 'available', 'having', 'have', 'who', 'that', 'as',
])

export interface ParsedQuery {
  raw: string
  /** Stemmed, de-duplicated search words with filler removed. */
  terms: string[]
  /** The candidate's own experience, when they stated it ("3 years", "fresher"). */
  years: number | null
}

export function parseQuery(raw: string): ParsedQuery {
  let text = raw.toLowerCase()
  let years: number | null = null

  const stated = text.match(/(\d{1,2})\s*\+?\s*(?:years?|yrs?)\b/)
  if (stated) {
    years = Number(stated[1])
    text = text.replace(stated[0], ' ')
  }
  if (/\bfreshers?\b/.test(text)) {
    years ??= 0
    text = text.replace(/\bfreshers?\b/g, ' ')
  }

  const terms = [...new Set(searchTokens(text).filter(t => !STOPWORDS.has(t)))].slice(0, MAX_TERMS)
  return { raw: raw.trim(), terms, years }
}

// ── Term expansion ──────────────────────────────────────────────────────────

/** Optimal-string-alignment distance, abandoned once it must exceed `max`. */
export function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let prev2: number[] = []
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    let best = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let d = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d = Math.min(d, prev2[j - 2] + 1)
      row.push(d)
      if (d < best) best = d
    }
    if (best > max) return max + 1
    prev2 = prev
    prev = row
  }
  return prev[b.length]
}

interface Expansion {
  term: string
  /** single tokens that satisfy the term, with their match quality */
  tokens: Map<string, number>
  /** multi-word synonyms: every token must be present in the same field */
  phrases: string[][]
  /** set when the term only matched through a spelling near-miss */
  corrected: string | null
}

function expand(term: string, vocabulary: Map<string, number>): Expansion {
  const tokens = new Map<string, number>([[term, QUALITY.exact]])
  const phrases: string[][] = []
  const raise = (t: string, q: number) => { if ((tokens.get(t) ?? 0) < q) tokens.set(t, q) }

  for (const alt of synonymsFor(term)) {
    if (alt.length === 1) raise(alt[0], QUALITY.synonym)
    else phrases.push(alt)
  }
  if (term.length >= 3) {
    for (const v of vocabulary.keys()) if (v !== term && v.startsWith(term)) raise(v, QUALITY.prefix)
  }

  // Typo tolerance is a last resort: only when the word, its synonyms and its
  // prefixes occur nowhere, otherwise "nurse" would drag in "purse".
  let corrected: string | null = null
  const known = [...tokens.keys()].some(t => vocabulary.has(t))
    || phrases.some(p => p.every(t => vocabulary.has(t)))
  if (!known && term.length >= 4) {
    const max = term.length >= 8 ? 2 : 1
    let bestCount = 0
    for (const [v, count] of vocabulary) {
      if (v.length < 4 || editDistance(term, v, max) > max) continue
      raise(v, QUALITY.fuzzy)
      if (count > bestCount) { bestCount = count; corrected = v }
    }
  }
  return { term, tokens, phrases, corrected }
}

function fieldQuality(field: SearchField, set: Set<string>, exp: Expansion): number {
  let best = 0
  for (const [token, q] of exp.tokens) {
    // "it", "me", "be", "ai" are degrees/disciplines in a title but plain
    // English in prose — never count them inside the description.
    if (q <= best || (field === 'description' && token.length <= 2)) continue
    if (set.has(token)) best = q
  }
  if (best < QUALITY.synonym && exp.phrases.some(p => p.every(t => set.has(t)))) best = QUALITY.synonym
  return best
}

// ── Search ──────────────────────────────────────────────────────────────────

export type MatchReason = 'strong' | 'qualification' | 'skills' | 'description' | 'partial' | null

export interface SearchHit {
  item: IndexedJob
  score: number
  matchedTerms: number
  reason: MatchReason
}

export interface SearchResult {
  /** all = every word matched · partial = some words · none = nothing · browse = no words to match */
  mode: 'all' | 'partial' | 'none' | 'browse'
  hits: SearchHit[]
  /** query word → the indexed word it was read as, for typo corrections */
  corrections: Record<string, string>
}

const STRONG_FIELDS: ReadonlySet<SearchField> = new Set<SearchField>(['title', 'department', 'category'])

function eligibility(job: PublicJob, years: number): 'yes' | 'no' | 'unknown' {
  const { min_experience_years: min, max_experience_years: max } = job
  if (min === null && max === null) return 'unknown'
  return (min ?? 0) <= years && (max ?? Infinity) >= years ? 'yes' : 'no'
}

function containsSequence(haystack: string[], needle: string[]): boolean {
  if (needle.length === 0 || needle.length > haystack.length) return false
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    if (needle.every((t, k) => haystack[i + k] === t)) return true
  }
  return false
}

export function search(index: CareersIndex, query: ParsedQuery, pool: IndexedJob[] = index.jobs): SearchResult {
  const { terms, years } = query

  if (terms.length === 0) {
    // Only an experience statement ("fresher", "5 years"): list the jobs it fits.
    const hits = (years === null ? pool : pool.filter(i => eligibility(i.job, years) === 'yes'))
      .map((item): SearchHit => ({ item, score: 0, matchedTerms: 0, reason: null }))
    return { mode: years !== null && hits.length === 0 ? 'none' : 'browse', hits, corrections: {} }
  }

  const expansions = terms.map(t => expand(t, index.vocabulary))
  const corrections: Record<string, string> = {}
  for (const e of expansions) if (e.corrected) corrections[e.term] = e.corrected

  const scored: SearchHit[] = []
  for (const item of pool) {
    let score = 0
    let matchedTerms = 0
    let strong = true
    const weakFields = new Set<SearchField>()

    for (const exp of expansions) {
      let best = 0
      let sum = 0
      let bestField: SearchField | null = null
      for (const field of FIELDS) {
        const q = fieldQuality(field, item.fields[field], exp)
        if (q === 0) continue
        const s = FIELD_WEIGHTS[field] * q
        sum += s
        if (s > best) { best = s; bestField = field }
      }
      if (!bestField) { strong = false; continue }
      matchedTerms += 1
      score += best + SECONDARY_FIELD_SHARE * (sum - best)
      if (!STRONG_FIELDS.has(bestField)) { strong = false; weakFields.add(bestField) }
    }
    if (matchedTerms === 0) continue

    if (containsSequence(item.titleTokens, terms)) {
      score += TITLE_PHRASE_BONUS
      if (item.titleTokens.length === terms.length) score += TITLE_EXACT_BONUS
    }
    if (years !== null) {
      const fit = eligibility(item.job, years)
      if (fit === 'yes') score *= 1.15
      else if (fit === 'no') score *= 0.6
    }

    const reason: MatchReason = matchedTerms < terms.length ? 'partial'
      : strong ? 'strong'
      : weakFields.has('qualification') || weakFields.has('education') ? 'qualification'
      : weakFields.has('skills') ? 'skills'
      : weakFields.has('description') ? 'description'
      : null
    scored.push({ item, score, matchedTerms, reason })
  }

  const full = scored.filter(h => h.matchedTerms === terms.length)
  if (full.length > 0) return { mode: 'all', hits: full, corrections }
  return { mode: scored.length > 0 ? 'partial' : 'none', hits: scored, corrections }
}

// ── Ordering ────────────────────────────────────────────────────────────────

export type HitSort = 'relevance' | 'newest' | 'oldest' | 'title'

const newestFirst = (a: SearchHit, b: SearchHit) => b.item.postedTime - a.item.postedTime

export function sortHits(hits: SearchHit[], sort: HitSort): SearchHit[] {
  const out = [...hits]
  switch (sort) {
    case 'relevance':
      return out.sort((a, b) => b.matchedTerms - a.matchedTerms || b.score - a.score || newestFirst(a, b))
    case 'oldest':
      // Undated jobs stay last in both date orders.
      return out.sort((a, b) => (a.item.postedTime || Infinity) - (b.item.postedTime || Infinity))
    case 'title':
      return out.sort((a, b) => a.item.title.localeCompare(b.item.title) || newestFirst(a, b))
    default:
      return out.sort(newestFirst)
  }
}

// ── Related jobs ────────────────────────────────────────────────────────────

const GENERIC_TITLE_WORDS = new Set(['assistant', 'associate', 'senior', 'junior', 'and', 'of', 'the', 'in', 'for', 'jkkn'])

/** Same department first, then same institution + category, then similar titles (spec §5.2). */
export function relatedJobs(index: CareersIndex, jobId: string, limit = 4): IndexedJob[] {
  const source = index.jobs.find(i => i.job.id === jobId)
  if (!source) return []
  const titleWords = source.titleTokens.filter(t => !GENERIC_TITLE_WORDS.has(t))

  return index.jobs
    .filter(i => i.job.id !== jobId)
    .map(item => {
      let score = 0
      if (source.facets.department[0] && item.facets.department[0] === source.facets.department[0]) score += 6
      if (source.facets.institution[0] && item.facets.institution[0] === source.facets.institution[0]) score += 2
      if (item.job.role_category === source.job.role_category) score += 2
      score += 2 * Math.min(3, titleWords.filter(t => item.fields.title.has(t)).length)
      return { item, score }
    })
    .filter(r => r.score >= 4)
    .sort((a, b) => b.score - a.score || b.item.postedTime - a.item.postedTime)
    .slice(0, limit)
    .map(r => r.item)
}
