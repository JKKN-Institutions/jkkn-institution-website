# Bundle Optimization Migration Guide

This document guides you through migrating heavy components to lazy-loaded versions to reduce JavaScript execution time from 1.3s to < 600ms.

## Overview

**Problem:** Large libraries (Monaco Editor, TipTap, Recharts) are bundled into the main chunk, causing 1.3s JavaScript execution time.

**Solution:** Dynamic imports with lazy loading - only load heavy components when needed.

**Expected Impact:**
- **Initial bundle reduction:** ~1.2MB → ~400KB (67% reduction)
- **JavaScript execution time:** 1.3s → ~500-600ms (54% improvement)
- **Time to Interactive:** 2-3s improvement
- **First Contentful Paint:** 300-500ms improvement

---

## 📦 Lazy-Loaded Components Created

### 1. Code Editor (Monaco) - ~500KB savings

**Before:**
```tsx
import { CodeEditor } from '@/components/cms/code-editor'
```

**After:**
```tsx
import { CodeEditor } from '@/components/cms/code-editor.lazy'
```

**Used in:**
- `app/(admin)/admin/content/components/new/component-form.tsx`
- `app/(admin)/admin/content/components/[id]/edit/edit-component-form.tsx`
- `app/(admin)/admin/preview-capture/custom/page.tsx`

**Migration:** Replace import path, no other changes needed.

---

### 2. Rich Text Editor (TipTap) - ~400KB savings

**Before:**
```tsx
import { RichTextEditor } from '@/components/ui/rich-text-editor'
```

**After:**
```tsx
import { RichTextEditor } from '@/components/ui/rich-text-editor.lazy'
```

**Used in:**
- `app/(admin)/admin/content/blog/new/page.tsx`
- `app/(admin)/admin/content/blog/[id]/edit/page.tsx`
- `app/(admin)/admin/content/blog/life-at-jkkn/new/page.tsx`
- `app/(admin)/admin/content/blog/life-at-jkkn/[id]/edit/page.tsx`
- `components/page-builder/elementor/inline-editor.tsx`

**Migration:** Replace import path, no other changes needed.

---

### 3. Analytics Charts (Recharts) - ~300KB savings

**Before:**
```tsx
import { PageviewsChart } from '@/components/analytics/charts/pageviews-chart'
import { UserGrowthChart } from '@/components/analytics/charts/user-growth-chart'
```

**After:**
```tsx
import { PageviewsChart, UserGrowthChart } from '@/components/analytics/charts/index.lazy'
```

**Used in:**
- `app/(admin)/admin/analytics/page.tsx`
- `app/(admin)/admin/analytics/visitors/page.tsx`
- `app/(admin)/admin/analytics/users/page.tsx`
- `app/(admin)/admin/analytics/content/page.tsx`
- `app/(admin)/admin/analytics/engagement/page.tsx`

**Migration:** Update imports to use centralized lazy index.

---

## 🔧 Step-by-Step Migration

### Phase 1: Update Code Editor Imports (5 files)

```bash
# Find all files using CodeEditor
grep -r "from '@/components/cms/code-editor'" --include="*.tsx" --include="*.ts"
```

**Files to update:**
1. `app/(admin)/admin/content/components/new/component-form.tsx`
2. `app/(admin)/admin/content/components/[id]/edit/edit-component-form.tsx`
3. `app/(admin)/admin/preview-capture/custom/page.tsx`
4. Any other files importing code-editor

**Change:**
```diff
- import { CodeEditor } from '@/components/cms/code-editor'
+ import { CodeEditor } from '@/components/cms/code-editor.lazy'
```

---

### Phase 2: Update Rich Text Editor Imports (10+ files)

```bash
# Find all files using RichTextEditor
grep -r "from '@/components/ui/rich-text-editor'" --include="*.tsx" --include="*.ts"
```

**Files to update:**
1. All blog edit pages
2. Page builder inline editor
3. Any other content editors

**Change:**
```diff
- import { RichTextEditor } from '@/components/ui/rich-text-editor'
+ import { RichTextEditor } from '@/components/ui/rich-text-editor.lazy'
```

---

### Phase 3: Update Analytics Chart Imports (5 files)

```bash
# Find all files using Recharts
grep -r "from '@/components/analytics/charts/" --include="*.tsx" --include="*.ts"
```

**Files to update:**
1. `app/(admin)/admin/analytics/page.tsx`
2. All analytics sub-pages

**Change:**
```diff
- import { PageviewsChart } from '@/components/analytics/charts/pageviews-chart'
- import { UserGrowthChart } from '@/components/analytics/charts/user-growth-chart'
+ import {
+   PageviewsChart,
+   UserGrowthChart,
+ } from '@/components/analytics/charts/index.lazy'
```

---

## 🚀 Testing After Migration

### 1. Development Build Test

```bash
npm run dev
```

**Verify:**
- [ ] Code editor pages load correctly (may show loading skeleton briefly)
- [ ] Blog editor loads correctly
- [ ] Analytics charts render properly
- [ ] No console errors

### 2. Production Build Test

```bash
npm run build
npm run start
```

**Verify:**
- [ ] Build completes successfully
- [ ] Check bundle sizes in build output
- [ ] Initial JS chunk < 200KB
- [ ] Monaco chunk separate (~500KB)
- [ ] TipTap chunk separate (~400KB)

### 3. Bundle Analysis

```bash
ANALYZE=true npm run build
```

