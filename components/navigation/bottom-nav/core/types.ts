import { LucideIcon } from 'lucide-react';

// Navigation menu item with icon
export interface NavMenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  submenus: NavSubmenuItem[];
}

// Submenu item with optional icon
export interface NavSubmenuItem {
  href: string;
  label: string;
  icon?: LucideIcon;
  active: boolean;
}

// Navigation group with multiple menu items
export interface NavMenuGroup {
  groupLabel: string;
  icon: LucideIcon;
  menus: NavMenuItem[];
}

// Props for bottom navbar component
export interface BottomNavbarProps {
  primaryItems: NavMenuItem[];      // Exactly 4 items
  moreMenuGroups: NavMenuGroup[];   // All other navigation groups
  variant?: 'admin' | 'public';     // For styling differences
}

// Props for individual nav item button
export interface BottomNavItemProps {
  id: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  hasSubmenu: boolean;
  badgeCount?: number;
  onClick: () => void;
}

// Flattened menu item for submenu rendering
export interface FlatMenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  parentLabel?: string;
  active?: boolean;
}

// Grouped submenu structure (for Content-style grouped menus)
export interface SubmenuGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  items: FlatMenuItem[];
}

// Props for submenu dropdown - supports both flat items and grouped items
export interface BottomNavSubmenuProps {
  items: FlatMenuItem[];
  groups?: SubmenuGroup[];  // Optional grouped structure
  isOpen: boolean;
  onItemClick: (href: string) => void;
}

// Menu item with submenus for hierarchical display
export interface HierarchicalMenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  submenus: NavSubmenuItem[];
}

// Flat menu item for More menu icon grid display
export interface FlatNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

// Navigation group for More menu (flat icon grid structure)
export interface BottomNavGroup {
  id: string;
  groupLabel: string;
  icon: LucideIcon;
  menus: FlatNavItem[];
}

// Hierarchical menu item for More menu (main menu with submenus)
// This represents a main menu (accordion header) with its submenus (grid items)
export interface MoreMenuMainItem {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  submenus: FlatNavItem[];
}

// Props for More menu modal - uses hierarchical structure
export interface BottomNavMoreMenuProps {
  groups: MoreMenuMainItem[];
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (href: string) => void;
}

// Active page information for display
export interface ActivePageInfo {
  href: string;
  label: string;
  icon: LucideIcon;
  groupLabel: string;
}

// Serializable version of ActivePageInfo (without icon component)
export interface SerializableActivePageInfo {
  href: string;
  label: string;
  groupLabel: string;
}

// Selected submenu item
export interface SelectedSubItem {
  href: string;
  label: string;
}

// Zustand store state
export interface BottomNavState {
  // State
  activeNavId: string | null;
  isExpanded: boolean;
  isMoreMenuOpen: boolean;
  isMinimized: boolean;
  activePage: ActivePageInfo | null;
  selectedSubItem: SelectedSubItem | null;
  _hasHydrated: boolean;

  // Actions
  setActiveNav: (id: string | null) => void;
  switchToNav: (id: string) => void;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
  toggleMoreMenu: () => void;
  setMoreMenuOpen: (open: boolean) => void;
  setMinimized: (minimized: boolean) => void;
  setActivePage: (page: ActivePageInfo | null) => void;
  setSelectedSubItem: (item: SelectedSubItem | null) => void;
  closeAll: () => void;
  resetState: () => void;
  setHasHydrated: (state: boolean) => void;
}
