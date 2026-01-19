'use client'

import { cn } from '@/lib/utils'
import type { z } from 'zod'
import { ModernPrincipalMessagePropsSchema, type BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useRef, useState } from 'react'
import { Quote, Sparkles, Award } from 'lucide-react'
import Image from 'next/image'

export type ModernPrincipalMessageProps = z.infer<typeof ModernPrincipalMessagePropsSchema> & BaseBlockProps

// --- Main Component ---

export function ModernPrincipalMessage({
    title = "Principal's Message",
    name = 'Dr. C. Kathirvel',
    role = 'Principal',
    image = '/images/principal.jpg',
    messagePart1,
    messagePart2,
    showPattern = true,
    className,
}: ModernPrincipalMessageProps) {
    const [inView, setInView] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setInView(true)
        }, { threshold: 0.1 })

        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

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
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#0b6d41] filter blur-[100px] opacity-10" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#ffde59] filter blur-[100px] opacity-10" />
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto w-full">

                <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">

                    {/* Left Column: Image & Profile */}
                    <div className={cn(
                        "w-full lg:w-1/3 flex flex-col items-center lg:items-start transition-all duration-1000 transform",
                        inView ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
                    )}>
                        <div className="relative mb-8 group">
                            {/* Decorative frames */}
                            <div className="absolute -inset-4 border-2 border-[#0b6d41]/10 rounded-[2rem] transform rotate-3 transition-transform duration-500 group-hover:rotate-6" />
                            <div className="absolute -inset-4 border-2 border-[#ffde59]/20 rounded-[2rem] transform -rotate-3 transition-transform duration-500 group-hover:-rotate-6" />

                            <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={image}
                                    alt={name}
                                    fill
                                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <p className="text-white font-medium tracking-wide">Leading with Vision</p>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden sm:block">
                                <Sparkles className="w-8 h-8 text-[#ffde59] fill-[#ffde59]" />
                            </div>
                        </div>

                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-[#0f172a] mb-2">{name}</h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b6d41]/10 text-[#0b6d41] font-semibold tracking-wider text-sm uppercase">
                                <Award className="w-4 h-4" />
                                {role}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Message Content */}
                    <div className={cn(
                        "w-full lg:w-2/3 transition-all duration-1000 delay-300 transform",
                        inView ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
                    )}>
                        <div className="mb-10 relative">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0b6d41] mb-6 font-serif">
                                {title}
                            </h1>
                            <div className="w-24 h-1.5 bg-gradient-to-r from-[#0b6d41] to-[#ffde59] rounded-full" />
                        </div>

                        <div className="prose prose-lg text-gray-600 space-y-8 leading-relaxed relative">
                            <Quote className="absolute -top-6 -left-8 w-12 h-12 text-[#ffde59]/30 fill-current transform -scale-x-100" />

                            <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-[#0b6d41] first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]">
                                {messagePart1}
                            </p>
                            <p>
                                {messagePart2}
                            </p>
                        </div>

                        <div className="mt-12 flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-[#0b6d41]/20 to-transparent" />
                            <Sparkles className="w-5 h-5 text-[#0b6d41]/40" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default ModernPrincipalMessage
