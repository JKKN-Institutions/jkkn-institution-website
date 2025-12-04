'use client'

/**
 * Preview Capture Page for Custom Components
 *
 * This page is used by Playwright to capture screenshots of custom components.
 * It renders a component dynamically based on its code from the database.
 *
 * URL: /admin/preview-capture/custom?id=<component_id>
 *
 * The page:
 * 1. Fetches component data from the database
 * 2. Renders the component code in an isolated container
 * 3. Provides a clean, consistent background for screenshots
 */

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface ComponentData {
  id: string
  name: string
  display_name: string
  code: string
  default_props: Record<string, unknown>
}

// Transform TSX code to render-ready format
function transformCode(code: string): string {
  // Remove import statements (we provide React globally)
  let transformed = code.replace(/^import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm, '')

  // Remove export default/named exports and extract component function
  transformed = transformed.replace(/export\s+default\s+/g, '')
  transformed = transformed.replace(/export\s+/g, '')

  return transformed.trim()
}

// Extract the component function name from the code
function extractComponentName(code: string): string | null {
  // Match function ComponentName or const ComponentName =
  const funcMatch = code.match(/(?:function|const)\s+([A-Z][a-zA-Z0-9]*)\s*[=(]/)
  return funcMatch ? funcMatch[1] : null
}

// Create a safe component renderer
function SafeComponentRenderer({
  code,
  props,
  componentName,
}: {
  code: string
  props: Record<string, unknown>
  componentName: string
}) {
  const [Component, setComponent] = useState<React.ComponentType<Record<string, unknown>> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Transform the code
      const transformedCode = transformCode(code)

      // Create a function that returns the component
      // This is a simplified approach - in production, use a proper sandboxing solution
      const createComponent = new Function(
        'React',
        'props',
        `
        ${transformedCode}
        return ${componentName};
        `
      )

      const ComponentFromCode = createComponent(React, props)
      setComponent(() => ComponentFromCode)
      setError(null)
    } catch (err) {
      console.error('Component render error:', err)
      setError(err instanceof Error ? err.message : 'Failed to render component')
    }
  }, [code, componentName])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-sm p-4 text-center">
        <div>
          <p className="font-medium">Render Error</p>
          <p className="mt-1 text-xs opacity-75">{error}</p>
        </div>
      </div>
    )
  }

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // Render with error boundary
  try {
    return <Component {...props} />
  } catch (renderError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-sm p-4">
        Runtime Error: {renderError instanceof Error ? renderError.message : 'Unknown error'}
      </div>
    )
  }
}

export default function CustomComponentPreviewCapture() {
  const searchParams = useSearchParams()
  const componentId = searchParams.get('id')

  const [component, setComponent] = useState<ComponentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComponent = useCallback(async () => {
    if (!componentId) {
      setError('No component ID provided')
      setLoading(false)
      return
    }

    const supabase = createClient()

    const { data, error: fetchError } = await supabase
      .from('cms_custom_components')
      .select('id, name, display_name, code, default_props')
      .eq('id', componentId)
      .single()

    if (fetchError) {
      setError('Component not found')
      setLoading(false)
      return
    }

    setComponent(data as ComponentData)
    setLoading(false)
  }, [componentId])

  useEffect(() => {
    fetchComponent()
  }, [fetchComponent])

  // Loading state
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100"
        data-preview-status="loading"
      >
        <Loader2 className="h-12 w-12 animate-spin text-slate-400" />
      </div>
    )
  }

  // Error state
  if (error || !component) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100"
        data-preview-status="error"
      >
        <div className="text-center text-slate-500">
          <p className="text-lg font-medium">Unable to load component</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  // Extract component name from code
  const componentName = extractComponentName(component.code)

  if (!componentName) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100"
        data-preview-status="error"
      >
        <div className="text-center text-slate-500">
          <p className="text-lg font-medium">Invalid component code</p>
          <p className="text-sm mt-1">Could not find a valid React component in the code</p>
        </div>
      </div>
    )
  }

  // Render the component
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8"
      data-preview-status="ready"
      data-component-id={component.id}
      data-component-name={component.name}
    >
      {/* Preview container with consistent styling */}
      <div className="max-w-4xl mx-auto">
        {/* Component name badge */}
        <div className="mb-4 flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            {component.display_name}
          </span>
          <span className="text-xs text-slate-400">{component.name}</span>
        </div>

        {/* Component render area */}
        <div
          className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
          data-preview-content="true"
        >
          <SafeComponentRenderer
            code={component.code}
            props={component.default_props || {}}
            componentName={componentName}
          />
        </div>
      </div>
    </div>
  )
}
