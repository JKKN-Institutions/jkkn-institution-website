'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  FileCode,
  Layout,
  Loader2,
  Check,
  AlertCircle,
  ArrowRight,
  X,
} from 'lucide-react'
import {
  analyzeTemplateImage,
  createTemplateFromBlocks,
  createPageFromBlocks,
  type ImageToPageState,
} from '@/app/actions/cms/image-to-page'
import type { GeneratedBlock } from '@/lib/ai/image-to-page'
import { cn } from '@/lib/utils'

interface ImageToPageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = 'upload' | 'analyzing' | 'preview' | 'create' | 'complete'

export function ImageToPageDialog({ open, onOpenChange }: ImageToPageDialogProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>('upload')
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Generated blocks
  const [generatedBlocks, setGeneratedBlocks] = useState<GeneratedBlock[]>([])

  // Create form state
  const [createMode, setCreateMode] = useState<'template' | 'page'>('template')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [slug, setSlug] = useState('')

  // Result state
  const [resultId, setResultId] = useState<string | null>(null)

  // Reset dialog
  const resetDialog = useCallback(() => {
    setStep('upload')
    setIsLoading(false)
    setProgress(0)
    setError(null)
    setSelectedFile(null)
    setPreviewUrl(null)
    setGeneratedBlocks([])
    setCreateMode('template')
    setName('')
    setDescription('')
    setSlug('')
    setResultId(null)
  }, [])

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, GIF, or WebP image')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image too large. Maximum size is 10MB.')
      return
    }

    setSelectedFile(file)
    setError(null)

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }, [])

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const input = fileInputRef.current
      if (input) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        input.files = dataTransfer.files
        handleFileSelect({ target: input } as React.ChangeEvent<HTMLInputElement>)
      }
    }
  }, [handleFileSelect])

  // Analyze image
  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setStep('analyzing')
    setProgress(10)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 80))
      }, 500)

      const result = await analyzeTemplateImage(formData)

      clearInterval(progressInterval)
      setProgress(100)

      if (result.success && result.blocks) {
        setGeneratedBlocks(result.blocks)
        setStep('preview')
        toast.success(`Generated ${result.blocks.length} blocks from image`)
      } else {
        setError(result.message || 'Failed to analyze image')
        setStep('upload')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setStep('upload')
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }, [selectedFile])

  // Create template or page
  const handleCreate = useCallback(async () => {
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let result: ImageToPageState

      if (createMode === 'template') {
        result = await createTemplateFromBlocks(
          name,
          description,
          generatedBlocks,
          previewUrl || undefined
        )
      } else {
        const pageSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        result = await createPageFromBlocks(name, pageSlug, generatedBlocks)
      }

      if (result.success) {
        setResultId(result.templateId || result.pageId || null)
        setStep('complete')
        toast.success(result.message)
      } else {
        setError(result.message || 'Failed to create')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [createMode, name, description, slug, generatedBlocks, previewUrl])

  // Navigate to result
  const handleGoToResult = useCallback(() => {
    if (resultId) {
      if (createMode === 'template') {
        router.push(`/admin/content/templates/${resultId}/edit`)
      } else {
        router.push(`/admin/content/pages/${resultId}/edit`)
      }
      onOpenChange(false)
      resetDialog()
    }
  }, [resultId, createMode, router, onOpenChange, resetDialog])

  // Close dialog
  const handleClose = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    onOpenChange(false)
    resetDialog()
  }, [previewUrl, onOpenChange, resetDialog])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Image to Page
          </DialogTitle>
          <DialogDescription>
            Upload a screenshot of any website and AI will recreate it using our page builder blocks
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 py-4">
          {(['upload', 'analyzing', 'preview', 'create', 'complete'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : (['upload', 'analyzing', 'preview', 'create', 'complete'].indexOf(step) > i)
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {(['upload', 'analyzing', 'preview', 'create', 'complete'].indexOf(step) > i) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 4 && <div className="w-8 h-0.5 bg-muted" />}
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-auto"
              onClick={() => setError(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step: Upload */}
        {step === 'upload' && (
          <div className="space-y-4">
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                'hover:border-primary hover:bg-primary/5',
                selectedFile && 'border-primary bg-primary/5'
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileSelect}
              />

              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-muted-foreground">
                    {selectedFile?.name}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Drop your screenshot here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (JPG, PNG, GIF, WebP up to 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || isLoading}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Image
              </Button>
            </div>
          </div>
        )}

        {/* Step: Analyzing */}
        {step === 'analyzing' && (
          <div className="space-y-6 py-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <div>
                <p className="font-medium">Analyzing your image...</p>
                <p className="text-sm text-muted-foreground">
                  AI is identifying sections and extracting content
                </p>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Step: Preview */}
        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {generatedBlocks.length} blocks detected
              </Badge>
            </div>

            {/* Preview image */}
            {previewUrl && (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Source"
                  className="w-full max-h-48 object-cover rounded-lg opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Badge className="bg-background/90">Source Image</Badge>
                </div>
              </div>
            )}

            {/* Generated blocks list */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <p className="text-sm font-medium">Generated Blocks:</p>
              {generatedBlocks.map((block, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
                >
                  <span className="text-xs text-muted-foreground w-6">
                    {index + 1}.
                  </span>
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{block.component_name}</span>
                  {block.description && (
                    <span className="text-xs text-muted-foreground truncate">
                      - {block.description}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button onClick={() => setStep('create')}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Create */}
        {step === 'create' && (
          <div className="space-y-6">
            {/* Mode selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={cn(
                  'p-4 rounded-lg border-2 text-left transition-colors',
                  createMode === 'template'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
                onClick={() => setCreateMode('template')}
              >
                <Layout className="h-6 w-6 mb-2 text-primary" />
                <p className="font-medium">Create Template</p>
                <p className="text-sm text-muted-foreground">
                  Save as reusable template for future pages
                </p>
              </button>
              <button
                type="button"
                className={cn(
                  'p-4 rounded-lg border-2 text-left transition-colors',
                  createMode === 'page'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
                onClick={() => setCreateMode('page')}
              >
                <FileCode className="h-6 w-6 mb-2 text-primary" />
                <p className="font-medium">Create Page</p>
                <p className="text-sm text-muted-foreground">
                  Create a new page directly from blocks
                </p>
              </button>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {createMode === 'template' ? 'Template Name' : 'Page Title'} *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (createMode === 'page') {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                    }
                  }}
                  placeholder={createMode === 'template' ? 'My Template' : 'My Page'}
                />
              </div>

              {createMode === 'page' && (
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-page"
                    className="font-mono text-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description..."
                  rows={2}
                />
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep('preview')}>
                Back
              </Button>
              <Button onClick={handleCreate} disabled={isLoading || !name.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Create {createMode === 'template' ? 'Template' : 'Page'}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step: Complete */}
        {step === 'complete' && (
          <div className="space-y-6 py-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-lg">
                  {createMode === 'template' ? 'Template' : 'Page'} Created!
                </p>
                <p className="text-sm text-muted-foreground">
                  Your {createMode} has been created with {generatedBlocks.length} blocks
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleGoToResult}>
                Open in Editor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
