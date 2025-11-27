'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
  GraduationCap,
  Sparkles,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  href: string
  is_homepage?: boolean
  children?: NavItem[]
}

interface SiteHeaderProps {
  navigation?: NavItem[]
}

// Fallback navigation when CMS is empty
const fallbackNavigation: NavItem[] = [
  { id: 'home', label: 'Home', href: '/', is_homepage: true },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'academics', label: 'Academics', href: '/academics' },
  { id: 'admissions', label: 'Admissions', href: '/admissions' },
  { id: 'contact', label: 'Contact', href: '/contact' },
]

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/jkkn', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/jkkn', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/jkkn', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/jkkn', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/jkkn', label: 'YouTube' },
]

export function SiteHeader({ navigation }: SiteHeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Use CMS navigation if available, otherwise fallback
  const mainNavigation = navigation && navigation.length > 0 ? navigation : fallbackNavigation

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
      {/* Fixed Full Width Navigation */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-100'
            : 'bg-white/80 backdrop-blur-md'
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative z-10">
              <div className={cn(
                'relative w-11 h-11 lg:w-12 lg:h-12 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105',
                'bg-gradient-to-br from-primary via-primary to-emerald-600',
                'shadow-lg shadow-primary/30'
              )}>
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <p className="text-lg lg:text-xl font-bold text-gray-900 tracking-tight">
                  JKKN Institution
                </p>
                <p className="text-[10px] lg:text-xs text-gray-500 font-medium tracking-widest uppercase">
                  Excellence in Education
                </p>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {mainNavigation.map((item) => (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => item.children && item.children.length > 0 && setOpenDropdown(item.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300',
                      isActive(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    )}
                  >
                    {item.label}
                    {item.children && item.children.length > 0 && (
                      <ChevronDown className={cn(
                        'h-3.5 w-3.5 transition-transform duration-300',
                        openDropdown === item.id && 'rotate-180'
                      )} />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.children && item.children.length > 0 && openDropdown === item.id && (
                    <div className="absolute top-full left-0 mt-2 w-60 origin-top animate-in fade-in zoom-in-95 duration-200">
                      <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 py-2 overflow-hidden">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            className={cn(
                              'block px-4 py-3 text-sm transition-all duration-200',
                              isActive(child.href)
                                ? 'text-primary bg-primary/10'
                                : 'text-gray-700 hover:text-primary hover:bg-gray-50 hover:pl-6'
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                Staff Login
              </Link>
              <Link
                href="/admissions/apply"
                className={cn(
                  'group relative px-6 py-2.5 rounded-xl font-semibold text-sm overflow-hidden transition-all duration-300',
                  'bg-gradient-to-r from-secondary via-yellow-400 to-secondary bg-[length:200%_100%]',
                  'text-gray-900 shadow-lg shadow-secondary/30',
                  'hover:bg-[100%_0] hover:shadow-xl hover:shadow-secondary/40 hover:scale-105'
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Apply Now
                  <Sparkles className="w-4 h-4" />
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'lg:hidden relative z-10 p-2.5 rounded-xl transition-all duration-300',
                isMobileMenuOpen
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              )}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                <span className={cn(
                  'absolute left-0 w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300',
                  isMobileMenuOpen ? 'top-[11px] rotate-45' : 'top-1'
                )} />
                <span className={cn(
                  'absolute left-0 top-[11px] w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300',
                  isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
                )} />
                <span className={cn(
                  'absolute left-0 w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300',
                  isMobileMenuOpen ? 'top-[11px] -rotate-45' : 'top-[21px]'
                )} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen */}
      <div className={cn(
        'fixed inset-0 z-40 lg:hidden transition-all duration-500',
        isMobileMenuOpen ? 'visible' : 'invisible'
      )}>
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/10 backdrop-blur-sm transition-opacity duration-500',
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div className={cn(
          'absolute top-20 left-4 right-4 bottom-4 transition-all duration-500',
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        )}>
          <div className="h-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <nav className="space-y-1">
                {mainNavigation.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-in slide-in-from-left duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item.children && item.children.length > 0 ? (
                      <div>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                          className={cn(
                            'w-full flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-300',
                            isActive(item.href)
                              ? 'text-primary bg-primary/10'
                              : 'text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          {item.label}
                          <ChevronDown className={cn(
                            'h-5 w-5 transition-transform duration-300',
                            openDropdown === item.id && 'rotate-180'
                          )} />
                        </button>
                        <div className={cn(
                          'overflow-hidden transition-all duration-300',
                          openDropdown === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        )}>
                          <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-4">
                            {item.children.map((child) => (
                              <Link
                                key={child.id}
                                href={child.href}
                                className={cn(
                                  'block px-4 py-2.5 text-sm rounded-lg transition-all duration-200',
                                  isActive(child.href)
                                    ? 'text-primary bg-primary/10'
                                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                                )}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'block px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-300',
                          isActive(item.href)
                            ? 'text-primary bg-primary/10'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="mt-8 space-y-3">
                <Link
                  href="/admissions/apply"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-secondary via-yellow-400 to-secondary bg-[length:200%_100%] text-gray-900 font-semibold rounded-xl shadow-lg shadow-secondary/30 hover:bg-[100%_0] transition-all duration-300"
                >
                  Apply Now
                  <Sparkles className="w-4 h-4" />
                </Link>
                <Link
                  href="/admin"
                  className="block w-full px-6 py-3.5 border-2 border-gray-200 text-gray-700 font-medium rounded-xl text-center hover:border-primary hover:text-primary transition-all duration-300"
                >
                  Staff Login
                </Link>
              </div>
            </div>

            {/* Mobile Contact Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50/50">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <a href="tel:+914222661100" className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  +91 422 266 1100
                </a>
                <a href="mailto:info@jkkn.ac.in" className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  info@jkkn.ac.in
                </a>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-gray-100 rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
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

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  )
}
