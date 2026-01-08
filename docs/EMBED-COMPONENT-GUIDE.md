# Embed Component - Usage Guide

## Overview

The **Embed Block** component allows you to embed external content directly into your CMS pages. This includes YouTube videos, Google Maps, Google Forms, Google Drive videos, and any other iframe-based content.

## Component Location

- **File**: `components/cms-blocks/media/embed-block.tsx`
- **Registry**: `lib/cms/component-registry.ts`
- **Types**: `lib/cms/registry-types.ts`

## Features

### Supported Embed Types

1. **Generic iframe** - Any iframe-compatible URL
2. **YouTube** - Automatic URL parsing for YouTube videos
3. **Vimeo** - Automatic URL parsing for Vimeo videos
4. **Google Maps** - Embed Google Maps locations
5. **Google Forms** - Embed Google Forms
6. **Google Drive** - Embed Google Drive videos
7. **Custom HTML** - Paste raw embed code/HTML

### Key Features

- ✅ Automatic URL parsing for popular services
- ✅ Responsive aspect ratios (16/9, 4/3, 1/1, 21/9, 9/16)
- ✅ Auto-height mode for dynamic content
- ✅ Fullscreen support
- ✅ Border and radius customization
- ✅ Accessibility support with title attribute
- ✅ Editing mode placeholder

## How to Use in Page Editor

### Step 1: Add Component

1. Open the CMS Page Editor
2. Click **"Add Block"** or **"+"** button
3. Navigate to **"Media"** category
4. Select **"Embed Content"**

### Step 2: Configure Properties

In the properties panel, you'll see these options:

#### Required Fields

- **Embed Type**: Choose the type of content
  - `iframe` - Generic iframe (default)
  - `youtube` - YouTube videos
  - `vimeo` - Vimeo videos
  - `google-maps` - Google Maps
  - `google-forms` - Google Forms
  - `google-drive` - Google Drive videos
  - `html` - Custom HTML/embed code

- **URL**: Paste the URL of the content you want to embed
  - YouTube: `https://www.youtube.com/watch?v=VIDEO_ID` or `https://youtu.be/VIDEO_ID`
  - Vimeo: `https://vimeo.com/VIDEO_ID`
  - Google Maps: Full Google Maps URL
  - Google Forms: Form URL (will auto-add embed parameter)
  - Google Drive: `https://drive.google.com/file/d/FILE_ID/view`

#### Optional Fields

- **Embed Code (HTML)**: Alternative to URL - paste raw embed code
  - Only works when Embed Type is set to `html`
  - Scripts are automatically stripped for security

- **Title**: Accessibility title for screen readers (default: "Embedded content")

- **Aspect Ratio**: Control the height-to-width ratio
  - `16/9` - Standard widescreen (default)
  - `4/3` - Traditional video
  - `1/1` - Square
  - `21/9` - Ultra-widescreen
  - `9/16` - Vertical/mobile

- **Auto Height**: Let the content determine its own height
  - When enabled, aspect ratio is ignored
  - Useful for forms and dynamic content

- **Min Height**: Minimum height (CSS value like `400px`, `30rem`)
  - Works with Auto Height mode

- **Max Height**: Maximum height (CSS value)
  - Prevents content from becoming too tall

- **Allow Fullscreen**: Enable fullscreen mode for videos/maps (default: `true`)

- **Show Border**: Display a border around the embed (default: `false`)

- **Border Radius**: Rounded corners (CSS value like `8px`, `1rem`, default: `8px`)

## Usage Examples

### Example 1: YouTube Video

```json
{
  "embedType": "youtube",
  "embedUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "aspectRatio": "16/9",
  "allowFullscreen": true,
  "title": "YouTube video"
}
```

### Example 2: Google Maps Location

```json
{
  "embedType": "google-maps",
  "embedUrl": "https://www.google.com/maps/embed?pb=!1m18...",
  "aspectRatio": "16/9",
  "showBorder": true,
  "borderRadius": "12px",
  "title": "Campus location map"
}
```

### Example 3: Google Form

```json
{
  "embedType": "google-forms",
  "embedUrl": "https://docs.google.com/forms/d/e/FORM_ID/viewform",
  "autoHeight": true,
  "minHeight": "600px",
  "title": "Application form"
}
```

### Example 4: Custom HTML Embed

```json
{
  "embedType": "html",
  "embedCode": "<iframe src='https://example.com/widget' width='100%' height='400'></iframe>",
  "autoHeight": true,
  "minHeight": "400px",
  "title": "Custom widget"
}
```

### Example 5: Generic iframe

```json
{
  "embedType": "iframe",
  "embedUrl": "https://example.com/content",
  "aspectRatio": "4/3",
  "allowFullscreen": false,
  "showBorder": true,
  "title": "External content"
}
```

