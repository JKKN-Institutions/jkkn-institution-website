'use client'

import { cn } from '@/lib/utils'
import type { z } from 'zod'
import { ModernTrustSectionPropsSchema, type BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useRef, useState } from 'react'
import { Award, Building2, Calendar, GraduationCap, Heart, Users, Sparkles, Quote } from 'lucide-react'
import Image from 'next/image'

export type ModernTrustSectionProps = z.infer<typeof ModernTrustSectionPropsSchema> & BaseBlockProps

// --- Components ---

function AnimatedCounter({ value, inView }: { value: string; inView: boolean }) {
    const [displayValue, setDisplayValue] = useState('0')

    useEffect(() => {
        if (!inView) return

        const match = value.match(/^([\d,]+)(.*)$/)
        if (!match) {
            setDisplayValue(value)
            return
        }

        const targetNum = parseInt(match[1].replace(/,/g, ''), 10)
        const suffix = match[2] || ''
        const duration = 2000
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            const current = Math.floor(targetNum * easeOut)

            setDisplayValue(current.toLocaleString() + suffix)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [value, inView])

    return <span>{displayValue}</span>
}

// --- Main Component ---

export function ModernTrustSection({
    pageTitle = 'OUR TRUST',
    pageSubtitle = 'J.K.K. Rangammal Charitable Trust',
    founderName = 'SHRI. J.K.K. NATARAJAH',
    founderTitle = 'Founder of J.K.K. Rangammal Charitable Trust',
    founderImage = '/images/founder.webp',
    founderStory = "In the sixties, female children in Kumarapalayam had to walk 2.5 km for their schooling to the nearby town of Bhavani. Realizing the need for women's education, a visionary philanthropist of the zone, Shri J.K.K. Natarajah, initiated a girls' school in the town in 1965.",
    storyTitle = 'A Legacy of Service',
    storyContent = "The J.K.K. Rangammal Charitable Trust was established in 1969 with the motto of providing literacy and women's empowerment. Walking in the footsteps of her father, Smt. N. Sendamaraai, Managing Trustee, expanded the service by providing multi-disciplinary education to both genders. Now, under the umbrella, there are nine institutions, including Dental, Pharmacy, Nursing, Education, Engineering, Arts, and Science colleges.",
    stats = [
        { icon: 'Calendar', value: '1969', label: 'Year Established' },
        { icon: 'Building2', value: '9', label: 'Institutions' },
        { icon: 'GraduationCap', value: '50000+', label: 'Alumni' },
        { icon: 'Users', value: '5000+', label: 'Current Students' },
    ],
    showPattern = true,
    className,
}: ModernTrustSectionProps) {
    const [inView, setInView] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setInView(true)
        }, { threshold: 0.1 })

        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    const iconMap: Record<string, any> = { Calendar, Building2, GraduationCap, Users, Heart, Award }

    return (
        <section
            ref={sectionRef}
            className={cn(
                "relative py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col justify-center",
                className
            )}
            style={{
                background: 'linear-gradient(135deg, #fbfbfb 0%, #f0f0f0 100%)',
            }}
        >
            {/* Background Pattern */}
            {showPattern && (
                <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full"
                        style={{
                            backgroundImage: `radial-gradient(#0b6d41 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                    <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#0b6d41] filter blur-[100px] opacity-10" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#ffde59] filter blur-[100px] opacity-10" />
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto w-full space-y-24">

                {/* Header */}
                <div className={cn(
                    "text-center transition-all duration-1000 transform",
                    inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}>
                    <div className="inline-flex items-center justify-center p-2 mb-4 bg-white/50 backdrop-blur-sm rounded-full border border-[#0b6d41]/10 shadow-sm">
                        <Heart className="w-4 h-4 text-[#0b6d41] fill-[#0b6d41] mr-2" />
                        <span className="text-sm font-bold tracking-wider text-[#0b6d41] uppercase">Est. 1969</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0b6d41] mb-6 tracking-tight font-serif">
                        {pageTitle}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                        {pageSubtitle}
                    </p>
                </div>

                {/* Founder Spotlight */}
                <div className={cn(
                    "relative transition-all duration-1000 delay-300 transform",
                    inView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                )}>
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#ffde59]/20 to-transparent rounded-bl-[100%]" />

                        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                            {/* Founder Image */}
                            <div className="relative group">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0b6d41] to-[#ffde59] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-[6px] border-white shadow-xl">
                                    <Image
                                        src={founderImage}
                                        alt={founderName}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="absolute -bottom-4 right-8 bg-[#ffde59] text-[#0b6d41] p-3 rounded-full shadow-lg border-4 border-white">
                                    <Award className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Founder Text */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-2">{founderName}</h2>
                                <p className="text-[#0b6d41] font-semibold tracking-wide uppercase text-sm mb-6">{founderTitle}</p>

                                <div className="relative">
                                    <Quote className="absolute -top-4 -left-4 w-8 h-8 text-[#ffde59]/40 fill-current" />
                                    <p className="text-gray-600 text-lg leading-relaxed italic relative z-10">
                                        "{founderStory}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Story & Stats Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Story Content */}
                    <div className={cn(
                        "transition-all duration-1000 delay-500 transform",
                        inView ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
                    )}>
                        <h3 className="text-3xl font-bold text-[#0b6d41] mb-6 relative inline-block">
                            {storyTitle}
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#ffde59] rounded-full" />
                        </h3>
                        <div className="prose prose-lg text-gray-600">
                            <p className="leading-relaxed">
                                {storyContent}
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className={cn(
                        "grid grid-cols-2 gap-6 transition-all duration-1000 delay-700 transform",
                        inView ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
                    )}>
                        {stats.map((stat, i) => {
                            const Icon = iconMap[stat.icon] || Award
                            return (
                                <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-[#0b6d41]/10 flex items-center justify-center mb-4 text-[#0b6d41]">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-3xl font-bold text-[#0f172a] mb-1">
                                        <AnimatedCounter value={stat.value} inView={inView} />
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                                        {stat.label}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default ModernTrustSection
