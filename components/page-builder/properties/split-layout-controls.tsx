'use client'

import { useCallback } from 'react'
import type { BlockData } from '@/lib/cms/registry-types'
import type { SplitLayoutProps } from '@/lib/cms/registry-types'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignVerticalJustifyCenter,
  Columns,
  Smartphone,
  FlipHorizontal,
  Space,
} from 'lucide-react'

interface SplitLayoutControlsProps {
  block: BlockData
  onUpdate: (updates: Partial<BlockData>) => void
}

// Visual proportion selector card
interface ProportionCardProps {
  proportion: string
  label: string
  isActive: boolean
  onClick: () => void
}

function ProportionCard({ proportion, label, isActive, onClick }: ProportionCardProps) {
  // Calculate visual representation widths
  const getColumnWidths = () => {
    switch (proportion) {
      case '50-50':
        return { left: '50%', right: '50%' }
      case '40-60':
        return { left: '40%', right: '60%' }
      case '60-40':
        return { left: '60%', right: '40%' }
      case '33-67':
        return { left: '33%', right: '67%' }
      case '67-33':
        return { left: '67%', right: '33%' }
      default:
        return { left: '50%', right: '50%' }
    }
  }

  const widths = getColumnWidths()

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200',
        isActive
          ? 'border-primary bg-primary/10 shadow-sm'
          : 'border-border hover:border-primary/50 hover:bg-accent/30'
      )}
    >
      {/* Visual representation */}
      <div className="flex gap-1 h-12 w-full rounded overflow-hidden">
        <div
          className={cn(
            'rounded-sm transition-colors',
            isActive ? 'bg-primary' : 'bg-muted-foreground/40'
          )}
          style={{ width: widths.left }}
        />
        <div
          className={cn(
            'rounded-sm transition-colors',
            isActive ? 'bg-primary/60' : 'bg-muted-foreground/20'
          )}
          style={{ width: widths.right }}
        />
      </div>
      {/* Label */}
      <span className={cn(
        'text-xs font-medium',
        isActive ? 'text-primary' : 'text-muted-foreground'
      )}>
        {label}
      </span>
    </button>
  )
}

