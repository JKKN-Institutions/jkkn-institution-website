'use client'

/**
 * Custom Component Wrapper
 *
 * This component dynamically renders custom components stored in the database.
 * It uses Babel to transform JSX code and executes it at runtime.
 *
 * Components can be:
 * 1. Self-contained (no external imports) - rendered dynamically
 * 2. With external imports from @/components/ui/* - resolved via dependency injection
 * 3. With unsupported imports - show placeholder
 */

import { useEffect, useState, useCallback, type ComponentType } from 'react'
import * as React from 'react'
import * as Babel from '@babel/standalone'
import { Loader2, AlertTriangle, Package } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { CustomComponentData } from '@/lib/cms/component-registry'

// Import all shadcn/ui components that custom components might need
import * as Accordion from '@/components/ui/accordion'
import * as AlertDialog from '@/components/ui/alert-dialog'
import * as Alert from '@/components/ui/alert'
import * as AspectRatio from '@/components/ui/aspect-ratio'
import * as Avatar from '@/components/ui/avatar'
import * as Badge from '@/components/ui/badge'
import * as Breadcrumb from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import * as Carousel from '@/components/ui/carousel'
import * as Checkbox from '@/components/ui/checkbox'
import * as Collapsible from '@/components/ui/collapsible'
import * as Command from '@/components/ui/command'
import * as ContextMenu from '@/components/ui/context-menu'
import * as Dialog from '@/components/ui/dialog'
import * as Drawer from '@/components/ui/drawer'
import * as DropdownMenu from '@/components/ui/dropdown-menu'
import * as Form from '@/components/ui/form'
import * as HoverCard from '@/components/ui/hover-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as Menubar from '@/components/ui/menubar'
import * as NavigationMenu from '@/components/ui/navigation-menu'
import * as Pagination from '@/components/ui/pagination'
import * as Popover from '@/components/ui/popover'
import * as Progress from '@/components/ui/progress'
import * as RadioGroup from '@/components/ui/radio-group'
import * as Resizable from '@/components/ui/resizable'
import * as ScrollArea from '@/components/ui/scroll-area'
import * as Select from '@/components/ui/select'
import * as Separator from '@/components/ui/separator'
import * as Sheet from '@/components/ui/sheet'
import * as Skeleton from '@/components/ui/skeleton'
import * as Slider from '@/components/ui/slider'
import * as Switch from '@/components/ui/switch'
import * as Table from '@/components/ui/table'
import * as Tabs from '@/components/ui/tabs'
import * as Textarea from '@/components/ui/textarea'
import * as ToggleGroup from '@/components/ui/toggle-group'
import * as Toggle from '@/components/ui/toggle'
import * as Tooltip from '@/components/ui/tooltip'
import * as ThreeDCard from '@/components/ui/3d-card'

// Registry of available external dependencies
const AVAILABLE_DEPENDENCIES: Record<string, unknown> = {
  // Shadcn UI Components
  '@/components/ui/accordion': Accordion,
  '@/components/ui/alert-dialog': AlertDialog,
  '@/components/ui/alert': Alert,
  '@/components/ui/aspect-ratio': AspectRatio,
  '@/components/ui/avatar': Avatar,
  '@/components/ui/badge': Badge,
  '@/components/ui/breadcrumb': Breadcrumb,
  '@/components/ui/button': { Button },
  '@/components/ui/calendar': { Calendar },
  '@/components/ui/card': { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle },
  '@/components/ui/carousel': Carousel,
  '@/components/ui/checkbox': Checkbox,
  '@/components/ui/collapsible': Collapsible,
  '@/components/ui/command': Command,
  '@/components/ui/context-menu': ContextMenu,
  '@/components/ui/dialog': Dialog,
  '@/components/ui/drawer': Drawer,
  '@/components/ui/dropdown-menu': DropdownMenu,
  '@/components/ui/form': Form,
  '@/components/ui/hover-card': HoverCard,
  '@/components/ui/input': { Input },
  '@/components/ui/label': { Label },
  '@/components/ui/menubar': Menubar,
  '@/components/ui/navigation-menu': NavigationMenu,
  '@/components/ui/pagination': Pagination,
  '@/components/ui/popover': Popover,
  '@/components/ui/progress': Progress,
  '@/components/ui/radio-group': RadioGroup,
  '@/components/ui/resizable': Resizable,
  '@/components/ui/scroll-area': ScrollArea,
  '@/components/ui/select': Select,
  '@/components/ui/separator': Separator,
  '@/components/ui/sheet': Sheet,
  '@/components/ui/skeleton': Skeleton,
  '@/components/ui/slider': Slider,
  '@/components/ui/switch': Switch,
  '@/components/ui/table': Table,
  '@/components/ui/tabs': Tabs,
  '@/components/ui/textarea': Textarea,
  '@/components/ui/toggle-group': ToggleGroup,
  '@/components/ui/toggle': Toggle,
  '@/components/ui/tooltip': Tooltip,

  // Custom Components
  '@/components/ui/3d-card': ThreeDCard,

  // Utilities & Icons
  'lucide-react': LucideIcons,
}

