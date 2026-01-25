'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect, useCallback } from 'react'
import {
  Scale,
  Building2,
  BookOpen,
  CheckCircle,
  Users,
  Monitor,
  Check,
  Ban,
  Copyright,
  GraduationCap,
  ClipboardList,
  CreditCard,
  Shield,
  ExternalLink,
  AlertTriangle,
  ShieldCheck,
  XCircle,
  Gavel,
  Handshake,
  Scissors,
  FileText,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from 'lucide-react'

/**
 * Terms section schema
 */
export const TermsSectionSchema = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  icon: z.string().optional(),
  content: z.string(),
  subsections: z.array(z.object({
    id: z.string(),
    number: z.string(),
    title: z.string(),
    content: z.string(),
  })).optional(),
})

export type TermsSection = z.infer<typeof TermsSectionSchema>

/**
 * TermsAndConditionsPage props schema
 */
export const TermsAndConditionsPagePropsSchema = z.object({
  // Header
  showHeader: z.boolean().default(true),
  headerTitle: z.string().default('Terms & Conditions'),
  headerSubtitle: z.string().optional(),
  headerPart1Color: z.string().default('#0b6d41'),
  headerPart2Color: z.string().default('#ffde59'),

  // TOC
  showTableOfContents: z.boolean().default(true),
  tocTitle: z.string().default('Contents'),
  stickyToc: z.boolean().default(true),

  // Content
  lastUpdated: z.string().default('January 03, 2026'),
  introduction: z.string().default(''),
  sections: z.array(TermsSectionSchema).default([]),

  // Contact Info
  showContactInfo: z.boolean().default(true),
  contactEmail: z.string().default('info@jkkn.ac.in'),
  contactPhone: z.string().default('+91 93458 55001'),
  contactAddress: z.string().default('JKKN Institutions, Natarajapuram, NH-544 (Salem to Coimbatore National Highway), Komarapalayam (TK), Namakkal (DT), Tamil Nadu – 638183, India'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
  cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
  showDecorations: z.boolean().default(true),
})

export type TermsAndConditionsPageProps = z.infer<typeof TermsAndConditionsPagePropsSchema> & BaseBlockProps

/**
 * Default terms sections
 */
const defaultTermsSections: TermsSection[] = [
  {
    id: '1',
    number: '1',
    title: 'About JKKN Institutions',
    icon: 'Building2',
    content: `JKKN Institutions ("Institution," "we," "us," or "our") is a premier educational organization located at Natarajapuram, NH-544 (Salem to Coimbatore National Highway), Komarapalayam (TK), Namakkal (DT), Tamil Nadu – 638183, India. We are committed to providing quality education and empowering learners to achieve academic and professional excellence.

Our website https://jkkn.ac.in serves as a digital platform providing information about our academic programs, admissions, campus facilities, events, and institutional updates.`,
  },
  {
    id: '2',
    number: '2',
    title: 'Definitions',
    icon: 'BookOpen',
    content: `For clarity and consistency throughout this document:

• **"Service"** refers to the JKKN Institutions website, mobile applications, online portals, learning management systems, and any related digital platforms operated by the Institution.
• **"User"** or **"You"** refers to any individual, prospective student, current student, parent, guardian, alumni, or entity accessing or using our services.
• **"Content"** includes all text, images, videos, documents, graphics, data, and other materials available through our services.
• **"Personal Information"** means any data that can identify you directly or indirectly, including name, contact details, academic records, and identification documents.`,
  },
  {
    id: '3',
    number: '3',
    title: 'Acceptance of Terms',
    icon: 'CheckCircle',
    content: `By accessing or using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, along with our Privacy Policy. If you do not agree with any part of these terms, please discontinue use of our services immediately.

We reserve the right to update or modify these terms at any time. Continued use of our services following any changes constitutes your acceptance of the revised terms. We encourage you to review this page periodically for updates.`,
  },
  {
    id: '4',
    number: '4',
    title: 'Eligibility',
    icon: 'Users',
    content: `Our website is accessible to all visitors seeking information about JKKN Institutions. However, certain services, including online applications, student portals, and learning management systems, may require you to be at least 18 years of age or have parental or guardian consent if you are a minor.

By using our services, you represent and warrant that you meet the eligibility requirements and have the legal capacity to enter into this agreement.`,
  },
  {
    id: '5',
    number: '5',
    title: 'Use of Our Services',
    icon: 'Monitor',
    content: `Our services are provided for lawful purposes related to educational information and institutional interaction.`,
    subsections: [
      {
        id: '5.1',
        number: '5.1',
        title: 'Permitted Use',
        content: `You may use our website and services for lawful purposes, including browsing institutional information, submitting admission applications, accessing student portals, and engaging with educational content provided by JKKN Institutions.`,
      },
      {
        id: '5.2',
        number: '5.2',
        title: 'Prohibited Activities',
        content: `You agree not to engage in any of the following activities:

• Unauthorized access or attempts to breach our security systems, servers, or databases
• Distribution of malware, viruses, or any harmful code through our platforms
• Misrepresentation of your identity or affiliation with JKKN Institutions
• Reproduction, distribution, or commercial use of our content without written permission
• Harassment, defamation, or any conduct that disrupts the educational environment
• Submission of false, misleading, or fraudulent information in applications or forms
• Any activity that violates applicable local, state, national, or international laws`,
      },
    ],
  },
  {
    id: '6',
    number: '6',
    title: 'Intellectual Property Rights',
    icon: 'Copyright',
    content: `All content on the JKKN Institutions website, including but not limited to logos, trademarks, text, graphics, images, videos, course materials, and software, is the intellectual property of JKKN Institutions or its licensors. This content is protected under Indian copyright laws and international intellectual property agreements.

You may not reproduce, modify, distribute, display, or create derivative works from any content without prior written authorization from JKKN Institutions. Limited use for personal, non-commercial, and educational purposes is permitted, provided proper attribution is given.`,
  },
  {
    id: '7',
    number: '7',
    title: 'Student and Academic Policies',
    icon: 'GraduationCap',
    content: `Students enrolled at JKKN Institutions are subject to additional academic policies, codes of conduct, and institutional regulations as outlined in the student handbook and program-specific guidelines. These policies govern academic integrity, attendance, examinations, disciplinary procedures, and grievance redressal mechanisms.

For detailed information on academic policies, please refer to the official documentation provided during enrollment or contact the respective department.`,
  },
  {
    id: '8',
    number: '8',
    title: 'Admissions and Enrollment',
    icon: 'ClipboardList',
    content: `Information provided on our website regarding admissions, programs, fees, and eligibility criteria is for general guidance. While we strive to maintain accuracy, details may be subject to change based on regulatory requirements, institutional policies, or other factors.

Submission of an application does not guarantee admission. All admissions are subject to verification of documents, eligibility criteria, and availability of seats. JKKN Institutions reserves the right to accept or reject any application at its sole discretion.`,
  },
  {
    id: '9',
    number: '9',
    title: 'Fees and Payments',
    icon: 'CreditCard',
    content: `Fee structures, payment schedules, and refund policies are communicated during the admission process and are governed by the Institution's financial policies. All fees must be paid within the stipulated timelines to maintain enrollment status.

Online payments made through our website are processed through secure third-party payment gateways. JKKN Institutions does not store your complete payment card information on our servers.`,
  },
  {
    id: '10',
    number: '10',
    title: 'Privacy and Data Protection',
    icon: 'Shield',
    content: `Your privacy is important to us. Our collection, use, and protection of your personal information are governed by our Privacy Policy, which forms an integral part of these Terms and Conditions.

We are committed to safeguarding your data in compliance with applicable data protection laws, including the Information Technology Act, 2000, and related regulations in India. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or disclosure.`,
  },
  {
    id: '11',
    number: '11',
    title: 'Third-Party Links and Services',
    icon: 'ExternalLink',
    content: `Our website may contain links to external websites, resources, or third-party services for your convenience and reference. These links do not imply endorsement by JKKN Institutions, and we are not responsible for the content, privacy practices, or availability of such external sites.

We encourage you to review the terms and privacy policies of any third-party websites you visit. Your interactions with third-party services are solely between you and the respective third party.`,
  },
  {
    id: '12',
    number: '12',
    title: 'Disclaimer of Warranties',
    icon: 'AlertTriangle',
    content: `Our website and services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. JKKN Institutions does not warrant that our services will be uninterrupted, error-free, secure, or free from viruses or other harmful components.

While we make reasonable efforts to ensure the accuracy of information on our website, we do not guarantee that all content is complete, current, or free from errors. You acknowledge that your use of our services is at your own risk.`,
  },
  {
    id: '13',
    number: '13',
    title: 'Limitation of Liability',
    icon: 'Scale',
    content: `To the fullest extent permitted by applicable law, JKKN Institutions, its trustees, management, faculty, staff, and affiliates shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising from your use of or inability to use our services.

This includes, but is not limited to, damages for loss of data, academic opportunities, business interruption, or any other losses, even if we have been advised of the possibility of such damages. Our total liability, if any, shall not exceed the amount you have paid to us for the specific service in question.`,
  },
  {
    id: '14',
    number: '14',
    title: 'Indemnification',
    icon: 'ShieldCheck',
    content: `You agree to indemnify, defend, and hold harmless JKKN Institutions, its trustees, officers, employees, agents, and affiliates from any claims, damages, losses, liabilities, costs, or expenses (including legal fees) arising from your use of our services, violation of these terms, or infringement of any third-party rights.`,
  },
  {
    id: '15',
    number: '15',
    title: 'Termination',
    icon: 'XCircle',
    content: `JKKN Institutions reserves the right to suspend or terminate your access to our services at any time, without prior notice, for conduct that violates these Terms and Conditions or is otherwise harmful to the Institution, other users, or third parties.

Upon termination, your right to use our services ceases immediately. Provisions of these terms that by their nature should survive termination shall remain in effect.`,
  },
  {
    id: '16',
    number: '16',
    title: 'Governing Law and Jurisdiction',
    icon: 'Gavel',
    content: `These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from or related to these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts in Namakkal District, Tamil Nadu, India.`,
  },
  {
    id: '17',
    number: '17',
    title: 'Dispute Resolution',
    icon: 'Handshake',
    content: `In the event of any dispute or concern regarding our services, we encourage you to first contact us directly to seek an amicable resolution. Most issues can be resolved through open communication with our administrative team.

If a dispute cannot be resolved informally, both parties agree to attempt mediation before pursuing formal legal proceedings. This approach reflects our commitment to maintaining positive relationships with our stakeholders.`,
  },
  {
    id: '18',
    number: '18',
    title: 'Severability',
    icon: 'Scissors',
    content: `If any provision of these Terms and Conditions is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such invalidity shall not affect the remaining provisions, which shall continue in full force and effect.`,
  },
  {
    id: '19',
    number: '19',
    title: 'Entire Agreement',
    icon: 'FileText',
    content: `These Terms and Conditions, together with our Privacy Policy and any other legal notices or policies published on our website, constitute the entire agreement between you and JKKN Institutions regarding your use of our services. This agreement supersedes any prior understandings or agreements.`,
  },
  {
    id: '20',
    number: '20',
    title: 'Contact Information',
    icon: 'Mail',
    content: `If you have any questions, concerns, or feedback regarding these Terms and Conditions, please contact us:

**JKKN Institutions**
Natarajapuram, NH-544 (Salem to Coimbatore National Highway)
Komarapalayam (TK), Namakkal (DT)
Tamil Nadu – 638183, India

**Email:** info@jkkn.ac.in
**Phone:** +91 93458 55001
**Website:** https://jkkn.ac.in

We value your trust in JKKN Institutions and are committed to addressing your inquiries promptly.`,
  },
]

/**
 * Icon mapping
 */
const iconMap: Record<string, LucideIcon> = {
  Scale,
  Building2,
  BookOpen,
  CheckCircle,
  Users,
  Monitor,
  Check,
  Ban,
  Copyright,
  GraduationCap,
  ClipboardList,
  CreditCard,
  Shield,
  ExternalLink,
  AlertTriangle,
  ShieldCheck,
  XCircle,
  Gavel,
  Handshake,
  Scissors,
  FileText,
  Mail,
  Phone,
  MapPin,
}

/**
 * Get icon component by name
 */
function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || Scale
}

