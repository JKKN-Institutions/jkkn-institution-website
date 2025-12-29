'use client'

import { useActionState, useState, useRef, useEffect, useMemo } from 'react'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import {
  submitAdmissionInquiry,
  type AdmissionInquiryFormState,
} from '@/app/actions/admission-inquiry'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  Loader2,
  Send,
  CheckCircle2,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Clock,
  Download,
  Video,
  Award,
  MessageCircle,
  User,
  Building2,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { DecorativePatterns, CurveDivider } from '../shared/decorative-patterns'

// ==========================================
// Props Schema Definition
// ==========================================

const CollegeOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  courses: z.array(z.string()),
})

const SuccessLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  icon: z.string().optional(),
})

export const AdmissionInquiryFormPropsSchema = z.object({
  // Section Header
  sectionTitle: z.string().default('Start Your Journey with JKKN'),
  sectionSubtitle: z
    .string()
    .default('Get personalized guidance from our admission counsellors'),
  showHeader: z.boolean().default(true),
  badge: z.string().default('Admissions Open'),

  // Form Labels
  formLabels: z
    .object({
      fullName: z.string().optional(),
      mobileNumber: z.string().optional(),
      email: z.string().optional(),
      college: z.string().optional(),
      course: z.string().optional(),
      qualification: z.string().optional(),
      districtCity: z.string().optional(),
      contactTime: z.string().optional(),
      consent: z.string().optional(),
    })
    .optional(),

  // Placeholders
  placeholders: z
    .object({
      fullName: z.string().optional(),
      mobileNumber: z.string().optional(),
      email: z.string().optional(),
      college: z.string().optional(),
      course: z.string().optional(),
      qualification: z.string().optional(),
      districtCity: z.string().optional(),
      contactTime: z.string().optional(),
    })
    .optional(),

  // College Options
  collegeOptions: z.array(CollegeOptionSchema).default([
    {
      id: 'dental',
      name: 'JKKN Dental College & Hospital',
      courses: [
        'BDS',
        'MDS - Orthodontics',
        'MDS - Prosthodontics',
        'MDS - Periodontics',
        'MDS - Oral Surgery',
      ],
    },
    {
      id: 'pharmacy',
      name: 'JKKN College of Pharmacy',
      courses: ['B.Pharm', 'M.Pharm', 'Pharm.D', 'D.Pharm'],
    },
    {
      id: 'engineering',
      name: 'JKKN College of Engineering & Technology',
      courses: ['B.E. CSE', 'B.E. ECE', 'B.E. EEE', 'B.E. Mechanical', 'M.E.', 'MBA'],
    },
    {
      id: 'arts',
      name: 'JKKN College of Arts & Science',
      courses: ['B.Sc', 'M.Sc', 'BBA', 'BCA', 'B.Com', 'BA'],
    },
    {
      id: 'nursing',
      name: 'Sresakthimayeil Institute Of Nursing And Research',
      courses: ['B.Sc Nursing', 'M.Sc Nursing', 'GNM', 'ANM'],
    },
    {
      id: 'allied',
      name: 'JKKN College of Allied Health Sciences',
      courses: ['BPT', 'BMLT', 'B.Sc Radiology', 'B.Sc Cardiac Technology'],
    },
    {
      id: 'education',
      name: 'JKKN College of Education',
      courses: ['B.Ed', 'M.Ed', 'D.El.Ed'],
    },
    {
      id: 'school',
      name: 'JKKN Matriculation Higher Secondary School',
      courses: ['Pre-KG to 12th Standard'],
    },
  ]),

  // Qualification Options
  qualificationOptions: z.array(z.string()).default([
    '10th / SSLC',
    '12th / HSC',
    'Diploma',
    "Undergraduate (Bachelor's)",
    "Postgraduate (Master's)",
    'Other',
  ]),

  // Contact Time Options
  contactTimeOptions: z.array(z.string()).default([
    'Morning (9 AM - 12 PM)',
    'Afternoon (12 PM - 3 PM)',
    'Evening (3 PM - 6 PM)',
    'Any Time',
  ]),

  // Success Message Configuration
  successMessage: z
    .object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      callbackMessage: z.string().optional(),
      referencePrefix: z.string().optional(),
      emailConfirmation: z.string().optional(),
    })
    .optional(),

  // WhatsApp Configuration
  whatsappNumber: z.string().default('+919345855001'),
  whatsappMessage: z
    .string()
    .default('Hi, I just submitted an admission inquiry. My reference number is: '),

  // Success Links
  successLinks: z.array(SuccessLinkSchema).default([
    { label: 'Download Prospectus', url: '/downloads/prospectus.pdf', icon: 'Download' },
    { label: 'Virtual Campus Tour', url: '/virtual-tour', icon: 'Video' },
    { label: 'Scholarship Information', url: '/scholarships', icon: 'Award' },
  ]),

  // Styling Options
  variant: z.enum(['glass', 'solid']).default('glass'),
  theme: z.enum(['light', 'dark']).default('light'),
  backgroundColor: z
    .enum(['gradient-dark', 'gradient-light', 'solid-white', 'white-glassmorphism', 'white-professional', 'transparent'])
    .default('solid-white'),
  cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
  showAnimations: z.boolean().default(true),

  // Title/Subtitle Colors
  sectionTitleColor: z.string().optional(),
  sectionSubtitleColor: z.string().optional(),

  // Layout
  layout: z.enum(['single-column', 'two-column']).default('two-column'),
  showDecorations: z.boolean().default(true),
})

