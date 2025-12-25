'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { LucideIcon } from 'lucide-react';
import {
  ADMIN_PRIMARY_ITEMS,
  ADMIN_MORE_MENU_GROUPS,
  PARENT_ONLY_ROUTES,
  REDIRECT_ROUTES,
  NavMenuItemConfig
} from './admin-nav-config';
import type { NavMenuItem, MoreMenuMainItem, FlatNavItem, SubmenuGroup } from '../core/types';

interface UseAdminNavDataProps {
  userPermissions?: string[];
}

// Helper to check if user has permission
function hasPermission(userPermissions: string[] | undefined, required: string | undefined): boolean {
  if (!required) return true; // No permission required
  if (!userPermissions || userPermissions.length === 0) return false;

  // Super admin has all permissions
  if (userPermissions.includes('*:*:*')) return true;

  // Check for specific permission
  return userPermissions.includes(required);
}

// Generate a unique ID from label
function toId(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-');
}

// Extended NavMenuItem that includes submenuGroups
export interface ExtendedNavMenuItem extends NavMenuItem {
  submenuGroups?: SubmenuGroup[];
  external?: boolean;
}

export function useAdminNavData({ userPermissions }: UseAdminNavDataProps = {}) {
  const pathname = usePathname();

  // Transform primary items with active states
  const primaryItems: ExtendedNavMenuItem[] = useMemo(() => {
    return ADMIN_PRIMARY_ITEMS.map((item) => {
      // Transform submenuGroups if present
      const submenuGroups = item.submenuGroups?.map((group) => ({
        id: group.id,
        label: group.label,
        icon: group.icon,
        items: group.items.map((sub) => ({
          href: sub.href,
          label: sub.label,
          icon: sub.icon,
          active: pathname === sub.href || pathname.startsWith(sub.href + '/')
        }))
      }));

      return {
        ...item,
        active: pathname === item.href || pathname.startsWith(item.href + '/'),
        submenus: item.submenus.map((sub) => ({
          ...sub,
          active: pathname === sub.href || pathname.startsWith(sub.href + '/')
        })),
        submenuGroups,
        external: item.external
      };
    });
  }, [pathname]);

  // Transform more menu groups into hierarchical structure
  // Each main menu becomes an accordion item, submenus become grid items
  const moreMenuGroups: MoreMenuMainItem[] = useMemo(() => {
    const items: MoreMenuMainItem[] = [];

    ADMIN_MORE_MENU_GROUPS.forEach((group) => {
      group.menus.forEach((menu) => {
        // Check if this main menu or any submenu is active
        const isMenuActive = pathname === menu.href || pathname.startsWith(menu.href + '/');
        const hasActiveSubmenu = menu.submenus.some(
          (sub) => pathname === sub.href || pathname.startsWith(sub.href + '/')
        );

        // Build submenus as flat items for the grid
        const submenus: FlatNavItem[] = [];

        // If menu has submenus, use them
        if (menu.submenus.length > 0) {
          menu.submenus.forEach((sub) => {
            const subHref = REDIRECT_ROUTES[sub.href] || sub.href;
            submenus.push({
              href: subHref,
              label: sub.label,
              icon: sub.icon,
              active: pathname === subHref || pathname.startsWith(subHref + '/')
            });
          });
        } else {
          // If no submenus, the menu itself is the only item
          // Skip adding it as a submenu - it will be the accordion header that navigates directly
        }

        items.push({
          id: toId(menu.label),
          href: menu.href,
          label: menu.label,
          icon: menu.icon,
          active: isMenuActive || hasActiveSubmenu,
          submenus
        });
      });
    });

    return items;
  }, [pathname]);

  return {
    primaryItems,
    moreMenuGroups
  };
}
