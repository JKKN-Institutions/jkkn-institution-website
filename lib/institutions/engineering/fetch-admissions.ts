import { createPublicSupabaseClient } from '@/lib/supabase/server'
import {
  OVERVIEW,
  PROGRAMS_TABLE,
  DETAILED_ELIGIBILITY,
  ADMISSION_STEPS,
  PROCESS_GUIDELINES,
  REQUIRED_DOCUMENTS,
  FEE_STRUCTURE,
  ADMISSION_DATES,
  SCHOLARSHIP_GROUPS,
  FAQS,
  type ProgramTableRow,
  type DetailedEligibilityItem,
  type AdmissionStep,
  type DocumentItem,
  type FeeEntry,
  type ScholarshipGroup,
  type FAQItem,
} from './admissions-data'
import type { AdmissionDateItem } from '@/lib/cms/registry-types'

export interface EngineeringAdmissionsData {
  overview: string
  programs: ProgramTableRow[]
  eligibility: DetailedEligibilityItem[]
  steps: AdmissionStep[]
  guidelines: string[]
  documents: { common: DocumentItem[]; ugOnly: DocumentItem[]; pgOnly: DocumentItem[] }
  feeStructure: FeeEntry[]
  dates: AdmissionDateItem[]
  scholarshipGroups: ScholarshipGroup[]
  faqs: FAQItem[]
}

/**
 * Fetch all engineering admissions page data from site_settings (category = 'admissions').
 * Falls back to static data from admissions-data.ts if Supabase is unreachable or rows are missing.
 *
 * Uses createPublicSupabaseClient() — no cookies — so the page can be statically rendered (ISR).
 *
 * To update any section: run an UPDATE on site_settings WHERE setting_key = 'admissions_<section>'
 * The page will reflect changes within the next ISR revalidation cycle (86400s / 24h).
 * To force an immediate update, trigger a revalidation or redeploy.
 */
export async function fetchEngineeringAdmissionsData(): Promise<EngineeringAdmissionsData> {
  try {
    const supabase = createPublicSupabaseClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value')
      .eq('category', 'admissions')
      .eq('is_public', true)

    if (error || !data || data.length === 0) {
      return staticFallback()
    }

    // Build a map: setting_key → parsed value
    const map = Object.fromEntries(
      data.map((row) => [row.setting_key, row.setting_value])
    )

    return {
      overview:          (map.admissions_overview          as string)                                                ?? OVERVIEW,
      programs:          (map.admissions_programs          as ProgramTableRow[])                                     ?? PROGRAMS_TABLE,
      eligibility:       (map.admissions_eligibility       as DetailedEligibilityItem[])                             ?? DETAILED_ELIGIBILITY,
      steps:             (map.admissions_steps             as AdmissionStep[])                                       ?? ADMISSION_STEPS,
      guidelines:        (map.admissions_guidelines        as string[])                                              ?? PROCESS_GUIDELINES,
      documents:         (map.admissions_documents         as EngineeringAdmissionsData['documents'])                ?? REQUIRED_DOCUMENTS,
      feeStructure:      (map.admissions_fee_structure     as FeeEntry[])                                            ?? FEE_STRUCTURE,
      dates:             (map.admissions_dates             as AdmissionDateItem[])                                   ?? ADMISSION_DATES,
      scholarshipGroups: (map.admissions_scholarship_groups as ScholarshipGroup[])                                   ?? SCHOLARSHIP_GROUPS,
      faqs:              (map.admissions_faqs              as FAQItem[])                                             ?? FAQS,
    }
  } catch {
    // Network error or misconfigured env — silently fall back to static data
    return staticFallback()
  }
}

function staticFallback(): EngineeringAdmissionsData {
  return {
    overview:          OVERVIEW,
    programs:          PROGRAMS_TABLE,
    eligibility:       DETAILED_ELIGIBILITY,
    steps:             ADMISSION_STEPS,
    guidelines:        PROCESS_GUIDELINES,
    documents:         REQUIRED_DOCUMENTS,
    feeStructure:      FEE_STRUCTURE,
    dates:             ADMISSION_DATES,
    scholarshipGroups: SCHOLARSHIP_GROUPS,
    faqs:              FAQS,
  }
}
