'use client'

// One navigation transition for the whole careers listing. Search, filters,
// sort and chips all change the URL; the server page re-renders from it.
// Sharing the transition lets every control show the same pending state and
// lets filter checkboxes flip instantly (optimistic params) instead of
// waiting for the server round-trip.

import { createContext, useCallback, useContext, useMemo, useOptimistic, useTransition, type ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface CareersNav {
  /** Current URL parameters, including a change that is still loading. */
  params: URLSearchParams
  pending: boolean
  /** `push` adds a history entry (new search); the default replaces (filter tweaks). */
  navigate: (next: URLSearchParams, options?: { push?: boolean }) => void
}

const CareersNavContext = createContext<CareersNav | null>(null)

export function CareersNavProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useOptimistic(searchParams.toString())

  const navigate = useCallback<CareersNav['navigate']>((next, options) => {
    const qs = next.toString()
    const href = qs ? `${pathname}?${qs}` : pathname
    startTransition(() => {
      setOptimistic(qs)
      if (options?.push) router.push(href, { scroll: false })
      else router.replace(href, { scroll: false })
    })
  }, [pathname, router, setOptimistic])

  const value = useMemo<CareersNav>(
    () => ({ params: new URLSearchParams(optimistic), pending, navigate }),
    [optimistic, pending, navigate],
  )
  return <CareersNavContext.Provider value={value}>{children}</CareersNavContext.Provider>
}

export function useCareersNav(): CareersNav {
  const ctx = useContext(CareersNavContext)
  if (!ctx) throw new Error('useCareersNav must be used inside <CareersNavProvider>')
  return ctx
}

/** Dims its children while a new result set is loading. */
export function PendingRegion({ children, className }: { children: ReactNode; className?: string }) {
  const { pending } = useCareersNav()
  return (
    <div aria-busy={pending} className={`${className ?? ''} transition-opacity ${pending ? 'opacity-60' : ''}`}>
      {children}
    </div>
  )
}