/**
 * Parse markdown-like content to JSX
 */
function parseContent(content: string) {
  const lines = content.split('\n')
  return lines.map((line, index) => {
    // Bold text
    const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#0b6d41]">$1</strong>')

    // Links
    const linkParsed = boldParsed.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" class="text-[#0b6d41] underline hover:text-[#0a5c37] transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
    )

    // Email links
    const emailParsed = linkParsed.replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      '<a href="mailto:$1" class="text-[#0b6d41] underline hover:text-[#0a5c37] transition-colors">$1</a>'
    )

    // URL detection
    const urlParsed = emailParsed.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" class="text-[#0b6d41] underline hover:text-[#0a5c37] transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
    )

    // Bullet points
    if (line.trim().startsWith('•')) {
      return (
        <li
          key={index}
          className="ml-6 mb-2 list-disc"
          dangerouslySetInnerHTML={{ __html: urlParsed.replace('•', '').trim() }}
        />
      )
    }

    // Empty line
    if (line.trim() === '') {
      return <div key={index} className="h-3" />
    }

    // Regular paragraph
    return (
      <p
        key={index}
        className="mb-2 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: urlParsed }}
      />
    )
  })
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
 * Active section tracking hook
 */
function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const sectionElements: Map<string, HTMLElement> = new Map()

    sectionIds.forEach((id) => {
      const element = document.getElementById(`section-${id}`)
      if (element) {
        sectionElements.set(id, element)
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(id)
            }
          },
          { threshold: 0.3, rootMargin: '-20% 0px -60% 0px' }
        )
        observer.observe(element)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [sectionIds])

  return activeSection
}

