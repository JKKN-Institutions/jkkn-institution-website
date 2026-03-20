import { registerInstitutionTools } from './tools/institutions'
import { registerCampusTools } from './tools/campus'
import { registerLeadCaptureTools } from './tools/lead-capture'

/**
 * Register all WebMCP tools for the JKKN main website.
 *
 * WebMCP (Model Context Protocol for the Web) lets AI agents
 * discover and call structured tools directly in the browser.
 *
 * Phase 1: Information tools (institutions, campus, eligibility)
 * Phase 2: Lead capture tools (callback, application, newsletter)
 *
 * IMPORTANT: Only registers on the main website (INSTITUTION_ID === 'main').
 * Other institution deployments (engineering, dental, etc.) are unaffected.
 */
export function registerWebMCPTools() {
  // Gate: only main website
  if (process.env.NEXT_PUBLIC_INSTITUTION_ID !== 'main') return

  // Gate: browser with WebMCP support (Chrome 146+)
  if (typeof navigator === 'undefined' || !('modelContext' in navigator)) return

  // Phase 1: Information tools
  registerInstitutionTools()
  registerCampusTools()

  // Phase 2: Lead capture tools
  registerLeadCaptureTools()
}
