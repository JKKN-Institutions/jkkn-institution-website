// Which block gets PageRenderer's firstBlockAside (www homepage enquiry card in the hero, 2026-11-17).
// Pure, so the rule is unit-tested without rendering the CMS registry.

export type FirstBlockAside<N> = { component: string; node: N }

/** The aside for the block at `index`: only the first top-level block, and only when its component
 *  is the one named. Anything else gets undefined, so the page renders exactly as before. */
export function asideForBlock<N>(
  index: number,
  componentName: string,
  firstBlockAside: FirstBlockAside<N> | undefined
): N | undefined {
  if (index !== 0 || !firstBlockAside) return undefined
  return componentName === firstBlockAside.component ? firstBlockAside.node : undefined
}
