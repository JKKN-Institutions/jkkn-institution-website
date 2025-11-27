/**
 * SEO Analyzer Utility
 * Calculates SEO score (0-100) based on various factors
 */

export interface SeoData {
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  canonical_url: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  twitter_title: string | null
  twitter_description: string | null
  twitter_image: string | null
  structured_data: Record<string, unknown>[] | null
}

export interface SeoIssue {
  type: 'error' | 'warning' | 'info'
  field: string
  message: string
  suggestion?: string
}

export interface SeoAnalysisResult {
  score: number
  issues: SeoIssue[]
  passed: string[]
}

// Character limits for SEO fields
export const SEO_LIMITS = {
  META_TITLE_MIN: 30,
  META_TITLE_MAX: 60,
  META_TITLE_OPTIMAL: 55,
  META_DESCRIPTION_MIN: 120,
  META_DESCRIPTION_MAX: 160,
  META_DESCRIPTION_OPTIMAL: 155,
  KEYWORDS_MAX: 10,
  OG_TITLE_MAX: 70,
  OG_DESCRIPTION_MAX: 200,
  TWITTER_TITLE_MAX: 70,
  TWITTER_DESCRIPTION_MAX: 200,
}

/**
 * Analyze SEO data and return score with issues
 */
export function analyzeSeo(seoData: Partial<SeoData>): SeoAnalysisResult {
  const issues: SeoIssue[] = []
  const passed: string[] = []
  let score = 0
  const maxScore = 100

  // Weight distribution (total = 100)
  const weights = {
    metaTitle: 20,
    metaDescription: 20,
    keywords: 10,
    ogData: 15,
    twitterData: 15,
    canonicalUrl: 10,
    structuredData: 10,
  }

  // 1. Meta Title Analysis (20 points)
  const titleScore = analyzeMetaTitle(seoData.meta_title, issues, passed)
  score += titleScore * (weights.metaTitle / 100)

  // 2. Meta Description Analysis (20 points)
  const descScore = analyzeMetaDescription(seoData.meta_description, issues, passed)
  score += descScore * (weights.metaDescription / 100)

  // 3. Keywords Analysis (10 points)
  const keywordsScore = analyzeKeywords(seoData.meta_keywords, issues, passed)
  score += keywordsScore * (weights.keywords / 100)

  // 4. Open Graph Analysis (15 points)
  const ogScore = analyzeOpenGraph(seoData, issues, passed)
  score += ogScore * (weights.ogData / 100)

  // 5. Twitter Card Analysis (15 points)
  const twitterScore = analyzeTwitterCard(seoData, issues, passed)
  score += twitterScore * (weights.twitterData / 100)

  // 6. Canonical URL Analysis (10 points)
  const canonicalScore = analyzeCanonicalUrl(seoData.canonical_url, issues, passed)
  score += canonicalScore * (weights.canonicalUrl / 100)

  // 7. Structured Data Analysis (10 points)
  const structuredScore = analyzeStructuredData(seoData.structured_data, issues, passed)
  score += structuredScore * (weights.structuredData / 100)

  return {
    score: Math.round(score * maxScore),
    issues,
    passed,
  }
}

function analyzeMetaTitle(
  title: string | null | undefined,
  issues: SeoIssue[],
  passed: string[]
): number {
  if (!title || title.trim().length === 0) {
    issues.push({
      type: 'error',
      field: 'meta_title',
      message: 'Meta title is missing',
      suggestion: 'Add a unique, descriptive title between 30-60 characters',
    })
    return 0
  }

  const length = title.trim().length
  let score = 0

  if (length < SEO_LIMITS.META_TITLE_MIN) {
    issues.push({
      type: 'warning',
      field: 'meta_title',
      message: `Meta title is too short (${length}/${SEO_LIMITS.META_TITLE_MIN} chars)`,
      suggestion: 'Expand your title to at least 30 characters for better SEO',
    })
    score = 0.5
  } else if (length > SEO_LIMITS.META_TITLE_MAX) {
    issues.push({
      type: 'warning',
      field: 'meta_title',
      message: `Meta title is too long (${length}/${SEO_LIMITS.META_TITLE_MAX} chars)`,
      suggestion: 'Shorten your title to under 60 characters to avoid truncation in search results',
    })
    score = 0.7
  } else {
    passed.push('Meta title has optimal length')
    score = 1
  }

  return score
}

