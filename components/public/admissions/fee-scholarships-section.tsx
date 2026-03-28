import { Trophy, Building2, Heart, Award, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { FeeEntry, ScholarshipScheme } from '@/lib/institutions/engineering/admissions-data'

interface FeeScholarshipsSectionProps {
  fees: FeeEntry[]
  scholarships: ScholarshipScheme[]
}

const ICON_MAP = {
  Trophy,
  Building2,
  Heart,
  Award,
} as const

function formatCurrency(amount: number) {
  return `₹${(amount / 1000).toFixed(0)}K`
}

export function FeeScholarshipsSection({ fees, scholarships }: FeeScholarshipsSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <div className="container mx-auto px-4">

        {/* ── Fee Structure ───────────────────────── */}
        <div className="text-center mb-10">
          <span className="inline-block bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Fee Structure
          </span>
          <h2 className="text-2xl md:text-3xl font-bold">
            Transparent &{' '}
            <span className="text-[#ffde59]">Affordable</span>
          </h2>
          <p className="mt-2 text-gray-400 text-sm max-w-xl mx-auto">
            Fees shown per academic year. Hostel is optional and all-inclusive
            (meals + utilities). Scholarships can significantly reduce tuition costs.
          </p>
        </div>

        {/* Fee Table */}
        <div className="max-w-3xl mx-auto mb-16 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/10 text-white/60 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Program</th>
                <th className="text-right px-5 py-3">Annual Tuition</th>
                <th className="text-right px-5 py-3">Hostel (Optional)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {fees.map((fee) => (
                <tr key={fee.program} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 text-white font-medium">{fee.program}</td>
                  <td className="px-5 py-4 text-right text-[#ffde59] font-bold">
                    {formatCurrency(fee.annualTuition)}
                  </td>
                  <td className="px-5 py-4 text-right text-gray-300">
                    {formatCurrency(fee.hostelFee)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Scholarships ─────────────────────────── */}
        <div className="text-center mb-10">
          <span className="inline-block bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Scholarships
          </span>
          <h2 className="text-2xl md:text-3xl font-bold">
            75% of Students Receive{' '}
            <span className="text-[#ffde59]">Financial Aid</span>
          </h2>
          <p className="mt-2 text-gray-400 text-sm max-w-xl mx-auto">
            Multiple scholarship pathways — merit, government, need-based, and
            sports. Check which one you qualify for.
          </p>
        </div>

        {/* Scholarship Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {scholarships.map((scheme) => {
            const Icon = ICON_MAP[scheme.icon]
            const isExternal = scheme.ctaUrl?.startsWith('http')
            return (
              <div
                key={scheme.id}
                className="bg-white/6 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/10 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0b6d41]/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#ffde59]" />
                </div>
                <h3 className="font-bold text-white text-sm">{scheme.name}</h3>
                <p className="text-[#ffde59] text-sm font-semibold">{scheme.benefit}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{scheme.eligibility}</p>
                {scheme.ctaUrl && (
                  <Link
                    href={scheme.ctaUrl}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white transition-colors"
                  >
                    Check Eligibility
                    {isExternal ? (
                      <ExternalLink className="w-3 h-3" />
                    ) : (
                      <span>→</span>
                    )}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
