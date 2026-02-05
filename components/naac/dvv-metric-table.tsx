import { ExternalLink } from 'lucide-react'

interface Clarification {
  finding: string
  responseLink: string
}

interface DVVMetricTableProps {
  metricId: string
  description: string
  clarifications: Clarification[]
}

export function DVVMetricTable({
  metricId,
  description,
  clarifications,
}: DVVMetricTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      {/* Metric Header */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 border-b border-gray-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-600 text-white">
              {metricId}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-gray-800 font-medium leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Clarifications Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-green-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-white w-16">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Findings of DVV
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-white w-32">
                Response
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clarifications.map((clarification, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                  {index + 1}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 leading-relaxed">
                  {clarification.finding}
                </td>
                <td className="px-4 py-4 text-center">
                  <a
                    href={clarification.responseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    View
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
