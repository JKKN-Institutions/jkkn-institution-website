import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CampusContact, JobLanding, employerFacts, otherListPages } from '@/components/public/careers/job-landing'
import { isMainInstitution } from '@/lib/config/multi-tenant'
import { getSiteCareers, toCard, type JobCardData } from '@/lib/services/public-careers-search'
import {
  CAMPUS, buildFaqJsonLd, buildLandingJsonLd, buildTeachingFaqs, buildTeachingLanding,
  type LandingJob, type TeachingLanding,
} from '@/lib/utils/careers-landing'
import { careersHref } from '@/lib/utils/careers-params'
import { getSiteUrl } from '@/lib/utils/site-url'

// A list page for people searching "teaching jobs" / "teacher vacancy" near
// Erode and Namakkal. The jobs come from the same cached MyJKKN feed as
// /careers, so HR opening or closing a job changes this page with no deploy.
// School and trainer roles are listed here; faculty grades are counted and
// linked to the careers search. This static segment takes precedence over
// /careers/[id], and is served on the parent site only — every role is on the
// one Komarapalayam campus, so a copy per town or per college would be a
// doorway page.
export const dynamic = 'force-dynamic'

const PATH = '/careers/teaching-jobs'
const TITLE = 'Teaching & Teacher Jobs in Namakkal, near Erode | JKKN'
const DESCRIPTION =
  'Teaching jobs and teacher vacancies at JKKN Institutions, Komarapalayam, Namakkal District, 18 km from Erode. School and college openings. Apply online.'
const H1 = 'Teaching Jobs at JKKN Institutions, Komarapalayam, Namakkal District'

type Card = JobCardData & LandingJob

// Every faculty grade has its own list page; the search is only a fallback.
const FACULTY_PAGES: Partial<Record<string, string>> = {
  'assistant-professor': '/careers/assistant-professor-jobs',
  professor: '/careers/professor-jobs',
  lecturer: '/careers/lecturer-jobs',
  tutor: '/careers/tutor-jobs',
}

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
async function loadLanding(): Promise<TeachingLanding<Card> | null> {
  const now = Date.now()
  try {
    const site = await getSiteCareers()
    return buildTeachingLanding(
      site.index.jobs.map((item): Card => ({
        ...toCard(item, now),
        roleCategory: item.job.role_category,
        closesAt: item.job.closes_at,
      })),
    )
  } catch (err) {
    console.error('[careers] teaching-jobs listing failed', err)
    return null
  }
}

export default async function TeachingJobsPage() {
  if (!isMainInstitution()) notFound()

  const asOf = today()
  const siteUrl = getSiteUrl()
  const pageUrl = `${siteUrl}${PATH}`
  const landing = await loadLanding()
  const faqs = landing ? buildTeachingFaqs(landing, asOf) : []

  return (
    <JobLanding
      crumb="Teaching Jobs"
      h1={H1}
      intro={
        <>
          {landing
            ? `${CAMPUS.name} lists ${landing.total} teaching jobs in ${CAMPUS.district} on its careers page as of ${asOf}. `
            : `${CAMPUS.name} lists its teaching jobs in ${CAMPUS.district} on its careers page. `}
          The teacher vacancies cover school roles at JKKN Matriculation Higher Secondary School and faculty roles
          across seven colleges, all on one campus in {CAMPUS.locality}, {CAMPUS.region}, {CAMPUS.nearestCityKm} km by
          road from {CAMPUS.nearestCity}. Apply online; no account is needed.
        </>
      }
      chips={[
        ...(landing ? [`${landing.total} teaching openings`] : []),
        `${CAMPUS.locality}, ${CAMPUS.district}`,
        `${CAMPUS.nearestCityKm} km from ${CAMPUS.nearestCity}`,
        'Apply online, no account',
      ]}
      asOf={landing ? asOf : null}
      factsTitle="Teaching jobs at JKKN: quick facts"
      factsCaption="Key facts about teaching jobs at JKKN Institutions, Komarapalayam"
      facts={[
        ['Employer', `${CAMPUS.name}, established in ${CAMPUS.founded} by the J.K.K. Rangammal Charitable Trust`],
        ...(landing
          ? [[
              'Teaching jobs listed',
              `${landing.total} as of ${asOf}: ${landing.listed.length} school teacher and trainer roles, and ${landing.facultyTotal} college faculty roles`,
            ] as [string, string]]
          : []),
        ['Location', `Natarajapuram, NH-544, ${CAMPUS.locality}, ${CAMPUS.district}, ${CAMPUS.region} ${CAMPUS.postalCode}`],
        ['Nearest city', `${CAMPUS.nearestCity}, ${CAMPUS.nearestCityKm} km by road`],
        ['How to apply', 'Online from each job page. No account is needed.'],
        ['Contact', <CampusContact key="contact" />],
      ]}
      lead="School teacher vacancies at JKKN Matriculation Higher Secondary School and trainer roles"
      groupsLabel="School teacher jobs"
      groups={landing?.groups ?? []}
      tiles={landing ? {
        title: 'College faculty jobs across JKKN colleges',
        label: 'College faculty jobs',
        intro: `Faculty jobs by designation. Openings as of ${asOf}:`,
        items: landing.faculty.map(f => ({
          key: f.key, count: f.count, label: f.label, href: FACULTY_PAGES[f.key] ?? careersHref({ q: f.search }),
        })),
      } : undefined}
      whereTitle="Where are these teaching jobs in Namakkal District?"
      where={
        <>
          {CAMPUS.name} is at {CAMPUS.street}, {CAMPUS.locality}, {CAMPUS.district}, {CAMPUS.region}{' '}
          {CAMPUS.postalCode}. For candidates looking for teaching jobs in {CAMPUS.nearestCity}, the campus is{' '}
          {CAMPUS.nearestCityKm} km by road from {CAMPUS.nearestCity} city. All seven colleges and the school
          teaching roles on this page are based at {CAMPUS.locality}.
        </>
      }
      applyTitle="How do I apply for a teaching job at JKKN?"
      aboutFacts={employerFacts('teaching jobs')}
      faqTitle="Teaching jobs at JKKN: common questions"
      faqs={faqs}
      related={otherListPages(PATH)}
      jsonLd={[
        ...buildLandingJsonLd({
          pageUrl,
          name: H1,
          description: DESCRIPTION,
          crumb: 'Teaching Jobs',
          jobs: landing?.listed.map(j => ({ title: j.title, url: `${siteUrl}/careers/${j.slug}` })) ?? [],
        }),
        ...(faqs.length ? [buildFaqJsonLd(faqs)] : []),
      ]}
    />
  )
}
