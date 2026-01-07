'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Camera, Check, AlertCircle, RefreshCw, Monitor, Tablet, Smartphone } from 'lucide-react'
import { uploadComponentPreview } from '@/lib/supabase/storage'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { PropsEditorPanel } from '@/components/cms/props-editor-panel'

type Viewport = 'desktop' | 'tablet' | 'mobile'

interface ViewportConfig {
  width: number
  height: number
  icon: typeof Monitor
  label: string
}

const VIEWPORTS: Record<Viewport, ViewportConfig> = {
  desktop: { width: 1920, height: 1080, icon: Monitor, label: 'Desktop' },
  tablet: { width: 768, height: 1024, icon: Tablet, label: 'Tablet' },
  mobile: { width: 375, height: 667, icon: Smartphone, label: 'Mobile' },
}

interface PreviewGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  component: {
    id: string
    name: string
    display_name: string
    code: string
    default_props: Record<string, unknown>
    props_schema?: Record<string, {
      type: string
      description?: string
      default?: unknown
      enum?: string[]
      required?: boolean
    }>
  } | null
}

export function PreviewGeneratorModal({
  isOpen,
  onClose,
  component,
}: PreviewGeneratorModalProps) {
  const router = useRouter()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'capturing' | 'uploading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [activeViewport, setActiveViewport] = useState<Viewport>('desktop')
  const [previewProps, setPreviewProps] = useState<Record<string, unknown>>(
    component?.default_props || {}
  )
  const [captures, setCaptures] = useState<{
    desktop: string | null
    tablet: string | null
    mobile: string | null
  }>({ desktop: null, tablet: null, mobile: null })

  // Capture all viewports sequentially
  const handleCaptureAllViewports = useCallback(async () => {
    if (!iframeRef.current || !component) return

    setStatus('capturing')
    setError(null)

    const results: { desktop: string | null; tablet: string | null; mobile: string | null } = {
      desktop: null,
      tablet: null,
      mobile: null,
    }

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default

      // Helper function to convert modern CSS colors to RGB
      const normalizeColors = (element: HTMLElement) => {
        const allElements = element.querySelectorAll('*')
        const elementsToProcess = [element, ...Array.from(allElements)] as HTMLElement[]

        elementsToProcess.forEach((el) => {
          if (!(el instanceof HTMLElement)) return

          const computedStyle = window.getComputedStyle(el)
          const colorProps = [
            'color',
            'backgroundColor',
            'borderColor',
            'borderTopColor',
            'borderRightColor',
            'borderBottomColor',
            'borderLeftColor',
            'outlineColor',
            'textDecorationColor',
            'fill',
            'stroke',
          ]

          colorProps.forEach((prop) => {
            const value = computedStyle.getPropertyValue(
              prop.replace(/([A-Z])/g, '-$1').toLowerCase()
            )
            // Check if value contains modern color functions
            if (
              value &&
              (value.includes('lab(') ||
                value.includes('oklch(') ||
                value.includes('lch(') ||
                value.includes('oklab('))
            ) {
              // Get computed RGB value and apply it inline
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              if (ctx) {
                ctx.fillStyle = value
                // fillStyle will be converted to a supported format
                const normalizedColor = ctx.fillStyle
                el.style.setProperty(
                  prop.replace(/([A-Z])/g, '-$1').toLowerCase(),
                  normalizedColor,
                  'important'
                )
              }
            }
          })
        })
      }

      // Capture each viewport
      for (const viewport of ['desktop', 'tablet', 'mobile'] as const) {
        // Get the iframe's content window and document
        const iframe = iframeRef.current
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

        if (!iframeDoc) {
          throw new Error('Could not access iframe content')
        }

        // Find the preview content element
        const previewContent = iframeDoc.querySelector('[data-preview-content="true"]')
        if (!previewContent) {
          throw new Error('Preview content not found')
        }

        // Resize iframe to viewport dimensions
        const viewportConfig = VIEWPORTS[viewport]
        iframe.style.width = `${viewportConfig.width}px`
        iframe.style.height = `${viewportConfig.height}px`

        // Wait for resize to complete and re-render
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Capture the preview content
        const canvas = await html2canvas(previewContent as HTMLElement, {
          backgroundColor: '#f8fafc',
          width: viewportConfig.width,
          height: viewportConfig.height,
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          onclone: (_doc, clonedElement) => {
            normalizeColors(clonedElement)
          },
        })

        setStatus('uploading')

        // Convert to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b)
              else reject(new Error('Failed to create blob'))
            },
            'image/png',
            0.9
          )
        })

        // Upload to storage with viewport suffix
        const { url, error: uploadError } = await uploadComponentPreview(
          component.id,
          blob,
          viewport
        )

        if (uploadError || !url) {
          throw new Error(`Failed to upload ${viewport} preview: ${uploadError}`)
        }

        results[viewport] = url
        setCaptures((prev) => ({ ...prev, [viewport]: url }))
      }

      setStatus('uploading')

      // Update component in database with all 3 URLs
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('cms_custom_components')
        .update({
          preview_image: results.desktop, // Main preview is desktop
          preview_image_desktop: results.desktop,
          preview_image_tablet: results.tablet,
          preview_image_mobile: results.mobile,
          preview_status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', component.id)

      if (updateError) {
        throw new Error('Failed to update component')
      }

      setStatus('success')
      toast.success('All viewport previews generated successfully!')

      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh()
        onClose()
      }, 1500)
    } catch (err) {
      console.error('Preview capture error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate preview')
      setStatus('error')
    }
  }, [component, router, onClose])

  // Handle iframe load
  const handleIframeLoad = useCallback(() => {
    // Check if the iframe content has the ready status
    const iframe = iframeRef.current
    if (!iframe) return

    const checkReady = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          const statusEl = iframeDoc.querySelector('[data-preview-status]')
          const status = statusEl?.getAttribute('data-preview-status')

          if (status === 'ready') {
            setStatus('ready')
          } else if (status === 'error') {
            setStatus('error')
            setError('Component failed to render')
          } else if (status === 'loading') {
            // Still loading, check again
            setTimeout(checkReady, 200)
          }
        }
      } catch (e) {
        // Cross-origin error, just proceed
        setStatus('ready')
      }
    }

    // Give time for React to hydrate
    setTimeout(checkReady, 500)
  }, [])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle')
      setError(null)
      setCaptures({ desktop: null, tablet: null, mobile: null })
      setPreviewProps(component?.default_props || {})
    }
  }, [isOpen, component?.default_props])

  // Set loading when component changes
  useEffect(() => {
    if (isOpen && component) {
      setStatus('loading')
    }
  }, [isOpen, component])

  // Send prop updates to iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'UPDATE_PROPS',
          props: previewProps,
        },
        '*'
      )
    }
  }, [previewProps])

  if (!component) return null

  const previewUrl = `/admin/preview-capture/custom?id=${component.id}`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Generate Component Previews</DialogTitle>
          <DialogDescription>
            Test props and capture previews for &quot;{component.display_name}&quot; across all
            viewports
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-[1fr_300px] gap-4 h-[600px]">
          {/* Left Panel - Preview Area with Viewport Tabs */}
          <div className="flex flex-col space-y-4">
            {/* Status indicator */}
            <div className="flex items-center gap-2 text-sm">
              {status === 'idle' && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Preparing...</span>
                </>
              )}
              {status === 'loading' && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading component...</span>
                </>
              )}
              {status === 'ready' && (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Ready to capture</span>
                </>
              )}
              {status === 'capturing' && (
                <>
                  <Camera className="h-4 w-4 animate-pulse" />
                  <span>Capturing screenshots...</span>
                </>
              )}
              {status === 'uploading' && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading previews...</span>
                </>
              )}
              {status === 'success' && (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">All previews generated successfully!</span>
                </>
              )}
              {status === 'error' && (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">{error || 'Failed to generate previews'}</span>
                </>
              )}
            </div>

            {/* Viewport Tabs */}
            <Tabs value={activeViewport} onValueChange={(v) => setActiveViewport(v as Viewport)}>
              <TabsList className="grid w-full grid-cols-3">
                {(Object.keys(VIEWPORTS) as Viewport[]).map((viewport) => {
                  const config = VIEWPORTS[viewport]
                  const Icon = config.icon
                  return (
                    <TabsTrigger key={viewport} value={viewport} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{config.label}</span>
                      {captures[viewport] && <Check className="h-3 w-3 text-green-500" />}
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {(Object.keys(VIEWPORTS) as Viewport[]).map((viewport) => {
                const config = VIEWPORTS[viewport]
                return (
                  <TabsContent key={viewport} value={viewport} className="flex-1">
                    <div
                      className="relative bg-slate-100 rounded-lg overflow-hidden border"
                      style={{ height: '500px' }}
                    >
                      {/* Scaled preview container */}
                      <div
                        className="origin-top-left"
                        style={{
                          width: `${config.width}px`,
                          height: `${config.height}px`,
                          transform: `scale(${Math.min(1, 500 / config.height)})`,
                        }}
                      >
                        <iframe
                          ref={activeViewport === viewport ? iframeRef : null}
                          src={previewUrl}
                          className="w-full h-full border-0"
                          onLoad={handleIframeLoad}
                          title="Component Preview"
                          style={{
                            width: `${config.width}px`,
                            height: `${config.height}px`,
                          }}
                        />
                      </div>

                      {/* Loading overlay */}
                      {(status === 'loading' || status === 'idle') && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80">
                          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                      )}

                      {/* Capture indicator */}
                      {captures[viewport] && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Captured
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          </div>

          {/* Right Panel - Props Editor */}
          {component.props_schema && Object.keys(component.props_schema).length > 0 ? (
            <PropsEditorPanel
              propsSchema={component.props_schema}
              currentProps={previewProps}
              onChange={setPreviewProps}
              onSaveAsDefaults={async () => {
                // Save current props as new defaults
                const supabase = createClient()
                await supabase
                  .from('cms_custom_components')
                  .update({ default_props: previewProps })
                  .eq('id', component.id)
                toast.success('Props saved as defaults')
              }}
            />
          ) : (
            <div className="flex items-center justify-center text-muted-foreground text-sm border rounded-lg">
              <div className="text-center p-4">
                <p>No props schema defined</p>
                <p className="text-xs mt-1">Add props to test component variations</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={status === 'capturing' || status === 'uploading'}>
            {status === 'success' ? 'Close' : 'Cancel'}
          </Button>
          {status === 'error' && (
            <Button onClick={handleCaptureAllViewports}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry All Viewports
            </Button>
          )}
          {status === 'ready' && (
            <Button onClick={handleCaptureAllViewports}>
              <Camera className="h-4 w-4 mr-2" />
              Capture All Viewports
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
