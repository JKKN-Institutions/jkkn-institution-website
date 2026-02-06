'use client'

import { cn } from '@/lib/utils'
import type { z } from 'zod'
import { ModernOrganogramSectionPropsSchema, OrgMemberSchema, type BaseBlockProps } from '@/lib/cms/registry-types'
import { useMemo } from 'react'
import Image from 'next/image'

export type ModernOrganogramSectionProps = z.infer<typeof ModernOrganogramSectionPropsSchema> & BaseBlockProps
export type OrgMember = z.infer<typeof OrgMemberSchema>

// --- Color Variants matching the screenshot ---
const variantColors: Record<string, string> = {
    green: "bg-[#2e7d32]", // Chairman, MD, Principal, HoD branch
    "dark-green": "bg-[#1b5e20]",
    yellow: "bg-[#f9a825]", // IQAC, Exam cell
    teal: "bg-[#00838f]", // Vice Principal branch
    cyan: "bg-[#00838f]",
    orange: "bg-[#e65100]", // Research branch
    olive: "bg-[#827717]", // Admin Officer branch
    purple: "bg-[#6a1b9a]", // HR Manager
    maroon: "bg-[#6d4c41]", // Librarian
    "dark-gray": "bg-[#37474f]", // Physical Director, Hostel Warden
    "dark-purple": "bg-[#37474f]",
    magenta: "bg-[#ad1457]",
    red: "bg-[#c62828]",
    blue: "bg-[#1565c0]",
}

