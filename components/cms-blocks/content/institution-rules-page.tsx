'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import {
  Info,
  ClipboardList,
  AlertTriangle,
  Gavel,
  Shirt,
  Clock,
  CreditCard,
  Bike,
  Smartphone,
  BookOpen,
  Shield,
  FileWarning,
} from 'lucide-react'

/**
 * Rule item schema for numbered lists
 */
export const RuleItemSchema = z.object({
  text: z.string(),
  subItems: z.array(z.string()).optional(),
})

export type RuleItem = z.infer<typeof RuleItemSchema>

/**
 * Rule section schema
 */
export const RuleSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string().optional(),
  introduction: z.string().optional(),
  rules: z.array(RuleItemSchema).optional(),
  content: z.string().optional(),
  subsections: z.array(z.object({
    title: z.string(),
    content: z.string(),
  })).optional(),
})

export type RuleSection = z.infer<typeof RuleSectionSchema>

/**
 * InstitutionRulesPage props schema
 */
export const InstitutionRulesPagePropsSchema = z.object({
  // Header
  showHeader: z.boolean().default(true),
  headerTitle: z.string().default('Institution Rules'),
  headerSubtitle: z.string().optional(),

  // Content
  lastUpdated: z.string().optional(),
  sections: z.array(RuleSectionSchema).default([]),

  // Table of Contents
  showTableOfContents: z.boolean().default(false),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
  cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
  showDecorations: z.boolean().default(true),
})

export type InstitutionRulesPageProps = z.infer<typeof InstitutionRulesPagePropsSchema> & BaseBlockProps

/**
 * Default institution rules sections - Engineering College Rules
 */
