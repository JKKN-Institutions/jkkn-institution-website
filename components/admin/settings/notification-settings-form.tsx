'use client'

import { useState, useTransition } from 'react'
import { updateSettings, sendTestEmail } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2, Save, Mail, Server, Send, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface NotificationSettingsFormProps {
  initialSettings: Record<string, unknown>
}

export function NotificationSettingsForm({ initialSettings }: NotificationSettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isTestingEmail, setIsTestingEmail] = useState(false)
  const [testEmailDialogOpen, setTestEmailDialogOpen] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  // Parse SMTP settings from JSON
  const smtpSettings = (initialSettings.smtp_settings as Record<string, unknown>) || {}

  // Form state
  const [emailEnabled, setEmailEnabled] = useState(
    (initialSettings.email_notifications_enabled as boolean) ?? true
  )
  const [smtpHost, setSmtpHost] = useState((smtpSettings.host as string) || '')
  const [smtpPort, setSmtpPort] = useState(String((smtpSettings.port as number) || 587))
  const [smtpSecure, setSmtpSecure] = useState((smtpSettings.secure as boolean) || false)
  const [smtpUser, setSmtpUser] = useState((smtpSettings.user as string) || '')
  const [smtpPassword, setSmtpPassword] = useState((smtpSettings.password as string) || '')
  const [smtpFromEmail, setSmtpFromEmail] = useState((smtpSettings.from_email as string) || '')
  const [smtpFromName, setSmtpFromName] = useState((smtpSettings.from_name as string) || '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    startTransition(async () => {
      const settings = {
        email_notifications_enabled: emailEnabled,
        smtp_settings: {
          host: smtpHost,
          port: parseInt(smtpPort, 10),
          secure: smtpSecure,
          user: smtpUser,
          password: smtpPassword,
          from_email: smtpFromEmail,
          from_name: smtpFromName,
        },
      }

      const result = await updateSettings(settings)

      if (result.success) {
        toast.success('Notification settings saved successfully')
      } else {
        toast.error(result.message || 'Failed to save settings')
      }
    })
  }

  async function handleTestEmail() {
    if (!testEmail) {
      toast.error('Please enter an email address')
      return
    }

    setIsTestingEmail(true)
    setTestResult(null)

    try {
      const result = await sendTestEmail(testEmail)
      setTestResult({
        success: result.success ?? false,
        message: result.message || (result.success ? 'Test email sent!' : 'Failed to send test email'),
      })
    } catch {
      setTestResult({
        success: false,
        message: 'An error occurred while sending test email',
      })
    } finally {
      setIsTestingEmail(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Email Notifications Toggle */}
      <div className="flex flex-row items-center justify-between rounded-xl border p-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <Label className="text-base font-medium">Email Notifications</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Enable or disable all email notifications globally
          </p>
        </div>
        <Switch
          checked={emailEnabled}
          onCheckedChange={setEmailEnabled}
        />
      </div>

      {/* SMTP Configuration */}
      <div className={emailEnabled ? '' : 'opacity-50 pointer-events-none'}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Server className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">SMTP Configuration</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp_host">SMTP Host</Label>
              <Input
                id="smtp_host"
                placeholder="smtp.gmail.com"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Your email server hostname</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_port">Port</Label>
              <Select value={smtpPort} onValueChange={setSmtpPort}>
                <SelectTrigger>
                  <SelectValue placeholder="Select port" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 (SMTP)</SelectItem>
                  <SelectItem value="465">465 (SMTPS)</SelectItem>
                  <SelectItem value="587">587 (Submission)</SelectItem>
                  <SelectItem value="2525">2525 (Alternative)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Use SSL/TLS</Label>
                <p className="text-xs text-muted-foreground">Required for port 465</p>
              </div>
              <Switch
                checked={smtpSecure}
                onCheckedChange={setSmtpSecure}
              />
            </div>

            <div /> {/* Spacer */}

            <div className="space-y-2">
              <Label htmlFor="smtp_user">Username</Label>
              <Input
                id="smtp_user"
                placeholder="your@email.com"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_password">Password</Label>
              <Input
                id="smtp_password"
                type="password"
                placeholder="••••••••"
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Use app-specific password for Gmail</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_from_email">From Email</Label>
              <Input
                id="smtp_from_email"
                placeholder="noreply@jkkn.ac.in"
                value={smtpFromEmail}
                onChange={(e) => setSmtpFromEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_from_name">From Name</Label>
              <Input
                id="smtp_from_name"
                placeholder="JKKN Institution"
                value={smtpFromName}
                onChange={(e) => setSmtpFromName(e.target.value)}
              />
            </div>
          </div>

          {/* Test Email Button */}
          <div className="pt-4">
            <Dialog open={testEmailDialogOpen} onOpenChange={setTestEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" disabled={!emailEnabled}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Test Email</DialogTitle>
                  <DialogDescription>
                    Enter an email address to send a test email and verify your SMTP configuration.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="test@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>

                  {testResult && (
                    <div
                      className={`flex items-center gap-2 p-3 rounded-lg ${
                        testResult.success
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span className="text-sm">{testResult.message}</span>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setTestEmailDialogOpen(false)
                      setTestResult(null)
                      setTestEmail('')
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    onClick={handleTestEmail}
                    disabled={isTestingEmail || !testEmail}
                  >
                    {isTestingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Test
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isPending} className="min-w-32">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
