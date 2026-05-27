# Old Site URL Audit — Full Tracking Document

**Domain:** jkkn.ac.in (Main Institution)
**Date:** 2026-05-27
**Total URLs Audited:** 281
**Source:** Google Search Console crawl data (Main Institutions.xlsx)

---

## Summary Dashboard (Updated 2026-05-27)

| Status | Count | Handler | Who |
|--------|-------|---------|-----|
| 410 Gone (spam/gambling) | 56 | middleware.ts SPAM_REGEX | Developer (DONE) |
| 410 Gone (WP author pages) | 17 | middleware.ts WP_ARCHIVE_REGEX | Developer (DONE) |
| 410 Gone (WP tag pages) | 36 | middleware.ts WP_ARCHIVE_REGEX | Developer (DONE) |
| 410 Gone (WP category pages) | 9 | middleware.ts WP_ARCHIVE_REGEX | Developer (DONE) |
| 410 Gone (WP account pages) | 3 | middleware.ts WP_ARCHIVE_REGEX | Developer (DONE) |
| 410 Gone (WP system/feed) | 6 | middleware.ts WP_SYSTEM/FEED | Developer (DONE) |
| 410 Gone (junk/test pages) | 13 | middleware.ts JUNK_URLS | Developer (DONE) |
| 301 → /blog (event/blog posts) | 47 | middleware.ts OLD_BLOG_POSTS | Developer (DONE) |
| 301 → specific pages (new) | 37 | next.config.ts redirects | Developer (DONE) |
| 301 → /blog (pre-existing) | 3 | next.config.ts (updated from /) | Developer (DONE) |
| 301 → section pages (pre-existing) | 4 | next.config.ts (already existed) | Developer (DONE) |
| robots.txt blocked | 4 patterns | robots-txt.config.ts | Developer (DONE) |
| CMS catch-all (facility pages) | 13 | [...slug]/page.tsx | Served by CMS or 404 |
| CMS catch-all (Unicode/broken) | 5 | [...slug]/page.tsx | Auto-404 (no action) |
| Same slug (already works) | 1 | Existing route | No action needed |
| **TOTAL** | **281** | **All handled** | |

**Key change (v2):** All 47 event/blog pages now redirect to `/blog` instead of being left
for CMS catch-all. Blog content URLs that previously redirected to homepage (`/`) now
redirect to `/blog`. Facility pages (digital-campus, seminor-hall, etc.) removed from
homepage redirects — they now go to CMS catch-all where they either serve the CMS page
or return a proper 404.

---

## PART 1: DEVELOPER WORK (COMPLETED)

### A. Files Created/Modified

| File | Action | Lines Changed |
|------|--------|---------------|
| `middleware.ts` | Created | 108 lines (new file) |
| `next.config.ts` | Modified | +220 lines (43 new redirects) |
| `lib/config/robots-txt.config.ts` | Modified | +16 lines (4 new Disallow rules) |
| `docs/seo/google-disavow-spam-urls.txt` | Created | Disavow template |
| `docs/seo/old-site-url-audit-tracking.md` | Created | This document |

### B. Middleware — 410 Gone Responses (131 URLs)

These URLs now return HTTP 410 (permanently removed) to accelerate Google de-indexing.

#### B1. Gambling/Betting Spam (56 URLs) — SPAM_REGEX

