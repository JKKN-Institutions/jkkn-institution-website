// The CRM programme list behind the site enquiry form (engg.jkkn.ac.in and www.jkkn.ac.in).
//
// WHY THIS IS ITS OWN FILE. A Next.js 'use server' module may only export async functions; on the
// Arts build (2026-08-16) a plain array inside the action file was stripped and the page died at
// prerender with "j.map is not a function" while tsc reported 0 errors. Plain data stays here.
//
// SOURCE. Every id below was checked on 2026-10-31 against the live CRM form definition,
// GET https://www.jkkn.ai/api/public/forms/jkkn-admission-2026 (7 institutions, 71 programmes).
// The parent-facing labels are the ones the six college sites already use for the same ids
// (lib/<college>-programmes.ts on each repo's main branch, read the same day). Engineering's
// labels are the CRM's own names, in the order of the AICTE EoA 2026-27 intake table
// (lib/institutions/engineering/official-data.ts). Re-check before each deploy: a dead
// program_id is a lead that never lands.
//
// LEFT OUT ON PURPOSE. "B.Ed (Historical Aggregate)" - a data-migration bucket in the CRM, not a
// programme anyone applies to (the Education site leaves it out for the same reason). The CRM has
// no school institution, so the Matriculation and CBSE schools are not in this form (user's choice
// 2026-10-31: colleges only).

export type CrmProgramme = { id: string; label: string }

export type CrmInstitution = {
  /** Short key, used only inside this codebase. */
  key: string
  /** The name the main site prints for this college. */
  label: string
  /** CRM institution id - sent as institution_program.institution_id. */
  id: string
  programmes: ReadonlyArray<CrmProgramme>
}

