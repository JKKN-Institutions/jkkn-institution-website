'use client'

/**
 * Unified Right Panel - Context-Aware Single Panel System
 *
 * Replaces the 5-tab system (Properties/Typography/SEO/FAB/Footer) with a single,
 * intelligent panel that adapts based on context:
 * - Shows "Component Settings" when a block is selected
 * - Shows "Page Settings" when no block is selected
 *
 * Key Features:
 * - Responsive props UI with visual breakpoint indicators
 * - Hybrid code viewer (read-only + copy/paste)
 * - Collapsible accordion sections
 * - Reduced cognitive load
 */

import React, { useState } from 'react'
import { usePageBuilder } from './page-builder-provider'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Settings,
  Smartphone,
  Tablet,
  Monitor,
  Code2,
  Copy,
  Check,
  FileText,
  Search,
  MousePointerClick,
  Type,
  Footprints
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PropsPanel } from './properties/props-panel'
import { SeoPanel } from './panels/seo-panel'
import { FabPanel, type FabConfig } from './panels/fab-panel'
import { PageTypographyPanel } from './panels/page-typography-panel'
import { FooterPanel } from './panels/footer-panel'
import { HybridCodeViewer } from './hybrid-code-viewer'
import { ResponsivePropsEditor, type DeviceBreakpoint } from './responsive-props-editor'
import type { FooterSettings } from '@/app/actions/cms/footer'
import type { PageTypographySettings } from '@/lib/cms/page-typography-types'

interface UnifiedRightPanelProps {
  // Page info
  pageId: string
  pageSlug: string

  // Page-level settings
  onSeoUpdate?: (data: any) => void
  onFabUpdate?: (data: any) => void
  onTypographyUpdate?: (data: any) => void
  onFooterUpdate?: (data: any) => void

  // Saving states
  isSavingSeo?: boolean
  isSavingFab?: boolean
  isSavingTypography?: boolean
  isSavingFooter?: boolean

  // Initial data
  initialSeoData?: any
  initialFabConfig?: Partial<FabConfig>
  initialTypography?: Partial<PageTypographySettings>
  initialFooterSettings?: FooterSettings
}

