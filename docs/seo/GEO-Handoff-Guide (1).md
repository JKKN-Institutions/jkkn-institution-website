---
created: 2026-03-09
updated: 2026-03-10
type: guide
status: ready-to-execute
owner: SEO Specialist / Digital Growth Lead
description: Unified SEO + GEO command center — the ONE document for fixing JKKN's digital visibility crisis
tags:
  - geo
  - seo
  - ai-search
  - handoff
  - implementation-guide
  - claude-code
  - command-center
related:
  - "[[Audits/SEO-Deep-Audit-2026-01-23]]"
  - "[[Audits/SEO-Audit-All-Institutions-2026-01-23]]"
  - "[[Audits/SEO-Audit-Dental-College-2026-01-23]]"
  - "[[Reputation/JKKN-Dental-Google-AI-Defamation-Crisis-2026-01-27]]"
  - "[[Reputation/Google-AI-Dental-College-Pattern-Analysis-2026-01-27]]"
  - "[[Meta-Tags/All-Institutions]]"
---

# JKKN SEO + GEO + AEO Implementation Guide

**What is this?** The ONE document for fixing JKKN's digital visibility — traditional Google search (SEO), AI search engines like ChatGPT, Perplexity, and Google AI Mode (GEO), AND direct answers in Featured Snippets, Voice Search, and People Also Ask boxes (AEO). Everything you need is here.

**Who is this for?** The SEO specialist and Digital Growth team.

**Why does this matter?** JKKN is invisible in BOTH traditional search AND AI search. 5 out of 9 institutions don't rank for state-level searches. When someone asks ANY AI search engine about best colleges in Tamil Nadu, JKKN doesn't appear — or worse, Google AI fabricates false negative content about JKKN Dental. This guide fixes all of it.

**Your superpower:** You have Claude Code (Opus 4.6, Max plan). Every step below that involves writing code, creating pages, or generating content — Claude Code can do it for you. You don't need to write code manually.

