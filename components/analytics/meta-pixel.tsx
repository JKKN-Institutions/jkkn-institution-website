'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'
import { getMetaPixelId } from '@/lib/seo/institution-seo-config'

/**
 * Meta Pixel — Multi-Tenant Aware, Optimized for Core Web Vitals (INP)
 *
 * Resolves Pixel ID via getMetaPixelId() which reads the per-institution
 * config (NEXT_PUBLIC_INSTITUTION_ID), then falls back to NEXT_PUBLIC_META_PIXEL_ID.
 * Returns undefined if neither is set, so the pixel is fully skipped.
 *
 * Defers loading until user interaction or 5 seconds after page load
 * to reduce main thread blocking during initial page render.
 */
const META_PIXEL_ID = getMetaPixelId()

export function MetaPixel() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Skip if no pixel ID configured
    if (!META_PIXEL_ID) return

    // Load after 5 seconds of idle time
    const timer = setTimeout(() => setShouldLoad(true), 5000)

    // Or load immediately on first user interaction
    const handleInteraction = () => {
      setShouldLoad(true)
    }

    window.addEventListener('scroll', handleInteraction, { once: true, passive: true })
    window.addEventListener('click', handleInteraction, { once: true })
    window.addEventListener('keydown', handleInteraction, { once: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  // Don't render anything if no pixel ID
  if (!META_PIXEL_ID) {
    return null
  }

  // Don't render anything until ready to load
  if (!shouldLoad) {
    return (
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    )
  }

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="lazyOnload"
      >
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
