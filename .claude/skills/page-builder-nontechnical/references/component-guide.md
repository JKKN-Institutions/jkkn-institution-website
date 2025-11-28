# Component Guide for Non-Technical Users

This guide explains each page builder component in simple terms with practical examples.

---

## Content Components

### Hero Section
**Purpose:** The large banner at the top of a page that grabs attention.

**When to use:**
- First section of any page
- Landing pages
- Important announcements

**What you can customize:**
| Property | What it does | Example |
|----------|--------------|---------|
| Title | Main headline | "Welcome to JKKN" |
| Subtitle | Supporting text | "Excellence in Education Since 1990" |
| Background Image | Full-width image behind text | Upload campus photo |
| Background Video | Video plays behind text | YouTube or Vimeo URL |
| Overlay | Dark layer for text readability | On (recommended with images) |
| Height | How tall the section is | Full screen, Half screen, Auto |
| Buttons | Action buttons | "Apply Now", "Learn More" |

**Best practices:**
- Use high-quality images (at least 1920px wide)
- Keep title under 10 words
- Maximum 2 buttons
- Enable overlay when using images for better text contrast

---

### Text Editor
**Purpose:** Add paragraphs of text with formatting.

**When to use:**
- Article content
- Descriptions
- Any body text

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Content | The text itself (with formatting toolbar) |
| Alignment | Left, center, right, or justified |
| Max Width | How wide the text block is |

**Formatting options:**
- **Bold** and *italic*
- Headings (H1-H6)
- Bullet and numbered lists
- Links
- Quotes

---

### Heading
**Purpose:** Section titles and subtitles.

**When to use:**
- Section headers
- Breaking up content
- Adding hierarchy

**What you can customize:**
| Property | What it does | Options |
|----------|--------------|---------|
| Text | The heading text | Any text |
| Level | Heading importance | H1 (biggest) to H6 (smallest) |
| Alignment | Text position | Left, Center, Right |
| Color | Text color | Any color |

**Best practices:**
- Use H1 only once per page (usually in Hero)
- Use H2 for main sections
- Use H3 for subsections
- Keep headings short and descriptive

---

### Call-to-Action (CTA)
**Purpose:** Encourage visitors to take action.

**When to use:**
- End of sections
- Conversion points
- Important prompts

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Title | Main CTA headline |
| Description | Supporting explanation |
| Buttons | Action buttons with links |
| Variant | Layout style (centered, left, card) |

**Button options:**
- Label: Button text ("Apply Now")
- Link: Where it goes ("/apply" or "https://...")
- Variant: Primary (filled) or Secondary (outlined)

---

### Testimonials
**Purpose:** Display quotes from students, parents, or partners.

**When to use:**
- Social proof sections
- Success stories
- Reviews

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Items | List of testimonials |
| Layout | Carousel, Grid, or Single |
| Show Rating | Display star ratings |
| Autoplay | Auto-scroll (carousel only) |

**Each testimonial needs:**
- Quote: The actual testimonial text
- Author: Person's name
- Role: Their title or relation
- Avatar: Profile photo (optional)
- Rating: 1-5 stars (optional)

---

### FAQ Accordion
**Purpose:** Expandable Q&A sections.

**When to use:**
- FAQ pages
- Program details
- Support sections

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Items | Questions and answers |
| Show Search | Allow searching FAQs |
| Allow Multiple | Open multiple at once |
| Icon Position | Arrow left or right |

**Each FAQ item needs:**
- Question: The question text
- Answer: The answer (supports formatting)

---

### Tabs
**Purpose:** Organize content into clickable tabs.

**When to use:**
- Program details (Curriculum, Faculty, Fees)
- Multi-part content
- Comparison views

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Tabs | List of tab labels and content |
| Variant | Style (default, pills, underline) |
| Default Tab | Which tab opens first |

---

### Timeline
**Purpose:** Show events in chronological order.

**When to use:**
- Institution history
- Process steps
- Milestones

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Events | List of timeline items |
| Layout | Vertical or Alternating |
| Show Icons | Display icons at each point |

**Each event needs:**
- Date/Year: When it happened
- Title: Event name
- Description: Details about the event
- Icon: Optional icon

---

### Pricing Tables
**Purpose:** Compare pricing plans or programs.

**When to use:**
- Program fees
- Membership options
- Service comparisons

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Plans | List of pricing plans |
| Highlighted Plan | Which plan stands out |
| Show Annual Toggle | Monthly/yearly pricing switch |

---

## Media Components

### Image Block
**Purpose:** Display a single image.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Image URL | The image source |
| Alt Text | Description for accessibility |
| Caption | Text below image |
| Link | Make image clickable |
| Width/Height | Image dimensions |
| Object Fit | How image fills space (cover, contain) |
| Lightbox | Click to view full size |

**Best practices:**
- Always add alt text for accessibility
- Use WebP or optimized JPG formats
- Caption helps with context

---

### Image Gallery
**Purpose:** Display multiple images.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Images | List of images with alt text |
| Layout | Grid, Masonry, or Carousel |
| Columns | 2, 3, 4, or 6 columns |
| Gap | Space between images |
| Lightbox | Click to enlarge |