// --- Main Component ---
export function ModernOrganogramSection({
    title = 'Institutional Organogram',
    members = [],
    showPattern = true,
    className,
}: ModernOrganogramSectionProps) {

    return (
        <section className={cn("relative py-8 px-4 bg-white min-h-screen", className)}>
            <div className="max-w-7xl mx-auto">

                {/* Institution Header */}
                <div className="flex items-center justify-center gap-4 mb-6 border-b-2 border-[#0b6d41] pb-4">
                    <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                            src="/images/jkkn-logo.png"
                            alt="JKKN Logo"
                            fill
                            className="object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                            }}
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-lg md:text-xl font-bold text-[#0b6d41] uppercase">
                            JKKN COLLEGE OF ENGINEERING AND TECHNOLOGY
                        </h1>
                        <p className="text-xs md:text-sm text-[#0b6d41]">
                            (Managed by J.K.K. Rangammal Charitable Trust)
                        </p>
                        <p className="text-xs text-[#0b6d41]">
                            (Approved by AICTE-New Delhi and Affiliated to Anna University-Chennai)
                        </p>
                        <p className="text-xs text-blue-600">
                            Website: www.engg.jkkn.ac.in
                        </p>
                    </div>
                </div>

                {/* Title Box */}
                <div className="flex justify-center mb-8">
                    <div className="border-2 border-gray-400 rounded-lg px-8 py-3">
                        <h2 className="text-xl font-semibold text-gray-700 text-center">{title}</h2>
                    </div>
                </div>

                {/* Organogram Chart - SVG based for precise control */}
                <div className="w-full overflow-hidden">
                    <svg viewBox="0 0 1200 750" className="w-full h-auto max-h-[70vh]" preserveAspectRatio="xMidYMin meet">
                        {/* Styles */}
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
                            </marker>
                            <marker id="arrowhead-right" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="0">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
                            </marker>
                        </defs>

                        {/* Level 1: Chairman */}
                        <g transform="translate(600, 30)">
                            <rect x="-60" y="0" width="120" height="35" rx="4" fill="#2e7d32" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Chairman</text>
                        </g>

                        {/* Line: Chairman to MD */}
                        <line x1="600" y1="65" x2="600" y2="85" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />

                        {/* Level 2: Managing Director */}
                        <g transform="translate(600, 90)">
                            <rect x="-70" y="0" width="140" height="35" rx="4" fill="#1b5e20" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Managing Director</text>
                        </g>

                        {/* Line: MD to Principal */}
                        <line x1="600" y1="125" x2="600" y2="145" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />

                        {/* Level 3: Principal + IQAC */}
                        <g transform="translate(550, 150)">
                            <rect x="-55" y="0" width="110" height="35" rx="4" fill="#2e7d32" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Principal</text>
                        </g>

                        {/* Arrow from Principal to IQAC */}
                        <line x1="605" y1="167" x2="665" y2="167" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead-right)" />

                        {/* IQAC */}
                        <g transform="translate(720, 150)">
                            <rect x="-45" y="0" width="90" height="35" rx="4" fill="#f9a825" />
                            <text x="0" y="22" textAnchor="middle" fill="#333" fontSize="13" fontWeight="bold">IQAC</text>
                        </g>

                        {/* Main vertical line from Principal */}
                        <line x1="550" y1="185" x2="550" y2="220" stroke="#555" strokeWidth="2" />

                        {/* Horizontal line spanning all departments */}
                        <line x1="80" y1="220" x2="1120" y2="220" stroke="#555" strokeWidth="2" />

                        {/* Department branches - 9 departments */}

                        {/* 1. Vice Principal-IQAC Coordinator */}
                        <line x1="100" y1="220" x2="100" y2="245" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(100, 250)">
                            <rect x="-65" y="0" width="130" height="45" rx="4" fill="#00838f" />
                            <text x="0" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Vice Principal-IQAC</text>
                            <text x="0" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Coordinator</text>
                        </g>
                        <line x1="100" y1="295" x2="100" y2="315" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(100, 320)">
                            <rect x="-55" y="0" width="110" height="35" rx="4" fill="#2e7d32" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">IQAC Members</text>
                        </g>
                        <line x1="100" y1="355" x2="100" y2="375" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(100, 380)">
                            <rect x="-55" y="0" width="110" height="35" rx="4" fill="#2e7d32" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Office Assistant</text>
                        </g>

                        {/* 2. Research */}
                        <line x1="230" y1="220" x2="230" y2="245" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(230, 250)">
                            <rect x="-50" y="0" width="100" height="35" rx="4" fill="#e65100" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Research</text>
                        </g>
                        <line x1="230" y1="285" x2="230" y2="315" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(230, 320)">
                            <rect x="-55" y="0" width="110" height="45" rx="4" fill="#e65100" />
                            <text x="0" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Research team</text>
                            <text x="0" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Members</text>
                        </g>
                        <line x1="230" y1="365" x2="230" y2="385" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(230, 390)">
                            <rect x="-55" y="0" width="110" height="35" rx="4" fill="#e65100" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Office Assistant</text>
                        </g>

                        {/* 3. Exam Cell Coordinator */}
                        <line x1="360" y1="220" x2="360" y2="245" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(360, 250)">
                            <rect x="-50" y="0" width="100" height="45" rx="4" fill="#f9a825" />
                            <text x="0" y="18" textAnchor="middle" fill="#333" fontSize="10" fontWeight="bold">Exam cell</text>
                            <text x="0" y="32" textAnchor="middle" fill="#333" fontSize="10" fontWeight="bold">Coordinator</text>
                        </g>
                        <line x1="360" y1="295" x2="360" y2="315" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(360, 320)">
                            <rect x="-50" y="0" width="100" height="35" rx="4" fill="#f9a825" />
                            <text x="0" y="22" textAnchor="middle" fill="#333" fontSize="11" fontWeight="bold">Office Assistant</text>
                        </g>
                        <line x1="360" y1="355" x2="360" y2="375" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(360, 380)">
                            <rect x="-50" y="0" width="100" height="35" rx="4" fill="#f9a825" />
                            <text x="0" y="22" textAnchor="middle" fill="#333" fontSize="11" fontWeight="bold">Attender&apos;s</text>
                        </g>

                        {/* 4. Head of the Department */}
                        <line x1="490" y1="220" x2="490" y2="245" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(490, 250)">
                            <rect x="-55" y="0" width="110" height="45" rx="4" fill="#2e7d32" />
                            <text x="0" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Head of the</text>
                            <text x="0" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Department</text>
                        </g>
                        <line x1="490" y1="295" x2="490" y2="315" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(490, 320)">
                            <rect x="-55" y="0" width="110" height="35" rx="4" fill="#2e7d32" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Faculty Members</text>
                        </g>
                        <line x1="490" y1="355" x2="490" y2="375" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(490, 380)">
                            <rect x="-55" y="0" width="110" height="35" rx="4" fill="#2e7d32" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Lab Technicians</text>
                        </g>
                        <line x1="490" y1="415" x2="490" y2="435" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(490, 440)">
                            <rect x="-55" y="0" width="110" height="45" rx="4" fill="#2e7d32" />
                            <text x="0" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Assistant &</text>
                            <text x="0" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Attenders</text>
                        </g>

                        {/* 5. Administrative Officer */}
                        <line x1="620" y1="220" x2="620" y2="245" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(620, 250)">
                            <rect x="-55" y="0" width="110" height="45" rx="4" fill="#827717" />
                            <text x="0" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Administrative</text>
                            <text x="0" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Officer</text>
                        </g>
                        <line x1="620" y1="295" x2="620" y2="315" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(620, 320)">
                            <rect x="-55" y="0" width="110" height="45" rx="4" fill="#827717" />
                            <text x="0" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Non Teaching</text>
                            <text x="0" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Staff</text>
                        </g>
                        <line x1="620" y1="365" x2="620" y2="385" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(620, 390)">
                            <rect x="-60" y="0" width="120" height="45" rx="4" fill="#827717" />
                            <text x="0" y="18" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Maintenance &</text>
                            <text x="0" y="32" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Transport Staff</text>
                        </g>
                        <line x1="620" y1="435" x2="620" y2="455" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(620, 460)">
                            <rect x="-55" y="0" width="110" height="45" rx="4" fill="#827717" />
                            <text x="0" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">System</text>
                            <text x="0" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Administrator</text>
                        </g>

                        {/* 6. HR Manager */}
                        <line x1="750" y1="220" x2="750" y2="245" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(750, 250)">
                            <rect x="-50" y="0" width="100" height="35" rx="4" fill="#6a1b9a" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">HR Manager</text>
                        </g>
                        <line x1="750" y1="285" x2="750" y2="315" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(750, 320)">
                            <rect x="-50" y="0" width="100" height="45" rx="4" fill="#6a1b9a" />
                            <text x="0" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Soft skill</text>
                            <text x="0" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Trainers</text>
                        </g>

                        {/* 7. Librarian */}
                        <line x1="870" y1="220" x2="870" y2="245" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(870, 250)">
                            <rect x="-45" y="0" width="90" height="35" rx="4" fill="#6d4c41" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Librarian</text>
                        </g>
                        <line x1="870" y1="285" x2="870" y2="315" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(870, 320)">
                            <rect x="-50" y="0" width="100" height="35" rx="4" fill="#6d4c41" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Library Assistant</text>
                        </g>
                        <line x1="870" y1="355" x2="870" y2="375" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(870, 380)">
                            <rect x="-45" y="0" width="90" height="35" rx="4" fill="#6d4c41" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Attenders</text>
                        </g>

                        {/* 8. Physical Director */}
                        <line x1="980" y1="220" x2="980" y2="245" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(980, 250)">
                            <rect x="-50" y="0" width="100" height="35" rx="4" fill="#37474f" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Physical Director</text>
                        </g>

                        {/* 9. Hostel Warden */}
                        <line x1="1100" y1="220" x2="1100" y2="245" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(1100, 250)">
                            <rect x="-55" y="0" width="110" height="35" rx="4" fill="#37474f" />
                            <text x="0" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Hostel Warden</text>
                        </g>
                        <line x1="1100" y1="285" x2="1100" y2="315" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(1100, 320)">
                            <rect x="-55" y="0" width="110" height="45" rx="4" fill="#37474f" />
                            <text x="0" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Mess & Admin</text>
                            <text x="0" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Staffs</text>
                        </g>
                        <line x1="1100" y1="365" x2="1100" y2="385" stroke="#555" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <g transform="translate(1100, 390)">
                            <rect x="-60" y="0" width="120" height="45" rx="4" fill="#37474f" />
                            <text x="0" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">House Keeping</text>
                            <text x="0" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">& Attenders</text>
                        </g>

                    </svg>
                </div>
            </div>
        </section>
    )
}

export default ModernOrganogramSection
