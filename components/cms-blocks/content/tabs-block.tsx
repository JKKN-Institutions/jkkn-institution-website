'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { TabsBlockProps } from '@/lib/cms/registry-types'

export default function TabsBlock({
  tabs = [],
  variant = 'default',
  className,
  isEditing,
}: TabsBlockProps) {
  const [activeTab, setActiveTab] = useState(0)

  if (tabs.length === 0 && isEditing) {
    return (
      <div className={cn('py-8', className)}>
        <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <p className="text-muted-foreground text-center">Click to add tabs</p>
        </div>
      </div>
    )
  }

  if (tabs.length === 0) return null

  const isPills = variant === 'pills'

  return (
    <section
      className={cn(
        'relative py-10 md:py-14 px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      <div className="mx-auto max-w-6xl">
        {/* Tab rail */}
        <div className="flex justify-center">
          <div
            role="tablist"
            aria-label="Category tabs"
            className={cn(
              'flex gap-1.5 overflow-x-auto snap-x snap-mandatory',
              '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
              isPills
                ? 'p-1.5 rounded-full bg-[#0b6d41]/5 border border-[#0b6d41]/10 ring-1 ring-inset ring-white/40 max-w-full'
                : 'border-b border-gray-200 w-full justify-start'
            )}
          >
            {tabs.map((tab, index) => {
              const isActive = activeTab === index
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  id={`tab-${index}`}
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${index}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    'snap-start shrink-0 inline-flex items-center gap-2 whitespace-nowrap',
                    'px-4 md:px-5 py-2.5 text-sm md:text-[0.95rem] font-semibold tracking-tight',
                    'transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6d41]/40 focus-visible:ring-offset-2',
                    isPills
                      ? [
                          'rounded-full',
                          isActive
                            ? 'bg-[#0b6d41] text-white shadow-[0_6px_20px_-6px_rgba(11,109,65,0.45)] ring-1 ring-[#ffde59]/60'
                            : 'text-[#0b6d41]/85 hover:bg-white hover:text-[#085032] hover:shadow-sm',
                        ]
                      : [
                          '-mb-px border-b-2',
                          isActive
                            ? 'border-[#0b6d41] text-[#0b6d41]'
                            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300',
                        ]
                  )}
                >
                  {tab.icon && <span className="text-base">{tab.icon}</span>}
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Panel */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="mt-6 md:mt-10"
        >
          {tabs[activeTab]?.content ? (
            <div
              className={cn(
                'text-gray-800',

                // ── Headings (H3 section labels like "Engineering UG") ───────
                '[&_h3]:relative [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:pl-4',
                '[&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#0b6d41] [&_h3]:tracking-tight',
                '[&_h3]:before:content-[""] [&_h3]:before:absolute [&_h3]:before:left-0 [&_h3]:before:top-1 [&_h3]:before:bottom-1 [&_h3]:before:w-[4px] [&_h3]:before:rounded-full',
                '[&_h3]:before:bg-gradient-to-b [&_h3]:before:from-[#0b6d41] [&_h3]:before:to-[#ffde59]',
                '[&>h3:first-child]:mt-0',

                // ── Paragraphs / notes ───────────────────────────────────────
                '[&_p]:text-sm md:[&_p]:text-[0.95rem] [&_p]:leading-relaxed [&_p]:text-gray-600 [&_p]:mb-4',
                '[&_p_em]:not-italic [&_p_em]:block [&_p_em]:rounded-lg [&_p_em]:bg-amber-50 [&_p_em]:border [&_p_em]:border-amber-200/60 [&_p_em]:px-4 [&_p_em]:py-2.5 [&_p_em]:text-[0.85rem] [&_p_em]:text-amber-900',

                // ── Table container ──────────────────────────────────────────
                '[&_table]:block md:[&_table]:table [&_table]:w-full [&_table]:my-5',
                '[&_table]:overflow-x-auto md:[&_table]:overflow-visible',
                '[&_table]:rounded-2xl [&_table]:border [&_table]:border-[#0b6d41]/10 [&_table]:bg-white',
                '[&_table]:shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(11,109,65,0.12)]',
                '[&_table]:border-separate [&_table]:border-spacing-0',

                // ── Table header ─────────────────────────────────────────────
                '[&_thead]:bg-gradient-to-r [&_thead]:from-[#0b6d41]/[0.08] [&_thead]:to-[#0b6d41]/[0.03]',
                '[&_th]:px-4 md:[&_th]:px-5 [&_th]:py-3.5',
                '[&_th]:text-left [&_th]:font-semibold [&_th]:text-[#085032]',
                '[&_th]:text-[0.72rem] [&_th]:uppercase [&_th]:tracking-[0.09em]',
                '[&_th]:whitespace-nowrap',
                '[&_thead_th]:border-b [&_thead_th]:border-[#0b6d41]/15',

                // ── Body rows ────────────────────────────────────────────────
                '[&_tbody_tr]:transition-colors',
                '[&_tbody_tr:nth-child(even)]:bg-gray-50/70',
                '[&_tbody_tr:hover]:bg-[#0b6d41]/[0.04]',
                '[&_td]:px-4 md:[&_td]:px-5 [&_td]:py-3.5 [&_td]:text-sm [&_td]:text-gray-700',
                '[&_td]:border-b [&_td]:border-gray-100',
                '[&_tbody_tr:last-child_td]:border-b-0',
                '[&_tbody_tr:last-child_td:first-child]:rounded-bl-2xl',
                '[&_tbody_tr:last-child_td:last-child]:rounded-br-2xl',

                // ── Column emphasis ──────────────────────────────────────────
                // First col (Program) — bold, dark
                '[&_tbody_td:first-child]:font-semibold [&_tbody_td:first-child]:text-gray-900',
                // 2nd col (Government Quota) — muted numeric
                '[&_td:nth-child(2)]:text-right [&_th:nth-child(2)]:text-right',
                '[&_td:nth-child(2)]:tabular-nums [&_td:nth-child(2)]:text-gray-600 [&_td:nth-child(2)]:font-medium',
                // 3rd col (Management Quota) — branded numeric
                '[&_td:nth-child(3)]:text-right [&_th:nth-child(3)]:text-right',
                '[&_td:nth-child(3)]:tabular-nums [&_td:nth-child(3)]:font-bold [&_td:nth-child(3)]:text-[#0b6d41]',
                // 4th col (Remarks) — small italic
                '[&_td:nth-child(4)]:text-[0.8rem] [&_td:nth-child(4)]:text-gray-500 [&_td:nth-child(4)]:italic',
                '[&_th:nth-child(4)]:text-right [&_td:nth-child(4)]:text-right'
              )}
              dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }}
            />
          ) : (
            <p className="text-gray-500">No content</p>
          )}
        </div>
      </div>
    </section>
  )
}
