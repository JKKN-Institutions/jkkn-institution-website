import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/app/actions/cms/blog'
import { getPostComments } from '@/app/actions/cms/blog-comments'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { GlassCard } from '@/components/public/glass-card'
import {
  Calendar,
  Clock,
  ArrowLeft,
  Eye,
  Tag
} from 'lucide-react'
import { ShareButtons } from './share-buttons'
import { CommentsSection } from './comments-section'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug, false)

  if (!post) {
    return {
      title: 'Post Not Found | JKKN Institution',
    }
  }

  return {
    title: `${post.seo_title || post.title} | JKKN Blog`,
    description: post.seo_description || post.excerpt || '',
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || '',
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: post.author?.full_name ? [post.author.full_name] : undefined,
      images: post.og_image || post.featured_image ? [post.og_image || post.featured_image || ''] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || '',
      images: post.og_image || post.featured_image ? [post.og_image || post.featured_image || ''] : undefined,
    },
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Content Renderer - Renders TipTap JSON content
function ContentRenderer({ content }: { content: Record<string, unknown> }) {
  const renderNode = (node: Record<string, unknown>, index: number): React.ReactNode => {
    const type = node.type as string
    const content = node.content as Record<string, unknown>[] | undefined
    const text = node.text as string | undefined
    const marks = node.marks as { type: string; attrs?: Record<string, unknown> }[] | undefined

    switch (type) {
      case 'doc':
        return content?.map((child, i) => renderNode(child, i))

      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {content?.map((child, i) => renderNode(child, i))}
          </p>
        )

      case 'heading':
        const level = (node.attrs as { level: number })?.level || 2
        const headingClasses = {
          1: 'text-3xl font-bold mb-6 mt-8',
          2: 'text-2xl font-bold mb-4 mt-6',
          3: 'text-xl font-semibold mb-3 mt-5',
          4: 'text-lg font-semibold mb-2 mt-4',
          5: 'text-base font-medium mb-2 mt-3',
          6: 'text-sm font-medium mb-2 mt-3',
        }
        const headingClass = headingClasses[level as keyof typeof headingClasses]
        const headingChildren = content?.map((child, i) => renderNode(child, i))
        if (level === 1) return <h1 key={index} className={headingClass}>{headingChildren}</h1>
        if (level === 2) return <h2 key={index} className={headingClass}>{headingChildren}</h2>
        if (level === 3) return <h3 key={index} className={headingClass}>{headingChildren}</h3>
        if (level === 4) return <h4 key={index} className={headingClass}>{headingChildren}</h4>
        if (level === 5) return <h5 key={index} className={headingClass}>{headingChildren}</h5>
        return <h6 key={index} className={headingClass}>{headingChildren}</h6>

      case 'bulletList':
        return (
          <ul key={index} className="list-disc pl-6 mb-4 space-y-1">
            {content?.map((child, i) => renderNode(child, i))}
          </ul>
        )

      case 'orderedList':
        return (
          <ol key={index} className="list-decimal pl-6 mb-4 space-y-1">
            {content?.map((child, i) => renderNode(child, i))}
          </ol>
        )

      case 'listItem':
        return (
          <li key={index}>
            {content?.map((child, i) => renderNode(child, i))}
          </li>
        )

      case 'blockquote':
        return (
          <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
            {content?.map((child, i) => renderNode(child, i))}
          </blockquote>
        )

      case 'codeBlock':
        return (
          <pre key={index} className="bg-muted rounded-lg p-4 my-4 overflow-x-auto">
            <code className="text-sm font-mono">
              {content?.map((child, i) => renderNode(child, i))}
            </code>
          </pre>
        )

      case 'image':
        const imageAttrs = node.attrs as { src: string; alt?: string; title?: string }
        return (
          <figure key={index} className="my-6">
            <Image
              src={imageAttrs.src}
              alt={imageAttrs.alt || ''}
              width={800}
              height={450}
              className="rounded-lg w-full"
            />
            {imageAttrs.title && (
              <figcaption className="text-center text-sm text-muted-foreground mt-2">
                {imageAttrs.title}
              </figcaption>
            )}
          </figure>
        )

      case 'horizontalRule':
        return <hr key={index} className="my-8 border-border" />

      case 'text':
        let textContent: React.ReactNode = text

        // Apply marks (bold, italic, link, etc.)
        marks?.forEach((mark) => {
          switch (mark.type) {
            case 'bold':
              textContent = <strong key={index}>{textContent}</strong>
              break
            case 'italic':
              textContent = <em key={index}>{textContent}</em>
              break
            case 'link':
              const href = (mark.attrs as { href: string })?.href
              textContent = (
                <a
                  key={index}
                  href={href}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {textContent}
                </a>
              )
              break
            case 'code':
              textContent = (
                <code key={index} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                  {textContent}
                </code>
              )
              break
          }
        })

        return textContent

      default:
        return null
    }
  }

  return (
    <div className="prose prose-lg max-w-none">
      {renderNode(content, 0)}
    </div>
  )
}

