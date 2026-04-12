'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
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
 * Schemas
 */
export const ContentParagraphSchema = z.object({ text: z.string() })
export type ContentParagraph = z.infer<typeof ContentParagraphSchema>

export const ResourceItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.string().optional(),
})
export type ResourceItem = z.infer<typeof ResourceItemSchema>

export const SectionItemSchema = z.object({ title: z.string(), icon: z.string().optional() })
export type SectionItem = z.infer<typeof SectionItemSchema>

export const ServiceItemSchema = z.object({ title: z.string(), icon: z.string().optional() })
export type ServiceItem = z.infer<typeof ServiceItemSchema>

export const LibrarianSchema = z.object({
  name: z.string(),
  qualification: z.string(),
  phone: z.string(),
})
export type Librarian = z.infer<typeof LibrarianSchema>

export const LibraryPagePropsSchema = z.object({
  showHeader: z.boolean().default(true),
  headerTitle: z.string().default('LIBRARY'),
  headerSubtitle: z.string().default('LIBRARY AND INFORMATION RESOURCES CENTRE'),
  images: z.array(z.object({ src: z.string(), alt: z.string().optional() })).default([]),
  paragraphs: z.array(ContentParagraphSchema).default([]),
  timing: z.string().optional(),
  showResources: z.boolean().default(true),
  resourcesTitle: z.string().default('LIBRARY RESOURCES'),
  resources: z.array(ResourceItemSchema).default([]),
  showSections: z.boolean().default(true),
  sectionsTitle: z.string().default('LIBRARY SECTIONS'),
  sections: z.array(SectionItemSchema).default([]),
  showServices: z.boolean().default(true),
  servicesTitle: z.string().default('OTHER SERVICES'),
  services: z.array(ServiceItemSchema).default([]),
  showContact: z.boolean().default(true),
  contactTitle: z.string().default('CONTACT US'),
  librarian: LibrarianSchema.optional(),
  variant: z.enum(['modern-light', 'modern-dark']).default('modern-light'),
  cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
  showDecorations: z.boolean().default(true),
})

export type LibraryPageProps = z.infer<typeof LibraryPagePropsSchema> & BaseBlockProps

const defaultParagraphs: ContentParagraph[] = [
  { text: 'The library covers a wide range of subjects in Science, Humanities, Engineering, Management, Computer Applications, etc. The library is well equipped with infrastructure. With 175 seating capacity, 30 Mbps high-speed internet and CCTV surveillance are available. The library is automated using Koha software.' },
  { text: 'All the students and faculty can access online catalog, OPAC. The library uses barcode technology for its circulation and stock verification.' },
  { text: 'JKKN library offers 6500 E-Journals through DELNET, E-GATE, NPTEL, NDL, SWAYAM, the online digital library. All books are covered with RFID tag. The library is open from 8:30 A.M. to 6:00 P.M. on all working days.' },
]

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

const defaultSections: SectionItem[] = [
  { title: 'Reference Books Section', icon: 'BookMarked' },
  { title: 'Circulation Section', icon: 'Library' },
  { title: 'Journals Section', icon: 'Newspaper' },
]

const defaultServices: ServiceItem[] = [
  { title: 'Reprographic Service', icon: 'Printer' },
  { title: 'Digital Library', icon: 'Monitor' },
]

const defaultLibrarian: Librarian = {
  name: 'M. MUHAMMAD NAZAR',
  qualification: 'B.Sc., M.L.I.S., M.Phil.',
  phone: '9443472294',
}

