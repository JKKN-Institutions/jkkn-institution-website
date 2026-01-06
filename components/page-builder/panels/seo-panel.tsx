'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePageBuilder } from '../page-builder-provider'
import { SeoPreview } from './seo-preview'
import {
  analyzeSeo,
  getSeoGrade,
  SEO_LIMITS,
  type SeoData,
  type SeoIssue,
} from '@/lib/utils/seo-analyzer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Search,
  Share2,
  Twitter,
  ChevronDown,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SeoPanelProps {
  pageId: string
  pageSlug: string
  initialSeoData?: Partial<SeoData> & { id?: string }
  onSave: (seoData: Partial<SeoData>) => Promise<void>
  isSaving?: boolean
}

// Tag input component
function TagInput({
  value,
  onChange,
  placeholder,
  maxTags = 10,
}: {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase()
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag])
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="flex flex-wrap gap-1.5 p-2 min-h-[42px] rounded-md border border-input bg-background">
      {value.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="gap-1 px-2 py-0.5 text-xs"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-0.5 hover:text-destructive focus:outline-none"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[100px] text-sm bg-transparent outline-none"
        disabled={value.length >= maxTags}
      />
    </div>
  )
}

// Character counter component
function CharacterCounter({
  current,
  min,
  max,
  optimal,
}: {
  current: number
  min?: number
  max: number
  optimal?: number
}) {
  const percentage = Math.min((current / max) * 100, 100)
  const isOptimal = optimal ? current >= (min || 0) && current <= optimal : current <= max
  const isTooLong = current > max
  const isTooShort = min ? current < min : false

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full transition-all',
            isTooLong
              ? 'bg-red-500'
              : isTooShort
              ? 'bg-yellow-500'
              : isOptimal
              ? 'bg-green-500'
              : 'bg-primary'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        className={cn(
          'text-xs tabular-nums',
          isTooLong
            ? 'text-red-500'
            : isTooShort
            ? 'text-yellow-500'
            : 'text-muted-foreground'
        )}
      >
        {current}/{max}
      </span>
    </div>
  )
}

