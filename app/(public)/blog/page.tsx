import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPublishedBlogPosts } from '@/app/actions/cms/blog'
import { getBlogCategories } from '@/app/actions/cms/blog-categories'
import { getPopularBlogTags } from '@/app/actions/cms/blog-tags'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Search, Tag, Folder } from 'lucide-react'
import { getBreadcrumbsForPath, generateBreadcrumbSchema, serializeSchema } from '@/lib/seo'

// Generate metadata with breadcrumb schema
export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'
  const breadcrumbs = getBreadcrumbsForPath('/blog')
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)

  return {
    title: 'Blog | JKKN Institution',
    description: 'Read the latest news, insights, and updates from JKKN Institution.',
    alternates: {
      canonical: `${siteUrl}/blog`,
    },
    openGraph: {
      title: 'Blog | JKKN Institution',
      description: 'Read the latest news, insights, and updates from JKKN Institution.',
      type: 'website',
      url: `${siteUrl}/blog`,
    },
    other: {
      'script:ld+json:breadcrumb': serializeSchema(breadcrumbSchema),
    },
  }
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string; tag?: string; search?: string }>
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Blog Post Card Component
function BlogPostCard({ post }: { post: {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  published_at: string | null
  reading_time_minutes: number | null
  view_count: number | null
  category?: { id: string; name: string; slug: string; color: string | null } | null
  author?: { id: string; full_name: string | null; avatar_url: string | null } | null
} }) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 bg-white border-border/50">
      {/* Featured Image */}
      <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary/20">
              {post.title[0].toUpperCase()}
            </span>
          </div>
        )}
        {post.category && (
          <Badge
            className="absolute top-3 left-3"
            style={{ backgroundColor: post.category.color || undefined }}
          >
            {post.category.name}
          </Badge>
        )}
      </Link>

      <CardHeader className="pb-2">
        <Link href={`/blog/${post.slug}`}>
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </Link>
        {post.excerpt && (
          <CardDescription className="line-clamp-2 mt-1">
            {post.excerpt}
          </CardDescription>
        )}
      </CardHeader>

      <CardFooter className="pt-0 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          {post.author && (
            <div className="flex items-center gap-1.5">
              {post.author.avatar_url ? (
                <Image
                  src={post.author.avatar_url}
                  alt={post.author.full_name || 'Author'}
                  width={20}
                  height={20}
                  className="rounded-full"
                  quality={50}
                />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span className="truncate max-w-[100px]">{post.author.full_name || 'Author'}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(post.published_at)}</span>
          </div>
          {post.reading_time_minutes && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.reading_time_minutes} min</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

// Sidebar Component
async function BlogSidebar() {
  const [categories, tags] = await Promise.all([
    getBlogCategories({ includeInactive: false }),
    getPopularBlogTags(15),
  ])

  return (
    <aside className="space-y-6">
      {/* Search */}
      <Card className="bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/blog" method="GET">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search posts..."
                className="pl-9"
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Categories */}
      {categories.length > 0 && (
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/blog/category/${category.slug}`}
                    className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {category.color && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      {category.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {category.post_count || 0}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Popular Tags */}
      {tags.length > 0 && (
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Popular Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                  <Badge
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    style={{ borderColor: tag.color || undefined }}
                  >
                    {tag.name}
                    {tag.usage_count && tag.usage_count > 0 && (
                      <span className="ml-1 text-xs opacity-70">({tag.usage_count})</span>
                    )}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </aside>
  )
}

// Main Blog List Component
async function BlogList({
  page,
  categorySlug,
  tagSlug,
  search
}: {
  page: number
  categorySlug?: string
  tagSlug?: string
  search?: string
}) {
  const { data: posts, total, totalPages } = await getPublishedBlogPosts({
    page,
    limit: 9,
    category_slug: categorySlug,
    tag_slug: tagSlug,
    search,
  })

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-2">No posts found</h2>
        <p className="text-muted-foreground mb-4">
          {search
            ? `No posts matching "${search}"`
            : categorySlug
              ? 'No posts in this category yet.'
              : tagSlug
                ? 'No posts with this tag yet.'
                : 'No blog posts have been published yet.'}
        </p>
        {(search || categorySlug || tagSlug) && (
          <Button asChild variant="outline">
            <Link href="/blog">View all posts</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            asChild={page > 1}
          >
            {page > 1 ? (
              <Link href={`/blog?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </>
            )}
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? 'default' : 'outline'}
                size="sm"
                asChild={pageNum !== page}
                className="min-w-[36px]"
              >
                {pageNum !== page ? (
                  <Link href={`/blog?page=${pageNum}${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}>
                    {pageNum}
                  </Link>
                ) : (
                  pageNum
                )}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            asChild={page < totalPages}
          >
            {page < totalPages ? (
              <Link href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Results Count */}
      <p className="text-center text-sm text-muted-foreground">
        Showing {posts.length} of {total} posts
      </p>
    </div>
  )
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const page = params.page ? parseInt(params.page) : 1
  const categorySlug = params.category
  const tagSlug = params.tag
  const search = params.search

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest news, insights, and stories from JKKN Institution
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              {/* Active Filters */}
              {(categorySlug || tagSlug || search) && (
                <div className="mb-6 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Filtering by:</span>
                  {search && (
                    <Badge variant="secondary" className="gap-1">
                      Search: &quot;{search}&quot;
                      <Link href={`/blog${categorySlug ? `?category=${categorySlug}` : ''}`} className="ml-1 hover:text-destructive">
                        &times;
                      </Link>
                    </Badge>
                  )}
                  {categorySlug && (
                    <Badge variant="secondary" className="gap-1">
                      Category: {categorySlug}
                      <Link href={`/blog${search ? `?search=${search}` : ''}`} className="ml-1 hover:text-destructive">
                        &times;
                      </Link>
                    </Badge>
                  )}
                  {tagSlug && (
                    <Badge variant="secondary" className="gap-1">
                      Tag: {tagSlug}
                      <Link href="/blog" className="ml-1 hover:text-destructive">
                        &times;
                      </Link>
                    </Badge>
                  )}
                  <Link href="/blog" className="text-sm text-primary hover:underline ml-2">
                    Clear all
                  </Link>
                </div>
              )}

              <Suspense fallback={<BlogListSkeleton />}>
                <BlogList
                  page={page}
                  categorySlug={categorySlug}
                  tagSlug={tagSlug}
                  search={search}
                />
              </Suspense>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <Suspense fallback={<SidebarSkeleton />}>
                <BlogSidebar />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Loading Skeletons
function BlogListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-video bg-muted animate-pulse" />
          <CardHeader>
            <div className="h-5 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          </CardHeader>
          <CardFooter>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="h-5 bg-muted rounded animate-pulse w-20" />
        </CardHeader>
        <CardContent>
          <div className="h-10 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-5 bg-muted rounded animate-pulse w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