function getIconComponent(iconName: string) {
  const icons: Record<string, typeof BookOpen> = {
    BookOpen, BookMarked, Newspaper, Globe, Database, Wifi,
    Library, Printer, Monitor, Clock, Phone, User, GraduationCap, CheckCircle2,
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
  images = [],
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
  className,
}: LibraryPageProps) {
  const displayParagraphs = paragraphs?.length > 0 ? paragraphs : defaultParagraphs
  const displayResources = resources?.length > 0 ? resources : defaultResources
  const displaySections = sections?.length > 0 ? sections : defaultSections
  const displayServices = services?.length > 0 ? services : defaultServices
  const displayLibrarian = librarian || defaultLibrarian
  const filteredImages = images.filter((img) => img.src)

  return (
    <section className={cn('relative w-screen -ml-[calc((100vw-100%)/2)] bg-gray-50/50', className)}>
      {/* ─── Hero Banner ─────────────────────────────── */}
      {showHeader && (
        <div
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0b6d41 0%, #064d2e 60%, #032818 100%)' }}
        >
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold tracking-widest text-white/80 uppercase mb-5">
              <BookOpen className="w-3.5 h-3.5" />
              Facilities
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#ffde59]">
              {headerTitle}
            </h1>

            {headerSubtitle && (
              <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                {headerSubtitle}
              </p>
            )}

            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="h-px w-12 md:w-20 bg-[#ffde59]/30" />
              <div className="w-2 h-2 rotate-45 bg-[#ffde59]" />
              <div className="h-px w-12 md:w-20 bg-[#ffde59]/30" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 48" fill="none" className="w-full h-8 md:h-12" preserveAspectRatio="none">
              <path d="M0 48h1440V24C1200 0 960 0 720 24S240 48 0 24v24z" fill="#f9fafb" fillOpacity="0.5" />
              <path d="M0 48h1440V32C1200 8 960 8 720 32S240 56 0 32v16z" fill="#f9fafb" />
            </svg>
          </div>
        </div>
      )}

      {/* ─── Content Area ────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">
          {/* Images Gallery */}
          {filteredImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredImages.map((image, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                  <Image
                    src={image.src}
                    alt={image.alt || `Library image ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Introduction */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="space-y-5">
              {displayParagraphs.map((paragraph, index) => (
                <p key={index} className="text-[15px] md:text-base leading-[1.8] text-gray-600">
                  {paragraph.text}
                </p>
              ))}

              {timing && (
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-[#0b6d41]/10 flex items-center justify-center">
                    <Clock className="w-[18px] h-[18px] text-[#0b6d41]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Operating Hours</p>
                    <p className="text-sm font-semibold text-[#0b6d41]">{timing}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resources Grid */}
          {showResources && displayResources.length > 0 && (
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-5">
                {resourcesTitle}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayResources.map((resource, index) => {
                  const Icon = getIconComponent(resource.icon || 'BookOpen')
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-[#0b6d41]" />
                        <p className="text-xs text-gray-500 font-medium">{resource.label}</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{resource.value || '—'}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Sections + Services side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showSections && displaySections.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{sectionsTitle}</h2>
                <div className="space-y-3">
                  {displaySections.map((section, index) => {
                    const Icon = getIconComponent(section.icon || 'CheckCircle2')
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0b6d41]/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#0b6d41]" />
                        </div>
                        <span className="text-sm md:text-[15px] text-gray-700">{section.title}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {showServices && displayServices.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{servicesTitle}</h2>
                <div className="space-y-3">
                  {displayServices.map((service, index) => {
                    const Icon = getIconComponent(service.icon || 'CheckCircle2')
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0b6d41]/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#0b6d41]" />
                        </div>
                        <span className="text-sm md:text-[15px] text-gray-700">{service.title}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Contact Card */}
          {showContact && displayLibrarian && (
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{contactTitle}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-[#0b6d41]/5">
                <div className="w-14 h-14 rounded-full bg-[#0b6d41]/15 flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-[#0b6d41]" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div>
                    <p className="text-xs text-gray-500">Librarian</p>
                    <p className="text-base font-bold text-gray-900">{displayLibrarian.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#0b6d41]" />
                      <span className="text-xs text-gray-600">{displayLibrarian.qualification}</span>
                    </div>
                    <a href={`tel:${displayLibrarian.phone}`} className="flex items-center gap-1.5 hover:underline">
                      <Phone className="w-3.5 h-3.5 text-[#0b6d41]" />
                      <span className="text-xs font-medium text-[#0b6d41]">{displayLibrarian.phone}</span>
                    </a>
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