export function UnifiedRightPanel({
  pageId,
  pageSlug,
  onSeoUpdate,
  onFabUpdate,
  onTypographyUpdate,
  onFooterUpdate,
  isSavingSeo = false,
  isSavingFab = false,
  isSavingTypography = false,
  isSavingFooter = false,
  initialSeoData,
  initialFabConfig,
  initialTypography,
  initialFooterSettings,
}: UnifiedRightPanelProps) {
  const { state, updateBlock, selectedBlock } = usePageBuilder()
  const [activeBreakpoint, setActiveBreakpoint] = useState<DeviceBreakpoint>('desktop')
  const [expandedSections, setExpandedSections] = useState<string[]>(['props'])

  // Determine if we're showing component settings or page settings
  const isComponentMode = !!selectedBlock

  // Get responsive settings for current block
  const responsiveSettings = (selectedBlock?.props?.responsive_settings as Record<DeviceBreakpoint, Record<string, any>>) || {} as Record<DeviceBreakpoint, Record<string, any>>
  const currentBreakpointProps = responsiveSettings[activeBreakpoint] || {}

  // Note: Copy code handlers are now handled by HybridCodeViewer component
  // No need for separate handlers here

  // Update props for specific breakpoint
  const handleResponsivePropsChange = (breakpoint: DeviceBreakpoint, newProps: Record<string, any>): void => {
    if (!selectedBlock) return

    const updatedResponsiveSettings = {
      ...responsiveSettings,
      [breakpoint]: {
        ...currentBreakpointProps,
        ...newProps,
      },
    }

    updateBlock(selectedBlock.id, {
      ...selectedBlock.props,
      responsive_settings: updatedResponsiveSettings,
    })
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
            <Settings className="h-4.5 w-4.5 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">
              {isComponentMode ? 'Component Settings' : 'Page Settings'}
            </h2>
            {!isComponentMode && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure page-wide settings
              </p>
            )}
          </div>
        </div>
        {isComponentMode && selectedBlock && (
          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-background/80 border border-border/50">
            <Badge variant="secondary" className="text-xs font-medium">
              {selectedBlock.component_name}
            </Badge>
            <span className="text-xs text-muted-foreground">
              ID: {selectedBlock.id.slice(0, 8)}
            </span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        {isComponentMode && selectedBlock ? (
          // COMPONENT MODE
          <div className="p-4 space-y-4 pb-20">
            <Accordion
              type="multiple"
              value={expandedSections}
              onValueChange={setExpandedSections}
              className="space-y-3"
            >
              {/* Responsive Breakpoints Section */}
              <AccordionItem value="breakpoints" className="border rounded-lg bg-card">
                <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2.5 w-full">
                    <div className="flex items-center justify-center h-7 w-7 rounded-md bg-muted">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-semibold text-sm">Responsive Design</span>
                    <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0.5">
                      NEW
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  {/* Visual Breakpoint Selector */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">
                      Device Breakpoint
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant={activeBreakpoint === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveBreakpoint('desktop')}
                        className="flex-1"
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        Desktop
                      </Button>
                      <Button
                        variant={activeBreakpoint === 'tablet' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveBreakpoint('tablet')}
                        className="flex-1"
                      >
                        <Tablet className="h-4 w-4 mr-2" />
                        Tablet
                      </Button>
                      <Button
                        variant={activeBreakpoint === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveBreakpoint('mobile')}
                        className="flex-1"
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        Mobile
                      </Button>
                    </div>
                  </div>

                  {/* Responsive Props Override UI */}
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">
                      Override properties for <strong>{activeBreakpoint}</strong> devices:
                    </div>

                    {/* This will be populated dynamically based on component schema */}
                    <ResponsivePropsEditor
                      componentName={selectedBlock.component_name}
                      propsSchema={{}} // TODO: Get from component registry
                      baseProps={selectedBlock.props}
                      responsiveSettings={responsiveSettings}
                      currentBreakpoint={activeBreakpoint}
                      onChange={handleResponsivePropsChange}
                      onReset={(breakpoint, propKey) => {
                        if (propKey) {
                          // Reset specific prop
                          const updated = { ...responsiveSettings[breakpoint] }
                          delete updated[propKey]
                          handleResponsivePropsChange(breakpoint, updated)
                        } else {
                          // Reset all props for breakpoint
                          handleResponsivePropsChange(breakpoint, {})
                        }
                      }}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Component Properties Section */}
              <AccordionItem value="props" className="border rounded-lg bg-card">
                <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center h-7 w-7 rounded-md bg-muted">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-semibold text-sm">Properties</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <PropsPanel />
                </AccordionContent>
              </AccordionItem>



              {/* Design Section - TODO: Implement later */}
              {/* <AccordionItem value="design" className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎨</span>
                    <span className="font-medium">Design</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="text-xs text-muted-foreground">
                    Design controls (spacing, colors, effects) - Coming soon
                  </div>
                </AccordionContent>
              </AccordionItem> */}
            </Accordion>
          </div>
        ) : (
          // PAGE MODE
          <div className="p-4 space-y-4 pb-20">
            <Accordion
              type="multiple"
              defaultValue={['seo']}
              className="space-y-3"
            >
              {/* SEO Section */}
              <AccordionItem value="seo" className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center h-7 w-7 rounded-md bg-muted">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-semibold text-sm">SEO</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <div className="w-full">
                    <SeoPanel
                      pageId={pageId}
                      pageSlug={pageSlug}
                      initialSeoData={initialSeoData}
                      onSave={async (data) => {
                        if (onSeoUpdate) {
                          await Promise.resolve(onSeoUpdate(data))
                        }
                      }}
                      isSaving={isSavingSeo}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* FAB Section */}
              <AccordionItem value="fab" className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center h-7 w-7 rounded-md bg-muted">
                      <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-semibold text-sm">Floating Action Button</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <div className="w-full">
                    <FabPanel
                      pageId={pageId}
                      initialConfig={initialFabConfig}
                      onSave={async (config) => {
                        if (onFabUpdate) {
                          await Promise.resolve(onFabUpdate(config))
                        }
                      }}
                      isSaving={isSavingFab}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Typography Section */}
              <AccordionItem value="typography" className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center h-7 w-7 rounded-md bg-muted">
                      <Type className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-semibold text-sm">Typography</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <div className="w-full">
                    <PageTypographyPanel
                      pageId={pageId}
                      initialTypography={initialTypography}
                      onSave={async (typography) => {
                        if (onTypographyUpdate) {
                          await Promise.resolve(onTypographyUpdate(typography))
                        }
                      }}
                      isSaving={isSavingTypography}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Footer Section */}
              <AccordionItem value="footer" className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center h-7 w-7 rounded-md bg-muted">
                      <Footprints className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-semibold text-sm">Footer</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <div className="w-full">
                    {initialFooterSettings && (
                      <FooterPanel
                        initialSettings={initialFooterSettings}
                        onSave={async (settings) => {
                          if (onFooterUpdate) {
                            await Promise.resolve(onFooterUpdate(settings))
                          }
                        }}
                        isSaving={isSavingFooter}
                      />
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

// ============================================================================
// Sub-components
// ============================================================================

// ResponsivePropsEditor - Imported from ./responsive-props-editor
// Used in the "Responsive Design" accordion section for component mode

// Note: Placeholder ResponsivePropsEditor function removed - using real import instead
