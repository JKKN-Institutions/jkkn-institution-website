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
  Shield,
  // Additional icons for menu items
  UsersRound,
  ClipboardCheck,
  FolderOpen,
  UserCircle,
  Zap,
  // Engineering college course icons
  Cpu,
  Laptop,
  Cog,
  Radio,
  FlaskConical,
  // Committee icons
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Scale,
  MessageSquare,
  // IQAC & quality icons
  BarChart3,
  // Others / misc icons
  CalendarDays,
  ClipboardList,
  Flag,
  ScrollText,
  FileCheck,
  MessageCircle,
  GitBranch,
  BadgeCheck,
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
  'library': BookOpen,
  'digital-library': BookOpen,

  // More section
  'careers': Briefcase,
  'privacy-policy': Shield,

  // JKKN-specific menu items
  'committee': UsersRound,
  'committees': UsersRound,
  'iqac': ClipboardCheck,
  'others': FolderOpen,
  'alumni': UserCircle,
  'quick-access': Zap,
  'quick access': Zap,

  // ========================================
  // Engineering College - Course icons
  // ========================================
  'ug': BookOpen,
  'pg': GraduationCap,
  'be-cse': Cpu,
  'btech-it': Laptop,
  'b-e-mech': Cog,
  'be-mech': Cog,
  'be-eee': Zap,
  'be-ece': Radio,
  'sh': FlaskConical,
  'me-cse': Cpu,
  'mba': Briefcase,

  // ========================================
  // Engineering College - Committee icons
  // ========================================
  'anti-ragging-committee': ShieldAlert,
  'anti-ragging-squad': ShieldCheck,
  'anti-drug-club': ShieldOff,
  'anti-drug-committee': ShieldOff,
  'internal-compliant-committee': Scale,
  'grievance-and-redressal': MessageSquare,
  'sc-st-committee': Users,
  'library-committee': BookOpen,
  'library-advisory-committee': BookOpen,

  // ========================================
  // Engineering College - IQAC icons
  // ========================================
  'naac': Award,
  'nirf': BarChart3,
  'nirf-2024': BarChart3,
  'nirf-2025': BarChart3,

  // ========================================
  // Engineering College - Others icons
  // ========================================
  'academic-calendar': CalendarDays,
  'examination': ClipboardList,
  'examination-manual': FileText,
  'minority-committee': Users,
  'nss': Flag,
  'drug-free-tamilnadu-orientation-program': ShieldCheck,
  'online-grievance-and-redressal': MessageSquare,
  'research-and-development-cell': FlaskConical,

  // ========================================
  // Engineering College - Alumni icons
  // ========================================
  'alumni-constitution': ScrollText,

  // ========================================
  // Engineering College - Quick Access icons
  // ========================================
  'policy': ScrollText,
  'mandatory-disclosure': FileCheck,
  'principals-message': MessageCircle,
  'institution-rules': ClipboardList,
  'organogram': GitBranch,
  'approvals-and-affiliation': BadgeCheck,
  'class-room': School,
  'food-court-stationery-shop': UtensilsCrossed,
  'allied-health-sciences-courses': HeartPulse,
  'vision-and-mission': Award,
  'terms--conditions': FileText,
  'terms-and-conditions': FileText,
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
