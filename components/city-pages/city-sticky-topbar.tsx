'use client'

import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityStickyTopbarProps {
  cityConfig: CityPageConfig
}

export function CityStickyTopbar({ cityConfig }: CityStickyTopbarProps) {
  const waUrl = `https://wa.me/919345855001?text=${encodeURIComponent(cityConfig.whatsappMessage)}`

  return (
    <div className="bg-primary/90 text-white flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium sticky top-0 z-50 flex-wrap">
      <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full inline-block" aria-hidden="true" />
      <span className="text-sm font-semibold">Admissions Open 2026-27</span>
      <a
        href="tel:+919345855001"
        className="text-white bg-white/15 px-3.5 py-1 rounded-full font-semibold text-xs hover:bg-white/25 transition-colors"
      >
        Call Now
      </a>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white bg-[#25d366] px-3.5 py-1 rounded-full font-semibold text-xs hover:bg-[#1ebe5d] transition-colors"
      >
        WhatsApp
      </a>
    </div>
  )
}
