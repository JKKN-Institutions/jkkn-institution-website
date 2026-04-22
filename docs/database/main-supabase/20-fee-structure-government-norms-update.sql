-- ============================================
-- Fee Structure — Government Quota → "As per Government Norms"
-- ============================================
-- Purpose: Replace specific Government Quota amounts with
--          "As per Government Norms" for the Engineering, Dental,
--          Pharmacy, and Nursing tabs on /fee-structure. These four
--          programs accept students through government counselling
--          (TNEA, TN MCC, Paramedical/Nursing boards) where the
--          government-quota fee is regulated and published by the
--          state, not fixed by JKKN. Showing a specific rupee amount
--          in this column is misleading to the public — it implies
--          the college sets the fee. The Arts & Science, Education,
--          and Allied Health tabs already follow this pattern.
--
-- Created:  2026-04-20
-- Target:   cms_page_blocks row id 'd951788a-74ad-4fad-badf-beb960ecfd8e'
--           (the TabsBlock on page slug 'fee-structure')
-- Scope:    tabs[0]=Engineering & Tech, tabs[3]=Dental,
--           tabs[4]=Pharmacy, tabs[5]=Nursing
--           Management Quota columns and Remarks are preserved verbatim.
-- Dependencies: cms_pages row slug='fee-structure',
--               cms_page_blocks component_name='TabsBlock'.
-- Idempotent: Yes — re-running replaces with the same literal HTML.
-- ============================================

-- Engineering & Tech (tabs[0])
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{tabs,0,content}',
  to_jsonb($eng$<h3>Engineering UG (B.E / B.Tech — 4 Years)</h3><table><thead><tr><th>Program</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>B.E. CSE</td><td>As per Government Norms</td><td>₹80,000</td><td>Per year</td></tr><tr><td>B.Tech IT</td><td>As per Government Norms</td><td>₹80,000</td><td>Per year</td></tr><tr><td>B.E. ECE</td><td>As per Government Norms</td><td>₹70,000</td><td>Per year</td></tr><tr><td>B.E. EEE</td><td>As per Government Norms</td><td>₹45,000</td><td>Per year</td></tr><tr><td>B.E. Mechanical</td><td>As per Government Norms</td><td>₹45,000</td><td>Per year</td></tr></tbody></table><h3>Engineering Lateral Entry (2nd year direct)</h3><table><thead><tr><th>Program</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>B.E. CSE</td><td>As per Government Norms</td><td>₹60,000</td><td>Per year</td></tr><tr><td>B.Tech IT</td><td>As per Government Norms</td><td>₹60,000</td><td>Per year</td></tr><tr><td>B.E. ECE</td><td>As per Government Norms</td><td>₹60,000</td><td>Per year</td></tr><tr><td>B.E. EEE</td><td>As per Government Norms</td><td>₹60,000</td><td>Per year</td></tr><tr><td>B.E. Mechanical</td><td>As per Government Norms</td><td>₹60,000</td><td>Per year</td></tr></tbody></table><h3>Engineering PG</h3><table><thead><tr><th>Program</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>MBA</td><td>As per Government Norms</td><td>₹65,000</td><td>Per year</td></tr><tr><td>M.E. CSE</td><td>As per Government Norms</td><td>₹30,000</td><td>Per year</td></tr></tbody></table>$eng$::text),
  false
)
WHERE id = 'd951788a-74ad-4fad-badf-beb960ecfd8e';

-- Dental (tabs[3])
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{tabs,3,content}',
  to_jsonb($den$<h3>Dental UG (BDS — 5 Years)</h3><table><thead><tr><th>Program</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>BDS — With Hostel &amp; Instruments</td><td>As per Government Norms</td><td>₹5,50,000</td><td>Per year</td></tr><tr><td>BDS — Dayscholar with Instruments</td><td>As per Government Norms</td><td>₹4,50,000</td><td>Per year</td></tr></tbody></table><h3>Dental PG (MDS — 3 Years)</h3><table><thead><tr><th>Specialisation</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>Orthodontics</td><td>As per Government Norms</td><td>₹8,50,000</td><td>Per year</td></tr><tr><td>Endodontics</td><td>As per Government Norms</td><td>₹8,50,000</td><td>Per year</td></tr><tr><td>Prosthodontics</td><td>As per Government Norms</td><td>₹8,50,000</td><td>Per year</td></tr><tr><td>Periodontics</td><td>As per Government Norms</td><td>₹8,50,000</td><td>Per year</td></tr><tr><td>Oral Medicine</td><td>As per Government Norms</td><td>₹8,50,000</td><td>Per year</td></tr></tbody></table>$den$::text),
  false
)
WHERE id = 'd951788a-74ad-4fad-badf-beb960ecfd8e';

