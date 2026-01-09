import {
  Table,
  Calendar,
  DollarSign,
  GitCompare,
  Clock,
  type LucideIcon,
} from 'lucide-react'

export interface TableTemplate {
  id: string
  name: string
  description: string
  category: 'data' | 'calendar' | 'pricing' | 'comparison' | 'timeline'
  icon: LucideIcon
  rows: number
  cols: number
  content: any // TipTap JSON content
}

// Helper function to create empty paragraph content
const emptyParagraph = () => ({
  type: 'paragraph',
  content: [{ type: 'text', text: '' }],
})

// Helper function to create text paragraph
const textParagraph = (text: string) => ({
  type: 'paragraph',
  content: [{ type: 'text', text }],
})

// Helper function to create table header cell
const headerCell = (text: string) => ({
  type: 'tableHeader',
  attrs: {},
  content: [textParagraph(text)],
})

// Helper function to create table cell
const tableCell = (text: string = '') => ({
  type: 'tableCell',
  attrs: {},
  content: [text ? textParagraph(text) : emptyParagraph()],
})

// 1. Data Table Template
const dataTableTemplate: TableTemplate = {
  id: 'data-table',
  name: 'Data Table',
  description: 'Basic table for data presentation with headers and alternating rows',
  category: 'data',
  icon: Table,
  rows: 6,
  cols: 4,
  content: {
    type: 'table',
    attrs: {
      class: 'table-striped',
    },
    content: [
      // Header row
      {
        type: 'tableRow',
        content: [
          headerCell('Column 1'),
          headerCell('Column 2'),
          headerCell('Column 3'),
          headerCell('Column 4'),
        ],
      },
      // Data rows
      ...Array.from({ length: 5 }, (_, i) => ({
        type: 'tableRow',
        content: [
          tableCell(`Row ${i + 1} Col 1`),
          tableCell(`Row ${i + 1} Col 2`),
          tableCell(`Row ${i + 1} Col 3`),
          tableCell(`Row ${i + 1} Col 4`),
        ],
      })),
    ],
  },
}

// 2. Month Calendar Template
const monthCalendarTemplate: TableTemplate = {
  id: 'month-calendar',
  name: 'Month Calendar',
  description: '7×6 calendar grid for monthly events and schedules',
  category: 'calendar',
  icon: Calendar,
  rows: 6,
  cols: 7,
  content: {
    type: 'table',
    attrs: {
      class: 'calendar-table',
    },
    content: [
      // Days of week header
      {
        type: 'tableRow',
        content: [
          headerCell('Mon'),
          headerCell('Tue'),
          headerCell('Wed'),
          headerCell('Thu'),
          headerCell('Fri'),
          headerCell('Sat'),
          headerCell('Sun'),
        ],
      },
      // Week rows (5 weeks)
      ...Array.from({ length: 5 }, (_, weekIndex) => ({
        type: 'tableRow',
        content: Array.from({ length: 7 }, (_, dayIndex) => {
          const dayNumber = weekIndex * 7 + dayIndex + 1
          return dayNumber <= 31 ? tableCell(dayNumber.toString()) : tableCell('')
        }),
      })),
    ],
  },
}

// 3. Pricing Table Template
const pricingTableTemplate: TableTemplate = {
  id: 'pricing-table',
  name: 'Pricing Table',
  description: 'Compare pricing plans with features and call-to-action',
  category: 'pricing',
  icon: DollarSign,
  rows: 8,
  cols: 3,
  content: {
    type: 'table',
    attrs: {
      class: 'pricing-table',
    },
    content: [
      // Plan names
      {
        type: 'tableRow',
        content: [
          headerCell('Basic'),
          headerCell('Pro'),
          headerCell('Enterprise'),
        ],
      },
      // Price row
      {
        type: 'tableRow',
        content: [
          tableCell('$9/month'),
          tableCell('$29/month'),
          tableCell('$99/month'),
        ],
      },
      // Feature rows
      {
        type: 'tableRow',
        content: [
          tableCell('✓ Feature 1'),
          tableCell('✓ Feature 1'),
          tableCell('✓ Feature 1'),
        ],
      },
      {
        type: 'tableRow',
        content: [
          tableCell('✓ Feature 2'),
          tableCell('✓ Feature 2'),
          tableCell('✓ Feature 2'),
        ],
      },
      {
        type: 'tableRow',
        content: [
          tableCell('✗ Feature 3'),
          tableCell('✓ Feature 3'),
          tableCell('✓ Feature 3'),
        ],
      },
      {
        type: 'tableRow',
        content: [
          tableCell('✗ Feature 4'),
          tableCell('✓ Feature 4'),
          tableCell('✓ Feature 4'),
        ],
      },
      {
        type: 'tableRow',
        content: [
          tableCell('✗ Feature 5'),
          tableCell('✗ Feature 5'),
          tableCell('✓ Feature 5'),
        ],
      },
      // CTA row
      {
        type: 'tableRow',
        content: [
          tableCell('Get Started'),
          tableCell('Get Started'),
          tableCell('Contact Sales'),
        ],
      },
    ],
  },
}

