import { redirect } from 'next/navigation'

// Redirect /admin/settings to /admin/settings/general
export default function SettingsPage() {
  redirect('/admin/settings/general')
}
