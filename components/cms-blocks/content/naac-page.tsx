'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, FileText, Download, ChevronRight } from 'lucide-react'
import type { NAACPageProps, Document, SubSection } from '@/lib/cms/templates/naac/types'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

/**
 * NAAC Page Component - Side Tabs Layout
 *
 * Features:
 * - Vertical tabs navigation on the side
 * - Shows one section at a time based on active tab
 * - Document cards with full metadata
 * - Metrics display for each criterion
 * - Contact information card
 * - Responsive mobile drawer
 */

// Add fade-in animation styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `
  if (!document.getElementById('naac-animations')) {
    style.id = 'naac-animations'
    document.head.appendChild(style)
  }
}

// =============================================================================
// Desktop Side Tabs Component
// =============================================================================

function NAACDesktopTabs({
  sections,
  activeSection,
  onTabChange,
}: {
  sections: NAACPageProps['navigationSections']
  activeSection: string
  onTabChange: (id: string) => void
}) {
  return (
    <aside className="hidden lg:block w-72 sticky top-24 h-[calc(100vh-7rem)]">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white/95">
          <h2 className="text-lg font-bold text-gray-900">NAAC Sections</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onTabChange(section.id)}
                className={`
                  w-full text-left px-4 py-3.5 rounded-lg font-medium transition-all duration-300
                  flex items-center justify-between group relative
                  ${
                    activeSection === section.id
                      ? 'bg-[#7db247] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm hover:pl-5'
                  }
                `}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{section.label}</div>
                  {section.description && (
                    <div className={`text-xs mt-1 truncate ${
                      activeSection === section.id ? 'text-white/90' : 'text-gray-500'
                    }`}>
                      {section.description}
                    </div>
                  )}
                </div>
                <ChevronRight
                  className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                    activeSection === section.id
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-[#7db247] group-hover:translate-x-1'
                  }`}
                />
                {activeSection === section.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  )
}

// =============================================================================
// Mobile Tabs Drawer Component
// =============================================================================

function NAACMobileTabs({
  sections,
  activeSection,
  onTabChange,
}: {
  sections: NAACPageProps['navigationSections']
  activeSection: string
  onTabChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)

  const handleTabChange = (id: string) => {
    onTabChange(id)
    setOpen(false)
  }

  const activeTabLabel = sections.find(s => s.id === activeSection)?.label || 'NAAC Sections'

  return (
    <div className="lg:hidden fixed top-24 left-4 right-4 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            className="w-full bg-[#7db247] hover:bg-[#6b9f3e] text-white shadow-xl rounded-xl border-2 border-white/20 justify-between h-auto py-3"
            aria-label="Open tabs menu"
          >
            <div className="flex-1 text-left">
              <div className="text-xs text-white/80 mb-0.5">Current Section</div>
              <div className="font-semibold">{activeTabLabel}</div>
            </div>
            {open ? <X className="h-5 w-5 ml-2" /> : <Menu className="h-5 w-5 ml-2" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-white/95 backdrop-blur-sm p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-200 bg-white/95">
              <h2 className="text-xl font-bold text-gray-900">NAAC Sections</h2>
              <p className="text-sm text-gray-500 mt-1">Select a section to view</p>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1.5">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleTabChange(section.id)}
                    className={`
                      w-full text-left px-4 py-3.5 rounded-lg font-medium transition-all duration-300
                      flex items-center justify-between relative
                      ${
                        activeSection === section.id
                          ? 'bg-[#7db247] text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{section.label}</div>
                      {section.description && (
                        <div className={`text-xs mt-1 ${
                          activeSection === section.id ? 'text-white/90' : 'text-gray-500'
                        }`}>
                          {section.description}
                        </div>
                      )}
                    </div>
                    <ChevronRight
                      className={`h-5 w-5 flex-shrink-0 ${
                        activeSection === section.id ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}


// =============================================================================
// Section Content Component - Simple Text Format
// =============================================================================

function SectionContent({ section }: { section: any }) {
  return (
    <section className="mb-8">
      {/* Section Heading - Simple, no card */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
        {section.heading}
      </h2>

      {/* Overview Text - Plain paragraphs */}
      {section.overview && (
        <div className="text-gray-700 text-base leading-relaxed text-justify space-y-4">
          {section.overview.split('\n\n').map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}

      {/* Metrics - Simple text format */}
      {section.metrics && section.metrics.length > 0 && (
        <div className="mt-8 space-y-3">
          {section.metrics.map((metric: any, index: number) => (
            <div key={index} className="text-gray-700">
              <span className="font-semibold text-[#7db247]">{metric.label}:</span>{' '}
              <span>{metric.value}</span>
              {metric.description && (
                <span className="text-sm text-gray-600"> - {metric.description}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Documents - Simple list format */}
      {section.documents && section.documents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Documents & Reports</h3>
          <ul className="space-y-2">
            {section.documents.map((doc: Document, index: number) => (
              <li key={index}>
                {doc.fileUrl && doc.fileUrl !== '#' ? (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7db247] hover:underline font-medium inline-flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {doc.title}
                  </a>
                ) : (
                  <span className="text-gray-500 font-medium inline-flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {doc.title} <span className="text-xs">(Not Available)</span>
                  </span>
                )}
                {doc.description && (
                  <span className="text-sm text-gray-600 ml-2">- {doc.description}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Subsections - Simple text format */}
      {section.subsections && section.subsections.length > 0 && (
        <div className="mt-8 space-y-6">
          {section.subsections.map((subsection: SubSection, index: number) => (
            <div key={subsection.id || index}>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                {subsection.title}
              </h4>
              <div className="text-gray-700 text-base leading-relaxed text-justify space-y-4">
                {subsection.content.split('\n\n').map((paragraph: string, pIndex: number) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
              {subsection.documents && subsection.documents.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {subsection.documents.map((doc: Document, docIndex: number) => (
                    <li key={docIndex}>
                      {doc.fileUrl && doc.fileUrl !== '#' ? (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7db247] hover:underline font-medium inline-flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          {doc.title}
                        </a>
                      ) : (
                        <span className="text-gray-500 font-medium inline-flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          {doc.title} <span className="text-xs">(Not Available)</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
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
    <div className="bg-gradient-to-br from-[#7db247] via-[#6b9f3e] to-[#5a8d35] rounded-xl shadow-xl p-6 md:p-8 text-white mb-8 border border-white/10 hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-2xl md:text-3xl font-bold mb-6 pb-3 border-b border-white/20">
        Contact Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactInfo.name && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors duration-300">
            <div className="text-sm text-white/80 mb-1 font-medium">Coordinator</div>
            <div className="font-semibold text-lg">{contactInfo.name}</div>
          </div>
        )}
        {contactInfo.email && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors duration-300">
            <div className="text-sm text-white/80 mb-1 font-medium">Email</div>
            <a
              href={`mailto:${contactInfo.email}`}
              className="font-semibold hover:underline break-all"
            >
              {contactInfo.email}
            </a>
          </div>
        )}
        {contactInfo.phone && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors duration-300">
            <div className="text-sm text-white/80 mb-1 font-medium">Phone</div>
            <a
              href={`tel:${contactInfo.phone}`}
              className="font-semibold hover:underline"
            >
              {contactInfo.phone}
            </a>
          </div>
        )}
        {contactInfo.office && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors duration-300">
            <div className="text-sm text-white/80 mb-1 font-medium">Office</div>
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
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(
    props.navigationSections[0]?.id || ''
  )

  const handleTabChange = (tabId: string) => {
    // If DVV tab is clicked, navigate to dedicated DVV page
    if (tabId === 'dvv') {
      router.push('/naac/dvv')
      return
    }

    setActiveTab(tabId)
    // Smooth scroll to top of content when tab changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get the active section's content
  const activeSection = props.contentSections.find(
    (section) => section.id === activeTab
  )

  return (
    <div className="min-h-screen bg-[#fdfdf5] pt-20 pb-12">
      {/* Mobile Tabs */}
      <NAACMobileTabs
        sections={props.navigationSections}
        activeSection={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Container for centered layout */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile spacing for tab button */}
        <div className="h-20 lg:hidden" />

        <div className="flex gap-8">
          {/* Desktop Side Tabs - Sticky */}
          <NAACDesktopTabs
            sections={props.navigationSections}
            activeSection={activeTab}
            onTabChange={handleTabChange}
          />

          {/* Main Content Area - Simple, no cards */}
          <main className="flex-1 min-w-0 bg-white/40 p-6 md:p-8 lg:p-12 min-h-[80vh]">
            {/* Active Section Content Only */}
            {activeSection && (
              <div
                key={activeSection.id}
                className="transition-opacity duration-300 ease-in-out"
                style={{ animation: 'fadeIn 0.3s ease-in-out' }}
              >
                <SectionContent section={activeSection} />
              </div>
            )}

            {/* Contact Information - Simple format */}
            {props.contactInfo && (
              <div className="mt-12 pt-8 border-t border-gray-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="text-gray-700 space-y-2">
                  {props.contactInfo.name && (
                    <div>
                      <span className="font-semibold">Coordinator:</span> {props.contactInfo.name}
                    </div>
                  )}
                  {props.contactInfo.email && (
                    <div>
                      <span className="font-semibold">Email:</span>{' '}
                      <a href={`mailto:${props.contactInfo.email}`} className="text-[#7db247] hover:underline">
                        {props.contactInfo.email}
                      </a>
                    </div>
                  )}
                  {props.contactInfo.phone && (
                    <div>
                      <span className="font-semibold">Phone:</span>{' '}
                      <a href={`tel:${props.contactInfo.phone}`} className="text-[#7db247] hover:underline">
                        {props.contactInfo.phone}
                      </a>
                    </div>
                  )}
                  {props.contactInfo.office && (
                    <div>
                      <span className="font-semibold">Office:</span> {props.contactInfo.office}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
