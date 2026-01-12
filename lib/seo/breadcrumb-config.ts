/**
 * Breadcrumb Configuration
 * Static mapping of routes to breadcrumb trails
 */

import type { BreadcrumbConfig, BreadcrumbItem } from './types'

/**
 * Static breadcrumb configuration for known routes
 * Based on the site's navigation hierarchy
 */
export const BREADCRUMB_CONFIG: BreadcrumbConfig = {
  // Home
  '/': [{ name: 'Home', url: '/' }],

  // About Section
  '/about/our-trust': [
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about/our-trust' },
  ],
  '/about/vision-mission': [
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about/our-trust' },
    { name: 'Vision & Mission', url: '/about/vision-mission' },
  ],
  '/about/leadership': [
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about/our-trust' },
    { name: 'Leadership', url: '/about/leadership' },
  ],

  // Courses - Parent
  '/courses-offered': [
    { name: 'Home', url: '/' },
    { name: 'Courses Offered', url: '/courses-offered' },
  ],

  // Dental Courses
  '/courses-offered/dental-courses': [
    { name: 'Home', url: '/' },
    { name: 'Courses Offered', url: '/courses-offered' },
    { name: 'Dental Courses (BDS/MDS)', url: '/courses-offered/dental-courses' },
  ],

  // Pharmacy Courses
  '/courses-offered/pharmacy-courses': [
    { name: 'Home', url: '/' },
    { name: 'Courses Offered', url: '/courses-offered' },
    { name: 'Pharmacy Courses (B.Pharm/M.Pharm/Pharm.D)', url: '/courses-offered/pharmacy-courses' },
  ],

  // Engineering Courses
  '/courses-offered/engineering-courses': [
    { name: 'Home', url: '/' },
    { name: 'Courses Offered', url: '/courses-offered' },
    { name: 'Engineering Courses (B.E./B.Tech/MBA)', url: '/courses-offered/engineering-courses' },
  ],

  // Nursing Courses
  '/courses-offered/nursing-courses': [
    { name: 'Home', url: '/' },
    { name: 'Courses Offered', url: '/courses-offered' },
    { name: 'Nursing Courses (B.Sc/M.Sc Nursing)', url: '/courses-offered/nursing-courses' },
  ],

  // Allied Health Sciences Courses
  '/courses-offered/allied-health-sciences-courses': [
    { name: 'Home', url: '/' },
    { name: 'Courses Offered', url: '/courses-offered' },
    { name: 'Allied Health Sciences Courses', url: '/courses-offered/allied-health-sciences-courses' },
  ],

  // Arts & Science Courses
  '/courses-offered/arts-and-science-courses': [
    { name: 'Home', url: '/' },
    { name: 'Courses Offered', url: '/courses-offered' },
    { name: 'Arts & Science Courses', url: '/courses-offered/arts-and-science-courses' },
  ],

  // Education Courses
  '/courses-offered/education-courses': [
    { name: 'Home', url: '/' },
    { name: 'Courses Offered', url: '/courses-offered' },
    { name: 'Education Courses (B.Ed)', url: '/courses-offered/education-courses' },
  ],

  // Admissions
  '/admissions': [
    { name: 'Home', url: '/' },
    { name: 'Admissions 2026-27', url: '/admissions' },
  ],

  // Contact
  '/contact': [
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact' },
  ],

  // Facilities Section
  '/facilities': [
    { name: 'Home', url: '/' },
    { name: 'Facilities', url: '/facilities' },
  ],
  '/facilities/library': [
    { name: 'Home', url: '/' },
    { name: 'Facilities', url: '/facilities' },
    { name: 'Library', url: '/facilities/library' },
  ],
  '/facilities/hostel': [
    { name: 'Home', url: '/' },
    { name: 'Facilities', url: '/facilities' },
    { name: 'Hostel', url: '/facilities/hostel' },
  ],
  '/facilities/sports': [
    { name: 'Home', url: '/' },
    { name: 'Facilities', url: '/facilities' },
    { name: 'Sports', url: '/facilities/sports' },
  ],
  '/facilities/transportation': [
    { name: 'Home', url: '/' },
    { name: 'Facilities', url: '/facilities' },
    { name: 'Transportation', url: '/facilities/transportation' },
  ],

  // Blog
  '/blog': [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ],

  // Careers (under More)
  '/more/careers': [
    { name: 'Home', url: '/' },
    { name: 'More', url: '/more' },
    { name: 'Careers', url: '/more/careers' },
  ],

  // Our Colleges
  '/our-colleges': [
    { name: 'Home', url: '/' },
    { name: 'Our Colleges', url: '/our-colleges' },
  ],

  // Our Schools
  '/our-schools': [
    { name: 'Home', url: '/' },
    { name: 'Our Schools', url: '/our-schools' },
  ],

  // Events
  '/events': [
    { name: 'Home', url: '/' },
    { name: 'Events', url: '/events' },
  ],
}

/**
 * Get breadcrumbs for a given path
 * Falls back to auto-generated breadcrumbs if path not in config
 */
export function getBreadcrumbsForPath(path: string): BreadcrumbItem[] {
  // Normalize path (remove trailing slash except for root)
  const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '')

  // Check if we have a static config for this path
  if (BREADCRUMB_CONFIG[normalizedPath]) {
    return BREADCRUMB_CONFIG[normalizedPath]
  }

  // Auto-generate breadcrumbs from path
  return generateBreadcrumbsFromPath(normalizedPath)
}

/**
 * Auto-generate breadcrumbs from URL path
 * Used as fallback for paths not in static config
 */
function generateBreadcrumbsFromPath(path: string): BreadcrumbItem[] {
  if (path === '/' || path === '') {
    return [{ name: 'Home', url: '/' }]
  }

  const segments = path.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [{ name: 'Home', url: '/' }]

  let currentPath = ''

  for (const segment of segments) {
    currentPath += `/${segment}`
    const name = formatSegmentName(segment)
    breadcrumbs.push({ name, url: currentPath })
  }

  return breadcrumbs
}

/**
 * Format a URL segment into a readable name
 */
function formatSegmentName(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Check if a path has a static breadcrumb configuration
 */
export function hasStaticBreadcrumbs(path: string): boolean {
  const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '')
  return normalizedPath in BREADCRUMB_CONFIG
}
