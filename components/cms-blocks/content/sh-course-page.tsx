'use client'

import React from 'react'
import { z } from 'zod'
import {
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  UserCheck,
  FileText,
  Briefcase,
  Users,
} from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { renderIcon } from '@/lib/utils/icon-mapper'

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

const OverviewCardSchema = z.object({
  icon: z.string(),
  title: z.string(),
  value: z.string(),
  description: z.string(),
})

const BenefitSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
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

const CurriculumYearSchema = z.object({
  year: z.number(),
  semesters: z.array(SemesterSchema),
})

const CourseTabSchema = z.object({
  code: z.string(),
  name: z.string(),
  pdfUrl: z.string(),
})

const AdmissionStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  details: z.array(z.string()),
})

const FeeTableRowSchema = z.object({
  component: z.string(),
  govt: z.string(),
  mgmt: z.string(),
  nri: z.string(),
})

const FeeTableSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(FeeTableRowSchema),
  totals: z.object({
    component: z.string(),
    govt: z.string(),
    mgmt: z.string(),
    nri: z.string(),
  }),
})

const ScholarshipSchema = z.object({
  percentage: z.string(),
  criteria: z.string(),
})

const CareerPathSchema = z.object({
  icon: z.string(),
  title: z.string(),
  salary: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
})

const FacilitySchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().optional(),
  features: z.array(z.string()),
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

const StudentAchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  venue: z.string().optional(),
  students: z.array(z.string()),
  department: z.string().optional(),
  achievement_type: z.string().optional(),
})

const CTAContactSchema = z.object({
  icon: z.string(),
  label: z.string(),
  value: z.string(),
  link: z.string(),
})

export const SHCoursePagePropsSchema = z.object({
  // Hero Section
  heroTitle: z.string(),
  heroSubtitle: z.string().optional(),
  heroStats: z.array(HeroStatSchema),
  heroCTAs: z.array(HeroCTASchema),
  affiliatedTo: z.string(),

  // Course Overview
  overviewTitle: z.string(),
  overviewCards: z.array(OverviewCardSchema),

  // Why Choose Section
  whyChooseTitle: z.string(),
  benefits: z.array(BenefitSchema),

  // Curriculum
  curriculumTitle: z.string(),
  curriculumYears: z.array(CurriculumYearSchema),
  courseTabs: z.array(CourseTabSchema).optional(),

  // Admission Process
  admissionTitle: z.string(),
  admissionSteps: z.array(AdmissionStepSchema),

  // Fee Structure
  feeTitle: z.string(),
  feeDescription: z.string().optional(),
  feeTable: FeeTableSchema,
  scholarships: z.array(ScholarshipSchema),

  // Career Opportunities
  careerTitle: z.string(),
  careerPaths: z.array(CareerPathSchema),

  // Infrastructure
  infrastructureTitle: z.string(),
  facilities: z.array(FacilitySchema),

  // Faculty
  facultyTitle: z.string(),
  faculty: z.array(FacultySchema),

  // Student Achievements
  achievementsTitle: z.string().optional(),
  studentAchievements: z.array(StudentAchievementSchema).optional(),

  // FAQ
  faqTitle: z.string(),
  faqs: z.array(FAQSchema),

  // Final CTA Section
  ctaTitle: z.string(),
  ctaDescription: z.string().optional(),
  ctaButtons: z.array(HeroCTASchema),
  ctaContact: z.array(CTAContactSchema),
})

export type SHCoursePageProps = z.infer<typeof SHCoursePagePropsSchema>

// ============================================
// Main Component
// ============================================

