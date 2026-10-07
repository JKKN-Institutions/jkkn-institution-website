import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CampusContact, JobLanding, employerFacts, otherListPages } from '@/components/public/careers/job-landing'
import { isMainInstitution } from '@/lib/config/multi-tenant'
import { getSiteCareers, toCard, type JobCardData } from '@/lib/services/public-careers-search'
import {
  CAMPUS, buildFaqJsonLd, buildLandingJsonLd, buildNonTeachingFaqs, buildNonTeachingLanding,
  type LandingJob, type NonTeachingLanding,
} from '@/lib/utils/careers-landing'
import { getSiteUrl } from '@/lib/utils/site-url'

// A list page for people searching office, technical, hospital-support and
// campus jobs near Erode and Namakkal. Same rules as /careers/teaching-jobs:
// the jobs come from the cached MyJKKN feed, the page is served on the parent
// site only, and this static segment takes precedence over /careers/[id].
// Teaching, leadership, lab and library roles are not listed here.
export const dynamic = 'force-dynamic'

const PATH = '/careers/non-teaching-jobs'
const TITLE = 'Non-Teaching Jobs in Namakkal, near Erode | JKKN Careers'
const DESCRIPTION =
  'Non-teaching jobs at JKKN Institutions, Komarapalayam, Namakkal District, 18 km from Erode: office, technical, hospital and campus roles. Apply online.'
const H1 = 'Non-Teaching Jobs at JKKN Institutions, Komarapalayam, Namakkal District'

type Card = JobCardData & LandingJob

const today = () =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date())

export function generateMetadata(): Metadata {
  if (!isMainInstitution()) return { title: 'Page not found', robots: { index: false } }
  const url = `${getSiteUrl()}${PATH}`
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: { title: TITLE, description: DESCRIPTION, url, type: 'website', locale: 'en_IN' },
  }
}

// null = MyJKKN unreachable. The page still answers where, how and who;
// only the live list and the numbers taken from it are left out.
async function loadLanding(): Promise<NonTeachingLanding<Card> | null> {
  const now = Date.now()
  try {
    const site = await getSiteCareers()
    return buildNonTeachingLanding(
      site.index.jobs.map((item): Card => ({
        ...toCard(item, now),
        roleCategory: item.job.role_category,
        closesAt: item.job.closes_at,
      })),
    )
  } catch (err) {
    console.error('[careers] non-teaching-jobs listing failed', err)
    return null
  }
}

export default async function NonTeachingJobsPage() {
  if (!isMainInstitution()) notFound()

  const asOf = today()
  const siteUrl = getSiteUrl()
  const pageUrl = `${siteUrl}${PATH}`
  const landing = await loadLanding()
  const faqs = landing && landing.total > 0 ? buildNonTeachingFaqs(landing, asOf) : []

  return (
    <JobLanding
      crumb="Non-Teaching Jobs"
      h1={H1}
      intro={
        <>
          {landing
            ? `${CAMPUS.name} lists ${landing.total} non-teaching jobs in ${CAMPUS.district} on its careers page as of ${asOf}. `
            : `${CAMPUS.name} lists its non-teaching jobs in ${CAMPUS.district} on its careers page. `}
          The openings cover office and administration, technical and IT, hospital support and campus roles across the
          JKKN colleges and the main office, all on one campus in {CAMPUS.locality}, {CAMPUS.region},{' '}
          {CAMPUS.nearestCityKm} km by road from {CAMPUS.nearestCity}. Apply online; no account is needed.
        </>
      }
      chips={[
        ...(landing ? [`${landing.total} non-teaching openings`] : []),
        `${CAMPUS.locality}, ${CAMPUS.district}`,
        `${CAMPUS.nearestCityKm} km from ${CAMPUS.nearestCity}`,
        'Apply online, no account',
      ]}
      asOf={landing ? asOf : null}
      factsTitle="Non-teaching jobs at JKKN: quick facts"
      factsCaption="Key facts about non-teaching jobs at JKKN Institutions, Komarapalayam"
      facts={[
        ['Employer', `${CAMPUS.name}, established in ${CAMPUS.founded} by the J.K.K. Rangammal Charitable Trust`],
        ...(landing
          ? [[
              'Non-teaching jobs listed',
              `${landing.total} as of ${asOf}: ${landing.groups.map(g => `${g.jobs.length} ${g.label}`).join(', ')}`,
            ] as [string, string]]
          : []),
        ['Location', `Natarajapuram, NH-544, ${CAMPUS.locality}, ${CAMPUS.district}, ${CAMPUS.region} ${CAMPUS.postalCode}`],
        ['Nearest city', `${CAMPUS.nearestCity}, ${CAMPUS.nearestCityKm} km by road`],
        ['How to apply', 'Online from each job page. No account is needed.'],
        ['Contact', <CampusContact key="contact" />],
      ]}
      lead="Non-teaching vacancies at the JKKN colleges, hospital and main office"
      groupsLabel="Non-teaching jobs"
      groups={landing?.groups ?? []}
      whereTitle="Where are these non-teaching jobs in Namakkal District?"
      where={
        <>
          {CAMPUS.name} is at {CAMPUS.street}, {CAMPUS.locality}, {CAMPUS.district}, {CAMPUS.region}{' '}
          {CAMPUS.postalCode}. For candidates looking for office or technical jobs in {CAMPUS.nearestCity}, the campus
          is {CAMPUS.nearestCityKm} km by road from {CAMPUS.nearestCity} city. Every non-teaching role on this page is
          based at {CAMPUS.locality}.
        </>
      }
      applyTitle="How do I apply for a non-teaching job at JKKN?"
      aboutFacts={employerFacts('non-teaching jobs')}
      faqTitle="Non-teaching jobs at JKKN: common questions"
      faqs={faqs}
      related={otherListPages(PATH)}
      jsonLd={[
        ...buildLandingJsonLd({
          pageUrl,
          name: H1,
          description: DESCRIPTION,
          crumb: 'Non-Teaching Jobs',
          jobs: landing?.listed.map(j => ({ title: j.title, url: `${siteUrl}/careers/${j.slug}` })) ?? [],
        }),
        ...(faqs.length ? [buildFaqJsonLd(faqs)] : []),
      ]}
    />
  )
}
