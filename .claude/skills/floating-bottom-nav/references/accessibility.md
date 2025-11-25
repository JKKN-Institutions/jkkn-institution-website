# Accessibility Checklist for Bottom Navigation

## WCAG 2.1 AA Compliance

### Perceivable

#### 1. Color Contrast
- [ ] Text has 4.5:1 contrast ratio against background
- [ ] Icons have 3:1 contrast ratio against background
- [ ] Active states are distinguishable without color alone
- [ ] Focus indicators have 3:1 contrast ratio

#### 2. Text Alternatives
- [ ] All icons have text labels OR aria-label
- [ ] Decorative icons have `aria-hidden="true"`
- [ ] Badge counts have screen reader text

#### 3. Adaptable
- [ ] Navigation works in portrait and landscape
- [ ] Labels are visible or announced by screen readers
- [ ] Structure is conveyed programmatically (`role="navigation"`)

### Operable

#### 4. Keyboard Accessible
- [ ] All items reachable via Tab key
- [ ] Enter/Space activates focused item
- [ ] Focus order matches visual order
- [ ] No keyboard traps
- [ ] Arrow keys work within navigation (optional)

#### 5. Focus Visible
- [ ] Focus indicator is visible
- [ ] Focus indicator has sufficient contrast
- [ ] Focus style doesn't rely on color alone

#### 6. Touch Target Size
- [ ] Minimum 44x44px touch target (WCAG 2.5.5)
- [ ] Adequate spacing between targets (8px minimum)
- [ ] Targets don't overlap

#### 7. Motion
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No content flashes more than 3 times per second
- [ ] Auto-playing animations can be paused

### Understandable

#### 8. Predictable
- [ ] Navigation appears in consistent location
- [ ] Similar items behave similarly
- [ ] No unexpected context changes on focus

#### 9. Input Assistance
- [ ] Current location is indicated (`aria-current="page"`)
- [ ] Error states are clearly communicated
- [ ] Interactive elements look interactive

### Robust

#### 10. Compatible
- [ ] Valid HTML markup
- [ ] Proper use of ARIA roles and properties
- [ ] Works with assistive technologies

---

## Implementation Checklist

### Semantic HTML

```html
<!-- Correct structure -->
<nav role="navigation" aria-label="Main navigation">
  <button aria-current="page">
    <span aria-hidden="true">[icon]</span>
    <span>Home</span>
  </button>
  <!-- more buttons -->
</nav>
```

### Required ARIA Attributes

| Attribute | Usage |
|-----------|-------|
| `role="navigation"` | On the nav container |
| `aria-label="..."` | Describes the navigation purpose |
| `aria-current="page"` | On the active navigation item |
| `aria-hidden="true"` | On decorative icons |
| `aria-expanded` | On expandable FAB buttons |
| `aria-haspopup="menu"` | On buttons that open menus |

### Screen Reader Announcements

#### Tab Changes
```tsx
// Announce when tab changes
const [activeTab, setActiveTab] = useState('home');

return (
  <>
    {/* Hidden live region for announcements */}
    <div 
      aria-live="polite" 
      aria-atomic="true"
      className="sr-only"
    >
      {activeTab === 'home' && 'Home tab selected'}
      {activeTab === 'search' && 'Search tab selected'}
    </div>
    
    <nav>...</nav>
  </>
);
```

#### Badge Counts
```tsx
// Screen reader friendly badge
<span className="badge" aria-label="3 notifications">
  <span aria-hidden="true">3</span>
</span>
```

### Focus Management

```css
/* Visible focus indicator */
.nav-item:focus-visible {
  outline: 2px solid #2196F3;
  outline-offset: 2px;
}

/* Remove default focus ring when using custom */
.nav-item:focus:not(:focus-visible) {
  outline: none;
}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .nav-item {
    transition: none !important;
    animation: none !important;
  }
}
```

```tsx
// React hook for motion preference
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);
    
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
}
```

---

## Testing Checklist

### Manual Testing

1. **Keyboard Navigation**
   - [ ] Tab through all navigation items
   - [ ] Activate items with Enter and Space
   - [ ] Check focus order is logical
   - [ ] Test Escape to close menus

2. **Screen Reader Testing**
   - [ ] Test with VoiceOver (macOS/iOS)
   - [ ] Test with NVDA or JAWS (Windows)
   - [ ] Test with TalkBack (Android)
   - [ ] Verify all items are announced
   - [ ] Check current page is announced

3. **Zoom Testing**
   - [ ] Works at 200% zoom
   - [ ] Works at 400% zoom
   - [ ] Text reflows properly

4. **Color Testing**
   - [ ] Test with color blindness simulators
   - [ ] Verify active states without color
   - [ ] Check in high contrast mode

### Automated Testing

```bash
# Recommended tools
npm install -D axe-core @axe-core/react jest-axe
```

```tsx
// Jest accessibility test example
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FloatingTabBar } from './FloatingTabBar';

expect.extend(toHaveNoViolations);

test('navigation has no accessibility violations', async () => {
  const { container } = render(
    <FloatingTabBar items={testItems} />
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Common Issues & Fixes

### Issue: Icon-only buttons not accessible
**Fix:** Add `aria-label` or visible text
```tsx
<button aria-label="Home">
  <HomeIcon aria-hidden="true" />
</button>
```

### Issue: Active state only indicated by color
**Fix:** Add additional indicator (underline, filled icon, text weight)
```tsx
<button className={active ? 'text-blue-500 font-bold' : 'text-gray-500'}>
  <HomeIcon className={active ? 'fill-current' : 'stroke-current'} />
  Home
</button>
```

### Issue: FAB menu not keyboard accessible
**Fix:** Manage focus when opened/closed
```tsx
useEffect(() => {
  if (isOpen) {
    firstActionRef.current?.focus();
  } else {
    triggerRef.current?.focus();
  }
}, [isOpen]);
```

### Issue: Touch targets too small
**Fix:** Ensure minimum 44x44px
```css
.nav-item {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```
