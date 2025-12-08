'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface TabItem {
  value: string
  label: string
  content: string
}

export interface ShadcnTabsBlockProps {
  tabs?: TabItem[]
  defaultValue?: string
}

export function ShadcnTabsBlock({
  tabs = [],
  defaultValue,
}: ShadcnTabsBlockProps) {
  if (tabs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tabs configured. Add tabs in the properties panel.
      </div>
    )
  }

  const defaultTab = defaultValue || tabs[0]?.value

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="w-full justify-start">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4">
          <p>{tab.content}</p>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default ShadcnTabsBlock
