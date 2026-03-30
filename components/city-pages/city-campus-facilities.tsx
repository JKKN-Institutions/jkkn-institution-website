// components/city-pages/city-campus-facilities.tsx
// Server Component — no props (same for all cities)

import {
  Microscope,
  BookOpen,
  Home,
  Bus,
  Trophy,
  Wifi,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Facility {
  icon: LucideIcon
  title: string
  desc: string
}

const FACILITIES: Facility[] = [
  {
    icon: Microscope,
    title: 'Modern Labs',
    desc: 'State-of-the-art laboratories and smart classrooms',
  },
  {
    icon: BookOpen,
    title: 'Digital Library',
    desc: 'Well-stocked library with digital access and journals',
  },
  {
    icon: Home,
    title: 'Hostel',
    desc: 'Separate hostels for boys and girls with mess facility',
  },
  {
    icon: Bus,
    title: 'Transport',
    desc: 'College buses connecting to surrounding areas',
  },
  {
    icon: Trophy,
    title: 'Sports',
    desc: 'Playground, indoor games, gym, and annual sports events',
  },
  {
    icon: Wifi,
    title: 'WiFi Campus',
    desc: 'High-speed internet across the entire campus',
  },
]

export default function CityCampusFacilities() {
  return (
    <section className="section bg-white">
      <div className="section-inner">
        <h2 className="section-title">Campus &amp; Facilities</h2>
        <p className="section-subtitle">
          Everything you need for a world-class education experience
        </p>
        <span className="section-accent" aria-hidden="true" />
        <div className="section-spacer" />

        <div className="facilities-grid">
          {FACILITIES.map((facility) => (
            <div key={facility.title} className="facility-item">
              <div className="facility-icon" aria-hidden="true">
                <facility.icon size={22} />
              </div>
              <div>
                <h4>{facility.title}</h4>
                <p>{facility.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