export function SplitLayoutControls({ block, onUpdate }: SplitLayoutControlsProps) {
  const props = (block.props || {}) as unknown as SplitLayoutProps

  // Update a single prop
  const updateProp = useCallback(
    (key: keyof SplitLayoutProps, value: unknown) => {
      onUpdate({
        props: {
          ...block.props,
          [key]: value,
        },
      })
    },
    [block.props, onUpdate]
  )

  // Convert gap value to pixels for display
  const gapInPixels = (props.gap || 8) * 4

  return (
    <div className="space-y-6">
      {/* Section 1: Column Proportions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Columns className="h-4 w-4 text-primary" />
          <Label className="text-sm font-semibold">Column Proportions</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ProportionCard
            proportion="50-50"
            label="50 / 50"
            isActive={props.proportion === '50-50' || !props.proportion}
            onClick={() => updateProp('proportion', '50-50')}
          />
          <ProportionCard
            proportion="40-60"
            label="40 / 60"
            isActive={props.proportion === '40-60'}
            onClick={() => updateProp('proportion', '40-60')}
          />
          <ProportionCard
            proportion="60-40"
            label="60 / 40"
            isActive={props.proportion === '60-40'}
            onClick={() => updateProp('proportion', '60-40')}
          />
          <ProportionCard
            proportion="33-67"
            label="33 / 67"
            isActive={props.proportion === '33-67'}
            onClick={() => updateProp('proportion', '33-67')}
          />
          <ProportionCard
            proportion="67-33"
            label="67 / 33"
            isActive={props.proportion === '67-33'}
            onClick={() => updateProp('proportion', '67-33')}
          />
        </div>
      </div>

      {/* Section 2: Vertical Alignment */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlignCenterVertical className="h-4 w-4 text-primary" />
          <Label className="text-sm font-semibold">Vertical Alignment</Label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant={props.verticalAlign === 'start' ? 'default' : 'outline'}
            size="sm"
            className="h-12"
            onClick={() => updateProp('verticalAlign', 'start')}
          >
            <AlignStartVertical className="h-4 w-4" />
          </Button>
          <Button
            variant={props.verticalAlign === 'center' || !props.verticalAlign ? 'default' : 'outline'}
            size="sm"
            className="h-12"
            onClick={() => updateProp('verticalAlign', 'center')}
          >
            <AlignCenterVertical className="h-4 w-4" />
          </Button>
          <Button
            variant={props.verticalAlign === 'end' ? 'default' : 'outline'}
            size="sm"
            className="h-12"
            onClick={() => updateProp('verticalAlign', 'end')}
          >
            <AlignEndVertical className="h-4 w-4" />
          </Button>
          <Button
            variant={props.verticalAlign === 'stretch' ? 'default' : 'outline'}
            size="sm"
            className="h-12"
            onClick={() => updateProp('verticalAlign', 'stretch')}
          >
            <AlignVerticalJustifyCenter className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs text-center text-muted-foreground">
          <div>Top</div>
          <div>Center</div>
          <div>Bottom</div>
          <div>Stretch</div>
        </div>
      </div>

      {/* Section 3: Gap / Spacing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Space className="h-4 w-4 text-primary" />
            <Label className="text-sm font-semibold">Gap Between Columns</Label>
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
            {gapInPixels}px
          </span>
        </div>
        <Slider
          value={[props.gap || 8]}
          onValueChange={([value]) => updateProp('gap', value)}
          min={0}
          max={16}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0px</span>
          <span>64px</span>
        </div>
      </div>

      {/* Section 4: Mobile Behavior */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-primary" />
          <Label className="text-sm font-semibold">Mobile Behavior</Label>
        </div>

        {/* Stack on Mobile */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
          <div className="space-y-0.5">
            <Label className="text-sm">Stack on Mobile</Label>
            <p className="text-xs text-muted-foreground">
              Switch to single column on mobile devices
            </p>
          </div>
          <Switch
            checked={props.stackOnMobile !== false}
            onCheckedChange={(checked) => updateProp('stackOnMobile', checked)}
          />
        </div>

        {/* Mobile Breakpoint */}
        {props.stackOnMobile !== false && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Mobile Breakpoint</Label>
            <Select
              value={props.mobileBreakpoint || 'md'}
              onValueChange={(value) => updateProp('mobileBreakpoint', value as 'sm' | 'md' | 'lg')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small (640px)</SelectItem>
                <SelectItem value="md">Medium (768px)</SelectItem>
                <SelectItem value="lg">Large (1024px)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Stack Order */}
        {props.stackOnMobile !== false && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Stack Order on Mobile</Label>
            <RadioGroup
              value={props.reverse ? 'second-first' : 'first-first'}
              onValueChange={(value) => updateProp('reverse', value === 'second-first')}
            >
              <div className="flex items-center space-x-2 p-2 rounded border border-border/50">
                <RadioGroupItem value="first-first" id="first-first" />
                <Label htmlFor="first-first" className="text-sm font-normal cursor-pointer flex-1">
                  First column first (default)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded border border-border/50">
                <RadioGroupItem value="second-first" id="second-first" />
                <Label htmlFor="second-first" className="text-sm font-normal cursor-pointer flex-1">
                  Second column first (reversed)
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>

      {/* Section 5: Layout Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FlipHorizontal className="h-4 w-4 text-primary" />
          <Label className="text-sm font-semibold">Layout Options</Label>
        </div>

        {/* Reverse Layout (Desktop) */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
          <div className="space-y-0.5">
            <Label className="text-sm">Reverse Column Order (Desktop)</Label>
            <p className="text-xs text-muted-foreground">
              Swap left and right columns on large screens
            </p>
          </div>
          <Switch
            checked={props.reverse === true}
            onCheckedChange={(checked) => updateProp('reverse', checked)}
          />
        </div>

        {/* Padding */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Container Padding</Label>
          <Slider
            value={[props.padding || 0]}
            onValueChange={([value]) => updateProp('padding', value)}
            min={0}
            max={16}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0px</span>
            <span>{((props.padding || 0) * 4)}px</span>
            <span>64px</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
          <strong>Tip:</strong> For best results, add one component to each column.
          Drag and drop components into the empty columns above, or use the quick-add buttons.
        </p>
      </div>
    </div>
  )
}
