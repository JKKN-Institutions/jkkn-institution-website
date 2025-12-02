'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
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
  ChevronDown,
  Sparkles,
  Play,
  RotateCw,
  Move,
  Maximize,
  Eye,
} from 'lucide-react'

// Motion/Animation Settings
export interface MotionSettings {
  // Entrance Animation
  entranceAnimation?: string
  entranceDelay?: number
  entranceDuration?: number
  entranceEasing?: string

  // Hover Animation
  hoverAnimation?: string
  hoverScale?: number
  hoverRotate?: number
  hoverTranslateX?: number
  hoverTranslateY?: number

  // Scroll Animation
  scrollAnimation?: string
  scrollOffset?: number
  scrollDuration?: number

  // Custom CSS Animation
  customAnimation?: string
}

interface MotionControlsProps {
  motion?: MotionSettings
  onChange: (motion: MotionSettings) => void
}

const entranceAnimations = [
  { value: 'none', label: 'None' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'fade-in-up', label: 'Fade In Up' },
  { value: 'fade-in-down', label: 'Fade In Down' },
  { value: 'fade-in-left', label: 'Fade In Left' },
  { value: 'fade-in-right', label: 'Fade In Right' },
  { value: 'zoom-in', label: 'Zoom In' },
  { value: 'zoom-out', label: 'Zoom Out' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-down', label: 'Slide Down' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'flip-x', label: 'Flip X' },
  { value: 'flip-y', label: 'Flip Y' },
  { value: 'rotate-in', label: 'Rotate In' },
  { value: 'bounce', label: 'Bounce' },
]

const hoverAnimations = [
  { value: 'none', label: 'None' },
  { value: 'grow', label: 'Grow' },
  { value: 'shrink', label: 'Shrink' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'float', label: 'Float' },
  { value: 'shake', label: 'Shake' },
  { value: 'rotate', label: 'Rotate' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'glow', label: 'Glow' },
]

const scrollAnimations = [
  { value: 'none', label: 'None' },
  { value: 'parallax', label: 'Parallax' },
  { value: 'fade-on-scroll', label: 'Fade on Scroll' },
  { value: 'slide-on-scroll', label: 'Slide on Scroll' },
  { value: 'scale-on-scroll', label: 'Scale on Scroll' },
  { value: 'rotate-on-scroll', label: 'Rotate on Scroll' },
]

const easingOptions = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'spring', label: 'Spring' },
  { value: 'bounce', label: 'Bounce' },
]

