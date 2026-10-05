// lib/utils/careers-synonyms.ts
//
// Vocabulary candidates use that HR's postings may not. Each group lists
// interchangeable phrases; a query word that equals a single-word member is
// expanded to every other member. Add a line here to teach search a new term.
// Phrases are written naturally and normalised on load (see careers-text.ts).
// Keep members specific: a broad word ("management", "office", "people")
// appears in most descriptions and would make every job match.

import { tokenize } from '@/lib/utils/careers-text'

const GROUPS: string[][] = [
  // Roles
  ['prof', 'professor'],
  ['asst', 'assistant'],
  ['assoc', 'associate'],
  ['hod', 'head of department'],
  ['admin', 'administration', 'administrative', 'administrator'],
  ['hr', 'human resources', 'human resource', 'recruitment'],
  ['accounts', 'accountant', 'accounting', 'finance'],
  ['lab', 'laboratory'],
  ['technician', 'technologist'],
  ['librarian', 'library'],
  ['nurse', 'nursing'],
  ['developer', 'programmer', 'software'],
  ['fresher', 'entry level', 'trainee'],
  ['marketing', 'branding'],
  // Disciplines
  ['cse', 'computer science engineering', 'computer science'],
  ['cs', 'computer science'],
  ['it', 'information technology'],
  ['ece', 'electronics communication'],
  ['eee', 'electrical electronics'],
  ['mech', 'mechanical'],
  ['civil', 'civil engineering'],
  ['ai', 'artificial intelligence'],
  ['ml', 'machine learning'],
  ['ds', 'data science'],
  ['maths', 'mathematics', 'math'],
  ['pharmacy', 'pharma', 'pharmaceutical', 'pharmaceutics'],
  ['dental', 'dentistry'],
  ['physio', 'physiotherapy'],
  ['viscom', 'visual communication'],
  // Degrees
  ['mtech', 'me', 'master of engineering'],
  ['btech', 'be', 'bachelor of engineering'],
  ['mba', 'business administration'],
  ['mca', 'computer applications'],
  ['phd', 'doctorate', 'doctoral'],
  ['mpharm', 'mpharma', 'master of pharmacy'],
  ['bpharm', 'bpharma', 'bachelor of pharmacy'],
  ['mds', 'master of dental surgery'],
  ['bds', 'bachelor of dental surgery'],
  ['msc', 'master of science'],
  ['bsc', 'bachelor of science'],
  ['pg', 'postgraduate', 'post graduate'],
  ['ug', 'undergraduate'],
]

// One-way: a broad word also finds the specific ones, never the reverse —
// "teaching" should find professors, but "professor" must not find every tutor.
const BROADER: Record<string, string[]> = {
  teaching: ['faculty', 'lecturer', 'professor', 'teacher', 'tutor'],
  faculty: ['teaching', 'lecturer', 'professor', 'teacher', 'tutor'],
  leadership: ['principal', 'director', 'dean', 'chief'],
}

/** token → alternative phrases (each a token list), excluding the token itself. */
const LOOKUP: Map<string, string[][]> = (() => {
  const map = new Map<string, string[][]>()
  for (const group of GROUPS) {
    const phrases = group.map(tokenize).filter(p => p.length > 0)
    for (const phrase of phrases) {
      if (phrase.length !== 1) continue
      const others = phrases.filter(p => p !== phrase)
      map.set(phrase[0], [...(map.get(phrase[0]) ?? []), ...others])
    }
  }
  for (const [broad, specifics] of Object.entries(BROADER)) {
    const [token] = tokenize(broad)
    map.set(token, [...(map.get(token) ?? []), ...specifics.map(tokenize)])
  }
  return map
})()

export function synonymsFor(token: string): string[][] {
  return LOOKUP.get(token) ?? []
}
