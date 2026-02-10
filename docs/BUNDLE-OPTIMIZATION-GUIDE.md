# Bundle Optimization Guide

## Overview

This guide provides actionable strategies to reduce JavaScript bundle sizes and eliminate unused code, based on PageSpeed Insights analysis showing **295 KiB of potential savings**.

---

## Current Bundle Issues (PageSpeed Report)

### 1. First-Party JavaScript: 184.4 KiB (127.4 KiB unused)

**Problem:** Large Next.js chunks with significant unused code:
- `2bf2367f399f3c53.js`: 51.0 KiB transferred, 43.0 KiB unused
- `10e139c0f70bbf12.js`: 50.5 KiB transferred, 41.0 KiB unused
- `2988bfaf82a45b76.js`: 45.9 KiB transferred, 23.3 KiB unused
- `272855eb88db0092.js`: 37.0 KiB transferred, 20.1 KiB unused

**Root Causes:**
- Heavy libraries (Framer Motion, Recharts) loading on all pages
- No code splitting for admin-only components
- CMS blocks loading eagerly instead of lazily

### 2. Google Tag Manager: 250.6 KiB (114.0 KiB unused)

**Problem:** GTM and Google Analytics scripts load full libraries even when only basic tracking is used.

**Solution:** Already optimized with `lazyOnload` strategy. Further optimization requires reducing tracked events.

### 3. Facebook Pixel: 114.7 KiB (53.7 KiB unused)

**Problem:** Facebook events library loads full SDK.

**Solution:** Already optimized with interaction-based loading. Consider removing if conversion tracking isn't critical.

---

## Optimization Strategies

### Strategy 1: Lazy Load Heavy Dependencies

#### A. Analytics Charts (Recharts - 100KB)

**Before:**
```tsx
// ❌ Loads Recharts on every page
import { UserGrowthChart } from '@/components/analytics/charts/user-growth-chart'
```

**After:**
```tsx
// ✅ Only loads when analytics page is accessed
import { UserGrowthChart } from '@/components/analytics/charts/lazy-charts'

// lazy-charts.tsx
import dynamic from 'next/dynamic'

export const UserGrowthChart = dynamic(
  () => import('./user-growth-chart'),
  { loading: () => <ChartSkeleton />, ssr: false }
)
```

**Savings:** ~100 KiB (Recharts + dependencies)

#### B. Framer Motion (60KB)

**Before:**
```tsx
// ❌ Loads Framer Motion on all pages
import { motion } from 'framer-motion'

export function BottomNav() {
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
    >
      {/* nav content */}
    </motion.nav>
  )
}
```

**After:**
```tsx
// ✅ Use CSS transitions instead
export function OptimizedBottomNav() {
  return (
    <nav
      className="transition-transform duration-300"
      style={{ willChange: 'transform' }}
    >
      {/* nav content */}
    </nav>
  )
}
```

**Savings:** ~60 KiB (Framer Motion removed)

#### C. CMS Block Components

**Before:**
```tsx
// ❌ All blocks load eagerly
import { GalleryBlock } from './media/gallery-block'
import { VideoEmbedBlock } from './media/video-embed-block'
```

**After:**
```tsx
// ✅ Lazy load heavy blocks
import dynamic from 'next/dynamic'

const GalleryBlock = dynamic(
  () => import('./media/gallery-block'),
  { loading: () => <GallerySkeleton /> }
)
```

**Savings:** ~50-100 KiB depending on page content

---

### Strategy 2: Optimize Package Imports

#### A. Tree-Shaking (Already Configured)

The `next.config.ts` already includes `optimizePackageImports`:

```ts
experimental: {
  optimizePackageImports: [
    'lucide-react',
    'date-fns',
    'recharts',
    '@radix-ui/react-*',
  ]
}
```

**Verify it's working:**
```bash
ANALYZE=true npm run build
```

Look for:
- Smaller vendor chunks
- Individual package chunks (e.g., `radix-ui.js`, `lucide.js`)

#### B. Replace Heavy Packages

| Heavy Package | Bundle Size | Lightweight Alternative | Savings |
|---------------|-------------|-------------------------|---------|
| Framer Motion | 60 KB | CSS Transitions | 60 KB |
| Moment.js | 329 KB | date-fns | 316 KB |
| Lodash | 72 KB | lodash-es (specific imports) | ~60 KB |
| React Icons (all) | 200+ KB | lucide-react (selective) | 150+ KB |

**Example: Replace Framer Motion**

```bash
npm uninstall framer-motion
```

Update components to use CSS transitions (see `optimized-bottom-nav.tsx`).

---

### Strategy 3: Code Splitting by Route

#### A. Admin Components

Admin components should NEVER load on public pages.

**Implementation:**
```tsx
// app/(admin)/admin/analytics/page.tsx
import { LazyAnalyticsCharts } from '@/components/analytics/charts/lazy-charts'

// This entire module is only loaded when admin routes are accessed
```

**Verification:**
```bash
npm run build
```

Check that admin chunks are separate from public chunks.

#### B. Public vs. Admin Layouts

Ensure separate layout chunks:

```
_app-[hash].js          # Core app logic
(public)-[hash].js      # Public pages only
(admin)-[hash].js       # Admin pages only
```

**Current config supports this** via route groups.

---

### Strategy 4: Remove Unused Code

#### A. Dead Code Elimination

**Find unused exports:**
```bash
npm install -g ts-unused-exports
ts-unused-exports tsconfig.json
```