// Parse imports from code
function parseImports(code: string): {
  supportedImports: Array<{ path: string; names: string[] }>
  unsupportedImports: string[]
} {
  const importRegex = /import\s+(?:(\*\s+as\s+\w+|\{[^}]+\}|\w+))\s+from\s+['"]([^'"]+)['"]/g
  const supportedImports: Array<{ path: string; names: string[] }> = []
  const unsupportedImports: string[] = []

  let match
  while ((match = importRegex.exec(code)) !== null) {
    const [, importClause, importPath] = match

    // Skip React imports (React, useState, etc.)
    if (importPath === 'react' || importPath.startsWith('react/')) {
      continue
    }

    // Check if this import is supported
    if (AVAILABLE_DEPENDENCIES[importPath]) {
      // Extract imported names
      const names: string[] = []
      if (importClause.startsWith('{')) {
        // Named imports: { Calendar, Button }
        const namedImports = importClause.match(/\{([^}]+)\}/)?.[1]
        if (namedImports) {
          names.push(
            ...namedImports.split(',').map(name => name.trim().split(' as ')[0].trim())
          )
        }
      } else if (importClause.startsWith('*')) {
        // Namespace import: * as UI
        const alias = importClause.match(/\*\s+as\s+(\w+)/)?.[1]
        if (alias) names.push(`* as ${alias}`)
      } else {
        // Default import
        names.push(importClause.trim())
      }

      supportedImports.push({ path: importPath, names })
    } else {
      unsupportedImports.push(importPath)
    }
  }

  return { supportedImports, unsupportedImports }
}

// Transform TSX code to render-ready format using Babel
function transformCode(code: string): { code: string; error: string | null } {
  try {
    // Step 1: Remove imports and exports
    let cleaned = code
      // Remove all import statements
      .replace(/^import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm, '')
      .replace(/^import\s+type\s+.*?from\s+['"][^'"]+['"];?\s*$/gm, '')
      .replace(/^import\s+['"][^'"]+['"];?\s*$/gm, '')
      .replace(/^import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?\s*$/gm, '')
      // Remove 'use client' and 'use server' directives
      .replace(/^['"]use\s+(client|server)['"];?\s*$/gm, '')
      // Remove export statements
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+(?!default)/g, '')

    cleaned = cleaned.trim()

    // Step 2: Use Babel to transform TypeScript + JSX to createElement calls
    const result = Babel.transform(cleaned, {
      presets: [
        ['typescript', { isTSX: true, allExtensions: true }],
        'react'
      ],
      plugins: [],
      filename: 'component.tsx',
    })

    if (!result.code) {
      return { code: '', error: 'Babel transformation returned empty code' }
    }

    return { code: result.code, error: null }
  } catch (err) {
    console.error('Code transformation error:', err)
    return {
      code: '',
      error: err instanceof Error ? err.message : 'Failed to transform code'
    }
  }
}

// Extract the component function name from the code
function extractComponentName(code: string): string | null {
  const funcMatch = code.match(/(?:function|const)\s+([A-Z][a-zA-Z0-9]*)\s*[=(]/)
  return funcMatch ? funcMatch[1] : null
}

// Placeholder for components with external dependencies
function ExternalDependencyPlaceholder({
  displayName,
  imports,
}: {
  displayName: string
  imports: string[]
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[120px] p-6 text-center bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-3">
        <Package className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{displayName}</h3>
      <p className="text-sm text-muted-foreground mb-2">
        Custom component with external dependencies
      </p>
      <div className="flex flex-wrap gap-1 justify-center">
        {imports.slice(0, 3).map((imp, i) => (
          <span
            key={i}
            className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs font-mono"
          >
            {imp.length > 20 ? imp.slice(0, 20) + '...' : imp}
          </span>
        ))}
        {imports.length > 3 && (
          <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">
            +{imports.length - 3} more
          </span>
        )}
      </div>
    </div>
  )
}

// Error display component
function RenderError({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[120px] p-6 text-center bg-red-50 rounded-lg border border-red-200">
      <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
      <p className="font-medium text-red-700">Render Error</p>
      <p className="text-sm text-red-600 mt-1">{error}</p>
    </div>
  )
}

// Loading component
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[120px]">
      <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
    </div>
  )
}

