'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import { HeroSectionPropsSchema } from '@/lib/cms/registry-types'
import type { HeroSectionProps } from '@/lib/cms/registry-types'
import { useEffect, useState, useRef, useMemo } from 'react'
import { ChevronDown, ArrowRight, Award, TrendingUp, Users, Calendar } from 'lucide-react'
import Image from 'next/image'

export const ModernHeroSectionPropsSchema = HeroSectionPropsSchema

export default function ModernHeroSection({
    title = 'JKKN COLLEGE OF ENGINEERING & TECHNOLOGY',
    subtitle = 'Innovate. Inspire. Impact.',
    logoImage,
    logoImageAlt = '',
    showAiBadge = true,
    titleColor = '#1A1A1A',
    titleFontSize = '6xl',
    titleFontWeight = 'bold',
    subtitleColor = '#52525B',
    backgroundImage,
    backgroundVideo,
    videoPosterImage,
    ctaButtons = [],
    alignment = 'center',
    overlayOpacity = 0.2,
    minHeight = '100vh',
    className,
    isEditing,
}: HeroSectionProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const heroRef = useRef<HTMLElement>(null)

    useEffect(() => {
        setIsLoaded(true)
        const handleScroll = () => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect()
                if (rect.bottom > 0) {
                    setScrollY(window.scrollY * 0.2)
                }
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const buttons = ctaButtons.length > 0 ? ctaButtons : [
        { label: 'Explore Programs', link: '/programs', variant: 'primary' as const },
        { label: 'Virtual Tour', link: '/tour', variant: 'outline' as const },
    ]

    return (
        <section
            ref={heroRef}
            className={cn(
                'relative flex flex-col justify-center overflow-hidden bg-[#F9F7F2]',
                className
            )}
            style={{ minHeight }}
        >
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {backgroundVideo ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                        poster={videoPosterImage}
                        className="w-full h-full object-cover"
                        style={{ transform: `translateY(${scrollY}px) scale(1.05)` }}
                        onLoadStart={(e) => {
                            // Defer video loading until after initial paint
                            e.currentTarget.setAttribute('preload', 'auto')
                        }}
                    >
                        <source src={backgroundVideo} type="video/mp4" />
                    </video>
                ) : backgroundImage ? (
                    <Image
                        src={backgroundImage}
                        alt={logoImageAlt || 'Hero Background'}
                        fill
                        className="object-cover"
                        style={{ transform: `translateY(${scrollY}px) scale(1.05)` }}
                        priority
                        quality={80}
                        sizes="100vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white to-[#F9F7F2]" />
                )}

                {/* Soft White Overlay */}
                <div
                    className="absolute inset-0 bg-white/40"
                    style={{ opacity: overlayOpacity }}
                />
            </div>

            {/* Main Content Card - Glassmorphism */}
            <div className="container relative z-10 mx-auto px-4 py-20 flex flex-col items-center">
                <div
                    className={cn(
                        "max-w-4xl w-full bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center",
                        "transition-all duration-700 ease-out",
                        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}
                >
                    {/* Badge/Logo Section */}
                    <div className="mb-8 flex justify-center">
                        {logoImage ? (
                            <div className="relative h-16 w-48">
                                <Image
                                    src={logoImage}
                                    alt={logoImageAlt}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : showAiBadge && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-xs font-bold tracking-widest uppercase">
                                <Award className="w-4 h-4" />
                                India&apos;s First AI Empowered College
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1
                        className={cn(
                            'font-serif text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-[1.1]',
                        )}
                        style={{ color: titleColor }}
                    >
                        {title}
                    </h1>

                    {/* Subtitle */}
                    {subtitle && (
                        <p
                            className="text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto"
                            style={{ color: subtitleColor }}
                        >
                            {subtitle}
                        </p>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {buttons.map((btn, idx) => (
                            <a
                                key={idx}
                                href={btn.link}
                                className={cn(
                                    'px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105',
                                    btn.variant === 'primary'
                                        ? 'bg-[#C5A059] text-white shadow-lg hover:bg-[#B48F48] shadow-[#C5A059]/20'
                                        : 'bg-white/80 border border-[#C5A059]/30 text-[#C5A059] hover:bg-white'
                                )}
                            >
                                {btn.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Trust Indicators (Optional Bottom Bar) */}
            <div className="absolute bottom-10 left-0 right-0 z-10 hidden md:block">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center gap-12 opacity-60">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
                            <TrendingUp className="w-4 h-4 text-[#C5A059]" /> 95% Placements
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
                            <Users className="w-4 h-4 text-[#C5A059]" /> 100+ Top Recruiters
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
                            <Calendar className="w-4 h-4 text-[#C5A059]" /> 39 Years Excellence
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
                <ChevronDown className="w-6 h-6 text-[#C5A059]" />
            </div>

            {isEditing && !backgroundImage && !backgroundVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">Modern Hero Section (Empty Background)</p>
                </div>
            )}
        </section>
    )
}
