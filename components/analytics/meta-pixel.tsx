'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'

const META_PIXEL_ID = '779817005468177'

/**
 * MetaPixel - Optimized for Core Web Vitals (INP)
 *
 * Defers loading until user interaction or 5 seconds after page load
 * to reduce main thread blocking during initial page render.
 * Facebook Pixel was causing 252ms main thread time during page load.
 */
export function MetaPixel() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
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
