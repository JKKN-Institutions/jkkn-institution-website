'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import { useRef, useState, useEffect, useCallback } from 'react'
import {
  Images, Play, X, ChevronLeft, ChevronRight,
  Camera, Video, Filter, Calendar
} from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'

/**
 * Gallery item schema
 */
export const GalleryItemSchema = z.object({
  id: z.string().describe('Unique identifier'),
  type: z.enum(['image', 'video']).describe('Content type'),
  title: z.string().describe('Item title'),
  thumbnail: z.string().describe('Thumbnail image URL'),
  thumbnailAlt: z.string().default('').describe('Thumbnail alt text for accessibility'),
  fullSrc: z.string().describe('Full resolution image or video URL'),
  fullSrcAlt: z.string().default('').describe('Full image alt text for accessibility'),
  category: z.string().describe('Category name'),
  description: z.string().optional().describe('Optional description'),
  date: z.string().optional().describe('Date string'),
})

export type GalleryItem = z.infer<typeof GalleryItemSchema>

/**
 * GalleryPage props schema
 */
export const GalleryPagePropsSchema = z.object({
  // Header
  showHeader: z.boolean().default(true).describe('Show hero header section'),
  headerTitle: z.string().default('Gallery').describe('Main title'),
  headerSubtitle: z.string().optional().describe('Subtitle text'),
  headerPart1Color: z.string().default('#0b6d41').describe('Title color'),
  headerPart2Color: z.string().default('#ffde59').describe('Accent color'),

  // Gallery Items
  items: z.array(GalleryItemSchema).default([]).describe('Gallery items'),

  // Categories
  categories: z.array(z.string()).default(['All', 'Events', 'Campus', 'Students', 'Faculty']).describe('Filter categories'),
  showCategoryFilter: z.boolean().default(true).describe('Show category filter tabs'),

  // Layout
  columns: z.enum(['2', '3', '4']).default('4').describe('Number of columns on desktop'),
  gap: z.enum(['sm', 'md', 'lg']).default('md').describe('Gap between cards'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light']).default('modern-light').describe('Color scheme'),
  cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass').describe('Card style'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),

  // Features
  enableLightbox: z.boolean().default(true).describe('Enable lightbox modal'),
  enableVideoPlayback: z.boolean().default(true).describe('Enable inline video playback'),
})

export type GalleryPageProps = z.infer<typeof GalleryPagePropsSchema> & BaseBlockProps

/**
 * Default gallery items for demo
 */
const defaultGalleryItems: GalleryItem[] = [
  // Events
  { id: '1', type: 'image', title: 'Annual Day Celebration 2024', thumbnail: '', thumbnailAlt: '', fullSrc: '', fullSrcAlt: '', category: 'Events', date: 'Dec 2024' },
  { id: '2', type: 'image', title: 'Pongal Festival', thumbnail: '', thumbnailAlt: '', fullSrc: '', fullSrcAlt: '', category: 'Events', date: 'Jan 2025' },
  { id: '3', type: 'video', title: 'Founders Day Highlights', thumbnail: '', thumbnailAlt: '', fullSrc: '', fullSrcAlt: '', category: 'Events', date: 'Nov 2024' },
  { id: '4', type: 'image', title: 'Sports Day', thumbnail: '', thumbnailAlt: '', fullSrc: '', fullSrcAlt: '', category: 'Events', date: 'Feb 2025' },
  // Campus
  { id: '5', type: 'image', title: 'Main Campus Aerial View', thumbnail: '', thumbnailAlt: '', fullSrc: '', fullSrcAlt: '', category: 'Campus', date: '' },
  { id: '6', type: 'image', title: 'Library & Resource Center', thumbnail: '', thumbnailAlt: '', fullSrc: '', fullSrcAlt: '', category: 'Campus', date: '' },
  { id: '7', type: 'image', title: 'Modern Laboratories', thumbnail: '', thumbnailAlt: '', fullSrc: '', fullSrcAlt: '', category: 'Campus', date: '' },
  { id: '8', type: 'video', title: 'Campus Tour', thumbnail: '', thumbnailAlt: '', fullSrc: '', fullSrcAlt: '', category: 'Campus', date: '' },
  // Students
  { id: '9', type: 'image', title: 'Student Activities', thumbnail: '', thumbnailAlt: '', fullSrc: '', fullSrcAlt: '', category: 'Students', date: '' },
  { id: '10', type: 'image', title: 'Cultural Club', thumbnail: '', thumbnailAlt: '', fullSrc: '', fullSrcAlt: '', category: 'Students', date: '' },
  // Faculty
  { id: '11', type: 'image', title: 'Faculty Meet 2024', thumbnail: '', thumbnailAlt: '', fullSrc: '', fullSrcAlt: '', category: 'Faculty', date: '' },
  { id: '12', type: 'image', title: 'Research Symposium', thumbnail: '', thumbnailAlt: '', fullSrc: '', fullSrcAlt: '', category: 'Faculty', date: '' },
]

/**
 * Intersection Observer hook
 */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

/**
 * GalleryPage Component
 *
 * A comprehensive gallery page with:
 * - Hero section with brand styling
 * - Category filter tabs
 * - Uniform grid layout
 * - Lightbox modal for full-screen viewing
 * - Photo and video support
 * - Modern glassmorphism UI
 */
export function GalleryPage({
  showHeader = true,
  headerTitle = 'Gallery',
  headerSubtitle,
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#ffde59',
  items = [],
  categories = ['All', 'Events', 'Campus', 'Students', 'Faculty'],
  showCategoryFilter = true,
  columns = '4',
  gap = 'md',
  variant = 'modern-light',
  cardStyle = 'glass',
  showDecorations = true,
  enableLightbox = true,
  enableVideoPlayback = true,
  className,
  isEditing,
}: GalleryPageProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const headerRef = useInView()
  const contentRef = useInView()

  const isDark = variant === 'modern-dark'
  const displayItems = items.length > 0 ? items : defaultGalleryItems

  // Filter items by category
  const filteredItems = activeCategory === 'All'
    ? displayItems
    : displayItems.filter(item => item.category === activeCategory)

  // Gap classes
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  }

  // Column classes
  const columnClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  // Open lightbox
  const openLightbox = (item: GalleryItem) => {
    if (!enableLightbox || isEditing) return
    const index = filteredItems.findIndex(i => i.id === item.id)
    setLightboxIndex(index)
    setLightboxItem(item)
  }

  // Navigate lightbox
  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev'
      ? (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
      : (lightboxIndex + 1) % filteredItems.length
    setLightboxIndex(newIndex)
    setLightboxItem(filteredItems[newIndex])
  }, [lightboxIndex, filteredItems])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxItem) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null)
      if (e.key === 'ArrowLeft') navigateLightbox('prev')
      if (e.key === 'ArrowRight') navigateLightbox('next')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxItem, navigateLightbox])

  return (
    <>
      <section
        className={cn(
          'relative w-full overflow-hidden',
          isDark ? 'bg-brand-primary-darker' : 'bg-brand-cream',
          className
        )}
      >
        {/* Hero Header Section */}
        {showHeader && (
          <div
            ref={headerRef.ref}
            className={cn(
              'relative py-16 md:py-20 lg:py-24 overflow-hidden',
              'section-green-gradient'
            )}
          >
            {/* Decorative Patterns */}
            {showDecorations && (
              <DecorativePatterns variant="default" color="white" />
            )}

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={cn(
                  'text-center transition-all duration-700',
                  headerRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                )}
              >
                {/* Section Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-white/10 backdrop-blur-sm text-white">
                  <Images className="w-4 h-4" />
                  <span>Photo & Video Gallery</span>
                </div>

                {/* Title */}
                <h1 className="font-serif-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 uppercase">
                  <span className="text-white">{headerTitle.split(' ')[0]}</span>
                  {headerTitle.split(' ').length > 1 && (
                    <span style={{ color: headerPart2Color }}> {headerTitle.split(' ').slice(1).join(' ')}</span>
                  )}
                </h1>

                {/* Subtitle */}
                {headerSubtitle && (
                  <p className="text-lg md:text-xl max-w-3xl mx-auto text-white/80">
                    {headerSubtitle}
                  </p>
                )}

                {/* Stats */}
                <div className="flex justify-center gap-8 mt-8">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white">{displayItems.filter(i => i.type === 'image').length}</div>
                    <div className="text-sm text-white/70 flex items-center gap-1 justify-center">
                      <Camera className="w-4 h-4" /> Photos
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white">{displayItems.filter(i => i.type === 'video').length}</div>
                    <div className="text-sm text-white/70 flex items-center gap-1 justify-center">
                      <Video className="w-4 h-4" /> Videos
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 120" className="w-full h-12 md:h-16">
                <path
                  fill={isDark ? '#032816' : '#fbfbee'}
                  d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div
          ref={contentRef.ref}
          className={cn(
            'py-12 md:py-16 lg:py-20',
            isDark ? 'bg-brand-primary-darker' : 'bg-brand-cream'
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            {showCategoryFilter && (
              <div
                className={cn(
                  'mb-8 md:mb-12 transition-all duration-700 delay-100',
                  contentRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                )}
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Filter className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-brand-primary/60')} />
                  <span className={cn('text-sm font-medium', isDark ? 'text-white/60' : 'text-gray-600')}>
                    Filter by Category
                  </span>
                </div>

                {/* Filter Tabs - Horizontal Scroll on Mobile */}
                <div className="flex justify-start sm:justify-center overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                  <div className="flex gap-2 sm:gap-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300',
                          activeCategory === category
                            ? 'bg-[#ffde59] text-gray-900 shadow-lg'
                            : isDark
                              ? 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                              : 'bg-white/80 backdrop-blur-sm text-brand-primary hover:bg-white border border-brand-primary/20'
                        )}
                      >
                        {category}
                        {activeCategory === category && (
                          <span className="ml-2 text-xs bg-gray-900/20 px-2 py-0.5 rounded-full">
                            {category === 'All' ? displayItems.length : displayItems.filter(i => i.category === category).length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Gallery Grid */}
            <div
              className={cn(
                'grid transition-all duration-700 delay-200',
                columnClasses[columns],
                gapClasses[gap],
                contentRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              )}
            >
              {filteredItems.map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  cardStyle={cardStyle}
                  isDark={isDark}
                  onClick={() => openLightbox(item)}
                  index={index}
                  isInView={contentRef.isInView}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <div className={cn(
                'text-center py-16',
                isDark ? 'text-white/60' : 'text-gray-500'
              )}>
                <Images className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No items found in this category</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <LightboxModal
          item={lightboxItem}
          currentIndex={lightboxIndex}
          totalItems={filteredItems.length}
          onClose={() => setLightboxItem(null)}
          onPrev={() => navigateLightbox('prev')}
          onNext={() => navigateLightbox('next')}
          enableVideoPlayback={enableVideoPlayback}
        />
      )}
    </>
  )
}

/**
 * Gallery Card Component
 */
function GalleryCard({
  item,
  cardStyle,
  isDark,
  onClick,
  index,
  isInView,
}: {
  item: GalleryItem
  cardStyle: 'glass' | 'solid' | 'gradient'
  isDark: boolean
  onClick: () => void
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const cardClasses = {
    glass: isDark
      ? 'bg-white/10 backdrop-blur-md border border-white/20'
      : 'bg-white/80 backdrop-blur-md border border-white/50 shadow-lg',
    solid: isDark
      ? 'bg-gray-800 border border-gray-700'
      : 'bg-white border border-gray-200 shadow-lg',
    gradient: 'bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 backdrop-blur-md border border-white/20',
  }

  return (
    <div
      className={cn(
        'group rounded-2xl overflow-hidden cursor-pointer transition-all duration-500',
        cardClasses[cardStyle],
        'hover:-translate-y-2 hover:shadow-2xl',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.thumbnailAlt || item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-700',
              isHovered && 'scale-110'
            )}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-primary-dark">
            {item.type === 'video' ? (
              <Video className="w-12 h-12 text-white/30" />
            ) : (
              <Camera className="w-12 h-12 text-white/30" />
            )}
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
          }}
        />

        {/* Video Play Icon */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500',
                isHovered ? 'bg-white scale-110' : 'bg-white/90 scale-100'
              )}
            >
              <Play className="w-7 h-7 ml-1 text-brand-primary" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div
          className={cn(
            'absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold',
            'bg-[#ffde59] text-gray-900 shadow-lg'
          )}
        >
          {item.category}
        </div>

        {/* Type Badge */}
        <div
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center',
            'bg-white/20 backdrop-blur-sm'
          )}
        >
          {item.type === 'video' ? (
            <Video className="w-4 h-4 text-white" />
          ) : (
            <Camera className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Hover View Text */}
        <div
          className={cn(
            'absolute bottom-4 left-4 right-4 transition-all duration-500',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <span className="text-white font-semibold text-sm flex items-center gap-2">
            {item.type === 'video' ? 'Play Video' : 'View Photo'}
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className={cn(
          'font-semibold text-sm sm:text-base line-clamp-2 mb-1',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          {item.title}
        </h3>

        {item.date && (
          <p className={cn(
            'text-xs flex items-center gap-1',
            isDark ? 'text-white/60' : 'text-gray-500'
          )}>
            <Calendar className="w-3 h-3" />
            {item.date}
          </p>
        )}

        {/* Gold accent line on hover */}
        <div
          className={cn(
            'h-0.5 rounded-full mt-3 transition-all duration-500',
            isHovered ? 'w-full' : 'w-0'
          )}
          style={{ backgroundColor: '#ffde59' }}
        />
      </div>
    </div>
  )
}

/**
 * Lightbox Modal Component
 */
function LightboxModal({
  item,
  currentIndex,
  totalItems,
  onClose,
  onPrev,
  onNext,
  enableVideoPlayback,
}: {
  item: GalleryItem
  currentIndex: number
  totalItems: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  enableVideoPlayback: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
        {currentIndex + 1} / {totalItems}
      </div>

      {/* Navigation - Previous */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Navigation - Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Content */}
      <div
        className="relative w-full max-w-5xl max-h-[85vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'video' && enableVideoPlayback ? (
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
            {item.fullSrc ? (
              <iframe
                src={item.fullSrc}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Video className="w-16 h-16 text-white/30" />
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-[4/3] sm:aspect-video bg-black rounded-2xl overflow-hidden">
            {item.fullSrc || item.thumbnail ? (
              <Image
                src={item.fullSrc || item.thumbnail}
                alt={item.fullSrcAlt || item.thumbnailAlt || item.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-primary-dark">
                <Camera className="w-16 h-16 text-white/30" />
              </div>
            )}
          </div>
        )}

        {/* Caption */}
        <div className="mt-4 text-center">
          <h3 className="text-white font-semibold text-lg">{item.title}</h3>
          {item.description && (
            <p className="text-white/70 text-sm mt-1">{item.description}</p>
          )}
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="text-xs px-3 py-1 rounded-full bg-[#ffde59] text-gray-900 font-medium">
              {item.category}
            </span>
            {item.date && (
              <span className="text-white/60 text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {item.date}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GalleryPage
