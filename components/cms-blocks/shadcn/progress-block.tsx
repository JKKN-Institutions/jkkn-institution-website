'use client'

import { Progress } from '@/components/ui/progress'

export interface ShadcnProgressBlockProps {
  value?: number
  showLabel?: boolean
}

export function ShadcnProgressBlock({
  value = 50,
  showLabel = false,
}: ShadcnProgressBlockProps) {
  return (
    <div className="space-y-2">
      <Progress value={value} className="w-full" />
      {showLabel && (
        <p className="text-sm text-muted-foreground text-right">{value}%</p>
      )}
    </div>
  )
}

export default ShadcnProgressBlock
