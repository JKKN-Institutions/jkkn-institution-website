'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateSettings } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2, Save, Building2, Phone, Mail, Globe } from 'lucide-react'
import { toast } from 'sonner'

const generalSettingsSchema = z.object({
  site_name: z.string().min(1, 'Site name is required'),
  site_description: z.string(),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string(),
  address_line1: z.string().min(1, 'Address line 1 is required'),
  address_line2: z.string(),
  address_city: z.string().min(1, 'City is required'),
  address_state: z.string().min(1, 'State is required'),
  address_pincode: z.string().min(1, 'Pincode is required'),
  address_country: z.string(),
  social_facebook: z.string(),
  social_twitter: z.string(),
  social_instagram: z.string(),
  social_linkedin: z.string(),
  social_youtube: z.string(),
})

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>

interface GeneralSettingsFormProps {
  initialSettings: Record<string, unknown>
}

export function GeneralSettingsForm({ initialSettings }: GeneralSettingsFormProps) {
  const [isPending, startTransition] = useTransition()

  // Parse address and social links from settings
  const address = (initialSettings.address as Record<string, string>) || {}
  const socialLinks = (initialSettings.social_links as Record<string, string>) || {}

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      site_name: (initialSettings.site_name as string) || '',
      site_description: (initialSettings.site_description as string) || '',
      contact_email: (initialSettings.contact_email as string) || '',
      contact_phone: (initialSettings.contact_phone as string) || '',
      address_line1: address.line1 || '',
      address_line2: address.line2 || '',
      address_city: address.city || '',
      address_state: address.state || '',
      address_pincode: address.pincode || '',
      address_country: address.country || 'India',
      social_facebook: socialLinks.facebook || '',
      social_twitter: socialLinks.twitter || '',
      social_instagram: socialLinks.instagram || '',
      social_linkedin: socialLinks.linkedin || '',
      social_youtube: socialLinks.youtube || '',
    },
  })

  async function onSubmit(data: GeneralSettingsFormValues) {
    startTransition(async () => {
      // Reconstruct address and social links objects
      const settings = {
        site_name: data.site_name,
        site_description: data.site_description || '',
        contact_email: data.contact_email,
        contact_phone: data.contact_phone || '',
        address: {
          line1: data.address_line1,
          line2: data.address_line2 || '',
          city: data.address_city,
          state: data.address_state,
          pincode: data.address_pincode,
          country: data.address_country,
        },
        social_links: {
          facebook: data.social_facebook || '',
          twitter: data.social_twitter || '',
          instagram: data.social_instagram || '',
          linkedin: data.social_linkedin || '',
          youtube: data.social_youtube || '',
        },
      }

      const result = await updateSettings(settings)

      if (result.success) {
        toast.success('Settings saved successfully')
      } else {
        toast.error(result.message || 'Failed to save settings')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Site Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Site Information</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="site_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="JKKN Institution" {...field} />
                  </FormControl>
                  <FormDescription>
                    Displayed in the header and browser tab
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="site_description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Site Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Excellence in Education since 1975"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief tagline or description of your institution
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Contact Information</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="info@jkkn.ac.in" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 422 266 1100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Address</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="address_line1"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Address Line 1 *</FormLabel>
                  <FormControl>
                    <Input placeholder="JKKN Group of Institutions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line2"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Komarapalayam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input placeholder="Namakkal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State *</FormLabel>
                  <FormControl>
                    <Input placeholder="Tamil Nadu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode *</FormLabel>
                  <FormControl>
                    <Input placeholder="638183" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Social Media Links</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="social_facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter / X</FormLabel>
                  <FormControl>
                    <Input placeholder="https://twitter.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/company/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
    </Form>
  )
}
