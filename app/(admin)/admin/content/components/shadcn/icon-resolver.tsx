'use client'

import {
  BarChart3,
  Calendar,
  Sparkles,
  Layers,
  Type,
  Navigation,
  Code2,
  Palette,
  Package,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Calendar,
  Sparkles,
  Layers,
  Type,
  Navigation,
  Code2,
  Palette,
  Package,
}

export function getIconComponent(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Package
}
