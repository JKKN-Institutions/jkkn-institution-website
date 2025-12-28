import { z } from 'zod'

/**
 * Page-Level Typography Settings
 *
 * These types define the typography settings that can be configured at the page level
 * and applied to all section headers (titles, subtitles, badges) on that page.
 */

// Font family options (page-level setting)
export const FontFamilySchema = z.enum([
  'poppins',    // Default - modern, clean sans-serif
  'inter',      // Popular UI font, excellent readability
  'roboto',     // Google's versatile typeface
  'montserrat', // Geometric sans-serif, bold headers
  'open-sans',  // Highly readable, neutral
  'lato',       // Warm and stable
  'playfair',   // Elegant serif for headings
]).default('poppins')
export type FontFamily = z.infer<typeof FontFamilySchema>

// Font style options
export const FontStyleSchema = z.enum(['normal', 'italic']).default('normal')
export type FontStyle = z.infer<typeof FontStyleSchema>

// Font weight options
export const FontWeightSchema = z.enum([
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold'
]).default('bold')
export type FontWeight = z.infer<typeof FontWeightSchema>

// Font size options (Tailwind-based)
export const FontSizeSchema = z.enum([
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl'
]).default('4xl')
export type FontSize = z.infer<typeof FontSizeSchema>

// Individual text element typography settings
export const TextTypographySchema = z.object({
  fontSize: FontSizeSchema.optional(),
  fontWeight: FontWeightSchema.optional(),
  fontStyle: FontStyleSchema.optional(),
  color: z.string().optional(),
})
export type TextTypography = z.infer<typeof TextTypographySchema>

// Badge-specific typography (extends with background color)
export const BadgeTypographySchema = TextTypographySchema.extend({
  backgroundColor: z.string().optional(),
})
export type BadgeTypography = z.infer<typeof BadgeTypographySchema>

// Complete page typography settings
export const PageTypographySettingsSchema = z.object({
  // Page-level font family (applies to entire page)
  fontFamily: FontFamilySchema.optional(),
  // Element-specific settings
  title: TextTypographySchema.optional(),
  subtitle: TextTypographySchema.optional(),
  badge: BadgeTypographySchema.optional(),
})
export type PageTypographySettings = z.infer<typeof PageTypographySettingsSchema>

// Required version for when all sections are initialized (e.g., in the panel)
export type RequiredTextTypography = {
  fontSize: FontSize
  fontWeight: FontWeight
  fontStyle: FontStyle
  color?: string
}

export type RequiredBadgeTypography = RequiredTextTypography & {
  backgroundColor?: string
}

export type RequiredPageTypographySettings = {
  fontFamily: FontFamily
  title: RequiredTextTypography
  subtitle: RequiredTextTypography
  badge: RequiredBadgeTypography
}

// Default typography values for fallback
export const DEFAULT_TITLE_TYPOGRAPHY: RequiredTextTypography = {
  fontSize: '4xl',
  fontWeight: 'bold',
  fontStyle: 'normal',
}

export const DEFAULT_SUBTITLE_TYPOGRAPHY: RequiredTextTypography = {
  fontSize: 'xl',
  fontWeight: 'normal',
  fontStyle: 'normal',
}

export const DEFAULT_BADGE_TYPOGRAPHY: RequiredBadgeTypography = {
  fontSize: 'sm',
  fontWeight: 'semibold',
  fontStyle: 'normal',
}

// Default font family
export const DEFAULT_FONT_FAMILY: FontFamily = 'poppins'

export const DEFAULT_PAGE_TYPOGRAPHY: RequiredPageTypographySettings = {
  fontFamily: DEFAULT_FONT_FAMILY,
  title: DEFAULT_TITLE_TYPOGRAPHY,
  subtitle: DEFAULT_SUBTITLE_TYPOGRAPHY,
  badge: DEFAULT_BADGE_TYPOGRAPHY,
}

// Font size to Tailwind class mapping
export const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
}

// Font size to responsive Tailwind class mapping (for titles)
export const FONT_SIZE_RESPONSIVE_CLASSES: Record<FontSize, string> = {
  sm: 'text-sm',
  md: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
  '2xl': 'text-2xl sm:text-3xl',
  '3xl': 'text-2xl sm:text-3xl md:text-4xl',
  '4xl': 'text-3xl sm:text-4xl md:text-5xl',
  '5xl': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
  '6xl': 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
}