function analyzeMetaDescription(
  description: string | null | undefined,
  issues: SeoIssue[],
  passed: string[]
): number {
  if (!description || description.trim().length === 0) {
    issues.push({
      type: 'error',
      field: 'meta_description',
      message: 'Meta description is missing',
      suggestion: 'Add a compelling description between 120-160 characters',
    })
    return 0
  }

  const length = description.trim().length
  let score = 0

  if (length < SEO_LIMITS.META_DESCRIPTION_MIN) {
    issues.push({
      type: 'warning',
      field: 'meta_description',
      message: `Meta description is too short (${length}/${SEO_LIMITS.META_DESCRIPTION_MIN} chars)`,
      suggestion: 'Expand your description to at least 120 characters',
    })
    score = 0.5
  } else if (length > SEO_LIMITS.META_DESCRIPTION_MAX) {
    issues.push({
      type: 'warning',
      field: 'meta_description',
      message: `Meta description is too long (${length}/${SEO_LIMITS.META_DESCRIPTION_MAX} chars)`,
      suggestion: 'Shorten to under 160 characters to avoid truncation',
    })
    score = 0.7
  } else {
    passed.push('Meta description has optimal length')
    score = 1
  }

  return score
}

function analyzeKeywords(
  keywords: string[] | null | undefined,
  issues: SeoIssue[],
  passed: string[]
): number {
  if (!keywords || keywords.length === 0) {
    issues.push({
      type: 'info',
      field: 'meta_keywords',
      message: 'No meta keywords specified',
      suggestion: 'While less important for modern SEO, keywords help organize content',
    })
    return 0.5 // Neutral - keywords are less critical now
  }

  if (keywords.length > SEO_LIMITS.KEYWORDS_MAX) {
    issues.push({
      type: 'warning',
      field: 'meta_keywords',
      message: `Too many keywords (${keywords.length}/${SEO_LIMITS.KEYWORDS_MAX})`,
      suggestion: 'Focus on 5-10 highly relevant keywords',
    })
    return 0.7
  }

  passed.push(`${keywords.length} relevant keywords specified`)
  return 1
}

function analyzeOpenGraph(
  seoData: Partial<SeoData>,
  issues: SeoIssue[],
  passed: string[]
): number {
  let score = 0
  let checks = 0
  const totalChecks = 3

  // OG Title
  checks++
  if (seoData.og_title && seoData.og_title.trim().length > 0) {
    if (seoData.og_title.length <= SEO_LIMITS.OG_TITLE_MAX) {
      score++
      passed.push('Open Graph title is set')
    } else {
      score += 0.5
      issues.push({
        type: 'warning',
        field: 'og_title',
        message: 'OG title is too long',
        suggestion: `Keep under ${SEO_LIMITS.OG_TITLE_MAX} characters`,
      })
    }
  } else {
    issues.push({
      type: 'warning',
      field: 'og_title',
      message: 'Open Graph title is missing',
      suggestion: 'Add an OG title for better social media sharing',
    })
  }

  // OG Description
  checks++
  if (seoData.og_description && seoData.og_description.trim().length > 0) {
    if (seoData.og_description.length <= SEO_LIMITS.OG_DESCRIPTION_MAX) {
      score++
      passed.push('Open Graph description is set')
    } else {
      score += 0.5
      issues.push({
        type: 'warning',
        field: 'og_description',
        message: 'OG description is too long',
        suggestion: `Keep under ${SEO_LIMITS.OG_DESCRIPTION_MAX} characters`,
      })
    }
  } else {
    issues.push({
      type: 'warning',
      field: 'og_description',
      message: 'Open Graph description is missing',
      suggestion: 'Add an OG description for social media previews',
    })
  }

  // OG Image
  checks++
  if (seoData.og_image && seoData.og_image.trim().length > 0) {
    score++
    passed.push('Open Graph image is set')
  } else {
    issues.push({
      type: 'warning',
      field: 'og_image',
      message: 'Open Graph image is missing',
      suggestion: 'Add an OG image (1200x630px recommended) for visual appeal',
    })
  }

  return score / totalChecks
}

