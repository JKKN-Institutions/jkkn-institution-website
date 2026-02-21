'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { throttleRAF as rafThrottledScroll } from '@/lib/utils/dom-performance'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
// chunkArray removed - navigation now uses flex-wrap instead of fixed row chunking
import { NavDropdownItem } from './nav-dropdown-item'
import { NavMobileItem } from './nav-mobile-item'
import {
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  href: string
  is_homepage: boolean
  external_url?: string | null
  children?: NavItem[]
}

export interface ContactInfo {
  phone: string | null
  email: string | null
}

export interface SocialLink {
  platform: string
  url: string
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
  /** Logo URL (from database or fallback) */
  logoUrl?: string
  /** Logo alt text (institution name) */
  logoAltText?: string
  /** Contact information */
  contactInfo?: ContactInfo
  /** Social media links */
  socialLinks?: SocialLink[]
}

// Helper to map platform name to Lucide icon
const getSocialIcon = (platform: string) => {
  const iconMap: Record<string, typeof Facebook> = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
  }
  return iconMap[platform.toLowerCase()] || Globe
}

// Logo size helper
const getLogoSize = (logoSizes: SiteHeaderProps['logoSizes'] = {}): number => {
  return logoSizes.desktop || 110
}

// Navigation Row component removed - using flex-wrap layout instead

// Fallback navigation when CMS is empty
const fallbackNavigation: NavItem[] = [
  { id: 'home', label: 'Home', href: '/', is_homepage: true },
  { id: 'about', label: 'About', href: '/about', is_homepage: false },
  { id: 'academics', label: 'Academics', href: '/academics', is_homepage: false },
  { id: 'admissions', label: 'Admissions', href: '/admissions', is_homepage: false },
  { id: 'blog', label: 'Blog', href: '/blog', is_homepage: false },
  { id: 'contact', label: 'Contact', href: '/contact', is_homepage: false },
  {
    id: 'more',
    label: 'More',
    href: '#',
    is_homepage: false,
    children: [
      { id: 'careers', label: 'Careers', href: '/careers', is_homepage: false },
      { id: 'events', label: 'Events', href: '/events', is_homepage: false },
      { id: 'gallery', label: 'Gallery', href: '/gallery', is_homepage: false },
      { id: 'news', label: 'News & Updates', href: '/news', is_homepage: false },
      { id: 'terms', label: 'Terms & Conditions', href: '/terms-and-conditions', is_homepage: false },
    ],
  },
]

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/myjkkn', label: 'Facebook' },
  { icon: Twitter, href: 'https://x.com/jkkninstitution', label: 'X' },
  { icon: Instagram, href: 'https://instagram.com/jkkninstitutions', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/school/jkkninstitutions/', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/@JKKNINSTITUTIONS', label: 'YouTube' },
]

