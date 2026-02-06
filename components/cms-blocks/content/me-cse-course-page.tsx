'use client'

import React from 'react'
import { z } from 'zod'
import {
  ArrowRight, BookOpen, Calendar, Check, ChevronDown, Settings, Users, Award,
  Briefcase, Building2, Clock, UserCheck, FileText,
  IndianRupee, GraduationCap, Brain, Database, Shield, Cloud, Eye, Cpu,
  CheckCircle, Laptop, Trophy, TrendingUp, TestTube, Server, NetworkIcon,
  BookMarked, Search, Target
} from 'lucide-react'

// ============================================
// Zod Schemas for Type Safety
// ============================================

const HeroStatSchema = z.object({
  number: z.string(),
  label: z.string(),
})

const HeroCTASchema = z.object({
  label: z.string(),
  link: z.string(),
  variant: z.enum(['primary', 'secondary']),
})

const HeroFeatureSchema = z.object({
  icon: z.string(),
  text: z.string(),
})

const QuickFactSchema = z.object({
  label: z.string(),
  value: z.string(),
})

const ImportantDateSchema = z.object({
  label: z.string(),
  value: z.string(),
})

const HighlightCardSchema = z.object({
  icon: z.string(),
  number: z.string(),
  label: z.string(),
})

const SpecializationSchema = z.object({
  title: z.string(),
  badge: z.string(),
  description: z.string(),
  image: z.string(),
  topics: z.array(z.string()),
})

const CourseSchema = z.object({
  code: z.string(),
  name: z.string(),
  credits: z.number(),
})

const SemesterSchema = z.object({
  semester: z.number(),
  credits: z.number(),
  courses: z.array(CourseSchema),
})

const CurriculumYearSchema = z.object({
  year: z.number(),
  semesters: z.array(SemesterSchema),
})

const LabSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
})

const PlacementStatSchema = z.object({
  number: z.string(),
  label: z.string(),
})

const RecruiterSchema = z.object({
  name: z.string(),
  logo: z.string().optional(),
})

const FacultySchema = z.object({
  name: z.string(),
  designation: z.string(),
  qualification: z.string(),
  specialization: z.string().optional(),
  photo: z.string().optional(),
  image: z.string().optional(),
})

const FAQSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

// ============================================
// Main Props Schema
// ============================================

export const MECSECoursePagePropsSchema = z.object({
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    highlightedText: z.string(),
    subtitle: z.string(),
    features: z.array(HeroFeatureSchema),
    ctaButtons: z.array(HeroCTASchema),
    image: z.string(),
    stats: z.array(HeroStatSchema),
  }),
  overview: z.object({
    label: z.string(),
    title: z.string(),
    content: z.array(z.string()),
    quickFacts: z.array(QuickFactSchema),
    importantDates: z.array(ImportantDateSchema),
  }),
  highlights: z.object({
    label: z.string(),
    title: z.string(),
    description: z.string(),
    cards: z.array(HighlightCardSchema),
  }),
  specializations: z.object({
    label: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(SpecializationSchema),
  }),
  curriculum: z.object({
    label: z.string(),
    title: z.string(),
    description: z.string().optional(),
    years: z.array(CurriculumYearSchema),
    syllabusImages: z.array(z.object({
      semester: z.string(),
      image: z.string(),
      alt: z.string(),
    })).optional(),
  }),
  eligibility: z.object({
    label: z.string(),
    title: z.string(),
    academicRequirements: z.array(z.string()),
    admissionProcess: z.array(z.string()),
  }),
  infrastructure: z.object({
    label: z.string(),
    title: z.string(),
    labs: z.array(LabSchema),
  }),
  placement: z.object({
    label: z.string(),
    title: z.string(),
    stats: z.array(PlacementStatSchema),
    recruiters: z.array(RecruiterSchema),
  }),
  faculty: z.object({
    label: z.string(),
    title: z.string(),
    members: z.array(FacultySchema),
  }),
  faqs: z.object({
    label: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(FAQSchema),
  }),
  cta: z.object({
    title: z.string(),
    description: z.string(),
    buttons: z.array(HeroCTASchema),
  }),
  colors: z.object({
    primaryColor: z.string(),
    accentColor: z.string(),
  }),
})