## Best Practices

### 1. Choose the Right Embed Type

- Use specific types (`youtube`, `google-maps`, etc.) when possible
- They provide better URL parsing and optimization
- Fall back to `iframe` for generic content

### 2. Accessibility

- Always set a descriptive `title` attribute
- The title helps screen readers describe the embedded content

### 3. Aspect Ratios

- Use `16/9` for most videos and maps
- Use `autoHeight: true` for forms and dynamic content
- Set `minHeight` when using `autoHeight` to prevent very short embeds

### 4. Performance

- Embeds use `loading="lazy"` by default
- Content only loads when scrolled into view
- Improves page load performance

### 5. Security

- When using `html` embed type, scripts are automatically stripped
- Only `<iframe>` and safe HTML tags are allowed
- Use URL-based embeds when possible for better security

### 6. Responsive Design

- The component is fully responsive
- Aspect ratios maintain proportions on all screen sizes
- Test on mobile devices for forms and maps

## Common URL Formats

### YouTube

- Watch URL: `https://www.youtube.com/watch?v=VIDEO_ID`
- Short URL: `https://youtu.be/VIDEO_ID`
- Embed URL: `https://www.youtube.com/embed/VIDEO_ID`

All formats are automatically converted to the embed format.

### Vimeo

- Regular URL: `https://vimeo.com/VIDEO_ID`
- Player URL: `https://player.vimeo.com/video/VIDEO_ID`

Both formats work automatically.

### Google Maps

1. Go to Google Maps
2. Click "Share" → "Embed a map"
3. Copy the URL from the iframe src attribute
4. Paste into the URL field

### Google Forms

1. Open your Google Form
2. Click "Send"
3. Click the `<>` (embed) icon
4. Copy the URL from the iframe src attribute
5. Paste into the URL field (auto-adds `?embedded=true`)

### Google Drive Videos

1. Right-click the video in Google Drive
2. Click "Get link" → "Anyone with the link"
3. Copy the link: `https://drive.google.com/file/d/FILE_ID/view`
4. Paste into URL field (auto-converts to preview URL)

## Troubleshooting

### Embed Doesn't Show

1. **Check the URL**: Make sure it's a valid embed URL
2. **Check embed type**: Ensure you selected the correct type
3. **Try iframe mode**: Switch to generic `iframe` type
4. **Check source restrictions**: Some sites block embedding

### Content is Cut Off

1. **Enable Auto Height**: Set `autoHeight: true`
2. **Increase Min Height**: Set a larger `minHeight` value
3. **Remove Max Height**: Clear the `maxHeight` field

### Video Won't Play

1. **Enable Fullscreen**: Set `allowFullscreen: true`
2. **Check video privacy**: Ensure the video is public
3. **Try direct embed URL**: Use the embed URL format
4. **Clear browser cache**: Sometimes cached content causes issues

### Form is Too Small

1. **Set Auto Height**: Enable `autoHeight: true`
2. **Set Min Height**: Use `minHeight: "800px"` or higher
3. **Remove Aspect Ratio**: Auto height ignores aspect ratio

## Technical Details

### Component Props (TypeScript)

```typescript
interface EmbedBlockProps {
  embedUrl: string              // URL to embed
  embedType: 'iframe' | 'youtube' | 'vimeo' | 'google-maps' | 'google-forms' | 'google-drive' | 'html'
  embedCode: string             // Alternative: raw HTML
  aspectRatio: string           // CSS aspect ratio
  allowFullscreen: boolean      // Enable fullscreen
  autoHeight: boolean           // Dynamic height
  minHeight?: string            // CSS min-height
  maxHeight?: string            // CSS max-height
  borderRadius: string          // CSS border-radius
  showBorder: boolean           // Show border
  title: string                 // Accessibility title
  className?: string            // Additional CSS classes
  isEditing?: boolean           // Editing mode flag
}
```

### Default Props

```json
{
  "embedUrl": "",
  "embedType": "iframe",
  "embedCode": "",
  "aspectRatio": "16/9",
  "allowFullscreen": true,
  "autoHeight": false,
  "borderRadius": "8px",
  "showBorder": false,
  "title": "Embedded content"
}
```

## Integration

The component is automatically registered in the CMS component registry under the **"Media"** category with these keywords:

- embed
- iframe
- youtube
- maps
- form
- external

This makes it easily searchable in the page editor.

## Updates and Maintenance

- **Location**: `components/cms-blocks/media/embed-block.tsx`
- **To add new embed types**: Update the `embedType` enum in `registry-types.ts` and add URL parsing logic
- **To modify styling**: Edit the component's className and style props
- **To add features**: Extend the props schema in `registry-types.ts`

---

**Created**: 2026-01-08
**Last Updated**: 2026-01-08
**Version**: 1.0.0