**New to SEO/GEO terminology?** See the [[#Glossary]] at the end of this document for plain-English definitions of terms like GEO, Schema.org, E-E-A-T, and RAG.

---

## Table of Contents

- [[#Crisis Dashboard]]
- [[#Start Here: What to Do TODAY]]
- [[#SEO vs GEO — What's the Difference?]]
- [[#Why JKKN Doesn't Rank (Root Causes)]]
- [[#The Implementation Plan (Phase 0 + 5 Moves + AEO)]]
- [[#PHASE 0: SEO Emergency Fixes (Day 1-3)]]
- [[#MOVE 1: Allow AI Crawlers (Day 1 — 30 Minutes)]]
- [[#MOVE 2: Review Campaign (Weeks 1-4, Ongoing)]]
- [[#MOVE 3: Structured Data Markup (Week 1-2)]]
- [[#MOVE 4: GEO Content Hub (Week 2-4)]]
- [[#MOVE 5: Entity Authority Building (Month 1-3)]]
- [[#Technical SEO Issues (Fix In Parallel)]]
- [[#Tools & Access Needed]]
- [[#Weekly Execution Calendar]]
- [[#Success Metrics — How to Know It's Working]]
- [[#Claude Code — Your SEO/GEO Execution Agent]]
- [[#Data Verification Protocol]]
- [[#Institution Data Cards]]
- [[#Common Mistakes to Avoid]]
- [[#Tamil-Language GEO (Phase 2 Opportunity)]]
- [[#AEO — Answer Engine Optimization]] (parallel with Moves 3-4)
- [[#Review Management Process]]
- [[#Escalation & Help]]
- [[#Glossary]]
- [[#Related Documents]]
- [[#File Organization]]
- [[#Pre-Deployment Checklist]]
- [[#Vault References — Deeper Reading]]

---

## Crisis Dashboard

**Last Updated:** 2026-03-10
**Status:** ACTIVE CRISIS — Multiple institutions invisible in state-level AND AI searches

| Metric | Status |
|--------|--------|
| State-level Google visibility | **CRITICAL** — Not ranking for "Tamil Nadu" searches |
| AI search visibility (ChatGPT/Perplexity) | **CRITICAL** — Not cited in any AI answer |
| Security | **CRITICAL** — Dental site compromised (Russian casino spam in H1 tags) |
| Technical SEO | **POOR** — 5/9 institutions missing basics |
| Reputation | **ACTIVE CRISIS** — Google AI fabricating defamatory content |

### Institution Health Scores

| Institution | SEO Score | Visibility | Urgency |
|-------------|-----------|------------|---------|
| Dental | 2/10 | NOT RANKING | **CRITICAL** (hacked) |
| Engineering | 6/10 | Local only | HIGH |
| Nursing | 6/10 | Local only | HIGH |
| Pharmacy | 2/10 | NOT RANKING | CRITICAL |
| Allied Health | 1/10 | NOT RANKING | CRITICAL |
| Arts & Science | 2/10 | NOT RANKING | CRITICAL |
| Education | 2/10 | NOT RANKING | CRITICAL |
| Matric School | 5/10 | Local only | MEDIUM |
| Nattraja Vidhyalaya | 5/10 | Local only | MEDIUM |

### The Competition (What We're Up Against)

| For "Tamil Nadu Dental College" | Google Ranking | AI Citation |
|--------------------------------|----------------|-------------|
| Saveetha Dental College | Top 3 | Cited by ChatGPT, Perplexity |
| SRM Dental College | Top 5 | Cited by some AI engines |
| Meenakshi Ammal Dental College | Top 10 | Occasionally cited |
| **JKKN Dental College** | **NOT RANKING** | **NOT CITED (or negative)** |

---

## Start Here: What to Do TODAY

If you're reading this for the first time, here's your immediate action list:

1. **Escalate Dental hack to IT** — Russian casino spam is in the H1 tags. Every day this stays = Google penalty deepens. (Phase 0.1)
2. **Copy-paste meta descriptions** — 5 sites have NONE. The templates are ready below in Phase 0.2. Send them to IT/Dev.
3. **File Google AI feedback** — Google AI is fabricating defamatory content about JKKN Dental. File feedback TODAY. (Phase 0.4)
4. **Screenshot baseline** — Search "best dental college Tamil Nadu" in Google, ChatGPT, and Perplexity. Screenshot the results. This is your Day 0 evidence.
5. **Get access** — You need Google Search Console, Google Analytics, and CMS admin. See "Tools & Access Needed" section below.

Everything else (robots.txt, llms.txt, Schema.org, reviews, content hub) builds on these. Do these five things first.

---

## SEO vs GEO — What's the Difference?

**SEO** = Making your website show up in Google's list of 10 blue links. This is about meta tags, page structure, backlinks, site speed — the basics most colleges already do.

**GEO** = Making your institution THE ANSWER when someone asks an AI "best college in Tamil Nadu." AI engines (ChatGPT, Google AI Mode, Perplexity) don't show 10 results — they give ONE answer citing 2-7 sources. If JKKN isn't one of those 2-7 sources, students never see us.

**AEO** = Making your content THE DIRECT ANSWER in Featured Snippets, Voice Search results, and "People Also Ask" boxes. While SEO gets you on page 1 and GEO gets you cited by AI, AEO makes you the answer that appears ABOVE the blue links — the "position zero" that captures 35-50% of all clicks.

**Why all three matter:** Fixing SEO (meta tags, structured HTML, page speed) also helps GEO and AEO. GEO tactics (Schema.org, FAQ pages, review campaigns) boost Google rankings AND feed AEO. AEO-optimized content (concise answers, FAQ markup, table formatting) gets extracted by both Google's Featured Snippets AND AI answer engines. They're the same problem at different layers. See [[#AEO — Answer Engine Optimization]] for the full AEO playbook.

**The crisis:** Saveetha gets cited everywhere (rich content, NIRF #2, active YouTube). SRM gets cited (strong content marketing). JKKN gets NOTHING — or worse, Google AI fabricates false complaints from a single bad review.

**The fix:** Make JKKN's real strengths (accreditations, strong placement record, 50+ years) visible to BOTH Google search AND AI engines. **Important:** Always verify specific numbers against the [[#Institution Data Cards]] before publishing — some website-sourced figures differ from third-party aggregator data.

---

## Why JKKN Doesn't Rank (Root Causes)

These technical issues affect BOTH traditional Google ranking AND AI search visibility:

| Problem | Impact on SEO | Impact on GEO | Status |
|---------|--------------|---------------|--------|
| 106 JavaScript files (target: <20) | Slows page load → lower rankings | AI crawlers timeout or skip | Needs IT fix |
| Zero paragraph `<p>` tags | Content structure broken for Google | AI can't parse content | Needs dev fix |
| 24% images missing alt text | Visual content invisible to Google | AI can't describe campus | Needs content team |
| 10+ subdomains | Authority spread thin across domains | No single strong entity for AI | Long-term strategy |
| No FAQ schema | Missing rich snippets in search | AI can't extract Q&A pairs | Move 3 below |
| No freshness signals (dates) | Appears stale to Google | AI deprioritizes outdated content | Easy fix |
| Brand inconsistency (Nursing = "Sresakthimayeil") | Confuses Google's entity matching | AI creates separate/wrong entity | Brand fix needed |
| No Schema.org structured data | Google can't read college data | AI can't extract facts to cite | Move 3 below |
| No llms.txt | N/A (SEO doesn't use it) | AI systems have no guide to content | Move 1 below |

---

## The Implementation Plan (Phase 0 + 5 Moves + AEO)

| Phase | What It Does | Timeline | Cost | Helps SEO | Helps GEO | Helps AEO |
|-------|-------------|----------|------|-----------|-----------|-----------|
| **0** | **SEO Emergency Fixes** | **Day 1-3** | **₹0** | **YES** | **YES** | **YES** |
| 1 | Allow AI Crawlers + llms.txt | Day 1 (30 min) | ₹0 | Indirect | YES | Indirect |
| 2 | Review Campaign | Weeks 1-4 (ongoing) | ₹0 | YES | YES | Indirect |
| 3 | Structured Data Markup | Week 1-2 | ₹0 | YES | YES | YES |
| 4 | GEO Content Hub | Week 2-4 | ₹0 (subdomain) | YES | YES | YES |
| 5 | Entity Authority Building | Month 1-3 | ₹0-5K | YES | YES | YES |
| **AEO** | **Featured Snippets + Voice Search** | **Weeks 1-4** | **₹0** | **YES** | **YES** | **YES** |

Total cost: Effectively ₹0 — this is a reallocation of your existing time. AEO work happens inside Moves 3-4 (same content, snippet-optimized formatting).

---

## PHASE 0: SEO Emergency Fixes (Day 1-3)

These are traditional SEO fixes that are ALSO prerequisites for GEO to work. No point optimizing for AI if the base website is broken.

### 0.1 Security Audit — Dental Site HACKED (TODAY)

**What happened:** Foreign gambling spam keywords were detected in JKKN Dental's H1 tags. The site has been compromised — this means Google may have already flagged/penalized it, and AI engines will AVOID citing a hacked site.

**Action:**
1. **IT Security team**: Audit dental.jkkn.ac.in server immediately
2. Remove all malware/injected code
3. Change all CMS admin passwords
4. Submit reconsideration request to Google Search Console after cleanup
5. Check other institution sites for similar compromise

**Escalation:** If IT doesn't act today, escalate to Director. Frame as: "Google is penalizing our dental college because hackers injected casino spam. Every day we don't fix this, we lose more rankings."

**How to verify:** After IT confirms cleanup, visit the dental site and view page source (Ctrl+U). Search for any foreign-language gambling keywords — if found, cleanup is incomplete. Also check Google Search Console for any manual action notifications.

### 0.2 Add Meta Descriptions to 5 Sites (CRITICAL)

5 out of 9 institution sites have NO meta description. `[SEO IN-CHARGE: VERIFY — Identify which 5 specifically are missing meta descriptions so specialist can prioritize. Templates are provided for all 7 colleges below, but knowing which 5 are urgent helps focus effort.]` Google uses this text as the snippet in search results — without it, Google auto-generates random text from your page, which is usually bad.

**Copy-paste these into each site's `<head>` section (ask IT/Dev to add):**

> [!danger] **STOP — Templates contain verification markers that MUST be resolved before deployment**
> Templates below contain `[SEO IN-CHARGE: VERIFY]` markers. These are NOT ready for blind copy-paste. The SEO in-charge must fill in verified data at every marker before these go live. If any `[VERIFY]` text appears in a deployed meta description, Google will display it as the search result snippet.

> [!warning] **IMPORTANT:** Before deploying any template below, verify all placement figures, accreditation claims, and program lists against the [[#Institution Data Cards]] section. Some templates contain website-sourced figures that may differ from third-party aggregator data. Items marked `[VERIFY]` MUST be checked before publishing.

> **Note:** Templates below cover all 7 college sites. Matric School and Nattraja Vidhyalaya are on separate platforms — check independently whether they already have meta descriptions.

#### Dental College
```html
<title>JKKN Dental College - Top BDS & MDS College in Tamil Nadu | Since 1987</title>
<meta name="description" content="JKKN Dental College, Komarapalayam - NAAC A accredited, DCI approved dental college in Tamil Nadu. BDS & MDS programs with 90%+ placement. Apply for 2026 admissions.">
```

#### Engineering College
```html
<title>JKKN College of Engineering & Technology - Top Engineering College in Tamil Nadu</title>
<meta name="description" content="JKKN College of Engineering & Technology, Namakkal - Anna University affiliated, AICTE approved. B.E/B.Tech in CSE, IT, ECE, EEE, Mech on 55-acre campus. Top engineering college in Tamil Nadu. [SEO IN-CHARGE: VERIFY — NAAC grade and placement % against Data Card before deploying]">
```

#### Pharmacy College
```html
<title>JKKN College of Pharmacy - Top Pharmacy College in Tamil Nadu | B.Pharm, M.Pharm</title>
<meta name="description" content="JKKN College of Pharmacy - PCI approved pharmacy college in Tamil Nadu. B.Pharm & M.Pharm programs with excellent placements. Apply for 2026 admissions.">
```

#### Nursing College
```html
<title>JKKN College of Nursing - Top BSc Nursing College in Tamil Nadu | INC Approved</title>
<meta name="description" content="JKKN College of Nursing - INC approved nursing college in Tamil Nadu. BSc Nursing, MSc Nursing programs with hospital-based training. Top nursing college in Erode region.">
```

#### Allied Health Sciences
```html
<title>JKKN Allied Health Sciences - Top AHS College in Tamil Nadu</title>
<meta name="description" content="JKKN College of Allied Health Sciences - Leading AHS college in Tamil Nadu offering BSc programs in Medical Lab Technology, Radiology, and more. Expert faculty, modern labs.">
```

#### Arts & Science College
```html
<title>JKKN College of Arts & Science - Top Arts College in Tamil Nadu</title>
<meta name="description" content="JKKN College of Arts & Science - Autonomous, NAAC A accredited arts and science college in Tamil Nadu. BA, BSc, BCom, BBA, BCA programs with excellent placements.">
```

#### Education College
```html
<title>JKKN College of Education - Top B.Ed College in Tamil Nadu</title>
<meta name="description" content="JKKN College of Education - NCTE approved B.Ed college in Tamil Nadu. Two-year B.Ed program with excellent teaching infrastructure. Top education college in Namakkal.">
```

> Full meta tag templates with ALL tags (including OG tags, Twitter cards): [[Meta-Tags/All-Institutions]]

**How to verify:** After IT adds the meta tags, visit each site and view page source (Ctrl+U). Search for `<meta name="description"` — if found, the tag is live. Also check [Google's Rich Results Test](https://search.google.com/test/rich-results) to confirm Google can read them.

### 0.3 Fix H1 Tags Where Missing or Wrong

The `<h1>` tag is the most important heading on every page. Several JKKN sites either don't have one, or have WRONG content in it.

**Check each institution's homepage:**
- Does the `<h1>` tag exist?
- Does it say the institution name clearly?
- **CRITICAL — Nursing site**: H1 says "Sresakthimayeil" instead of "JKKN College of Nursing" — fix to JKKN branding

**Claude Code prompt to audit:**
```
Scrape the homepage of each JKKN institution site and extract
the H1 tag. Report which sites are missing H1 or have incorrect content.
Sites: jkkn.ac.in, dental.jkkn.ac.in, engineering.jkkn.ac.in [SEO IN-CHARGE: VERIFY — Is the canonical URL engineering.jkkn.ac.in or engg.jkkn.ac.in? Standardize before deploying.],
pharmacy.jkkn.ac.in, nursing.sresakthimayeil.jkkn.ac.in
```

**How to verify:** After IT fixes the H1 tags, visit each site and view page source (Ctrl+U). Search for `<h1` — there should be exactly ONE H1 tag on each page, and it should contain the institution name. If the Nursing site still shows "Sresakthimayeil", the fix is incomplete.

### 0.4 File Google AI Feedback for Defamation (TODAY)

**The problem:** Google AI Mode is generating FABRICATED defamatory content about JKKN Dental from ONE Shiksha review:
- "Lack of water at dental chairs" (FALSE)
- "Malfunctioning OPG machines" (FALSE)
- "Frequently cited in student forums" (FALSE — no such forums exist)

**Actual ratings tell a different story:**
| Platform | Rating | Reviews |
|----------|--------|---------|
| Justdial | 4.3/5 | 403 |
| Collegedunia | 8.3/10 | 3 |
| Shiksha | 3.7/5 | 2 |
| Facebook | 94% recommend | 31 |

**Action:** File feedback through Google AI Mode interface. See detailed crisis response plan: [[Reputation/JKKN-Dental-Google-AI-Defamation-Crisis-2026-01-27]]

**How to verify:** After filing, screenshot the Google AI response for "JKKN Dental College review" once a week. Compare with baseline screenshots from Day 1 — the fabricated claims should diminish or disappear within 2-4 weeks. If unchanged after 4 weeks, re-file with additional evidence.

---

## MOVE 1: Allow AI Crawlers (Day 1 — 30 Minutes)

### Why This Matters
AI engines like ChatGPT, Perplexity, and Google AI Mode send "bots" (automated programs) to read websites. If your `robots.txt` file blocks these bots, AI literally CANNOT see your content. This is a binary on/off switch — the single most important technical fix.

### Step 1: Check Current robots.txt — ALREADY DONE

> **Status as of 2026-03-09:** robots.txt on `jkkn.ac.in` and `dental.jkkn.ac.in` already ALLOWS all 30+ AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Grok, Meta AI, Apple, Amazon, Mistral, Cohere — all explicitly listed as Allow). Version 2.0, updated 2026-02-16. Sitemaps declared.
>
> **Main domains (jkkn.ac.in, dental.jkkn.ac.in) are done.** Still need to verify the remaining subdomains below.

**Check these remaining subdomains** (not yet verified):

| Institution | URL to Check |
|------------|-------------|
| Engineering | `https://engineering.jkkn.ac.in/robots.txt` `[SEO IN-CHARGE: VERIFY — Data Card says engg.jkkn.ac.in. Which is canonical?]` |
| Pharmacy | `https://pharmacy.jkkn.ac.in/robots.txt` |
| Nursing | `https://nursing.sresakthimayeil.jkkn.ac.in/robots.txt` |
| Allied Health | `https://ahs.jkkn.ac.in/robots.txt` |
| Arts & Science | Subfolder of jkkn.ac.in — check `https://jkkn.ac.in/robots.txt` (already covers this) |

If any of these DON'T have the same AI-friendly robots.txt, ask IT to copy the jkkn.ac.in version.

### Step 2: Create llms.txt (New — Most Sites Don't Have This Yet)

`llms.txt` is a NEW file (like robots.txt) that tells AI systems what your website is about. Almost NO Indian college has this yet — JKKN can be first.

Create a file called `llms.txt` at the root of `jkkn.ac.in`:

**URL:** `https://jkkn.ac.in/llms.txt`

**Contents (copy-paste this):**

> [!danger] **DO NOT upload this file until ALL `[SEO IN-CHARGE: VERIFY]` placeholders are replaced with actual data.** AI engines read llms.txt literally — any verification markers will be interpreted as JKKN having unconfirmed data.

**The ready-to-use llms.txt template is in the expandable block below. Click to reveal, then copy-paste AFTER resolving all verification markers.**

> [!example]- llms.txt content (click to expand — 64 lines)
> ```markdown
> # JKKN Institutions
>
> > JKKN Institutions is a multi-disciplinary educational group in Tamil Nadu, India, comprising 9 institutions across health sciences, engineering, arts, and education. NAAC A accredited. Located in Komarapalayam, Namakkal District, Tamil Nadu.
>
> ## Key Facts
> - Trust Established: 1975 (individual institutions founded 1985–2019; see below for per-institution dates)
> - Accreditation: NAAC A Grade
> - Total Institutions: 9
> - Placement Rate: [SEO IN-CHARGE: VERIFY — check each institution's Data Card for aggregator-verified figures]
> - Location: Komarapalayam, Namakkal, Tamil Nadu 638183
>
> ## Institutions
>
> ### JKKN Dental College & Hospital
> - Programs: BDS, MDS
> - Approval: Dental Council of India (DCI)
> - Hospital: 300+ dental chairs, full specialty departments
> - Placement: [SEO IN-CHARGE: VERIFY against Data Card]
> - URL: https://dental.jkkn.ac.in
>
> ### JKKN College of Engineering & Technology
> - Programs: B.E/B.Tech (CSE, IT, ECE, EEE, Mechanical)
> - Affiliation: Anna University
> - Accreditation: AICTE Approved, Anna University Affiliated [SEO IN-CHARGE: VERIFY NAAC grade on naac.gov.in]
> - Placement: [SEO IN-CHARGE: VERIFY — aggregators report 40-70%, see Data Card]
> - URL: https://engg.jkkn.ac.in
>
> ### JKKN College of Pharmacy
> - Programs: B.Pharm, M.Pharm, Pharm.D
> - Approval: Pharmacy Council of India (PCI)
> - URL: https://pharmacy.jkkn.ac.in
>
> ### JKKN College of Nursing
> - Programs: B.Sc Nursing, M.Sc Nursing
> - Approval: Indian Nursing Council (INC)
> - Hospital Training: Attached teaching hospital
>
> ### JKKN College of Allied Health Sciences
> - Programs: B.Sc Medical Lab Technology, B.Sc Radiology, B.Sc Optometry
> - Focus: Clinical training with hospital integration
>
> ### JKKN College of Arts & Science
> - Programs: BA, B.Sc, B.Com, BBA, BCA, M.Sc, M.Com, MBA
> - Status: Autonomous
> - Accreditation: NAAC A
>
> ### JKKN College of Education
> - Programs: B.Ed
> - Approval: NCTE
>
> ### JKKN Matriculation Higher Secondary School
> - Grades: 1-12
> - Board: State Board
>
> ### Nattraja Vidhyalaya CBSE School
> - Grades: 1-12
> - Board: CBSE
>
> ## Contact
> - Website: https://jkkn.ac.in
> - Email: info@jkkn.ac.in [SEO IN-CHARGE: VERIFY — confirm this is the correct general contact email]
> - Phone: [SEO IN-CHARGE: VERIFY — insert main JKKN phone number from Data Cards]
> - Address: JKKN Educational Institutions, NH-544 (Salem-Coimbatore Highway), Komarapalayam, Namakkal, Tamil Nadu 638183
> ```

**Claude Code shortcut:** Open Claude Code in your terminal and say: *"Read this llms.txt content and help me upload it to jkkn.ac.in root directory"* — Claude can guide you through FTP/cPanel upload.

### How to Verify It Worked

After uploading, check:
1. Visit `https://jkkn.ac.in/robots.txt` — AI bots should be listed as "Allow"
2. Visit `https://jkkn.ac.in/llms.txt` — should display your institution info
3. Use the URL Inspection tool in Google Search Console to validate robots.txt (the old standalone tester has been deprecated). Alternatively, use the [Schema.org Validator](https://validator.schema.org/) for structured data checks.

---

## MOVE 2: Review Campaign (Weeks 1-4, Ongoing)

### Why This Matters
Google AI Mode fabricated false claims about JKKN Dental based on ONE negative Shiksha review (out of only 2 reviews). When AI has very few data points, it amplifies whatever exists. If you have 2 reviews and 1 is negative = AI says "students complain about..." If you have 50 reviews and 1 is negative = AI says "highly rated with strong feedback."

**The math:** 2 reviews (1 negative) = 50% negative signal. Add 48 positive reviews = 2% negative signal. AI engines weight volume heavily.

### Step 1: Identify Target Platforms

| Platform | Current JKKN Reviews | Target (Month 1) | Priority |
|----------|---------------------|-------------------|----------|
| Shiksha.com | 2-3 reviews | 25+ per institution | HIGHEST (AI cites this) |
| Collegedunia.com | 3 reviews | 25+ per institution | HIGH |
| Careers360.com | Unknown | 15+ per institution | HIGH |
| Google Maps/Business | Check each location | 50+ per institution | HIGH |
| Justdial | 403 reviews (Dental) | Already strong | MAINTAIN |
| Glassdoor (for staff) | Check | 10+ | MEDIUM |

> `[SEO IN-CHARGE: VERIFY — Reconcile review targets: this table says 25+/institution in Month 1, but Success Metrics says 15+/30+ total, and Review Management says 5/month ongoing. Set ONE consistent target across all sections.]`

### Step 2: Who Writes the Reviews?

**DO NOT write fake reviews.** AI engines and platforms can detect them. Instead:

| Source | How to Reach Them | Expected Volume |
|--------|-------------------|-----------------|
| Current final-year students | WhatsApp class groups, learning studio announcement | 20-30 per institution |
| Recent graduates (last 2 years) | Alumni WhatsApp groups, email | 30-50 per institution |
| Current parents | Parent WhatsApp groups | 10-20 per institution |
| Senior Learners (faculty) | Department WhatsApp groups | 5-10 per institution |

### Step 3: Review Campaign Template

Send this message (customize per institution) to student/alumni groups:

> **Help JKKN Be Seen by Future Students**
>
> Did you know? When students today search "best dental college Tamil Nadu" on ChatGPT or Google, JKKN doesn't appear. Meanwhile, competitors with fewer achievements show up first — just because they have more online reviews.
>
> Your 2-minute review on Shiksha or Collegedunia can help the next batch of students discover what you already know about JKKN.
>
> **How to post (takes 2 minutes):**
> 1. Go to the JKKN page on Shiksha (links below)
> 2. Click "Write a Review"
> 3. Share your honest experience — mention specific things: lab quality, placement support, faculty guidance, campus life
> 4. Rate each category honestly
>
> **Tips for a helpful review:**
> - Be specific: "The prosthodontics lab has 40+ phantom heads" is better than "good labs"
> - Mention placements: "I got placed at [company] through campus recruitment"
> - Mention faculty: "Dr. [Name] made [subject] practical and engaging"
> - Include your batch year and program
>
> Thank you for helping future students find their way here.

### Step 4: Track Review Progress

Create a simple tracking sheet:

| Platform | Institution | Reviews Before | Reviews After (Week 1) | Reviews After (Week 2) | Reviews After (Month 1) |
|----------|-------------|---------------|----------------------|----------------------|------------------------|
| Shiksha | Dental | 2 | | | |
| Shiksha | Engineering | 0 — check | | | |
| Shiksha | Pharmacy | 0 — check | | | |
| Shiksha | Nursing | 0 — check | | | |
| Shiksha | Arts & Science | 0 — check | | | |
| Collegedunia | Dental | 3 | | | |
| Justdial | All JKKN | 403 | | | |
| Facebook | Dental | 31 | | | |
| Google Business | All | 0 — check | | | |

### Step 5: Respond to ALL Existing Reviews

Go to every platform where JKKN has reviews. Respond to every single one — positive and negative.

For response templates (positive, constructive negative, and unfair/factually wrong negative), see [[#Responding to Reviews (Templates)]] in the Review Management section.

**Why this matters for GEO:** AI engines see that JKKN actively engages with feedback. This is an authority signal.

### Verified Platform Links (as of 2026-03-09)

**JKKN Dental College:**
| Platform | URL | Current Reviews |
|----------|-----|-----------------|
| Shiksha | https://www.shiksha.com/college/j-k-k-nattraja-dental-college-and-hospital-namakkal-78331 | 2 reviews |
| Collegedunia | https://collegedunia.com/college/10574-jkk-nattraja-dental-college-and-hospital-jkkndch-namakkal | 3 reviews |
| Careers360 | https://www.careers360.com/colleges/jkk-nattraja-dental-college-and-hospital-komarapalayam | Check |
| Facebook | Search "JKK Nattraja Dental College" on Facebook | 31 reviews (94% recommend) |
| Justdial | Search "JKKN Dental College Komarapalayam" on Justdial | 403 reviews (4.3/5) |

> Use Claude Code to find links for other institutions: *"Search for JKKN College of Engineering on Shiksha, Collegedunia, and Careers360. Give me the URLs."*

---

## MOVE 3: Structured Data Markup (Week 1-2)

> [!summary] Quick Reference — MOVE 3 Checklist
> For each institution:
> 1. Generate EducationalOrganization JSON-LD (use Claude Code prompt in Step 1)
> 2. Generate FAQ Schema JSON-LD (template in Step 3)
> 3. Deploy to site `<head>` section (Options A-D in Step 4)
> 4. Validate with Google Rich Results Test (Step 5)

### Why This Matters
Right now, JKKN websites are like handwritten letters — humans can read them, but machines can't. Structured data (Schema.org JSON-LD) is like translating that letter into a format machines understand instantly.

When an AI engine reads a page with Schema.org markup, it can extract: institution name, accreditation, programs offered, placement rates, fee structure, location. Without it, the AI has to guess — and often guesses wrong or skips you entirely.

### What is Schema.org JSON-LD?

It's a block of code you put in the `<head>` section of every webpage. It looks like gibberish to humans but is gold for AI:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "JKKN Dental College & Hospital",
  ...more data...
}
</script>
```

You don't need to write this code yourself. Claude Code writes it for you.

### Step 1: Generate Schema.org for Each Institution

Open Claude Code and give it this prompt for EACH institution (replace the details):

> Generate complete Schema.org JSON-LD markup for an Indian dental college with these details:
> - Name: JKKN Dental College & Hospital
> - Type: EducationalOrganization + CollegeOrUniversity + Dentist
> - Founded: 1987
> - Address: NH-544, Komarapalayam, Namakkal, Tamil Nadu 638183
> - Accreditation: NAAC A Grade, DCI Approved
> - Programs: BDS (5 years, 100 seats), MDS (3 years, various specialties)
> - Placement rate: [SEO IN-CHARGE: VERIFY — use aggregator-verified figure, see Data Card]
> - Affiliated to: Tamil Nadu Dr. M.G.R. Medical University
> - URL: https://dental.jkkn.ac.in
> - Phone: [SEO IN-CHARGE: VERIFY — use canonical phone from Data Card]
> - Email: [SEO IN-CHARGE: VERIFY — use actual admissions email for dental college]
>
> Include: Organization, EducationalOrganization, Course (for BDS and MDS), FAQPage, BreadcrumbList, and aggregate rating schemas.

Claude will generate the complete code. Do this for all 9 institutions.

### Step 2: Template for ALL Institutions

Here's the base template. Claude Code can customize this per institution:

**The ready-to-use Schema.org template is in the expandable block below. Click to reveal, then copy-paste.**

> [!example]- Schema.org JSON-LD template (click to expand — 91 lines)
> ```html
> <script type="application/ld+json">
> {
>   "@context": "https://schema.org",
>   "@type": ["EducationalOrganization", "CollegeOrUniversity"],
>   "name": "JKKN Dental College & Hospital",
>   "alternateName": "JKKN Dental",
>   "url": "https://dental.jkkn.ac.in",
>   "logo": "https://dental.jkkn.ac.in/logo.png [SEO IN-CHARGE: VERIFY — replace with actual logo URL from dental.jkkn.ac.in]",
>   "image": "https://dental.jkkn.ac.in/campus-photo.jpg [SEO IN-CHARGE: VERIFY — replace with actual campus photo URL from dental.jkkn.ac.in]",
>   "description": "JKKN Dental College & Hospital is a DCI-approved, NAAC A accredited dental college in Tamil Nadu, India. Established in 1987, offering BDS and MDS programs with strong placement support. [SEO IN-CHARGE: VERIFY — update with aggregator-verified placement figure before deploying]",
>   "foundingDate": "1987",
>   "address": {
>     "@type": "PostalAddress",
>     "streetAddress": "NH-544, Salem-Coimbatore Highway, Komarapalayam",
>     "addressLocality": "Namakkal",
>     "addressRegion": "Tamil Nadu",
>     "postalCode": "638183",
>     "addressCountry": "IN"
>   },
>   "geo": {
>     "@type": "GeoCoordinates",
>     "latitude": "11.4396",
>     "longitude": "77.7192"
>   [SEO IN-CHARGE: VERIFY — confirm these GPS coordinates match the exact JKKN Dental campus pin on Google Maps before deploying]
>   },
>   "telephone": "[SEO IN-CHARGE: VERIFY — insert canonical JKKN Dental phone number from Data Card]",
>   "contactPoint": {
>     "@type": "ContactPoint",
>     "telephone": "+91-93458-55001",
>     "contactType": "admissions"
>   },
>   "email": "[SEO IN-CHARGE: VERIFY — insert actual admissions email for this institution]",
>   "accreditation": [
>     {
>       "@type": "EducationalOccupationalCredential",
>       "credentialCategory": "Accreditation",
>       "recognizedBy": {
>         "@type": "Organization",
>         "name": "National Assessment and Accreditation Council (NAAC)",
>         "url": "https://www.naac.gov.in"
>       },
>       "name": "NAAC A Grade"
>     },
>     {
>       "@type": "EducationalOccupationalCredential",
>       "credentialCategory": "Approval",
>       "recognizedBy": {
>         "@type": "Organization",
>         "name": "Dental Council of India (DCI)"
>       },
>       "name": "DCI Approved"
>     }
>   ],
>   "hasOfferingCatalog": {
>     "@type": "OfferingCatalog",
>     "name": "Programs Offered",
>     "itemListElement": [
>       {
>         "@type": "Course",
>         "name": "Bachelor of Dental Surgery (BDS)",
>         "description": "5-year undergraduate dental program with clinical training in attached hospital",
>         "provider": {
>           "@type": "EducationalOrganization",
>           "name": "JKKN Dental College & Hospital"
>         },
>         "timeRequired": "P5Y",
>         "educationalLevel": "Undergraduate"
>       },
>       {
>         "@type": "Course",
>         "name": "Master of Dental Surgery (MDS)",
>         "description": "3-year postgraduate dental program with specializations in Prosthodontics, Orthodontics, Oral Surgery, and more",
>         "provider": {
>           "@type": "EducationalOrganization",
>           "name": "JKKN Dental College & Hospital"
>         },
>         "timeRequired": "P3Y",
>         "educationalLevel": "Postgraduate"
>       }
>     ]
>   },
>   "parentOrganization": {
>     "@type": "Organization",
>     "name": "JKKN Institutions",
>     "url": "https://jkkn.ac.in"
>   },
>   "sameAs": [
>     "https://www.facebook.com/jkkninstitutions",
>     "https://www.instagram.com/jkkninstitutions",
>     "https://www.youtube.com/@jkkninstitutions"
>   ],
>   "numberOfEmployees": {
>     "@type": "QuantitativeValue",
>     "value": 100
>   }
> }
> </script>
> ```

### Step 3: Add FAQ Schema (CRITICAL for GEO)

This is the MOST IMPORTANT markup for AI search. Every institution page needs this:

**The ready-to-use FAQ Schema template is in the expandable block below. Click to reveal, then copy-paste.**

> [!example]- FAQ Schema JSON-LD template (click to expand — 87 lines)
> ```html
> <script type="application/ld+json">
> {
>   "@context": "https://schema.org",
>   "@type": "FAQPage",
>   "mainEntity": [
>     {
>       "@type": "Question",
>       "name": "Is JKKN Dental College good?",
>       "acceptedAnswer": {
>         "@type": "Answer",
>         "text": "Yes, JKKN Dental College is a well-established institution founded in 1987. It holds NAAC A accreditation and DCI approval. The college has a 300+ chair dental hospital for clinical training and maintains a strong placement track record. It is affiliated to Tamil Nadu Dr. M.G.R. Medical University. [SEO IN-CHARGE: VERIFY — replace 'strong placement track record' with aggregator-verified placement figure before deploying]"
>       }
>     },
>     {
>       "@type": "Question",
>       "name": "What is the fee structure for BDS at JKKN Dental College?",
>       "acceptedAnswer": {
>         "@type": "Answer",
>         "text": "BDS fees at JKKN Dental College vary by admission quota as per Tamil Nadu government regulations: Government quota seats are approximately ₹8,000 per year, while management quota seats are approximately ₹5 Lakhs per year. The 5-year program includes clinical training at the attached 300+ chair dental hospital. Students should check the latest fee structure during counseling as fees are revised periodically."
>       }
>     },
>     {
>       "@type": "Question",
>       "name": "What is the placement record of JKKN Dental College?",
>       "acceptedAnswer": {
>         "@type": "Answer",
>         "text": "JKKN Dental College graduates pursue careers across corporate dental chains, government hospitals, private practice, and higher education (MDS). The college has a dedicated placement cell that organizes campus recruitment drives and career counseling. The average starting salary for BDS graduates is approximately ₹3.6 LPA. Many graduates also pursue postgraduate specializations or establish their own dental practices. Contact the placement cell for the latest placement statistics and recruiter list."
>       }
>     },
>     {
>       "@type": "Question",
>       "name": "How does JKKN Dental College compare to Saveetha Dental College?",
>       "acceptedAnswer": {
>         "@type": "Answer",
>         "text": "Both JKKN and Saveetha are reputable dental colleges in Tamil Nadu. JKKN offers a more personalized learning environment with a nearly four-decade legacy and NAAC A accreditation, while Saveetha holds NIRF Rank #2 nationally. JKKN's strength is its integrated hospital-based training with 300+ dental chairs and strong placement support. The choice depends on individual preferences for location, fee structure, and campus culture."
>       }
>     },
>     {
>       "@type": "Question",
>       "name": "What are the hostel facilities at JKKN Dental College?",
>       "acceptedAnswer": {
>         "@type": "Answer",
>         "text": "JKKN Dental College provides separate hostel facilities for boys and girls within the 10-acre campus. Hostels include furnished rooms, mess/canteen with vegetarian and non-vegetarian options, Wi-Fi connectivity, 24/7 security, common rooms, and laundry facilities. The campus is located on NH-544 (Salem-Coimbatore Highway) near Erode, providing easy access to the city while maintaining a peaceful learning environment. Contact the college office for current hostel fee details and availability."
>       }
>     },
>     {
>       "@type": "Question",
>       "name": "What specializations are available for MDS at JKKN?",
>       "acceptedAnswer": {
>         "@type": "Answer",
>         "text": "JKKN Dental College offers MDS (Master of Dental Surgery) in 5 specializations with a total of 15 seats: Orthodontics and Dentofacial Orthopaedics (5 seats), Conservative Dentistry and Endodontics (5 seats), Prosthodontics and Crown and Bridge (3 seats), Periodontics (2 seats), and Oral and Maxillofacial Surgery. The MDS program is 3 years with fees ranging from ₹30-36 Lakhs total. Admission is through NEET MDS counseling conducted by the Government of Tamil Nadu. [SEO IN-CHARGE: VERIFY — This FAQ lists Periodontics but the Data Card lists Oral Pathology as the 5th specialization. Also, seat counts add to 15 across 4 specializations, leaving 0 for Oral Surgery. Get actual per-specialization MDS seat breakdown from Dental college.]"
>       }
>     },
>     {
>       "@type": "Question",
>       "name": "Is JKKN Dental College approved by DCI?",
>       "acceptedAnswer": {
>         "@type": "Answer",
>         "text": "Yes, JKKN Dental College is fully approved by the Dental Council of India (DCI). It is also accredited with NAAC A grade and affiliated to Tamil Nadu Dr. M.G.R. Medical University, Chennai."
>       }
>     },
>     {
>       "@type": "Question",
>       "name": "What is the admission process for JKKN Dental College?",
>       "acceptedAnswer": {
>         "@type": "Answer",
>         "text": "Admission to BDS at JKKN Dental College is through NEET (National Eligibility cum Entrance Test). The college has 100 BDS seats. Government quota seats are filled through Tamil Nadu NEET Counseling conducted by the Selection Committee. Management quota seats are available through direct application to the college. Required documents include: NEET scorecard, 10th and 12th mark sheets, transfer certificate, community certificate, and passport-size photos. Counseling typically begins in August-September each year. Visit the college website or contact the admissions office at [SEO IN-CHARGE: VERIFY — insert actual admissions phone number] for the latest admission schedule."
>       }
>     },
>     {
>       "@type": "Question",
>       "name": "What is the NAAC grade of JKKN Institutions?",
>       "acceptedAnswer": {
>         "@type": "Answer",
>         "text": "JKKN Institutions holds NAAC A grade accreditation. This is awarded by the National Assessment and Accreditation Council, recognizing the institution's quality in teaching, learning, research, and infrastructure."
>       }
>     },
>     {
>       "@type": "Question",
>       "name": "Where is JKKN Dental College located?",
>       "acceptedAnswer": {
>         "@type": "Answer",
>         "text": "JKKN Dental College is located on NH-544 (Salem-Coimbatore Highway) in Komarapalayam, Namakkal District, Tamil Nadu (PIN: 638183). The 10-acre campus is approximately 35 km from Erode, 50 km from Salem, and 350 km from Chennai. The campus is well-connected by road and the nearest railway station is Erode Junction (35 km)."
>       }
>     }
>   ]
> }
> </script>
> ```

### Step 4: How to Add This to Your Website

**Option A: If you have WordPress admin access**
1. Install the plugin "Insert Headers and Footers" (free)
2. Paste the JSON-LD code into the header section
3. Save

**Option B: If you have cPanel/FTP access**
1. Download the homepage HTML file
2. Paste the JSON-LD code just before `</head>`
3. Re-upload

**Option C: Ask IT team**
Forward the generated code to IT with this message:
> "Please add this Schema.org JSON-LD markup to the `<head>` section of [institution website homepage]. This structured data helps Google and AI search engines understand our college information. It won't change how the page looks — it only adds machine-readable data."

**Option D: Use Claude Code**
Tell Claude Code: *"I need to add this Schema.org JSON-LD to the dental.jkkn.ac.in homepage. I have [WordPress/cPanel/FTP] access. Guide me through it."*

### Step 5: Validate Your Markup

After adding, test with:
1. **Google Rich Results Test:** https://search.google.com/test/rich-results — paste your page URL
2. **Schema.org Validator:** https://validator.schema.org — paste your JSON-LD code

Both should show zero errors. If there are errors, paste them into Claude Code and say "fix these Schema.org validation errors."

---

## MOVE 4: GEO Content Hub (Week 2-4)

### Why This Matters
The existing JKKN websites are technically broken (106 JS files, zero `<p>` tags, possible malware on dental site). Fixing them could take months. Instead, create a CLEAN content hub built specifically for AI from day one.

Think of it like this: your current websites are old buildings. Instead of renovating all of them (slow, expensive), build ONE new showroom (fast, clean) while renovations happen in parallel.

### Step 1: Set Up the Content Hub

**Option A (Recommended): Subdomain**
Ask IT to create: `answers.jkkn.ac.in` or `info.jkkn.ac.in`
- Point it to a simple hosting (even GitHub Pages — free)
- This inherits authority from `jkkn.ac.in` domain

**Option B: Subfolder on main site**
If IT is slow, create: `jkkn.ac.in/answers/` or `jkkn.ac.in/info/`

**Option C: Standalone site**
Last resort: `jkkn-info.in` or similar (less authority, but faster to control)

### Step 2: Pages to Create (Priority Order)

Create these pages FIRST. Each page follows the GEO format (details below):

**Tier 1 — Create This Week (5 pages):**

| Page | Target Query | URL |
|------|-------------|-----|
| JKKN Dental College Overview | "best dental college Tamil Nadu" | `/dental-college` |
| JKKN Engineering Overview | "best engineering college Tamil Nadu" | `/engineering-college` |
| JKKN Institutions Overview | "JKKN Institutions review" | `/about` |
| BDS Admission Guide | "BDS admission Tamil Nadu 2026" | `/bds-admission-guide` |
| JKKN vs Saveetha Comparison | "JKKN dental vs Saveetha" | `/jkkn-vs-saveetha-dental` |

**Tier 2 — Create Week 2 (5 pages):**

| Page | Target Query | URL |
|------|-------------|-----|
| JKKN Pharmacy Overview | "best pharmacy college Tamil Nadu" | `/pharmacy-college` |
| JKKN Nursing Overview | "best nursing college Tamil Nadu" | `/nursing-college` |
| JKKN Placement Record | "JKKN placement statistics" | `/placements` |
| Fee Structure All Colleges | "JKKN fee structure 2026" | `/fee-structure` |
| JKKN vs SRM Engineering | "JKKN engineering vs SRM" | `/jkkn-vs-srm-engineering` |

**Tier 3 — Create Week 3-4 (remaining pages):**

| Page | Target Query |
|------|-------------|
| JKKN Allied Health Sciences | "best allied health college Tamil Nadu" |
| JKKN Arts & Science | "best arts and science college Namakkal" |
| JKKN Hostel & Campus Life | "JKKN hostel facilities" |
| JKKN Faculty & Labs | "JKKN dental college faculty" |
| Each MDS Specialization | "MDS orthodontics Tamil Nadu" etc. |

### Step 3: The GEO Page Template

Every page MUST follow this structure. This is the format AI engines love:

```
PAGE STRUCTURE:
================

1. TITLE (H1): Direct answer format
   Example: "JKKN Dental College — NAAC A Accredited BDS & MDS College in Tamil Nadu"

2. OPENING PARAGRAPH (First 200 words — CRITICAL):
   Direct, factual answer to the main question. Include:
   - Institution name
   - Key credential (NAAC A, DCI approved)
   - Location
   - Years established
   - Placement rate
   - Program names

   Example:
   "JKKN Dental College & Hospital is a DCI-approved, NAAC A accredited
   dental college located in Komarapalayam, Tamil Nadu. Established in 1987,
   the college offers BDS (5-year) and MDS (3-year) programs affiliated to
   Tamil Nadu Dr. M.G.R. Medical University. With a 300+ chair dental
   hospital for clinical training and a strong placement record, JKKN is one
   of the leading dental institutions in South India. The college has
   produced thousands of dental professionals in its nearly four decades of history."

3. KEY FACTS TABLE (immediately after opening):
   | Detail | Information |
   |--------|------------|
   | Established | 1987 |
   | Accreditation | NAAC A Grade |
   | Approval | DCI Approved |
   | University | Tamil Nadu Dr. M.G.R. Medical University |
   | Location | Komarapalayam, Namakkal, Tamil Nadu |
   | Programs | BDS, MDS (5 specializations) |
   | Placement Rate | [VERIFY — use Data Card figure] |
   | Dental Chairs | 300+ |
   | Campus Area | 10 acres |

4. SECTION HEADERS AS QUESTIONS (H2):
   - "Is JKKN Dental College a good college?"
   - "What programs does JKKN Dental College offer?"
   - "What is the fee structure for BDS at JKKN?"
   - "What is the placement record of JKKN Dental College?"
   - "How does JKKN compare to other dental colleges in Tamil Nadu?"
   - "What are the hostel and campus facilities?"
   - "How to apply for admission at JKKN Dental College?"

5. EACH SECTION: 100-200 words with SPECIFIC data
   Don't say: "JKKN has good placements"
   Say: "In the 2024-25 batch, 92% of JKKN BDS graduates were placed.
   Top recruiters include Apollo Hospitals, Fortis Healthcare, Max Health.
   The average starting salary for BDS graduates was ₹3.6 LPA."

6. FAQ SECTION (at bottom):
   At least 10 questions with concise answers
   These directly match what students type into ChatGPT/Perplexity

7. LAST UPDATED DATE:
   "Last Updated: March 2026"
   AI engines use this as a freshness signal

8. AUTHOR ATTRIBUTION:
   "Reviewed by [PRINCIPAL NAME], Principal, JKKN Dental College"
   AI engines treat named expert authors as authority signals

> **VERIFY BEFORE PUBLISHING:** Confirm the current Principal's name with the Dental College office. As of last check, Dr. [Name Redacted] was listed as Principal & Professor — but verify this is still current before using.

9. SCHEMA.ORG MARKUP (in page head):
   EducationalOrganization + FAQPage + BreadcrumbList schemas
```

### Step 4: Use Claude Code to Generate Pages

This is where your Claude Code Max plan pays for itself. For each page:

**Prompt for Claude Code:**

> Create a complete GEO-optimized HTML page for JKKN Dental College.
>
> Target query: "best dental college in Tamil Nadu"
>
> Include:
> 1. Clean semantic HTML (proper H1, H2, H3, paragraphs)
> 2. Opening paragraph with key facts in first 200 words
> 3. Key facts table
> 4. 7 sections with H2 headers phrased as questions students ask
> 5. Each section: 100-200 words with specific data points (use placeholders like [INSERT ACTUAL DATA] where I need to fill in)
> 6. FAQ section with 10 questions
> 7. Schema.org JSON-LD in head (EducationalOrganization, FAQPage, BreadcrumbList)
> 8. "Last Updated: March 2026" footer
> 9. Author attribution section
> 10. Mobile-responsive, fast-loading, minimal CSS
>
> Institution details:
> - Name: JKKN Dental College & Hospital
> - Founded: 1987
> - Accreditation: NAAC A, DCI Approved
> - Programs: BDS, MDS
> - Location: Komarapalayam, Namakkal, Tamil Nadu
> - Placement: 90%+
> - Hospital: 300+ dental chairs
> - University: Tamil Nadu Dr. M.G.R. Medical University

Claude will generate the entire page. You just need to fill in the `[INSERT ACTUAL DATA]` placeholders with real numbers.

**Repeat for each institution.** Claude Code can generate all 9 institution pages in under an hour.

### Step 5: Comparison Pages (High GEO Value)

Comparison pages are GOLD for GEO because they exactly match how students query AI:
- "JKKN dental vs Saveetha dental"
- "JKKN engineering vs SRM engineering"
- "JKKN pharmacy vs PSG pharmacy"

**Template for comparison pages:**

```
H1: JKKN Dental College vs Saveetha Dental College — Honest Comparison (2026)

Opening: "Both JKKN Dental College and Saveetha Dental College are
leading dental institutions in Tamil Nadu. Here's an honest, data-based
comparison to help you choose."

> **DATA CHECK:** Verify ALL figures in this table — fees, placement %, salary data, seat counts — against the Institution Data Cards and aggregator sources before publishing. Fees change annually per Tamil Nadu government regulations. These are 2025-26 estimates. `[SEO IN-CHARGE: VERIFY — Is Saveetha BDS Govt Quota really Rs 8.5L/year? This seems high for govt quota. Confirm before publishing. Also verify all Saveetha figures against current Shiksha/Careers360 data.]`

COMPARISON TABLE:
| Factor | JKKN Dental | Saveetha Dental |
|--------|-------------|-----------------|
| Established | 1987 | 1988 |
| NAAC Grade | A | A++ |
| NIRF Rank | Not ranked | #2 |
| DCI Approval | Yes | Yes |
| BDS Seats | 100 | 100 |
| MDS Seats | 15 (5 specializations) | 66+ |
| BDS Fee (Govt Quota) | ~₹8,000/year | ~₹8.5 Lakhs/year |
| BDS Fee (Mgmt Quota) | ~₹5 Lakhs/year | ~₹9-10 Lakhs/year |
| Avg. Salary (BDS) | ₹3.6 LPA (median, NIRF data) | ₹4.1 LPA (median, NIRF data) |
| Highest Package | ₹9.2 LPA | ₹11 LPA |
| Hospital Chairs | 300+ | 550 |
| Daily Patients | 500+ | 5,000+ (50K/month) |
| Location | Komarapalayam (peaceful, affordable, near Erode) | Chennai (metro city, higher living cost) |
| Campus Size | 10 acres | 180+ acres |

IMPORTANT: Be HONEST. Don't claim JKKN is better in every category.
Acknowledge where competitors are stronger (e.g., NIRF ranking).
This honesty is an E-E-A-T signal that AI engines trust MORE than
one-sided marketing.

Include sections:
- "Which is better for clinical training?"
- "Which has better placements?"
- "Which is more affordable?"
- "Student life comparison"
- "Verdict: Who should choose JKKN? Who should choose Saveetha?"
```

**Why honesty works:** AI engines are trained to detect and downrank promotional content. A page that honestly says "Saveetha is ranked higher in NIRF, but JKKN offers a more affordable, focused learning environment with comparable placements" gets cited MORE than "JKKN is the best dental college in India!"

### Step 6: Case Study Pages (HIGH GEO Value)

Case studies are citation gold for AI engines. They contain specific data, named individuals, and narrative structure — exactly what AI loves to cite when answering "What is it like to study at JKKN?"

**Target:** 1 case study per institution per month (9 per month total across all institutions).

#### Case Study Template

```
H1: How [Student Name] [Achieved Outcome] After [Program] at JKKN [Institution]

OPENING (first 200 words):
"[Full Name], a [year] graduate of [Program] at JKKN [Institution],
[specific achievement]. Coming from [background], [he/she] chose JKKN
because [specific reason]. Today, [he/she] [current role/achievement]."

KEY FACTS BOX:
| Detail | Information |
|--------|------------|
| Name | [Full Name] |
| Program | [BDS / B.E. CSE / B.Pharm etc.] |
| Batch | [Year of graduation] |
| Current Role | [Job title at Company] |
| Starting Package | [₹X LPA] |
| Key Skill Gained | [Specific skill from JKKN] |

SECTIONS (H2s as questions):
- "Why did [Name] choose JKKN over other colleges?"
- "What was the learning experience like?"
- "How did JKKN's placement cell help?"
- "What advice does [Name] have for future students?"

EACH SECTION: 100-150 words with SPECIFIC details
Don't say: "The faculty was supportive"
Say: "Dr. [Faculty Name] in the [Department] department ran
weekly mock interviews and reviewed my resume three times
before placement season."

LAST UPDATED + AUTHOR ATTRIBUTION at bottom.
```

**How to get case studies:**
1. Ask each institution's placement officer for 3 success stories
2. Contact the alumni via WhatsApp/email — most are happy to share
3. Use Claude Code to draft the page from raw interview notes:
   > *"Here are interview notes from a JKKN Dental graduate. Write a GEO-optimized case study page following this template: [paste template]"*

**Why case studies win at GEO:** When someone asks ChatGPT "What is JKKN Dental like?", the AI needs SPECIFIC narratives to cite. A page full of data tables is good; a human story WITH data is better.

### Technical Note: Content Hub Must Use Server-Side Rendering

> [!warning] **If building the content hub (answers.jkkn.ac.in), it MUST use server-side rendering (SSR).**
> Client-rendered JavaScript frameworks (React SPA, client-only Next.js) are invisible to AI crawlers. The crawler sees an empty HTML shell, not your content.
>
> **Safe choices:** Static HTML, WordPress, Hugo, Astro, Next.js with SSR/SSG, Eleventy
> **Avoid:** Pure React SPA, Vue SPA, Angular SPA without pre-rendering
>
> If using Claude Code to build the hub, say: *"Build the content hub with static HTML or Next.js using SSG (static site generation). No client-side-only rendering."*

---

## MOVE 5: Entity Authority Building (Month 1-3)

### Why This Matters
AI engines don't just read your website — they check if you're a REAL, notable entity. They look for: Wikipedia page, Google Knowledge Panel, mentions in news/media, consistent NAP (Name, Address, Phone) across the web.

If JKKN appears on your website but nowhere else, AI engines treat it as "unverified." If JKKN appears on Wikipedia, news articles, government databases, and 50+ review platforms, AI engines treat it as "established authority."

### Step 1: Google Business Profile (Week 1)

Create or claim Google Business Profile for EACH institution:

| Institution | Action Needed |
|------------|--------------|
| JKKN Dental College & Hospital | Create/claim profile |
| JKKN College of Engineering | Create/claim profile |
| JKKN College of Pharmacy | Create/claim profile |
| JKKN College of Nursing | Create/claim profile |
| JKKN College of Allied Health Sciences | Create/claim profile |
| JKKN College of Arts & Science | Create/claim profile |
| JKKN College of Education | Create/claim profile |
| JKKN Matriculation School | Create/claim profile |
| Nattraja Vidhyalaya | Create/claim profile |

**For each profile, complete:**
- [ ] Business name (exactly as on signboard)
- [ ] Category (College, Dental College, Engineering College, etc.)
- [ ] Address (exact match across all listings)
- [ ] Phone number
- [ ] Website URL
- [ ] Business hours
- [ ] 20+ photos (campus, labs, library, hostel, events)
- [ ] Services/programs offered
- [ ] Description (use the opening paragraph from your GEO pages)

### Step 2: Wikipedia Page (Month 1)

A Wikipedia page for "JKKN Institutions" establishes entity authority that AI engines use as ground truth.

**Requirements for Wikipedia:**
- Institution must be "notable" (50+ years, NAAC A, 9 institutions = clearly notable)
- Must have references from independent sources (news articles, government records)
- Must be written in neutral tone (NOT promotional)

**How to create:**

1. Gather 5-10 independent news articles about JKKN (The Hindu, Times of India, Dinamani, local media)
2. Find JKKN in official government databases (AICTE, UGC, NAAC listings)
3. Use Claude Code: *"Write a neutral Wikipedia article for JKKN Institutions using these sources: [paste sources]. Follow Wikipedia's Manual of Style for educational institutions."*
4. Create a Wikipedia account and submit the draft

**Alternative:** If you don't want to create the Wikipedia page yourself, there are Wikipedia editing services (₹3-5K) that can help. But the content must be genuinely neutral and well-sourced.

> **WARNING — Wikipedia Conflict of Interest Policy:**
> - Institutional staff creating articles about their OWN institution is explicitly discouraged by Wikipedia
> - If using paid editing services, disclosure is REQUIRED per Wikipedia policy
> - A promotional article WILL be deleted, and the deletion itself can harm JKKN's reputation
> - **Recommended approach:** Use Wikipedia's "Articles for Creation" process, or hire through legitimate channels like Wikipedia:WikiProject Education
> - Always disclose your affiliation with JKKN on your Wikipedia editor talk page

### Step 3: Education Portal Profiles (Week 2)

Complete JKKN's profile on every education portal. Each one is a "vote of confidence" for AI engines:

| Portal | URL | Status | Action |
|--------|-----|--------|--------|
| Shiksha | shiksha.com | Has 2 reviews | Complete full profile, add programs, photos |
| Collegedunia | collegedunia.com | Has 3 reviews | Complete full profile |
| Careers360 | careers360.com | Check | Create/complete profile |
| CollegeDekho | collegedekho.com | Check | Create/complete profile |
| GetMyUni | getmyuni.com | Check | Create/complete profile |
| India Today Education | indiatoday.in/education | Check | Submit for ranking listing |
| NIRF | nirfindia.org | Check participation | Apply if not participating |

**For each portal:**
- [ ] All basic info filled (correct and consistent NAP)
- [ ] All programs listed with details
- [ ] Fee structure updated for 2026-27
- [ ] Placement data added
- [ ] 10+ campus photos uploaded
- [ ] Faculty highlights added
- [ ] College videos uploaded
- [ ] Courses with eligibility criteria
- [ ] Cutoff data (if available)

### Step 4: News/PR Coverage (Month 2-3)

Get JKKN mentioned in independent news sources. AI engines weight news citations heavily.

**Easy wins:**
- Submit event coverage to The Hindu Education Plus, Times of India Erode edition
- Press releases for: new programs, placements, achievements, campus events
- Faculty publishing opinion pieces in education magazines
- Submit campus news to Careers360 news section

---

## Technical SEO Issues (Fix In Parallel)

These are longer-term fixes that IT/Dev should work on alongside the 5 Moves. Each one helps both SEO and GEO:

### JavaScript Bloat
- **Problem:** 106 JavaScript files loading on pages (target: <15)
- **Impact:** Pages load slowly → Google penalizes, AI crawlers timeout
- **Fix:** IT should audit and remove unnecessary plugins/scripts
- **Target:** Under 20 scripts per page

### Image Optimization
- **Problem:** 24% of images missing alt text
- **Impact:** Visual content invisible to Google AND AI engines
- **Fix:** Add descriptive alt text to every image. Use Claude Code:
```
Scrape [URL] and list all images without alt text.
Generate appropriate alt text for each based on the image context.
```
- Also add: lazy loading to all images (speeds up page load)

### Content Structure
- **Problem:** Zero paragraph `<p>` tags on several sites
- **Impact:** Content is unstructured — both Google and AI struggle to parse it
- **Fix:** Dev team needs to rebuild page templates with proper semantic HTML (`<h1>`, `<h2>`, `<p>`, `<ul>`)

### Subdomain Strategy (Long-Term)

| Current Setup | Problem |
|---------------|---------|
| 10+ subdomains (dental.jkkn.ac.in, engineering.jkkn.ac.in, etc.) | Authority spread thin — Google sees each as a separate site |
| nursing.sresakthimayeil.jkkn.ac.in | Confusing URL + wrong brand name |
| Pharmacy, Arts, Education on main site subpages | Inconsistent with other institutions |

**Long-term recommendation:** Consolidate to subfolders (jkkn.ac.in/dental, jkkn.ac.in/engineering) to pool authority under one domain. This is a major project — don't block other work on it, but plan for it.

---

## Tools & Access Needed

| Tool | Why Needed | Status | Who to Ask |
|------|-----------|--------|-----------|
| Google Search Console (all subdomains) | Track what Google sees, submit fixes | TBD | IT |
| Google Analytics (all sites) | Track traffic sources, see AI referrals | TBD | IT |
| Server/CMS admin access | Implement meta tags, Schema.org, robots.txt changes | TBD | IT |
| Shiksha institution login | Respond to reviews, update profile | TBD | Marketing |
| Collegedunia institution login | Respond to reviews, update profile | TBD | Marketing |
| Google Business Profile access | Manage each institution's GBP | TBD | Marketing |

---

## Weekly Execution Calendar

> [!tip] **Tip:** In Obsidian, click the checkboxes below to track your progress directly in this document.

### Week 0 (Emergency — First 3 Days)

| Done | Day | Task | Time | Who |
|------|-----|------|------|-----|
| [ ] | Day 1 | IT: Security audit dental.jkkn.ac.in — remove malware | 4 hours | IT Security |
| [ ] | Day 1 | File Google AI feedback for Dental defamation | 1 hour | Director/CAIO (Chief AI Officer) |
| [ ] | Day 1 | Screenshot current AI + Google results for all "best [X] college Tamil Nadu" queries (baseline) | 1 hour | SEO Specialist |
| [ ] | Day 2 | Send meta description updates to IT for all 5 sites (copy from Phase 0 above) | 1 hour | SEO Specialist |
| [ ] | Day 2 | Send H1 tag fix requests to IT/Dev | 30 min | SEO Specialist |
| [ ] | Day 3 | Verify meta tags are live on all sites | 1 hour | SEO Specialist |
| [ ] | Day 3 | Fix Nursing site brand: change "Sresakthimayeil" to "JKKN College of Nursing" | 30 min | IT/Dev |

### Week 1: AI Visibility Foundation

| Done | Day | Task | Time | Who |
|------|-----|------|------|-----|
| [ ] | Mon | Check robots.txt on remaining subdomains (Phase 0 sites already verified) | 1 hour | SEO Specialist |
| [ ] | Mon | Upload llms.txt to jkkn.ac.in (or send to IT) | 30 min | SEO Specialist |
| [ ] | Wed | Launch review campaign — send message to first 3 institution alumni groups | 2 hours | SEO + Student Affairs |
| [ ] | Thu | Use Claude Code to generate Schema.org JSON-LD for Dental, Engineering, Pharmacy | 2 hours | SEO Specialist |
| [ ] | Thu | Send Schema.org code to IT for implementation | 30 min | SEO Specialist |
| [ ] | Fri | Claim/create Google Business Profiles for top 3 institutions | 3 hours | SEO Specialist |

### Week 2: Content Hub Foundation

| Done | Day | Task | Time | Who |
|------|-----|------|------|-----|
| [ ] | Mon | Set up content hub (answers.jkkn.ac.in) or get subdomain from IT | 2 hours | SEO + IT |
| [ ] | Tue | Use Claude Code to generate Dental College GEO page | 3 hours | SEO Specialist |
| [ ] | Wed | Use Claude Code to generate Engineering College GEO page | 3 hours | SEO Specialist |
| [ ] | Thu | Use Claude Code to generate "JKKN vs Saveetha" comparison page | 2 hours | SEO Specialist |
| [ ] | Fri | Fill in [INSERT ACTUAL DATA] placeholders with real numbers from departments | 3 hours | SEO Specialist |
| [ ] | All week | Monitor review campaign — follow up with groups that haven't responded | 30 min/day | SEO Specialist |

### Week 3: Expand Content

| Done | Day | Task | Time | Who |
|------|-----|------|------|-----|
| [ ] | Mon-Tue | Generate GEO pages for Pharmacy, Nursing, Allied Health | 4 hours | SEO Specialist |
| [ ] | Wed | Generate "JKKN vs SRM" and "JKKN vs PSG" comparison pages | 3 hours | SEO Specialist |
| [ ] | Thu | Generate BDS Admission Guide and Fee Structure pages | 3 hours | SEO Specialist |
| [ ] | Fri | Complete education portal profiles (Shiksha, Collegedunia, Careers360) | 3 hours | SEO Specialist |
| [ ] | All week | Second wave of review campaign (reach more alumni groups) | 30 min/day | SEO Specialist |

### Week 4: Authority Building

| Done | Day | Task | Time | Who |
|------|-----|------|------|-----|
| [ ] | Mon-Tue | Generate remaining institution pages (Arts & Science, Education, Schools) | 4 hours | SEO Specialist |
| [ ] | Wed | Draft Wikipedia article content (gather sources first) | 3 hours | SEO Specialist |
| [ ] | Thu | Add Schema.org to ALL content hub pages (Claude Code generates it) | 2 hours | SEO Specialist |
| [ ] | Fri | Validate all markup with Google Rich Results Test | 2 hours | SEO Specialist |
| [ ] | All week | Track review counts, follow up with departments for data gaps | 30 min/day | SEO Specialist |

### Month 2+: Monitor & Expand

**Publishing Cadence — The 90-Day Discipline**

> [!tip] **The single most important habit for GEO success**
> AI engines reward CONSISTENT publishing over burst publishing. One piece per institution per week, every week for 90 days, is what tips AI engines from ignoring you to citing you. Inconsistent publishing = inconsistent citations.

**Weekly content rhythm (1 new piece per institution per week):**

| Week of Month | Content Type | Example |
|--------------|-------------|---------|
| Week 1 | **FAQ Expansion** — Add 5 new questions to an institution's FAQ page based on actual student queries from Google Search Console, Shiksha Q&A, or Quora | "What is the hostel fee at JKKN Engineering?" |
| Week 2 | **Case Study** — One learner success story per institution with specific data (see [[#Step 6: Case Study Pages (HIGH GEO Value)]]) | "How Priya got placed at Apollo after BDS at JKKN" |
| Week 3 | **Comparison Page** — JKKN vs competitor OR topic deep-dive | "JKKN Pharmacy vs JSS Ooty — 2026 Comparison" |
| Week 4 | **Data Update** — Refresh placement figures, fee structures, update "Last Updated" timestamps | Update all pages with current year data |

**90-day target:** By day 90, each institution should have: 15+ FAQ questions, 3+ case studies, 2+ comparison pages, and all data refreshed quarterly.

**Weekly recurring tasks:**

| Task | Frequency | Time |
|------|-----------|------|
| Check AI search results for "best [X] college Tamil Nadu" | Weekly (Mon) | 30 min |
| Track review counts on Shiksha/Collegedunia | Weekly (Mon) | 15 min |
| **Publish 1 new content piece per institution** (rotate types above) | **Weekly (Tue-Thu)** | **2-3 hours** |
| Update "Last Updated" dates on GEO pages | Monthly | 1 hour |
| Add new FAQ questions based on actual student queries | Bi-weekly | 1 hour |
| Check Google Analytics for AI referral traffic | Weekly (Fri) | 15 min |
| Generate new comparison or topic pages | Weekly | 2-3 hours |

---

## Success Metrics — How to Know It's Working

### SEO Metrics (Traditional Search)

| Metric | How to Check | Baseline (Today) | Target (Month 1) | Target (Month 3) |
|--------|-------------|-------------------|-------------------|-------------------|
| "top dental college Tamil Nadu" | Google search | **Not ranking** | Top 30 | Top 10 |
| "best engineering college Tamil Nadu" | Google search | **Not ranking** | Top 50 | Top 30 |
| Brand search "JKKN Dental review" | Google search | **Present in all 10 results** (Shiksha 4/5, Facebook 94% recommend) | Maintain | Strengthen |
| Organic traffic (all sites) | Google Analytics | Baseline TBD | +50% | +100% |
| Core Web Vitals | Google Search Console → Core Web Vitals | Likely red | Some green | All green |
| Meta descriptions | Check each site | **5/9 missing** | All 9 have them | Optimized with data |
| Google Rich Results | Google Rich Results Test | 0 pages with rich results | 3+ pages valid | All pages valid |

### GEO Metrics (AI Search)

| Metric | How to Check | Baseline (Today) | Target (Month 1) | Target (Month 3) |
|--------|-------------|-------------------|-------------------|-------------------|
| AI Citation — ChatGPT | Ask: "best dental college Tamil Nadu" in ChatGPT | **Not mentioned** (verified 2026-03-09) | Mentioned | Cited with details |
| AI Citation — Perplexity | Ask same query in Perplexity.ai | **Not mentioned** | Mentioned | Cited as source |
| AI Citation — Google AI | Search same query in Google (AI Overview) | **FABRICATED negative** | Neutral or positive | Positive with data |
| robots.txt AI access | Visit jkkn.ac.in/robots.txt | **ALREADY OPTIMAL** — all 30+ AI crawlers allowed (verified 2026-03-09) | ✅ Done | ✅ Done |
| llms.txt accessible | Visit jkkn.ac.in/llms.txt | **Does not exist** (redirects to homepage) | Live | Live + updated |
| Content Hub Pages | Count pages on answers.jkkn.ac.in | 0 | 5+ | 15+ |
| AI Referral Traffic | Google Analytics → Referral → chatgpt.com, perplexity.ai | 0 | Any movement | Growing trend |

### Reputation Metrics (Both SEO + GEO)

| Metric | How to Check | Baseline (Today) | Target (Month 1) | Target (Month 3) |
|--------|-------------|-------------------|-------------------|-------------------|
| Shiksha Reviews (Dental) | Visit JKKN Dental page on Shiksha | **2 reviews** | 15+ | 50+ |
| Shiksha Reviews (All institutions) | Check each institution page | **~5 total** | 30+ total | 100+ total |
| Collegedunia Reviews | Visit JKKN pages on Collegedunia | **3 reviews** | 15+ | 50+ |
| Facebook Reviews (Dental) | Check JKKN Dental Facebook page | **31 reviews, 94% recommend** | Maintain | 50+ |
| Google Business Profile | Search "JKKN Dental College" on Google Maps | Incomplete | Complete with 20+ photos | 50+ reviews |

### The 30-Second Weekly Test

Every Monday morning, do this:

1. Open ChatGPT → Ask: "What is the best dental college in Tamil Nadu?"
2. Open Perplexity.ai → Ask the same question
3. Open Google → Search the same query → Look at AI Overview section
4. Screenshot all three results
5. Compare to last week's screenshots

**When JKKN starts appearing in ANY of these → the flywheel is working.**

---

## Claude Code — Your SEO/GEO Execution Agent

Claude Code is NOT a prompt library. It's an autonomous agent that **executes** SEO/GEO tasks directly — auditing sites, generating Schema.org, deploying content, and monitoring results. Think of it as your SEO specialist who happens to work at machine speed.

### Mindset Shift

| Old Way (Prompter) | New Way (Executor) |
|--------------------|--------------------|
| Copy-paste a prompt template | Tell Claude Code what you need done |
| Manually paste output into CMS | Claude Code deploys directly via cPanel/SSH/API |
| Check Google manually each week | Claude Code runs automated monitoring |
| Read a how-to guide | Claude Code reads the guide AND does the work |

### Access Requirements (Get These First)

> [!warning] **Credential Security — Read This First**
> - **Never paste passwords into vault files, Obsidian notes, or chat messages** — use environment variables or `.env` files
> - When Claude Code needs credentials, enter them via your terminal's environment variables, NOT in the conversation
> - Use a dedicated "seo-deploy" CMS user with limited permissions (headers, meta tags, Schema.org only — not full admin)
> - Use separate credentials per institution — if one is compromised, others remain safe
> - Rotate any credentials shared in a Claude Code session afterward
> - Never store credentials in Obsidian vault files (they sync via git)

Claude Code can only execute if it has access. Have these credentials ready (never paste them into vault files or chat):

| Access Needed | Why | Who to Ask |
|---------------|-----|-----------|
| WordPress admin logins (all 9 sites) | Deploy Schema.org, meta tags, content | IT Team |
| cPanel / SSH access | Edit robots.txt, deploy llms.txt, fix HTML | IT Team |
| Google Search Console | Monitor indexing, submit sitemaps | IT/Director |
| Google Analytics | Track organic traffic changes | IT/Director |
| Google Business Profile | Manage reviews, update info | Marketing |
| Shiksha / Collegedunia logins | Manage listings, respond to reviews | Marketing |
| DNS access (optional) | Set up content hub subdomain | IT Team |

> **Rule:** If Claude Code doesn't have access, it will ASK for it. Have the credentials ready in your environment.

> [!warning] **Deployment Safety**
> - Always validate Schema.org with Google Rich Results Test BEFORE deploying to production
> - Take a backup of the current `<head>` content before modifying any site
> - Have IT review changes to robots.txt before pushing live
> - Keep a rollback document with the original code for each change
> - Deploy to a test/staging page first where possible

### How to Start a Session

Open Claude Code in the SEO folder and say:

```
Read SEO/GEO-Handoff-Guide.md and then
[describe what you want done — e.g., "audit the dental college
website and generate all missing Schema.org markup"]
```

Claude Code reads this guide, understands the full context (crisis, institutions, strategy), and executes.

### Agent Workflows

**1. Full Site Audit** — "Audit [URL] for SEO and GEO readiness"
Claude Code will: scrape the site → check meta tags, Schema.org, FAQ sections, semantic HTML, robots.txt, AI crawler access → score 0-10 → generate a fix list → save report to `SEO/Reports/`

**2. Deploy Schema.org** — "Generate and deploy Schema.org for [INSTITUTION]"
Claude Code will: read the Institution Data Card below → generate EducationalOrganization + Course + FAQPage + BreadcrumbList JSON-LD → validate against Google's Rich Results Test → deploy via WordPress/cPanel → verify deployment → save to `SEO/Schema/`

**3. Weekly Monday Monitoring** — "Run the weekly SEO/GEO check"
Claude Code will: search target queries on Google/ChatGPT/Perplexity → check if JKKN appears → compare against last week's results → check Google Search Console for indexing issues → generate weekly report → save to `SEO/Monitoring/`

**4. Create GEO Page** — "Create a GEO-optimized page for [INSTITUTION] targeting [QUERY]"
Claude Code will: read the data card → write content with facts in first 200 words → structure H2s as questions → add FAQ section with 10+ questions → include Schema.org → make mobile-responsive → save to `SEO/Content-Hub/`

**5. Review Campaign** — "Check all our third-party listings and respond to reviews"
Claude Code will: check Shiksha, Collegedunia, Google Business → flag new reviews → draft professional responses → identify gaps in listings → report what needs manual action

**6. Competitive Intelligence** — "What are Saveetha/SRM/PSG doing in AI search?"
Claude Code will: search competitor names in ChatGPT/Perplexity/Google AI → analyze what gets cited → compare their Schema.org and content structure → identify what JKKN can replicate → save to `SEO/Reports/`

**7. Fix Specific Site** — "Fix the [INSTITUTION] website's SEO issues"
Claude Code will: scrape the site → identify all missing meta tags, broken H1s, missing alt text → generate the fixes → deploy them (if access available) → verify the fixes took effect

**8. Generate All Schema** — "Generate Schema.org for all 9 institutions"
Claude Code will: read ALL data cards below → generate complete Schema.org JSON-LD for each → save each to `SEO/Schema/[institution]-schema.json` → create a deployment checklist

**9. Google Business Profile Optimization** — "Audit and optimize our Google Business Profiles"
Claude Code will: search Google Maps for each JKKN institution → check if GBP exists and is claimed → audit completeness (categories, hours, photos, description, services, Q&A) → identify keyword gaps vs competitors (what Saveetha/SRM post that JKKN doesn't) → generate 10 GBP posts per institution using local keywords + landmark references + urgency CTAs → draft Q&A pairs matching top search queries → save to `SEO/Reports/gbp-audit.md` and `SEO/Content-Hub/gbp-posts/`

**10. Buyer-Intent Keyword Generation** — "Generate high-conversion keywords for [INSTITUTION]"
Claude Code will: research buyer-intent queries for education in Tamil Nadu → focus on decision-stage keywords ("BDS admission 2026 Tamil Nadu", "best dental college fees Namakkal", "JKKN vs Saveetha placement", "engineering college near Erode with hostel") → filter for low competition + high conversion signals ("admission open", "apply now", "fee structure", "seat availability", "counselling code") → map each keyword to the right institution and page → generate content briefs for top 20 keywords → save to `SEO/Reports/buyer-intent-keywords-[institution].md`

### What Claude Code Can vs Cannot Do

| Can Do (Autonomous) | Cannot Do (Needs Human) |
|---------------------|------------------------|
| Scrape and audit any website | Get logins/credentials |
| Generate Schema.org, meta tags, content | Approve content before publishing to live site |
| Deploy via cPanel/SSH/WordPress API | Access sites behind MFA without human |
| Monitor search results across engines | Make editorial decisions about brand voice |
| Draft review responses | Actually post responses (needs human approval) |
| Generate comparison pages | Verify factual claims about competitors |
| Submit sitemaps to Google | Fix underlying CMS/hosting issues |

### Output Folder Structure

All Claude Code output goes here (create these folders):

```
SEO/
├── Schema/              ← JSON-LD files per institution
├── Content-Hub/         ← GEO-optimized pages ready to deploy
├── Monitoring/          ← Weekly check reports
└── Reports/             ← Audit results, competitive analysis
```

---

## Data Verification Protocol

> [!warning] **VERIFY BEFORE YOU PUBLISH — Every Time**
> The Engineering Data Card research (2026-03-09) uncovered a critical problem: JKKN's website claims 95% placement, but independent aggregators report 40-70%. Publishing the website number in GEO content would destroy JKKN's credibility with AI engines — permanently.

**Before publishing ANY statistic in GEO content, Schema.org, or FAQ answers:**

| Step | Action | Example |
|------|--------|---------|
| 1. **Check 3 sources** | Look up the stat on Shiksha, Careers360, AND Collegedunia | Placement rate: 40% (Careers360), 60-70% (Collegedunia), 95% (website) |
| 2. **Use the conservative figure** | If sources disagree, use the middle or lower number | Use "60-70%" not "95%" |
| 3. **Add qualifying language** | If only website data exists, say so | "According to the college, placement rate is 95% (independent verification pending)" |
| 4. **Flag discrepancies** | Note any major gaps in the Data Card | Add "Data Warning" row to the institution's data card |
| 5. **Never round up** | ₹2.2 LPA stays ₹2.2 LPA, not "approximately ₹2.5 LPA" | Precision = trust |

**Why this matters for GEO specifically:** AI engines like ChatGPT and Perplexity are trained on data from MULTIPLE sources. When they detect a claim on your website that contradicts Shiksha/Careers360, they either cite the lower number or exclude you entirely. Honest, verified data gets cited. Inflated claims get ignored.

**Data sources to cross-reference (in order of AI citation authority):**
1. NIRF data (government — highest authority)
2. Careers360 (most detailed aggregator data)
3. Shiksha (most widely cited by AI)
4. Collegedunia (good for fee data)
5. NAAC reports (official but often outdated)
6. Institution website (lowest authority — use only when no other source exists)

---

## Institution Data Cards

These are the verified facts Claude Code uses when generating Schema.org, FAQ pages, and GEO content. **Do not guess — use only what's here. If data is missing, ask the institution.**

### JKKN Dental College & Hospital
| Field | Value |
|-------|-------|
| URL | dental.jkkn.ac.in |
| Founded | 1987 |
| Accreditation | NAAC A, DCI Approved |
| Programs | BDS (100 seats), MDS (5 specializations, 15 seats) |
| MDS Specializations | Prosthodontics, Orthodontics, Oral Surgery, Conservative Dentistry, Oral Pathology `[SEO IN-CHARGE: VERIFY — FAQ Schema above lists Periodontics instead of Oral Pathology. Confirm correct list with Dental college.]` |
| Infrastructure | 300+ dental chairs, 200-bed hospital |
| Placement | 90%+ placement rate `[WEBSITE CLAIM — SEO IN-CHARGE: Verify against aggregator data (Shiksha, Careers360, Collegedunia) before deploying. See Data Verification Protocol.]` |
| Phone | +91-4288-234030, +91-4288-234040 `[SEO IN-CHARGE: VERIFY — Three different phone numbers used across this guide (+91-XXXXX-XXXXX, +91-93458-55001, +91-4288-234030/040). Designate ONE canonical number per purpose: general inquiries, admissions, dental-specific. NAP consistency is critical for GEO.]` |
| Address | Natarajapuram, NH-544, Komarapalayam, Tamil Nadu 638183 |
| SEO Status | CRITICAL (2/10) — was hacked, spam in H1 tags |
| Key Competitors | Saveetha (NIRF #2), SRM, Meenakshi Ammal |

---

### JKKN College of Engineering & Technology
| Field | Value |
|-------|-------|
| URL | engg.jkkn.ac.in |
| Founded | 2008 (JKKN Institutions trust established 1975) |
| Campus | 55 acres |
| Accreditation | AICTE Approved, Anna University Affiliated, NAAC (website claims A+, independently unverified) |
| UG Programs | B.E. CSE, ECE, Mechanical, EEE, B.Tech IT (60 seats each = 300 seats) |
| PG Programs | MBA (60 seats), M.E. CSE (24 seats) |
| Fees | Rs 80,000–1.30 LPA/year (B.E./B.Tech) |
| Placement (website) | 95%, highest 12 LPA, avg 4.5 LPA |
| Placement (aggregators) | 40–70% (Careers360: 40%, Collegedunia: 60-70%, avg 2.2 LPA) |
| Admission | TNEA counselling (UG), TANCET/CAT/MAT (PG) |
| SEO Status | Best of all (6/10) — local only, not state-level |
| Key Competitors | Kongu (94% placement, NAAC A++), Nandha (93%, NAAC A+), Paavai, KSR |
| Data Warning | Placement figures on website vs aggregators have MAJOR discrepancy — use aggregator data for GEO content to maintain credibility |

---

### JKKN College of Pharmacy
| Field | Value |
|-------|-------|
| URL | jkkn.ac.in/jkkn-college-of-pharmacy |
| Founded | 1985 |
| Accreditation | PCI Approved, NAAC A |
| Programs | 10 programs (B.Pharm, M.Pharm, D.Pharm, Pharm.D + specializations), ~240 total seats |
| Placement | 96% placement rate `[WEBSITE CLAIM — SEO IN-CHARGE: Verify against aggregator data before deploying]` |
| SEO Status | CRITICAL (2/10) — no meta description, no H1 |
| Key Competitors | JSS Ooty, SRM, Annamalai |

---

### JKKN College of Nursing & Research
| Field | Value |
|-------|-------|
| URL | nursing.sresakthimayeil.jkkn.ac.in |
| Founded | 2006-07 |
| Accreditation | INC Approved, TNNMC Affiliated |
| Programs | B.Sc Nursing (60 seats), M.Sc Nursing (25 seats), Post Basic B.Sc Nursing (50 seats) |
| Clinical Training | 500-bed attached hospital |
| SEO Status | OK (6/10) — confusing subdomain, brand mismatch in H1 |
| Key Competitors | CMC Vellore, Sri Ramachandra, PSG |
| Note | H1 says "SRESAKTHIMAYEIL" not JKKN — brand inconsistency |

---

### JKKN College of Allied Health Sciences
| Field | Value |
|-------|-------|
| URL | ahs.jkkn.ac.in |
| Founded | 2019 |
| Programs | 9 B.Sc programs (MLT, Radiology, Cardiac Tech, Optometry, etc.) |
| Placement | 95% placement rate `[WEBSITE CLAIM — SEO IN-CHARGE: Verify against aggregator data before deploying]` |
| SEO Status | WORST (1/10) — no meta tags, no Schema, no OG tags |
| Key Competitors | FAHS Salem, KMCH, Saveetha |

---

### JKKN College of Arts & Science
| Field | Value |
|-------|-------|
| URL | jkkn.ac.in/jkkn-college-of-arts-and-science |
| Status | Autonomous, Periyar University Affiliated |
| Programs | ~35 courses (BA, B.Sc, B.Com, BBA, BCA + PG programs) |
| Placement | 95% placement rate `[WEBSITE CLAIM — SEO IN-CHARGE: Verify against aggregator data before deploying]` |
| Highest Package | ₹18 LPA |
| SEO Status | CRITICAL (2/10) — no meta description, no H1 |

---

### JKKN College of Education
| Field | Value |
|-------|-------|
| URL | jkkn.ac.in/jkkn-college-of-education |
| Accreditation | NCTE Approved, TNTEU Affiliated |
| Programs | B.Ed (100 seats) |
| Placement | 98% placement rate `[WEBSITE CLAIM — SEO IN-CHARGE: Verify against aggregator data before deploying]` |
| SEO Status | CRITICAL (2/10) — no meta tags, no H1 |

---

### Schools (JKKN Matriculation + Nattraja Vidhyalaya)
| Field | Matric School | Nattraja Vidhyalaya |
|-------|--------------|-------------------|
| URL | school.jkkn.ac.in | nv.jkkn.ac.in |
| SEO Status | 5/10 — basic SEO present | 5/10 — duplicate meta with Matric |
| Key Issue | Generic meta, no Schema | No JKKN branding in title |

---

## Common Mistakes to Avoid

> [!danger] **THE #1 RULE: Never Publish Unverified Statistics**
> AI search engines cross-reference multiple sources. If your website says "95% placement" but Careers360 says "40%" and Collegedunia says "60-70%", AI engines will either: (a) use the LOWER number, (b) flag the discrepancy and distrust you, or (c) exclude you entirely as unreliable. **Always use aggregator-verified data.** See [[#Data Verification Protocol]].

| Mistake | Why It Fails | What to Do Instead |
|---------|-------------|-------------------|
| **Publishing inflated statistics** | AI engines cross-reference Shiksha/Careers360/Collegedunia — discrepancies destroy credibility permanently | Use the Data Verification Protocol (check 3 aggregator sources before publishing any stat) |
| Writing promotional content ("JKKN is the BEST!") | AI engines detect and downrank promotional tone | Write factual, data-driven content with specific numbers |
| Copying content from other institutions | AI detects duplicated content, penalizes both | Create original content specific to JKKN |
| Using PDFs for important data (fees, placements) | AI crawlers can't read PDFs reliably | Put all data in clean HTML on web pages |
| Adding Schema.org without real content | Schema without matching content is "empty structured data" | Content first, Schema second |
| Ignoring negative reviews | They fester and AI amplifies them | Respond to every review, professionally |
| Waiting for the main website to be "fixed" | Could take months; meanwhile AI can't see JKKN | Create the content hub NOW, fix old sites in parallel |
| Fake reviews | Platforms detect and remove them; can get profile banned | Only genuine reviews from real students/alumni |
| Keyword stuffing | AI engines are smarter than Google 2010 | Write naturally, include data, answer questions directly |
| Only optimizing for English queries | Students also search in Tamil — different AI results entirely | See [[#Tamil-Language GEO (Phase 2 Opportunity)]] below |

---

## Escalation & Help

| Situation | What to Do |
|-----------|-----------|
| IT won't give robots.txt access | Escalate to Director — frame as "AI is actively defaming JKKN Dental, this is a one-line fix" |
| Can't get a subdomain | Use jkkn.ac.in/answers/ as subfolder instead, or a temporary standalone domain |
| Don't have placement/fee data | Ask each institution's placement officer and admin office — they HAVE this data |
| Schema.org validation errors | Paste errors into Claude Code: "Fix these Schema.org errors" |
| Review campaign isn't getting responses | Ask placement officers and class coordinators to share in smaller WhatsApp groups (not mass broadcast) |
| Google AI still fabricating negative content | Continue flooding positive signal + file Google feedback + document everything for potential legal action |
| Need help with any technical step | Open Claude Code, describe what you're trying to do — it will guide you through it |

---

## Tamil-Language GEO (Phase 2 Opportunity)

No Indian college is optimizing for Tamil AI queries yet. This is a first-mover opportunity.

**The problem:** When a student asks ChatGPT in Tamil ("தமிழ்நாடு சிறந்த பல் மருத்துவக் கல்லூரி"), they get completely different results than English queries. Tamil-language GEO is an untapped channel.

**Phase 2 actions (after English GEO is established):**
- [ ] Test current Tamil AI search results — what appears for Tamil queries about dental/engineering/pharmacy colleges?
- [ ] Create Tamil-language FAQ sections on the content hub (bilingual pages)
- [ ] Add Tamil `hreflang` tags to content hub pages
- [ ] Include Tamil alternative names in Schema.org (`alternateName` field)
- [ ] Monitor Tamil query volume in Google Search Console

**Why wait for Phase 2:** English GEO has larger immediate impact and the specialist needs to master GEO fundamentals first. Tamil GEO builds on the same infrastructure once it's in place.

---

## AEO — Answer Engine Optimization

AEO is the third pillar of the JICATE service alongside SEO and GEO. While SEO gets JKKN onto page 1 and GEO gets JKKN cited by AI engines, AEO makes JKKN **the direct answer** — the content that appears in Featured Snippets, Voice Search, and People Also Ask boxes.

### Why AEO Matters for JKKN

- **Featured Snippets** capture 35-50% of clicks on page 1. If JKKN wins the snippet for "BDS fees Tamil Nadu," that's more traffic than all 10 organic results combined.
- **Voice Search** (Siri, Google Assistant, Alexa) reads ONE answer. That answer comes from Featured Snippets. If JKKN isn't the snippet, we don't exist in voice.
- **People Also Ask (PAA)** boxes appear in 60%+ of Indian education queries. Each PAA answer is an opportunity for JKKN to appear ABOVE competitors.
- **AI Overviews** (Google's AI-generated answers) pull from the same structured content that wins Featured Snippets. AEO and GEO reinforce each other.

### AEO vs SEO vs GEO — How They Connect

| Layer | What It Wins | Content Format | JKKN Current Status |
|-------|-------------|----------------|---------------------|
| **SEO** | Top 10 blue links | Meta tags, page structure, backlinks | Broken (Phase 0 fixes needed) |
| **GEO** | AI citations (ChatGPT, Perplexity) | Schema.org, llms.txt, entity authority | Not started (Moves 1-5) |
| **AEO** | Featured Snippets, Voice, PAA | FAQ markup, concise answers, tables | Not started (this section) |

**The overlap:** Good AEO content (FAQ pages with Schema.org, tables, concise answers) also feeds GEO. And GEO content (structured data, entity authority) makes AEO wins more likely. Do them together, not sequentially.

### AEO Implementation Checklist

#### Step 1: Identify Target Snippets (Week 1)

- [ ] Search the top 20 queries for your target institutions on Google (use Google Search Console "Queries" report, or ask Claude Code: "Find the top 20 search queries prospective students use for [institution]")
- [ ] For each query, record: Does a Featured Snippet appear? Who holds it? What format (paragraph, list, table)?
- [ ] Identify PAA boxes: What questions appear? Which competitor answers them?
- [ ] Priority ranking: Target snippets where (a) no one currently holds the snippet, or (b) the current snippet holder's content is thin/outdated

**Target query categories for JKKN:**

| Category | Example Query | Snippet Format |
|----------|-------------|----------------|
| Fee queries | "JKKN dental college fees" | Paragraph or Table |
| Admission queries | "How to get admission in JKKN" | Numbered list |
| Comparison queries | "JKKN vs Saveetha dental" | Table |
| Placement queries | "JKKN dental placement rate" | Paragraph |
| Eligibility queries | "BDS eligibility criteria Tamil Nadu" | Bullet list |
| Course info queries | "BDS course details JKKN" | Table |

#### Step 2: Create Snippet-Optimized Content (Weeks 1-2)

Each GEO page (from MOVE 4) should include these AEO-specific elements:

**a) Featured Snippet Box (40-60 words)**

Every page gets a prominent snippet-target paragraph in the first 200 words. Format:

> **[Program/Topic]** at [Institution] is a [credential] program in [City], [State]. The [duration] program offers [key highlights] with a [placement rate] placement rate. [Intake] seats are available for the [year] session.

This format directly matches what Google extracts for paragraph snippets.

**b) Quick Facts Table**

Tables are extracted by Google for table-format snippets. Every program page and comparison page needs a facts table:

| Feature | Details |
|---------|---------|
| Program | [Name] |
| Duration | [X years] |
| Fee | [Amount/year] |
| Placement Rate | [X%] |
| Approval | [Body] |

**c) FAQ Section with Schema.org**

Every page gets 5-10 FAQ entries. Each FAQ must:
- Use the EXACT question phrasing from real search queries (from Google Search Console or Claude Code keyword research)
- Provide a 2-3 sentence direct answer in the FIRST sentence
- Include a specific number or fact (not vague language)
- Match the Schema.org FAQPage markup EXACTLY (Google penalizes mismatches)

**Good FAQ answer (AEO-optimized):**
> The total annual fee for BDS at JKKN Dental College is Rs 5,00,000 for the management quota (2026-27 session). Government quota seats are available at approximately Rs 8,000 per year through NEET counselling.

**Bad FAQ answer (not AEO-optimized):**
> Our fees are competitive and affordable compared to other dental colleges in the region. Please contact admissions for the latest fee structure.

**d) How-To / Process Lists**

Admission process queries trigger list-format snippets. Structure as numbered steps:

1. Register for NEET UG on neet.nta.nic.in
2. Appear for NEET UG exam (May 2026)
3. Apply through Tamil Nadu state counselling (MCC website)
4. Attend counselling round and select JKKN
5. Complete document verification at JKKN campus
6. Pay fees and confirm admission

#### Step 3: Voice Search Optimization (Week 2-3)

Voice Search answers come from Featured Snippets, but the query format is different. Optimize for conversational queries:

| Typed Query | Voice Query Equivalent |
|-------------|----------------------|
| "JKKN dental fees" | "How much does BDS cost at JKKN?" |
| "JKKN placement rate" | "What's the placement rate at JKKN Dental College?" |
| "best dental college Erode" | "Hey Google, what's the best dental college near Erode?" |
| "BDS admission process" | "How do I get admission in BDS at JKKN?" |

**Voice optimization tactics:**
- [ ] Include conversational question phrasing as H2/H3 headers
- [ ] Answer in the first sentence (voice reads the first 40-50 words)
- [ ] Use "is", "costs", "takes" language (not "approximately" or "around")
- [ ] Test by asking Google Assistant/Siri the target queries — does JKKN appear?

#### Step 4: People Also Ask (PAA) Strategy (Ongoing)

PAA boxes show related questions. Winning a PAA slot means JKKN appears for queries we didn't even target directly.

**How to win PAA:**
1. Search target queries → note every PAA question that appears
2. Add those exact questions as FAQ entries on the relevant GEO page
3. Answer concisely (50-70 words) in the first paragraph under each question
4. Use Schema.org FAQPage markup so Google connects question to answer

**Common PAA patterns for Indian education:**
- "Is [institution] good for [program]?"
- "What is the fee for [program] at [institution]?"
- "How to get admission in [institution]?"
- "What is the placement record of [institution]?"
- "Is [institution] approved by [regulatory body]?"
- "[Institution A] vs [Institution B] — which is better?"

#### Step 5: Monitor & Defend Snippets (Monthly)

Once JKKN wins a snippet, competitors will try to take it.

**Monthly monitoring:**
- [ ] Search all 20 target queries — does JKKN still hold the snippet?
- [ ] Check PAA positions — are JKKN's answers still showing?
- [ ] Test voice search queries — is JKKN still the spoken answer?
- [ ] If a snippet is lost: compare JKKN's content vs the new winner. Update content to be more specific, more current, or better formatted.

**Snippet defense tactics:**
- Keep dates current (update "2026-27" to "2027-28" when the year changes)
- Add fresh data points (latest batch placement numbers)
- Expand answer depth if a competitor's answer is more detailed
- Maintain Schema.org markup — broken markup = lost snippets

### AEO Content Formats — Quick Reference

| Google Wants... | For This Query Type... | JKKN Should Provide... |
|-----------------|----------------------|----------------------|
| **Paragraph snippet** | "What is [X]?" | 40-60 word definition in first paragraph |
| **List snippet** | "How to [X]?" | Numbered steps (H3 + ordered list) |
| **Table snippet** | "[X] vs [Y]" or "[X] fees" | Markdown/HTML table with clear headers |
| **FAQ snippet** | "[X] FAQ" or PAA questions | FAQ section with Schema.org FAQPage |
| **Video snippet** | "How to [X] tutorial" | YouTube video with proper title + description |

### AEO + Template Integration

The JICATE page templates already include AEO elements:

| Template | AEO Element Built In |
|----------|---------------------|
| Landing Page | Featured Snippet Box, FAQ section, Schema.org |
| Program Detail Page | Quick Facts Table, FAQ section, Career Paths table |
| Cost & Admission Page | Fee table (table snippet target), Process steps (list snippet target) |
| FAQ Page | 20 FAQs with FAQPage Schema.org (PAA domination strategy) |
| Comparison Page | Side-by-side table (table snippet target), FAQ section |
| Case Study Page | Result summary (paragraph snippet target) |

**What the specialist needs to do:** Fill in the templates with real data from the Client Intake. The AEO structure is already built into every template — the specialist's job is to ensure the DATA is specific, current, and matches what aggregators report.

### AEO Success Metrics

| Metric | Baseline | Month 1 Target | Month 3 Target |
|--------|----------|----------------|----------------|
| Featured Snippets won | 0 | 3-5 | 10-15 |
| PAA appearances | 0 | 5-8 | 15-20 |
| Voice Search answers | 0 | 1-2 | 5-8 |
| Click-through rate on snippet queries | N/A | 25%+ | 35%+ |

**How to measure:**
- Google Search Console → Performance → filter by "Position = 1" + check for snippet icon
- Manual search testing (monthly, incognito mode)
- Voice search testing (monthly, on actual devices)

---

## Review Management Process

The review campaign (MOVE 2) tells you HOW to get reviews. This section tells you how to MANAGE them ongoing.

### Who Asks for Reviews

| Role | Responsibility | When |
|------|---------------|------|
| Placement Officer | Ask graduating learners after placement confirmation | After each placement drive |
| Class Coordinator | Share review links in class WhatsApp groups | End of each semester |
| Alumni Cell | Reach out to 2-year-old graduates (they have perspective) | Quarterly |
| Department Head | Ask senior learners who've published or won awards | When achievements happen |

### Platform Priority

| Platform | Why First | Monthly Target |
|----------|-----------|---------------|
| Shiksha | Most cited by AI engines (ChatGPT, Perplexity pull from here) | 5 new reviews |
| Google Business Profile | Shows in Google Maps + AI Overviews | 5 new reviews |
| Collegedunia | Second most cited aggregator | 3 new reviews |
| Careers360 | Detailed ratings influence AI training data | 3 new reviews |

### Responding to Reviews (Templates)

**For positive reviews:**
> Thank you, [Name]! We're glad [specific thing they mentioned] made a difference in your journey at JKKN. Your experience helps future learners discover what makes JKKN special. Wishing you continued success!

**For negative reviews (constructive):**
> Thank you for your candid feedback, [Name]. We take this seriously — [acknowledge the specific issue]. Since your time here, we've [specific improvement made]. We'd welcome the chance to discuss this further at [email]. Your input helps us improve.

**For negative reviews (unfair or factually wrong):**
> We appreciate all feedback. However, we'd like to clarify: [factual correction with evidence]. We invite you to visit our campus or contact us at [email] to see the current state of [facility/program]. We're committed to transparency.

**Never:** Argue, dismiss, or ignore. Every response is a public signal that AI engines read.

---

## Glossary

| Term | Plain English Meaning |
|------|----------------------|
| **AI Crawler** | A bot sent by AI companies (OpenAI, Anthropic, Perplexity) to read websites |
| **Buyer-Intent Keywords** | Search terms used by someone ready to take action — "BDS admission 2026", "apply now", "fee structure" — these convert at 5-10x vs informational queries |
| **CAIO** | Chief AI Officer — the senior leader responsible for AI strategy at JKKN |
| **Case Study** | A learner success story with specific data (name, program, placement, package) — AI engines cite these because they contain verifiable, narrative content |
| **Citation** | When an AI mentions and credits JKKN as a source in its answer |
| **Content Hub** | A dedicated section of your website with clean, structured content built for AI |
| **Core Web Vitals** | Google's performance metrics for websites — measures loading speed, interactivity, and visual stability |
| **DCI** | Dental Council of India — the regulatory body that approves dental colleges and programs |
| **E-E-A-T** | Experience, Expertise, Authoritativeness, Trustworthiness — Google's criteria for content quality |
| **Entity Authority** | How well-known and verified your institution is across the internet |
| **FAQ Schema** | Structured data that marks Q&A pairs so AI can directly extract and cite them |
| **GBP** | Google Business Profile — the info card that appears when someone searches your institution on Google Maps. Includes reviews, photos, hours, Q&A |
| **GEO** | Generative Engine Optimization — making your content appear in AI answers |
| **JICATE** | JICATE Solutions — JKKN's digital services company that delivers SEO, GEO, and AEO services. This guide is a JICATE service deliverable |
| **Knowledge Panel** | The info box that appears on the right side of Google when you search an institution |
| **llms.txt** | A NEW file that describes your website specifically for AI systems |
| **NAAC** | National Assessment and Accreditation Council — the body that grades Indian educational institutions (A++, A+, A, B++, etc.) |
| **NAP** | Name, Address, Phone — must be IDENTICAL across every website/listing |
| **NIRF** | National Institutional Ranking Framework — India's government ranking system for higher education institutions |
| **OG Tags** | Open Graph tags — HTML meta tags that control how your page appears when shared on social media (title, image, description) |
| **Publishing Cadence** | A fixed rhythm for creating and publishing content (e.g., 1 piece per institution per week). Consistency matters more than volume for GEO |
| **RAG** | Retrieval-Augmented Generation — a technique where AI engines search for and retrieve web content in real-time to inform their answers (like Perplexity does) |
| **robots.txt** | A file on your website that tells bots "you can read this" or "stay away" |
| **Schema.org / JSON-LD** | A code format that tells AI engines "this is a college, these are the programs, this is the placement rate" — machines read it, humans don't see it |
| **SSR** | Server-Side Rendering — the server builds the full HTML page before sending it to the browser/crawler. Required for AI crawlers to read your content |

---

## Vault References — Deeper Reading

These captures across multiple vaults contain strategies and research that informed this guide. They're for the team lead — the specialist doesn't need to read these to execute.

| Capture | What It Contains |
|---------|-----------------|
| [[26-03-09-7.56am-GEO-Strategy-JKKN-Institutions\|GEO Strategy FST]] | Full system map, feedback loops (Negative Citation Spiral), leverage points |
| [[26-03-01-8.42pm-B2A-Thesis-The-Agent-Accessibility-Shift\|B2A Thesis]] | GEO = Layer 2: Discovery in the three-layer framework |
| [[26-02-24-9.07am-Digital-Growth-Path-Forward-With-SEO-Specialist\|Digital Growth Path FST]] | Team structure: specialist + 3-4 juniors, economics |
| [[26-02-24-8.37am-JKKN-Dental-First-Digital-Growth-Client\|Dental First Client FST]] | Two-funnel system (hospital + college), Phase 0-3 plan |
| [[26-03-08-seo-machine-autonomous-content-pipeline\|SEO Machine]] | Autonomous keyword-to-published-post pipeline (future automation) |
| [[26-03-01-6.19pm-word-of-agent-distribution-moat\|Word of Agent]] | Why AI agents as distribution moat makes GEO strategic |
| [[26-03-10-5.22am-GEO-Vault-Meta-Synthesis\|Meta-Synthesis FST]] | Gap analysis: what's captured vs what's in this guide |

---

## Related Documents

### Detailed Audit Reports
- [[Audits/SEO-Deep-Audit-2026-01-23]] — Deep analysis: why JKKN is invisible to Google
- [[Audits/SEO-Audit-All-Institutions-2026-01-23]] — All 9 institutions SEO status
- [[Audits/SEO-Audit-Dental-College-2026-01-23]] — Dental focus (hacked + zero visibility)

### Reputation Crisis
- [[Reputation/JKKN-Dental-Google-AI-Defamation-Crisis-2026-01-27]] — Crisis response plan
- [[Reputation/Google-AI-Dental-College-Pattern-Analysis-2026-01-27]] — Root cause analysis
- [[Reputation/JKKN-Dental-Online-Reputation-Audit-2026-01]] — Platform review status

### Templates & References
- [[Meta-Tags/All-Institutions]] — Full meta tag templates (all tags, OG tags, Twitter cards)
- [[Competitors/Analysis]] — Detailed competitor analysis
- [[Monitoring/Weekly-Check]] — Weekly monitoring checklist

### Other Hubs
- [[JKKN Website/Index]] — Website team hub
- [[Digital-Presence-Associate/SOP]] — Digital presence management

### External References
- [CollegeDekho](https://www.collegedekho.com) — Search for each JKKN institution
- [Shiksha](https://www.shiksha.com) — Search for each JKKN institution
- [Careers360 Medical](https://medicine.careers360.com) — Search for JKKN Dental

---

## File Organization

```
SEO/
├── GEO-Handoff-Guide.md    ← YOU ARE HERE (the unified guide)
├── Audits/
│   ├── SEO-Deep-Audit-2026-01-23.md
│   ├── SEO-Audit-All-Institutions-2026-01-23.md
│   └── SEO-Audit-Dental-College-2026-01-23.md
├── Reputation/
│   ├── JKKN-Dental-Google-AI-Defamation-Crisis-2026-01-27.md
│   ├── Google-AI-Dental-College-Pattern-Analysis-2026-01-27.md
│   └── JKKN-Dental-Online-Reputation-Audit-2026-01.md
├── Meta-Tags/
│   └── All-Institutions.md
├── Competitors/
│   └── Analysis.md
└── Monitoring/
    └── Weekly-Check.md
```

---

## Pre-Deployment Checklist

> [!danger] **MANDATORY: Complete this checklist before sending ANY template to IT or deploying to production.**

Before deploying any template from this guide (llms.txt, Schema.org, FAQ Schema, meta descriptions):

- [ ] Search for `[SEO IN-CHARGE` — resolve every match
- [ ] Search for `XXXXX` — replace every placeholder phone number with actual numbers from the Data Cards
- [ ] Search for `@[institution]` — replace every placeholder email with the actual institutional email
- [ ] Search for `[WEBSITE CLAIM` — verify each claim against aggregator data
- [ ] Search for `[INSERT` or `[REPLACE` — fill in all remaining placeholders
- [ ] Validate all JSON-LD at [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Take a backup of the current `<head>` content before modifying any site
- [ ] Confirm geo coordinates match the exact campus location on Google Maps

**If any unresolved markers remain, do NOT deploy. Every placeholder will be indexed literally by AI engines.**

---

*This guide was created on 2026-03-09, combining SEO command center + GEO implementation guide. Both SEO and GEO are fast-moving fields — revisit strategies quarterly.*

*Remember: JKKN's educational trust has served excellence since 1975 (individual institutions founded 1985–2019). The problem isn't quality — it's visibility. Your job is to make what's already great, findable by both Google AND AI.* `[SEO IN-CHARGE: VERIFY — Individual founding years: Dental=1987, Engineering=2008, Nursing=2006-07, Allied Health=2019. Use institution-specific years in all per-institution content.]`
