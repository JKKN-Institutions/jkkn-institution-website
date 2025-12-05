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
import { Loader2, Camera, Check, AlertCircle, RefreshCw } from 'lucide-react'
import { uploadComponentPreview } from '@/lib/supabase/storage'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PreviewGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  component: {
    id: string
    name: string
    display_name: string
    code: string
    default_props: Record<string, unknown>
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

  const handleCapture = useCallback(async () => {
    if (!iframeRef.current || !component) return

    setStatus('capturing')
    setError(null)

    try {
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
            'color', 'backgroundColor', 'borderColor',
            'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
            'outlineColor', 'textDecorationColor', 'fill', 'stroke'
          ]

          colorProps.forEach((prop) => {
            const value = computedStyle.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase())
            // Check if value contains modern color functions
            if (value && (value.includes('lab(') || value.includes('oklch(') || value.includes('lch(') || value.includes('oklab('))) {
              // Get computed RGB value and apply it inline
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              if (ctx) {
                ctx.fillStyle = value
                // fillStyle will be converted to a supported format
                const normalizedColor = ctx.fillStyle
                el.style.setProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase(), normalizedColor, 'important')
              }
            }
          })
        })
      }

      // Capture the preview content
      const canvas = await html2canvas(previewContent as HTMLElement, {
        backgroundColor: '#f8fafc',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (_doc, clonedElement) => {
          // Normalize colors in the cloned element to avoid "lab" color errors
          normalizeColors(clonedElement)
        },
      })

      setStatus('uploading')

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b)
          else reject(new Error('Failed to create blob'))
        }, 'image/png', 0.9)
      })

      // Upload to storage
      const { url, error: uploadError } = await uploadComponentPreview(component.id, blob)

      if (uploadError || !url) {
        throw new Error(uploadError || 'Failed to upload preview')
      }

      // Update component in database
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('cms_custom_components')
        .update({
          preview_image: url,
          preview_status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', component.id)

      if (updateError) {
        throw new Error('Failed to update component')
      }

      setStatus('success')
      toast.success('Preview generated successfully!')

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
            // Auto-capture after a short delay for rendering
            setTimeout(() => {
              handleCapture()
            }, 500)
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
        setTimeout(() => handleCapture(), 500)
      }
    }

    // Give time for React to hydrate
    setTimeout(checkReady, 500)
  }, [handleCapture])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle')
      setError(null)
    }
  }, [isOpen])

  // Set loading when component changes
  useEffect(() => {
    if (isOpen && component) {
      setStatus('loading')
    }
  }, [isOpen, component])

  if (!component) return null

  const previewUrl = `/admin/preview-capture/custom?id=${component.id}`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Generate Preview</DialogTitle>
          <DialogDescription>
            Capturing preview image for &quot;{component.display_name}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Component loaded, preparing capture...</span>
              </>
            )}
            {status === 'capturing' && (
              <>
                <Camera className="h-4 w-4 animate-pulse" />
                <span>Capturing screenshot...</span>
              </>
            )}
            {status === 'uploading' && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading preview...</span>
              </>
            )}
            {status === 'success' && (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-green-600">Preview generated successfully!</span>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-600">{error || 'Failed to generate preview'}</span>
              </>
            )}
          </div>

          {/* Preview iframe */}
          <div className="relative bg-slate-100 rounded-lg overflow-hidden border" style={{ height: '400px' }}>
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              title="Component Preview"
            />
            {(status === 'loading' || status === 'idle') && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {status === 'success' ? 'Close' : 'Cancel'}
            </Button>
            {status === 'error' && (
              <Button onClick={handleCapture}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
            {status === 'ready' && (
              <Button onClick={handleCapture}>
                <Camera className="h-4 w-4 mr-2" />
                Capture Now
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
