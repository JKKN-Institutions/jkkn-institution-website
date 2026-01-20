import { PageRenderer } from '@/components/cms-blocks/page-renderer'
import { engineeringModernHomeTemplate } from '@/lib/cms/templates/global/templates/engineering-modern-home'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'JKKN College of Engineering & Technology | Preview',
    description: 'AICTE Approved, Anna University Affiliated Engineering College with NBA Accredited Programs. 95%+ Placement Rate, 12 LPA Highest Package.',
}

export default function EngineeringPreviewPage() {
    // Use the blocks from the template
    const blocks = engineeringModernHomeTemplate.default_blocks

    return (
        <main className="min-h-screen bg-white">
            {/* Banner indicating this is a preview */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-yellow-900 px-4 py-2 text-center text-sm font-bold shadow-md">
                PREVIEW MODE: This is a static preview of the template.
            </div>

            {/* Render the page using the existing PageRenderer */}
            <PageRenderer
                blocks={blocks as any} // Type assertion to bypass minor type disconnects
                pageTypography={{
                    fontFamily: 'inter'
                }}
            />
        </main>
    )
}
