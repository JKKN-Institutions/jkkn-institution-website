import {
  Home,
  Info,
  GraduationCap,
  BookOpen,
  Mail,
  Calendar,
  Image,
  FileText,
  Users,
  Building,
  Phone,
  MapPin,
  Award,
  Newspaper,
  Video,
  CircleDot,
  // New icons for JKKN navigation
  School,
  MoreHorizontal,
  HandHeart,
  Landmark,
  Stethoscope,
  HeartPulse,
  Pill,
  Wrench,
  Palette,
  Heart,
  BookMarked,
  Bus,
  Ambulance,
  Bed,
  UtensilsCrossed,
  Building2,
  Theater,
  Presentation,
  Trophy,
  Wifi,
  Monitor,
  Briefcase,
  Shield
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Mapping of common navigation labels/slugs to Lucide icons
const CMS_ICON_MAP: Record<string, LucideIcon> = {
  // Home & About
  'home': Home,
  'about': Info,
  'about-us': Info,
  'aboutus': Info,

  // Admissions & Programs
  'admissions': GraduationCap,
  'admission': GraduationCap,
  'programs': BookOpen,
  'courses': BookOpen,
  'academics': BookOpen,

  // Contact
  'contact': Mail,
  'contact-us': Mail,
  'contactus': Mail,
  'reach-us': Phone,

  // Events & News
  'events': Calendar,
  'news': Newspaper,
  'announcements': Newspaper,
  'blog': FileText,

  // Media
  'gallery': Image,
  'photos': Image,
  'videos': Video,
  'media': Image,

  // People & Facilities
  'faculty': Users,
  'staff': Users,
  'team': Users,
  'facilities': Building,
  'campus': MapPin,

  // Achievements
  'awards': Award,
  'achievements': Award,
  'placements': Award,

  // ========================================
  // JKKN Institution-specific mappings
  // ========================================

  // Top-level navigation
  'our-colleges': GraduationCap,
  'our-schools': School,
  'courses-offered': BookOpen,
  'more': MoreHorizontal,

  // About section submenus
  'our-trust': HandHeart,
  'our-management': Users,
  'our-institutions': Landmark,

  // Colleges (by slug patterns)
  'college': GraduationCap,
  'colleges': GraduationCap,
  'dental': Stethoscope,
  'dental-college': Stethoscope,
  'jkkn-dental-college': Stethoscope,
  'pharmacy': Pill,
  'college-of-pharmacy': Pill,
  'jkkn-college-of-pharmacy': Pill,
  'engineering': Wrench,
  'college-of-engineering': Wrench,
  'jkkn-college-of-engineering': Wrench,
  'arts-and-science': Palette,
  'college-of-arts-and-science': Palette,
  'jkkn-college-of-arts-and-science': Palette,
  'nursing': Heart,
  'college-of-nursing': Heart,
  'jkkn-college-of-nursing': Heart,
  'allied-health-science': HeartPulse,
  'college-of-allied-health-science': HeartPulse,
  'jkkn-college-of-allied-health-science': HeartPulse,
  'education': BookMarked,
  'college-of-education': BookMarked,
  'jkkn-college-of-education': BookMarked,

  // Schools
  'school': School,
  'schools': School,
  'matriculation': School,
  'matriculation-higher-secondary-school': School,
  'jkkn-matriculation-higher-secondary-school': School,
  'vidhyalya': GraduationCap,
  'nattraja-vidhyalya': GraduationCap,

  // Course types
  'dental-courses': Stethoscope,
  'pharmacy-courses': Pill,
  'engineering-courses': Wrench,
  'arts-and-science-courses': Palette,
  'nursing-courses': Heart,
  'allied-health-science-courses': HeartPulse,
  'education-courses': BookMarked,

  // Facilities
  'transport': Bus,
  'emergency-care': Ambulance,
  'hostel': Bed,
  'food-court': UtensilsCrossed,
  'bank-post-office': Building2,
  'ambulance-services': Ambulance,
  'auditorium': Theater,
  'seminar-hall': Presentation,
  'sports': Trophy,
  'wi-fi-campus': Wifi,
  'smart-classroom': Monitor,

  // More section
  'careers': Briefcase,
  'privacy-policy': Shield,
};

/**
 * Maps CMS navigation labels or hrefs to Lucide icons
 * @param label Navigation item label
 * @param href Navigation item href
 * @returns Lucide icon component
 */
export function mapCmsIconToLucide(label: string, href: string): LucideIcon {
  // Normalize label (lowercase, no spaces/special chars)
  const normalizedLabel = label
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // Try to match by normalized label
  if (CMS_ICON_MAP[normalizedLabel]) {
    return CMS_ICON_MAP[normalizedLabel];
  }

  // Extract slug from href (last segment)
  const segments = href.split('/').filter(Boolean);
  const slug = segments[segments.length - 1] || '';
  const normalizedSlug = slug.toLowerCase();

  // Try to match by href slug
  if (CMS_ICON_MAP[normalizedSlug]) {
    return CMS_ICON_MAP[normalizedSlug];
  }

  // Default fallback
  return CircleDot;
}