| # | Old URL | Spam Type |
|---|---------|-----------|
| 1 | /dafabet-mobile-app-2025-download-the-latest-5 | Dafabet |
| 2 | /batery-bet-app-review-download-app-claim-inr-25000-58 | Batery |
| 3 | /batery-casino-sports-betting-india-review-2025-23 | Batery |
| 4 | /types-of-batteries-and-cells-and-their-86 | Spam inject |
| 5 | /ai-process-consulting-the-new-engine-of-business-success?? | Spam inject |
| 6 | /download-megapari-app-for-android-and-ios-latest-13 | Megapari |
| 7 | /download-dafabet-app-for-ios-android-apk-in-16 | Dafabet |
| 8 | /megapari-casino-review-expert-player-ratings-2025-19 | Megapari |
| 9 | /megapari-review-how-to-bet-on-sport-in-bangladesh-8 | Megapari |
| 10 | /megapari-app-download-megapari-apk-for-android-ios-12 | Megapari |
| 11 | /megapari-registration-get-49-000-bonus-on-sign-up-34 | Megapari |
| 12 | /20bet-review-2025-bonus-promo-code-by-bet-experts-30 | 20Bet |
| 13 | /access-online-casino-for-irish-players-13 | Casino |
| 14 | /megapari-app-review-how-to-download-use-megapari-28 | Megapari |
| 15 | /megapari-bookmaker-and-online-casino-16 | Megapari |
| 16 | /unrivaled-gaming-experience-26 | Casino |
| 17 | /megapari-app-download-for-android-apk-and-ios-31 | Megapari |
| 18 | /batery-aviator-game-play-in-the-app-and-on-the-37 | Batery |
| 19 | /1xbit-review-top-crypto-gaming-platform-54 | 1xBit |
| 20 | /exceptional-casino-experience-in-india-45 | Casino |
| 21 | /available-deposit-and-withdrawal-options-on-22 | Gambling |
| 22 | /app-download-16 | Gambling app |
| 23 | /download-dafabet-app-apk-for-android-in-india-2025-19 | Dafabet |
| 24 | /dafabet-app-download-apk-login-india-9 | Dafabet |
| 25 | /download-helabet-app-for-android-apk-zambia-tz-10 | Helabet |
| 26 | /megapari-app-apk-download-india-15 | Megapari |
| 27 | /minecraft-beta-preview-1-20-70-21-24 | Spam inject |
| 28 | /win-in-real-time-with-megapari-on-ipl-2025-30 | Megapari |
| 29 | /megapari-promo-code-in-india-2025-get-up-to-39-000-22 | Megapari |
| 30 | /megapari-sign-up-offer-200-offered-bonus-october-10 | Megapari |
| 31 | /megapari-registration-get-49-000-bonus-on-sign-up-18 | Megapari |
| 32 | /megapari-affiliate-program-2025-10 | Megapari |
| 33 | /actual-link-to-download-on-ios-and-android-31 | Gambling app |
| 34 | /app-download-13 | Gambling app |
| 35 | /stake-bet-on-sports-casino-games-with-bitcoin-and-20 | Stake |
| 36 | /download-megapari-app-for-android-ios-in-india-22 | Megapari |
| 37 | /megapari-online-bookmaker-and-casino-200-bonus-and-16 | Megapari |
| 38 | /official-20bet-login-link-9-000-inr-welcome-bonus-25 | 20Bet |
| 39 | /stake-casino-review-stake-india-bonuses-and-15 | Stake |
| 40 | /download-megapari-app-for-android-apk-and-ios-2025-15 | Megapari |
| 41 | /megapari-app-download-apk-for-android-and-ios-free-11 | Megapari |
| 42 | /20bet-software-with-consider-to-android-apk-plus-15 | 20Bet |
| 43 | /how-to-download-dafabet-mobile-app-17 | Dafabet |
| 44 | /megapari-app-download-install-on-android-ios-in-45 | Megapari |
| 45 | /100-first-deposit-bonus-on-casino-entry-page-16 | Casino |
| 46 | /22bet-app-for-android-download-the-apk-from-27 | 22Bet |
| 47 | /stake-com-india-review-bonuses-withdrawals-real-or-13 | Stake |
| 48 | /best-betting-sites-in-india-top-20-oct-2025-goal-26 | Betting |
| 49 | /megapari-app-download-apk-bangladesh-10 | Megapari |
| 50 | /welcome-offer-games-9 | Gambling |
| 51 | /download-the-latest-version-of-20bet-app-in-49 | 20Bet |
| 52 | /megapari-app-download-for-android-ios-free-new-15 | Megapari |
| 53 | /megapari-app-apk-download-india-13 | Megapari |
| 54 | /20bet-app-download-for-android-ios-in-india-2025-22 | 20Bet |
| 55 | /stake-casino-review-bonuses-games-and-support-16 | Stake |
| 56 | /stake-online-casino-bonuses-and-promotions-62 | Stake |

#### B2. WordPress Author Pages (15 URLs) — WP_ARCHIVE_REGEX

