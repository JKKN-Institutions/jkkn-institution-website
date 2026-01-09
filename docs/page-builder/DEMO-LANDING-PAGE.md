# 🎨 Demo Landing Page - Feature Showcase

## Overview

The **Demo Landing Page** preset is a comprehensive showcase of ALL page builder features and capabilities. It demonstrates:

- ✅ Transform controls (rotate, scale, skew, translate)
- ✅ Filter effects (blur, brightness, contrast, saturation, etc.)
- ✅ Advanced gradient builder with multi-stop gradients
- ✅ Glassmorphism effects with blur and transparency
- ✅ Entrance, hover, and scroll animations
- ✅ Complex nested layouts (Grid inside Flex)
- ✅ Enhanced typography (bullet lists, number lists, quotes)
- ✅ Page-level background gradients
- ✅ Responsive settings and custom CSS/classes

## How to Use

### 1. Access the Demo Preset

1. Open the page builder
2. Click the **"Templates"** or **"Presets"** button in the top toolbar
3. Find **"🎨 Demo Landing Page (All Features)"** in the Hero category
4. Click to apply it to your page

### 2. What You'll See

The demo page consists of **7 major sections**:

#### Section 1: Hero Section (Gradient Background)
- **Gradient:** Purple to pink diagonal gradient
- **Features:** Full-height hero container with glassmorphism-ready styling
- **Demonstrates:** Page-level gradient backgrounds, spacing controls

#### Section 2: Animated Stats Section
- **Background:** Light gray
- **Demonstrates:** Container with background color, padding controls

#### Section 3: Features Grid (Transform & Filters)
- **Layout:** 3-column grid (responsive: 1 column on mobile)
- **Features:**
  - **Card 1 (Transform):** Hover scale + rotate effects
  - **Card 2 (Filters):** Brightness, contrast, saturation applied
  - **Card 3 (Glassmorphism):** Frosted glass effect with backdrop blur
- **Demonstrates:**
  - Transform controls (rotate, scale)
  - Filter effects (brightness, contrast, saturate)
  - Glassmorphism with custom CSS
  - Entrance animations (fade-in-up with delays)
  - Hover animations (scale, rotate)

#### Section 4: Complex Nested Layouts
- **Background:** Ocean blue gradient
- **Structure:**
  ```
  Container (gradient background)
    └── FlexboxLayout (vertical, centered)
          ├── Heading (animated)
          └── GridLayout (2 columns)
                ├── RichText (bullet list style)
                └── RichText (quote style)
  ```
- **Demonstrates:**
  - Nested layouts (Flex → Grid)
  - Typography text styles (bullet-list, quote)
  - Glassmorphism on nested elements
  - Complex layout hierarchies

#### Section 5: Gradient Showcase
- **Layout:** 5-column grid of gradient samples
- **Gradients:**
  1. Sunset (Red → Yellow)
  2. Ocean (Blue → Cyan)
  3. Forest (Green → Teal)
  4. Purple Dream (Purple → Violet)
  5. Fire (Pink → Red)
- **Demonstrates:**
  - Advanced gradient builder capabilities
  - Staggered entrance animations (zoom-in with delays)
  - Hover scale effects on all cards
  - Shadow presets (xl)

#### Section 6: CTA Section (Transform Skew)
- **Background:** Pink gradient
- **Transform:** Skewed section (-2° on Y-axis)
- **Content:** Counter-skewed (+2°) to maintain readability
- **Demonstrates:**
  - Transform skew on containers
  - Counter-transforms for content
  - Bounce-in animations
  - Text shadows on headings
  - Multiple animation delays

## Features Demonstrated

### 🎨 Styling Features

#### 1. Transform Controls
```typescript
transform: {
  rotate: 0,        // -180 to 180 degrees
  scaleX: 1.05,     // 0.1 to 2
  scaleY: 1.05,     // 0.1 to 2
  skewX: 0,         // -45 to 45 degrees
  skewY: -2,        // -45 to 45 degrees
  translateX: 0,    // pixels
  translateY: 0,    // pixels
}
```

**Used in:**
- CTA section (skewY: -2)
- Content container (skewY: 2 counter-skew)
- Hover effects (hoverRotate: 2)

#### 2. Filter Effects
```typescript
filters: {
  blur: 0,           // 0-10px
  brightness: 110,   // 0-200%
  contrast: 105,     // 0-200%
  saturate: 110,     // 0-200%
  grayscale: 0,      // 0-100%
  hueRotate: 0,      // 0-360°
  invert: 0,         // 0-100%
  sepia: 0,          // 0-100%
}
```

**Used in:**
- Feature Card 2 (brightness: 110, contrast: 105, saturate: 110)

#### 3. Gradients
```typescript
background: {
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}
```

**Used in:**
- Hero section (purple gradient)
- Nested layouts section (ocean gradient)
- Gradient showcase (5 different gradients)
- CTA section (pink gradient)

#### 4. Glassmorphism
```css
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
background-color: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.3);
```

**Used in:**
- Feature Card 3
- Typography showcase cards (nested layouts)

#### 5. Typography Text Styles
```typescript
typography: {
  textStyle: 'bullet-list' | 'number-list' | 'quote' | 'normal'
}
```

**Used in:**
- RichText with bullet-list style
- RichText with quote style

### 🎬 Animation Features

#### 1. Entrance Animations
- `fade-in-up` - Cards and text
- `fade-in-down` - Headings
- `zoom-in` - Gradient boxes
- `bounce-in` - CTA buttons

**All with customizable:**
- Duration (0.5s - 1s)
- Delay (0s - 0.4s staggered)
- Easing