// Component renderer with dependency injection
function ComponentRenderer({
  code,
  props,
  componentName,
  supportedImports,
  onError,
}: {
  code: string
  props: Record<string, unknown>
  componentName: string
  supportedImports: Array<{ path: string; names: string[] }>
  onError: (error: string) => void
}) {
  const [Component, setComponent] = useState<ComponentType<Record<string, unknown>> | null>(null)

  useEffect(() => {
    try {
      // Transform JSX code using Babel
      const { code: transformedCode, error: transformError } = transformCode(code)

      if (transformError || !transformedCode) {
        onError(transformError || 'Failed to transform component code')
        return
      }

      // Build dependency injection parameters
      const paramNames = ['React', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 'useReducer']
      const paramValues: unknown[] = [React, React.useState, React.useEffect, React.useCallback, React.useMemo, React.useRef, React.useContext, React.useReducer]

      // Inject external dependencies
      if (Array.isArray(supportedImports) && supportedImports.length > 0) {
        for (const importItem of supportedImports) {
          if (!importItem || !importItem.path || !Array.isArray(importItem.names)) {
            console.warn('[ComponentRenderer] Invalid import item:', importItem)
            continue
          }

          const { path, names } = importItem
          const dependency = AVAILABLE_DEPENDENCIES[path]

          if (dependency && typeof dependency === 'object') {
            // Add each named export as a parameter
            for (const name of names) {
              if (typeof name !== 'string') {
                console.warn('[ComponentRenderer] Invalid name type:', typeof name, name)
                continue
              }

              if (name.startsWith('* as ')) {
                // Namespace import: provide the whole module
                const alias = name.replace('* as ', '')
                paramNames.push(alias)
                paramValues.push(dependency)
              } else if (name in dependency) {
                // Named import: provide specific export
                paramNames.push(name)
                paramValues.push(dependency[name as keyof typeof dependency])
              } else {
                console.warn(`[ComponentRenderer] Export "${name}" not found in ${path}`)
              }
            }
          } else {
            console.warn(`[ComponentRenderer] Dependency not found for ${path}`)
          }
        }
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[ComponentRenderer] Injecting dependencies:', paramNames)
        console.log('[ComponentRenderer] Transformed code:', transformedCode.substring(0, 500))
      }

      // Create a function that has access to React and injected dependencies
      // The transformed code uses React.createElement instead of JSX
      const functionBody = `
        "use strict";
        ${transformedCode}
        return ${componentName};
      `

      const createComponent = new Function(
        ...paramNames,
        functionBody
      )

      const ComponentFromCode = createComponent(...paramValues)

      setComponent(() => ComponentFromCode)
    } catch (err) {
      console.error('Component render error:', err)
      console.error('[ComponentRenderer] Failed code:', code?.substring(0, 500))
      onError(err instanceof Error ? err.message : 'Failed to render component')
    }
  }, [code, componentName, supportedImports, onError])

  if (!Component) {
    return <LoadingState />
  }

  try {
    return <Component {...props} />
  } catch (renderError) {
    onError(renderError instanceof Error ? renderError.message : 'Runtime error')
    return null
  }
}

/**
 * Creates a React component from custom component data
 * This is called by the component registry to create lazy-loaded components
 */
export function createCustomComponent(
  customData: CustomComponentData
): ComponentType<Record<string, unknown>> {
  // Extract info from component code
  const componentName = extractComponentName(customData.code)
  const { supportedImports, unsupportedImports } = parseImports(customData.code)

  // Return a wrapper component
  return function CustomComponentWrapper(props: Record<string, unknown>) {
    const [renderError, setRenderError] = useState<string | null>(null)

    const handleError = useCallback((error: string) => {
      setRenderError(error)
    }, [])

    // If component has unsupported imports, show placeholder
    if (unsupportedImports.length > 0) {
      return (
        <ExternalDependencyPlaceholder
          displayName={customData.display_name}
          imports={unsupportedImports}
        />
      )
    }

    // If component name couldn't be extracted, show error
    if (!componentName) {
      return (
        <RenderError error="Could not find a valid React component in the code" />
      )
    }

    // If there was a render error, show it
    if (renderError) {
      return <RenderError error={renderError} />
    }

    // Merge default props with passed props
    const mergedProps = {
      ...customData.default_props,
      ...props,
    }

    // Render the component with dependency injection
    return (
      <ComponentRenderer
        code={customData.code}
        props={mergedProps}
        componentName={componentName}
        supportedImports={supportedImports}
        onError={handleError}
      />
    )
  }
}

export default createCustomComponent
