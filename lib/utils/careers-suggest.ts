// lib/utils/careers-suggest.ts
//
// Type-ahead for the careers search box (spec §4.3). The server sends the
// whole suggestion list with the page (a few hundred short labels built from
// real open jobs), and this matcher runs in the browser — so typing never
// makes a network call. Pure; shared by the client component and its tests.

import { careersHref } from '@/lib/utils/careers-params'
import { synonymsFor } from '@/lib/utils/careers-synonyms'
import { normalizeText, tokenize } from '@/lib/utils/careers-text'

export type SuggestType = 'role' | 'department' | 'qualification' | 'institution'

export interface SuggestItem {
  type: SuggestType
  label: string
  /** open jobs behind this suggestion */
  count: number
  /** filter value for non-role suggestions (roles search by their label) */
  value?: string
}

/** Roles run a text search; the rest apply the matching filter. */
export function suggestHref(item: SuggestItem): string {
  return item.type === 'role' || !item.value
    ? careersHref({ q: item.label })
    : careersHref({ filters: { [item.type]: [item.value] } })
}

export const SUGGEST_TYPE_LABELS: Record<SuggestType, string> = {
  role: 'Role',
  department: 'Department',
  qualification: 'Qualification',
  institution: 'Institution',
}

export const MIN_SUGGEST_LENGTH = 2
const TYPE_ORDER: SuggestType[] = ['role', 'department', 'qualification', 'institution']

function tokenMatches(queryToken: string, labelTokens: string[]): boolean {
  if (labelTokens.some(t => t.startsWith(queryToken))) return true
  // "cse" → "Computer Science and Engineering", "prof" → "Professor"
  return synonymsFor(queryToken).some(alt => alt.every(t => labelTokens.includes(t)))
}

export function matchSuggestions(items: SuggestItem[], input: string, limit = 5): SuggestItem[] {
  const norm = normalizeText(input)
  if (norm.length < MIN_SUGGEST_LENGTH) return []
  const queryTokens = tokenize(input)
  if (queryTokens.length === 0) return []

  // Job count leads, so one mistyped posting can't outrank a title 58 jobs share;
  // labels that start with what was typed get a head start.
  const ranked: Array<{ item: SuggestItem; weight: number }> = []
  for (const item of items) {
    const labelTokens = tokenize(item.label)
    if (!queryTokens.every(q => tokenMatches(q, labelTokens))) continue
    const boost = normalizeText(item.label).startsWith(norm) ? 3 : labelTokens[0]?.startsWith(queryTokens[0]) ? 1.5 : 1
    ranked.push({ item, weight: item.count * boost })
  }
  return ranked
    .sort((a, b) =>
      b.weight - a.weight
      || TYPE_ORDER.indexOf(a.item.type) - TYPE_ORDER.indexOf(b.item.type)
      || a.item.label.localeCompare(b.item.label))
    .slice(0, limit)
    .map(r => r.item)
}
