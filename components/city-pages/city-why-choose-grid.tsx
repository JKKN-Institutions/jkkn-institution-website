// components/city-pages/city-why-choose-grid.tsx
// Server Component — props: cityConfig

import {
  ShieldCheck,
  Laptop,
  Microscope,
  Handshake,
  Trophy,
  Bus,
} from 'lucide-react'
import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityWhyChooseGridProps {
  cityConfig: CityPageConfig
}

export default function CityWhyChooseGrid({ cityConfig }: CityWhyChooseGridProps) {
  const uspCards = [
    {
      icon: ShieldCheck,
      title: 'AICTE + NBA',
      desc: 'AICTE-approved engineering college with Anna University affiliation and NBA accreditation',
    },
    {
      icon: Laptop,
      title: 'In-Demand Branches',
      desc: 'Multiple B.E. programmes covering in-demand engineering disciplines',
    },
    {
      icon: Microscope,
      title: 'Modern Labs',
      desc: 'Computer labs, electronics labs, mechanical workshops, CAD/CAM labs',
    },
    {
      icon: Handshake,
      title: 'Industry Connect',
      desc: 'Industry partnerships, internship programmes, and hackathon culture',
    },
    {
      icon: Trophy,
      title: 'Quality Standards',
      desc: 'NBA accredited departments ensuring quality education standards',
    },
    {
      icon: Bus,
      title: 'Easy Commute',
      desc: `Just ${cityConfig.distanceKm} from ${cityConfig.displayName}. Daily commute or comfortable hostel — your choice.`,
    },
  ]

  return (
    <section className="section bg-white">
      <div className="section-inner">
        <h2 className="section-title">{cityConfig.whyChooseHeadline}</h2>
        <p className="section-subtitle">{cityConfig.whyChooseSubtitle}</p>
        <span className="section-accent" aria-hidden="true" />
        <div className="section-spacer" />

        <div className="usp-grid">
          {uspCards.map((card) => (
            <div key={card.title} className="usp-card">
              <div className="usp-icon" aria-hidden="true">
                <card.icon size={28} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
