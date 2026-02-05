import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Home } from 'lucide-react'
import { DVVTabs } from '@/components/naac/dvv-tabs'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'DVV Clarifications | NAAC Accreditation',
  description: 'Data Validation and Verification clarifications for NAAC accreditation - JKKN Engineering College',
}

export default function DVVPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link
                href="/"
                className="hover:text-green-600 transition-colors inline-flex items-center"
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li>
              <Link
                href="/naac"
                className="hover:text-green-600 transition-colors"
              >
                NAAC
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li className="text-gray-900 font-medium" aria-current="page">
              DVV Clarifications
            </li>
          </ol>
        </nav>

        {/* Back Navigation Button */}
        <div className="mb-6">
          <Link href="/naac">
            <Button
              variant="outline"
              className="group hover:bg-green-50 hover:border-green-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to NAAC
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            DVV Clarifications
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Data Validation and Verification responses for NAAC accreditation metrics
          </p>
        </div>

        {/* DVV Tabs Component */}
        <DVVTabs />

        {/* Bottom Back Button */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <Link href="/naac">
            <Button
              variant="outline"
              size="lg"
              className="group hover:bg-green-50 hover:border-green-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to NAAC Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
