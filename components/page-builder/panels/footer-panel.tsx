'use client'

import { useState, useCallback } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  FileText,
  Link2,
  Phone,
  Mail,
  MapPin,
  Share2,
  ChevronDown,
  RefreshCw,
  Sparkles,
  Plus,
  X,
  GripVertical,
  Eye,
  EyeOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FooterSettings, FooterLink } from '@/app/actions/cms/footer'

interface FooterPanelProps {
  initialSettings: FooterSettings
  onSave: (settings: FooterSettings) => Promise<void>
  isSaving?: boolean
}

export function FooterPanel({
  initialSettings,
  onSave,
  isSaving,
}: FooterPanelProps) {
  const [settings, setSettings] = useState<FooterSettings>(initialSettings)
  const [isDirty, setIsDirty] = useState(false)

  // Section collapse state
  const [openSections, setOpenSections] = useState({
    about: true,
    institutions: false,
    programs: false,
    resources: false,
    contact: false,
    social: false,
  })

  // Toggle section
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Update a field
  const updateField = useCallback(
    <K extends keyof FooterSettings>(field: K, value: FooterSettings[K]) => {
      setSettings((prev) => ({ ...prev, [field]: value }))
      setIsDirty(true)
    },
    []
  )

  // Update sections visibility
  const updateVisibility = useCallback(
    (field: keyof FooterSettings['sectionsVisibility'], value: boolean) => {
      setSettings((prev) => ({
        ...prev,
        sectionsVisibility: {
          ...prev.sectionsVisibility,
          [field]: value,
        },
      }))
      setIsDirty(true)
    },
    []
  )

  // Update address
  const updateAddress = useCallback(
    (field: keyof FooterSettings['address'], value: string) => {
      setSettings((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }))
      setIsDirty(true)
    },
    []
  )

  // Update social links
  const updateSocialLink = useCallback(
    (field: keyof NonNullable<FooterSettings['socialLinks']>, value: string) => {
      setSettings((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value,
        },
      }))
      setIsDirty(true)
    },
    []
  )

  // Add link to array
  const addLink = useCallback(
    (field: 'institutions' | 'programs' | 'resources') => {
      setSettings((prev) => ({
        ...prev,
        [field]: [
          ...prev[field],
          { label: '', href: '', order: prev[field].length, visible: true },
        ],
      }))
      setIsDirty(true)
    },
    []
  )

  // Remove link from array
  const removeLink = useCallback(
    (field: 'institutions' | 'programs' | 'resources', index: number) => {
      setSettings((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }))
      setIsDirty(true)
    },
    []
  )

  // Update link in array
  const updateLink = useCallback(
    (
      field: 'institutions' | 'programs' | 'resources',
      index: number,
      key: keyof FooterLink,
      value: string | number | boolean
    ) => {
      setSettings((prev) => ({
        ...prev,
        [field]: prev[field].map((link, i) =>
          i === index ? { ...link, [key]: value } : link
        ),
      }))
      setIsDirty(true)
    },
    []
  )

  // Handle save
  const handleSave = async () => {
    try {
      await onSave(settings)
      setIsDirty(false)
    } catch (error) {
      console.error('Footer save error:', error)
    }
  }

  // Render links section
  const renderLinksSection = (
    field: 'institutions' | 'programs' | 'resources',
    title: string,
    visibilityKey: 'show_institutions' | 'show_programs' | 'show_resources',
    placeholder: { label: string; href: string }
  ) => (
    <Collapsible
      open={openSections[field]}
      onOpenChange={() => toggleSection(field)}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">{title}</span>
          <span className="text-xs text-muted-foreground">
            ({settings[field].length})
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            openSections[field] && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-4">
        {/* Visibility Toggle */}
        <div className="flex items-center justify-between p-2 rounded-md bg-background border">
          <span className="text-sm">Show Section</span>
          <Switch
            checked={settings.sectionsVisibility[visibilityKey]}
            onCheckedChange={(checked) => updateVisibility(visibilityKey, checked)}
          />
        </div>

        {/* Links */}
        <div className="space-y-3">
          {settings[field].map((link, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 border rounded-lg bg-background"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0 cursor-move" />
              <div className="flex-1 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={link.label}
                    onChange={(e) =>
                      updateLink(field, index, 'label', e.target.value)
                    }
                    placeholder={placeholder.label}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">URL</Label>
                  <Input
                    value={link.href}
                    onChange={(e) =>
                      updateLink(field, index, 'href', e.target.value)
                    }
                    placeholder={placeholder.href}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  updateLink(field, index, 'visible', !link.visible)
                }
                className="mt-5"
              >
                {link.visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeLink(field, index)}
                className="mt-5 text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add Link Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addLink(field)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Footer Settings</h2>
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
            {isSaving ? 'Saving...' : 'Save Footer'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Manage footer content, links, contact info, and social media
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* About Section */}
          <Collapsible
            open={openSections.about}
            onOpenChange={() => toggleSection('about')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">About Section</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSections.about && 'rotate-180'
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">
              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-2 rounded-md bg-background border">
                <span className="text-sm">Show Section</span>
                <Switch
                  checked={settings.sectionsVisibility.show_about}
                  onCheckedChange={(checked) =>
                    updateVisibility('show_about', checked)
                  }
                />
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  placeholder="Excellence in Education"
                />
                <p className="text-xs text-muted-foreground">
                  Short tagline displayed below the logo
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={4}
                  placeholder="Brief description about the institution..."
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Institutions Links */}
          {renderLinksSection(
            'institutions',
            'Our Institutions',
            'show_institutions',
            { label: 'JKKN Dental College', href: 'https://dental.jkkn.ac.in' }
          )}

          {/* Programs Links */}
          {renderLinksSection('programs', 'Programs', 'show_programs', {
            label: 'B.E. Computer Science',
            href: '/programs/computer-science',
          })}

          {/* Resources Links */}
          {renderLinksSection('resources', 'Resources', 'show_resources', {
            label: 'Library',
            href: '/resources/library',
          })}

          {/* Contact Information */}
          <Collapsible
            open={openSections.contact}
            onOpenChange={() => toggleSection('contact')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">Contact Information</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSections.contact && 'rotate-180'
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="contactEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    placeholder="info@jkkn.ac.in"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="contactPhone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                    placeholder="+91 422 266 1100"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>

                <Input
                  value={settings.address.line1}
                  onChange={(e) => updateAddress('line1', e.target.value)}
                  placeholder="Address Line 1"
                />

                <Input
                  value={settings.address.line2 || ''}
                  onChange={(e) => updateAddress('line2', e.target.value)}
                  placeholder="Address Line 2 (Optional)"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={settings.address.city}
                    onChange={(e) => updateAddress('city', e.target.value)}
                    placeholder="City"
                  />
                  <Input
                    value={settings.address.state}
                    onChange={(e) => updateAddress('state', e.target.value)}
                    placeholder="State"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={settings.address.pincode}
                    onChange={(e) => updateAddress('pincode', e.target.value)}
                    placeholder="Pincode"
                  />
                  <Input
                    value={settings.address.country}
                    onChange={(e) => updateAddress('country', e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Social Media */}
          <Collapsible
            open={openSections.social}
            onOpenChange={() => toggleSection('social')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-purple-500" />
                <span className="font-medium text-sm">Social Media</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSections.social && 'rotate-180'
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">
              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-2 rounded-md bg-background border">
                <span className="text-sm">Show Section</span>
                <Switch
                  checked={settings.sectionsVisibility.show_social}
                  onCheckedChange={(checked) =>
                    updateVisibility('show_social', checked)
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    type="url"
                    value={settings.socialLinks?.facebook || ''}
                    onChange={(e) => updateSocialLink('facebook', e.target.value)}
                    placeholder="https://facebook.com/jkkn"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={settings.socialLinks?.twitter || ''}
                    onChange={(e) => updateSocialLink('twitter', e.target.value)}
                    placeholder="https://twitter.com/jkkn"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    type="url"
                    value={settings.socialLinks?.instagram || ''}
                    onChange={(e) => updateSocialLink('instagram', e.target.value)}
                    placeholder="https://instagram.com/jkkn"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={settings.socialLinks?.linkedin || ''}
                    onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/jkkn"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="youtube">YouTube URL</Label>
                  <Input
                    id="youtube"
                    type="url"
                    value={settings.socialLinks?.youtube || ''}
                    onChange={(e) => updateSocialLink('youtube', e.target.value)}
                    placeholder="https://youtube.com/jkkn"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  )
}
