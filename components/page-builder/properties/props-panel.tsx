'use client'

import { useCallback } from 'react'
import { usePageBuilder } from '../page-builder-provider'
import { DynamicForm } from './dynamic-form'
import { getComponentEntry } from '@/lib/cms/component-registry'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Settings,
  Info,
  FileText,
  Type,
  Palette,
  Move,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  TypographyControls,
  SpacingControls,
  BorderControls,
  BackgroundControls,
  ShadowControls,
  GlassmorphismControls,
} from '../elementor/style-controls'
import type { GlassSettings } from '@/lib/cms/styling-types'
import { MotionControls, type MotionSettings } from '../elementor/motion-controls'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

// AccordionSection helper component for consistent styling
interface AccordionSectionProps {
  value: string
  icon: LucideIcon
  title: string
  children: React.ReactNode
}

function AccordionSection({ value, icon: Icon, title, children }: AccordionSectionProps) {
  return (
    <AccordionItem value={value} className="border-b border-border/50 last:border-b-0">
      <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-accent/50 transition-all duration-200 [&[data-state=open]]:bg-accent/30 group">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium text-sm text-foreground">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 pt-3 bg-muted/10">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}

// Style data structure matching the StyleControls components
interface BlockStyles {
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
  shadow?: {
    boxShadow?: string
  }
  glass?: GlassSettings
}

export function PropsPanel() {
  const { selectedBlock, updateBlock, updateBlockFull, updateBlockVisibility } = usePageBuilder()

  // Parse styles from the block's custom props or use defaults
  const getBlockStyles = useCallback((): BlockStyles => {
    if (!selectedBlock) return {}
    const stylesData = selectedBlock.props._styles as BlockStyles | undefined
    return stylesData || {}
  }, [selectedBlock])

  // Parse motion settings from block props
  const getBlockMotion = useCallback((): MotionSettings => {
    if (!selectedBlock) return {}
    const motionData = selectedBlock.props._motion as MotionSettings | undefined
    return motionData || {}
  }, [selectedBlock])

  // Update styles in block props
  const updateStyles = useCallback((key: keyof BlockStyles, value: BlockStyles[keyof BlockStyles]) => {
    if (!selectedBlock) return
    const currentStyles = getBlockStyles()
    const newStyles = { ...currentStyles, [key]: value }
    updateBlock(selectedBlock.id, { _styles: newStyles })
  }, [selectedBlock, getBlockStyles, updateBlock])

  // Update motion settings in block props
  const updateMotion = useCallback((motion: MotionSettings) => {
    if (!selectedBlock) return
    updateBlock(selectedBlock.id, { _motion: motion })
  }, [selectedBlock, updateBlock])

  // Update custom CSS
  const updateCustomCss = useCallback((css: string) => {
    if (!selectedBlock) return
    updateBlockFull(selectedBlock.id, { custom_css: css })
  }, [selectedBlock, updateBlockFull])

  // Update custom classes
  const updateCustomClasses = useCallback((classes: string) => {
    if (!selectedBlock) return
    updateBlockFull(selectedBlock.id, { custom_classes: classes })
  }, [selectedBlock, updateBlockFull])

  if (!selectedBlock) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Properties</h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Select a block to edit its properties
            </p>
          </div>
        </div>
      </div>
    )
  }

  const entry = getComponentEntry(selectedBlock.component_name)

  if (!entry) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Properties</h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-sm text-red-600">
              Unknown component: {selectedBlock.component_name}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Get icon component safely
  const iconName = entry.icon as keyof typeof LucideIcons
  const IconComponent = (LucideIcons[iconName] as LucideIcon) || Settings

  const handlePropsChange = (newProps: Record<string, unknown>) => {
    updateBlock(selectedBlock.id, newProps)
  }

  const styles = getBlockStyles()
  const motion = getBlockMotion()

  return (
    <div className="flex flex-col h-full">
      {/* Mobile sheet header - only shown in Sheet component */}
      <div className="border-b border-border p-4 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded bg-primary/10">
              <IconComponent className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold">{entry.displayName}</h2>
              {entry.description && (
                <p className="text-xs text-muted-foreground">{entry.description}</p>
              )}
            </div>
          </div>
          {/* Close button removed - SheetContent has built-in close button */}
        </div>

        {/* Visibility Toggle - mobile */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mt-3">
          <div className="flex items-center gap-2">
            {selectedBlock.is_visible ? (
              <Eye className="h-4 w-4 text-primary" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
            <Label htmlFor="block-visibility-mobile" className="text-sm font-medium cursor-pointer">
              Visible on page
            </Label>
          </div>
          <Switch
            id="block-visibility-mobile"
            checked={selectedBlock.is_visible ?? true}
            onCheckedChange={(checked) => updateBlockVisibility(selectedBlock.id, checked)}
          />
        </div>
      </div>

      {/* Header - desktop */}
      <div className="p-4 border-b border-border space-y-3 hidden lg:block">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
            <IconComponent className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">{entry.displayName}</h2>
            {entry.description && (
              <p className="text-xs text-muted-foreground">{entry.description}</p>
            )}
          </div>
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            {selectedBlock.is_visible ? (
              <Eye className="h-4 w-4 text-primary" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
            <Label htmlFor="block-visibility" className="text-sm font-medium cursor-pointer">
              Visible on page
            </Label>
          </div>
          <Switch
            id="block-visibility"
            checked={selectedBlock.is_visible ?? true}
            onCheckedChange={(checked) => updateBlockVisibility(selectedBlock.id, checked)}
          />
        </div>
      </div>

      {/* Accordion Sections - Elementor Style */}
      <div className="flex-1 overflow-auto">
        <Accordion
          type="multiple"
          defaultValue={["content"]}
          className="w-full"
        >
          {/* Content Section */}
          <AccordionSection value="content" icon={FileText} title="Content">
            <DynamicForm
              componentEntry={entry}
              values={selectedBlock.props}
              onChange={handlePropsChange}
            />
          </AccordionSection>

          {/* Typography Section */}
          <AccordionSection value="typography" icon={Type} title="Typography">
            <TypographyControls
              typography={styles.typography}
              onChange={(typography) => updateStyles('typography', typography)}
            />
          </AccordionSection>

          {/* Colors Section */}
          <AccordionSection value="colors" icon={Palette} title="Colors">
            <BackgroundControls
              background={styles.background}
              onChange={(background) => updateStyles('background', background)}
            />
          </AccordionSection>

          {/* Spacing Section */}
          <AccordionSection value="spacing" icon={Move} title="Spacing">
            <SpacingControls
              spacing={styles.spacing}
              onChange={(spacing) => updateStyles('spacing', spacing)}
            />
          </AccordionSection>

          {/* Animation Section */}
          <AccordionSection value="animation" icon={Sparkles} title="Animation">
            <MotionControls
              motion={motion}
              onChange={updateMotion}
            />
          </AccordionSection>

          {/* Advanced Section */}
          <AccordionSection value="advanced" icon={Settings} title="Advanced">
            <div className="space-y-6">
              {/* Border Controls */}
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Border</Label>
                <BorderControls
                  border={styles.border}
                  onChange={(border) => updateStyles('border', border)}
                />
              </div>

              {/* Shadow Controls */}
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Shadow</Label>
                <ShadowControls
                  shadow={styles.shadow}
                  onChange={(shadow) => updateStyles('shadow', shadow)}
                />
              </div>

              {/* Glass Effects */}
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Glass Effects</Label>
                <GlassmorphismControls
                  glass={styles.glass}
                  onChange={(glass) => updateStyles('glass', glass)}
                />
              </div>

              {/* Custom Classes */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Custom CSS Classes</Label>
                <Textarea
                  value={selectedBlock.custom_classes || ''}
                  onChange={(e) => updateCustomClasses(e.target.value)}
                  placeholder="e.g., my-custom-class animate-fade-in"
                  className="h-20 font-mono text-xs resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Add Tailwind or custom CSS classes separated by spaces
                </p>
              </div>

              {/* Custom CSS */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Custom CSS</Label>
                <Textarea
                  value={selectedBlock.custom_css || ''}
                  onChange={(e) => updateCustomCss(e.target.value)}
                  placeholder={`/* Scoped to this block */
.block {
  /* your styles here */
}`}
                  className="h-40 font-mono text-xs resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Write CSS scoped to this block. Use .block to target the element.
                </p>
              </div>

              {/* Block ID (read-only) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Block ID</Label>
                <code className="block p-2 bg-muted rounded text-xs font-mono break-all">
                  {selectedBlock.id}
                </code>
              </div>
            </div>
          </AccordionSection>
        </Accordion>
      </div>

      {/* Info Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            Changes are saved automatically. Press Ctrl+S to save immediately.
          </p>
        </div>
      </div>
    </div>
  )
}
