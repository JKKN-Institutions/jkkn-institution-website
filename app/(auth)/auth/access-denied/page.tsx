'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AccessDeniedContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')

  const getMessage = () => {
    switch (reason) {
      case 'not_approved':
        return {
          title: 'Email Not Approved',
          description:
            'Your @jkkn.ac.in email address is not in our approved list. Please contact the Super Administrator to request access to the admin panel.',
        }
      case 'unauthorized_domain':
        return {
          title: 'Unauthorized Domain',
          description:
            'Only @jkkn.ac.in email addresses are allowed to access the admin panel. Please use your institutional email address.',
        }
      default:
        return {
          title: 'Access Denied',
          description:
            'You do not have permission to access this resource. Please contact the administrator if you believe this is an error.',
        }
    }
  }

  const { title, description } = getMessage()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Icon */}
      <div className="mb-6">
        <svg
          className="w-16 h-16 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

      {/* Description */}
      <p className="text-lg text-gray-600 mb-8 max-w-md">{description}</p>

      {/* Contact Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md">
        <h2 className="text-sm font-semibold text-blue-900 mb-2">
          Need Access?
        </h2>
        <p className="text-sm text-blue-700 mb-4">
          Contact the Super Administrator to request approval:
        </p>
        <a
          href="mailto:admin@jkkn.ac.in"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Email Administrator
        </a>
      </div>

      {/* Back to Login */}
      <div className="mt-8">
        <a
          href="/auth/login"
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}

export default function AccessDeniedPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]">Loading...</div>}>
      <AccessDeniedContent />
    </Suspense>
  )
}
