'use client'

import { useState, useEffect, useCallback } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Type,
  ChevronDown,
  Info,
  RefreshCw,
  Sparkles,
  Heading1,
  Heading2,
  Badge,
  ALargeSmall,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PageTypographySettings, RequiredPageTypographySettings, FontSize, FontWeight, FontStyle, FontFamily } from '@/lib/cms/page-typography-types'
import {
  DEFAULT_PAGE_TYPOGRAPHY,
  FONT_FAMILY_LABELS,
  FONT_FAMILY_DESCRIPTIONS,
  FONT_FAMILY_STACKS,
} from '@/lib/cms/page-typography-types'

interface PageTypographyPanelProps {
  pageId: string
  initialTypography?: Partial<PageTypographySettings> | null
  onSave: (typography: PageTypographySettings) => Promise<void>
  isSaving?: boolean
}

// Font size options
const FONT_SIZE_OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
  { value: '2xl', label: '2X Large' },
  { value: '3xl', label: '3X Large' },
  { value: '4xl', label: '4X Large' },
  { value: '5xl', label: '5X Large' },
  { value: '6xl', label: '6X Large' },
]

// Font weight options
const FONT_WEIGHT_OPTIONS: { value: FontWeight; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semi Bold' },
  { value: 'bold', label: 'Bold' },
  { value: 'extrabold', label: 'Extra Bold' },
]

// Font style options
const FONT_STYLE_OPTIONS: { value: FontStyle; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'italic', label: 'Italic' },
]

// Font family options
const FONT_FAMILY_OPTIONS: FontFamily[] = [
  'poppins',
  'inter',
  'roboto',
  'montserrat',
  'open-sans',
  'lato',
  'playfair',
]

// Brand color swatches
const BRAND_COLORS = [
  { value: '#085032', label: 'Primary Green' },
  { value: '#0b6d41', label: 'Brand Green' },
  { value: '#D4AF37', label: 'Gold' },
  { value: '#ffde59', label: 'Secondary Yellow' },
  { value: '#ffffff', label: 'White' },
  { value: '#1f2937', label: 'Dark Gray' },
  { value: '#4b5563', label: 'Medium Gray' },
]

