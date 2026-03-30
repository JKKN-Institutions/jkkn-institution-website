// components/city-pages/city-placement-stats.tsx
// Server Component — no props (same for all cities)

import Image from 'next/image'

const STATS = [
  { value: '95%', label: 'Placement Rate' },
  { value: '₹12', label: 'LPA Highest' },
  { value: '₹4.5', label: 'LPA Average' },
  { value: '50+', label: 'Recruiting Companies' },
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
        <h2 className="section-title">Placement Highlights</h2>
        <p className="section-subtitle">
          Our dedicated placement cell connects talented students with leading companies worldwide
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
