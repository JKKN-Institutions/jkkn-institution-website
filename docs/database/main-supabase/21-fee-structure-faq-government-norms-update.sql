-- ============================================
-- Fee Structure FAQ — Government Quota → "As per Government Norms"
-- ============================================
-- Purpose: Remove specific Government Quota (GQ) fee amounts from the
--          FAQ answers on /fee-structure for Engineering, Dental,
--          Pharmacy, and Nursing programs. Keep Management Quota (MQ)
--          amounts — those are set by JKKN and are public. Route all
--          GQ references to "As per Government Norms" (regulated by
--          TN Government / TNEA / TN MCC / PCI / TN Nursing &
--          Paramedical Selection Committee). Also broadens FAQ 6
--          ("Why are some Government Quota fees shown as 'As per
--          Government Norms'?") to cover ALL programs — previously it
--          only named Arts & Science, Education, Allied Health, which
--          is now inconsistent with the updated tables.
--
-- Created:  2026-04-20
-- Target:   cms_page_blocks row id 'fd10c88a-7692-4e13-a0bd-7af2278ef7dd'
--           (the FAQSectionBlock on page slug 'fee-structure')
-- Scope:    faqs[0]=Engineering, faqs[1]=Dental, faqs[2]=Pharmacy,
--           faqs[3]=Nursing, faqs[6]=Why "As per Government Norms"
--           Untouched: faqs[4] Allied Health, faqs[5] Arts & Science,
--                      faqs[7] Payment options, faqs[8] Hidden costs.
-- Depends on: 20-fee-structure-government-norms-update.sql
-- Idempotent: Yes — re-running replaces with the same literal text.
-- ============================================

-- FAQ 0 — Engineering
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{faqs,0,answer}',
  to_jsonb($ans$Engineering UG Management Quota annual fees for 2025-26 — CSE: ₹80,000; B.Tech IT: ₹80,000; ECE: ₹70,000; EEE: ₹45,000; Mechanical: ₹45,000. Lateral Entry Management Quota: ₹60,000 per year across all branches. Government Quota fees are charged as per Government Norms — regulated by TNEA and the Tamil Nadu Government, and published during each admission cycle. Fees exclude hostel, mess and transport.$ans$::text),
  false
)
WHERE id = 'fd10c88a-7692-4e13-a0bd-7af2278ef7dd';

-- FAQ 1 — Dental
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{faqs,1,answer}',
  to_jsonb($ans$BDS (5 years) with hostel & instruments — Management Quota: ₹5,50,000 per year. BDS dayscholar with instruments — Management Quota: ₹4,50,000 per year. MDS specialisations (Orthodontics, Endodontics, Prosthodontics, Periodontics, Oral Medicine) — Management Quota: ₹8,50,000 per year, all 5 specialities priced uniformly. Government Quota fees (via TN MCC counselling) are charged as per Government Norms — regulated and published by the Tamil Nadu Government each admission cycle.$ans$::text),
  false
)
WHERE id = 'fd10c88a-7692-4e13-a0bd-7af2278ef7dd';

-- FAQ 2 — Pharmacy
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{faqs,2,answer}',
  to_jsonb($ans$B.Pharm Management Quota: ₹1,40,000 per year. B.Pharm Lateral Entry Management Quota: ₹1,00,000. Pharm.D dayscholar Management Quota: ₹2,75,000; with hostel: ₹3,25,000. Pharm.D (Post-Baccalaureate) dayscholar Management Quota: ₹70,000; with hostel: ₹1,50,000. M.Pharm specialisations (Pharmaceutics, Chemistry, Pharmacology, Analysis, Practice) — Management Quota: ₹75,000 per year each. Government Quota fees are charged as per Government Norms — regulated by the Pharmacy Council of India and Tamil Nadu state authorities during counselling.$ans$::text),
  false
)
WHERE id = 'fd10c88a-7692-4e13-a0bd-7af2278ef7dd';

-- FAQ 3 — Nursing
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{faqs,3,answer}',
  to_jsonb($ans$B.Sc Nursing Female — Management Quota: ₹1,50,000 per year. B.Sc Nursing Male — Management Quota: ₹1,75,000 per year (both include uniform, hospital training and nursing kit). Post Basic B.Sc Nursing — Management Quota: ₹65,000. M.Sc Nursing Management Quota — Medical Surgical: ₹1,00,000; Obstetrics & Gynaecology: ₹80,000; Psychiatric, Paediatric, Community Health: ₹75,000 each. Government Quota fees are charged as per Government Norms — published by the Tamil Nadu Nursing / Paramedical Selection Committee during counselling.$ans$::text),
  false
)
WHERE id = 'fd10c88a-7692-4e13-a0bd-7af2278ef7dd';

-- FAQ 6 — Why Government Quota is shown as "As per Government Norms" (broadened to cover all programs)
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{faqs,6,answer}',
  to_jsonb($ans$All Government Quota fees at JKKN — across Engineering, Dental, Pharmacy, Nursing, Arts & Science, Education and Allied Health Sciences — are regulated and periodically revised by the Tamil Nadu Government and the respective regulatory bodies (TNEA, TN MCC, Pharmacy Council of India, TN Nursing & Paramedical Selection Committee, TN Directorate of Medical Education). These fees vary by community category and are finalised during counselling, so JKKN does not publish a fixed figure. We adhere fully to TN state fee regulations and publish the exact applicable Government Quota amount to each admitted candidate during every academic year's admission cycle.$ans$::text),
  false
)
WHERE id = 'fd10c88a-7692-4e13-a0bd-7af2278ef7dd';

-- End of Fee Structure FAQ — Government Quota → "As per Government Norms"
-- ============================================
