'use client'

import { useState, useCallback } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Info,
  RefreshCw,
  Sparkles,
  Settings2,
  Palette,
  MousePointer2,
  Eye,
  EyeOff,
  Link2,
  Plus,
  Edit2,
  Wrench,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FabConfig {
  id?: string
  is_enabled: boolean
  position: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center'
  theme: 'auto' | 'light' | 'dark' | 'brand'
  primary_action: 'contact' | 'whatsapp' | 'phone' | 'email' | 'custom' | 'admin-menu'
  custom_action_label: string | null
  custom_action_url: string | null
  custom_action_icon: string | null
  show_whatsapp: boolean
  show_phone: boolean
  show_email: boolean
  show_directions: boolean
  whatsapp_number: string | null
  phone_number: string | null
  email_address: string | null
  directions_url: string | null
  animation: 'none' | 'bounce' | 'pulse' | 'shake'
  delay_ms: number
  hide_on_scroll: boolean
  custom_css: string | null
  // Admin actions
  show_add: boolean
  add_label: string | null
  add_url: string | null
  show_edit: boolean
  edit_label: string | null
  show_update: boolean
  update_label: string | null
  show_settings: boolean
  settings_label: string | null
  settings_url: string | null
}

interface FabPanelProps {
  pageId: string
  initialConfig?: Partial<FabConfig> | null
  onSave: (config: Partial<FabConfig>) => Promise<void>
  isSaving?: boolean
}

const DEFAULT_CONFIG: FabConfig = {
  is_enabled: false,
  position: 'bottom-right',
  theme: 'auto',
  primary_action: 'contact',
  custom_action_label: null,
  custom_action_url: null,
  custom_action_icon: null,
  show_whatsapp: true,
  show_phone: true,
  show_email: true,
  show_directions: false,
  whatsapp_number: null,
  phone_number: null,
  email_address: null,
  directions_url: null,
  animation: 'bounce',
  delay_ms: 0,
  hide_on_scroll: false,
  custom_css: null,
  // Admin actions
  show_add: false,
  add_label: 'Add New',
  add_url: null,
  show_edit: false,
  edit_label: 'Edit',
  show_update: false,
  update_label: 'Update',
  show_settings: false,
  settings_label: 'Settings',
  settings_url: null,
}

