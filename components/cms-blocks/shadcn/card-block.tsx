'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export interface ShadcnCardBlockProps {
  title?: string
  description?: string
  content?: string
  footer?: string
  showHeader?: boolean
  showFooter?: boolean
}

export function ShadcnCardBlock({
  title = 'Card Title',
  description,
  content = 'Card content goes here.',
  footer,
  showHeader = true,
  showFooter = false,
}: ShadcnCardBlockProps) {
  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <p>{content}</p>
      </CardContent>
      {showFooter && footer && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">{footer}</p>
        </CardFooter>
      )}
    </Card>
  )
}

export default ShadcnCardBlock
