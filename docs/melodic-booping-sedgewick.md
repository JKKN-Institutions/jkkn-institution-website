# Mobile Bottom Navigation Implementation Plan

## Overview

Implement a mobile-friendly bottom navigation system with FAB (Floating Action Button) style for both **admin panel** and **public pages**. The navigation features a persistent glassmorphic bottom bar with main menu tabs that open submenu bottom sheets when clicked.

### User Requirements
- Bottom navigation shows main menus
- Click main menu → submenus appear in bottom sheet below
- Select submenu → navigate to page AND close submenu
- Mobile-only (hidden on desktop `lg:` breakpoint and above)
- User-friendly approach optimized for mobile UX

### Key Design Decisions (from user clarifications)
1. **Submenu Style**: Bottom sheet with backdrop (mobile-native pattern)
2. **Admin Hamburger Menu**: Replace completely with bottom navigation
3. **Scroll Behavior**: Always fixed and visible (no auto-hide)
4. **Admin Content Submenu**: Flat scrollable list (7+ items)
5. **Public Navigation**: Home, About, Our Colleges, Our Schools, More (5 tabs total)

---

## Architecture Overview

### Admin Panel Navigation
```
MobileNavProvider (Context)
├── ResponsiveNavigation (modified - desktop sidebar only)
└── MobileBottomNav (new)
    ├── MobileNavBar (5 tabs)
    │   ├── Home (Dashboard)
    │   ├── Users (submenu: Users, Roles)
    │   ├── Content (submenu: Pages, Components, Templates, Media, Videos, Blog, Careers)
    │   ├── Activity (Activity Logs)
    │   └── System (submenu: Inquiries, Analytics)
    └── MobileBottomSheet (Vaul-powered)
        └── Scrollable submenu items
```

### Public Pages Navigation
```
MobileBottomNav
├── MobileNavBar (5 tabs)
│   ├── Home
│   ├── About (or navigates if no children)
│   ├── Our Colleges (or navigates)
│   ├── Our Schools (or navigates)
│   └── More (opens bottom sheet)
└── MoreMenuBottomSheet (Vaul-powered)
    ├── Navigation sections (accordion for children)
    └── Contact section (from FAB config)
```

---

## Implementation Plan

### Phase 1: Admin Panel Bottom Navigation

#### 1.1 Create Foundation Components

**Files to Create:**
- `types/mobile-nav.ts` - TypeScript interfaces
- `lib/hooks/use-mobile-nav.ts` - Hook to access context
- `components/admin/mobile-nav-provider.tsx` - State management context

**Key Features:**
- State: `isSheetOpen`, `activeSheet`, `activeTab`, `activeRoute`
- Permission filtering (reuse from `responsive-navigation.tsx`)
- Auto-close sheet on route change
- Active tab detection from pathname

#### 1.2 Build Bottom Sheet Component

**Files to Create:**
- `components/admin/mobile-bottom-sheet.tsx` - Vaul Drawer wrapper
- `components/admin/mobile-submenu-item.tsx` - Individual submenu item

**Implementation:**
- Use `vaul` library (already installed: `^1.1.2`)
- Glassmorphism styling (`glass-card` class)
- Backdrop with blur effect
- Swipe-down to close gesture
- Staggered animation for submenu items (Framer Motion)

#### 1.3 Create Bottom Navigation Bar

**Files to Create:**
- `components/admin/mobile-nav-tab.tsx` - Individual tab component
- `components/admin/mobile-bottom-nav.tsx` - Main bottom nav bar

**Tab Configuration:**
```typescript
const bottomNavTabs = [
  { id: 'home', label: 'Home', icon: LayoutDashboard, href: '/admin' },
  { id: 'users', label: 'Users', icon: Users, submenuGroups: ['access-management'] },
  { id: 'content', label: 'Content', icon: FileText, submenuGroups: ['content-management'] },
  { id: 'activity', label: 'Activity', icon: Activity, href: '/admin/activity' },
  { id: 'system', label: 'System', icon: Settings, submenuGroups: ['system'] }
]
```

**Styling:**
- Fixed position: `bottom-0 left-0 right-0 z-50`
- Glass effect with border-top
- Safe area padding: `pb-safe` for iOS notch
- Hidden on desktop: `lg:hidden`
- Touch targets: 44x44px minimum

#### 1.4 Modify Existing Components

**File: `components/admin/responsive-navigation.tsx`**
- **REMOVE**: `MobileSidebar` component (lines 452-630)
- **REMOVE**: `MobileMenuButton` component (lines 632-643)
- **REMOVE**: Mobile sidebar state and JSX
- **KEEP**: Desktop sidebar (unchanged)
- **EXPORT**: `navigationGroups` for reuse in bottom nav

