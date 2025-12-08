// Institutions and Departments configuration for JKKN Group
// This config is used for dropdowns in user management forms

export const INSTITUTIONS = [
  {
    id: 'jkkn-college-arts-science',
    name: 'JKKN College of Arts and Science',
    shortName: 'JKKN CAS',
    departments: [
      'Computer Science',
      'Commerce',
      'Business Administration',
      'English',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biotechnology',
      'Microbiology',
      'Information Technology',
      'B.Voc Software Development',
      'Library Science',
      'Physical Education',
    ],
  },
  {
    id: 'jkkn-college-engineering',
    name: 'JKKN College of Engineering and Technology',
    shortName: 'JKKN CET',
    departments: [
      'Computer Science and Engineering',
      'Electronics and Communication',
      'Electrical and Electronics',
      'Mechanical Engineering',
      'Civil Engineering',
      'Information Technology',
      'Artificial Intelligence and Data Science',
      'Science and Humanities',
    ],
  },
  {
    id: 'jkkn-college-pharmacy',
    name: 'JKKN College of Pharmacy',
    shortName: 'JKKN CP',
    departments: [
      'Pharmacy Practice',
      'Pharmaceutics',
      'Pharmaceutical Chemistry',
      'Pharmacology',
      'Pharmacognosy',
      'Pharmaceutical Analysis',
    ],
  },
  {
    id: 'jkkn-dental-college',
    name: 'JKKN Dental College and Hospital',
    shortName: 'JKKN DC',
    departments: [
      'Oral Medicine and Radiology',
      'Oral and Maxillofacial Surgery',
      'Prosthodontics',
      'Periodontics',
      'Orthodontics',
      'Pedodontics',
      'Conservative Dentistry and Endodontics',
      'Oral Pathology and Microbiology',
      'Public Health Dentistry',
    ],
  },
  {
    id: 'jkkn-college-allied-health',
    name: 'JKKN College of Allied Health Sciences',
    shortName: 'JKKN CAHS',
    departments: [
      'Medical Laboratory Technology',
      'Optometry',
      'Radiography and Imaging Technology',
      'Cardiac Care Technology',
      'Dialysis Therapy',
      'Physician Assistant',
    ],
  },
  {
    id: 'jkkn-college-nursing',
    name: 'JKKN College of Nursing',
    shortName: 'JKKN CN',
    departments: [
      'Medical Surgical Nursing',
      'Community Health Nursing',
      'Psychiatric Nursing',
      'Child Health Nursing',
      'Obstetrics and Gynecological Nursing',
    ],
  },
  {
    id: 'jkkn-college-physiotherapy',
    name: 'JKKN College of Physiotherapy',
    shortName: 'JKKN CPT',
    departments: [
      'Orthopaedic Physiotherapy',
      'Neurological Physiotherapy',
      'Cardiopulmonary Physiotherapy',
      'Community Physiotherapy',
      'Sports Physiotherapy',
    ],
  },
  {
    id: 'jkkn-school-nursing',
    name: 'JKKN School of Nursing',
    shortName: 'JKKN SN',
    departments: [
      'General Nursing and Midwifery',
      'Auxiliary Nurse Midwife',
    ],
  },
  {
    id: 'jkkn-educational-institutions',
    name: 'JKKN Educational Institutions',
    shortName: 'JKKN EI',
    departments: [
      'Primary School',
      'Middle School',
      'High School',
      'Higher Secondary',
      'Administration',
    ],
  },
  {
    id: 'jkkn-group-admin',
    name: 'JKKN Group Administration',
    shortName: 'JKKN Admin',
    departments: [
      'Chairman Office',
      'Managing Director Office',
      'Finance',
      'Human Resources',
      'IT Department',
      'Marketing',
      'Public Relations',
      'Admissions',
      'Placements',
      'Examinations',
      'Library',
      'Hostel',
      'Transport',
      'Maintenance',
    ],
  },
] as const

export type InstitutionId = typeof INSTITUTIONS[number]['id']

export function getInstitutionById(id: string) {
  return INSTITUTIONS.find(inst => inst.id === id)
}

export function getDepartmentsByInstitution(institutionId: string): string[] {
  const institution = getInstitutionById(institutionId)
  return institution ? [...institution.departments] : []
}

export function getInstitutionOptions() {
  return INSTITUTIONS.map(inst => ({
    value: inst.id,
    label: inst.name,
    shortName: inst.shortName,
  }))
}

export function getDepartmentOptions(institutionId: string) {
  const departments = getDepartmentsByInstitution(institutionId)
  return departments.map(dept => ({
    value: dept,
    label: dept,
  }))
}