export type MECSECoursePageProps = z.infer<typeof MECSECoursePagePropsSchema>

// ============================================
// Icon Mapping Helper
// ============================================

const iconMap: Record<string, React.ReactNode> = {
  calendar: <Calendar className="h-5 w-5" />,
  university: <Building2 className="h-5 w-5" />,
  clock: <Clock className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  award: <Award className="h-5 w-5" />,
  bookOpen: <BookOpen className="h-5 w-5" />,
  graduationCap: <GraduationCap className="h-5 w-5" />,
  brain: <Brain className="h-6 w-6" />,
  database: <Database className="h-6 w-6" />,
  shield: <Shield className="h-6 w-6" />,
  cloud: <Cloud className="h-6 w-6" />,
  eye: <Eye className="h-6 w-6" />,
  cpu: <Cpu className="h-6 w-6" />,
  testTube: <TestTube className="h-6 w-6" />,
  server: <Server className="h-6 w-6" />,
  network: <NetworkIcon className="h-6 w-6" />,
  laptop: <Laptop className="h-6 w-6" />,
  trophy: <Trophy className="h-6 w-6" />,
  trendingUp: <TrendingUp className="h-6 w-6" />,
  briefcase: <Briefcase className="h-6 w-6" />,
  indianRupee: <IndianRupee className="h-6 w-6" />,
  bookMarked: <BookMarked className="h-6 w-6" />,
  search: <Search className="h-6 w-6" />,
  target: <Target className="h-6 w-6" />,
}

// ============================================
// Section Components
// ============================================

