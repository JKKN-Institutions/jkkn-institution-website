'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import {
  BookOpen,
  Clock,
  Phone,
  User,
  GraduationCap,
  BookMarked,
  Newspaper,
  Globe,
  Database,
  Wifi,
  Library,
  Printer,
  Monitor,
  CheckCircle2,
} from 'lucide-react'

/**
 * Content paragraph schema
 */
export const ContentParagraphSchema = z.object({
  text: z.string(),
})

export type ContentParagraph = z.infer<typeof ContentParagraphSchema>

/**
 * Resource item schema
 */
export const ResourceItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.string().optional(),
})

export type ResourceItem = z.infer<typeof ResourceItemSchema>

/**
 * Section item schema
 */
export const SectionItemSchema = z.object({
  title: z.string(),
  icon: z.string().optional(),
})

export type SectionItem = z.infer<typeof SectionItemSchema>

/**
 * Service item schema
 */
export const ServiceItemSchema = z.object({
  title: z.string(),
  icon: z.string().optional(),
})

export type ServiceItem = z.infer<typeof ServiceItemSchema>

/**
 * Librarian schema
 */
export const LibrarianSchema = z.object({
  name: z.string(),
  qualification: z.string(),
  phone: z.string(),
})

export type Librarian = z.infer<typeof LibrarianSchema>

/**
 * LibraryPage props schema
 */
export const LibraryPagePropsSchema = z.object({
  // Header
  showHeader: z.boolean().default(true),
  headerTitle: z.string().default('LIBRARY'),
  headerSubtitle: z.string().default('LIBRARY AND INFORMATION RESOURCES CENTRE'),

  // Introduction paragraphs
  paragraphs: z.array(ContentParagraphSchema).default([]),

  // Operating hours
  timing: z.string().optional(),

  // Resources statistics
  showResources: z.boolean().default(true),
  resourcesTitle: z.string().default('LIBRARY RESOURCES'),
  resources: z.array(ResourceItemSchema).default([]),

  // Library sections
  showSections: z.boolean().default(true),
  sectionsTitle: z.string().default('LIBRARY SECTIONS'),
  sections: z.array(SectionItemSchema).default([]),

  // Other services
  showServices: z.boolean().default(true),
  servicesTitle: z.string().default('OTHER SERVICES'),
  services: z.array(ServiceItemSchema).default([]),

  // Contact information
  showContact: z.boolean().default(true),
  contactTitle: z.string().default('CONTACT US'),
  librarian: LibrarianSchema.optional(),

  // Styling
  variant: z.enum(['modern-light', 'modern-dark']).default('modern-light'),
  cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
  showDecorations: z.boolean().default(true),
})

export type LibraryPageProps = z.infer<typeof LibraryPagePropsSchema> & BaseBlockProps

/**
 * Default content paragraphs (Engineering College)
 */
const defaultParagraphs: ContentParagraph[] = [
  {
    text: 'The library covers a wide range of subjects in Science, Humanities, Engineering, Management, Computer Applications, etc. The library is well equipped with infrastructure. With 175 seating capacity, 30 Mbps high-speed internet and CCTV surveillance are available. The library is automated using Koha software.',
  },
  {
    text: 'All the students and faculty can access online catalog, OPAC. The library uses barcode technology for its circulation and stock verification. The central collection represents a relatively small library. Special collection areas include Women\'s Studies, Total Quality Management, Competitive Exams etc., with special emphasis on local area studies.',
  },
  {
    text: 'JKKN library offers 6500 E-Journals through DELNET, E-GATE, NPTEL, NDL, SWAYAM, the online digital library. All books are covered with RFID tag. The library is open from 8:30 A.M. to 6:00 P.M. on all working days.',
  },
]

/**
 * Default resources (Engineering College)
 */
const defaultResources: ResourceItem[] = [
  { label: 'Volumes', value: '26,505', icon: 'BookOpen' },
  { label: 'Titles', value: '4,949', icon: 'BookMarked' },
  { label: 'Journals', value: '29', icon: 'Newspaper' },
  { label: 'E-Journals', value: '6,533', icon: 'Globe' },
  { label: 'Magazines', value: '25', icon: 'Newspaper' },
  { label: 'News Paper', value: '03', icon: 'Newspaper' },
  { label: 'Software', value: 'Koha', icon: 'Database' },
  { label: 'Internet Speed', value: '500 Mbps', icon: 'Wifi' },
  { label: 'E-Resources & Delnet', value: 'Available', icon: 'Globe' },
]

/**
 * Default sections (Engineering College)
 */
const defaultSections: SectionItem[] = [
  { title: 'Reference Books Section', icon: 'BookMarked' },
  { title: 'Circulation Section', icon: 'Library' },
  { title: 'Journals Section', icon: 'Newspaper' },
]

/**
 * Default services (Engineering College)
 */
const defaultServices: ServiceItem[] = [
  { title: 'Reprographic Service', icon: 'Printer' },
  { title: 'Digital Library', icon: 'Monitor' },
]

/**
 * Default librarian
 */
