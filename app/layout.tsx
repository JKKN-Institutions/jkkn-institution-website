import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { WebVitalsReporter } from "@/components/performance/web-vitals-reporter";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: 'JKKN Group of Institutions',
  description:
    'JKKN Group of Institutions - A leading educational institution in Tamil Nadu offering undergraduate, postgraduate, and research programs in Engineering, Medical Sciences, Management, and Arts & Science since 1952.',
  keywords: [
    'JKKN',
    'JKKN Institution',
    'JKKN College',
    'Engineering College Tamil Nadu',
    'Medical College Namakkal',
    'Best College Komarapalayam',
    'Higher Education India',
    'NAAC A College',
  ],
  authors: [{ name: 'JKKN Group of Institutions' }],
  creator: 'JKKN Group of Institutions',
  publisher: 'JKKN Group of Institutions',
  metadataBase: new URL('https://jkkn.ac.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://jkkn.ac.in',
    siteName: 'JKKN Group of Institutions',
    title: 'JKKN Group of Institutions',
    description:
      'A leading educational institution in Tamil Nadu offering quality education since 1952. NAAC A accredited with 50,000+ alumni worldwide.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JKKN Group of Institutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JKKN Group of Institutions',
    description:
      'A leading educational institution in Tamil Nadu offering quality education since 1952.',
    images: ['/og-image.png'],
  },
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
