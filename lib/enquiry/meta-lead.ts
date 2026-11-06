// Meta pixel "Lead" event (lead option 9, 2026-11-06). Before this the pixel saw only PageView, so Meta could not
// count or learn from a website lead at all.
//
// Called once, and only after the CRM has ACCEPTED a NEW lead: not on the button tap, not before the round trip, not
// for a 409 "already enquired" repeat. What Meta receives: the event name and the CRM source tag of the page
// (e.g. "home-top"). Never the name, never the phone, never the programme.
//
// The pixel loads lazyOnload and only in a production build (components/analytics/meta-pixel.tsx), so this waits
// up to 30 s for window.fbq - the way lib/enquiry/lead-events.ts waits for gtag - then gives up quietly.

type Fbq = (...args: unknown[]) => void

export function sendMetaLead(sourcePage: string) {
  let tries = 0
  const fire = () => {
    const w = window as unknown as { fbq?: Fbq }
    if (typeof w.fbq === "function") {
      w.fbq("track", "Lead", { content_name: sourcePage })
      return
    }
    if (++tries < 120) window.setTimeout(fire, 250)
  }
  fire()
}
