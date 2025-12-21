'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { replyToInquiry } from '@/app/actions/contact'
import { toast } from 'sonner'
import { Send, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface InquiryReplyModalProps {
  inquiryId: string
  onClose: () => void
  onSuccess: () => void
}

export function InquiryReplyModal({ inquiryId, onClose, onSuccess }: InquiryReplyModalProps) {
  const [replyMessage, setReplyMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (replyMessage.trim().length < 10) {
      setError('Reply must be at least 10 characters long')
      return
    }

    if (replyMessage.trim().length > 5000) {
      setError('Reply must be less than 5000 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await replyToInquiry(inquiryId, replyMessage)

      if (result.success) {
        toast.success(result.message || 'Reply sent successfully')
        onSuccess()
      } else {
        setError(result.error || 'Failed to send reply')
        toast.error(result.error || 'Failed to send reply')
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const charCount = replyMessage.length
  const charMin = 10
  const charMax = 5000
  const isValid = charCount >= charMin && charCount <= charMax

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reply to Inquiry</DialogTitle>
          <DialogDescription>
            Compose your response to this contact form submission. The reply will be saved to the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reply-message">Your Reply *</Label>
            <Textarea
              id="reply-message"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
              rows={8}
              className="resize-none"
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between text-sm">
              <div className={`${
                charCount < charMin
                  ? 'text-destructive'
                  : charCount > charMax
                  ? 'text-destructive'
                  : 'text-muted-foreground'
              }`}>
                {charCount} / {charMax} characters
                {charCount < charMin && ` (minimum ${charMin})`}
              </div>
              {isValid && (
                <div className="text-green-600 dark:text-green-400 text-xs font-medium">
                  Valid length ✓
                </div>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> The reply will be saved to the database. Email notifications to the user are not yet configured.
              You may need to manually send the reply via email.
            </AlertDescription>
          </Alert>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Sending...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
