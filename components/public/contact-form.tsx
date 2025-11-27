'use client'

import { useActionState } from 'react'
import { submitContactForm, type ContactFormState } from '@/app/actions/contact'
import { GlassCard, GlassButton } from './glass-card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState<ContactFormState | null, FormData>(
    submitContactForm,
    null
  )

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      formRef.current?.reset()
    } else if (state?.message && !state.success) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <GlassCard className="p-6 md:p-8">
      <form ref={formRef} action={formAction} className="space-y-6">
        {/* Success Message */}
        {state?.success && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-primary">Message Sent!</p>
              <p className="text-sm text-muted-foreground">{state.message}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {state?.message && !state.success && !state.errors && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-destructive">Error</p>
              <p className="text-sm text-muted-foreground">{state.message}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              disabled={isPending}
              className="bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20"
            />
            {state?.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              disabled={isPending}
              className="bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20"
            />
            {state?.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              disabled={isPending}
              className="bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20"
            />
            {state?.errors?.phone && (
              <p className="text-sm text-destructive">{state.errors.phone[0]}</p>
            )}
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-foreground">
              Subject <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="Admission Inquiry"
              required
              disabled={isPending}
              className="bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20"
            />
            {state?.errors?.subject && (
              <p className="text-sm text-destructive">{state.errors.subject[0]}</p>
            )}
          </div>
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-foreground">
            Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Please write your message here..."
            rows={5}
            required
            disabled={isPending}
            className="bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20 resize-none"
          />
          {state?.errors?.message && (
            <p className="text-sm text-destructive">{state.errors.message[0]}</p>
          )}
        </div>

        {/* Submit Button */}
        <GlassButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Send Message
            </>
          )}
        </GlassButton>

        <p className="text-xs text-muted-foreground text-center">
          By submitting this form, you agree to our{' '}
          <a href="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>
    </GlassCard>
  )
}