// 4. Comparison Table Template
const comparisonTableTemplate: TableTemplate = {
  id: 'comparison-table',
  name: 'Comparison Table',
  description: 'Compare products or options side-by-side',
  category: 'comparison',
  icon: GitCompare,
  rows: 7,
  cols: 4,
  content: {
    type: 'table',
    attrs: {
      class: 'comparison-table',
    },
    content: [
      // Header row with product names
      {
        type: 'tableRow',
        content: [
          headerCell('Feature'),
          headerCell('Product A'),
          headerCell('Product B'),
          headerCell('Product C'),
        ],
      },
      // Feature comparison rows
      {
        type: 'tableRow',
        content: [
          tableCell('Price'),
          tableCell('$99'),
          tableCell('$149'),
          tableCell('$199'),
        ],
      },
      {
        type: 'tableRow',
        content: [
          tableCell('Storage'),
          tableCell('10 GB'),
          tableCell('50 GB'),
          tableCell('Unlimited'),
        ],
      },
      {
        type: 'tableRow',
        content: [
          tableCell('Users'),
          tableCell('5'),
          tableCell('25'),
          tableCell('Unlimited'),
        ],
      },
      {
        type: 'tableRow',
        content: [
          tableCell('Support'),
          tableCell('Email'),
          tableCell('Email + Chat'),
          tableCell('24/7 Phone'),
        ],
      },
      {
        type: 'tableRow',
        content: [
          tableCell('API Access'),
          tableCell('✗'),
          tableCell('✓'),
          tableCell('✓'),
        ],
      },
      {
        type: 'tableRow',
        content: [
          tableCell('Custom Domain'),
          tableCell('✗'),
          tableCell('✓'),
          tableCell('✓'),
        ],
      },
    ],
  },
}

// 5. Timeline Table Template
const timelineTableTemplate: TableTemplate = {
  id: 'timeline-table',
  name: 'Timeline Table',
  description: 'Chronological events and milestones',
  category: 'timeline',
  icon: Clock,
  rows: 8,
  cols: 2,
  content: {
    type: 'table',
    attrs: {
      class: 'timeline-table',
    },
    content: [
      // Header row
      {
        type: 'tableRow',
        content: [headerCell('Date'), headerCell('Event')],
      },
      // Timeline rows
      {
        type: 'tableRow',
        content: [tableCell('January 2024'), tableCell('Project kickoff meeting')],
      },
      {
        type: 'tableRow',
        content: [tableCell('February 2024'), tableCell('Requirements gathering phase')],
      },
      {
        type: 'tableRow',
        content: [tableCell('March 2024'), tableCell('Design and prototyping')],
      },
      {
        type: 'tableRow',
        content: [tableCell('April 2024'), tableCell('Development sprint 1')],
      },
      {
        type: 'tableRow',
        content: [tableCell('May 2024'), tableCell('Development sprint 2')],
      },
      {
        type: 'tableRow',
        content: [tableCell('June 2024'), tableCell('Testing and QA')],
      },
      {
        type: 'tableRow',
        content: [tableCell('July 2024'), tableCell('Launch and deployment')],
      },
    ],
  },
}

// Export all templates
export const TABLE_TEMPLATES: TableTemplate[] = [
  dataTableTemplate,
  monthCalendarTemplate,
  pricingTableTemplate,
  comparisonTableTemplate,
  timelineTableTemplate,
]

// Helper function to get template by ID
export function getTemplateById(id: string): TableTemplate | undefined {
  return TABLE_TEMPLATES.find((template) => template.id === id)
}

// Helper function to get templates by category
export function getTemplatesByCategory(
  category: TableTemplate['category']
): TableTemplate[] {
  return TABLE_TEMPLATES.filter((template) => template.category === category)
}
