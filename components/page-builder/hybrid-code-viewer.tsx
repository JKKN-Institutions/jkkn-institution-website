'use client'

/**
 * Hybrid Code Viewer
 *
 * Read-only code display with copy-paste functionality.
 * Shows React JSX code for the selected component with syntax highlighting.
 *
 * Features:
 * - Syntax highlighting using Shiki (lightweight, fast)
 * - Copy JSX code to clipboard
 * - Copy just props as JSON
 * - Toggle between JSX and TypeScript props interface
 * - Show/hide comments
 */

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Check, Code2, FileJson, FileType } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface HybridCodeViewerProps {
  componentName: string
  props: Record<string, any>
  responsiveSettings?: Record<string, any>
  showComments?: boolean
  className?: string
}

export function HybridCodeViewer({
  componentName,
  props,
  responsiveSettings,
  showComments = true,
  className,
}: HybridCodeViewerProps) {
  const [copied, setCopied] = useState<'jsx' | 'props' | 'types' | null>(null)
  const [activeTab, setActiveTab] = useState<'jsx' | 'props' | 'types'>('jsx')

  // Generate code representations
  const jsxCode = generateJsxCode(componentName, props, responsiveSettings, showComments)
  const propsJson = generatePropsJson(props, responsiveSettings)
  const typesCode = generateTypesInterface(componentName, props)

  // Copy handlers
  const handleCopy = async (type: 'jsx' | 'props' | 'types', content: string) => {
    await navigator.clipboard.writeText(content)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Tabs for different code views */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="jsx" className="text-xs">
              <Code2 className="h-3 w-3 mr-1" />
              JSX
            </TabsTrigger>
            <TabsTrigger value="props" className="text-xs">
              <FileJson className="h-3 w-3 mr-1" />
              Props
            </TabsTrigger>
            <TabsTrigger value="types" className="text-xs">
              <FileType className="h-3 w-3 mr-1" />
              Types
            </TabsTrigger>
          </TabsList>
        </div>

        {/* JSX View */}
        <TabsContent value="jsx" className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              React Component
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy('jsx', jsxCode)}
              className="h-7"
            >
              {copied === 'jsx' ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy JSX
                </>
              )}
            </Button>
          </div>

          <div className="rounded-lg overflow-hidden border">
            <SyntaxHighlighter
              language="tsx"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '12px',
                lineHeight: '1.5',
              }}
              showLineNumbers
            >
              {jsxCode}
            </SyntaxHighlighter>
          </div>
        </TabsContent>

        {/* Props JSON View */}
        <TabsContent value="props" className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              JSON Object
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy('props', propsJson)}
              className="h-7"
            >
              {copied === 'props' ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy JSON
                </>
              )}
            </Button>
          </div>

          <div className="rounded-lg overflow-hidden border">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '12px',
                lineHeight: '1.5',
              }}
              showLineNumbers
            >
              {propsJson}
            </SyntaxHighlighter>
          </div>
        </TabsContent>

        {/* TypeScript Interface View */}
        <TabsContent value="types" className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              TypeScript Interface
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy('types', typesCode)}
              className="h-7"
            >
              {copied === 'types' ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Types
                </>
              )}
            </Button>
          </div>

          <div className="rounded-lg overflow-hidden border">
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '12px',
                lineHeight: '1.5',
              }}
              showLineNumbers
            >
              {typesCode}
            </SyntaxHighlighter>
          </div>
        </TabsContent>
      </Tabs>

      {/* Helpful info */}
      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
        <strong>Tip:</strong> Copy this code to create a custom component or use it in your own project.
      </div>
    </div>
  )
}

// ============================================================================
// Code Generation Functions
// ============================================================================

