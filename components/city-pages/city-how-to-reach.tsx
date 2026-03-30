// components/city-pages/city-how-to-reach.tsx
// Server Component — props: cityConfig

import {
  MapPin,
  Route,
  Bus,
  TrainFront,
  Plane,
  School,
} from 'lucide-react'
import type { CityPageConfig } from '@/lib/config/city-pages'
import type { LucideIcon } from 'lucide-react'

interface CityHowToReachProps {
  cityConfig: CityPageConfig
}

export default function CityHowToReach({ cityConfig }: CityHowToReachProps) {
  const { reachHeadline, reachSummary, transport } = cityConfig

  const items: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Route, label: 'Route', value: transport.routeDescription },
    { icon: Bus, label: 'By Bus', value: transport.busTerminal },
    { icon: TrainFront, label: 'Nearest Railway Station', value: transport.nearestRailway },
    { icon: Plane, label: 'Nearest Airport', value: transport.nearestAirport },
    { icon: School, label: 'Campus Address', value: transport.campusAddress },
  ]

  return (
    <section className="section">
      <div className="section-inner">
        <h2 className="section-title">{reachHeadline}</h2>
        <p className="section-subtitle">{reachSummary}</p>
        <span className="section-accent" aria-hidden="true" />
        <div className="section-spacer" />

        <div className="reach-card">
          {/* Card header */}
          <div className="reach-header">
            <div className="reach-header-icon" aria-hidden="true">
              <MapPin size={28} />
            </div>
            <div>
              <h3>Getting Here</h3>
              <p>Multiple ways to reach JKKN College of Engineering and Technology</p>
            </div>
          </div>

          {/* Transport items */}
          <div className="reach-items">
            {items.map((item) => (
              <div key={item.label} className="reach-item">
                <div className="reach-item-icon" aria-hidden="true">
                  <item.icon size={20} />
                </div>
                <div>
                  <div className="reach-item-label">{item.label}</div>
                  <div className="reach-item-value">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Maps CTA */}
        <div className="reach-map-cta">
          <a
            href={transport.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent"
            aria-label="Open JKKNCET location in Google Maps"
          >
            <MapPin size={16} /> Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}
