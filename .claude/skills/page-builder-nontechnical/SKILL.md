---
name: page-builder-nontechnical
description: Simplified page builder skill for non-technical users. This skill should be used when content editors, marketing team members, or non-developer staff need to create or edit website pages. Provides predefined layouts, easy-to-use templates, and step-by-step guidance for building professional pages without coding knowledge. Automatically triggers when users mention 'create page', 'add content block', 'page layout', 'landing page', 'homepage', or request help with the page builder.
license: MIT
---

# Page Builder for Non-Technical Users

This skill provides simplified workflows for creating and editing website pages without technical knowledge. It transforms the developer-focused page builder into an intuitive content creation experience.

## Overview

The JKKN Page Builder allows creating professional web pages through:
- **Pre-built Layout Templates** - Ready-to-use page structures
- **Smart Components** - Pre-configured content blocks
- **Visual Editing** - Drag-and-drop interface
- **One-Click Styling** - Consistent brand appearance

## Quick Start Workflow

### Step 1: Choose a Page Type

Before building, determine the page purpose:

| Page Type | Best Template | Key Components |
|-----------|--------------|----------------|
| **Landing Page** | Marketing Template | Hero, CTA, Testimonials, Stats |
| **About Page** | Informational Template | Hero, Text, Timeline, Team |
| **Program Page** | Academic Template | Hero, Tabs, FAQ, CTA |
| **Event Page** | Event Template | Hero, EventsList, Gallery, CTA |
| **Contact Page** | Contact Template | Hero, Form, Map, FAB |
| **Gallery Page** | Media Template | Hero, ImageGallery, VideoPlayer |

### Step 2: Create the Page

1. Navigate to `/admin/content/pages`
2. Click **"Create Page"** button
3. Fill in required fields:
   - **Title**: Page name (e.g., "About JKKN")
   - **Slug**: URL path (auto-generated from title, e.g., "about-jkkn")
   - **Template**: Select from available templates
4. Click **"Create Page"** → Opens page editor

### Step 3: Build with Layout Presets

Instead of adding components one-by-one, use **Layout Presets** for common page sections:

**Available Presets** (reference: `references/layout-presets.md`)

| Preset Name | Description | Components Included |
|-------------|-------------|---------------------|
| **Hero with CTA** | Full-width header with action buttons | Hero Section |
| **Features Grid** | 3-column feature highlights | Grid Layout + 3 Cards |
| **Testimonial Carousel** | Customer/student quotes | Testimonials (carousel) |
| **Stats Bar** | Animated statistics | Stats Counter |
| **FAQ Section** | Expandable questions | FAQ Accordion |
| **Team Grid** | Faculty/staff display | Faculty Directory |
| **Gallery Showcase** | Image grid with lightbox | Image Gallery |
| **Contact Section** | Contact form + info | Container + Text + CTA |
| **CTA Banner** | Full-width call-to-action | Call-to-Action |
| **Timeline History** | Chronological events | Timeline |

### Step 4: Edit Component Content

To edit any component:
1. **Click** on the component in the canvas
2. **Right sidebar** shows editable properties
3. **Update content** - changes save automatically

**Common Edits by Component Type:**

| Component | What to Edit | Where to Find It |
|-----------|--------------|------------------|
| Hero Section | Title, subtitle, background image, buttons | Properties → Content tab |
| Text Editor | Paragraph content | Properties → Rich text editor |
| Image Block | Image URL, alt text, caption | Properties → Media picker |
| CTA Button | Button text, link URL, style | Properties → Buttons array |
| Stats | Numbers, labels, icons | Properties → Stats items |

### Step 5: Preview and Publish

1. **Preview**: Click eye icon to toggle preview mode
2. **Device Test**: Use device switcher (desktop/tablet/mobile)
3. **Save**: Auto-saves every 3 seconds (or Ctrl+S)
4. **Publish**: Click "Publish" dropdown → "Publish Now"

---

## Non-Technical User Workflows

### Workflow A: Create a Simple Landing Page

**Goal:** Create a marketing page with hero, features, and CTA

**Steps:**
1. Create new page with "Marketing Template"
2. The template auto-adds: Hero → Features Grid → CTA Banner
3. Edit Hero:
   - Change title to your headline
   - Update subtitle
   - Set background image (upload or paste URL)
   - Edit button text and links
4. Edit Features:
   - Click each feature card
   - Update icon, title, description
5. Edit CTA:
   - Change heading and description
   - Update button text and link
6. Preview → Publish

### Workflow B: Add a New Section to Existing Page

**Goal:** Add testimonials section to a page

**Steps:**
1. Open existing page in editor
2. In left sidebar, find "Testimonials" under Content category
3. Drag "Testimonials" to desired position on canvas
4. Click the new testimonials block
5. In right sidebar, add testimonial items:
   - Quote text
   - Person name
   - Role/title
   - Avatar image (optional)
6. Choose layout: carousel, grid, or single
7. Auto-saves → Done

### Workflow C: Reorder Page Sections

**Goal:** Move a section up or down