---

### Video Player
**Purpose:** Embed videos from YouTube, Vimeo, or direct files.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| URL | Video URL (YouTube, Vimeo, or file) |
| Autoplay | Start playing automatically |
| Show Controls | Display play/pause controls |
| Muted | Start without sound |
| Loop | Repeat continuously |
| Poster | Preview image before play |

---

### Image Carousel
**Purpose:** Slideshow of images.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Images | List of images |
| Autoplay | Auto-advance slides |
| Interval | Seconds between slides |
| Show Dots | Navigation dots |
| Show Arrows | Next/previous arrows |

---

### Before/After Slider
**Purpose:** Compare two images with a draggable slider.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Before Image | Left/original image |
| After Image | Right/result image |
| Labels | Text labels for each side |
| Start Position | Slider starting point (%) |

---

### Logo Cloud
**Purpose:** Display partner or sponsor logos.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Logos | List of logo images and links |
| Layout | Grid or Marquee (scrolling) |
| Grayscale | Show logos in gray |
| Columns | Logos per row |

---

## Layout Components

### Container
**Purpose:** Center and constrain content width.

**When to use:**
- Wrap text content
- Create consistent margins
- Group related components

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Max Width | Maximum container width |
| Padding | Inner spacing |
| Background | Background color |

---

### Grid Layout
**Purpose:** Arrange items in columns.

**When to use:**
- Feature cards
- Image galleries
- Multi-column layouts

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Columns | 1-12 columns |
| Gap | Space between items |
| Responsive | Different columns per device |

**Tip:** Drag other components INTO the grid to create columns.

---

### Flexbox Layout
**Purpose:** Flexible arrangement of items.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Direction | Row (horizontal) or Column (vertical) |
| Justify | Horizontal alignment |
| Align | Vertical alignment |
| Gap | Space between items |
| Wrap | Wrap to next line if needed |

---

### Spacer
**Purpose:** Add vertical space between sections.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Height | Space in pixels |
| Responsive Heights | Different heights per device |

**Common heights:**
- 24px: Small gap
- 48px: Medium gap
- 80px: Large section break

---

### Divider
**Purpose:** Horizontal line separator.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Style | Solid, Dashed, Dotted |
| Color | Line color |
| Width | Line width percentage |
| Thickness | Line thickness |

---

### Section Wrapper
**Purpose:** Full-width background section.

**When to use:**
- Colored background sections
- Full-bleed images
- Alternating section backgrounds

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Background | Color, gradient, or image |
| Padding | Top/bottom spacing |
| Full Width | Extend beyond container |

---

## Data Components

These components automatically pull data from the database.

### Events List
**Purpose:** Display upcoming or past events.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Filter | Upcoming, Past, or All |
| Limit | Number to show |
| Layout | List, Grid, or Calendar |
| Show Past Events | Include past events toggle |

---

### Faculty Directory
**Purpose:** Display staff members.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Department | Filter by department |
| Layout | Grid, List, or Compact |
| Columns | Items per row |
| Show Email | Display contact info |
| Show Department | Show department name |

---

### Announcements Feed
**Purpose:** Display news and updates.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Limit | Number to show |
| Layout | List, Cards, or Ticker |
| Categories | Filter by category |
| Show Date | Display publish date |

---

### Stats Counter
**Purpose:** Animated statistics display.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Stats | List of stat items |
| Layout | Row or Grid |
| Animate | Count up animation |

**Each stat needs:**
- Value: The number
- Label: What it represents
- Suffix: Text after number ("+", "%")
- Icon: Optional icon

---

### Blog Posts Grid
**Purpose:** Display blog articles.

**What you can customize:**
| Property | What it does |
|----------|--------------|
| Category | Filter by category |
| Limit | Number to show |
| Layout | Grid, List, or Featured |
| Columns | Items per row |
| Show Excerpt | Display preview text |

---

## Component Combinations

### Hero + Content Section
```
Hero Section
↓
Container
  └── Heading (H2)
  └── Text Editor
```

### Two-Column Feature
```
Grid Layout (2 columns)
  └── Image Block
  └── Container
        └── Heading
        └── Text Editor
        └── CTA Button
```

### Testimonials Section
```
Section Wrapper (light background)
  └── Container
        └── Heading (H2, centered)
        └── Testimonials (carousel)
```

---

## Quick Reference Table

| Need This? | Use This Component |
|------------|-------------------|
| Page header with image | Hero Section |
| Paragraph text | Text Editor |
| Section title | Heading |
| Action button | Call-to-Action |
| Customer quotes | Testimonials |
| Q&A section | FAQ Accordion |
| Multiple content tabs | Tabs |
| History/milestones | Timeline |
| Single image | Image Block |
| Multiple images | Image Gallery |
| Video embed | Video Player |
| Slideshow | Image Carousel |
| Partner logos | Logo Cloud |
| Column layout | Grid Layout |
| Vertical spacing | Spacer |
| Background section | Section Wrapper |
| Staff listing | Faculty Directory |
| Event display | Events List |
| Statistics | Stats Counter |
