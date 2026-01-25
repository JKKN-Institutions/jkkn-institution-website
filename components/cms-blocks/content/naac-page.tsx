'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, ExternalLink, FileText, Calendar, Download } from 'lucide-react'
import type { NAACPageProps, Document, SubSection } from '@/lib/cms/templates/naac/types'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

/**
 * NAAC Page Component - Comprehensive Scrolling Layout
 *
 * Features:
 * - All sections visible with scroll navigation
 * - Document cards with full metadata
 * - Metrics display for each criterion
 * - Contact information card
 * - Intersection Observer for active section tracking
 * - Responsive sidebar navigation
 */

// =============================================================================
// Desktop Sidebar Component (Scroll-based Navigation)
// =============================================================================

function NAACDesktopSidebar({
  sections,
  activeSection,
  onNavigate,
}: {
  sections: NAACPageProps['navigationSections']
  activeSection: string
  onNavigate: (id: string) => void
}) {
  return (
    <aside className="hidden lg:block w-64 bg-white fixed left-4 top-[5.5rem] bottom-4 rounded-lg shadow-xl border border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">NAAC Sections</h2>
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={`
                w-full text-left px-4 py-3 rounded-md font-medium transition-all duration-200
                ${
                  activeSection === section.id
                    ? 'bg-[#7db247] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <div className="font-semibold">{section.label}</div>
              {section.description && (
                <div className={`text-xs mt-1 ${
                  activeSection === section.id ? 'text-white/90' : 'text-gray-500'
                }`}>
                  {section.description}
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}

// =============================================================================
// Mobile Sidebar Component (Sheet Drawer)
// =============================================================================

function NAACMobileSidebar({
  sections,
  activeSection,
  onNavigate,
}: {
  sections: NAACPageProps['navigationSections']
  activeSection: string
  onNavigate: (id: string) => void
}) {
  const [open, setOpen] = useState(false)

  const handleNavigate = (id: string) => {
    onNavigate(id)
    setOpen(false)
  }

  return (
    <div className="lg:hidden fixed top-[5.5rem] left-4 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="bg-[#7db247] hover:bg-[#6b9f3e] text-white shadow-lg rounded-lg"
            aria-label="Open navigation menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-white p-0">
          <div className="py-6 overflow-y-auto h-full">
            <h2 className="text-xl font-bold mb-4 px-6 text-gray-900">NAAC Sections</h2>
            <nav className="px-4 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleNavigate(section.id)}
                  className={`
                    w-full text-left px-4 py-3 rounded-md font-medium transition-all duration-200
                    ${
                      activeSection === section.id
                        ? 'bg-[#7db247] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="font-semibold">{section.label}</div>
                  {section.description && (
                    <div className={`text-xs mt-1 ${
                      activeSection === section.id ? 'text-white/90' : 'text-gray-500'
                    }`}>
                      {section.description}
                    </div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// =============================================================================
// Document Card Component
// =============================================================================

function DocumentCard({ document }: { document: any }) {
  return (
    <a
      href={document.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white border border-gray-200 rounded-lg p-5 md:p-6 hover:border-[#7db247] hover:shadow-lg transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-[#7db247]/10 rounded-lg flex items-center justify-center group-hover:bg-[#7db247]/20 transition-colors">
            <FileText className="h-6 w-6 text-[#7db247]" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-[#7db247] transition-colors">
            {document.title}
          </h4>
          {document.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {document.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {document.uploadDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
              </div>
            )}
            {document.fileType && (
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span className="uppercase">{document.fileType}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-[#7db247] transition-colors" />
        </div>
      </div>
    </a>
  )
}

// =============================================================================
// Metrics Display Component
// =============================================================================

function MetricsGrid({ metrics }: { metrics: any[] }) {
  if (!metrics || metrics.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-[#7db247]/10 to-[#6b9f3e]/5 rounded-lg p-5 border border-[#7db247]/20"
        >
          <div className="text-3xl font-bold text-[#6b9f3e] mb-1">
            {metric.value}
          </div>
          <div className="text-sm font-medium text-gray-700">
            {metric.label}
          </div>
          {metric.description && (
            <div className="text-xs text-gray-500 mt-2">
              {metric.description}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Section Content Component
// =============================================================================

function SectionContent({ section }: { section: any }) {
  return (
    <section
      id={section.id}
      className="scroll-mt-24 bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 lg:p-12 mb-8"
    >
      {/* Section Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {section.heading}
      </h2>

      {/* Overview Text */}
      {section.overview && (
        <p className="text-gray-700 mb-6 leading-relaxed">
          {section.overview}
        </p>
      )}

      {/* Metrics */}
      {section.metrics && <MetricsGrid metrics={section.metrics} />}

      {/* Documents Grid */}
      {section.documents && section.documents.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Documents & Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.documents.map((doc: Document, index: number) => (
              <DocumentCard key={index} document={doc} />
            ))}
          </div>
        </div>
      )}

      {/* Subsections */}
      {section.subsections && section.subsections.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Detailed Information
          </h3>
          {section.subsections.map((subsection: SubSection, index: number) => (
            <div
              key={subsection.id || index}
              className="border-l-4 border-[#7db247] pl-6 py-2"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {subsection.title}
              </h4>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {subsection.content}
              </p>
              {subsection.documents && subsection.documents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {subsection.documents.map((doc: Document, docIndex: number) => (
                    <a
                      key={docIndex}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#7db247] text-[#7db247] hover:bg-[#7db247] hover:text-white rounded-md transition-colors duration-200 text-sm font-medium"
                    >
                      <Download className="h-4 w-4" />
                      {doc.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// =============================================================================
// Contact Card Component
// =============================================================================

function ContactCard({ contactInfo }: { contactInfo: any }) {
  if (!contactInfo) return null

  return (
    <div className="bg-gradient-to-br from-[#7db247] to-[#6b9f3e] rounded-lg shadow-lg p-6 md:p-8 text-white mb-8">
      <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactInfo.name && (
          <div>
            <div className="text-sm text-white/80 mb-1">Coordinator</div>
            <div className="font-semibold">{contactInfo.name}</div>
          </div>
        )}
        {contactInfo.email && (
          <div>
            <div className="text-sm text-white/80 mb-1">Email</div>
            <a
              href={`mailto:${contactInfo.email}`}
              className="font-semibold hover:underline"
            >
              {contactInfo.email}
            </a>
          </div>
        )}
        {contactInfo.phone && (
          <div>
            <div className="text-sm text-white/80 mb-1">Phone</div>
            <a
              href={`tel:${contactInfo.phone}`}
              className="font-semibold hover:underline"
            >
              {contactInfo.phone}
            </a>
          </div>
        )}
        {contactInfo.office && (
          <div>
            <div className="text-sm text-white/80 mb-1">Office</div>
            <div className="font-semibold">{contactInfo.office}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Main NAAC Page Component
// =============================================================================

export function NAACPage(props: NAACPageProps) {
  const [activeSection, setActiveSection] = useState(
    props.navigationSections[0]?.id || ''
  )
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Intersection Observer for scroll-based active section tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    props.contentSections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(section.id)
            }
          })
        },
        {
          rootMargin: '-20% 0px -70% 0px',
          threshold: 0,
        }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [props.contentSections])

  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfbee] pt-20">
      {/* Desktop Sidebar */}
      <NAACDesktopSidebar
        sections={props.navigationSections}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Mobile Sidebar */}
      <NAACMobileSidebar
        sections={props.navigationSections}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="m-4 lg:ml-72 min-h-screen">
        {/* Page Title */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 lg:p-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {props.heroTitle || 'NAAC Accreditation'}
          </h1>
          {props.heroSubtitle && (
            <p className="text-xl text-gray-600 mb-2">
              {props.heroSubtitle}
            </p>
          )}
          {props.heroDescription && (
            <p className="text-gray-700 leading-relaxed">
              {props.heroDescription}
            </p>
          )}
        </div>

        {/* All Sections (Scrollable) */}
        {props.contentSections.map((section) => (
          <SectionContent key={section.id} section={section} />
        ))}

        {/* Contact Information */}
        {props.contactInfo && <ContactCard contactInfo={props.contactInfo} />}
      </main>
    </div>
  )
}
