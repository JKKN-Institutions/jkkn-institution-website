'use client'

import { cn } from '@/lib/utils'
import type { z } from 'zod'
import { ModernOrganogramSectionPropsSchema, OrgMemberSchema, type BaseBlockProps } from '@/lib/cms/registry-types'
import { useState, useMemo, useRef } from 'react'
import { ChevronDown, ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react'
import Image from 'next/image'

export type ModernOrganogramSectionProps = z.infer<typeof ModernOrganogramSectionPropsSchema> & BaseBlockProps
export type OrgMember = z.infer<typeof OrgMemberSchema>

// --- Types ---
interface TreeNodeData extends OrgMember {
    children: TreeNodeData[];
}

// --- Color Variants ---
const variants = {
    green: "from-green-600 to-green-700 shadow-green-600/30 ring-green-600/20",
    orange: "from-orange-500 to-amber-600 shadow-orange-500/30 ring-orange-500/20",
    yellow: "from-yellow-400 to-amber-500 shadow-yellow-500/30 ring-yellow-500/20 text-slate-800",
    magenta: "from-pink-600 to-rose-600 shadow-pink-600/30 ring-pink-600/20",
    purple: "from-violet-600 to-purple-700 shadow-purple-600/30 ring-purple-600/20",
    red: "from-red-600 to-red-700 shadow-red-600/30 ring-red-600/20",
    maroon: "from-red-800 to-rose-900 shadow-red-900/30 ring-red-900/20",
    blue: "from-sky-500 to-blue-600 shadow-blue-500/30 ring-blue-500/20",
    "dark-purple": "from-slate-600 to-slate-700 shadow-slate-600/30 ring-slate-600/20",
}

// --- Helpers ---
function buildTree(members: OrgMember[]): TreeNodeData[] {
    const memberMap = new Map<string, TreeNodeData>();
    const roots: TreeNodeData[] = [];

    members.forEach(member => {
        memberMap.set(member.id, { ...member, children: [] });
    });

    members.forEach(member => {
        const node = memberMap.get(member.id);
        if (!node) return;

        if (member.managerId && memberMap.has(member.managerId)) {
            const parent = memberMap.get(member.managerId);
            parent!.children.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
}

// --- Tree Node Component ---

const TreeNode = ({ node, level = 0 }: { node: TreeNodeData; level?: number }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    // @ts-ignore
    const gradientClass = variants[node.variant || 'green'];
    const isYellow = node.variant === 'yellow';

    return (
        <div className="flex flex-col items-center relative">

            {/* Node Card */}
            <div
                className={cn(
                    "relative z-10 p-2 transition-all duration-300 w-44 sm:w-48",
                    "hover:scale-105 group cursor-pointer"
                )}
                onClick={() => hasChildren && setIsExpanded(!isExpanded)}
            >
                <div className={cn(
                    "rounded-xl px-2 py-4 shadow-lg flex flex-col items-center text-center justify-center min-h-[4rem] bg-gradient-to-b ring-4 ring-white relative overflow-hidden",
                    gradientClass
                )}>
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />

                    <h3 className={cn(
                        "text-sm font-bold leading-tight relative z-10",
                        isYellow ? "text-slate-900" : "text-white"
                    )}>
                        {node.name}
                    </h3>
                    {node.role && (
                        <p className={cn(
                            "text-[10px] uppercase tracking-wider mt-1 opacity-90 relative z-10",
                            isYellow ? "text-slate-800" : "text-white"
                        )}>
                            {node.role}
                        </p>
                    )}
                </div>

                {/* Expand Toggle */}
                {hasChildren && (
                    <div className={cn(
                        "absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center bg-white border-2 border-slate-100 text-slate-400 shadow-md z-20 hover:bg-slate-50 transition-transform duration-300",
                        isExpanded ? "rotate-0" : "-rotate-90"
                    )}>
                        <ChevronDown className="w-3 h-3" />
                    </div>
                )}
            </div>

            {/* Connecting Lines (Curved) */}
            {hasChildren && isExpanded && (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-300 origin-top">
                    {/* Vertical Line Down from Parent */}
                    <div className="w-0.5 h-6 bg-slate-300"></div>

                    <div className="flex relative items-start">
                        {node.children!.map((child, index) => {
                            const isFirst = index === 0;
                            const isLast = index === node.children!.length - 1;
                            const isSingle = node.children!.length === 1;

                            return (
                                <div key={index} className="flex flex-col items-center relative px-2 sm:px-4">
                                    {/* Horizontal Connectors */}
                                    {!isSingle && (
                                        <>
                                            {/* Left Line */}
                                            <div className={cn(
                                                "absolute top-0 right-1/2 h-0.5 bg-slate-300",
                                                isFirst ? "w-0" : "w-[calc(50%+4px)] rounded-r-none"
                                            )}></div>
                                            {/* Right Line */}
                                            <div className={cn(
                                                "absolute top-0 left-1/2 h-0.5 bg-slate-300",
                                                isLast ? "w-0" : "w-[calc(50%+4px)]"
                                            )}></div>

                                            {/* CSS Curved Corner Hack */}
                                            {isFirst && <div className="absolute top-[-0.5px] right-[calc(50%-0.5px)] w-2 h-2 border-t-2 border-l-2 border-slate-300 rounded-tl-md" />}
                                            {isLast && <div className="absolute top-[-0.5px] left-[calc(50%-0.5px)] w-2 h-2 border-t-2 border-r-2 border-slate-300 rounded-tr-md" />}
                                        </>
                                    )}

                                    {/* Vertical Line down to Child */}
                                    <div className="w-0.5 h-6 bg-slate-300"></div>

                                    <TreeNode node={child} level={level + 1} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Main Component ---

export function ModernOrganogramSection({
    title = 'Institutional Organogram',
    members = [],
    showPattern = true,
    className,
}: ModernOrganogramSectionProps) {

    // Zoom State
    const [scale, setScale] = useState(1);
    const rootNodes = useMemo(() => buildTree(members), [members]);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
    const handleReset = () => setScale(1);

    return (
        <section className={cn("relative py-12 px-4 overflow-hidden min-h-screen bg-slate-50 selection:bg-green-100", className)}>

            {/* Background Pattern */}
            {showPattern && (
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full"
                        style={{
                            backgroundImage: `linear-gradient(#0b6d41 1px, transparent 1px), linear-gradient(90deg, #0b6d41 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>
            )}

            <div className="relative z-10 w-full h-full flex flex-col">

                {/* Official Institutional Header */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 mb-8 max-w-7xl mx-auto w-full shadow-sm text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#0b6d41]" />

                    <div className="flex flex-col items-center justify-center space-y-2 relative z-10">
                        {/* Logo can go here if needed, adding simple text for now to match screenshot text density */}
                        <h1 className="text-xl md:text-3xl font-extrabold text-[#0b6d41] uppercase tracking-wide">
                            J.K.K. NATRAJA COLLEGE OF ENGINEERING AND TECHNOLOGY
                        </h1>
                        <p className="text-sm md:text-base font-medium text-[#0b6d41]">
                            (Managed by J.K.K. Rangammal Charitable Trust)
                        </p>
                        <p className="text-xs md:text-sm font-medium text-[#0b6d41]">
                            (Approved by AICTE-New Delhi and Affiliated to Anna University-Chennai)
                        </p>
                        <a href="https://www.engg.jkkn.ac.in" className="text-xs md:text-sm font-bold text-blue-600 hover:underline">
                            Website: www.engg.jkkn.ac.in
                        </a>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex justify-between items-center max-w-7xl mx-auto w-full px-4 mb-4">
                    <div className="border border-slate-700 bg-white px-6 py-2 rounded-lg shadow-sm">
                        <h2 className="text-lg font-bold text-[#0b6d41] uppercase tracking-wider">
                            {title}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur shadow-lg border border-slate-200 p-1.5 rounded-xl z-20">
                        <button onClick={handleZoomOut} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Zoom Out">
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <span className="w-12 text-center text-sm font-medium text-slate-500">{Math.round(scale * 100)}%</span>
                        <button onClick={handleZoomIn} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Zoom In">
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-1" />
                        <button onClick={handleReset} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Reset View">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Chart Container - Infinite Scroll / Pan Area */}
                <div className="flex-1 w-full overflow-auto cursor-grab active:cursor-grabbing border border-slate-200 bg-white p-8 min-h-[700px] shadow-inner relative rounded-xl mx-auto max-w-[95%]">
                    <div
                        className="min-w-max min-h-full flex justify-center origin-top transition-transform duration-300 ease-out pt-8"
                        style={{ transform: `scale(${scale})` }}
                    >
                        {rootNodes.map((node, i) => (
                            <TreeNode key={i} node={node} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ModernOrganogramSection
