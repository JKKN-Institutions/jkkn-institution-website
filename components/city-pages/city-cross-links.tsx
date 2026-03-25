// components/city-pages/city-cross-links.tsx
// Server Component — props: cityConfig

import Link from 'next/link'
import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityCrossLinksProps {
  cityConfig: CityPageConfig
}

export default function CityCrossLinks({ cityConfig }: CityCrossLinksProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-poppins text-3xl font-bold text-gray-900 text-center mb-2">
          Nearby Cities We Serve
        </h2>
        <p className="text-center text-gray-500 text-base mb-3 max-w-2xl mx-auto">
          JKKNCET is well-connected to major cities in the region. Find information for
          your city below.
        </p>
        <span className="block w-12 h-1 bg-secondary rounded mx-auto mt-3 mb-8" aria-hidden="true" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 max-w-3xl mx-auto">
          {cityConfig.crossLinks.map((link) => (
            <Link
              key={link.slug}
              href={`/best-engineering-college-in-${link.slug}/`}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all"
              aria-label={`Best engineering college in ${link.displayName} — ${link.distanceLabel} from JKKNCET`}
            >
              <span className="text-2xl" aria-hidden="true">
                {link.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-gray-900 truncate">
                  {link.displayName}
                </div>
                <div className="text-xs text-gray-400">{link.distanceLabel}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all programmes CTA */}
        <div className="text-center mt-6">
          <Link
            href="/programmes/"
            className="inline-flex items-center gap-2 bg-secondary text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-secondary/80 transition-colors"
          >
            <span aria-hidden="true">📋</span>
            View All Programmes
          </Link>
        </div>
      </div>
    </section>
  )
}
