// components/city-pages/city-placement-stats.tsx
// Server Component — no props (same for all cities)

const STATS = [
  { value: '85%+', label: 'Placement Rate' },
  { value: '10-12', label: 'LPA Highest' },
  { value: '3.5-5', label: 'LPA Average' },
  { value: '9+', label: 'Top Recruiters' },
] as const

const RECRUITERS = [
  'TCS',
  'Infosys',
  'Wipro',
  'CTS',
  'HCL',
  'L&T',
  'Ashok Leyland',
  'TVS',
  'Zoho',
] as const

export default function CityPlacementStats() {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-poppins text-3xl font-bold text-gray-900 text-center mb-2">
          Placements &amp; Career Outcomes
        </h2>
        <p className="text-center text-gray-500 text-base mb-3 max-w-2xl mx-auto">
          Our dedicated placement cell works year-round to connect students with top
          recruiters across India.
        </p>
        <span className="block w-12 h-1 bg-secondary rounded mx-auto mt-3 mb-8" aria-hidden="true" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-7 text-center shadow-sm border border-gray-200"
            >
              <div className="font-poppins text-4xl font-extrabold text-primary leading-none">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 mt-1.5 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Recruiter badges */}
        <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wider">
          Our Recruiters Include
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {RECRUITERS.map((company) => (
            <span
              key={company}
              className="bg-white border border-gray-200 px-4 py-2 rounded-full text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