const defaultRuleSections: RuleSection[] = [
  {
    id: 'general-information',
    title: 'General Information',
    icon: 'Info',
    rules: [
      { text: 'Working Days: Monday to Saturday (Except Second and Fourth Saturdays)' },
      { text: 'Working Hours: 9:00 AM to 4:30 PM' },
      { text: 'Library: 8:00 AM to 6:00 PM (all working days)' },
    ],
  },
  {
    id: 'rules-of-conduct',
    title: 'Rules of Conduct and Discipline',
    icon: 'ClipboardList',
    rules: [
      { text: 'Students are expected to maintain satisfactory conduct at all times while in the campus.' },
      { text: 'Punctuality in attending classes is essential. Roll call will be taken at the beginning of every lecture/lab hour. Students are expected to be in their seats before the bell rings.' },
      { text: 'Students may not leave the classroom at will during the lecture session. Leaving without permission of the teacher is not allowed.' },
      { text: 'Students are expected to maintain decorum in the campus.' },
      { text: 'Damaging or destroying the college property is an offence. Any damage caused will be recovered from the students responsible. Serious action including expulsion from the college will also be initiated against the offenders.' },
      { text: 'All forms of canvassing (Political / Religion), creating groups / factions and striking work are forbidden.' },
      { text: 'The students are prohibited from entering the college premises with Cigarettes, Tobaccos, Alcohol, Narcotic substances, Weapons, Fire works etc. If they are found in possession of any one of them, they will be expelled from the college.' },
      { text: 'Use of the institution\'s name, logo, crest, and seal to make any announcements or statements without the permission of the Principal is forbidden.' },
      { text: 'The students are expected not to participate in any activity outside the campus which may bring disgrace to the institution.' },
      { text: 'Students are expected not to receive visitors from outside. For unavoidable reasons permission can be obtained from the Principal to meet visitors at the reception area only.' },
      { text: 'Quarreling with co-students or any other employee of the college will result in disciplinary action.' },
    ],
  },
  {
    id: 'prohibition-of-ragging',
    title: 'Prohibition of Ragging',
    icon: 'AlertTriangle',
    content: 'The students of this institution are encouraged to maintain cordial relationship among themselves, behave and conduct with one another with courtesy and decorum. They are expected to be co-operative to the seniors and helpful to the juniors. Seniors shall befriend and guide the juniors. Ragging of any type is strictly forbidden inside and outside the campus. Action under the provisions of the Act will be initiated against the offenders.',
  },
  {
    id: 'tamil-nadu-gazette',
    title: 'Ragging Prohibited as per Tamil Nadu Government Gazette',
    icon: 'FileWarning',
    content: 'The following Act of the Tamil Nadu Legislative Assembly received the assent of the President on the 17th January, 1997 and is hereby published for general information.',
  },
  {
    id: 'act-no-7-1997',
    title: 'Act No.7 of 1997',
    icon: 'Gavel',
    introduction: 'An Act to prohibit Ragging in educational institutions in the State of Tamil Nadu.',
    subsections: [
      {
        title: 'Short title, extent and commencement',
        content: '(1) This Act may be called the Tamil Nadu Prohibition of Ragging Act, 1996.\n(2) It extends to the whole of the State of Tamil Nadu.\n(3) It shall come into force at once.',
      },
      {
        title: 'Definition',
        content: 'In this act, unless the context otherwise requires, "Ragging" means display of noisy, disorderly conduct doing any act which causes or is likely to cause physical or psychological harm or raise apprehension or fear or shame or embarrassment to a student in any educational institution and includes:\n(a) teasing, abusing of playing practical jokes on, or causing hurt to such student, or\n(b) asking the student to do any act or perform something which such student will not in the ordinary course willingly do.',
      },
      {
        title: 'Penalty for Ragging',
        content: 'Whoever directly or indirectly commits, participates in, abets or propagates "ragging" within or outside any educational institution, shall be punished with imprisonment for a term which may extend to two years and shall also be liable to a fine which may extend to ten thousand rupees.',
      },
      {
        title: 'Dismissal of Student',
        content: 'Any student convicted of an offence under section 3 shall also be dismissed from the educational institution and such student shall not be admitted in any other educational institution.',
      },
      {
        title: 'Suspension of Students',
        content: '(1) Whenever any student or, as the case may be, the parent or guardian, or a teacher of an educational institution complains in writing, of ragging to the Head of the educational institution, the Head of that educational institution shall, without prejudice to the foregoing provisions, within seven days of the receipt of the complaint, enquire into the matter mentioned in the complaint and if, prima facie, it is found true, suspend the student who is accused of the offence, and shall, immediately forward the complaint to the police station having jurisdiction over the area in which the educational institution is situated, for further action.\n(2) Where on enquiry by the Head of the Educational institution, it is proved that there is no substance prima facie, in the complaint received under sub-section (1), he shall intimate the fact, in writing, to the complainant.',
      },
    ],
  },
  {
    id: 'dress-code',
    title: 'Dress Code',
    icon: 'Shirt',
    content: 'The students are expected to wear decent dress while in the campus. Inappropriate dress worn by them shall be viewed seriously by the Institution. The students found with improper dress will not be allowed into the lecture halls. The students shall come with shoes / Full covered chappals only. Students should come with the specified college dress on all working days. Wearing Lanyard ID Card is compulsory.',
  },
  {
    id: 'attendance-and-leave',
    title: 'Students Attendance and Leave',
    icon: 'Clock',
    rules: [
      { text: 'Students should attend the classes regularly.' },
      { text: 'However, leave of absence will have to be obtained as per the following procedure. Leave letter will be submitted to the Academic Co-ordinator who will forward the same to the HoD for sanction of leave.' },
      { text: 'Medical Leave: The student will submit a Medical Certificate signed by a Registered Medical Practitioner on the day he/she resumes duty.' },
      { text: 'Casual Leave: The student will submit the letter requesting permission for leave of absence in advance for the day(s) he/she will be absent.' },
      { text: 'Leave on Duty: The student who participates in any activity outside the campus representing the college will be marked as On Duty (OD). Prior sanction should be obtained from the Principal through the HoD and the Academic Co-ordinator.' },
      { text: 'The students who have not attained 75% of attendance (subject wise) may not be allowed to appear for the End Semester Examination.' },
    ],
  },
  {
    id: 'identity-card',
    title: 'Identity Card',
    icon: 'CreditCard',
    content: 'An identity card, displaying the details of the students will be issued by the college. All students shall wear the identity card (with Lanyard) while in campus. Entry into the campus will not be allowed, without wearing identity card.',
  },
  {
    id: 'wearing-helmet',
    title: 'Wearing Helmet',
    icon: 'Bike',
    content: 'Wearing helmet is compulsory for all the two wheeler riders. Entry into the campus will not be allowed without wearing helmet.',
  },
  {
    id: 'mobile-phone',
    title: 'Mobile Phone',
    icon: 'Smartphone',
    content: 'Possession and use of mobile phone is prohibited inside the classroom. Severe action will be initiated against the offenders.',
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
  const icons: Record<string, typeof Info> = {
    Info,
    ClipboardList,
    AlertTriangle,
    Gavel,
    Shirt,
    Clock,
    CreditCard,
    Bike,
    Smartphone,
    BookOpen,
    Shield,
    FileWarning,
  }
  return icons[iconName] || ClipboardList
}

/**
 * Parse content with basic formatting
 */
function parseContent(content: string) {
  const lines = content.split('\n')
  return lines.map((line, index) => {
    // Empty line
    if (line.trim() === '') {
      return <br key={index} />
    }

    // Regular paragraph
    return (
      <p key={index} className="mb-2 leading-relaxed">
        {line}
      </p>
    )
  })
}

/**
 * Rule Section Card Component
 */
function RuleSectionCard({
  section,
  index,
  variant,
  cardStyle,
}: {
  section: RuleSection
  index: number
  variant: 'modern-dark' | 'modern-light'
  cardStyle: 'glass' | 'solid' | 'gradient'
}) {
  const { ref, isInView } = useInView(0.1)
  const IconComponent = getIconComponent(section.icon || 'ClipboardList')
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

      {/* Section Introduction */}
      {section.introduction && (
        <p
          className={cn(
            'mb-6 text-base leading-relaxed italic',
            isDark ? 'text-gray-300' : 'text-gray-700'
          )}
        >
          {section.introduction}
        </p>
      )}

      {/* Section Content (plain text) */}
      {section.content && (
        <div
          className={cn(
            'text-base leading-relaxed',
            isDark ? 'text-gray-300' : 'text-gray-700'
          )}
        >
          {parseContent(section.content)}
        </div>
      )}

      {/* Numbered Rules List */}
      {section.rules && section.rules.length > 0 && (
        <ol className="space-y-4">
          {section.rules.map((rule, ruleIndex) => (
            <li
              key={ruleIndex}
              className={cn(
                'flex gap-4',
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}
            >
              <span
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  'bg-[#0b6d41]/10 text-[#0b6d41]'
                )}
              >
                {ruleIndex + 1}
              </span>
              <div className="flex-1 pt-1">
                <p className="leading-relaxed">{rule.text}</p>
                {rule.subItems && rule.subItems.length > 0 && (
                  <ul className="mt-2 ml-4 space-y-1">
                    {rule.subItems.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className={cn(
                          'flex items-start gap-2',
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        )}
                      >
                        <span className="text-[#0b6d41] mt-1.5">•</span>
                        <span className="text-sm leading-relaxed">{subItem}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {/* Subsections (for Act provisions) */}
      {section.subsections && section.subsections.length > 0 && (
        <div className="mt-6 space-y-6">
          {section.subsections.map((subsection, subIndex) => (
            <div
              key={subIndex}
              className={cn(
                'pl-4 border-l-2',
                'border-[#0b6d41]/30'
              )}
            >
              <h3
                className={cn(
                  'text-lg font-semibold mb-3',
                  isDark ? 'text-white' : 'text-[#0b6d41]'
                )}
              >
                {subIndex + 1}. {subsection.title}
              </h3>
              <div
                className={cn(
                  'text-sm leading-relaxed',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}
              >
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
 * Table of Contents Component
 */
function TableOfContents({
  sections,
  isDark,
}: {
  sections: RuleSection[]
  isDark: boolean
}) {
  return (
    <div
      className={cn(
        'mb-12 p-6 md:p-8 rounded-2xl',
        'backdrop-blur-md border',
        isDark
          ? 'bg-white/10 border-white/20'
          : 'bg-white/80 border-white/40 shadow-lg'
      )}
    >
      <h2
        className={cn(
          'text-xl font-bold mb-4',
          isDark ? 'text-white' : 'text-[#0b6d41]'
        )}
      >
        Table of Contents
      </h2>
      <nav>
        <ol className="space-y-2">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={cn(
                  'flex items-center gap-3 py-2 px-3 rounded-lg transition-colors',
                  isDark
                    ? 'hover:bg-white/10 text-gray-300 hover:text-white'
                    : 'hover:bg-[#0b6d41]/5 text-gray-700 hover:text-[#0b6d41]'
                )}
              >
                <span
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                    'bg-[#0b6d41]/10 text-[#0b6d41]'
                  )}
                >
                  {index + 1}
                </span>
                <span>{section.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}

/**
 * InstitutionRulesPage Component
 */
export default function InstitutionRulesPage({
  showHeader = true,
  headerTitle = 'Institution Rules',
  headerSubtitle,
  lastUpdated,
  sections = defaultRuleSections,
  showTableOfContents = false,
  variant = 'modern-light',
  cardStyle = 'glass',
  showDecorations = true,
  className,
}: InstitutionRulesPageProps) {
  const { ref: headerRef, isInView: headerInView } = useInView(0.1)
  const isDark = variant === 'modern-dark'

  const displaySections = sections?.length > 0 ? sections : defaultRuleSections

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
                  <ClipboardList className="w-10 h-10 text-white" />
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
              {lastUpdated && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                  <span className="text-white/70 text-sm">Last Updated:</span>
                  <span className="text-[#ffde59] font-medium text-sm">{lastUpdated}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Table of Contents */}
          {showTableOfContents && (
            <TableOfContents sections={displaySections} isDark={isDark} />
          )}

          {/* Rule Sections */}
          <div className="space-y-8">
            {displaySections.map((section, index) => (
              <div key={section.id} id={section.id}>
                <RuleSectionCard
                  section={section}
                  index={index}
                  variant={variant}
                  cardStyle={cardStyle}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
