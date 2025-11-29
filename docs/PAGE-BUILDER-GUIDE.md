# JKKN Page Builder - User Guide for Non-Technical Users

A simple, step-by-step guide to creating beautiful pages without any coding knowledge.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Creating a New Page](#creating-a-new-page)
3. [Understanding the Page Builder Interface](#understanding-the-page-builder-interface)
4. [Adding Content Blocks](#adding-content-blocks)
5. [Available Block Types](#available-block-types)
6. [Editing Block Properties](#editing-block-properties)
7. [Using Layout Presets](#using-layout-presets)
8. [Managing Your Page](#managing-your-page)
9. [SEO Settings](#seo-settings)
10. [Publishing Your Page](#publishing-your-page)
11. [Tips & Best Practices](#tips--best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Page Builder

1. **Login** to the JKKN Admin Portal at `/auth/login`
2. Click on **"Content"** in the left sidebar menu
3. Click on **"Pages"** to see all existing pages
4. Click the **"+ New Page"** button to create a new page

---

## Creating a New Page

### Step 1: Fill in Page Details

When you click "New Page", you'll see a form with these fields:

| Field | What to Enter | Example |
|-------|---------------|---------|
| **Page Title** | The name of your page (shown in browser tab) | "About Us" |
| **URL Slug** | The web address (auto-generated from title) | "about-us" |
| **Description** | Brief summary for search engines | "Learn about JKKN Institution's history and mission" |
| **Parent Page** | If this page belongs under another page | Select "Academics" if creating a department page |
| **Template** | Start with a pre-built design (optional) | "Blank Page" or "Landing Page" |
| **Visibility** | Who can see the page | Public, Private, or Password Protected |

### Step 2: Additional Options

- **Set as Homepage**: Check this to make it your website's main page
- **Show in Navigation**: Check this to add the page to your website menu

### Step 3: Click "Create Page"

After filling the details, click the green **"Create Page"** button. You'll be taken to the visual page builder.

---

## Understanding the Page Builder Interface

The page builder has **three main sections**:

```
┌─────────────────────────────────────────────────────────────┐
│                    TOP TOOLBAR                               │
│  [Save] [Undo] [Redo] [Preview] [Device View] [Publish ▼]   │
├──────────┬─────────────────────────────┬────────────────────┤
│          │                             │                    │
│  LEFT    │      CENTER CANVAS          │   RIGHT PANEL      │
│  SIDEBAR │                             │                    │
│          │   (Your page preview)       │   Properties       │
│ Component│                             │   SEO              │
│ Palette  │   Drag blocks here          │   FAB              │
│          │                             │                    │
│          │                             │                    │
└──────────┴─────────────────────────────┴────────────────────┘
```

### Left Sidebar - Component Palette
This shows all the building blocks you can add to your page. Components are organized into categories:
- **Content**: Text, headings, hero sections
- **Media**: Images, videos, galleries
- **Layout**: Containers, grids, spacers
- **Data**: Events, announcements, statistics

### Center Canvas
This is where you build your page. You'll see a live preview of how your page looks.

### Right Panel
Three tabs for editing:
- **Properties**: Edit the selected block's settings
- **SEO**: Search engine optimization settings
- **FAB**: Floating action button settings

### Top Toolbar
Quick actions: Save, Undo, Redo, Preview, Device views, Publish

---

## Adding Content Blocks

### Method 1: Drag and Drop

1. **Find** a component in the left sidebar (e.g., "Hero Section")
2. **Click and hold** the component
3. **Drag** it to the canvas
4. **Drop** it where you want it to appear

### Method 2: Click to Add

1. **Click** on any component in the left sidebar
2. It will be added to the **bottom** of your page
3. You can then drag it to reposition

### Method 3: Use Layout Presets

1. Click the **"Layout Presets"** button in the toolbar
2. Browse pre-designed sections (Hero, Features, Testimonials, etc.)
3. Click a preset to add multiple blocks at once

---

## Available Block Types

### Content Blocks

| Block | What It Does | Best Used For |
|-------|--------------|---------------|
| **Hero Section** | Large banner with image/video background | Top of landing pages |
| **Rich Text** | Paragraphs with formatting | Body content, articles |
| **Heading** | Titles and section headers | Section titles |
| **Call to Action** | Button with text to prompt action | "Apply Now", "Contact Us" |
| **Testimonials** | Customer/student quotes | Reviews, success stories |
| **FAQ Accordion** | Expandable questions & answers | FAQ pages |
| **Tabs** | Content organized in tabs | Course details, features |
| **Timeline** | Vertical timeline of events | History, milestones |
| **Pricing Tables** | Compare plans/options | Fees, course packages |

### Media Blocks

| Block | What It Does | Best Used For |
|-------|--------------|---------------|
| **Image** | Single image with caption | Photos, diagrams |
| **Image Gallery** | Multiple images in grid | Photo galleries, campus tour |
| **Video Player** | YouTube/Vimeo videos | Promotional videos |
| **Image Carousel** | Sliding image slideshow | Featured images |
| **Logo Cloud** | Display partner logos | Sponsors, recruiters |

### Layout Blocks

| Block | What It Does | Best Used For |
|-------|--------------|---------------|
| **Container** | Wraps content with padding | Organizing sections |
| **Grid Layout** | Arrange items in columns | Feature cards, team members |
| **Spacer** | Adds vertical space | Separating sections |
| **Divider** | Horizontal line | Visual separation |
| **Section Wrapper** | Full-width colored section | Background sections |

### Data Blocks (Auto-updated from database)

| Block | What It Does | Best Used For |
|-------|--------------|---------------|
| **Stats Counter** | Animated numbers | Achievements, statistics |
| **Events List** | Upcoming events | Events page |
| **Faculty Directory** | Staff profiles | About/Faculty pages |
| **Announcements Feed** | Latest announcements | News section |
| **Blog Posts Grid** | Recent blog posts | News/Blog page |

---

## Editing Block Properties

### Selecting a Block

1. **Click** on any block in the canvas
2. A blue border will appear around the selected block
3. The **Properties panel** on the right will show editable options

### Common Properties

Most blocks have these common settings:

| Property | What It Controls |
|----------|------------------|
| **Title/Heading** | Main text of the block |
| **Description/Content** | Body text or paragraph |
| **Background Color** | Block's background |
| **Text Color** | Color of text |
| **Alignment** | Left, Center, or Right |
| **Padding** | Space inside the block |
| **Visibility** | Show or hide the block |

### Block-Specific Properties

Each block type has unique settings. For example:

**Hero Section:**
- Background image/video URL
- Overlay color and opacity
- CTA button text and link
- Minimum height

**Image Gallery:**
- Number of columns
- Enable/disable lightbox
- Caption visibility

**Stats Counter:**
- Numbers to display
- Animation speed
- Icons

---

## Using Layout Presets

Layout presets let you add **pre-designed sections** with one click.

### How to Use Presets

1. Click **"Layout Presets"** button in the top toolbar (or palette)
2. Browse categories:
   - **Hero**: Page headers and banners
   - **Features**: Highlight key points
   - **Content**: Text and image sections
   - **Testimonials**: Customer reviews
   - **CTA**: Call-to-action banners
   - **Gallery**: Image displays
   - **Data**: Statistics and events
   - **Contact**: Contact information
3. **Click** on a preset to preview it
4. Click **"Add to Page"** to insert it

### Available Presets

| Preset | What You Get |
|--------|--------------|
| Hero with CTA | Hero section + 2 call-to-action buttons |
| Split Hero | Two-column hero with text and image |
| Features Grid | 3-column features with icons |
| Text + Image | Two-column content layout |
| FAQ Accordion | FAQ section with search |
| Testimonials Carousel | Rotating testimonials |
| Stats Counter Bar | Animated statistics row |
| Contact Section | Contact info + CTA button |

---

## Managing Your Page

### Reordering Blocks

**Drag to reorder:**
1. Hover over a block
2. Click the **drag handle** (⋮⋮) on the left
3. Drag the block up or down
4. Release to drop in new position

### Duplicating a Block

1. Select the block
2. Click the **duplicate icon** (📋) in the block controls
3. A copy appears below the original

### Deleting a Block

1. Select the block
2. Click the **trash icon** (🗑️) in the block controls
3. Confirm deletion

### Hiding a Block (Without Deleting)

1. Select the block
2. Click the **eye icon** (👁️) to toggle visibility
3. Hidden blocks show a dimmed preview in the builder
4. Hidden blocks won't appear on the live page

### Undo/Redo Changes

- Press **Ctrl + Z** (Windows) or **Cmd + Z** (Mac) to **Undo**
- Press **Ctrl + Y** (Windows) or **Cmd + Shift + Z** (Mac) to **Redo**
- Or click the Undo/Redo buttons in the toolbar

---

## SEO Settings

SEO (Search Engine Optimization) helps your page appear in Google search results.

### Accessing SEO Panel

1. Click the **"SEO"** tab in the right panel
2. Fill in the following:

| Field | What to Enter | Tips |
|-------|---------------|------|
| **Meta Title** | Page title for search engines | Keep under 60 characters |
| **Meta Description** | Summary shown in search results | Keep under 160 characters |
| **Keywords** | Words people might search for | Separate with commas |
| **Focus Keyword** | Main keyword for this page | Use naturally in content |

### SEO Score

The builder shows an **SEO score** (0-100). Aim for 70+ by:
- Including your focus keyword in the title
- Writing a compelling meta description
- Using headings properly (H1, H2, H3)
- Adding alt text to images

---

## Publishing Your Page

### Save Your Work

Your page **auto-saves** every few seconds. You'll see "Saved" in the toolbar.

To manually save: Press **Ctrl + S** or click the **Save** button.

### Preview Your Page

1. Click the **"Preview"** button in the toolbar
2. A new tab opens showing how your page looks
3. Test on different devices using the device buttons (Mobile/Tablet/Desktop)

### Publishing Options

Click the **"Publish"** dropdown button to see options:

| Option | What It Does |
|--------|--------------|
| **Publish Now** | Makes your page live immediately |
| **Schedule** | Set a future date/time to publish |
| **Save as Draft** | Save without publishing |
| **Unpublish** | Take a published page offline |

### After Publishing

- Your page will be live at: `https://yoursite.com/[url-slug]`
- Example: "About Us" page → `https://jkkn.ac.in/about-us`

---

## Tips & Best Practices

### Design Tips

1. **Start with a Hero** - First impressions matter
2. **Use consistent colors** - Stick to brand colors (JKKN green)
3. **Keep text readable** - Use proper contrast
4. **Add white space** - Don't overcrowd; use spacers
5. **Use images wisely** - Relevant, high-quality images only

### Content Tips

1. **Write clear headings** - Tell readers what each section is about
2. **Keep paragraphs short** - 3-4 sentences maximum
3. **Use bullet points** - Easier to scan than long text
4. **Include CTAs** - Guide users to take action
5. **Proofread** - Check for spelling and grammar

### Organization Tips

1. **Plan your page structure** before adding blocks
2. **Group related content** in sections
3. **Use a logical flow** - Introduction → Details → Call to Action
4. **Test on mobile** - Most visitors use phones

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| **Block not appearing** | Check if it's hidden (eye icon) |
| **Can't drag blocks** | Make sure you're clicking the drag handle |
| **Changes not saving** | Check internet connection; try manual save (Ctrl+S) |
| **Page looks different on mobile** | Use device preview to check; adjust responsive settings |
| **Image not loading** | Check the image URL is correct and accessible |

### Getting Help

If you encounter issues:
1. Click **"Help"** in the admin menu
2. Contact your administrator
3. Check the system status

---

## Quick Reference Card

### Keyboard Shortcuts

| Action | Windows | Mac |
|--------|---------|-----|
| Save | Ctrl + S | Cmd + S |
| Undo | Ctrl + Z | Cmd + Z |
| Redo | Ctrl + Y | Cmd + Shift + Z |
| Preview | Ctrl + P | Cmd + P |

### Block Categories

- 🎨 **Content** - Text, headings, CTAs
- 🖼️ **Media** - Images, videos, galleries
- 📐 **Layout** - Containers, grids, spacers
- 📊 **Data** - Events, stats, directories

### Publishing Workflow

```
Draft → Edit → Preview → Publish
  ↑__________________|
     (make changes)
```

---

## Example: Creating an "About Us" Page

### Step-by-Step Example

1. **Create new page**
   - Title: "About Us"
   - Slug: "about-us" (auto-generated)
   - Description: "Learn about JKKN Institution"

2. **Add Hero Section**
   - Title: "About JKKN Institution"
   - Subtitle: "Excellence in Education Since 1994"
   - Background: Campus image

3. **Add Rich Text Block**
   - Write your introduction paragraph

4. **Add Timeline Block**
   - Add milestones: 1994 Founded, 2000 Expansion, etc.

5. **Add Stats Counter**
   - Students: 5000+
   - Faculty: 200+
   - Courses: 50+

6. **Add Testimonials**
   - Student/Alumni quotes

7. **Add CTA Section**
   - "Want to join us?"
   - Button: "Apply Now"

8. **Review and Publish**
   - Preview on mobile/tablet/desktop
   - Check SEO settings
   - Click "Publish Now"

---

**Congratulations!** You now know how to create professional pages using the JKKN Page Builder. Start creating! 🎉
