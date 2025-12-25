import {
  LayoutDashboard,
  Zap,
  Bell,
  User,
  Users,
  Shield,
  Activity,
  FileText,
  Image,
  Settings,
  Mail,
  Puzzle,
  Layers,
  Video,
  PenLine,
  Tags,
  FolderOpen,
  MessageSquare,
  Briefcase,
  Building2,
  UserCheck,
  UserPlus,
  ListFilter,
  MailCheck,
  CalendarPlus,
  FilePlus,
  UserCog,
  ShieldPlus,
  ExternalLink,
  type LucideIcon
} from 'lucide-react';
import type { NavMenuItem, NavMenuGroup, NavSubmenuItem, SubmenuGroup } from '../core/types';

// Routes that are parent-only containers (no actual page, only submenus)
// These will be excluded from navigation items
export const PARENT_ONLY_ROUTES = new Set<string>([
  '/admin/quick-actions' // Quick actions is just a submenu container
]);

// Routes that should redirect to another route
// Key: original route, Value: redirect target
export const REDIRECT_ROUTES: Record<string, string> = {
  '/admin': '/admin' // Dashboard is the root
};

// Icon mapping for group labels (for dynamic icon lookup)
export const GROUP_ICONS: Record<string, LucideIcon> = {
  'Dashboard': LayoutDashboard,
  'Actions': Zap,
  'Alerts': Bell,
  'Profile': User,
  'Access Management': Shield,
  'User Management': Users,
  'Role Management': Shield,
  'Activities': Activity,
  'Content Management': FileText,
  'System': Settings
};

// Submenu config with icon
export interface NavSubmenuItemConfig {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Submenu group config (for hierarchical menus like Content)
export interface SubmenuGroupConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavSubmenuItemConfig[];
}

// Define config types without active states
export type NavMenuItemConfig = Omit<NavMenuItem, 'active' | 'submenus'> & {
  submenus: NavSubmenuItemConfig[];
  submenuGroups?: SubmenuGroupConfig[];  // Optional grouped structure (for Content-style)
  external?: boolean; // Opens in new tab
};

export type NavMenuGroupConfig = Omit<NavMenuGroup, 'menus'> & {
  menus: NavMenuItemConfig[];
};

// Primary 5 items (always visible in bottom nav)
export const ADMIN_PRIMARY_ITEMS: NavMenuItemConfig[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    submenus: []
  },
  {
    href: '/admin/users',
    label: 'Access',
    icon: Shield,
    submenus: [], // Empty - using submenuGroups instead
    submenuGroups: [
      {
        id: 'user-management',
        label: 'User Management',
        icon: Users,
        items: [
          { href: '/admin/users', label: 'All Users', icon: Users },
          { href: '/admin/users/new', label: 'Add User', icon: UserPlus },
          { href: '/admin/users/approved-emails', label: 'Approved Emails', icon: MailCheck }
        ]
      },
      {
        id: 'role-management',
        label: 'Role Management',
        icon: Shield,
        items: [
          { href: '/admin/roles', label: 'All Roles', icon: Shield },
          { href: '/admin/roles/new', label: 'Create Role', icon: ShieldPlus }
        ]
      }
    ]
  },
  {
    href: '/admin/content',
    label: 'Content',
    icon: FileText,
    submenus: [], // Empty - using submenuGroups instead
    submenuGroups: [
      {
        id: 'content',
        label: 'Content',
        icon: FileText,
        items: [
          { href: '/admin/content/pages', label: 'Pages', icon: FileText },
          { href: '/admin/content/components', label: 'Components', icon: Puzzle },
          { href: '/admin/content/templates', label: 'Templates', icon: Layers },
          { href: '/admin/content/media', label: 'Media', icon: Image },
          { href: '/admin/content/videos', label: 'Videos', icon: Video }
        ]
      },
      {
        id: 'blog',
        label: 'Blog',
        icon: PenLine,
        items: [
          { href: '/admin/blog/posts', label: 'Posts', icon: PenLine },
          { href: '/admin/blog/categories', label: 'Categories', icon: FolderOpen },
          { href: '/admin/blog/tags', label: 'Tags', icon: Tags },
          { href: '/admin/blog/comments', label: 'Comments', icon: MessageSquare }
        ]
      },
      {
        id: 'careers',
        label: 'Careers',
        icon: Briefcase,
        items: [
          { href: '/admin/careers/jobs', label: 'Jobs', icon: Briefcase },
          { href: '/admin/careers/departments', label: 'Departments', icon: Building2 },
          { href: '/admin/careers/applications', label: 'Applications', icon: UserCheck },
          { href: '/admin/careers/emails', label: 'Email Templates', icon: Mail }
        ]
      }
    ]
  },
  {
    href: '/admin/system',
    label: 'System',
    icon: Settings,
    submenus: [
      { href: '/admin/system/inquiries', label: 'Inquiries', icon: Mail },
      { href: '/admin/system/analytics', label: 'Analytics', icon: Activity },
      { href: '/admin/system/settings', label: 'Settings', icon: Settings }
    ]
  },
  {
    href: '/',
    label: 'View Site',
    icon: ExternalLink,
    submenus: [],
    external: true
  }
];

// More menu structure (items that don't fit in primary nav)
export const ADMIN_MORE_MENU_GROUPS: NavMenuGroupConfig[] = [
  {
    groupLabel: 'Quick Access',
    icon: Zap,
    menus: [
      {
        href: '/admin/quick-actions',
        label: 'Actions',
        icon: Zap,
        submenus: [
          { href: '/admin/users/new', label: 'Add User', icon: UserPlus },
          { href: '/admin/content/pages/new', label: 'New Page', icon: FilePlus },
          { href: '/admin/events/new', label: 'Create Event', icon: CalendarPlus }
        ]
      },
      {
        href: '/admin/notifications',
        label: 'Alerts',
        icon: Bell,
        submenus: []
      },
      {
        href: '/admin/profile',
        label: 'Profile',
        icon: User,
        submenus: [
          { href: '/admin/profile/settings', label: 'Settings', icon: Settings },
          { href: '/admin/profile/activity', label: 'My Activity', icon: Activity }
        ]
      }
    ]
  },
  {
    groupLabel: 'Activities',
    icon: Activity,
    menus: [
      {
        href: '/admin/activity-logs',
        label: 'Activity Logs',
        icon: Activity,
        submenus: []
      }
    ]
  }
];
