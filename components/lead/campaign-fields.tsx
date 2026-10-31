'use client'

// Hidden inputs that carry this visit's campaign tags (lib/enquiry/campaign-tags.ts) into the enquiry
// form. A visit with no tags renders nothing, and the server sends the site host as before.
//
// useSyncExternalStore rather than useEffect + useState: the server renders no inputs, the browser
// adds them after hydration without a mismatch warning, and no state is set inside an effect.
// Reading the snapshot also stores the landing tags, so a form on the landing page itself works
// even though React runs this child before the site-wide provider's own capture.

import { useSyncExternalStore } from 'react'
import { CAMPAIGN_KEYS, campaignTagsSnapshot, parseCampaignTags } from '@/lib/enquiry/campaign-tags'

const noSubscribe = () => () => {}

export function CampaignFields() {
  const tags = parseCampaignTags(useSyncExternalStore(noSubscribe, campaignTagsSnapshot, () => ''))
  return (
    <>
      {CAMPAIGN_KEYS.map((key) => (tags[key] ? <input key={key} type="hidden" name={key} value={tags[key]} /> : null))}
    </>
  )
}
