import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { CareersUnavailable } from '@/components/public/careers/careers-unavailable'
import { JobCard } from '@/components/public/careers/job-card'
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

const APPLY_STEPS = [
  'Open the role you want from the list on this page.',
  'Select Apply now on the job page.',
  'Enter your name, email, phone number, highest qualification and total experience in months. Enter 0 if you are a fresher.',
  'Upload your resume as a PDF, DOC or DOCX file of up to 2 MB.',
  'Tick the consent box and select Submit application. No account is needed.',
]

const INSTITUTIONS = [
  { name: 'JKKN Matriculation Higher Secondary School', href: 'https://school.jkkn.ac.in/' },
  { name: 'JKKN Dental College and Hospital', href: 'https://dental.jkkn.ac.in/' },
  { name: 'JKKN College of Engineering and Technology', href: 'https://engg.jkkn.ac.in/' },
  { name: 'JKKN College of Pharmacy', href: 'https://pharmacy.jkkn.ac.in/' },
  { name: 'JKKN College of Arts and Science', href: 'https://cas.jkkn.ac.in/' },
  { name: 'JKKN College of Allied Health Sciences', href: 'https://ahs.jkkn.ac.in/' },
  { name: 'JKKN College of Education', href: 'https://edu.jkkn.ac.in/' },
]

const toScript = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')

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

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32 border-t border-border py-8 sm:py-10">
      <h2 id={`${id}-title`} className="text-2xl font-bold text-foreground">{title}</h2>
      {children}
    </section>
  )
}

