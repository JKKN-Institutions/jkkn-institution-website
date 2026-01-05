'use client'

import { useState } from 'react'
import { usePageBuilder } from '../page-builder-provider'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  ChevronDown,
  Monitor,
  Tablet,
  Smartphone,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Move,
  Square,
  Layers,
  Palette,
  Sparkles,
  Link2,
  Unlink2,
} from 'lucide-react'

// Re-export GlassmorphismControls for use in Style tab
export { GlassmorphismControls } from './glassmorphism-controls'
export type { GlassSettings } from '@/lib/cms/styling-types'

// Typography Controls
interface TypographyControlsProps {
  typography?: {
    fontFamily?: string
    fontSize?: string | number
    fontWeight?: string
    fontStyle?: string
    lineHeight?: string | number
    letterSpacing?: string | number
    textTransform?: string
    textDecoration?: string
  }
  onChange: (typography: TypographyControlsProps['typography']) => void
}

export function TypographyControls({ typography = {}, onChange }: TypographyControlsProps) {
  const [isOpen, setIsOpen] = useState(true)

  const fontFamilies = [
    'inherit',
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Georgia',
    'Times New Roman',
    'monospace',
  ]

  const fontWeights = [
    { value: '100', label: 'Thin' },
    { value: '200', label: 'Extra Light' },
    { value: '300', label: 'Light' },
    { value: '400', label: 'Regular' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semi Bold' },
    { value: '700', label: 'Bold' },
    { value: '800', label: 'Extra Bold' },
    { value: '900', label: 'Black' },
  ]

  const updateTypography = (key: string, value: string | number) => {
    onChange({ ...typography, [key]: value })
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Typography</span>
        </div>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 space-y-4">
        {/* Font Family */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Font Family</Label>
          <Select
            value={typography.fontFamily || 'inherit'}
            onValueChange={(v) => updateTypography('fontFamily', v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size & Weight Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Size</Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={parseInt(String(typography.fontSize || 16))}
                onChange={(e) => updateTypography('fontSize', `${e.target.value}px`)}
                className="h-8 text-xs"
                min={8}
                max={200}
              />
              <span className="text-xs text-muted-foreground">px</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Weight</Label>
            <Select
              value={typography.fontWeight || '400'}
              onValueChange={(v) => updateTypography('fontWeight', v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map((w) => (
                  <SelectItem key={w.value} value={w.value}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Line Height & Letter Spacing */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Line Height</Label>
            <Input
              type="number"
              value={parseFloat(String(typography.lineHeight || 1.5))}
              onChange={(e) => updateTypography('lineHeight', e.target.value)}
              className="h-8 text-xs"
              min={0.5}
              max={3}
              step={0.1}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Letter Spacing</Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={parseFloat(String(typography.letterSpacing || 0))}
                onChange={(e) => updateTypography('letterSpacing', `${e.target.value}px`)}
                className="h-8 text-xs"
                min={-5}
                max={20}
                step={0.5}
              />
              <span className="text-xs text-muted-foreground">px</span>
            </div>
          </div>
        </div>

        {/* Text Transform & Decoration */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Transform</Label>
            <Select
              value={typography.textTransform || 'none'}
              onValueChange={(v) => updateTypography('textTransform', v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="uppercase">UPPERCASE</SelectItem>
                <SelectItem value="lowercase">lowercase</SelectItem>
                <SelectItem value="capitalize">Capitalize</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Decoration</Label>
            <Select
              value={typography.textDecoration || 'none'}
              onValueChange={(v) => updateTypography('textDecoration', v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="underline">Underline</SelectItem>
                <SelectItem value="overline">Overline</SelectItem>
                <SelectItem value="line-through">Line Through</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Spacing Controls (Margin & Padding)
interface SpacingControlsProps {
  spacing?: {
    marginTop?: string | number
    marginRight?: string | number
    marginBottom?: string | number
    marginLeft?: string | number
    paddingTop?: string | number
    paddingRight?: string | number
    paddingBottom?: string | number
    paddingLeft?: string | number
  }
  onChange: (spacing: SpacingControlsProps['spacing']) => void
}

export function SpacingControls({ spacing = {}, onChange }: SpacingControlsProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [linkedMargin, setLinkedMargin] = useState(false)
  const [linkedPadding, setLinkedPadding] = useState(false)

  const updateSpacing = (key: string, value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value

    if (linkedMargin && key.startsWith('margin')) {
      onChange({
        ...spacing,
        marginTop: numValue,
        marginRight: numValue,
        marginBottom: numValue,
        marginLeft: numValue,
      })
    } else if (linkedPadding && key.startsWith('padding')) {
      onChange({
        ...spacing,
        paddingTop: numValue,
        paddingRight: numValue,
        paddingBottom: numValue,
        paddingLeft: numValue,
      })
    } else {
      onChange({ ...spacing, [key]: numValue })
    }
  }

  const SpacingInput = ({ propKey, label }: { propKey: string; label: string }) => (
    <div className="flex flex-col items-center gap-1">
      <Label className="text-[10px] text-muted-foreground uppercase">{label}</Label>
      <Input
        type="number"
        value={parseInt(String(spacing[propKey as keyof typeof spacing] || 0))}
        onChange={(e) => updateSpacing(propKey, e.target.value)}
        className="h-7 w-14 text-xs text-center"
        min={0}
        max={500}
      />
    </div>
  )

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Spacing</span>
        </div>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 space-y-4">
        {/* Margin */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Margin</Label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setLinkedMargin(!linkedMargin)}
            >
              {linkedMargin ? <Link2 className="h-3 w-3" /> : <Unlink2 className="h-3 w-3" />}
            </Button>
          </div>
          <div className="flex flex-col items-center gap-2 py-2 px-4 bg-muted/30 rounded-lg">
            <SpacingInput propKey="marginTop" label="Top" />
            <div className="flex justify-between w-full items-center">
              <SpacingInput propKey="marginLeft" label="Left" />
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                <Square className="h-4 w-4 text-muted-foreground" />
              </div>
              <SpacingInput propKey="marginRight" label="Right" />
            </div>
            <SpacingInput propKey="marginBottom" label="Bottom" />
          </div>
        </div>

        {/* Padding */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Padding</Label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setLinkedPadding(!linkedPadding)}
            >
              {linkedPadding ? <Link2 className="h-3 w-3" /> : <Unlink2 className="h-3 w-3" />}
            </Button>
          </div>
          <div className="flex flex-col items-center gap-2 py-2 px-4 bg-primary/5 rounded-lg border border-primary/10">
            <SpacingInput propKey="paddingTop" label="Top" />
            <div className="flex justify-between w-full items-center">
              <SpacingInput propKey="paddingLeft" label="Left" />
              <div className="w-8 h-6 bg-primary/20 rounded" />
              <SpacingInput propKey="paddingRight" label="Right" />
            </div>
            <SpacingInput propKey="paddingBottom" label="Bottom" />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Border Controls
interface BorderControlsProps {
  border?: {
    borderWidth?: string | number
    borderStyle?: string
    borderColor?: string
    borderRadius?: string | number
    borderTopWidth?: string | number
    borderRightWidth?: string | number
    borderBottomWidth?: string | number
    borderLeftWidth?: string | number
    borderTopLeftRadius?: string | number
    borderTopRightRadius?: string | number
    borderBottomRightRadius?: string | number
    borderBottomLeftRadius?: string | number
  }
  onChange: (border: BorderControlsProps['border']) => void
}

export function BorderControls({ border = {}, onChange }: BorderControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [linkedWidth, setLinkedWidth] = useState(true)
  const [linkedRadius, setLinkedRadius] = useState(true)

  const updateBorder = (key: string, value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value

    if (linkedWidth && key.includes('Width') && key !== 'borderWidth') {
      onChange({
        ...border,
        borderTopWidth: numValue,
        borderRightWidth: numValue,
        borderBottomWidth: numValue,
        borderLeftWidth: numValue,
      })
    } else if (linkedRadius && key.includes('Radius') && key !== 'borderRadius') {
      onChange({
        ...border,
        borderTopLeftRadius: numValue,
        borderTopRightRadius: numValue,
        borderBottomRightRadius: numValue,
        borderBottomLeftRadius: numValue,
      })
    } else {
      onChange({ ...border, [key]: key.includes('Color') || key.includes('Style') ? value : numValue })
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
        <div className="flex items-center gap-2">
          <Square className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Border</span>
        </div>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 space-y-4">
        {/* Border Style & Color */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Style</Label>
            <Select
              value={border.borderStyle || 'solid'}
              onValueChange={(v) => updateBorder('borderStyle', v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
                <SelectItem value="double">Double</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={border.borderColor || '#e5e7eb'}
                onChange={(e) => updateBorder('borderColor', e.target.value)}
                className="h-8 w-8 rounded border cursor-pointer"
              />
              <Input
                type="text"
                value={border.borderColor || '#e5e7eb'}
                onChange={(e) => updateBorder('borderColor', e.target.value)}
                className="h-8 text-xs flex-1"
              />
            </div>
          </div>
        </div>

        {/* Border Width */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Width</Label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setLinkedWidth(!linkedWidth)}
            >
              {linkedWidth ? <Link2 className="h-3 w-3" /> : <Unlink2 className="h-3 w-3" />}
            </Button>
          </div>
          {linkedWidth ? (
            <div className="flex items-center gap-2">
              <Slider
                value={[parseInt(String(border.borderWidth || 0))]}
                onValueChange={([v]) => updateBorder('borderTopWidth', v)}
                max={20}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8 text-right">
                {border.borderWidth || 0}px
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {['Top', 'Right', 'Bottom', 'Left'].map((side) => (
                <div key={side} className="flex flex-col items-center gap-1">
                  <Label className="text-[10px] text-muted-foreground">{side}</Label>
                  <Input
                    type="number"
                    value={parseInt(String(border[`border${side}Width` as keyof typeof border] || 0))}
                    onChange={(e) => updateBorder(`border${side}Width`, e.target.value)}
                    className="h-7 text-xs text-center"
                    min={0}
                    max={20}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Border Radius */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Radius</Label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setLinkedRadius(!linkedRadius)}
            >
              {linkedRadius ? <Link2 className="h-3 w-3" /> : <Unlink2 className="h-3 w-3" />}
            </Button>
          </div>
          {linkedRadius ? (
            <div className="flex items-center gap-2">
              <Slider
                value={[parseInt(String(border.borderRadius || 0))]}
                onValueChange={([v]) => updateBorder('borderTopLeftRadius', v)}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8 text-right">
                {border.borderRadius || 0}px
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {[
                ['TopLeft', 'TL'],
                ['TopRight', 'TR'],
                ['BottomLeft', 'BL'],
                ['BottomRight', 'BR'],
              ].map(([corner, label]) => (
                <div key={corner} className="flex items-center gap-2">
                  <Label className="text-[10px] text-muted-foreground w-6">{label}</Label>
                  <Input
                    type="number"
                    value={parseInt(String(border[`border${corner}Radius` as keyof typeof border] || 0))}
                    onChange={(e) => updateBorder(`border${corner}Radius`, e.target.value)}
                    className="h-7 text-xs flex-1"
                    min={0}
                    max={100}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Background Controls
interface BackgroundControlsProps {
  background?: {
    backgroundColor?: string
    backgroundImage?: string
    backgroundPosition?: string
    backgroundSize?: string
    backgroundRepeat?: string
    backgroundGradient?: string
    backgroundOverlay?: string
    backgroundOverlayOpacity?: number
  }
  onChange: (background: BackgroundControlsProps['background']) => void
}

export function BackgroundControls({ background = {}, onChange }: BackgroundControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [bgType, setBgType] = useState<'color' | 'image' | 'gradient'>('color')

  const updateBackground = (key: string, value: string | number) => {
    onChange({ ...background, [key]: value })
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Background</span>
        </div>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 space-y-4">
        {/* Background Type Tabs */}
        <Tabs value={bgType} onValueChange={(v) => setBgType(v as typeof bgType)}>
          <TabsList className="grid grid-cols-3 h-8">
            <TabsTrigger value="color" className="text-xs">Color</TabsTrigger>
            <TabsTrigger value="gradient" className="text-xs">Gradient</TabsTrigger>
            <TabsTrigger value="image" className="text-xs">Image</TabsTrigger>
          </TabsList>

          <TabsContent value="color" className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={background.backgroundColor || '#ffffff'}
                onChange={(e) => updateBackground('backgroundColor', e.target.value)}
                className="h-10 w-10 rounded border cursor-pointer"
              />
              <Input
                type="text"
                value={background.backgroundColor || '#ffffff'}
                onChange={(e) => updateBackground('backgroundColor', e.target.value)}
                placeholder="#ffffff"
                className="h-8 text-xs flex-1"
              />
            </div>
          </TabsContent>

          <TabsContent value="gradient" className="mt-3 space-y-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Gradient CSS</Label>
              <Input
                type="text"
                value={background.backgroundGradient || ''}
                onChange={(e) => updateBackground('backgroundGradient', e.target.value)}
                placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                className="h-8 text-xs"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(to right, #f093fb, #f5576c)',
                'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',
              ].map((gradient, i) => (
                <button
                  key={i}
                  onClick={() => updateBackground('backgroundGradient', gradient)}
                  className="h-8 rounded border cursor-pointer transition-transform hover:scale-105"
                  style={{ background: gradient }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="image" className="mt-3 space-y-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Image URL</Label>
              <Input
                type="url"
                value={background.backgroundImage || ''}
                onChange={(e) => updateBackground('backgroundImage', e.target.value)}
                placeholder="https://..."
                className="h-8 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Position</Label>
                <Select
                  value={background.backgroundPosition || 'center'}
                  onValueChange={(v) => updateBackground('backgroundPosition', v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Size</Label>
                <Select
                  value={background.backgroundSize || 'cover'}
                  onValueChange={(v) => updateBackground('backgroundSize', v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="100% 100%">Stretch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Overlay Opacity</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[background.backgroundOverlayOpacity || 0]}
                  onValueChange={([v]) => updateBackground('backgroundOverlayOpacity', v)}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {background.backgroundOverlayOpacity || 0}%
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Shadow Controls
interface ShadowControlsProps {
  shadow?: {
    boxShadow?: string
  }
  onChange: (shadow: ShadowControlsProps['shadow']) => void
}

export function ShadowControls({ shadow = {}, onChange }: ShadowControlsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const shadowPresets = [
    { name: 'None', value: 'none' },
    { name: 'Small', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    { name: 'Default', value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
    { name: 'Medium', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
    { name: 'Large', value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
    { name: 'XL', value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
    { name: '2XL', value: '0 25px 50px -12px rgb(0 0 0 / 0.25)' },
  ]

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Shadow</span>
        </div>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {shadowPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onChange({ boxShadow: preset.value })}
              className={cn(
                'p-2 rounded border text-[10px] transition-all',
                shadow.boxShadow === preset.value
                  ? 'border-primary bg-primary/10'
                  : 'hover:border-primary/50'
              )}
            >
              <div
                className="h-6 w-full bg-background rounded mb-1"
                style={{ boxShadow: preset.value }}
              />
              {preset.name}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Custom Shadow</Label>
          <Input
            type="text"
            value={shadow.boxShadow || ''}
            onChange={(e) => onChange({ boxShadow: e.target.value })}
            placeholder="0 4px 6px -1px rgb(0 0 0 / 0.1)"
            className="h-8 text-xs"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Responsive Device Switcher
interface DeviceSwitcherProps {
  device: 'desktop' | 'tablet' | 'mobile'
  onChange: (device: 'desktop' | 'tablet' | 'mobile') => void
}

export function DeviceSwitcher({ device, onChange }: DeviceSwitcherProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={device === 'desktop' ? 'default' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange('desktop')}
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant={device === 'tablet' ? 'default' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange('tablet')}
      >
        <Tablet className="h-4 w-4" />
      </Button>
      <Button
        variant={device === 'mobile' ? 'default' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange('mobile')}
      >
        <Smartphone className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Alignment Controls
interface AlignmentControlsProps {
  alignment?: 'left' | 'center' | 'right' | 'justify'
  onChange: (alignment: 'left' | 'center' | 'right' | 'justify') => void
}

export function AlignmentControls({ alignment = 'left', onChange }: AlignmentControlsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={alignment === 'left' ? 'default' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange('left')}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant={alignment === 'center' ? 'default' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange('center')}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant={alignment === 'right' ? 'default' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange('right')}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant={alignment === 'justify' ? 'default' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange('justify')}
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
    </div>
  )
}