#### 2. Hover Animations
- `hoverScale: 1.05` - Scale up on hover
- `hoverScale: 1.1` - Larger scale
- `hoverRotate: 2` - Slight rotation

### 📐 Layout Features

#### 1. Container
- Background colors and gradients
- Padding/spacing controls
- Min-height settings
- Transform effects

#### 2. GridLayout
- Responsive columns (3→1, 5→2)
- Gap controls
- Nested grids

#### 3. FlexboxLayout
- Direction (column/row)
- Justify and align
- Gap controls
- Nested flex containers

### 🎯 Custom Styling

#### 1. Custom Classes
```typescript
custom_classes: 'max-w-7xl mx-auto px-8 min-h-[80vh]'
```

**Used throughout for:**
- Responsive containers
- Max-width constraints
- Utility classes

#### 2. Custom CSS
```typescript
custom_css: 'backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);'
```

**Used for:**
- Glassmorphism effects
- Browser-specific prefixes

## Editing the Demo

### How to Customize Each Section

1. **Select any block** in the page builder
2. **Right panel shows:**
   - **Properties** - Component-specific settings
   - **Typography** - Font, size, color, text styles
   - **Background** - Colors, gradients, images
   - **Spacing** - Padding, margin
   - **Border** - Width, radius, color
   - **Shadow** - Box shadow presets
   - **Transform** - Rotate, scale, skew, translate
   - **Filters** - Blur, brightness, contrast, etc.
   - **Motion** - Entrance, hover, scroll animations
   - **Code** - View generated code

### Recommended Experiments

#### 🔬 Try These Modifications:

1. **Change gradient colors** in Hero section
   - Select Container block
   - Go to Background → Gradient tab
   - Use Gradient Builder to create new colors

2. **Adjust transform effects** on Feature Cards
   - Select Feature Card 1
   - Go to Transform section
   - Change rotate, scale values
   - Preview hover effects

3. **Apply different filters** to Card 2
   - Select Feature Card 2
   - Go to Filters section
   - Adjust blur, grayscale, hue rotate

4. **Modify animations**
   - Select any block with animation
   - Go to Motion section
   - Change entrance animation type
   - Adjust duration and delay

5. **Test typography styles**
   - Select RichText blocks
   - Go to Typography section
   - Switch between normal, bullet-list, number-list, quote

## Page-Level Settings

The demo also demonstrates **page-level styling controls**:

### Access Page Settings
1. Click anywhere on canvas to deselect all blocks
2. Right panel switches to "Page Settings"
3. Find "Page Styling" accordion

### Page Styling Options
- **Background:** Color, gradient, or image for entire page
- **Glassmorphism:** Apply glass effect to whole page
- **Layout:** Min height, max width, padding

### Try This:
1. Set page background to a gradient
2. Enable page-level glassmorphism
3. See how it affects all content

## Code Structure

### Block Data Format

Each block in the preset follows this structure:

```typescript
{
  component_name: 'Card',           // Component type
  props: {                          // Component props
    title: 'Title',
    _styles: {                      // Styling object
      background: {...},
      spacing: {...},
      border: {...},
      shadow: {...},
      transform: {...},             // NEW!
      filters: {...},               // NEW!
    },
    _motion: {                      // Animation settings
      animation: 'fade-in-up',
      duration: '0.6s',
      delay: '0s',
      hoverScale: 1.05,
      hoverRotate: 2,
    },
  },
  sort_order: 3,                    // Position in tree
  is_visible: true,                 // Visibility toggle
  custom_classes: 'max-w-7xl',     // Tailwind classes
  custom_css: 'backdrop-filter...' // Custom CSS
}
```

## Technical Details

### Style Application Flow

1. **Block Props** → `_styles` object
2. **Style Applicator** → Converts to CSS properties
3. **React Inline Styles** → Applied to wrapper div
4. **Custom CSS** → Injected as `<style>` tag
5. **Custom Classes** → Applied to className
6. **Motion Effects** → Data attributes + CSS animations

### Performance Notes

- All gradients are CSS-based (no images)
- Animations use CSS keyframes (hardware-accelerated)
- Glassmorphism uses `backdrop-filter` (may impact performance on low-end devices)
- Transform effects are GPU-accelerated
- Filter effects are real-time CSS filters

## Browser Compatibility

### Full Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Partial Support (Glassmorphism)
- Safari requires `-webkit-backdrop-filter` prefix (included)
- Firefox on Linux may have reduced blur quality

### Fallbacks
- Glassmorphism degrades to semi-transparent background if backdrop-filter not supported
- All other features have full cross-browser support

## Best Practices

### ✅ Do's
- Use transform effects sparingly (don't over-rotate)
- Keep filter values subtle (avoid extreme brightness/contrast)
- Use entrance animations to guide user attention
- Test glassmorphism on different backgrounds
- Preview on multiple devices

### ❌ Don'ts
- Don't use too many different animations on one page
- Don't apply heavy filters to large images (performance)
- Don't skew text at extreme angles (readability)
- Don't use backdrop-filter on very complex backgrounds (performance)

## Next Steps

After exploring the demo:

1. **Create your own page** using these techniques
2. **Mix and match** different features
3. **Experiment with values** to find what works best
4. **Save custom presets** for your own reusable sections
5. **Share your creations** with the team

## Support

For questions or issues:
- Check the page builder documentation
- Review component schemas in `lib/cms/component-registry.ts`
- Examine style applicator in `components/page-builder/utils/style-applicator.ts`
- Test in preview mode before publishing

---

**Enjoy building amazing pages! 🚀**
