'use client'

import { useEffect, useState } from 'react'
import FooterMapEmbed from './footer-map-embed'

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
