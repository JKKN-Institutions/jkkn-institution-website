import { notFound } from 'next/navigation'
import { getPageById, getParentPageOrder } from '@/app/actions/cms/pages'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  Globe,
  EyeOff,
  Calendar,
  Clock,
  Layers,
  Search,
} from 'lucide-react'
import { format } from 'date-fns'
import { PageDetailHeader } from '@/components/cms/page-detail-header'

interface PageDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageDetailPageProps) {
  const { id } = await params
  const page = await getPageById(id)

  return {
    title: page ? `${page.title} | Page Details | JKKN Admin` : 'Page Details | JKKN Admin',
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'draft':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    case 'archived':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
  }
}

const getVisibilityIcon = (visibility: string) => {
  switch (visibility) {
    case 'public':
      return <Globe className="h-4 w-4" />
    case 'private':
      return <EyeOff className="h-4 w-4" />
    default:
      return <Globe className="h-4 w-4" />
  }
}

export default async function PageDetailPage({ params }: PageDetailPageProps) {
  const { id } = await params
  const page = await getPageById(id)

  if (!page) {
    notFound()
  }

  // Fetch parent's sort_order if this is a child page
  const parentOrder = await getParentPageOrder(page.parent_id)

  const blockCount = page.cms_page_blocks?.length || 0
  const seoScore = page.cms_seo_metadata?.[0]?.seo_score

  return (
    <div className="space-y-6">
      {/* Header with Glassmorphism */}
      <PageDetailHeader page={page} parentOrder={parentOrder} />

      {/* Page Details Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Status Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className={getStatusColor(page.status)}>
                {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
              </Badge>
              <div className="flex items-center gap-1 text-muted-foreground">
                {getVisibilityIcon(page.visibility)}
                <span className="text-sm capitalize">{page.visibility}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blocks Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Content Blocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <span className="text-2xl font-semibold">{blockCount}</span>
              <span className="text-muted-foreground">blocks</span>
            </div>
          </CardContent>
        </Card>

        {/* SEO Score Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SEO Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              {seoScore !== null && seoScore !== undefined ? (
                <>
                  <span
                    className={`text-2xl font-semibold ${
                      seoScore >= 80
                        ? 'text-green-600'
                        : seoScore >= 50
                          ? 'text-amber-600'
                          : 'text-red-600'
                    }`}
                  >
                    {seoScore}%
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">Not analyzed</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Page Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Page Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Title</label>
              <p className="text-foreground">{page.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Slug</label>
              <p className="text-foreground font-mono text-sm">/{page.slug}</p>
            </div>
            {page.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-foreground">{page.description}</p>
              </div>
            )}
            <div className="flex items-center gap-4">
              {page.is_homepage && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Homepage
                </Badge>
              )}
              {page.show_in_navigation && (
                <Badge variant="secondary" className="bg-secondary/50">
                  In Navigation
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-foreground">
                  {page.created_at
                    ? format(new Date(page.created_at), 'MMMM d, yyyy h:mm a')
                    : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-foreground">
                  {page.updated_at
                    ? format(new Date(page.updated_at), 'MMMM d, yyyy h:mm a')
                    : '-'}
                </p>
              </div>
            </div>
            {page.published_at && (
              <div className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Published</label>
                  <p className="text-foreground">
                    {format(new Date(page.published_at), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SEO Metadata */}
      {page.cms_seo_metadata && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              SEO Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Meta Title</label>
              <p className="text-foreground">
                {page.cms_seo_metadata?.[0]?.meta_title || page.title}
              </p>
            </div>
            {page.cms_seo_metadata?.[0]?.meta_description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Meta Description
                </label>
                <p className="text-foreground">{page.cms_seo_metadata[0].meta_description}</p>
              </div>
            )}
            {page.cms_seo_metadata?.[0]?.og_image && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">OG Image</label>
                <p className="text-foreground font-mono text-sm break-all">
                  {page.cms_seo_metadata[0].og_image}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
