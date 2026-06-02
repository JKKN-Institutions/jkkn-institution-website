'use client'

import { useEffect } from 'react'

/**
 * Performs a full-page browser navigation to an external (cross-origin) URL.
 *
 * Why this exists instead of a server `redirect()`:
 * A CMS page can set `metadata.redirect_url` to an off-site URL (e.g. a Google
 * Drive PDF). The public catch-all renders in a *streaming context*, so calling
 * `redirect()` to a cross-origin URL there does NOT emit a 307 — Next.js falls
 * back to inserting a `<meta http-equiv="refresh">` tag (see Next.js docs for
 * `redirect`). That meta tag works on a hard page load, but the App Router
 * cannot follow it during an in-app (soft) navigation from a <Link>, which
 * surfaces as the "This page couldn't load" error overlay.
 *
 * `window.location.replace()` forces an actual browser navigation that behaves
 * identically for both hard loads and soft navigations, and `replace` keeps the
 * redirecting URL out of the history stack so Back returns to the prior page.
 */
export function ExternalRedirect({ url }: { url: string }) {
  useEffect(() => {
    window.location.replace(url)
  }, [url])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-gray-600">Redirecting&hellip;</p>
      <a
        href={url}
        rel="noopener noreferrer"
        className="text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-gray-700"
      >
        Click here if you are not redirected automatically.
      </a>
    </div>
  )
}
