'use client'

// Saved jobs live in the candidate's browser (spec §5.4): MyJKKN has no
// candidate accounts, so there is nothing server-side to save against.
// useSyncExternalStore keeps every Save button and the "Saved (n)" counter in
// step, including across tabs via the `storage` event.

import { useCallback, useSyncExternalStore } from 'react'

export interface SavedJob {
  id: string
  slug: string
  title: string
  institution: string | null
}

const STORAGE_KEY = 'jkkn:careers:saved-jobs'
const CHANGE_EVENT = 'jkkn:careers:saved-jobs-change'
const MAX_SAVED = 50
const EMPTY: SavedJob[] = []

// getSnapshot must return a stable reference while the stored string is unchanged.
let cacheRaw: string | null = null
let cacheValue: SavedJob[] = EMPTY

function read(): SavedJob[] {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return EMPTY // storage blocked (private mode, site data disabled)
  }
  if (raw === cacheRaw) return cacheValue
  cacheRaw = raw
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : []
    cacheValue = Array.isArray(parsed)
      ? parsed.filter((j): j is SavedJob => typeof j?.id === 'string' && typeof j?.slug === 'string' && typeof j?.title === 'string')
      : EMPTY
  } catch {
    cacheValue = EMPTY
  }
  return cacheValue
}

function write(jobs: SavedJob[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  } catch {
    return // nothing to save into; the button simply stays unsaved
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

export function useSavedJobs() {
  // Server snapshot is empty, so saved state appears after hydration without a mismatch.
  const saved = useSyncExternalStore(subscribe, read, () => EMPTY)

  const toggle = useCallback((job: SavedJob): boolean => {
    const current = read()
    const exists = current.some(j => j.id === job.id)
    write(exists ? current.filter(j => j.id !== job.id) : [job, ...current].slice(0, MAX_SAVED))
    return !exists
  }, [])

  const remove = useCallback((id: string) => write(read().filter(j => j.id !== id)), [])

  return { saved, toggle, remove }
}
