'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
    children?: ReactNode
    fallback?: ReactNode
    componentName?: string
}

interface State {
    hasError: boolean
    error: Error | null
}

export class BlockErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Block rendering error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default error UI
            return (
                <div className="w-full p-6 my-4 border border-red-200 bg-red-50/50 rounded-lg flex flex-col items-center justify-center text-center space-y-3">
                    <div className="bg-red-100 p-2 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-red-900">
                            {this.props.componentName ? `Error loading ${this.props.componentName}` : 'Component Error'}
                        </h3>
                        <p className="text-xs text-red-600 max-w-md mx-auto">
                            {this.state.error?.message || 'Something went wrong while rendering this content block.'}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        <RefreshCcw className="mr-2 h-3 w-3" />
                        Try again
                    </Button>
                </div>
            )
        }

        return this.props.children
    }
}
