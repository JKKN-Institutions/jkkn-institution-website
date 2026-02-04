'use client'

import React, { useState } from 'react'
import { z } from 'zod'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Briefcase,
  Users,
  Award,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  UserCheck,
  FileText,
  IndianRupee,
  TrendingUp,
  DollarSign,
  Package,
  GraduationCap,
  Target,
  Lightbulb,
  BarChart3,
} from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

// ============================================
// Zod Schemas for Type Safety
// ============================================

const HeroStatSchema = z.object({
  icon: z.string(),
  label: z.string(),
  value: z.string(),
})

const HeroCTASchema = z.object({
  label: z.string(),
  link: z.string(),
  variant: z.enum(['primary', 'secondary']),
})

const HighlightCardSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
})

const SpecializationSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  courses: z.array(z.string()),
})

const SubjectSchema = z.object({
  code: z.string().optional(),
  name: z.string(),
  credits: z.number().optional(),
})

const SemesterSchema = z.object({
  semester: z.number(),
  credits: z.number(),
  subjects: z.array(SubjectSchema),
})

const YearSchema = z.object({
  year: z.number(),
  semesters: z.array(SemesterSchema),
})

const EligibilityItemSchema = z.object({
  criteria: z.string(),
})

const AdmissionStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
})

const FeeComponentSchema = z.object({
  component: z.string(),
  amount: z.string(),
  isTotal: z.boolean().optional(),
})

const CareerPathSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  avgSalary: z.string().optional(),
})

const PlacementStatSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.string(),
})

const FacilitySchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  description: z.string(),
})

const FacultySchema = z.object({
  name: z.string(),
  designation: z.string(),
  qualification: z.string(),
  specialization: z.string().optional(),
  image: z.string().optional(),
})

const FAQSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

export const MBACoursePagePropsSchema = z.object({
  // Hero Section
  heroTitle: z.string(),
  heroSubtitle: z.string().optional(),
  heroStats: z.array(HeroStatSchema),
  heroCTAs: z.array(HeroCTASchema),
  affiliatedTo: z.string().optional(),
  admissionBadge: z.string().optional(),

  // Program Overview
  overviewTitle: z.string(),
  overviewSubtitle: z.string(),
  overviewDescription: z.array(z.string()),
  overviewImage: z.string().optional(),

  // Key Highlights
  highlightsTitle: z.string(),
  highlights: z.array(HighlightCardSchema),

  // Specializations
  specializationsTitle: z.string(),
  specializations: z.array(SpecializationSchema),

  // Curriculum
  curriculumTitle: z.string(),
  curriculumYears: z.array(YearSchema),

  // Eligibility & Admission
  eligibilityTitle: z.string(),
  eligibilityItems: z.array(EligibilityItemSchema),
  documentsTitle: z.string(),
  requiredDocuments: z.array(z.string()),

  // Admission Process
  admissionProcessTitle: z.string(),
  admissionSteps: z.array(AdmissionStepSchema),

  // Fee Structure
  feeTitle: z.string(),
  feeBreakdown: z.array(FeeComponentSchema),
  feeDisclaimer: z.string().optional(),

  // Career Opportunities
  careerTitle: z.string(),
  careerPaths: z.array(CareerPathSchema),

  // Placement Statistics
  placementTitle: z.string(),
  placementStats: z.array(PlacementStatSchema),

  // Top Recruiters
  recruitersTitle: z.string(),
  recruiters: z.array(z.string()),

  // Facilities
  facilitiesTitle: z.string(),
  facilities: z.array(FacilitySchema),

  // Faculty
  facultyTitle: z.string(),
  faculty: z.array(FacultySchema),

  // FAQ
  faqTitle: z.string(),
  faqs: z.array(FAQSchema),

  // Final CTA
  ctaTitle: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaPrimaryButtonLabel: z.string().optional(),
  ctaPrimaryButtonLink: z.string().optional(),
  ctaSecondaryButtonLabel: z.string().optional(),
  ctaSecondaryButtonLink: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  contactAddress: z.string().optional(),

  // Styling
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
})

export type MBACoursePageProps = z.infer<typeof MBACoursePagePropsSchema>

// ============================================
// Main Component
// ============================================

