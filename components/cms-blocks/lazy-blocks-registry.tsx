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
// TODO: Create gallery-block component
// export const LazyGallery = dynamic(
//   () => import('./media/gallery-block').then(mod => ({ default: mod.GalleryBlock })),
//   {
//     loading: () => <GallerySkeleton />,
//     ssr: true // Keep SSR for SEO
//   }
// )

// TODO: Create video-embed-block component
// export const LazyVideoEmbed = dynamic(
//   () => import('./media/video-embed-block').then(mod => ({ default: mod.VideoEmbedBlock })),
//   {
//     loading: () => <Skeleton className="h-[400px] w-full" />,
//     ssr: false // Videos don't need SSR
//   }
// )

// TODO: Create contact-form-block component
// export const LazyContactForm = dynamic(
//   () => import('./forms/contact-form-block').then(mod => ({ default: mod.ContactFormBlock })),
//   {
//     loading: () => <FormSkeleton />,
//     ssr: true
//   }
// )

// TODO: Create data-visualization-block component
// export const LazyDataVisualization = dynamic(
//   () => import('./data/data-visualization-block').then(mod => ({ default: mod.DataVisualizationBlock })),
//   {
//     loading: () => <ChartSkeleton />,
//     ssr: false // Charts don't need SSR
//   }
// )

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
  // 'GalleryBlock': LazyGallery, // TODO: Create gallery-block component
  // 'VideoEmbedBlock': LazyVideoEmbed, // TODO: Create video-embed-block component
  // 'ContactFormBlock': LazyContactForm, // TODO: Create contact-form-block component
  // 'DataVisualizationBlock': LazyDataVisualization, // TODO: Create data-visualization-block component
  'ModernHeroSection': LazyModernHeroSection,
  'ModernBentoGrid': LazyModernBentoGrid,
} as const

// Type for lazy block names
export type LazyBlockName = keyof typeof lazyBlocksRegistry

// Check if a block should be lazy loaded
export function isLazyBlock(componentName: string): componentName is LazyBlockName {
  return componentName in lazyBlocksRegistry
}
