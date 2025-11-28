/**
 * AI Design Enhancer
 *
 * Automatically applies glassmorphism and modern UI design patterns
 * to CMS page blocks. This creates enhanced versions of page designs
 * with professional styling.
 */

import type { PageBlock } from './registry-types'

// Glassmorphism style presets
export const GLASS_PRESETS = {
  light: {
    background: 'bg-white/10',
    backdropBlur: 'backdrop-blur-xl',
    border: 'border border-white/20',
    shadow: 'shadow-[0_8px_32px_rgba(0,0,0,0.1)]',
  },
  medium: {
    background: 'bg-white/20',
    backdropBlur: 'backdrop-blur-2xl',
    border: 'border border-white/30',
    shadow: 'shadow-[0_8px_32px_rgba(0,0,0,0.15)]',
  },
  strong: {
    background: 'bg-white/30',
    backdropBlur: 'backdrop-blur-3xl',
    border: 'border-2 border-white/40',
    shadow: 'shadow-[0_12px_48px_rgba(0,0,0,0.2)]',
  },
  dark: {
    background: 'bg-black/20',
    backdropBlur: 'backdrop-blur-xl',
    border: 'border border-white/10',
    shadow: 'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
  },
  brand: {
    background: 'bg-primary/10',
    backdropBlur: 'backdrop-blur-xl',
    border: 'border border-primary/20',
    shadow: 'shadow-[0_8px_32px_rgba(11,109,65,0.15)]',
  },
} as const

export type GlassPreset = keyof typeof GLASS_PRESETS

// Enhancement rules for each component type
interface EnhancementRule {
  wrapperClass: string
  innerClass?: string
  backgroundGradient?: string
  animations?: string
  extraStyles?: Record<string, unknown>
}

