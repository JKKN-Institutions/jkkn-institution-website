/**
 * shadcn/ui Components Library Page
 *
 * Browse all 257 shadcn/ui components with categorization,
 * search, and detailed view.
 */

import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { Blocks, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getCategorizedComponents, CATEGORIES } from './categories'
import { ShadcnBrowser } from './shadcn-browser'
import { Badge } from '@/components/ui/badge'

export default function ShadcnComponentsPage() {
  // Get all categorized components
  const components = getCategorizedComponents()

  // Get category stats
  const categoryStats = CATEGORIES.map((category) => ({
    ...category,
    count: components.filter((c) => c.category.id === category.id).length,
  })).filter((c) => c.count > 0)

  return (
    <div className="container py-6 space-y-6">
      <ResponsivePageHeader
        icon={<Blocks className="h-6 w-6 text-primary" />}
        title="shadcn/ui Library"
        description={`Browse ${components.length} beautifully designed components`}
        badge="Built-in"
        actions={
          <Link
            href="/admin/content/components/browse"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Libraries
          </Link>
        }
      />

      {/* Library Info */}
      <div className="flex items-center gap-4 p-4 rounded-xl border bg-card">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
          S
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">shadcn/ui</span>
            <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
              Official
            </Badge>
          </div>
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            https://ui.shadcn.com
          </a>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <div>{components.length} components</div>
          <div>{categoryStats.length} categories</div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categoryStats.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card/50"
          >
            <div
              className={`h-8 w-8 rounded-md flex items-center justify-center bg-gradient-to-br ${category.gradient}`}
            >
              <span className="text-white text-xs font-bold">
                {category.count}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{category.name}</p>
              <p className="text-xs text-muted-foreground">{category.count} components</p>
            </div>
          </div>
        ))}
      </div>

      {/* Component Browser */}
      <div className="rounded-xl border bg-card p-6">
        <ShadcnBrowser components={components} />
      </div>
    </div>
  )
}
