import { NextRequest, NextResponse } from 'next/server'
import { submitWebMCPCallbackRequest, submitWebMCPNewsletterSubscription } from '@/app/actions/webmcp-leads'

/**
 * API route for WebMCP lead capture tools.
 *
 * WebMCP tools run in the browser and cannot call Server Actions directly
 * via dynamic import. This thin API route delegates to the same Server Action
 * logic (validation, rate limiting, database insert).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (!action || !data) {
      return NextResponse.json(
        { success: false, message: 'Missing action or data' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'request_callback': {
        const result = await submitWebMCPCallbackRequest(data)
        return NextResponse.json(result)
      }

      case 'subscribe_newsletter': {
        const result = await submitWebMCPNewsletterSubscription(data)
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json(
          { success: false, message: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('WebMCP API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
