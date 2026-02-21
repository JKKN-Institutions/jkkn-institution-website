/**
 * Optimized Bottom Navigation - Performance Focused
 *
 * This component replaces Framer Motion animations with CSS transitions
 * for better performance and smaller bundle size.
 *
 * Bundle savings: ~60KB (Framer Motion removed)
 * Performance gain: No JavaScript for animations, pure CSS
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { throttleRAF } from '@/lib/utils/dom-performance'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Search, Calendar, Menu } from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface OptimizedBottomNavProps {
  items?: NavItem[]
  className?: string
}

const defaultItems: NavItem[] = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Courses', href: '/courses', icon: Search },
  { title: 'Events', href: '/events', icon: Calendar },
  { title: 'More', href: '/more', icon: Menu },
]

export function OptimizedBottomNav({ items = defaultItems, className }: OptimizedBottomNavProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = throttleRAF(() => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY < lastScrollYRef.current || currentScrollY < 10)
      lastScrollYRef.current = currentScrollY
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      handleScroll.cancel()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white/80 backdrop-blur-lg border-t border-gray-200',
        'transition-transform duration-300 ease-in-out',
        isVisible ? 'translate-y-0' : 'translate-y-full',
        'md:hidden', // Hide on desktop
        className
      )}
      style={{
        // GPU-accelerated transform
        willChange: 'transform',
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center',
                'w-full h-full gap-1',
                'transition-all duration-200 ease-in-out',
                'text-gray-600 hover:text-primary',
                'active:scale-95', // Touch feedback
                isActive && 'text-primary font-semibold'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform duration-200',
                  isActive && 'scale-110'
                )}
              />
              <span className="text-xs">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