function HeroSection({
  badge,
  title,
  highlightedText,
  subtitle,
  features,
  ctaButtons,
  image,
  stats,
  colors
}: MECSECoursePageProps['hero'] & { colors: MECSECoursePageProps['colors'] }) {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        background: '#fbfbee' // Brand cream color
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(11, 109, 65, 0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-gray-900 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
              <Award className="h-4 w-4 text-[#0b6d41]" />
              <span className="text-sm font-medium text-gray-900">{badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              {title} <span style={{ color: colors.accentColor }}>{highlightedText}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl">
              {subtitle}
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {iconMap[feature.icon] || <Check className="h-5 w-5" />}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              {ctaButtons.map((button, index) => {
                const isExternal = button.link.startsWith('http')
                return (
                  <a
                    key={index}
                    href={button.link}
                    {...(isExternal && {
                      target: '_blank',
                      rel: 'noopener noreferrer'
                    })}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      button.variant === 'primary'
                        ? `bg-[${colors.accentColor}] hover:bg-[${colors.accentColor}]/90 text-white shadow-lg hover:shadow-xl`
                        : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 shadow-sm'
                    }`}
                    style={button.variant === 'primary' ? {
                      backgroundColor: colors.accentColor
                    } : undefined}
                  >
                    {button.label}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Image with Stats Overlay */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={'/images/courses/me-cse/JKKN ME CSE (1).png'}
                alt="ME CSE Program"
                className="w-full h-[500px] object-cover"
              />

              {/* Stats Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-white">
                        {stat.number}
                      </div>
                      <div className="text-xs lg:text-sm text-white mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProgramOverviewSection({
  label,
  title,
  content,
  quickFacts,
  importantDates,
  colors
}: MECSECoursePageProps['overview'] & { colors: MECSECoursePageProps['colors'] }) {
  return (
    <section className="py-16 lg:py-24 bg-[#fbfbee]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="text-sm font-semibold text-[#0b6d41] mb-2">{label}</div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{title}</h2>
            </div>

            {content.map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts Card */}
            <div
              className="rounded-xl p-6 border"
              style={{
                background: `linear-gradient(to bottom right, ${colors.accentColor}30, ${colors.accentColor}20)`,
                borderColor: `${colors.accentColor}50`
              }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: colors.accentColor }} />
                Quick Facts
              </h3>
              <div className="space-y-3">
                {quickFacts.map((fact, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-700">{fact.label}:</span>
                    <span className="text-sm font-semibold text-gray-900 text-right">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Dates Card */}
            <div className="bg-gradient-to-br from-[#0f8f56]/10 to-[#0b6d41]/10 rounded-xl p-6 border border-[#0b6d41]/20">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#0b6d41]" />
                Important Dates
              </h3>
              <div className="space-y-3">
                {importantDates.map((date, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-700">{date.label}:</span>
                    <span className="text-sm font-semibold text-gray-900 text-right">{date.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProgramHighlightsSection({
  label,
  title,
  description,
  cards,
  colors
}: MECSECoursePageProps['highlights'] & { colors: MECSECoursePageProps['colors'] }) {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-sm font-semibold text-[#0b6d41] mb-2">{label}</div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{description}</p>
        </div>

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow group"
            >
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.accentColor} 100%)`
                }}
              >
                {iconMap[card.icon] || <Award className="h-8 w-8 text-white" />}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.number}</div>
              <div className="text-sm font-medium text-gray-600">{card.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SpecializationsSection({
  label,
  title,
  description,
  items,
  colors
}: MECSECoursePageProps['specializations'] & { colors: MECSECoursePageProps['colors'] }) {
  return (
    <section className="py-16 lg:py-24 bg-[#fbfbee]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-sm font-semibold text-[#0b6d41] mb-2">{label}</div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{description}</p>
        </div>

        {/* Specializations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((spec, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200"
            >
              {/* Content */}
              <div className="p-6">
                {/* Badge */}
                <div className="mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: colors.accentColor }}
                  >
                    {spec.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{spec.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{spec.description}</p>

                {/* Topics */}
                <div className="flex flex-wrap gap-2">
                  {spec.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                    >
                      {topic}
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

function CurriculumSection({
  label,
  title,
  description,
  years,
  syllabusImages,
  colors
}: MECSECoursePageProps['curriculum'] & { colors: MECSECoursePageProps['colors'] }) {
  return (
    <section className="py-16 lg:py-24 bg-white" id="curriculum">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-sm font-semibold text-[#0b6d41] mb-2">{label}</div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-gray-600">{description}</p>
          )}
        </div>

        {/* Curriculum by Year */}
        {years.map((year) => (
          <div key={year.year} className="mb-12">
            <h3
              className="text-2xl font-bold mb-6 pb-2 border-b-2"
              style={{ color: colors.primaryColor, borderColor: colors.accentColor }}
            >
              Year {year.year}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {year.semesters.map((semester) => (
                <div
                  key={semester.semester}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  {/* Semester Header */}
                  <div
                    className="rounded-lg p-4 mb-4 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.accentColor} 100%)`
                    }}
                  >
                    <h4 className="text-xl font-bold">Semester {semester.semester}</h4>
                    <p className="text-sm opacity-90">Total Credits: {semester.credits}</p>
                  </div>

                  {/* Courses List */}
                  <div className="space-y-3">
                    {semester.courses.map((course, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: colors.accentColor }}
                        >
                          {course.credits}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-500 mb-1">{course.code}</div>
                          <div className="text-sm font-medium text-gray-900">{course.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      
      </div>
    </section>
  )
}

function EligibilitySection({
  label,
  title,
  academicRequirements,
  admissionProcess,
  colors
}: MECSECoursePageProps['eligibility'] & { colors: MECSECoursePageProps['colors'] }) {
  return (
    <section
      className="py-16 lg:py-24 text-white"
      style={{
        background: `linear-gradient(135deg, ${colors.primaryColor} 0%, #085032 100%)`
      }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-sm font-semibold text-[#0f8f56] mb-2">{label}</div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{title}</h2>
        </div>

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Academic Requirements */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Academic Requirements
            </h3>
            <ul className="space-y-4">
              {academicRequirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Admission Process */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Admission Process
            </h3>
            <ul className="space-y-4">
              {admissionProcess.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: colors.accentColor }}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function LabsInfrastructureSection({
  label,
  title,
  labs,
  colors
}: MECSECoursePageProps['infrastructure'] & { colors: MECSECoursePageProps['colors'] }) {
  return (
    <section className="py-16 lg:py-24 bg-[#fbfbee]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-sm font-semibold text-[#0b6d41] mb-2">{label}</div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        </div>

        {/* Labs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {labs.map((lab, index) => (
            <div
              key={index}
              className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all h-64"
            >
              {/* Image */}
              <img
                src={lab.image}
                alt={lab.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-lg font-bold mb-2">{lab.name}</h3>
                <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  {lab.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PlacementSection({
  label,
  title,
  stats,
  recruiters,
  colors
}: MECSECoursePageProps['placement'] & { colors: MECSECoursePageProps['colors'] }) {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-sm font-semibold text-[#0b6d41] mb-2">{label}</div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="text-3xl lg:text-4xl font-bold mb-2"
                style={{ color: colors.primaryColor }}
              >
                {stat.number}
              </div>
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recruiters */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Top Recruiters</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {recruiters.map((recruiter, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow group"
              >
                {recruiter.logo ? (
                  <img
                    src={recruiter.logo}
                    alt={recruiter.name}
                    className="max-h-12 w-auto opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                    {recruiter.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FacultySection({
  label,
  title,
  members,
  colors
}: MECSECoursePageProps['faculty'] & { colors: MECSECoursePageProps['colors'] }) {
  return (
    <section className="py-16 lg:py-24 bg-[#fbfbee]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-sm font-semibold text-[#0b6d41] mb-2">{label}</div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        </div>

        {/* Faculty Grid - Centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {members.map((faculty, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="h-64 overflow-hidden bg-gray-100">
                <img
                  src={faculty.photo || faculty.image || '/images/faculty/placeholder-avatar.jpg'}
                  alt={faculty.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/faculty/placeholder-avatar.jpg'
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-1 text-gray-800">{faculty.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{faculty.designation}</p>
                <p className="text-sm font-medium mb-2" style={{ color: colors.accentColor }}>
                  {faculty.qualification}
                </p>
                {faculty.specialization && (
                  <p className="text-xs text-gray-600">{faculty.specialization}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection({ label, title, description, items, colors }: MECSECoursePageProps['faqs'] & { colors: MECSECoursePageProps['colors'] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-sm font-semibold text-[#0b6d41] mb-2">{label}</div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{description}</p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({
  title,
  description,
  buttons,
  colors
}: MECSECoursePageProps['cta'] & { colors: MECSECoursePageProps['colors'] }) {
  return (
    <section
      className="py-16 lg:py-24 text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.accentColor} 0%, ${colors.primaryColor} 100%)`
      }}
    >
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl mb-8 opacity-90">{description}</p>

          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((button, index) => (
              <a
                key={index}
                href={button.link}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all ${
                  button.variant === 'primary'
                    ? 'bg-white text-[#0b6d41] hover:bg-gray-100 shadow-lg hover:shadow-xl'
                    : 'bg-white/10 hover:bg-white/20 text-white border-2 border-white backdrop-blur-sm'
                }`}
              >
                {button.label}
                <ArrowRight className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Main Component Export
// ============================================

export function MECSECoursePage(props: MECSECoursePageProps) {
  return (
    <div className="w-full bg-[#fbfbee]">
      <HeroSection {...props.hero} colors={props.colors} />
      <ProgramOverviewSection {...props.overview} colors={props.colors} />
      <ProgramHighlightsSection {...props.highlights} colors={props.colors} />
      <SpecializationsSection {...props.specializations} colors={props.colors} />
      <CurriculumSection {...props.curriculum} colors={props.colors} />
      <EligibilitySection {...props.eligibility} colors={props.colors} />
      <LabsInfrastructureSection {...props.infrastructure} colors={props.colors} />
      <PlacementSection {...props.placement} colors={props.colors} />
      <FacultySection {...props.faculty} colors={props.colors} />
      <FAQSection {...props.faqs} colors={props.colors} />
      <CTASection {...props.cta} colors={props.colors} />
    </div>
  )
}
