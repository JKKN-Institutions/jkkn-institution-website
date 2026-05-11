'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { useInstitutionId } from '@/lib/hooks/use-institution'

const ELIGIBLE_INSTITUTIONS = ['main', 'engineering'] as const

type EligibleInstitution = (typeof ELIGIBLE_INSTITUTIONS)[number]

function isEligibleInstitution(id: string): id is EligibleInstitution {
  return (ELIGIBLE_INSTITUTIONS as readonly string[]).includes(id)
}

export function UChatWidget() {
  const institutionId = useInstitutionId()
  const isEligible = isEligibleInstitution(institutionId)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (!isEligible) return

    const timer = setTimeout(() => setShouldLoad(true), 5000)

    const handleInteraction = () => setShouldLoad(true)
    window.addEventListener('scroll', handleInteraction, { once: true, passive: true })
    window.addEventListener('click', handleInteraction, { once: true })
    window.addEventListener('keydown', handleInteraction, { once: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [isEligible])

  if (!isEligible || !shouldLoad) return null

  return (
    <Script
      id="uchat-widget"
      src="https://www.uchat.com.au/js/widget/px7u1tl63dajlpum/popup.js"
      strategy="lazyOnload"
    />
  )
}
