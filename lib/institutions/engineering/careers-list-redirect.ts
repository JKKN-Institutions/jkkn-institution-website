// The Engineering site's careers LIST page (/careers) goes to the parent site's careers list (user's choice
// 2026-11-24, "list page mattum hide", target = every college's jobs). Only the list page moves:
//  - Job pages (/careers/<slug>) still render on engg.jkkn.ac.in with a www canonical, because job links
//    shared on social media land there (GA4 2026-08-26..11-23: 217 job-page views, 109 of them Organic Social).
//  - The list page itself had 0 Google impressions in 90 days and Google did not know the URL
//    (Search Console URL Inspection, 2026-11-24), so nothing is lost in search.
// next.config.ts holds the same value as a literal (it is evaluated before the app's path aliases exist) and
// applies it only when NEXT_PUBLIC_INSTITUTION_ID is 'engineering' - on the parent site it would redirect to
// itself. __tests__/engineering/careers-list-redirect.test.ts keeps the two equal.
export const ENGG_CAREERS_LIST_REDIRECT: Readonly<{ source: string; destination: string }> = {
  source: '/careers',
  destination: 'https://www.jkkn.ac.in/careers',
}
