import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Newspaper, Edit, Eye, Clock, MessageSquare, Star, Pin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getBlogPost, getBlogPostVersions } from '@/app/actions/cms/blog'
import { format } from 'date-fns'
import Image from 'next/image'

interface BlogPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params
  const post = await getBlogPost(id)

  if (!post) {
    notFound()
  }

  const versions = await getBlogPostVersions(id)

  const getStatusColor = (status: string | null) => {
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
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<Newspaper className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title={post.title}
        description={post.excerpt || 'No excerpt'}
        badge="Blog"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            {post.status === 'published' && (
              <Button asChild variant="outline" className="min-h-[44px]">
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  View Live
                </Link>
              </Button>
            )}
            <Button asChild className="bg-primary hover:bg-primary/90 min-h-[44px]">
              <Link href={`/admin/content/blog/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Post
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {post.featured_image && (
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Content Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {post.content ? (
                  <pre className="text-sm bg-muted/50 p-4 rounded-lg overflow-auto max-h-96">
                    {JSON.stringify(post.content, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground">No content yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Version History */}
          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
            </CardHeader>
            <CardContent>
              {versions.length > 0 ? (
                <div className="space-y-4">
                  {versions.slice(0, 5).map((version) => (
                    <div
                      key={version.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">v{version.version_number}</Badge>
                          <span className="text-sm font-medium">{version.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {version.snapshot_type} •{' '}
                          {format(new Date(version.created_at!), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Restore
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No versions yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={`capitalize ${getStatusColor(post.status)}`}>
                  {post.status || 'draft'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Visibility</span>
                <Badge variant="outline" className="capitalize">
                  {post.visibility || 'public'}
                </Badge>
              </div>
              {post.is_featured && (
                <div className="flex items-center gap-2 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm">Featured Post</span>
                </div>
              )}
              {post.is_pinned && (
                <div className="flex items-center gap-2 text-primary">
                  <Pin className="h-4 w-4" />
                  <span className="text-sm">Pinned Post</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meta Info */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Slug</span>
                <span className="text-sm font-mono">/{post.slug}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reading Time</span>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  {post.reading_time_minutes || 5} min
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Views</span>
                <span className="text-sm">{post.view_count || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Comments</span>
                <div className="flex items-center gap-1 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  {post.allow_comments ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Taxonomy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">Category</span>
                {post.category ? (
                  <Badge
                    variant="outline"
                    className="ml-2"
                    style={{ borderColor: post.category.color || undefined }}
                  >
                    {post.category.name}
                  </Badge>
                ) : (
                  <span className="ml-2 text-sm text-muted-foreground">None</span>
                )}
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Tags</span>
                {post.tags && post.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        style={{ borderColor: tag.color || undefined }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="ml-2 text-sm text-muted-foreground">None</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Author */}
          {post.author && (
            <Card>
              <CardHeader>
                <CardTitle>Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {post.author.avatar_url ? (
                    <Image
                      src={post.author.avatar_url}
                      alt={post.author.full_name || 'Author'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary">
                        {(post.author.full_name || post.author.email)[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{post.author.full_name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{post.author.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {post.published_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span>{format(new Date(post.published_at), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
              {post.created_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{format(new Date(post.created_at), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
              {post.updated_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{format(new Date(post.updated_at), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
