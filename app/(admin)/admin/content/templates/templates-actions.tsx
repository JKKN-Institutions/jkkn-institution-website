'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { ImageToPageDialog } from '@/components/cms/image-to-page-dialog'

export function TemplatesActions() {
  const [imageToPageOpen, setImageToPageOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={() => setImageToPageOpen(true)}
          className="w-full sm:w-auto min-h-[44px] gap-2"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Image to Page</span>
          <span className="sm:hidden">AI Generate</span>
        </Button>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 shadow-brand w-full sm:w-auto min-h-[44px]"
        >
          <Link href="/admin/content/templates/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Link>
        </Button>
      </div>

      <ImageToPageDialog
        open={imageToPageOpen}
        onOpenChange={setImageToPageOpen}
      />
    </>
  )
}