export function MBACoursePage(props: MBACoursePageProps) {
  const {
    heroTitle,
    heroSubtitle,
    heroStats,
    heroCTAs,
    affiliatedTo,
    admissionBadge,
    overviewTitle,
    overviewSubtitle,
    overviewDescription,
    overviewImage,
    highlightsTitle,
    highlights,
    specializationsTitle,
    specializations,
    curriculumTitle,
    curriculumYears,
    eligibilityTitle,
    eligibilityItems,
    documentsTitle,
    requiredDocuments,
    admissionProcessTitle,
    admissionSteps,
    feeTitle,
    feeBreakdown,
    feeDisclaimer,
    careerTitle,
    careerPaths,
    placementTitle,
    placementStats,
    recruitersTitle,
    recruiters,
    facilitiesTitle,
    facilities,
    facultyTitle,
    faculty,
    faqTitle,
    faqs,
    ctaTitle,
    ctaDescription,
    ctaPrimaryButtonLabel,
    ctaPrimaryButtonLink,
    ctaSecondaryButtonLabel,
    ctaSecondaryButtonLink,
    contactPhone,
    contactEmail,
    contactAddress,
    primaryColor = '#0b6d41', // JKKN Green
    accentColor = '#ffde59', // JKKN Yellow
  } = props

  return (
    <div className="w-full bg-[#fbfbee]">
      {/* Hero Section */}
      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        stats={heroStats}
        ctas={heroCTAs}
        affiliatedTo={affiliatedTo}
        admissionBadge={admissionBadge}
        primaryColor={primaryColor}
        accentColor={accentColor}
      />

      {/* Program Overview */}
      <ProgramOverviewSection
        title={overviewTitle}
        subtitle={overviewSubtitle}
        description={overviewDescription}
        image={overviewImage}
        primaryColor={primaryColor}
      />

      {/* Key Highlights */}
      <KeyHighlightsSection
        title={highlightsTitle}
        highlights={highlights}
        primaryColor={primaryColor}
      />

      {/* Specializations */}
      <SpecializationsSection
        title={specializationsTitle}
        specializations={specializations}
        primaryColor={primaryColor}
        accentColor={accentColor}
      />

      {/* Curriculum */}
      <CurriculumSection
        title={curriculumTitle}
        years={curriculumYears}
        primaryColor={primaryColor}
      />

      {/* Eligibility & Admission */}
      <EligibilityAdmissionSection
        eligibilityTitle={eligibilityTitle}
        eligibilityItems={eligibilityItems}
        documentsTitle={documentsTitle}
        requiredDocuments={requiredDocuments}
        primaryColor={primaryColor}
      />

      {/* Admission Process */}
      <AdmissionProcessSection
        title={admissionProcessTitle}
        steps={admissionSteps}
        primaryColor={primaryColor}
      />

      {/* Fee Structure - Hidden as per requirement */}
      {/* <FeeStructureSection
        title={feeTitle}
        feeBreakdown={feeBreakdown}
        disclaimer={feeDisclaimer}
        primaryColor={primaryColor}
      /> */}

      {/* Career Opportunities */}
      <CareerOpportunitiesSection
        title={careerTitle}
        careers={careerPaths}
        primaryColor={primaryColor}
      />

      {/* Placement Statistics */}
      <PlacementStatisticsSection
        title={placementTitle}
        stats={placementStats}
        primaryColor={primaryColor}
      />

      {/* Top Recruiters */}
      <TopRecruitersSection
        title={recruitersTitle}
        recruiters={recruiters}
        primaryColor={primaryColor}
      />

      {/* Facilities */}
      <FacilitiesSection
        title={facilitiesTitle}
        facilities={facilities}
        primaryColor={primaryColor}
      />

      {/* Faculty */}
      <FacultySection title={facultyTitle} faculty={faculty} primaryColor={primaryColor} />

      {/* FAQ */}
      <FAQSection title={faqTitle} faqs={faqs} primaryColor={primaryColor} />

      {/* Final CTA */}
      <FinalCTASection
        title={ctaTitle}
        description={ctaDescription}
        primaryButtonLabel={ctaPrimaryButtonLabel}
        primaryButtonLink={ctaPrimaryButtonLink}
        secondaryButtonLabel={ctaSecondaryButtonLabel}
        secondaryButtonLink={ctaSecondaryButtonLink}
        phone={contactPhone}
        email={contactEmail}
        address={contactAddress}
        primaryColor={primaryColor}
        accentColor={accentColor}
      />
    </div>
  )
}

// ============================================
// Section Components
// ============================================

