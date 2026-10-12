// Builds real ZIP files (the DOCX container) for tests. Deflated entries use
// node:zlib, so a "bomb" is a tiny file that inflates to many megabytes.

import { deflateRawSync } from 'node:zlib'

interface Entry { name: string; content: Buffer; stored?: boolean }

export function makeZip(entries: Entry[]): Uint8Array<ArrayBuffer> {
  const locals: Buffer[] = []
  const centrals: Buffer[] = []
  let offset = 0
  for (const e of entries) {
    const name = Buffer.from(e.name)
    const data = e.stored ? e.content : deflateRawSync(e.content)
    const method = e.stored ? 0 : 8

    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(method, 8)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(e.content.length, 22)
    local.writeUInt16LE(name.length, 26)
    locals.push(local, name, data)

    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(method, 10)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(e.content.length, 24)
    central.writeUInt16LE(name.length, 28)
    central.writeUInt32LE(offset, 42)
    centrals.push(central, name)

    offset += 30 + name.length + data.length
  }
  const cd = Buffer.concat(centrals)
  const eocd = Buffer.alloc(22)
  eocd.writeUInt32LE(0x06054b50, 0)
  eocd.writeUInt16LE(entries.length, 8)
  eocd.writeUInt16LE(entries.length, 10)
  eocd.writeUInt32LE(cd.length, 12)
  eocd.writeUInt32LE(offset, 16)
  const out = Buffer.concat([...locals, cd, eocd])
  return new Uint8Array(out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength))
}

/** A minimal DOCX-shaped zip (content is irrelevant when docxToText is injected). */
export const SMALL_DOCX = makeZip([{ name: 'word/document.xml', content: Buffer.from('<w:document>Priya R</w:document>') }])
