'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { BlogPostsGridProps, BlogPost } from '@/lib/cms/registry-types'
import { Calendar, User, Clock, Tag, ArrowRight, BookOpen } from 'lucide-react'
import { format, parseISO } from 'date-fns'

// Single blog post card
function BlogPostCard({
  post,
  layout,
  showExcerpt,
  showAuthor,
  showDate,
  showCategory,
}: {
  post: BlogPost
  layout: 'grid' | 'list' | 'featured'
  showExcerpt: boolean
  showAuthor: boolean
  showDate: boolean
  showCategory: boolean
}) {
  const publishDate = post.date ? parseISO(post.date) : new Date()

  if (layout === 'list') {
    return (
      <article className="flex gap-4 md:gap-6 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow group">
        {/* Thumbnail */}
        {post.image && (
          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2 flex-wrap">
            {showCategory && post.category && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary font-medium rounded">
                {post.category}
              </span>
            )}
            {showDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(publishDate, 'MMM d, yyyy')}
              </span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.link ? (
              <Link href={post.link}>{post.title}</Link>
            ) : (
              post.title
            )}
          </h3>

          {/* Excerpt */}
          {showExcerpt && post.excerpt && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 hidden md:block">
              {post.excerpt}
            </p>
          )}

          {/* Author & Tags */}
          <div className="mt-auto pt-2 flex items-center justify-between">
            {showAuthor && post.author && (
              <div className="flex items-center gap-2">
                {post.authorImage ? (
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">{post.author}</span>
              </div>
            )}
            {post.link && (
              <Link
                href={post.link}
                className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                Read <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </article>
    )
  }

  if (layout === 'featured') {
    return (
      <article className="relative overflow-hidden rounded-xl group">
        {/* Background Image */}
        <div className="aspect-[16/9] md:aspect-[21/9] bg-muted">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <BookOpen className="h-16 w-16 text-primary/30" />
            </div>
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-white/80 mb-3 flex-wrap">
            {showCategory && post.category && (
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm font-medium rounded">
                {post.category}
              </span>
            )}
            {showDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(publishDate, 'MMMM d, yyyy')}
              </span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary-foreground/90 transition-colors">
            {post.link ? (
              <Link href={post.link}>{post.title}</Link>
            ) : (
              post.title
            )}
          </h3>

          {/* Excerpt */}
          {showExcerpt && post.excerpt && (
            <p className="text-white/80 line-clamp-2 max-w-2xl hidden md:block">
              {post.excerpt}
            </p>
          )}

          {/* Author & CTA */}
          <div className="flex items-center justify-between mt-4">
            {showAuthor && post.author && (
              <div className="flex items-center gap-2">
                {post.authorImage ? (
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="text-sm">{post.author}</span>
              </div>
            )}
            {post.link && (
              <Link
                href={post.link}
                className="px-4 py-2 bg-white text-foreground font-medium rounded-lg flex items-center gap-2 hover:bg-white/90 transition-colors"
              >
                Read Article <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </article>
    )
  }

  // Grid layout (default)
  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Thumbnail */}
      <div className="aspect-video bg-muted overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <BookOpen className="h-10 w-10 text-primary/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
          {showCategory && post.category && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary font-medium rounded">
              {post.category}
            </span>
          )}
          {showDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(publishDate, 'MMM d, yyyy')}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {post.link ? (
            <Link href={post.link}>{post.title}</Link>
          ) : (
            post.title
          )}
        </h3>

        {/* Excerpt */}
        {showExcerpt && post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded flex items-center gap-1"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            {showAuthor && post.author && (
              <div className="flex items-center gap-2">
                {post.authorImage ? (
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground">{post.author}</span>
              </div>
            )}
            {post.readTime && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            )}
          </div>
          {post.link && (
            <Link
              href={post.link}
              className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              Read <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

export default function BlogPostsGrid({
  title = 'Latest News',
  posts = [],
  layout = 'grid',
  columns = 3,
  showExcerpt = true,
  showAuthor = true,
  showDate = true,
  showCategory = true,
  maxItems = 6,
  categoryFilter,
  showViewAll = true,
  viewAllLink = '/blog',
  className,
}: BlogPostsGridProps) {
  // Filter and sort posts
  const filteredPosts = posts
    .filter((post) => {
      if (categoryFilter && post.category !== categoryFilter) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      const dateA = a.date ? parseISO(a.date) : new Date()
      const dateB = b.date ? parseISO(b.date) : new Date()
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, maxItems)

  if (filteredPosts.length === 0) {
    return (
      <div className={cn('py-12', className)}>
        {title && (
          <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
        )}
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No blog posts to display.</p>
        </div>
      </div>
    )
  }

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  // For featured layout, show first post as featured
  const featuredPost = layout === 'featured' ? filteredPosts[0] : null
  const remainingPosts = layout === 'featured' ? filteredPosts.slice(1) : filteredPosts

  return (
    <div className={cn('py-12', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {showViewAll && (
          <Link
            href={viewAllLink}
            className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-8">
          <BlogPostCard
            post={featuredPost}
            layout="featured"
            showExcerpt={showExcerpt}
            showAuthor={showAuthor}
            showDate={showDate}
            showCategory={showCategory}
          />
        </div>
      )}

      {/* Posts Grid/List */}
      {remainingPosts.length > 0 && (
        <div
          className={cn(
            layout === 'list' ? 'space-y-4' : `grid gap-6 ${gridCols[columns as keyof typeof gridCols] || gridCols[3]}`
          )}
        >
          {remainingPosts.map((post, index) => (
            <BlogPostCard
              key={post.id || index}
              post={post}
              layout={layout === 'featured' ? 'grid' : layout}
              showExcerpt={showExcerpt}
              showAuthor={showAuthor}
              showDate={showDate}
              showCategory={showCategory}
            />
          ))}
        </div>
      )}
    </div>
  )
}
