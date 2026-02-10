# CSS Animation Patterns

Replace Framer Motion with performant CSS animations for simple use cases.

---

## Why CSS Over JavaScript Animations?

### Performance Benefits
- **GPU Accelerated**: `transform` and `opacity` use hardware acceleration
- **Smaller Bundle**: No 100KB library overhead
- **Better Performance**: No JavaScript execution needed
- **Smoother**: Runs on compositor thread (no main-thread blocking)

### When to Use CSS
- ✅ Fade in/out
- ✅ Slide in (up/down/left/right)
- ✅ Scale animations
- ✅ Rotate animations
- ✅ Simple stagger effects
- ✅ Loading states

### When to Keep Framer Motion
- ❌ Complex spring physics
- ❌ Gesture-based animations (drag, swipe)
- ❌ Sequence animations with dependencies
- ❌ Dynamic animations based on runtime calculations

---

## Common Patterns

### 1. Fade In

```tsx
// ❌ Framer Motion (100KB)
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {content}
</motion.div>

// ✅ CSS Animation (0KB)
<div className="animate-fade-in">
  {content}
</div>
```

**Tailwind Config** (add to `tailwind.config.ts`):
```ts
animation: {
  'fade-in': 'fadeIn 0.5s ease-out',
}
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  }
}
```

---

### 2. Slide In (Up)

```tsx
// ❌ Framer Motion
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {content}
</motion.div>

// ✅ CSS Animation
<div className="animate-slide-in-up">
  {content}
</div>
```

**Tailwind Config**:
```ts
animation: {
  'slide-in-up': 'slideInUp 0.6s ease-out',
}
keyframes: {
  slideInUp: {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  }
}
```

---

### 3. Scale In

```tsx
// ❌ Framer Motion
<motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.4 }}
>
  {content}
</motion.div>

// ✅ CSS Animation
<div className="animate-scale-in">
  {content}
</div>
```

**Tailwind Config**:
```ts
animation: {
  'scale-in': 'scaleIn 0.4s ease-out',
}
keyframes: {
  scaleIn: {
    '0%': { opacity: '0', transform: 'scale(0.9)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  }
}
```

---

### 4. Stagger Effect (IntersectionObserver)

For staggered children animations, use CSS with delay classes:

```tsx
// ❌ Framer Motion
<motion.div variants={container}>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={itemVariants}
      custom={i}
    >
      {item}
    </motion.div>
  ))}
</motion.div>

// ✅ CSS with IntersectionObserver
'use client'
import { useEffect, useRef, useState } from 'react'

export function StaggeredList({ items }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={isVisible ? 'animate-in' : 'opacity-0'}>
      {items.map((item, i) => (
        <div
          key={i}
          className="animate-slide-in-up"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}
```

**Tailwind Config**:
```ts
animation: {
  'slide-in-up': 'slideInUp 0.5s ease-out both',
}
```

---

### 5. Hover Effects

```tsx
// ❌ Framer Motion
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>

// ✅ CSS
<button className="transition-transform hover:scale-105 active:scale-95">
  Click me
</button>
```

---

### 6. Loading Spinner

```tsx
// ❌ Framer Motion
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
>
  <Loader />
</motion.div>

// ✅ CSS
<div className="animate-spin">
  <Loader />
</div>
```

**Built-in Tailwind**: `animate-spin`, `animate-pulse`, `animate-bounce`

---

## Complete Tailwind Config Reference

Add this to your `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      animation: {
        // Fade animations
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-out': 'fadeOut 0.5s ease-in',

        // Slide animations
        'slide-in-up': 'slideInUp 0.6s ease-out',
        'slide-in-down': 'slideInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',

        // Scale animations
        'scale-in': 'scaleIn 0.4s ease-out',
        'scale-out': 'scaleOut 0.4s ease-in',

        // Combined effects
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',

        // Special effects
        'bounce-in': 'bounceIn 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        // Fade
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },

        // Slide
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },

        // Scale
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },

        // Combined
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },

        // Special
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
      },
    },
  },
}

export default config
```

---

## IntersectionObserver Hook

Reusable hook for scroll-triggered animations:

```tsx
// hooks/use-in-view.ts
'use client'

import { useEffect, useRef, useState } from 'react'

export function useInView(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect() // Trigger once
        }
      },
      { threshold: 0.1, ...options }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [options])

  return { ref, isInView }
}
```

**Usage**:
```tsx
export function AnimatedSection() {
  const { ref, isInView } = useInView()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
    >
      {content}
    </div>
  )
}
```

---

## Migration Guide

### Step 1: Identify Simple Animations

Audit components using Framer Motion:
```bash
grep -r "from 'framer-motion'" components/
```

### Step 2: Categorize

- **Simple** → Replace with CSS
  - Fade, slide, scale
  - Hover effects
  - Loading states

- **Complex** → Keep Framer Motion
  - Drag gestures
  - Spring physics
  - Complex sequences

### Step 3: Replace

For each simple animation:
1. Remove Framer Motion import
2. Replace `<motion.div>` with `<div>`
3. Add Tailwind animation class
4. Use IntersectionObserver for scroll triggers

### Step 4: Verify

```bash
# Check bundle size reduction
ANALYZE=true npm run build
```

---

## Performance Checklist

- [ ] All simple animations use CSS
- [ ] IntersectionObserver used for scroll animations
- [ ] No `<motion.*>` components on public pages
- [ ] Framer Motion only in admin/page-builder
- [ ] Bundle size reduced by ~70-100KB
- [ ] Lighthouse Performance score improved
- [ ] No animation jank (60fps)

---

## Resources

- [CSS Triggers](https://csstriggers.com/) - What properties trigger layout/paint/composite
- [MDN: CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Web.dev: Animations Guide](https://web.dev/animations-guide/)

**Last Updated**: 2026-02-10
