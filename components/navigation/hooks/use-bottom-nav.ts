import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BottomNavState, ActivePageInfo, SelectedSubItem } from '../bottom-nav/core/types';

export const useBottomNav = create<BottomNavState>()(
  persist(
    (set) => ({
      // State
      activeNavId: null,
      isExpanded: false,
      isMoreMenuOpen: false,
      isMinimized: false, // Always show full navbar by default
      activePage: null,
      selectedSubItem: null,
      _hasHydrated: false,

      // Hydration tracking
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Set active navigation group
      setActiveNav: (id) =>
        set({
          activeNavId: id
        }),

      // Switch to a specific nav group and expand submenu (atomic update)
      switchToNav: (id) =>
        set({
          activeNavId: id,
          isExpanded: true,
          isMoreMenuOpen: false
        }),

      // Toggle submenu expanded state
      toggleExpanded: () =>
        set((state) => ({
          isExpanded: !state.isExpanded
        })),

      // Set submenu expanded state
      setExpanded: (expanded) =>
        set({
          isExpanded: expanded
        }),

      // Toggle More menu
      toggleMoreMenu: () =>
        set((state) => ({
          isMoreMenuOpen: !state.isMoreMenuOpen,
          isExpanded: false
        })),

      // Set More menu open state
      setMoreMenuOpen: (open) =>
        set({
          isMoreMenuOpen: open,
          isExpanded: false
        }),

      // Set minimized state
      setMinimized: (minimized) =>
        set({
          isMinimized: minimized,
          isExpanded: false,
          isMoreMenuOpen: false
        }),

      // Set active page info
      setActivePage: (page) =>
        set({
          activePage: page
        }),

      // Set selected submenu item
      setSelectedSubItem: (item) =>
        set({
          selectedSubItem: item
        }),

      // Close all menus
      closeAll: () =>
        set({
          isExpanded: false,
          isMoreMenuOpen: false
        }),

      // Reset all state to initial values
      resetState: () =>
        set({
          activeNavId: null,
          isExpanded: false,
          isMoreMenuOpen: false,
          isMinimized: false,
          activePage: null,
          selectedSubItem: null
        })
    }),
    {
      name: 'bottom-nav-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist serializable state
      partialize: (state) => ({
        activeNavId: state.activeNavId,
        selectedSubItem: state.selectedSubItem,
        isMinimized: state.isMinimized,
        // Persist activePage without icon (icons are React components, not serializable)
        activePage: state.activePage
          ? {
              href: state.activePage.href,
              label: state.activePage.label,
              groupLabel: state.activePage.groupLabel
            }
          : null
      }),
      // Track when hydration completes
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

// Helper hook to wait for hydration
export const useBottomNavHydration = () => {
  return useBottomNav((state) => state._hasHydrated);
};
