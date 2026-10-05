// lib/utils/careers-slug.ts
//
// Readable job URLs. MyJKKN exposes no slug, so the site derives one:
//   <title>[-<department>]-<key>
// The key alone identifies the job, so a slug survives HR retitling the
// posting — the page redirects to the current slug instead of 404ing.

import type { PublicJob } from '@/lib/schemas/public-careers'
import { formatJobTitle, slugify } from '@/lib/utils/careers-text'

type SlugSource = Pick<PublicJob, 'id' | 'job_code' | 'title' | 'department'>

const MAX_NAME_LENGTH = 80

/**
 * Stable per-job token. Job codes look like `Assistant__1746249092`; the
 * trailing number is unique, the prefix just repeats the title. Jobs with no
 * usable code fall back to the first block of their UUID.
 */
export function jobKey(job: Pick<PublicJob, 'id' | 'job_code'>): string {
  const tail = job.job_code?.match(/(\d{6,})$/)?.[1]
  return tail ?? job.id.slice(0, 8).toLowerCase()
}

export function jobSlug(job: SlugSource): string {
  const title = slugify(formatJobTitle(job.title))
  const dept = job.department ? slugify(job.department.name) : ''
  const name = (dept && !title.includes(dept) ? `${title}-${dept}` : title)
    .slice(0, MAX_NAME_LENGTH)
    .replace(/-+$/, '')
  return name ? `${name}-${jobKey(job)}` : jobKey(job)
}

export function jobPath(job: SlugSource): string {
  return `/careers/${jobSlug(job)}`
}

/** Exact slug first, then a unique key match (the title part may be outdated). */
export function findJobBySlug<T extends SlugSource>(jobs: T[], slug: string): T | null {
  const wanted = slug.toLowerCase()
  const exact = jobs.find(j => jobSlug(j) === wanted)
  if (exact) return exact
  const byKey = jobs.filter(j => {
    const key = jobKey(j)
    return wanted === key || wanted.endsWith(`-${key}`)
  })
  return byKey.length === 1 ? byKey[0] : null
}
