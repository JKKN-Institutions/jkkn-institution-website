# Performance Optimization Guide

## Forced Reflow Prevention

This document outlines best practices to prevent forced reflows (also called layout thrashing) in the JKKN website.

---

## What is a Forced Reflow?

A **forced reflow** occurs when JavaScript reads layout properties (like `offsetWidth`, `scrollHeight`) after modifying the DOM, forcing the browser to synchronously recalculate styles and layout.

### Why It's Bad

- **Performance**: Each forced reflow can take 10-100ms
- **Jank**: Causes choppy animations (drops below 60fps)
- **Battery**: Increases CPU usage on mobile devices
- **UX**: Degrades user experience

---

## Common Causes

### 1. Reading Layout Properties in Animation Loops

❌ **BAD** - Forced reflow on every frame:
```typescript
useEffect(() => {
  if (!contentRef.current) return

  const contentWidth = contentRef.current.scrollWidth // 🚨 FORCED REFLOW

  if (scrollOffset > contentWidth) {
    setScrollOffset(0)
  }
}, [scrollOffset]) // Runs 60 times per second during animation
```

✅ **GOOD** - Cache the measurement:
```typescript
const contentWidthRef = useRef<number>(0)

// Measure once on mount and resize only
useEffect(() => {
  if (!contentRef.current) return

  const measureWidth = () => {
    if (contentRef.current) {
      contentWidthRef.current = contentRef.current.scrollWidth
    }
  }

  measureWidth()

  const handleResize = () => {
    requestAnimationFrame(measureWidth)
  }

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

// Use cached value
useEffect(() => {
  if (scrollOffset > contentWidthRef.current) {
    setScrollOffset(0)
  }
}, [scrollOffset])
```

### 2. Reading After Writing (Layout Thrashing)

❌ **BAD** - Write then read in a loop:
```typescript
items.forEach(item => {
  item.style.width = '100px'           // Write (invalidates layout)
  const height = item.offsetHeight     // Read (forces reflow)
  item.style.height = height + 'px'    // Write (invalidates again)
})
```

✅ **GOOD** - Batch reads and writes:
```typescript
// 1. Read all measurements first
const heights = items.map(item => item.offsetHeight)

// 2. Then apply all writes
items.forEach((item, i) => {
  item.style.width = '100px'
  item.style.height = heights[i] + 'px'
})
```

### 3. IntersectionObserver Without Batching

❌ **BAD** - Immediate state update:
```typescript
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    setIsVisible(true) // Immediate reflow
  }
})
```

✅ **GOOD** - Batch with requestAnimationFrame:
```typescript
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    requestAnimationFrame(() => {
      setIsVisible(true) // Batched with next paint
    })
  }
})
```

---

## Layout Properties That Trigger Reflow

### Geometry Properties (Read)
- `offsetWidth`, `offsetHeight`, `offsetTop`, `offsetLeft`
- `clientWidth`, `clientHeight`, `clientTop`, `clientLeft`
- `scrollWidth`, `scrollHeight`, `scrollTop`, `scrollLeft`
- `getBoundingClientRect()`
- `getComputedStyle()`

### Style Properties (Write)
- Changing `width`, `height`, `margin`, `padding`, `border`
- Changing `display`, `position`, `float`
- Adding/removing classes that affect layout
- Modifying the DOM structure

---

## Best Practices

### 1. Cache Layout Measurements

```typescript
// ✅ Store in a ref, not state (avoids re-renders)
const dimensionsRef = useRef({ width: 0, height: 0 })

useEffect(() => {
  if (elementRef.current) {
    dimensionsRef.current = {
      width: elementRef.current.offsetWidth,
      height: elementRef.current.offsetHeight,
    }
  }
}, []) // Measure once on mount
```

### 2. Use CSS Transforms Instead of Layout Properties

❌ **BAD** - Animating layout properties:
```typescript
element.style.left = scrollX + 'px' // Triggers layout
element.style.top = scrollY + 'px'  // Triggers layout
```

✅ **GOOD** - Animate transforms:
```typescript
element.style.transform = `translate(${scrollX}px, ${scrollY}px)` // GPU-accelerated
```

### 3. Use CSS Variables for Dynamic Values

```typescript
// Set CSS variable (doesn't trigger layout)
document.documentElement.style.setProperty('--scroll-width', width + 'px')
```

```css
.marquee {
  width: var(--scroll-width);
  /* Animation uses cached value */
}
```

### 4. Batch requestAnimationFrame Callbacks

