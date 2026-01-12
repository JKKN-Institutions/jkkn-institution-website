'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  Cpu,
  Stethoscope,
  FlaskConical,
  Pill,
  TrendingUp,
  Heart,
  ChevronRight,
} from 'lucide-react'

const programs = [
  {
    icon: Cpu,
    title: 'Engineering',
    description: 'B.E/B.Tech in CSE, ECE, Mech, Civil & more',
    courses: 12,
    color: 'from-secondary to-yellow-400',
    href: '/academics/programs/engineering',
  },
  {
    icon: Stethoscope,
    title: 'Medical Sciences',
    description: 'MBBS, BDS, and Allied Health Sciencess',
    courses: 8,
    color: 'from-yellow-400 to-amber-500',
    href: '/academics/programs/medical',
  },
  {
    icon: FlaskConical,
    title: 'Arts & Science',
    description: 'BSc, BA, BCom with diverse specializations',
    courses: 15,
    color: 'from-amber-400 to-secondary',
    href: '/academics/programs/arts-science',
  },
  {
    icon: Pill,
    title: 'Pharmacy',
    description: 'B.Pharm, M.Pharm, Pharm.D programs',
    courses: 6,
    color: 'from-secondary via-yellow-400 to-amber-500',
    href: '/academics/programs/pharmacy',
  },
  {
    icon: TrendingUp,
    title: 'Management',
    description: 'BBA, MBA with industry-focused curriculum',
    courses: 5,
    color: 'from-yellow-500 to-secondary',
    href: '/academics/programs/management',
  },
  {
    icon: Heart,
    title: 'Allied Health',
    description: 'Nursing, Physiotherapy, Lab Technology',
    courses: 10,
    color: 'from-amber-500 to-yellow-400',
    href: '/academics/programs/allied-health',
  },
]

export function ProgramsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame to prevent forced reflow
          requestAnimationFrame(() => {
            setIsVisible(true)
          })
        }
      },
      { threshold: 0.2, rootMargin: '50px' } // Trigger slightly earlier
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[800px] md:min-h-[1000px] py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-[#085032]/40 to-gray-900" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-primary/20 to-emerald-700/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-l from-primary/20 to-emerald-800/30 rounded-full blur-3xl translate-x-1/2" />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
          <div className={cn(
            'max-w-2xl transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/30 text-secondary text-sm font-semibold mb-4 border border-secondary/40">
              Academic Programs
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Explore Our{' '}
              <span className="bg-gradient-to-r from-secondary to-yellow-500 bg-clip-text text-transparent">
                Programs
              </span>
            </h2>
            <p className="text-lg text-gray-300">
              Choose from a wide range of undergraduate, postgraduate, and doctoral programs
              designed to prepare you for a successful career.
            </p>
          </div>

          <Link
            href="/academics"
            className={cn(
              'hidden lg:inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gray-800/90 border-2 border-white/30 hover:border-secondary hover:bg-gray-800 hover:shadow-lg hover:shadow-secondary/30 transition-all duration-300',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            View All Programs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Programs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {programs.map((program, index) => (
            <Link
              key={program.title}
              href={program.href}
              className={cn(
                'group relative transition-all duration-700',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              )}
              style={{ transitionDelay: `${100 + index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative h-full p-6 lg:p-8 rounded-3xl bg-gray-800/90 border border-white/20 shadow-2xl shadow-primary/10 overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/30 group-hover:border-primary/30 group-hover:bg-gray-800 group-hover:-translate-y-2 group-hover:scale-105">
                {/* Background Gradient on Hover */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500',
                  program.color
                )} />

                {/* Icon with circular background */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className={cn(
                    'relative inline-flex p-4 rounded-2xl bg-gradient-to-br transition-all duration-500 group-hover:scale-110 group-hover:rotate-6',
                    program.color
                  )}>
                    <program.icon className="w-8 h-8 text-gray-900" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {program.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-sm font-medium text-gray-500">
                      {program.courses} Courses
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-secondary opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      Explore
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className={cn(
          'lg:hidden text-center mt-10 transition-all duration-700 delay-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}>
          <Link
            href="/academics"
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300',
              'bg-gradient-to-r from-secondary via-yellow-400 to-secondary bg-[length:200%_100%]',
              'text-gray-900 shadow-lg shadow-secondary/30',
              'hover:bg-[100%_0] hover:shadow-xl hover:shadow-secondary/40'
            )}
          >
            View All Programs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
