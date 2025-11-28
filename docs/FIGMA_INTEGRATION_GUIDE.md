# Figma Integration Guide for CMS Page Builder

This guide explains how to create and manage preview images for your CMS page builder components using Figma.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Figma Account & File](#step-1-create-figma-account--file)
4. [Step 2: Set Up Preview Frames](#step-2-set-up-preview-frames)
5. [Step 3: Design Component Previews](#step-3-design-component-previews)
6. [Step 4: Get Figma Access Token](#step-4-get-figma-access-token)
7. [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
8. [Step 6: Run Sync Script](#step-6-run-sync-script)
9. [Manual Export Alternative](#manual-export-alternative)
10. [Component Preview Guidelines](#component-preview-guidelines)
11. [Troubleshooting](#troubleshooting)

---

## Overview

The CMS page builder displays preview images when users hover over components in the palette. These previews help content editors understand what each component looks like before adding it to their page.

**How it works:**
1. You design component previews in Figma
2. Export them as PNG images (manually or via script)
3. Images are displayed in the page builder's component palette on hover

---

## Prerequisites

- Figma account (free tier works)
- Node.js 18+ installed
- Access to the project codebase

---

## Step 1: Create Figma Account & File

### 1.1 Create Figma Account

1. Go to [figma.com](https://www.figma.com)
2. Click **Sign up** (or log in if you have an account)
3. You can use the **free** Starter plan

### 1.2 Create New Design File

1. From Figma dashboard, click **+ New design file**
2. Name it: `JKKN CMS Component Previews`
3. Create a page called `CMS Previews` (click + next to Pages)

---

## Step 2: Set Up Preview Frames

### 2.1 Create Frame Template

Each component preview needs a frame with these specifications:

| Property | Value |
|----------|-------|
| Width | 400px |
| Height | 300px |
| Background | #f8f9fa (light gray) or transparent |
| Export Scale | 2x (for retina) |

### 2.2 Create Frames for All Components

Create one frame for each component. **Frame names must match exactly:**

#### Content Blocks
```
HeroSection
TextEditor
Heading
CallToAction
Testimonials
FAQAccordion
TabsBlock
Timeline
PricingTables
```

#### Media Blocks
```
ImageBlock
ImageGallery
VideoPlayer
ImageCarousel
BeforeAfterSlider
LogoCloud
```

#### Layout Blocks
```
Container
GridLayout
FlexboxLayout
Spacer
Divider
SectionWrapper
```

#### Data Blocks
```
StatsCounter
EventsList
FacultyDirectory
AnnouncementsFeed
BlogPostsGrid
```

### 2.3 Quick Setup with Auto Layout

1. Create a frame: `400 x 300`
2. Name it exactly as the component name
3. Add a light background: `#f8f9fa`
4. Add a subtle border: `1px solid #e5e7eb`
5. Duplicate for each component

---

## Step 3: Design Component Previews

### Design Guidelines

Each preview should show a **realistic representation** of the component:

#### Hero Section Example
- Show a full-width banner with title text
- Include a background image/gradient
- Show CTA button placement

#### Text Editor Example
- Show formatted text with headings
- Include paragraph text
- Show bullet points if applicable

#### Image Gallery Example
- Show a grid of placeholder images
- Include lightbox icon overlay
- Show typical 3-column layout

### Design Tips

1. **Keep it simple** - Focus on the component structure
2. **Use brand colors** - Primary green (#0b6d41), Secondary gold (#ffde59)
3. **Show realistic content** - Use lorem ipsum text, placeholder images
4. **Highlight key features** - Show what makes each component unique
5. **Consistent style** - Use same fonts, colors, and padding across previews

### Placeholder Assets

For images in previews, use:
- Unsplash placeholder: `https://source.unsplash.com/400x300`
- UI Faces for avatars: `https://uifaces.co/`
- Lorem ipsum for text

---

## Step 4: Get Figma Access Token

### 4.1 Generate Personal Access Token

1. Go to Figma settings: Click your profile icon → **Settings**
2. Scroll to **Personal access tokens**
3. Click **Generate new token**
4. Name it: `CMS Preview Sync`
5. Set expiration (or leave as "No expiration")
6. Click **Generate token**
7. **Copy the token immediately** (you won't see it again!)

### 4.2 Get Figma File Key

1. Open your Figma file `JKKN CMS Component Previews`
2. Look at the URL: `https://www.figma.com/file/XXXXXXXXX/JKKN-CMS-Component-Previews`
3. The `XXXXXXXXX` part is your **File Key**

---

## Step 5: Configure Environment Variables

### 5.1 Add to .env.local

Create or edit `.env.local` in your project root:

```env
# Figma API Configuration
FIGMA_ACCESS_TOKEN=figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FIGMA_FILE_KEY=xxxxxxxxxxxxxxxxx
```

### 5.2 Security Note

- Never commit `.env.local` to git
- The file is already in `.gitignore`
- Keep your access token secret

---

## Step 6: Run Sync Script

### 6.1 Install Dependencies (if needed)

```bash
npm install
```

### 6.2 Run the Sync Script

```bash
npx tsx scripts/figma-preview-sync.ts
```

### 6.3 Expected Output

```
Fetching Figma file...
Looking for 26 components in Figma file...
Found 26 matching frames
Fetching image URLs...
Downloading images...
  ✓ HeroSection
  ✓ TextEditor
  ✓ Heading
  ... (more components)

Sync complete!
Downloaded 26 preview images
Manifest saved to public/cms-previews/manifest.json
```

### 6.4 Verify Images

Check that images are in `public/cms-previews/`:
```
public/
  cms-previews/
    HeroSection.png
    TextEditor.png
    Heading.png
    ... (all 26 components)
    manifest.json
```

---

## Manual Export Alternative

If you prefer to export images manually instead of using the API:

### Step-by-Step Manual Export

1. **In Figma**, select a component frame
2. In the right panel, click **Export** (bottom section)
3. Set format: **PNG**
4. Set scale: **2x**
5. Click **Export [ComponentName]**
6. Save to `public/cms-previews/ComponentName.png`
7. Repeat for all components

### Batch Export

1. Select all frames (Cmd/Ctrl + click each)
2. Set export settings for all: PNG, 2x
3. Click **Export** → Choose `public/cms-previews/` folder
4. All images export at once

---

## Component Preview Guidelines

### Recommended Preview Content

| Component | Preview Should Show |
|-----------|-------------------|
| HeroSection | Full banner with title, subtitle, CTA button |
| TextEditor | Formatted paragraph with heading |
| Heading | Various heading sizes (H1, H2, H3) |
| CallToAction | Box with title, description, buttons |
| Testimonials | Quote card with avatar and rating |
| FAQAccordion | Expandable Q&A items |
| TabsBlock | Tab navigation with content area |
| Timeline | Vertical timeline with events |
| PricingTables | 3-column pricing comparison |
| ImageBlock | Single image with caption |
| ImageGallery | 3x2 grid of images |
| VideoPlayer | Video thumbnail with play button |
| ImageCarousel | Slider with dots navigation |
| BeforeAfterSlider | Split view with drag handle |
| LogoCloud | Row of partner logos |
| Container | Bounded content area |
| GridLayout | Multi-column grid |
| FlexboxLayout | Flexible row/column layout |
| Spacer | Visual spacing indicator |
| Divider | Horizontal line styles |
| SectionWrapper | Full-width background section |
| StatsCounter | Number counters with labels |
| EventsList | Event cards with dates |
| FacultyDirectory | Staff cards with photos |
| AnnouncementsFeed | News/notice list |
| BlogPostsGrid | Article cards with images |

---

## Troubleshooting

### Issue: "FIGMA_ACCESS_TOKEN not set"

**Solution:** Check `.env.local` exists and has the correct token:
```env
FIGMA_ACCESS_TOKEN=figd_your_token_here
```

### Issue: "No matching frames found"

**Solution:** Frame names must match exactly. Check:
- No extra spaces
- Correct capitalization (e.g., `HeroSection` not `herosection`)
- Frame type is FRAME or COMPONENT

### Issue: "Failed to fetch images"

**Possible causes:**
1. Token expired - Generate a new one
2. No read access to file - Check sharing settings
3. Network issue - Try again

### Issue: Images not showing in page builder

**Check:**
1. Images are in `public/cms-previews/`
2. File names match exactly
3. Restart dev server: `npm run dev`

### Issue: Images look blurry

**Solution:** Export at 2x scale in Figma for retina displays.

---

## Updating Previews

When you add new components or update designs:

1. **Update Figma** - Modify the relevant frames
2. **Re-run sync** - `npx tsx scripts/figma-preview-sync.ts`
3. **Commit changes** - The images in `public/cms-previews/` should be committed

---

## Best Practices

1. **Version your Figma file** - Use Figma's version history
2. **Consistent naming** - Always match component names exactly
3. **Regular syncs** - Update previews when components change
4. **Design review** - Ensure previews accurately represent components
5. **Test locally** - Verify hover previews work before deploying

---

## Quick Reference

| Action | Command/Location |
|--------|-----------------|
| Sync previews | `npx tsx scripts/figma-preview-sync.ts` |
| Preview images | `public/cms-previews/` |
| Config file | `.env.local` |
| Registry | `lib/cms/component-registry.ts` |
| Palette UI | `components/page-builder/palette/component-palette.tsx` |

---

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Verify Figma API status: [status.figma.com](https://status.figma.com)
3. Review Figma API docs: [figma.com/developers/api](https://www.figma.com/developers/api)
