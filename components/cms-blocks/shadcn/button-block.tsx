'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export interface ShadcnButtonBlockProps {
  text?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  link?: string
}

export function ShadcnButtonBlock({
  text = 'Button',
  variant = 'default',
  size = 'default',
  disabled = false,
  link,
}: ShadcnButtonBlockProps) {
  const buttonContent = (
    <Button variant={variant} size={size} disabled={disabled}>
      {text}
    </Button>
  )

  if (link) {
    return (
      <Link href={link} className="inline-block">
        {buttonContent}
      </Link>
    )
  }

  return buttonContent
}

export default ShadcnButtonBlock
