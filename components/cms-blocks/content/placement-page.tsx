'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { z } from 'zod'
import {
  Briefcase,
  TrendingUp,
  Users,
  Award,
  Target,
  MessageSquare,
  Mic2,
  Code2,
  Phone,
  Mail,
  MapPin,
  Quote,
} from 'lucide-react'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

const ICON_MAP = {
  Briefcase, TrendingUp, Users, Award, Target, MessageSquare, Mic2, Code2,
} as const

type IconKey = keyof typeof ICON_MAP

export const PlacementPageSchema = z.object({
  hero: z.object({
    eyebrow: z.string().default('Career & Placement'),
    title: z.string().default('Launching Careers, Building Futures'),
    subtitle: z.string().default(
      'Our Placement Cell connects students with leading recruiters across technology, core engineering, and research — backed by rigorous training and a thriving alumni network.'
    ),
    backgroundImage: z.string().default('/images/engineering/placement-hero.jpg'),
  }),
  stats: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      icon: z.enum(['Briefcase', 'TrendingUp', 'Users', 'Award', 'Target', 'MessageSquare', 'Mic2', 'Code2']),
    })
  ).default([
    { label: 'Placement Rate', value: '95%', icon: 'Target' },
    { label: 'Highest Package', value: '₹24 LPA', icon: 'TrendingUp' },
    { label: 'Average Package', value: '₹6.2 LPA', icon: 'Briefcase' },
    { label: 'Recruiters', value: '150+', icon: 'Users' },
  ]),
  trainingTitle: z.string().default('Training & Preparation'),
  trainingSubtitle: z.string().default(
    'A structured, multi-year programme that prepares every student for competitive recruitment.'
  ),
  training: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.enum(['Briefcase', 'TrendingUp', 'Users', 'Award', 'Target', 'MessageSquare', 'Mic2', 'Code2']),
    })
  ).default([
    { title: 'Aptitude & Reasoning', description: 'Quantitative, logical, and verbal aptitude drills modelled on real recruiter assessments.', icon: 'Target' },
    { title: 'Technical Bootcamps', description: 'Core CS, data structures, and domain-specific coding practice across languages.', icon: 'Code2' },
    { title: 'Mock Interviews', description: 'HR and technical mock panels with feedback from industry mentors and alumni.', icon: 'MessageSquare' },
    { title: 'Soft Skills & Communication', description: 'Group discussions, presentations, and business communication workshops.', icon: 'Mic2' },
  ]),
  recruitersTitle: z.string().default('Top Recruiters'),
  recruiters: z.array(
    z.object({
      name: z.string(),
      logo: z.string(),
    })
  ).default([]),
  recordTitle: z.string().default('Year-wise Placement Record'),
  record: z.array(
    z.object({
      year: z.string(),
      offers: z.string(),
      highest: z.string(),
      average: z.string(),
    })
  ).default([
    { year: '2024-25', offers: '520+', highest: '₹24 LPA', average: '₹6.2 LPA' },
    { year: '2023-24', offers: '480+', highest: '₹19 LPA', average: '₹5.8 LPA' },
    { year: '2022-23', offers: '440+', highest: '₹17 LPA', average: '₹5.4 LPA' },
  ]),
  testimonialsTitle: z.string().default('Success Stories'),
  testimonials: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      company: z.string(),
      quote: z.string(),
      photo: z.string().optional(),
    })
  ).default([]),
  placementCell: z.object({
    title: z.string().default('Placement Cell'),
    head: z.string().default('Head of Placements'),
    phone: z.string().default('+91 98765 43210'),
    email: z.string().default('placements@jkkn.ac.in'),
    address: z.string().default('JKKN College of Engineering & Technology, Kumarapalayam, Tamil Nadu'),
  }).default({}),
  recruiterCta: z.object({
    title: z.string().default('Hire from JKKN Engineering'),
    description: z.string().default('Partner with us to access a trained, industry-ready talent pool.'),
    buttonLabel: z.string().default('Contact Placement Cell'),
    buttonHref: z.string().default('mailto:placements@jkkn.ac.in'),
  }).default({}),
})

export type PlacementPageProps = z.infer<typeof PlacementPageSchema>

