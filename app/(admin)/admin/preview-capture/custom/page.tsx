'use client'

/**
 * Preview Capture Page for Custom Components
 *
 * This page renders custom components for screenshot capture.
 * It works best with self-contained components that don't rely on external imports.
 *
 * Components that import from @/components/* will show a placeholder with the component icon.
 *
 * URL: /admin/preview-capture/custom?id=<component_id>
 */

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertTriangle, Package } from 'lucide-react'
import * as React from 'react'
import * as Babel from '@babel/standalone'

interface ComponentData {
  id: string
  name: string
  display_name: string
  code: string
  icon: string | null
  default_props: Record<string, unknown>
}

// Check if component has external imports that can't be resolved
function hasExternalImports(code: string): { hasExternal: boolean; imports: string[] } {
  const importMatches = code.match(/import\s+.*?from\s+['"]([^'"]+)['"]/g) || []
  const externalImports: string[] = []

  for (const match of importMatches) {
    const pathMatch = match.match(/from\s+['"]([^'"]+)['"]/)
    if (pathMatch) {
      const importPath = pathMatch[1]
      // Check if it's NOT a React import
      if (importPath !== 'react' && !importPath.startsWith('react/')) {
        externalImports.push(importPath)
      }
    }
  }

  return {
    hasExternal: externalImports.length > 0,
    imports: externalImports
  }
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

    // Step 2: Use Babel to transform JSX to createElement calls
    const result = Babel.transform(cleaned, {
      presets: ['react'],
      plugins: [],
      filename: 'component.jsx',
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

// Component renderer for self-contained components
function SelfContainedRenderer({
  code,
  props,
  componentName,
  onError,
}: {
  code: string
  props: Record<string, unknown>
  componentName: string
  onError: (error: string) => void
}) {
  const [Component, setComponent] = useState<React.ComponentType<Record<string, unknown>> | null>(null)

  useEffect(() => {
    try {
      // Transform JSX code using Babel
      const { code: transformedCode, error: transformError } = transformCode(code)

      if (transformError || !transformedCode) {
        onError(transformError || 'Failed to transform component code')
        return
      }

      // Create a function that has access to React and its hooks
      // The transformed code uses React.createElement instead of JSX
      const createComponent = new Function(
        'React',
        'useState',
        'useEffect',
        'useCallback',
        'useMemo',
        'useRef',
        'useContext',
        'useReducer',
        `
        ${transformedCode}
        return ${componentName};
        `
      )

      const ComponentFromCode = createComponent(
        React,
        React.useState,
        React.useEffect,
        React.useCallback,
        React.useMemo,
        React.useRef,
        React.useContext,
        React.useReducer
      )

      setComponent(() => ComponentFromCode)
    } catch (err) {
      console.error('Component render error:', err)
      onError(err instanceof Error ? err.message : 'Failed to render component')
    }
  }, [code, componentName, onError])

  if (!Component) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '192px' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#9ca3af' }} className="animate-spin" />
      </div>
    )
  }

  try {
    return <Component {...props} />
  } catch (renderError) {
    onError(renderError instanceof Error ? renderError.message : 'Runtime error')
    return null
  }
}

// Placeholder for components with external dependencies
// Using inline styles to avoid Tailwind's modern color functions (lab/oklch) that html2canvas can't parse
function ExternalDependencyPlaceholder({
  componentName,
  displayName,
  imports,
}: {
  componentName: string
  displayName: string
  imports: string[]
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '192px',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <Package style={{ width: '32px', height: '32px', color: '#4f46e5' }} />
      </div>
      <h3 style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>{displayName}</h3>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
        This component uses external imports
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
        {imports.slice(0, 3).map((imp, i) => (
          <span key={i} style={{
            padding: '2px 8px',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            {imp.length > 25 ? imp.slice(0, 25) + '...' : imp}
          </span>
        ))}
        {imports.length > 3 && (
          <span style={{
            padding: '2px 8px',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            +{imports.length - 3} more
          </span>
        )}
      </div>
    </div>
  )
}

export default function CustomComponentPreviewCapture() {
  const searchParams = useSearchParams()
  const componentId = searchParams.get('id')

  const [component, setComponent] = useState<ComponentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [renderError, setRenderError] = useState<string | null>(null)

  const fetchComponent = useCallback(async () => {
    if (!componentId) {
      setError('No component ID provided')
      setLoading(false)
      return
    }

    const supabase = createClient()

    const { data, error: fetchError } = await supabase
      .from('cms_custom_components')
      .select('id, name, display_name, code, icon, default_props')
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

  // Loading state - using inline styles for html2canvas compatibility
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
        data-preview-status="loading"
      >
        <Loader2 style={{ width: '48px', height: '48px', color: '#94a3b8' }} className="animate-spin" />
      </div>
    )
  }

  // Error state - using inline styles for html2canvas compatibility
  if (error || !component) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
        data-preview-status="error"
      >
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <AlertTriangle style={{ width: '48px', height: '48px', margin: '0 auto 12px', color: '#f59e0b' }} />
          <p style={{ fontSize: '18px', fontWeight: 500 }}>Unable to load component</p>
          <p style={{ fontSize: '14px', marginTop: '4px' }}>{error}</p>
        </div>
      </div>
    )
  }

  // Extract component name from code
  const componentName = extractComponentName(component.code)
  const { hasExternal, imports: externalImports } = hasExternalImports(component.code)

  if (!componentName) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
        data-preview-status="error"
      >
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <AlertTriangle style={{ width: '48px', height: '48px', margin: '0 auto 12px', color: '#f59e0b' }} />
          <p style={{ fontSize: '18px', fontWeight: 500 }}>Invalid component code</p>
          <p style={{ fontSize: '14px', marginTop: '4px' }}>Could not find a valid React component in the code</p>
        </div>
      </div>
    )
  }

  // Render the component - using inline styles for html2canvas compatibility
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        padding: '32px'
      }}
      data-preview-status="ready"
      data-component-id={component.id}
      data-component-name={component.name}
    >
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>
        {/* Component name badge */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            padding: '4px 12px',
            backgroundColor: '#e0e7ff',
            color: '#4338ca',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: 500
          }}>
            {component.display_name}
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{component.name}</span>
          {hasExternal && (
            <span style={{
              padding: '2px 8px',
              backgroundColor: '#fef3c7',
              color: '#b45309',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              External deps
            </span>
          )}
        </div>

        {/* Component render area */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            minHeight: '200px'
          }}
          data-preview-content="true"
        >
          {hasExternal ? (
            <ExternalDependencyPlaceholder
              componentName={componentName}
              displayName={component.display_name}
              imports={externalImports}
            />
          ) : renderError ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '192px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <AlertTriangle style={{ width: '40px', height: '40px', color: '#ef4444', marginBottom: '12px' }} />
              <p style={{ fontWeight: 500, color: '#dc2626' }}>Render Error</p>
              <p style={{ fontSize: '14px', color: '#ef4444', marginTop: '4px' }}>{renderError}</p>
            </div>
          ) : (
            <SelfContainedRenderer
              code={component.code}
              props={component.default_props || {}}
              componentName={componentName}
              onError={setRenderError}
            />
          )}
        </div>

        {/* Info text */}
        {hasExternal && (
          <p style={{ marginTop: '12px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
            Components with external imports show a placeholder preview.
            Self-contained components render fully.
          </p>
        )}
      </div>
    </div>
  )
}
