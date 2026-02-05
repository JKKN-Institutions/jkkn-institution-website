'use client'

import React from 'react'
import { z } from 'zod'
import { ArrowRight, BookOpen, Calendar, Check, ChevronDown, Zap, Users, Award, Briefcase, Building2, Mail, Phone, MapPin, Clock, UserCheck, FileText, IndianRupee } from 'lucide-react'
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

const SpecializationSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
})

const CareerPathSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  avgSalary: z.string().optional(),
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

export const BEEEECoursePagePropsSchema = z.object({
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

  // Specializations
  specializationsTitle: z.string().optional(),
  specializations: z.array(SpecializationSchema).optional(),

  // Career Opportunities
  careerTitle: z.string(),
  careerPaths: z.array(CareerPathSchema),

  // Top Recruiters
  recruitersTitle: z.string(),
  recruiters: z.array(z.string()),

  // Admission Process
  admissionTitle: z.string(),
  admissionSteps: z.array(AdmissionStepSchema),

  // Fee Structure
  feeTitle: z.string(),
  feeBreakdown: z.array(FeeComponentSchema),

  // Facilities
  facilitiesTitle: z.string(),
  facilities: z.array(FacilitySchema),

  // Faculty
  facultyTitle: z.string(),
  faculty: z.array(FacultySchema),

  // FAQ
  faqTitle: z.string(),
  faqs: z.array(FAQSchema),

  // Final CTA Section
  ctaTitle: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaButtonLabel: z.string().optional(),
  ctaButtonLink: z.string().optional(),

  // Styling
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
})

export type BEEEECoursePageProps = z.infer<typeof BEEEECoursePagePropsSchema>

// ============================================
// Main Component
// ============================================