export function SHCoursePage(props: SHCoursePageProps) {
  const {
    heroTitle,
    heroSubtitle,
    heroStats,
    heroCTAs,
    affiliatedTo,
    overviewTitle,
    overviewCards,
    whyChooseTitle,
    benefits,
    curriculumTitle,
    curriculumYears,
    courseTabs,
    admissionTitle,
    admissionSteps,
    feeTitle,
    feeDescription,
    feeTable,
    scholarships,
    careerTitle,
    careerPaths,
    infrastructureTitle,
    facilities,
    facultyTitle,
    faculty,
    faqTitle,
    faqs,
    ctaTitle,
    ctaDescription,
    ctaButtons,
    ctaContact,
  } = props

  const primaryColor = '#0b6d41'
  const accentColor = '#ffde59'

  return (
    <div className="w-full bg-[#fbfbee]">
      {/* Hero Section */}
      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        stats={heroStats}
        ctas={heroCTAs}
        affiliatedTo={affiliatedTo}
        primaryColor={primaryColor}
      />

      {/* Course Overview */}
      <CourseOverviewSection
        title={overviewTitle}
        cards={overviewCards}
        primaryColor={primaryColor}
      />

      {/* Why Choose S&H */}
      <WhyChooseSection
        title={whyChooseTitle}
        benefits={benefits}
        primaryColor={primaryColor}
      />

      {/* Curriculum */}
      <CurriculumSection
        title={curriculumTitle}
        years={curriculumYears}
        courseTabs={courseTabs}
        primaryColor={primaryColor}
      />

      {/* Admission Process */}
      <AdmissionProcessSection
        title={admissionTitle}
        steps={admissionSteps}
        primaryColor={primaryColor}
      />

      {/* Fee Structure - Hidden as per requirement */}
      {/* <FeeStructureSection
        title={feeTitle}
        description={feeDescription}
        feeTable={feeTable}
        scholarships={scholarships}
        primaryColor={primaryColor}
      /> */}

      {/* Career Opportunities */}
      <CareerOpportunitiesSection
        title={careerTitle}
        careers={careerPaths}
        primaryColor={primaryColor}
      />

      {/* Infrastructure */}
      <InfrastructureSection
        title={infrastructureTitle}
        facilities={facilities}
        primaryColor={primaryColor}
      />

      {/* Faculty */}
      <FacultySection title={facultyTitle} faculty={faculty} primaryColor={primaryColor} />

      {/* FAQs */}
      <FAQSection title={faqTitle} faqs={faqs} primaryColor={primaryColor} />

      {/* Final CTA Section */}
      <FinalCTASection
        title={ctaTitle}
        description={ctaDescription}
        buttons={ctaButtons}
        contact={ctaContact}
        primaryColor={primaryColor}
        accentColor={accentColor}
      />
    </div>
  )
}

// ============================================
// Section Components
// ============================================

function HeroSection({
  title,
  subtitle,
  stats,
  ctas,
  affiliatedTo,
  primaryColor,
}: {
  title: string
  subtitle?: string
  stats: Array<{ icon: string; label: string; value: string }>
  ctas: Array<{ label: string; link: string; variant: 'primary' | 'secondary' }>
  affiliatedTo: string
  primaryColor: string
}) {
  return (
    <section className="relative py-16 md:py-20 lg:py-24 bg-[#fff9ee] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-block text-white rounded-full px-6 py-2" style={{ backgroundColor: primaryColor }}>
              <span className="text-sm font-medium">⭐ #JKKN100 Centenary Year Admissions Open 2025-26</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: primaryColor }}>
                {title}
              </h1>
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                      {renderIcon(stat.icon, 'w-5 h-5')}
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1" style={{ color: primaryColor }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              {ctas.map((cta, index) => (
                <a
                  key={index}
                  href={cta.link}
                  className={`
                    inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300
                    ${
                      cta.variant === 'primary'
                        ? 'text-white shadow-lg hover:shadow-xl hover:opacity-90'
                        : 'bg-white border-2 hover:border-gray-400 shadow-md'
                    }
                  `}
                  style={cta.variant === 'primary' ? { backgroundColor: primaryColor } : { color: primaryColor, borderColor: primaryColor }}
                >
                  {cta.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative hidden lg:block">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/courses/s&h/JKKN S & H.png"
                alt="Science and Humanities laboratory at JKKN"
                className="w-full h-[500px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = ''
                }}
              />
            </div>

            {/* NAAC Badge - Bottom right overlay */}
            <div className="absolute bottom-6 right-6 bg-white rounded-xl shadow-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                  <span className="text-white text-2xl">⭐</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">NAAC</div>
                  <div className="text-sm text-gray-600">Accredited Program</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliated Text - Below on mobile, part of left column on desktop */}
        <div className="mt-8 lg:mt-4">
          <p className="text-sm text-gray-600 text-center lg:text-left">{affiliatedTo}</p>
        </div>
      </div>
    </section>
  )
}

