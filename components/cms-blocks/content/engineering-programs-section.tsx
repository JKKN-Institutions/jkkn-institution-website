'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import { Code, Cpu, Zap, Settings, Wifi, Activity, Briefcase, GraduationCap, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'

// ==========================================
// Intersection Observer Hook
// ==========================================

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

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return { ref, isInView }
}

// ==========================================
// Zod Schema
// ==========================================

export const EngineeringProgramsSectionPropsSchema = z.object({
  // Title
  title: z.string().default('Comprehensive Engineering & Technology Programs'),
  subtitle: z.string().default('Choose from our wide range of AICTE approved programs'),

  // Programs
  programs: z.array(z.object({
    name: z.string(),
    type: z.enum(['ug', 'pg']),
    duration: z.string(),
    seats: z.number().optional(),
    icon: z.enum(['code', 'cpu', 'zap', 'settings', 'wifi', 'activity', 'briefcase', 'graduation']).default('graduation'),
    description: z.string(),
    link: z.string().default('#'),
    tags: z.array(z.string()).optional(),
  })).default([
    { name: 'B.Tech AI & Machine Learning', type: 'ug', duration: '4 Years', seats: 60, icon: 'cpu', description: 'Deep Learning, Neural Networks, Data Science', link: '/courses/aiml', tags: ['New', 'Trending'] },
    { name: 'B.E. Electronics & Communication', type: 'ug', duration: '4 Years', seats: 60, icon: 'cpu', description: 'Embedded Systems, IoT, VLSI Design', link: '/courses/ece' },
    { name: 'B.E. Mechanical Engineering', type: 'ug', duration: '4 Years', seats: 120, icon: 'settings', description: 'Robotics, CAD/CAM, Automation', link: '/courses/mech' },
    { name: 'B.E. Civil Engineering', type: 'ug', duration: '4 Years', seats: 60, icon: 'settings', description: 'Structural Design, Construction Management', link: '/courses/civil' },
    { name: 'B.E. Electrical & Electronics', type: 'ug', duration: '4 Years', seats: 60, icon: 'zap', description: 'Power Systems, Renewable Energy', link: '/courses/eee' },
    { name: 'B.Tech Information Technology', type: 'ug', duration: '4 Years', seats: 60, icon: 'wifi', description: 'Cloud Computing, Cybersecurity, DevOps', link: '/courses-offered/ug/btech-it' },
    { name: 'MBA - Business Administration', type: 'pg', duration: '2 Years', seats: 120, icon: 'briefcase', description: 'Business Analytics, Marketing, Finance', link: '/courses/mba' },
    { name: 'MCA - Computer Applications', type: 'pg', duration: '2 Years', seats: 60, icon: 'graduation', description: 'Software Development, IT Management', link: '/courses/mca' },
  ]),

  // Show tabs
  showTabs: z.boolean().default(true),

  // Colors (updated to JKKN brand colors)
  primaryColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),
  backgroundColor: z.string().default('#ffffff'),

  // Animation
  showAnimations: z.boolean().default(true),

  // Padding
  paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
})

export type EngineeringProgramsSectionProps = z.infer<typeof EngineeringProgramsSectionPropsSchema> & BaseBlockProps

// ==========================================
// Icon Component
// ==========================================

function ProgramIcon({ icon, className }: { icon: string; className?: string }) {
  const iconProps = { className: cn('w-6 h-6', className) }

  switch (icon) {
    case 'code':
      return <Code {...iconProps} />
    case 'cpu':
      return <Cpu {...iconProps} />
    case 'zap':
      return <Zap {...iconProps} />
    case 'settings':
      return <Settings {...iconProps} />
    case 'wifi':
      return <Wifi {...iconProps} />
    case 'activity':
      return <Activity {...iconProps} />
    case 'briefcase':
      return <Briefcase {...iconProps} />
    case 'graduation':
    default:
      return <GraduationCap {...iconProps} />
  }
}

// ==========================================
// Main Component
// ==========================================

