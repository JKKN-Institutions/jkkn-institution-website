'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Software Engineer at Google',
    program: 'B.Tech CSE, Class of 2020',
    image: null,
    quote: 'JKKN provided me with not just technical skills but also the confidence to dream big. The faculty mentorship and industry exposure were invaluable in my journey to Google.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Dr. Rajesh Kumar',
    role: 'Cardiologist, Apollo Hospitals',
    program: 'MBBS, Class of 2015',
    image: null,
    quote: 'The medical program at JKKN was rigorous yet nurturing. The clinical exposure and research opportunities shaped me into the doctor I am today.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Anitha Venkatesh',
    role: 'Entrepreneur & Founder',
    program: 'MBA, Class of 2018',
    image: null,
    quote: 'The entrepreneurship cell and business incubator at JKKN gave me the foundation to start my own company. Forever grateful for the support system.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Mohammed Farhan',
    role: 'Research Scientist, ISRO',
    program: 'M.Tech Aerospace, Class of 2019',
    image: null,
    quote: 'The research facilities and guidance from professors helped me achieve my dream of working at ISRO. JKKN truly nurtures scientific minds.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

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

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-900 via-[#085032]/40 to-gray-900"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-r from-primary/20 to-emerald-700/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-primary/20 to-emerald-800/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className={cn(
          'text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 backdrop-blur-sm text-secondary text-sm font-semibold mb-4 border border-secondary/40">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            What Our{' '}
            <span className="bg-gradient-to-r from-secondary to-yellow-500 bg-clip-text text-transparent">
              Alumni Say
            </span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Hear from our successful graduates who have made their mark across industries worldwide.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className={cn(
          'relative max-w-4xl mx-auto transition-all duration-700 delay-200',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}>
          {/* Main Card */}
          <div className="relative bg-black/30 backdrop-blur-lg rounded-3xl shadow-2xl shadow-primary/20 border border-white/10 p-8 lg:p-12 overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
              <Quote className="w-16 h-16 lg:w-24 lg:h-24 text-secondary/30" />
            </div>

            {/* Testimonial Content */}
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    'transition-all duration-500',
                    index === currentIndex
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 absolute inset-0 translate-x-8'
                  )}
                >
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl lg:text-2xl text-white leading-relaxed mb-8 font-medium">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-yellow-400 flex items-center justify-center text-gray-900 text-xl font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-secondary font-medium">{testimonial.role}</p>
                      <p className="text-xs text-gray-400">{testimonial.program}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 flex items-center gap-2">
              <button
                onClick={goToPrev}
                className="p-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-gradient-to-r hover:from-secondary hover:to-yellow-400 hover:text-gray-900 transition-all"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="p-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-gradient-to-r hover:from-secondary hover:to-yellow-400 hover:text-gray-900 transition-all"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setCurrentIndex(index)
                }}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-secondary to-yellow-400'
                    : 'bg-gray-300 hover:bg-gray-400'
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Decorative Avatars */}
        <div className={cn(
          'hidden lg:block transition-all duration-700 delay-300',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}>
          {/* Left side avatars */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-yellow-400 shadow-lg" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg ml-6" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary/70 to-yellow-300 shadow-lg" />
          </div>

          {/* Right side avatars */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 space-y-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg ml-auto" />
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-yellow-400 shadow-lg" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-400 shadow-lg ml-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}
