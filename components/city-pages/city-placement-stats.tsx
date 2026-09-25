// components/city-pages/city-placement-stats.tsx
// Server Component — no props (same for all cities)

import Image from 'next/image'

// Read from the college's own NIRF 2026 filing, IR-E-C-37096 (/documents/nirf/2026/engineering.pdf),
// UG 4-year programmes. The filing gives graduates, placed and median salary per batch; it gives
// no highest salary and no recruiter count, so neither is shown. Update with the next filing.
const STATS = [
  { value: '23 / 53', label: 'Graduates placed, 2024-25' },
  { value: '₹2.40 L', label: 'Median salary, 2024-25' },
  { value: '35 / 89', label: 'Graduates placed, 2023-24' },
  { value: '29 / 126', label: 'Graduates placed, 2022-23' },
] as const

const RECRUITERS = [
  { name: 'LGB', logo: '/images/recruiters/lgb.png' },
  { name: 'Foxconn', logo: '/images/recruiters/foxconn.png' },
  { name: 'TVS Group', logo: '/images/recruiters/tvs-group.jpg' },
  { name: 'Sourcesys', logo: '/images/recruiters/sourcesys.png' },
  { name: 'Infinix', logo: '/images/recruiters/infinix.png' },
  { name: 'Pronoia Insurance', logo: '/images/recruiters/pronoia-insurance.jpg' },
] as const

export default function CityPlacementStats() {
  return (
    <section className="section bg-white">
      <div className="section-inner">
        <h2 className="section-title">Placement Record</h2>
        <p className="section-subtitle">
          As filed by the college in NIRF 2026 (IR-E-C-37096), UG 4-year programmes
        </p>
        <span className="section-accent" aria-hidden="true" />
        <div className="section-spacer" />

        {/* Stats grid */}
        <div className="placement-grid">
          {STATS.map((stat) => (
            <div key={stat.label} className="placement-stat">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recruiter logos */}
        <div className="recruiters-wrap">
          <p className="recruiters-title">Companies That Hire From Us</p>
          <div className="recruiter-badges">
            {RECRUITERS.map((company) => (
              <span key={company.name} className="recruiter-badge recruiter-badge--logo">
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={100}
                  height={40}
                  className="recruiter-logo"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
