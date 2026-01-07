'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LivePreviewPanelProps {
  code: string
  defaultProps?: Record<string, unknown>
  componentName?: string
}

export function LivePreviewPanel({
  code,
  defaultProps = {},
  componentName = 'Component',
}: LivePreviewPanelProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(true)

  // Debounced code update
  useEffect(() => {
    if (!isPreviewEnabled) return

    setStatus('loading')
    setError(null)

    const timer = setTimeout(() => {
      renderPreview()
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [code, defaultProps, isPreviewEnabled])

  const renderPreview = useCallback(async () => {
    if (!iframeRef.current || !code.trim()) {
      setStatus('idle')
      return
    }

    try {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (!iframeDoc) {
        throw new Error('Could not access iframe document')
      }

      // Create HTML content for preview
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@19/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@19/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      padding: 20px;
      background: #f8fafc;
    }
    .preview-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-center;
    }
    .error-boundary {
      padding: 20px;
      background: #fee2e2;
      border: 1px solid #ef4444;
      border-radius: 8px;
      color: #991b1b;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useCallback, useMemo, useRef, useContext, useReducer } = React;
    const { createRoot } = ReactDOM;

    // Error Boundary Component
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        console.error('Preview Error:', error, errorInfo);
      }

      render() {
        if (this.state.hasError) {
          return (
            <div className="error-boundary">
              <h3 style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                Component Error
              </h3>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                {this.state.error?.message || 'Unknown error occurred'}
              </pre>
            </div>
          );
        }

        return this.props.children;
      }
    }

    try {
      // Transform and execute component code
      ${code}

      // Get component from exports
      const ComponentToRender = typeof ${componentName} !== 'undefined'
        ? ${componentName}
        : (() => <div className="error-boundary">Component "${componentName}" not found in code</div>);

      // Props to pass
      const props = ${JSON.stringify(defaultProps)};

      // Render
      const root = createRoot(document.getElementById('root'));
      root.render(
        <ErrorBoundary>
          <div className="preview-container">
            <ComponentToRender {...props} />
          </div>
        </ErrorBoundary>
      );

      // Notify parent that render is complete
      window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');

    } catch (error) {
      document.getElementById('root').innerHTML = \`
        <div class="error-boundary">
          <h3 style="margin-bottom: 10px; font-weight: bold;">
            Compilation Error
          </h3>
          <pre style="white-space: pre-wrap; font-size: 14px;">\${error.message}</pre>
        </div>
      \`;
      window.parent.postMessage({
        type: 'PREVIEW_ERROR',
        error: error.message
      }, '*');
    }
  </script>
</body>
</html>
      `

      // Write content to iframe
      iframeDoc.open()
      iframeDoc.write(htmlContent)
      iframeDoc.close()

      // Listen for messages from iframe
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'PREVIEW_READY') {
          setStatus('ready')
          setError(null)
        } else if (event.data.type === 'PREVIEW_ERROR') {
          setStatus('error')
          setError(event.data.error)
        }
      }

      window.addEventListener('message', handleMessage)

      // Timeout for render (prevent hanging)
      const timeout = setTimeout(() => {
        if (status === 'loading') {
          setStatus('error')
          setError('Preview render timeout. Component may have an infinite loop.')
        }
      }, 5000)

      return () => {
        window.removeEventListener('message', handleMessage)
        clearTimeout(timeout)
      }
    } catch (error) {
      setStatus('error')
      setError(error instanceof Error ? error.message : 'Failed to render preview')
    }
  }, [code, defaultProps, componentName, status])

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Live Preview</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          {status === 'loading' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Rendering...
            </div>
          )}
          {status === 'ready' && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Ready
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              Error
            </div>
          )}

          {/* Toggle Preview */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreviewEnabled(!isPreviewEnabled)}
          >
            {isPreviewEnabled ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative bg-muted/10 overflow-hidden">
        {!isPreviewEnabled ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <EyeOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Preview disabled</p>
              <p className="text-xs mt-1">Click the eye icon to enable</p>
            </div>
          </div>
        ) : !code.trim() ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No code to preview</p>
              <p className="text-xs mt-1">Start typing to see live preview</p>
            </div>
          </div>
        ) : (
          <>
            {status === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {error && (
              <div className="absolute top-4 left-4 right-4 z-20">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm font-mono">
                    {error}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <iframe
              ref={iframeRef}
              sandbox="allow-scripts"
              className="w-full h-full border-0"
              title="Component Preview"
            />
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t bg-muted/10 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>
            Sandboxed preview with React 19 + Tailwind CSS
          </span>
          <span>
            Updates debounced by 500ms
          </span>
        </div>
      </div>
    </Card>
  )
}
