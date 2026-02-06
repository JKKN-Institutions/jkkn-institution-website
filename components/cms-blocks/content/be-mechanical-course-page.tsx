'use client'

import React from 'react'
import { z } from 'zod'
import {
  ArrowRight, BookOpen, Calendar, Check, ChevronDown, Settings, Users, Award,
  Briefcase, Building2, Mail, Phone, MapPin, Clock, UserCheck, FileText,
  IndianRupee, Wrench, Flame, Car, Bot, Zap, Compass, Factory,
  CheckCircle, Laptop, Trophy, TrendingUp
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
  syllabusImage: z.string().optional(),
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

const PlacementStatSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.string(),
  description: z.string().optional(),
})

const MOUSchema = z.object({
  sno: z.number(),
  industryName: z.string(),
  address: z.string(),
  duration: z.string(),
})

export const BEMechanicalCoursePagePropsSchema = z.object({
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

  // Placement Statistics
  placementStatsTitle: z.string().optional(),
  placementStats: z.array(PlacementStatSchema).optional(),

  // MOUs
  mousTitle: z.string().optional(),
  mous: z.array(MOUSchema).optional(),

  // Final CTA Section
  ctaTitle: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaButtonLabel: z.string().optional(),
  ctaButtonLink: z.string().optional(),

  // Styling
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
})

export type BEMechanicalCoursePageProps = z.infer<typeof BEMechanicalCoursePagePropsSchema>

// ============================================
// Main Component
// ============================================