**Steps:**
1. Hover over the section to move
2. Grab the **drag handle** (6 dots icon)
3. Drag up or down to new position
4. Release to drop
5. Changes save automatically

### Workflow D: Duplicate a Section

**Goal:** Copy an existing section with its content

**Steps:**
1. Click on the section to select it
2. Click the **duplicate icon** (two squares) in the block toolbar
3. New copy appears below original
4. Edit the copy as needed

### Workflow E: Create Page from Template

**Goal:** Use a pre-made template for faster page creation

**Steps:**
1. In page editor, click **"Templates"** in top toolbar
2. Browse available templates by category
3. Click **"Use Template"** on desired template
4. Template blocks are added to your page
5. Edit content to customize
6. Publish when ready

---

## Component Quick Reference

For detailed component usage, see `references/component-guide.md`

### Content Components (Most Common)

| Component | Use For | Key Props |
|-----------|---------|-----------|
| **Hero Section** | Page headers | title, subtitle, backgroundImage, buttons |
| **Text Editor** | Paragraphs, articles | content (rich text), alignment |
| **Heading** | Section titles | text, level (H1-H6), alignment |
| **Call-to-Action** | Action prompts | title, description, buttons |
| **Testimonials** | Reviews, quotes | items array, layout (carousel/grid) |
| **FAQ Accordion** | Q&A sections | items array, allowMultiple |
| **Tabs** | Tabbed content | tabs array with label + content |
| **Timeline** | History, milestones | events array with date + description |

### Media Components

| Component | Use For | Key Props |
|-----------|---------|-----------|
| **Image Block** | Single images | src, alt, caption |
| **Image Gallery** | Multiple images | images array, layout, columns |
| **Video Player** | YouTube/Vimeo | url, autoplay, showControls |
| **Image Carousel** | Slideshow | images array, autoplay, interval |
| **Logo Cloud** | Partner logos | logos array, layout (grid/marquee) |

### Layout Components

| Component | Use For | Key Props |
|-----------|---------|-----------|
| **Container** | Center content | maxWidth, padding |
| **Grid Layout** | Multi-column layouts | columns (1-12), gap |
| **Spacer** | Vertical spacing | height |
| **Divider** | Section separators | style, color |
| **Section Wrapper** | Background sections | background, padding |

### Data Components (Auto-populate)

| Component | Use For | Data Source |
|-----------|---------|-------------|
| **Events List** | Upcoming events | events table |
| **Faculty Directory** | Staff listings | members table |
| **Announcements Feed** | News updates | announcements table |
| **Stats Counter** | Animated numbers | Manual input |
| **Blog Posts Grid** | Article listings | cms_pages (blog type) |

---

## Tips for Non-Technical Users

### Do's
- **Use templates** - Start with a template, then customize
- **Preview often** - Check mobile view before publishing
- **Keep it simple** - Fewer sections = faster loading
- **Use high-quality images** - Minimum 1200px wide for heroes
- **Write clear CTAs** - "Apply Now" is better than "Click Here"

### Don'ts
- **Don't nest too deeply** - Maximum 2 levels of containers
- **Don't use too many fonts** - Stick to brand typography
- **Don't skip alt text** - Important for accessibility
- **Don't forget mobile** - Always preview on mobile view
- **Don't duplicate pages unnecessarily** - Use templates instead

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save page |
| `Ctrl + Z` | Undo last action |
| `Ctrl + Y` | Redo action |
| `Delete` | Remove selected block |
| `Escape` | Deselect block |

---

## Common Questions

### How do I change the page URL?
Edit the **slug** field in page settings (gear icon in top bar).

### How do I add a button?
1. Use **Call-to-Action** component, or
2. Edit a **Hero Section** and add to the buttons array

### How do I make a section full-width?
Wrap content in a **Section Wrapper** and enable "Full Width".

### How do I add spacing between sections?
Use the **Spacer** component (drag between sections).

### How do I see my changes live?
Click **Preview** button → Opens in new tab with live site styling.

### How do I schedule a page to publish later?
Click **Publish** dropdown → **Schedule Publish** → Set date/time.

### How do I revert to a previous version?
Click **Version History** in right sidebar → Select version → Restore.

---

## Troubleshooting

### Page won't save
- Check internet connection
- Look for validation errors (red highlights)
- Try manual save (Ctrl+S)

### Component not appearing
- Ensure component is not hidden (eye icon)
- Check if inside a collapsed container
- Refresh the page

### Images not loading
- Verify image URL is accessible
- Check file format (use JPG, PNG, WebP)
- Ensure image isn't too large (max 5MB)

### Can't drag components
- Click and hold on drag handle (6 dots)
- Ensure you're not in preview mode
- Try refreshing if stuck

---

## Getting Help

For page builder assistance:
1. Check this skill's reference files
2. Contact the development team
3. Refer to the admin documentation

**Reference Files:**
- `references/layout-presets.md` - Detailed preset configurations
- `references/component-guide.md` - Full component documentation
- `references/page-templates.md` - Available page templates