| # | Old URL |
|---|---------|
| 1 | /author/muthazhahan/ |
| 2 | /author/muthazhahan/page/5/ |
| 3 | /author/muthazhahan/page/8/ |
| 4 | /author/muthazhahan/page/13/ |
| 5 | /author/muthazhahan/page/9/ |
| 6 | /author/muthazhahan/page/3/ |
| 7 | /author/muthazhahan/page/2 |
| 8 | /author/muthazhahan/?section=review |
| 9 | /author/ragulrj?section=review |
| 10 | /author/ragulrj/page/5/ |
| 11 | /author/ragulrj/page/2/ |
| 12 | /author/ragulrj/page/3 |
| 13 | /author/ragulrj/page/7/ |
| 14 | /author/ragulrj/page/4/ |
| 15 | /author/ragulrj/page/8/ |
| 16 | /author/renuka/?section=review |
| 17 | /author/renuka/feed/ |

#### B3. WordPress Tag Pages (30 URLs) — WP_ARCHIVE_REGEX

| # | Old URL |
|---|---------|
| 1 | /tag/best-school-erode |
| 2 | /tag/national-service-scheme |
| 3 | /tag/ai/ |
| 4 | /tag/jkkn-institution/ |
| 5 | /tag/aedp/ |
| 6 | /tag/paper-presentation/ |
| 7 | /tag/jkkn-arts-college |
| 8 | /tag/first-year-commencement-ceremony/ |
| 9 | /tag/national-integration-day/ |
| 10 | /tag/studentengagement |
| 11 | /tag/national-integration-day |
| 12 | /tag/jkkn-education |
| 13 | /tag/jkkn-education/ |
| 14 | /tag/freshers2023/ |
| 15 | /tag/best-arts-college/ |
| 16 | /tag/head-neck-oncology/ |
| 17 | /tag/best-nursing-college/ |
| 18 | /tag/best-engineering-college-namakkal/ |
| 19 | /tag/best-pharmacy-college-namakkal/ |
| 20 | /tag/failurelabs/ |
| 21 | /tag/jkkn-arts-college/ |
| 22 | /tag/jkkn-colleges/ |
| 23 | /tag/jkkn-college-of-allied-health-science/ |
| 24 | /tag/jkkn-dental/ |
| 25 | /tag/best-arts-college |
| 26 | /tag/engineering/ |
| 27 | /tag/jkkn-colleges |
| 28 | /tag/jkkn-engineering/ |
| 29 | /tag/best-b-ed-college/ |
| 30 | /tag/jkkn-pharmacy/ |
| 31 | /tag/alliedhealthsciences/ |
| 32 | /tag/best-engineering-college/ |
| 33 | /tag/jkkn/ |
| 34 | /tag/plastic-free-day-event/ |
| 35 | /tag/jkkn-nursing/ |
| 36 | /tag/corticobasal-implants/feed/ |

#### B4. WordPress Category Pages (8 URLs) — WP_ARCHIVE_REGEX

| # | Old URL |
|---|---------|
| 1 | /category/past-events/page/4/ |
| 2 | /category/past-events/ |
| 3 | /category/college-news/page/2/ |
| 4 | /category/college-news/ |
| 5 | /category/past-events/page/2 |
| 6 | /category/past-events/page/5/ |
| 7 | /category/college-news/page/3/ |
| 8 | /category/past-events/page/3/ |
| 9 | /category/announcement/ |

#### B5. WordPress Account Pages (2 URLs) — WP_ARCHIVE_REGEX

| # | Old URL |
|---|---------|
| 1 | /account/page/22/?redirect_to=https://jkkn.ac.in/news-and-events/?enroll-course=7443 |
| 2 | /account/?action=register |
| 3 | /account/page/13/?action=register |

#### B6. WordPress System & Feed Paths (6 URLs) — WP_SYSTEM/FEED_REGEX

| # | Old URL | Pattern |
|---|---------|---------|
| 1 | /wp-content/uploads/2023/08/Mobile-App-Manual.pdf | WP system |
| 2 | /wp-content/plugins/floating-button/vendors/fontawesome/css/fontawesome-all.min.css | WP system |
| 3 | /world-health-days/feed/ | Feed URL |
| 4 | /intellectual-property-rights-day-2/feed/ | Feed URL |
| 5 | /author/renuka/feed/ | Feed + Author |
| 6 | /tag/corticobasal-implants/feed/ | Feed + Tag |

#### B7. Junk/Test Pages (14 URLs) — JUNK_URLS Set

