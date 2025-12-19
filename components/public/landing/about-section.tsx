'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Target,
  Eye,
  Heart,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Globe,
  Users,
} from 'lucide-react'

const values = [
  {
    icon: BookOpen,
    title: 'Academic Excellence',
    description: 'Rigorous curriculum designed to nurture critical thinking and innovation.',
    color: 'from-secondary to-yellow-500',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Cutting-edge research facilities and industry partnerships.',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    icon: Globe,
    title: 'Global Outlook',
    description: 'International collaborations and exchange programs worldwide.',
    color: 'from-secondary via-yellow-400 to-amber-500',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Inclusive environment fostering lifelong connections and growth.',
    color: 'from-amber-400 to-secondary',
  },
]

export function AboutSection() {
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
      className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-900 via-[#085032]/50 to-gray-900"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-primary/20 to-emerald-800/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className={cn(
          'text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 backdrop-blur-sm text-secondary text-sm font-semibold mb-4 border border-secondary/40">
            About JKKN
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Building Tomorrow's{' '}
            <span className="bg-gradient-to-r from-secondary to-yellow-500 bg-clip-text text-transparent">
              Leaders
            </span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            For over five decades, JKKN Institution has been at the forefront of educational
            excellence, shaping minds and transforming lives across multiple disciplines.
          </p>
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-24">
          {/* Mission Card */}
          <div className={cn(
            'group relative transition-all duration-700 delay-100',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}>
            <div className="h-full bg-black/30 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl shadow-primary/20 hover:shadow-primary/30 hover:bg-black/40 hover:border-white/20 transition-all">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-secondary/30 to-yellow-500/30 w-fit mb-6 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                <Target className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To provide transformative education that empowers students with knowledge,
                skills, and values to become responsible global citizens and innovative leaders
                in their chosen fields.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className={cn(
            'group relative transition-all duration-700 delay-200',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}>
            <div className="h-full bg-gradient-to-br from-secondary/20 to-yellow-500/20 backdrop-blur-lg rounded-3xl p-8 border border-secondary/30 hover:border-secondary/50 transition-all shadow-2xl shadow-secondary/20">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-secondary to-yellow-400 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To be recognized as a world-class institution of higher learning, fostering
                excellence in education, research, and innovation while maintaining our
                commitment to social responsibility.
              </p>
            </div>
          </div>

          {/* Values Card */}
          <div className={cn(
            'group relative transition-all duration-700 delay-300',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}>
            <div className="h-full bg-black/30 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl shadow-primary/20 hover:shadow-primary/30 hover:bg-black/40 hover:border-white/20 transition-all">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-secondary/30 to-yellow-500/30 w-fit mb-6 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Our Values</h3>
              <p className="text-gray-300 leading-relaxed">
                Integrity, excellence, innovation, inclusivity, and social responsibility
                form the cornerstone of everything we do at JKKN Institution, guiding our
                journey towards educational greatness.
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={cn(
                'group relative transition-all duration-700',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              )}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="h-full p-6 rounded-2xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 hover:border-white/20 hover:bg-black/40 transition-all duration-300 hover:-translate-y-2">
                <div className={cn(
                  'inline-flex p-3 rounded-xl mb-4 bg-gradient-to-br backdrop-blur-sm',
                  value.color
                )}>
                  <value.icon className="w-6 h-6 text-gray-900" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{value.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={cn(
          'text-center mt-16 transition-all duration-700 delay-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white bg-black/30 backdrop-blur-lg border-2 border-white/20 hover:border-secondary hover:bg-black/40 hover:shadow-lg hover:shadow-secondary/30 transition-all duration-300"
          >
            Learn More About Us
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