**File: `components/admin/admin-header.tsx`**
- Change left padding from `pl-12` to `pl-4` (remove hamburger spacing)

**File: `app/(admin)/layout.tsx`**
- Wrap with `<MobileNavProvider>`
- Add `<MobileBottomNav />` after main content
- Add bottom padding to main: `pb-20 lg:pb-6` (80px for bottom nav on mobile)

**Current layout.tsx structure (line 107-116):**
```tsx
<ResponsiveNavigation />
<div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
  <AdminHeader />
  <main className="flex-1 overflow-y-auto overflow-x-hidden w-full p-4 lg:p-6">{children}</main>
</div>
```

**New structure:**
```tsx
<MobileNavProvider navigationGroups={navigationGroups} userPermissions={permissions}>
  <ResponsiveNavigation />
  <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
    <AdminHeader />
    <main className="flex-1 overflow-y-auto overflow-x-hidden w-full p-4 lg:p-6 pb-20 lg:pb-6">{children}</main>
  </div>
  <MobileBottomNav />
</MobileNavProvider>
```

---

### Phase 2: Public Pages Bottom Navigation

#### 2.1 Create Foundation

**Files to Create:**
- `types/mobile-navigation.ts` - Public nav TypeScript interfaces
- `lib/utils/mobile-nav-utils.ts` - Navigation processing utilities
- `components/public/mobile-navigation/hooks/use-mobile-nav-config.ts` - Nav config hook
- `components/public/mobile-navigation/hooks/use-active-route.ts` - Active route detection

**Navigation Processing Logic:**
```typescript
// Take first 4 items for tabs, rest go to "More" menu
function processMobileNavigation(navigation: NavItem[]): MobileNavConfig {
  const tabItems = navigation.slice(0, 4).map(item => ({
    ...item,
    icon: getIconForNavItem(item) // Map based on label/href
  }))
  const moreItems = navigation.slice(4)
  return { tabItems, moreItems }
}
```

#### 2.2 Build Component Structure

**Files to Create:**
- `components/public/mobile-navigation/mobile-nav-tab.tsx` - Tab component
- `components/public/mobile-navigation/mobile-nav-bar.tsx` - Bottom bar (5 tabs)
- `components/public/mobile-navigation/more-menu-nav-section.tsx` - Navigation section with accordion
- `components/public/mobile-navigation/more-menu-contact-section.tsx` - Contact actions
- `components/public/mobile-navigation/more-menu-sheet.tsx` - Vaul bottom sheet
- `components/public/mobile-navigation/mobile-bottom-nav.tsx` - Main wrapper
- `components/public/mobile-navigation/index.ts` - Barrel export

**More Menu Structure:**
- Navigation sections (accordion for items with children)
- Contact section at bottom (reuses FAB config data)
- Scrollable content area
- Drag handle for swipe-down

#### 2.3 Integrate with Public Layout

**File: `app/(public)/layout.tsx`** (currently at 33 lines)

**Current structure (lines 19-31):**
```tsx
<div className='min-h-screen bg-cream flex flex-col relative'>
  <SiteHeader navigation={navigation} />
  <main className="flex-1 overflow-x-hidden">{children}</main>
  <SiteFooter />
  <FloatingActionButton config={fabConfig} />
</div>
```

**New structure:**
```tsx
<div className='min-h-screen bg-cream flex flex-col relative'>
  <SiteHeader navigation={navigation} />
  <main className="flex-1 overflow-x-hidden pb-20 lg:pb-0">{children}</main>
  <SiteFooter />
  <FloatingActionButton config={fabConfig} />
  <MobileBottomNav navigation={navigation} fabConfig={fabConfig} />
</div>
```

**Changes:**
- Add `pb-20 lg:pb-0` to main (80px bottom padding on mobile)
- Add `<MobileBottomNav />` component
- Pass `navigation` and `fabConfig` props

#### 2.4 Adjust FAB Positioning

**File: `components/public/floating-action-button.tsx`**

**Current FAB positioning:**
```tsx
className="fixed bottom-6 right-6 z-50"
```

**New FAB positioning:**
```tsx
className={cn(
  'fixed z-[60]',
  'bottom-24 right-6',    // Mobile: 96px from bottom (20px nav + 76px spacing)
  'lg:bottom-6',          // Desktop: 24px from bottom
)}
```

**Z-index coordination:**
- Bottom Nav: `z-50`
- FAB: `z-[60]` (above bottom nav)
- More Sheet: `z-[70]` (above everything when open)
- More Sheet Backdrop: `z-[65]`

---

## Animations & Interactions

