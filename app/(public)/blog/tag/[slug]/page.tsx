import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getBlogTagBySlug } from '@/app/actions/cms/blog-tags'

interface TagPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = await getBlogTagBySlug(slug)

  if (!tag) {
    return { title: 'Tag Not Found | JKKN Blog' }
  }

  return {
    title: `Posts tagged "${tag.name}" | JKKN Blog`,
    description: tag.description || `Browse all posts tagged with ${tag.name}`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const tag = await getBlogTagBySlug(slug)

  if (!tag) {
    redirect('/blog')
  }

  // Redirect to main blog page with tag filter
  redirect(`/blog?tag=${slug}`)
}
