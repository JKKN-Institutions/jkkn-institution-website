import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isMainInstitution } from '@/lib/config/multi-tenant'
import { getSiteCareers, toCard, type JobCardData } from '@/lib/services/public-careers-search'
import {
  CAMPUS, buildDesignationFaqs, buildDesignationLanding, buildFaqJsonLd, buildLandingJsonLd, splitSummary,
  type DesignationKey, type DesignationLanding as Landing, type LandingJob,
} from '@/lib/utils/careers-landing'
import { getSiteUrl } from '@/lib/utils/site-url'
import { CampusContact, JobLanding, employerFacts, otherListPages } from './job-landing'

/**
 * A careers list page for one designation (Assistant Professor, Lecturer and
 * Reader, lab and library). Each route file is only its config; this renders
 * it. Same rules as the other list pages: live MyJKKN feed, parent site only,
 * and no salary, hours or benefits in the copy.
 */
export interface DesignationConfig {
  key: DesignationKey
  path: string
  title: string
  description: string
  h1: string
  crumb: string
  /** Heading and sentence noun, e.g. "Assistant Professor". */
  noun: string
  /** What follows "{n} {noun} jobs in Namakkal District on its careers page as of {date}." */
  introTail: string
  lead: string
}

type Card = JobCardData & LandingJob

const today = () =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date())

export function designationMetadata(config: DesignationConfig): Metadata {
  if (!isMainInstitution()) return { title: 'Page not found', robots: { index: false } }
  const url = `${getSiteUrl()}${config.path}`
  return {
    title: { absolute: config.title },
    description: config.description,
    alternates: { canonical: url },
    openGraph: { title: config.title, description: config.description, url, type: 'website', locale: 'en_IN' },
  }
}

// null = MyJKKN unreachable. The page still answers where, how and who;
// only the live list and the numbers taken from it are left out.
async function loadLanding(config: DesignationConfig): Promise<Landing<Card> | null> {
  const now = Date.now()
  try {
    const site = await getSiteCareers()
    return buildDesignationLanding(
      config.key,
      site.index.jobs.map((item): Card => ({
        ...toCard(item, now),
        roleCategory: item.job.role_category,
        closesAt: item.job.closes_at,
      })),
      config.noun,
    )
  } catch (err) {
    console.error(`[careers] ${config.path} listing failed`, err)
    return null
  }
}

export async function DesignationLanding({ config }: { config: DesignationConfig }) {
  if (!isMainInstitution()) notFound()

  const asOf = today()
  const siteUrl = getSiteUrl()
  const lower = config.noun.toLowerCase()
  const landing = await loadLanding(config)
  const faqs = landing && landing.total > 0 ? buildDesignationFaqs(config.key, landing, asOf, config.noun) : []
  const join = config.key === 'lab-library' ? 'in' : 'at'

  return (
    <JobLanding
      crumb={config.crumb}
      h1={config.h1}
      intro={
        <>
          {landing
            ? `${CAMPUS.name} lists ${landing.total} ${lower} jobs in ${CAMPUS.district} on its careers page as of ${asOf}. `
            : `${CAMPUS.name} lists its ${lower} jobs in ${CAMPUS.district} on its careers page. `}
          {config.introTail} Every role is on one campus in {CAMPUS.locality}, {CAMPUS.region}, {CAMPUS.nearestCityKm} km
          by road from {CAMPUS.nearestCity}. Apply online; no account is needed.
        </>
      }
      chips={[
        ...(landing ? [`${landing.total} ${lower} openings`] : []),
        `${CAMPUS.locality}, ${CAMPUS.district}`,
        `${CAMPUS.nearestCityKm} km from ${CAMPUS.nearestCity}`,
        'Apply online, no account',
      ]}
      asOf={landing ? asOf : null}
      factsTitle={`${config.noun} jobs at JKKN: quick facts`}
      factsCaption={`Key facts about ${lower} jobs at JKKN Institutions, Komarapalayam`}
      facts={[
        ['Employer', `${CAMPUS.name}, established in ${CAMPUS.founded} by the J.K.K. Rangammal Charitable Trust`],
        ...(landing && landing.total > 0
          ? [[`${config.noun} jobs listed`, `${landing.total} as of ${asOf}: ${splitSummary(landing.groups, join)}`] as [string, string]]
          : []),
        ['Location', `Natarajapuram, NH-544, ${CAMPUS.locality}, ${CAMPUS.district}, ${CAMPUS.region} ${CAMPUS.postalCode}`],
        ['Nearest city', `${CAMPUS.nearestCity}, ${CAMPUS.nearestCityKm} km by road`],
        ['How to apply', 'Online from each job page. No account is needed.'],
        ['Contact', <CampusContact key="contact" />],
      ]}
      lead={config.lead}
      groupsLabel={`${config.noun} jobs`}
      groups={landing?.groups ?? []}
      whereTitle={`Where are these ${lower} jobs in Namakkal District?`}
      where={
        <>
          {CAMPUS.name} is at {CAMPUS.street}, {CAMPUS.locality}, {CAMPUS.district}, {CAMPUS.region}{' '}
          {CAMPUS.postalCode}. For candidates looking for {lower} jobs in {CAMPUS.nearestCity}, the campus is{' '}
          {CAMPUS.nearestCityKm} km by road from {CAMPUS.nearestCity} city. Every role on this page is based at{' '}
          {CAMPUS.locality}.
        </>
      }
      applyTitle={`How do I apply for ${lower} jobs at JKKN?`}
      aboutFacts={employerFacts(`${lower} jobs`)}
      faqTitle={`${config.noun} jobs at JKKN: common questions`}
      faqs={faqs}
      related={otherListPages(config.path)}
      jsonLd={[
        ...buildLandingJsonLd({
          pageUrl: `${siteUrl}${config.path}`,
          name: config.h1,
          description: config.description,
          crumb: config.crumb,
          jobs: landing?.listed.map(j => ({ title: j.title, url: `${siteUrl}/careers/${j.slug}` })) ?? [],
        }),
        ...(faqs.length ? [buildFaqJsonLd(faqs)] : []),
      ]}
    />
  )
}
