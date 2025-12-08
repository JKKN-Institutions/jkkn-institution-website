'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export interface ShadcnCheckboxBlockProps {
  label?: string
  checked?: boolean
  disabled?: boolean
}

export function ShadcnCheckboxBlock({
  label = 'Checkbox label',
  checked = false,
  disabled = false,
}: ShadcnCheckboxBlockProps) {
  const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={checkboxId} defaultChecked={checked} disabled={disabled} />
      <Label htmlFor={checkboxId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </Label>
    </div>
  )
}

export default ShadcnCheckboxBlock