/**
 * Table of Contents Component
 */
function TableOfContents({
  sections,
  activeSection,
  tocTitle,
  isDark,
}: {
  sections: TermsSection[]
  activeSection: string
  tocTitle: string
  isDark: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      setIsExpanded(false)
    }
  }, [])

  const allSections = sections.flatMap((section) => [
    { id: section.id, number: section.number, title: section.title },
    ...(section.subsections || []).map((sub) => ({
      id: sub.id,
      number: sub.number,
      title: sub.title,
    })),
  ])

  return (
    <>
      {/* Mobile TOC */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-full flex items-center justify-between p-4 rounded-xl',
            'backdrop-blur-lg border transition-all duration-300',
            isDark
              ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
              : 'bg-white/90 border-[#0b6d41]/10 text-gray-900 hover:bg-white shadow-lg'
          )}
        >
          <span className="font-semibold">{tocTitle}</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {isExpanded && (
          <div
            className={cn(
              'mt-2 p-4 rounded-xl backdrop-blur-lg border',
              isDark
                ? 'bg-white/10 border-white/20'
                : 'bg-white/90 border-[#0b6d41]/10 shadow-lg'
            )}
          >
            <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
              {allSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
                    section.number.includes('.')
                      ? 'ml-4 text-xs'
                      : 'font-medium',
                    activeSection === section.id
                      ? isDark
                        ? 'bg-white/20 text-white'
                        : 'bg-[#0b6d41]/10 text-[#0b6d41]'
                      : isDark
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-[#0b6d41] hover:bg-[#0b6d41]/5'
                  )}
                >
                  <span className="mr-2 font-mono text-[#ffde59]">
                    {section.number}.
                  </span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop TOC */}
      <aside
        className={cn(
          'hidden lg:block w-72 flex-shrink-0'
        )}
      >
        <div
          className={cn(
            'sticky top-24 p-6 rounded-2xl backdrop-blur-xl border',
            isDark
              ? 'bg-white/10 border-white/20'
              : 'bg-white/90 border-[#0b6d41]/10 shadow-xl'
          )}
        >
          <h3
            className={cn(
              'text-lg font-bold mb-4 pb-3 border-b',
              isDark
                ? 'text-white border-white/20'
                : 'text-[#0b6d41] border-[#0b6d41]/10'
            )}
          >
            {tocTitle}
          </h3>
          <nav className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin">
            {allSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
                  section.number.includes('.')
                    ? 'ml-3 text-xs border-l-2 border-[#0b6d41]/20'
                    : 'font-medium',
                  activeSection === section.id
                    ? isDark
                      ? 'bg-white/20 text-white'
                      : 'bg-[#0b6d41] text-white'
                    : isDark
                      ? 'text-white/70 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-[#0b6d41] hover:bg-[#0b6d41]/5'
                )}
              >
                <span
                  className={cn(
                    'mr-2 font-mono',
                    activeSection === section.id
                      ? 'text-[#ffde59]'
                      : isDark
                        ? 'text-[#ffde59]/70'
                        : 'text-[#0b6d41]/60'
                  )}
                >
                  {section.number}.
                </span>
                <span className="line-clamp-2">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}

