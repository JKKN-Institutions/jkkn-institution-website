'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  Play,
  GraduationCap,
  Users,
  Award,
  Building2,
  ChevronDown,
} from 'lucide-react'

const stats = [
  { icon: GraduationCap, value: '25,000+', label: 'Students' },
  { icon: Users, value: '1,500+', label: 'Faculty' },
  { icon: Award, value: '50+', label: 'Years Legacy' },
  { icon: Building2, value: '15+', label: 'Institutions' },
]

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: 'smooth'
    })
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Gradient Mesh - Light theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-cream to-secondary/10" />

      {/* Animated Gradient Orbs - Yellow/Gold theme */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-secondary/30 to-yellow-200/50 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-secondary/20 to-yellow-100/40 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-secondary/10 via-yellow-100/20 to-primary/5 rounded-full blur-3xl" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#0b6d41 1px, transparent 1px), linear-gradient(90deg, #0b6d41 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <div className={cn(
            'space-y-8 transition-all duration-1000',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary/20 to-yellow-100 backdrop-blur-sm rounded-full border border-secondary/30">
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-secondary to-yellow-500 animate-pulse" />
              <span className="text-sm font-medium text-primary">Admissions Open 2025-26</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="text-gray-900">Shape Your</span>
                <br />
                <span className="bg-gradient-to-r from-secondary via-yellow-500 to-secondary bg-clip-text text-transparent">
                  Future
                </span>
                <br />
                <span className="text-gray-900">With Us</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 max-w-xl leading-relaxed">
                Discover world-class education at JKKN Institution. Where tradition meets innovation,
                and every student finds their path to excellence.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/admissions/apply"
                className={cn(
                  'group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden transition-all duration-500',
                  'bg-gradient-to-r from-secondary via-yellow-400 to-secondary bg-[length:200%_100%]',
                  'text-gray-900 shadow-xl shadow-secondary/30',
                  'hover:bg-[100%_0] hover:shadow-2xl hover:shadow-secondary/40 hover:scale-105'
                )}
              >
                <span className="relative z-10">Apply Now</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                className={cn(
                  'group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300',
                  'bg-white/80 backdrop-blur-sm border-2 border-gray-200',
                  'text-gray-900 hover:border-primary hover:bg-white'
                )}
              >
                <div className="p-2 rounded-full bg-gradient-to-r from-secondary/20 to-yellow-100 group-hover:from-secondary/30 group-hover:to-yellow-200 transition-colors">
                  <Play className="w-4 h-4 text-primary fill-primary" />
                </div>
                <span>Watch Tour</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="pt-8 border-t border-gray-200/50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={cn(
                      'text-center transition-all duration-700',
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    )}
                    style={{ transitionDelay: `${300 + index * 100}ms` }}
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-secondary/20 to-yellow-100 mb-3">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className={cn(
            'relative transition-all duration-1000 delay-300',
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          )}>
            {/* Main Glass Card */}
            <div className="relative">
              {/* Floating Cards */}
              <div className="absolute -top-8 -left-8 lg:-left-12 z-20 animate-float">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/10 p-4 border border-white/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-emerald-600">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">NAAC A+ Grade</p>
                      <p className="text-xs text-gray-500">Accredited Institution</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 lg:-right-10 z-20 animate-float animation-delay-1000">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/10 p-4 border border-white/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-secondary to-yellow-400">
                      <Award className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">100% Placement</p>
                      <p className="text-xs text-gray-500">Career Success</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-secondary/20 border-4 border-white/50">
                <div className="aspect-[4/5] lg:aspect-[3/4] bg-gradient-to-br from-secondary/10 via-cream to-yellow-50 relative">
                  {/* Placeholder for campus image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-secondary/30 to-yellow-100 flex items-center justify-center mb-4">
                        <Building2 className="w-12 h-12 text-primary" />
                      </div>
                      <p className="text-lg font-semibold text-gray-700">JKKN Campus</p>
                      <p className="text-sm text-gray-500">Where Dreams Take Shape</p>
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 via-transparent to-transparent" />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-secondary/40 to-yellow-200/60 rounded-full blur-2xl" />
              <div className="absolute -z-10 -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-primary transition-colors cursor-pointer animate-bounce"
      >
        <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </button>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  )
}
