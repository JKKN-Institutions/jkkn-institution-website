# Layout Presets for Non-Technical Users

This reference provides ready-to-use layout configurations that can be quickly assembled in the page builder.

## What are Layout Presets?

Layout presets are pre-configured combinations of components that create common page sections. Instead of adding and configuring individual components, use these presets for faster page building.

---

## Hero Presets

### 1. Hero with CTA (Standard)
**Best for:** Landing pages, home page, program pages

```
Components:
- HeroSection
  - title: "Your Main Headline"
  - subtitle: "Supporting text that explains the value"
  - backgroundImage: [upload or paste URL]
  - overlay: true (dark overlay for text readability)
  - height: "full" (100vh)
  - ctaButtons: [
      { label: "Primary Action", link: "/action", variant: "primary" },
      { label: "Learn More", link: "#features", variant: "secondary" }
    ]
```

**How to create:**
1. Drag "Hero Section" from Content category
2. Set title and subtitle
3. Upload background image
4. Add 1-2 buttons with links

### 2. Hero with Video Background
**Best for:** Modern landing pages, event pages

```
Components:
- HeroSection
  - title: "Headline"
  - backgroundVideo: "https://youtube.com/embed/..."
  - videoAutoplay: true
  - videoMuted: true
  - overlay: true
```

### 3. Split Hero (Image + Text)
**Best for:** About pages, product pages

```
Components:
- FlexboxLayout (direction: row, gap: 0)
  └── Container (width: 50%)
      └── TextEditor (heading + paragraph + button)
  └── ImageBlock (width: 50%, objectFit: cover)
```

---

## Content Section Presets

### 4. Features Grid (3 Columns)
**Best for:** Highlighting key benefits, services

```
Components:
- SectionWrapper (background: light gray, padding: large)
  └── Container (maxWidth: 1200px)
      └── Heading (text: "Our Features", level: H2, alignment: center)
      └── Spacer (height: 40px)
      └── GridLayout (columns: 3, gap: 32px)
          └── Feature Card 1 (icon + title + description)
          └── Feature Card 2
          └── Feature Card 3
```

**Quick setup:**
1. Add Section Wrapper (set background)
2. Add Container inside
3. Add Heading (H2, centered)
4. Add Grid Layout (3 columns)
5. Add 3 Call-to-Action blocks inside grid (card style)

### 5. Two-Column Text + Image
**Best for:** About sections, explanations

```
Components:
- SectionWrapper
  └── Container
      └── FlexboxLayout (direction: row, align: center, gap: 64px)
          └── Container (flex: 1)
              └── Heading (H2)
              └── TextEditor (paragraphs)
              └── CallToAction (buttons only)
          └── ImageBlock (flex: 1, rounded corners)
```

### 6. Stats Bar
**Best for:** Social proof, achievements

```
Components:
- SectionWrapper (background: brand color)
  └── StatsCounter
      - layout: "row"
      - stats: [
          { value: 5000, suffix: "+", label: "Students", icon: "users" },
          { value: 50, suffix: "+", label: "Programs", icon: "book" },
          { value: 95, suffix: "%", label: "Placement Rate", icon: "award" },
          { value: 30, suffix: "+", label: "Years", icon: "calendar" }
        ]
```

---

## Testimonial Presets

### 7. Testimonial Carousel
**Best for:** Customer reviews, student testimonials

```
Components:
- SectionWrapper (padding: large)
  └── Container
      └── Heading (H2, centered: "What Our Students Say")
      └── Testimonials
          - layout: "carousel"
          - autoplay: true
          - showRating: true
          - items: [
              { quote: "...", author: "Name", role: "Role", avatar: "url" },
              ...
            ]
```

### 8. Testimonial Grid
**Best for:** Multiple testimonials displayed at once

```
Components:
- Testimonials
  - layout: "grid"
  - columns: 3
  - items: [...]
```

---

## FAQ Presets

### 9. FAQ Section with Search
**Best for:** Help pages, program FAQ

```
Components:
- SectionWrapper
  └── Container (maxWidth: 800px)
      └── Heading (H2, centered: "Frequently Asked Questions")
      └── FAQAccordion
          - showSearch: true
          - allowMultiple: true
          - items: [
              { question: "Q1?", answer: "A1" },
              { question: "Q2?", answer: "A2" },
              ...
            ]
```

---

## Gallery Presets

### 10. Image Gallery Grid
**Best for:** Photo galleries, campus photos