// Related Posts Component
async function RelatedPosts({ postId }: { postId: string }) {
  const posts = await getRelatedBlogPosts(postId, 3)

  if (!posts || posts.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
        <span className="w-1 h-6 bg-gradient-to-b from-secondary to-secondary/50 rounded-full" />
        Related Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="overflow-hidden group rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300"
          >
            <Link href={`/blog/${post.slug}`} className="block relative aspect-video">
              {post.featured_image ? (
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </Link>
            <div className="p-4">
              <Link href={`/blog/${post.slug}`}>
                <h3 className="font-semibold text-base line-clamp-2 text-white group-hover:text-secondary transition-colors">
                  {post.title}
                </h3>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Comments Wrapper - Fetches comments and passes to collapsible CommentsSection
async function CommentsWrapper({ postId, allowComments }: { postId: string; allowComments: boolean }) {
  if (!allowComments) return null

  const comments = await getPostComments(postId)

  return (
    <CommentsSection
      postId={postId}
      comments={comments}
      allowComments={allowComments}
    />
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${slug}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-[#064d2e] relative overflow-hidden">
      {/* Floating Decorative Circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#0a8a52]/30 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-600/20 blur-3xl" />
        <div className="absolute top-2/3 left-1/2 w-80 h-80 rounded-full bg-[#0a8a52]/25 blur-3xl" />
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6 -ml-2 text-white/80 hover:text-white hover:bg-white/10">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            {/* Category */}
            {post.category && (
              <Link href={`/blog/category/${post.category.slug}`}>
                <Badge
                  className="mb-4 bg-secondary text-primary font-semibold"
                  style={{ backgroundColor: post.category.color || undefined }}
                >
                  {post.category.name}
                </Badge>
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 mb-6">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">JK</span>
                </div>
                <span className="text-white/90">JKKN ADMIN</span>
              </div>

              <Separator orientation="vertical" className="h-4 bg-white/30" />

              {/* Date */}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>

              <Separator orientation="vertical" className="h-4 bg-white/30" />

              {/* Reading Time */}
              {post.reading_time_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time_minutes} min read</span>
                </div>
              )}

              <Separator orientation="vertical" className="h-4 bg-white/30" />

              {/* Views */}
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.view_count || 0} views</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-white/60" />
                {post.tags.map((tag) => (
                  <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                    <Badge
                      variant="outline"
                      className="border-white/30 text-white/90 hover:bg-white/20 hover:text-white transition-colors"
                    >
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featured_image && (
        <section className="relative -mt-4 mb-8 z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="py-8 md:py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Content - Dark glass card matching the theme */}
            <article className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl ring-1 ring-white/20">
              <div className="prose prose-lg max-w-none prose-headings:text-white prose-p:text-white/90 prose-strong:text-white prose-a:text-secondary prose-li:text-white/90 prose-ul:text-white/90 prose-ol:text-white/90">
                <ContentRenderer content={post.content} />
              </div>
            </article>

            <Separator className="my-8 bg-white/20" />

            {/* Share Section */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <ShareButtons title={post.title} url={postUrl} />

              {/* Author Card */}
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center ring-2 ring-secondary/30">
                  <span className="text-xl font-bold text-primary">JK</span>
                </div>
                <div>
                  <p className="text-sm text-white/60">Written by</p>
                  <p className="font-semibold text-white">JKKN ADMIN</p>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <Suspense fallback={<div className="mt-12 h-16 bg-white/10 backdrop-blur-md rounded-2xl animate-pulse" />}>
              <CommentsWrapper postId={post.id} allowComments={post.allow_comments || false} />
            </Suspense>

            {/* Related Posts */}
            <Suspense fallback={<div className="mt-12 h-48 bg-white/10 rounded-lg animate-pulse" />}>
              <RelatedPosts postId={post.id} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  )
}
