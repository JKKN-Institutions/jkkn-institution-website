'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { InquiryReplyModal } from './inquiry-reply-modal'
import { updateContactSubmissionStatus } from '@/app/actions/contact'
import { toast } from 'sonner'
import { Mail, Phone, Calendar, User, MessageSquare, CheckCircle2, Archive } from 'lucide-react'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  reply_message: string | null
  created_at: string
  replied_at: string | null
  replied_by: string | null
}

interface InquiryDetailModalProps {
  inquiry: ContactSubmission
  onClose: () => void
  onUpdate: () => void
}

const statusColors = {
  new: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  read: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  replied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
}

export function InquiryDetailModal({ inquiry, onClose, onUpdate }: InquiryDetailModalProps) {
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleMarkAsRead = async () => {
    setUpdating(true)
    const result = await updateContactSubmissionStatus(inquiry.id, 'read')
    setUpdating(false)

    if (result.success) {
      toast.success('Inquiry marked as read')
      onUpdate()
      onClose()
    } else {
      toast.error(result.error || 'Failed to update status')
    }
  }

  const handleArchive = async () => {
    setUpdating(true)
    const result = await updateContactSubmissionStatus(inquiry.id, 'archived')
    setUpdating(false)

    if (result.success) {
      toast.success('Inquiry archived')
      onUpdate()
      onClose()
    } else {
      toast.error(result.error || 'Failed to archive inquiry')
    }
  }

  const handleReplySuccess = () => {
    setShowReplyModal(false)
    onUpdate()
    onClose()
  }

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>
              Review and respond to this contact form submission
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge className={statusColors[inquiry.status]} variant="outline">
                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
              </Badge>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Name</div>
                  <div className="font-medium">{inquiry.name}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="font-medium">{inquiry.email}</div>
                </div>
              </div>

              {inquiry.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Phone</div>
                    <div className="font-medium">{inquiry.phone}</div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Submitted</div>
                  <div className="font-medium">
                    {new Date(inquiry.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Subject */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm font-medium text-muted-foreground">Subject</div>
              </div>
              <div className="font-medium text-lg">{inquiry.subject}</div>
            </div>

            {/* Message */}
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Message</div>
              <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                {inquiry.message}
              </div>
            </div>

            {/* Reply (if exists) */}
            {inquiry.reply_message && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div className="text-sm font-medium text-muted-foreground">Your Reply</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg whitespace-pre-wrap border border-green-200 dark:border-green-800">
                    {inquiry.reply_message}
                  </div>
                  {inquiry.replied_at && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Replied on {new Date(inquiry.replied_at).toLocaleString()}
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-end">
              {inquiry.status === 'new' && (
                <Button
                  variant="outline"
                  onClick={handleMarkAsRead}
                  disabled={updating}
                >
                  Mark as Read
                </Button>
              )}
              {inquiry.status !== 'replied' && (
                <Button
                  onClick={() => setShowReplyModal(true)}
                  disabled={updating}
                >
                  Reply to Inquiry
                </Button>
              )}
              {inquiry.status !== 'archived' && (
                <Button
                  variant="secondary"
                  onClick={handleArchive}
                  disabled={updating}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              )}
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      {showReplyModal && (
        <InquiryReplyModal
          inquiryId={inquiry.id}
          onClose={() => setShowReplyModal(false)}
          onSuccess={handleReplySuccess}
        />
      )}
    </>
  )
}
