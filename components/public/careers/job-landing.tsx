import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { JobCardData } from '@/lib/services/public-careers-search'
import { CAMPUS, type Faq } from '@/lib/utils/careers-landing'
import { CareersUnavailable } from './careers-unavailable'
import { JobCard } from './job-card'

/**
 * The shared layout of a careers list page (/careers/teaching-jobs,
 * /careers/non-teaching-jobs): what is open, where the campus is, how to
 * apply, and a question-and-answer block. Each page decides which jobs it
 * shows and writes its own copy; this file only lays it out, so every list
 * page reads the same way and one fix reaches all of them.
 */

export interface LandingGroup { key: string; heading: string; note: string; jobs: JobCardData[] }
export interface LandingTile { key: string; count: number; label: string; href: string }
export interface LandingLink { label: string; href: string }

export interface JobLandingProps {
  /** Last breadcrumb segment. */
  crumb: string
  h1: string
  intro: ReactNode
  chips: string[]
  /** "7 October 2026" when the live list loaded, null during a MyJKKN outage. */
  asOf: string | null
  factsTitle: string
  factsCaption: string
  facts: [string, ReactNode][]
  /** Sentence above the job groups. */
  lead: string
  groupsLabel: string
  groups: LandingGroup[]
  /** Counted links to roles that are not listed on this page. */
  tiles?: { title: string; label: string; intro: string; items: LandingTile[] }
  whereTitle: string
  where: ReactNode
  applyTitle: string
  aboutFacts: ReactNode[]
  faqTitle: string
  faqs: Faq[]
  /** Other careers list pages. */
  related: LandingLink[]
  jsonLd: Record<string, unknown>[]
}

export const APPLY_STEPS = [
  'Open the role you want from the list on this page.',
  'Select Apply now on the job page.',
  'Enter your name, email, phone number, highest qualification and total experience in months. Enter 0 if you are a fresher.',
  'Upload your resume as a PDF, DOC or DOCX file of up to 2 MB.',
  'Tick the consent box and select Submit application. No account is needed.',
]

const INSTITUTIONS: LandingLink[] = [
  { label: 'JKKN Matriculation Higher Secondary School', href: 'https://school.jkkn.ac.in/' },
  { label: 'JKKN Dental College and Hospital', href: 'https://dental.jkkn.ac.in/' },
  { label: 'JKKN College of Engineering and Technology', href: 'https://engg.jkkn.ac.in/' },
  { label: 'JKKN College of Pharmacy', href: 'https://pharmacy.jkkn.ac.in/' },
  { label: 'JKKN College of Arts and Science', href: 'https://cas.jkkn.ac.in/' },
  { label: 'JKKN College of Allied Health Sciences', href: 'https://ahs.jkkn.ac.in/' },
  { label: 'JKKN College of Education', href: 'https://edu.jkkn.ac.in/' },
]

/** Every careers list page. Each one links to the others from its footer. */
export const LIST_PAGES: LandingLink[] = [
  { label: 'Teaching jobs', href: '/careers/teaching-jobs' },
  { label: 'Assistant Professor jobs', href: '/careers/assistant-professor-jobs' },
  { label: 'Professor jobs', href: '/careers/professor-jobs' },
  { label: 'Lecturer jobs', href: '/careers/lecturer-jobs' },
  { label: 'Tutor jobs', href: '/careers/tutor-jobs' },
  { label: 'Principal and leadership jobs', href: '/careers/principal-leadership-jobs' },
  { label: 'Lab and library jobs', href: '/careers/lab-library-jobs' },
  { label: 'Non-teaching jobs', href: '/careers/non-teaching-jobs' },
]

export const otherListPages = (path: string): LandingLink[] => LIST_PAGES.filter(p => p.href !== path)

// `<` is escaped so a job title containing "</script>" cannot close the tag.
const toScript = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')

const pill = 'inline-block rounded-lg border border-border bg-card px-3 py-2 text-primary hover:border-primary'

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32 border-t border-border py-8 sm:py-10">
      <h2 id={`${id}-title`} className="text-2xl font-bold text-foreground">{title}</h2>
      {children}
    </section>
  )
}

/** Contact row shared by every list page's quick-facts table. */
export function CampusContact() {
  return (
    <>
      <a className="font-medium text-primary hover:underline" href={CAMPUS.phoneHref}>{CAMPUS.phone}</a>,{' '}
      <a className="font-medium text-primary hover:underline" href={`mailto:${CAMPUS.email}`}>{CAMPUS.email}</a>
    </>
  )
}

