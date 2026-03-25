// components/city-pages/city-why-choose-grid.tsx
// Server Component — props: cityConfig

import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityWhyChooseGridProps {
  cityConfig: CityPageConfig
}

export default function CityWhyChooseGrid({ cityConfig }: CityWhyChooseGridProps) {
  const uspCards = [
    {
      icon: '✅',
      title: 'AICTE + NBA',
      desc: 'AICTE-approved engineering college with Anna University affiliation and NBA accreditation',
    },
    {
      icon: '💻',
      title: 'In-Demand Branches',
      desc: 'Multiple B.E. programmes covering in-demand engineering disciplines',
    },
    {
      icon: '🔬',
      title: 'Modern Labs',
      desc: 'Computer labs, electronics labs, mechanical workshops, CAD/CAM labs',
    },
    {
      icon: '🤝',
      title: 'Industry Connect',
      desc: 'Industry partnerships, internship programmes, and hackathon culture',
    },
    {
      icon: '🏆',
      title: 'Quality Standards',
      desc: 'NBA accredited departments ensuring quality education standards',
    },
    {
      icon: '🚌',
      title: 'Easy Commute',
      desc: `Just ${cityConfig.distanceKm} from ${cityConfig.displayName}. Daily commute or comfortable hostel — your choice.`,
    },
  ]

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-poppins text-3xl font-bold text-gray-900 text-center mb-2">
          {cityConfig.whyChooseHeadline}
        </h2>
        <p className="text-center text-gray-500 text-base mb-3 max-w-2xl mx-auto">
          {cityConfig.whyChooseSubtitle}
        </p>
        <span className="block w-12 h-1 bg-secondary rounded mx-auto mt-3 mb-6" aria-hidden="true" />

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {uspCards.map((card) => (
            <div
              key={card.title}
              className="bg-background rounded-2xl p-7 text-center transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/70 hover:bg-white border border-transparent"
            >
              <div className="text-3xl mb-3" aria-hidden="true">
                {card.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{card.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
