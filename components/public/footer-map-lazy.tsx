'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const FooterMapEmbed = dynamic(() => import('./footer-map-embed'), {
  loading: () => (
    <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
      <div className="h-[200px] bg-muted/10 animate-pulse flex items-center justify-center">
        <div className="text-center text-white/50">
          <svg
            className="w-8 h-8 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    </div>
  ),
  ssr: false,
})

interface LazyFooterMapProps {
  embedUrl: string
  linkUrl?: string
}

export function LazyFooterMap({ embedUrl, linkUrl }: LazyFooterMapProps) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Use Intersection Observer to detect when footer is approaching viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true)
          observer.disconnect() // Stop observing once loaded
        }
      },
      {
        // Start loading when footer is 200px from entering viewport
        rootMargin: '200px',
        threshold: 0.01,
      }
    )

    const mapSection = document.getElementById('footer-map-section')
    if (mapSection) {
      observer.observe(mapSection)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // Don't render anything until intersection is detected
  if (!shouldLoad) {
    return (
      <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
        <div className="h-[200px] bg-muted/5" />
      </div>
    )
  }

  return <FooterMapEmbed embedUrl={embedUrl} linkUrl={linkUrl} />
}
