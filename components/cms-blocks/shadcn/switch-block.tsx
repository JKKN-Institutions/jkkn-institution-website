'use client'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export interface ShadcnSwitchBlockProps {
  label?: string
  checked?: boolean
  disabled?: boolean
}

export function ShadcnSwitchBlock({
  label = 'Toggle',
  checked = false,
  disabled = false,
}: ShadcnSwitchBlockProps) {
  const switchId = `switch-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="flex items-center space-x-2">
      <Switch id={switchId} defaultChecked={checked} disabled={disabled} />
      <Label htmlFor={switchId}>{label}</Label>
    </div>
  )
}

export default ShadcnSwitchBlock
