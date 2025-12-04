'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Eye, FileText, Settings, Sparkles } from 'lucide-react'
import { PageSettingsModal } from './page-settings-modal'

interface PageDetailHeaderProps {
  page: {
    id: string
    title: string
    slug: string
    description?: string | null
    status: string
    visibility: string
    sort_order?: number | null
    parent_id?: string | null
    show_in_navigation: boolean | null
    is_homepage: boolean | null
  }
  parentOrder?: number | null
}

export function PageDetailHeader({ page, parentOrder }: PageDetailHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const isPublished = page.status === 'published'

  return (
    <>
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hover:bg-primary/5">
              <Link href="/admin/content/pages">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="p-3 rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">{page.title}</h1>
                <span className="badge-brand">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Page
                </span>
              </div>
              <p className="text-muted-foreground">/{page.slug}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Edit Settings
            </Button>
            {isPublished && (
              <Button asChild variant="outline">
                <Link href={`/${page.slug}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  View Live
                </Link>
              </Button>
            )}
            <Button asChild className="bg-primary hover:bg-primary/90 shadow-brand">
              <Link href={`/admin/content/pages/${page.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Page
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <PageSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        page={page}
        parentOrder={parentOrder}
      />
    </>
  )
}
