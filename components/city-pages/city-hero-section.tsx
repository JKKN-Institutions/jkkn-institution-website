'use client'

import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityHeroSectionProps {
  cityConfig: CityPageConfig
}

export function CityHeroSection({ cityConfig }: CityHeroSectionProps) {
  // A city that carries its own stat row uses it. The template row is sourced too:
  // 372 seats = AICTE EOA 2026-27, 23 of 53 = NIRF 2026 (IR-E-C-37096), 2024-25 batch.
  const stats = cityConfig.heroStatItems ?? [
    { num: cityConfig.heroStats.distanceStat, label: cityConfig.heroStats.distanceLabel },
    { num: '372', label: 'AICTE-approved seats, 2026-27' },
    { num: cityConfig.heroStats.programmes, label: 'UG + PG programmes' },
    { num: '23 of 53', label: 'placed, 2024-25 (NIRF 2026)' },
  ]

  return (
    <header className="hero">
      <div className="hero-inner">
        {/* Badge */}
        <div className="hero-badge">
          AICTE Approved &bull; Admissions Open
        </div>

        {/* H1 */}
        <h1>
          {cityConfig.h1 ?? (
            <>
              Best Engineering College Near{' '}
              <span className="city-highlight">{cityConfig.displayName}</span>
            </>
          )}
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
