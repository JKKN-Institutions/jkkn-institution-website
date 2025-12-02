'use client'

import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  blockId?: string
  blockName?: string
  fallback?: ReactNode
  onError?: (error: Error, blockId?: string) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary for page builder blocks.
 * Catches errors in block rendering and displays a friendly fallback UI.
 * Prevents a single broken block from crashing the entire page builder.
 */
export class BlockErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[BlockErrorBoundary] Error in block ${this.props.blockId}:`, error)
    console.error('Component stack:', errorInfo.componentStack)

    // Call the optional error handler
    this.props.onError?.(error, this.props.blockId)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // Allow custom fallback
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-destructive/50 bg-destructive/5 rounded-lg min-h-[100px]">
          <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-sm font-medium text-destructive mb-1">
            Block Error
          </p>
          <p className="text-xs text-muted-foreground mb-3 text-center max-w-xs">
            {this.props.blockName ? (
              <>The &quot;{this.props.blockName}&quot; block failed to render.</>
            ) : (
              <>This block failed to render.</>
            )}
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <p className="text-xs text-destructive/80 mb-3 font-mono max-w-xs truncate">
              {this.state.error.message}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={this.handleRetry}
            className="gap-2"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Wrapper component for use with functional components
 */
export function withBlockErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  blockName?: string
) {
  return function WithErrorBoundary(props: P & { id?: string }) {
    return (
      <BlockErrorBoundary blockId={props.id} blockName={blockName}>
        <WrappedComponent {...props} />
      </BlockErrorBoundary>
    )
  }
}

export default BlockErrorBoundary
