// Settings types and schemas

import { z } from 'zod'

// Database row type
export interface SiteSetting {
  id: string
  setting_key: string
  setting_value: unknown
  category: SettingCategory
  description: string | null
  is_public: boolean
  updated_by: string | null
  updated_at: string
  created_at: string
}

// Setting categories
export type SettingCategory = 'general' | 'appearance' | 'system' | 'notifications' | 'seo'

export const SETTING_CATEGORIES: { value: SettingCategory; label: string; description: string }[] = [
  { value: 'general', label: 'General', description: 'Basic site information and contact details' },
  { value: 'appearance', label: 'Appearance', description: 'Logo, colors, and visual customization' },
  { value: 'notifications', label: 'Notifications', description: 'Email and notification settings' },
  { value: 'system', label: 'System', description: 'Maintenance mode and system configuration' },
  { value: 'seo', label: 'SEO', description: 'Search engine optimization settings' },
]

// Address schema
export const AddressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  country: z.string().default('India'),
})

export type Address = z.infer<typeof AddressSchema>

// Social links schema
export const SocialLinksSchema = z.object({
  facebook: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
})

export type SocialLinks = z.infer<typeof SocialLinksSchema>

// SMTP settings schema
export const SMTPSettingsSchema = z.object({
  host: z.string().optional(),
  port: z.number().min(1).max(65535).default(587),
  secure: z.boolean().default(false),
  user: z.string().optional(),
  password: z.string().optional(),
  from_email: z.string().email().optional().or(z.literal('')),
  from_name: z.string().optional(),
})

export type SMTPSettings = z.infer<typeof SMTPSettingsSchema>

// Notification templates schema
export const NotificationTemplateSchema = z.object({
  subject: z.string(),
  body: z.string(),
})

export const NotificationTemplatesSchema = z.object({
  welcome: NotificationTemplateSchema.optional(),
  password_reset: NotificationTemplateSchema.optional(),
})

export type NotificationTemplates = z.infer<typeof NotificationTemplatesSchema>

// General settings schema
export const GeneralSettingsSchema = z.object({
  site_name: z.string().min(1, 'Site name is required'),
  site_description: z.string().optional(),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string().optional(),
  address: AddressSchema,
  social_links: SocialLinksSchema,
})

export type GeneralSettings = z.infer<typeof GeneralSettingsSchema>

// Appearance settings schema
export const AppearanceSettingsSchema = z.object({
  theme_primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  theme_secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  logo_url: z.string().optional(),
  logo_dark_url: z.string().optional(),
  favicon_url: z.string().optional(),
  hero_background_url: z.string().optional(),
})

export type AppearanceSettings = z.infer<typeof AppearanceSettingsSchema>

// System settings schema
export const SystemSettingsSchema = z.object({
  maintenance_mode: z.boolean().default(false),
  maintenance_message: z.string().optional(),
  registration_enabled: z.boolean().default(true),
  allowed_email_domains: z.array(z.string()).default(['jkkn.ac.in']),
  session_timeout_minutes: z.number().min(15).max(1440).default(480),
})

export type SystemSettings = z.infer<typeof SystemSettingsSchema>

// Notification settings schema
export const NotificationSettingsSchema = z.object({
  email_notifications_enabled: z.boolean().default(true),
  smtp_settings: SMTPSettingsSchema,
  notification_templates: NotificationTemplatesSchema.optional(),
})

export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>

// SEO settings schema
export const SEOSettingsSchema = z.object({
  default_meta_title: z.string().optional(),
  default_meta_description: z.string().max(160, 'Meta description should be under 160 characters').optional(),
  google_analytics_id: z.string().optional(),
  google_tag_manager_id: z.string().optional(),
})

export type SEOSettings = z.infer<typeof SEOSettingsSchema>

// All settings keys
export type SettingKey =
  // General
  | 'site_name'
  | 'site_description'
  | 'contact_email'
  | 'contact_phone'
  | 'address'
  | 'social_links'
  // Appearance
  | 'theme_primary_color'
  | 'theme_secondary_color'
  | 'logo_url'
  | 'logo_dark_url'
  | 'favicon_url'
  | 'hero_background_url'
  // System
  | 'maintenance_mode'
  | 'maintenance_message'
  | 'registration_enabled'
  | 'allowed_email_domains'
  | 'session_timeout_minutes'
  // Notifications
  | 'email_notifications_enabled'
  | 'smtp_settings'
  | 'notification_templates'
  // SEO
  | 'default_meta_title'
  | 'default_meta_description'
  | 'google_analytics_id'
  | 'google_tag_manager_id'

