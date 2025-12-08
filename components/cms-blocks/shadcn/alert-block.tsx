'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react'

export interface ShadcnAlertBlockProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function ShadcnAlertBlock({
  title = 'Alert',
  description = 'This is an alert message.',
  variant = 'default',
}: ShadcnAlertBlockProps) {
  const Icon = variant === 'destructive' ? AlertTriangle : Info

  return (
    <Alert variant={variant}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

export default ShadcnAlertBlock
