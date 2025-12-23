'use client'

import { Award, TrendingUp, Users, Calendar, Shield, Trophy, CheckCircle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface TrustBadgeItem {
  icon: string
  text: string
}

export interface TrustBadgesProps {
  badges: TrustBadgeItem[]
  alignment?: 'left' | 'center' | 'right'
  badgeStyle?: 'pill' | 'card' | 'minimal'
  backgroundColor?: string
  textColor?: string
  iconColor?: string
  borderColor?: string
  gap?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  TrendingUp,
  Users,
  Calendar,
  Shield,
  Trophy,
  CheckCircle,
  Star
}

export default function TrustBadges({
  badges = [
    { icon: 'Award', text: 'NAAC Accredited' },
    { icon: 'TrendingUp', text: '95%+ Placements' },
    { icon: 'Users', text: '100+ Top Recruiters' },
    { icon: 'Calendar', text: '39 Years of Excellence' }
  ],
  alignment = 'center',
  badgeStyle = 'pill',
  backgroundColor = '#ffffff',
  textColor = '#171717',
  iconColor = '#0b6d41',
  borderColor = '#ffffff4d',
  gap = 'md',
  animated = true
}: TrustBadgesProps) {

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  }

  const getIconComponent = (iconName: string): LucideIcon => {
    return ICON_MAP[iconName] || Award
  }

  const renderBadge = (badge: TrustBadgeItem, index: number) => {
    const Icon = getIconComponent(badge.icon)

    // Pill style (default)
    if (badgeStyle === 'pill') {
      return (
        <div
          key={index}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300',
            animated && 'hover:shadow-xl hover:scale-105'
          )}
          style={{
            backgroundColor: `${backgroundColor}f2`, // 95% opacity
            border: `1px solid ${borderColor}`
          }}
        >
          <Icon
            className="w-4 h-4 flex-shrink-0"
            style={{ color: iconColor }}
          />
          <span
            className="text-xs sm:text-sm font-semibold whitespace-nowrap"
            style={{ color: textColor }}
          >
            {badge.text}
          </span>
        </div>
      )
    }

    // Card style
    if (badgeStyle === 'card') {
      return (
        <div
          key={index}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-xl backdrop-blur-sm shadow-lg transition-all duration-300',
            animated && 'hover:shadow-xl hover:-translate-y-1'
          )}
          style={{
            backgroundColor: `${backgroundColor}f2`,
            border: `1px solid ${borderColor}`
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${iconColor}1a` }} // 10% opacity
          >
            <Icon
              className="w-5 h-5"
              style={{ color: iconColor }}
            />
          </div>
          <span
            className="text-xs sm:text-sm font-semibold text-center"
            style={{ color: textColor }}
          >
            {badge.text}
          </span>
        </div>
      )
    }

    // Minimal style
    return (
      <div
        key={index}
        className={cn(
          'inline-flex items-center gap-2 transition-all duration-300',
          animated && 'hover:scale-105'
        )}
      >
        <Icon
          className="w-4 h-4 flex-shrink-0"
          style={{ color: iconColor }}
        />
        <span
          className="text-xs sm:text-sm font-semibold whitespace-nowrap"
          style={{ color: textColor }}
        >
          {badge.text}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-full py-4',
        alignment === 'center' && 'text-center'
      )}
    >
      <div
        className={cn(
          'flex flex-wrap items-center max-w-5xl',
          alignmentClasses[alignment],
          gapClasses[gap],
          alignment === 'center' && 'mx-auto'
        )}
      >
        {badges.map((badge, index) => renderBadge(badge, index))}
      </div>
    </div>
  )
}
