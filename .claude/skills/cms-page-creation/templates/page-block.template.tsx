// Template: CMS page block component
// Replace {PageName} with PascalCase name (e.g., FacilityPage)
// Replace {page-name} with kebab-case filename (e.g., facility-page)
// Save to: components/cms-blocks/content/{page-name}.tsx

import { z } from 'zod'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────
// Schema (single source of truth for props)
// ─────────────────────────────────────────────

export const CtaButtonSchema = z.object({
  label: z.string().describe('Button label'),
  href: z.string().describe('Destination URL or path'),
  variant: z.enum(['primary', 'secondary', 'ghost']).default('primary').describe('Visual style'),
})

export const {PageName}Schema = z.object({
  hero: z.object({
    eyebrow: z.string().optional().describe('Small text above heading'),
    title: z.string().describe('Main heading (h1)'),
    subtitle: z.string().optional().describe('Supporting paragraph'),
    backgroundImage: z.string().describe('Hero background image URL or path'),
    ctas: z.array(CtaButtonSchema).default([]).describe('Call-to-action buttons'),
  }),
  intro: z.string().optional().describe('Introductory paragraph below hero'),
  features: z.array(z.object({
    icon: z.string().describe('Lucide icon name'),
    title: z.string(),
    description: z.string(),
  })).default([]),
  gallery: z.array(z.string()).default([]).describe('Gallery image URLs'),
})

export type {PageName}Props = z.infer<typeof {PageName}Schema>

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function {PageName}(props: {PageName}Props) {
  const parsed = {PageName}Schema.parse(props)
  const { hero, intro, features, gallery } = parsed

  return (
    <article className="flex flex-col gap-16 md:gap-24">
      {/* Hero */}
      <section
        className="relative flex min-h-[60vh] items-center overflow-hidden"
        aria-labelledby="page-hero-title"
      >
        <Image
          src={hero.backgroundImage}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/60 dark:bg-background/70" />
        <div className="container relative z-10 mx-auto px-4 py-16">
          {hero.eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
              {hero.eyebrow}
            </p>
          )}
          <h1
            id="page-hero-title"
            className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl"
          >
            {hero.title}
          </h1>
          {hero.subtitle && (
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {hero.subtitle}
            </p>
          )}
          {hero.ctas.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {hero.ctas.map((cta, idx) => (
                <a
                  key={idx}
                  href={cta.href}
                  className={cn(
                    'inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium transition-colors',
                    cta.variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    cta.variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                    cta.variant === 'ghost' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  {cta.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Intro */}
      {intro && (
        <section className="container mx-auto px-4">
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {intro}
          </p>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="container mx-auto px-4" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="container mx-auto px-4" aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className="mb-6 text-2xl font-semibold">Gallery</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {gallery.map((src, idx) => (
              <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
