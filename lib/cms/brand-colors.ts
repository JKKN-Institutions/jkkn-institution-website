/**
 * JKKN Brand Colors Token System
 *
 * Centralized brand color definitions for the page builder.
 * These colors are used in:
 * - Color picker swatches
 * - Component default props
 * - Style presets
 */

export interface BrandColor {
  name: string
  value: string
  category: 'primary' | 'secondary' | 'neutral' | 'gradient'
  description?: string
}

export interface BrandGradient {
  name: string
  value: string
  category: 'brand' | 'accent' | 'neutral'
  description?: string
}

/**
 * JKKN Brand Color Palette
 */
export const BRAND_COLORS: BrandColor[] = [
  // Primary Colors
  {
    name: 'JKKN Green',
    value: '#0b6d41',
    category: 'primary',
    description: 'Primary brand color - used for headers, CTAs, and key elements'
  },
  {
    name: 'Green Light',
    value: '#0f8f56',
    category: 'primary',
    description: 'Lighter green for hover states and accents'
  },
  {
    name: 'Green Dark',
    value: '#085032',
    category: 'primary',
    description: 'Darker green for depth and contrast'
  },

  // Secondary Colors
  {
    name: 'JKKN Yellow',
    value: '#ffde59',
    category: 'secondary',
    description: 'Secondary brand color - used for highlights and accents'
  },
  {
    name: 'Yellow Light',
    value: '#fff0a3',
    category: 'secondary',
    description: 'Lighter yellow for backgrounds'
  },
  {
    name: 'Gold',
    value: '#f5c518',
    category: 'secondary',
    description: 'Gold accent for premium elements'
  },

  // Neutral Colors
  {
    name: 'Cream',
    value: '#fbfbee',
    category: 'neutral',
    description: 'Brand cream - primary background color'
  },
  {
    name: 'White',
    value: '#ffffff',
    category: 'neutral',
    description: 'Pure white for cards and contrast'
  },
  {
    name: 'Off White',
    value: '#f8f9fa',
    category: 'neutral',
    description: 'Subtle off-white for sections'
  },
  {
    name: 'Light Gray',
    value: '#e5e5e5',
    category: 'neutral',
    description: 'Light gray for borders and dividers'
  },
  {
    name: 'Dark Gray',
    value: '#4a4a4a',
    category: 'neutral',
    description: 'Dark gray for body text'
  },
  {
    name: 'Dark',
    value: '#171717',
    category: 'neutral',
    description: 'Near black for headings and important text'
  },
]

/**
 * Pre-defined Brand Gradients
 */
export const BRAND_GRADIENTS: BrandGradient[] = [
  {
    name: 'Green Primary',
    value: 'linear-gradient(135deg, #0b6d41, #085032)',
    category: 'brand',
    description: 'Primary green gradient for hero sections'
  },
  {
    name: 'Green Radial',
    value: 'radial-gradient(ellipse at top, #0f8f56, #0b6d41)',
    category: 'brand',
    description: 'Radial green gradient for special sections'
  },
  {
    name: 'Green Yellow',
    value: 'linear-gradient(135deg, #0b6d41, #ffde59)',
    category: 'brand',
    description: 'Green to yellow gradient for energetic sections'
  },
  {
    name: 'Yellow Warm',
    value: 'linear-gradient(135deg, #ffde59, #f5c518)',
    category: 'accent',
    description: 'Warm yellow gradient for CTAs'
  },
  {
    name: 'Cream Subtle',
    value: 'linear-gradient(180deg, #fbfbee, #ffffff)',
    category: 'neutral',
    description: 'Subtle cream gradient for backgrounds'
  },
  {
    name: 'Green Glow',
    value: 'linear-gradient(135deg, #0b6d41 0%, #0f8f56 50%, #0b6d41 100%)',
    category: 'brand',
    description: 'Animated green gradient for special effects'
  },
  {
    name: 'Dark Elegant',
    value: 'linear-gradient(135deg, #171717, #2d2d2d)',
    category: 'neutral',
    description: 'Dark gradient for footer and contrast sections'
  },
]

/**
 * Get colors by category
 */
export function getColorsByCategory(category: BrandColor['category']): BrandColor[] {
  return BRAND_COLORS.filter(color => color.category === category)
}

/**
 * Get gradients by category
 */
export function getGradientsByCategory(category: BrandGradient['category']): BrandGradient[] {
  return BRAND_GRADIENTS.filter(gradient => gradient.category === category)
}

/**
 * Find a color by its hex value
 */
export function findColorByValue(value: string): BrandColor | undefined {
  return BRAND_COLORS.find(color => color.value.toLowerCase() === value.toLowerCase())
}

/**
 * Get the primary brand colors (for quick access in UI)
 */
export const PRIMARY_BRAND_COLORS = [
  '#0b6d41', // JKKN Green
  '#ffde59', // JKKN Yellow
  '#fbfbee', // Cream
  '#ffffff', // White
  '#171717', // Dark
]

/**
 * CSS Variable mappings (matches app/globals.css)
 */
export const CSS_VARIABLES = {
  '--brand-primary': '#0b6d41',
  '--brand-primary-light': '#0f8f56',
  '--brand-primary-dark': '#085032',
  '--brand-secondary': '#ffde59',
  '--brand-secondary-light': '#fff0a3',
  '--brand-cream': '#fbfbee',
  '--brand-dark': '#171717',
} as const

/**
 * Default color scheme for new components
 */
export const DEFAULT_COLOR_SCHEME = {
  background: '#fbfbee',
  primary: '#0b6d41',
  secondary: '#ffde59',
  text: '#171717',
  textMuted: '#4a4a4a',
  border: '#e5e5e5',
  card: '#ffffff',
}
