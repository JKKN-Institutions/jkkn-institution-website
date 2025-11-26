'use client'

import { cn } from '@/lib/utils'
import type { PricingTablesProps } from '@/lib/cms/registry-types'

export default function PricingTables({
  plans = [],
  columns = 3,
  className,
  isEditing,
}: PricingTablesProps) {
  if (plans.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', className)}>
        <div className="container mx-auto">
          <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground text-center">Click to add pricing plans</p>
          </div>
        </div>
      </section>
    )
  }

  if (plans.length === 0) return null

  return (
    <section className={cn('py-16 px-4', className)}>
      <div className="container mx-auto">
        <div
          className={cn(
            'grid gap-8',
            columns === 2 && 'md:grid-cols-2',
            columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
            columns === 4 && 'md:grid-cols-2 lg:grid-cols-4'
          )}
        >
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                'relative rounded-xl border bg-card p-8',
                plan.highlighted && 'border-primary shadow-lg scale-105'
              )}
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">/{plan.period}</span>
                  )}
                </div>
              </div>
              {plan.features && plan.features.length > 0 && (
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              {plan.cta && (
                <a
                  href={plan.cta.link}
                  target={plan.cta.openInNewTab ? '_blank' : undefined}
                  rel={plan.cta.openInNewTab ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'mt-8 block w-full rounded-md px-4 py-3 text-center text-sm font-medium transition-colors',
                    plan.highlighted
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  )}
                >
                  {plan.cta.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
