// F3 of the engineering perception audit (user's choice 2026-11-21). These engineering CMS pages render only
// "This page has no content yet." (curl + browser, 2026-11-20 / 21), so each one now 301-redirects to the real
// page a parent most likely wanted. next.config.ts holds the same list as a literal (it is evaluated before the
// app's path aliases exist) and applies it only when NEXT_PUBLIC_INSTITUTION_ID is 'engineering', so the main
// site's /about, /placements and /facilities are not touched. __tests__/engineering/empty-page-redirects.test.ts
// keeps the two lists equal. app/sitemap-pages.xml/route.ts drops these slugs: a sitemap never lists a redirect.
export const ENGG_EMPTY_PAGE_REDIRECTS: ReadonlyArray<{ source: string; destination: string }> = [
  { source: '/placements', destination: '/iqac/nirf/nirf-2026' },
  { source: '/about', destination: '/approvals-and-affiliation' },
  { source: '/courses-offered', destination: '/admissions' },
  { source: '/courses-offered/ug', destination: '/admissions' },
  { source: '/courses-offered/pg', destination: '/admissions' },
  { source: '/why-students-choose-jkkn', destination: '/admissions' },
  { source: '/committee', destination: '/mandatory-disclosure' },
  { source: '/others', destination: '/others/academic-calendar' },
  { source: '/facilities', destination: '/hostel' },
]

export const ENGG_EMPTY_PAGE_SLUGS: ReadonlySet<string> = new Set(
  ENGG_EMPTY_PAGE_REDIRECTS.map((redirect) => redirect.source.replace(/^\//, ''))
)