/**
 * Section Card Component
 */
function TermsSectionCard({
  section,
  index,
  variant,
  cardStyle,
}: {
  section: TermsSection
  index: number
  variant: 'modern-dark' | 'modern-light'
  cardStyle: 'glass' | 'solid' | 'gradient'
}) {
  const { ref, isInView } = useInView(0.1)
  const IconComponent = getIconComponent(section.icon || 'Scale')
  const isDark = variant === 'modern-dark'

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
    <div
      id={`section-${section.id}`}
      ref={ref}
      className={cn(
        'rounded-2xl p-6 md:p-8 transition-all duration-700 scroll-mt-28',
        cardStyles[cardStyle],
        isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-6">
        {/* Number Badge */}
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold',
            'bg-gradient-to-br from-[#0b6d41] to-[#0a5c37] text-white shadow-lg'
          )}
        >
          {section.number}
        </div>

        {/* Icon */}
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            isDark
              ? 'bg-[#ffde59]/20'
              : 'bg-[#ffde59]/30'
          )}
        >
          <IconComponent className="w-5 h-5 text-[#0b6d41]" />
        </div>

        {/* Title */}
        <h2
          className={cn(
            'text-xl md:text-2xl font-bold flex-1',
            isDark ? 'text-white' : 'text-[#0b6d41]'
          )}
        >
          {section.title}
        </h2>
      </div>

      {/* Section Content */}
      <div
        className={cn(
          'prose prose-sm md:prose-base max-w-none',
          isDark ? 'prose-invert' : 'prose-gray',
          'leading-relaxed'
        )}
      >
        <div className={cn(isDark ? 'text-gray-300' : 'text-gray-700')}>
          {parseContent(section.content)}
        </div>
      </div>

      {/* Subsections */}
      {section.subsections && section.subsections.length > 0 && (
        <div className="mt-6 space-y-6">
          {section.subsections.map((subsection) => (
            <div
              key={subsection.id}
              id={`section-${subsection.id}`}
              className={cn(
                'pl-6 border-l-4 scroll-mt-28',
                isDark ? 'border-[#ffde59]/30' : 'border-[#0b6d41]/20'
              )}
            >
              <h3
                className={cn(
                  'text-lg font-semibold mb-3 flex items-center gap-2',
                  isDark ? 'text-white' : 'text-[#0b6d41]'
                )}
              >
                <span className="text-[#ffde59] font-mono">
                  {subsection.number}.
                </span>
                {subsection.title}
              </h3>
              <div className={cn(isDark ? 'text-gray-300' : 'text-gray-700')}>
                {parseContent(subsection.content)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * TermsAndConditionsPage Component
 */
export default function TermsAndConditionsPage({
  showHeader = true,
  headerTitle = 'Terms & Conditions',
  headerSubtitle,
  lastUpdated = 'January 03, 2026',
  showTableOfContents = false,
  tocTitle = 'Contents',
  introduction = 'Welcome to JKKN Institutions. These Terms and Conditions govern your use of our website, educational services, and digital platforms. By accessing or using our services, you agree to comply with these terms. Please read them carefully.',
  sections = defaultTermsSections,
  showContactInfo = true,
  contactEmail = 'info@jkkn.ac.in',
  contactPhone = '+91 93458 55001',
  contactAddress = 'JKKN Institutions, Natarajapuram, NH-544 (Salem to Coimbatore National Highway), Komarapalayam (TK), Namakkal (DT), Tamil Nadu – 638183, India',
  variant = 'modern-light',
  cardStyle = 'glass',
  showDecorations = true,
  className,
}: TermsAndConditionsPageProps) {
  const { ref: headerRef, isInView: headerInView } = useInView(0.1)
  const isDark = variant === 'modern-dark'

  const displaySections = sections?.length > 0 ? sections : defaultTermsSections

  // Get all section IDs including subsections for tracking
  const allSectionIds = displaySections.flatMap((section) => [
    section.id,
    ...(section.subsections || []).map((sub) => sub.id),
  ])

  const activeSection = useActiveSection(allSectionIds)

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
                : 'from-[#0b6d41]/5 to-transparent'
            )}
          />

          {/* Decorative circles */}
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#ffde59]/10 blur-3xl" />
          <div className="absolute top-96 left-10 w-48 h-48 rounded-full bg-[#0b6d41]/10 blur-3xl" />
          <div className="absolute bottom-40 right-20 w-56 h-56 rounded-full bg-[#ffde59]/5 blur-3xl" />
          <div className="absolute top-[600px] right-1/3 w-40 h-40 rounded-full bg-[#0b6d41]/5 blur-3xl" />
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
              <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-[#ffde59]/5" />
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
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-xl">
                  <Scale className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {headerTitle}
              </h1>

              {/* Subtitle */}
              {headerSubtitle && (
                <p className="text-lg md:text-xl text-white/80 mb-4">
                  {headerSubtitle}
                </p>
              )}

              {/* Last Updated & Effective Date */}
              <div className="flex flex-wrap justify-center gap-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                  <span className="text-white/70 text-sm">Effective Date:</span>
                  <span className="text-[#ffde59] font-medium text-sm">{lastUpdated}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                  <span className="text-white/70 text-sm">Last Updated:</span>
                  <span className="text-[#ffde59] font-medium text-sm">{lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className={cn(
          'gap-8 mx-auto',
          showTableOfContents
            ? 'flex flex-col lg:flex-row max-w-7xl'
            : 'max-w-4xl'
        )}>
          {/* Table of Contents */}
          {showTableOfContents && (
            <TableOfContents
              sections={displaySections}
              activeSection={activeSection}
              tocTitle={tocTitle}
              isDark={isDark}
            />
          )}

          {/* Content Column */}
          <div className={cn(showTableOfContents ? 'flex-1 min-w-0' : 'w-full')}>
            {/* Introduction */}
            {introduction && (
              <div
                className={cn(
                  'mb-8 p-6 md:p-8 rounded-2xl',
                  cardStyle === 'glass'
                    ? cn(
                        'backdrop-blur-md border',
                        isDark
                          ? 'bg-white/10 border-white/20'
                          : 'bg-white/80 border-white/40 shadow-lg'
                      )
                    : cn(
                        isDark
                          ? 'bg-gray-800 border border-gray-700'
                          : 'bg-white border border-gray-200 shadow-lg'
                      )
                )}
              >
                <p
                  className={cn(
                    'text-lg leading-relaxed',
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  )}
                >
                  {introduction}
                </p>
              </div>
            )}

            {/* Terms Sections */}
            <div className="space-y-6">
              {displaySections.map((section, index) => (
                <TermsSectionCard
                  key={section.id}
                  section={section}
                  index={index}
                  variant={variant}
                  cardStyle={cardStyle}
                />
              ))}
            </div>

            {/* Acceptance Notice */}
            <div
              className={cn(
                'mt-8 p-6 rounded-2xl border-2 border-dashed',
                isDark
                  ? 'border-[#ffde59]/30 bg-[#ffde59]/5'
                  : 'border-[#0b6d41]/30 bg-[#0b6d41]/5'
              )}
            >
              <p
                className={cn(
                  'text-center font-medium',
                  isDark ? 'text-white' : 'text-[#0b6d41]'
                )}
              >
                By using the JKKN Institutions website and services, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
              </p>
            </div>

            {/* Contact Information */}
            {showContactInfo && (
              <div
                className={cn(
                  'mt-8 p-6 md:p-8 rounded-2xl',
                  'bg-gradient-to-br from-[#0b6d41] to-[#0a5c37]'
                )}
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Contact Us
                </h2>
                <p className="text-white/80 mb-6">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#ffde59]" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Email</p>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="text-white hover:text-[#ffde59] transition-colors"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#ffde59]" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Phone</p>
                      <a
                        href={`tel:${contactPhone.replace(/\s/g, '')}`}
                        className="text-white hover:text-[#ffde59] transition-colors"
                      >
                        {contactPhone}
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#ffde59]" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Address</p>
                      <p className="text-white text-sm">{contactAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
