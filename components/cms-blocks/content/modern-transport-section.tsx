'use client'

import { cn } from '@/lib/utils'
import type { z } from 'zod'
import { ModernTransportSectionPropsSchema, TransportFeatureSchema, BusRouteSchema, type BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useRef, useState } from 'react'
import {
    Bus,
    Shield,
    Clock,
    MapPin,
    Users,
    Fuel,
    Wrench,
    Phone,
    CheckCircle2,
    Route,
    BadgeCheck,
    Accessibility,
    UserCheck,
    Banknote,
    Navigation,
    Sparkles,
    Quote
} from 'lucide-react'
import Image from 'next/image'

export type ModernTransportSectionProps = z.infer<typeof ModernTransportSectionPropsSchema> & BaseBlockProps

// --- Animated Counter ---
function AnimatedCounter({ value, inView }: { value: number; inView: boolean }) {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        if (!inView) return

        const duration = 1500
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            const current = Math.floor(value * easeOut)

            setDisplayValue(current)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [value, inView])

    return <span>{displayValue}</span>
}

// --- Main Component ---

export function ModernTransportSection({
    pageTitle = 'TRANSPORT',
    pageSubtitle = 'Safe & Reliable Transportation',
    introduction = 'Transportation is an essential aspect of any educational institution. It provides students and faculty members with a convenient way to reach the campus and enhances the overall educational experience. JKKN Educational Institutions understand the importance of transportation and have made significant efforts to improve their transport facilities.',
    images = [
        { src: '/images/facilities/transport-1.jpg', alt: 'College bus fleet' },
        { src: '/images/facilities/transport-2.jpg', alt: 'Modern buses' },
    ],
    features = [
        { icon: 'Wrench', title: 'Well-Maintained Buses', description: 'The transport facility at JKKN Educational Institutions is equipped with a well-maintained fleet of buses. These buses are regularly serviced and cleaned to ensure the safety and comfort of the passengers. Moreover, the buses are equipped with modern amenities like air-conditioning, comfortable seating, and GPS tracking.' },
        { icon: 'UserCheck', title: 'Trained Drivers', description: 'The drivers who operate the buses at JKKN Educational Institutions are highly trained and experienced. They have a good understanding of the local routes and traffic conditions, which helps them provide a safe and efficient transportation service. Additionally, they undergo regular training sessions to keep their skills up to date.' },
        { icon: 'Banknote', title: 'Affordable Fees', description: 'The transport facility at JKKN Educational Institutions is available to all students and faculty members at an affordable fee. The fee is calculated based on the distance of the student\'s residence from the campus, ensuring that the transportation cost is reasonable for everyone.' },
        { icon: 'Shield', title: 'Safe and Secure', description: 'The safety and security of the passengers are of utmost importance at JKKN Educational Institutions. The buses are equipped with CCTV cameras, and there are female attendants on board to ensure the safety of female passengers. Additionally, the transport facility operates within a strict set of rules and regulations, ensuring that the passengers are always safe.' },
        { icon: 'Clock', title: 'Timely Service', description: 'The transport facility at JKKN Educational Institutions operates on a strict schedule, ensuring that the buses arrive and depart from the campus on time. This allows the students and faculty members to plan their day accordingly, without worrying about delays or missed buses.' },
        { icon: 'Accessibility', title: 'Accessibility', description: 'The transport facility at JKKN Educational Institutions is accessible to all students, regardless of their physical abilities. The buses are equipped with wheelchair ramps and other accessibility features, making it easy for students with disabilities to use the service.' },
    ],
    busRoutes = [
        { route: 'Athani', distance: 51, buses: 1 },
        { route: 'Garusanenkkiyar', distance: 36, buses: 1 },
        { route: 'Poudenpatti', distance: 31, buses: 1 },
        { route: 'Pudupatti', distance: 30, buses: 1 },
        { route: 'Anthiyur', distance: 28, buses: 1 },
        { route: 'Komarapalayam', distance: 30, buses: 1 },
        { route: 'Namakkal', distance: 41, buses: 1 },
        { route: 'Rasiphu', distance: 46, buses: 1 },
        { route: 'Salem', distance: 57, buses: 2 },
        { route: 'Gobichettipalayam', distance: 37, buses: 1 },
        { route: 'Gorapalayam', distance: 86, buses: 1 },
        { route: 'Omalur', distance: 67, buses: 1 },
        { route: 'Cherampalli', distance: 43, buses: 1 },
        { route: 'Chittar', distance: 87, buses: 1 },
        { route: 'Nanjuneli', distance: 52, buses: 1 },
    ],
    districtsCovered = ['Namakkal', 'Salem', 'Erode', 'Tiruppur'],
    transportInchargeName = 'Mr. Mani',
    transportInchargePhone = '+91 9976772223, 9655177177',
    showPattern = true,
    className,
}: ModernTransportSectionProps) {
    const [inView, setInView] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setInView(true)
        }, { threshold: 0.1 })

        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    const iconMap: Record<string, any> = {
        Bus, Shield, Clock, MapPin, Users, Fuel, Wrench, Phone, Route, BadgeCheck,
        CheckCircle2, Accessibility, UserCheck, Banknote, Navigation
    }

    // Calculate totals
    const totalBuses = busRoutes.reduce((acc, r) => acc + r.buses, 0)
    const totalRoutes = busRoutes.length
    const maxDistance = Math.max(...busRoutes.map(r => r.distance))

    return (
        <section
            ref={sectionRef}
            className={cn(
                "relative py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden",
                className
            )}
            style={{
                background: 'linear-gradient(135deg, #fbfbfb 0%, #f0f0f0 100%)',
            }}
        >
            {/* Background Pattern */}
            {showPattern && (
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `radial-gradient(#0b6d41 1.5px, transparent 1.5px)`,
                            backgroundSize: '32px 32px'
                        }}
                    />
                    <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#0b6d41]/10 to-transparent filter blur-[80px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#ffde59]/15 to-transparent filter blur-[80px]" />
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto w-full">

                {/* Header Section */}
                <div className={cn(
                    "text-center mb-20 transition-all duration-1000 transform",
                    inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}>
                    <div className="inline-flex items-center justify-center p-2 mb-4 bg-white/50 backdrop-blur-sm rounded-full border border-[#0b6d41]/10 shadow-sm">
                        <Bus className="w-4 h-4 text-[#0b6d41] mr-2" />
                        <span className="text-sm font-bold tracking-wider text-[#0b6d41] uppercase">Campus Transport</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0b6d41] mb-6 tracking-tight drop-shadow-sm font-serif">
                        {pageTitle}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                        {pageSubtitle}
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#0b6d41] to-[#ffde59] mx-auto mt-8 rounded-full" />
                </div>

                {/* Intro & Images */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
                    {/* Images Gallery */}
                    <div className={cn(
                        "relative transition-all duration-1000 delay-200 transform",
                        inView ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
                    )}>
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            {images.slice(0, 2).map((img, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group",
                                        idx === 0 ? "col-span-2 aspect-video" : "aspect-[4/3]"
                                    )}
                                >
                                    <div className="h-2 w-full absolute top-0 left-0 bg-gradient-to-r from-[#0b6d41] via-[#0d8a52] to-[#ffde59] z-20" />
                                    <Image
                                        src={img.src}
                                        alt={img.alt || 'Transport'}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            ))}

                            {/* Stats Card */}
                            <div className="aspect-[4/3] bg-white rounded-3xl border border-gray-100 shadow-xl p-6 flex flex-col justify-center items-center relative overflow-hidden group">
                                <div className="h-2 w-full absolute top-0 left-0 bg-gradient-to-r from-[#0b6d41] via-[#0d8a52] to-[#ffde59]" />
                                <div className="text-4xl font-bold text-[#0b6d41] mb-2">
                                    <AnimatedCounter value={totalBuses} inView={inView} />+
                                </div>
                                <div className="text-gray-500 font-medium">Active Buses</div>
                                <Bus className="absolute -bottom-4 -right-4 w-24 h-24 text-[#0b6d41]/5 group-hover:text-[#0b6d41]/10 transition-colors" />
                            </div>
                        </div>

                        {/* Decorative */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#0b6d41]/5 rounded-full blur-3xl opacity-50" />
                    </div>

                    {/* Content */}
                    <div className={cn(
                        "space-y-8 transition-all duration-1000 delay-300 transform",
                        inView ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
                    )}>
                        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <div className="h-2 w-full absolute top-0 left-0 bg-gradient-to-r from-[#0b6d41] via-[#0d8a52] to-[#ffde59]" />
                            <Quote className="w-12 h-12 text-[#ffde59] mb-6 opacity-80" />
                            <p className="text-gray-600 text-lg leading-relaxed italic relative z-10">
                                "{introduction}"
                            </p>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="h-1 w-12 bg-[#0b6d41] rounded-full" />
                                <span className="text-[#0b6d41] font-bold tracking-wider text-sm uppercase">About Transport</span>
                            </div>
                            <Sparkles className="absolute bottom-4 right-4 w-24 h-24 text-[#0b6d41]/5" />
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden group">
                                <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-[#0b6d41] to-[#0a5f39]" />
                                <h4 className="text-3xl font-bold text-[#0f172a] mb-1">
                                    <AnimatedCounter value={totalRoutes} inView={inView} />
                                </h4>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Bus Routes</p>
                                <Route className="absolute bottom-3 right-3 w-8 h-8 text-[#0b6d41]/10 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden group">
                                <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-[#0a5f39] to-[#ffde59]" />
                                <h4 className="text-3xl font-bold text-[#0f172a] mb-1">
                                    <AnimatedCounter value={districtsCovered.length} inView={inView} />
                                </h4>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Districts</p>
                                <MapPin className="absolute bottom-3 right-3 w-8 h-8 text-[#0b6d41]/10 group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid (Updated to Management Theme) */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-1.5 mb-4 bg-[#0b6d41]/5 rounded-full">
                            <BadgeCheck className="w-5 h-5 text-[#0b6d41] mr-2" />
                            <span className="text-xs font-bold tracking-widest text-[#0b6d41] uppercase">Key Features</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">
                            Why Choose <span className="text-[#0b6d41]">Our Transport?</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = iconMap[feature.icon] || Bus
                            return (
                                <div
                                    key={idx}
                                    className={cn(
                                        "group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2",
                                        "border border-gray-100",
                                        inView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                                    )}
                                    style={{ transitionDelay: `${idx * 100}ms` }}
                                >
                                    {/* Top Accent Bar */}
                                    <div className="h-2 w-full bg-gradient-to-r from-[#0b6d41] via-[#0d8a52] to-[#ffde59]" />

                                    <div className="p-8">
                                        <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0b6d41]/5 text-[#0b6d41] group-hover:bg-[#0b6d41] group-hover:text-white transition-colors duration-500">
                                            <Icon className="w-7 h-7" />
                                        </div>

                                        <h3 className="text-xl font-bold text-[#0f172a] mb-3 group-hover:text-[#0b6d41] transition-colors duration-300">
                                            {feature.title}
                                        </h3>

                                        <p className="text-gray-500 leading-relaxed text-sm">
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Decorative Sparkle */}
                                    <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                                        <Icon className="w-20 h-20 text-[#0b6d41] -rotate-12 translate-x-4 translate-y-4" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Bus Routes Table (Clean White Wrapper) */}
                <div className={cn(
                    "mb-24 transition-all duration-1000 delay-500 transform",
                    inView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                )}>
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
                        <div className="h-2 w-full bg-gradient-to-r from-[#0b6d41] via-[#0d8a52] to-[#ffde59]" />

                        {/* Clean Header */}
                        <div className="p-8 border-b border-gray-100 bg-gray-50/30">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#0f172a] flex items-center gap-3">
                                        <Route className="w-6 h-6 text-[#0b6d41]" />
                                        Route Schedule
                                    </h3>
                                    <p className="text-gray-500 mt-1">Complete breakdown of transport routes and distances</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-[#0b6d41]/5 rounded-full border border-[#0b6d41]/10">
                                    <MapPin className="w-4 h-4 text-[#0b6d41]" />
                                    <span className="text-[#0b6d41] font-semibold text-sm">
                                        {districtsCovered.length} Districts Covered
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            Destination / Route
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            Distance (km)
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            Fleet Count
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {busRoutes.map((route, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                        <Navigation className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-semibold text-[#0f172a]">{route.route}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-mono text-gray-600 font-medium">
                                                    {route.distance}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#ffde59]/20 text-[#d4b126] font-bold text-sm">
                                                    {route.buses}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Contact Section (Updated to Clean Cards) */}
                <div className={cn(
                    "transition-all duration-1000 delay-700 transform",
                    inView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                )}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Inquiry Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative group p-8">
                            <div className="h-2 w-full absolute top-0 left-0 bg-gradient-to-r from-[#0b6d41] to-[#0a5f39]" />
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <p className="text-[#0b6d41] font-bold text-sm uppercase tracking-wider mb-2">Support</p>
                                    <h3 className="text-2xl font-bold text-[#0f172a]">Transport Inquiry</h3>
                                </div>
                                <div className="p-3 bg-[#0b6d41]/5 rounded-2xl">
                                    <Phone className="w-6 h-6 text-[#0b6d41]" />
                                </div>
                            </div>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                For any queries regarding bus routes, fees, or timings, please feel free to contact our transport department.
                            </p>
                            <div className="flex flex-col gap-3">
                                {transportInchargePhone.split(',').map((phone, idx) => (
                                    <a
                                        key={idx}
                                        href={`tel:${phone.trim()}`}
                                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-[#0b6d41] hover:text-white transition-all duration-300 group/link"
                                    >
                                        <span className="font-bold">{phone.trim()}</span>
                                        <Phone className="w-4 h-4 opacity-50 group-hover/link:opacity-100" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Incharge Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative group p-8">
                            <div className="h-2 w-full absolute top-0 left-0 bg-gradient-to-r from-[#0a5f39] to-[#ffde59]" />
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <p className="text-[#0b6d41] font-bold text-sm uppercase tracking-wider mb-2">In-Charge</p>
                                    <h3 className="text-2xl font-bold text-[#0f172a]">{transportInchargeName}</h3>
                                </div>
                                <div className="p-3 bg-[#ffde59]/10 rounded-2xl">
                                    <UserCheck className="w-6 h-6 text-[#bf9f23]" />
                                </div>
                            </div>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                Responsible for ensuring safe and timely transportation for all students and faculty members across all routes.
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {districtsCovered.map((district, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium shadow-sm"
                                    >
                                        {district}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default ModernTransportSection
