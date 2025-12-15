import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getBlogCategoryBySlug } from '@/app/actions/cms/blog-categories'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getBlogCategoryBySlug(slug)

  if (!category) {
    return { title: 'Category Not Found | JKKN Blog' }
  }

  return {
    title: `${category.name} | JKKN Blog`,
    description: category.description || `Browse all posts in ${category.name}`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getBlogCategoryBySlug(slug)

  if (!category) {
    redirect('/blog')
  }

  // Redirect to main blog page with category filter
  redirect(`/blog?category=${slug}`)
}