export default function EngineeringProgramsSection({
  title = 'Comprehensive Engineering & Technology Programs',
  subtitle = 'Choose from our wide range of AICTE approved programs',
  programs = [
    { name: 'B.E. Electronics & Communication', type: 'ug', duration: '4 Years', icon: 'cpu', description: 'Embedded Systems, IoT, VLSI Design', link: '/courses/ece' },
    { name: 'B.E. Electrical & Electronics', type: 'ug', duration: '4 Years', icon: 'zap', description: 'Power Systems, Renewable Energy', link: '/courses/eee' },
    { name: 'B.E. Mechanical Engineering', type: 'ug', duration: '4 Years', icon: 'settings', description: 'Robotics, CAD/CAM, Automation', link: '/courses/mech' },
    { name: 'B.Tech Information Technology', type: 'ug', duration: '4 Years', icon: 'wifi', description: 'Cloud Computing, Cybersecurity, DevOps', link: '/courses-offered/ug/btech-it' },
    { name: 'B.E. Biomedical Engineering', type: 'ug', duration: '4 Years', icon: 'activity', description: 'Healthcare Tech, Medical Instrumentation', link: '/courses/biomedical' },
    { name: 'MBA - Business Administration', type: 'pg', duration: '2 Years', icon: 'briefcase', description: 'Business Analytics, Marketing, Finance', link: '/courses/mba' },
    { name: 'M.E. Computer Science', type: 'pg', duration: '2 Years', icon: 'graduation', description: 'Advanced AI/ML, Research Focus', link: '/courses-offered/pg/me-cse' },
  ],
  showTabs = true,
  primaryColor = '#1e3a5f',
  accentColor = '#f97316',
  backgroundColor = '#ffffff',
  showAnimations = true,
  paddingY = 'lg',
  className,
  isEditing,
}: EngineeringProgramsSectionProps) {
  const sectionRef = useInView(0.1)
  const [activeTab, setActiveTab] = useState<'all' | 'ug' | 'pg'>('all')

  const paddingClasses = {
    sm: 'py-8 md:py-10',
    md: 'py-10 md:py-14',
    lg: 'py-14 md:py-20',
    xl: 'py-20 md:py-28',
  }

  const animateClass = (delay: number) =>
    showAnimations
      ? cn(
          'transition-[transform,opacity] duration-700',
          sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )
      : ''

  const filteredPrograms = activeTab === 'all'
    ? programs
    : programs.filter(p => p.type === activeTab)

  const tabs = [
    { key: 'all' as const, label: 'All Courses' },
    { key: 'ug' as const, label: 'UG Programs' },
    { key: 'pg' as const, label: 'PG Programs' },
  ]

  return (
    <section
      id="programs"
      ref={sectionRef.ref}
      className={cn('relative w-full overflow-hidden', paddingClasses[paddingY], className)}
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2
            className={cn(
              'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4',
              animateClass(0)
            )}
            style={{ color: primaryColor, transitionDelay: '0ms' }}
          >
            {title}
          </h2>
          <p
            className={cn(
              'text-base sm:text-lg text-gray-600 max-w-2xl mx-auto',
              animateClass(100)
            )}
            style={{ transitionDelay: '100ms' }}
          >
            {subtitle}
          </p>
        </div>

        {/* Tabs */}
        {showTabs && (
          <div
            className={cn(
              'flex justify-center gap-2 sm:gap-3 mb-8 md:mb-12',
              animateClass(200)
            )}
            style={{ transitionDelay: '200ms' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-semibold transition-all duration-300',
                  activeTab === tab.key
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                style={activeTab === tab.key ? {
                  backgroundColor: primaryColor,
                  boxShadow: `0 4px 15px ${primaryColor}40`,
                } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Programs Grid */}
        <div
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
            animateClass(300)
          )}
          style={{ transitionDelay: '300ms' }}
        >
          {filteredPrograms.map((program, index) => (
            <Link
              key={index}
              href={program.link}
              className="group block p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                  style={{ backgroundColor: `${primaryColor}10` }}
                >
                  <ProgramIcon icon={program.icon} />
                  <style jsx>{`
                    div :global(svg) {
                      color: ${primaryColor};
                    }
                  `}</style>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="text-base sm:text-lg font-semibold line-clamp-2 group-hover:underline"
                      style={{ color: primaryColor }}
                    >
                      {program.name}
                    </h3>
                  </div>

                  {/* Duration Badge */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{program.duration}</span>
                    <span
                      className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                      style={{
                        backgroundColor: program.type === 'ug' ? `${accentColor}15` : `${primaryColor}15`,
                        color: program.type === 'ug' ? accentColor : primaryColor,
                      }}
                    >
                      {program.type === 'ug' ? 'Undergraduate' : 'Postgraduate'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {program.description}
                  </p>

                  {/* Learn More */}
                  <div
                    className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all duration-300"
                    style={{ color: accentColor }}
                  >
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Empty state for editing */}
      {isEditing && programs.length === 0 && (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-500">Add programs to display here</p>
        </div>
      )}
    </section>
  )
}
