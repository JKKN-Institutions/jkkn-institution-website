'use client'

import { Separator } from '@/components/ui/separator'

export interface ShadcnSeparatorBlockProps {
  orientation?: 'horizontal' | 'vertical'
}

export function ShadcnSeparatorBlock({
  orientation = 'horizontal',
}: ShadcnSeparatorBlockProps) {
  return <Separator orientation={orientation} className={orientation === 'vertical' ? 'h-full' : 'w-full'} />
}

export default ShadcnSeparatorBlock