// Hero Section
function HeroSection({
  title,
  subtitle,
  stats,
  ctas,
  affiliatedTo,
  admissionBadge,
  primaryColor,
  accentColor,
}: {
  title: string
  subtitle?: string
  stats: Array<{ icon: string; label: string; value: string }>
  ctas: Array<{ label: string; link: string; variant: 'primary' | 'secondary' }>
  affiliatedTo?: string
  admissionBadge?: string
  primaryColor: string
  accentColor: string
}) {
  return (
    <section className="relative py-20 md:py-24 lg:py-28 bg-gradient-to-br from-[#fbfbee] to-[#fff0a3] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Admission Badge */}
            {admissionBadge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md animate-pulse">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-semibold text-gray-800">{admissionBadge}</span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">Master of </span>
              <span style={{ color: primaryColor }}>Business Administration</span>
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">{subtitle}</p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-2xl md:text-3xl font-bold" style={{ color: primaryColor }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              {ctas.map((cta, index) =>
                cta.variant === 'primary' ? (
                  <a
                    key={index}
                    href={cta.link}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    style={{ backgroundColor: accentColor }}
                  >
                    {cta.label}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                ) : (
                  <a
                    key={index}
                    href={cta.link}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold bg-white text-gray-800 border-2 transition-all duration-200 hover:shadow-lg"
                    style={{ borderColor: primaryColor }}
                  >
                    {cta.label}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Right: Image & Affiliation */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/courses/mba/JKKN MBA (1).png"
                alt="MBA Students"
                className="w-full h-auto object-cover"
              />

              {/* Affiliation Badge */}
              {affiliatedTo && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" style={{ color: primaryColor }} />
                    <span className="text-sm font-semibold text-gray-800">{affiliatedTo}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Program Overview Section
function ProgramOverviewSection({
  title,
  subtitle,
  description,
  image,
  primaryColor,
}: {
  title: string
  subtitle: string
  description: string[]
  image?: string
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
                {title}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{subtitle}</h2>
            </div>

            <div className="space-y-4">
              {description.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          {image && (
            <div className="relative">
              <img
                src={image}
                alt="Program Overview"
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Key Highlights Section
function KeyHighlightsSection({
  title,
  highlights,
  primaryColor,
}: {
  title: string
  highlights: Array<{ icon: string; title: string; description: string }>
  primaryColor: string
}) {
  const iconMap: Record<string, any> = {
    Award,
    Users,
    GraduationCap,
    Briefcase,
    Target,
    Lightbulb,
    BookOpen,
    BarChart3,
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#fbfbee] to-[#ffffff]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => {
            const IconComponent = iconMap[highlight.icon] || Lightbulb
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <IconComponent className="w-10 h-10 mb-4" style={{ color: primaryColor }} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{highlight.title}</h3>
                <p className="text-sm text-gray-600">{highlight.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Specializations Section
function SpecializationsSection({
  title,
  specializations,
  primaryColor,
  accentColor,
}: {
  title: string
  specializations: Array<{
    title: string
    description: string
    icon: string
    courses: string[]
  }>
  primaryColor: string
  accentColor: string
}) {
  const iconMap: Record<string, any> = {
    TrendingUp,
    DollarSign,
    Users,
    Package,
    BarChart3,
    Target,
  }

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specializations.map((spec, index) => {
            const IconComponent = iconMap[spec.icon] || Target
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-[#fbfbee] to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <IconComponent className="w-12 h-12 mb-4" style={{ color: accentColor }} />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{spec.title}</h3>
                <p className="text-sm text-gray-700 mb-4">{spec.description}</p>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">
                    Key Courses:
                  </p>
                  <ul className="space-y-1">
                    {spec.courses.map((course, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                        <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} />
                        <span>{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Curriculum Section with Year Tabs
function CurriculumSection({
  title,
  years,
  primaryColor,
}: {
  title: string
  years: Array<{
    year: number
    semesters: Array<{
      semester: number
      credits: number
      subjects: Array<{ code?: string; name: string; credits?: number }>
    }>
  }>
  primaryColor: string
}) {
  const [activeYear, setActiveYear] = useState(1)

  const currentYearData = years.find((y) => y.year === activeYear)

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#fbfbee] to-[#ffffff]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">{title}</h2>

        {/* Year Tabs */}
        <div className="flex justify-center mb-8 gap-2">
          {years.map((year) => (
            <button
              key={year.year}
              onClick={() => setActiveYear(year.year)}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeYear === year.year
                  ? 'text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              style={
                activeYear === year.year
                  ? { backgroundColor: primaryColor }
                  : {}
              }
            >
              Year {year.year}
            </button>
          ))}
        </div>

        {/* Semester Cards */}
        {currentYearData && (
          <div className="space-y-8">
            {currentYearData.semesters.map((semester) => (
              <div
                key={semester.semester}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
              >
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Semester {semester.semester}
                  </h3>
                  <span
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Total Credits: {semester.credits}
                  </span>
                </div>

                {/* Subject Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {semester.subjects.map((subject, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-[#fbfbee] to-white rounded-lg p-4 border-l-4 hover:shadow-md transition-shadow"
                      style={{ borderLeftColor: primaryColor }}
                    >
                      {subject.code && (
                        <p className="text-xs font-mono text-gray-500 mb-1">{subject.code}</p>
                      )}
                      <p className="font-semibold text-sm text-gray-900 mb-1">{subject.name}</p>
                      {subject.credits && (
                        <p className="text-xs text-gray-600">{subject.credits} Credits</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Eligibility & Admission Section
function EligibilityAdmissionSection({
  eligibilityTitle,
  eligibilityItems,
  documentsTitle,
  requiredDocuments,
  primaryColor,
}: {
  eligibilityTitle: string
  eligibilityItems: Array<{ criteria: string }>
  documentsTitle: string
  requiredDocuments: string[]
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Eligibility Criteria */}
          <div className="bg-gradient-to-br from-[#fbfbee] to-white rounded-xl p-8 shadow-md border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{eligibilityTitle}</h3>
            <ul className="space-y-4">
              {eligibilityItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: primaryColor }} />
                  <span className="text-gray-700">{item.criteria}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents */}
          <div className="bg-gradient-to-br from-[#fbfbee] to-white rounded-xl p-8 shadow-md border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{documentsTitle}</h3>
            <ul className="space-y-4">
              {requiredDocuments.map((doc, index) => (
                <li key={index} className="flex items-start gap-3">
                  <FileText className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: primaryColor }} />
                  <span className="text-gray-700">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// Admission Process Section
function AdmissionProcessSection({
  title,
  steps,
  primaryColor,
}: {
  title: string
  steps: Array<{ step: number; title: string; description: string; icon: string }>
  primaryColor: string
}) {
  const iconMap: Record<string, any> = {
    FileText,
    UserCheck,
    Clock,
    Check,
    Award,
    Calendar,
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#fbfbee] to-[#ffffff]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => {
            const IconComponent = iconMap[step.icon] || FileText
            return (
              <div
                key={step.step}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative"
              >
                <div
                  className="absolute -top-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {step.step}
                </div>
                <IconComponent className="w-10 h-10 mb-4 mt-2" style={{ color: primaryColor }} />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Fee Structure Section
function FeeStructureSection({
  title,
  feeBreakdown,
  disclaimer,
  primaryColor,
}: {
  title: string
  feeBreakdown: Array<{ component: string; amount: string; isTotal?: boolean }>
  disclaimer?: string
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-[#fbfbee] to-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="text-white" style={{ backgroundColor: primaryColor }}>
                  <th className="text-left py-4 px-6 font-semibold">Fee Component</th>
                  <th className="text-right py-4 px-6 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {feeBreakdown.map((fee, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 last:border-b-0 ${
                      fee.isTotal ? 'font-bold text-lg' : ''
                    }`}
                    style={fee.isTotal ? { backgroundColor: '#fbfbee' } : {}}
                  >
                    <td className="py-4 px-6 text-gray-800">{fee.component}</td>
                    <td className="py-4 px-6 text-right text-gray-800">{fee.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {disclaimer && (
            <p className="text-sm text-gray-600 text-center mt-6 italic">{disclaimer}</p>
          )}
        </div>
      </div>
    </section>
  )
}

// Career Opportunities Section
function CareerOpportunitiesSection({
  title,
  careers,
  primaryColor,
}: {
  title: string
  careers: Array<{ icon: string; title: string; description: string; avgSalary?: string }>
  primaryColor: string
}) {
  const iconMap: Record<string, any> = {
    Briefcase,
    BarChart3,
    TrendingUp,
    Users,
    Target,
    Lightbulb,
    Building2,
    Award,
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#fbfbee] to-[#ffffff]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career, index) => {
            const IconComponent = iconMap[career.icon] || Briefcase
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <IconComponent className="w-10 h-10 mb-4" style={{ color: primaryColor }} />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{career.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{career.description}</p>
                {career.avgSalary && (
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: primaryColor }}>
                    <IndianRupee className="w-4 h-4" />
                    <span>{career.avgSalary}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Placement Statistics Section
function PlacementStatisticsSection({
  title,
  stats,
  primaryColor,
}: {
  title: string
  stats: Array<{ label: string; value: string; icon: string }>
  primaryColor: string
}) {
  const iconMap: Record<string, any> = {
    Award,
    TrendingUp,
    Users,
    Building2,
    Target,
    BarChart3,
  }

  return (
    <section
      className="py-16 md:py-20 text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || Award
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300"
              >
                <IconComponent className="w-12 h-12 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Top Recruiters Section
function TopRecruitersSection({
  title,
  recruiters,
  primaryColor,
}: {
  title: string
  recruiters: string[]
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recruiters.map((recruiter, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#fbfbee] to-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center border border-gray-100"
            >
              <span className="text-sm font-medium text-gray-800 text-center">{recruiter}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Facilities Section
function FacilitiesSection({
  title,
  facilities,
  primaryColor,
}: {
  title: string
  facilities: Array<{ name: string; image?: string; description: string }>
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#fbfbee] to-[#ffffff]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {facility.image && (
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{facility.name}</h3>
                <p className="text-sm text-gray-600">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Faculty Section
function FacultySection({
  title,
  faculty,
  primaryColor,
}: {
  title: string
  faculty: Array<{
    name: string
    designation: string
    qualification: string
    specialization?: string
    image?: string
  }>
  primaryColor: string
}) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="relative px-12">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={() => plugin.current.stop()}
            onMouseLeave={() => plugin.current.play()}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {faculty.map((member, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="bg-gradient-to-br from-[#fbfbee] to-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                    <div className="h-56 overflow-hidden bg-gray-100">
                      <img
                        src={member.image || '/images/faculty/placeholder-avatar.jpg'}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-lg font-bold mb-1 text-gray-800">{member.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{member.designation}</p>
                      <p className="text-sm font-medium mb-2" style={{ color: primaryColor }}>
                        {member.qualification}
                      </p>
                      {member.specialization && (
                        <p className="text-xs text-gray-600">{member.specialization}</p>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" style={{ backgroundColor: primaryColor, color: 'white', border: 'none' }} />
            <CarouselNext className="right-0" style={{ backgroundColor: primaryColor, color: 'white', border: 'none' }} />
          </Carousel>
        </div>
      </div>
    </section>
  )
}

// FAQ Section with Accordion
function FAQSection({
  title,
  faqs,
  primaryColor,
}: {
  title: string
  faqs: Array<{ question: string; answer: string }>
  primaryColor: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#fbfbee] to-[#ffffff]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  style={{ color: primaryColor }}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-br from-[#fbfbee] to-white">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Final CTA Section
function FinalCTASection({
  title,
  description,
  primaryButtonLabel,
  primaryButtonLink,
  secondaryButtonLabel,
  secondaryButtonLink,
  phone,
  email,
  address,
  primaryColor,
  accentColor,
}: {
  title?: string
  description?: string
  primaryButtonLabel?: string
  primaryButtonLink?: string
  secondaryButtonLabel?: string
  secondaryButtonLink?: string
  phone?: string
  email?: string
  address?: string
  primaryColor: string
  accentColor: string
}) {
  return (
    <section
      className="py-20 md:py-24 text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {title && <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>}

          {description && <p className="text-lg md:text-xl opacity-95">{description}</p>}

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {primaryButtonLabel && primaryButtonLink && (
              <a
                href={primaryButtonLink}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                style={{ backgroundColor: primaryColor, color: 'white' }}
              >
                {primaryButtonLabel}
                <ArrowRight className="w-5 h-5" />
              </a>
            )}

            {secondaryButtonLabel && secondaryButtonLink && (
              <a
                href={secondaryButtonLink}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              >
                {secondaryButtonLabel}
              </a>
            )}
          </div>

          {/* Contact Information */}
          {(phone || email || address) && (
            <div className="border-t border-white/20 pt-8 mt-8">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                {phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{phone}</span>
                  </div>
                )}

                {email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{email}</span>
                  </div>
                )}

                {address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{address}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
