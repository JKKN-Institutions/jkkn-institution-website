// components/city-pages/city-footer.tsx
// Server Component — no props (hardcoded engineering site links)

import Link from 'next/link'

const QUICK_LINKS = [
  { label: 'Programmes', href: '/programmes/' },
  { label: 'Admissions', href: '/admission/' },
  { label: 'Placements', href: '/placements/' },
  { label: 'Campus Life', href: '/campus/' },
  { label: 'Fee Structure', href: '/fees/' },
  { label: 'Contact Us', href: '/contact/' },
] as const

const INSTITUTIONS = [
  { label: 'JKKN Group', href: 'https://jkkn.ac.in/' },
  { label: 'Dental College', href: 'https://dental.jkkn.ac.in/' },
  { label: 'Pharmacy College', href: 'https://pharmacy.jkkn.ac.in/' },
  { label: 'Nursing College', href: 'https://nursing.sresakthimayeil.jkkn.ac.in/' },
  { label: 'Engineering College', href: 'https://engg.jkkn.ac.in/' },
  { label: 'Arts & Science', href: 'https://cas.jkkn.ac.in/' },
] as const

export default function CityFooter() {
  return (
    <footer className="bg-primary/90 text-white/85 pt-12 pb-6 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 mb-8">
        {/* Column 1: College info */}
        <div>
          <h4 className="font-poppins text-base font-bold text-white mb-4">
            JKKN College of Engineering and Technology
          </h4>
          <p className="text-sm mb-2 leading-relaxed">
            AICTE Approved | NBA Accredited | Anna University Affiliated
          </p>
          <p className="text-sm mb-2 leading-relaxed">
            Natarajapuram, NH-544, Komarapalayam, Namakkal District, Tamil Nadu — 638183
          </p>
          <a
            href="https://engg.jkkn.ac.in/"
            className="text-white/75 hover:text-white transition-colors text-sm"
          >
            engg.jkkn.ac.in
          </a>
        </div>

        {/* Column 2: Quick links */}
        <div>
          <h4 className="font-poppins text-base font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 list-none">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/75 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: JKKN institutions */}
        <div>
          <h4 className="font-poppins text-base font-bold text-white mb-4">
            JKKN Institutions
          </h4>
          <ul className="space-y-2 list-none">
            {INSTITUTIONS.map((inst) => (
              <li key={inst.href}>
                <a
                  href={inst.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/75 hover:text-white transition-colors"
                >
                  {inst.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 pt-5 text-center text-xs opacity-60 max-w-5xl mx-auto">
        &copy; 2026 JKKN College of Engineering and Technology | Part of JKKN Institutions |
        All institution names follow the JKKN Official Name Registry | Page optimised for SEO,
        AEO, and GEO
      </div>
    </footer>
  )
}
