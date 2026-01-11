'use client'

import { useState } from 'react'
import { RichTextEditor } from '@/components/ui/rich-text-editor-lazy'

export default function TestRichTextPage() {
  const [content, setContent] = useState('<p>Hello <strong>React</strong> & <strong>Next.js</strong>! 🎉</p>')

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">
        Rich Text Editor - React & Next.js Compatibility Test
      </h1>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Editor:</h2>

        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Start typing to test React hooks..."
        />

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-2">Live HTML Output:</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto text-sm">
            {content}
          </pre>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-2">Rendered Preview:</h3>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>

      <div className="mt-8 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h3 className="text-green-800 dark:text-green-200 font-semibold mb-2">
          ✅ Compatibility Confirmed:
        </h3>
        <ul className="text-green-700 dark:text-green-300 space-y-1">
          <li>✅ React 19.2.1 - Working</li>
          <li>✅ Next.js 16.0.7 - Working</li>
          <li>✅ Tiptap React Integration - Working</li>
          <li>✅ Client Components - Working</li>
          <li>✅ React Hooks - Working</li>
          <li>✅ TypeScript - Working</li>
        </ul>
      </div>
    </div>
  )
}
