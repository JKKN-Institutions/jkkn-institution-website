'use client'

import { useState } from 'react'
import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityFAQAccordionProps {
  cityConfig: CityPageConfig
}

function ChevronIcon() {
  return (
    <svg
      className="faq-chevron"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CityFAQAccordion({ cityConfig }: CityFAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="section bg-white">
      <div className="section-inner">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">
          Common questions from students in {cityConfig.displayName}
        </p>
        <span className="section-accent" aria-hidden="true" />
        <div className="section-spacer" />

        <div className="faq-list">
          {cityConfig.faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`faq-item${isOpen ? ' active' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="faq-question"
                >
                  <span>{faq.question}</span>
                  <ChevronIcon />
                </button>

                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
