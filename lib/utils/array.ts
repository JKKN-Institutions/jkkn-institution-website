/**
 * Array utility functions
 */

/**
 * Splits an array into chunks of specified size
 *
 * @param array - Array to chunk
 * @param size - Maximum items per chunk
 * @returns Array of chunked arrays
 *
 * @example
 * ```typescript
 * chunkArray([1, 2, 3, 4, 5], 2) // Returns: [[1, 2], [3, 4], [5]]
 * chunkArray([1, 2, 3, 4, 5, 6, 7, 8], 3) // Returns: [[1, 2, 3], [4, 5, 6], [7, 8]]
 * ```
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Chunk size must be greater than 0')
  }

  if (!array.length) {
    return []
  }

  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }

  return chunks
}
