-- ============================================
-- Blog post seed: "From Campus to Career" session 2026 + new "Education" category
-- ============================================
-- Purpose: Create the "Education" blog category (did not exist) and insert the
--          post-event recap "From Campus to Career: How Innovation & Entrepreneurship
--          Drive Business Success" as a DRAFT on the Main institution site.
-- Created: 2026-06-09
-- Dependencies: blog_categories, blog_posts, profiles (author lookup by email)
-- Security: n/a (content seed; RLS bypassed via service role)
-- Institution(s): main (pmqodbfhsejbvfbmsfeq)
-- Notes:
--   * content stored as jsonb { type:'html', html:'...' } to match the TipTap
--     editor's saved format (app/(public)/blog/[slug] ContentRenderer expects this).
--   * HTML uses only semantic blocks (h2/h3/p/ul/blockquote/table) so the public
--     page's hand-defined `.prose` rules (app/globals.css) space it correctly.
--   * featured_image LEFT NULL on purpose: no image asset was provided, and the
--     media-library-first rule forbids base64/invented URLs. Add via the media
--     picker before publishing.
--   * status = 'draft' (publishing is an outward-facing action; awaiting review).
-- ============================================

WITH cat AS (
  INSERT INTO blog_categories (name, slug, description, icon, color, sort_order, is_active, category_type)
  VALUES (
    'Education',
    'education',
    'Educational sessions, academic events, workshops, and learning insights across JKKN Institutions.',
    'GraduationCap',
    '#0b6d41',
    14,
    true,
    'blog'
  )
  RETURNING id
),
author AS (
  SELECT id FROM profiles WHERE email = 'sangeetha_v@jkkn.ac.in' LIMIT 1
)
INSERT INTO blog_posts (
  title, slug, excerpt, content, author_id, created_by,
  category_id, status, visibility, reading_time_minutes,
  is_featured, allow_comments, seo_title, seo_description, seo_keywords
)
SELECT
  'From Campus to Career: How Innovation & Entrepreneurship Drive Business Success — Session Highlights at JKKN College of Engineering and Technology',
  'campus-to-career-innovation-entrepreneurship-session-2026',
  'The Department of Management Studies at JKKN College of Engineering and Technology organized a session on "From Campus to Career: How Innovation & Entrepreneurship Drive Success in Today''s Business World & Motivation" on February 5, 2026, led by Mr. Satyabrata Duttagupta of Myra School of Business.',
  jsonb_build_object('type', 'html', 'html', $html$
<p><strong>Quick Summary:</strong> The Department of Management Studies at JKKN College of Engineering and Technology successfully organized a session on "From Campus to Career: How Innovation &amp; Entrepreneurship Drive Success in Today's Business World &amp; Motivation" on February 5, 2026. Led by Mr. Satyabrata Duttagupta from Myra School of Business, the session equipped Learners with career-defining insights on innovation and entrepreneurship.</p>

<h2 id="in-this-article">In this article</h2>
<ul>
  <li><a href="#session-overview">Session Overview</a></li>
  <li><a href="#about-resource-person">About the Resource Person</a></li>
  <li><a href="#key-takeaways">Key Takeaways from the Session</a></li>
  <li><a href="#why-it-matters">Why This Session Matters</a></li>
  <li><a href="#faqs">FAQs</a></li>
  <li><a href="#next-steps">Next Steps</a></li>
</ul>

<h2 id="session-overview">Session Overview</h2>
<p>The Department of Management Studies at JKKN College of Engineering and Technology organized a motivational session titled "From Campus to Career: How Innovation &amp; Entrepreneurship Drive Success in Today's Business World &amp; Motivation" on February 5, 2026, at Senthuraja Hall. The session was conducted from 10.00 AM to 12.30 PM.</p>
<p>This initiative reflects JKKN's dedication to preparing Management Studies Learners not just with academic knowledge but with the entrepreneurial mindset and professional skills needed to succeed in today's rapidly evolving business landscape.</p>
<p><strong>Key Highlights:</strong></p>
<ul>
  <li>Expert-led session by a senior business school professional</li>
  <li>Focused on innovation, entrepreneurship, and career readiness</li>
  <li>Practical business world insights for management Learners</li>
  <li>Motivational strategies for professional success</li>
</ul>

<h2 id="about-resource-person">About the Resource Person</h2>
<p>The session was delivered by Mr. Satyabrata Duttagupta, Head Admissions and Marketing, Myra School of Business. With extensive experience in business education, admissions strategy, and marketing leadership, Mr. Duttagupta brought a unique perspective that blended academic insight with real-world business acumen.</p>
<p>His session helped Learners understand how innovation and entrepreneurial thinking are no longer optional skills — they are essential drivers of career success in every industry.</p>
<blockquote>
  <p>"The business world doesn't just reward knowledge — it rewards those who innovate, take initiative, and think like entrepreneurs, regardless of whether they start a company or join one."</p>
  <p>— Mr. Satyabrata Duttagupta, Head Admissions and Marketing, Myra School of Business</p>
</blockquote>

<h2 id="key-takeaways">Key Takeaways from the Session</h2>
<h3>What Does "From Campus to Career" Mean?</h3>
<p>"From Campus to Career" represents the critical transition that management Learners make when they move from academic environments into the professional business world. This session focused on how innovation and entrepreneurship serve as the bridge between classroom learning and career success — equipping Learners with mindsets and strategies that go beyond traditional textbook knowledge.</p>
<h3>How Do Innovation and Entrepreneurship Drive Business Success?</h3>
<p>Innovation and entrepreneurship are the twin engines of modern business success. Innovation enables professionals to create new value — whether through products, processes, or strategies — while entrepreneurial thinking empowers individuals to identify opportunities, take calculated risks, and lead initiatives that drive organizational growth.</p>
<h3>Session Details at a Glance</h3>
<table>
  <thead>
    <tr><th>Detail</th><th>Information</th></tr>
  </thead>
  <tbody>
    <tr><td>Session Title</td><td>From Campus to Career: How Innovation &amp; Entrepreneurship Drive Success in Today's Business World &amp; Motivation</td></tr>
    <tr><td>Date</td><td>February 5, 2026</td></tr>
    <tr><td>Time</td><td>10.00 AM to 12.30 PM</td></tr>
    <tr><td>Venue</td><td>Senthuraja Hall</td></tr>
    <tr><td>Organizing Department</td><td>Department of Management Studies</td></tr>
    <tr><td>Institution</td><td>JKKN College of Engineering and Technology</td></tr>
    <tr><td>Resource Person</td><td>Mr. Satyabrata Duttagupta, Head Admissions and Marketing, Myra School of Business</td></tr>
  </tbody>
</table>

<h2 id="why-it-matters">Why This Session Matters</h2>
<p>In an era where startups are reshaping industries and corporate innovation is a top priority, management Learners need more than textbook knowledge. They need exposure to real-world business thinking, entrepreneurial strategy, and the motivation to lead. Here is why this session was significant:</p>
<h3>1. Industry-Relevant Career Preparation</h3>
<p>Mr. Satyabrata Duttagupta's insights gave Learners a clear understanding of what the business world expects from fresh management graduates — skills in innovation, adaptability, and entrepreneurial problem-solving.</p>
<h3>2. Entrepreneurial Mindset Development</h3>
<p>The session helped Learners see entrepreneurship not just as starting a business, but as a way of thinking that applies to every career path — from corporate roles to independent ventures.</p>
<h3>3. Motivation for Professional Excellence</h3>
<p>Beyond skills and knowledge, the motivational component of the session empowered Learners to approach their careers with confidence, purpose, and a proactive attitude.</p>
<h3>4. Bridging Academia and Industry</h3>
<p>Sessions like these are central to JKKN's approach of complementing academic programs with direct industry engagement, ensuring Learners are career-ready from day one.</p>

<h2 id="commitment">JKKN's Commitment to Career-Ready Education</h2>
<p>JKKN College of Engineering and Technology, part of JKKN Institutions — a premier educational group with 70+ years of excellence — consistently delivers industry-aligned learning experiences. The Department of Management Studies focuses on producing future business leaders through a combination of academic rigour, industry exposure, and hands-on skill development.</p>
<h3>JKKN Management Studies at a Glance</h3>
<table>
  <thead>
    <tr><th>Detail</th><th>Information</th></tr>
  </thead>
  <tbody>
    <tr><td>Institution</td><td>JKKN College of Engineering and Technology</td></tr>
    <tr><td>Parent Group</td><td>JKKN Institutions (Established 1954)</td></tr>
    <tr><td>Department</td><td>Department of Management Studies</td></tr>
    <tr><td>Accreditations</td><td>AICTE Approved</td></tr>
    <tr><td>Focus Areas</td><td>Innovation, Entrepreneurship, Leadership, Industry Readiness</td></tr>
  </tbody>
</table>

<h2 id="faqs">Frequently Asked Questions</h2>
<h3>What was the "From Campus to Career" session at JKKN about?</h3>
<p>The session on "From Campus to Career: How Innovation &amp; Entrepreneurship Drive Success in Today's Business World &amp; Motivation" was organized by the Department of Management Studies at JKKN College of Engineering and Technology on February 5, 2026. It focused on how innovation and entrepreneurship drive career success in the modern business world.</p>
<h3>Who was the Resource Person for this session?</h3>
<p>Mr. Satyabrata Duttagupta, Head Admissions and Marketing, Myra School of Business, served as the Resource Person for this motivational session.</p>
<h3>Which department organized this session?</h3>
<p>The session was organized by the Department of Management Studies at JKKN College of Engineering and Technology.</p>
<h3>Why is entrepreneurship important for management Learners?</h3>
<p>Entrepreneurship equips management Learners with the ability to identify opportunities, solve problems creatively, take initiative, and lead innovation — skills that are highly valued in both corporate careers and independent ventures.</p>
<h3>What programs does the Department of Management Studies at JKKN offer?</h3>
<p>The Department of Management Studies at JKKN College of Engineering and Technology offers AICTE-approved MBA programs focused on innovation, leadership, and industry readiness. Visit <a href="https://engg.jkkn.ac.in/">engg.jkkn.ac.in</a> or contact 93458 55001 for details.</p>
<h3>How can I attend future sessions at JKKN College of Engineering and Technology?</h3>
<p>To stay updated on upcoming sessions, workshops, and events at JKKN College of Engineering and Technology, visit <a href="https://engg.jkkn.ac.in/">engg.jkkn.ac.in</a> or contact the admissions helpline at 93458 55001.</p>

<h2 id="key-takeaways-recap">Key Takeaways</h2>
<ul>
  <li>JKKN College of Engineering and Technology successfully conducted a motivational session on "From Campus to Career: How Innovation &amp; Entrepreneurship Drive Success in Today's Business World &amp; Motivation".</li>
  <li>Mr. Satyabrata Duttagupta from Myra School of Business delivered powerful insights on innovation and career success.</li>
  <li>Management Studies Learners gained practical strategies for the campus-to-career transition.</li>
  <li>The session reinforced JKKN's commitment to industry-aligned, career-ready education.</li>
  <li>Entrepreneurial mindset and innovation were highlighted as essential career differentiators.</li>
</ul>

<h2 id="next-steps">Ready to Build Your Career at JKKN?</h2>
<p>Explore Management Studies programs at JKKN College of Engineering and Technology and join a community that transforms potential into professional excellence.</p>
<ul>
  <li><strong>Admission Helpline:</strong> 93458 55001</li>
  <li><strong>Website:</strong> <a href="https://engg.jkkn.ac.in/">https://engg.jkkn.ac.in/</a></li>
  <li><strong>Email:</strong> <a href="mailto:engg@jkkn.ac.in">engg@jkkn.ac.in</a></li>
</ul>
$html$),
  (SELECT id FROM author),
  (SELECT id FROM author),
  (SELECT id FROM cat),
  'draft',
  'public',
  4,
  false,
  true,
  'Campus to Career: JKKN Management Session 2026',
  'JKKN College of Engineering and Technology hosted a session on Campus to Career — Innovation and Entrepreneurship in Business. Read the highlights.',
  ARRAY[
    'Campus to Career Innovation Entrepreneurship JKKN',
    'Management Studies Session JKKN',
    'Business Motivation Workshop',
    'Entrepreneurship Session Engineering College'
  ]
RETURNING id, slug, status, category_id, author_id;

-- End of 41-blog-post-campus-to-career-session-2026
-- ============================================
