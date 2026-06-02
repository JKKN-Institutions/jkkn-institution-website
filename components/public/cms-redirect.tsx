import { redirect } from 'next/navigation'
import { ExternalRedirect } from './external-redirect'

/**
 * Renders a CMS-configured redirect (`page.metadata.redirect_url`).
 *
 * - **External URLs** (cross-origin, e.g. Google Drive) are redirected with a
 *   full-page browser navigation via {@link ExternalRedirect}. A server-side
 *   `redirect()` to a cross-origin URL renders in a streaming context and only
 *   emits a `<meta refresh>` tag, which the App Router cannot follow during an
 *   in-app (soft) navigation — producing the "This page couldn't load" error.
 * - **Internal / same-origin URLs** use the native server `redirect()`, which
 *   issues a real 307 the router follows correctly for hard *and* soft nav.
 */
export function CmsRedirect({ url }: { url: string }) {
  if (/^https?:\/\//i.test(url)) {
    return <ExternalRedirect url={url} />
  }

  // Same-origin/relative redirect — server redirect() is safe and preferred.
  redirect(url)
}
