/**
 * <MainInstitutionPageSchema />
 *
 * Single injection point for per-page JSON-LD on the MAIN deployment.
 * Gated by isMainInstitution() — Engineering / Dental / Pharmacy / Nursing
 * deployments render null and emit ZERO extra JSON-LD from this component.
 *
 * Wraps multiple schemas in one @graph with @id cross-references so
 * AI engines (ChatGPT, Perplexity, Google AI Overviews) can walk the
 * entity graph back to the root Organization.
 */

import { isMainInstitution } from '@/lib/config/multi-tenant'
import {
  buildGraph,
  buildWebPage,
  buildFAQPage,
  buildHowTo,
  buildOffer,
  buildPerson,
  buildCollectionPage,
  buildItemList,
  buildArticle,
  buildDataset,
  buildPlace,
  buildLocalBusiness,
  type WebPageInput,
  type FAQ,
  type HowToStep,
  type PersonInput,
} from '@/lib/seo/main-institution/builders'
import type { BreadcrumbItem } from '@/lib/seo/types'

export interface MainInstitutionPageSchemaProps {
  /** Base WebPage descriptor — always rendered */
  webpage: WebPageInput
  /** FAQPage (Q&A pairs for AEO + voice) */
  faqs?: FAQ[]
  /** HowTo steps (e.g. admission process) */
  howTo?: {
    name: string
    description: string
    steps: HowToStep[]
    totalTimeISO?: string
    estimatedCost?: { value: string; currency: string }
  }
  /** Person entries (faculty / leadership) */
  persons?: PersonInput[]
  /** ItemList entries (faculty directory, PDF listings, policies) */
  itemList?: {
    name: string
    items: Array<{ name: string; url: string; description?: string }>
  }
  /** Offers (fees, scholarships) */
  offers?: Array<{
    name: string
    description?: string
    price?: string
    priceCurrency?: string
    priceValidUntil?: string
    url: string
    availability?: string
    category?: string
  }>
  /** News / blog-like articles */
  articles?: Array<{
    headline: string
    description?: string
    image?: string
    datePublished: string
    dateModified?: string
    url: string
    authorName?: string
    articleSection?: string
    keywords?: string[]
  }>
  /** Datasets — placement data, accreditation reports */
  datasets?: Array<{
    name: string
    description: string
    url: string
    keywords?: string[]
    datePublished?: string
    license?: string
    measurementTechnique?: string
    distribution?: Array<{ encodingFormat: string; contentUrl: string }>
  }>
  /** Places — buildings, facilities */
  places?: Array<{
    name: string
    description?: string
    image?: string
    addressLocality?: string
    amenityFeature?: string[]
  }>
  /** Emit a LocalBusiness block (for contact page) */
  includeLocalBusiness?: boolean
  /** Override: render even when not main (for preview/test only) */
  forceRender?: boolean
}

export function MainInstitutionPageSchema(props: MainInstitutionPageSchemaProps) {
  // Hard gate — Engineering deploy renders null → zero JSON-LD emitted.
  if (!props.forceRender && !isMainInstitution()) {
    return null
  }

  const nodes: object[] = []

  nodes.push(buildWebPage(props.webpage))

  if (props.faqs?.length) {
    nodes.push(buildFAQPage(props.faqs, props.webpage.path))
  }

  if (props.howTo) {
    nodes.push(
      buildHowTo({
        name: props.howTo.name,
        description: props.howTo.description,
        anchorPath: props.webpage.path,
        steps: props.howTo.steps,
        totalTimeISO: props.howTo.totalTimeISO,
        estimatedCost: props.howTo.estimatedCost,
      })
    )
  }

  if (props.persons?.length) {
    for (const p of props.persons) nodes.push(buildPerson(p))
  }

  if (props.itemList) {
    nodes.push(
      buildItemList({
        anchorPath: props.webpage.path,
        name: props.itemList.name,
        items: props.itemList.items,
      })
    )
  }

  if (props.offers?.length) {
    for (const o of props.offers) nodes.push(buildOffer(o))
  }

  if (props.articles?.length) {
    for (const a of props.articles) nodes.push(buildArticle(a))
  }

  if (props.datasets?.length) {
    for (const d of props.datasets) nodes.push(buildDataset(d))
  }

  if (props.places?.length) {
    for (const pl of props.places) nodes.push(buildPlace(pl))
  }

  if (props.includeLocalBusiness) {
    nodes.push(buildLocalBusiness())
  }

  const graph = buildGraph(...nodes)

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is the canonical way to inject structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}

// Convenience re-export for page files
export type { BreadcrumbItem }
