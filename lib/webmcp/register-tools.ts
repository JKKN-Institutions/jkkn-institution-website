import { registerInstitutionTools } from './tools/institutions'
import { registerCampusTools } from './tools/campus'

/**
 * Register all WebMCP tools for the JKKN main website.
 *
 * WebMCP (Model Context Protocol for the Web) lets AI agents
 * discover and call structured tools directly in the browser.
 *
 * IMPORTANT: Only registers on the main website (INSTITUTION_ID === 'main').
 * Other institution deployments (engineering, dental, etc.) are unaffected.
 */
export function registerWebMCPTools() {
  // Gate: only main website
  if (process.env.NEXT_PUBLIC_INSTITUTION_ID !== 'main') return

  // Gate: browser with WebMCP support (Chrome 146+)
  if (typeof navigator === 'undefined' || !('modelContext' in navigator)) return

  registerInstitutionTools()
  registerCampusTools()
}
