'use client'

import { useState } from 'react'
import { Editor } from '@tiptap/react'
import { TABLE_TEMPLATES, type TableTemplate } from '@/lib/cms/table-templates'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Search, Check } from 'lucide-react'

interface TableTemplatePickerProps {
  editor: Editor
  onSelect?: () => void
}

export function TableTemplatePicker({ editor, onSelect }: TableTemplatePickerProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TableTemplate['category'] | 'all'>('all')

  const categories = [
    { id: 'all' as const, label: 'All Templates' },
    { id: 'data' as const, label: 'Data' },
    { id: 'calendar' as const, label: 'Calendar' },
    { id: 'pricing' as const, label: 'Pricing' },
    { id: 'comparison' as const, label: 'Comparison' },
    { id: 'timeline' as const, label: 'Timeline' },
  ]

  // Filter templates based on search and category
  const filteredTemplates = TABLE_TEMPLATES.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleSelectTemplate = (template: TableTemplate) => {
    try {
      // Insert the template content into the editor
      editor.chain().focus().insertContent(template.content).run()

      // Call onSelect callback if provided
      onSelect?.()
    } catch (error) {
      console.error('Error inserting table template:', error)
    }
  }

  return (
    <div className="space-y-4 p-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="relative"
          >
            {category.label}
            {selectedCategory === category.id && (
              <Check className="ml-2 h-3 w-3" />
            )}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => {
            const Icon = template.icon
            return (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={cn(
                  'group relative flex flex-col items-start gap-3 rounded-lg border p-4',
                  'hover:border-primary hover:bg-accent transition-colors',
                  'text-left w-full'
                )}
              >
                {/* Template Icon and Info */}
                <div className="flex items-start gap-3 w-full">
                  <div className="rounded-md bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>

                {/* Template Size Info */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">{template.rows}</span> rows
                  </span>
                  <span>×</span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">{template.cols}</span> columns
                  </span>
                </div>

                {/* Template Preview (Mini Visual) */}
                <div className="w-full overflow-hidden rounded border bg-background/50">
                  <div className="p-2 scale-75 origin-top-left" style={{ width: '133%' }}>
                    <div
                      className="grid gap-px bg-border"
                      style={{
                        gridTemplateColumns: `repeat(${template.cols}, minmax(0, 1fr))`,
                      }}
                    >
                      {Array.from({ length: Math.min(template.rows, 4) }, (_, rowIndex) => (
                        Array.from({ length: template.cols }, (_, colIndex) => (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className={cn(
                              'h-6 bg-background',
                              rowIndex === 0 && 'bg-muted'
                            )}
                          />
                        ))
                      )).flat()}
                    </div>
                    {template.rows > 4 && (
                      <p className="text-[10px] text-muted-foreground text-center mt-1">
                        +{template.rows - 4} more rows
                      </p>
                    )}
                  </div>
                </div>

                {/* Hover State */}
                <div className="absolute inset-0 rounded-lg border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            )
          })}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-muted-foreground border-t pt-4">
        <p>
          Click on a template to insert it into your document. You can customize the table
          after inserting it using the table toolbar or properties dialog.
        </p>
      </div>
    </div>
  )
}
