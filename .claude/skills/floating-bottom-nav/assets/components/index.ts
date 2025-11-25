// Floating Bottom Navigation Components
// Export all navigation components for easy importing

// Basic Navigation Components
export { FloatingTabBar } from './FloatingTabBar';
export { FloatingDock } from './FloatingDock';
export { ExpandableFAB } from './ExpandableFAB';
export { CenterActionTabBar } from './CenterActionTabBar';

// Hierarchical Navigation Components (Parent + Submodules)
export { HierarchicalNavBar } from './HierarchicalNavBar';
export { MorphingNavBar } from './MorphingNavBar';
export { BottomSheetNavBar } from './BottomSheetNavBar';

// Horizontal Nav with Vertical Floating Submodules (RECOMMENDED)
export { HorizontalNavVerticalSub } from './HorizontalNavVerticalSub';

// Vertical Floating Navigation (All vertical)
export { VerticalFloatingNav } from './VerticalFloatingNav';
export { VerticalFloatingNavCompact } from './VerticalFloatingNavCompact';

// Responsive Navigation - Desktop Sidebar + Mobile Bottom Nav (NEW!)
export { default as ResponsiveNavigation, DesktopSidebar, MobileBottomNav } from './ResponsiveNavigation';

// College CMS Example
export { default as CollegeCMSExample, cmsModules } from './CollegeCMSExample';

// Type exports - Basic
export type { NavItem } from './FloatingTabBar';
export type { DockItem } from './FloatingDock';
export type { FABAction } from './ExpandableFAB';
export type { TabItem } from './CenterActionTabBar';

// Type exports - Hierarchical & Vertical
export type { SubModule, ParentModule } from './HorizontalNavVerticalSub';