function CourseOverviewSection({
  title,
  cards,
  primaryColor,
}: {
  title: string
  cards: Array<{ icon: string; title: string; value: string; description: string }>
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: primaryColor }}>
          {title}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          The Science and Humanities department provides the fundamental knowledge base essential for all engineering disciplines, ensuring students have strong foundations in basic sciences and communication skills.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-[#fbfbee] rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 hover:-translate-y-2"
              style={{ borderLeftColor: primaryColor }}
            >
              <div className="text-4xl mb-4" style={{ color: primaryColor }}>
                {renderIcon(card.icon, 'w-10 h-10')}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{card.title}</h3>
              <p className="text-2xl font-bold mb-3" style={{ color: primaryColor }}>
                {card.value}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyChooseSection({
  title,
  benefits,
  primaryColor,
}: {
  title: string
  benefits: Array<{ icon: string; title: string; description: string }>
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
            Department Highlights
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: primaryColor }}>
            {title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0" style={{ color: primaryColor }}>
                  {renderIcon(benefit.icon, 'w-8 h-8')}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CurriculumSection({
  title,
  years,
  courseTabs,
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
  courseTabs?: Array<{ code: string; name: string; pdfUrl: string }>
  primaryColor: string
}) {
  const [selectedYear, setSelectedYear] = React.useState(1)
  const [selectedCourse, setSelectedCourse] = React.useState(courseTabs?.[0]?.code || '')

  return (
    <section id="curriculum" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
            Curriculum Structure
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: primaryColor }}>
            {title}
          </h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Our curriculum provides comprehensive foundation in fundamental sciences following Anna University regulations, combining theoretical knowledge with practical laboratory experience.
          </p>
        </div>

        {/* Course Tabs - Only show if courseTabs exist */}
        {courseTabs && courseTabs.length > 0 && (
          <>
            <div className="flex justify-center mb-8 gap-2 flex-wrap">
              {courseTabs.map((course) => (
                <button
                  key={course.code}
                  onClick={() => setSelectedCourse(course.code)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedCourse === course.code
                      ? 'text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={selectedCourse === course.code ? { backgroundColor: primaryColor } : {}}
                >
                  {course.name}
                </button>
              ))}
            </div>

            {/* Course PDF Download */}
            <div className="mb-12">
              {courseTabs
                .filter((c) => c.code === selectedCourse)
                .map((course) => (
                  <div key={course.code} className="bg-[#fbfbee] rounded-xl p-8 shadow-md">
                    <h3 className="text-2xl font-bold text-center mb-6" style={{ color: primaryColor }}>
                      REGULATION 2025 CURRICULUM - {course.name}
                    </h3>
                    <div className="text-center">
                      <a
                        href={course.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:opacity-90 shadow-lg hover:shadow-xl"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Download PDF
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* Year Tabs - Only show if no courseTabs */}
        {(!courseTabs || courseTabs.length === 0) && (
          <div className="flex justify-center mb-8 gap-2 flex-wrap">
            {years.map((yearData) => (
              <button
                key={yearData.year}
                onClick={() => setSelectedYear(yearData.year)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedYear === yearData.year
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedYear === yearData.year ? { backgroundColor: primaryColor } : {}}
              >
                Year {yearData.year}
              </button>
            ))}
          </div>
        )}

        {/* Semester Content - Only show if no courseTabs */}
        {(!courseTabs || courseTabs.length === 0) &&
          years
            .filter((y) => y.year === selectedYear)
            .map((yearData) => (
              <div key={yearData.year} className="grid lg:grid-cols-2 gap-8">
                {yearData.semesters.map((semester) => (
                  <div key={semester.semester} className="bg-[#fbfbee] rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Semester {semester.semester}</h3>
                      <span className="text-sm font-medium px-4 py-2 rounded-full bg-white" style={{ color: primaryColor }}>
                        {semester.credits} Credits
                      </span>
                    </div>

                    <div className="space-y-3">
                      {semester.subjects.map((subject, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800 text-sm">{subject.name}</p>
                              {subject.code && (
                                <p className="text-xs text-gray-500 mt-1">{subject.code}</p>
                              )}
                            </div>
                            {subject.credits !== undefined && (
                              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                {subject.credits}C
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
      </div>
    </section>
  )
}

function AdmissionProcessSection({
  title,
  steps,
  primaryColor,
}: {
  title: string
  steps: Array<{ step: number; title: string; description: string; icon: string; details: string[] }>
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-[#eaf1e2]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>Admission Process</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: primaryColor }}>{title}</h2>
          <p className="text-gray-700 mt-4 max-w-3xl mx-auto">
            Secure your seat in our prestigious Science and Humanities program through a transparent and streamlined admission process.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white mb-4"
                style={{ backgroundColor: primaryColor }}
              >
                <span className="text-xl font-bold">{step.step}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{step.description}</p>
              <ul className="space-y-2">
                {step.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeeStructureSection({
  title,
  description,
  feeTable,
  scholarships,
  primaryColor,
}: {
  title: string
  description?: string
  feeTable: {
    headers: string[]
    rows: Array<{ component: string; govt: string; mgmt: string; nri: string }>
    totals: { component: string; govt: string; mgmt: string; nri: string }
  }
  scholarships: Array<{ percentage: string; criteria: string }>
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
            Investment in Your Future
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: primaryColor }}>
            {title}
          </h2>
          {description && <p className="text-gray-600 mt-4 max-w-3xl mx-auto">{description}</p>}
        </div>

        {/* Fee Table */}
        <div className="overflow-x-auto mb-12">
          <table className="w-full max-w-5xl mx-auto bg-[#fbfbee] rounded-xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                {feeTable.headers.map((header, idx) => (
                  <th key={idx} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {feeTable.rows.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="px-6 py-4 text-gray-800">{row.component}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700">{row.govt}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700">{row.mgmt}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700">{row.nri}</td>
                </tr>
              ))}
              <tr className="bg-white font-bold">
                <td className="px-6 py-4 text-gray-800">{feeTable.totals.component}</td>
                <td className="px-6 py-4" style={{ color: primaryColor }}>
                  {feeTable.totals.govt}
                </td>
                <td className="px-6 py-4" style={{ color: primaryColor }}>
                  {feeTable.totals.mgmt}
                </td>
                <td className="px-6 py-4" style={{ color: primaryColor }}>
                  {feeTable.totals.nri}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Scholarships */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Scholarship Opportunities</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {scholarships.map((scholarship, idx) => (
              <div key={idx} className="bg-[#fbfbee] rounded-xl p-6 text-center shadow-md">
                <div className="text-4xl font-bold mb-2" style={{ color: primaryColor }}>
                  {scholarship.percentage}
                </div>
                <p className="text-sm text-gray-600">{scholarship.criteria}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CareerOpportunitiesSection({
  title,
  careers,
  primaryColor,
}: {
  title: string
  careers: Array<{ icon: string; title: string; salary: string; description: string; skills: string[] }>
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
            Your Future Awaits
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: primaryColor }}>
            {title}
          </h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            A strong foundation in Science and Humanities opens doors to diverse higher education opportunities and rewarding career paths.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {careers.map((career, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="mb-4" style={{ color: primaryColor }}>
                {renderIcon(career.icon, 'w-10 h-10')}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{career.title}</h3>
              <p className="text-lg font-bold mb-3" style={{ color: primaryColor }}>
                {career.salary}
              </p>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{career.description}</p>
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill, sidx) => (
                  <span
                    key={sidx}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-[#fbfbee] text-gray-700 border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function InfrastructureSection({
  title,
  facilities,
  primaryColor,
}: {
  title: string
  facilities: Array<{ name: string; description: string; image?: string; features: string[] }>
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
            World-Class Facilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: primaryColor }}>
            {title}
          </h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Experience hands-on learning in our modern laboratories equipped with state-of-the-art instruments and equipment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {facilities.map((facility, idx) => (
            <div key={idx} className="bg-[#fbfbee] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              {facility.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">{facility.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{facility.description}</p>
                <div className="flex flex-wrap gap-2">
                  {facility.features.map((feature, fidx) => (
                    <span
                      key={fidx}
                      className="text-xs font-medium px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
            Learn from the Best
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: primaryColor }}>
            {title}
          </h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Our department comprises highly qualified and energetic faculty members with extensive teaching and research experience, dedicated to building strong fundamentals.
          </p>
        </div>

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
              {faculty.map((member, idx) => (
                <CarouselItem key={idx} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                    <div className="h-56 overflow-hidden bg-gray-100">
                      <img
                        src={member.image || '/images/faculty/placeholder-avatar.jpg'}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-1 text-gray-800">{member.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{member.designation}</p>
                      <p className="text-sm font-medium mb-2" style={{ color: primaryColor }}>
                        {member.qualification}
                      </p>
                      {member.specialization && (
                        <p className="text-xs text-gray-600">Specialization: {member.specialization}</p>
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

function FAQSection({
  title,
  faqs,
  primaryColor,
}: {
  title: string
  faqs: Array<{ question: string; answer: string }>
  primaryColor: string
}) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: primaryColor }}>
            {title}
          </h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Find answers to common queries about our Science and Humanities department, admissions, and career prospects.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#fbfbee] rounded-xl shadow-md overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#f5f5dc] transition-colors duration-300"
              >
                <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                  style={{ color: primaryColor }}
                />
              </button>

              {openIndex === idx && (
                <div className="px-6 py-4 border-t border-gray-200 bg-white">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTASection({
  title,
  description,
  buttons,
  contact,
  primaryColor,
  accentColor,
}: {
  title: string
  description?: string
  buttons: Array<{ label: string; link: string; variant: 'primary' | 'secondary' }>
  contact: Array<{ icon: string; label: string; value: string; link: string }>
  primaryColor: string
  accentColor: string
}) {
  return (
    <section className="py-20 md:py-24 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: primaryColor }}>{title}</h2>
        {description && (
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-700">{description}</p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {buttons.map((button, idx) => (
            <a
              key={idx}
              href={button.link}
              className={`
                inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl
                ${
                  button.variant === 'primary'
                    ? 'text-white hover:opacity-90'
                    : 'bg-white border-2 text-gray-800 hover:bg-gray-50'
                }
              `}
              style={button.variant === 'primary' ? { backgroundColor: primaryColor, borderColor: primaryColor } : { borderColor: primaryColor }}
            >
              {button.label}
              <ArrowRight className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {contact.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors duration-300"
            >
              <span style={{ color: primaryColor }}>
                {renderIcon(item.icon, 'w-5 h-5')}
              </span>
              <span className="text-sm font-medium">{item.value}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
