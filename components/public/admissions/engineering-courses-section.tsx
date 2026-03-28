'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Users } from 'lucide-react'
import type { EngineeringProgram } from '@/lib/institutions/engineering/admissions-data'

interface EngineeringCoursesSectionProps {
  programs: EngineeringProgram[]
}

export function EngineeringCoursesSection({ programs }: EngineeringCoursesSectionProps) {
  const [activeTab, setActiveTab] = useState<'UG' | 'PG'>('UG')

  const filtered = programs.filter((p) => p.level === activeTab)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-[#0b6d41]/10 text-[#0b6d41] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Programs Offered
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Choose Your{' '}
            <span className="text-[#0b6d41]">Program</span>
          </h2>
          <p className="mt-2 text-gray-500 text-sm">
            AICTE Approved · Affiliated to Anna University · Autonomous
          </p>
        </div>

        {/* UG / PG Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border border-border bg-gray-50 p-1 gap-1">
            {(['UG', 'PG'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-[#0b6d41] text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'UG' ? 'UG Programs (4 Years)' : 'PG Programs (2 Years)'}
              </button>
            ))}
          </div>
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filtered.map((program) => (
            <div
              key={program.id}
              className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-[#0b6d41]/40 transition-all"
            >
              {/* Title */}
              <h3 className="text-base font-bold text-gray-900 leading-snug">
                {program.name}
              </h3>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="bg-gray-100 rounded-md px-2.5 py-1 font-medium">
                  {program.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {program.seats} seats
                </span>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-1.5">
                {program.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="text-xs bg-[#0b6d41]/8 text-[#0b6d41] rounded-md px-2 py-0.5 font-medium border border-[#0b6d41]/15"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={program.coursePageUrl}
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#0b6d41] hover:gap-2.5 transition-all"
              >
                View Course Details
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