export type AdmissionInquiryFormProps = z.infer<typeof AdmissionInquiryFormPropsSchema> &
  BaseBlockProps

// ==========================================
// Icon Mapping
// ==========================================

const ICON_MAP: Record<string, LucideIcon> = {
  Download,
  Video,
  Award,
  MessageCircle,
  Phone,
  Mail,
  GraduationCap,
  User,
  Building2,
  BookOpen,
  MapPin,
  Clock,
}

function getIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Download
}

// ==========================================
// Style Classes
// ==========================================

const backgroundClasses = {
  'gradient-dark': 'bg-gradient-to-br from-primary via-primary/95 to-secondary',
  'gradient-light': 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
  'solid-white': 'bg-white',
  'white-glassmorphism': 'bg-white',
  'white-professional': 'bg-gradient-to-br from-white via-gray-50/30 to-white',
  transparent: 'bg-transparent',
}

const cardStyleClasses = {
  glass: {
    dark: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl',
    light: 'bg-white/90 backdrop-blur-2xl border border-gray-200/50 shadow-[0_8px_40px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.02]',
  },
  solid: {
    dark: 'bg-gray-900/90 border border-gray-700 shadow-2xl',
    light: 'bg-white border border-gray-200 shadow-xl',
  },
  gradient: {
    dark: 'bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl',
    light: 'bg-gradient-to-br from-white via-white to-gray-50/50 border border-gray-100 shadow-xl',
  },
}

const inputClasses = {
  dark: 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-gold/50 focus:ring-gold/20',
  light:
    'bg-gray-50/50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary/20 focus:bg-white transition-colors',
}

// ==========================================
// Section Header Component
// ==========================================

