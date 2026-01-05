// ============================================
// Glass Effect Types
// ============================================

export type BlurLevel = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type GlassVariant = 'light' | 'dark' | 'subtle' | 'strong'
export type GlowIntensity = 'subtle' | 'medium' | 'strong'

export type GlassColorTint =
  | 'none'
  | 'blue'
  | 'purple'
  | 'green'
  | 'red'
  | 'orange'
  | 'pink'
  | 'cyan'
  | 'jkkn-green'
  | 'jkkn-yellow'
  | 'jkkn-cream'
  | 'jkkn-gold'

export interface GlassSettings {
  enabled: boolean
  blurLevel: BlurLevel
  backgroundOpacity: number // 5-30%
  variant: GlassVariant
  colorTint: GlassColorTint
  customTintColor?: string
  tintOpacity: number // 10-30%
  borderEnabled: boolean
  borderOpacity: number // 10-40%
  glowEnabled: boolean
  glowColor?: string
  glowIntensity: GlowIntensity
}

export const DEFAULT_GLASS_SETTINGS: GlassSettings = {
  enabled: false,
  blurLevel: 'lg',
  backgroundOpacity: 10,
  variant: 'light',
  colorTint: 'none',
  tintOpacity: 15,
  borderEnabled: true,
  borderOpacity: 20,
  glowEnabled: false,
  glowIntensity: 'subtle',
}

// ============================================
// Glass Preset Types
// ============================================

export interface GlassPreset {
  id: string
  name: string
  category: 'brand' | 'generic'
  settings: Partial<GlassSettings>
}

// ============================================
// Utility Constants
// ============================================

export const BLUR_VALUES: Record<BlurLevel, number> = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 40,
}

export const TINT_COLORS: Record<GlassColorTint, string> = {
  none: 'transparent',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  green: '#22c55e',
  red: '#ef4444',
  orange: '#f97316',
  pink: '#ec4899',
  cyan: '#06b6d4',
  'jkkn-green': '#0b6d41',
  'jkkn-yellow': '#ffde59',
  'jkkn-cream': '#fbfbee',
  'jkkn-gold': '#f5c518',
}

export const GLOW_BLUR_VALUES: Record<GlowIntensity, number> = {
  subtle: 10,
  medium: 20,
  strong: 30,
}
