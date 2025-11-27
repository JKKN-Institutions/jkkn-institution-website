'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  GraduationCap,
  Users,
  Award,
  Building2,
  Globe,
  Briefcase,
} from 'lucide-react'

const stats = [
  {
    icon: GraduationCap,
    value: 25000,
    suffix: '+',
    label: 'Students Enrolled',
    description: 'Learning across disciplines',
  },
  {
    icon: Users,
    value: 1500,
    suffix: '+',
    label: 'Expert Faculty',
    description: 'Industry & academia blend',
  },
  {
    icon: Building2,
    value: 15,
    suffix: '+',
    label: 'Institutions',
    description: 'Under JKKN umbrella',
  },
  {
    icon: Award,
    value: 50,
    suffix: '+',
    label: 'Years of Excellence',
    description: 'Educational legacy',
  },
  {
    icon: Globe,
    value: 100,
    suffix: '+',
    label: 'Global Partners',
    description: 'International collaborations',
  },
  {
    icon: Briefcase,
    value: 95,
    suffix: '%',
    label: 'Placement Rate',
    description: 'Career success stories',
  },
]

function useCountUp(target: number, duration: number = 2000, isVisible: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.round(startValue + (target - startValue) * easeOutQuart)

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration, isVisible])

  return count
}

function StatCard({ stat, index, isVisible }: { stat: typeof stats[0], index: number, isVisible: boolean }) {
  const count = useCountUp(stat.value, 2000, isVisible)

  return (
    <div
      className={cn(
        'group relative transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative h-full p-6 lg:p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-2">
        {/* Glow effect */}
        <div className="absolute -inset-px bg-gradient-to-r from-secondary/20 via-transparent to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative">
          {/* Icon */}
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-secondary/20 to-yellow-100 mb-6 group-hover:scale-110 transition-all duration-300">
            <stat.icon className="w-7 h-7 text-primary" />
          </div>

          {/* Value */}
          <div className="mb-2">
            <span className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              {count.toLocaleString()}
            </span>
            <span className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-secondary to-yellow-500 bg-clip-text text-transparent">
              {stat.suffix}
            </span>
          </div>

          {/* Label */}
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {stat.label}
          </h3>
          <p className="text-sm text-gray-500">
            {stat.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-cream to-white"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-secondary/10 to-yellow-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#0b6d41 1px, transparent 1px), linear-gradient(90deg, #0b6d41 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className={cn(
          'text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-secondary/20 to-yellow-100 text-primary text-sm font-semibold mb-4 border border-secondary/30">
            Our Impact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Numbers That{' '}
            <span className="bg-gradient-to-r from-secondary to-yellow-500 bg-clip-text text-transparent">
              Speak
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our achievements reflect our commitment to excellence in education,
            research, and student success.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
