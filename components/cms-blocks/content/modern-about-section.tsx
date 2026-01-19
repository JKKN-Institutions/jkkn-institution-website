'use client'

import { cn } from '@/lib/utils'
import type { z } from 'zod'
import { ModernAboutSectionPropsSchema, type BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, History, Target, ShieldCheck } from 'lucide-react'

export type ModernAboutSectionProps = z.infer<typeof ModernAboutSectionPropsSchema> & BaseBlockProps

export default function ModernAboutSection({
    title = 'Founded on a legacy of excellence and innovation',
    experienceYear = '39+',
    subtitle = 'Elevating Minds, Empowering Futures',
    description = 'JKKN is committed to shaping the future of engineering. Our world-class faculty, state-of-the-art facilities, and collaborative environment empower students to become leaders and change makers.',
    image = '/images/hero/about-campus.jpg',
    className,
}: ModernAboutSectionProps) {
    return (
        <section className={cn('py-12 md:py-16 bg-[#FDFBF7] overflow-hidden', className)}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Layout Left: Image Grid (Artsy) */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative aspect-square md:aspect-[4/5] w-full max-w-lg mx-auto">
                            <div className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-2xl z-10 transition-transform duration-700 hover:scale-[1.02]">
                                <Image
                                    src={image || '/images/hero/engineering-1.jpg'}
                                    alt="JKKN Campus"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Floating Stat Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -right-6 top-1/4 z-20 bg-[#C5A059] text-white p-8 rounded-3xl shadow-2xl"
                            >
                                <div className="text-5xl font-serif font-bold mb-1">{experienceYear}</div>
                                <div className="text-xs font-bold tracking-widest uppercase opacity-80">Years of Legacy</div>
                            </motion.div>

                            {/* Decorative Element */}
                            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl -z-10" />
                        </div>
                    </div>

                    {/* Layout Right: Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-[2px] w-12 bg-[#C5A059]" />
                                <span className="text-[#C5A059] text-sm font-bold tracking-[0.2em] uppercase">{subtitle}</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1A1A1A] mb-8 leading-[1.1] tracking-tight">
                                {title}
                            </h2>

                            <p className="text-lg text-[#52525B] leading-relaxed mb-10">
                                {description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-[#C5A059] shadow-sm">
                                        <History className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1A1A1A] mb-1">Our Heritage</h4>
                                        <p className="text-sm text-[#52525B]">Rooted in values, built for the future.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-[#C5A059] shadow-sm">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1A1A1A] mb-1">Accredited Excellence</h4>
                                        <p className="text-sm text-[#52525B]">Recognized for global standards.</p>
                                    </div>
                                </div>
                            </div>

                            <button className="group flex items-center gap-4 text-[#1A1A1A] font-bold text-lg">
                                Learn more about our legacy
                                <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-[#C5A059] group-hover:border-[#C5A059] group-hover:text-white transition-all duration-300">
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
