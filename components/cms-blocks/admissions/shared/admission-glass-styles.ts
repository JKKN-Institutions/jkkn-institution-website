/**
 * Shared glassmorphism styles for admissions components
 * Medium glass: 10-15% opacity, 12px blur
 */

export const glassStyles = {
  // Card styles
  card: 'bg-white/10 backdrop-blur-[12px] border border-white/20 rounded-2xl shadow-lg',
  cardLight: 'bg-white/80 backdrop-blur-[12px] border border-gray-200/50 rounded-2xl shadow-lg',
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

  // Section badge
  sectionBadge: 'inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold/20 text-gold border border-gold/30',

  // Input/Form styles
  input: 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:bg-white/15 focus:border-white/30 transition-all duration-200',
} as const

/**
 * Status badge colors for admission dates
 */
export const statusColors = {
  upcoming: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    border: 'border-blue-400/30',
    dot: 'bg-blue-400',
  },
  open: {
    bg: 'bg-green-500/20',
    text: 'text-green-300',
    border: 'border-green-400/30',
    dot: 'bg-green-400',
  },
  closed: {
    bg: 'bg-red-500/20',
    text: 'text-red-300',
    border: 'border-red-400/30',
    dot: 'bg-red-400',
  },
  extended: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-300',
    border: 'border-yellow-400/30',
    dot: 'bg-yellow-400',
  },
} as const

export type StatusType = keyof typeof statusColors

/**
 * College header colors for the CollegesGrid component
 */
export const collegeColors = {
  dental: '#0b6d41',     // JKKN Green
  pharmacy: '#1e3a8a',   // Navy Blue
  engineering: '#7c2d12', // Burgundy
  nursing: '#0f766e',    // Teal
  artsScience: '#6b21a8', // Purple
  alliedHealth: '#b91c1c', // Crimson
  education: '#0369a1',  // Sky Blue
} as const

/**
 * Default college colors array
 */
export const defaultCollegeColors = [
  '#0b6d41', // JKKN Green
  '#1e3a8a', // Navy Blue
  '#7c2d12', // Burgundy
  '#0f766e', // Teal
  '#6b21a8', // Purple
  '#b91c1c', // Crimson
  '#0369a1', // Sky Blue
] as const

/**
 * Background gradient classes
 */
export const backgroundStyles = {
  'gradient-dark': 'bg-gradient-to-br from-brand-primary via-brand-primary-dark to-brand-primary-darker',
  'gradient-light': 'bg-gradient-to-br from-brand-cream via-white to-brand-cream',
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
  medical: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-400/30' },
  nursing: { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-400/30' },
  pharmacy: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-400/30' },
  engineering: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-400/30' },
  'arts-science': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-400/30' },
  education: { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-400/30' },
} as const

export type ProgramCategory = keyof typeof programCategoryColors