export function SeoPanel({
  pageId,
  pageSlug,
  initialSeoData,
  onSave,
  isSaving,
}: SeoPanelProps) {
  const { state } = usePageBuilder()

  // SEO form state
  const [seoData, setSeoData] = useState<Partial<SeoData>>({
    meta_title: initialSeoData?.meta_title || '',
    meta_description: initialSeoData?.meta_description || '',
    meta_keywords: initialSeoData?.meta_keywords || [],
    canonical_url: initialSeoData?.canonical_url || '',
    og_title: initialSeoData?.og_title || '',
    og_description: initialSeoData?.og_description || '',
    og_image: initialSeoData?.og_image || '',
    twitter_title: initialSeoData?.twitter_title || '',
    twitter_description: initialSeoData?.twitter_description || '',
    twitter_image: initialSeoData?.twitter_image || '',
    structured_data: initialSeoData?.structured_data || [],
  })

  // Analysis state
  const [analysisResult, setAnalysisResult] = useState(() => analyzeSeo(seoData))
  const [isDirty, setIsDirty] = useState(false)

  // Section collapse state
  const [openSections, setOpenSections] = useState({
    basic: true,
    openGraph: false,
    twitter: false,
    advanced: false,
  })

  // Re-analyze when seo data changes
  useEffect(() => {
    const result = analyzeSeo(seoData)
    setAnalysisResult(result)
  }, [seoData])

  // Update a single field
  const updateField = useCallback(
    <K extends keyof SeoData>(field: K, value: SeoData[K]) => {
      setSeoData((prev) => ({ ...prev, [field]: value }))
      setIsDirty(true)
    },
    []
  )

  // Handle save
  const handleSave = async () => {
    await onSave(seoData)
    setIsDirty(false)
  }

  // Get grade info
  const gradeInfo = getSeoGrade(analysisResult.score)

  // Toggle section
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Get issue icon
  const getIssueIcon = (type: SeoIssue['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Score */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h2 className="text-sm sm:text-base font-semibold text-foreground">SEO Settings</h2>
          </div>
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
            {isSaving ? 'Saving...' : 'Save SEO'}
          </Button>
        </div>

        {/* SEO Score Display */}
        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
          <div className="relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-muted"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                strokeWidth="3"
                strokeDasharray={100}
                strokeDashoffset={100 - analysisResult.score}
                strokeLinecap="round"
                className={cn(
                  'transition-all duration-500',
                  analysisResult.score >= 70
                    ? 'stroke-green-500'
                    : analysisResult.score >= 50
                    ? 'stroke-yellow-500'
                    : 'stroke-red-500'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn('text-lg font-bold', gradeInfo.color)}>
                {gradeInfo.grade}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{analysisResult.score}</span>
              <span className="text-muted-foreground">/100</span>
            </div>
            <p className={cn('text-sm font-medium', gradeInfo.color)}>
              {gradeInfo.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {analysisResult.passed.length} passed • {analysisResult.issues.length} issues
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Issues Summary */}
          {analysisResult.issues.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Issues to Fix</h3>
              <div className="space-y-1.5">
                {analysisResult.issues.slice(0, 5).map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 rounded-md bg-muted/50 text-xs"
                  >
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <p className="font-medium">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-muted-foreground mt-0.5">{issue.suggestion}</p>
                      )}
                    </div>
                  </div>
                ))}
                {analysisResult.issues.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{analysisResult.issues.length - 5} more issues
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Basic SEO Section */}
          <Collapsible
            open={openSections.basic}
            onOpenChange={() => toggleSection('basic')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Basic SEO</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSections.basic && 'rotate-180'
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">
              {/* Meta Title */}
              <div className="space-y-1.5">
                <Label htmlFor="meta_title" className="flex items-center gap-1">
                  Meta Title
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[200px]">
                        <p className="text-xs">
                          The title that appears in search results. Aim for 30-60 characters.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="meta_title"
                  value={seoData.meta_title || ''}
                  onChange={(e) => updateField('meta_title', e.target.value)}
                  placeholder="Enter page title for search engines"
                  maxLength={100}
                />
                <CharacterCounter
                  current={seoData.meta_title?.length || 0}
                  min={SEO_LIMITS.META_TITLE_MIN}
                  max={SEO_LIMITS.META_TITLE_MAX}
                  optimal={SEO_LIMITS.META_TITLE_OPTIMAL}
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <Label htmlFor="meta_description" className="flex items-center gap-1">
                  Meta Description
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[200px]">
                        <p className="text-xs">
                          A brief summary shown in search results. Aim for 120-160 characters.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Textarea
                  id="meta_description"
                  value={seoData.meta_description || ''}
                  onChange={(e) => updateField('meta_description', e.target.value)}
                  placeholder="Enter a compelling description for search results"
                  rows={3}
                  maxLength={200}
                />
                <CharacterCounter
                  current={seoData.meta_description?.length || 0}
                  min={SEO_LIMITS.META_DESCRIPTION_MIN}
                  max={SEO_LIMITS.META_DESCRIPTION_MAX}
                  optimal={SEO_LIMITS.META_DESCRIPTION_OPTIMAL}
                />
              </div>

              {/* Keywords */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1">
                  Keywords
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[200px]">
                        <p className="text-xs">
                          Relevant keywords for this page. Press Enter or comma to add.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <TagInput
                  value={seoData.meta_keywords || []}
                  onChange={(tags) => updateField('meta_keywords', tags)}
                  placeholder="Add keywords..."
                  maxTags={SEO_LIMITS.KEYWORDS_MAX}
                />
                <p className="text-xs text-muted-foreground">
                  {seoData.meta_keywords?.length || 0}/{SEO_LIMITS.KEYWORDS_MAX} keywords
                </p>
              </div>

              {/* Canonical URL */}
              <div className="space-y-1.5">
                <Label htmlFor="canonical_url" className="flex items-center gap-1">
                  Canonical URL
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[200px]">
                        <p className="text-xs">
                          The preferred URL if this content exists at multiple URLs.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="canonical_url"
                  type="url"
                  value={seoData.canonical_url || ''}
                  onChange={(e) => updateField('canonical_url', e.target.value)}
                  placeholder="https://jkkn.ac.in/..."
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Open Graph Section */}
          <Collapsible
            open={openSections.openGraph}
            onOpenChange={() => toggleSection('openGraph')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">Open Graph (Facebook)</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSections.openGraph && 'rotate-180'
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="og_title">OG Title</Label>
                <Input
                  id="og_title"
                  value={seoData.og_title || ''}
                  onChange={(e) => updateField('og_title', e.target.value)}
                  placeholder="Title for social sharing (defaults to meta title)"
                />
                <CharacterCounter
                  current={seoData.og_title?.length || 0}
                  max={SEO_LIMITS.OG_TITLE_MAX}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="og_description">OG Description</Label>
                <Textarea
                  id="og_description"
                  value={seoData.og_description || ''}
                  onChange={(e) => updateField('og_description', e.target.value)}
                  placeholder="Description for social sharing"
                  rows={2}
                />
                <CharacterCounter
                  current={seoData.og_description?.length || 0}
                  max={SEO_LIMITS.OG_DESCRIPTION_MAX}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="og_image">OG Image URL</Label>
                <Input
                  id="og_image"
                  type="url"
                  value={seoData.og_image || ''}
                  onChange={(e) => updateField('og_image', e.target.value)}
                  placeholder="https://example.com/image.jpg (1200x630px recommended)"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Twitter Section */}
          <Collapsible
            open={openSections.twitter}
            onOpenChange={() => toggleSection('twitter')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-sky-500" />
                <span className="font-medium text-sm">Twitter Card</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSections.twitter && 'rotate-180'
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="twitter_title">Twitter Title</Label>
                <Input
                  id="twitter_title"
                  value={seoData.twitter_title || ''}
                  onChange={(e) => updateField('twitter_title', e.target.value)}
                  placeholder="Title for Twitter (defaults to OG/meta title)"
                />
                <CharacterCounter
                  current={seoData.twitter_title?.length || 0}
                  max={SEO_LIMITS.TWITTER_TITLE_MAX}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="twitter_description">Twitter Description</Label>
                <Textarea
                  id="twitter_description"
                  value={seoData.twitter_description || ''}
                  onChange={(e) => updateField('twitter_description', e.target.value)}
                  placeholder="Description for Twitter"
                  rows={2}
                />
                <CharacterCounter
                  current={seoData.twitter_description?.length || 0}
                  max={SEO_LIMITS.TWITTER_DESCRIPTION_MAX}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="twitter_image">Twitter Image URL</Label>
                <Input
                  id="twitter_image"
                  type="url"
                  value={seoData.twitter_image || ''}
                  onChange={(e) => updateField('twitter_image', e.target.value)}
                  placeholder="https://example.com/image.jpg (1200x600px recommended)"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Preview Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
            <SeoPreview
              metaTitle={seoData.meta_title || null}
              metaDescription={seoData.meta_description || null}
              ogTitle={seoData.og_title || null}
              ogDescription={seoData.og_description || null}
              ogImage={seoData.og_image || null}
              twitterTitle={seoData.twitter_title || null}
              twitterDescription={seoData.twitter_description || null}
              twitterImage={seoData.twitter_image || null}
              pageSlug={pageSlug}
            />
          </div>

          {/* Passed Checks */}
          {analysisResult.passed.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Passed Checks</h3>
              <div className="space-y-1">
                {analysisResult.passed.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs text-green-600"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
