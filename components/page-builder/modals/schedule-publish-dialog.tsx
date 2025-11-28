'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { schedulePagePublish } from '@/app/actions/cms/pages'
import { toast } from 'sonner'

interface SchedulePublishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pageId: string
  pageName: string
  existingSchedule?: Date | null
  onScheduled?: () => void
}

export function SchedulePublishDialog({
  open,
  onOpenChange,
  pageId,
  pageName,
  existingSchedule,
  onScheduled,
}: SchedulePublishDialogProps) {
  const [date, setDate] = useState<Date | undefined>(existingSchedule || undefined)
  const [hour, setHour] = useState<string>(existingSchedule ? format(existingSchedule, 'HH') : '09')
  const [minute, setMinute] = useState<string>(existingSchedule ? format(existingSchedule, 'mm') : '00')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))

  // Generate minutes (00, 15, 30, 45)
  const minutes = ['00', '15', '30', '45']

  const handleSchedule = async () => {
    if (!date) {
      toast.error('Please select a date')
      return
    }

    // Combine date with time
    const scheduledDate = new Date(date)
    scheduledDate.setHours(parseInt(hour), parseInt(minute), 0, 0)

    // Check if date is in the future
    if (scheduledDate <= new Date()) {
      toast.error('Scheduled time must be in the future')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await schedulePagePublish(pageId, scheduledDate)

      if (result.success) {
        toast.success(result.message || `Page scheduled for ${format(scheduledDate, 'PPP \'at\' p')}`)
        onOpenChange(false)
        onScheduled?.()
      } else {
        toast.error(result.message || 'Failed to schedule page')
      }
    } catch (error) {
      toast.error('An error occurred while scheduling')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Minimum date is tomorrow
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  minDate.setHours(0, 0, 0, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Schedule Publication
          </DialogTitle>
          <DialogDescription>
            Schedule &quot;{pageName}&quot; to be published automatically at a specific date and time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Publication Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < minDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Picker */}
          <div className="space-y-2">
            <Label>Publication Time</Label>
            <div className="flex items-center gap-2">
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">:</span>
              <Select value={minute} onValueChange={setMinute}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-2">
                (24-hour format)
              </span>
            </div>
          </div>

          {/* Preview */}
          {date && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <span className="text-muted-foreground">This page will be published on:</span>
              <p className="font-medium text-foreground mt-1">
                {format(
                  new Date(date.setHours(parseInt(hour), parseInt(minute))),
                  "EEEE, MMMM do, yyyy 'at' h:mm a"
                )}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={!date || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Schedule Publication
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
