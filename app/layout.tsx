import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { WebVitalsReporter } from "@/components/performance/web-vitals-reporter";
import { generateOrganizationSchema, serializeSchema } from "@/lib/seo";
import { generateSiteMetadata } from "@/lib/seo/site-metadata";
import { VideoSchema } from "@/components/seo/video-schema";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'

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

    // Google Search Console verification
    verification: {
      google: 'y27BHDBypTLPOsApWrsud0u-UDAAT62rIvfM46VcID8',
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Supabase CDN for faster LCP - with crossOrigin for CORS */}
        <link rel="preconnect" href="https://pmqodbfhsejbvfbmsfeq.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pmqodbfhsejbvfbmsfeq.supabase.co" />
        {/* Preconnect to Facebook CDN (for deferred Meta Pixel) */}
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Organization Schema (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeSchema(generateOrganizationSchema()),
          }}
        />
        {/* Video Schema (JSON-LD) - Campus Overview */}
        <VideoSchema />
      </head>
      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
        <WebVitalsReporter />
      </body>
    </html>
  );
}
