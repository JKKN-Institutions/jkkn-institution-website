'use client'

import React from 'react'
import { z } from 'zod'
import { ArrowRight, BookOpen, Calendar, Check, ChevronDown, GraduationCap, Users, Award, Briefcase, Building2, UserCheck, IndianRupee, TrendingUp, Code, Edit, FileCheck, CheckCircle } from 'lucide-react'
import Image from 'next/image'

// ============================================
// Zod Schemas for Type Safety
// ============================================

const BreadcrumbItemSchema = z.object({
  label: z.string(),
  link: z.string().optional(),
})

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
  description: z.string().optional(),
})

const CareerPathSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  avgSalary: z.string().optional(),
})

const RecruiterSchema = z.object({
  name: z.string(),
  logo: z.string().optional(),
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
  specialization: z.string(),
  image: z.string().optional(),
})

const FAQSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

export const BECSECoursePagePropsSchema = z.object({
  // Hero Section
  heroTitle: z.string(),
  heroSubtitle: z.string().optional(),
  breadcrumbItems: z.array(BreadcrumbItemSchema).optional(),
  approvalBadge: z.string().optional(),
  heroStats: z.array(HeroStatSchema),
  heroCTAs: z.array(HeroCTASchema),
  affiliatedTo: z.string(),

  // Why Choose Section
  whyChooseTitle: z.string(),
  whyChooseSubtitle: z.string().optional(),
  benefits: z.array(BenefitSchema),

  // Program Highlights
  programHighlights: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
  })).optional(),

  // Curriculum
  curriculumTitle: z.string(),
  curriculumYears: z.array(CurriculumYearSchema),

  // Specializations (Simple List)
  specializationsTitle: z.string().optional(),
  specializations: z.array(SpecializationSchema).optional(),

  // Career Opportunities
  careerTitle: z.string(),
  careerPaths: z.array(CareerPathSchema),

  // Top Recruiters
  recruitersTitle: z.string().optional(),
  recruiters: z.array(RecruiterSchema).optional(),

  // Admission Process
  admissionTitle: z.string().optional(),
  admissionSteps: z.array(AdmissionStepSchema).optional(),

  // Fee Structure
  feeTitle: z.string(),
  feeBreakdown: z.array(FeeComponentSchema),

  // Placement Statistics
  placementStats: z.array(z.object({
    label: z.string(),
    value: z.string(),
    icon: z.string(),
  })).optional(),

  // Facilities
  facilitiesTitle: z.string(),
  facilities: z.array(FacilitySchema),

  // Faculty
  facultyTitle: z.string().optional(),
  faculty: z.array(FacultySchema).optional(),

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

export type BECSECoursePageProps = z.infer<typeof BECSECoursePagePropsSchema>

// ============================================
// Icon Mapping Helper
// ============================================

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  users: Users,
  'graduation-cap': GraduationCap,
  'indian-rupee': IndianRupee,
  'trending-up': TrendingUp,
  award: Award,
  briefcase: Briefcase,
  building: Building2,
  check: Check,
  'book-open': BookOpen,
  code: Code,
  edit: Edit,
  'file-check': FileCheck,
  'check-circle': CheckCircle,
}

function getIcon(iconName: string, className: string = "w-6 h-6") {
  const IconComponent = iconMap[iconName] || Check
  return <IconComponent className={className} />
}

// ============================================
// Main Component
// ============================================

