'use client'

import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityHeroSectionProps {
  cityConfig: CityPageConfig
}

export function CityHeroSection({ cityConfig }: CityHeroSectionProps) {
  const stats = [
    { num: cityConfig.heroStats.placements, label: 'Placements' },
    { num: cityConfig.heroStats.lpaHighest, label: 'LPA Highest' },
    { num: cityConfig.heroStats.distanceStat, label: cityConfig.heroStats.distanceLabel },
    { num: cityConfig.heroStats.programmes, label: 'Programmes' },
  ]

  return (
    <header className="hero">
      <div className="hero-inner">
        {/* Badge */}
        <div className="hero-badge">
          AICTE, NBA, NAAC Approved &bull; Admissions Open
        </div>

        {/* H1 */}
        <h1>
          Best Engineering College Near{' '}
          <span className="city-highlight">{cityConfig.displayName}</span>
        </h1>

        {/* Subheading */}
        <p className="hero-sub">{cityConfig.heroSubheading}</p>

        {/* Stats row */}
        <div className="hero-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="hero-stat">
              <span className="hero-stat-num">{stat.num}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hero-cta">
          <a
            href="https://engg.jkkn.ac.in/admission/"
            className="btn btn-accent"
          >
            Apply Now &mdash; 2026-27
          </a>
          <a
            href="#programmes"
            className="btn btn-outline"
          >
            About Courses
          </a>
        </div>
      </div>
    </header>
  )
}
