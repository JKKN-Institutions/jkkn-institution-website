import React from 'react'

/**
 * Parses text containing numbered list markers (1., 2., 3., etc.) into an HTML ordered list
 * @param text - Text content that may contain numbered markers
 * @returns React node with formatted ordered list
 */
function parseNumberedList(text: string): React.ReactNode {
  // Split by numbered markers (1. 2. 3. etc.)
  const numberedPattern = /\d+\.\s*/g
  const items = text
    .split(numberedPattern)
    .map(item => item.trim())
    .filter(item => item.length > 0) // Remove empty items

  if (items.length === 0) {
    return text
  }

  return (
    <ol className="list-decimal pl-6 space-y-2 marker:text-white/70">
      {items.map((item, index) => (
        <li key={index} className="text-white/90">
          {item}
        </li>
      ))}
    </ol>
  )
}

/**
 * Parses text containing bullet markers (., *, -, ★) into an HTML unordered list
 * @param text - Text content that may contain bullet markers
 * @returns React node with formatted unordered list
 */
function parseUnorderedList(text: string): React.ReactNode {
  // Detect bullet patterns: . * - ★ followed by space or content
  const bulletPattern = /([.\*\-★])\s*/g
  const items = text
    .split(bulletPattern)
    .filter(item => item && !['.', '*', '-', '★'].includes(item)) // Remove markers and empty strings
    .map(item => item.trim())
    .filter(item => item.length > 0) // Remove empty items

  if (items.length === 0) {
    return text
  }

  return (
    <ul className="list-disc pl-6 space-y-2 marker:text-white/70">
      {items.map((item, index) => (
        <li key={index} className="text-white/90">
          {item}
        </li>
      ))}
    </ul>
  )
}

/**
 * Master function that detects list type and parses accordingly
 * Supports: bullet lists (., *, -, ★) and numbered lists (1., 2., 3.)
 * @param text - Text content that may contain list markers
 * @returns React node with formatted list or plain text
 */
export function parseListContent(text: string): React.ReactNode {
  if (!text) return null

  // Check for numbered list first (e.g., "1. Item 2. Item")
  const hasNumberedList = /\d+\.\s+/.test(text)
  if (hasNumberedList) {
    return parseNumberedList(text)
  }

  // Check for bullet list (. * - ★)
  const hasBulletList = /([.\*\-★])\s*/.test(text)
  if (hasBulletList) {
    return parseUnorderedList(text)
  }

  // No list markers found, return plain text
  return text
}

/**
 * @deprecated Use parseListContent instead
 * Parses text containing bullet markers (., *, -) into a proper HTML list
 * @param text - Text content that may contain bullet markers
 * @returns React node with formatted list or plain text
 */
export function parseBulletList(text: string): React.ReactNode {
  return parseListContent(text)
}
