'use client'

import { useState, useCallback } from 'react'
import { usePageBuilder } from '../page-builder-provider'
import { DynamicForm } from './dynamic-form'
import { getComponentEntry } from '@/lib/cms/component-registry'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Settings, Info, Paintbrush, FileText, Code, Sparkles, Eye, EyeOff } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  TypographyControls,
  SpacingControls,
  BorderControls,
  BackgroundControls,
  ShadowControls,
} from '../elementor/style-controls'
import { MotionControls, type MotionSettings } from '../elementor/motion-controls'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

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
}

export function PropsPanel() {
  const { selectedBlock, updateBlock, updateBlockFull, updateBlockVisibility } = usePageBuilder()
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'motion' | 'advanced'>('content')

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

      {/* Tabs for Content / Style / Motion / Advanced */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="border-b border-border px-2">
          <TabsList className="grid grid-cols-4 w-full h-9">
            <TabsTrigger value="content" className="flex items-center gap-1 text-xs px-2">
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-1 text-xs px-2">
              <Paintbrush className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Style</span>
            </TabsTrigger>
            <TabsTrigger value="motion" className="flex items-center gap-1 text-xs px-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Motion</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1 text-xs px-2">
              <Code className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Adv</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Tab */}
        <TabsContent value="content" className="flex-1 m-0 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <DynamicForm
                componentEntry={entry}
                values={selectedBlock.props}
                onChange={handlePropsChange}
              />
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Style Tab */}
        <TabsContent value="style" className="flex-1 m-0 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              <TypographyControls
                typography={styles.typography}
                onChange={(typography) => updateStyles('typography', typography)}
              />
              <SpacingControls
                spacing={styles.spacing}
                onChange={(spacing) => updateStyles('spacing', spacing)}
              />
              <BorderControls
                border={styles.border}
                onChange={(border) => updateStyles('border', border)}
              />
              <BackgroundControls
                background={styles.background}
                onChange={(background) => updateStyles('background', background)}
              />
              <ShadowControls
                shadow={styles.shadow}
                onChange={(shadow) => updateStyles('shadow', shadow)}
              />
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Motion Tab */}
        <TabsContent value="motion" className="flex-1 m-0 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              <MotionControls
                motion={motion}
                onChange={updateMotion}
              />
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="flex-1 m-0 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
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
          </ScrollArea>
        </TabsContent>
      </Tabs>

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
