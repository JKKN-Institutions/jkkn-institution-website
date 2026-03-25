// components/city-pages/city-how-to-reach.tsx
// Server Component — props: cityConfig

import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityHowToReachProps {
  cityConfig: CityPageConfig
}

export default function CityHowToReach({ cityConfig }: CityHowToReachProps) {
  const { reachHeadline, reachSummary, transport } = cityConfig

  const items = [
    { icon: '🛣️', label: 'Route', value: transport.routeDescription },
    { icon: '🚌', label: 'By Bus', value: transport.busTerminal },
    { icon: '🚂', label: 'Nearest Railway Station', value: transport.nearestRailway },
    { icon: '✈️', label: 'Nearest Airport', value: transport.nearestAirport },
    { icon: '🏫', label: 'Campus Address', value: transport.campusAddress },
  ] as const

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-poppins text-3xl font-bold text-gray-900 text-center mb-2">
          {reachHeadline}
        </h2>
        <p className="text-center text-gray-500 text-base mb-3 max-w-2xl mx-auto">
          {reachSummary}
        </p>
        <span className="block w-12 h-1 bg-secondary rounded mx-auto mt-3 mb-8" aria-hidden="true" />

        <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-3xl mx-auto">
          {/* Card header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 flex items-center gap-4">
            <span className="text-3xl" aria-hidden="true">
              📍
            </span>
            <div>
              <h3 className="font-poppins text-xl font-bold">Getting Here</h3>
              <p className="text-sm opacity-85">
                Multiple ways to reach JKKN College of Engineering and Technology
              </p>
            </div>
          </div>

          {/* Transport items */}
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 px-7 py-4 border-b border-gray-100 last:border-0"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                <span aria-hidden="true">{item.icon}</span>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                  {item.label}
                </div>
                <div className="text-sm font-medium text-gray-900">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Maps CTA */}
        <div className="text-center mt-6">
          <a
            href={transport.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors text-sm"
            aria-label="Open JKKNCET location in Google Maps"
          >
            <span aria-hidden="true">📍</span>
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}
