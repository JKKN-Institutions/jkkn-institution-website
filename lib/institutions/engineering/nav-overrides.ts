// F2 of the engineering perception audit (user's choice 2026-11-21). The engineering menu item PLACEMENTS is a
// cms_pages row whose external_url is https://placements.jkkn.ac.in/. That group portal shows "0 Students Placed
// / 0 Recruiters" next to an unsourced "₹12 LPA highest" (read 2026-11-20), and this repo cannot edit it. The menu
// item now opens the engineering NIRF 2026 page, where the college's own placement filing is published.
// Render-time only: the cms_pages row is not edited, and a row that already points elsewhere is left alone.

export const ENGG_PLACEMENTS_HREF = '/iqac/nirf/nirf-2026'

const GROUP_PLACEMENTS_PORTAL = /^https?:\/\/placements\.jkkn\.ac\.in\/?$/i

interface NavLike {
  href: string
  external_url?: string | null
  children?: NavLike[]
}

/** Returns a new tree; the items passed in are never mutated. */
export function applyEngineeringNavOverrides<T extends NavLike>(items: T[]): T[] {
  if (!Array.isArray(items)) return items
  return items.map((item) => {
    const mapped = Array.isArray(item.children) ? applyEngineeringNavOverrides(item.children as T[]) : null
    const children =
      mapped && mapped.some((child, index) => child !== item.children?.[index]) ? mapped : item.children
    if (GROUP_PLACEMENTS_PORTAL.test(item.href ?? '')) {
      return { ...item, href: ENGG_PLACEMENTS_HREF, external_url: null, children }
    }
    return children === item.children ? item : { ...item, children }
  })
}
