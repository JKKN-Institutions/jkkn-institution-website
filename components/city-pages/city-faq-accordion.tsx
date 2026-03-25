'use client'

import { useState } from 'react'
import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityFAQAccordionProps {
  cityConfig: CityPageConfig
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="w-5 h-5"
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
    <section className="py-12 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-poppins text-3xl font-bold text-gray-900 text-center mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-500 text-base max-w-2xl mx-auto">
          Common questions from students in {cityConfig.displayName}
        </p>
        <span className="block w-12 h-1 bg-secondary rounded mx-auto mt-3 mb-6" aria-hidden="true" />

        <div className="space-y-2.5">
          {cityConfig.faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-colors ${
                  isOpen ? 'border-primary/70' : 'border-gray-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full flex justify-between items-center px-5 py-4 bg-transparent border-none cursor-pointer text-sm font-semibold text-gray-900 text-left gap-3 hover:text-primary"
                >
                  <span>{faq.question}</span>
                  <span
                    className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronIcon />
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? '400px' : '0px' }}
                >
                  <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
