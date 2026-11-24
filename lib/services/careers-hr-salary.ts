// lib/services/careers-hr-salary.ts
//
// GENERATED - do not hand-edit. Source: HR's salary sheet for every careers job
// (received 2026-11-24), turned into this file by
// scripts/careers_salary_from_excel.py in the SEO / AEO / GEO project. Re-run that
// script when HR sends a new sheet.
//
// The website team has no MyJKKN access and MyJKKN carried a salary on 4 of 368 jobs,
// so HR's figures live here. For a listed job HR's figure is what the job page and
// the JobPosting markup show, in place of anything MyJKKN returns (user's decision
// 2026-11-24). Remove an entry once MyJKKN carries the same figure.
//
// Shapes, exactly as HR wrote them in the sheet's "Starting Basic" columns:
//   both columns filled   { min, max }                 -> Rs 30,000 - Rs 35,000 per month
//   one figure            { min = max, starting_basic } -> Rs 8,000 per month (starting basic pay)
//   one figure with '+'   { min, max: null, starting_basic } -> Rs 24,000+ per month (starting basic pay)
// All figures are rupees per month.

export interface HrSalary {
  min: number
  max: number | null
  basis?: 'starting_basic'
}

export const HR_SALARY_LIST_DATE = '2026-11-24'

/** Keyed by MyJKKN job id (lowercase). */
export const HR_SALARY: Readonly<Record<string, HrSalary>> = {
  '4bd1bb9f-71df-4033-b76b-fd2a079d1174': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASSISTANT PROFESSOR
  '975b20a8-c314-4676-afd0-07611c7a9a05': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASSISTANT PROFESSOR
  '5c866d2f-82f9-4ec8-a860-e4b56e8d5d11': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASSISTANT PROFESSOR
  '3eb74f36-dfd1-4b80-9cfc-8d8bc27d7054': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASSISTANT PROFESSOR
  '5d04d820-f0a3-4f75-b9d2-b0e12b25db81': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASSISTANT PROFESSOR
  'c9aff2a6-2a36-4431-8a78-30a5b94d4905': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASSISTANT PROFESSOR
  '7e8c76c4-50f3-43f4-a21e-fbea08edf80e': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASSISTANT PROFESSOR
  '914d832e-3954-4515-a27b-393fb01ccb70': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASSISTANT PROFESSOR
  '1708aa05-649a-4fcc-a6e7-d9764eeb522e': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASST PROF - AECT - AHS
  '635a2024-29c7-4d88-b817-a7fcb0da3209': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASST PROF - CCT - AHS
  '4e379110-65f1-44c8-926a-d68027a1929c': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASST PROF - Micro Biology
  '8fd63572-4809-4ea8-a2ee-11087ad0322d': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASST PROF - OTAT - AHS
  '33054797-82e3-4dc0-b45e-1eca6dd78cc6': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASST PROF - R.T. - AHS
  'd9bb5c32-33ec-4a67-b256-bc74656a39eb': { min: 30000, max: 35000 }, // JKKN College of Allied Health Sciences - ASST PROF - RIT -- AHS
  '91f6a2b9-f9f4-4861-8e0e-e9f094a6879a': { min: 15000, max: 18000 }, // JKKN College of Allied Health Sciences - ASSISTANT LIBRARIAN - AHS
  '8e3dc42b-8d8a-4840-a7db-67e91f6d4325': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Allied Health Sciences - Non teaching staff
  '0d40932d-8779-4c4d-ba34-fefc77b80cdb': { min: 50000, max: 55000 }, // JKKN College of Allied Health Sciences - PRINCIPAL JKKN College of Allied Health Sciences
  '5a72e0f9-90b7-4cac-87c5-6b9472c39cf8': { min: 35000, max: 45000 }, // JKKN College of Allied Health Sciences - Vice Principal
  'db2ae307-19c5-4c60-9bf4-b1d9325bf932': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - PROFESOR
  '759847b9-ede4-4bbd-a0b9-6a53ac8a81d1': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - PROFESSOR
  '1d69f504-bc9d-477e-9f3f-36d9b4f2bac4': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - PROFESSOR
  '50a64079-dacb-4bd8-85c6-894182fcbde7': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - PROFESSOR
  'd47d1243-212a-4233-abfc-f8a90f1e7cfa': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - PROFESSOR
  '5ac24879-e87a-4798-adab-2f45fa26312a': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - PROFESSOR
  '0ad23962-6e4b-4171-b626-88dd887e7f58': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - PROFESSOR
  '2f28c58d-1571-48ff-9ddc-9432c36a1cce': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - PROFESSOR
  '41860847-45d9-4cec-9b26-6321d5c50ab3': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - PROFESSOR
  'c526fb4f-8b28-4ad5-998b-d35ddaf1d8cd': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - LECTURER
  '4ee115e8-93fd-4a69-a9a8-9fe808d7200f': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - LECTURER
  '9411f1b2-dfc1-47c3-8210-80e339ebe47a': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - LECTURER
  '60ba963b-bb2f-490f-964a-3dcae00097f2': { min: 35000, max: 40000 }, // JKKN College of Allied Health Sciences - LECTURER
  '9fd800cc-b33b-42ad-a066-499c30ff01c9': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Allied Health Sciences - TUTOR
  'aa9c671a-45f9-4e52-bb39-f5f260033026': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Allied Health Sciences - TUTOR
  'f37258d5-f8d5-4eff-805c-371042843480': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Allied Health Sciences - TUTOR
  '339ab5ef-7d67-40de-b50e-767b8d5d7660': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Allied Health Sciences - TUTOR
  'e2b18578-1ec8-48c0-8c2e-800afa90911f': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Allied Health Sciences - TUTOR
  'b95d4d0b-39d4-4c1a-aeef-1385ab24f58f': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Allied Health Sciences - TUTOR
  'dbb2cdf9-94e2-4168-962f-a739cf372a8f': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Allied Health Sciences - TUTOR
  'ac8564e4-0445-4b8c-bd9b-2bd6bcbb92da': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Allied Health Sciences - TUTOR
  '3430f1a7-8f9c-4a22-8d0f-5cd98f73da85': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Allied Health Sciences - TUTOR
  '66f5b2d1-bc9e-4744-838d-3a980149bca7': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Allied Health Sciences - TUTOR - AHS
  '994694e1-a7d7-48cd-acc4-9a561d8d1f38': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - AP - AI&DS - CAS - Asst Prof
  '3eaf9017-156e-44e7-82fa-29c7193be9c2': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - AP- TAMIL - CAS - Assistant Professor
  'b431dee2-ea29-4bcd-821a-32694f33b40f': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - ASSISTANT PROFESSOR
  'c5ce798d-8a34-4013-bd63-d7041122d8b4': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - ASST PROF - Viscom - CAS
  '82025f90-82ad-4e75-8aca-0a45f6771ec1': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - Assistant Professor
  'eab98a80-2968-43f1-9fa2-da3487a0056d': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - Assistant Professor - COMPUTER SCIENCE
  '3742b922-3a65-49f8-a754-83f5390109a6': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - Assistant Professor - Computer Science
  '396b9cf7-9832-4c27-83c6-e13eedda871d': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - Assistant Professor - English Department
  '6ac0375a-6445-4837-b699-902e07d2b938': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - Assistant Professor - Physics
  'fb350939-0ba7-4848-ab1a-332582745ee6': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - Assistant Professor - Textile & Fashion Designing
  'f84ef542-3045-4a70-8b71-5096c445debb': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - Assistant Professor CLINICAL LAB TECHNOLOGY
  'c99f7be4-5398-4378-b8be-2c16c2c14ea7': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - Assistant Professor in Commerce
  '3c520823-697f-485d-9e27-d75ceb624857': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - Assistant Professor, MICROBIOLOGY
  '8d3c6495-0e13-4dcb-988d-8cccbbc17d19': { min: 15000, max: 20000 }, // JKKN College of Arts and Science (Self) - Assistant professor
  'dad069e8-0ccd-4468-abbb-01b1d40d97c0': { min: 20000, max: 25000 }, // JKKN College of Arts and Science (Self) - ASSOCIATE PROFESSOR
  '3ce2bb4c-e960-44ca-8465-db2b1c8850c6': { min: 20000, max: 25000 }, // JKKN College of Arts and Science (Self) - ASSOCIATE PROFESSOR
  '26c5cd5b-be3e-4b82-ae28-c44a0b36e55f': { min: 20000, max: 25000 }, // JKKN College of Arts and Science (Self) - ASSOCIATE PROFESSOR
  '53c3f7cd-cb12-439b-92d9-4368c60f6ec6': { min: 20000, max: 25000 }, // JKKN College of Arts and Science (Self) - ASSOCIATE PROFESSOR
  'd0f06100-14bd-400f-918f-85cb3db62dd3': { min: 20000, max: 25000 }, // JKKN College of Arts and Science (Self) - Associate Professor
  '4fc66944-8cc4-4886-afa7-fa887e969d8b': { min: 20000, max: 25000 }, // JKKN College of Arts and Science (Self) - Associate Professor
  '80c2b430-57de-4564-abaf-9ec9407c0cee': { min: 20000, max: 25000 }, // JKKN College of Arts and Science (Self) - Associate Professor
  '93b8b3d8-1594-4535-867c-69a674cdd1ec': { min: 20000, max: 25000 }, // JKKN College of Arts and Science (Self) - Associate Professor
  '439a28e3-2a3a-48a8-84b4-0e13559bf475': { min: 20000, max: 25000 }, // JKKN College of Arts and Science (Self) - Associate Professor, MICROBIOLOGY
  'd77f11fd-3cb3-4d2b-87a4-95d7e8a66f3f': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Arts and Science (Self) - LAB ASSISSTANT
  '68246426-dbd2-42db-8d22-90886ca72058': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Arts and Science (Self) - LAB ASSISSTANT
  '9770eb7c-089d-4198-acc3-9537b592dba1': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Arts and Science (Self) - Lab Assistant
  'd8102bb4-ae63-4147-9b90-08261b3a4f07': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Arts and Science (Self) - Senior Librarian - Arts and Science College
  '80ae7589-15b6-4280-98c5-8256aab4e2e0': { min: 45000, max: 60000 }, // JKKN College of Arts and Science (Self) - Principal
  'cadf96d4-abf6-4ca8-9457-297af51ecbd0': { min: 35000, max: 45000 }, // JKKN College of Arts and Science (Self) - Vice Principal,
  '8391358f-79ab-41f7-90e0-06b8d3f6f2b1': { min: 25000, max: 35000 }, // JKKN College of Arts and Science (Self) - ASSOICATE PROFESSOR
  '21e7eeb0-d73f-45d1-a2f8-5831649a9004': { min: 25000, max: 35000 }, // JKKN College of Arts and Science (Self) - PROFESSOR
  '45763f23-8614-492d-8aad-ea9b50543219': { min: 25000, max: 35000 }, // JKKN College of Arts and Science (Self) - PROFESSOR
  '3e0b9dd9-7c82-45cf-9e68-258e9ae335e8': { min: 25000, max: 35000 }, // JKKN College of Arts and Science (Self) - PROFESSOR
  '239d8ba0-fc20-45de-8710-6f2b5f7c714b': { min: 25000, max: 35000 }, // JKKN College of Arts and Science (Self) - PROFESSOR
  '6b90d9eb-792e-4755-a807-ae26386c7b45': { min: 25000, max: 35000 }, // JKKN College of Arts and Science (Self) - Professor
  '001964c4-9c2a-434d-82f7-39723b0fbb77': { min: 25000, max: 35000 }, // JKKN College of Arts and Science (Self) - Professor
  'fada00f9-4ca5-4f7b-ba26-20463d2f190f': { min: 25000, max: 35000 }, // JKKN College of Arts and Science (Self) - Professor
  'd14a7044-7965-44ca-a566-e33152592d0b': { min: 25000, max: 35000 }, // JKKN College of Arts and Science (Self) - Professor
  'cb33833d-5397-408f-8aad-49f1a5557b39': { min: 25000, max: 35000 }, // JKKN College of Arts and Science (Self) - Professor
  'f93309bd-cd55-4ae9-9415-61935c678552': { min: 10000, max: 10000, basis: 'starting_basic' }, // JKKN College of Arts and Science (Self) - TUTOR
  '274d9bf1-9292-458f-994c-ccf6fbec463d': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Education - Assistant Profesor- Pedagogy of History
  '40b75604-cb9b-4e2a-9069-cdd3cd355e2c': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Education - Assistant Professor - Pedagogy of Computer Science
  '516bbe0f-9849-4494-a8fd-5317d391790f': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Education - Assistant Professor - Pedagogy of English
  'e7e40578-7025-4d90-8cca-0ba0f200ae27': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Education - Assistant Professor - Pedagogy of Mathematics
  'bfab17b7-48d7-40bd-98ee-8eff5441a9cf': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Education - Assistant Professor - Pedagogy of Tamil
  '0d2e19d4-10ef-4e7a-85b0-4227404d6c24': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Education - Assistant Professor-Pedagogy of Commerce and Accountancy
  '15849006-9297-4846-9c26-b36e4a5f7e55': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Education - Assistant Professor-Pedagogy of Economics
  '5ddb925d-41e3-4d32-a91f-69d65ac186de': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Education - Assistant professor-Pedagogy of Biological Science
  '79ca041b-e5f1-4883-ae8c-671fd7a99deb': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Education - Assistant professor-Pedagogy of Physical Science
  '2a1f85cf-a57b-4ff7-8b82-8a8288241f08': { min: 18000, max: 20000 }, // JKKN College of Education - Associate Professor - Pedagogy of Biological Science
  '0ad7b8b0-aed0-44e2-a450-46f78a1df26a': { min: 18000, max: 20000 }, // JKKN College of Education - Associate Professor - Pedagogy of English
  '64460996-c94f-432d-a3a4-545a9ee5da43': { min: 18000, max: 20000 }, // JKKN College of Education - Associate Professor-Pedagogy of Commerce and Accountancy
  '416d25bd-4d2f-45ba-a304-a0c22181fa43': { min: 18000, max: 20000 }, // JKKN College of Education - Associate Professor-Pedagogy of Computer Science
  '27a90411-60f1-4456-966a-6bc50de39a76': { min: 18000, max: 20000 }, // JKKN College of Education - Associate Professor-Pedagogy of Economics
  '5869fff6-47ca-42fe-a958-7385274431f5': { min: 18000, max: 20000 }, // JKKN College of Education - Associate Professor-Pedagogy of History
  'bc55fa9c-ba34-454d-b05f-3b66c8e07099': { min: 18000, max: 20000 }, // JKKN College of Education - Associate Professor-Pedagogy of Physical Science
  '87d51ccc-6f96-424c-a1b3-27d661fea908': { min: 18000, max: 20000 }, // JKKN College of Education - Associate Professor-Pedagogy of Tamil
  'ff109bc4-c0d7-4791-9dda-c1280a5d1b34': { min: 18000, max: 20000 }, // JKKN College of Education - Associate professor - Pedagogy of Mathematics
  '63bb5b83-e541-4dc1-99be-eb294437dbbf': { min: 45000, max: 45000, basis: 'starting_basic' }, // JKKN College of Education - Principal JKKN College of Education
  '53b674d9-81c4-4770-af3a-27e3b375e5d2': { min: 20000, max: 25000 }, // JKKN College of Education - Professor - Pedagogy of English
  '148317ea-2c0b-487f-af2e-31e7e4e5c851': { min: 20000, max: 25000 }, // JKKN College of Education - Professor - Pedagogy of Mathematics
  'a9554704-f039-46b8-be7c-0879de4b7d90': { min: 20000, max: 25000 }, // JKKN College of Education - Professor - Pedagogy of Tamil
  'e79da098-6413-4741-9dff-858032802aa3': { min: 20000, max: 25000 }, // JKKN College of Education - Professor -Pedagogy of Commerce and Accountancy
  '63a3e252-756b-4e87-9980-7dff18b38374': { min: 20000, max: 25000 }, // JKKN College of Education - Professor- Pedagogy of Physical Science
  '6129da1b-381e-4540-870a-7d42bbf5f7a2': { min: 20000, max: 25000 }, // JKKN College of Education - Professor-Pedagogy of Biological Science
  '25392358-36e9-44b4-8ce9-a5a3dc2c9210': { min: 20000, max: 25000 }, // JKKN College of Education - Professor-Pedagogy of Computer Science
  'dbc1fe5d-84fb-4a92-93e4-c98dff9275e2': { min: 20000, max: 25000 }, // JKKN College of Education - Professor-Pedagogy of Economics
  '8819c421-2ef8-4c01-b611-833f8935134f': { min: 20000, max: 25000 }, // JKKN College of Education - Professor-Pedagogy of History
  '7260dc4e-dede-4a9c-8315-974102f761bf': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - AP - CHEMISTRY - CET - Asst Prof
  '0cd2fdea-73f1-429d-b598-71dca9fa7f2c': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - AP - ECE - CET - Asst Prof
  'e039ece5-fda3-4237-901b-97b21e192777': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - AP - MBA - CET - Asst Professor
  '4b90b52e-86e4-4dfa-8c21-27d691ccf56d': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - AP - PHYSICS - CET - Asst Prof
  '477ff0f6-70c8-4219-9d91-3cd4ea00d80c': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - ASSISTANT PROFESSOR
  '6740e53f-ad04-44df-a306-f891220dc441': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - ASSISTANT PROFESSOR - Chemistry
  '6adb5fc6-9410-4991-a328-3906406ed157': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - Assistant Professor - Business Administration
  '976b18db-1a46-4155-857a-d737846f4b40': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - Assistant Professor - Computer Science Engineering
  '091d72ab-23db-407a-9333-2c321875bd8f': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - Assistant Professor - Electrical and Electronics Engineering
  '24c3c20f-0c1c-4ae1-82d8-65688f49b936': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - Assistant Professor - Electronics and Communication Engineering
  '6e9df606-6396-4d97-9a13-fff3737901ba': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - Assistant Professor - Mechanical Engineering
  '36642515-85c2-49ff-8126-1dd48e8adb62': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - Assistant Professor -English
  '8e529d01-5448-4fa9-a350-8255670d8895': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - Assistant Professor — Computer Science & Engineering
  '51440a20-6051-4e44-99ca-ba7c67739dd6': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - Assistant Professor- Tamil
  'c16233a4-9811-4afc-ae6b-4cfd7c4e2f2c': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - Assistant professor - Maths
  '1030a142-afdd-4352-9374-2d631e8fb01f': { min: 15000, max: 18000 }, // JKKN College of Engineering and Technology - Assistant professor - Physics
  'cae510bb-0891-4a74-9f32-c07d78320573': { min: 25000, max: 31000 }, // JKKN College of Engineering and Technology - ASSOCIATE PROFESSOR
  '6db3b202-99e8-4064-946d-d15ee36ce44e': { min: 25000, max: 31000 }, // JKKN College of Engineering and Technology - ASSOCIATE PROFESSOR - Chemistry
  'ab9ad14d-949a-4631-b207-fe5ee532cd11': { min: 25000, max: 31000 }, // JKKN College of Engineering and Technology - Associate Prfessor
  'e28a4341-2539-49a0-9315-84fe2a6cb58c': { min: 25000, max: 31000 }, // JKKN College of Engineering and Technology - Associate Professor
  'ba8ac383-9e15-4399-a59e-69df742b9c17': { min: 25000, max: 31000 }, // JKKN College of Engineering and Technology - Associate Professor
  'c556feee-74f7-4a1f-bc6e-4f2f2c748349': { min: 25000, max: 31000 }, // JKKN College of Engineering and Technology - Associate Professor
  '4e26f93a-07be-4ab7-93f1-6a551cfb471c': { min: 25000, max: 31000 }, // JKKN College of Engineering and Technology - Associate Professor
  'a5ad0aab-2944-409f-8702-2b9427c7042c': { min: 25000, max: 31000 }, // JKKN College of Engineering and Technology - Associate Professor - Physics
  '265ea128-1f3a-4874-b71f-05eb4111a614': { min: 25000, max: 31000 }, // JKKN College of Engineering and Technology - Associate Professor -English
  '20ef14b2-7b75-4725-8728-70a35f472b70': { min: 25000, max: 31000 }, // JKKN College of Engineering and Technology - Associate professor - Maths
  'c0a8cb80-4fa4-4244-a8c7-4a9f47e6f2b5': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - LAB ASSISSTANT
  'ab269f46-63d4-406b-9580-ef14c17d5356': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Lab Assistant
  '51dd9bcf-b061-4040-8a5a-640b4ae26b0c': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Lab Assistant
  '8d5fd4cd-762f-4509-b8bd-c265e2b9d127': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Lab Assistant
  'e8f353e4-8503-4ad7-8e1c-bcb641e79b51': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Lab Assistant
  '7d692af6-b52f-4019-b7aa-5ef6db064823': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Lab Assistant
  'de991b9a-9379-480c-bbb0-69fcdc099eda': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Lab Assistant
  'dd73fdfd-9e0a-450a-a188-31fec0895892': { min: 15000, max: 20000 }, // JKKN College of Engineering and Technology - Senior Librarian - Engineering College
  '4f0abd9c-808a-4495-b648-d84d64e87b6a': { min: 25000, max: 35000 }, // JKKN College of Engineering and Technology - DEPUTY CONTT OF EXAMS - CET
  'eae3712c-0d12-4f8a-85b0-a6ff6cba140c': { min: 150000, max: 170000 }, // JKKN College of Engineering and Technology - PRINCIPAL JKKN College of Engineering and Technology
  '8d3fc27e-89a1-4e39-a7bf-ae1c04f24336': { min: 40000, max: 40000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - PROFESSOR - Chemistry
  '7a91348d-95ae-49db-b407-77b0ce5fcc8d': { min: 40000, max: 40000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Professor
  'dc3d3515-d4da-4b74-998a-3be809996ec5': { min: 40000, max: 40000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Professor
  'a0b7fdd3-e243-4edb-839e-61cfb69132a4': { min: 40000, max: 40000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Professor
  '5815849a-c066-4ab7-acee-4f7aaf01d670': { min: 40000, max: 40000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Professor
  'b88c71a7-169c-40e5-950e-fd70be5f50f8': { min: 40000, max: 40000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Professor
  '008bd3e7-c83c-4690-92a8-16f9a19f9395': { min: 40000, max: 40000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Professor
  '2eaf5fe8-80e4-4456-a0d2-e9dc806ce7ce': { min: 40000, max: 40000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Professor - English
  'd9210be9-05c6-4e06-b01c-2febce6e93f2': { min: 40000, max: 40000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Professor - Maths
  'bc96d082-fc3f-4676-9e57-3be1a61fba59': { min: 40000, max: 40000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Professor - Physics
  '59e182ec-9c98-4f37-8f48-4308705ee49b': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Aptitude Trainer
  'a9a458a7-0766-40b6-af7b-d4314cb529e1': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - Communication Trainer
  '0d382975-abc9-403c-99f7-0e498a649e0e': { min: 10000, max: 10000, basis: 'starting_basic' }, // JKKN College of Engineering and Technology - TUTOR - Engineering College
  '72304771-fd49-4752-a5c0-5c921eef85ce': { min: 24000, max: null, basis: 'starting_basic' }, // JKKN College of Nursing and Research - AP - Med Surg Nur - CNR - Asst Prof
  '8065e1e2-849a-41b7-a0fb-fe76ca93d913': { min: 24000, max: null, basis: 'starting_basic' }, // JKKN College of Nursing and Research - ASSISTANT PROFESSOR
  '478a4ca2-6e02-4e9e-b014-41de720b58dc': { min: 24000, max: null, basis: 'starting_basic' }, // JKKN College of Nursing and Research - Assistant Professor
  'f9897de4-88be-4c41-9d72-9d8b04039420': { min: 24000, max: null, basis: 'starting_basic' }, // JKKN College of Nursing and Research - Assistant Professor
  '37fe4f4e-ca3b-43c8-a7e5-cd44645423aa': { min: 24000, max: null, basis: 'starting_basic' }, // JKKN College of Nursing and Research - Assistant Professor
  '4ca89af8-ffae-4798-8930-140555b134d9': { min: 24000, max: null, basis: 'starting_basic' }, // JKKN College of Nursing and Research - Assistant Professor
  '98bbd977-d46d-42e5-9c7f-4680e6749525': { min: 32000, max: null, basis: 'starting_basic' }, // JKKN College of Nursing and Research - ASSOCIATE PROFESSOR
  '258f000c-312b-4881-bc38-536e6c1ba2d3': { min: 32000, max: null, basis: 'starting_basic' }, // JKKN College of Nursing and Research - Associate Professor
  'cb6af67c-1cd1-4f8c-812c-11a2a649e134': { min: 32000, max: null, basis: 'starting_basic' }, // JKKN College of Nursing and Research - Associate Professor
  'd0b3b9bf-6a54-4a27-8da0-5dbba61cf808': { min: 32000, max: null, basis: 'starting_basic' }, // JKKN College of Nursing and Research - Associate Professor
  '10e1d4d8-0bdd-48ea-931e-318e03fdb90e': { min: 32000, max: null, basis: 'starting_basic' }, // JKKN College of Nursing and Research - Associate Professor
  '7932bb42-889a-496f-ba4b-c5f53ec09fdd': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Nursing and Research - LAB ASSISSTANT
  'f8686e13-23a9-411c-90b8-0ce3eddd17d8': { min: 150000, max: 180000 }, // JKKN College of Nursing and Research - PRINCIPAL JKKN College of Nursing
  '385fc15c-6472-46a0-a546-31bde3a8c248': { min: 35000, max: 45000 }, // JKKN College of Nursing and Research - PROFESSOR
  '788290b9-58f0-4322-bab0-a12547348851': { min: 35000, max: 45000 }, // JKKN College of Nursing and Research - PROFESSOR
  '8f080564-2b25-453b-8be2-a44aa8190e33': { min: 35000, max: 45000 }, // JKKN College of Nursing and Research - PROFESSOR - NURSING - MED SURG NURSING
  '4801eb40-bd30-4b93-827d-c97cccf50a12': { min: 35000, max: 45000 }, // JKKN College of Nursing and Research - PROFESSOR MENTAL HEALTH NURSING
  '628cef45-48cc-406e-8d5b-9270ea34e007': { min: 35000, max: 45000 }, // JKKN College of Nursing and Research - Professor
  'e87d0d2f-c9ab-4d5c-9689-b17399996e10': { min: 35000, max: 45000 }, // JKKN College of Nursing and Research - Professor
  'd20a4490-ac3b-4211-8135-e02bbd9e6c07': { min: 16000, max: 16000, basis: 'starting_basic' }, // JKKN College of Nursing and Research - Nursing Tutor
  'df464f51-9a3e-4a09-9dc8-72fe322f1494': { min: 16000, max: 16000, basis: 'starting_basic' }, // JKKN College of Nursing and Research - TUTOR - NURSING COLLEGE
  'a02fd533-7f83-4b79-a419-bc56ae50369b': { min: 22500, max: 22500, basis: 'starting_basic' }, // JKKN College of Pharmacy - ASSISTANT PROFESSOR
  '46734f94-aae6-4616-af3c-70a08ba2fcec': { min: 22500, max: 22500, basis: 'starting_basic' }, // JKKN College of Pharmacy - ASSISTANT PROFESSOR
  '222b2b3a-9a3f-4460-875c-f0cb76b5f262': { min: 22500, max: 22500, basis: 'starting_basic' }, // JKKN College of Pharmacy - ASSISTANT PROFESSOR - Mathematician/Statician
  '0219fb62-1d99-4fb7-bd1a-52cb694d3c50': { min: 22500, max: 22500, basis: 'starting_basic' }, // JKKN College of Pharmacy - ASST PROF - PHARMACEUTICS - COP
  '812818a1-5b1d-4251-a894-467614c0c0f2': { min: 22500, max: 22500, basis: 'starting_basic' }, // JKKN College of Pharmacy - Assistant Professor
  'aa170133-d926-4235-9f61-13870ffbc53c': { min: 22500, max: 22500, basis: 'starting_basic' }, // JKKN College of Pharmacy - Assistant Professor
  '5c59aa12-b97d-4ca6-809d-27c97372c89c': { min: 22500, max: 22500, basis: 'starting_basic' }, // JKKN College of Pharmacy - Assistant Professor
  'e4c75069-d7a5-4c8f-8a05-e3ff8a9837b5': { min: 22500, max: 22500, basis: 'starting_basic' }, // JKKN College of Pharmacy - Assistant Professor
  '2cc96833-caf5-4526-92a1-af8ec617d6bc': { min: 22500, max: 22500, basis: 'starting_basic' }, // JKKN College of Pharmacy - Assistant Professor
  'a3015294-2364-4cfa-9067-5367ed7d3297': { min: 22500, max: 22500, basis: 'starting_basic' }, // JKKN College of Pharmacy - Assistant Professor -Pharmacognosy
  'c56a0419-b2cf-45ec-8fae-80b09ec8d567': { min: 22500, max: 22500, basis: 'starting_basic' }, // JKKN College of Pharmacy - Asst Prof - PHARMA CHEMISTRY & ANALYSIS - COP
  '814a875f-ea5c-466a-b639-a34b9efc7c7e': { min: 22500, max: 22500, basis: 'starting_basic' }, // JKKN College of Pharmacy - Asst Prof - PHARMACOLOGY - COP
  '11cb8b06-d61e-499c-a16b-c07276f82cf5': { min: 32000, max: 35000 }, // JKKN College of Pharmacy - ASSOCIATE PROFESSOR
  'cf49e0b9-9928-42d4-8d3d-6032696ca223': { min: 32000, max: 35000 }, // JKKN College of Pharmacy - ASSOCIATE PROFESSOR
  '1c96e71a-c14f-49bf-8fff-bbb59d4ee524': { min: 32000, max: 35000 }, // JKKN College of Pharmacy - ASSOCIATE PROFESSOR
  'ab31b382-86dc-4177-ac3f-fd8fbff44ee8': { min: 32000, max: 35000 }, // JKKN College of Pharmacy - ASSOCIATE PROFESSOR
  'b07eb0e4-6807-426f-a569-82595a38d1cf': { min: 32000, max: 35000 }, // JKKN College of Pharmacy - Associate Professor
  '48632721-9fd2-4204-b34e-99626896a170': { min: 32000, max: 35000 }, // JKKN College of Pharmacy - Associate Professor
  '6b9f78f4-e267-4ef1-8ff8-a7f083896960': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Pharmacy - COMPUTER TECHNICIAN/ASSISTANT
  '5e36c961-b685-4618-8908-a0d4be83c8ab': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Pharmacy - LAB ASSISSTANT-PHARMACY
  '42640922-9446-408f-8dfc-f17d22a74514': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Pharmacy - Lab Technician/Research Assistant
  '0702584a-10a2-4026-93cd-09c01180a23f': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN College of Pharmacy - ASSISTANT LIBRARIAN
  '263e0862-5657-45a9-ae44-dedee4049e2d': { min: 8000, max: 8000, basis: 'starting_basic' }, // JKKN College of Pharmacy - LIBRARY ATTENDER
  'f9d482fd-139e-4e65-bc6a-ee8349bd6bda': { min: 18000, max: 18000, basis: 'starting_basic' }, // JKKN College of Pharmacy - Librarian
  'e00d8484-af32-4e21-9b53-d048d95c6ad7': { min: 150000, max: 180000 }, // JKKN College of Pharmacy - PRINCIPAL JKKN College of Pharmacy
  '41c462d5-8708-4120-b94c-25ceb6e2b78f': { min: 32000, max: 35000 }, // JKKN College of Pharmacy - ASSOCITATE PROFESSOR
  '554fcc1f-bc66-47cf-817e-0add5532bb09': { min: 35000, max: 45000 }, // JKKN College of Pharmacy - PROFESSOR
  'cfcf07bb-ddb2-4466-b8d6-031b0a09ac2e': { min: 35000, max: 45000 }, // JKKN College of Pharmacy - PROFESSOR
  'f8ae6c0a-c043-48f3-802f-d16a576fd037': { min: 35000, max: 45000 }, // JKKN College of Pharmacy - PROFESSOR
  'a01ed297-e241-41ae-81fb-29c11dfaf67b': { min: 35000, max: 45000 }, // JKKN College of Pharmacy - PROFESSOR
  'e457a621-2932-46f4-a2f4-580a075ca90f': { min: 35000, max: 45000 }, // JKKN College of Pharmacy - PROFESSOR
  '6279f39d-2905-4c8d-a140-902be29a69c5': { min: 35000, max: 45000 }, // JKKN College of Pharmacy - PROFESSOR - PHARMACEUTICAL CHEMISTRY
  '90b700b4-eb0e-4676-ad43-8ae7c6670eae': { min: 35000, max: 45000 }, // JKKN College of Pharmacy - PROFESSOR - PHARMACEUTICS
  'f14ac7fe-4f97-450e-9995-37541755e8be': { min: 35000, max: 45000 }, // JKKN College of Pharmacy - Professor
  'a8618892-966c-4479-b794-382d9179a161': { min: 35000, max: 45000 }, // JKKN College of Pharmacy - Professor
  '33c8f21c-8193-48ee-839a-25cf21a844a8': { min: 35000, max: 45000 }, // JKKN College of Pharmacy - Professor
  '7cbc03e2-c69e-466e-8451-5336874e4096': { min: 35000, max: 45000 }, // JKKN College of Pharmacy - Professor-Mathematician/Statician
  '4c442912-1dc3-45f7-83f1-572a35e45031': { min: 10000, max: 10000, basis: 'starting_basic' }, // JKKN College of Pharmacy - TUTOR
  '7d185519-484a-441c-8777-bfcb5d278c80': { min: 10000, max: 10000, basis: 'starting_basic' }, // JKKN College of Pharmacy - TUTOR
  '195b0eb2-c8fe-48ce-bc05-c1812c4e4e66': { min: 10000, max: 10000, basis: 'starting_basic' }, // JKKN College of Pharmacy - TUTOR - COP
  '80a8c4c4-04e3-4857-bab4-9147574f8016': { min: 10000, max: 10000, basis: 'starting_basic' }, // JKKN College of Pharmacy - TUTOR - Mathematician/Statician
  '3c05d279-7c03-4494-94a1-2b87f2e1190c': { min: 10000, max: 10000, basis: 'starting_basic' }, // JKKN College of Pharmacy - Tutor
  '887d8eff-b51d-4ceb-b8de-5bb99d9cae2c': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - AP - DCH - Oral Medicine - Dental
  '1d146ba6-6513-4d3c-aa0f-bdb8a9b88580': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - ASSOCIATE PROFESSOR
  'd68c9ec7-a823-4111-a498-bf4c4c0dc9d1': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Chair Mechanic
  '1454f6d0-5e5b-4b4a-abc1-0074565fdf3f': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Dental Mechanic
  '2d7d61e4-28de-4783-b9c7-4577d1e40ec5': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Pharmacist
  '0f200856-ea7b-49cf-9ad1-c5ae9f677456': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Surgery Attender
  '8d90aace-dc6a-444d-9050-cd4dda740839': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Ceramic Technician
  '937b706c-b844-4bd9-9e31-3de91ac23171': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - LAB ASSISSTANT
  'f8a1bd11-1395-497d-9cac-256b6fa405ac': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Lab technician
  '2fd03186-537a-4a4f-89f1-3b75797e3e73': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Senior Librarian
  'b59fe570-5b6f-43b8-a7e2-79f2dd5b8f6e': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Camp Officer
  '2fbcd127-10dc-4427-8fee-7633f8956ef8': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Hospital Manager
  '4012cc9d-d3ef-466b-b2a2-fa1dd1e0c8e9': { min: 170000, max: 210000 }, // JKKN Dental College and Hospital - PRINCIPAL JKKN Dental College & Hospital
  'aaa6bf61-102f-412f-81fe-733a4cc81636': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - PROF - DCH - Oral Pathology - Professor
  'dff7f886-0876-4125-97b3-e33329223f93': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROF - DCH - PERIODONTICS
  'f1e64517-13bd-4cab-a2ed-aad779060e2e': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFEESOR
  'eaab4566-1076-4f36-b122-878738ec17e9': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  'b80503e8-31d2-4850-a0b5-544846efbe23': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  '0bf8cb8d-accf-4a5b-8bbb-7bc72b10cc09': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  'fda79c1e-bc8d-488f-815d-727c007c6cff': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  'f16563ee-0eb2-462c-a3db-09b0c61aa589': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  '7d55bef2-c242-41a2-9763-fdb00a9e3937': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  '36d3af97-f9d2-4f90-835d-882e3f98a371': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  '75ec4041-0828-484b-92cf-afbfb6274d51': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  '7629bc8c-e92c-434f-9d6c-51cb0484e609': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  'edf2ac60-a220-4170-b463-2ec204a1af99': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  'a1d836d2-7813-4933-b5e0-130301ef3b45': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  '20e7ce2e-fe79-4528-aa18-9a7d7a17f74b': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  '7c9e6eb7-a0ea-4875-81ff-d7c93af55e13': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  '9e771349-41ea-4278-9564-ada02befd5a0': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  'fc5d4df1-5dc2-437f-ab4e-c6f876f0e89b': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  '489e113c-a4ad-499b-8eba-41628e95c0e9': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  'b89df1b2-a9ae-4557-9897-f3b2b3dd139e': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR
  'a67bc71f-ce9e-403b-a0bd-97bc12cbb8b8': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR - Anatomy - DCH/AHS
  'fbf0398f-172f-473a-96ae-43071df9f134': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR - ORTHO
  'd92ddcf4-52b7-44da-9a87-ef03855289b3': { min: 70000, max: 100000 }, // JKKN Dental College and Hospital - PROFESSOR - Pharmacology - DENTAL
  '19832856-8538-4674-b1e7-fdf9ec0bc88e': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  'f802a4eb-af03-4079-91df-b5e3bc1c1de2': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  '6b9727b5-f565-4e34-8b6e-ebc9df310267': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  'b00399d5-22c3-4adf-9384-8c70d63bd00e': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  'db51f0ce-9fd6-4812-a1e7-f0c16470f7e8': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  '272aeb20-e2a8-4f74-91f2-47ea31a660ef': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  '62cbe67d-7c70-4b9f-8ca9-792ab1308523': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  '2401a14f-ea8a-4872-b06a-c23f4521662c': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  '53f9beae-dc8f-4f3b-8c5d-915d381f962f': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  '38f4636e-09f0-4d5d-8043-e22976a0385e': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  'b6bf3d4e-b5cb-4a31-b041-a7f9235c042c': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  '32210a7e-a559-429f-bebf-2ad5a164dac6': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  'baab6c09-6919-4203-817f-0f9c2107b668': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  'b9c4b83e-f971-4a67-a527-f722b6a20722': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  '9c6bcf84-0882-4ed2-969b-51b8e6b12e6d': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  '24649dfe-36b9-450f-a12a-4694c384d526': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  '50601236-4f87-4a3f-9d3b-1a4fc8adc8ca': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER
  'c7d0b74e-4d41-4d97-aa77-75523f359643': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER - ORAL PATHOLOGY - DCH
  '7465d767-ded5-4b79-a86e-4662e37ff846': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER - ORTHODONTICES - DCH
  '2a91508c-1165-4ec5-adb3-bb4a4f87fa48': { min: 60000, max: 70000 }, // JKKN Dental College and Hospital - READER - PHD - DCH
  '22da9942-82ea-4747-bc8a-94f55982bbbe': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - LECTURER with MBBS
  '1a918e67-15c1-4087-8dd0-37b281835806': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  '5bcbcf8a-76f1-4377-bb5a-e01f520b6b9c': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  '24d038f9-2f72-446b-9013-446d5d5e0d02': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  '15d14b18-c136-4988-934d-419fbab80fe7': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  '71c73e26-530c-426c-8210-1eccc681e71d': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  '35c4fe63-2144-49c7-92a7-d3f56cbfb576': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  '88d4c53c-0e97-411e-99e2-2c5f1f183159': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  'bb77a20f-0493-4b8e-8946-6c017a3a241f': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  '2bc1c2ca-4199-4310-8082-5fc34b2eb4f8': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  'e9db6cf9-d1f3-4dec-9069-6eeb05935eba': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  '8eda333f-ce53-453b-8b0c-694ba173b31e': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  '400bbb11-7509-45a2-9d2a-8a50a1ccc256': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  '557fecda-c141-4c6d-a128-a586b0c33401': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  'c46f725d-e605-4c70-9e74-d251598eb873': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER
  'bea41e71-4efa-4dfb-91ac-c4bfb81fc83a': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SENIOR LECTURER- PEDIATRIC
  '1f957930-e97a-4b5c-a7eb-b7dff68d4c80': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - SR. LECTURER - PHYSIOLOGY - DC
  '4e195be0-51f5-4448-9d01-fad75bafd9c6': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Senior Lecturer
  'fa163286-4fbd-45cd-8c8b-0455e1cc8190': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Senior Lecturer - PERIODONTICS - DCH
  '9ab22919-aad0-47fb-a3fa-4d71952b4b8b': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Senior Lecturer - PHD - DCH
  '94bd65fc-2934-4213-9543-80d7acdcfd5f': { min: 30000, max: 35000 }, // JKKN Dental College and Hospital - Senior Lecturer - PROSTHO - DCH
  '1b810e2e-dbc5-4a0b-bae3-fd7c76bfe241': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN Dental College and Hospital - TUTOR - DCH
  'bf2f9721-03d2-4647-bef2-8dbc2714ac68': { min: 15000, max: 15000, basis: 'starting_basic' }, // JKKN Dental College and Hospital - Tutor
  'e620cb12-ad1f-4317-a080-1b6e7fdae9b4': { min: 15000, max: 20000 }, // JKKN Main Office - Accountant
  'ace2ad92-c748-4c51-8567-a1acad9db946': { min: 15000, max: 20000 }, // JKKN Main Office - Cashier
  '40ab07bf-3cb1-48b0-867e-0d13da76fa41': { min: 15000, max: 20000 }, // JKKN Main Office - Hostel Warden
  '2bb63c76-7b32-49a0-8347-db12bbb1fa21': { min: 15000, max: 20000 }, // JKKN Main Office - House Keeping Supervisor Ladies Hostel
  'e734408f-0151-4f07-9b32-f88dac84b8fc': { min: 15000, max: 20000 }, // JKKN Main Office - Store Keeper - Pharmacy
  '1a46f0b2-f766-4ce2-b1d6-740343d2142a': { min: 15000, max: 20000 }, // JKKN Main Office - Stores Incharge
  '8a9c4a78-5b56-47d9-8924-ad3e6d1b03dd': { min: 15000, max: 20000 }, // JKKN Main Office - CCTV MONITORING OPERATOR - Main Office
  '20c7fe36-5279-4d8a-aa52-8d0e48dd4501': { min: 25000, max: 30000 }, // JKKN Main Office - Chief Branding and Engagement Officer
  '549128e1-13f0-4591-a002-6013b2d692fe': { min: 50000, max: 60000 }, // JKKN Main Office - Chief Executive Officer_JKKN Institutions
  '4a317efd-bee5-45c4-ad9c-bd29c86b6c8b': { min: 50000, max: 60000 }, // JKKN Main Office - Chief Executive Officer_Nattraja Incubation Forum
  '51d588a8-a4b2-4c0a-bc6c-ad49fd797308': { min: 50000, max: 60000 }, // JKKN Main Office - Chief Operations Officer (COO)
  '99201eb0-febf-49cf-a498-015e9092a768': { min: 50000, max: 60000 }, // JKKN Main Office - Chief People & Transformation Officer_JKKN
  '33d85d6d-c763-40d0-b02f-b9cb54bd2d5b': { min: 15000, max: 20000 }, // JKKN Main Office - Civil Supervisor
  '5cbcd8a1-e349-4364-91f1-c8e0e5aecc61': { min: 35000, max: 45000 }, // JKKN Main Office - Digital Transformation Officer (DTO)
  '9cca30c7-a7d7-4fe1-9edb-3d08a73c33cf': { min: 25000, max: 35000 }, // JKKN Main Office - Human Resources Coordinator(HR)
  '52b90fde-1bde-467c-983e-998be6fee8a1': { min: 25000, max: 30000 }, // JKKN Main Office - Marketing Coordinator
  '9d1dc134-8c30-4989-94b8-31fdb58e79ef': { min: 25000, max: 30000 }, // JKKN Main Office - Marketing Manager
  'd183a41b-420f-4c36-956f-6baa162516c4': { min: 12000, max: 15000 }, // JKKN Main Office - Office Staff
  '8c0159cc-9b0a-4235-9978-38ed426cecda': { min: 20000, max: 25000 }, // JKKN Main Office - PLACEMENT OFFICER & CORPORATE RELATIONS
  '30abc6f8-1b74-467c-b87c-68e714b898bc': { min: 20000, max: 25000 }, // JKKN Main Office - Solutions Manager
  '0cf39b09-7f80-4ff0-bf77-37c75641b957': { min: 20000, max: 25000 }, // JKKN Main Office - Sytem Administrator
  '2ce991ac-ce0e-4746-bf56-1ebd0290d809': { min: 25000, max: 30000 }, // JKKN Main Office - Physical Educator
  'b12c968a-3d0d-4dd3-aa0e-e938d25f5c86': { min: 20000, max: 25000 }, // JKKN Main Office - Tennis Coach
  '2dad4ffa-be69-4dc5-ae77-0586a37dd10d': { min: 35000, max: 45000 }, // JKKN Main Office - Professor -Department of Pharmaceutics
  'b5ba367e-b765-4e80-a0e2-25847f538ecd': { min: 35000, max: 45000 }, // JKKN Main Office - Professor of Practice
}
