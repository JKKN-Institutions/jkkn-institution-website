/**
 * Dynamic OG Image Generation — Multi-Tenant Aware
 *
 * Generates institution-branded Open Graph images using Next.js ImageResponse.
 * Each institution gets its own branded OG image with correct name and colors.
 *
 * This serves as the fallback OG image for all pages that don't have
 * a custom og_image set in their CMS SEO metadata.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */

import { ImageResponse } from 'next/og'

export const alt = 'JKKN Institutions'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const runtime = 'edge'

// Institution-specific branding
const INSTITUTION_BRANDING: Record<string, {
  name: string
  tagline: string
  primaryColor: string
  secondaryColor: string
}> = {
  main: {
    name: 'JKKN Institutions',
    tagline: 'Excellence in Education Since 1952',
    primaryColor: '#1e3a8a',
    secondaryColor: '#3b82f6',
  },
  engineering: {
    name: 'JKKN College of Engineering',
    tagline: 'AICTE Approved | Anna University Affiliated',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
  },
  dental: {
    name: 'JKKN Dental College & Hospital',
    tagline: 'DCI Recognized | MGR Medical University',
    primaryColor: '#0d9488',
    secondaryColor: '#14b8a6',
  },
  pharmacy: {
    name: 'JKKN College of Pharmacy',
    tagline: 'PCI Approved | AICTE Accredited',
    primaryColor: '#166534',
    secondaryColor: '#22c55e',
  },
  nursing: {
    name: 'Sresakthimayeil Institute of Nursing',
    tagline: 'INC Recognized | MGR Medical University',
    primaryColor: '#be185d',
    secondaryColor: '#ec4899',
  },
  'arts-science': {
    name: 'JKKN College of Arts & Science',
    tagline: 'Autonomous | Periyar University Affiliated',
    primaryColor: '#166534',
    secondaryColor: '#22c55e',
  },
}

export default function OGImage() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const branding = INSTITUTION_BRANDING[institutionId] || INSTITUTION_BRANDING.main

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: 'white',
          padding: '60px',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.15)',
            marginBottom: '32px',
            fontSize: '48px',
            fontWeight: 700,
          }}
        >
          JKKN
        </div>

        {/* Institution name */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '900px',
            marginBottom: '16px',
          }}
        >
          {branding.name}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '24px',
            fontWeight: 400,
            textAlign: 'center',
            opacity: 0.9,
            maxWidth: '800px',
            marginBottom: '40px',
          }}
        >
          {branding.tagline}
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            gap: '48px',
            padding: '20px 40px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.12)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>50+</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Programs</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>92%+</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Placement</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>74+</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Years</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>NAAC A</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Accredited</div>
          </div>
        </div>

        {/* Location */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '16px',
            opacity: 0.7,
          }}
        >
          Komarapalayam, Tamil Nadu | Near Erode | NH-544
        </div>
      </div>
    ),
    { ...size }
  )
}
