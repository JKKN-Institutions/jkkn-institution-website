// lib/utils/careers-html.ts
//
// MyJKKN's job editor stores descriptions as HTML (<p>, <strong>, <ul>…).
// The API passes it through untouched, so the website must sanitise before
// rendering: HR-authored today, but the field is still remote content.
//
// Dependency-free on purpose. This runs in a Server Component; the earlier
// isomorphic-dompurify version dragged jsdom into the server bundle, which
// works under `next dev` but breaks in the production build (500 on every
// /careers/[id]). The allowed markup is tiny — exactly what the editor
// emits — so an allow-list tokenizer is both safer to ship and enough:
//   - every tag not in ALLOWED_TAGS is dropped (script/style/iframe… with
//     their content), all attributes are dropped, and tags are re-emitted
//     from scratch — nothing from the input reaches the output as markup;
//   - <a> keeps only an https:/mailto:/tel: href, always with rel+target.

const ALLOWED_TAGS = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'a'])

/** Elements whose *content* must go too, not just the tags. */
const DROP_WITH_CONTENT = /<(script|style|iframe|object|embed|noscript|template|svg|math|textarea|title)\b[^>]*>[\s\S]*?<\/\1\s*>/gi
const COMMENT = /<!--[\s\S]*?-->/g
const TAG = /<[^>]*>/g
const PARSE_TAG = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([\s\S]*)>$/
const HREF = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i
const SAFE_HREF = /^(?:https?:|mailto:|tel:)/i

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** True when the text carries editor markup rather than plain prose. */
export function looksLikeHtml(text: string): boolean {
  return /<\/?[a-z][a-z0-9]*(\s[^>]*)?>/i.test(text)
}

function rebuildTag(token: string): string {
  const m = PARSE_TAG.exec(token)
  if (!m) return '' // comment fragments, `< b >`, malformed — gone
  const closing = m[1] === '/'
  const tag = m[2].toLowerCase()
  if (!ALLOWED_TAGS.has(tag)) return ''
  if (tag === 'br') return closing ? '' : '<br>'
  if (tag === 'a') {
    if (closing) return '</a>'
    const h = HREF.exec(m[3])
    const href = (h?.[1] ?? h?.[2] ?? h?.[3] ?? '').trim()
    // Unsafe or missing href → anchor stays as plain text (matches DOMPurify).
    if (!SAFE_HREF.test(href)) return '<a>'
    return `<a href="${escapeAttr(href)}" rel="noopener noreferrer" target="_blank">`
  }
  return closing ? `</${tag}>` : `<${tag}>`
}

export function sanitizeJobHtml(html: string): string {
  let out = html.replace(COMMENT, '').replace(DROP_WITH_CONTENT, '').replace(TAG, rebuildTag)
  // Anything after the last emitted `>` cannot contain a tag we produced, so
  // a dangling `<` there is raw text — neutralise it.
  const tail = out.lastIndexOf('>') + 1
  out = out.slice(0, tail) + out.slice(tail).replace(/</g, '&lt;')
  return out.trim()
}
