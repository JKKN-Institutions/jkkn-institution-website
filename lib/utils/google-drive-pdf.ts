/**
 * Google Drive PDF Utilities
 *
 * Converts Google Drive share links to viewable/downloadable PDF URLs.
 *
 * IMPORTANT: Files must be shared with "Anyone with the link can view" permission.
 *
 * Supported input formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - Just the FILE_ID itself
 */

import { extractGoogleDriveFileId } from './google-drive'

/**
 * Convert a Google Drive URL to an embeddable PDF viewer URL
 * Opens the PDF in a new tab with Google Drive's built-in PDF viewer
 *
 * @param url - Google Drive share URL or file ID
 * @returns Embeddable PDF viewer URL
 */
export function convertToGoogleDrivePdfUrl(url: string): string {
  const fileId = extractGoogleDriveFileId(url)

  if (!fileId) {
    return url
  }

  // Google Drive PDF viewer URL - opens in new tab with viewer controls
  return `https://drive.google.com/file/d/${fileId}/view`
}

/**
 * Get the direct download URL for a Google Drive PDF
 *
 * @param url - Google Drive share URL or file ID
 * @returns Direct download URL
 */
export function getGoogleDrivePdfDownloadUrl(url: string): string {
  const fileId = extractGoogleDriveFileId(url)

  if (!fileId) {
    return url
  }

  return `https://drive.google.com/uc?export=download&id=${fileId}`
}

/**
 * Get an embeddable iframe URL for a Google Drive PDF
 * For inline PDF viewing within the page
 *
 * @param url - Google Drive share URL or file ID
 * @returns Embeddable iframe URL
 */
export function getGoogleDrivePdfEmbedUrl(url: string): string {
  const fileId = extractGoogleDriveFileId(url)

  if (!fileId) {
    return url
  }

  return `https://drive.google.com/file/d/${fileId}/preview`
}

/**
 * Get thumbnail URL for a Google Drive PDF
 * Useful for displaying preview images
 *
 * @param url - Google Drive share URL or file ID
 * @returns Thumbnail URL
 */
export function getGoogleDrivePdfThumbnail(url: string): string {
  const fileId = extractGoogleDriveFileId(url)

  if (!fileId) {
    return url
  }

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`
}

/**
 * PDF Link Configuration
 */
export interface PdfLinkConfig {
  title: string
  driveUrl: string
  description?: string
  category?: string
  year?: string
  icon?: string
}

/**
 * Process a PDF link configuration and return all necessary URLs
 */
export function processPdfLink(config: PdfLinkConfig) {
  return {
    ...config,
    viewUrl: convertToGoogleDrivePdfUrl(config.driveUrl),
    downloadUrl: getGoogleDrivePdfDownloadUrl(config.driveUrl),
    embedUrl: getGoogleDrivePdfEmbedUrl(config.driveUrl),
    thumbnailUrl: getGoogleDrivePdfThumbnail(config.driveUrl),
  }
}

/**
 * Instructions for users on how to get a Google Drive PDF share link
 */
export const GOOGLE_DRIVE_PDF_INSTRUCTIONS = `
How to use Google Drive PDFs:

1. Upload your PDF to Google Drive
2. Right-click the file and select "Share"
3. Click "Change to anyone with the link"
4. Set permission to "Viewer"
5. Click "Copy link"
6. Paste the link in the PDF URL field

The system will automatically convert the link to viewable/downloadable formats.

Example link format:
https://drive.google.com/file/d/1ABC123xyz_FILE_ID/view?usp=sharing

You can also just paste the file ID:
1ABC123xyz_FILE_ID
`.trim()
