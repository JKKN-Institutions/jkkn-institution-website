'use client'

import { cn } from '@/lib/utils'
import type { z } from 'zod'
import { ModernVideoHubPropsSchema, VideoItemSchema, type BaseBlockProps } from '@/lib/cms/registry-types'
import { useState } from 'react'
import { PlayCircle, ChevronRight, Video } from 'lucide-react'
import Image from 'next/image'

export type VideoItem = z.infer<typeof VideoItemSchema>
export type ModernVideoHubProps = z.infer<typeof ModernVideoHubPropsSchema> & BaseBlockProps

export default function ModernVideoHub({
    title = 'Video Hub: Experience JKKN',
    subtitle = 'A visual journey through our vibrant campus and academic life',
    videos = [],
    className,
}: ModernVideoHubProps) {
    const defaultVideos: VideoItem[] = [
        { title: 'Campus Tour: Explore Our Facilities', duration: '3:45', thumbnail: '/images/hero/engineering-1.jpg', videoUrl: '#' },
        { title: 'Student Life: A Holistic Experience', duration: '4:12', thumbnail: '/images/hero/engineering-2.jpg', videoUrl: '#' },
        { title: 'Research & Innovation at JKKN', duration: '5:30', thumbnail: '/images/hero/engineering-3.jpg', videoUrl: '#' },
        { title: 'Alumni Success Stories', duration: '2:50', thumbnail: '/images/hero/engineering-4.jpg', videoUrl: '#' },
    ]

    const displayVideos = videos.length > 0 ? videos : defaultVideos
    const [activeVideo, setActiveVideo] = useState(displayVideos[0])

    return (
        <section className={cn('py-12 md:py-16 bg-[#F9F7F2]', className)}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                            <Video className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C5A059]">Visual Learning</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">{title}</h2>
                    <p className="text-[#52525B] max-w-2xl">{subtitle}</p>
                </div>

                {/* Video Hub UI */}
                <div className="flex flex-col lg:flex-row gap-8 bg-white p-4 rounded-[2.5rem] shadow-2xl overflow-hidden border border-black/5">

                    {/* Main Player Area */}
                    <div className="w-full lg:w-2/3 relative rounded-[2rem] overflow-hidden aspect-video group">
                        <Image
                            src={activeVideo.thumbnail}
                            alt={activeVideo.title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#C5A059] text-white flex items-center justify-center shadow-2xl transform transition-transform duration-300 group-hover:scale-110">
                                <PlayCircle strokeWidth={1.5} className="w-12 h-12" />
                            </div>
                        </div>

                        {/* Video Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">{activeVideo.title}</h3>
                            <div className="text-white/60 text-sm font-bold uppercase tracking-widest">Now Watching • {activeVideo.duration}</div>
                        </div>
                    </div>

                    {/* Playlist Sidebar */}
                    <div className="w-full lg:w-1/3 flex flex-col h-full overflow-y-auto px-4 max-h-[500px]">
                        <div className="text-xs font-bold uppercase tracking-widest text-[#52525B] mb-6 pt-4 px-2">Up Next</div>
                        <div className="flex flex-col gap-4">
                            {displayVideos.map((video, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveVideo(video)}
                                    className={cn(
                                        "flex gap-4 p-3 rounded-2xl transition-all duration-300 text-left group",
                                        activeVideo.title === video.title ? "bg-[#C5A059]/10 ring-1 ring-[#C5A059]/20" : "hover:bg-gray-50"
                                    )}
                                >
                                    <div className="relative w-24 h-16 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                                        <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
                                        {activeVideo.title === video.title && (
                                            <div className="absolute inset-0 bg-[#C5A059]/40 flex items-center justify-center">
                                                <Video className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className={cn(
                                            "text-sm font-bold leading-tight line-clamp-2 transition-colors",
                                            activeVideo.title === video.title ? "text-[#C5A059]" : "text-[#1A1A1A] group-hover:text-[#C5A059]"
                                        )}>
                                            {video.title}
                                        </h4>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#52525B] mt-1">{video.duration}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
