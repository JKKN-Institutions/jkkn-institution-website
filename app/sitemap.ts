/**
 * Dynamic Sitemap Generator
 * Generates /sitemap.xml automatically from database content
 *
 * This file uses Next.js Metadata API to generate a sitemap dynamically.
 * It fetches all published CMS pages, blog posts, and career jobs from
 * the database and combines them with static routes.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/sitemap
 */

import { MetadataRoute } from 'next'
import { getSitemapUrls } from '@/app/actions/cms/sitemap-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return await getSitemapUrls()
}
