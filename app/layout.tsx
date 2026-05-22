import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { WebVitalsReporter } from "@/components/performance/web-vitals-reporter";
import { WebMCPProvider } from "@/components/webmcp-provider";
import { generateOrganizationSchema, serializeSchema } from "@/lib/seo";
import { generateSiteMetadata } from "@/lib/seo/site-metadata";
import { VideoSchema } from "@/components/seo/video-schema";
import { getGoogleSiteVerification } from "@/lib/seo/institution-seo-config";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  adjustFontFallback: true,
  preload: true,
});

/**
 * Dynamic metadata generation for multi-tenant SEO
 *
 * This function reads SEO settings from:
 * 1. Institution's Supabase database (settings table)
 * 2. Environment variables (NEXT_PUBLIC_INSTITUTION_NAME, etc.)
 *
 * Each Vercel deployment connects to its own Supabase project,
 * so each institution gets its own SEO configuration automatically.
 */
export async function generateMetadata(): Promise<Metadata> {
  // Get institution-specific metadata from database/environment
  const siteMetadata = await generateSiteMetadata()

  // Get site URL from environment (institution-specific)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jkkn.ac.in'

  // Get institution-specific Google verification code
  const googleVerification = getGoogleSiteVerification()

  return {
    // Base metadata from site settings
    ...siteMetadata,

    // Metadata base for proper relative URL resolution
    metadataBase: new URL(siteUrl),

    // Enhanced robots configuration
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // OpenGraph enhancements
    openGraph: {
      ...siteMetadata.openGraph,
      locale: 'en_IN',
      url: siteUrl,
      images: siteMetadata.openGraph?.images || [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: siteMetadata.title?.toString() || 'JKKN Institution',
        },
      ],
    },

    // Twitter enhancements
    twitter: {
      ...siteMetadata.twitter,
      images: siteMetadata.twitter?.images || ['/og-image.png'],
    },

    // hreflang alternates — signals English (India) as primary language
    alternates: {
      canonical: siteUrl,
      languages: {
        'en-IN': siteUrl,
        'x-default': siteUrl,
      },
    },

    // Google Search Console verification — per-institution from config
    verification: googleVerification ? { google: googleVerification } : undefined,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseOrigin = (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pmqodbfhsejbvfbmsfeq.supabase.co').origin
    } catch {
      return 'https://pmqodbfhsejbvfbmsfeq.supabase.co'
    }
  })()

  return (
    <html lang="en" className="light" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Preconnect to Supabase CDN for faster LCP - institution-specific */}
        <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={supabaseOrigin} />
        {/* Preconnect to Facebook CDN (for deferred Meta Pixel) */}
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {/* YouTube image CDN prefetch (used in video thumbnails and embeds) */}
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        {/* Instagram CDN prefetch (used in social feeds) */}
        <link rel="dns-prefetch" href="https://cdninstagram.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        {/* Google Fonts preconnect removed — next/font self-hosts fonts in /_next/static/media/ */}
        {/* Organization Schema (JSON-LD) — SINGLE source, multi-tenant aware */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeSchema(generateOrganizationSchema()),
          }}
        />
        {/* Video Schema (JSON-LD) - Only renders on main institution */}
        <VideoSchema />
      </head>
      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
        <WebMCPProvider />
        <Providers>{children}</Providers>
        <WebVitalsReporter />
      </body>
    </html>
  );
}
