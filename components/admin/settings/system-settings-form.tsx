'use client'

import { useState, useTransition } from 'react'
import { updateSettings, clearCache } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Loader2,
  Save,
  ShieldAlert,
  UserPlus,
  Clock,
  Trash2,
  AlertTriangle,
  RefreshCw,
  X,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'

interface SystemSettingsFormProps {
  initialSettings: Record<string, unknown>
}

export function SystemSettingsForm({ initialSettings }: SystemSettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isClearingCache, setIsClearingCache] = useState(false)
  const [newDomain, setNewDomain] = useState('')

  // Form state
  const [maintenanceMode, setMaintenanceMode] = useState(
    (initialSettings.maintenance_mode as boolean) ?? false
  )
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    (initialSettings.maintenance_message as string) || ''
  )
  const [registrationEnabled, setRegistrationEnabled] = useState(
    (initialSettings.registration_enabled as boolean) ?? true
  )
  const [allowedDomains, setAllowedDomains] = useState<string[]>(
    (initialSettings.allowed_email_domains as string[]) || ['jkkn.ac.in']
  )
  const [sessionTimeout, setSessionTimeout] = useState(
    String((initialSettings.session_timeout_minutes as number) || 480)
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    startTransition(async () => {
      const settings = {
        maintenance_mode: maintenanceMode,
        maintenance_message: maintenanceMessage,
        registration_enabled: registrationEnabled,
        allowed_email_domains: allowedDomains,
        session_timeout_minutes: parseInt(sessionTimeout, 10),
      }

      const result = await updateSettings(settings)

      if (result.success) {
        toast.success('System settings saved successfully')
      } else {
        toast.error(result.message || 'Failed to save settings')
      }
    })
  }

  async function handleClearCache() {
    setIsClearingCache(true)
    try {
      const result = await clearCache()
      if (result.success) {
        toast.success('Cache cleared successfully')
      } else {
        toast.error(result.message || 'Failed to clear cache')
      }
    } catch {
      toast.error('An error occurred while clearing cache')
    } finally {
      setIsClearingCache(false)
    }
  }

  const addDomain = () => {
    if (!newDomain) return
    const domain = newDomain.toLowerCase().trim()
    if (domain && !allowedDomains.includes(domain)) {
      setAllowedDomains([...allowedDomains, domain])
      setNewDomain('')
    }
  }

  const removeDomain = (domain: string) => {
    setAllowedDomains(allowedDomains.filter((d) => d !== domain))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Maintenance Mode */}
      <div className="rounded-xl border border-destructive/20 p-4 space-y-4">
        <div className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <Label className="text-base font-medium">Maintenance Mode</Label>
              {maintenanceMode && (
                <Badge variant="destructive" className="animate-pulse">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, the public site will show a maintenance message
            </p>
          </div>
          <Switch
            checked={maintenanceMode}
            onCheckedChange={setMaintenanceMode}
          />
        </div>

        {maintenanceMode && (
          <div className="space-y-2">
            <Label>Maintenance Message</Label>
            <Textarea
              placeholder="We are currently performing scheduled maintenance. Please check back soon."
              className="resize-none"
              rows={3}
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This message will be displayed to visitors during maintenance
            </p>
          </div>
        )}
      </div>

      {/* Registration Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <UserPlus className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Registration</h3>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Allow Registration</Label>
            <p className="text-sm text-muted-foreground">
              Allow new users to register on the platform
            </p>
          </div>
          <Switch
            checked={registrationEnabled}
            onCheckedChange={setRegistrationEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Allowed Email Domains</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {allowedDomains.map((domain) => (
              <Badge
                key={domain}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                @{domain}
                <button
                  type="button"
                  onClick={() => removeDomain(domain)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="example.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addDomain()
                }
              }}
              className="max-w-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addDomain}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Only emails from these domains can register
          </p>
        </div>
      </div>

      {/* Session Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Session</h3>
        </div>

        <div className="space-y-2">
          <Label>Session Timeout (minutes)</Label>
          <Input
            type="number"
            min={15}
            max={1440}
            className="max-w-xs"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Users will be logged out after this period of inactivity (15-1440 minutes)
          </p>
        </div>
      </div>

      {/* Cache Management */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Cache Management</h3>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium">Clear Application Cache</p>
            <p className="text-sm text-muted-foreground">
              Clear cached pages and data to apply changes immediately
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline" disabled={isClearingCache}>
                {isClearingCache ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Cache
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Clear Application Cache?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all cached pages and data. The next page load may be slightly slower as the cache rebuilds.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearCache}>
                  Clear Cache
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
