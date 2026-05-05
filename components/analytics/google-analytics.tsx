'use client'

import Script from 'next/script'
import { getGAMeasurementId } from '@/lib/seo/institution-seo-config'

/**
 * Google Analytics 4 — Multi-Tenant Aware
 *
 * Resolves GA measurement ID via getGAMeasurementId() which reads the
 * per-institution config (NEXT_PUBLIC_INSTITUTION_ID), then falls back
 * to NEXT_PUBLIC_GA_MEASUREMENT_ID. Returns undefined if neither is set,
 * so analytics is fully skipped — no cross-institution data pollution.
 */
const GA_MEASUREMENT_ID = getGAMeasurementId()

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
