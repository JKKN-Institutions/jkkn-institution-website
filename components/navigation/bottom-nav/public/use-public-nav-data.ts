'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { mapCmsIconToLucide } from './cms-icon-mapper';
import { PUBLIC_FALLBACK_PRIMARY_ITEMS, PUBLIC_FALLBACK_MORE_MENU_GROUPS } from './public-nav-config';
import type { NavMenuItem, NavSubmenuItem, MoreMenuMainItem, FlatNavItem } from '../core/types';

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
  'ABOUT': 'About',
  'OUR COLLEGES': 'Colleges',
  'OUR SCHOOLS': 'Schools',
  'B.E. Mechanical Engineering': 'MECH',
  'BE MECHANICAL': 'MECH',
  'BE Mechanical': 'MECH',
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

// Recursively find a CMS item by href in the navigation tree
function findCmsItemByHref(items: CmsNavItem[], href: string): CmsNavItem | undefined {
  for (const item of items) {
    if (item.href === href) {
      return item;
    }
    if (item.children && item.children.length > 0) {
      const found = findCmsItemByHref(item.children, href);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
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

      // Flatten 3-level hierarchies (e.g., Courses > UG/PG > Courses)
      // Convert: Courses → UG → [B.E CSE, B.TECH IT]
      // Into: Courses → [All courses grouped by UG/PG]
      allItems = allItems.map((item) => {
        // Check if this item has children with their own children (3-level hierarchy)
        const hasNestedChildren = item.submenus.some((sub) => {
          const cmsItem = findCmsItemByHref(cmsNavigation!, sub.href);
          return cmsItem?.children && cmsItem.children.length > 0;
        });

        if (hasNestedChildren) {
          console.log(`[usePublicNavData] Flattening 3-level hierarchy for: ${item.label}`);
          console.log(`[usePublicNavData] Original submenus:`, item.submenus);

          // Flatten: collect all grandchildren
          const flattenedSubmenus: NavSubmenuItem[] = [];

          item.submenus.forEach((sub) => {
            const cmsItem = findCmsItemByHref(cmsNavigation!, sub.href);
            console.log(`[usePublicNavData] Checking submenu: ${sub.label}, found CMS item:`, cmsItem);

            if (cmsItem?.children && cmsItem.children.length > 0) {
              console.log(`[usePublicNavData] Found ${cmsItem.children.length} grandchildren under ${sub.label}`);

              // Add all grandchildren
              cmsItem.children.forEach((grandchild) => {
                flattenedSubmenus.push({
                  href: grandchild.href,
                  label: grandchild.label,
                  icon: mapCmsIconToLucide(grandchild.label, grandchild.href),
                  active: pathname === grandchild.href || pathname.startsWith(grandchild.href + '/'),
                  parentLabel: sub.label, // Store parent label for grouping
                } as NavSubmenuItem & { parentLabel?: string });
              });
            } else {
              // Keep the original submenu if it has no children
              flattenedSubmenus.push(sub);
            }
          });

          console.log(`[usePublicNavData] Flattened submenus (${flattenedSubmenus.length} items):`, flattenedSubmenus);

          return {
            ...item,
            submenus: flattenedSubmenus
          };
        }

        return item;
      });
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
