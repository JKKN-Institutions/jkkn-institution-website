import React from 'react'
import {
  Award,
  BarChart3,
  Battery,
  BookMarked,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  Car,
  Check,
  CheckCircle,
  ClipboardList,
  Clock,
  Cloud,
  DollarSign,
  Edit2,
  Factory,
  FileText,
  Flame,
  Globe,
  GraduationCap,
  Hammer,
  Handshake,
  HardDrive,
  Heart,
  IndianRupee,
  Laptop,
  Lightbulb,
  Lock,
  Mail,
  MapPin,
  Microscope,
  Palette,
  Phone,
  Plug,
  Radio,
  ScrollText,
  Settings,
  Sun,
  Target,
  TestTube,
  TrendingUp,
  Trophy,
  University,
  UserCheck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/**
 * Comprehensive icon mapping for engineering course pages
 * Maps icon name strings to Lucide React components
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  // Academic & Education
  GraduationCap,
  graduationCap: GraduationCap, // Alias: camelCase
  Award,
  award: Award, // Alias: camelCase
  ScrollText,
  Microscope,
  FileText,
  BookOpen,
  BookMarked,
  bookMarked: BookMarked, // Alias: camelCase
  University,
  university: University, // Alias: camelCase
  TestTube,
  testTube: TestTube, // Alias: camelCase

  // Business & Professional
  Briefcase,
  Building2,
  Target,
  Trophy,
  trophy: Trophy, // Alias: camelCase
  BarChart3,
  TrendingUp,
  DollarSign,
  IndianRupee,
  indianRupee: IndianRupee, // Alias: camelCase
  Handshake,

  // Technology & Computing
  Laptop,
  Bot,
  Cloud,
  Lock,
  HardDrive,
  Wrench,
  Radio, // Radio icon (also used as Antenna)
  Antenna: Radio, // Alias: Radio icon used for Antenna
  Settings,

  // Communication & Contact
  Phone,
  Mail,
  Globe,
  MapPin,

  // People & Users
  Users,
  users: Users, // Alias: camelCase
  UserCheck,

  // General & Social
  CheckCircle,
  Check,
  check: Check, // Alias: camelCase
  confirm: CheckCircle, // Alias: CheckCircle for confirm
  verify: CheckCircle, // Alias: CheckCircle for verify
  Lightbulb,
  Heart,
  Palette,
  Flame,

  // Time & Schedule
  Clock,
  clock: Clock, // Alias: camelCase
  Calendar,
  calendar: Calendar, // Alias: camelCase

  // Forms & Documents
  ClipboardList,
  form: ClipboardList, // Alias: ClipboardList for form
  exam: ClipboardList, // Alias: ClipboardList for exam

  // Electrical & Electronics Engineering
  Zap,
  Battery,
  Plug,
  Sun,

  // Engineering & Construction
  Factory,
  Construction: Hammer, // Alias: Hammer icon used for Construction
  Hammer,
  Car,
  car: Car, // Alias: camelCase

  // Editing & Document
  FileEdit: Edit2, // Alias: Edit2 icon used for FileEdit
  Edit2,
}

/**
 * Type-safe icon names
 */
export type IconName = keyof typeof ICON_MAP

/**
 * Renders an icon component from a string name
 *
 * @param iconName - Name of the icon (e.g., "GraduationCap")
 * @param className - Optional Tailwind classes for styling
 * @param fallback - Optional fallback to render if icon not found
 * @returns React component or fallback
 *
 * @example
 * ```tsx
 * <div>{renderIcon('GraduationCap', 'w-6 h-6 text-blue-600')}</div>
 * ```
 */
export function renderIcon(
  iconName: string | undefined,
  className: string = 'w-6 h-6',
  fallback?: React.ReactNode
): React.ReactNode {
  if (!iconName) return fallback || null

  const IconComponent = ICON_MAP[iconName as IconName]

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in ICON_MAP`)
    return fallback || null
  }

  return <IconComponent className={className} />
}

/**
 * Gets an icon component by name (for custom rendering)
 *
 * @param iconName - Name of the icon
 * @returns Lucide icon component or undefined
 *
 * @example
 * ```tsx
 * const Icon = getIconComponent('GraduationCap')
 * return Icon ? <Icon className="w-8 h-8" /> : null
 * ```
 */
export function getIconComponent(iconName: string | undefined): LucideIcon | undefined {
  if (!iconName) return undefined
  return ICON_MAP[iconName as IconName]
}

/**
 * Validates if an icon name exists in the map
 *
 * @param iconName - Name to check
 * @returns True if icon exists
 */
export function isValidIcon(iconName: string): iconName is IconName {
  return iconName in ICON_MAP
}

/**
 * Gets all available icon names
 *
 * @returns Array of valid icon names
 */
export function getAvailableIcons(): IconName[] {
  return Object.keys(ICON_MAP) as IconName[]
}

/**
 * Maps an icon name string to a Lucide icon component
 * Used for dynamic icon rendering in components
 *
 * @param iconName - Name of the icon
 * @returns Lucide icon component (defaults to BookOpen if not found)
 */
export function iconMapper(iconName: string): LucideIcon {
  return ICON_MAP[iconName as IconName] || BookOpen
}
