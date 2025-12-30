'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { mapCmsIconToLucide } from './cms-icon-mapper';
import { PUBLIC_FALLBACK_PRIMARY_ITEMS, PUBLIC_FALLBACK_MORE_MENU_GROUPS } from './public-nav-config';
import type { NavMenuItem, MoreMenuMainItem, FlatNavItem } from '../core/types';

// CMS Navigation structure (from app/actions/cms/navigation.ts)
export interface CmsNavItem {
  id: string;
  label: string;
  href: string;
  is_homepage: boolean;
  external_url?: string | null;
  children?: CmsNavItem[];
}

// Mobile-friendly label mappings (shorter labels for bottom nav)
const MOBILE_LABEL_MAP: Record<string, string> = {
  'OUR COLLEGES': 'Colleges',
  'OUR SCHOOLS': 'Schools',
};

// Get mobile-friendly label
function getMobileLabel(label: string): string {
  return MOBILE_LABEL_MAP[label] || label;
}

interface UsePublicNavDataProps {
  cmsNavigation?: CmsNavItem[];
}

// Transform CMS nav items to bottom nav format
function transformCmsToBottomNav(cmsNav: CmsNavItem[], pathname: string): NavMenuItem[] {
  return cmsNav.map((item) => {
    const icon = mapCmsIconToLucide(item.label, item.href);
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

    return {
      href: item.href,
      label: getMobileLabel(item.label),
      icon,
      active: isActive,
      submenus: (item.children || []).map((child) => ({
        href: child.href,
        label: getMobileLabel(child.label),
        icon: mapCmsIconToLucide(child.label, child.href),
        active: pathname === child.href
      }))
    };
  });
}

// Generate a unique ID from label
function toId(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-');
}

export function usePublicNavData({ cmsNavigation }: UsePublicNavDataProps = {}) {
  const pathname = usePathname();

  // Use CMS navigation if available, otherwise use fallback
  const hasNavigation = cmsNavigation && cmsNavigation.length > 0;

  const { primaryItems, moreMenuGroups } = useMemo(() => {
    let allItems: NavMenuItem[] = [];

    if (hasNavigation) {
      // Transform CMS navigation to bottom nav format
      allItems = transformCmsToBottomNav(cmsNavigation!, pathname);
    } else {
      // Use fallback navigation with active states
      allItems = PUBLIC_FALLBACK_PRIMARY_ITEMS.map((item) => ({
        ...item,
        active: pathname === item.href || pathname.startsWith(item.href + '/'),
        submenus: item.submenus.map((sub) => ({
          ...sub,
          active: pathname === sub.href
        }))
      }));
    }

    // Split into primary (first 4) and more menu (rest)
    const primary = allItems.slice(0, 4);
    const remaining = allItems.slice(4);

    // Create more menu items (hierarchical structure - main menu with submenus)
    const moreItems: MoreMenuMainItem[] = [];

    if (remaining.length > 0) {
      // Transform remaining items to hierarchical structure
      remaining.forEach((menu) => {
        const submenus: FlatNavItem[] = menu.submenus.map((sub) => ({
          href: sub.href,
          label: sub.label,
          icon: sub.icon || menu.icon,
          active: sub.active
        }));

        moreItems.push({
          id: toId(menu.label),
          href: menu.href,
          label: menu.label,
          icon: menu.icon,
          active: menu.active || submenus.some((s) => s.active),
          submenus
        });
      });
    } else if (!hasNavigation) {
      // Use fallback more menu groups
      PUBLIC_FALLBACK_MORE_MENU_GROUPS.forEach((group) => {
        group.menus.forEach((menu) => {
          const submenus: FlatNavItem[] = menu.submenus.map((sub) => ({
            href: sub.href,
            label: sub.label,
            icon: sub.icon,
            active: pathname === sub.href || pathname.startsWith(sub.href + '/')
          }));

          const isActive = pathname === menu.href || pathname.startsWith(menu.href + '/');

          moreItems.push({
            id: toId(menu.label),
            href: menu.href,
            label: menu.label,
            icon: menu.icon,
            active: isActive || submenus.some((s) => s.active),
            submenus
          });
        });
      });
    }

    return {
      primaryItems: primary,
      moreMenuGroups: moreItems
    };
  }, [cmsNavigation, pathname, hasNavigation]);

  return {
    primaryItems,
    moreMenuGroups
  };
}
