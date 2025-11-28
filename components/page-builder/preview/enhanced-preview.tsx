'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Eye,
  EyeOff,
  SplitSquareHorizontal,
  Palette,
  Wand2,
  Check,
  X,
  RefreshCw,
  Download,
  Maximize2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  enhancePage,
  GLASS_PRESETS,
  type GlassPreset,
  type EnhancedBlock,
} from '@/lib/cms/design-enhancer'
import type { PageBlock } from '@/lib/cms/registry-types'

interface EnhancedPreviewProps {
  blocks: PageBlock[]
  onApplyEnhancements?: (enhancedBlocks: EnhancedBlock[]) => void
  onClose?: () => void
}

type ViewMode = 'enhanced' | 'original' | 'split'

export function EnhancedPreview({
  blocks,
  onApplyEnhancements,
  onClose,
}: EnhancedPreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [glassPreset, setGlassPreset] = useState<GlassPreset>('brand')
  const [enableAnimations, setEnableAnimations] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [splitPosition, setSplitPosition] = useState(50)

  // Generate enhanced version
  const enhancementResult = useMemo(() => {
    return enhancePage(blocks, {
      glassPreset,
      enableAnimations,
    })
  }, [blocks, glassPreset, enableAnimations])

  const handleApply = async () => {
    setIsApplying(true)
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onApplyEnhancements?.(enhancementResult.enhancedBlocks)
    setIsApplying(false)
  }

  const handleSplitDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget.parentElement
    if (!container) return

    const handleMove = (moveEvent: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = moveEvent.clientX - rect.left
      const percentage = (x / rect.width) * 100
      setSplitPosition(Math.max(10, Math.min(90, percentage)))
    }

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-7xl h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">AI Design Enhancement</h2>
              <p className="text-sm text-muted-foreground">
                Glassmorphism & Modern UI Applied
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setViewMode('original')}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  viewMode === 'original'
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <EyeOff className="h-4 w-4 inline mr-1.5" />
                Original
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  viewMode === 'split'
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <SplitSquareHorizontal className="h-4 w-4 inline mr-1.5" />
                Compare
              </button>
              <button
                onClick={() => setViewMode('enhanced')}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  viewMode === 'enhanced'
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Sparkles className="h-4 w-4 inline mr-1.5" />
                Enhanced
              </button>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Preview Area */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
            {viewMode === 'split' ? (
              // Split View
              <div className="absolute inset-0 flex">
                {/* Original Side */}
                <div
                  className="h-full overflow-auto"
                  style={{ width: `${splitPosition}%` }}
                >
                  <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-black/50 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                    Original
                  </div>
                  <PreviewRenderer blocks={blocks} enhanced={false} />
                </div>

                {/* Divider */}
                <div
                  className="w-1 bg-primary cursor-col-resize relative z-20 hover:w-2 transition-all"
                  onMouseDown={handleSplitDrag}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <SplitSquareHorizontal className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Enhanced Side */}
                <div
                  className="h-full overflow-auto"
                  style={{ width: `${100 - splitPosition}%` }}
                >
                  <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-full flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Enhanced
                  </div>
                  <PreviewRenderer
                    blocks={blocks}
                    enhancedBlocks={enhancementResult.enhancedBlocks}
                    enhanced={true}
                  />
                </div>
              </div>
            ) : (
              // Single View
              <div className="absolute inset-0 overflow-auto">
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-black/50 text-white text-sm font-medium rounded-full backdrop-blur-sm flex items-center gap-1.5">
                  {viewMode === 'enhanced' ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Enhanced
                    </>
                  ) : (
                    'Original'
                  )}
                </div>
                <PreviewRenderer
                  blocks={blocks}
                  enhancedBlocks={
                    viewMode === 'enhanced'
                      ? enhancementResult.enhancedBlocks
                      : undefined
                  }
                  enhanced={viewMode === 'enhanced'}
                />
              </div>
            )}
          </div>

          {/* Settings Panel */}
          <div className="w-80 border-l bg-background overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Glass Preset */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  Glass Style
                </Label>
                <Select
                  value={glassPreset}
                  onValueChange={(v) => setGlassPreset(v as GlassPreset)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light Glass</SelectItem>
                    <SelectItem value="medium">Medium Glass</SelectItem>
                    <SelectItem value="strong">Strong Glass</SelectItem>
                    <SelectItem value="dark">Dark Glass</SelectItem>
                    <SelectItem value="brand">Brand Glass (Green)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Animations Toggle */}
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-primary" />
                  Animations
                </Label>
                <Switch
                  checked={enableAnimations}
                  onCheckedChange={setEnableAnimations}
                />
              </div>

              {/* Enhancement Summary */}
              <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                <h4 className="font-medium text-sm">Enhancements Applied</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Glassmorphism styling
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Backdrop blur effects
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Gradient overlays
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Hover interactions
                  </li>
                  {enableAnimations && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Smooth animations
                    </li>
                  )}
                </ul>
              </div>

              {/* Glass Preview */}
              <div className="space-y-2">
                <Label className="text-sm">Style Preview</Label>
                <div
                  className={cn(
                    'h-24 rounded-xl flex items-center justify-center text-white font-medium',
                    'bg-gradient-to-br from-primary to-primary/70'
                  )}
                >
                  <div
                    className={cn(
                      'px-6 py-3 rounded-lg',
                      GLASS_PRESETS[glassPreset].background,
                      GLASS_PRESETS[glassPreset].backdropBlur,
                      GLASS_PRESETS[glassPreset].border
                    )}
                  >
                    Glass Effect
                  </div>
                </div>
              </div>

              {/* Block Count */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Blocks Enhanced
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {enhancementResult.enhancedBlocks.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Preview your design with AI-enhanced glassmorphism styling
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={isApplying}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isApplying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Apply Enhancements
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Preview Renderer Component
interface PreviewRendererProps {
  blocks: PageBlock[]
  enhancedBlocks?: EnhancedBlock[]
  enhanced: boolean
}

function PreviewRenderer({
  blocks,
  enhancedBlocks,
  enhanced,
}: PreviewRendererProps) {
  if (enhanced && enhancedBlocks) {
    return (
      <div className="min-h-full p-8 space-y-8">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />

        {enhancedBlocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn('relative', block.wrapperClassName, block.animations)}
          >
            {block.backgroundGradient && (
              <div
                className={cn(
                  'absolute inset-0 pointer-events-none rounded-inherit',
                  block.backgroundGradient
                )}
              />
            )}
            <div className={cn('relative', block.innerClassName)}>
              <BlockPlaceholder
                name={block.componentName}
                enhanced={true}
              />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  // Original view
  return (
    <div className="min-h-full p-8 space-y-8 bg-background">
      {blocks.map((block) => (
        <div key={block.id}>
          <BlockPlaceholder name={block.componentName} enhanced={false} />
        </div>
      ))}
    </div>
  )
}

// Placeholder for blocks (in real implementation, render actual components)
function BlockPlaceholder({
  name,
  enhanced,
}: {
  name: string
  enhanced: boolean
}) {
  return (
    <div
      className={cn(
        'p-8 rounded-xl border-2 border-dashed',
        enhanced
          ? 'border-primary/30 bg-primary/5'
          : 'border-muted-foreground/20 bg-muted/20'
      )}
    >
      <div className="text-center">
        <p className="font-medium text-lg">{name}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {enhanced ? 'Enhanced with glassmorphism' : 'Original styling'}
        </p>
      </div>
    </div>
  )
}

export default EnhancedPreview
