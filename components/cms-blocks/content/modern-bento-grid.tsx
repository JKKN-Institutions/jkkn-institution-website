'use client'

import { cn } from '@/lib/utils'
import type { z } from 'zod'
import { ModernBentoGridPropsSchema, BentoItemSchema, type BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Newspaper, ArrowUpRight, Calendar, Bookmark } from 'lucide-react'
import { motion } from 'framer-motion'

export type BentoItem = z.infer<typeof BentoItemSchema>
export type ModernBentoGridProps = z.infer<typeof ModernBentoGridPropsSchema> & BaseBlockProps

export default function ModernBentoGrid({
    title = 'Campus Buzz & Insights',
    subtitle = 'Stay updated with the latest happenings at JKKN',
    items = [],
    className,
    isEditing,
}: ModernBentoGridProps) {
    const defaultItems: BentoItem[] = [
        {
            title: 'JKKN Partners with Global Tech Firm for AI Research Lab',
            excerpt: 'A landmark partnership to foster innovation in artificial intelligence and machine learning for engineering students.',
            image: '/images/hero/engineering-1.jpg',
            date: 'Jan 10, 2025',
            category: 'Research',
            type: 'news',
            link: '#',
        },
        {
            title: 'Students Win International Robotics Competition',
            image: '/images/hero/engineering-2.jpg',
            category: 'Achievement',
            type: 'blog',
            link: '#',
        },
        {
            title: 'New Sustainable Energy Program Launched',
            image: '/images/hero/engineering-3.jpg',
            category: 'Academics',
            type: 'blog',
            link: '#',
        },
        {
            title: 'Annual Tech Fest "Innovista 2025" Announced',
            image: '/images/hero/engineering-4.jpg',
            category: 'Events',
            type: 'update',
            link: '#',
        },
    ]

    const displayItems = items.length > 0 ? items : defaultItems

    return (
        <section className={cn('py-12 md:py-16 bg-[#F9F7F2]', className)}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-3xl mb-16 px-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-xs font-bold tracking-widest uppercase mb-4">
                        <Newspaper className="w-3 h-3" />
                        What&apos;s New
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4 tracking-tight leading-tight">
                        {title}
                    </h2>
                    <p className="text-lg text-[#52525B]">
                        {subtitle}
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-6 h-auto md:h-[700px]">
                    {/* Main Featured Item */}
                    <BentoCard
                        item={displayItems[0]}
                        className="md:col-span-3 md:row-span-2"
                        isFeatured
                        isEditing={isEditing}
                    />

                    {/* Secondary Items */}
                    <BentoCard
                        item={displayItems[1]}
                        className="md:col-span-3 md:row-span-1"
                        isEditing={isEditing}
                    />

                    <BentoCard
                        item={displayItems[2]}
                        className="md:col-span-3 md:row-span-1"
                        isEditing={isEditing}
                    />
                </div>

                {/* View All */}
                <div className="mt-12 flex justify-center">
                    <Link
                        href="/news"
                        className="group inline-flex items-center gap-2 text-[#C5A059] font-bold text-lg hover:underline underline-offset-4"
                    >
                        Explore All Updates
                        <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

function BentoCard({
    item,
    className,
    isFeatured = false,
    isEditing = false
}: {
    item: BentoItem;
    className?: string;
    isFeatured?: boolean;
    isEditing?: boolean
}) {
    const CardWrapper = item.link && !isEditing ? Link : 'div'

    return (
        <CardWrapper
            href={item.link || '#'}
            className={cn(
                'group relative overflow-hidden rounded-[1.5rem] bg-white border border-black/5 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 flex flex-col',
                className
            )}
        >
            {/* Background Image */}
            <div className={cn(
                'relative w-full overflow-hidden',
                isFeatured ? 'h-full absolute inset-0' : 'h-48 md:h-full flex-grow'
            )}>
                <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay for featured item */}
                {isFeatured && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-transparent" />
                )}
            </div>

            {/* Content */}
            <div className={cn(
                'relative p-6 md:p-8 flex flex-col',
                isFeatured ? 'justify-end h-full z-10' : 'justify-start'
            )}>
                <div className="flex items-center gap-3 mb-4">
                    {item.category && (
                        <span className={cn(
                            'px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase',
                            isFeatured
                                ? 'bg-white/20 backdrop-blur-md text-white border border-white/20'
                                : 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/10'
                        )}>
                            {item.category}
                        </span>
                    )}
                    {item.date && (
                        <span className={cn(
                            'text-[10px] uppercase tracking-wider font-semibold',
                            isFeatured ? 'text-white/70' : 'text-[#52525B]'
                        )}>
                            {item.date}
                        </span>
                    )}
                </div>

                <h3 className={cn(
                    'font-serif tracking-tight leading-tight group-hover:text-[#C5A059] transition-colors',
                    isFeatured ? 'text-2xl md:text-3xl text-white' : 'text-xl text-[#1A1A1A]'
                )}>
                    {item.title}
                </h3>

                {isFeatured && item.excerpt && (
                    <p className="mt-4 text-white/70 line-clamp-2 max-w-xl">
                        {item.excerpt}
                    </p>
                )}

                {/* Subtle arrow indicator for normal cards */}
                {!isFeatured && (
                    <div className="mt-auto pt-6 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-5 h-5 text-[#C5A059]" />
                    </div>
                )}
            </div>
        </CardWrapper>
    )
}