function QuickFacts({ landing, asOf }: { landing: TeachingLanding<Card> | null; asOf: string }) {
  const rows: [string, React.ReactNode][] = [
    ['Employer', `${CAMPUS.name}, established in ${CAMPUS.founded} by the J.K.K. Rangammal Charitable Trust`],
    ...(landing
      ? [[
          'Teaching jobs listed',
          `${landing.total} as of ${asOf}: ${landing.listed.length} school teacher and trainer roles, and ${landing.facultyTotal} college faculty roles`,
        ] as [string, React.ReactNode]]
      : []),
    ['Location', `Natarajapuram, NH-544, ${CAMPUS.locality}, ${CAMPUS.district}, ${CAMPUS.region} ${CAMPUS.postalCode}`],
    ['Nearest city', `${CAMPUS.nearestCity}, ${CAMPUS.nearestCityKm} km by road`],
    ['How to apply', 'Online from each job page. No account is needed.'],
    ['Contact', (
      <>
        <a className="font-medium text-primary hover:underline" href={CAMPUS.phoneHref}>{CAMPUS.phone}</a>,{' '}
        <a className="font-medium text-primary hover:underline" href={`mailto:${CAMPUS.email}`}>{CAMPUS.email}</a>
      </>
    )],
  ]
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
      <table className="w-full text-left text-sm sm:text-base">
        <caption className="sr-only">Key facts about teaching jobs at JKKN Institutions, Komarapalayam</caption>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-t border-border first:border-t-0">
              <th scope="row" className="w-2/5 bg-primary/10 px-4 py-3 align-top font-semibold text-foreground sm:w-1/3">{label}</th>
              <td className="px-4 py-3 text-foreground/90">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
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
  const pageUrl = `${getSiteUrl()}${PATH}`
  const landing = await loadLanding()

  const faqs = landing ? buildTeachingFaqs(landing, asOf) : []
  const jsonLd = [
    ...buildLandingJsonLd({
      pageUrl,
      name: H1,
      description: DESCRIPTION,
      crumb: 'Teaching Jobs',
      jobs: landing?.listed.map(j => ({ title: j.title, url: `${getSiteUrl()}/careers/${j.slug}` })) ?? [],
    }),
    ...(faqs.length ? [buildFaqJsonLd(faqs)] : []),
  ]

  const jumps = [
    ['#facts', 'Quick facts'],
    ...(landing?.groups.length ? [['#school', 'School teacher jobs']] : []),
    ...(landing?.faculty.length ? [['#faculty', 'College faculty jobs']] : []),
    ['#where', 'Campus location'],
    ['#apply', 'How to apply'],
    ...(faqs.length ? [['#faq', 'Questions']] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: toScript(data) }} />
      ))}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span aria-hidden="true"> › </span>
          <Link href="/careers" className="hover:text-primary">Careers</Link>
          <span aria-hidden="true"> › </span>
          <span aria-current="page" className="text-foreground">Teaching Jobs</span>
        </nav>

        <header className="pb-8 pt-4">
          <h1 className="max-w-4xl font-sans font-bold text-foreground">{H1}</h1>
          <p className="mt-4 max-w-3xl text-lg text-foreground/90">
            {landing
              ? `${CAMPUS.name} lists ${landing.total} teaching jobs in ${CAMPUS.district} on its careers page as of ${asOf}. `
              : `${CAMPUS.name} lists its teaching jobs in ${CAMPUS.district} on its careers page. `}
            The teacher vacancies cover school roles at JKKN Matriculation Higher Secondary School and faculty roles
            across seven colleges, all on one campus in {CAMPUS.locality}, {CAMPUS.region}, {CAMPUS.nearestCityKm} km by
            road from {CAMPUS.nearestCity}. Apply online; no account is needed.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm font-medium">
            {[
              ...(landing ? [`${landing.total} teaching openings`] : []),
              `${CAMPUS.locality}, ${CAMPUS.district}`,
              `${CAMPUS.nearestCityKm} km from ${CAMPUS.nearestCity}`,
              'Apply online, no account',
            ].map(chip => (
              <li key={chip} className="rounded-full bg-primary/10 px-3 py-1.5 text-primary">{chip}</li>
            ))}
          </ul>
          <nav aria-label="On this page" className="mt-5 flex flex-wrap gap-2">
            {jumps.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-lg border border-primary bg-card px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
              >
                {label}
              </a>
            ))}
          </nav>
          {landing && <p className="mt-4 text-sm text-muted-foreground">Openings shown as of {asOf}.</p>}
        </header>

        <Section id="facts" title="Teaching jobs at JKKN: quick facts">
          <QuickFacts landing={landing} asOf={asOf} />
        </Section>

        {!landing && (
          <div className="border-t border-border py-8"><CareersUnavailable /></div>
        )}

        {landing && landing.groups.length > 0 && (
          <div id="school" className="scroll-mt-32 border-t border-border py-8 sm:py-10">
            <p className="max-w-3xl text-foreground/90">
              School teacher vacancies at JKKN Matriculation Higher Secondary School and trainer roles:{' '}
              {landing.listed.length} openings. Select a role to read the full description and apply.
            </p>
            {landing.groups.map(group => (
              <section key={group.key} aria-labelledby={`group-${group.key}`} className="mt-8">
                <h2 id={`group-${group.key}`} className="text-2xl font-bold text-foreground">{group.heading}</h2>
                <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{group.note}</p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {group.jobs.map(job => <JobCard key={job.id} job={job} headingLevel="h3" />)}
                </div>
              </section>
            ))}
          </div>
        )}

        {landing && landing.faculty.length > 0 && (
          <Section id="faculty" title="College faculty jobs across JKKN colleges">
            <p className="mt-2 max-w-3xl text-foreground/90">
              Faculty jobs are listed on the main careers page. Openings as of {asOf}:
            </p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {landing.faculty.map(tile => (
                <li key={tile.key}>
                  <Link
                    href={careersHref({ q: tile.search })}
                    className="group block h-full rounded-2xl bg-primary p-5 text-primary-foreground transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="block text-4xl font-bold leading-none">{tile.count}</span>
                    <span className="mt-2 block font-semibold">{tile.label}</span>
                    <span className="mt-1 inline-flex items-center gap-1 text-sm opacity-90 transition-all group-hover:gap-2">
                      View openings <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <div className="grid gap-x-10 border-t border-border lg:grid-cols-2">
          <section id="where" aria-labelledby="where-title" className="scroll-mt-32 py-8 sm:py-10">
            <h2 id="where-title" className="text-2xl font-bold text-foreground">Where are these teaching jobs in Namakkal District?</h2>
            <p className="mt-3 text-foreground/90">
              {CAMPUS.name} is at {CAMPUS.street}, {CAMPUS.locality}, {CAMPUS.district}, {CAMPUS.region}{' '}
              {CAMPUS.postalCode}. For candidates looking for teaching jobs in {CAMPUS.nearestCity}, the campus is{' '}
              {CAMPUS.nearestCityKm} km by road from {CAMPUS.nearestCity} city. All seven colleges and the school
              teaching roles on this page are based at {CAMPUS.locality}.
            </p>
            <address className="mt-4 rounded-xl bg-card px-4 py-3 text-sm not-italic text-foreground/90">
              {CAMPUS.name}, Natarajapuram, NH-544, {CAMPUS.locality}, {CAMPUS.district}, {CAMPUS.region} {CAMPUS.postalCode}
            </address>
          </section>
          <section id="apply" aria-labelledby="apply-title" className="scroll-mt-32 border-t border-border py-8 sm:py-10 lg:border-t-0">
            <h2 id="apply-title" className="text-2xl font-bold text-foreground">How do I apply for a teaching job at JKKN?</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-foreground/90">
              {APPLY_STEPS.map(step => <li key={step}>{step}</li>)}
            </ol>
          </section>
        </div>

        <Section id="about" title="About JKKN Institutions as an employer">
          <ul className="mt-3 max-w-4xl list-disc space-y-2 pl-5 text-foreground/90">
            <li>
              {CAMPUS.name} was established in {CAMPUS.founded} by the J.K.K. Rangammal Charitable Trust and comprises seven
              colleges and two schools in {CAMPUS.locality}, {CAMPUS.district}, {CAMPUS.region}.
            </li>
            <li>
              The seven JKKN colleges are on one 70-acre campus in {CAMPUS.locality}, {CAMPUS.nearestCityKm} km by road from{' '}
              {CAMPUS.nearestCity} city on NH-544.
            </li>
            <li>
              JKKN Matriculation Higher Secondary School, {CAMPUS.locality}, was founded in 1969 and is a matriculation school
              recognised by the Government of Tamil Nadu.
            </li>
            <li>
              Applications for teaching jobs at {CAMPUS.name}, {CAMPUS.locality} are submitted online at jkkn.ac.in/careers
              and do not require an account.
            </li>
          </ul>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            {INSTITUTIONS.map(inst => (
              <li key={inst.href}>
                <a href={inst.href} className="inline-block rounded-lg border border-border bg-card px-3 py-2 text-primary hover:border-primary">
                  {inst.name}
                </a>
              </li>
            ))}
            <li>
              <Link href="/contact" className="inline-block rounded-lg border border-border bg-card px-3 py-2 text-primary hover:border-primary">
                Contact JKKN
              </Link>
            </li>
          </ul>
        </Section>

        {faqs.length > 0 && (
          <Section id="faq" title="Teaching jobs at JKKN: common questions">
            <div className="mt-4 max-w-4xl space-y-2">
              {faqs.map(faq => (
                <details key={faq.question} className="rounded-xl border border-border bg-card px-4">
                  <summary className="cursor-pointer py-3 font-semibold text-foreground">{faq.question}</summary>
                  <p className="pb-4 text-foreground/90">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Section>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary p-6 text-primary-foreground">
          <p>
            <span className="block font-semibold">Looking for a different role?</span>
            See every open position at {CAMPUS.name}.
          </p>
          <Link
            href="/careers"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-background px-5 text-sm font-semibold text-primary hover:bg-background/90"
          >
            All careers <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
