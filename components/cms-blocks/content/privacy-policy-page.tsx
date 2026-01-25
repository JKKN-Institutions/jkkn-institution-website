'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import { Shield, Lock, Eye, Database, UserCheck, Mail, Phone, MapPin } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'

/**
 * Policy section schema
 */
export const PolicySectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string().optional(),
  content: z.string(),
})

export type PolicySection = z.infer<typeof PolicySectionSchema>

/**
 * PrivacyPolicyPage props schema
 */
export const PrivacyPolicyPagePropsSchema = z.object({
  // Header
  showHeader: z.boolean().default(true),
  headerTitle: z.string().default('Privacy Policy'),
  headerSubtitle: z.string().optional(),
  headerPart1Color: z.string().default('#0b6d41'),
  headerPart2Color: z.string().default('#ffde59'),

  // Content
  lastUpdated: z.string().default('December 2024'),
  introduction: z.string().default(''),
  sections: z.array(PolicySectionSchema).default([]),

  // Contact Info
  showContactInfo: z.boolean().default(true),
  contactEmail: z.string().default('info@jkkn.ac.in'),
  contactPhone: z.string().default('+91 93455 85001'),
  contactAddress: z.string().default('JKKN Educational Institutions, Natarajapuram, NH-544, Kumarapalayam (Tk), Namakkal (Dt), Tamil Nadu 638183'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
  cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
  showDecorations: z.boolean().default(true),
})

export type PrivacyPolicyPageProps = z.infer<typeof PrivacyPolicyPagePropsSchema> & BaseBlockProps

/**
 * Default policy sections
 */
const defaultPolicySections: PolicySection[] = [
  {
    id: '1',
    title: 'Information We Collect',
    icon: 'Database',
    content: `We collect information that you provide directly to us, including:

• **Personal Information**: Name, email address, phone number, and postal address when you fill out forms on our website.
• **Academic Information**: Educational qualifications, course preferences, and academic records for admission purposes.
• **Technical Data**: IP address, browser type, device information, and cookies when you visit our website.
• **Communication Data**: Records of correspondence when you contact us via email, phone, or contact forms.

We collect this information to provide better services, process admissions, and communicate important updates about our institutions.`,
  },
  {
    id: '2',
    title: 'How We Use Your Information',
    icon: 'Eye',
    content: `Your information is used for the following purposes:

• **Admission Processing**: To evaluate and process your application for admission to our colleges and schools.
• **Communication**: To send you important updates about admissions, events, and institutional news.
• **Service Improvement**: To analyze website usage and improve our online services.
• **Legal Compliance**: To comply with applicable laws, regulations, and legal processes.
• **Safety & Security**: To protect the rights, property, and safety of our institutions, students, and staff.

We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    id: '3',
    title: 'Data Protection & Security',
    icon: 'Lock',
    content: `We implement appropriate technical and organizational measures to protect your personal data:

• **Encryption**: All data transmitted through our website is encrypted using SSL/TLS technology.
• **Access Controls**: Only authorized personnel have access to personal information on a need-to-know basis.
• **Regular Audits**: We conduct regular security assessments to identify and address potential vulnerabilities.
• **Data Minimization**: We only collect and retain information that is necessary for the stated purposes.
• **Secure Storage**: Personal data is stored on secure servers with appropriate physical and digital safeguards.

While we strive to protect your information, no method of transmission over the Internet is 100% secure.`,
  },
  {
    id: '4',
    title: 'Your Rights',
    icon: 'UserCheck',
    content: `You have the following rights regarding your personal information:

• **Right to Access**: You can request a copy of the personal data we hold about you.
• **Right to Rectification**: You can request correction of inaccurate or incomplete data.
• **Right to Erasure**: You can request deletion of your personal data in certain circumstances.
• **Right to Restrict Processing**: You can request limitation of processing of your data.
• **Right to Data Portability**: You can request transfer of your data to another organization.
• **Right to Object**: You can object to processing of your data for certain purposes.

To exercise any of these rights, please contact us using the information provided below.`,
  },
  {
    id: '5',
    title: 'Cookies & Tracking',
    icon: 'Eye',
    content: `Our website uses cookies and similar tracking technologies:

• **Essential Cookies**: Required for the website to function properly (e.g., session management).
• **Analytics Cookies**: Help us understand how visitors interact with our website.
• **Preference Cookies**: Remember your settings and preferences for future visits.

You can control cookie settings through your browser. However, disabling certain cookies may affect website functionality.

We may also use third-party services like Google Analytics to analyze website traffic. These services may collect anonymous data about your visits.`,
  },
  {
    id: '6',
    title: 'Changes to This Policy',
    icon: 'Shield',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.

• We will post any changes on this page with an updated "Last Updated" date.
• For significant changes, we may provide additional notice such as email notification.
• Your continued use of our website after changes constitutes acceptance of the updated policy.

We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.`,
  },
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
 * Get icon component by name
 */
function getIconComponent(iconName: string) {
  const icons: Record<string, typeof Shield> = {
    Shield,
    Lock,
    Eye,
    Database,
    UserCheck,
    Mail,
    Phone,
    MapPin,
  }
  return icons[iconName] || Shield
}

/**
 * Parse markdown-like content to JSX
 */
function parseContent(content: string) {
  const lines = content.split('\n')
  return lines.map((line, index) => {
    // Bold text
    const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    // Bullet points
    if (line.trim().startsWith('•')) {
      return (
        <li
          key={index}
          className="ml-4 mb-1"
          dangerouslySetInnerHTML={{ __html: boldParsed.replace('•', '').trim() }}
        />
      )
    }

    // Empty line
    if (line.trim() === '') {
      return <br key={index} />
    }

    // Regular paragraph
    return (
      <p
        key={index}
        className="mb-2"
        dangerouslySetInnerHTML={{ __html: boldParsed }}
      />
    )
  })
}

/**
 * Policy Section Card Component
 */
function PolicySectionCard({
  section,
  index,
  variant,
  cardStyle,
}: {
  section: PolicySection
  index: number
  variant: 'modern-dark' | 'modern-light'
  cardStyle: 'glass' | 'solid' | 'gradient'
}) {
  const { ref, isInView } = useInView(0.1)
  const IconComponent = getIconComponent(section.icon || 'Shield')
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
      ref={ref}
      className={cn(
        'rounded-2xl p-6 md:p-8 transition-all duration-700',
        cardStyles[cardStyle],
        isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            'bg-gradient-to-br from-[#0b6d41] to-[#0a5c37]'
          )}
        >
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <h2
          className={cn(
            'text-xl md:text-2xl font-bold',
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
        <ul className="list-none p-0 m-0 space-y-1">
          {parseContent(section.content)}
        </ul>
      </div>
    </div>
  )
}

/**
 * PrivacyPolicyPage Component
 */
export default function PrivacyPolicyPage({
  showHeader = true,
  headerTitle = 'Privacy Policy',
  headerSubtitle,
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#ffde59',
  lastUpdated = 'December 2024',
  introduction = 'At JKKN Educational Institutions, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or interact with our services.',
  sections = defaultPolicySections,
  showContactInfo = true,
  contactEmail = 'info@jkkn.ac.in',
  contactPhone = '+91 93455 85001',
  contactAddress = 'JKKN Educational Institutions, Natarajapuram, NH-544, Kumarapalayam (Tk), Namakkal (Dt), Tamil Nadu 638183',
  variant = 'modern-light',
  cardStyle = 'glass',
  showDecorations = true,
  className,
}: PrivacyPolicyPageProps) {
  const { ref: headerRef, isInView: headerInView } = useInView(0.1)
  const isDark = variant === 'modern-dark'

  const displaySections = sections?.length > 0 ? sections : defaultPolicySections

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
                  <Shield className="w-10 h-10 text-white" />
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

              {/* Last Updated */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-white/70 text-sm">Last Updated:</span>
                <span className="text-[#ffde59] font-medium text-sm">{lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          {introduction && (
            <div
              className={cn(
                'mb-12 p-6 md:p-8 rounded-2xl',
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

          {/* Policy Sections */}
          <div className="space-y-8">
            {displaySections.map((section, index) => (
              <PolicySectionCard
                key={section.id}
                section={section}
                index={index}
                variant={variant}
                cardStyle={cardStyle}
              />
            ))}
          </div>

          {/* Contact Information */}
          {showContactInfo && (
            <div
              className={cn(
                'mt-12 p-6 md:p-8 rounded-2xl',
                'bg-gradient-to-br from-[#0b6d41] to-[#0a5c37]'
              )}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Contact Us
              </h2>
              <p className="text-white/80 mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
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
    </section>
  )
}
