'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { verifyPagePassword } from '@/app/actions/cms/pages'
import { cn } from '@/lib/utils'

interface PasswordProtectedPageProps {
  slug: string
  pageTitle?: string
  onSuccess?: () => void
  className?: string
}

export function PasswordProtectedPage({
  slug,
  pageTitle,
  onSuccess,
  className,
}: PasswordProtectedPageProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await verifyPagePassword(slug, password)

      if (result.success) {
        // Store the access in session storage to allow page reload
        sessionStorage.setItem(`page-access-${slug}`, 'true')

        if (onSuccess) {
          onSuccess()
        } else {
          // Refresh the page to reload with authenticated access
          router.refresh()
        }
      } else {
        setError('Incorrect password. Please try again.')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center px-4 py-12',
        'bg-gradient-to-br from-background via-background to-muted/20',
        className
      )}
    >
      <div className="w-full max-w-md">
        {/* Glass Card */}
        <div className="relative backdrop-blur-xl bg-card/80 border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

          <div className="relative p-8 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Protected Page</h1>
              {pageTitle && (
                <p className="text-sm text-muted-foreground">
                  &ldquo;{pageTitle}&rdquo;
                </p>
              )}
              <p className="text-muted-foreground">
                This page is password protected. Please enter the password to continue.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="h-12 pr-10 bg-background/50"
                    disabled={isLoading}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 font-medium"
                disabled={isLoading || !password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Unlock Page
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <button
                onClick={() => router.back()}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Go back
              </button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] bg-primary/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}

/**
 * Component for private pages requiring authentication
 */
export function PrivatePageGate({
  className,
}: {
  className?: string
}) {
  const router = useRouter()

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center px-4 py-12',
        'bg-gradient-to-br from-background via-background to-muted/20',
        className
      )}
    >
      <div className="w-full max-w-md">
        <div className="relative backdrop-blur-xl bg-card/80 border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

          <div className="relative p-8 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Lock className="h-8 w-8 text-amber-500" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Private Page</h1>
              <p className="text-muted-foreground">
                This page is only accessible to authenticated users. Please sign in to continue.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/auth/login')}
                className="w-full h-12 font-medium"
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full h-12 font-medium"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
