'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface ShadcnInputBlockProps {
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  disabled?: boolean
  label?: string
}

export function ShadcnInputBlock({
  placeholder = 'Enter text...',
  type = 'text',
  disabled = false,
  label,
}: ShadcnInputBlockProps) {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <Input
        id={inputId}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

export default ShadcnInputBlock