export function JobLanding(props: JobLandingProps) {
  const { groups, tiles, faqs, asOf } = props
  const listed = groups.reduce((n, g) => n + g.jobs.length, 0)
  const jumps: [string, string][] = [
    ['#facts', 'Quick facts'],
    ...(groups.length ? [['#jobs', props.groupsLabel] as [string, string]] : []),
    ...(tiles?.items.length ? [['#more-roles', tiles.label] as [string, string]] : []),
    ['#where', 'Campus location'],
    ['#apply', 'How to apply'],
    ...(faqs.length ? [['#faq', 'Questions'] as [string, string]] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      {props.jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: toScript(data) }} />
      ))}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span aria-hidden="true"> › </span>
          <Link href="/careers" className="hover:text-primary">Careers</Link>
          <span aria-hidden="true"> › </span>
          <span aria-current="page" className="text-foreground">{props.crumb}</span>
        </nav>

        <header className="pb-8 pt-4">
          <h1 className="max-w-4xl font-sans font-bold text-foreground">{props.h1}</h1>
          <p className="mt-4 max-w-3xl text-lg text-foreground/90">{props.intro}</p>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm font-medium">
            {props.chips.map(chip => (
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
          {asOf && <p className="mt-4 text-sm text-muted-foreground">Openings shown as of {asOf}.</p>}
        </header>

        <Section id="facts" title={props.factsTitle}>
          <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm sm:text-base">
              <caption className="sr-only">{props.factsCaption}</caption>
              <tbody>
                {props.facts.map(([label, value]) => (
                  <tr key={label} className="border-t border-border first:border-t-0">
                    <th scope="row" className="w-2/5 bg-primary/10 px-4 py-3 align-top font-semibold text-foreground sm:w-1/3">{label}</th>
                    <td className="px-4 py-3 text-foreground/90">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {!asOf && <div className="border-t border-border py-8"><CareersUnavailable /></div>}

        {groups.length > 0 && (
          <div id="jobs" className="scroll-mt-32 border-t border-border py-8 sm:py-10">
            <p className="max-w-3xl text-foreground/90">
              {props.lead}: {listed} {listed === 1 ? 'opening' : 'openings'}. Select a role to read the full description and apply.
            </p>
            {groups.map(group => (
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

        {tiles && tiles.items.length > 0 && (
          <Section id="more-roles" title={tiles.title}>
            <p className="mt-2 max-w-3xl text-foreground/90">{tiles.intro}</p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tiles.items.map(tile => (
                <li key={tile.key}>
                  <Link
                    href={tile.href}
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
            <h2 id="where-title" className="text-2xl font-bold text-foreground">{props.whereTitle}</h2>
            <p className="mt-3 text-foreground/90">{props.where}</p>
            <address className="mt-4 rounded-xl bg-card px-4 py-3 text-sm not-italic text-foreground/90">
              {CAMPUS.name}, Natarajapuram, NH-544, {CAMPUS.locality}, {CAMPUS.district}, {CAMPUS.region} {CAMPUS.postalCode}
            </address>
          </section>
          <section id="apply" aria-labelledby="apply-title" className="scroll-mt-32 border-t border-border py-8 sm:py-10 lg:border-t-0">
            <h2 id="apply-title" className="text-2xl font-bold text-foreground">{props.applyTitle}</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-foreground/90">
              {APPLY_STEPS.map(step => <li key={step}>{step}</li>)}
            </ol>
          </section>
        </div>

        <Section id="about" title="About JKKN Institutions as an employer">
          <ul className="mt-3 max-w-4xl list-disc space-y-2 pl-5 text-foreground/90">
            {props.aboutFacts.map((fact, i) => <li key={i}>{fact}</li>)}
          </ul>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            {INSTITUTIONS.map(inst => (
              <li key={inst.href}><a href={inst.href} className={pill}>{inst.label}</a></li>
            ))}
            <li><Link href="/contact" className={pill}>Contact JKKN</Link></li>
          </ul>
        </Section>

        {faqs.length > 0 && (
          <Section id="faq" title={props.faqTitle}>
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
          <div className="flex flex-wrap gap-2">
            {props.related.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-foreground/60 px-5 text-sm font-semibold hover:bg-primary-foreground/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/careers"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-background px-5 text-sm font-semibold text-primary hover:bg-background/90"
            >
              All careers <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/** The employer facts every list page shows, as published on the site and in llms.txt. */
export function employerFacts(applyNoun: string): ReactNode[] {
  return [
    `${CAMPUS.name} was established in ${CAMPUS.founded} by the J.K.K. Rangammal Charitable Trust and comprises seven colleges and two schools in ${CAMPUS.locality}, ${CAMPUS.district}, ${CAMPUS.region}.`,
    `The seven JKKN colleges are on one 70-acre campus in ${CAMPUS.locality}, ${CAMPUS.nearestCityKm} km by road from ${CAMPUS.nearestCity} city on NH-544.`,
    `JKKN Matriculation Higher Secondary School, ${CAMPUS.locality}, was founded in 1969 and is a matriculation school recognised by the Government of Tamil Nadu.`,
    `Applications for ${applyNoun} at ${CAMPUS.name}, ${CAMPUS.locality} are submitted online at jkkn.ac.in/careers and do not require an account.`,
  ]
}
