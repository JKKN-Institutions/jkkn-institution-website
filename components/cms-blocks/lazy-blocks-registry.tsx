/**
 * Lazy-Loaded CMS Blocks Registry
 *
 * Heavy CMS blocks are dynamically imported to reduce initial bundle size.
 * This is especially important for blocks that aren't visible above the fold.
 *
 * Bundle savings: ~50-100KB depending on page content
 */

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Block skeletons
function HeroSkeleton() {
  return <Skeleton className="h-[600px] w-full" />
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

function ChartSkeleton() {
  return <Skeleton className="h-[400px] w-full" />
}

// Lazy load heavy blocks

// Image Gallery - Heavy component with Lightbox
export const LazyImageGallery = dynamic(
  () => import('./media/image-gallery'),
  {
    loading: () => <GallerySkeleton />,
    ssr: true // Keep SSR for SEO
  }
)

// Google Drive Video Embed - Heavy iframe embed
export const LazyGoogleDriveVideo = dynamic(
  () => import('./media/google-drive-video'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false // Videos don't need SSR
  }
)

// Progressive Video Player - Heavy video player with controls
export const LazyProgressiveVideoPlayer = dynamic(
  () => import('./media/progressive-video-player'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false // Videos don't need SSR
  }
)

// Admission Inquiry Form - Heavy form with validation
export const LazyAdmissionInquiryForm = dynamic(
  () => import('./content/admission-inquiry-form'),
  {
    loading: () => <FormSkeleton />,
    ssr: true // Forms need SSR for accessibility
  }
)

export const LazyModernHeroSection = dynamic(
  () => import('./content/modern-hero-section'),
  {
    loading: () => <HeroSkeleton />,
    ssr: true // Hero needs SSR for LCP
  }
)

export const LazyModernBentoGrid = dynamic(
  () => import('./content/modern-bento-grid'),
  {
    loading: () => <Skeleton className="h-[600px] w-full" />,
    ssr: true
  }
)

// Map component names to lazy-loaded components
export const lazyBlocksRegistry = {
  'ImageGallery': LazyImageGallery,
  'GoogleDriveVideo': LazyGoogleDriveVideo,
  'ProgressiveVideoPlayer': LazyProgressiveVideoPlayer,
  'AdmissionInquiryForm': LazyAdmissionInquiryForm,
  'ModernHeroSection': LazyModernHeroSection,
  'ModernBentoGrid': LazyModernBentoGrid,
} as const

// Type for lazy block names
export type LazyBlockName = keyof typeof lazyBlocksRegistry

// Check if a block should be lazy loaded
export function isLazyBlock(componentName: string): componentName is LazyBlockName {
  return componentName in lazyBlocksRegistry
}
