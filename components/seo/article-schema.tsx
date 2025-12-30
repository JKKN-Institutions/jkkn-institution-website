/**
 * Article JSON-LD Schema Component
 *
 * This component renders structured data for blog articles.
 * Enables rich snippets in search results with author, date, and image.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 */

import type { BlogPostWithRelations } from '@/app/actions/cms/blog'

interface ArticleSchemaProps {
  post: BlogPostWithRelations
  wordCount?: number
}

/**
 * Estimate word count from content
 */
function estimateWordCount(content: Record<string, unknown> | null): number {
  if (!content) return 0

  const extractText = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const n = node as Record<string, unknown>
    if (n.text && typeof n.text === 'string') return n.text
    if (Array.isArray(n.content)) {
      return n.content.map(extractText).join(' ')
    }
    return ''
  }

  const text = extractText(content)
  return text.split(/\s+/).filter(Boolean).length
}

export function ArticleSchema({ post, wordCount }: ArticleSchemaProps) {
  const baseUrl = 'https://jkkn.ac.in'
  const articleUrl = `${baseUrl}/blog/${post.slug}`

  // Calculate word count if not provided
  const calculatedWordCount = wordCount || estimateWordCount(post.content)

  // Build the schema
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${articleUrl}#article`,
    headline: post.title,
    description: post.excerpt || post.seo_description || undefined,
    url: articleUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: {
      '@type': 'Person',
      name: post.author?.full_name || 'JKKN Editorial Team',
      url: baseUrl,
    },
    publisher: {
      '@type': 'EducationalOrganization',
      '@id': `${baseUrl}/#organization`,
      name: 'JKKN Institutions',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
        width: 600,
        height: 60,
      },
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': `${baseUrl}/blog#blog`,
      name: 'JKKN Blog',
      url: `${baseUrl}/blog`,
    },
    inLanguage: 'en-IN',
    copyrightHolder: {
      '@type': 'Organization',
      name: 'JKKN Institutions',
    },
    copyrightYear: new Date(post.published_at || post.created_at || Date.now()).getFullYear(),
  }

  // Add featured image if available
  if (post.featured_image) {
    schema.image = {
      '@type': 'ImageObject',
      url: post.featured_image,
      caption: post.title,
    }
    schema.thumbnailUrl = post.featured_image
  }

  // Add word count and reading time
  if (calculatedWordCount > 0) {
    schema.wordCount = calculatedWordCount
    // Assuming average reading speed of 200 words per minute
    schema.timeRequired = `PT${Math.max(1, Math.ceil(calculatedWordCount / 200))}M`
  }

  // Add reading time from database if available
  if (post.reading_time_minutes) {
    schema.timeRequired = `PT${post.reading_time_minutes}M`
  }

  // Add category as article section
  if (post.category) {
    schema.articleSection = post.category.name
    schema.genre = post.category.name
  }

  // Add keywords/tags
  if (post.tags && post.tags.length > 0) {
    schema.keywords = post.tags.map((tag) => tag.name).join(', ')
  }

  // Add SEO keywords
  if (post.seo_keywords && post.seo_keywords.length > 0) {
    schema.keywords = schema.keywords
      ? `${schema.keywords}, ${post.seo_keywords.join(', ')}`
      : post.seo_keywords.join(', ')
  }

  // Add interactive count for comments
  if (post.allow_comments) {
    schema.interactionStatistic = [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/CommentAction',
        userInteractionCount: 0, // Would need to fetch actual count
      },
    ]
  }

  // Add view count if available
  if (post.view_count && post.view_count > 0) {
    const stats = (schema.interactionStatistic as unknown[]) || []
    stats.push({
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/ReadAction',
      userInteractionCount: post.view_count,
    })
    schema.interactionStatistic = stats
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
