# Navigation Patterns Reference

## Common Mobile Navigation Patterns

### 1. Standard Bottom Tab Bar
**Best for:** Apps with 3-5 main sections that users frequently switch between

**Characteristics:**
- Fixed to bottom of viewport
- Equal-width tabs
- Icon + label for each item
- Active state clearly indicated
- Persistent across all screens

**Example apps:** Instagram, Twitter, Facebook

**Implementation notes:**
- Keep to 3-5 items maximum
- Use recognizable icons
- Labels should be concise (1-2 words)
- Active indicator should be obvious (color change, filled icon)

### 2. Floating Tab Bar
**Best for:** Apps that want a modern, premium feel

**Characteristics:**
- Floats above content with margin from edges
- Rounded corners with subtle shadow
- Semi-transparent with blur effect
- Slightly elevated from bottom

**Example apps:** Many fintech and lifestyle apps

**Implementation notes:**
- Ensure enough contrast against varying backgrounds
- Consider safe area insets for notched devices
- Test blur performance on older devices

### 3. Tab Bar with Center Action
**Best for:** Apps where creating/adding is the primary action

**Characteristics:**
- Standard tab bar with elevated center button
- Center button is visually prominent
- Often uses a plus icon
- Button extends above the bar

**Example apps:** Instagram (before), Spotify, Reddit

**Implementation notes:**
- Center action should be the most common user action
- Button should be large enough to tap easily (56-64px)
- Consider animation on tap

### 4. Dock-Style Navigation
**Best for:** Desktop-like experiences on larger mobile devices

**Characteristics:**
- Icons expand/magnify on hover/focus
- Tooltip labels appear on interaction
- More compact, icon-only design
- Premium, macOS-inspired feel

**Implementation notes:**
- Works best on tablets and larger phones
- Touch targets must remain adequate
- Animation should be smooth and performant

### 5. Expandable FAB (Floating Action Button)
**Best for:** Secondary actions or creation workflows

**Characteristics:**
- Single button expands to reveal menu
- Actions fan out vertically or radially
- Backdrop overlay focuses attention
- Easily dismissible

**Example apps:** Google apps, Material Design apps

**Implementation notes:**
- Limit to 3-6 actions
- Actions should be related to creation/adding
- Include clear close affordance

## Pattern Selection Guide

| Scenario | Recommended Pattern |
|----------|---------------------|
| 3-5 equal-importance sections | Standard Tab Bar |
| Premium/modern aesthetic | Floating Tab Bar |
| Creation-focused app | Center Action Tab Bar |
| Desktop-like experience | Dock Navigation |
| Multiple secondary actions | Expandable FAB |
| Content-first (minimal chrome) | Floating Tab Bar or Hide on Scroll |

## Combining Patterns

### Tab Bar + FAB
Place FAB in bottom-right corner with tab bar at bottom. Ensure FAB doesn't overlap last tab item.

### Floating Tab Bar + Contextual FAB
FAB appears only on certain screens where actions are needed.

### Hide on Scroll
Tab bar hides when scrolling down, shows when scrolling up. Saves screen space for content.

## Anti-Patterns to Avoid

1. **Too Many Items:** More than 5 items in bottom nav
2. **Unlabeled Icons:** Icon-only on unfamiliar actions
3. **Poor Contrast:** Navigation blending into content
4. **Small Touch Targets:** Less than 44x44px tap areas
5. **No Active State:** User can't tell current location
6. **Blocking Content:** Navigation covering important UI
7. **Inconsistent Behavior:** Navigation appearing/disappearing unexpectedly

## Responsive Considerations

### Phone (< 640px)
- Use full-width bottom navigation
- Minimum 44px touch targets
- Consider hiding labels on smaller screens

### Tablet (640px - 1024px)
- Can use floating centered navigation
- Dock-style works well
- Consider side navigation alternative

### Desktop (> 1024px)
- Usually switch to top navigation
- Bottom nav can feel awkward
- Consider sidebar navigation

## Performance Tips

1. Use `will-change: transform` for animated elements
2. Prefer CSS transforms over position changes
3. Use `backdrop-filter` sparingly (GPU intensive)
4. Debounce scroll-based show/hide
5. Lazy load icons if using icon library