export function BEMechanicalCoursePage(props: BEMechanicalCoursePageProps) {
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
    placementStatsTitle,
    placementStats,
    mousTitle,
    mous,
    ctaTitle,
    ctaDescription,
    ctaButtonLabel,
    ctaButtonLink,
    primaryColor = '#0b6d41',
    accentColor = '#0b6d41', // Using brand green instead of orange
  } = props

  return (
    <div className="w-full bg-[#FFFBF5]">
      {/* Hero Section - Cream background */}
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

      {/* Why Choose Mechanical */}
      <WhyChooseSection
        title={whyChooseTitle}
        benefits={benefits}
        primaryColor={primaryColor}
        accentColor={accentColor}
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
          accentColor={accentColor}
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

      {/* FAQs */}
      <FAQSection
        title={faqTitle}
        faqs={faqs}
        primaryColor={primaryColor}
      />

      {/* Placement Statistics (if provided) */}
      {placementStats && placementStats.length > 0 && (
        <PlacementStatisticsSection
          title={placementStatsTitle || 'Placement Statistics'}
          stats={placementStats}
          primaryColor={primaryColor}
        />
      )}

      {/* MOUs (if provided) */}
      {mous && mous.length > 0 && (
        <MOUsSection
          title={mousTitle || 'Memorandums of Understanding (MOUs)'}
          mous={mous}
          primaryColor={primaryColor}
        />
      )}

      {/* Final CTA Section */}
      {ctaTitle && (
        <FinalCTASection
          title={ctaTitle}
          description={ctaDescription}
          buttonLabel={ctaButtonLabel || 'Apply Now'}
          buttonLink={ctaButtonLink || '/apply'}
          accentColor={accentColor}
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
            {/* Centenary Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-full px-4 py-2 shadow-md">
              <span className="text-yellow-600 text-lg">⭐</span>
              <span className="text-sm font-bold text-gray-800">
                #JKKN100 Centenary Year Admissions Open 2026-27
              </span>
            </div>
            {/* Title with Brand Green Color */}
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
            {/* Mechanical Lab Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/courses/be-mech/JKKN BE-MECH.png"
                alt="Students working in Mechanical Engineering laboratory at JKKN"
                className="w-full h-[500px] object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* NAAC Badge - Positioned top right */}
            <div className="absolute -top-6 -right-6 bg-white rounded-full shadow-xl p-6 border-4 border-yellow-400">
              <div className="text-center">
                <Award className="w-12 h-12 mx-auto mb-2 text-yellow-600" />
                <div className="text-xs font-bold text-gray-700">NAAC</div>
                <div className="text-xs text-gray-600">Accredited</div>
              </div>
            </div>

            {/* Affiliated Badge */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-sm text-gray-600 font-medium">{affiliatedTo}</p>
            </div>
          </div>
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
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#FFF9F0] to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-4xl mb-4" style={{ color: primaryColor }}>{renderIcon(card.icon, 'w-10 h-10')}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{card.title}</h3>
              <p className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>
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
  accentColor,
}: {
  title: string
  benefits: Array<{ icon: string; title: string; description: string }>
  primaryColor: string
  accentColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#FFF9F0] to-[#FFF5E6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4"
              style={{ borderLeftColor: accentColor }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0" style={{ color: primaryColor }}>{renderIcon(benefit.icon, 'w-8 h-8')}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
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
      syllabusImage?: string
    }>
  }>
  primaryColor: string
}) {
  const [selectedYear, setSelectedYear] = React.useState(1)

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
          {title}
        </h2>

        {/* Year Tabs */}
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
              style={
                selectedYear === yearData.year
                  ? { backgroundColor: primaryColor }
                  : {}
              }
            >
              Year {yearData.year}
            </button>
          ))}
        </div>

        {/* Semester Content */}
        {years
          .filter((y) => y.year === selectedYear)
          .map((yearData) => (
            <div key={yearData.year} className="space-y-8">
              {yearData.semesters.map((semester) => (
                <div
                  key={semester.semester}
                  className="bg-gradient-to-br from-[#FFF9F0] to-white rounded-xl p-6 shadow-md border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Semester {semester.semester}
                    </h3>
                    <span className="text-sm font-medium text-gray-600">
                      Total Credits: {semester.credits}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {semester.subjects.map((subject, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-4 border-l-4 hover:shadow-md transition-shadow duration-300"
                        style={{ borderLeftColor: primaryColor }}
                      >
                        {subject.code && (
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            {subject.code}
                          </p>
                        )}
                        <p className="font-semibold text-gray-800 text-sm">{subject.name}</p>
                        {subject.credits !== undefined && (
                          <p className="text-xs text-gray-600 mt-1">
                            {subject.credits} Credits
                          </p>
                        )}
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

function SpecializationsSection({
  title,
  specializations,
  primaryColor,
  accentColor,
}: {
  title: string
  specializations: Array<{ title: string; description: string; icon?: string }>
  primaryColor: string
  accentColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#FFF9F0] to-[#FFF5E6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specializations.map((spec, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-t-4"
              style={{ borderTopColor: accentColor }}
            >
              {spec.icon && (
                <div
                  className="mb-4"
                  style={{ color: accentColor }}
                >
                  {renderIcon(spec.icon, 'w-10 h-10')}
                </div>
              )}
              <h3 className="text-xl font-bold mb-3 text-gray-800">{spec.title}</h3>
              <p className="text-gray-600 leading-relaxed">{spec.description}</p>
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
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careers.map((career, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#FFF9F0] to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="mb-4" style={{ color: primaryColor }}>{renderIcon(career.icon, 'w-10 h-10')}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{career.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {career.description}
                  </p>
                  {career.avgSalary && (
                    <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: primaryColor }}>
                      <IndianRupee className="w-4 h-4" />
                      <span>{career.avgSalary}</span>
                    </div>
                  )}
                </div>
              </div>
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
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
          {title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recruiters.map((recruiter, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-gray-100"
            >
              <p className="text-center font-semibold text-gray-800">{recruiter}</p>
            </div>
          ))}
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
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#FFF9F0] to-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
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
                <p className="text-gray-600 leading-relaxed">{facility.description}</p>
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
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
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
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
          {title}
        </h2>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <React.Fragment key={step.step}>
              <div className="relative">
                <div className="bg-gradient-to-br from-[#FFF9F0] to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  {/* Step Number Badge */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {step.step}
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>

              {/* Arrow between steps (not after last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 items-center justify-center pointer-events-none" style={{ left: `${(index + 1) * (100 / steps.length)}%` }}>
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </React.Fragment>
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
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
          {title}
        </h2>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Fee Component
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  Amount (per year)
                </th>
              </tr>
            </thead>
            <tbody>
              {feeBreakdown.map((fee, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 ${
                    fee.isTotal ? 'bg-gradient-to-r from-[#FFF9F0] to-white font-bold' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-gray-800">{fee.component}</td>
                  <td className="px-6 py-4 text-right font-semibold" style={fee.isTotal ? { color: primaryColor } : {}}>
                    {fee.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          * Fee structure is subject to change. Hostel and transport charges are additional.
        </p>
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
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
          {title}
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#FFF9F0] to-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-300"
              >
                <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  style={{ color: primaryColor }}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 border-t border-gray-100 bg-white">
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

function PlacementStatisticsSection({
  title,
  stats,
  primaryColor,
}: {
  title: string
  stats: Array<{ label: string; value: string; icon: string; description?: string }>
  primaryColor: string
}) {
  return (
    <section
      className="py-20 md:py-24 text-white"
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              {stat.description && (
                <p className="text-sm opacity-90">{stat.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MOUsSection({
  title,
  mous,
  primaryColor,
}: {
  title: string
  mous: Array<{ sno: number; industryName: string; address: string; duration: string }>
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
          {title}
        </h2>

        <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#FFF9F0] to-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 w-20">
                    S.no
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Name of the industry
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Address of the industry
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 min-w-[200px]">
                    Duration of MOU
                  </th>
                </tr>
              </thead>
              <tbody>
                {mous.map((mou, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium">{mou.sno}</td>
                    <td className="px-6 py-4 text-gray-800 font-semibold">
                      {mou.industryName}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm leading-relaxed">
                      {mou.address}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm whitespace-pre-line">
                      {mou.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          * These MOUs facilitate industry collaborations, internships, and knowledge exchange opportunities for students.
        </p>
      </div>
    </section>
  )
}

function FinalCTASection({
  title,
  description,
  buttonLabel,
  buttonLink,
  accentColor,
  primaryColor,
}: {
  title: string
  description?: string
  buttonLabel: string
  buttonLink: string
  accentColor: string
  primaryColor: string
}) {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: primaryColor }}>
          {title}
        </h2>
        {description && (
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-700">
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={buttonLink}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white rounded-lg font-semibold text-base hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: primaryColor }}
          >
            {buttonLabel}
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 rounded-lg font-semibold text-base hover:bg-gray-50 transition-all duration-300"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Contact Admissions
            <Phone className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
