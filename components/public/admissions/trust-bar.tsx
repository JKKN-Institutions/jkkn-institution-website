import type { TrustStat } from '@/lib/institutions/engineering/admissions-data'

interface TrustBarProps {
  stats: TrustStat[]
}

export function TrustBar({ stats }: TrustBarProps) {
  return (
    <section className="bg-[#fbfbee] py-8 md:py-10 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center bg-white rounded-2xl px-6 py-6 shadow-sm border border-border"
            >
              <span className="text-3xl md:text-4xl font-bold text-[#0b6d41]">
                {stat.value}
              </span>
              <span className="mt-1 text-sm font-semibold text-gray-800">
                {stat.label}
              </span>
              <span className="mt-1 text-xs text-gray-400">
                as of {stat.verifiedOn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
