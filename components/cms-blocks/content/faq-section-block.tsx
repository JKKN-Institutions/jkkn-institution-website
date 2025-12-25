'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react'
import type { FAQSectionProps, FAQItem } from '@/lib/cms/registry-types'
import { DecorativePatterns, CurveDivider } from '../shared/decorative-patterns'

// Category configuration with labels
const CATEGORIES = [
  { key: 'general', label: 'General' },
  { key: 'admissions', label: 'Admissions' },
  { key: 'academics', label: 'Academics' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'placements', label: 'Placements' },
  { key: 'fees', label: 'Fees & Scholarships' },
] as const

type CategoryKey = (typeof CATEGORIES)[number]['key']

export default function FAQSectionBlock({
  badge = 'FAQ',
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know about JKKN Institutions',
  faqs = [],
  showCTA = false,
  ctaTitle = 'Still have questions?',
  ctaDescription = "Can't find the answer you're looking for? Our admissions team is here to help.",
  ctaPhone = '+91 422 266 1100',
  ctaEmail = 'info@jkkn.ac.in',
  backgroundColor = 'gradient-dark',
  showAnimations = true,
  isEditing = false,
}: FAQSectionProps) {
  const [isVisible, setIsVisible] = useState(!showAnimations || isEditing)
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('general')
  const [openItem, setOpenItem] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Parse title into headerPart1 and headerPart2 for gold italic effect
  const titleParts = useMemo(() => {
    const words = title.split(' ')
    if (words.length >= 2) {
      // Last word gets gold italic styling
      const lastWord = words.pop()
      return {
        part1: words.join(' '),
        part2: lastWord || ''
      }
    }
    return { part1: title, part2: '' }
  }, [title])

  useEffect(() => {
    if (!showAnimations || isEditing) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [showAnimations, isEditing])

  // Filter FAQs by category
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => (faq.category || 'general') === activeCategory)
  }, [faqs, activeCategory])

  // Get categories that have FAQs
  const availableCategories = useMemo(() => {
    const categorySet = new Set(faqs.map((faq) => faq.category || 'general'))
    return CATEGORIES.filter((cat) => categorySet.has(cat.key))
  }, [faqs])

  // Reset open item when category changes
  useEffect(() => {
    setOpenItem(null)
  }, [activeCategory])

  // Auto-select first available category
  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.find((c) => c.key === activeCategory)) {
      setActiveCategory(availableCategories[0].key)
    }
  }, [availableCategories, activeCategory])

  // Get category label
  const activeCategoryLabel = CATEGORIES.find((c) => c.key === activeCategory)?.label || 'General'

  const isDark = backgroundColor !== 'gradient-light'

  // If no FAQs and in editing mode, show placeholder
  if (faqs.length === 0 && isEditing) {
    return (
      <section className="relative py-24 lg:py-32 overflow-hidden section-green-gradient">
        <DecorativePatterns variant="minimal" color="white" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto p-8 border-2 border-dashed border-white/30 rounded-2xl bg-white/5 backdrop-blur-sm">
            <p className="text-white/60 text-center">
              Click to add FAQ items in the properties panel
            </p>
          </div>
        </div>
      </section>
    )
  }

  // If no FAQs and not editing, don't render
  if (faqs.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative w-full overflow-hidden py-16 md:py-20 lg:py-28',
        isDark ? 'section-green-gradient' : 'bg-brand-cream'
      )}
    >
      {/* Decorative Patterns */}
      <DecorativePatterns variant="minimal" color={isDark ? 'white' : 'green'} />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        {/* Section Header - Matching other sections */}
        <div
          className={cn(
            'text-center mb-12 md:mb-16',
            showAnimations && 'transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          <h2 className={cn(
            'font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            {titleParts.part1}{' '}
            <span className={isDark ? "text-gold-italic" : "text-green-accent"}>
              {titleParts.part2}
            </span>
          </h2>
          {subtitle && (
            <p className={cn(
              'text-base sm:text-lg md:text-xl max-w-3xl mx-auto',
              isDark ? 'text-white/70' : 'text-gray-600'
            )}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Two Column Layout with Glassmorphism */}
        <div
          className={cn(
            'max-w-6xl mx-auto',
            showAnimations && 'transition-all duration-700 delay-200',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Left Sidebar - Categories with Glassmorphism */}
            <nav className="lg:w-56 flex-shrink-0">
              <div className={cn(
                'rounded-2xl p-4 lg:p-5',
                isDark
                  ? 'bg-white/5 backdrop-blur-md border border-white/10'
                  : 'bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg'
              )}>
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <HelpCircle className={cn(
                    'w-5 h-5',
                    isDark ? 'text-gold' : 'text-primary'
                  )} />
                  <span className={cn(
                    'text-sm font-semibold uppercase tracking-wider',
                    isDark ? 'text-white/80' : 'text-gray-700'
                  )}>
                    Categories
                  </span>
                </div>

                <ul className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1 lg:mx-0 lg:px-0">
                  {availableCategories.map((category) => (
                    <li key={category.key}>
                      <button
                        onClick={() => setActiveCategory(category.key)}
                        className={cn(
                          'whitespace-nowrap lg:whitespace-normal text-left w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                          activeCategory === category.key
                            ? isDark
                              ? 'bg-gold text-gray-900 shadow-lg shadow-gold/20'
                              : 'bg-primary text-white shadow-lg shadow-primary/20'
                            : isDark
                            ? 'text-white/70 hover:text-white hover:bg-white/10'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        )}
                      >
                        {category.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Right Content - FAQ Accordion with Glassmorphism */}
            <div className="flex-1 min-w-0">
              <div className={cn(
                'rounded-2xl p-5 lg:p-8',
                isDark
                  ? 'bg-white/5 backdrop-blur-md border border-white/10'
                  : 'bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg'
              )}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className={cn(
                    'p-2.5 rounded-xl',
                    isDark ? 'bg-gold/20' : 'bg-primary/10'
                  )}>
                    <MessageCircle className={cn(
                      'w-5 h-5',
                      isDark ? 'text-gold' : 'text-primary'
                    )} />
                  </div>
                  <h3 className={cn(
                    'text-xl font-serif-heading font-semibold',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}>
                    {activeCategoryLabel} <span className={isDark ? 'text-gold' : 'text-primary'}>Questions</span>
                  </h3>
                </div>

                {/* FAQ Items */}
                <div className="space-y-0">
                  {filteredFaqs.map((faq, index) => (
                    <FAQAccordionItem
                      key={`${activeCategory}-${index}`}
                      faq={faq}
                      index={index}
                      isOpen={openItem === index}
                      onToggle={() => setOpenItem(openItem === index ? null : index)}
                      isDark={isDark}
                      isLast={index === filteredFaqs.length - 1}
                    />
                  ))}

                  {filteredFaqs.length === 0 && (
                    <p className={cn(
                      'text-center py-8',
                      isDark ? 'text-white/50' : 'text-gray-400'
                    )}>
                      No questions in this category yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA with Glassmorphism */}
        {showCTA && (
          <div
            className={cn(
              'text-center mt-12 lg:mt-16',
              showAnimations && 'transition-all duration-700 delay-400',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            )}
          >
            <div className={cn(
              'max-w-xl mx-auto p-8 rounded-2xl',
              isDark
                ? 'bg-white/5 backdrop-blur-md border border-white/10'
                : 'bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg'
            )}>
              <h3 className={cn(
                'text-xl font-serif-heading font-semibold mb-2',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                {ctaTitle}
              </h3>
              <p className={cn(
                'text-sm mb-6',
                isDark ? 'text-white/60' : 'text-gray-600'
              )}>
                {ctaDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {ctaPhone && (
                  <a
                    href={`tel:${ctaPhone.replace(/\s/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-gray-900 bg-gold hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-gold/20"
                  >
                    Call {ctaPhone}
                  </a>
                )}
                {ctaEmail && (
                  <a
                    href={`mailto:${ctaEmail}`}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border-2 transition-all duration-300',
                      isDark
                        ? 'text-white border-white/30 hover:bg-white/10 hover:border-white/50'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                    )}
                  >
                    Email Us
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Curved Bottom Divider */}
      <CurveDivider position="bottom" color="#fbfbee" />
    </section>
  )
}

// Individual FAQ Item Component with custom accordion
interface FAQAccordionItemProps {
  faq: FAQItem
  index: number
  isOpen: boolean
  onToggle: () => void
  isDark: boolean
  isLast: boolean
}

function FAQAccordionItem({
  faq,
  index,
  isOpen,
  onToggle,
  isDark,
  isLast,
}: FAQAccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  return (
    <div
      className={cn(
        'border-b transition-colors duration-200',
        isDark ? 'border-white/10' : 'border-gray-200',
        isLast && 'border-b-0'
      )}
    >
      {/* Question Button */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            'text-base font-medium pr-4 transition-colors duration-200',
            isOpen
              ? isDark
                ? 'text-gold'
                : 'text-primary'
              : isDark
              ? 'text-white group-hover:text-gold'
              : 'text-gray-900 group-hover:text-primary'
          )}
        >
          {faq.question}
        </span>

        {/* Circular Plus/Minus Button with Glassmorphism */}
        <div
          className={cn(
            'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300',
            isOpen
              ? isDark
                ? 'bg-gold text-gray-900 shadow-lg shadow-gold/30'
                : 'bg-primary text-white shadow-lg shadow-primary/30'
              : isDark
              ? 'bg-white/10 text-white/60 group-hover:bg-white/20 backdrop-blur-sm'
              : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
          )}
        >
          {isOpen ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Answer Content */}
      <div
        style={{ height }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div ref={contentRef} className="pb-5">
          <p
            className={cn(
              'text-sm leading-relaxed pr-12',
              isDark ? 'text-white/60' : 'text-gray-600'
            )}
          >
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  )
}