function SectionHeader({
  badge,
  title,
  subtitle,
  isDark,
  isVisible,
  showAnimations,
  titleColor,
  subtitleColor,
}: {
  badge: string
  title: string
  subtitle: string
  isDark: boolean
  isVisible: boolean
  showAnimations: boolean
  titleColor?: string
  subtitleColor?: string
}) {
  return (
    <div
      className={cn(
        'max-w-3xl mx-auto text-center mb-10 lg:mb-12',
        showAnimations && 'transition-all duration-700',
        showAnimations && (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
      )}
    >
      {badge && (
        <div className="flex justify-center mb-4">
          <span
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase',
              isDark
                ? 'bg-gold/20 text-gold border border-gold/30'
                : 'bg-primary/10 text-primary border border-primary/20'
            )}
          >
            <GraduationCap className="w-4 h-4" />
            {badge}
          </span>
        </div>
      )}

      <h2
        className={cn(
          'text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 not-italic',
          !titleColor && (isDark ? 'text-white' : 'text-primary')
        )}
        style={{ color: titleColor }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            'text-lg md:text-xl max-w-2xl mx-auto',
            !subtitleColor && (isDark ? 'text-white/80' : 'text-gray-600')
          )}
          style={{ color: subtitleColor }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ==========================================
// Success State Component
// ==========================================

function SuccessState({
  referenceNumber,
  successMessage,
  whatsappNumber,
  whatsappMessage,
  successLinks,
  isDark,
}: {
  referenceNumber: string
  successMessage: AdmissionInquiryFormProps['successMessage']
  whatsappNumber: string
  whatsappMessage: string
  successLinks: AdmissionInquiryFormProps['successLinks']
  isDark: boolean
}) {
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage + referenceNumber)}`

  return (
    <div className="text-center py-8 space-y-6 animate-in fade-in-0 zoom-in-95 duration-500">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div
          className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center',
            isDark ? 'bg-green-500/20' : 'bg-green-100'
          )}
        >
          <CheckCircle2
            className={cn('w-12 h-12', isDark ? 'text-green-400' : 'text-green-600')}
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <h3
          className={cn(
            'text-2xl sm:text-3xl font-bold mb-2',
            isDark ? 'text-white' : 'text-gray-900'
          )}
        >
          {successMessage?.title}
        </h3>
        <p className={cn('text-lg', isDark ? 'text-white/80' : 'text-gray-600')}>
          {successMessage?.subtitle}
        </p>
      </div>

      {/* Reference Number */}
      <div
        className={cn(
          'inline-block px-6 py-4 rounded-xl',
          isDark ? 'bg-white/10 border border-white/20' : 'bg-gray-100 border border-gray-200'
        )}
      >
        <p className={cn('text-sm mb-1', isDark ? 'text-white/60' : 'text-gray-500')}>
          {successMessage?.referencePrefix}
        </p>
        <p
          className={cn(
            'text-xl sm:text-2xl font-mono font-bold tracking-wider',
            isDark ? 'text-gold' : 'text-primary'
          )}
        >
          {referenceNumber}
        </p>
      </div>

      {/* Info Messages */}
      <div className="space-y-2">
        <p className={cn('flex items-center justify-center gap-2', isDark ? 'text-white/80' : 'text-gray-600')}>
          <Phone className="w-4 h-4" />
          {successMessage?.callbackMessage}
        </p>
        <p className={cn('flex items-center justify-center gap-2', isDark ? 'text-white/80' : 'text-gray-600')}>
          <Mail className="w-4 h-4" />
          {successMessage?.emailConfirmation}
        </p>
      </div>

      {/* WhatsApp Button */}
      <div>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300',
            'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
          )}
        >
          <MessageCircle className="w-5 h-5" />
          Contact on WhatsApp
        </a>
      </div>

      {/* What's Next Section */}
      <div className={cn('pt-6 border-t', isDark ? 'border-white/10' : 'border-gray-200')}>
        <p
          className={cn(
            'text-sm font-semibold uppercase tracking-wider mb-4',
            isDark ? 'text-white/60' : 'text-gray-500'
          )}
        >
          What&apos;s Next?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {successLinks?.map((link, index) => {
            const IconComponent = getIcon(link.icon || 'Download')
            return (
              <a
                key={index}
                href={link.url}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                )}
              >
                <IconComponent className="w-4 h-4" />
                {link.label}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// Main Component
// ==========================================

export default function AdmissionInquiryForm({
  sectionTitle = 'Start Your Journey with JKKN',
  sectionSubtitle = 'Get personalized guidance from our admission counsellors',
  showHeader = true,
  badge = 'Admissions Open',
  formLabels = {},
  placeholders = {},
  collegeOptions = [],
  qualificationOptions = [],
  contactTimeOptions = [],
  successMessage = {},
  whatsappNumber = '+919345855001',
  whatsappMessage = 'Hi, I just submitted an admission inquiry. My reference number is: ',
  successLinks = [],
  variant = 'glass',
  theme = 'light',
  backgroundColor = 'solid-white',
  cardStyle = 'glass',
  showAnimations = true,
  sectionTitleColor,
  sectionSubtitleColor,
  layout = 'two-column',
  showDecorations = true,
  className,
  id,
}: AdmissionInquiryFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState('')
  const [consentChecked, setConsentChecked] = useState(false)

  const [state, formAction, isPending] = useActionState<AdmissionInquiryFormState | null, FormData>(
    submitAdmissionInquiry,
    null
  )

  // Merge with defaults
  const labels = {
    fullName: 'Full Name',
    mobileNumber: 'Mobile Number',
    email: 'Email Address',
    college: 'Select College',
    course: 'Course Interested',
    qualification: 'Current Qualification',
    districtCity: 'District / City',
    contactTime: 'Preferred Contact Time',
    consent: 'I agree to receive communications from JKKN regarding admissions',
    ...formLabels,
  }

  const placeholderTexts = {
    fullName: 'Enter your full name',
    mobileNumber: 'Enter 10-digit mobile number',
    email: 'Enter your email address',
    college: 'Choose a college',
    course: 'Select a course',
    qualification: 'Select your qualification',
    districtCity: 'Enter your district or city',
    contactTime: 'Select preferred time',
    ...placeholders,
  }

  const successMsgDefaults = {
    title: 'Thank You for Your Interest!',
    subtitle: 'Your inquiry has been submitted successfully.',
    callbackMessage: 'Our admissions team will contact you within 24 hours.',
    referencePrefix: 'Your Reference Number:',
    emailConfirmation: 'A confirmation email has been sent to your email address.',
    ...successMessage,
  }

  // Default colleges if none provided
  const colleges = collegeOptions.length > 0 ? collegeOptions : [
    { id: 'dental', name: 'JKKN Dental College & Hospital', courses: ['BDS', 'MDS - Orthodontics', 'MDS - Prosthodontics'] },
    { id: 'pharmacy', name: 'JKKN College of Pharmacy', courses: ['B.Pharm', 'M.Pharm', 'Pharm.D', 'D.Pharm'] },
    { id: 'engineering', name: 'JKKN College of Engineering & Technology', courses: ['B.E. CSE', 'B.E. ECE', 'B.E. Mechanical'] },
    { id: 'arts', name: 'JKKN College of Arts & Science', courses: ['B.Sc', 'M.Sc', 'BBA', 'BCA', 'B.Com'] },
    { id: 'nursing', name: 'Sresakthimayeil Institute Of Nursing And Research', courses: ['B.Sc Nursing', 'M.Sc Nursing', 'GNM'] },
    { id: 'allied', name: 'JKKN College of Allied Health Sciences', courses: ['BPT', 'BMLT', 'B.Sc Radiology'] },
    { id: 'education', name: 'JKKN College of Education', courses: ['B.Ed', 'M.Ed', 'D.El.Ed'] },
    { id: 'school', name: 'JKKN Matriculation Higher Secondary School', courses: ['Pre-KG to 12th Standard'] },
  ]

  const qualifications = qualificationOptions.length > 0 ? qualificationOptions : [
    '10th / SSLC',
    '12th / HSC',
    'Diploma',
    "Undergraduate (Bachelor's)",
    "Postgraduate (Master's)",
    'Other',
  ]

  const contactTimes = contactTimeOptions.length > 0 ? contactTimeOptions : [
    'Morning (9 AM - 12 PM)',
    'Afternoon (12 PM - 3 PM)',
    'Evening (3 PM - 6 PM)',
    'Any Time',
  ]

  const defaultSuccessLinks = successLinks.length > 0 ? successLinks : [
    { label: 'Download Prospectus', url: '/downloads/prospectus.pdf', icon: 'Download' },
    { label: 'Virtual Campus Tour', url: '/virtual-tour', icon: 'Video' },
    { label: 'Scholarship Information', url: '/scholarships', icon: 'Award' },
  ]

  // Get available courses based on selected college
  const availableCourses = useMemo(() => {
    const college = colleges.find((c) => c.name === selectedCollege)
    return college?.courses || []
  }, [selectedCollege, colleges])

  // Determine if dark theme
  const isDark = theme === 'dark'

  // Intersection observer for scroll animations
  useEffect(() => {
    if (!showAnimations) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [showAnimations])

  // Handle form state changes
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
    } else if (state?.message && !state.success) {
      toast.error(state.message)
    }
  }, [state])

  // Reset form and college selection on success
  useEffect(() => {
    if (state?.success) {
      setSelectedCollege('')
      setConsentChecked(false)
    }
  }, [state?.success])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn('relative py-16 lg:py-24 overflow-hidden', backgroundClasses[backgroundColor], className)}
    >
      {/* Decorative Patterns - Only show on dark themes for clean white backgrounds */}
      {showDecorations && isDark && <DecorativePatterns variant="scattered" />}

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        {showHeader && (
          <SectionHeader
            badge={badge}
            title={sectionTitle}
            subtitle={sectionSubtitle}
            isDark={isDark}
            isVisible={isVisible}
            showAnimations={showAnimations}
            titleColor={sectionTitleColor}
            subtitleColor={sectionSubtitleColor}
          />
        )}

        {/* Form Card */}
        <div
          className={cn(
            'max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 lg:p-10',
            cardStyleClasses[cardStyle][theme],
            'hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] transition-shadow duration-500',
            showAnimations && 'transition-all duration-700 delay-200',
            showAnimations && (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
          )}
        >
          {state?.success && state.referenceNumber ? (
            <SuccessState
              referenceNumber={state.referenceNumber}
              successMessage={successMsgDefaults}
              whatsappNumber={whatsappNumber}
              whatsappMessage={whatsappMessage}
              successLinks={defaultSuccessLinks}
              isDark={isDark}
            />
          ) : (
            <form ref={formRef} action={formAction} className="space-y-6">
              {/* Error Message */}
              {state?.message && !state.success && !state.errors && (
                <div
                  className={cn(
                    'p-4 rounded-xl flex items-start gap-3',
                    isDark
                      ? 'bg-red-500/20 border border-red-500/30'
                      : 'bg-red-50 border border-red-200'
                  )}
                >
                  <div
                    className={cn(
                      'p-1 rounded-full',
                      isDark ? 'bg-red-500/20' : 'bg-red-100'
                    )}
                  >
                    <CheckCircle2
                      className={cn('h-4 w-4', isDark ? 'text-red-400' : 'text-red-600')}
                    />
                  </div>
                  <p className={cn(isDark ? 'text-red-200' : 'text-red-700')}>
                    {state.message}
                  </p>
                </div>
              )}

              {/* Form Grid */}
              <div
                className={cn(
                  'grid gap-5',
                  layout === 'two-column' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                )}
              >
                {/* Full Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {labels.fullName} <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <User
                      className={cn(
                        'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
                        isDark ? 'text-white/40' : 'text-gray-400'
                      )}
                    />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder={placeholderTexts.fullName}
                      required
                      disabled={isPending}
                      className={cn('pl-10 h-12 rounded-xl', inputClasses[theme])}
                    />
                  </div>
                  {state?.errors?.fullName && (
                    <p className="text-sm text-red-400">{state.errors.fullName[0]}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <Label
                    htmlFor="mobileNumber"
                    className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {labels.mobileNumber} <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Phone
                      className={cn(
                        'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
                        isDark ? 'text-white/40' : 'text-gray-400'
                      )}
                    />
                    <Input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      placeholder={placeholderTexts.mobileNumber}
                      required
                      disabled={isPending}
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      className={cn('pl-10 h-12 rounded-xl', inputClasses[theme])}
                    />
                  </div>
                  {state?.errors?.mobileNumber && (
                    <p className="text-sm text-red-400">{state.errors.mobileNumber[0]}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {labels.email} <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Mail
                      className={cn(
                        'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
                        isDark ? 'text-white/40' : 'text-gray-400'
                      )}
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={placeholderTexts.email}
                      required
                      disabled={isPending}
                      className={cn('pl-10 h-12 rounded-xl', inputClasses[theme])}
                    />
                  </div>
                  {state?.errors?.email && (
                    <p className="text-sm text-red-400">{state.errors.email[0]}</p>
                  )}
                </div>

                {/* District/City */}
                <div className="space-y-2">
                  <Label
                    htmlFor="districtCity"
                    className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {labels.districtCity} <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin
                      className={cn(
                        'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
                        isDark ? 'text-white/40' : 'text-gray-400'
                      )}
                    />
                    <Input
                      id="districtCity"
                      name="districtCity"
                      type="text"
                      placeholder={placeholderTexts.districtCity}
                      required
                      disabled={isPending}
                      className={cn('pl-10 h-12 rounded-xl', inputClasses[theme])}
                    />
                  </div>
                  {state?.errors?.districtCity && (
                    <p className="text-sm text-red-400">{state.errors.districtCity[0]}</p>
                  )}
                </div>

                {/* College Select */}
                <div className="space-y-2">
                  <Label
                    htmlFor="collegeName"
                    className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {labels.college} <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    name="collegeName"
                    value={selectedCollege}
                    onValueChange={setSelectedCollege}
                    disabled={isPending}
                    required
                  >
                    <SelectTrigger
                      className={cn(
                        'h-12 rounded-xl',
                        inputClasses[theme],
                        isDark && '[&>span]:text-white [&>svg]:text-white/60'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Building2
                          className={cn(
                            'w-4 h-4',
                            isDark ? 'text-white/40' : 'text-gray-400'
                          )}
                        />
                        <SelectValue placeholder={placeholderTexts.college} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((college) => (
                        <SelectItem key={college.id} value={college.name}>
                          {college.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {state?.errors?.collegeName && (
                    <p className="text-sm text-red-400">{state.errors.collegeName[0]}</p>
                  )}
                </div>

                {/* Course Select (Dynamic) */}
                <div className="space-y-2">
                  <Label
                    htmlFor="courseInterested"
                    className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {labels.course} <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    name="courseInterested"
                    disabled={isPending || !selectedCollege}
                    required
                  >
                    <SelectTrigger
                      className={cn(
                        'h-12 rounded-xl',
                        inputClasses[theme],
                        isDark && '[&>span]:text-white [&>svg]:text-white/60',
                        !selectedCollege && 'opacity-60'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen
                          className={cn(
                            'w-4 h-4',
                            isDark ? 'text-white/40' : 'text-gray-400'
                          )}
                        />
                        <SelectValue
                          placeholder={
                            selectedCollege ? placeholderTexts.course : 'Select a college first'
                          }
                        />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {availableCourses.map((course, index) => (
                        <SelectItem key={index} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {state?.errors?.courseInterested && (
                    <p className="text-sm text-red-400">{state.errors.courseInterested[0]}</p>
                  )}
                </div>

                {/* Qualification Select */}
                <div className="space-y-2">
                  <Label
                    htmlFor="currentQualification"
                    className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {labels.qualification} <span className="text-red-400">*</span>
                  </Label>
                  <Select name="currentQualification" disabled={isPending} required>
                    <SelectTrigger
                      className={cn(
                        'h-12 rounded-xl',
                        inputClasses[theme],
                        isDark && '[&>span]:text-white [&>svg]:text-white/60'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap
                          className={cn(
                            'w-4 h-4',
                            isDark ? 'text-white/40' : 'text-gray-400'
                          )}
                        />
                        <SelectValue placeholder={placeholderTexts.qualification} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {qualifications.map((qual, index) => (
                        <SelectItem key={index} value={qual}>
                          {qual}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {state?.errors?.currentQualification && (
                    <p className="text-sm text-red-400">
                      {state.errors.currentQualification[0]}
                    </p>
                  )}
                </div>

                {/* Contact Time Select */}
                <div className="space-y-2">
                  <Label
                    htmlFor="preferredContactTime"
                    className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {labels.contactTime}
                  </Label>
                  <Select name="preferredContactTime" disabled={isPending}>
                    <SelectTrigger
                      className={cn(
                        'h-12 rounded-xl',
                        inputClasses[theme],
                        isDark && '[&>span]:text-white [&>svg]:text-white/60'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Clock
                          className={cn(
                            'w-4 h-4',
                            isDark ? 'text-white/40' : 'text-gray-400'
                          )}
                        />
                        <SelectValue placeholder={placeholderTexts.contactTime} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {contactTimes.map((time, index) => (
                        <SelectItem key={index} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="consentGiven"
                  name="consentGiven"
                  checked={consentChecked}
                  onCheckedChange={(checked) => setConsentChecked(checked === true)}
                  disabled={isPending}
                  required
                  className={cn(
                    'mt-0.5',
                    isDark
                      ? 'border-white/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold'
                      : 'border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                  )}
                />
                <Label
                  htmlFor="consentGiven"
                  className={cn(
                    'text-sm cursor-pointer leading-relaxed',
                    isDark ? 'text-white/80' : 'text-gray-600'
                  )}
                >
                  {labels.consent} <span className="text-red-400">*</span>
                </Label>
              </div>
              {state?.errors?.consentGiven && (
                <p className="text-sm text-red-400 -mt-4">{state.errors.consentGiven[0]}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending || !consentChecked}
                className={cn(
                  'w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300',
                  isDark
                    ? 'bg-gold hover:bg-gold/90 text-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 hover:-translate-y-0.5',
                  (isPending || !consentChecked) && 'opacity-60 cursor-not-allowed hover:translate-y-0'
                )}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="h-5 w-5" />
                    Submit Inquiry
                  </span>
                )}
              </Button>

              {/* Privacy Note */}
              <p
                className={cn(
                  'text-xs text-center',
                  isDark ? 'text-white/50' : 'text-gray-500'
                )}
              >
                By submitting this form, you agree to our{' '}
                <a
                  href="/privacy-policy"
                  className={cn(
                    'underline hover:no-underline',
                    isDark ? 'text-gold/80 hover:text-gold' : 'text-primary hover:text-primary/80'
                  )}
                >
                  Privacy Policy
                </a>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Curve Divider - Only show on dark themes for clean white backgrounds */}
      {showDecorations && isDark && (
        <CurveDivider position="bottom" color="#ffffff" />
      )}
    </section>
  )
}