// Font weight to Tailwind class mapping
export const FONT_WEIGHT_CLASSES: Record<FontWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
}

// Font style to Tailwind class mapping
export const FONT_STYLE_CLASSES: Record<FontStyle, string> = {
  normal: 'not-italic',
  italic: 'italic',
}

/**
 * Helper to get CSS classes from typography settings
 */
export function getTypographyClasses(
  typography: Partial<TextTypography> | undefined,
  options: { responsive?: boolean } = {}
): string {
  if (!typography) return ''

  const classes: string[] = []

  if (typography.fontSize) {
    classes.push(
      options.responsive
        ? FONT_SIZE_RESPONSIVE_CLASSES[typography.fontSize]
        : FONT_SIZE_CLASSES[typography.fontSize]
    )
  }

  if (typography.fontWeight) {
    classes.push(FONT_WEIGHT_CLASSES[typography.fontWeight])
  }

  if (typography.fontStyle) {
    classes.push(FONT_STYLE_CLASSES[typography.fontStyle])
  }

  return classes.join(' ')
}

/**
 * Helper to get inline styles from typography settings
 */
export function getTypographyStyles(
  typography: Partial<TextTypography | BadgeTypography> | undefined
): React.CSSProperties {
  if (!typography) return {}

  const styles: React.CSSProperties = {}

  if (typography.color) {
    styles.color = typography.color
  }

  if ('backgroundColor' in typography && typography.backgroundColor) {
    styles.backgroundColor = typography.backgroundColor
  }

  return styles
}

// Display labels for UI
export const FONT_SIZE_LABELS: Record<FontSize, string> = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
  '2xl': '2X Large',
  '3xl': '3X Large',
  '4xl': '4X Large',
  '5xl': '5X Large',
  '6xl': '6X Large',
}

export const FONT_WEIGHT_LABELS: Record<FontWeight, string> = {
  normal: 'Normal (400)',
  medium: 'Medium (500)',
  semibold: 'Semibold (600)',
  bold: 'Bold (700)',
  extrabold: 'Extra Bold (800)',
}

export const FONT_STYLE_LABELS: Record<FontStyle, string> = {
  normal: 'Normal',
  italic: 'Italic',
}

// Font family display labels for UI
export const FONT_FAMILY_LABELS: Record<FontFamily, string> = {
  poppins: 'Poppins',
  inter: 'Inter',
  roboto: 'Roboto',
  montserrat: 'Montserrat',
  'open-sans': 'Open Sans',
  lato: 'Lato',
  playfair: 'Playfair Display',
}

// Font family descriptions for UI tooltips
export const FONT_FAMILY_DESCRIPTIONS: Record<FontFamily, string> = {
  poppins: 'Clean, modern sans-serif (Default)',
  inter: 'Highly readable UI font',
  roboto: "Google's versatile typeface",
  montserrat: 'Geometric, urban elegance',
  'open-sans': 'Neutral, friendly humanist',
  lato: 'Warm, stable structure',
  playfair: 'Elegant serif for headings',
}

// CSS font-family fallback stacks
export const FONT_FAMILY_STACKS: Record<FontFamily, string> = {
  poppins: "'Poppins', ui-sans-serif, system-ui, sans-serif",
  inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  roboto: "'Roboto', ui-sans-serif, system-ui, sans-serif",
  montserrat: "'Montserrat', ui-sans-serif, system-ui, sans-serif",
  'open-sans': "'Open Sans', ui-sans-serif, system-ui, sans-serif",
  lato: "'Lato', ui-sans-serif, system-ui, sans-serif",
  playfair: "'Playfair Display', ui-serif, Georgia, serif",
}

// Google Font URLs for dynamic loading (excluding Poppins which is loaded globally)
export const GOOGLE_FONT_URLS: Record<FontFamily, string> = {
  poppins: '', // Already loaded globally in app/layout.tsx
  inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  roboto: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
  montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
  'open-sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap',
  lato: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap',
  playfair: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap',
}
