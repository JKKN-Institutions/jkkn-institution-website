'use client'

// Template for a JKKN CMS page-builder block.
// 1. Copy to components/cms-blocks/<category>/<block-name>.tsx
// 2. Replace "FeatureSection" with the PascalCase block name everywhere.
// 3. Every prop MUST have .default(...) and .describe(...).
// 4. Keep the DEFAULT export — the registry lazy-imports it.

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { Award, Rocket, Lightbulb, type LucideIcon } from 'lucide-react'

// --- Repeating-item schema (delete if the block has no list) ---
export const FeatureItemSchema = z.object({
  icon: z.string().describe('Lucide icon name (e.g. "Award")'),
  title: z.string().describe('Item title'),
  description: z.string().optional().describe('Item description'),
})
export type FeatureItem = z.infer<typeof FeatureItemSchema>

// --- Block props schema: every field has a default + describe ---
export const FeatureSectionPropsSchema = z.object({
  title: z.string().default('Section Title').describe('Main heading'),
  subtitle: z.string().default('').describe('Supporting line under the heading'),
  items: z
    .array(FeatureItemSchema)
    .default([
      { icon: 'Award', title: 'Excellence', description: 'Highest standards' },
      { icon: 'Rocket', title: 'Think Big', description: 'Transformative impact' },
    ])
    .describe('List of feature items'),
  // Brand tokens (JKKN): green #0b6d41, gold #ffde59, dark text #171717
  backgroundColor: z.string().default('#ffffff').describe('Section background color'),
  titleColor: z.string().default('#171717').describe('Heading color'),
  accentColor: z.string().default('#0b6d41').describe('Accent / icon color'),
})

export type FeatureSectionProps = z.infer<typeof FeatureSectionPropsSchema> & BaseBlockProps

// Resolve icon name strings -> Lucide components
const iconMap: Record<string, LucideIcon> = { Award, Rocket, Lightbulb }

export default function FeatureSection(props: FeatureSectionProps) {
  // Parse merges incoming props with schema defaults, so missing props are safe.
  const { title, subtitle, items, backgroundColor, titleColor, accentColor } =
    FeatureSectionPropsSchema.parse(props)
  const { className, style } = props

  return (
    <section
      className={cn('w-full py-16 px-4 sm:px-6 lg:px-8', className)}
      style={{ backgroundColor, ...style }}
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: titleColor }}>
            {title}
          </h2>
          {subtitle && <p className="mt-3 text-base sm:text-lg text-muted-foreground">{subtitle}</p>}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Award
            return (
              <div key={i} className="rounded-2xl border p-6 shadow-sm">
                <Icon className="h-8 w-8" style={{ color: accentColor }} aria-hidden />
                <h3 className="mt-4 text-lg font-semibold" style={{ color: titleColor }}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
