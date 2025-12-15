import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/app/actions/cms/blog'
import { getPostComments } from '@/app/actions/cms/blog-comments'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Eye,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  MessageCircle,
  Tag
} from 'lucide-react'

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

// Share Buttons Component
function ShareButtons({ title, url }: { title: string; url: string }) {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Share2 className="h-4 w-4" />
        Share:
      </span>
      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          navigator.clipboard.writeText(url)
        }}
        title="Copy link"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Related Posts Component
async function RelatedPosts({ postId }: { postId: string }) {
  const posts = await getRelatedBlogPosts(postId, 3)

  if (!posts || posts.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden group">
            <Link href={`/blog/${post.slug}`} className="block relative aspect-video">
              {post.featured_image ? (
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
              )}
            </Link>
            <CardHeader className="pb-2">
              <Link href={`/blog/${post.slug}`}>
                <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

// Comments Section Component
async function CommentsSection({ postId, allowComments }: { postId: string; allowComments: boolean }) {
  if (!allowComments) return null

  const comments = await getPostComments(postId)

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        Comments ({comments.length})
      </h2>

      {comments.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  {comment.author_avatar ? (
                    <Image
                      src={comment.author_avatar}
                      alt={comment.author_name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary">
                        {comment.author_name[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-base">{comment.author_name}</CardTitle>
                    <CardDescription className="text-xs">
                      {formatDate(comment.created_at)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Comment Form - TODO: Implement client component */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Leave a Comment</CardTitle>
          <CardDescription>
            Share your thoughts on this post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Comment form coming soon. Please check back later.
          </p>
        </CardContent>
      </Card>
    </section>
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
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6 -ml-2">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            {/* Category */}
            {post.category && (
              <Link href={`/blog/category/${post.category.slug}`}>
                <Badge
                  className="mb-4"
                  style={{ backgroundColor: post.category.color || undefined }}
                >
                  {post.category.name}
                </Badge>
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-2">
                  {post.author.avatar_url ? (
                    <Image
                      src={post.author.avatar_url}
                      alt={post.author.full_name || 'Author'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span>{post.author.full_name || 'Author'}</span>
                </div>
              )}

              <Separator orientation="vertical" className="h-4" />

              {/* Date */}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>

              <Separator orientation="vertical" className="h-4" />

              {/* Reading Time */}
              {post.reading_time_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time_minutes} min read</span>
                </div>
              )}

              <Separator orientation="vertical" className="h-4" />

              {/* Views */}
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.view_count || 0} views</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                    <Badge
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      style={{ borderColor: tag.color || undefined }}
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
        <section className="relative -mt-4 mb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
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
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            <article className="prose-content">
              <ContentRenderer content={post.content} />
            </article>

            <Separator className="my-8" />

            {/* Share Section */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <ShareButtons title={post.title} url={postUrl} />

              {/* Author Card */}
              {post.author && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  {post.author.avatar_url ? (
                    <Image
                      src={post.author.avatar_url}
                      alt={post.author.full_name || 'Author'}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-medium text-primary">
                        {(post.author.full_name || 'A')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Written by</p>
                    <p className="font-medium">{post.author.full_name || 'Author'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <Suspense fallback={<div className="mt-12 h-48 bg-muted/50 rounded-lg animate-pulse" />}>
              <CommentsSection postId={post.id} allowComments={post.allow_comments || false} />
            </Suspense>

            {/* Related Posts */}
            <Suspense fallback={<div className="mt-12 h-48 bg-muted/50 rounded-lg animate-pulse" />}>
              <RelatedPosts postId={post.id} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  )
}
