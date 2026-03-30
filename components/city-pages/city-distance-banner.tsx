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
    <div className="distance-wrap">
      <div className="distance-banner">
        <div className="distance-main">
          <div className="distance-num">
            {distanceKm}
            <small>km</small>
          </div>
          <div className="distance-text">
            <h3>From {cityConfig.displayName} to JKKNCET</h3>
            <p>
              {travelTime} via {transport.routeDescription}
            </p>
          </div>
        </div>

        <a
          href={transport.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="distance-cta"
          aria-label={`View JKKNCET on Google Maps from ${cityConfig.displayName}`}
        >
          <MapIcon />
          View on Map
        </a>
      </div>
    </div>
  )
}
