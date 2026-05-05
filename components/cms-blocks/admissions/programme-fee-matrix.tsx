import { GraduationCap, BookOpen, Layers, Info, IndianRupee } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProgrammeFeeMatrixProps, ProgrammeFeeMatrixCategory } from '@/lib/cms/registry-types'

const ICON_MAP = {
  graduation: GraduationCap,
  book: BookOpen,
  layers: Layers,
} as const

const SECTION_BG = {
  white: 'bg-white',
  cream: 'bg-[#f6faf7]',
  alternating: '', // handled per-category
} as const

function isNumeric(value: string | number) {
  if (typeof value === 'number') return true
  return /^\d[\d,]*(\.\d+)?$/.test(value.replace(/[₹,\s]/g, ''))
}

function formatValue(value: string | number, currencySymbol: string) {
  if (typeof value === 'number') return `${currencySymbol}${value.toLocaleString('en-IN')}`
  return value
}

function CategorySection({
  category,
  background,
  currencySymbol,
}: {
  category: ProgrammeFeeMatrixCategory
  background: 'white' | 'cream'
  currencySymbol: string
}) {
  const Icon = ICON_MAP[category.icon ?? 'graduation']

  return (
    <section
      id={category.id}
      className={cn('py-12 md:py-16', SECTION_BG[background])}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Category heading */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#0b6d41]/10 text-[#0b6d41] flex items-center justify-center">
            <Icon className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
              {category.label}
            </h2>
            {category.sublabel && (
              <p className="text-sm text-gray-600 mt-1">{category.sublabel}</p>
            )}
          </div>
        </div>

        {/* Fee table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0b6d41] text-white text-xs uppercase tracking-wider">
                <th scope="col" className="text-left px-5 py-3">Programme</th>
                <th scope="col" className="text-right px-4 py-3 whitespace-nowrap">
                  Government Quota (GQ)
                </th>
                <th scope="col" className="text-right px-5 py-3 whitespace-nowrap">
                  Management Quota (MQ)
                </th>
                {category.showRemarks && (
                  <th scope="col" className="text-right px-5 py-3 whitespace-nowrap">
                    Remarks
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {category.rows.map((row, idx) => (
                <tr
                  key={`${category.id ?? category.label}-${row.program}-${idx}`}
                  className="hover:bg-[#f6faf7] transition-colors"
                >
                  <td className="px-5 py-4 text-gray-900 font-medium">
                    <div className="flex flex-col">
                      <span>{row.programLabel ?? row.program}</span>
                      {row.programLabel && (
                        <span className="text-xs text-gray-500 mt-0.5">{row.program}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    {isNumeric(row.governmentQuota) ? (
                      <span className="font-semibold text-[#0b6d41]">
                        {formatValue(row.governmentQuota, currencySymbol)}
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs italic">
                        {row.governmentQuota}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-[#0b6d41] whitespace-nowrap">
                    {formatValue(row.managementQuota, currencySymbol)}
                  </td>
                  {category.showRemarks && (
                    <td className="px-5 py-4 text-right text-gray-600 text-xs whitespace-nowrap">
                      {row.remarks ?? '—'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function QuotaExplainer() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[#0b6d41]/15 bg-[#f6faf7] p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0b6d41]/10 text-[#0b6d41] text-xs font-bold">
                GQ
              </span>
              <h3 className="text-base font-semibold text-gray-900">Government Quota</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Allotted through TNEA counselling by Anna University, Chennai. Tuition fees are
              regulated by the Tamil Nadu Government and may be revised each academic year.
            </p>
          </div>
          <div className="rounded-xl border border-[#0b6d41]/15 bg-[#f6faf7] p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0b6d41]/10 text-[#0b6d41] text-xs font-bold">
                MQ
              </span>
              <h3 className="text-base font-semibold text-gray-900">Management Quota</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Direct admission through the college admissions office, subject to AICTE and Tamil
              Nadu Government norms. Fee shown is the annual tuition payable.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ProgrammeFeeMatrix({
  badge,
  title,
  subtitle,
  categories = [],
  currencySymbol = '₹',
  showQuotaExplainer = true,
  footerNotes = [],
  className,
  isEditing,
}: ProgrammeFeeMatrixProps) {
  if (categories.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4 bg-white', className)}>
        <div className="container mx-auto max-w-5xl">
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-center">
              Click to add fee categories (UG, PG, Lateral Entry…)
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Optional intro header */}
      {(badge || title || subtitle) && (
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
            {badge && (
              <span className="inline-block bg-[#ffde59] text-[#0b6d41] text-xs font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-4">
                {badge}
              </span>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Quota explainer cards */}
      {showQuotaExplainer && <QuotaExplainer />}

      {/* Category sections — alternate cream / white backgrounds */}
      {categories.map((category, idx) => (
        <CategorySection
          key={category.id ?? `${category.label}-${idx}`}
          category={category}
          background={idx % 2 === 0 ? 'cream' : 'white'}
          currencySymbol={currencySymbol}
        />
      ))}

      {/* Footer notes */}
      {footerNotes.length > 0 && (
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-[#0b6d41] flex-shrink-0 mt-0.5" />
                <h3 className="text-lg font-semibold text-gray-900">Important Notes</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
                {footerNotes.map((note, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0b6d41] mt-2" />
                    <span dangerouslySetInnerHTML={{ __html: note }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
