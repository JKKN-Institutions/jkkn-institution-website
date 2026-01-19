'use client'

import Link from 'next/link'
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronRight,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FooterSettings } from '@/app/actions/cms/footer'
import { LazyFooterMap } from './footer-map-lazy'

interface SiteFooterProps {
  settings?: FooterSettings
}

// Icon mapping for social media
const socialIconMap = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
}

export function SiteFooter({ settings }: SiteFooterProps) {
  if (!settings) return null

  // Filter visible links
  const visibleInstitutions = settings.institutions.filter(link => link.visible)

  // Build social links array
  const socialLinks = Object.entries(settings.socialLinks || {})
    .filter(([_, url]) => url)
    .map(([platform, url]) => ({
      icon: socialIconMap[platform as keyof typeof socialIconMap],
      href: url as string,
      label: platform.charAt(0).toUpperCase() + platform.slice(1)
    }))
  return (
    <footer className="relative bg-gradient-to-br from-primary via-primary to-emerald-700 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* About Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className={cn(
                'relative w-12 h-12 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105',
                'bg-gradient-to-r from-secondary to-yellow-400',
                'shadow-lg shadow-secondary/30'
              )}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-gray-900" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold">JKKN Institutions</p>
                <p className="text-xs text-white/70 font-medium tracking-wider uppercase">
                  {settings.tagline || 'Excellence in Education'}
                </p>
              </div>
            </Link>
            <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-md">
              {settings.description || 'JKKN Institutions is committed to providing quality education and fostering innovation, research, and holistic development of students to prepare them for global challenges.'}
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <a
                href={`tel:${(settings.contactPhone || '+91 93458 55001').replace(/\s/g, '')}`}
                className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group"
              >
                <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-secondary/30 transition-colors">
                  <Phone className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-sm">{settings.contactPhone || '+91 93458 55001'}</span>
              </a>
              <a
                href={`mailto:${settings.contactEmail || 'info@jkkn.ac.in'}`}
                className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group"
              >
                <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-secondary/30 transition-colors">
                  <Mail className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-sm">{settings.contactEmail || 'info@jkkn.ac.in'}</span>
              </a>
              <div className="flex items-start gap-4 text-white/80">
                <div className="p-2.5 rounded-xl bg-white/10 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-sm">
                  {settings.address ? (
                    <>
                      {settings.address.line1}<br />
                      {settings.address.line2 && <>{settings.address.line2}<br /></>}
                      {settings.address.city}<br />
                      {settings.address.state} - {settings.address.pincode}
                    </>
                  ) : (
                    <>
                      Natarajapuram, NH-544<br />
                      (Salem To Coimbatore National Highway),<br />
                      Kumarapalayam (TK), Namakkal (DT).<br />
                      Tamil Nadu - 638183
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Our Institutions */}
          <div>
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-secondary rounded-full" />
              Our Institutions
            </h2>
            <ul className="space-y-3">
              {visibleInstitutions.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-all duration-300 group"
                  >
                    <ChevronRight className="h-4 w-4 text-secondary opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Map */}
          <div className="lg:col-span-2" id="footer-map-section">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-secondary rounded-full" />
              Our Location
            </h2>
            <LazyFooterMap
              embedUrl={
                settings.map?.embedUrl ||
                'https://www.google.com/maps?q=JKKN+Educational+Institutions,Komarapalayam,Tamil+Nadu,India&output=embed'
              }
              linkUrl={
                settings.map?.linkUrl ||
                'https://www.google.com/maps/place/JKKN+Educational+Institutions/@11.26611,77.58373,17z'
              }
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-6 pb-24 lg:pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-sm text-white/70 text-center md:text-left">
              <p suppressHydrationWarning>
                © {new Date().getFullYear()} JKKN Institutions. All rights reserved.
              </p>
              <span className="hidden md:inline text-white/30">|</span>
              <Link
                href="/admin"
                className="hover:text-secondary transition-colors"
              >
                Admin
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-secondary hover:border-secondary hover:text-gray-900 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