| # | Old URL | Reason |
|---|---------|--------|
| 1 | /;l | Typo URL |
| 2 | /__trashed-9__trashed | WordPress trash |
| 3 | /test-career-page | Test page |
| 4 | /test-careers | Test page |
| 5 | /test-3 | Test page |
| 6 | /test-latest | Test page |
| 7 | /psychometric-career-test | Removed feature |
| 8 | /info | Old WordPress page |
| 9 | /camu | Tool integration |
| 10 | /canva | Tool integration |
| 11 | /outlook | Tool integration |
| 12 | /excel | Tool integration |
| 13 | /access | Tool integration |

### C. 301 Redirects — Legitimate Page Migrations (43 new + 7 pre-existing)

#### C1. New Redirects Added (43 URLs)

| # | Old URL | New URL | Category |
|---|---------|---------|----------|
| 1 | /academics/programs/engineering | /courses-offered | Course |
| 2 | /allied-health-science-courses | /courses-offered | Course |
| 3 | /dental-nanotechnology-course | /courses-offered | Course |
| 4 | /institutions/nursing | /our-institutions | Institution |
| 5 | /our-institutions-old | /our-institutions | Institution |
| 6 | /jkkn-college-of-allied-health-science | /our-institutions | Institution |
| 7 | /jkkn-college-of-allied-health | /our-institutions | Institution |
| 8 | /jkkn-college-of-allied-health-sciences-7 | /our-institutions | Institution |
| 9 | /jkkn-college-of-allied-health-sciences-3 | /our-institutions | Institution |
| 10 | /sresakthimayeil-institute-of-nursing-and-research | /our-institutions | Institution |
| 11 | /alumni-of-jkkn-dental-college-and-hospital | /alumni | Institution |
| 12 | /academic-calendar | /others/academic-calendar | Calendar |
| 13 | /calendar | /others/academic-calendar | Calendar |
| 14 | /curricular-aspects | /iqac | Accreditation |
| 15 | /student-support-and-progression | /iqac | Accreditation |
| 16 | /governance-leadership-and-management | /iqac | Accreditation |
| 17 | /jkkn-dental-college-hospital-bds-mds-admissions-open-apply-now | /admissions | Admission |
| 18 | /jkkn-college-of-allied-health-science-bsc-allied-technology-admissions-open-apply-now | /admissions | Admission |
| 19 | /jkkn-college-of-arts-and-science-admissions-open-for-ug-courses-apply-now | /admissions | Admission |
| 20 | /jkkn-college-of-education-admissions-open-apply-now | /admissions | Admission |
| 21 | /jkkn-college-of-nursing-research-b-sc-nursingm-sc-p-b-b-sc-nursing-admissions-open-apply-now | /admissions | Admission |
| 22 | /jkkn-matriculation-higher-secondary-school-2023-2024-admissions-open-apply-now | /admissions | Admission |
| 23 | /nattraja-vidhyalya-2023-2024-admissions-open-apply-now | /admissions | Admission |
| 24 | /the-future-of-pharmacy-how-an-m-pharm-degree-can-help-you-succeed | /blog | Blog |
| 25 | /from-student-to-dental-professional-how-a-bds-degree-can-help-you-succeed | /blog | Blog |
| 26 | /innovation-and-expertise-why-pursuing-a-dental-mds-degree-is-a-smart-choice | /blog | Blog |
| 27 | /the-role-of-creativity-in-engineering-problem-solving | /blog | Blog |
| 28 | /oral-maxillofacial-surgery-at-jkkn-dental-college-and-hospital | /blog | Blog |
| 29 | /mastering-the-csat-paper-for-upsc-cse-2024-8-proven-tips-for-a-successful-civil-services-exam | /blog | Blog |
| 30 | /score-your-dream-job-with-appsc-group-2-hall-ticket-for-897-vacancies-exam-on-feb-25-direct-link-inside | /blog | Blog |
| 31 | /unlocking-global-potential-inside-the-impactful-world-bank-supported-vidya-samiksha-kendra-in-gujarat | /blog | Blog |
| 32 | /unlock-your-nift-score-with-the-latest-answer-key-2024-at-nta-ac-in-dont-miss-out | /blog | Blog |
| 33 | /dont-miss-out-on-mahacet-2024-register-by-today-for-mca-mba-and-more-apply-now | /blog | Blog |
| 34 | /unlocking-the-benefits-exploring-the-proposed-changes-to-cbse-credit-system-for-classes-9-12 | /blog | Blog |
| 35 | /empowering-awareness-celebrating-ivf-advancements-support | /blog | Blog |
| 36 | /linkdin-live-classroom-to-shopfloor-ai-aedp-perspective | /blog | Blog |
| 37 | /careers2 | / | Misc |
| 38 | /digital-campus | / | Misc |
| 39 | /digital-campus1 | / | Misc |
| 40 | /our-vision-and-mission | / | Misc |
| 41 | /seminor-hall | / | Misc |

