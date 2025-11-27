'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ResponsiveFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

/**
 * Responsive Form Component
 *
 * A form component with responsive spacing and layout.
 */
export const ResponsiveForm = forwardRef<HTMLFormElement, ResponsiveFormProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn('space-y-4 sm:space-y-6', className)}
        {...props}
      >
        {children}
      </form>
    )
  }
)
ResponsiveForm.displayName = 'ResponsiveForm'

interface FormSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

/**
 * Form Section with optional title and description
 */
export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  )
}

interface FormRowProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

/**
 * Form Row for grouping form fields
 *
 * Stacks on mobile, shows as columns on larger screens
 */
export function FormRow({ children, columns = 2, className }: FormRowProps) {
  const columnStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', columnStyles[columns], className)}>
      {children}
    </div>
  )
}

interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
  className?: string
}

/**
 * Form Field wrapper with label, error, and hint support
 */
export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface FormActionsProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'right' | 'center' | 'between'
  sticky?: boolean
}

/**
 * Form Actions container for submit/cancel buttons
 *
 * Buttons stack on mobile, align horizontally on larger screens
 */
export function FormActions({
  children,
  className,
  align = 'right',
  sticky = false,
}: FormActionsProps) {
  const alignStyles = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
  }

  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6',
        alignStyles[align],
        sticky &&
          'sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 border-t border-border/50 mt-6',
        className
      )}
    >
      {children}
    </div>
  )
}

interface ResponsiveInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

/**
 * Responsive Input with proper sizing for touch devices
 */
export const ResponsiveInput = forwardRef<HTMLInputElement, ResponsiveInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full min-h-[44px] px-3 sm:px-4 py-2.5 rounded-lg sm:rounded-xl',
          'border bg-background text-foreground text-base sm:text-sm',
          'placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-destructive focus:ring-destructive/20 focus:border-destructive'
            : 'border-input',
          className
        )}
        {...props}
      />
    )
  }
)
ResponsiveInput.displayName = 'ResponsiveInput'

interface ResponsiveTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

/**
 * Responsive Textarea with proper sizing for touch devices
 */
export const ResponsiveTextarea = forwardRef<
  HTMLTextAreaElement,
  ResponsiveTextareaProps
>(({ className, error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full min-h-[100px] px-3 sm:px-4 py-2.5 rounded-lg sm:rounded-xl',
        'border bg-background text-foreground text-base sm:text-sm',
        'placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
        'transition-colors duration-200 resize-y',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error
          ? 'border-destructive focus:ring-destructive/20 focus:border-destructive'
          : 'border-input',
        className
      )}
      {...props}
    />
  )
})
ResponsiveTextarea.displayName = 'ResponsiveTextarea'

interface ResponsiveSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

/**
 * Responsive Select with proper sizing for touch devices
 */
export const ResponsiveSelect = forwardRef<
  HTMLSelectElement,
  ResponsiveSelectProps
>(({ className, error, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        'w-full min-h-[44px] px-3 sm:px-4 py-2.5 rounded-lg sm:rounded-xl',
        'border bg-background text-foreground text-base sm:text-sm',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
        'transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10',
        error
          ? 'border-destructive focus:ring-destructive/20 focus:border-destructive'
          : 'border-input',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
})
ResponsiveSelect.displayName = 'ResponsiveSelect'
