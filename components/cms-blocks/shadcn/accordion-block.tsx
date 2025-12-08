'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface AccordionItemData {
  trigger: string
  content: string
}

export interface ShadcnAccordionBlockProps {
  items?: AccordionItemData[]
  type?: 'single' | 'multiple'
  collapsible?: boolean
}

export function ShadcnAccordionBlock({
  items = [],
  type = 'single',
  collapsible = true,
}: ShadcnAccordionBlockProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No accordion items configured. Add items in the properties panel.
      </div>
    )
  }

  if (type === 'single') {
    return (
      <Accordion type="single" collapsible={collapsible} className="w-full">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.trigger}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  return (
    <Accordion type="multiple" className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default ShadcnAccordionBlock
