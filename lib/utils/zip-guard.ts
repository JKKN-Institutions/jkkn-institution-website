// lib/utils/zip-guard.ts
//
// Server-only (node:zlib). A DOCX is a ZIP; a 2 MB one can inflate to
// gigabytes and take the function down inside mammoth before any length check
// runs. This walks the central directory and actually inflates each entry with
// a hard output cap — the sizes a ZIP *declares* can lie, the inflater cannot.

import { inflateRawSync } from 'node:zlib'

const EOCD = 0x06054b50
const CENTRAL = 0x02014b50
const LOCAL = 0x04034b50

/** True when every entry is stored or deflated and all of them together inflate to at most `limit` bytes. */
export function zipInflatesWithin(bytes: Uint8Array, limit: number): boolean {
  const buf = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  try {
    let eocd = -1
    for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 0xffff); i--) {
      if (buf.readUInt32LE(i) === EOCD) { eocd = i; break }
    }
    if (eocd < 0) return false

    const entries = buf.readUInt16LE(eocd + 10)
    let p = buf.readUInt32LE(eocd + 16)
    let total = 0
    for (let i = 0; i < entries; i++) {
      if (buf.readUInt32LE(p) !== CENTRAL) return false
      const method = buf.readUInt16LE(p + 10)
      const compressed = buf.readUInt32LE(p + 20)
      const local = buf.readUInt32LE(p + 42)
      if (buf.readUInt32LE(local) !== LOCAL) return false
      const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28)
      const data = buf.subarray(start, start + compressed)

      if (method === 0) total += data.length
      else if (method === 8) total += inflateRawSync(data, { maxOutputLength: Math.max(1, limit - total) }).length
      else return false
      if (total > limit) return false

      p += 46 + buf.readUInt16LE(p + 28) + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32)
    }
    return true
  } catch {
    return false // truncated/garbled structure, or inflating went past the cap
  }
}