export function BEEEECoursePage(props: BEEEECoursePageProps) {
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
    specializationsTitle,
    specializations,
    careerTitle,
    careerPaths,
    recruitersTitle,
    recruiters,
    admissionTitle,
    admissionSteps,
    feeTitle,
    feeBreakdown,
    facilitiesTitle,
    facilities,
    facultyTitle,
    faculty,
    faqTitle,
    faqs,
    ctaTitle,
    ctaDescription,
    ctaButtonLabel,
    ctaButtonLink,
    primaryColor = '#0b6d41',
    accentColor = '#ffde59',
  } = props

  return (
    <div className="w-full bg-[#FFFBF5]">
      {/* Hero Section - Cream background instead of dark */}
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

      {/* Why Choose EEE */}
      <WhyChooseSection
        title={whyChooseTitle}
        benefits={benefits}
        primaryColor={primaryColor}
      />

      {/* Curriculum */}
      <CurriculumSection
        title={curriculumTitle}
        years={curriculumYears}
        primaryColor={primaryColor}
      />

      {/* Specializations (if provided) */}
      {specializations && specializations.length > 0 && (
        <SpecializationsSection
          title={specializationsTitle || 'Specializations Offered'}
          specializations={specializations}
          primaryColor={primaryColor}
        />
      )}

      {/* Career Opportunities */}
      <CareerOpportunitiesSection
        title={careerTitle}
        careers={careerPaths}
        primaryColor={primaryColor}
      />

      {/* Top Recruiters */}
      <TopRecruitersSection
        title={recruitersTitle}
        recruiters={recruiters}
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
        feeBreakdown={feeBreakdown}
        primaryColor={primaryColor}
      /> */}

      {/* Facilities */}
      <FacilitiesSection
        title={facilitiesTitle}
        facilities={facilities}
        primaryColor={primaryColor}
      />

      {/* Faculty */}
      <FacultySection
        title={facultyTitle}
        faculty={faculty}
        primaryColor={primaryColor}
      />

      {/* FAQs */}
      <FAQSection
        title={faqTitle}
        faqs={faqs}
        primaryColor={primaryColor}
      />

      {/* Final CTA Section */}
      {ctaTitle && (
        <FinalCTASection
          title={ctaTitle}
          description={ctaDescription}
          buttonLabel={ctaButtonLabel || 'Apply Now'}
          buttonLink={ctaButtonLink || '/apply'}
          primaryColor={primaryColor}
        />
      )}
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
    <section className="relative py-20 md:py-24 lg:py-28 bg-gradient-to-br from-[#FFF9F0] to-[#FFF5E6] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* Title with Brand Green Color */}
              {/* Centenary Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-full px-4 py-2 shadow-md">
              <span className="text-yellow-600 text-lg">⭐</span>
              <span className="text-sm font-bold text-gray-800">
                #JKKN100 Centenary Year Admissions Open 2026-27
              </span>
            </div>
            <div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                style={{ color: primaryColor }}
              >
                {title}
              </h1>
            </div>

            {/* Description */}
            {subtitle && (
              <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
                {subtitle}
              </p>
            )}

            {/* Stats Row - Horizontal */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className="text-3xl lg:text-4xl font-bold mb-1"
                    style={{ color: primaryColor }}
                  >
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
                    ${cta.variant === 'primary'
                      ? 'text-white shadow-lg hover:shadow-xl'
                      : 'bg-transparent border-2 border-gray-800 text-gray-800 hover:bg-gray-100'
                    }
                  `}
                  style={cta.variant === 'primary' ? { backgroundColor: primaryColor } : {}}
                >
                  {cta.label}
                  <ArrowRight className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Image + NAAC Badge */}
          <div className="relative hidden lg:block">
            {/* EEE Lab Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/courses/be-eee/JKKN EEE.png"
                alt="Students working in EEE laboratory at JKKN"
                className="w-full h-[500px] object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* NAAC Accreditation Badge */}
            <div className="absolute bottom-8 left-8 bg-white rounded-xl shadow-xl p-6 max-w-[250px]">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">NAAC</div>
                  <div className="text-sm text-gray-600">Accredited Program</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: primaryColor }}
      ></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
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
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-[#FFFBF5] rounded-2xl p-6 border-2 border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4" style={{ color: primaryColor }}>{renderIcon(card.icon, 'w-10 h-10')}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              <div className="text-2xl font-bold mb-3" style={{ color: primaryColor }}>
                {card.value}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {card.description}
              </p>
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
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#FFF9F0] to-[#FFF5E6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0" style={{ color: primaryColor }}>{renderIcon(benefit.icon, 'w-8 h-8')}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
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
  const [activeYear, setActiveYear] = React.useState(1)

  const currentYear = years.find(y => y.year === activeYear) || years[0]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        {/* Year Tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="inline-flex bg-[#FFF9F0] rounded-lg p-1 shadow-sm border border-gray-200">
            {years.map((year) => (
              <button
                key={year.year}
                onClick={() => setActiveYear(year.year)}
                className={`
                  px-6 py-3 rounded-md font-semibold transition-all duration-300 whitespace-nowrap
                  ${activeYear === year.year
                    ? 'text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }
                `}
                style={activeYear === year.year ? { backgroundColor: primaryColor } : {}}
              >
                Year {year.year}
              </button>
            ))}
          </div>
        </div>

        {/* Semesters */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {currentYear.semesters.map((semester) => (
            <div
              key={semester.semester}
              className="bg-[#FFFBF5] rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  Semester {semester.semester}
                </h3>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-white border" style={{ color: primaryColor, borderColor: primaryColor }}>
                  {semester.credits} Credits
                </span>
              </div>

              <div className="space-y-3">
                {semester.subjects.map((subject, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white hover:shadow-sm transition-shadow"
                  >
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                    <div className="flex-1 min-w-0">
                      {subject.code && (
                        <div className="text-xs text-gray-500 font-mono mb-1">
                          {subject.code}
                        </div>
                      )}
                      <div className="text-sm text-gray-900 font-medium">
                        {subject.name}
                      </div>
                    </div>
                    {subject.credits && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {subject.credits}C
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SpecializationsSection({
  title,
  specializations,
  primaryColor,
}: {
  title: string
  specializations: Array<{ title: string; description: string; icon?: string }>
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#FFF9F0] to-[#FFF5E6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {specializations.map((spec, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
            >
              {spec.icon && (
                <div className="text-3xl mb-4">{spec.icon}</div>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {spec.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {spec.description}
              </p>
            </div>
          ))}
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
  careers: Array<{ icon: string; title: string; description: string; avgSalary?: string }>
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {careers.map((career, index) => (
            <div
              key={index}
              className="bg-[#FFFBF5] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
            >
              <div className="mb-4" style={{ color: primaryColor }}>{renderIcon(career.icon, 'w-10 h-10')}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {career.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {career.description}
              </p>
              {career.avgSalary && (
                <div className="pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">Average Salary:</span>
                  <div className="text-base font-bold mt-1" style={{ color: primaryColor }}>
                    {career.avgSalary}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#FFF9F0] to-[#FFF5E6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recruiters.map((recruiter, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 min-h-[80px]"
              >
                <span className="font-semibold text-gray-900 text-center text-sm">
                  {recruiter}
                </span>
              </div>
            ))}
          </div>
        </div>
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
  steps: Array<{ step: number; title: string; description: string; icon: string }>
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[#FFFBF5] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 relative"
            >
              {/* Step Number */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4"
                style={{ backgroundColor: primaryColor }}
              >
                {step.step}
              </div>

              {/* Icon */}
              <div className="text-3xl mb-4">{step.icon}</div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Connector Arrow (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeeStructureSection({
  title,
  feeBreakdown,
  primaryColor,
}: {
  title: string
  feeBreakdown: Array<{ component: string; amount: string; isTotal?: boolean }>
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#FFF9F0] to-[#FFF5E6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2" style={{ borderColor: primaryColor }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Fee Component
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {feeBreakdown.map((fee, index) => (
                  <tr
                    key={index}
                    className={`
                      border-b border-gray-100
                      ${fee.isTotal ? 'font-bold text-white' : 'hover:bg-gray-50'}
                    `}
                    style={fee.isTotal ? { backgroundColor: primaryColor } : {}}
                  >
                    <td className={`px-6 py-4 text-sm ${fee.isTotal ? 'text-white' : 'text-gray-900'}`}>
                      {fee.component}
                    </td>
                    <td className={`px-6 py-4 text-sm text-right ${fee.isTotal ? 'text-white' : 'text-gray-900'}`}>
                      {fee.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

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
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-[#FFFBF5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
            >
              {facility.image && (
                <div className="aspect-video bg-gray-200">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {facility.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {facility.description}
                </p>
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
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#FFF9F0] to-[#FFF5E6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
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
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#FFFBF5] border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  style={{ color: primaryColor }}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
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
  buttonLabel,
  buttonLink,
  primaryColor,
}: {
  title: string
  description?: string
  buttonLabel: string
  buttonLink: string
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#FFF9F0] to-[#FFF5E6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>
          )}
          <a
            href={buttonLink}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            style={{ backgroundColor: primaryColor }}
          >
            {buttonLabel}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