### Bottom Sheet (Vaul)
```typescript
<Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
  <Drawer.Portal>
    <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[65]" />
    <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[70] max-h-[85vh] rounded-t-2xl glass-card">
      {/* Drag handle */}
      <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 mt-4" />
      {/* Content */}
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

**Features:**
- Slide-up animation (400ms spring easing)
- Swipe-down to close (40% threshold)
- Backdrop tap to close
- Escape key to close

### Submenu Items
- Staggered entrance animation (50ms stagger, Framer Motion)
- Scale animation on tap (`whileTap={{ scale: 0.92 }}`)

### Active Tab Indicator
- `layoutId` animation for smooth sliding indicator
- Scale up active tab icon: `scale-110`
- Color transition: `transition-all duration-200`

---

## Permission Filtering (Admin Only)

**Reuse existing logic from `responsive-navigation.tsx`:**

```typescript
const hasPermission = (permission?: string): boolean => {
  if (!permission) return true
  if (userPermissions.includes('*:*:*')) return true
  if (userPermissions.includes(permission)) return true

  const [module, resource, action] = permission.split(':')
  // Check wildcard permissions
  for (const perm of userPermissions) {
    const [permModule, permResource, permAction] = perm.split(':')
    if (permModule === '*' && permResource === '*' && permAction === '*') return true
    if (permModule === module && permResource === '*' && permAction === '*') return true
    if (permModule === module && permResource === resource && permAction === '*') return true
  }
  return false
}

// Filter tabs and submenu items
const visibleTabs = bottomNavTabs.filter(tab => hasPermission(tab.permission))
```

---

## Active Route Detection

**Map pathname to active tab:**

```typescript
const getActiveTabId = (pathname: string): string => {
  if (pathname === '/admin' || pathname === '/admin/dashboard') return 'home'
  if (pathname.startsWith('/admin/users') || pathname.startsWith('/admin/roles')) return 'users'
  if (pathname.startsWith('/admin/content') || pathname.startsWith('/admin/blog') || pathname.startsWith('/admin/careers')) return 'content'
  if (pathname.startsWith('/admin/activity')) return 'activity'
  if (pathname.startsWith('/admin/inquiries') || pathname.startsWith('/admin/analytics')) return 'system'
  return 'home' // Default
}
```

**Active tab styling:**
```tsx
<button className={cn(
  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
  isActive ? 'text-primary scale-110' : 'text-muted-foreground'
)}>
  <Icon className={cn('transition-all', isActive ? 'h-6 w-6' : 'h-5 w-5')} />
  <span className={cn('text-xs', isActive ? 'font-semibold' : 'font-medium')}>{label}</span>
  {isActive && <motion.div layoutId="activeIndicator" className="absolute -top-0.5 w-1 h-1 bg-primary rounded-full" />}
</button>
```

---

## Responsive Behavior

### Breakpoints
- **Mobile**: `< 1024px` → Show bottom nav, hide desktop sidebar
- **Desktop**: `>= 1024px` → Hide bottom nav, show desktop sidebar

### Safe Area Handling (iOS)
```typescript
// Tailwind config extension
spacing: {
  safe: 'env(safe-area-inset-bottom)'
}