function analyzeTwitterCard(
  seoData: Partial<SeoData>,
  issues: SeoIssue[],
  passed: string[]
): number {
  let score = 0
  let checks = 0
  const totalChecks = 3

  // Twitter Title
  checks++
  if (seoData.twitter_title && seoData.twitter_title.trim().length > 0) {
    if (seoData.twitter_title.length <= SEO_LIMITS.TWITTER_TITLE_MAX) {
      score++
      passed.push('Twitter card title is set')
    } else {
      score += 0.5
      issues.push({
        type: 'warning',
        field: 'twitter_title',
        message: 'Twitter title is too long',
        suggestion: `Keep under ${SEO_LIMITS.TWITTER_TITLE_MAX} characters`,
      })
    }
  } else {
    issues.push({
      type: 'info',
      field: 'twitter_title',
      message: 'Twitter title not set (will fall back to OG/meta title)',
    })
    score += 0.5 // Fallback exists
  }

  // Twitter Description
  checks++
  if (seoData.twitter_description && seoData.twitter_description.trim().length > 0) {
    if (seoData.twitter_description.length <= SEO_LIMITS.TWITTER_DESCRIPTION_MAX) {
      score++
      passed.push('Twitter card description is set')
    } else {
      score += 0.5
      issues.push({
        type: 'warning',
        field: 'twitter_description',
        message: 'Twitter description is too long',
        suggestion: `Keep under ${SEO_LIMITS.TWITTER_DESCRIPTION_MAX} characters`,
      })
    }
  } else {
    issues.push({
      type: 'info',
      field: 'twitter_description',
      message: 'Twitter description not set (will fall back to OG/meta description)',
    })
    score += 0.5 // Fallback exists
  }

  // Twitter Image
  checks++
  if (seoData.twitter_image && seoData.twitter_image.trim().length > 0) {
    score++
    passed.push('Twitter card image is set')
  } else {
    issues.push({
      type: 'info',
      field: 'twitter_image',
      message: 'Twitter image not set (will fall back to OG image)',
    })
    score += 0.5 // Fallback exists
  }

  return score / totalChecks
}

function analyzeCanonicalUrl(
  canonical: string | null | undefined,
  issues: SeoIssue[],
  passed: string[]
): number {
  if (!canonical || canonical.trim().length === 0) {
    issues.push({
      type: 'info',
      field: 'canonical_url',
      message: 'Canonical URL not specified',
      suggestion: 'Set a canonical URL to prevent duplicate content issues',
    })
    return 0.5 // Not always required
  }

  // Basic URL validation
  try {
    new URL(canonical)
    passed.push('Canonical URL is set and valid')
    return 1
  } catch {
    issues.push({
      type: 'error',
      field: 'canonical_url',
      message: 'Invalid canonical URL format',
      suggestion: 'Use a full URL including https://',
    })
    return 0
  }
}

function analyzeStructuredData(
  data: Record<string, unknown>[] | null | undefined,
  issues: SeoIssue[],
  passed: string[]
): number {
  if (!data || data.length === 0) {
    issues.push({
      type: 'info',
      field: 'structured_data',
      message: 'No structured data (JSON-LD) added',
      suggestion: 'Add schema.org structured data for rich snippets',
    })
    return 0.5 // Optional but recommended
  }

  // Check for @type in structured data
  const hasValidType = data.some((item) => item['@type'] && typeof item['@type'] === 'string')

  if (!hasValidType) {
    issues.push({
      type: 'warning',
      field: 'structured_data',
      message: 'Structured data missing @type property',
      suggestion: 'Ensure each schema has a valid @type (e.g., "Organization", "Article")',
    })
    return 0.5
  }

  passed.push(`${data.length} structured data schema(s) added`)
  return 1
}

/**
 * Get SEO score grade
 */
export function getSeoGrade(score: number): {
  grade: string
  color: string
  label: string
} {
  if (score >= 90) {
    return { grade: 'A+', color: 'text-green-600', label: 'Excellent' }
  } else if (score >= 80) {
    return { grade: 'A', color: 'text-green-500', label: 'Very Good' }
  } else if (score >= 70) {
    return { grade: 'B', color: 'text-lime-500', label: 'Good' }
  } else if (score >= 60) {
    return { grade: 'C', color: 'text-yellow-500', label: 'Average' }
  } else if (score >= 50) {
    return { grade: 'D', color: 'text-orange-500', label: 'Below Average' }
  } else {
    return { grade: 'F', color: 'text-red-500', label: 'Poor' }
  }
}

/**
 * Generate SERP preview text
 */
export function generateSerpPreview(
  title: string | null | undefined,
  description: string | null | undefined,
  url: string
): {
  displayTitle: string
  displayDescription: string
  displayUrl: string
} {
  const displayTitle = title && title.trim().length > 0
    ? (title.length > SEO_LIMITS.META_TITLE_MAX
        ? title.substring(0, SEO_LIMITS.META_TITLE_MAX - 3) + '...'
        : title)
    : 'Page Title Not Set'

  const displayDescription = description && description.trim().length > 0
    ? (description.length > SEO_LIMITS.META_DESCRIPTION_MAX
        ? description.substring(0, SEO_LIMITS.META_DESCRIPTION_MAX - 3) + '...'
        : description)
    : 'No meta description set. Google may use content from your page instead.'

  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return { displayTitle, displayDescription, displayUrl }
}