**Example findings:**
```
components/old-hero.tsx: OldHeroSection (unused)
lib/utils/legacy.ts: formatOldDate (unused)
```

**Remove them:**
```bash
rm components/old-hero.tsx
# Edit lib/utils/legacy.ts to remove formatOldDate
```

#### B. Webpack Bundle Analyzer

```bash
ANALYZE=true npm run build
```

**Look for:**
- Duplicate dependencies (e.g., two versions of React)
- Large unexpected modules
- Unused Radix UI components

**Fix duplicates:**
```json
// package.json
{
  "overrides": {
    "react": "19.2.0",
    "react-dom": "19.2.0"
  }
}
```

---

### Strategy 5: Dynamic Imports Best Practices

#### When to Use Dynamic Imports

✅ **Good candidates:**
- Charts and data visualizations
- Rich text editors
- PDF viewers
- Image galleries/lightboxes
- Admin-only components
- Below-the-fold content

❌ **Bad candidates:**
- Navigation components (needed immediately)
- Hero sections (LCP content)
- Core UI components (buttons, inputs)

#### Syntax

```tsx
import dynamic from 'next/dynamic'

// Basic dynamic import
const HeavyComponent = dynamic(() => import('./HeavyComponent'))

// With loading state
const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { loading: () => <Skeleton /> }
)

// Disable SSR (for client-only components)
const ClientOnlyComponent = dynamic(
  () => import('./ClientOnlyComponent'),
  { ssr: false }
)

// Named export
const NamedExport = dynamic(
  () => import('./module').then(mod => mod.NamedExport)
)
```

---

## Implementation Checklist

### Phase 1: Quick Wins (5-10 min)

- [x] Remove deprecated `swcMinify` from `next.config.ts`
- [ ] Replace Framer Motion with CSS transitions in bottom nav
- [ ] Lazy load analytics charts

**Expected Savings:** ~160 KiB

### Phase 2: Component Optimization (30 min)

- [ ] Audit Framer Motion usage across all files
- [ ] Convert animations to CSS where possible
- [ ] Create lazy-loaded versions of heavy CMS blocks
- [ ] Implement `lazy-blocks-registry.tsx`

**Expected Savings:** ~80 KiB

### Phase 3: Deep Cleanup (1-2 hours)

- [ ] Run `ts-unused-exports` and remove dead code
- [ ] Run `ANALYZE=true npm run build` and analyze
- [ ] Remove unused dependencies from `package.json`
- [ ] Verify route-based code splitting is working

**Expected Savings:** ~50 KiB

---

## Verification & Monitoring

### 1. Build Size Check

```bash
npm run build
```

**Look for:**
```
Route (public)              Size      First Load JS
┌ ○ /                       5.2 kB     130 kB         ✅ Target < 170 KB
├ ○ /blog                   8.1 kB     135 kB
└ ● /admin/analytics        45 kB      180 kB         ⚠️ Admin can be heavier
```

### 2. Lighthouse Audit

```bash
npm run build
npm run start
npx lighthouse http://localhost:3000 --view
```

**Target Scores:**
- Performance: 90+
- Total JavaScript: < 200 KB (gzipped)

### 3. Bundle Analysis

```bash
ANALYZE=true npm run build
```

**Check for:**
- Largest modules (should be vendor libs, not your code)
- Duplicate dependencies
- Unexpected large files

---

## Common Issues & Solutions

### Issue 1: "Module not found" after dynamic import

**Error:**
```
Module not found: Can't resolve '@/components/HeavyComponent'
```

**Solution:**
```tsx
// ❌ Wrong: Missing file extension in some cases
const Component = dynamic(() => import('@/components/HeavyComponent'))

// ✅ Correct: Let Next.js resolve it
const Component = dynamic(() => import('@/components/HeavyComponent'))

// If still failing, use relative path
const Component = dynamic(() => import('../HeavyComponent'))
```

### Issue 2: Flash of loading state

**Problem:** Skeleton shows briefly even on fast connections.

**Solution:**
```tsx
// Add minimum delay
const Component = dynamic(
  () => new Promise(resolve => {
    setTimeout(() => {
      import('./Component').then(resolve)
    }, 300)
  }),
  { loading: () => <Skeleton /> }
)
```

### Issue 3: Type errors with dynamic imports

**Error:**
```
Type 'unknown' is not assignable to type 'ComponentType'
```

**Solution:**
```tsx
// ✅ Explicitly type the component
const Component = dynamic<ComponentProps>(
  () => import('./Component')
)
```

---

## Performance Targets

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| First-Party JS | 184 KiB | < 130 KiB | 🔴 Needs optimization |
| Total JS (gzipped) | ~350 KiB | < 200 KiB | 🔴 Needs optimization |
| LCP | 2.5s | < 2.5s | ✅ Good |
| Time to Interactive | 4.2s | < 3.5s | 🟡 Can improve |

---

## Resources

- [Next.js Dynamic Imports](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading)
- [Web.dev Code Splitting](https://web.dev/code-splitting-suspense/)
- [Webpack Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [React Performance Optimization](https://react.dev/learn/render-and-commit#optimizing-rendering-performance)

---

## Questions?

If bundle size remains high after following this guide:

1. Run `ANALYZE=true npm run build` and share the bundle analyzer screenshot
2. Check for duplicate dependencies with `npm ls <package-name>`
3. Verify that dynamic imports are actually working (check Network tab in DevTools)

**Last Updated:** 2026-02-10
**Next Review:** After implementing Phase 1-3 optimizations
