# CMS Component Preview Images

This directory contains preview images for CMS page builder components.
These images are shown when hovering over components in the page builder palette.

## Auto-Generate Previews (Recommended)

The easiest way to generate preview images is using the automated screenshot script:

```bash
# 1. Start the dev server (in one terminal)
npm run dev

# 2. Run the preview generator (in another terminal)
npm run generate:previews
```

This will:
1. Launch a headless browser
2. Navigate to each component's preview page
3. Capture a screenshot of the actual rendered component
4. Save images to this directory

### Benefits of Auto-Generation
- Always matches actual component appearance
- No manual design work required
- Updates automatically when components change
- Consistent styling across all previews

## Alternative: Manual Figma Approach

If you prefer manual design control:

1. Set up Figma access token in `.env.local`:
   ```
   FIGMA_ACCESS_TOKEN=your_figma_token
   FIGMA_FILE_KEY=your_figma_file_key
   ```
2. In Figma, create 400x300px frames named exactly like component names
3. Run: `npx tsx scripts/figma-preview-sync.ts`

## Component List (26 total)

### Content Blocks (9)
- HeroSection.png
- TextEditor.png
- Heading.png
- CallToAction.png
- Testimonials.png
- FAQAccordion.png
- TabsBlock.png
- Timeline.png
- PricingTables.png

### Media Blocks (6)
- ImageBlock.png
- ImageGallery.png
- VideoPlayer.png
- ImageCarousel.png
- BeforeAfterSlider.png
- LogoCloud.png

### Layout Blocks (6)
- Container.png
- GridLayout.png
- FlexboxLayout.png
- Spacer.png
- Divider.png
- SectionWrapper.png

### Data Blocks (5)
- StatsCounter.png
- EventsList.png
- FacultyDirectory.png
- AnnouncementsFeed.png
- BlogPostsGrid.png

## Image Specifications
- Size: 800x600px (captured at 2x for retina)
- Format: PNG
- Background: Light gray (#f8f9fa)

## Troubleshooting

### "Dev server is not running"
Start the dev server first: `npm run dev`

### Screenshots look wrong
Check the preview page directly: `http://localhost:3000/admin/preview-capture?component=HeroSection`

### Missing components
Ensure all components are registered in `lib/cms/component-registry.ts`
