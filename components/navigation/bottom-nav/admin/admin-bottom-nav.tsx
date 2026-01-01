'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/components/navigation/hooks/use-mobile';
import { useBottomNav, useBottomNavHydration } from '@/components/navigation/hooks/use-bottom-nav';
import { useAdminNavData } from './use-admin-nav-data';
import { BottomNavItem } from '../core/bottom-nav-item';
import { BottomNavSubmenu } from '../core/bottom-nav-submenu';
import { BottomNavMoreMenu } from '../core/bottom-nav-more-menu';
import type { FlatMenuItem, ActivePageInfo, SubmenuGroup } from '../core/types';

interface AdminBottomNavProps {
  userPermissions?: string[];
}

// Generate semantic nav ID from label
function toNavId(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-');
}

export function AdminBottomNav({ userPermissions }: AdminBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const hasHydrated = useBottomNavHydration();
  const hasInitialized = useRef(false);

  const {
    activeNavId,
    isExpanded,
    isMoreMenuOpen,
    activePage,
    setActiveNav,
    switchToNav,
    setExpanded,
    setMoreMenuOpen,
    setActivePage,
    setSelectedSubItem
  } = useBottomNav();

  // Get navigation data with active states
  const { primaryItems, moreMenuGroups } = useAdminNavData({ userPermissions });

  // Hide on page editor routes for full-screen editing experience
  // NOTE: This check must come AFTER all hooks to follow Rules of Hooks
  const isPageEditorRoute = /^\/admin\/content\/pages\/[^/]+\/edit$/.test(pathname);

  // Find the currently active primary item based on pathname
  const currentActiveItem = useMemo(() => {
    // First check primary items
    for (const item of primaryItems) {
      // Check submenuGroups first (for Content-style menus)
      if (item.submenuGroups) {
        for (const group of item.submenuGroups) {
          for (const sub of group.items) {
            if (pathname === sub.href || pathname.startsWith(sub.href + '/')) {
              return { item, submenu: sub, group };
            }
          }
        }
      }
      // Check flat submenus
      for (const sub of item.submenus) {
        if (pathname === sub.href || pathname.startsWith(sub.href + '/')) {
          return { item, submenu: sub };
        }
      }
      // Then check parent
      if (pathname === item.href || pathname.startsWith(item.href + '/')) {
        return { item, submenu: null };
      }
    }

    // Check more menu items (now flat list of main menu items)
    for (const moreItem of moreMenuGroups) {
      // Check submenus first
      for (const sub of moreItem.submenus) {
        if (pathname === sub.href || pathname.startsWith(sub.href + '/')) {
          return { item: null, moreItem, submenu: sub };
        }
      }
      // Then check the main menu item itself
      if (pathname === moreItem.href || pathname.startsWith(moreItem.href + '/')) {
        return { item: null, moreItem, submenu: null };
      }
    }

    return null;
  }, [pathname, primaryItems, moreMenuGroups]);

  // Current active page info for display
  const currentActivePage = useMemo((): ActivePageInfo | null => {
    if (!currentActiveItem) return null;

    if (currentActiveItem.item) {
      // From primary items
      const { item, submenu } = currentActiveItem;
      return {
        href: submenu?.href || item.href,
        label: submenu?.label || item.label,
        icon: item.icon,
        groupLabel: item.label
      };
    }

    if (currentActiveItem.moreItem) {
      // From more menu
      const { moreItem, submenu } = currentActiveItem;
      return {
        href: submenu?.href || moreItem.href,
        label: submenu?.label || moreItem.label,
        icon: moreItem.icon,
        groupLabel: moreItem.label
      };
    }

    return null;
  }, [currentActiveItem]);

  // Determine the effective active nav ID (semantic, not index-based)
  const effectiveActiveNavId = useMemo(() => {
    // When submenu is expanded, respect user's manual selection
    if (isExpanded && activeNavId) {
      return activeNavId;
    }

    // When collapsed, use pathname-based detection
    if (currentActiveItem?.item) {
      return toNavId(currentActiveItem.item.label);
    }

    // Fallback to stored activeNavId
    return activeNavId;
  }, [currentActiveItem, activeNavId, isExpanded]);

  // Get active submenu items for the selected nav item
  const activeSubmenus: FlatMenuItem[] = useMemo(() => {
    if (!effectiveActiveNavId) return [];

    // Find the primary item by semantic ID
    const item = primaryItems.find((i) => toNavId(i.label) === effectiveActiveNavId);

    // If item has submenuGroups, skip flat submenus (we use groups instead)
    if (item?.submenuGroups && item.submenuGroups.length > 0) {
      return [];
    }

    if (item && item.submenus.length > 0) {
      return item.submenus.map((sub) => ({
        href: sub.href,
        label: sub.label,
        icon: sub.icon || item.icon,
        active: sub.active
      }));
    }

    return [];
  }, [effectiveActiveNavId, primaryItems]);

  // Get active submenu groups for the selected nav item (for Content-style menus)
  const activeSubmenuGroups: SubmenuGroup[] = useMemo(() => {
    if (!effectiveActiveNavId) return [];

    // Find the primary item by semantic ID
    const item = primaryItems.find((i) => toNavId(i.label) === effectiveActiveNavId);

    if (item?.submenuGroups && item.submenuGroups.length > 0) {
      return item.submenuGroups;
    }

    return [];
  }, [effectiveActiveNavId, primaryItems]);

  // Update active page IMMEDIATELY when it changes (before paint)
  useLayoutEffect(() => {
    if (currentActivePage) {
      setActivePage(currentActivePage);

      // On first initialization after hydration
      if (!hasInitialized.current && hasHydrated) {
        hasInitialized.current = true;
      }
    }
  }, [currentActivePage, setActivePage, hasHydrated]);

  // Sync activeNavId with pathname when not expanded
  useEffect(() => {
    if (!isExpanded && currentActiveItem?.item) {
      const navId = toNavId(currentActiveItem.item.label);
      if (navId !== activeNavId) {
        setActiveNav(navId);
      }
    }
  }, [currentActiveItem, activeNavId, setActiveNav, isExpanded]);

  // Check if item has any submenus (flat or grouped)
  const hasAnySubmenus = useCallback((item: typeof primaryItems[0]): boolean => {
    return item.submenus.length > 0 || (item.submenuGroups !== undefined && item.submenuGroups.length > 0);
  }, []);

  // Handle nav item click with semantic IDs
  const handleNavClick = useCallback(
    (item: typeof primaryItems[0]) => {
      const navId = toNavId(item.label);

      // If external link, open in new tab
      if ('external' in item && item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
        return;
      }

      // If this item has no submenus (flat or grouped), navigate directly
      if (!hasAnySubmenus(item)) {
        router.push(item.href);
        setExpanded(false);
        return;
      }

      // Toggle submenu
      if (isExpanded && activeNavId === navId) {
        setExpanded(false);
      } else {
        switchToNav(navId);
      }
    },
    [activeNavId, isExpanded, switchToNav, setExpanded, router, hasAnySubmenus]
  );

  // Handle submenu item click
  const handleSubmenuClick = useCallback(
    (href: string) => {
      // Find the submenu item to track it
      const submenuItem = activeSubmenus.find((s) => s.href === href);
      if (submenuItem) {
        setSelectedSubItem({ href, label: submenuItem.label });
      }

      router.push(href);
      setExpanded(false);
    },
    [router, setExpanded, activeSubmenus, setSelectedSubItem]
  );

  // Handle "More" menu toggle
  const handleMoreClick = useCallback(() => {
    setExpanded(false);
    setMoreMenuOpen(!isMoreMenuOpen);
  }, [setMoreMenuOpen, setExpanded, isMoreMenuOpen]);

  // Handle More menu item click
  const handleMoreItemClick = useCallback(
    (href: string) => {
      router.push(href);
      setMoreMenuOpen(false);
    },
    [router, setMoreMenuOpen]
  );

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-bottom-nav]')) {
        setExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isExpanded, setExpanded]);

  // Wait for hydration
  if (!hasHydrated) {
    return null;
  }

  // Hide on page editor routes for full-screen editing experience
  if (isPageEditorRoute) {
    return null;
  }

  // Only show on mobile
  if (!isMobile) {
    return null;
  }

  // Don't render if no primary items
  if (primaryItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Backdrop when submenu expanded */}
      <AnimatePresence>
        {isExpanded && !isMoreMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[85] lg:hidden"
            onClick={() => setExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Bottom navigation bar */}
      <motion.nav
        data-bottom-nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 35,
          mass: 0.8
        }}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[90]',
          'lg:hidden', // Hide on desktop
          'bg-background border-t border-border',
          'shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]'
        )}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {/* Expanded submenu */}
        <BottomNavSubmenu
          items={activeSubmenus}
          groups={activeSubmenuGroups}
          isOpen={isExpanded}
          onItemClick={handleSubmenuClick}
        />

        {/* Nav items with semantic IDs */}
        <div className="flex items-center justify-around">
          {primaryItems.map((item) => {
            const navId = toNavId(item.label);
            return (
              <BottomNavItem
                key={item.href}
                id={navId}
                icon={item.icon}
                label={item.label}
                isActive={effectiveActiveNavId === navId}
                hasSubmenu={hasAnySubmenus(item)}
                onClick={() => handleNavClick(item)}
              />
            );
          })}

          {/* More button if there are additional groups */}
          {moreMenuGroups.length > 0 && (
            <BottomNavItem
              id="more"
              icon={MoreHorizontal}
              label="More"
              isActive={isMoreMenuOpen}
              hasSubmenu={true}
              badgeCount={moreMenuGroups.length}
              onClick={handleMoreClick}
            />
          )}
        </div>
      </motion.nav>

      {/* More menu sheet */}
      <BottomNavMoreMenu
        groups={moreMenuGroups}
        isOpen={isMoreMenuOpen}
        onClose={() => setMoreMenuOpen(false)}
        onItemClick={handleMoreItemClick}
      />
    </>
  );
}
