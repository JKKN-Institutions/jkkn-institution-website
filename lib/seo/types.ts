/**
 * SEO Structured Data Types
 * TypeScript interfaces for JSON-LD schema generation
 */

// Base schema.org types
export interface Thing {
  '@context'?: string
  '@type': string
  '@id'?: string
}

// Breadcrumb types
export interface BreadcrumbItem {
  name: string
  url: string
}

export interface ListItem extends Thing {
  '@type': 'ListItem'
  position: number
  name: string
  item: string
}

export interface BreadcrumbList extends Thing {
  '@type': 'BreadcrumbList'
  itemListElement: ListItem[]
}

// Organization types
export interface PostalAddress extends Thing {
  '@type': 'PostalAddress'
  streetAddress: string
  addressLocality: string
  addressRegion: string
  postalCode: string
  addressCountry: string
}

export interface ContactPoint extends Thing {
  '@type': 'ContactPoint'
  telephone: string
  contactType: string
  email?: string
  areaServed?: string
  availableLanguage?: string | string[]
}

export interface EducationalOrganization extends Thing {
  '@type': 'EducationalOrganization'
  name: string
  alternateName?: string
  url: string
  logo?: string
  foundingDate?: string
  description?: string
  address?: PostalAddress
  contactPoint?: ContactPoint | ContactPoint[]
  sameAs?: string[]
}

// WebPage types
export interface WebPage extends Thing {
  '@type': 'WebPage'
  name: string
  url: string
  description?: string
  isPartOf?: {
    '@type': 'WebSite'
    name: string
    url: string
  }
  breadcrumb?: BreadcrumbList
}

// Combined graph type for multiple schemas
export interface SchemaGraph {
  '@context': 'https://schema.org'
  '@graph': Thing[]
}

// Configuration types
export interface BreadcrumbConfig {
  [path: string]: BreadcrumbItem[]
}

export interface OrganizationConfig {
  name: string
  alternateName: string
  url: string
  logo: string
  foundingDate: string
  description: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint: {
    telephone: string
    contactType: string
    email?: string
  }
  sameAs: string[]
}

// ============================================
// Course Catalog Schema Types
// ============================================

/**
 * Geographic coordinates
 */
export interface GeoCoordinates extends Thing {
  '@type': 'GeoCoordinates'
  latitude: string
  longitude: string
}

/**
 * Physical location/place
 */
export interface Place extends Thing {
  '@type': 'Place'
  name?: string
  address?: PostalAddress
  geo?: GeoCoordinates
}

/**
 * College or University organization
 */
export interface CollegeOrUniversity extends Thing {
  '@type': 'CollegeOrUniversity'
  name: string
  url?: string
  parentOrganization?: {
    '@id': string
  }
  address?: PostalAddress
}

/**
 * Course instance for a specific academic term/batch
 */
export interface CourseInstance extends Thing {
  '@type': 'CourseInstance'
  name: string
  courseMode: 'full-time' | 'part-time' | 'online' | 'blended'
  courseWorkload?: string
  startDate?: string
  endDate?: string
  location?: Place
  instructor?: {
    '@type': 'Organization'
    name: string
  }
}

/**
 * Educational/Occupational credential awarded upon completion
 */
export interface EducationalOccupationalCredential extends Thing {
  '@type': 'EducationalOccupationalCredential'
  credentialCategory?: string
  name?: string
  recognizedBy?: {
    '@type': 'Organization'
    name: string
  }
}

/**
 * Aggregate rating for a course
 */
export interface AggregateRating extends Thing {
  '@type': 'AggregateRating'
  ratingValue: string
  bestRating: string
  worstRating: string
  ratingCount: string
}

/**
 * Target audience for educational content
 */
export interface EducationalAudience extends Thing {
  '@type': 'EducationalAudience'
  educationalRole?: string
  audienceType?: string
}

/**
 * Offer for admission/enrollment
 */
export interface Offer extends Thing {
  '@type': 'Offer'
  category?: string
  availability?: string
  url?: string
  validFrom?: string
  validThrough?: string
  eligibleRegion?: {
    '@type': 'Country'
    name: string
  }
}

/**
 * Individual course
 */
export interface Course extends Thing {
  '@type': 'Course'
  '@id'?: string
  name: string
  description?: string
  url?: string
  courseCode?: string
  provider?: CollegeOrUniversity | { '@type': string; name: string; '@id'?: string }
  educationalCredentialAwarded?: string
  occupationalCredentialAwarded?: EducationalOccupationalCredential
  timeRequired?: string
  numberOfCredits?: {
    '@type': 'StructuredValue'
    value: string
  }
  teaches?: string[]
  coursePrerequisites?: string
  availableLanguage?: string[]
  inLanguage?: string
  hasCourseInstance?: CourseInstance
  offers?: Offer
  aggregateRating?: AggregateRating
  audience?: EducationalAudience
}

/**
 * Educational occupational program (degree program)
 */
export interface EducationalOccupationalProgram extends Thing {
  '@type': 'EducationalOccupationalProgram'
  '@id'?: string
  name: string
  description?: string
  url?: string
  provider?: CollegeOrUniversity
  educationalProgramMode?: 'full-time' | 'part-time' | 'online'
  programType?: string
  occupationalCategory?: string[]
  applicationDeadline?: string
  programPrerequisites?: {
    '@type': 'EducationalOccupationalCredential'
    credentialCategory?: string
    competencyRequired?: string
  }
  hasCourse?: Course[]
}

/**
 * Speakable specification for voice assistants
 */
export interface SpeakableSpecification {
  '@type': 'SpeakableSpecification'
  cssSelector?: string[]
}

/**
 * Action entry point
 */
export interface EntryPoint {
  '@type': 'EntryPoint'
  urlTemplate: string
}

/**
 * Apply action for admission
 */
export interface ApplyAction {
  '@type': 'ApplyAction'
  name?: string
  target?: EntryPoint
}

/**
 * WebPage with educational context
 */
export interface EducationalWebPage extends Thing {
  '@type': 'WebPage'
  '@id'?: string
  name: string
  description?: string
  url: string
  isPartOf?: {
    '@id': string
  }
  about?: {
    '@id': string
  }
  mainEntity?: {
    '@id': string
  }
  breadcrumb?: BreadcrumbList
  speakable?: SpeakableSpecification
  potentialAction?: ApplyAction
}

/**
 * Item in an ItemList
 */
export interface ItemListElement {
  '@type': 'ListItem'
  position: number
  name: string
  url: string
  item?: {
    '@id': string
  }
}

/**
 * ItemList for course catalog
 */
export interface CourseCatalogItemList extends Thing {
  '@type': 'ItemList'
  '@id'?: string
  name: string
  description?: string
  numberOfItems?: number
  itemListOrder?: string
  itemListElement: ItemListElement[]
}
