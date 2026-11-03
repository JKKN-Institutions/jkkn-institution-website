// Engineering homepage top form (Step 3, 2026-11-03): the popup rules that keep the 1 s homepage
// popup from covering the new hero form. Pure helpers only; nothing is submitted.
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  TOP_FORM_TOUCHED_KEY,
  homePopupDelayMs,
  markTopFormTouched,
  topFormTouched,
} from '@/lib/enquiry/lead-events'

function stubSession(store = new Map<string, string>(), broken = false) {
  vi.stubGlobal('window', {
    sessionStorage: {
      getItem: (k: string) => {
        if (broken) throw new Error('blocked')
        return store.get(k) ?? null
      },
      setItem: (k: string, v: string) => {
        if (broken) throw new Error('blocked')
        store.set(k, v)
      },
    },
  })
  return store
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('homePopupDelayMs', () => {
  it('Engineering waits 20 s - its hero now carries the form', () => {
    expect(homePopupDelayMs('engineering')).toBe(20_000)
  })

  it('the main site keeps its 1 s popup', () => {
    expect(homePopupDelayMs('main')).toBe(1_000)
    expect(homePopupDelayMs(undefined)).toBe(1_000)
  })
})

describe('top form touched flag', () => {
  it('starts clear and is set by a focus in the hero form', () => {
    const store = stubSession()
    expect(topFormTouched()).toBe(false)
    markTopFormTouched()
    expect(store.get(TOP_FORM_TOUCHED_KEY)).toBe('1')
    expect(topFormTouched()).toBe(true)
  })

  it('blocked storage never throws and reads as not touched', () => {
    stubSession(new Map(), true)
    expect(() => markTopFormTouched()).not.toThrow()
    expect(topFormTouched()).toBe(false)
  })
})