export function SiteHeader({
  navigation,
  isPreview = false,
  logoSizes = {
    mobile: 56,
    tablet: 70,
    desktop: 110,
    desktopLarge: 130
  },
  logoUrl = '/images/logo.png',
  logoAltText = 'Institution Logo',
  contactInfo,
  socialLinks = []
}: SiteHeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdownPath, setOpenDropdownPath] = useState<string[]>([])
  const [headerHeight, setHeaderHeight] = useState(0)
  const headerRef = useRef<HTMLElement>(null)
  const hoverTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Use CMS navigation if available, otherwise fallback
  const mainNavigation = navigation && navigation.length > 0 ? navigation : fallbackNavigation

  // Utility: Check if a specific path is currently open
  const isPathOpen = useCallback((itemId: string, parentPath: string[] = []) => {
    const fullPath = [...parentPath, itemId]
    return openDropdownPath.slice(0, fullPath.length)
      .every((id, i) => id === fullPath[i])
  }, [openDropdownPath])

  // Utility: Toggle path (add or remove from path)
  const togglePath = useCallback((itemId: string, parentPath: string[] = []) => {
    const fullPath = [...parentPath, itemId]
    const isOpen = openDropdownPath.slice(0, fullPath.length)
      .every((id, i) => id === fullPath[i])

    if (isOpen) {
      // Close this level and all children
      setOpenDropdownPath(parentPath)
    } else {
      // Open this level
      setOpenDropdownPath(fullPath)
    }
  }, [openDropdownPath])

  // Measure header height dynamically for the spacer
  useEffect(() => {
    if (!headerRef.current || isPreview) return
    const observer = new ResizeObserver(([entry]) => {
      setHeaderHeight(entry.contentRect.height)
    })
    observer.observe(headerRef.current)
    return () => observer.disconnect()
  }, [isPreview])

  useEffect(() => {
    const handleScroll = rafThrottledScroll(() => {
      setIsScrolled(window.scrollY > 20)
    })
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      handleScroll.cancel()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setOpenDropdownPath([])
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
    return pathname === href || pathname.startsWith(href + '/')
  }

  const isActiveOrHasActiveChild = useCallback((item: NavItem): boolean => {
    // Check if this item is active
    if (isActive(item.href)) return true

    // Recursively check children
    if (item.children && item.children.length > 0) {
      return item.children.some(child => isActiveOrHasActiveChild(child))
    }

    return false
  }, [pathname])

  // Global hover coordinator to prevent multiple dropdowns from being open
  const handleDropdownHover = useCallback((itemId: string | null, parentPath: string[] = []) => {
    // Clear all existing timeouts
    hoverTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    hoverTimeoutsRef.current.clear()

    if (itemId) {
      // Set new path immediately for responsive feel
      const timeout = setTimeout(() => {
        setOpenDropdownPath([...parentPath, itemId])
      }, 50)
      hoverTimeoutsRef.current.set(itemId, timeout)
    } else {
      // Close all dropdowns after longer delay (gives user time to move mouse)
      const timeout = setTimeout(() => {
        setOpenDropdownPath([])
      }, 500)
      hoverTimeoutsRef.current.set('close', timeout)
    }
  }, [])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      hoverTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
      hoverTimeoutsRef.current.clear()
    }
  }, [])

  return (
    <>
      {/* Full Width Navigation - Fixed on live site, static in preview */}
      <header
        ref={headerRef}
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
          <div className="flex items-center justify-center lg:justify-start py-1 md:py-1.5 lg:py-3 max-w-full">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center group relative z-10">
              <div
                className="relative transition-transform duration-300 group-hover:scale-105"
                style={{
                  width: `clamp(${logoSizes.mobile}px, 8vw, ${getLogoSize(logoSizes)}px)`,
                  height: `clamp(${logoSizes.mobile}px, 8vw, ${getLogoSize(logoSizes)}px)`,
                }}
              >
                <Image
                  src={logoUrl}
                  alt={logoAltText}
                  fill
                  sizes={`(max-width: 640px) ${logoSizes.mobile}px, (max-width: 1024px) ${logoSizes.tablet}px, ${getLogoSize(logoSizes)}px`}
                  className="object-contain"
                  priority
                  fetchPriority="high"
                  quality={90}
                />
              </div>
            </Link>

            {/* Desktop Navigation - Flex wrap, fills remaining space */}
            <nav className="hidden lg:flex flex-wrap items-center justify-start gap-x-2 xl:gap-x-4 gap-y-1 flex-1 min-w-0 pl-8 lg:pl-10 xl:pl-12">
              {mainNavigation.map((item) => (
                <NavDropdownItem
                  key={item.id}
                  item={item}
                  level={0}
                  parentPath={[]}
                  onPathChange={setOpenDropdownPath}
                  onHover={handleDropdownHover}
                  pathname={pathname}
                  isActive={isActive}
                  isActiveOrHasActiveChild={isActiveOrHasActiveChild}
                  textSize="text-xs xl:text-sm"
                  openDropdownPath={openDropdownPath}
                />
              ))}
            </nav>

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
                  src={logoUrl}
                  alt={logoAltText}
                  fill
                  sizes="56px"
                  className="object-contain"
                  quality={90}
                  priority
                  fetchPriority="high"
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
                <NavMobileItem
                  key={item.id}
                  item={item}
                  level={0}
                  parentPath={[]}
                  onPathChange={setOpenDropdownPath}
                  onItemClick={() => setIsMobileMenuOpen(false)}
                  pathname={pathname}
                  isActive={isActive}
                  openDropdownPath={openDropdownPath}
                />
              ))}
            </nav>

            {/* Contact Info */}
            {(contactInfo?.phone || contactInfo?.email || socialLinks.length > 0) && (
              <div className="px-4 py-4 border-t border-gray-200 bg-white/50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Us</p>
                <div className="space-y-3">
                  {contactInfo?.phone && (
                    <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary transition-colors">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      {contactInfo.phone}
                    </a>
                  )}
                  {contactInfo?.email && (
                    <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary transition-colors">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      {contactInfo.email}
                    </a>
                  )}
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                    {socialLinks.map((social) => {
                      const Icon = getSocialIcon(social.platform)
                      return (
                        <a
                          key={social.platform}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-gray-100 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                          aria-label={social.platform}
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for fixed header - only needed on live site, not in preview */}
      {!isPreview && headerHeight > 0 && (
        <div style={{ height: headerHeight }} />
      )}
    </>
  )
}
