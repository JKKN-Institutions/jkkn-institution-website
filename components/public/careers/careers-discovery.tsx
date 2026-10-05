import Link from 'next/link'
import { ArrowRight, Briefcase, Building2, GraduationCap, Star, Stethoscope, type LucideIcon } from 'lucide-react'
import type { CategoryTile, PopularSearch } from '@/lib/services/public-careers-search'

// Starting points for candidates who don't know what to type (spec §4.4).
// Both lists come from live data: a chip or tile only appears while it leads
// to at least one open job on this site.

export function PopularSearches({ items }: { items: PopularSearch[] }) {
  if (items.length === 0) return null
  return (
    <nav aria-label="Popular searches" className="mt-5">
      <h2 className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Popular searches</h2>
      {/* One scrollable row on phones, wrapped and centred from sm up. */}
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        {items.map(item => (
          <li key={item.label} className="shrink-0">
            <Link
              href={item.href}
              scroll={false}
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  teaching_faculty: GraduationCap,
  non_teaching: Building2,
  senior_leadership: Star,
  medical: Stethoscope,
}

export function CareerCategories({ items }: { items: CategoryTile[] }) {
  if (items.length < 2) return null
  return (
    <section aria-labelledby="careers-categories-heading" className="mt-10">
      <h2 id="careers-categories-heading" className="mb-4 text-lg font-semibold text-foreground sm:text-xl">Explore opportunities</h2>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map(item => {
          const Icon = CATEGORY_ICONS[item.value] ?? Briefcase
          return (
            <li key={item.value}>
              <Link
                href={item.href}
                scroll={false}
                className="group flex h-full flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 transition-all sm:flex-row sm:items-center sm:gap-3 hover:border-primary/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground">{item.label}</span>
                  <span className="block text-sm text-muted-foreground">{item.count} {item.count === 1 ? 'opening' : 'openings'}</span>
                </span>
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 sm:block" aria-hidden="true" />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
