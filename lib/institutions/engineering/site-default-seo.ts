// F4 (and the placement line of F1) of the engineering perception audit, user's choices 2026-11-21. Pages with no
// SEO row of their own (the NIRF pages, /contact-us ...) fall back to the site-wide defaults in Supabase
// site_settings (category 'seo'). On 2026-11-21 those read "JKKN College of Engineering — Best Engineering College
// Near Erode" and "... B.E., B.Tech, M.E., MBA programs with 95%+ placement rate." - an unsourced "Best" and a
// placement rate the college's NIRF 2026 filing contradicts (23 of 53 placed, 2024-25). Exact-match swap at render
// time, so a value edited in the CMS always wins. No database row is edited.

export const DEFAULT_TITLE_OLD = 'JKKN College of Engineering — Best Engineering College Near Erode'
export const DEFAULT_TITLE_NEW = 'JKKN College of Engineering and Technology, Komarapalayam'

export const DEFAULT_DESCRIPTION_OLD =
  'JKKN College of Engineering and Technology - AICTE approved, Anna University affiliated engineering college near Erode, Tamil Nadu. B.E., B.Tech, M.E., MBA programs with 95%+ placement rate.'
export const DEFAULT_DESCRIPTION_NEW =
  'JKKN College of Engineering and Technology, Komarapalayam - AICTE approved, autonomous, NAAC B+. B.E., B.Tech, M.E. and MBA, 18 km from Erode on NH-544.'

interface SiteDefaults {
  defaultTitle: string
  siteDescription: string
}

/** Returns a copy with the two known defaults replaced; anything else passes through. */
export function applyEngineeringSiteDefaultSeo<T extends SiteDefaults>(settings: T): T {
  if (!settings) return settings
  return {
    ...settings,
    defaultTitle: settings.defaultTitle === DEFAULT_TITLE_OLD ? DEFAULT_TITLE_NEW : settings.defaultTitle,
    siteDescription:
      settings.siteDescription === DEFAULT_DESCRIPTION_OLD ? DEFAULT_DESCRIPTION_NEW : settings.siteDescription,
  }
}
