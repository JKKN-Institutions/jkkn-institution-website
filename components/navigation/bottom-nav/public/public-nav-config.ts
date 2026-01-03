import {
  Home,
  Info,
  GraduationCap,
  Mail,
  BookOpen,
  Calendar,
  Image,
  History,
  Users,
  Target,
  ClipboardList,
  FileCheck,
  FileEdit,
  Scale,
  Shield,
  type LucideIcon
} from 'lucide-react';
import type { NavMenuItem, NavMenuGroup, NavSubmenuItem } from '../core/types';

// Submenu config with icon
export interface NavSubmenuItemConfig {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Define config types without active states
export type NavMenuItemConfig = Omit<NavMenuItem, 'active' | 'submenus'> & {
  submenus: NavSubmenuItemConfig[];
};

export type NavMenuGroupConfig = Omit<NavMenuGroup, 'menus'> & {
  menus: NavMenuItemConfig[];
};

// Fallback navigation when CMS is empty
// Primary 4 items (always visible in bottom nav)
export const PUBLIC_FALLBACK_PRIMARY_ITEMS: NavMenuItemConfig[] = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
    submenus: []
  },
  {
    href: '/about',
    label: 'About',
    icon: Info,
    submenus: [
      { href: '/about/history', label: 'History', icon: History },
      { href: '/about/leadership', label: 'Leadership', icon: Users },
      { href: '/about/vision-mission', label: 'Vision & Mission', icon: Target }
    ]
  },
  {
    href: '/admissions',
    label: 'Admissions',
    icon: GraduationCap,
    submenus: [
      { href: '/admissions/process', label: 'Process', icon: ClipboardList },
      { href: '/admissions/requirements', label: 'Requirements', icon: FileCheck },
      { href: '/admissions/apply', label: 'Apply Now', icon: FileEdit }
    ]
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: Mail,
    submenus: []
  }
];

// More menu fallback (additional navigation)
export const PUBLIC_FALLBACK_MORE_MENU_GROUPS: NavMenuGroupConfig[] = [
  {
    groupLabel: 'Academics',
    icon: BookOpen,
    menus: [
      {
        href: '/programs',
        label: 'Programs',
        icon: BookOpen,
        submenus: []
      },
      {
        href: '/courses',
        label: 'Courses',
        icon: BookOpen,
        submenus: []
      }
    ]
  },
  {
    groupLabel: 'Resources',
    icon: Calendar,
    menus: [
      {
        href: '/events',
        label: 'Events',
        icon: Calendar,
        submenus: []
      },
      {
        href: '/gallery',
        label: 'Gallery',
        icon: Image,
        submenus: []
      }
    ]
  },
  {
    groupLabel: 'Legal',
    icon: Scale,
    menus: [
      {
        href: '/terms-and-conditions',
        label: 'Terms & Conditions',
        icon: Scale,
        submenus: []
      },
      {
        href: '/privacy-policy',
        label: 'Privacy Policy',
        icon: Shield,
        submenus: []
      }
    ]
  }
];