export function MotionControls({ motion = {}, onChange }: MotionControlsProps) {
  const [isEntranceOpen, setIsEntranceOpen] = useState(true)
  const [isHoverOpen, setIsHoverOpen] = useState(false)
  const [isScrollOpen, setIsScrollOpen] = useState(false)
  const [isCustomOpen, setIsCustomOpen] = useState(false)
  const [previewAnimation, setPreviewAnimation] = useState<string | null>(null)

  const updateMotion = (key: keyof MotionSettings, value: string | number) => {
    onChange({ ...motion, [key]: value })
  }

  const playPreview = (animation: string) => {
    setPreviewAnimation(animation)
    setTimeout(() => setPreviewAnimation(null), 1500)
  }

  return (
    <div className="space-y-2">
      {/* Entrance Animation */}
      <Collapsible open={isEntranceOpen} onOpenChange={setIsEntranceOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Entrance Animation</span>
          </div>
          <ChevronDown className={cn('h-4 w-4 transition-transform', isEntranceOpen && 'rotate-180')} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Animation</Label>
            <div className="flex gap-2">
              <Select
                value={motion.entranceAnimation || 'none'}
                onValueChange={(v) => updateMotion('entranceAnimation', v)}
              >
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entranceAnimations.map((anim) => (
                    <SelectItem key={anim.value} value={anim.value}>
                      {anim.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => playPreview(motion.entranceAnimation || 'fade-in')}
                disabled={motion.entranceAnimation === 'none'}
              >
                <Play className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Duration (s)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[motion.entranceDuration || 0.5]}
                  onValueChange={([v]) => updateMotion('entranceDuration', v)}
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8">
                  {motion.entranceDuration || 0.5}s
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Delay (s)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[motion.entranceDelay || 0]}
                  onValueChange={([v]) => updateMotion('entranceDelay', v)}
                  min={0}
                  max={2}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8">
                  {motion.entranceDelay || 0}s
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Easing</Label>
            <Select
              value={motion.entranceEasing || 'ease-out'}
              onValueChange={(v) => updateMotion('entranceEasing', v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {easingOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Hover Animation */}
      <Collapsible open={isHoverOpen} onOpenChange={setIsHoverOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <RotateCw className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Hover Effects</span>
          </div>
          <ChevronDown className={cn('h-4 w-4 transition-transform', isHoverOpen && 'rotate-180')} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Animation</Label>
            <Select
              value={motion.hoverAnimation || 'none'}
              onValueChange={(v) => updateMotion('hoverAnimation', v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hoverAnimations.map((anim) => (
                  <SelectItem key={anim.value} value={anim.value}>
                    {anim.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {motion.hoverAnimation && motion.hoverAnimation !== 'none' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Scale</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[motion.hoverScale || 1]}
                    onValueChange={([v]) => updateMotion('hoverScale', v)}
                    min={0.5}
                    max={1.5}
                    step={0.05}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">
                    {motion.hoverScale || 1}x
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Rotate (°)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[motion.hoverRotate || 0]}
                    onValueChange={([v]) => updateMotion('hoverRotate', v)}
                    min={-180}
                    max={180}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">
                    {motion.hoverRotate || 0}°
                  </span>
                </div>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Scroll Animation */}
      <Collapsible open={isScrollOpen} onOpenChange={setIsScrollOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <Move className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Scroll Effects</span>
          </div>
          <ChevronDown className={cn('h-4 w-4 transition-transform', isScrollOpen && 'rotate-180')} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Animation</Label>
            <Select
              value={motion.scrollAnimation || 'none'}
              onValueChange={(v) => updateMotion('scrollAnimation', v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scrollAnimations.map((anim) => (
                  <SelectItem key={anim.value} value={anim.value}>
                    {anim.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {motion.scrollAnimation && motion.scrollAnimation !== 'none' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Trigger Offset (%)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[motion.scrollOffset || 20]}
                    onValueChange={([v]) => updateMotion('scrollOffset', v)}
                    min={0}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">
                    {motion.scrollOffset || 20}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Duration (s)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[motion.scrollDuration || 0.5]}
                    onValueChange={([v]) => updateMotion('scrollDuration', v)}
                    min={0.1}
                    max={2}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">
                    {motion.scrollDuration || 0.5}s
                  </span>
                </div>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Custom Animation */}
      <Collapsible open={isCustomOpen} onOpenChange={setIsCustomOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Custom Animation</span>
          </div>
          <ChevronDown className={cn('h-4 w-4 transition-transform', isCustomOpen && 'rotate-180')} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">CSS Animation</Label>
            <Input
              type="text"
              value={motion.customAnimation || ''}
              onChange={(e) => updateMotion('customAnimation', e.target.value)}
              placeholder="animation: myAnimation 1s ease infinite;"
              className="h-8 text-xs font-mono"
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            Enter a custom CSS animation property. Make sure the @keyframes are defined in your stylesheets.
          </p>
        </CollapsibleContent>
      </Collapsible>

      {/* Animation Preview */}
      {previewAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div
            className={cn(
              'w-32 h-32 bg-primary rounded-lg flex items-center justify-center',
              `animate-${previewAnimation}`
            )}
          >
            <Eye className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

// Animation CSS generator helper
export function generateAnimationCSS(motion: MotionSettings): string {
  const styles: string[] = []

  // Entrance animation
  if (motion.entranceAnimation && motion.entranceAnimation !== 'none') {
    const duration = motion.entranceDuration || 0.5
    const delay = motion.entranceDelay || 0
    const easing = motion.entranceEasing || 'ease-out'
    styles.push(`animation: ${motion.entranceAnimation} ${duration}s ${easing} ${delay}s both;`)
  }

  // Hover animation
  if (motion.hoverAnimation && motion.hoverAnimation !== 'none') {
    const transforms: string[] = []
    if (motion.hoverScale && motion.hoverScale !== 1) {
      transforms.push(`scale(${motion.hoverScale})`)
    }
    if (motion.hoverRotate) {
      transforms.push(`rotate(${motion.hoverRotate}deg)`)
    }
    if (motion.hoverTranslateX) {
      transforms.push(`translateX(${motion.hoverTranslateX}px)`)
    }
    if (motion.hoverTranslateY) {
      transforms.push(`translateY(${motion.hoverTranslateY}px)`)
    }
    if (transforms.length > 0) {
      styles.push(`--hover-transform: ${transforms.join(' ')};`)
    }
  }

  // Custom animation
  if (motion.customAnimation) {
    styles.push(motion.customAnimation)
  }

  return styles.join(' ')
}