export const CRM_INSTITUTIONS: ReadonlyArray<CrmInstitution> = [
  {
    key: 'dental',
    label: 'JKKN Dental College and Hospital',
    id: 'e8fbe8aa-c44e-41aa-a44b-39dab2c8b9a5',
    programmes: [
      { id: 'aea1e367-65ad-442d-9b11-ab0277d93a83', label: 'BDS — Bachelor of Dental Surgery' },
      { id: '628081aa-6b5a-422c-bf09-f99d8720f816', label: 'MDS — Periodontics' },
      { id: '22e425e7-f159-4b89-8d59-901dc32f96c6', label: 'MDS — Prosthodontics' },
      { id: 'd3d87793-fb87-4be3-8a37-93b2d02fd0e7', label: 'MDS — Orthodontics' },
      { id: '2806fbc8-9848-4a96-b57e-dfeac11768ca', label: 'MDS — Conservative Dentistry and Endodontics' },
      { id: '3805d017-1f0e-458d-a384-3721e0a9db54', label: 'MDS — Oral Medicine and Radiology' },
    ],
  },
  {
    key: 'pharmacy',
    label: 'JKKN College of Pharmacy',
    id: '5736d86f-5dab-4b7f-9aa1-b3bb1a2dd334',
    programmes: [
      { id: 'b3640fc2-4260-4548-b66b-1a9908e876ea', label: 'Pharm.D (6 years)' },
      { id: '1e1fe1a9-92a9-43e5-b64f-72ffcb98caca', label: 'Pharm.D Post Baccalaureate' },
      { id: '0d980d34-f945-4de6-8c88-ee97b2620b99', label: 'B.Pharm (4 years)' },
      { id: '771422d3-c867-4ebc-9126-15207d5a757e', label: 'B.Pharm Lateral Entry' },
      { id: 'e56b6ef9-6266-4097-9287-7c7920b3822e', label: 'M.Pharm — Pharmaceutics' },
      { id: '81857fa8-1481-49d6-939b-f4e601616734', label: 'M.Pharm — Pharmacology' },
      { id: '4965ac96-222b-4a5f-a671-001807dd19ab', label: 'M.Pharm — Pharmaceutical Chemistry' },
      { id: '3b440c7a-6a95-40c9-9811-e6a325408669', label: 'M.Pharm — Pharmaceutical Analysis' },
      { id: '08d25ceb-a761-4a64-9789-e2cc7cc87f5f', label: 'M.Pharm — Pharmacy Practice' },
      { id: 'ab96b847-f9e3-41ee-bdd6-3500dd869571', label: 'M.Pharm — Regulatory Affairs' },
    ],
  },
  {
    key: 'engineering',
    label: 'JKKN College of Engineering and Technology',
    id: '5de4fba1-4564-41ed-8c73-5d948b74b843',
    programmes: [
      { id: '7bf53be0-1cc5-407d-9a14-c1b6b39e874a', label: 'B.E. Computer Science and Engineering' },
      { id: 'a8816345-afbd-4a0b-b1cc-c2d147ef5660', label: 'B.E. Electronics and Communication Engineering' },
      { id: 'b65f9aa8-66e4-4e71-bebd-30683b3016ff', label: 'B.E. Electrical and Electronics Engineering' },
      { id: '353f2c9e-7385-4e01-9aee-29c5b4fa0e6c', label: 'B.E. Mechanical Engineering' },
      { id: '5acfd400-da68-4fb6-8886-40e8b27c6a7c', label: 'B.Tech Information Technology' },
      { id: '24102930-dded-46e0-869b-3247cdca334d', label: 'M.E. Computer Science and Engineering' },
      { id: '43eed6cf-fa51-4e6b-ba93-1b27c4c16df4', label: 'MBA — Master of Business Administration' },
    ],
  },
  {
    key: 'nursing',
    label: 'Sresakthimayeil Institute of Nursing and Research',
    id: '70e54e51-9b98-4e07-9534-a85310609bfd',
    programmes: [
      { id: '35412f80-1100-4be9-ba82-92111eac57fc', label: 'B.Sc Nursing (4 years)' },
      { id: '23b838dd-49b7-4f0e-afe4-72af411f7724', label: 'Post Basic B.Sc Nursing' },
      { id: 'e46c9707-be99-453e-a411-9bac83e806ee', label: 'M.Sc Nursing — Medical Surgical Nursing' },
      { id: '432ea38a-947a-4959-98c5-fbcef4068252', label: 'M.Sc Nursing — Child Health Nursing' },
      { id: 'bf8a9692-7543-4af8-b0db-d45d8eff32be', label: 'M.Sc Nursing — Community Health Nursing' },
      { id: '52edf664-720c-4dd6-917d-f531c05375b9', label: 'M.Sc Nursing — Mental Health Nursing' },
      { id: 'a878c1b4-a610-4750-b69b-51002ce91252', label: 'M.Sc Nursing — Obstetrics and Gynaecological Nursing' },
    ],
  },
  {
    key: 'arts',
    label: 'JKKN College of Arts and Science',
    id: 'b0b8a724-7c65-4f07-8047-2a38e8100ad5',
    programmes: [
      { id: 'f0f0b814-5e8c-41db-900b-a6fa1e9e5bd6', label: 'BCA — Bachelor of Computer Applications' },
      { id: '4b530214-20be-472b-9bbf-93d18c37063f', label: 'BBA — Bachelor of Business Administration' },
      { id: '9fbaa8df-ee4d-4061-bd8b-58e6607e6a0d', label: 'B.Sc Computer Science' },
      { id: '1188ad3b-c941-465e-af42-9dca3fe33170', label: 'B.Sc Computer Science (AI & Data Science)' },
      { id: '83488831-7b75-48df-9754-1ab9e204166f', label: 'B.Sc Computer Science (Cyber Security)' },
      { id: 'b7b7f940-2429-485b-b029-17023a03cd5f', label: 'B.Sc Mathematics' },
      { id: '1b42a105-e03c-461f-bc30-8252596235dd', label: 'B.Sc Microbiology' },
      { id: '02e487e8-18fd-4f10-b267-3ae258dd9102', label: 'B.Sc Physics' },
      { id: '0d37fe49-31eb-4735-a48f-0ccf31d0e784', label: 'B.Sc Textile & Fashion Designing' },
      { id: '57f4bbab-a828-4075-90e1-bf05f3d9d912', label: 'B.Sc Visual Communication' },
      { id: '17a7bbe7-de09-496c-bb67-2136b3969820', label: 'Textile & Fashion Designing (AI)' },
      { id: '2cae5d16-b7fb-4914-8ea8-d6abd2b852a4', label: 'Visual Communication (AI)' },
      { id: 'c93ab236-dfa4-45ad-92b9-a53159fd8868', label: 'B.Com (AI)' },
      { id: '8c6b4cf9-a5b8-42b1-9a43-b6417dc6fe21', label: 'B.Com Computer Application' },
      { id: 'e1478844-5b9e-4ec7-82fb-e721043020eb', label: 'B.A. English' },
      { id: '82f62c0c-e4da-4be7-a703-c8cf7b8b3b39', label: 'Clinical and Lab Technology' },
      { id: '40633012-400b-4b3b-94b7-f2b33dc4d39e', label: 'M.Com — Master of Commerce' },
      { id: '98d9ff39-49a6-401d-998f-a5ffd90f169b', label: 'M.A. English' },
      { id: 'ac31957e-1d42-4cd1-8d10-7716d84cbb6b', label: 'M.Sc Computer Science' },
      { id: '9aab244b-1101-4777-803f-e5cf653cceae', label: 'M.Sc Computer Science (Data Analytics)' },
      { id: '1a7b5ae4-7cf1-46c1-b1e9-e44ced8fd848', label: 'M.Sc Mathematics' },
    ],
  },
  {
    key: 'ahs',
    label: 'JKKN College of Allied Health Sciences',
    id: '9c1554e8-12a2-4b76-a9d6-8242bb05eba1',
    programmes: [
      { id: '89bb449f-433d-4b1c-b45b-bafd3e0f4b87', label: 'B.Sc Cardiac Technology' },
      { id: 'f36335f6-5b96-4358-956e-981bf8393dff', label: 'B.Sc Critical Care Technology' },
      { id: '8db907b8-8115-4f91-b95d-a64f1c007cdc', label: 'Bachelor of Physician Associates (B.PA)' },
      { id: 'b8175e9c-7d16-4eba-996c-59d54e18c5eb', label: 'Bachelor of Dialysis Therapy Technology (B.DTT)' },
      { id: 'd6662299-c40a-4da2-9099-2a2f7739f80b', label: 'Bachelor of Emergency Medical Technologist (Paramedic)' },
      { id: '353c4c23-7d10-42d8-9e20-f43f66b4b12e', label: 'Bachelor of Respiratory Technology (B.RT)' },
      { id: 'c5ea2a50-343a-4560-a73e-28f3b6afae90', label: 'Bachelor of Anaesthesia and Operation Theatre Technology (B.AOTT)' },
      { id: 'dd98ecbc-a166-463b-8a17-ebc2e26c2035', label: 'Bachelor of Science in Health Information Management (B.Sc. HIM)' },
      { id: 'ea7356c4-23ba-4ff5-aac2-04ad0555bccc', label: 'Bachelor of Medical Radiology and Imaging Technology (B.MRIT)' },
    ],
  },
  {
    key: 'education',
    label: 'JKKN College of Education',
    id: '9380358f-7020-4c23-89c3-e9538b47cf33',
    programmes: [
      { id: 'de176e31-2fe8-431c-857f-35fcd5f6c40e', label: 'B.Ed — Tamil' },
      { id: 'dceeea1a-79a1-48bc-885f-351bfd9800aa', label: 'B.Ed — English' },
      { id: 'e0664e7e-b4c9-4927-a919-74e4bd3cdb74', label: 'B.Ed — Mathematics' },
      { id: 'c3ac44db-6cfd-4a7d-948e-95977ca2234d', label: 'B.Ed — Physical Science' },
      { id: 'fe43f2c7-0d3d-4c19-ac2e-ad85d1c4a9a9', label: 'B.Ed — Biological Science' },
      { id: 'db10bd63-da82-420c-88e6-ae34fcafe1ff', label: 'B.Ed — Social Science' },
      { id: 'f6709bd9-dc91-4320-83c2-1403c820678e', label: 'B.Ed — History' },
      { id: '149ac1a4-c6f0-415f-b343-96e9a1d87023', label: 'B.Ed — Economics' },
      { id: '662cb4b4-84f8-4888-8dad-c8902840e832', label: 'B.Ed — Commerce and Accountancy' },
      { id: 'ce4d19b0-afad-4ac9-acfa-638ed68305cb', label: 'B.Ed — Computer Science' },
    ],
  },
]

