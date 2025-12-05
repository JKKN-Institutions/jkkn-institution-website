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

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Academics', href: '/academics' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Campus Life', href: '/campus-life' },
  { label: 'Research', href: '/academics/research' },
  { label: 'Careers', href: '/careers' },
]

const programLinks = [
  { label: 'Engineering', href: '/academics/programs/engineering' },
  { label: 'Medical Sciences', href: '/academics/programs/medical' },
  { label: 'Arts & Science', href: '/academics/programs/arts-science' },
  { label: 'Pharmacy', href: '/academics/programs/pharmacy' },
  { label: 'Management', href: '/academics/programs/management' },
  { label: 'Allied Health', href: '/academics/programs/allied-health' },
]

const resourceLinks = [
  { label: 'Student Portal', href: '/portal' },
  { label: 'Library', href: '/resources/library' },
  { label: 'Downloads', href: '/resources/downloads' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Admin Login', href: '/admin' },
]

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/jkkn', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/jkkn', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/jkkn', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/jkkn', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/jkkn', label: 'YouTube' },
]

export function SiteFooter() {
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
                <p className="text-xl font-bold">JKKN Institution</p>
                <p className="text-xs text-white/70 font-medium tracking-wider uppercase">
                  Excellence in Education
                </p>
              </div>
            </Link>
            <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-md">
              JKKN Group of Institutions is committed to providing quality education and
              fostering innovation, research, and holistic development of students to prepare
              them for global challenges.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <a
                href="tel:+914222661100"
                className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group"
              >
                <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-secondary/30 transition-colors">
                  <Phone className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-sm">+91 422 266 1100</span>
              </a>
              <a
                href="mailto:info@jkkn.ac.in"
                className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group"
              >
                <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-secondary/30 transition-colors">
                  <Mail className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-sm">info@jkkn.ac.in</span>
              </a>
              <div className="flex items-start gap-4 text-white/80">
                <div className="p-2.5 rounded-xl bg-white/10 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-sm">
                  JKKN Group of Institutions,<br />
                  Komarapalayam, Namakkal District,<br />
                  Tamil Nadu - 638183
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-secondary rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-all duration-300 group"
                  >
                    <ChevronRight className="h-4 w-4 text-secondary opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-secondary rounded-full" />
              Programs
            </h4>
            <ul className="space-y-3">
              {programLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-all duration-300 group"
                  >
                    <ChevronRight className="h-4 w-4 text-secondary opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-secondary rounded-full" />
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-all duration-300 group"
                  >
                    <ChevronRight className="h-4 w-4 text-secondary opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-white/70 text-center md:text-left" suppressHydrationWarning>
              © {new Date().getFullYear()} JKKN Group of Institutions. All rights reserved.
            </p>

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
