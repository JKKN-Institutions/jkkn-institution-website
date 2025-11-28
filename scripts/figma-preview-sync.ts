/**
 * Figma Preview Image Sync Script
 *
 * This script fetches component preview images from a Figma file
 * and saves them to the public folder for use in the CMS page builder.
 *
 * Usage:
 * 1. Create a Figma file with frames named after your components
 * 2. Set FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY in .env.local
 * 3. Run: npx tsx scripts/figma-preview-sync.ts
 *
 * Figma File Structure:
 * - Create a page called "CMS Previews"
 * - Add frames named exactly like component names (e.g., "HeroSection", "TextEditor")
 * - Each frame should be 400x300px for consistent thumbnails
 */

import * as fs from 'fs'
import * as path from 'path'
import { COMPONENT_REGISTRY } from '../lib/cms/component-registry'

// Configuration
const FIGMA_API_BASE = 'https://api.figma.com/v1'
const OUTPUT_DIR = './public/cms-previews'
const PREVIEW_WIDTH = 400
const PREVIEW_HEIGHT = 300

interface FigmaNode {
  id: string
  name: string
  type: string
  children?: FigmaNode[]
}

interface FigmaFile {
  document: FigmaNode
  components: Record<string, { name: string }>
}

interface FigmaImageResponse {
  images: Record<string, string>
}

async function fetchFigmaFile(fileKey: string, accessToken: string): Promise<FigmaFile> {
  const response = await fetch(`${FIGMA_API_BASE}/files/${fileKey}`, {
    headers: {
      'X-Figma-Token': accessToken,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Figma file: ${response.statusText}`)
  }

  return response.json()
}

async function fetchNodeImages(
  fileKey: string,
  nodeIds: string[],
  accessToken: string
): Promise<FigmaImageResponse> {
  const ids = nodeIds.join(',')
  const response = await fetch(
    `${FIGMA_API_BASE}/images/${fileKey}?ids=${ids}&format=png&scale=2`,
    {
      headers: {
        'X-Figma-Token': accessToken,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.statusText}`)
  }

  return response.json()
}

async function downloadImage(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`)
  }

  const buffer = await response.arrayBuffer()
  fs.writeFileSync(outputPath, Buffer.from(buffer))
}

function findFramesByName(node: FigmaNode, targetNames: Set<string>): Map<string, string> {
  const results = new Map<string, string>()

  function traverse(n: FigmaNode) {
    // Check if this is a frame/component with a matching name
    if ((n.type === 'FRAME' || n.type === 'COMPONENT') && targetNames.has(n.name)) {
      results.set(n.name, n.id)
    }

    // Traverse children
    if (n.children) {
      for (const child of n.children) {
        traverse(child)
      }
    }
  }

  traverse(node)
  return results
}

async function syncFigmaPreviews() {
  // Load environment variables
  const accessToken = process.env.FIGMA_ACCESS_TOKEN
  const fileKey = process.env.FIGMA_FILE_KEY

  if (!accessToken) {
    console.error('Error: FIGMA_ACCESS_TOKEN not set in environment')
    console.log('\nTo set up:')
    console.log('1. Go to Figma > Account Settings > Personal Access Tokens')
    console.log('2. Create a new token')
    console.log('3. Add to .env.local: FIGMA_ACCESS_TOKEN=your_token')
    process.exit(1)
  }

  if (!fileKey) {
    console.error('Error: FIGMA_FILE_KEY not set in environment')
    console.log('\nTo find your file key:')
    console.log('1. Open your Figma file')
    console.log('2. Copy the URL: https://www.figma.com/file/XXXXXX/...')
    console.log('3. The XXXXXX part is your file key')
    console.log('4. Add to .env.local: FIGMA_FILE_KEY=your_file_key')
    process.exit(1)
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  console.log('Fetching Figma file...')
  const figmaFile = await fetchFigmaFile(fileKey, accessToken)

  // Get all component names from registry
  const componentNames = new Set(Object.keys(COMPONENT_REGISTRY))
  console.log(`Looking for ${componentNames.size} components in Figma file...`)

  // Find matching frames in Figma
  const frameMap = findFramesByName(figmaFile.document, componentNames)
  console.log(`Found ${frameMap.size} matching frames`)

  if (frameMap.size === 0) {
    console.log('\nNo matching frames found. Make sure your Figma frames are named:')
    for (const name of componentNames) {
      console.log(`  - ${name}`)
    }
    return
  }

  // Fetch image URLs for all frames
  const nodeIds = Array.from(frameMap.values())
  console.log('Fetching image URLs...')
  const imageResponse = await fetchNodeImages(fileKey, nodeIds, accessToken)

  // Download each image
  console.log('Downloading images...')
  const previewPaths: Record<string, string> = {}

  for (const [componentName, nodeId] of frameMap) {
    const imageUrl = imageResponse.images[nodeId]
    if (imageUrl) {
      const outputPath = path.join(OUTPUT_DIR, `${componentName}.png`)
      await downloadImage(imageUrl, outputPath)
      previewPaths[componentName] = `/cms-previews/${componentName}.png`
      console.log(`  ✓ ${componentName}`)
    } else {
      console.log(`  ✗ ${componentName} (no image URL)`)
    }
  }

  // Generate a manifest file
  const manifest = {
    generatedAt: new Date().toISOString(),
    figmaFileKey: fileKey,
    previews: previewPaths,
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )

  console.log('\nSync complete!')
  console.log(`Downloaded ${Object.keys(previewPaths).length} preview images`)
  console.log(`Manifest saved to ${OUTPUT_DIR}/manifest.json`)

  // Show missing components
  const missingComponents = Array.from(componentNames).filter(
    (name) => !previewPaths[name]
  )
  if (missingComponents.length > 0) {
    console.log('\nMissing preview images for:')
    for (const name of missingComponents) {
      console.log(`  - ${name}`)
    }
  }
}

// Run the sync
syncFigmaPreviews().catch(console.error)
