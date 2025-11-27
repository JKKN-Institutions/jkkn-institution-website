'use client'

import { cn } from '@/lib/utils'
import { generateSerpPreview } from '@/lib/utils/seo-analyzer'
import { Globe, Twitter, Facebook, Search } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SeoPreviewProps {
  metaTitle: string | null
  metaDescription: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  twitterTitle: string | null
  twitterDescription: string | null
  twitterImage: string | null
  pageSlug: string
  siteUrl?: string
}

export function SeoPreview({
  metaTitle,
  metaDescription,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  pageSlug,
  siteUrl = 'https://jkkn.ac.in',
}: SeoPreviewProps) {
  const fullUrl = `${siteUrl}/${pageSlug}`
  const serp = generateSerpPreview(metaTitle, metaDescription, fullUrl)

  // Fallback logic for social previews
  const socialOgTitle = ogTitle || metaTitle || 'Page Title'
  const socialOgDescription = ogDescription || metaDescription || 'No description available'
  const socialTwitterTitle = twitterTitle || ogTitle || metaTitle || 'Page Title'
  const socialTwitterDescription = twitterDescription || ogDescription || metaDescription || 'No description available'
  const socialTwitterImage = twitterImage || ogImage

  return (
    <div className="space-y-4">
      <Tabs defaultValue="serp" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="serp" className="flex items-center gap-1.5 text-xs">
            <Search className="h-3 w-3" />
            Google
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-1.5 text-xs">
            <Facebook className="h-3 w-3" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center gap-1.5 text-xs">
            <Twitter className="h-3 w-3" />
            Twitter
          </TabsTrigger>
        </TabsList>

        {/* Google SERP Preview */}
        <TabsContent value="serp" className="mt-3">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="space-y-1">
              {/* URL breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Globe className="h-3.5 w-3.5 text-gray-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">jkkn.ac.in</span>
                  <span className="text-xs text-gray-400 truncate max-w-[250px]">
                    {serp.displayUrl}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3
                className={cn(
                  'text-lg leading-tight font-normal hover:underline cursor-pointer',
                  metaTitle ? 'text-[#1a0dab]' : 'text-gray-400 italic'
                )}
              >
                {serp.displayTitle}
              </h3>

              {/* Description */}
              <p
                className={cn(
                  'text-sm leading-relaxed',
                  metaDescription ? 'text-[#4d5156]' : 'text-gray-400 italic'
                )}
              >
                {serp.displayDescription}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            How this page might appear in Google search results
          </p>
        </TabsContent>

        {/* Facebook/Open Graph Preview */}
        <TabsContent value="facebook" className="mt-3">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Image area */}
            <div
              className={cn(
                'aspect-[1.91/1] w-full flex items-center justify-center',
                ogImage ? '' : 'bg-gray-100'
              )}
            >
              {ogImage ? (
                <img
                  src={ogImage}
                  alt="OG Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="flex flex-col items-center justify-center text-gray-400">
                        <svg class="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="text-sm">Image not found</span>
                      </div>
                    `
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">No OG image set</span>
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="p-3 bg-[#f2f3f5] border-t border-gray-200">
              <p className="text-xs text-[#606770] uppercase tracking-wide mb-1">
                jkkn.ac.in
              </p>
              <h4 className={cn(
                'font-semibold text-[#1d2129] line-clamp-2 leading-tight',
                !ogTitle && !metaTitle && 'text-gray-400 italic'
              )}>
                {socialOgTitle}
              </h4>
              <p className={cn(
                'text-sm text-[#606770] line-clamp-2 mt-0.5',
                !ogDescription && !metaDescription && 'text-gray-400 italic'
              )}>
                {socialOgDescription}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            How this page appears when shared on Facebook
          </p>
        </TabsContent>

        {/* Twitter Card Preview */}
        <TabsContent value="twitter" className="mt-3">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Image area (summary_large_image) */}
            <div
              className={cn(
                'aspect-[2/1] w-full flex items-center justify-center',
                socialTwitterImage ? '' : 'bg-gray-100'
              )}
            >
              {socialTwitterImage ? (
                <img
                  src={socialTwitterImage}
                  alt="Twitter Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="flex flex-col items-center justify-center text-gray-400">
                        <svg class="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="text-sm">Image not found</span>
                      </div>
                    `
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">No Twitter image set</span>
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="p-3">
              <h4 className={cn(
                'font-semibold text-[#0f1419] line-clamp-2 leading-tight',
                !twitterTitle && !ogTitle && !metaTitle && 'text-gray-400 italic'
              )}>
                {socialTwitterTitle}
              </h4>
              <p className={cn(
                'text-sm text-[#536471] line-clamp-2 mt-0.5',
                !twitterDescription && !ogDescription && !metaDescription && 'text-gray-400 italic'
              )}>
                {socialTwitterDescription}
              </p>
              <p className="text-sm text-[#536471] mt-1 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                jkkn.ac.in
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            How this page appears when shared on Twitter/X
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