```
Components:
- SectionWrapper
  └── Container
      └── Heading (H2)
      └── ImageGallery
          - layout: "grid"
          - columns: 4
          - gap: 16
          - lightbox: true
          - images: [...]
```

### 11. Image Carousel (Full Width)
**Best for:** Featured images, banners

```
Components:
- ImageCarousel
  - images: [...]
  - autoplay: true
  - interval: 5000
  - showDots: true
  - showArrows: true
```

---

## CTA Presets

### 12. CTA Banner (Full Width)
**Best for:** Page endings, conversion sections

```
Components:
- SectionWrapper (background: gradient or brand color)
  └── Container (maxWidth: 800px, textAlign: center)
      └── CallToAction
          - title: "Ready to Get Started?"
          - description: "Join thousands of students..."
          - variant: "centered"
          - buttons: [
              { label: "Apply Now", link: "/apply", variant: "primary" },
              { label: "Contact Us", link: "/contact", variant: "secondary" }
            ]
```

### 13. CTA with Image
**Best for:** Feature promotion

```
Components:
- FlexboxLayout (direction: row, align: center)
  └── Container (flex: 1)
      └── CallToAction (left aligned)
  └── ImageBlock (flex: 1)
```

---

## Team/Directory Presets

### 14. Faculty Grid
**Best for:** About pages, department pages

```
Components:
- SectionWrapper
  └── Container
      └── Heading (H2: "Our Faculty")
      └── FacultyDirectory
          - layout: "grid"
          - columns: 4
          - showDepartment: true
          - showEmail: true
          - department: "all" or specific filter
```

### 15. Leadership Team
**Best for:** About page leadership section

```
Components:
- FacultyDirectory
  - layout: "featured"
  - limit: 4
  - filter: "leadership"
```

---

## Timeline/History Presets

### 16. Institution Timeline
**Best for:** History pages, milestones

```
Components:
- SectionWrapper
  └── Container (maxWidth: 900px)
      └── Heading (H2, centered: "Our Journey")
      └── Timeline
          - layout: "alternating"
          - showIcons: true
          - events: [
              { year: "1990", title: "Founded", description: "..." },
              { year: "2000", title: "Expansion", description: "..." },
              ...
            ]
```

---

## Contact Presets

### 17. Contact Section
**Best for:** Contact pages

```
Components:
- SectionWrapper
  └── Container
      └── GridLayout (columns: 2, gap: 64)
          └── Container
              └── Heading (H2: "Get in Touch")
              └── TextEditor (contact info, address)
              └── LogoCloud (social icons)
          └── Container
              └── [Contact Form - if available]
              └── CallToAction (email/phone buttons)
```

---

## Footer Presets

### 18. Simple Footer
**Best for:** All pages (add to templates)

```
Components:
- SectionWrapper (background: dark)
  └── Container
      └── FlexboxLayout (justify: space-between, align: center)
          └── TextEditor (copyright)
          └── LogoCloud (social links, grayscale)
```

---

## How to Use These Presets

### Method 1: Manual Assembly
1. Follow the component structure above
2. Drag components in order
3. Configure props as specified

### Method 2: Save as Template
1. Build the preset once
2. Select all blocks
3. Click "Save as Template"
4. Reuse on other pages

### Method 3: Request Template
Ask the development team to add frequently used presets as page templates for one-click usage.

---

## Customization Tips

### Changing Colors
- Edit Section Wrapper background
- Use brand colors: `#0b6d41` (green), `#ffde59` (gold)

### Adjusting Spacing
- Modify padding in Section Wrapper
- Add Spacer components between sections
- Adjust gap in Grid/Flexbox layouts

### Responsive Considerations
- Use Grid columns: 3 desktop → 2 tablet → 1 mobile
- Hero height: full desktop → auto mobile
- Font sizes adjust automatically

---

## Preset Combinations for Common Pages

### Landing Page Recipe
1. Hero with CTA
2. Stats Bar
3. Features Grid
4. Testimonial Carousel
5. CTA Banner

### About Page Recipe
1. Split Hero
2. Two-Column Text + Image
3. Timeline
4. Team Grid
5. CTA Banner

### Program Page Recipe
1. Hero with CTA
2. Tabs (program details)
3. Faculty Grid (department filter)
4. FAQ Section
5. CTA Banner

### Event Page Recipe
1. Hero with CTA
2. Events List
3. Image Gallery
4. CTA Banner