// Color picker component
function ColorPicker({
  value,
  onChange,
  label,
}: {
  value?: string
  onChange: (color: string) => void
  label: string
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {BRAND_COLORS.map((color) => (
          <TooltipProvider key={color.value}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange(color.value)}
                  className={cn(
                    'w-7 h-7 rounded-md border-2 transition-all',
                    value === color.value
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-muted-foreground'
                  )}
                  style={{ backgroundColor: color.value }}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {color.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-md border border-border cursor-pointer"
          title="Custom color"
        />
      </div>
    </div>
  )
}

// Typography section component
function TypographySection({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  icon: React.ElementType
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function PageTypographyPanel({
  pageId,
  initialTypography,
  onSave,
  isSaving,
}: PageTypographyPanelProps) {
  // Typography state - merge initial with defaults (all sections always initialized)
  const [typography, setTypography] = useState<RequiredPageTypographySettings>(() => ({
    fontFamily: initialTypography?.fontFamily || DEFAULT_PAGE_TYPOGRAPHY.fontFamily,
    title: {
      ...DEFAULT_PAGE_TYPOGRAPHY.title,
      ...initialTypography?.title,
    },
    subtitle: {
      ...DEFAULT_PAGE_TYPOGRAPHY.subtitle,
      ...initialTypography?.subtitle,
    },
    badge: {
      ...DEFAULT_PAGE_TYPOGRAPHY.badge,
      ...initialTypography?.badge,
    },
  }))

  const [isDirty, setIsDirty] = useState(false)

  // Section collapse state
  const [openSections, setOpenSections] = useState({
    title: true,
    subtitle: false,
    badge: false,
  })

  // Update a typography field for nested sections (title, subtitle, badge)
  const updateField = useCallback(
    (
      section: 'title' | 'subtitle' | 'badge',
      field: string,
      value: string
    ) => {
      setTypography((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }))
      setIsDirty(true)
    },
    []
  )

  // Handle save
  const handleSave = async () => {
    await onSave(typography)
    setIsDirty(false)
  }

  // Reset to defaults
  const handleReset = () => {
    setTypography(DEFAULT_PAGE_TYPOGRAPHY)
    setIsDirty(true)
  }

  // Toggle section
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Typography</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Sparkles className="h-4 w-4 mr-1" />
              )}
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Customize typography for all section headers on this page. Individual blocks can still override these settings.
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Page Font Family */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <ALargeSmall className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Page Font</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Select the font family for all content on this page.
            </p>
            <Select
              value={typography.fontFamily}
              onValueChange={(value: FontFamily) => {
                setTypography((prev) => ({ ...prev, fontFamily: value }))
                setIsDirty(true)
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILY_OPTIONS.map((font) => (
                  <SelectItem key={font} value={font}>
                    <div className="flex flex-col py-0.5">
                      <span
                        className="font-medium"
                        style={{ fontFamily: FONT_FAMILY_STACKS[font] }}
                      >
                        {FONT_FAMILY_LABELS[font]}
                        {font === 'poppins' && (
                          <span className="text-xs text-muted-foreground ml-2">(Default)</span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {FONT_FAMILY_DESCRIPTIONS[font]}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title Typography */}
          <TypographySection
            title="Title Typography"
            icon={Heading1}
            isOpen={openSections.title}
            onToggle={() => toggleSection('title')}
          >
            <div className="space-y-4 pl-1">
              {/* Font Size */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs">
                  Font Size
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[200px]">
                        <p className="text-xs">
                          The size of section titles. Larger sizes work better for hero sections.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select
                  value={typography.title.fontSize}
                  onValueChange={(value) => updateField('title', 'fontSize', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Weight */}
              <div className="space-y-1.5">
                <Label className="text-xs">Font Weight</Label>
                <Select
                  value={typography.title.fontWeight}
                  onValueChange={(value) => updateField('title', 'fontWeight', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_WEIGHT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Style */}
              <div className="space-y-1.5">
                <Label className="text-xs">Font Style</Label>
                <Select
                  value={typography.title.fontStyle}
                  onValueChange={(value) => updateField('title', 'fontStyle', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_STYLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              <ColorPicker
                value={typography.title.color}
                onChange={(color) => updateField('title', 'color', color)}
                label="Title Color"
              />
            </div>
          </TypographySection>

          {/* Subtitle Typography */}
          <TypographySection
            title="Subtitle Typography"
            icon={Heading2}
            isOpen={openSections.subtitle}
            onToggle={() => toggleSection('subtitle')}
          >
            <div className="space-y-4 pl-1">
              {/* Font Size */}
              <div className="space-y-1.5">
                <Label className="text-xs">Font Size</Label>
                <Select
                  value={typography.subtitle.fontSize}
                  onValueChange={(value) => updateField('subtitle', 'fontSize', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Weight */}
              <div className="space-y-1.5">
                <Label className="text-xs">Font Weight</Label>
                <Select
                  value={typography.subtitle.fontWeight}
                  onValueChange={(value) => updateField('subtitle', 'fontWeight', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_WEIGHT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Style */}
              <div className="space-y-1.5">
                <Label className="text-xs">Font Style</Label>
                <Select
                  value={typography.subtitle.fontStyle}
                  onValueChange={(value) => updateField('subtitle', 'fontStyle', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_STYLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              <ColorPicker
                value={typography.subtitle.color}
                onChange={(color) => updateField('subtitle', 'color', color)}
                label="Subtitle Color"
              />
            </div>
          </TypographySection>

          {/* Badge Typography */}
          <TypographySection
            title="Badge Typography"
            icon={Badge}
            isOpen={openSections.badge}
            onToggle={() => toggleSection('badge')}
          >
            <div className="space-y-4 pl-1">
              {/* Font Size */}
              <div className="space-y-1.5">
                <Label className="text-xs">Font Size</Label>
                <Select
                  value={typography.badge.fontSize}
                  onValueChange={(value) => updateField('badge', 'fontSize', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZE_OPTIONS.slice(0, 5).map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Weight */}
              <div className="space-y-1.5">
                <Label className="text-xs">Font Weight</Label>
                <Select
                  value={typography.badge.fontWeight}
                  onValueChange={(value) => updateField('badge', 'fontWeight', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_WEIGHT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Style */}
              <div className="space-y-1.5">
                <Label className="text-xs">Font Style</Label>
                <Select
                  value={typography.badge.fontStyle}
                  onValueChange={(value) => updateField('badge', 'fontStyle', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_STYLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Text Color */}
              <ColorPicker
                value={typography.badge.color}
                onChange={(color) => updateField('badge', 'color', color)}
                label="Badge Text Color"
              />

              {/* Background Color */}
              <ColorPicker
                value={typography.badge.backgroundColor}
                onChange={(color) => updateField('badge', 'backgroundColor', color)}
                label="Badge Background Color"
              />
            </div>
          </TypographySection>

          {/* Preview Section */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
            <div
              className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-border"
              style={{ fontFamily: FONT_FAMILY_STACKS[typography.fontFamily] }}
            >
              {/* Badge preview */}
              <span
                className={cn(
                  'inline-block px-3 py-1 rounded-full text-xs mb-2',
                  typography.badge.fontStyle === 'italic' && 'italic'
                )}
                style={{
                  fontSize: typography.badge.fontSize === 'sm' ? '0.75rem' : typography.badge.fontSize === 'md' ? '0.875rem' : '1rem',
                  fontWeight: typography.badge.fontWeight === 'normal' ? 400 : typography.badge.fontWeight === 'medium' ? 500 : typography.badge.fontWeight === 'semibold' ? 600 : typography.badge.fontWeight === 'bold' ? 700 : 800,
                  color: typography.badge.color || '#085032',
                  backgroundColor: typography.badge.backgroundColor || '#ffde59',
                }}
              >
                BADGE TEXT
              </span>

              {/* Title preview */}
              <h2
                className={cn(
                  'mb-2',
                  typography.title.fontStyle === 'italic' && 'italic'
                )}
                style={{
                  fontSize: typography.title.fontSize === 'sm' ? '0.875rem' : typography.title.fontSize === 'md' ? '1rem' : typography.title.fontSize === 'lg' ? '1.125rem' : typography.title.fontSize === 'xl' ? '1.25rem' : typography.title.fontSize === '2xl' ? '1.5rem' : typography.title.fontSize === '3xl' ? '1.875rem' : typography.title.fontSize === '4xl' ? '2.25rem' : typography.title.fontSize === '5xl' ? '3rem' : '3.75rem',
                  fontWeight: typography.title.fontWeight === 'normal' ? 400 : typography.title.fontWeight === 'medium' ? 500 : typography.title.fontWeight === 'semibold' ? 600 : typography.title.fontWeight === 'bold' ? 700 : 800,
                  color: typography.title.color || '#1f2937',
                }}
              >
                Section Title
              </h2>

              {/* Subtitle preview */}
              <p
                className={cn(
                  typography.subtitle.fontStyle === 'italic' && 'italic'
                )}
                style={{
                  fontSize: typography.subtitle.fontSize === 'sm' ? '0.875rem' : typography.subtitle.fontSize === 'md' ? '1rem' : typography.subtitle.fontSize === 'lg' ? '1.125rem' : typography.subtitle.fontSize === 'xl' ? '1.25rem' : '1.5rem',
                  fontWeight: typography.subtitle.fontWeight === 'normal' ? 400 : typography.subtitle.fontWeight === 'medium' ? 500 : typography.subtitle.fontWeight === 'semibold' ? 600 : typography.subtitle.fontWeight === 'bold' ? 700 : 800,
                  color: typography.subtitle.color || '#4b5563',
                }}
              >
                This is a sample subtitle text that demonstrates the typography settings.
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
