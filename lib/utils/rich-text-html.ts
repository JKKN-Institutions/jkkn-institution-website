// lib/utils/rich-text-html.ts
//
// Sanitises the HTML the CMS inline editor (Tiptap) stores in a block prop.
//
// Dependency-free on purpose, for the same reason as careers-html.ts:
// isomorphic-dompurify pulls jsdom into the server render, and that fails in
// production. Inside a lazy CMS block the failure is quiet - React falls back
// to the Suspense skeleton (minified error 419), so the page still answers 200
// but its server HTML has no H1 and no text for crawlers that run no JavaScript.
//
// How it stays safe:
//   - every `<` in the output comes from a tag rebuilt here; any other `<` is
//     escaped, so text can never turn into markup;
//   - tags outside ALLOWED_TAGS are dropped (script/style/iframe... with their
//     content), and attributes are re-emitted from scratch: only `style`
//     (allow-listed properties with strictly checked values) and, on <a>, a
//     safe `href` and `target="_blank"`.
// The server and the browser run this same function, so hydration sees the
// same string on both sides.

const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr', 'span', 'div', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'sub', 'sup', 'small', 'mark',
  'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a',
])
const VOID_TAGS = new Set(['br', 'hr'])

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([0-9.,%/ ]+\)|hsla?\([0-9.,%/ a-z]+\)|[a-z]+)$/i
const ALLOWED_STYLES: Record<string, RegExp> = {
  'text-align': /^(left|right|center|justify|start|end)$/i,
  color: COLOR,
  'background-color': COLOR,
  'font-size': /^[0-9]+(\.[0-9]+)?(px|em|rem|pt|%)$/i,
  'font-weight': /^(normal|bold|[1-9]00)$/i,
  'font-style': /^(normal|italic)$/i,
  'text-decoration': /^(none|underline|line-through)$/i,
}

/** Elements whose *content* must go too, not just the tags. */
const DROP_WITH_CONTENT = /<(script|style|iframe|object|embed|noscript|template|svg|math|textarea|title)\b[^>]*>[\s\S]*?<\/\1\s*>/gi
const COMMENT = /<!--[\s\S]*?-->/g
/** A real tag start (letter, `/`, `!` or `?` after the `<`) up to its `>`, or any other lone `<`. */
const TAG_OR_STRAY = /<[a-zA-Z/!?][^>]*>|</g
const PARSE_TAG = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([\s\S]*)>$/
const ATTR = /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g
const SAFE_HREF = /^(?:https?:|mailto:|tel:|\/|#)/i

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function readAttrs(raw: string): Map<string, string> {
  const attrs = new Map<string, string>()
  for (const m of raw.matchAll(ATTR)) {
    const name = m[1].toLowerCase()
    if (!attrs.has(name)) attrs.set(name, (m[2] ?? m[3] ?? m[4] ?? '').trim())
  }
  return attrs
}

function cleanStyle(style: string): string {
  const kept: string[] = []
  for (const declaration of style.split(';')) {
    const colon = declaration.indexOf(':')
    if (colon < 0) continue
    const prop = declaration.slice(0, colon).trim().toLowerCase()
    const value = declaration.slice(colon + 1).trim()
    if (ALLOWED_STYLES[prop]?.test(value)) kept.push(`${prop}: ${value};`)
  }
  return kept.join(' ')
}

function rebuildTag(tagText: string): string {
  if (tagText === '<') return '&lt;'
  const m = PARSE_TAG.exec(tagText)
  if (!m) return '' // comments, doctype, malformed - gone
  const closing = m[1] === '/'
  const tag = m[2].toLowerCase()
  if (!ALLOWED_TAGS.has(tag)) return ''
  if (closing) return VOID_TAGS.has(tag) ? '' : `</${tag}>`

  const attrs = readAttrs(m[3])
  let out = `<${tag}`
  const style = cleanStyle(attrs.get('style') ?? '')
  if (style) out += ` style="${escapeAttr(style)}"`
  if (tag === 'a') {
    const href = attrs.get('href') ?? ''
    if (SAFE_HREF.test(href)) {
      out += ` href="${escapeAttr(href)}"`
      if (attrs.get('target') === '_blank') out += ' target="_blank" rel="noopener noreferrer"'
    }
  }
  return `${out}>`
}

export function sanitizeRichTextHtml(html: string): string {
  return html.replace(COMMENT, '').replace(DROP_WITH_CONTENT, '').replace(TAG_OR_STRAY, rebuildTag)
}
