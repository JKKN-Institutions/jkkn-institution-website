'use client'

import { cn } from '@/lib/utils'
import type { z } from 'zod'
import { ModernManagementSectionPropsSchema, type BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useRef, useState } from 'react'
import { Quote, Award, Sparkles } from 'lucide-react'
import Image from 'next/image'

export type ModernManagementSectionProps = z.infer<typeof ModernManagementSectionPropsSchema> & BaseBlockProps

export function ModernManagementSection({
    title = 'OUR MANAGEMENT',
    subtitle = 'Visionary Leadership Guiding JKKN',
    members,
    showPattern = true,
    className,
}: ModernManagementSectionProps) {
    const [inView, setInView] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true)
                }
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    // Default members if none provided (though zod default handles this typically)
    const displayMembers = members && members.length > 0 ? members : [
        {
            name: 'SMT. N. SENDAMARAAI',
            title: 'CHAIRPERSON',
            image: '/images/chairperson.png',
            message: 'Leadership and Excellence is not merely our motto but the foundation of our values, a testament to our state-of-the-art infrastructure and unwavering commitment to quality education.',
        },
        {
            name: 'SHRI. S. OMMSHARRAVANA',
            title: 'DIRECTOR',
            image: '/images/director.png',
            message: 'Our mission empowers students to contribute their best to society and the nation. We are committed to innovative education methodologies that enable quality learning.',
        },
        {
            name: 'MRS. O. ISVARYA LAKSHMI',
            title: 'JOINT DIRECTOR',
            image: 'https://ui-avatars.com/api/?name=O+I&background=ffde59&color=0b6d41&size=512', // Fallback avatar
            message: 'Together, we strive to create an environment where excellence thrives and every student achieves their fullest potential.',
        }
    ]

    return (
        <section
            ref={sectionRef}
            className={cn(
                "relative py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col justify-center",
                className
            )}
            style={{
                background: 'linear-gradient(135deg, #fbfbfb 0%, #f0f0f0 100%)', // Premium light background
            }}
        >
            {/* Decorative Background Pattern */}
            {showPattern && (
                <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full"
                        style={{
                            backgroundImage: `radial-gradient(#0b6d41 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#ffde59] filter blur-[100px] opacity-20" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#0b6d41] filter blur-[100px] opacity-20" />
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className={cn(
                    "text-center mb-20 transition-all duration-1000 transform",
                    inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}>
                    <div className="inline-flex items-center justify-center p-2 mb-4 bg-white/50 backdrop-blur-sm rounded-full border border-[#0b6d41]/10 shadow-sm">
                        <Sparkles className="w-4 h-4 text-[#ffde59] fill-[#ffde59] mr-2" />
                        <span className="text-sm font-bold tracking-wider text-[#0b6d41] uppercase">Leadership</span>
                        <Sparkles className="w-4 h-4 text-[#ffde59] fill-[#ffde59] ml-2" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0b6d41] mb-6 tracking-tight drop-shadow-sm font-serif">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                        {subtitle}
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#0b6d41] to-[#ffde59] mx-auto mt-8 rounded-full" />
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 perspective-1000">
                    {displayMembers.map((member, index) => (
                        <div
                            key={index}
                            className={cn(
                                "group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2",
                                "border border-gray-100",
                                inView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                            )}
                            style={{ transitionDelay: `${index * 200}ms` }}
                        >
                            {/* Top Accent Bar */}
                            <div className="h-2 w-full bg-gradient-to-r from-[#0b6d41] via-[#0d8a52] to-[#ffde59]" />

                            {/* Image Section */}
                            <div className="relative h-80 w-full overflow-hidden bg-gray-50 group-hover:bg-[#0b6d41]/5 transition-colors duration-500">
                                <div className="absolute inset-0 flex items-center justify-center pt-8">
                                    {/* Decorative Circle behind image */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[#ffde59]/30 group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-2 border-[#0b6d41]/10 group-hover:border-[#ffde59]/50 transition-colors duration-500" />

                                    <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-lg z-10 group-hover:shadow-[#ffde59]/30 transition-shadow duration-500">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="relative p-8 text-center bg-white z-20">
                                {/* Name & Title */}
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-[#0f172a] mb-2 group-hover:text-[#0b6d41] transition-colors duration-300">
                                        {member.name}
                                    </h3>
                                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-[#0b6d41]/5 text-[#0b6d41] font-semibold text-sm tracking-wide">
                                        <Award className="w-4 h-4" />
                                        {member.title}
                                    </div>
                                </div>

                                {/* Quote/Message */}
                                {member.message && (
                                    <div className="relative mt-6 pt-6 border-t border-dashed border-gray-200">
                                        <Quote className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 fill-gray-100 text-gray-200 bg-white px-1" />
                                        <p className="text-gray-600 italic leading-relaxed text-sm">
                                            "{member.message}"
                                        </p>
                                    </div>
                                )}

                                {/* Bottom decorative elements */}
                                <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                                    <Sparkles className="w-16 h-16 text-[#0b6d41]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ModernManagementSection

