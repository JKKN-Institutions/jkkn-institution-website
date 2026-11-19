// lib/blog/myjkkn.ts
//
// Blog posts read from MyJKKN (Website Blog) instead of this site's own
// `blog_posts` table. On only when BLOG_SOURCE=myjkkn AND BLOG_SITE_KEY is set
// (`main` on www.jkkn.ac.in, `engineering` on engg.jkkn.ac.in), so the
// switch-over is one setting per deployment and can be undone the same way.
//
// Server-only — import from Server Components, server actions and route
// handlers, never from a 'use client' file (the comment form gets the API
// address and site key as props instead).
//
// The API is keyless and returns only what is published on this website:
//   GET  {MYJKKN}/api/public/blog/posts?site=<key>[&category=&tag=&page=&limit=]
//   GET  {MYJKKN}/api/public/blog/posts/<slug>?site=<key>[&preview=<token>]
//   POST {MYJKKN}/api/public/blog/comments
// Rows are mapped to the shapes the existing blog pages already use
// (BlogPostWithRelations, BlogCategory, BlogTag), so the page markup does not
// change. Contract: MyJKKN docs/public-blog-api.md

import { cache } from 'react'
import type { BlogPostWithRelations } from '@/app/actions/cms/blog'
import type { BlogCategory } from '@/app/actions/cms/blog-categories'
import type { BlogTag } from '@/app/actions/cms/blog-tags'
import { getMyJkknBaseUrl } from '@/lib/services/public-careers-api'

export const BLOG_CACHE_TAG = 'myjkkn-blog'
const REVALIDATE_SECONDS = 300
const TIMEOUT_MS = 8000
const MAX_LIMIT = 50

// Env reads are function-level so the module is safe to import in tests/CLIs.

/** This website's key in MyJKKN (`main` or `engineering`); '' when not set. */
export function blogSiteKey(): string {
  return process.env.BLOG_SITE_KEY?.trim() || ''
}

/** True when the public blog reads from MyJKKN. Either setting missing = this site's own tables, as before. */
export function blogFromMyJkkn(): boolean {
  return process.env.BLOG_SOURCE === 'myjkkn' && blogSiteKey() !== ''
}

function blogApi(): string {
  return `${getMyJkknBaseUrl()}/api/public/blog`
}

/** Where the comment form posts to (handed to the client component as a prop). */
export function blogCommentsUrl(): string {
  return `${blogApi()}/comments`
}

/** Where posts are written now (linked from the admin notice). */
export function myJkknBlogAdminUrl(): string {
  return `${getMyJkknBaseUrl()}/website/blog`
}

interface ApiCategory {
  name: string
  slug: string
  description?: string | null
  color: string | null
}

interface ApiPost {
  id: string
  slug: string
  url: string
  title: string
  excerpt: string | null
  cover_image: { url: string; alt: string } | null
  author_name: string | null
  read_time_minutes: number | null
  tags: string[]
  category: ApiCategory | null
  published_at: string | null
  updated_at: string
  is_featured: boolean
  is_pinned: boolean
  allow_comments: boolean
  seo: {
    title: string
    description: string | null
    keywords: string[]
    og_image: string | null
    canonical_url: string
    noindex: boolean
  }
  content_html?: string
}

/** A MyJKKN post in the shape the blog pages were written for (the old `blog_posts` row). */
export interface MyJkknPost extends BlogPostWithRelations {
  /** The writer asked search engines not to list this post. */
  noindex: boolean
}

/** An approved comment, in the shape the comments list renders. */
export interface MyJkknComment {
  id: string
  author_name: string
  author_avatar: string | null
  content: string
  created_at: string
}

/** A tag in MyJKKN is plain text; its "slug" here is that text, URL-encoded for /blog/tag/<slug>. */
function toTag(tag: string): NonNullable<BlogPostWithRelations['tags']>[number] {
  return { id: tag, name: tag, slug: encodeURIComponent(tag), color: null }
}

function toSitePost(p: ApiPost): MyJkknPost {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    // Already sanitised by MyJKKN; rendered by the same branch as the old `content.html`.
    content: { type: 'html', html: p.content_html ?? '' },
    featured_image: p.cover_image?.url ?? null,
    category_id: null,
    // MyJKKN gives a display name only: no author profile, avatar or co-authors.
    author_id: '',
    co_authors: null,
    status: 'published',
    visibility: 'public',
    password_hash: null,
    published_at: p.published_at,
    scheduled_at: null,
    reading_time_minutes: p.read_time_minutes,
    // MyJKKN keeps no view count.
    view_count: null,
    is_featured: p.is_featured ?? null,
    is_pinned: p.is_pinned ?? null,
    allow_comments: p.allow_comments,
    seo_title: p.seo.title,
    seo_description: p.seo.description,
    seo_keywords: p.seo.keywords ?? [],
    og_image: p.seo.og_image,
    canonical_url: p.seo.canonical_url,
    metadata: null,
    created_by: null,
    updated_by: null,
    created_at: p.published_at ?? p.updated_at,
    updated_at: p.updated_at,
    category: p.category
      ? { id: p.category.slug, name: p.category.name, slug: p.category.slug, color: p.category.color }
      : null,
    author: p.author_name
      ? { id: '', full_name: p.author_name, email: '', avatar_url: null }
      : null,
    tags: (p.tags ?? []).map(toTag),
    noindex: p.seo.noindex === true,
  }
}

