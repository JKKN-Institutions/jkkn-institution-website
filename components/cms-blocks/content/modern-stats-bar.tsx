'use client'

import { cn } from '@/lib/utils'
import type { z } from 'zod'
import { ModernStatsBarPropsSchema, StatSchema, type BaseBlockProps } from '@/lib/cms/registry-types'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { GraduationCap, Landmark, Handshake, Building2 } from 'lucide-react'

export type Stat = z.infer<typeof StatSchema>
export type ModernStatsBarProps = z.infer<typeof ModernStatsBarPropsSchema> & BaseBlockProps

export default function ModernStatsBar({
    stats = [],
    className,
}: ModernStatsBarProps) {
    const defaultStats: Stat[] = [
        { value: 95, suffix: '%', label: 'Placement Rate', icon: 'GraduationCap' },
        { value: 50, suffix: '+', label: 'Research Labs', icon: 'Landing' },
        { value: 10000, suffix: '+', label: 'Alumni Network', icon: 'Handshake' },
        { value: 15, suffix: ':1', label: 'Student-Ratio', icon: 'Building2' },
    ]

    const displayStats = stats.length > 0 ? stats : defaultStats
    const iconsMap: Record<string, any> = {
        GraduationCap,
        Landmark,
        Handshake,
        Building2,
    }

    return (
        <section className={cn('py-12 bg-white', className)}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {displayStats.map((stat, idx) => {
                        const Icon = iconsMap[stat.icon || 'GraduationCap'] || GraduationCap
                        return (
                            <div key={idx} className="flex flex-col items-center text-center group">
                                <div className="mb-4 text-[#C5A059] opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                                    <Icon strokeWidth={1} className="w-12 h-12" />
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <Counter value={stat.value} />
                                    <span className="text-3xl md:text-5xl font-serif text-[#C5A059]">{stat.suffix}</span>
                                </div>
                                <div className="mt-2 text-xs font-bold tracking-[0.2em] uppercase text-[#52525B]">
                                    {stat.label}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function Counter({ value }: { value: number }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.5 })

    useEffect(() => {
        if (isInView) {
            let start = 0
            const end = value
            const duration = 2000
            const increment = end / (duration / 16)

            const timer = setInterval(() => {
                start += increment
                if (start >= end) {
                    setCount(end)
                    clearInterval(timer)
                } else {
                    setCount(Math.floor(start))
                }
            }, 16)

            return () => clearInterval(timer)
        }
    }, [isInView, value])

    return <span ref={ref} className="text-3xl md:text-5xl font-serif text-[#1A1A1A]">{count.toLocaleString()}</span>
}
