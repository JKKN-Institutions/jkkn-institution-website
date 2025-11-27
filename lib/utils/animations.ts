// Animation variants for framer-motion like animations using Tailwind CSS
// These can be used with the cn() utility for conditional animations

export const animations = {
  // Fade animations
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-200',
  fadeInUp: 'animate-in fade-in slide-in-from-bottom-4 duration-300',
  fadeInDown: 'animate-in fade-in slide-in-from-top-4 duration-300',
  fadeInLeft: 'animate-in fade-in slide-in-from-left-4 duration-300',
  fadeInRight: 'animate-in fade-in slide-in-from-right-4 duration-300',

  // Scale animations
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-150',

  // Slide animations
  slideInTop: 'animate-in slide-in-from-top duration-300',
  slideInBottom: 'animate-in slide-in-from-bottom duration-300',
  slideInLeft: 'animate-in slide-in-from-left duration-300',
  slideInRight: 'animate-in slide-in-from-right duration-300',

  // Combined animations
  popIn: 'animate-in fade-in zoom-in-95 duration-200',
  popOut: 'animate-out fade-out zoom-out-95 duration-150',

  // Stagger delay classes (for use with children)
  staggerDelay1: 'delay-[50ms]',
  staggerDelay2: 'delay-[100ms]',
  staggerDelay3: 'delay-[150ms]',
  staggerDelay4: 'delay-[200ms]',
  staggerDelay5: 'delay-[250ms]',

  // Hover animations
  hoverScale: 'transition-transform hover:scale-105',
  hoverLift: 'transition-all hover:-translate-y-1 hover:shadow-lg',
  hoverGlow: 'transition-shadow hover:shadow-lg hover:shadow-primary/20',

  // Loading states
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
}

// CSS keyframe animations that can be added to globals.css
export const cssAnimations = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200% 100%;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-gradient {
  animation: gradient 3s ease infinite;
  background-size: 200% 200%;
}
`

// Transition presets
export const transitions = {
  fast: 'transition-all duration-150 ease-out',
  normal: 'transition-all duration-200 ease-out',
  slow: 'transition-all duration-300 ease-out',
  spring: 'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
  bounce: 'transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
}

// Page transition variants
export const pageTransitions = {
  enter: 'animate-in fade-in slide-in-from-bottom-4 duration-500',
  exit: 'animate-out fade-out slide-out-to-top-4 duration-300',
}

// Stagger animation utility
export function getStaggerDelay(index: number, baseDelay = 50): string {
  const delay = index * baseDelay
  return `delay-[${delay}ms]`
}

// Generate stagger animation classes for a list
export function staggerChildren(
  count: number,
  animation = animations.fadeInUp,
  baseDelay = 50
): string[] {
  return Array.from({ length: count }, (_, i) => {
    const delay = i * baseDelay
    return `${animation} delay-[${delay}ms]`
  })
}
