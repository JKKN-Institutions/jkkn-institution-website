'use client'

import { useState } from 'react'
import { Menu, X, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home', href: 'https://engg.jkkn.ac.in/' },
  { label: 'Programmes', href: '/programmes/' },
  { label: 'Admissions', href: '/admissions/engineering' },
  { label: 'Placements', href: '/placements/' },
  { label: 'Campus Life', href: '/campus/' },
  { label: 'Contact', href: '/contact/' },
] as const

export default function CityNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo / College Name */}
          <a
            href="https://engg.jkkn.ac.in/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-tight">JKKN Engineering</p>
              <p className="text-[10px] text-gray-500 leading-tight">Autonomous | NAAC A</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
            >
              Apply Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 border-t border-gray-100',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-t-0'
        )}
      >
        <div className="px-4 py-3 space-y-1 bg-white">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center mt-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
          >
            Apply Now
          </a>
        </div>
      </div>
    </nav>
  )
}