export const ENGINEERING_INSTITUTION_ID = '5de4fba1-4564-41ed-8c73-5d948b74b843'

/** The groups a site's form offers: Engineering offers its own college, the main site all seven. */
export function institutionsForSite(siteId: string): ReadonlyArray<CrmInstitution> {
  if (siteId === 'engineering') return CRM_INSTITUTIONS.filter((i) => i.id === ENGINEERING_INSTITUTION_ID)
  if (siteId === 'main') return CRM_INSTITUTIONS
  return []
}

/** The CRM institution that owns a programme id, or null when the id is not offered on that site. */
export function institutionForProgramme(siteId: string, programmeId: string): string | null {
  for (const inst of institutionsForSite(siteId)) {
    if (inst.programmes.some((p) => p.id === programmeId)) return inst.id
  }
  return null
}

// Pre-selects the dropdown on the seven Engineering admission pages, so a parent reading the B.E.
// CSE page does not have to pick it again. Keys are the path after /admissions/ (sitemap-pages.xml,
// read 2026-10-31). Every other page opens on "Select a Programme".
export const ENGG_DEFAULT_PROGRAMME_BY_SLUG: Readonly<Record<string, string>> = {
  'be-cse': '7bf53be0-1cc5-407d-9a14-c1b6b39e874a',
  'be-ece': 'a8816345-afbd-4a0b-b1cc-c2d147ef5660',
  'be-eee': 'b65f9aa8-66e4-4e71-bebd-30683b3016ff',
  'be-mechanical': '353f2c9e-7385-4e01-9aee-29c5b4fa0e6c',
  'btech-it': '5acfd400-da68-4fb6-8886-40e8b27c6a7c',
  'me-cse': '24102930-dded-46e0-869b-3247cdca334d',
  'mba': '43eed6cf-fa51-4e6b-ba93-1b27c4c16df4',
}
