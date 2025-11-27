'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRight, Phone, Mail, MapPin, Calendar, Clock } from 'lucide-react'

export function CTASection() {
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
      className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-white to-cream"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-secondary/10 to-yellow-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#0b6d41 1px, transparent 1px), linear-gradient(90deg, #0b6d41 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - CTA Content */}
          <div className={cn(
            'space-y-8 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}>
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-secondary/20 to-yellow-100 text-primary text-sm font-semibold mb-4 border border-secondary/30">
                Start Your Journey
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Ready to Shape{' '}
                <span className="bg-gradient-to-r from-secondary to-yellow-500 bg-clip-text text-transparent">
                  Your Future?
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Join thousands of successful students who started their journey at JKKN.
                Applications for 2025-26 academic year are now open.
              </p>
            </div>

            {/* Key Dates */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm">
                <div className="p-3 rounded-xl bg-gradient-to-r from-secondary/20 to-yellow-100">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">Application Deadline</p>
                  <p className="text-sm text-gray-500">March 31, 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm">
                <div className="p-3 rounded-xl bg-gradient-to-r from-secondary/20 to-yellow-100">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">Entrance Exam</p>
                  <p className="text-sm text-gray-500">April 15-20, 2025</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/admissions/apply"
                className={cn(
                  'group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden transition-all duration-500',
                  'bg-gradient-to-r from-secondary via-yellow-400 to-secondary bg-[length:200%_100%]',
                  'text-gray-900 shadow-xl shadow-secondary/30',
                  'hover:bg-[100%_0] hover:shadow-2xl hover:shadow-secondary/40 hover:scale-105'
                )}
              >
                <span>Apply Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admissions/brochure"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-primary border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                Download Brochure
              </Link>
            </div>
          </div>

          {/* Right - Contact Info */}
          <div className={cn(
            'transition-all duration-700 delay-200',
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          )}>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-xl shadow-black/5">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h3>

              <div className="space-y-6">
                <a
                  href="tel:+914222661100"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gradient-to-r hover:from-secondary/10 hover:to-yellow-50 border border-gray-100 hover:border-secondary/30 transition-all duration-300 group"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-r from-secondary/20 to-yellow-100 group-hover:from-secondary/30 group-hover:to-yellow-200 transition-colors">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Call Us</p>
                    <p className="text-gray-900 font-semibold">+91 422 266 1100</p>
                  </div>
                </a>

                <a
                  href="mailto:admissions@jkkn.ac.in"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gradient-to-r hover:from-secondary/10 hover:to-yellow-50 border border-gray-100 hover:border-secondary/30 transition-all duration-300 group"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-r from-secondary/20 to-yellow-100 group-hover:from-secondary/30 group-hover:to-yellow-200 transition-colors">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Us</p>
                    <p className="text-gray-900 font-semibold">admissions@jkkn.ac.in</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-secondary/20 to-yellow-100">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Visit Us</p>
                    <p className="text-gray-900 font-semibold">
                      JKKN Group of Institutions
                    </p>
                    <p className="text-sm text-gray-500">
                      Komarapalayam, Namakkal District,
                      <br />
                      Tamil Nadu - 638183
                    </p>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Office Hours</p>
                <p className="text-gray-900 font-medium">
                  Mon - Sat: 9:00 AM - 5:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
