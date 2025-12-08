'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export interface ShadcnAvatarBlockProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
}

export function ShadcnAvatarBlock({
  src,
  alt = 'Avatar',
  fallback = 'CN',
  size = 'md',
}: ShadcnAvatarBlockProps) {
  return (
    <Avatar className={cn(sizeClasses[size])}>
      {src && <AvatarImage src={src} alt={alt} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}

export default ShadcnAvatarBlock