export function BECSECoursePage(props: BECSECoursePageProps) {
  const {
    heroTitle,
    heroSubtitle,
    breadcrumbItems,
    approvalBadge,
    heroStats,
    heroCTAs,
    affiliatedTo,
    whyChooseTitle,
    whyChooseSubtitle,
    benefits,
    programHighlights,
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
    placementStats,
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

  const [openFAQIndex, setOpenFAQIndex] = React.useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#fbfbee]">
      {/* 1. Hero Section with Integrated Stats */}
      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        breadcrumbs={breadcrumbItems}
        approvalBadge={approvalBadge}
        stats={heroStats}
        ctas={heroCTAs}
        affiliatedTo={affiliatedTo}
        primaryColor={primaryColor}
      />

      {/* 2. Why Choose Section */}
      <WhyChooseSection
        title={whyChooseTitle}
        subtitle={whyChooseSubtitle}
        benefits={benefits}
      />

      {/* 3. Program Highlights Section (NEW) */}
      {programHighlights && programHighlights.length > 0 && (
        <ProgramHighlightsSection highlights={programHighlights} />
      )}

      {/* 4. Curriculum Table Section */}
      <CurriculumTableSection
        title={curriculumTitle}
        years={curriculumYears}
      />

      {/* 5. Specializations Section - Simple 2-Column List */}
      {specializations && specializations.length > 0 && (
        <SpecializationsSection
          title={specializationsTitle}
          specializations={specializations}
        />
      )}

      {/* 6. Fee Structure Section */}
      <FeeStructureSection
        title={feeTitle}
        breakdown={feeBreakdown}
      />

      {/* 7. Placement Statistics Section (NEW) */}
      {placementStats && placementStats.length > 0 && (
        <PlacementStatsSection stats={placementStats} />
      )}

      {/* 8. Facilities Section */}
      <FacilitiesSection
        title={facilitiesTitle}
        facilities={facilities}
      />

      {/* 9. Top Recruiters Section */}
      {recruiters && recruiters.length > 0 && (
        <TopRecruitersSection
          title={recruitersTitle || 'Our Top Recruiters'}
          recruiters={recruiters}
        />
      )}

      {/* 10. Career Opportunities Section (MOVED FROM EARLIER) */}
      <CareerOpportunitiesSection
        title={careerTitle}
        careers={careerPaths}
      />

      {/* 11. Admission Process Section */}
      {admissionSteps && admissionSteps.length > 0 && (
        <AdmissionProcessSection
          title={admissionTitle || 'Admission Process'}
          steps={admissionSteps}
          primaryColor={primaryColor}
        />
      )}

      {/* 12. Faculty Section */}
      {faculty && faculty.length > 0 && (
        <FacultySection
          title={facultyTitle || 'Our Experienced Faculty'}
          faculty={faculty}
        />
      )}

      {/* 13. FAQ Section */}
      <FAQSection
        title={faqTitle}
        faqs={faqs}
        openIndex={openFAQIndex}
        setOpenIndex={setOpenFAQIndex}
      />

      {/* 14. Final CTA Section - GREEN GRADIENT */}
      {ctaTitle && (
        <FinalCTASection
          title={ctaTitle}
          description={ctaDescription}
          buttonLabel={ctaButtonLabel}
          buttonLink={ctaButtonLink}
          primaryColor={primaryColor}
        />
      )}
    </div>
  )
}

// ============================================
// Section Components
// ============================================

