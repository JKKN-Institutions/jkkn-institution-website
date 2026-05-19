/**
 * <HomepageInstitutionsItemListSchema />
 *
 * Emits a rich JSON-LD ItemList of all 9 JKKN institutions
 * (7 colleges + 2 schools) on the MAIN homepage only.
 *
 * Why this exists:
 *  - The homepage was missing an entity-level enumeration of the 9
 *    institutions. AI engines (ChatGPT, Perplexity, Google AI Overviews)
 *    and rich-result carousels rely on ItemList for "list of N entities"
 *    queries like "JKKN colleges list" / "how many institutions does JKKN have".
 *  - Same @id (`#institutions-catalog`) as the /our-institutions page so
 *    both pages reinforce the same canonical entity in the schema graph.
 *
 * Hard-gated by isMainInstitution() — engineering / dental / pharmacy /
 * nursing deployments render null and emit ZERO JSON-LD from this file.
 */

import { isMainInstitution } from '@/lib/config/multi-tenant'
import { getSiteUrl } from '@/lib/utils/site-url'
import {
  ALL_INSTITUTIONS,
  INSTITUTIONS_CATALOG_ID,
} from '@/lib/seo/main-institution/institutions-list'

export function HomepageInstitutionsItemListSchema() {
  if (!isMainInstitution()) {
    return null
  }

  const SITE_URL = getSiteUrl()
  const ORG_ID = `${SITE_URL}/#organization`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': INSTITUTIONS_CATALOG_ID,
    name: 'JKKN Institutions — 9 Educational Pillars',
    description:
      'Complete list of all 9 institutions under JKKN: 7 colleges (Dental, Pharmacy, Engineering, Allied Health Sciences, Arts & Science, Nursing, Education) and 2 schools (Matriculation Higher Secondary, Nattraja Vidhyalya CBSE) on one integrated 70-acre campus in Komarapalayam, Tamil Nadu. Established 1952.',
    url: `${SITE_URL}/our-institutions`,
    numberOfItems: ALL_INSTITUTIONS.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': ORG_ID },
    itemListElement: ALL_INSTITUTIONS.map((inst) => ({
      '@type': 'ListItem',
      position: inst.position,
      url: inst.url,
      name: inst.name,
      item: {
        '@type': inst.schemaType,
        '@id': inst.schemaId,
        name: inst.name,
        alternateName: inst.alternateName,
        url: inst.url,
        description: inst.schemaDescription,
        foundingDate: String(inst.foundedYear),
        parentOrganization: { '@id': ORG_ID },
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is the canonical way to inject structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