const ENHANCEMENT_RULES: Record<string, EnhancementRule> = {
  HeroSection: {
    wrapperClass: 'relative overflow-hidden',
    innerClass: 'relative z-10',
    backgroundGradient: 'bg-gradient-to-br from-primary/5 via-transparent to-secondary/5',
    animations: 'animate-fade-in',
    extraStyles: {
      overlay: true,
      overlayOpacity: 0.4,
    },
  },
  TextEditor: {
    wrapperClass: `p-8 rounded-3xl ${GLASS_PRESETS.light.background} ${GLASS_PRESETS.light.backdropBlur} ${GLASS_PRESETS.light.border}`,
    animations: 'hover:shadow-xl transition-all duration-500',
  },
  Heading: {
    wrapperClass: 'relative',
    innerClass: 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70',
    animations: 'animate-slide-up',
  },
  CallToAction: {
    wrapperClass: `p-12 rounded-3xl ${GLASS_PRESETS.brand.background} ${GLASS_PRESETS.brand.backdropBlur} ${GLASS_PRESETS.brand.border} ${GLASS_PRESETS.brand.shadow}`,
    backgroundGradient: 'bg-gradient-to-br from-primary/10 via-transparent to-secondary/10',
    animations: 'hover:scale-[1.02] transition-transform duration-500',
  },
  Testimonials: {
    wrapperClass: 'relative',
    innerClass: `p-6 rounded-2xl ${GLASS_PRESETS.light.background} ${GLASS_PRESETS.light.backdropBlur} ${GLASS_PRESETS.light.border}`,
    animations: 'hover:shadow-2xl transition-all duration-300',
  },
  FAQAccordion: {
    wrapperClass: `rounded-2xl overflow-hidden ${GLASS_PRESETS.light.background} ${GLASS_PRESETS.light.backdropBlur}`,
    innerClass: 'divide-y divide-white/10',
  },
  TabsBlock: {
    wrapperClass: `p-6 rounded-2xl ${GLASS_PRESETS.light.background} ${GLASS_PRESETS.light.backdropBlur} ${GLASS_PRESETS.light.border}`,
  },
  Timeline: {
    wrapperClass: 'relative',
    innerClass: 'space-y-8',
    backgroundGradient: 'before:absolute before:left-1/2 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-primary before:to-primary/20',
  },
  PricingTables: {
    wrapperClass: 'grid gap-6',
    innerClass: `p-8 rounded-3xl ${GLASS_PRESETS.medium.background} ${GLASS_PRESETS.medium.backdropBlur} ${GLASS_PRESETS.medium.border} hover:scale-105 transition-transform duration-300`,
  },
  ImageBlock: {
    wrapperClass: 'group relative overflow-hidden rounded-2xl',
    innerClass: 'transition-transform duration-500 group-hover:scale-105',
    animations: 'after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/50 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity',
  },
  ImageGallery: {
    wrapperClass: 'grid gap-4',
    innerClass: `rounded-xl overflow-hidden ${GLASS_PRESETS.light.border} hover:shadow-xl transition-all duration-300`,
  },
  VideoPlayer: {
    wrapperClass: `rounded-2xl overflow-hidden ${GLASS_PRESETS.dark.border} ${GLASS_PRESETS.dark.shadow}`,
  },
  ImageCarousel: {
    wrapperClass: 'relative rounded-2xl overflow-hidden',
    innerClass: 'transition-all duration-500',
  },
  BeforeAfterSlider: {
    wrapperClass: `rounded-2xl overflow-hidden ${GLASS_PRESETS.light.border}`,
  },
  LogoCloud: {
    wrapperClass: `py-8 px-6 rounded-2xl ${GLASS_PRESETS.light.background} ${GLASS_PRESETS.light.backdropBlur}`,
    innerClass: 'grayscale hover:grayscale-0 transition-all duration-300',
  },
  Container: {
    wrapperClass: `rounded-3xl ${GLASS_PRESETS.light.background} ${GLASS_PRESETS.light.backdropBlur} ${GLASS_PRESETS.light.border}`,
    animations: 'hover:shadow-xl transition-shadow duration-300',
  },
  GridLayout: {
    wrapperClass: 'grid gap-6',
    innerClass: `p-6 rounded-2xl ${GLASS_PRESETS.light.background} ${GLASS_PRESETS.light.backdropBlur}`,
  },
  FlexboxLayout: {
    wrapperClass: 'flex gap-4',
    innerClass: `p-4 rounded-xl ${GLASS_PRESETS.light.background} ${GLASS_PRESETS.light.backdropBlur}`,
  },
  Spacer: {
    wrapperClass: 'relative',
    backgroundGradient: 'bg-gradient-to-r from-transparent via-primary/10 to-transparent',
  },
  Divider: {
    wrapperClass: 'relative',
    innerClass: 'bg-gradient-to-r from-transparent via-primary/30 to-transparent',
  },
  SectionWrapper: {
    wrapperClass: 'relative overflow-hidden',
    backgroundGradient: 'bg-gradient-to-br from-primary/5 via-background to-secondary/5',
    innerClass: 'relative z-10',
  },
  StatsCounter: {
    wrapperClass: 'grid gap-6',
    innerClass: `p-6 rounded-2xl text-center ${GLASS_PRESETS.brand.background} ${GLASS_PRESETS.brand.backdropBlur} ${GLASS_PRESETS.brand.border} hover:scale-105 transition-transform duration-300`,
  },
  EventsList: {
    wrapperClass: 'space-y-4',
    innerClass: `p-4 rounded-xl ${GLASS_PRESETS.light.background} ${GLASS_PRESETS.light.backdropBlur} ${GLASS_PRESETS.light.border} hover:border-primary/30 transition-colors duration-300`,
  },
  FacultyDirectory: {
    wrapperClass: 'grid gap-6',
    innerClass: `p-6 rounded-2xl ${GLASS_PRESETS.light.background} ${GLASS_PRESETS.light.backdropBlur} ${GLASS_PRESETS.light.border} hover:shadow-xl transition-all duration-300`,
  },
  AnnouncementsFeed: {
    wrapperClass: 'space-y-3',
    innerClass: `p-4 rounded-xl ${GLASS_PRESETS.light.background} ${GLASS_PRESETS.light.backdropBlur} border-l-4 border-l-primary`,
  },
  BlogPostsGrid: {
    wrapperClass: 'grid gap-6',
    innerClass: `rounded-2xl overflow-hidden ${GLASS_PRESETS.light.background} ${GLASS_PRESETS.light.backdropBlur} ${GLASS_PRESETS.light.border} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`,
  },
}

export interface EnhancedBlock extends PageBlock {
  enhancedProps: Record<string, unknown>
  wrapperClassName: string
  innerClassName?: string
  backgroundGradient?: string
  animations?: string
}

export interface DesignEnhancementResult {
  originalBlocks: PageBlock[]
  enhancedBlocks: EnhancedBlock[]
  appliedStyles: {
    glassPreset: GlassPreset
    colorScheme: 'light' | 'dark' | 'brand'
    animationsEnabled: boolean
  }
  timestamp: string
}