// Hero Section with Integrated Stats
function HeroSection({
  title,
  subtitle,
  breadcrumbs,
  approvalBadge,
  stats,
  ctas,
  affiliatedTo,
  primaryColor,
}: {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ label: string; link?: string }>
  approvalBadge?: string
  stats: Array<{ icon: string; label: string; value: string }>
  ctas: Array<{ label: string; link: string; variant: string }>
  affiliatedTo: string
  primaryColor: string
}) {
  return (
    <section className="relative bg-gradient-to-br from-[#FFF9F0] to-[#FFF5E6] py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm mb-4">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {item.link ? (
                  <a href={item.link} className="text-gray-700 hover:text-[#0b6d41] transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-[#0b6d41] font-medium">{item.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="text-gray-400">›</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Content */}
          <div>
            {/* Approval Badge */}
            {approvalBadge && (
              <div className="inline-block bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4 text-[#0b6d41] font-medium border border-gray-200">
                {approvalBadge}
              </div>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#0b6d41]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base md:text-lg text-gray-700 mb-4">
                {subtitle}
              </p>
            )}
            <p className="text-sm text-gray-600 mb-6">
              {affiliatedTo}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-8">
              {ctas.map((cta, index) => (
                <a
                  key={index}
                  href={cta.link}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2
                    ${cta.variant === 'primary'
                      ? 'bg-[#0b6d41] hover:bg-[#0f8f56] text-white shadow-md'
                      : 'bg-transparent border-2 border-[#0b6d41] text-[#0b6d41] hover:bg-[#0b6d41] hover:text-white'
                    }
                  `}
                >
                  {cta.label}
                  <ArrowRight className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Stats Cards - Integrated in Hero */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-200 shadow-sm"
                >
                  <div className="flex justify-center mb-2">
                    {getIcon(stat.icon, "w-6 h-6 text-[#0b6d41]")}
                  </div>
                  <div className="text-2xl font-bold mb-1 text-[#0b6d41]">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 w-full h-80 flex items-center justify-center border border-gray-200 shadow-lg">
              <GraduationCap className="w-40 h-40 text-[#0b6d41]/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Why Choose Section
function WhyChooseSection({
  title,
  subtitle,
  benefits,
}: {
  title: string
  subtitle?: string
  benefits: Array<{ icon: string; title: string; description: string }>
}) {
  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#0b6d41]">
          {title}
        </h2>

        {/* Introductory Paragraph */}
        {subtitle && (
          <p className="text-center text-lg text-gray-700 max-w-4xl mx-auto mb-12">
            {subtitle}
          </p>
        )}

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
            >
              {/* Icon Container */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#0b6d41] flex items-center justify-center">
                  {getIcon(benefit.icon, "w-8 h-8 text-white")}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-center mb-3 text-[#0b6d41]">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Program Highlights Section
function ProgramHighlightsSection({
  highlights,
}: {
  highlights: Array<{ icon: string; title: string; description: string }>
}) {
  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          What Sets Our CSE Program Apart?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#0b6d41] flex items-center justify-center">
                  {getIcon(highlight.icon, "w-6 h-6 text-white")}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#0b6d41]">
                  {highlight.title}
                </h3>
                <p className="text-gray-600">
                  {highlight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Curriculum Table Section
function CurriculumTableSection({
  title,
  years,
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
}) {
  const [expandedSemesters, setExpandedSemesters] = React.useState<number[]>([1, 2, 3])

  const allSemesters = years.flatMap(year => year.semesters)

  const toggleSemester = (semester: number) => {
    setExpandedSemesters(prev =>
      prev.includes(semester)
        ? prev.filter(s => s !== semester)
        : [...prev, semester]
    )
  }

  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#0b6d41]">
                <th className="px-6 py-4 text-left text-white font-semibold">Semester</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Course Code</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Course Name</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Credits</th>
              </tr>
            </thead>
            <tbody>
              {allSemesters.map((semester, semIndex) => (
                <React.Fragment key={semIndex}>
                  {expandedSemesters.includes(semester.semester) ? (
                    semester.subjects.map((subject, subIndex) => (
                      <tr
                        key={`${semIndex}-${subIndex}`}
                        className={semIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        {subIndex === 0 && (
                          <td
                            className="px-6 py-3 font-semibold text-gray-900 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                            rowSpan={semester.subjects.length}
                            onClick={() => toggleSemester(semester.semester)}
                          >
                            <div className="flex items-center gap-2">
                              Semester {semester.semester}
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-3 text-gray-700 border-b border-gray-200">
                          {subject.code || '-'}
                        </td>
                        <td className="px-6 py-3 text-gray-900 border-b border-gray-200">
                          {subject.name}
                        </td>
                        <td className="px-6 py-3 text-gray-700 border-b border-gray-200">
                          {subject.credits || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr
                      className={`${semIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-gray-100`}
                      onClick={() => toggleSemester(semester.semester)}
                    >
                      <td className="px-6 py-3 font-semibold text-gray-900 border-b border-gray-200" colSpan={4}>
                        <div className="flex items-center gap-2">
                          Semester {semester.semester} ({semester.subjects.length} courses)
                          <ChevronDown className="w-4 h-4 transform -rotate-90" />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// Specializations Section - Simple 2-Column List
function SpecializationsSection({
  title,
  specializations,
}: {
  title?: string
  specializations: Array<{ title: string; description?: string }>
}) {
  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            {title}
          </h2>
        )}

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {specializations.map((spec, index) => (
            <div
              key={index}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 mt-1">
                <Check className="w-6 h-6 text-[#0b6d41]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {spec.title}
                </h3>
                {spec.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {spec.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Career Opportunities Section
function CareerOpportunitiesSection({
  title,
  careers,
}: {
  title: string
  careers: Array<{ icon: string; title: string; description: string; avgSalary?: string }>
}) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#FFF9F0] to-[#FFF5E6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#0b6d41]">
          {title}
        </h2>

        <div className="max-w-4xl mx-auto space-y-6">
          {careers.map((career, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-6 flex items-start gap-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                {getIcon(career.icon, "w-8 h-8 text-[#0b6d41]")}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {career.title}
                </h3>
                <p className="text-gray-700 mb-2">
                  {career.description}
                </p>
                {career.avgSalary && (
                  <div className="flex items-center gap-2 text-sm text-[#0b6d41] font-medium">
                    <IndianRupee className="w-4 h-4" />
                    <span>{career.avgSalary}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Fee Structure Section
function FeeStructureSection({
  title,
  breakdown,
}: {
  title: string
  breakdown: Array<{ component: string; amount: string; isTotal?: boolean }>
}) {
  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#0b6d41]">
                <th className="px-6 py-4 text-left text-white font-semibold">Fee Component</th>
                <th className="px-6 py-4 text-right text-white font-semibold">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item, index) => (
                <tr
                  key={index}
                  className={`
                    ${item.isTotal ? 'bg-[#0b6d41]/10 font-semibold' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    border-b border-gray-200
                  `}
                >
                  <td className="px-6 py-4 text-gray-900">{item.component}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// Placement Statistics Section
function PlacementStatsSection({
  stats,
}: {
  stats: Array<{ label: string; value: string; icon: string }>
}) {
  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Exceptional Placement Record
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-8 bg-gray-50 rounded-lg">
              <div className="flex justify-center mb-4">
                {getIcon(stat.icon, "w-12 h-12 text-[#0b6d41]")}
              </div>
              <div className="text-4xl font-bold text-[#0b6d41] mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
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
}: {
  title: string
  facilities: Array<{ name: string; image?: string; description: string }>
}) {
  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200"
            >
              {facility.image ? (
                <div className="relative w-full h-48">
                  <Image
                    src={facility.image}
                    alt={facility.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {facility.name}
                </h3>
                <p className="text-gray-600">
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

// Top Recruiters Section - WITH LOGOS
function TopRecruitersSection({
  title,
  recruiters,
}: {
  title: string
  recruiters: Array<{ name: string; logo?: string }>
}) {
  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {recruiters.map((recruiter, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200"
            >
              {recruiter.logo ? (
                <div className="relative w-full h-16">
                  <Image
                    src={recruiter.logo}
                    alt={recruiter.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <span className="text-sm font-medium text-gray-700 text-center">
                  {recruiter.name}
                </span>
              )}
            </div>
          ))}
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
  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
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
}: {
  title: string
  faculty: Array<{
    name: string
    designation: string
    qualification: string
    specialization: string
    image?: string
  }>
}) {
  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {faculty.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200"
            >
              {member.image ? (
                <div className="relative w-full h-48">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <UserCheck className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{member.designation}</p>
                <p className="text-xs text-gray-500">{member.qualification}</p>
                <p className="text-xs text-gray-500 mt-1">{member.specialization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section
function FAQSection({
  title,
  faqs,
  openIndex,
  setOpenIndex,
}: {
  title: string
  faqs: Array<{ question: string; answer: string }>
  openIndex: number | null
  setOpenIndex: (index: number | null) => void
}) {
  return (
    <section className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#0b6d41] transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Final CTA Section - ORANGE GRADIENT (per plan)
function FinalCTASection({
  title,
  description,
  buttonLabel,
  buttonLink,
  primaryColor,
}: {
  title: string
  description?: string
  buttonLabel?: string
  buttonLink?: string
  primaryColor: string
}) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#FFF9F0] to-[#FFF5E6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#0b6d41]">
            {title}
          </h2>
          {description && (
            <p className="text-lg mb-8 text-gray-700">
              {description}
            </p>
          )}

          {/* Institution Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 mb-8 border border-gray-200 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-[#0b6d41]">JKKN Institutions</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="font-medium mb-2 text-gray-900">📍 Address:</p>
                <p className="text-gray-700">
                  Komarapalayam - Nangavalli Road,<br />
                  Kumarappalayam, Namakkal District,<br />
                  Tamil Nadu - 638183
                </p>
              </div>
              <div>
                <p className="font-medium mb-2 text-gray-900">📞 Contact:</p>
                <p className="text-gray-700">
                  Phone: +91 4288 274 472<br />
                  Email: info@jkkn.ac.in<br />
                  Website: www.jkkn.ac.in
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {buttonLabel && buttonLink && (
              <a
                href={buttonLink}
                className="inline-flex items-center justify-center gap-2 bg-[#0b6d41] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#0f8f56] transition-colors shadow-lg"
              >
                {buttonLabel}
                <ArrowRight className="w-5 h-5" />
              </a>
            )}
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-[#0b6d41] text-[#0b6d41] px-8 py-4 rounded-lg font-semibold hover:bg-[#0b6d41] hover:text-white transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
