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
import { replyToAdmissionInquiry } from '@/app/actions/admission-inquiry'
import { toast } from 'sonner'
import { Send, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface InquiryReplyModalProps {
  inquiryId: string
  existingReply?: string | null
  onClose: () => void
  onSuccess: () => void
}

export function InquiryReplyModal({ inquiryId, existingReply, onClose, onSuccess }: InquiryReplyModalProps) {
  const [replyMessage, setReplyMessage] = useState(existingReply || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (replyMessage.trim().length < 10) {
      setError('Notes must be at least 10 characters long')
      return
    }

    if (replyMessage.trim().length > 5000) {
      setError('Notes must be less than 5000 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await replyToAdmissionInquiry(inquiryId, replyMessage)

      if (result.success) {
        toast.success(result.message || 'Notes saved successfully')
        onSuccess()
      } else {
        setError(result.error || 'Failed to save notes')
        toast.error(result.error || 'Failed to save notes')
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
          <DialogTitle>{existingReply ? 'Update Notes' : 'Add Notes'}</DialogTitle>
          <DialogDescription>
            Add internal notes about this admission inquiry (e.g., call summary, follow-up actions).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reply-message">Notes *</Label>
            <Textarea
              id="reply-message"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Enter notes about this inquiry (e.g., 'Called student, interested in BDS, will visit campus next week')"
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
                  Valid length
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
              <strong>Note:</strong> These notes are for internal use only. The student will not receive any notification.
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
                  <span className="mr-2">Saving...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Save Notes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
