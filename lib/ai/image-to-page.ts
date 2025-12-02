'use server'

import Anthropic from '@anthropic-ai/sdk'

// Available components for page generation
const AVAILABLE_COMPONENTS = {
  content: [
    { name: 'HeroSection', description: 'Full-width hero with background, title, subtitle, CTA buttons' },
    { name: 'Heading', description: 'Simple heading text (h1-h6)' },
    { name: 'TextEditor', description: 'Rich text paragraph content' },
    { name: 'CallToAction', description: 'CTA section with title, description, buttons' },
    { name: 'Testimonials', description: 'Customer testimonials/reviews section' },
    { name: 'FAQAccordion', description: 'Frequently asked questions accordion' },
    { name: 'TabsBlock', description: 'Tabbed content sections' },
    { name: 'Timeline', description: 'Vertical timeline for history/process' },
    { name: 'PricingTables', description: 'Pricing plans comparison table' },
  ],
  media: [
    { name: 'ImageBlock', description: 'Single image with caption' },
    { name: 'ImageGallery', description: 'Grid gallery of images' },
    { name: 'VideoPlayer', description: 'Embedded video player' },
    { name: 'ImageCarousel', description: 'Carousel/slider of images' },
    { name: 'LogoCloud', description: 'Grid of partner/client logos' },
  ],
  layout: [
    { name: 'Container', description: 'Content container with max-width' },
    { name: 'SectionWrapper', description: 'Section with background, padding' },
    { name: 'GridLayout', description: 'CSS grid layout for columns' },
    { name: 'Spacer', description: 'Vertical spacing between sections' },
    { name: 'Divider', description: 'Horizontal dividing line' },
  ],
  data: [
    { name: 'StatsCounter', description: 'Animated statistics/counters' },
    { name: 'EventsList', description: 'List of events from database' },
    { name: 'FacultyDirectory', description: 'Faculty/team members grid' },
    { name: 'AnnouncementsFeed', description: 'Latest announcements feed' },
    { name: 'BlogPostsGrid', description: 'Blog posts grid from database' },
  ],
}

// Build the component reference for the AI
function buildComponentReference(): string {
  let reference = 'Available components for page building:\n\n'

  for (const [category, components] of Object.entries(AVAILABLE_COMPONENTS)) {
    reference += `## ${category.charAt(0).toUpperCase() + category.slice(1)} Components:\n`
    for (const comp of components) {
      reference += `- **${comp.name}**: ${comp.description}\n`
    }
    reference += '\n'
  }

  return reference
}

// The AI prompt for analyzing images
const SYSTEM_PROMPT = `You are an expert web designer and developer. Your task is to analyze a screenshot of a website/landing page and convert it into a structured page layout using pre-built components.

${buildComponentReference()}

## Your Task:
1. Analyze the uploaded image carefully
2. Identify the sections/blocks in the page (top to bottom)
3. Map each section to the most appropriate component from the list above
4. Extract text content, colors, and styling information
5. Return a JSON array of blocks that recreates the page layout

## Output Format:
Return ONLY a valid JSON array. Each block should have:
{
  "component_name": "ComponentName",
  "props": {
    // Component-specific props based on the content
  },
  "sort_order": 0, // Order in page (0 = first)
  "description": "Brief description of what this block represents"
}

## Component Props Guidelines:

### HeroSection props:
- title: string (main heading)
- subtitle: string (subheading)
- alignment: "left" | "center" | "right"
- backgroundType: "image" | "gradient"
- ctaButtons: [{label: string, href: string, variant: "primary" | "secondary"}]

### Heading props:
- text: string
- level: 1-6
- alignment: "left" | "center" | "right"

### TextEditor props:
- content: string (the paragraph text)

### CallToAction props:
- title: string
- description: string
- primaryButton: {label: string, href: string}
- secondaryButton: {label: string, href: string}

### Testimonials props:
- testimonials: [{quote: string, author: string, role: string, avatar: string}]

### StatsCounter props:
- stats: [{value: number, label: string, suffix: string}]

### ImageBlock props:
- src: string (use placeholder like "/placeholder-image.jpg")
- alt: string
- caption: string

### SectionWrapper props:
- backgroundColor: string (hex color)
- paddingY: "small" | "medium" | "large"

## Important Rules:
1. ONLY output the JSON array, no explanations
2. Use components from the provided list ONLY
3. Preserve the visual hierarchy and content from the image
4. Use placeholder images where actual images would be
5. Extract actual text content visible in the image
6. Estimate colors based on what you see`

export interface GeneratedBlock {
  component_name: string
  props: Record<string, unknown>
  sort_order: number
  description?: string
}

export interface ImageToPageResult {
  success: boolean
  blocks?: GeneratedBlock[]
  error?: string
  rawResponse?: string
}

/**
 * Analyze an image and generate page blocks using Claude Vision
 */
export async function analyzeImageAndGenerateBlocks(
  imageBase64: string,
  imageMediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
): Promise<ImageToPageResult> {
  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return {
      success: false,
      error: 'Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your environment variables.',
    }
  }

  try {
    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageMediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: 'Analyze this website screenshot and generate a JSON array of page blocks that would recreate this layout using the available components. Extract all visible text content and preserve the visual structure.',
            },
          ],
        },
      ],
    })

    // Extract the text response
    const textContent = response.content.find((c) => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return {
        success: false,
        error: 'No text response from AI',
      }
    }

    const rawResponse = textContent.text

    // Try to parse JSON from the response
    // The AI might include markdown code blocks, so we need to extract the JSON
    let jsonStr = rawResponse

    // Remove markdown code blocks if present
    const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1]
    }

    // Try to find JSON array
    const arrayMatch = jsonStr.match(/\[[\s\S]*\]/)
    if (arrayMatch) {
      jsonStr = arrayMatch[0]
    }

    try {
      const blocks = JSON.parse(jsonStr) as GeneratedBlock[]

      // Validate and clean up blocks
      const validBlocks = blocks
        .filter((block) => block.component_name && typeof block.props === 'object')
        .map((block, index) => ({
          ...block,
          sort_order: block.sort_order ?? index,
          props: block.props || {},
        }))

      return {
        success: true,
        blocks: validBlocks,
        rawResponse,
      }
    } catch (parseError) {
      return {
        success: false,
        error: 'Failed to parse AI response as JSON',
        rawResponse,
      }
    }
  } catch (error) {
    console.error('Image analysis error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Convert an uploaded file to base64
 */
export async function fileToBase64(file: File): Promise<{
  base64: string
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
}> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = buffer.toString('base64')

  // Determine media type
  let mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg'
  if (file.type === 'image/png') mediaType = 'image/png'
  else if (file.type === 'image/gif') mediaType = 'image/gif'
  else if (file.type === 'image/webp') mediaType = 'image/webp'

  return { base64, mediaType }
}
