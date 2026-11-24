// components/city-pages/city-placement-stats.tsx
// Server Component — no props (same for all cities)

import Image from 'next/image'

// User's choice 2026-11-24: the website shows no placement numbers (no placed count, rate or salary). This
// section names the Training and Placement Cell and keeps the recruiter logos. The college's NIRF filings stay
// on the IQAC - NIRF page.
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
        <h2 className="section-title">Placement Support</h2>
        <p className="section-subtitle">
          The Training and Placement Cell runs placement training and organises campus recruitment drives for
          final-year learners.
        </p>
        <span className="section-accent" aria-hidden="true" />
        <div className="section-spacer" />

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
