'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { createPage } from '@/app/actions/cms/pages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, CheckCircle2, XCircle, Info, Home, Globe, Lock, Eye, ExternalLink, ArrowRight, AlertTriangle, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface PageCreateFormProps {
  parentPages: Array<{
    id: string
    title: string
    slug: string
  }>
  templates: Array<{
    id: string
    name: string
    description: string | null
    thumbnail_url: string | null
    default_blocks: unknown
    category: string | null
  }>
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full h-12 text-base shadow-lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Creating Page...
        </>
      ) : (
        'Create Page'
      )}
    </Button>
  )
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function PageCreateForm({ parentPages, templates }: PageCreateFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(createPage, {})

  // Local state for controlled inputs
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [parentId, setParentId] = useState<string>('')
  const [templateId, setTemplateId] = useState<string>('')
  const [visibility, setVisibility] = useState<string>('public')
  const [isHomepage, setIsHomepage] = useState(false)
  const [showInNavigation, setShowInNavigation] = useState(true)
  const [externalUrl, setExternalUrl] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('')
  const [slugPreview, setSlugPreview] = useState<string>('')

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlug(generateSlug(title))
    }
  }, [title, slugManuallyEdited])

  // Update slug preview when parent or slug changes
  useEffect(() => {
    if (!parentId || parentId === 'none' || parentId === '') {
      setSlugPreview(`/${slug}`)
      return
    }

    const parent = parentPages.find((p) => p.id === parentId)
    if (parent && slug) {
      setSlugPreview(`/${parent.slug}/${slug}`)
    } else if (slug) {
      setSlugPreview(`/${slug}`)
    }
  }, [parentId, slug, parentPages])

  useEffect(() => {
    if (state.success && state.data) {
      toast.success(state.message || 'Page created successfully!')
      const pageId = (state.data as { id: string }).id
      // Redirect to standalone editor (without admin panel)
      setTimeout(() => {
        router.push(`/editor/${pageId}`)
      }, 1500)
    }
  }, [state.success, state.message, state.data, router])

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true)
    setSlug(value)
  }

  return (
    <form action={formAction} className="space-y-8">
      {/* Status Messages */}
      {state.message && !state.success && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/10">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.success && (
        <Alert className="border-primary/50 bg-primary/5">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            {state.message || 'Page created successfully! Redirecting to editor...'}
          </AlertDescription>
        </Alert>
      )}

      {/* Section 1: Basic Information */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
        </div>

        {/* Title Field */}
        <div className="space-y-2.5">
          <Label htmlFor="title" className="text-foreground text-sm font-medium">
            Page Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="About Us"
            required
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20 h-11"
            aria-invalid={!!state.errors?.title}
            aria-describedby={state.errors?.title ? 'title-error' : undefined}
          />
          {state.errors?.title && (
            <p id="title-error" className="text-sm text-red-600 dark:text-red-400">
              {state.errors.title[0]}
            </p>
          )}
        </div>

        {/* Slug Field */}
        <div className="space-y-2.5">
          <Label htmlFor="slug" className="text-foreground text-sm font-medium">
            URL Slug <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">/</span>
            <Input
              id="slug"
              name="slug"
              type="text"
              placeholder="about-us"
              required
              maxLength={200}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20 font-mono h-11"
              aria-invalid={!!state.errors?.slug}
              aria-describedby={state.errors?.slug ? 'slug-error' : 'slug-help'}
            />
          </div>
          {state.errors?.slug && (
            <p id="slug-error" className="text-sm text-red-600 dark:text-red-400">
              {state.errors.slug[0]}
            </p>
          )}
          <p id="slug-help" className="text-xs text-muted-foreground">
            {parentId && parentId !== 'none'
              ? 'Enter only the page segment (parent path will be added automatically)'
              : 'Lowercase letters, numbers, and hyphens only. Auto-generated from title.'}
          </p>
        </div>

        {/* Description Field */}
        <div className="space-y-2.5">
          <Label htmlFor="description" className="text-foreground text-sm font-medium">
            Description (Optional)
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Brief description of the page..."
            rows={4}
            className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20 resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Used for SEO meta description if not overridden
          </p>
        </div>
      </div>

      {/* Section 2: Structure & Template */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <h3 className="text-lg font-semibold text-foreground">Structure & Template</h3>
        </div>

        {/* Parent Page Field */}
        <div className="space-y-2.5">
          <Label htmlFor="parent_id" className="text-foreground text-sm font-medium">
            Parent Page (Optional)
          </Label>
          <Select value={parentId} onValueChange={setParentId}>
            <SelectTrigger className="bg-background/50 border-border/50 h-11 w-full">
              <SelectValue placeholder="None (Root level page)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (Root level page)</SelectItem>
              {parentPages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.title} (/{page.slug})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="parent_id" value={parentId === 'none' ? '' : parentId} />
          <p className="text-xs text-muted-foreground">
            Nest this page under another page for hierarchical structure
          </p>
          {slugPreview && slug && (
            <div className="mt-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Final URL Preview:</p>
              <p className="text-sm font-mono text-primary break-all">{slugPreview}</p>
            </div>
          )}
        </div>

        {/* Template Field */}
        {templates.length > 0 && (
          <div className="space-y-2.5">
            <Label htmlFor="template_id" className="text-foreground text-sm font-medium">
              Page Template (Optional)
            </Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger className="bg-background/50 border-border/50 h-11 w-full">
                <SelectValue placeholder="Blank page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blank">Blank page</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="template_id" value={templateId === 'blank' ? '' : templateId} />
            <p className="text-xs text-muted-foreground">
              Start with a pre-built template or create from scratch
            </p>
          </div>
        )}
      </div>

      {/* Section 3: Visibility & Settings */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <h3 className="text-lg font-semibold text-foreground">Visibility & Settings</h3>
        </div>

        {/* Visibility Field */}
        <div className="space-y-2.5">
          <Label htmlFor="visibility" className="text-foreground text-sm font-medium">
            Visibility
          </Label>
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger className="bg-background/50 border-border/50 h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Public - Anyone can view
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Private - Only logged in users
                </div>
              </SelectItem>
              <SelectItem value="password_protected">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Password Protected
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="visibility" value={visibility} />
        </div>

        {/* Homepage Toggle */}
        <div className="flex items-center justify-between p-5 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="is_homepage" className="text-foreground font-medium text-sm cursor-pointer">
                Set as Homepage
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                This page will be the first thing visitors see
              </p>
            </div>
          </div>
          <Switch
            id="is_homepage"
            checked={isHomepage}
            onCheckedChange={setIsHomepage}
          />
          <input type="hidden" name="is_homepage" value={isHomepage ? 'true' : 'false'} />
        </div>

        {/* Show in Navigation Toggle */}
        <div className="flex items-center justify-between p-5 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Eye className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor="show_in_navigation" className="text-foreground font-medium text-sm cursor-pointer">
                Show in Navigation
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Display this page in the website navigation menu
              </p>
            </div>
          </div>
          <Switch
            id="show_in_navigation"
            checked={showInNavigation}
            onCheckedChange={setShowInNavigation}
          />
          <input type="hidden" name="show_in_navigation" value={showInNavigation ? 'true' : 'false'} />
        </div>

        {/* External URL Field (when navigation is enabled) */}
        {showInNavigation && (
          <div className="space-y-2.5 pl-4 border-l-2 border-primary/30">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="external_url" className="text-foreground text-sm font-medium">
                External URL (Optional)
              </Label>
            </div>
            <Input
              id="external_url"
              name="external_url"
              type="url"
              placeholder="https://example.com"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20 h-11"
            />
            <p className="text-xs text-muted-foreground">
              If set, navigation will link to this URL instead of the page content (opens in new tab)
            </p>
          </div>
        )}

        {/* Redirect URL Field - Redirects page visitors to external URL */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="redirect_url" className="text-foreground text-sm font-medium">
              Redirect URL (Optional)
            </Label>
          </div>
          <Input
            id="redirect_url"
            name="redirect_url"
            type="url"
            placeholder="https://drive.google.com/file/d/xxx/view"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20 h-11"
          />
          <p className="text-xs text-muted-foreground">
            If set, visiting this page will redirect to this URL in the same tab (e.g., Google Drive PDF)
          </p>
        </div>
      </div>

      {/* Status (hidden, default to draft) */}
      <input type="hidden" name="status" value="draft" />

      {/* Info Box */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-900 dark:text-blue-200 text-sm">
          <strong className="font-semibold">Next step:</strong> After creating the page, you&apos;ll be
          redirected to the full-screen visual page builder where you can add content blocks and design your page.
        </AlertDescription>
      </Alert>

      {/* Submit Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="sm:flex-1 h-12 text-base border-border/50 hover:bg-muted"
        >
          Cancel
        </Button>
        <div className="sm:flex-1">
          <SubmitButton />
        </div>
      </div>
    </form>
  )
}
