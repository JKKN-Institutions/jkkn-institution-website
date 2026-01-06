import React from 'react'
import { BaseBlockProps } from '@/lib/cms/registry-types'
import { cn } from '@/lib/utils'

export interface ContainerProps extends BaseBlockProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'fluid'
  paddingX?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function Container({
  maxWidth = 'xl',
  paddingX = 'md',
  className,
  children,
  ...props
}: ContainerProps) {

  const maxW = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
    fluid: 'max-w-none',
  }

  const px = {
    none: 'px-0',
    sm: 'px-2 md:px-4',
    md: 'px-4 md:px-6 lg:px-8',
    lg: 'px-6 md:px-10 lg:px-12',
  }

  return (
    <div
      className={cn(
        'mx-auto w-full',
        maxW[maxWidth],
        px[paddingX],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Container