**Expected bundle structure:**
```
Page                                       Size     First Load JS
┌ ○ /                                     15 kB          150 kB
├ ○ /admin/content/blog/new              25 kB          550 kB  ← TipTap chunk
├ ○ /admin/content/components/new        20 kB          650 kB  ← Monaco chunk
├ ○ /admin/analytics                     18 kB          450 kB  ← Recharts chunk
```

### 4. Performance Testing

Use Lighthouse or PageSpeed Insights:

**Before optimization:**
- JavaScript execution time: 1.3s
- Time to Interactive: ~4s
- First Contentful Paint: ~2s

**After optimization (expected):**
- JavaScript execution time: 500-600ms
- Time to Interactive: ~1.5-2s
- First Contentful Paint: ~1.2s

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Cannot find module" errors

**Cause:** Import path not updated correctly

**Solution:**
```tsx
// ❌ Wrong
import { CodeEditor } from '@/components/cms/code-editor'

// ✅ Correct
import { CodeEditor } from '@/components/cms/code-editor.lazy'
```

### Issue 2: Flash of loading skeleton in production

**Cause:** Normal behavior for dynamic imports

**Solution:** This is expected. The skeleton shows briefly (50-200ms) while the chunk loads. This is better than blocking the entire page load.

### Issue 3: Hydration mismatch warnings

**Cause:** SSR/CSR content mismatch with dynamic components

**Solution:** Lazy components have `ssr: false`, so this shouldn't occur. If it does, check for other hydration issues.

### Issue 4: Build still large after migration

**Cause:** Old imports not fully replaced

**Solution:**
```bash
# Search for old imports
grep -r "from '@/components/cms/code-editor'" --include="*.tsx"
grep -r "from '@/components/ui/rich-text-editor'" --include="*.tsx"

# Should only find the .lazy.tsx files themselves
```

---

## 📊 Performance Metrics to Track

### Before Migration (Baseline)
```
JavaScript Execution Time:     1,334 ms (main chunk)
Total Bundle Size:             ~1.5 MB (gzipped: ~400KB)
Time to Interactive:           ~4s
First Contentful Paint:        ~2s
```

### After Migration (Target)
```
JavaScript Execution Time:     500-600 ms (reduced 54%)
Total Bundle Size:             ~800 KB (gzipped: ~200KB)
Time to Interactive:           ~1.5-2s (improved 50%)
First Contentful Paint:        ~1.2s (improved 40%)
```

### Route-Specific Metrics

| Route | Before | After | Improvement |
|-------|--------|-------|-------------|
| Homepage | 1.3s JS | 500ms JS | 62% faster |
| Admin Dashboard | 1.5s JS | 600ms JS | 60% faster |
| Blog Editor | 1.8s JS | 1.2s JS | 33% faster (still loads TipTap) |
| Code Editor | 2.1s JS | 1.5s JS | 29% faster (still loads Monaco) |

---

## 🎯 Next Steps After Migration

### 1. Verify with Bundle Analyzer

```bash
ANALYZE=true npm run build
```

Check the treemap visualization for:
- ✅ Monaco in separate chunk
- ✅ TipTap in separate chunk
- ✅ Recharts in separate chunk
- ✅ Main bundle < 200KB

### 2. Run Lighthouse Audit

```bash
lighthouse https://engg.jkkn.ac.in --view
```

Target scores:
- Performance: > 90
- LCP: < 2.5s
- INP: < 200ms
- CLS: < 0.1

### 3. Production Deployment

After verifying locally:
```bash
git add .
git commit -m "perf: implement lazy loading for heavy components

- Dynamic import Monaco Editor (~500KB savings)
- Dynamic import TipTap Editor (~400KB savings)
- Dynamic import Recharts (~300KB savings)
- Update webpack splitChunks configuration
- Add optimizePackageImports for Radix UI

Expected impact: 54% reduction in JS execution time"

git push
```

### 4. Monitor Production Metrics

After deployment, monitor:
- Real User Monitoring (RUM) metrics
- Google PageSpeed Insights scores
- Core Web Vitals in Google Search Console
- User-reported performance issues

---

## 🔍 Troubleshooting

### Debugging Lazy Load Issues

```tsx
// Add error boundary
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary fallback={<div>Failed to load editor</div>}>
  <CodeEditor value={code} onChange={setCode} />
</ErrorBoundary>
```

### Check Chunk Loading

```tsx
// In browser console
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('.js'))
  .forEach(r => console.log(r.name, r.transferSize))
```

### Verify Code Splitting

```bash
# Check build output for correct chunk names
npm run build | grep -E "(monaco|tiptap|recharts)"
```

---

## 📝 Migration Checklist

- [ ] Created lazy-loaded wrapper components
- [ ] Updated next.config.ts with webpack chunks
- [ ] Updated all Code Editor imports
- [ ] Updated all Rich Text Editor imports
- [ ] Updated all Analytics Chart imports
- [ ] Tested in development
- [ ] Tested production build
- [ ] Ran bundle analyzer
- [ ] Ran Lighthouse audit
- [ ] Verified no regressions
- [ ] Deployed to production
- [ ] Monitored production metrics

---

## 📚 Additional Resources

- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [React.lazy() Documentation](https://react.dev/reference/react/lazy)
- [Web.dev Code Splitting Guide](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting)
- [Webpack SplitChunks](https://webpack.js.org/plugins/split-chunks-plugin/)

---

**Last Updated:** 2026-02-10
**Migration Status:** Ready for implementation
**Expected Completion Time:** 30-45 minutes