export function PlacementPage(rawProps: PlacementPageProps) {
  const props = PlacementPageSchema.parse(rawProps)
  const { hero, stats, training, trainingTitle, trainingSubtitle, recruiters, recruitersTitle, record, recordTitle, testimonials, testimonialsTitle, placementCell, recruiterCta } = props

  return (
    <article className="flex flex-col bg-[#fbfbee] dark:bg-gray-950">
      {/* HERO */}
      <section
        className="relative flex min-h-[70vh] items-center overflow-hidden"
        aria-labelledby="placement-hero-title"
      >
        <Image
          src={hero.backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b6d41]/90 via-[#0b6d41]/75 to-[#0b6d41]/40 dark:from-black/90 dark:via-black/80 dark:to-black/50" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mb-3 inline-block rounded-full bg-[#ffde59] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0b6d41]">
            {hero.eyebrow}
          </p>
          <h1
            id="placement-hero-title"
            className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
          >
            {hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/90 md:text-xl">
            {hero.subtitle}
          </p>

          {/* Stat strip */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, idx) => {
              const Icon = ICON_MAP[stat.icon as IconKey] ?? Briefcase
              return (
                <StatCard key={idx} label={stat.label} value={stat.value} Icon={Icon} index={idx} />
              )
            })}
          </div>
        </div>
      </section>

      {/* TRAINING */}
      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="training-heading">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="training-heading" className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            {trainingTitle}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{trainingSubtitle}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {training.map((item, idx) => {
            const Icon = ICON_MAP[item.icon as IconKey] ?? Target
            return (
              <TrainingCard key={idx} title={item.title} description={item.description} Icon={Icon} index={idx} />
            )
          })}
        </div>
      </section>

      {/* RECRUITERS */}
      {recruiters.length > 0 && (
        <section className="bg-white py-16 dark:bg-gray-900 lg:py-24" aria-labelledby="recruiters-heading">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="recruiters-heading" className="text-center text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              {recruitersTitle}
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {recruiters.map((r, idx) => (
                <div
                  key={idx}
                  className="flex aspect-[3/2] items-center justify-center rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                >
                  <Image
                    src={r.logo}
                    alt={r.name}
                    width={120}
                    height={60}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* YEAR-WISE RECORD */}
      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="record-heading">
        <h2 id="record-heading" className="text-center text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
          {recordTitle}
        </h2>
        <div className="mx-auto mt-10 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full text-left text-sm md:text-base">
            <thead className="bg-[#0b6d41] text-white">
              <tr>
                <th scope="col" className="px-4 py-4 font-semibold md:px-6">Academic Year</th>
                <th scope="col" className="px-4 py-4 font-semibold md:px-6">Offers</th>
                <th scope="col" className="px-4 py-4 font-semibold md:px-6">Highest Package</th>
                <th scope="col" className="px-4 py-4 font-semibold md:px-6">Average Package</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {record.map((row) => (
                <tr key={row.year} className="transition-colors hover:bg-[#fbfbee] dark:hover:bg-gray-800">
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-white md:px-6">{row.year}</td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300 md:px-6">{row.offers}</td>
                  <td className="px-4 py-4 text-[#0b6d41] font-semibold dark:text-[#ffde59] md:px-6">{row.highest}</td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300 md:px-6">{row.average}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-white py-16 dark:bg-gray-900 lg:py-24" aria-labelledby="testimonials-heading">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="testimonials-heading" className="text-center text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              {testimonialsTitle}
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, idx) => (
                <figure
                  key={idx}
                  className="relative rounded-2xl border border-gray-100 bg-[#fbfbee] p-6 dark:border-gray-800 dark:bg-gray-950"
                >
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-[#ffde59]" aria-hidden="true" />
                  <blockquote className="text-gray-700 dark:text-gray-200">"{t.quote}"</blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    {t.photo && (
                      <Image
                        src={t.photo}
                        alt={t.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t.role} · {t.company}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PLACEMENT CELL CONTACT */}
      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="cell-heading">
        <div className="grid gap-8 rounded-3xl bg-[#0b6d41] p-8 text-white md:grid-cols-2 md:p-12">
          <div>
            <h2 id="cell-heading" className="text-3xl font-bold md:text-4xl">{placementCell.title}</h2>
            <p className="mt-3 text-white/90">{placementCell.head}</p>
          </div>
          <dl className="space-y-4">
            <ContactRow Icon={Phone} label="Phone" value={placementCell.phone} href={`tel:${placementCell.phone.replace(/\s/g, '')}`} />
            <ContactRow Icon={Mail} label="Email" value={placementCell.email} href={`mailto:${placementCell.email}`} />
            <ContactRow Icon={MapPin} label="Address" value={placementCell.address} />
          </dl>
        </div>
      </section>

      {/* RECRUITER CTA */}
      <section className="bg-[#ffde59] py-16 lg:py-20" aria-labelledby="recruiter-cta-heading">
        <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 id="recruiter-cta-heading" className="text-3xl font-bold text-[#0b6d41] md:text-4xl">
            {recruiterCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-800">{recruiterCta.description}</p>
          <a
            href={recruiterCta.buttonHref}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#0b6d41] px-8 py-4 text-base font-semibold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-[#095533] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0b6d41]/40"
          >
            {recruiterCta.buttonLabel}
          </a>
        </div>
      </section>
    </article>
  )
}

function StatCard({ label, value, Icon, index }: { label: string; value: string; Icon: typeof Briefcase; index: number }) {
  const { ref, isInView } = useInView(0.2)
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm transition-all duration-500 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Icon className="h-6 w-6 text-[#ffde59]" aria-hidden="true" />
      <div className="mt-3 text-3xl font-bold text-white md:text-4xl">{value}</div>
      <div className="mt-1 text-sm text-white/80">{label}</div>
    </div>
  )
}

function TrainingCard({ title, description, Icon, index }: { title: string; description: string; Icon: typeof Briefcase; index: number }) {
  const { ref, isInView } = useInView(0.15)
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b6d41]/10 text-[#0b6d41] transition-colors group-hover:bg-[#0b6d41] group-hover:text-white dark:bg-[#ffde59]/10 dark:text-[#ffde59]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

function ContactRow({ Icon, label, value, href }: { Icon: typeof Phone; label: string; value: string; href?: string }) {
  const content = (
    <>
      <dt className="sr-only">{label}</dt>
      <dd className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#ffde59]" aria-hidden="true" />
        <span className="text-white/95">{value}</span>
      </dd>
    </>
  )
  return href ? (
    <a href={href} className="block rounded-md transition-colors hover:text-[#ffde59] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffde59]">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  )
}

export default PlacementPage
