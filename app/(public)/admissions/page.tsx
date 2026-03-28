import { redirect } from 'next/navigation'

/**
 * /admissions → /admissions/engineering
 *
 * Static redirect — no DB query, no CMS config needed.
 * Next.js sends a 308 Permanent Redirect at the edge.
 *
 * To point this at a different institution in future,
 * read NEXT_PUBLIC_INSTITUTION_ID and branch:
 *   if (institutionId === 'dental') redirect('/admissions/dental')
 */
export default function AdmissionsIndexPage() {
  redirect('/admissions/engineering')
}
