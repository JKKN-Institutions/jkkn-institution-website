'use client'

import { useState } from 'react'
import { FileText, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createTemplateFromPage, type TemplateCategory } from '@/app/actions/cms/templates'
import { toast } from 'sonner'

interface SaveTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pageId: string
  pageTitle: string
  onSaved?: () => void
}

const categories: { value: TemplateCategory; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'content', label: 'Content Page' },
  { value: 'blog', label: 'Blog' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'ecommerce', label: 'E-commerce' },
]

export function SaveTemplateDialog({
  open,
  onOpenChange,
  pageId,
  pageTitle,
  onSaved,
}: SaveTemplateDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TemplateCategory>('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async () => {
    // Reset errors
    setErrors({})

    // Validate
    if (!name.trim()) {
      setErrors({ name: 'Template name is required' })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createTemplateFromPage(
        pageId,
        name.trim(),
        description.trim() || undefined,
        category
      )

      if (result.success) {
        toast.success(result.message || 'Template saved successfully')
        handleClose()
        onSaved?.()
      } else {
        toast.error(result.message || 'Failed to save template')
      }
    } catch (error) {
      toast.error('An error occurred while saving template')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setCategory('general')
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            Save as Template
          </DialogTitle>
          <DialogDescription>
            Save the current page structure as a reusable template. This will capture all blocks and their settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Source page info */}
          <div className="rounded-lg bg-muted/50 p-3 flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Source Page</p>
              <p className="text-sm text-muted-foreground">{pageTitle}</p>
            </div>
          </div>

          {/* Template name */}
          <div className="space-y-2">
            <Label htmlFor="template-name">
              Template Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="template-name"
              placeholder="e.g., About Us Template"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              placeholder="Describe what this template is best used for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as TemplateCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