```typescript
let rafId: number | null = null

const scheduleUpdate = () => {
  if (rafId !== null) return // Already scheduled

  rafId = requestAnimationFrame(() => {
    // Batch all DOM reads here
    const width = element.offsetWidth
    const height = element.offsetHeight

    // Then batch all DOM writes
    element.style.transform = `scale(${width / 100})`

    rafId = null
  })
}
```

### 5. Debounce Resize Handlers

```typescript
useEffect(() => {
  let resizeTimer: NodeJS.Timeout

  const handleResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      // Expensive layout read
      measureDimensions()
    }, 150) // Wait 150ms after resize stops
  }

  window.addEventListener('resize', handleResize)
  return () => {
    window.removeEventListener('resize', handleResize)
    clearTimeout(resizeTimer)
  }
}, [])
```

### 6. Use `will-change` for Animations

```css
.animated-element {
  /* Hint to browser to optimize this property */
  will-change: transform;
}

/* Remove after animation */
.animated-element.done {
  will-change: auto;
}
```

### 7. Cleanup Animation Frames

```typescript
useEffect(() => {
  let rafId: number

  const animate = () => {
    // Animation logic
    rafId = requestAnimationFrame(animate)
  }

  rafId = requestAnimationFrame(animate)

  return () => {
    if (rafId) {
      cancelAnimationFrame(rafId) // ✅ Always cleanup
    }
  }
}, [])
```

---

## Performance Checklist

Before deploying animation components:

- [ ] Layout reads are cached (not in loops)
- [ ] Animations use `transform` and `opacity` only
- [ ] IntersectionObserver callbacks are batched with `requestAnimationFrame`
- [ ] Resize handlers are debounced
- [ ] Animation frames are cleaned up on unmount
- [ ] `will-change` is used for animated properties
- [ ] No layout properties in `useEffect` with animation dependencies

---

## Testing for Forced Reflows

### Chrome DevTools

1. Open DevTools → **Performance** tab
2. Click **Record** and interact with your animation
3. Stop recording
4. Look for **purple bars** labeled "Forced reflow" or "Layout"
5. Click on them to see the call stack

### React DevTools Profiler

1. Open React DevTools → **Profiler** tab
2. Click **Record** and interact
3. Stop and analyze render times
4. Look for components re-rendering >60 times/second

### Performance API

```typescript
// Add to development builds
if (process.env.NODE_ENV === 'development') {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 16) { // More than 1 frame (60fps)
        console.warn('Long task detected:', entry)
      }
    }
  })
  observer.observe({ entryTypes: ['measure'] })
}
```

---

## Fixed Components (2026-02-10)

The following components have been optimized to prevent forced reflows:

1. ✅ **EngineeringPlacementsSection** - Cached `scrollWidth` measurement
2. ✅ **StatsSection** - Double-buffered IntersectionObserver
3. ✅ **StatsCounter** - Added animation frame cleanup
4. ✅ **AnimatedCounter** - Batched visibility state updates
5. ✅ **NewsTicker** - Debounced content width measurement
6. ✅ **FAQSectionBlock** - Batched accordion height reads

---

## Additional Resources

- [Google Web Fundamentals - Avoid Large, Complex Layouts](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing)
- [Paul Irish - What Forces Layout/Reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
- [MDN - requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [Web.dev - Optimize Long Tasks](https://web.dev/optimize-long-tasks/)

---

## JavaScript Bundle Optimization

For comprehensive JavaScript bundle size optimization strategies, see:

📄 **[Bundle Optimization Guide](./BUNDLE-OPTIMIZATION-GUIDE.md)**

This guide covers:
- Lazy loading heavy dependencies (Recharts, Framer Motion)
- Code splitting strategies
- Removing unused code
- Dynamic imports best practices
- Tree-shaking optimization

**Quick Wins:**
- Replace Framer Motion with CSS transitions: **-60 KiB**
- Lazy load analytics charts: **-100 KiB**
- Implement lazy CMS blocks: **-50 KiB**

---

## Questions?

If you encounter performance issues:

1. Check this guide for common patterns
2. Use Chrome DevTools Performance tab to identify the culprit
3. Follow the optimization patterns above
4. Test with React DevTools Profiler
5. For bundle size issues, see [Bundle Optimization Guide](./BUNDLE-OPTIMIZATION-GUIDE.md)

**Last Updated**: 2026-02-10
**Optimizations Applied**:
- Engineering website forced reflow fixes
- JavaScript bundle optimization guide created