// FAB Preview Component
function FabPreview({ config }: { config: FabConfig }) {
  const isTopPosition = config.position.startsWith('top')

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
  }

  const themeClasses = {
    auto: 'bg-primary text-primary-foreground',
    light: 'bg-white text-gray-900 shadow-lg',
    dark: 'bg-gray-900 text-white',
    brand: 'bg-primary text-white',
  }

  const animationClasses = {
    none: '',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    shake: 'animate-pulse',
  }

  if (!config.is_enabled) {
    return (
      <div className="relative bg-muted/50 rounded-lg h-48 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <EyeOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">FAB is disabled</p>
          <p className="text-xs">Enable it to see the preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg h-48 overflow-hidden">
      {/* Mock page content */}
      <div className="absolute inset-4 flex flex-col gap-2 opacity-30">
        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-20 w-full bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      {/* FAB Preview */}
      <div
        className={cn(
          'absolute flex items-center',
          positionClasses[config.position],
          // For top positions, expand downward; for bottom, expand upward
          isTopPosition ? 'flex-col' : 'flex-col-reverse'
        )}
      >
        {/* Main FAB Button */}
        <div
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer',
            themeClasses[config.theme],
            animationClasses[config.animation]
          )}
        >
          {config.primary_action === 'contact' && <MessageCircle className="h-6 w-6" />}
          {config.primary_action === 'whatsapp' && <MessageCircle className="h-6 w-6" />}
          {config.primary_action === 'phone' && <Phone className="h-6 w-6" />}
          {config.primary_action === 'email' && <Mail className="h-6 w-6" />}
          {config.primary_action === 'custom' && <Link2 className="h-6 w-6" />}
          {config.primary_action === 'admin-menu' && <Settings2 className="h-6 w-6" />}
        </div>

        {/* Expanded Contact Actions */}
        {config.primary_action === 'contact' && (
          <div className={cn('flex flex-col gap-2 items-center', isTopPosition ? 'mt-2' : 'mb-2')}>
            {config.show_whatsapp && (
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
            )}
            {config.show_phone && (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                <Phone className="h-5 w-5 text-white" />
              </div>
            )}
            {config.show_email && (
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-md">
                <Mail className="h-5 w-5 text-white" />
              </div>
            )}
            {config.show_directions && (
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        )}

        {/* Expanded Admin Actions */}
        {config.primary_action === 'admin-menu' && (
          <div className={cn('flex flex-col gap-2 items-center', isTopPosition ? 'mt-2' : 'mb-2')}>
            {config.show_add && (
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-md" title={config.add_label || 'Add New'}>
                <Plus className="h-5 w-5 text-white" />
              </div>
            )}
            {config.show_edit && (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md" title={config.edit_label || 'Edit'}>
                <Edit2 className="h-5 w-5 text-white" />
              </div>
            )}
            {config.show_update && (
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-md" title={config.update_label || 'Update'}>
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
            )}
            {config.show_settings && (
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center shadow-md" title={config.settings_label || 'Settings'}>
                <Settings2 className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Position indicator */}
      <div className="absolute top-2 right-2">
        <span className="text-xs bg-black/50 text-white px-2 py-0.5 rounded">
          {config.position}
        </span>
      </div>
    </div>
  )
}

export function FabPanel({
  pageId,
  initialConfig,
  onSave,
  isSaving,
}: FabPanelProps) {
  // FAB form state
  const [config, setConfig] = useState<FabConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  })

  const [isDirty, setIsDirty] = useState(false)

  // Section collapse state
  const [openSections, setOpenSections] = useState({
    general: true,
    contactOptions: false,
    adminActions: false,
    contactInfo: false,
    appearance: false,
    behavior: false,
  })

  // Update a single field
  const updateField = useCallback(
    <K extends keyof FabConfig>(field: K, value: FabConfig[K]) => {
      setConfig((prev) => ({ ...prev, [field]: value }))
      setIsDirty(true)
    },
    []
  )

  // Handle save
  const handleSave = async () => {
    await onSave(config)
    setIsDirty(false)
  }

  // Toggle section
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">FAB Settings</h2>
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1" />
            )}
            {isSaving ? 'Saving...' : 'Save FAB'}
          </Button>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            {config.is_enabled ? (
              <Eye className="h-5 w-5 text-green-500" />
            ) : (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium text-sm">Floating Action Button</p>
              <p className="text-xs text-muted-foreground">
                {config.is_enabled ? 'Visible on this page' : 'Hidden on this page'}
              </p>
            </div>
          </div>
          <Switch
            checked={config.is_enabled}
            onCheckedChange={(checked) => updateField('is_enabled', checked)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Preview */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
            <FabPreview config={config} />
          </div>

          {/* General Settings */}
          <Collapsible
            open={openSections.general}
            onOpenChange={() => toggleSection('general')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">General</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSections.general && 'rotate-180'
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">
              {/* Position */}
              <div className="space-y-1.5">
                <Label>Position</Label>
                <Select
                  value={config.position}
                  onValueChange={(v) => updateField('position', v as FabConfig['position'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-center">Bottom Center</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-center">Top Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Primary Action */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1">
                  Primary Action
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[200px]">
                        <p className="text-xs">
                          The main action when users click the FAB.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select
                  value={config.primary_action}
                  onValueChange={(v) => updateField('primary_action', v as FabConfig['primary_action'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact">Contact Menu (Expandable)</SelectItem>
                    <SelectItem value="admin-menu">Admin Menu (Expandable)</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp Direct</SelectItem>
                    <SelectItem value="phone">Phone Direct</SelectItem>
                    <SelectItem value="email">Email Direct</SelectItem>
                    <SelectItem value="custom">Custom Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Action Fields */}
              {config.primary_action === 'custom' && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="custom_action_label">Button Label</Label>
                    <Input
                      id="custom_action_label"
                      value={config.custom_action_label || ''}
                      onChange={(e) => updateField('custom_action_label', e.target.value)}
                      placeholder="e.g., Apply Now"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="custom_action_url">Button URL</Label>
                    <Input
                      id="custom_action_url"
                      type="url"
                      value={config.custom_action_url || ''}
                      onChange={(e) => updateField('custom_action_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Contact Options (only for contact menu) */}
          {config.primary_action === 'contact' && (
            <Collapsible
              open={openSections.contactOptions}
              onOpenChange={() => toggleSection('contactOptions')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">Contact Options</span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.contactOptions && 'rotate-180'
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 space-y-3">
                {/* WhatsApp */}
                <div className="flex items-center justify-between p-2 rounded-md bg-background border">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">WhatsApp</span>
                  </div>
                  <Switch
                    checked={config.show_whatsapp}
                    onCheckedChange={(checked) => updateField('show_whatsapp', checked)}
                  />
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between p-2 rounded-md bg-background border">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <Switch
                    checked={config.show_phone}
                    onCheckedChange={(checked) => updateField('show_phone', checked)}
                  />
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-2 rounded-md bg-background border">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Email</span>
                  </div>
                  <Switch
                    checked={config.show_email}
                    onCheckedChange={(checked) => updateField('show_email', checked)}
                  />
                </div>

                {/* Directions */}
                <div className="flex items-center justify-between p-2 rounded-md bg-background border">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Get Directions</span>
                  </div>
                  <Switch
                    checked={config.show_directions}
                    onCheckedChange={(checked) => updateField('show_directions', checked)}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Admin Actions (only for admin-menu) */}
          {config.primary_action === 'admin-menu' && (
            <Collapsible
              open={openSections.adminActions}
              onOpenChange={() => toggleSection('adminActions')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-sm">Admin Actions</span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.adminActions && 'rotate-180'
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 space-y-4">
                {/* Add New Action */}
                <div className="space-y-2 p-3 rounded-md bg-background border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Add New</span>
                    </div>
                    <Switch
                      checked={config.show_add}
                      onCheckedChange={(checked) => updateField('show_add', checked)}
                    />
                  </div>
                  {config.show_add && (
                    <div className="space-y-2 pt-2 border-t">
                      <Input
                        placeholder="Button label (e.g., Add New)"
                        value={config.add_label || ''}
                        onChange={(e) => updateField('add_label', e.target.value)}
                      />
                      <Input
                        placeholder="URL (e.g., /admin/content/pages/new)"
                        value={config.add_url || ''}
                        onChange={(e) => updateField('add_url', e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Edit Action */}
                <div className="space-y-2 p-3 rounded-md bg-background border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Edit2 className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Edit</span>
                    </div>
                    <Switch
                      checked={config.show_edit}
                      onCheckedChange={(checked) => updateField('show_edit', checked)}
                    />
                  </div>
                  {config.show_edit && (
                    <div className="space-y-2 pt-2 border-t">
                      <Input
                        placeholder="Button label (e.g., Edit Page)"
                        value={config.edit_label || ''}
                        onChange={(e) => updateField('edit_label', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Edit action triggers inline editing mode
                      </p>
                    </div>
                  )}
                </div>

                {/* Update Action */}
                <div className="space-y-2 p-3 rounded-md bg-background border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Update</span>
                    </div>
                    <Switch
                      checked={config.show_update}
                      onCheckedChange={(checked) => updateField('show_update', checked)}
                    />
                  </div>
                  {config.show_update && (
                    <div className="space-y-2 pt-2 border-t">
                      <Input
                        placeholder="Button label (e.g., Save Changes)"
                        value={config.update_label || ''}
                        onChange={(e) => updateField('update_label', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Update action saves current changes
                      </p>
                    </div>
                  )}
                </div>

                {/* Settings Action */}
                <div className="space-y-2 p-3 rounded-md bg-background border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Settings</span>
                    </div>
                    <Switch
                      checked={config.show_settings}
                      onCheckedChange={(checked) => updateField('show_settings', checked)}
                    />
                  </div>
                  {config.show_settings && (
                    <div className="space-y-2 pt-2 border-t">
                      <Input
                        placeholder="Button label (e.g., Settings)"
                        value={config.settings_label || ''}
                        onChange={(e) => updateField('settings_label', e.target.value)}
                      />
                      <Input
                        placeholder="URL (e.g., /admin/settings)"
                        value={config.settings_url || ''}
                        onChange={(e) => updateField('settings_url', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Contact Information */}
          <Collapsible
            open={openSections.contactInfo}
            onOpenChange={() => toggleSection('contactInfo')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">Contact Information</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSections.contactInfo && 'rotate-180'
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">
              {/* WhatsApp Number */}
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                <Input
                  id="whatsapp_number"
                  value={config.whatsapp_number || ''}
                  onChange={(e) => updateField('whatsapp_number', e.target.value)}
                  placeholder="+91 98765 43210"
                />
                <p className="text-xs text-muted-foreground">
                  Include country code (e.g., +91 for India)
                </p>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={config.phone_number || ''}
                  onChange={(e) => updateField('phone_number', e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <Label htmlFor="email_address">Email Address</Label>
                <Input
                  id="email_address"
                  type="email"
                  value={config.email_address || ''}
                  onChange={(e) => updateField('email_address', e.target.value)}
                  placeholder="contact@jkkn.ac.in"
                />
              </div>

              {/* Directions URL */}
              <div className="space-y-1.5">
                <Label htmlFor="directions_url">Google Maps URL</Label>
                <Input
                  id="directions_url"
                  type="url"
                  value={config.directions_url || ''}
                  onChange={(e) => updateField('directions_url', e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Appearance */}
          <Collapsible
            open={openSections.appearance}
            onOpenChange={() => toggleSection('appearance')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-500" />
                <span className="font-medium text-sm">Appearance</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSections.appearance && 'rotate-180'
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">
              {/* Theme */}
              <div className="space-y-1.5">
                <Label>Theme</Label>
                <Select
                  value={config.theme}
                  onValueChange={(v) => updateField('theme', v as FabConfig['theme'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Match Site Theme)</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="brand">Brand Colors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Animation */}
              <div className="space-y-1.5">
                <Label>Animation</Label>
                <Select
                  value={config.animation}
                  onValueChange={(v) => updateField('animation', v as FabConfig['animation'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="bounce">Bounce</SelectItem>
                    <SelectItem value="pulse">Pulse</SelectItem>
                    <SelectItem value="shake">Shake</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Behavior */}
          <Collapsible
            open={openSections.behavior}
            onOpenChange={() => toggleSection('behavior')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <MousePointer2 className="h-4 w-4 text-cyan-500" />
                <span className="font-medium text-sm">Behavior</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSections.behavior && 'rotate-180'
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">
              {/* Delay */}
              <div className="space-y-1.5">
                <Label htmlFor="delay_ms">Appear Delay (ms)</Label>
                <Input
                  id="delay_ms"
                  type="number"
                  min={0}
                  max={10000}
                  step={100}
                  value={config.delay_ms}
                  onChange={(e) => updateField('delay_ms', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Time before FAB appears (0 = immediate)
                </p>
              </div>

              {/* Hide on Scroll */}
              <div className="flex items-center justify-between p-2 rounded-md bg-background border">
                <div>
                  <span className="text-sm font-medium">Hide on Scroll</span>
                  <p className="text-xs text-muted-foreground">
                    Hide FAB when user scrolls down
                  </p>
                </div>
                <Switch
                  checked={config.hide_on_scroll}
                  onCheckedChange={(checked) => updateField('hide_on_scroll', checked)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  )
}
