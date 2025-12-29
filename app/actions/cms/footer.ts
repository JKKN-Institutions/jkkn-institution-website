'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

/**
 * Footer link item type
 */
export interface FooterLink {
  label: string
  href: string
  order: number
  visible: boolean
}

/**
 * Footer sections visibility type
 */
export interface FooterSectionsVisibility {
  show_about: boolean
  show_institutions: boolean
  show_programs: boolean
  show_resources: boolean
  show_social: boolean
}

/**
 * Footer settings type
 */
export interface FooterSettings {
  tagline: string
  description: string
  institutions: FooterLink[]
  programs: FooterLink[]
  resources: FooterLink[]
  sectionsVisibility: FooterSectionsVisibility
  contactEmail: string
  contactPhone: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
    country: string
  }
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  map: {
    embedUrl: string
    linkUrl: string
  }
}

/**
 * Get complete footer settings from site_settings
 */
export async function getFooterSettings(): Promise<FooterSettings> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('site_settings')
    .select('setting_key, setting_value')
    .in('setting_key', [
      'footer_tagline',
      'footer_description',
      'footer_institutions',
      'footer_programs',
      'footer_resources',
      'footer_sections_visibility',
      'contact_email',
      'contact_phone',
      'address',
      'social_links',
      'footer_map'
    ])

  if (error) {
    console.error('Error fetching footer settings:', error)
    // Return defaults if fetch fails
    return getDefaultFooterSettings()
  }

  const settings: Partial<FooterSettings> = {}

  data?.forEach((setting) => {
    const value = setting.setting_value

    switch (setting.setting_key) {
      case 'footer_tagline':
        settings.tagline = String(value)
        break
      case 'footer_description':
        settings.description = String(value)
        break
      case 'footer_institutions':
        settings.institutions = Array.isArray(value) ? value : []
        break
      case 'footer_programs':
        settings.programs = Array.isArray(value) ? value : []
        break
      case 'footer_resources':
        settings.resources = Array.isArray(value) ? value : []
        break
      case 'footer_sections_visibility':
        settings.sectionsVisibility = value as FooterSectionsVisibility
        break
      case 'contact_email':
        settings.contactEmail = String(value)
        break
      case 'contact_phone':
        settings.contactPhone = String(value)
        break
      case 'address':
        settings.address = value as FooterSettings['address']
        break
      case 'social_links':
        settings.socialLinks = value as FooterSettings['socialLinks']
        break
      case 'footer_map':
        settings.map = value as FooterSettings['map']
        break
    }
  })

  return {
    ...getDefaultFooterSettings(),
    ...settings
  } as FooterSettings
}

/**
 * Get default footer settings
 */
function getDefaultFooterSettings(): FooterSettings {
  return {
    tagline: 'Excellence in Education',
    description: 'JKKN Group of Institutions is committed to providing quality education across various disciplines. With a legacy of over 73 years since 1952, we empower Learners to achieve their dreams through innovation and excellence.',
    institutions: [],
    programs: [],
    resources: [],
    sectionsVisibility: {
      show_about: true,
      show_institutions: true,
      show_programs: true,
      show_resources: true,
      show_social: true
    },
    contactEmail: 'info@jkkn.ac.in',
    contactPhone: '+91 93458 55001',
    address: {
      line1: 'Natarajapuram,',
      line2: 'NH-544 (Salem To Coimbatore National Highway),',
      city: 'Kumarapalayam (TK), Namakkal (DT)',
      state: 'Tamil Nadu',
      pincode: '638183',
      country: 'India'
    },
    socialLinks: {
      facebook: 'https://facebook.com/myjkkn',
      twitter: 'https://x.com/jkkninstitution',
      instagram: 'https://instagram.com/jkkninstitutions',
      linkedin: 'https://linkedin.com/school/jkkninstitutions/',
      youtube: 'https://youtube.com/@JKKNINSTITUTIONS'
    },
    map: {
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.2834563159936!2d77.58373!3d11.26611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96d9e6b5f2e5d%3A0x4c4d5c5e2c7d3d5d!2sJKKN%20Educational%20Institutions!5e0!3m2!1sen!2sin!4v1703500000000!5m2!1sen!2sin',
      linkUrl: 'https://www.google.com/maps/place/JKKN+Educational+Institutions/@11.26611,77.58373,17z'
    }
  }
}
