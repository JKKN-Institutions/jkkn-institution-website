'use client'

import { cn } from '@/lib/utils'
import type { z } from 'zod'
import { ModernEducationStoriesPropsSchema, StorySchema, type BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Play, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export type Story = z.infer<typeof StorySchema>
export type ModernEducationStoriesProps = z.infer<typeof ModernEducationStoriesPropsSchema> & BaseBlockProps

export default function ModernEducationStories({
    title = 'Education Stories',
    subtitle = 'Real-World Impact Through Learning',
    stories = [],
    className,
    isEditing,
}: ModernEducationStoriesProps) {
    const defaultStories: Story[] = [
        {
            title: 'The JKKN Difference: Alumni Success Stories',
            subtitle: 'From Campus to Google: An AI Journey',
            image: '/images/hero/engineering-1.jpg',
            link: '#',
        },
        {
            title: 'Innovation in Robotics Lab',
            subtitle: 'Building the Future of Automation',
            image: '/images/hero/engineering-2.jpg',
            link: '#',
        },
        {
            title: 'Our Research Breakthroughs',
            subtitle: 'Pioneering Sustainable Technology',
            image: '/images/hero/engineering-3.jpg',
            link: '#',
        },
    ]

    const displayStories = stories.length > 0 ? stories : defaultStories

    return (
        <section className={cn('py-12 md:py-16 bg-white', className)}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4 tracking-tight">
                        {title}
                    </h2>
                    <p className="text-lg text-[#52525B] max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {displayStories.map((story, idx) => (
                        <StoryCard key={idx} story={story} isEditing={isEditing} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function StoryCard({ story, isEditing }: { story: Story; isEditing?: boolean }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="group relative h-[450px] rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            {/* Liquid Overlay on Hover */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-[#C5A059]/90 via-[#1A1A1A]/20 to-transparent transition-opacity duration-500",
                isHovered ? "opacity-100" : "opacity-60"
            )} />

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-all duration-300">
                        <Play className="w-5 h-5 fill-white" />
                    </div>
                </div>

                <h3 className="text-2xl font-serif mb-2 leading-tight">
                    {story.title}
                </h3>

                {story.subtitle && (
                    <p className="text-white/80 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {story.subtitle}
                    </p>
                )}

                <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                    Watch Story <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
            </div>

            {/* Border Glow */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[#C5A059] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
        </div>
    )
}
