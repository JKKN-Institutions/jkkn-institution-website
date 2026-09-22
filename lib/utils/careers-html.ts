// lib/utils/careers-html.ts
//
// MyJKKN's job editor stores descriptions as HTML (<p>, <strong>, <ul>…).
// The API passes it through untouched, so the website must sanitise before
// rendering: HR-authored today, but the field is still remote content.
// Allowlist = exactly what the editor can produce. Everything else is dropped.

import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'a']
const ALLOWED_ATTR = ['href']

let hooked = false
function ensureLinkHardening() {
  if (hooked) return
  hooked = true
  DOMPurify.addHook('afterSanitizeAttributes', node => {
    if (node.tagName === 'A') {
      node.setAttribute('rel', 'noopener noreferrer')
      node.setAttribute('target', '_blank')
    }
  })
}

/** True when the text carries editor markup rather than plain prose. */
export function looksLikeHtml(text: string): boolean {
  return /<\/?[a-z][a-z0-9]*(\s[^>]*)?>/i.test(text)
}

export function sanitizeJobHtml(html: string): string {
  ensureLinkHardening()
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:)/i,
  }).trim()
}