function cached() {
  return { next: { revalidate: REVALIDATE_SECONDS, tags: [BLOG_CACHE_TAG] } }
}

export interface ListPostsOptions {
  page?: number
  limit?: number
  /** A category slug from `categories`. */
  category?: string
  /** The exact tag text. */
  tag?: string
}

export interface ListPostsResult {
  posts: MyJkknPost[]
  total: number
  categories: ApiCategory[]
}

/**
 * Published posts, pinned first then newest first. Never throws: a MyJKKN
 * outage shows an empty blog list instead of an error page, and keeps the
 * build and the sitemap working.
 */
export async function listPosts(options: ListPostsOptions = {}): Promise<ListPostsResult> {
  const page = Math.max(1, Math.floor(options.page || 1))
  const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(options.limit || 12)))
  try {
    const url = new URL(`${blogApi()}/posts`)
    url.searchParams.set('site', blogSiteKey())
    if (options.category) url.searchParams.set('category', options.category)
    if (options.tag) url.searchParams.set('tag', options.tag)
    url.searchParams.set('page', String(page))
    url.searchParams.set('limit', String(limit))
    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      ...cached(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const body = (await res.json()) as { posts?: ApiPost[]; total?: number; categories?: ApiCategory[] }
    return {
      posts: (body.posts ?? []).map(toSitePost),
      total: body.total ?? 0,
      categories: body.categories ?? [],
    }
  } catch (error) {
    console.error('[blog] failed to load posts from MyJKKN:', error)
    return { posts: [], total: 0, categories: [] }
  }
}

/** Every published post (sitemap, search, sidebar counts). Never throws. */
export async function listAllPosts(): Promise<MyJkknPost[]> {
  const all: MyJkknPost[] = []
  for (let page = 1; page <= 40; page++) {
    const { posts, total } = await listPosts({ limit: MAX_LIMIT, page })
    all.push(...posts)
    if (posts.length === 0 || all.length >= total) break
  }
  return all
}

/**
 * This website's blog categories with how many published posts each has
 * (the API gives the categories; the count is taken from the posts). Never throws.
 */
export async function listCategories(): Promise<BlogCategory[]> {
  const [{ categories }, posts] = await Promise.all([listPosts({ limit: 1 }), listAllPosts()])
  return categories.map((c, index) => ({
    id: c.slug,
    name: c.name,
    slug: c.slug,
    description: c.description ?? null,
    parent_id: null,
    icon: null,
    color: c.color,
    sort_order: index,
    is_active: true,
    post_count: posts.filter((p) => p.category?.slug === c.slug).length,
    category_type: 'blog' as const,
    created_at: null,
    updated_at: null,
  }))
}

/** The tags used most on published posts (MyJKKN has no tag list of its own). Never throws. */
export async function listPopularTags(limit: number): Promise<BlogTag[]> {
  const counts = new Map<string, number>()
  for (const post of await listAllPosts()) {
    for (const tag of post.tags ?? []) counts.set(tag.name, (counts.get(tag.name) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, usage]) => ({
      id: name,
      name,
      slug: encodeURIComponent(name),
      description: null,
      color: null,
      usage_count: usage,
      created_at: null,
    }))
}

export interface PostDetail {
  post: MyJkknPost
  related: MyJkknPost[]
  /** Approved comments only, newest first (the order this site has always shown). */
  comments: MyJkknComment[]
  /** true when this is a draft opened with its preview link. */
  preview: boolean
}

/**
 * One post, or null when it is not published on this website. A preview token
 * (from the Preview button in MyJKKN) opens a draft and is never cached.
 * Throws on a server or network error so a cached page stays up.
 */
export const getPost = cache(async (slug: string, previewToken?: string): Promise<PostDetail | null> => {
  const url =
    `${blogApi()}/posts/${encodeURIComponent(slug)}?site=${encodeURIComponent(blogSiteKey())}` +
    (previewToken ? `&preview=${encodeURIComponent(previewToken)}` : '')
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    ...(previewToken ? { cache: 'no-store' as const } : cached()),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (res.status === 404 || res.status === 400) return null
  if (!res.ok) throw new Error(`[blog] post ${slug}: HTTP ${res.status}`)
  const body = (await res.json()) as {
    post: ApiPost
    related?: ApiPost[]
    comments?: Array<{ id: string; author_name: string; content: string; created_at: string }>
    preview?: boolean
  }
  const preview = body.preview === true
  return {
    post: { ...toSitePost(body.post), status: preview ? 'draft' : 'published' },
    related: (body.related ?? []).map(toSitePost),
    comments: (body.comments ?? []).map((c) => ({ ...c, author_avatar: null })).reverse(),
    preview,
  }
})

/** A route param or query value as plain text (`AI%20tools` -> `AI tools`); unchanged when not encoded. */
export function decodeTag(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
