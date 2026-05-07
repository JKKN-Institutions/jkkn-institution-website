// lib/sync/photo-rehost.ts
//
// Downloads a faculty profile photo from MyJKKN's Supabase bucket and
// re-uploads it to ours (faculty-photos). Decouples our public site from
// MyJKKN's bucket uptime; also gives us a stable URL even if MyJKKN deletes
// the source.
//
// Idempotent: same staffId always uses the same key, so repeated calls just
// overwrite the same object. Cheap to call on every sync tick.

import { createClient } from '@supabase/supabase-js'

const BUCKET = 'faculty-photos'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('[photo-rehost] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set')
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

/**
 * Returns the public URL of the rehosted photo, or null if upstream had no
 * photo / the fetch or upload failed. Failures are logged but never throw —
 * a missing photo just means the row will be marked draft (by the
 * completeness rule), which is the desired behavior.
 */
export async function rehostFacultyPhoto(
  apiPhotoUrl: string | null,
  staffId: string | null,
  apiUuid: string
): Promise<string | null> {
  if (!apiPhotoUrl) return null
  const sb = getServiceClient()
  const key = `${staffId ?? apiUuid}.jpg`

  let res: Response
  try {
    res = await fetch(apiPhotoUrl)
  } catch (e) {
    console.warn(`[photo-rehost] fetch failed for ${apiPhotoUrl}: ${(e as Error).message}`)
    return null
  }
  if (!res.ok) {
    console.warn(`[photo-rehost] upstream ${res.status} for ${apiPhotoUrl}`)
    return null
  }

  const buf = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') ?? 'image/jpeg'

  const { error } = await sb.storage.from(BUCKET).upload(key, buf, {
    contentType,
    upsert: true,
    cacheControl: '3600',
  })
  if (error) {
    console.warn(`[photo-rehost] upload failed for ${key}: ${error.message}`)
    return null
  }

  const { data } = sb.storage.from(BUCKET).getPublicUrl(key)
  return data.publicUrl
}