// Usage
className="pb-safe" // Adds iOS notch/home indicator padding
```

---

## Implementation Sequence

### Step-by-Step Order

#### Admin Panel (Week 1)
1. **Day 1-2**: Create types, hooks, and provider
   - `types/mobile-nav.ts`
   - `lib/hooks/use-mobile-nav.ts`
   - `components/admin/mobile-nav-provider.tsx`

2. **Day 3**: Build bottom sheet
   - `components/admin/mobile-bottom-sheet.tsx`
   - `components/admin/mobile-submenu-item.tsx`

3. **Day 4**: Create bottom nav bar
   - `components/admin/mobile-nav-tab.tsx`
   - `components/admin/mobile-bottom-nav.tsx`

4. **Day 5**: Modify existing components
   - Update `responsive-navigation.tsx` (remove mobile sidebar)
   - Update `admin-header.tsx` (adjust padding)
   - Update `app/(admin)/layout.tsx` (integrate provider and bottom nav)

5. **Day 6-7**: Polish & testing
   - Add animations
   - Test permission filtering
   - Test active state tracking
   - Accessibility testing

#### Public Pages (Week 2)
1. **Day 1-2**: Create types and utilities
   - `types/mobile-navigation.ts`
   - `lib/utils/mobile-nav-utils.ts`
   - Custom hooks

2. **Day 3-4**: Build components
   - Nav tabs and bar
   - Navigation sections
   - Contact section
   - Bottom sheet

3. **Day 5**: Create main wrapper
   - `mobile-bottom-nav.tsx`
   - Barrel export

4. **Day 6**: Integration
   - Update `app/(public)/layout.tsx`
   - Adjust FAB positioning

5. **Day 7**: Polish & testing
   - Animations
   - Cross-device testing
   - Accessibility

---

## Critical Files Summary

### Admin Panel
| File | Action | Purpose |
|------|--------|---------|
| `types/mobile-nav.ts` | CREATE | TypeScript interfaces for mobile nav |
| `components/admin/mobile-nav-provider.tsx` | CREATE | State management context |
| `components/admin/mobile-bottom-nav.tsx` | CREATE | Main bottom navigation bar |
| `components/admin/mobile-bottom-sheet.tsx` | CREATE | Vaul-powered bottom sheet |
| `components/admin/responsive-navigation.tsx` | MODIFY | Remove mobile sidebar, export nav groups |
| `components/admin/admin-header.tsx` | MODIFY | Adjust left padding (pl-12 → pl-4) |
| `app/(admin)/layout.tsx` | MODIFY | Wrap with provider, add bottom nav, adjust main padding |

### Public Pages
| File | Action | Purpose |
|------|--------|---------|
| `types/mobile-navigation.ts` | CREATE | TypeScript interfaces for public nav |
| `lib/utils/mobile-nav-utils.ts` | CREATE | Navigation processing utilities |
| `components/public/mobile-navigation/mobile-bottom-nav.tsx` | CREATE | Main wrapper component |
| `components/public/mobile-navigation/more-menu-sheet.tsx` | CREATE | Vaul-powered "More" menu sheet |
| `app/(public)/layout.tsx` | MODIFY | Add bottom nav, adjust main padding |
| `components/public/floating-action-button.tsx` | MODIFY | Adjust bottom offset (6 → 24 on mobile) |

---

## Technical Specifications

### Dependencies (Already Installed)
- `vaul: ^1.1.2` - Bottom drawer/sheet
- `framer-motion: ^12.23.24` - Animations
- `lucide-react` - Icons
- `@radix-ui/*` - UI primitives (Accordion, etc.)

### Browser Support
- iOS Safari 14+
- Chrome 90+
- Firefox 88+
- Samsung Internet 14+

### Performance Targets
- Bottom nav initial load: < 100ms
- Sheet animation: 60fps
- Bundle size increase: ~13KB gzipped

### Accessibility (WCAG 2.1 AA)
- Touch targets: 44x44px minimum
- Color contrast: 4.5:1 minimum
- Keyboard navigation: Tab, Enter, Escape
- Screen reader: ARIA labels, expanded states
- Focus management: Trap focus in open sheet

---

## Testing Checklist

### Functionality
- [ ] Bottom nav appears on mobile (< 1024px)
- [ ] Bottom nav hidden on desktop (>= 1024px)
- [ ] Active tab highlighted based on current route
- [ ] Sheet opens on tab click (for tabs with submenus)
- [ ] Sheet closes on backdrop tap
- [ ] Sheet closes on swipe down
- [ ] Sheet closes on submenu item click + navigation works
- [ ] Permission filtering hides unauthorized tabs/items (admin only)
- [ ] Safe area insets work on iOS notch devices

### Animations
- [ ] Sheet slides up smoothly (400ms)
- [ ] Submenu items stagger animate
- [ ] Active tab indicator slides between tabs
- [ ] Tab scales on press
- [ ] All animations run at 60fps

### Accessibility
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces sheet open/close
- [ ] ARIA labels present on all interactive elements
- [ ] Focus visible states present
- [ ] Touch targets meet 44x44px minimum

### Cross-Device
- [ ] Tested on iPhone (Safari)
- [ ] Tested on Android (Chrome)
- [ ] Tested on iPad (portrait/landscape)
- [ ] Works in dark mode (if applicable)

---

## Success Metrics

### Primary Goals
- Mobile navigation engagement increased by 25%
- Time to find page reduced by 30%
- Mobile bounce rate decreased by 10%

### Secondary Goals
- "More" menu open rate > 15%
- Bottom nav tap rate > 2 taps per session
- Zero critical accessibility issues
- 60fps animation performance

---

## Notes

### Design System Integration
- Uses existing glassmorphism classes (`glass-card`, `glass-header`)
- Matches existing color system (primary, secondary, muted-foreground)
- Consistent with existing component patterns (Radix UI + Tailwind)
- Dark mode compatible (uses CSS variables)

### Future Enhancements (Post-MVP)
- [ ] CMS UI for selecting mobile tab items (admin panel)
- [ ] Notification badges on tabs
- [ ] Haptic feedback on tap
- [ ] Gesture shortcuts (swipe between tabs)
- [ ] Analytics dashboard for navigation usage
- [ ] User preference for tab order
