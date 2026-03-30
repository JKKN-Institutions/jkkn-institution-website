// components/city-pages/city-cross-links.tsx
// Server Component — props: cityConfig

import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityCrossLinksProps {
  cityConfig: CityPageConfig
}

export default function CityCrossLinks({ cityConfig }: CityCrossLinksProps) {
  return (
    <section className="section">
      <div className="section-inner">
        <h2 className="section-title">Explore More Cities</h2>
        <p className="section-subtitle">
          Find the best engineering college near your city
        </p>
        <span className="section-accent" aria-hidden="true" />
        <div className="section-spacer" />

        <div className="city-links">
          {cityConfig.crossLinks.map((link) => (
            <Link
              key={link.slug}
              href={`/best-engineering-college-in-${link.slug}/`}
              className="city-link-card"
              aria-label={`Best engineering college in ${link.displayName} — ${link.distanceLabel} from JKKNCET`}
            >
              <span className="city-link-emoji" aria-hidden="true">
                <MapPin size={20} />
              </span>
              <span className="city-link-name">{link.displayName}</span>
              <span className="city-link-dist">{link.distanceLabel}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