const defaultLibrarian: Librarian = {
  name: 'M. MUHAMMAD NAZAR',
  qualification: 'B.Sc., M.L.I.S., M.Phil.',
  phone: '9443472294',
}

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
 * Get icon component by name
 */
function getIconComponent(iconName: string) {
  const icons: Record<string, typeof BookOpen> = {
    BookOpen,
    BookMarked,
    Newspaper,
    Globe,
    Database,
    Wifi,
    Library,
    Printer,
    Monitor,
    Clock,
    Phone,
    User,
    GraduationCap,
    CheckCircle2,
  }
  return icons[iconName] || CheckCircle2
}

/**
 * LibraryPage Component
 */
export default function LibraryPage({
  showHeader = true,
  headerTitle = 'LIBRARY',
  headerSubtitle = 'LIBRARY AND INFORMATION RESOURCES CENTRE',
  paragraphs = defaultParagraphs,
  timing,
  showResources = true,
  resourcesTitle = 'LIBRARY RESOURCES',
  resources = defaultResources,
  showSections = true,
  sectionsTitle = 'LIBRARY SECTIONS',
  sections = defaultSections,
  showServices = true,
  servicesTitle = 'OTHER SERVICES',
  services = defaultServices,
  showContact = true,
  contactTitle = 'CONTACT US',
  librarian = defaultLibrarian,
  variant = 'modern-light',
  cardStyle = 'glass',
  showDecorations = true,
  className,
}: LibraryPageProps) {
  const { ref: headerRef, isInView: headerInView } = useInView(0.1)
  const { ref: contentRef, isInView: contentInView } = useInView(0.1)
  const { ref: resourcesRef, isInView: resourcesInView } = useInView(0.1)
  const { ref: sectionsRef, isInView: sectionsInView } = useInView(0.1)
  const { ref: servicesRef, isInView: servicesInView } = useInView(0.1)
  const { ref: contactRef, isInView: contactInView } = useInView(0.1)
  const isDark = variant === 'modern-dark'

  const displayParagraphs = paragraphs.length > 0 ? paragraphs : defaultParagraphs
  const displayResources = resources.length > 0 ? resources : defaultResources
  const displaySections = sections.length > 0 ? sections : defaultSections
  const displayServices = services.length > 0 ? services : defaultServices
  const displayLibrarian = librarian || defaultLibrarian

  const cardStyles = {
    glass: cn(
      'backdrop-blur-md border',
      isDark
        ? 'bg-white/10 border-white/20'
        : 'bg-white/80 border-white/40 shadow-lg'
    ),
    solid: cn(
      isDark
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200 shadow-lg'
    ),
    gradient: cn(
      'border',
      isDark
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg'
    ),
  }

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        isDark ? 'bg-gray-900' : 'bg-[#fbfbee]',
        className
      )}
    >
      {/* Background Decorations */}
      {showDecorations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient overlay */}
          <div
            className={cn(
              'absolute top-0 left-0 w-full h-96',
              'bg-gradient-to-b',
              isDark
                ? 'from-[#0b6d41]/20 to-transparent'
                : 'from-[#0b6d41]/10 to-transparent'
            )}
          />

          {/* Decorative circles */}
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#ffde59]/10 blur-3xl" />
          <div className="absolute top-96 left-10 w-48 h-48 rounded-full bg-[#0b6d41]/10 blur-3xl" />
          <div className="absolute bottom-40 right-20 w-56 h-56 rounded-full bg-[#ffde59]/5 blur-3xl" />
        </div>
      )}

      {/* Hero Header */}
      {showHeader && (
        <div
          ref={headerRef}
          className={cn(
            'relative py-16 md:py-24',
            'bg-gradient-to-br from-[#0b6d41] via-[#0a5c37] to-[#084d2d]'
          )}
        >
          {/* Header decorations */}
          {showDecorations && (
            <>
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/5" />
              <div className="absolute bottom-10 right-20 w-24 h-24 rounded-full bg-[#ffde59]/10" />
              <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full bg-white/5" />
            </>
          )}

          <div className="container mx-auto px-4 relative z-10">
            <div
              className={cn(
                'max-w-4xl mx-auto text-center transition-all duration-700',
                headerInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {headerTitle}
              </h1>

              {/* Subtitle */}
              {headerSubtitle && (
                <p className="text-lg md:text-xl text-white/80">
                  {headerSubtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction Card */}
          <div
            ref={contentRef}
            className={cn(
              'p-6 md:p-8 rounded-2xl transition-all duration-700',
              cardStyles[cardStyle],
              contentInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            )}
          >
            <div className="space-y-6">
              {displayParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={cn(
                    'text-base md:text-lg leading-relaxed',
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  )}
                >
                  {paragraph.text}
                </p>
              ))}

              {/* Operating Hours */}
              {timing && (
                <div className={cn(
                  'flex items-center gap-3 pt-4 border-t',
                  isDark ? 'border-white/10' : 'border-gray-200'
                )}>
                  <div className="w-10 h-10 rounded-lg bg-[#0b6d41]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#0b6d41]" />
                  </div>
                  <div>
                    <p className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-white/60' : 'text-gray-500'
                    )}>
                      Operating Hours
                    </p>
                    <p className={cn(
                      'text-base font-semibold',
                      isDark ? 'text-white' : 'text-[#0b6d41]'
                    )}>
                      {timing}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resources Section */}
          {showResources && displayResources.length > 0 && (
            <div
              ref={resourcesRef}
              className={cn(
                'p-6 md:p-8 rounded-2xl transition-all duration-700',
                cardStyles[cardStyle],
                resourcesInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: '100ms' }}
            >
              {/* Resources Title */}
              <h2
                className={cn(
                  'text-xl md:text-2xl font-bold mb-6',
                  isDark ? 'text-white' : 'text-[#0b6d41]'
                )}
              >
                {resourcesTitle}
              </h2>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayResources.map((resource, index) => {
                  const IconComponent = getIconComponent(resource.icon || 'BookOpen')
                  return (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center gap-4 p-3 rounded-xl',
                        isDark ? 'bg-white/5' : 'bg-[#0b6d41]/5'
                      )}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                          'bg-[#0b6d41]/10'
                        )}
                      >
                        <IconComponent className="w-5 h-5 text-[#0b6d41]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm',
                          isDark ? 'text-white/60' : 'text-gray-500'
                        )}>
                          {resource.label}
                        </p>
                        <p className={cn(
                          'text-base font-semibold truncate',
                          isDark ? 'text-white' : 'text-gray-900'
                        )}>
                          {resource.value || '—'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Two Column Layout for Sections and Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sections Card */}
            {showSections && displaySections.length > 0 && (
              <div
                ref={sectionsRef}
                className={cn(
                  'p-6 md:p-8 rounded-2xl transition-all duration-700',
                  cardStyles[cardStyle],
                  sectionsInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: '200ms' }}
              >
                {/* Sections Title */}
                <h2
                  className={cn(
                    'text-xl md:text-2xl font-bold mb-6',
                    isDark ? 'text-white' : 'text-[#0b6d41]'
                  )}
                >
                  {sectionsTitle}
                </h2>

                {/* Sections List */}
                <ul className="space-y-3">
                  {displaySections.map((section, index) => {
                    const IconComponent = getIconComponent(section.icon || 'CheckCircle2')
                    return (
                      <li
                        key={index}
                        className={cn(
                          'flex items-center gap-3',
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        )}
                      >
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                            'bg-[#0b6d41]/10'
                          )}
                        >
                          <IconComponent className="w-4 h-4 text-[#0b6d41]" />
                        </div>
                        <span className="text-base">{section.title}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Services Card */}
            {showServices && displayServices.length > 0 && (
              <div
                ref={servicesRef}
                className={cn(
                  'p-6 md:p-8 rounded-2xl transition-all duration-700',
                  cardStyles[cardStyle],
                  servicesInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: '300ms' }}
              >
                {/* Services Title */}
                <h2
                  className={cn(
                    'text-xl md:text-2xl font-bold mb-6',
                    isDark ? 'text-white' : 'text-[#0b6d41]'
                  )}
                >
                  {servicesTitle}
                </h2>

                {/* Services List */}
                <ul className="space-y-3">
                  {displayServices.map((service, index) => {
                    const IconComponent = getIconComponent(service.icon || 'CheckCircle2')
                    return (
                      <li
                        key={index}
                        className={cn(
                          'flex items-center gap-3',
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        )}
                      >
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                            'bg-[#0b6d41]/10'
                          )}
                        >
                          <IconComponent className="w-4 h-4 text-[#0b6d41]" />
                        </div>
                        <span className="text-base">{service.title}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Contact Card */}
          {showContact && displayLibrarian && (
            <div
              ref={contactRef}
              className={cn(
                'p-6 md:p-8 rounded-2xl transition-all duration-700',
                cardStyles[cardStyle],
                contactInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: '400ms' }}
            >
              {/* Contact Title */}
              <h2
                className={cn(
                  'text-xl md:text-2xl font-bold mb-6',
                  isDark ? 'text-white' : 'text-[#0b6d41]'
                )}
              >
                {contactTitle}
              </h2>

              {/* Librarian Details */}
              <div className={cn(
                'p-4 rounded-xl',
                isDark ? 'bg-white/5' : 'bg-[#0b6d41]/5'
              )}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-[#0b6d41]/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-[#0b6d41]" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className={cn(
                        'text-sm',
                        isDark ? 'text-white/60' : 'text-gray-500'
                      )}>
                        Librarian
                      </p>
                      <p className={cn(
                        'text-lg font-bold',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}>
                        {displayLibrarian.name}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {/* Qualification */}
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#0b6d41]" />
                        <span className={cn(
                          'text-sm',
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        )}>
                          {displayLibrarian.qualification}
                        </span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#0b6d41]" />
                        <a
                          href={`tel:${displayLibrarian.phone}`}
                          className={cn(
                            'text-sm hover:underline',
                            isDark ? 'text-white' : 'text-[#0b6d41]'
                          )}
                        >
                          {displayLibrarian.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
