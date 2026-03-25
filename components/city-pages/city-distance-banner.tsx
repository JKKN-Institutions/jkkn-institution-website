// components/city-pages/city-distance-banner.tsx
// Server Component — props: cityConfig

import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityDistanceBannerProps {
  cityConfig: CityPageConfig
}

function MapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export default function CityDistanceBanner({ cityConfig }: CityDistanceBannerProps) {
  const { distanceKm, travelTime, transport } = cityConfig

  return (
    <div className="pt-5 px-4">
      <div className="bg-white rounded-2xl shadow-md max-w-2xl mx-auto flex items-center overflow-hidden">
        {/* Distance info */}
        <div className="flex-1 flex items-center gap-5 px-7 py-6">
          <div className="font-poppins text-5xl font-extrabold text-primary leading-none">
            {distanceKm}
            <small className="text-base font-semibold">km</small>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              From {cityConfig.displayName} to JKKNCET
            </h3>
            <p className="text-sm text-gray-500">
              {travelTime} via {transport.routeDescription}
            </p>
          </div>
        </div>

        {/* CTA */}
        <a
          href={transport.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-white px-7 py-6 flex flex-col items-center justify-center gap-1 min-w-[140px] text-center text-sm font-semibold hover:bg-primary/90 transition-colors"
          aria-label={`View JKKNCET on Google Maps from ${cityConfig.displayName}`}
        >
          <MapIcon />
          View on Map
        </a>
      </div>
    </div>
  )
}
