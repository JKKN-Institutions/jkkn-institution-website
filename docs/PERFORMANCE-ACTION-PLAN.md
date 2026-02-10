# Performance Optimization Action Plan

## Executive Summary

Based on PageSpeed Insights analysis, **295 KiB of unused JavaScript** can be eliminated through strategic optimizations.

**Current Status:**
- ❌ First-Party JS: 184.4 KiB (127.4 KiB unused)
- ❌ Google Tag Manager: 250.6 KiB (114.0 KiB unused)
- ❌ Facebook Pixel: 114.7 KiB (53.7 KiB unused)

**Target:**
- ✅ First-Party JS: < 130 KiB
- ✅ Total JS: < 200 KiB (gzipped)
- ✅ Performance Score: 90+

---

## Quick Start (Choose One)

### Option A: Full Optimization (2-3 hours)
Follow all phases sequentially for maximum impact.

### Option B: Critical Path Only (30 minutes)
Complete Phase 1 only for immediate 160 KiB savings.

---

## Phase 1: Immediate Wins (30 minutes) ⚡

**Expected Savings: 160 KiB**

### Step 1: Lazy Load Analytics Charts (15 min)

**Files to update:**
- `app/(admin)/admin/analytics/users/page.tsx`
- `app/(admin)/admin/analytics/content/page.tsx`
- `app/(admin)/admin/analytics/visitors/page.tsx`
- `app/(admin)/admin/analytics/engagement/page.tsx`

**Change:**
```diff
- import { UserGrowthChart } from '@/components/analytics/charts/user-growth-chart'
+ import { UserGrowthChart } from '@/components/analytics/charts/lazy-charts'
```

Apply this pattern to ALL chart imports in analytics pages.

**Savings:** 100 KiB (Recharts + dependencies)

---

### Step 2: Optimize Third-Party Scripts (10 min)

Already implemented:
- ✅ Google Analytics uses `lazyOnload`
- ✅ Meta Pixel uses interaction-based loading

**Optional: Remove Facebook Pixel (if not needed)**

Edit `app/(public)/layout.tsx`:
```diff
- <MetaPixel />
```

**Savings:** 53.7 KiB (if removed)

---

### Step 3: Build & Verify (5 min)

```bash
npm run build
```

**Expected output:**
```
Route (public)              Size      First Load JS
┌ ○ /                       5.2 kB     130 kB         ✅ Was ~160 KB
└ ● /admin/analytics        45 kB      180 kB         ✅ Was ~230 KB
```

**Phase 1 Complete! 🎉**

---

## Phase 2: Framer Motion Replacement (1 hour)

**Expected Additional Savings: 60 KiB**

### Step 4: Audit Framer Motion Usage

```bash
grep -r "from ['\""]framer-motion" --include="*.tsx" components/
```

**Priority replacements:**
1. Bottom navigation (public pages)
2. Simple hover effects
3. Scroll animations

**Keep Framer Motion for:**
- Complex animations (modal transitions)
- Page transitions
- Auth page animations (low traffic)

---

### Step 5: Replace with CSS

Use the optimized bottom nav as reference:

```tsx
// ❌ Before (Framer Motion)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  {children}
</motion.div>

// ✅ After (CSS)
<div className="animate-fadeInUp opacity-0">
  {children}
</div>
```

Add to `globals.css`:
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.3s ease-out forwards;
}
```

---

## Success Metrics

After Phase 1:
- [x] Build completes without errors
- [ ] Homepage loads < 130 KiB JS
- [ ] Admin analytics lazy loads charts
- [ ] No console errors

After Phase 2:
- [ ] Framer Motion only in necessary components
- [ ] Animations still smooth
- [ ] Total savings ~220 KiB

---

## Rollback

If anything breaks:
```bash
git checkout HEAD -- [file-that-broke]
npm run build
```

---

## Next Steps

1. Complete Phase 1 (mandatory)
2. Test in production
3. Monitor performance for 1 week
4. Proceed to Phase 2 if stable

---

**Created:** 2026-02-10
**Next Review:** After Phase 1 implementation
