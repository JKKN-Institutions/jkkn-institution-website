'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { FAQAccordionProps } from '@/lib/cms/registry-types'

export default function FAQAccordion({
  faqs = [],
  searchEnabled = true,
  allowMultiple = false,
  className,
  isEditing,
}: FAQAccordionProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setExpandedItems(prev =>
        prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index]
      )
    } else {
      setExpandedItems(prev =>
        prev.includes(index) ? [] : [index]
      )
    }
  }

  const filteredFaqs = searchQuery
    ? faqs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs

  if (faqs.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', className)}>
        <div className="container mx-auto max-w-3xl">
          <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground text-center">Click to add FAQ items</p>
          </div>
        </div>
      </section>
    )
  }

  if (faqs.length === 0) return null

  return (
    <section className={cn('py-16 px-4', className)}>
      <div className="container mx-auto max-w-3xl">
        {searchEnabled && (
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
        <div className="space-y-4">
          {filteredFaqs.map((item, index) => {
            const isExpanded = expandedItems.includes(index)
            return (
              <div
                key={index}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors"
                  aria-expanded={isExpanded}
                >
                  <span>{item.question}</span>
                  <svg
                    className={cn(
                      'w-5 h-5 transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* CSS Grid animation to prevent CLS */}
                <div
                  className="grid transition-[grid-template-rows] duration-200 ease-out"
                  style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 pt-0 text-muted-foreground">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
