'use client'

import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityHeroSectionProps {
  cityConfig: CityPageConfig
}

function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.573-1.463A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.239 0-4.308-.724-5.993-1.953l-.422-.302-2.734.874.9-2.681-.332-.442A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
    </svg>
  )
}

export function CityHeroSection({ cityConfig }: CityHeroSectionProps) {
  const waUrl = `https://wa.me/919345855001?text=${encodeURIComponent(cityConfig.whatsappMessage)}`

  const stats = [
    { num: cityConfig.heroStats.placements, label: 'Placements' },
    { num: cityConfig.heroStats.lpaHighest, label: 'LPA Highest' },
    { num: cityConfig.heroStats.distanceStat, label: cityConfig.heroStats.distanceLabel },
    { num: cityConfig.heroStats.programmes, label: 'Programmes' },
  ]

  return (
    <header className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-14 px-5 text-center relative overflow-hidden">
      {/* Decorative radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,222,89,0.08) 0%, transparent 50%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-white/12 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full text-xs font-semibold tracking-wide mb-6">
          ⚙️ AICTE, NBA, NAAC Approved · Admissions Open
        </div>

        {/* H1 */}
        <h1 className="font-poppins text-4xl sm:text-5xl font-extrabold leading-tight mb-3">
          Best Engineering College Near{' '}
          <span
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundImage: 'linear-gradient(90deg, #ffde59, #e6c64d)',
            }}
          >
            {cityConfig.displayName}
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
          {cityConfig.heroSubheading}
        </p>

        {/* Stats row */}
        <div className="flex justify-center gap-4 mb-9 flex-wrap">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-6 py-4 min-w-[120px]"
            >
              <span className="block font-poppins text-3xl font-extrabold leading-none">
                {stat.num}
              </span>
              <span className="text-xs opacity-75 uppercase tracking-wider mt-1.5 block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex justify-center gap-3.5 flex-wrap">
          <a
            href="https://engg.jkkn.ac.in/admission/"
            className="inline-flex items-center gap-2 bg-secondary text-gray-900 font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            Apply Now — 2026-27
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25d366] text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <WhatsAppIcon />
            WhatsApp Us
          </a>
        </div>
      </div>
    </header>
  )
}
