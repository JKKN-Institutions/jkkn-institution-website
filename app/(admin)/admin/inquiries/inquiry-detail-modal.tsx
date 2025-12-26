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
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InquiryReplyModal } from './inquiry-reply-modal'
import { updateAdmissionInquiryStatus } from '@/app/actions/admission-inquiry'
import { toast } from 'sonner'
import {
  Mail,
  Phone,
  Calendar,
  User,
  Building2,
  GraduationCap,
  BookOpen,
  MapPin,
  Clock,
  CheckCircle2,
  Hash,
} from 'lucide-react'
import type { AdmissionInquiry } from './inquiries-table'

interface InquiryDetailModalProps {
  inquiry: AdmissionInquiry
  onClose: () => void
  onUpdate: () => void
}

export function InquiryDetailModal({ inquiry, onClose, onUpdate }: InquiryDetailModalProps) {
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(inquiry.status)

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true)
    const result = await updateAdmissionInquiryStatus(
      inquiry.id,
      newStatus as 'new' | 'contacted' | 'follow_up' | 'converted' | 'closed'
    )
    setUpdating(false)

    if (result.success) {
      toast.success('Status updated successfully')
      setCurrentStatus(newStatus as typeof currentStatus)
      onUpdate()
    } else {
      toast.error(result.error || 'Failed to update status')
    }
  }

  const handleReplySuccess = () => {
    setShowReplyModal(false)
    setCurrentStatus('contacted')
    onUpdate()
  }

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Admission Inquiry Details</DialogTitle>
            <DialogDescription>
              Review and respond to this admission inquiry
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Reference & Status */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">{inquiry.reference_number}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Select
                  value={currentStatus}
                  onValueChange={handleStatusChange}
                  disabled={updating}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Full Name</div>
                    <div className="font-medium">{inquiry.full_name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Mobile Number</div>
                    <div className="font-medium">
                      <a href={`tel:${inquiry.mobile_number}`} className="hover:underline text-primary">
                        {inquiry.mobile_number}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">
                      <a href={`mailto:${inquiry.email}`} className="hover:underline text-primary">
                        {inquiry.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">District / City</div>
                    <div className="font-medium">{inquiry.district_city}</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Academic Information */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Academic Interest</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">College</div>
                    <div className="font-medium">{inquiry.college_name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Course Interested</div>
                    <div className="font-medium">{inquiry.course_interested}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Current Qualification</div>
                    <div className="font-medium">{inquiry.current_qualification}</div>
                  </div>
                </div>

                {inquiry.preferred_contact_time && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Preferred Contact Time</div>
                      <div className="font-medium">{inquiry.preferred_contact_time}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Submission Info */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Submitted On</div>
                <div className="font-medium">
                  {new Date(inquiry.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Reply (if exists) */}
            {inquiry.reply_message && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div className="text-sm font-semibold text-muted-foreground">Response Notes</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg whitespace-pre-wrap border border-green-200 dark:border-green-800">
                    {inquiry.reply_message}
                  </div>
                  {inquiry.replied_at && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Added on {new Date(inquiry.replied_at).toLocaleString()}
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => window.open(`tel:${inquiry.mobile_number}`)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`https://wa.me/91${inquiry.mobile_number}`)}
              >
                WhatsApp
              </Button>
              <Button
                onClick={() => setShowReplyModal(true)}
                disabled={updating}
              >
                {inquiry.reply_message ? 'Update Notes' : 'Add Notes'}
              </Button>
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
          existingReply={inquiry.reply_message}
          onClose={() => setShowReplyModal(false)}
          onSuccess={handleReplySuccess}
        />
      )}
    </>
  )
}
