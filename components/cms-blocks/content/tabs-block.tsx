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

  return (
    <div className={cn('py-8', className)}>
      <div
        className={cn(
          'flex gap-1',
          variant === 'default' && 'border-b',
          variant === 'pills' && 'gap-2',
          variant === 'underline' && 'border-b'
        )}
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={activeTab === index}
            onClick={() => setActiveTab(index)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              variant === 'default' && '-mb-px border-b-2',
              variant === 'pills' && 'rounded-full',
              variant === 'underline' && '-mb-px border-b-2',
              activeTab === index
                ? variant === 'pills'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-primary text-primary'
                : variant === 'pills'
                  ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-4" role="tabpanel">
        {tabs[activeTab]?.content ? (
          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }}
          />
        ) : (
          <p className="text-muted-foreground">No content</p>
        )}
      </div>
    </div>
  )
}
