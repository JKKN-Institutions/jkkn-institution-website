import React from 'react'
import { BaseBlockProps } from '@/lib/cms/registry-types'
import { cn } from '@/lib/utils'

export interface SectionProps extends BaseBlockProps {
    id?: string
    backgroundType?: 'color' | 'image' | 'video' | 'gradient'
    backgroundColor?: string
    backgroundImage?: string
    backgroundGradient?: string
    paddingTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    paddingBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    minHeight?: 'auto' | 'screen' | 'half' | 'large'
    className?: string
    children?: React.ReactNode
}

export function Section({
    id,
    backgroundType = 'color',
    backgroundColor = 'bg-background',
    backgroundImage,
    backgroundGradient,
    paddingTop = 'md',
    paddingBottom = 'md',
    minHeight = 'auto',
    className,
    children,
    ...props
}: SectionProps) {

    const paddingStyles = {
        none: 'py-0',
        sm: 'py-8 md:py-12',
        md: 'py-12 md:py-16',
        lg: 'py-16 md:py-24',
        xl: 'py-20 md:py-32',
    }

    const heightStyles = {
        auto: 'min-h-0',
        screen: 'min-h-screen',
        half: 'min-h-[50vh]',
        large: 'min-h-[600px]',
    }

    // Custom styles for background image/gradient if needed
    const style: React.CSSProperties = {}

    if (backgroundType === 'image' && backgroundImage) {
        style.backgroundImage = `url(${backgroundImage})`
        style.backgroundSize = 'cover'
        style.backgroundPosition = 'center'
    } else if (backgroundType === 'gradient' && backgroundGradient) {
        style.background = backgroundGradient
    } else if (backgroundType === 'color' && backgroundColor && backgroundColor.startsWith('#')) {
        style.backgroundColor = backgroundColor
    }

    const bgClass = backgroundType === 'color' && !backgroundColor.startsWith('#') ? backgroundColor : ''

    return (
        <section
            id={id}
            className={cn(
                'relative w-full',
                paddingStyles[paddingTop] ? `pt-${paddingStyles[paddingTop].split('-')[1]}` : '', // Split hack if needed, or just use mapping
                paddingStyles[paddingTop] || '', // Actually use the full class
                // We need to handle top/bottom separately in mapping if we want full control
                // But for now let's use the mapping as "vertical padding"
                // Wait, props say paddingTop and paddingBottom separately.
                // My mapping combined them. Let's fix.
                heightStyles[minHeight],
                bgClass,
                className
            )}
            style={style}
            {...props}
        >
            {/* Background Overlay if needed (TODO) */}

            {children}
        </section>
    )
}

// Improved implementation with separate paddings
export function AdvancedSection({
    id,
    backgroundType = 'color',
    backgroundColor = 'bg-background',
    backgroundImage,
    backgroundGradient,
    paddingTop = 'md',
    paddingBottom = 'md',
    minHeight = 'auto',
    className,
    children,
    ...props
}: SectionProps) {

    const pt = {
        none: 'pt-0',
        sm: 'pt-8 md:pt-12',
        md: 'pt-12 md:pt-16',
        lg: 'pt-16 md:pt-24',
        xl: 'pt-20 md:pt-32',
    }

    const pb = {
        none: 'pb-0',
        sm: 'pb-8 md:pb-12',
        md: 'pb-12 md:pb-16',
        lg: 'pb-16 md:pb-24',
        xl: 'pb-20 md:pb-32',
    }

    const heights = {
        auto: 'min-h-0',
        screen: 'min-h-screen',
        half: 'min-h-[50vh]',
        large: 'min-h-[600px]',
    }

    const style: React.CSSProperties = {}

    if (backgroundType === 'image' && backgroundImage) {
        style.backgroundImage = `url(${backgroundImage})`
        style.backgroundSize = 'cover'
        style.backgroundPosition = 'center'
    } else if (backgroundType === 'gradient' && backgroundGradient) {
        style.background = backgroundGradient
    } else if (backgroundType === 'color' && backgroundColor && backgroundColor.startsWith('#')) {
        style.backgroundColor = backgroundColor
    }

    const bgClass = backgroundType === 'color' && !backgroundColor?.startsWith('#') ? backgroundColor : ''

    return (
        <section
            id={id}
            className={cn(
                'relative w-full',
                pt[paddingTop],
                pb[paddingBottom],
                heights[minHeight],
                bgClass,
                className
            )}
            style={style}
            {...props}
        >
            {children}
        </section>
    )
}

export default AdvancedSection