/**
 * Enhance a single block with glassmorphism styling
 */
export function enhanceBlock(
  block: PageBlock,
  options: {
    glassPreset?: GlassPreset
    enableAnimations?: boolean
  } = {}
): EnhancedBlock {
  const { glassPreset = 'light', enableAnimations = true } = options
  const rule = ENHANCEMENT_RULES[block.componentName] || {}
  const glassStyles = GLASS_PRESETS[glassPreset]

  // Merge original props with enhanced styles
  const enhancedProps: Record<string, unknown> = {
    ...block.props,
  }

  // Apply extra styles from rules
  if (rule.extraStyles) {
    Object.assign(enhancedProps, rule.extraStyles)
  }

  return {
    ...block,
    enhancedProps,
    wrapperClassName: rule.wrapperClass || '',
    innerClassName: rule.innerClass,
    backgroundGradient: rule.backgroundGradient,
    animations: enableAnimations ? rule.animations : undefined,
  }
}

/**
 * Enhance all blocks on a page
 */
export function enhancePage(
  blocks: PageBlock[],
  options: {
    glassPreset?: GlassPreset
    colorScheme?: 'light' | 'dark' | 'brand'
    enableAnimations?: boolean
  } = {}
): DesignEnhancementResult {
  const {
    glassPreset = 'brand',
    colorScheme = 'light',
    enableAnimations = true,
  } = options

  const enhancedBlocks = blocks.map((block) =>
    enhanceBlock(block, { glassPreset, enableAnimations })
  )

  return {
    originalBlocks: blocks,
    enhancedBlocks,
    appliedStyles: {
      glassPreset,
      colorScheme,
      animationsEnabled: enableAnimations,
    },
    timestamp: new Date().toISOString(),
  }
}

/**
 * Generate CSS custom properties for the enhanced design
 */
export function generateEnhancedCSS(preset: GlassPreset = 'brand'): string {
  const styles = GLASS_PRESETS[preset]

  return `
    /* AI-Enhanced Glassmorphism Styles */
    .enhanced-page {
      --glass-bg: ${styles.background};
      --glass-blur: ${styles.backdropBlur};
      --glass-border: ${styles.border};
      --glass-shadow: ${styles.shadow};
    }

    .enhanced-block {
      @apply ${styles.background} ${styles.backdropBlur} ${styles.border} ${styles.shadow};
      @apply rounded-2xl transition-all duration-300;
    }

    .enhanced-block:hover {
      @apply shadow-xl scale-[1.01];
    }

    /* Gradient overlays */
    .enhanced-gradient-overlay {
      @apply absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none;
    }

    /* Animation classes */
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-up {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in {
      animation: fade-in 0.6s ease-out forwards;
    }

    .animate-slide-up {
      animation: slide-up 0.8s ease-out forwards;
    }

    /* Stagger children animations */
    .stagger-children > * {
      opacity: 0;
      animation: fade-in 0.5s ease-out forwards;
    }

    .stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
    .stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
    .stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
    .stagger-children > *:nth-child(4) { animation-delay: 0.4s; }
    .stagger-children > *:nth-child(5) { animation-delay: 0.5s; }
  `
}

/**
 * Get enhancement preview data for UI display
 */
export function getEnhancementPreview(componentName: string): {
  description: string
  features: string[]
  previewStyles: string
} {
  const rule = ENHANCEMENT_RULES[componentName]

  if (!rule) {
    return {
      description: 'Standard glassmorphism styling',
      features: ['Backdrop blur', 'Transparent background', 'Subtle borders'],
      previewStyles: GLASS_PRESETS.light.background,
    }
  }

  const features: string[] = []

  if (rule.wrapperClass?.includes('backdrop-blur')) features.push('Frosted glass effect')
  if (rule.wrapperClass?.includes('rounded')) features.push('Rounded corners')
  if (rule.wrapperClass?.includes('shadow')) features.push('Depth shadows')
  if (rule.backgroundGradient) features.push('Gradient overlay')
  if (rule.animations) features.push('Smooth animations')
  if (rule.wrapperClass?.includes('hover:')) features.push('Hover interactions')

  return {
    description: `Enhanced ${componentName} with modern glassmorphism design`,
    features,
    previewStyles: rule.wrapperClass || '',
  }
}
