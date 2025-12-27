'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  href: string
  is_homepage?: boolean
  external_url?: string | null
  children?: NavItem[]
}

interface SiteHeaderProps {
  navigation?: NavItem[]
  /** When true, header uses static positioning (for page builder preview) */
  isPreview?: boolean
  /** Logo sizes for different breakpoints (in pixels) */
  logoSizes?: {
    mobile?: number
    tablet?: number
    desktop?: number
    desktopLarge?: number
  }
}

// Fallback navigation when CMS is empty
const fallbackNavigation: NavItem[] = [
  { id: 'home', label: 'Home', href: '/', is_homepage: true },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'academics', label: 'Academics', href: '/academics' },
  { id: 'admissions', label: 'Admissions', href: '/admissions' },
  { id: 'blog', label: 'Blog', href: '/blog' },
  { id: 'contact', label: 'Contact', href: '/contact' },
  {
    id: 'more',
    label: 'More',
    href: '#',
    children: [
      { id: 'careers', label: 'Careers', href: '/careers' },
      { id: 'events', label: 'Events', href: '/events' },
      { id: 'gallery', label: 'Gallery', href: '/gallery' },
      { id: 'news', label: 'News & Updates', href: '/news' },
    ],
  },
]

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/jkkn', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/jkkn', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/jkkn', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/jkkn', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/jkkn', label: 'YouTube' },
]