// Default values for settings
export const DEFAULT_SETTINGS: Partial<Record<SettingKey, unknown>> = {
  site_name: 'JKKN Institution',
  site_description: 'Excellence in Education since 1975',
  contact_email: 'info@jkkn.ac.in',
  contact_phone: '+91 93458 55001',
  address: {
    line1: 'Natarajapuram',
    line2: 'NH-544 (Salem To Coimbatore National Highway)',
    city: 'Kumarapalayam (TK), Namakkal (DT)',
    state: 'Tamil Nadu',
    pincode: '638183',
    country: 'India',
  },
  social_links: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  },
  theme_primary_color: '#1e40af',
  theme_secondary_color: '#f97316',
  maintenance_mode: false,
  registration_enabled: true,
  email_notifications_enabled: true,
}

// Settings metadata for UI
export interface SettingMetadata {
  key: SettingKey
  label: string
  description: string
  type: 'text' | 'textarea' | 'email' | 'url' | 'color' | 'boolean' | 'number' | 'json' | 'image' | 'array'
  category: SettingCategory
  isPublic: boolean
}

export const SETTINGS_METADATA: SettingMetadata[] = [
  // General
  { key: 'site_name', label: 'Site Name', description: 'Website name displayed in header and title', type: 'text', category: 'general', isPublic: true },
  { key: 'site_description', label: 'Site Description', description: 'Site tagline/description', type: 'textarea', category: 'general', isPublic: true },
  { key: 'contact_email', label: 'Contact Email', description: 'Primary contact email', type: 'email', category: 'general', isPublic: true },
  { key: 'contact_phone', label: 'Contact Phone', description: 'Primary contact phone', type: 'text', category: 'general', isPublic: true },
  { key: 'address', label: 'Address', description: 'Institution address', type: 'json', category: 'general', isPublic: true },
  { key: 'social_links', label: 'Social Media Links', description: 'Social media profile links', type: 'json', category: 'general', isPublic: true },

  // Appearance
  { key: 'theme_primary_color', label: 'Primary Color', description: 'Primary brand color', type: 'color', category: 'appearance', isPublic: false },
  { key: 'theme_secondary_color', label: 'Secondary Color', description: 'Secondary/accent color', type: 'color', category: 'appearance', isPublic: false },
  { key: 'logo_url', label: 'Logo', description: 'Site logo', type: 'image', category: 'appearance', isPublic: true },
  { key: 'logo_dark_url', label: 'Logo (Dark Mode)', description: 'Site logo for dark mode', type: 'image', category: 'appearance', isPublic: true },
  { key: 'favicon_url', label: 'Favicon', description: 'Browser favicon', type: 'image', category: 'appearance', isPublic: true },
  { key: 'hero_background_url', label: 'Hero Background', description: 'Default hero background image', type: 'image', category: 'appearance', isPublic: true },

  // System
  { key: 'maintenance_mode', label: 'Maintenance Mode', description: 'Enable maintenance mode for the public site', type: 'boolean', category: 'system', isPublic: false },
  { key: 'maintenance_message', label: 'Maintenance Message', description: 'Message displayed during maintenance', type: 'textarea', category: 'system', isPublic: false },
  { key: 'registration_enabled', label: 'Allow Registration', description: 'Allow new user registration', type: 'boolean', category: 'system', isPublic: false },
  { key: 'allowed_email_domains', label: 'Allowed Email Domains', description: 'Allowed email domains for registration', type: 'array', category: 'system', isPublic: false },
  { key: 'session_timeout_minutes', label: 'Session Timeout', description: 'Session timeout in minutes', type: 'number', category: 'system', isPublic: false },

  // Notifications
  { key: 'email_notifications_enabled', label: 'Email Notifications', description: 'Enable email notifications globally', type: 'boolean', category: 'notifications', isPublic: false },
  { key: 'smtp_settings', label: 'SMTP Settings', description: 'SMTP configuration for sending emails', type: 'json', category: 'notifications', isPublic: false },
  { key: 'notification_templates', label: 'Email Templates', description: 'Email notification templates', type: 'json', category: 'notifications', isPublic: false },

  // SEO
  { key: 'default_meta_title', label: 'Default Meta Title', description: 'Default page title for SEO', type: 'text', category: 'seo', isPublic: true },
  { key: 'default_meta_description', label: 'Default Meta Description', description: 'Default meta description for SEO', type: 'textarea', category: 'seo', isPublic: true },
  { key: 'google_analytics_id', label: 'Google Analytics ID', description: 'Google Analytics tracking ID', type: 'text', category: 'seo', isPublic: false },
  { key: 'google_tag_manager_id', label: 'Google Tag Manager ID', description: 'Google Tag Manager container ID', type: 'text', category: 'seo', isPublic: false },
]