function generateJsxCode(
  componentName: string,
  props: Record<string, any>,
  responsiveSettings?: Record<string, any>,
  showComments = true
): string {
  const lines: string[] = []

  if (showComments) {
    lines.push('// Component generated from page builder')
    lines.push(`// Component: ${componentName}`)
    if (responsiveSettings && Object.keys(responsiveSettings).length > 0) {
      lines.push('// Note: Responsive settings not shown in JSX (stored separately)')
    }
    lines.push('')
  }

  lines.push(`<${componentName}`)

  // Generate props
  const propsEntries = Object.entries(props).filter(
    ([key]) => !key.startsWith('_') && key !== 'responsive_settings' && key !== 'children'
  )

  propsEntries.forEach(([key, value], index) => {
    const isLast = index === propsEntries.length - 1
    const propLine = formatProp(key, value, isLast)
    lines.push(`  ${propLine}`)
  })

  // Check if component has children
  const hasChildren = props.children && (Array.isArray(props.children) ? props.children.length > 0 : true)

  if (hasChildren) {
    lines.push('>')
    if (Array.isArray(props.children)) {
      lines.push(`  {/* ${props.children.length} child component(s) */}`)
    } else if (typeof props.children === 'string') {
      lines.push(`  ${props.children}`)
    }
    lines.push(`</${componentName}>`)
  } else {
    lines.push('/>')
  }

  return lines.join('\n')
}

function formatProp(key: string, value: any, isLast: boolean): string {
  const suffix = isLast ? '' : ''

  if (value === null || value === undefined) {
    return `${key}={null}${suffix}`
  }

  if (typeof value === 'string') {
    // Check if string contains quotes or special chars
    if (value.includes('\n') || value.includes('"')) {
      return `${key}={\`${value}\`}${suffix}`
    }
    return `${key}="${value}"${suffix}`
  }

  if (typeof value === 'boolean') {
    return value ? `${key}${suffix}` : `${key}={false}${suffix}`
  }

  if (typeof value === 'number') {
    return `${key}={${value}}${suffix}`
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${key}={[]}${suffix}`
    }
    // Format arrays on multiple lines if complex
    if (value.some(v => typeof v === 'object')) {
      return `${key}={[\n    ${value.map(v => JSON.stringify(v, null, 2).replace(/\n/g, '\n    ')).join(',\n    ')}\n  ]}${suffix}`
    }
    return `${key}={${JSON.stringify(value)}}${suffix}`
  }

  if (typeof value === 'object') {
    // Format objects nicely
    const formatted = JSON.stringify(value, null, 2).replace(/\n/g, '\n    ')
    return `${key}={${formatted}}${suffix}`
  }

  return `${key}={${value}}${suffix}`
}

function generatePropsJson(props: Record<string, any>, responsiveSettings?: Record<string, any>): string {
  const cleanedProps = { ...props }

  // Remove internal props
  delete cleanedProps._id
  delete cleanedProps.children

  // Add responsive settings if present
  const output: any = { ...cleanedProps }
  if (responsiveSettings && Object.keys(responsiveSettings).length > 0) {
    output.responsive_settings = responsiveSettings
  }

  return JSON.stringify(output, null, 2)
}

function generateTypesInterface(componentName: string, props: Record<string, any>): string {
  const lines: string[] = []

  lines.push(`// TypeScript interface for ${componentName}`)
  lines.push('')
  lines.push(`export interface ${componentName}Props {`)

  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('_') || key === 'children') return

    const tsType = inferTypeScriptType(value)
    const isOptional = value === null || value === undefined ? '?' : ''

    lines.push(`  ${key}${isOptional}: ${tsType}`)
  })

  lines.push('}')
  lines.push('')
  lines.push(`// Usage:`)
  lines.push(`// const MyComponent: React.FC<${componentName}Props> = (props) => { ... }`)

  return lines.join('\n')
}

function inferTypeScriptType(value: any): string {
  if (value === null || value === undefined) {
    return 'any'
  }

  if (typeof value === 'string') {
    return 'string'
  }

  if (typeof value === 'number') {
    return 'number'
  }

  if (typeof value === 'boolean') {
    return 'boolean'
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'any[]'
    }
    const firstType = inferTypeScriptType(value[0])
    return `${firstType}[]`
  }

  if (typeof value === 'object') {
    // Try to infer object shape
    const keys = Object.keys(value)
    if (keys.length === 0) {
      return 'Record<string, any>'
    }
    const lines = keys.map(key => `${key}: ${inferTypeScriptType(value[key])}`)
    return `{\n    ${lines.join('\n    ')}\n  }`
  }

  return 'any'
}
