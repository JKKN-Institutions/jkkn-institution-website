'use client'

import { cn } from '@/lib/utils'
import type { z } from 'zod'
import { ModernLogoMarqueePropsSchema, LogoItemSchema, type BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'

export type LogoItem = z.infer<typeof LogoItemSchema>
export type ModernLogoMarqueeProps = z.infer<typeof ModernLogoMarqueePropsSchema> & BaseBlockProps

export default function ModernLogoMarquee({
    title = 'Our Global Placement Partners & Recruiters',
    logos = [],
    className,
}: ModernLogoMarqueeProps) {
    const defaultLogos: LogoItem[] = [
        { src: '/images/partners/google.png', alt: 'Google' },
        { src: '/images/partners/microsoft.png', alt: 'Microsoft' },
        { src: '/images/partners/tcs.png', alt: 'TCS' },
        { src: '/images/partners/wipro.png', alt: 'Wipro' },
        { src: '/images/partners/infosys.png', alt: 'Infosys' },
        { src: '/images/partners/amazon.png', alt: 'Amazon' },
    ]

    const displayLogos = logos.length > 0 ? logos : defaultLogos

    return (
        <section className={cn('py-12 md:py-16 bg-white border-y border-black/5 overflow-hidden', className)}>
            <div className="container mx-auto px-4 mb-12 text-center">
                <div className="text-xs font-bold tracking-[0.3em] uppercase text-[#C5A059] mb-4">Trusted By Leaders</div>
                <h2 className="text-2xl md:text-3xl font-serif text-[#1A1A1A]">{title}</h2>
            </div>

            <div className="relative flex overflow-x-hidden">
                <div className="animate-marquee whitespace-nowrap flex items-center py-4">
                    {[...displayLogos, ...displayLogos, ...displayLogos].map((logo, idx) => (
                        <div key={idx} className="mx-12 grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100 flex-shrink-0">
                            <div className="relative h-12 w-32">
                                {/* Placeholder check for real project paths */}
                                <div className="absolute inset-0 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">
                                    {logo.alt}
                                </div>
                                {/* <Image src={logo.src} alt={logo.alt} fill className="object-contain" /> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
        </section>
    )
}
