/**
 * Shared glassmorphism styles for admissions components
 * Medium glass: 10-15% opacity, 12px blur
 */

export const glassStyles = {
  // Card styles
  card: 'bg-white/10 backdrop-blur-[12px] border border-white/20 rounded-2xl shadow-lg',
  cardLight: 'bg-white/80 backdrop-blur-[12px] border border-brand-primary/20 rounded-2xl shadow-lg',
  cardHover: 'hover:bg-white/15 hover:border-white/30 hover:shadow-xl transition-all duration-300',

  // Table styles
  tableContainer: 'bg-white/5 backdrop-blur-[12px] border border-white/15 rounded-2xl overflow-hidden',
  tableHeader: 'bg-white/10 backdrop-blur-md border-b border-white/20',
  tableRow: 'bg-white/5 backdrop-blur-sm border-b border-white/10',
  tableRowAlt: 'bg-white/[0.08] backdrop-blur-sm border-b border-white/10',
  tableRowHover: 'hover:bg-white/[0.12] transition-colors duration-200',

  // Badge styles
  badge: 'bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5',
  badgeGold: 'bg-gold/20 text-gold border border-gold/30',

  // Section badge (for dark backgrounds)
  sectionBadge: 'inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold/20 text-gold border border-gold/30',
  // Section badge for light backgrounds
  sectionBadgeLight: 'inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-primary/10 text-brand-primary border border-brand-primary/20',

  // Input/Form styles
  input: 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:bg-white/15 focus:border-white/30 transition-all duration-200',
} as const

/**
 * Status badge colors for admission dates
 */
export const statusColors = {
  upcoming: {
    bg: 'bg-brand-primary/15',
    text: 'text-brand-primary',
    border: 'border-brand-primary/30',
    dot: 'bg-brand-primary',
  },
  open: {
    bg: 'bg-gold/20',
    text: 'text-gold',
    border: 'border-gold/30',
    dot: 'bg-gold',
  },
  closed: {
    bg: 'bg-brand-primary/10',
    text: 'text-brand-primary/60',
    border: 'border-brand-primary/20',
    dot: 'bg-brand-primary/50',
  },
  extended: {
    bg: 'bg-gold/15',
    text: 'text-gold',
    border: 'border-gold/25',
    dot: 'bg-gold/80',
  },
} as const

export type StatusType = keyof typeof statusColors

/**
 * College header colors for the CollegesGrid component
 */
export const collegeColors = {
  dental: '#0b6d41',     // Brand Green
  pharmacy: '#0b6d41',   // Brand Green
  engineering: '#0b6d41', // Brand Green
  nursing: '#0b6d41',    // Brand Green
  artsScience: '#0b6d41', // Brand Green
  alliedHealth: '#0b6d41', // Brand Green
  education: '#0b6d41',  // Brand Green
} as const

/**
 * Default college colors array
 */
export const defaultCollegeColors = [
  '#0b6d41', // Brand Green
  '#0b6d41', // Brand Green
  '#0b6d41', // Brand Green
  '#0b6d41', // Brand Green
  '#0b6d41', // Brand Green
  '#0b6d41', // Brand Green
  '#0b6d41', // Brand Green
] as const

/**
 * Background gradient classes
 */
export const backgroundStyles = {
  'gradient-dark': 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
  'gradient-light': 'bg-gradient-to-br from-brand-primary/5 via-white to-brand-primary/5',
  'white-professional': 'bg-gradient-to-br from-white via-slate-50/50 to-white',
  'solid': 'bg-white',
  'transparent': 'bg-transparent',
} as const

export type BackgroundStyle = keyof typeof backgroundStyles

/**
 * Animation delay calculation for staggered animations
 */
export function getStaggerDelay(index: number, baseDelay = 100): string {
  return `${index * baseDelay}ms`
}

/**
 * Get dark/light mode context based on background
 */
export function isDarkBackground(background: BackgroundStyle): boolean {
  return background === 'gradient-dark'
}

/**
 * Scholarship type icons mapping
 */
export const scholarshipIcons = {
  merit: 'Trophy',
  government: 'Building2',
  'need-based': 'Heart',
  'sports-cultural': 'Medal',
} as const

/**
 * Program category colors for eligibility table
 */
export const programCategoryColors = {
  medical: { bg: 'bg-brand-primary/20', text: 'text-brand-primary', border: 'border-brand-primary/30' },
  nursing: { bg: 'bg-gold/20', text: 'text-gold', border: 'border-gold/30' },
  pharmacy: { bg: 'bg-brand-primary/15', text: 'text-brand-primary', border: 'border-brand-primary/25' },
  engineering: { bg: 'bg-gold/15', text: 'text-gold', border: 'border-gold/25' },
  'arts-science': { bg: 'bg-brand-primary/10', text: 'text-brand-primary', border: 'border-brand-primary/20' },
  education: { bg: 'bg-gold/10', text: 'text-gold', border: 'border-gold/20' },
} as const

export type ProgramCategory = keyof typeof programCategoryColors
