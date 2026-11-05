// Enquiry box INSIDE a blog post - where it goes (lead option 2, 2026-11-05).
//
// A live 375 px check on 2026-11-05 found the only enquiry form on a blog post here in the section above
// the footer (12.7 phone screens down on the main site, 28 on Engineering). The six college sites carry
// the box right after the first answer section of every post (live 2026-11-05); this is the same rule.
//
// Posts here are either CMS HTML ({ type: 'html', html }) or a TipTap document. HTML is cut just before
// its 2nd <h2>; a TipTap document just before its 2nd level-2 heading node. The HTML cut is refused
// (null) when the part before it leaves a block element open - then the box goes after the whole post -
// so a later CMS edit that wraps the body in a <div> can never produce broken markup. No course is
// pre-selected: the reader picks.

/** The CRM tag is utm_campaign <site prefix>-<sourcePage>; the slug part is kept short. */
const SOURCE_SLUG_MAX = 40;

const BLOCK_TAGS = ['div', 'section', 'article', 'aside', 'table', 'ul', 'ol', 'blockquote', 'figure', 'details', 'p', 'pre'];

/** True when every block tag opened in `html` is also closed in it. */
export function blockTagsBalanced(html: string): boolean {
  return BLOCK_TAGS.every((tag) => {
    const open = (html.match(new RegExp(`<${tag}(?=[\\s>/])`, 'gi')) || []).length;
    const close = (html.match(new RegExp(`</${tag}\\s*>`, 'gi')) || []).length;
    return open === close;
  });
}

/** The HTML cut just before its Nth <h2> (n >= 2), or null when there is no Nth <h2> or the cut is unsafe. */
export function splitBeforeNthH2(html: string, n: number): { before: string; after: string } | null {
  if (!html || n < 2) return null;
  const re = /<h2(?=[\s>])/gi;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    count += 1;
    if (count === n) {
      const before = html.slice(0, m.index);
      const after = html.slice(m.index);
      return blockTagsBalanced(before) ? { before, after } : null;
    }
  }
  return null;
}

type TipTapNode = { type?: unknown; attrs?: unknown };

/** Index of the 2nd level-2 heading among a TipTap document's top-level nodes, or -1.
 *  A heading with no level counts as level 2 (the page renders it as an <h2>). */
export function secondH2Index(nodes: ReadonlyArray<TipTapNode> | undefined): number {
  if (!Array.isArray(nodes)) return -1;
  let count = 0;
  for (let i = 0; i < nodes.length; i += 1) {
    const n = nodes[i];
    if (!n || n.type !== 'heading') continue;
    const level = (n.attrs as { level?: number } | undefined)?.level || 2;
    if (level === 2) {
      count += 1;
      if (count === 2) return i;
    }
  }
  return -1;
}

/** The CRM source tag for a post's box. */
export function blogSourcePage(slug: string): string {
  return `blog-${(slug || 'post').slice(0, SOURCE_SLUG_MAX).replace(/-+$/, '')}`;
}
