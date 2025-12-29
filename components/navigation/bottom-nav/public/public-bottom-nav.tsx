'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/components/navigation/hooks/use-mobile';
import { useBottomNav, useBottomNavHydration } from '@/components/navigation/hooks/use-bottom-nav';
import { usePublicNavData, type CmsNavItem } from './use-public-nav-data';
import { BottomNavItem } from '../core/bottom-nav-item';
import { BottomNavSubmenu } from '../core/bottom-nav-submenu';
import { BottomNavMoreMenu } from '../core/bottom-nav-more-menu';
import type { FlatMenuItem } from '../core/types';

interface PublicBottomNavProps {
  navigation?: CmsNavItem[];
}

export function PublicBottomNav({ navigation }: PublicBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const hasHydrated = useBottomNavHydration();

  const {
    activeNavId,
    isExpanded,
    isMoreMenuOpen,
    setActiveNav,
    switchToNav,
    setExpanded,
    setMoreMenuOpen
  } = useBottomNav();

  // Get navigation data with active states
  const { primaryItems, moreMenuGroups } = usePublicNavData({ cmsNavigation: navigation });

  // Find the currently active primary item based on pathname
  const currentActiveIndex = useMemo(() => {
    return primaryItems.findIndex(
      (item) => pathname === item.href || pathname.startsWith(item.href + '/')
    );
  }, [pathname, primaryItems]);

  // Determine the effective active nav ID
  const effectiveActiveNavId = useMemo(() => {
    if (isExpanded && activeNavId !== null) {
      return activeNavId;
    }
    return currentActiveIndex >= 0 ? currentActiveIndex.toString() : null;
  }, [currentActiveIndex, activeNavId, isExpanded]);

  // Get active submenu items
  const activeSubmenus: FlatMenuItem[] = useMemo(() => {
    if (effectiveActiveNavId !== null) {
      const index = parseInt(effectiveActiveNavId);
      const item = primaryItems[index];
      if (item && item.submenus.length > 0) {
        return item.submenus.map((sub) => ({
          href: sub.href,
          label: sub.label,
          icon: sub.icon || item.icon, // Use submenu's icon, fallback to parent's icon
          active: sub.active
        }));
      }
    }
    return [];
  }, [effectiveActiveNavId, primaryItems]);

  // Sync activeNavId with pathname when not expanded
  useEffect(() => {
    if (!isExpanded && currentActiveIndex >= 0 && currentActiveIndex.toString() !== activeNavId) {
      setActiveNav(currentActiveIndex.toString());
    }
  }, [currentActiveIndex, activeNavId, setActiveNav, isExpanded]);

  // Handle nav item click
  const handleNavClick = useCallback(
    (index: number) => {
      const item = primaryItems[index];

      // If this item has no submenus, navigate directly
      if (item.submenus.length === 0) {
        router.push(item.href);
        setExpanded(false);
        return;
      }

      // Toggle submenu
      if (isExpanded && activeNavId === index.toString()) {
        setExpanded(false);
      } else {
        switchToNav(index.toString());
      }
    },
    [primaryItems, activeNavId, isExpanded, switchToNav, setExpanded, router]
  );

  // Handle submenu item click
  const handleSubmenuClick = useCallback(
    (href: string) => {
      router.push(href);
      setExpanded(false);
    },
    [router, setExpanded]
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
          isOpen={isExpanded}
          onItemClick={handleSubmenuClick}
        />

        {/* Nav items */}
        <div className="flex items-center justify-around">
          {primaryItems.map((item, index) => (
            <BottomNavItem
              key={item.href}
              id={index.toString()}
              icon={item.icon}
              label={item.label}
              isActive={effectiveActiveNavId === index.toString()}
              hasSubmenu={item.submenus.length > 0}
              onClick={() => handleNavClick(index)}
            />
          ))}

          {/* More button if there are additional groups */}
          {moreMenuGroups.length > 0 && (
            <BottomNavItem
              id="more"
              icon={MoreHorizontal}
              label="More"
              isActive={isMoreMenuOpen}
              hasSubmenu={true}
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
