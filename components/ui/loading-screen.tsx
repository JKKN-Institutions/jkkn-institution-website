import { Loader2Icon } from 'lucide-react'

interface LoadingScreenProps {
  text?: string
  fullScreen?: boolean
}

export function LoadingScreen({
  text = "Loading...",
  fullScreen = true
}: LoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
      className={`
        flex items-center justify-center
        ${fullScreen ? 'min-h-screen fixed inset-0 z-50 bg-background' : 'min-h-[400px]'}
      `}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Spinning Loader Icon */}
        <Loader2Icon
          className="w-16 h-16 sm:w-20 sm:h-20 animate-spin text-primary"
          strokeWidth={2}
        />

        {/* Loading Text */}
        {text && (
          <p className="text-base sm:text-lg font-medium text-muted-foreground animate-pulse">
            {text}
          </p>
        )}

        {/* Screen reader only text */}
        <span className="sr-only">Loading, please wait...</span>
      </div>
    </div>
  )
}