export function SiteHeader({
  navigation,
  isPreview = false,
  logoSizes = {
    mobile: 64,
    tablet: 80,
    desktop: 80,
    desktopLarge: 96
  }
}: SiteHeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Use CMS navigation if available, otherwise fallback
  const mainNavigation = navigation && navigation.length > 0 ? navigation : fallbackNavigation

  // Calculate if we need 1 row or 2 rows (max 8 items in row 1, max 8 in row 2, strictly 2 rows max)
  const ROW1_MAX = 8
  const ROW2_MAX = 8
  const hasSecondRow = mainNavigation.length > ROW1_MAX
  const row1Items = mainNavigation.slice(0, ROW1_MAX)
  const row2Items = mainNavigation.slice(ROW1_MAX, ROW1_MAX + ROW2_MAX) // Limit to 2 rows only

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Full Width Navigation - Fixed on live site, static in preview */}
      <header
        className={cn(
          'z-50 transition-all duration-300',
          isPreview
            ? 'relative bg-[#faf8f0] border-b border-gray-200'
            : 'fixed top-0 left-0 right-0',
          !isPreview && (isScrolled
            ? 'bg-[#faf8f0] shadow-md'
            : 'bg-[#faf8f0]')
        )}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className={cn(
            'flex items-center h-16 sm:h-20 lg:h-24', // Fixed height prevents CLS
            // Mobile: center logo, Desktop: space-between for logo + nav
            'justify-center lg:justify-between'
          )}>
            {/* Logo - Centered on mobile, left-aligned on desktop */}
            <Link href="/" className={cn(
              'flex-shrink-0 flex items-center group relative z-10',
              // Mobile: no width constraint (centered), Desktop: fixed width
              hasSecondRow ? 'lg:w-[20%]' : 'lg:w-[15%]'
            )}>
              <div
                className="relative transition-transform duration-300 group-hover:scale-105"
                style={{
                  width: `clamp(${logoSizes.mobile}px, 10vw, ${hasSecondRow ? logoSizes.desktopLarge : logoSizes.desktop}px)`,
                  height: `clamp(${logoSizes.mobile}px, 10vw, ${hasSecondRow ? logoSizes.desktopLarge : logoSizes.desktop}px)`,
                }}
              >
                <Image
                  src="/images/logo.png"
                  alt="JKKN Institution Logo"
                  fill
                  sizes={`(max-width: 640px) ${logoSizes.mobile}px, (max-width: 1024px) ${logoSizes.tablet}px, ${hasSecondRow ? logoSizes.desktopLarge : logoSizes.desktop}px`}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation - Adjusts width based on single/double row */}
            <div className={cn(
              'hidden lg:flex flex-col justify-center py-1',
              hasSecondRow ? 'w-[80%]' : 'w-[85%]'
            )}>
              {/* Row 1 - First 7 menu items + Search */}
              <div className="flex items-center">
                <nav className="flex-1 flex items-center justify-start gap-1 lg:gap-2 xl:gap-4">
                  {row1Items.map((item) => (
                    <div
                      key={item.id}
                      className="relative group"
                      onMouseEnter={() => item.children && item.children.length > 0 && setOpenDropdown(item.id)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {item.children && item.children.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                          className={cn(
                            'flex items-center gap-1 px-1 xl:px-2 py-2 text-xs xl:text-sm font-bold uppercase tracking-wide transition-all duration-200 whitespace-nowrap border-b-2',
                            openDropdown === item.id
                              ? 'text-primary border-primary'
                              : 'text-gray-800 hover:text-primary border-transparent hover:border-primary'
                          )}
                        >
                          {item.label}
                          <ChevronDown className={cn(
                            'h-3 w-3 transition-transform duration-200',
                            openDropdown === item.id && 'rotate-180'
                          )} />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-1 px-1 xl:px-2 py-2 text-xs xl:text-sm font-bold uppercase tracking-wide transition-all duration-200 whitespace-nowrap border-b-2',
                            isActive(item.href)
                              ? 'text-primary border-primary'
                              : 'text-gray-800 hover:text-primary border-transparent hover:border-primary'
                          )}
                        >
                          {item.label}
                        </Link>
                      )}

                      {/* Dropdown */}
                      {item.children && item.children.length > 0 && openDropdown === item.id && (
                        <div className="absolute top-full left-0 pt-1 w-72 origin-top animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                          <div className="bg-white rounded-lg shadow-lg shadow-black/10 border border-gray-100 py-1 overflow-hidden">
                            {item.children.map((child) =>
                              child.external_url ? (
                                <a
                                  key={child.id}
                                  href={child.external_url}
                                  className="block px-3 py-1.5 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-150"
                                >
                                  {child.label}
                                </a>
                              ) : (
                                <Link
                                  key={child.id}
                                  href={child.href}
                                  className={cn(
                                    'block px-3 py-1.5 text-sm transition-colors duration-150',
                                    isActive(child.href)
                                      ? 'text-primary bg-primary/5 font-medium'
                                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                  )}
                                >
                                  {child.label}
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Row 2 - Remaining menu items (max 7 more, strictly 2 rows only) */}
              {hasSecondRow && row2Items.length > 0 && (
              <nav className="flex items-center justify-start gap-1 lg:gap-2 xl:gap-4 mt-1">
                {row2Items.map((item) => (
                  <div
                    key={item.id}
                    className="relative group"
                    onMouseEnter={() => item.children && item.children.length > 0 && setOpenDropdown(item.id)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.children && item.children.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                        className={cn(
                          'flex items-center gap-1 px-1 xl:px-2 py-2 text-xs xl:text-sm font-bold uppercase tracking-wide transition-all duration-200 whitespace-nowrap border-b-2',
                          openDropdown === item.id
                            ? 'text-primary border-primary'
                            : 'text-gray-800 hover:text-primary border-transparent hover:border-primary'
                        )}
                      >
                        {item.label}
                        <ChevronDown className={cn(
                          'h-3 w-3 transition-transform duration-200',
                          openDropdown === item.id && 'rotate-180'
                        )} />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-1 px-1 xl:px-2 py-2 text-xs xl:text-sm font-bold uppercase tracking-wide transition-all duration-200 whitespace-nowrap border-b-2',
                          isActive(item.href)
                            ? 'text-primary border-primary'
                            : 'text-gray-800 hover:text-primary border-transparent hover:border-primary'
                        )}
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Dropdown */}
                    {item.children && item.children.length > 0 && openDropdown === item.id && (
                      <div className="absolute top-full left-0 pt-1 w-72 origin-top animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        <div className="bg-white rounded-lg shadow-lg shadow-black/10 border border-gray-100 py-1 overflow-hidden">
                          {item.children.map((child) =>
                            child.external_url ? (
                              <a
                                key={child.id}
                                href={child.external_url}
                                className="block px-3 py-1.5 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-150"
                              >
                                {child.label}
                              </a>
                            ) : (
                              <Link
                                key={child.id}
                                href={child.href}
                                className={cn(
                                  'block px-3 py-1.5 text-sm transition-colors duration-150',
                                  isActive(child.href)
                                    ? 'text-primary bg-primary/5 font-medium'
                                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                )}
                              >
                                {child.label}
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              )}
            </div>

            {/* Mobile Menu Button - Hidden on mobile (using bottom nav instead) */}
            {/* Keeping the component but hidden for potential tablet use */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'hidden', // Hidden completely - using bottom navigation on mobile
                isMobileMenuOpen
                  ? 'bg-primary/10'
                  : 'hover:bg-gray-100'
              )}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                <span className={cn(
                  'absolute left-0 w-6 h-0.5 bg-primary rounded-full transition-all duration-300',
                  isMobileMenuOpen ? 'top-[11px] rotate-45' : 'top-1'
                )} />
                <span className={cn(
                  'absolute left-0 top-[11px] w-6 h-0.5 bg-primary rounded-full transition-all duration-300',
                  isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
                )} />
                <span className={cn(
                  'absolute left-0 w-6 h-0.5 bg-primary rounded-full transition-all duration-300',
                  isMobileMenuOpen ? 'top-[11px] -rotate-45' : 'top-[21px]'
                )} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Slide from Right (Hidden - using bottom navigation instead) */}
      <div className={cn(
        'fixed inset-0 z-[100] hidden transition-all duration-300', // Hidden - bottom nav is used
        isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'
      )}>
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/40 transition-opacity duration-300',
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel - Slide from Right */}
        <div className={cn(
          'absolute top-0 right-0 h-full w-[85%] max-w-[320px] bg-[#faf8f0] shadow-2xl transition-transform duration-300 ease-out',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
          {/* Header with Logo and Close */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative w-14 h-14">
                <Image
                  src="/images/logo.png"
                  alt="JKKN Institution Logo"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Menu Content */}
          <div className="h-[calc(100%-80px)] overflow-y-auto">
            {/* Navigation Items */}
            <nav className="p-4">
              {mainNavigation.map((item) => (
                <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                  {item.children && item.children.length > 0 ? (
                    <div>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                        className={cn(
                          'w-full flex items-center justify-between py-3 text-sm font-semibold uppercase tracking-wide transition-colors',
                          isActive(item.href)
                            ? 'text-primary'
                            : 'text-gray-700 hover:text-primary'
                        )}
                      >
                        {item.label}
                        <ChevronDown className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          openDropdown === item.id && 'rotate-180'
                        )} />
                      </button>
                      <div className={cn(
                        'overflow-hidden transition-all duration-200',
                        openDropdown === item.id ? 'max-h-[500px] pb-2' : 'max-h-0'
                      )}>
                        <div className="pl-4 border-l-2 border-primary/30 ml-2 space-y-1">
                          {item.children.map((child) =>
                            child.external_url ? (
                              <a
                                key={child.id}
                                href={child.external_url}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                              >
                                {child.label}
                              </a>
                            ) : (
                              <Link
                                key={child.id}
                                href={child.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                  'block py-2 text-sm transition-colors',
                                  isActive(child.href)
                                    ? 'text-primary font-medium'
                                    : 'text-gray-600 hover:text-primary'
                                )}
                              >
                                {child.label}
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'block py-3 text-sm font-semibold uppercase tracking-wide transition-colors',
                        isActive(item.href)
                          ? 'text-primary'
                          : 'text-gray-700 hover:text-primary'
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Contact Info */}
            <div className="px-4 py-4 border-t border-gray-200 bg-white/50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Us</p>
              <div className="space-y-3">
                <a href="tel:+914222661100" className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  +91 422 266 1100
                </a>
                <a href="mailto:info@jkkn.ac.in" className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  info@jkkn.ac.in
                </a>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-gray-100 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header - only needed on live site, not in preview */}
      {/* Fixed height prevents CLS from dynamic height changes */}
      {!isPreview && (
        <div className="h-16 sm:h-20 lg:h-24" />
      )}
    </>
  )
}
