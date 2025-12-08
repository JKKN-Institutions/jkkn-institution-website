'use client'

import { Badge } from '@/components/ui/badge'

export interface ShadcnBadgeBlockProps {
  text?: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export function ShadcnBadgeBlock({
  text = 'Badge',
  variant = 'default',
}: ShadcnBadgeBlockProps) {
  return <Badge variant={variant}>{text}</Badge>
}

export default ShadcnBadgeBlock