-- Pharmacy (tabs[4])
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{tabs,4,content}',
  to_jsonb($pha$<h3>Bachelor of Pharmacy (B.Pharm — 4 Years)</h3><table><thead><tr><th>Program</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>B.Pharm</td><td>As per Government Norms</td><td>₹1,40,000</td><td>Per year</td></tr><tr><td>B.Pharm Lateral Entry</td><td>As per Government Norms</td><td>₹1,00,000</td><td>Per year</td></tr></tbody></table><h3>Doctor of Pharmacy (Pharm.D — 6 Years)</h3><table><thead><tr><th>Program</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>Pharm.D — Dayscholar</td><td>As per Government Norms</td><td>₹2,75,000</td><td>Per year</td></tr><tr><td>Pharm.D — With Hostel</td><td>As per Government Norms</td><td>₹3,25,000</td><td>Per year</td></tr><tr><td>Pharm.D (PB) — Dayscholar</td><td>As per Government Norms</td><td>₹70,000</td><td>Post-Baccalaureate</td></tr><tr><td>Pharm.D (PB) — With Hostel</td><td>As per Government Norms</td><td>₹1,50,000</td><td>Post-Baccalaureate</td></tr></tbody></table><h3>Pharmacy PG (M.Pharm — 2 Years)</h3><table><thead><tr><th>Specialisation</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>Pharmaceutics</td><td>As per Government Norms</td><td>₹75,000</td><td>Per year</td></tr><tr><td>Pharmaceutical Chemistry</td><td>As per Government Norms</td><td>₹75,000</td><td>Per year</td></tr><tr><td>Pharmacology</td><td>As per Government Norms</td><td>₹75,000</td><td>Per year</td></tr><tr><td>Pharmaceutical Analysis</td><td>As per Government Norms</td><td>₹75,000</td><td>Per year</td></tr><tr><td>Pharmacy Practice</td><td>As per Government Norms</td><td>₹75,000</td><td>Per year</td></tr></tbody></table>$pha$::text),
  false
)
WHERE id = 'd951788a-74ad-4fad-badf-beb960ecfd8e';

-- Nursing (tabs[5])
UPDATE cms_page_blocks
SET props = jsonb_set(
  props,
  '{tabs,5,content}',
  to_jsonb($nur$<p><em>Fees include uniform, hospital training and nursing kit where applicable.</em></p><h3>Nursing UG</h3><table><thead><tr><th>Program</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>B.Sc. Nursing — Female</td><td>As per Government Norms</td><td>₹1,50,000</td><td>Incl. uniform, training &amp; kit</td></tr><tr><td>B.Sc. Nursing — Male</td><td>As per Government Norms</td><td>₹1,75,000</td><td>Incl. uniform, training &amp; kit</td></tr><tr><td>Post Basic B.Sc. Nursing (PBBSc N)</td><td>As per Government Norms</td><td>₹65,000</td><td>Per year</td></tr></tbody></table><h3>Nursing PG (M.Sc. Nursing — 2 Years)</h3><table><thead><tr><th>Specialisation</th><th>Government Quota</th><th>Management Quota</th><th>Remarks</th></tr></thead><tbody><tr><td>Medical Surgical Nursing</td><td>As per Government Norms</td><td>₹1,00,000</td><td>Per year</td></tr><tr><td>Obstetrics &amp; Gynaecology</td><td>As per Government Norms</td><td>₹80,000</td><td>Per year</td></tr><tr><td>Psychiatric Nursing</td><td>As per Government Norms</td><td>₹75,000</td><td>Per year</td></tr><tr><td>Paediatric Nursing</td><td>As per Government Norms</td><td>₹75,000</td><td>Per year</td></tr><tr><td>Community Health Nursing</td><td>As per Government Norms</td><td>₹75,000</td><td>Per year</td></tr></tbody></table>$nur$::text),
  false
)
WHERE id = 'd951788a-74ad-4fad-badf-beb960ecfd8e';

-- End of Fee Structure — Government Quota → "As per Government Norms"
-- ============================================