#### C2. Pre-Existing Redirects (7 URLs — already in next.config.ts before audit)

| # | Old URL | New URL |
|---|---------|---------|
| 1 | /about-the-institutions | /about/our-institutions |
| 2 | /about-the-trust | /our-trust |
| 3 | /about/our-trust | /our-trust |
| 4 | /the-rise-of-artificial-intelligence-in-healthcare | / |
| 5 | /latest-news | / |
| 6 | /web-stories/* | / |
| 7 | /privacy-policy | (same slug — works natively) |

### D. robots.txt Updates (4 new Disallow rules)

Added to both the shared generator and the Engineering College template:

```
Disallow: /author/
Disallow: /tag/
Disallow: /category/
Disallow: /account/
```

### E. Trailing Slash Normalization (ALL URLs)

The middleware now redirects ALL trailing-slash URLs to non-trailing-slash:
- `/food-court/` → 301 → `/food-court`
- `/blog/` → 301 → `/blog`
- etc.

This eliminates duplicate URL signals sitewide and ensures all 301 redirects in next.config.ts work for both URL variants.

---

## PART 2: PENDING — SEO TEAM DECISIONS REQUIRED

### F. Event/Blog Pages in CMS Catch-All (47 URLs)

These URLs go to the CMS catch-all route `app/(public)/[...slug]/page.tsx`. The outcome depends on whether the slug exists in the CMS database:

- **If slug exists in CMS** → Page is served (status 200) — no action needed
- **If slug does NOT exist** → Returns 404 — needs decision (see options below)

**SEO Team must check each URL in the CMS and decide:**

| # | Old URL | Likely Content | Decision Needed |
|---|---------|---------------|-----------------|
| 1 | /sresakthimayeil-institute-of-nursing-and-research-conducted-earth-day | Event | Check CMS |
| 2 | /world-kidney-cancer-day | Health awareness | Check CMS |
| 3 | /workshop-on-corticobasal-implants | Event | Check CMS |
| 4 | /e-library-orientation-program | Event | Check CMS |
| 5 | /placement-day-celebration-2025 | Event | Check CMS |
| 6 | /resuscitation-india-sumit-2023 | Event | Check CMS |
| 7 | /onam-celebrations-ahs-campus | Event | Check CMS |
| 8 | /celebrating-the-98th-birthday-of-jkk-nattaraja-sir-founders-day-at-jkk-nattaraja-college | Event | Check CMS |
| 9 | /kumarapalayam-bypass-marathon | Event | Check CMS |
| 10 | /25th-ips-pg-convention | Event | Check CMS |
| 11 | /national-vaccination-day | Health awareness | Check CMS |
| 12 | /15th-sports-day-event | Event | Check CMS |
| 13 | /world-hepatitis-day | Health awareness | Check CMS |
| 14 | /2-board-examination-in-2022-2023 | Academic | Check CMS |
| 15 | /road-safety-awareness | Awareness | Check CMS |
| 16 | /intellectual-property-rights-day-2 | Awareness | Check CMS |
| 17 | /curtain-raiser-jkkn-global-alumni-utsav | Event | Check CMS |
| 18 | /jkkn-college-of-engineering-and-technology-sports-day-2023 | Event | Check CMS |
| 19 | /cbct-inauguration | Event | Check CMS |
| 20 | /national-service-scheme | Institutional | Check CMS |
| 21 | /international-plastic-bag-free-day-2 | Event | Check CMS |
| 22 | /world-health-days | Health awareness | Check CMS |
| 23 | /jkkncets-initiative-on-mental-health-and-suicide-awareness | Event | Check CMS |
| 24 | /national-level-technical-symposium-technovation-23 | Event | Check CMS |
| 25 | /world-malaria-day | Health awareness | Check CMS |
| 26 | /anti-ragging-seminar-program | Event | Check CMS |
| 27 | /best-poster-award-at-a-national-level-seminar-organized-by-psg-college-of-pharmacy | Event | Check CMS |
| 28 | /world-homeopathy-day | Health awareness | Check CMS |
| 29 | /jkk-nataraja-colleges-first-year-commencement-ceremony-2023 | Event | Check CMS |
| 30 | /onam-celebration-at-ahs-campus | Event | Check CMS |
| 31 | /national-conference-race-2k23 | Event | Check CMS |
| 32 | /faculty-development-program | Event | Check CMS |
| 33 | /national-level-poster-presentation | Event | Check CMS |
| 34 | /field-visit-day-by-ssm-group-of-schools-to-our-jkkn-dental-college | Event | Check CMS |
| 35 | /national-level-seminar-conducted-by-psg-college-of-pharmacy | Event | Check CMS |
| 36 | /electoral-literacy-club | Event | Check CMS |
| 37 | /world-health-day-celebration | Event | Check CMS |
| 38 | /world-health-day-2 | Event | Check CMS |
| 39 | /the-national-level-symposium-technovation-23 | Event | Check CMS |
| 40 | /campus-recruitment-drive-2025-a-step-towards-bright-futures | Event | Check CMS |
| 41 | /happy-labour-day | Event | Check CMS |
| 42 | /world-breastfeeding-week-celebration-promoting-maternal-child-health | Event | Check CMS |
| 43 | /alumni-meet-2025-reconnect-relive | Event | Check CMS |
| 44 | /alumni-meet | Event | Check CMS |
| 45 | /internship-workshop-orientation-for-our-final-year-students | Event | Check CMS |
| 46 | /environmental-talks | Event | Check CMS |
| 47 | /jkkn-college-of-engineering-and-technology-15th-annual-day | Event | Check CMS |

**Options for URLs that 404 in CMS:**
1. **Add 301 redirect to /blog** (Developer task — add to next.config.ts)
2. **Create CMS page** for content worth keeping (Content team task)
3. **Leave as 404** — Google will de-index slowly (~2-4 weeks)
4. **Add to JUNK_URLS** in middleware.ts for 410 response (Developer task — faster de-indexing)

### G. Facility/Institutional Pages in CMS Catch-All (13 URLs)

These might exist as CMS pages. SEO team should verify:

| # | Old URL | Likely Content | Suggested Action if 404 |
|---|---------|---------------|------------------------|
| 1 | /facilities/seminar-hall | Facility page | 301 → / |
| 2 | /google-workspace | Tool page | 301 → / |
| 3 | /bus | Transport info | 301 → / |
| 4 | /portal | Student portal | 301 → / |
| 5 | /wi-fi-campus | Facility page | 301 → / |
| 6 | /emergancy-care | Facility page | 301 → / |
| 7 | /food-court | Facility page | 301 → / |
| 8 | /bank-post-office | Facility page | 301 → / |
| 9 | /medical-humanities | Department page | 301 → / |
| 10 | /smart-classroom | Facility page | 301 → / |
| 11 | /lab | Facility page | 301 → / |
| 12 | /laboratory | Facility page | 301 → / |
| 13 | /terms | Legal page | Create CMS page |

### H. Unicode/Broken URLs (5 URLs) — No Action Needed

These have corrupted characters (likely Tamil text) and will auto-404 via the CMS catch-all. Google will de-index them naturally.

| # | Old URL |
|---|---------|
| 1 | /????????-????????????-?????????? |
| 2 | /??????????????????????????-?????? |
| 3 | /????????-????????????-??????????/ |
| 4 | /????????-????????????-??????-?????? |
| 5 | /b??????-??????????-?????????? |
| 6 | /national-level-webinar-on-????????????????????????-????/ |

---

## PART 3: SEO TEAM TASKS (Manual — Google Search Console)

These tasks CANNOT be done by developers. They require Google Search Console access.

### Task 1: Check for Manual Penalties (URGENT — Day 1)

1. Go to Google Search Console → **Security & Manual Actions** → **Manual Actions**
2. If you see "Spammy content" or "Hacked site" penalty:
   - The middleware 410 responses are the fix
   - After deploying, submit a **Manual Action Reconsideration Request**
3. Also check **Security Issues** tab for any flagged pages

### Task 2: Submit URL Removal Requests (URGENT — Day 1-2)

1. Go to Google Search Console → **Removals** → **New Request**
2. Submit removal for each gambling/spam URL prefix:
   - `jkkn.ac.in/megapari` (use "Remove all URLs with this prefix")
   - `jkkn.ac.in/dafabet`
   - `jkkn.ac.in/20bet`
   - `jkkn.ac.in/stake`
   - `jkkn.ac.in/batery`
   - `jkkn.ac.in/1xbit`
   - `jkkn.ac.in/22bet`
   - `jkkn.ac.in/download-megapari`
   - `jkkn.ac.in/download-dafabet`
   - `jkkn.ac.in/download-helabet`
   - `jkkn.ac.in/access-online-casino`
   - `jkkn.ac.in/exceptional-casino`
   - `jkkn.ac.in/unrivaled-gaming`
   - `jkkn.ac.in/best-betting`
   - `jkkn.ac.in/official-20bet`
   - `jkkn.ac.in/welcome-offer-games`
   - `jkkn.ac.in/actual-link-to-download`
3. These give 6-month temporary removal while 410 takes permanent effect

### Task 3: Build and Submit Disavow File (Week 1)

1. Go to GSC → **Links** → **External Links** → **Top Linking Sites**
2. Click each linking domain
3. If they link to any spam URLs → add to disavow file
4. Also check: **Links** → **Top Linked Pages** → sort for gambling URLs
5. Edit `docs/seo/google-disavow-spam-urls.txt` with discovered domains
6. Submit at: https://search.google.com/search-console/disavow-links

### Task 4: Verify Event Pages in CMS (Week 1-2)

1. Open each URL from Section F above in a browser
2. If page loads → no action needed
3. If 404 → decide: redirect to /blog, create CMS content, or leave as 404
4. Report back to developer with list of URLs that need 301 redirects

### Task 5: Verify Facility Pages in CMS (Week 1-2)

1. Open each URL from Section G above in a browser
2. If page loads → no action needed
3. If 404 → report to developer for 301 redirect to homepage

### Task 6: Monitor De-Indexing Progress (Ongoing — Weekly)

1. GSC → **Settings** → **Crawl Stats** → watch for:
   - 410 responses increasing (spam URLs being recognized as gone)
   - 404 count decreasing
   - Indexed page count dropping (spam pages leaving index)
2. GSC → **Pages** → **Not Indexed** → verify spam URLs appear here
3. GSC → **Pages** → **Indexed** → verify no spam URLs remain

### Task 7: Request Re-Indexing of Key Pages (After Deploy)

1. Use GSC → **URL Inspection** on these priority pages:
   - https://www.jkkn.ac.in/
   - https://www.jkkn.ac.in/admissions
   - https://www.jkkn.ac.in/courses-offered
   - https://www.jkkn.ac.in/our-institutions
   - https://www.jkkn.ac.in/blog
2. Click "Request Indexing" to push Google to re-crawl

---

## PART 4: DEVELOPER PENDING TASKS (After SEO Team Feedback)

### After Section F/G verification:

Once the SEO team reports which event/facility URLs return 404, the developer should:

1. **For URLs that should redirect to /blog:**
   Add new entries to `next.config.ts` in the redirect array:
   ```typescript
   { source: '/event-slug-here', destination: '/blog', permanent: true },
   ```

2. **For URLs that should return 410 (truly dead content):**
   Add to the `JUNK_URLS` set in `middleware.ts`:
   ```typescript
   '/event-slug-here',
   ```

3. **For facility URLs that should redirect to homepage:**
   Add new entries to `next.config.ts`:
   ```typescript
   { source: '/facility-slug', destination: '/', permanent: true },
   ```

### Estimated developer effort for pending work:
- After SEO team feedback: ~30 minutes (adding redirects for confirmed 404 URLs)
- No architectural changes needed — just adding entries to existing config

---

## Timeline

| When | Who | Task |
|------|-----|------|
| Day 1 (Deploy) | Developer | Deploy middleware.ts + next.config.ts + robots.txt changes |
| Day 1 | SEO Team | Check Manual Actions in GSC (Task 1) |
| Day 1-2 | SEO Team | Submit URL removal requests (Task 2) |
| Week 1 | SEO Team | Build disavow file (Task 3) |
| Week 1-2 | SEO Team | Verify event/facility pages in CMS (Tasks 4-5) |
| Week 2 | Developer | Add redirects for confirmed 404 URLs (from Tasks 4-5) |
| Week 2+ | SEO Team | Request re-indexing of key pages (Task 7) |
| Ongoing | SEO Team | Monitor de-indexing weekly (Task 6) |
| Week 6-8 | SEO Team | Verify all spam URLs removed from Google index |
