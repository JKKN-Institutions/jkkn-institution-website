/**
 * Course Catalog Configuration
 *
 * Update these values annually for new academic year.
 * All date-dependent fields in the Course Catalog Schema
 * reference this configuration file.
 *
 * @see components/seo/course-catalog-schema.tsx
 */

export const courseCatalogConfig = {
  /** Academic year displayed in schema (e.g., '2026-27') */
  academicYear: '2026-27',

  /** Application deadline for all programs */
  admissionDeadline: '2026-08-31',

  /** Course start dates by department */
  courseStartDates: {
    dental: '2026-09-01',
    pharmacy: '2026-08-01',
    engineering: '2026-08-01',
    nursing: '2026-09-01',
    alliedHealth: '2026-08-01',
    artsScience: '2026-06-01',
    education: '2026-08-01',
  },

  /** Course end dates for specific programs (start year + duration) */
  courseEndDates: {
    // Dental
    bds: '2031-08-31',      // 5 years (4 + 1 internship)
    mds: '2029-08-31',      // 3 years

    // Pharmacy
    bpharm: '2030-07-31',   // 4 years
    mpharm: '2028-07-31',   // 2 years
    pharmd: '2032-07-31',   // 6 years (5 + 1 internship)

    // Engineering
    be: '2030-07-31',       // 4 years
    btech: '2030-07-31',    // 4 years
    mba: '2028-07-31',      // 2 years

    // Nursing
    bscNursing: '2030-08-31',   // 4 years
    mscNursing: '2028-08-31',   // 2 years
    pbbscNursing: '2028-08-31', // 2 years

    // Allied Health (3 years for most, 4 years for optometry)
    bscMlt: '2029-07-31',
    bscRadiology: '2029-07-31',
    bscOptometry: '2030-07-31', // 4 years
    bscCardiac: '2029-07-31',
    bscDialysis: '2029-07-31',

    // Arts & Science
    bca: '2029-05-31',      // 3 years
    bba: '2029-05-31',      // 3 years
    bcom: '2029-05-31',     // 3 years
    bscCs: '2029-05-31',    // 3 years
    mca: '2028-05-31',      // 2 years

    // Education
    bed: '2028-07-31',      // 2 years
  },

  /** Admission offer validity period */
  offerValidity: {
    validFrom: '2026-01-01',
    validThrough: '2026-08-31',
  },

  /** Site configuration */
  site: {
    url: 'https://jkkn.ac.in',
    admissionFormUrl: 'https://jkkn.in/admission-form',
  },

  /** Geo coordinates for all institutions */
  geo: {
    latitude: '11.445400813968119',
    longitude: '77.73060452273064',
  },

  /** Common address for all institutions */
  address: {
    streetAddress: 'Natarajapuram, NH-544',
    addressLocality: 'Komarapalayam',
    addressRegion: 'Tamil Nadu',
    postalCode: '638183',
    addressCountry: 'IN',
  },
} as const

export type CourseCatalogConfig = typeof courseCatalogConfig
