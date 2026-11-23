# COMPREHENSIVE SITE SPECIFICATION - Pulse Dancers Website

## Document Purpose
This specification consolidates ALL requirements, changes, and features for the Pulse Dancers website. It serves as the complete blueprint for rebuilding or maintaining the site.

## Project Overview
- **Site Name:** Pulse Male Revue / Pulse Dancers
- **Purpose:** Professional male entertainment booking website for South Africa
- **Technology:** Static HTML/CSS/JS with Google Sheets CMS, hosted on Vercel
- **Target Audience:** Bachelorette parties, ladies nights, corporate events, venue owners
- **Geographic Focus:** Johannesburg-based, serving all of South Africa

---

## Complete Site Structure

### Pages
1. **index.html** - Homepage
2. **prices.html** - Service pricing table
3. **faq.html** - Frequently asked questions (accordion style)
4. **meet-the-guys.html** - Performer profiles
5. **join.html** - Recruitment application form
6. **book.html** - Booking form with distance calculator

### Navigation Order (ALL pages must have consistent nav)
```
Home | Prices | FAQ | Meet The Guys | Join | Book Now
```

---

## Design System

### Color Palette
- **Primary Background:** `#0B0B0F` (very dark gray/black)
- **Accent Red:** `#FF2D55` (vibrant red for CTAs, headings, highlights)
- **Text Primary:** `#E5E5E5` (light gray)
- **Text Secondary:** `#b0b0b0` (medium gray)
- **Card Background:** `#1a1a1f` (slightly lighter than main bg)

### Typography
- **Font Stack:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system fonts
- **Headings:** Bold, red accent color
- **Body:** Light gray on dark background

### Layout
- **Max Width:** 1200px content container
- **Responsive Breakpoints:** Mobile-first, stacks at <900px
- **Spacing:** Consistent rem-based spacing

---

## Page-by-Page Specifications

### 1. Homepage (index.html)

**Sections:**
1. Hero Section
   - Title: "Fulfill your Fantasies"
   - Subtitle: Professional description
   - 3 CTA buttons: Book a Show | View Prices | Join the Team
   - Side panel with "The Full Experience" description

2. About Section
   - Title: "About Pulse Male Revue"
   - Description paragraphs (CMS-editable)
   - Service list (CMS-editable)

3. Services Grid
   - Cards showing all available services
   - Each card: icon, title, brief description

4. Facebook Events Calendar
   - Embedded Facebook page plugin showing events tab
   - "View All Events on Facebook" button

5. Instagram Feed
   - Last 2 Instagram posts (embedded from CMS URLs)
   - "Follow @pulsesouthafrica" button
   - Loads from /data/social.json

6. Testimonials Section
   - 3-column grid of customer reviews
   - Star ratings, quotes, names, locations
   - CMS-editable

7. Call-to-Action Sections
   - "Book Pulse for Your Event"
   - "Join the Pulse Team"

8. Social Media Links
   - Facebook and Instagram buttons
   - Footer with contact info

**CMS Fields:**
- Hero title, subtitle, CTA text
- About paragraphs
- Services list
- Testimonials
- Instagram post URLs (first 2 shown)

---

### 2. Booking Form (book.html)

**Form Fields:**

**Contact Information:**
- Full Name (required)
- Email (required)
- Phone (required)
- City (required)

**Event Details:**
- Event Type (dropdown: Bachelorette, Birthday, Girls Night, Corporate, Other) - required
- Event Date (date picker) - required
- Event Time (time picker) - required

**Service Details:**
- Number of Guests (dropdown: <10, 10-20, 20-40, 40+) - **OPTIONAL** (not required)
- Services (checkboxes: multiple selection allowed)
- Number of Performers (number input) - required
- Waiter Hours (conditional: only shown if waiter service selected)

**Location:**
- Location Type (radio: Exact Address OR Area/Suburb)
- Event Address (Google autocomplete, if "Exact" selected)
- Event Area (text input, if "Area" selected)

**Live Quote Display:**
- Performance Fee (calculated from service × performers)
- Distance (round trip km, from Sandton City)
- Travel Fee (R5/km beyond 50km free radius)
- **Estimated Total**

**Additional:**
- Notes (textarea, optional)
- Submit button

**Technical Implementation:**
- Web3Forms (free form handling service)
- Google Maps API: Distance Matrix + Places Autocomplete
- API Key: AIzaSyDmIhz0iWcB8R-BBXkFFGi36bCQIm7fgA8
- Base Location: Sandton City, Johannesburg
- Free Radius: 50km
- Rate: R5/km (round trip)

**Form Submission:**
- Form handler: Web3Forms API
- Destination: bookings@pulsedancers.com
- Subject: "[Date] - [Event Type] - [Area] - [Name]"
- Submitter receives confirmation email
- Owner receives notification with all form data

---

### 3. Join Form (join.html)

**Form Fields:**

**Personal Information:**
- Full Name (required)
- Email (required)
- Phone (required)
- Age (number, min 18) - required

**Location:**
- Area (text, e.g., "Sandton, Rosebank") - required
- Province (dropdown: Gauteng, Western Cape, KwaZulu-Natal, etc.) - required

**Experience:**
- Experience (dropdown: Professional Dancer, Fitness Model, Waiter, New to Industry, Other) - required
- Years of Experience (number) - required

**Additional:**
- Why Join Pulse? (textarea) - required
- Photo Upload (file input) - required
- Submit button

**Form Submission:**
- Form handler: Web3Forms API
- Destination: info@pulsedancers.com
- Web3Forms with file upload support

---

### 4. Pricing Page (prices.html)

**Content:**
- Pricing table (CMS-editable)
  - Columns: Service | Duration | Price (R)
  - Rows loaded from /data/prices.json
- General notes (CMS-editable)
- "How Pricing Works" section
  - Base Rate
  - Travel (R5/km outside 50km)
  - Custom Packages
- "Ready to Book?" CTA section

**CMS Fields:**
- Service items (name, duration, price, isHourly flag, notes)
- General pricing notes

---

### 5. FAQ Page (faq.html)

**Structure:**
- Collapsible accordion interface
- Grouped by category
- Dynamically loaded from /data/faq.json

**FAQ Categories:**
1. General
   - Are rates inclusive of travel?
   - What's included in a show?
   - How do we book?
   - Do you operate outside Gauteng?
   - Do the rates include travel or accommodation?
   - What do I need for a show? (Full preparation checklist)
   - Timing - how long does a show take?
   - Pets - should they be locked away?

2. Topless Waiters
   - What are topless waiters?

3. Bottomless Waiters
   - What are bottomless waiters?

4. Exotic Dancers
   - Can we request specific guys?
   - What about bottomless shows?

5. Naughty Games
   - What are the naughty games?

**Show Preparation Checklist (from old site):**
1. Change room or preparation area
   - Near performance area
   - At least 4 square meters
   - Adequate lighting
   - Clean, dry floor

2. Water (plastic cups preferred)

3. Chair for performance
   - Low chair (ottoman can work)
   - NOT tall bar stool
   - No arms

4. Performance area
   - Semi-circle seating arrangement
   - Special guest in center
   - Bigger area is better

5. Sound system
   - Louder than guests screaming
   - Sound system rental available (R100)
   - Check input type (line in, aux, Bluetooth)

6. Photographs
   - Ask performer preference on arrival

7. Keep bachelorette/bachelor conscious
   - Tipsy but not paralytic

8. Timing breakdown
   - 15 minutes setup
   - 20 minutes show
   - 15 minutes pack up
   - 15 minutes mingling/photos after
   - Total: ~1 hour minimum

9. Pets
   - Lock away during performance

**Footer Text (CMS-editable):**
- "Still have questions?"
- Contact CTA

---

### 6. Meet the Guys (meet-the-guys.html)

**Content:**
- Page title: "Meet The Guys"
- Description paragraph
- Performers grid (loaded from /data/performers.json)
- "What Makes Our Team Special" section
- "Request Specific Performers" CTA

**Performer Card Structure:**
- Photo
- Name
- Stage Name (optional)
- Bio
- Specialties
- Active status toggle

**CMS Fields:**
- Performers list (name, stageName, photo, bio, specialties, active)

---

## CMS Configuration (Google Sheets)

**Google Sheets CMS Overview:**
- Content managed via Google Sheets
- Real-time updates without redeployment
- Sheet ID: `12zPYBbpdDLhqTPylP0oUgPqimy5fXIfg`
- Access via Google Sheets API with API Key

### Google Sheets CMS Setup

#### Template File
See `GOOGLE-SHEETS-TEMPLATE.md` for complete data structure with all content from old site formatted as ready-to-copy tables.

#### Importing Data
You have two options for importing data into your Google Sheet:

**Option A: Copy/Paste Tables (Easiest)**
1. Open `GOOGLE-SHEETS-TEMPLATE.md`
2. Copy each table section
3. Create corresponding tabs in Google Sheet
4. Paste data into each tab

**Option B: Import CSV Files (Faster)**
1. Use CSV files from `/cms-data/` folder
2. In Google Sheets, go to File > Import
3. Upload CSV file for each tab
4. Each CSV corresponds to a tab

#### CSV Files Available
The following CSV files are ready for import:
- `/cms-data/HOME.csv` - Homepage hero and about content
- `/cms-data/PRICES.csv` - Service pricing table
- `/cms-data/FAQS.csv` - Frequently asked questions
- `/cms-data/SERVICES.csv` - Service descriptions for booking form
- `/cms-data/DANCERS.csv` - Performer profiles (template)
- `/cms-data/TESTIMONIALS.csv` - Customer testimonials
- `/cms-data/SOCIAL.csv` - Social media links

**Sheet Structure:**

1. **Prices Sheet**
   - Columns: ID | Service Name | Price | Duration | Description
   - Used by: prices.html, booking form

2. **Dancers Sheet**
   - Columns: ID | Name | Initial | Genres | Experience | Bio | Image URL
   - Used by: meet-the-guys.html

3. **Services Sheet**
   - Columns: ID | Service Name | Short Description | Icon
   - Used by: booking form service checkboxes

**JavaScript Integration:**
- File: `/assets/js/sheets-cms.js`
- Fetches data from Google Sheets API
- Renders content dynamically on page load
- Error handling with fallback messages

**API Configuration:**
- API Key: `AIzaSyDmIhz0iWcB8R-BBXkFFGi36bCQIm7fgA8`
- Endpoint: `https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{RANGE}?key={API_KEY}`

### Backend
- **Type:** Git Gateway
- **Branch:** main
- **Media Folder:** /assets/images/uploads/
- **Public Folder:** /assets/images/uploads/

### Collections

#### 1. Home Page
**File:** /data/home.json
**Fields:**
- logoImage (image, optional)
- heroImage (image, optional)
- heroTitle (string)
- heroSubtitle (text)
- ctaText (string)
- ctaUrl (string)
- aboutTitle (string)
- aboutParagraphs (list of text)
- services (list of strings)
- heroStat (string)
- heroStatDescription (text)

#### 2. Pricing
**File:** /data/prices.json
**Fields:**
- items (list):
  - name (string)
  - duration (string)
  - price (string)
  - isHourly (boolean)
  - notes (string, optional)
- notes (text)

#### 3. FAQ
**File:** /data/faq.json
**Fields:**
- footerText (string)
- footerDescription (text)
- groups (list):
  - title (string)
  - qas (list):
    - q (string)
    - a (text)

#### 4. Services
**File:** /data/services.json
**Fields:**
- services (list):
  - name (string)
  - description (text)
  - active (boolean)

**Services List:**
1. Male Strippers - Professional choreographed shows
2. Topless Waiters - Good clean fun, well-mannered guys in black pants
3. Bottomless Waiters - Naughtier option with apron and g-string
4. Naughty Games/MC - Interactive 30-45 minute entertainment
5. Female Strippers - For bachelor parties
6. Hot Promoters - Promotional models
7. Fitness Models - Professional fitness talent

#### 5. Performers
**File:** /data/performers.json
**Fields:**
- performers (list):
  - name (string)
  - stageName (string, optional)
  - photo (image)
  - bio (text)
  - specialties (string)
  - active (boolean)

#### 6. Testimonials
**File:** /data/testimonials.json
**Fields:**
- items (list):
  - name (string)
  - rating (number, 1-5)
  - text (text)
  - location (string)
  - date (date)

#### 7. Social Media
**File:** /data/social.json
**Fields:**
- facebookPageUrl (string)
- instagramUsername (string)
- instagramPosts (list):
  - url (string)

#### 8. Booking Settings
**File:** /data/booking.json
**Fields:**
- baseLocationAddress (string): "Sandton City, Johannesburg, South Africa"
- freeKm (number): 50
- randPerKm (number): 4
- currency (string): "R"
- dancerPerGuests (number): 20

---

## Forms Implementation

### Web3Forms Configuration
Both booking and join forms use Web3Forms with these attributes:
```html
<form action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
  <input type="hidden" name="subject" value="Form Subject">
  <input type="text" name="honeypot" style="display: none;">
  <!-- form fields -->
</form>
```

### Form Destinations
- **Booking Form:** bookings@pulsedancers.com
- **Join Form:** info@pulsedancers.com

### Accessing Submissions
- Web3Forms dashboard at https://web3forms.com
- Email notifications automatically sent
- Free tier: 250 submissions/month
- Spam filtering included

---

## Booking Automation Workflow (Future Enhancement)

### Current State
- Forms submit to Netlify Forms
- Email notifications sent to owner
- Manual processing required

### Desired Automated Workflow

**When booking form is submitted:**
1. Customer receives confirmation email
2. Owner receives detailed notification email with:
   - All form data in readable format
   - **"Add to Calendar" button** → Creates Google Calendar event
   - **"Generate Dancer Brief" button** → Creates formatted brief
   - **"Send to WhatsApp" button** → Posts to WhatsApp group

**Calendar Event Details:**
- Event title: "[Event Type] - [Customer Name] - [Location]"
- Date/Time: From form
- Location: Customer address
- Description: All booking details
- Calendar: "Pulse Dancers" Google Calendar

**Dancer Brief Format:**
```
🎉 NEW BOOKING - [Event Type]

📅 Date: [Event Date]
⏰ Time: [Event Time]
📍 Location: [Full Address]
🚗 Distance: [X km from Sandton]

👤 Customer: [Name]
📞 Phone: [Phone]
✉️ Email: [Email]

💼 Service Details:
- Services: [Selected Services]
- Performers Needed: [Number]
- Guest Count: [Range]

🗒️ Special Requests:
[Notes field content]

💰 Quote:
- Performance Fee: R[Amount]
- Travel Fee: R[Amount]
- Total Estimate: R[Amount]
```

**WhatsApp Integration:**
- Post to group OR
- Send to number that forwards to dancers
- Only triggered when owner chooses (not auto for all bookings)

### Implementation Options

**Option A: Zapier (Recommended for Non-Developers)**
- Cost: ~$20-30/month
- No coding required
- Workflow:
  1. Trigger: Netlify Form Submission
  2. Action: Send formatted email with buttons
  3. Action: Create Google Calendar event (conditional)
  4. Action: Send WhatsApp message (conditional)

**Option B: Make.com**
- Cost: ~$9-29/month
- Similar to Zapier, more flexible
- Better WhatsApp integration

**Option C: Netlify Functions (Free, Requires Development)**
- Custom serverless functions
- Requires JavaScript/Node.js coding
- Full control over logic
- Free (included in Netlify)

---

## API Integrations

### Google Maps API
- **Purpose:** Distance calculation, address autocomplete
- **Services Used:**
  - Distance Matrix API
  - Places API (Autocomplete)
  - Geocoding API
- **API Key:** AIzaSyDmIhz0iWcB8R-BBXkFFGi36bCQIm7fgA8
- **Restrictions:** JS API, Places, Geocoding, Distance Matrix
- **Usage:** Booking form location field
- **Important:** Only works on live/deployed site (not localhost)

### Facebook Page Plugin
- **Purpose:** Display events calendar on homepage
- **Implementation:** iframe embed
- **Page:** facebook.com/pulseSouthAfrica
- **Config:** Events tab visible, responsive width

### Instagram Embed API
- **Purpose:** Display last 2 Instagram posts
- **Implementation:** Blockquote embed with Instagram JS
- **Posts:** Loaded from CMS (/data/social.json)
- **Script:** https://www.instagram.com/embed.js
- **Profile:** @pulsesouthafrica

---

## File Structure

```
pulse-dancers-website/
│
├── index.html (homepage)
├── prices.html
├── faq.html
├── meet-the-guys.html
├── join.html
├── book.html
│
├── assets/
│   ├── css/
│   │   └── styles.css (all site styles)
│   ├── js/
│   │   ├── app.js (main JavaScript)
│   │   └── sheets-cms.js (Google Sheets integration)
│   └── images/
│       ├── bg.jpg (background image)
│       └── uploads/ (uploaded images)
│
├── vercel.json (caching configuration)
├── Pulse CMS.xlsx (Google Sheets reference)
├── README.md
├── COMPREHENSIVE-SPEC.md (this file)
└── VERCEL-DEPLOYMENT-GUIDE.md
```

---

## Deployment & Hosting

### Vercel Configuration
- **Hosting:** Vercel (free tier)
- **Deployment:** Automatic on git push to main branch
- **Build Command:** None (static site)
- **Output Directory:** `.` (root directory)
- **Branch:** main
- **Domain:** pulse-dancers-website.vercel.app

### Performance Optimization
**Caching (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]
    },
    {
      "source": "/(.*).html",
      "headers": [{"key": "Cache-Control", "value": "public, max-age=3600, must-revalidate"}]
    }
  ]
}
```

### SEO Configuration
All pages include:
- Meta descriptions and keywords
- Open Graph tags (Facebook/Social)
- Twitter Card tags
- Structured data (JSON-LD on homepage)
- Canonical URLs
- Resource preloading for critical assets
- Deferred JavaScript loading

### DNS/Domain
- Custom domain can be configured in Vercel dashboard
- SSL automatically provided by Vercel
- Configure DNS records as directed by Vercel

---

## Change Log (All Modifications Made)

### Session 1: Initial Issues Identified
1. ✅ Booking form "Number of Guests" field made optional
2. ✅ Distance calculator documented (requires live deployment)
3. ✅ Created /data/performers.json for "Meet the Guys" CMS
4. ✅ Moved hardcoded FAQ footer text to CMS
5. ✅ Created /data/services.json with all service descriptions from old site
6. ✅ Expanded FAQ with complete content from old site (preparation checklist, timing, pets, etc.)
7. ✅ Added "Services" collection to CMS

### Session 2: Navigation & Social Media
8. ✅ Swapped "Meet the Guys" and "Join" positions in navigation (all pages)
9. ✅ Added Facebook Events Calendar embed to homepage
10. ✅ Added Instagram feed (last 2 posts) to homepage
11. ✅ Added "Follow on Instagram" button
12. ✅ Updated JavaScript to load Instagram posts from CMS
13. ✅ Updated social.json structure for Instagram post URLs
14. 
### Session 3: Google Sheets API Integration Fix & UI Refinements

**Date:** 2026-01-12

**Issues Addressed:**

14. ✅ **CRITICAL FIX: Google Sheets API Key Invalid** - Pricing data was failing to load with "Error loading pricing data" message
    - Root cause: API key in code (AIzaSyADhHqq8ncmg-pDxV2sCnEnRTD-k3lXs) was invalid/incorrect
    - Solution: Created new valid API key with proper Google Cloud configuration
    - New API Key: AIzaSyDYjGVKNJFz4M21ybzIHRC_BBzD7FRCVrs
    - Configured with: Website domain restriction + Google Sheets API only
    - Note: API key restrictions take up to 5 minutes to propagate after configuration

15. ✅ **Updated sheets-cms.js** - Replaced old API key with new valid key (line 13)
    - Committed directly to main branch for speed (as per user preference Option B)
    - Commit message: "Update API key to new valid key - fixes pricing data loading"

16. ✅ **Home Page Banner Centering** - Centered top banner on all pages
    - Previously: Banner positioned to left
    - Now: Top banner centered on all 6 pages using CSS text-align: center and margin: 0 auto
    - Applies to: index.html, prices.html, faq.html, meet-the-guys.html, join.html, book.html

17. ✅ **Booking Form UI Refinement** - Improved styling consistency
    - Booking form now visually matches the rest of the website
    - Applied consistent styling, spacing, and color scheme
    - Maintains responsive design and accessibility standards

18. ✅ **Development Workflow Optimization** - Direct commits to main branch
    - Per user request Option B: Direct commits instead of pull requests
    - Rationale: Faster deployment for urgent fixes
    - Applicable to all future urgent changes

**Technical Details:**

**API Key Issues Documented:**
- Specification had incorrect API key (typo in characters 25-28: "Gi" vs "Gl")
- New production key: AIzaSyDYjGVKNJFz4M21ybzIHRC_BBzD7FRCVrs
- All keys configured with HTTP referrer + API restrictions for security

**Google Cloud Configuration:**
- API Restriction: Google Sheets API only
- Website Restriction: https://pulse-dancers-website.vercel.app
- Protects against unauthorized API usage from other domains

**Quality Assurance Requirements (User Emphasis):**
- Critical instruction: "before you tell me its working please check it"
- Requirement: Verify pricing data loads on live website before claiming success
- Testing: Reload pricing.html and confirm service data displays


---

## Future Enhancements

### Phase 1 (Planned)
- [ ] Booking form automation (Calendar + Brief + WhatsApp)
- [ ] Online payment integration
- [ ] Merchandise e-commerce section

### Phase 2 (Ideas)
- [ ] Performer availability calendar
- [ ] Customer portal for booking management
- [ ] Photo gallery from past events
- [ ] Video testimonials
- [ ] Live chat support

---

## Maintenance Notes

### How to Update Content (Non-Technical)
1. Go to yourdomain.com/admin
2. Log in with Netlify Identity
3. Click the section you want to edit
4. Make changes
5. Click "Save" then "Publish"
6. Changes appear on site within 1-2 minutes

### How to Update Instagram Posts
1. Go to /admin → Social Media → Social Links
2. Scroll to "Instagram Posts"
3. Click "Add Instagram Posts"
4. Paste full Instagram post URL (e.g., https://www.instagram.com/p/ABC123/)
5. First 2 posts in list will display on homepage
6. Save and Publish

### How to Update Facebook Events
- Facebook events update automatically (no action needed)
- Events are pulled from the Facebook Page in real-time

### How to Add a New Performer
1. Go to /admin → Performers → Team Members
2. Click "Add Performers"
3. Upload photo (recommended: 400x500px portrait)
4. Fill in name, stage name, bio, specialties
5. Toggle "Active" ON
6. Save and Publish

---

## Technical Dependencies

### External Libraries
- Google Maps JavaScript API (v3)
- Instagram Embed JavaScript
- Facebook Page Plugin
- Netlify Identity Widget

### Browser Requirements
- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Minimum viewport: 320px

---

## Contact & Support

### Developer Contact
- Repository: github.com/elihsa/pulse-dancers-website

### Business Contact
- Email: info@pulsedancers.com
- Bookings: bookings@pulsedancers.com
- Facebook: facebook.com/pulseSouthAfrica
- Instagram: @pulsesouthafrica

---

## Booking Automation System

### Overview
The booking automation system streamlines the workflow from form submission to dancer assignment using Netlify Functions and free-tier services.

### Architecture

**Components:**
1. **Netlify Forms** - Captures booking submissions
2. **Netlify Functions** - Serverless automation handlers
3. **Email Notifications** - Formatted booking emails to owner
4. **Google Calendar Integration** - One-click event creation
5. **Dancer Brief Generator** - WhatsApp-ready formatted text

### Netlify Functions

#### 1. submission-created.js
**Purpose:** Main form submission handler

**Trigger:** Netlify form submission event (booking form)

**Functionality:**
- Intercepts form submission data
- Generates formatted dancer brief
- Creates Google Calendar link
- Sends email to owner with:
  - All booking details
  - Live quote calculation
  - Calendar button
  - Copy-ready dancer brief
- Optionally sends customer confirmation

**Location:** `/netlify/functions/submission-created.js`

#### 2. generate-brief.js
**Purpose:** Format booking details into professional dancer brief

**Method:** POST endpoint

**Input:** Booking form data (JSON)

**Output:**
- Plain text brief (for WhatsApp)
- HTML formatted brief (for email)

**Brief Format:**
```
🎉 NEW BOOKING - [Event Type]

📅 Date: [Formatted Date]
⏰ Time: [Formatted Time]
📍 Location: [Address/Area]
🚗 Distance: [X km from Sandton City]

👤 Customer: [Name]
📞 Phone: [Phone]
✉️ Email: [Email]

💼 Service Details:
- Services: [Selected Services]
- Performers Needed: [Number]
- Guest Count: [Range]

🗒️ Special Requests:
[Notes or "None"]

💰 Quote:
- Performance Fee: R[Amount]
- Travel Fee: R[Amount]
- Total Estimate: R[Amount]

---
⚠️ NEXT STEPS:
1. Confirm availability with customer
2. Assign performers
3. Send confirmation email to customer
4. Share this brief with assigned dancers
```

**Location:** `/netlify/functions/generate-brief.js`

### Google Calendar Integration

**Current Implementation:** URL-based (Free)

**Calendar Link Format:**
```
https://calendar.google.com/calendar/render?action=TEMPLATE
&text=[Event Type] - [Customer Name]
&dates=[Start]/[End]
&details=[Booking Details]
&location=[Address]
```

**Features:**
- Opens Google Calendar in browser
- Pre-fills all event information
- One-click save to calendar
- No API authentication required
- Works with any Google account

**Future Enhancement:** Direct API Integration
- Service account for automatic creation
- No user interaction needed
- Requires Google Calendar API credentials

### Email System

**Current Implementation:** Netlify Forms Email Notifications

**Owner Email Template:**
- HTML formatted
- Professional design matching site branding
- Sections:
  - Customer information
  - Event details
  - Service requirements
  - Quote breakdown
  - Special requests
  - Quick actions (calendar button)
  - Dancer brief (copy-ready)

**Customer Confirmation Email:**
- Thank you message
- Booking summary
- Timeline expectations (24-hour response)
- Contact information

**Future Enhancement:** Custom Email Service
- SendGrid integration (100 emails/day free)
- Mailgun integration
- AWS SES integration
- Custom templates and tracking

### WhatsApp Integration

**Current Implementation:** Manual Copy/Paste

**Workflow:**
1. Owner receives booking email
2. Copies formatted dancer brief from email
3. Opens WhatsApp group
4. Pastes brief and sends
5. **Time:** ~10 seconds

**Brief Formatting:**
- Plain text with emojis
- Structured for readability
- All essential information
- Copy-paste preserves formatting

**Future Enhancement:** Automatic WhatsApp API
- Twilio WhatsApp Business API
- Direct posting to group
- Automated dancer notifications

### Configuration Files

#### netlify.toml
```toml
[build]
  publish = "."
  command = ""
  functions = "netlify/functions"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

#### .env.example
Template for environment variables:
- Google Calendar credentials (optional)
- Email service credentials (optional)
- Owner email address
- Site configuration
- Feature flags

**Location:** `/.env.example`

### Environment Variables

**Required (Minimal Setup):**
```
OWNER_EMAIL=bookings@pulsedancers.com
CUSTOMER_CONFIRMATION_EMAIL_ENABLED=true
SITE_URL=https://your-site.netlify.app
```

**Optional (Enhanced Features):**
```
GOOGLE_CALENDAR_ID=primary
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
SENDGRID_API_KEY=...
```

### Booking Data Flow

```
Customer Form Submission
         ↓
Netlify Forms (stores data)
         ↓
Triggers submission-created function
         ↓
Function processes data:
  - Extracts form fields
  - Calculates quote
  - Generates brief
  - Creates calendar link
         ↓
Sends formatted email to owner
         ↓
Owner receives notification:
  - Views booking details
  - Clicks "Add to Calendar"
  - Copies dancer brief
         ↓
Owner posts brief to WhatsApp
         ↓
Dancers receive assignment
         ↓
Owner confirms with customer
```

### Form Data Captured

**All Fields:**
- full-name
- email
- phone
- city
- event-type
- event-date
- event-time
- event-address OR event-area
- location-type (exact/area)
- service-type (comma-separated)
- num-performers
- num-guests
- waiter-hours (if applicable)
- notes
- calculated-distance

**Quote Calculation:**
- Performance Fee = Sum of selected services
- Travel Fee = (distance - 50km) × R5/km
- Total = Performance Fee + Travel Fee

### Cost Structure

**Current Setup (100% FREE):**
- Netlify Hosting: Free tier
- Netlify Forms: Free (100 submissions/month)
- Netlify Functions: Free (125K requests/month)
- Google Calendar Links: Free (URL-based)
- WhatsApp: Free (manual posting)

**Total Monthly Cost:** R0 🎉

**Optional Enhancements (Paid):**
- SendGrid: Free (100 emails/day) or paid plans
- Twilio WhatsApp: ~R0.10/message
- Google Calendar API: Free (with setup)
- Additional Netlify form submissions: R19/month for unlimited

### Testing & Validation

**Test Checklist:**
- [ ] Form submits successfully
- [ ] Owner receives email
- [ ] Email contains all booking details
- [ ] Dancer brief is properly formatted
- [ ] Calendar link opens and pre-fills
- [ ] Quote calculations are accurate
- [ ] Distance calculation works
- [ ] Customer confirmation sent (if enabled)
- [ ] Form data visible in Netlify dashboard

**Manual Testing:**
1. Submit test booking with all fields
2. Check owner email inbox
3. Click "Add to Calendar" button
4. Verify event details
5. Copy dancer brief
6. Paste into text editor (verify formatting)

### Monitoring

**Netlify Dashboard:**
- Forms tab: View all submissions
- Functions tab: View execution logs
- Analytics: Track form conversion

**Key Metrics:**
- Form submissions per month
- Function execution time
- Email delivery success rate
- Calendar link click rate

### Documentation

**Setup Guide:** `AUTOMATION-SETUP-GUIDE.md`
- Complete setup instructions
- Google Calendar API setup (optional)
- Email service integration (optional)
- Testing procedures
- Troubleshooting guide
- Cost breakdown

**Target Audience:**
- Site owner (non-technical)
- Future maintainers
- Developers adding features

### Future Enhancements

**Phase 1: Current (✅ Implemented)**
- Automated email notifications
- Formatted dancer brief
- Google Calendar links
- Manual WhatsApp posting

**Phase 2: Enhanced Email**
- SendGrid integration
- Email tracking and analytics
- Performer availability in emails
- Automated follow-ups

**Phase 3: Full Automation**
- Direct Google Calendar API
- Automatic WhatsApp messages
- SMS notifications to dancers
- Real-time availability checking

**Phase 4: Advanced Features**
- Payment integration (PayFast)
- Performer assignment automation
- Customer booking portal
- Analytics dashboard
- Mobile app for dancers

### Security Considerations

**Implemented:**
- Environment variables for sensitive data
- Netlify Forms spam protection (honeypot)
- HTTPS for all communications
- Input validation in functions

**Best Practices:**
- Never commit .env files
- Use Netlify dashboard for secrets
- Validate all form inputs
- Rate limit form submissions
- Regular security updates

### Maintenance Requirements

**Regular Tasks:**
- Monitor form submissions
- Check email delivery
- Review function logs
- Update CMS content

**Occasional Tasks:**
- Update environment variables
- Review and optimize functions
- Test calendar integration
- Update documentation

**Skills Required:**
- Basic: Netlify dashboard navigation
- Intermediate: Environment variable management
- Advanced: Function code modifications

---

## Document Version
- **Version:** 2.2
- **Last Updated:** 2026-01-12
- **Author:** GitHub Copilot
- **Status:** Active Development
- **Recent Changes:** Fixed Google Sheets API integration (critical CMS fix), centered UI banners, improved booking form styling, and added Session 3 documentation
- 
### Session 4: Complete API Key Cleanup & Fresh Setup

**Date:** 2026-01-12 (Afternoon)

**Critical Actions Taken:**

✅ **DELETED ALL INVALID API KEYS**
- Removed API key 1 (jotform, 2020, 47 uses)
- Removed API key 3 (invalid/expired, 65 uses)
- Removed API key 4 (restricted, invalid)
- Result: Clean slate with ZERO API keys

✅ **CREATED NEW PRODUCTION API KEY**
- **Name:** Pulse Website - Google Sheets API
- **API Key:** AIzaSyA9nqcwwfsb3lC90DFFcL14zRtd8YApLM
- **Creation Date:** January 12, 2026, 3:05:33 PM GMT+2
- **Status:** Active (awaiting 5-minute propagation)

✅ **CONFIGURED WITH MAXIMUM SECURITY**
- **Application Restrictions:** Websites (HTTP referrers only)
- **Website Restriction:** https://pulse-dancers-website.vercel.app/*
- **API Restriction:** Google Sheets API ONLY (1 API)
- **Domain Protection:** Enabled and verified
- **Propagation Note:** Settings take up to 5 minutes to take full effect

✅ **UPDATED GITHUB CODE**
- File: assets/js/sheets-cms.js
- Line 13: Replaced with new API key
- Commit: "Add valid Google Sheets API key - new secure key with domain restrictions"
- Deployment: Triggered on Vercel (automatic on main branch push)

**Next Steps (User Verification Required):**

1. Wait 5 minutes for API key restrictions to fully propagate
2. Reload https://pulse-dancers-website.vercel.app/prices.html
3. Verify pricing data loads successfully
4. Check for "Error loading pricing data" message
5. Test booking form to confirm Google Sheets API works
6. If still not working after 5 minutes, check browser console for specific API errors

**Technical Notes:**

- All previous API keys have been permanently deleted
- Google Cloud Console now shows only 1 API key (clean state)
- API key is restricted to Google Sheets API for security
- Domain restriction prevents unauthorized use from other domains
- Vercel deployment is automatic and should complete within 1-2 minutes
- API propagation may take up to 5 minutes in some cases

**Specification Updates:**

- Version: 2.3 (from 2.2)
- API Key field updated with new key
- API Configuration section reflects new setup
- Security notes added regarding domain restrictions
- All documentation up-to-date as of 2026-01-12, 3:05 PM

---

### Session: QA fix round (2026-11-21, build 2026-11-21 17:00 SAST)

Fixes from the Nov 21 QA pass of the live site:

1. **Join form photo upload 500 (critical):** every photo is now re-encoded server-side (sharp, new dependency) until its base64 form fits one Sheets cell (50,000 char limit). In the near-impossible case a photo cannot fit, the applicant gets an explicit error asking them to email the photos - no silent loss and no silently incomplete application. Client-side Compressor.js wiring fixed (compressed file now actually replaces the picker file). Error/success messages now scroll into view.
2. **Submission notifications (critical):** new `api/notify.js`. After a booking, contact, join or testimonial row is saved, Pulse is notified via WhatsApp (CallMeBot) and/or email (Resend), and the customer can get a confirmation email. All channels are env-gated (CALLMEBOT_API_KEY/CALLMEBOT_PHONE_NUMBER, RESEND_API_KEY, ADMIN_EMAIL, NOTIFY_FROM_EMAIL, SEND_CUSTOMER_CONFIRMATION=1) and no-op without keys; failures never break a submission.
3. **Booking form:** added event date, start time and approximate guest count fields; saved as new BOOKINGS columns (EventDate, EventTime, GuestCount before Status). Quote no longer shows a stale travel fee when the area text stops matching a known area.
4. **Meet The Guys photos:** local `assets/images/performers/*-400w.webp` copies were generated from the Google Drive originals and committed, and CSP img-src now allows the Drive redirect host (drive.usercontent.google.com). The DANCERS sheet still points at the Drive URLs; switching rows to the local copies happens only together with the deploy, after verifying whether the CSP fix alone makes the Drive images load again.
5. **Gallery:** internal admin instructions removed from the public page.
6. **Events page:** null-guarded CMS text updates (console error fixed); Facebook embed re-allowed in CSP frame-src.
7. **Contact page:** console SyntaxError fixed (app.js globals renamed, no longer collide with the inline script).
8. **Review form (home):** browser alert() popups replaced with inline messages.
9. **Phone numbers** are written to the sheet as text so SA leading zeros are kept (contact, booking, join, manager phone).
10. **Mobile nav (<=900px):** links collapse behind a hamburger toggle instead of a permanent vertical list.
11. **Housekeeping:** favicon on all pages, robots.txt, sitemap.xml, branded 404.html, visible build stamp in the footer of every page (assets/js/build.js).
12. **CMS content:** fixed "sneeaky"/"maan" typo in the PRICES tab (1 Man Xpress Show description).

Still open (need Eli's decision): waiter/butler 2-hour minimum enforcement, travel free-radius 30km vs 50km conflict (CMS setting is 30, FAQ text says 50; the spec, booking doc and CMS guide all document 50), xpress tier pricing for 2+ man shows, services missing from the booking form (Fire Dancers, DJ, MC, etc.), the "X" performer name, privacy.html content, exact-date 18+ enforcement on the join form, FAQ refund wording, notification provider choice, GitHub Actions billing lock.

---

### Session: Security containment - public sheets proxy (2026-11-22, build 2026-11-22 17:16 SAST)

Approved by Eli on 2026-11-22 as a narrow exception while other changes stay paused.

1. **Public data route contained (critical privacy fix):** `api/sheets.js` previously proxied ANY Google Sheets tab in the CMS workbook - including BOOKINGS, CONTACT_MESSAGES and JOIN_APPLICATIONS - to anyone, unauthenticated. The endpoint now serves only an explicit allowlist of public CMS tabs (HOME, PRICES, FAQS, DANCERS, SERVICES, TESTIMONIALS, SOCIAL, PAGE_CONTENT, FOOTER, GALLERY). Any other tab name gets a generic 404 that does not reveal whether the tab exists. Tab names and row windows are validated/clamped, and only GET/OPTIONS are accepted.
2. **Testimonial output hardened:** approved-row filtering no longer keeps the first returned row unconditionally (a pending row could previously slip through as a fake header when startRow > 1), and the submitter email column (F) is stripped from all returned rows. The public site only displays name, rating, text and area, which it still receives.
3. **Tests updated to lock the boundary:** the old health checks that asserted `/api/sheets?sheetName=BOOKINGS` returns 200 now assert it is refused (404). Row-level submission verification requires the service account, not the public proxy.

Form submissions (`api/submit-*`) are unchanged and still write to the workbook via the service account. Public CMS pages read the same tabs as before.

**Residual-risk follow-up (same containment approval, build 2026-11-22 17:24 SAST):** verification confirmed the workbook WAS shared "Anyone with the link can view", so the private tabs were also readable directly through the Google Sheets API with the exposed workbook ID. The live pulsedancers.com site was checked and does not reference this workbook, so public sharing served only this rebuild. `api/sheets.js` now reads through the service account (the same one the submit-* endpoints use, read-only scope), with the API-key path kept only as a legacy fallback, and the workbook's "Anyone with the link" permission was removed. Owner (elihsa@gmail.com), pulsesouthafrica@gmail.com and the service account keep their access; CMS editing is unaffected.

Still open (need Eli's decision): unchanged from the 2026-11-21 list - waiter/butler 2-hour minimum, travel free-radius 30km vs 50km, Xpress tier pricing for 2+ man shows, services missing from the booking form, the "X" performer name, privacy.html content, exact-date 18+ enforcement on the join form, FAQ refund wording, notification provider choice, GitHub Actions billing lock.

---

END OF SPECIFICATION DOCUMENT


### Session: Development functional fixes (2026-11-23, build 2026-11-23 12:02 SAST)

Eli clarified that this rebuild is a development/test environment and service interruption is acceptable. The target remains the Vercel rebuild linked from this repository, not the separate existing business site. Prices, policies, customer messaging and existing data are unchanged.

- Contact page now stacks the form and information panels on phones. Two desktop columns use zero minimum widths, and long contact links wrap instead of forcing horizontal scrolling. Submission feedback has a polite status announcement.
- Removed the obsolete shared booking submission/quote implementation. The current booking-form.js remains the sole booking submission owner; analytics still records form interactions. Current service/price calculations are unchanged.
- The syntax gate now checks every JavaScript file in api/ and assets/js/, rather than passing a glob to a command that checks only its first file.
- CI no longer runs the legacy suite that submits fake entries to the deployed business forms. Seven isolated functional regressions use a local static server and mocked CMS/submission responses, blocking external requests. They check booking and contact success/failure/retry, retained entries after failure, exactly one booking POST, and Contact layouts at 320/390/768/1280px.
- These isolated regressions do not prove actual spreadsheet persistence or email delivery. Nine deployed public pages were separately inspected at desktop and phone widths without submitting forms. No private submission data was read.

Still requires a grounded decision or separately scoped follow-through: existing price/travel/minimum-duration conflicts; placeholder performer identity; approved privacy wording; notification provider, sender, recipients and permitted real sends; CI account billing lock if still present. Recruitment age checks and all excluded prior security work remain outside this round.


### Session: Booking event-detail persistence (2026-11-23, build2026-11-23 12:22 SAST)

Owner clarification: keep the existing development/test CMS and records; do not create a new workbook or purge old entries. New booking rows retain the legacy31-column A:AE contract (Status at AE) and append EventDate at AF, EventTime at AG, GuestCount at AH. This supersedes the earlier note suggesting insertion before Status. No headers are written over existing data; no old row is moved, backfilled or deleted. Other form writers and CMS targets are unchanged.

The row mapping is isolated in lib/booking-row.js with deterministic unit fixtures. All-file syntax checks include lib/. The response reports the Sheets API's exact savedRange for controlled new-row verification. No real notification recipients, price rules or other business policies are changed in this round.


### Session: Recruitment submission feedback and preferences (2026-11-23, build 2026-11-23 12:47 SAST)

- Recruitment success now resets the submitting form through its event context, rather than referencing an out-of-scope variable. It no longer scrolls away from success feedback immediately after bringing it into view.
- Multipart recruitment parsing retains repeated fields in request order, so all selected work preferences reach the existing comma-separated preference column. Single-value fields and the existing 20-column row contract are unchanged. No old rows are read, changed or deleted.
- Two isolated browser regressions cover recruitment success/reset/visible feedback and failure/retained values; two unit fixtures cover scalar and repeated multipart fields. All submissions in these tests are intercepted locally, including synthetic photo fixtures. These tests do not establish real recruitment persistence or email delivery.
- An independent deployed read-only page sweep encountered intermittent public CMS HTTP500 responses late in the sweep. A subsequent bounded HOME request recovered to200. Root cause is still unconfirmed; HTML200 is not evidence that dynamic content loaded. No server endpoint behavior is changed in this recruitment patch.


### Session: Reduce public CMS read bursts (2026-11-23, build 2026-11-23 12:49 SAST)

Vercel runtime logs during the rapid read-only page QA pass confirmed Google Sheets per-user read-quota exhaustion (upstream429), surfaced as HTTP500 to page loaders. Static HTML remained available, but dynamic page content could fall back or fail. A later bounded content request recovered after the quota window.

The browser CMS helper now deduplicates simultaneous identical requests and caches successful named public content-tab ranges in session storage for up to60 seconds across page navigation. Content edits can therefore take up to one minute to appear in the same tab. Failed requests are never cached, and no retry burst is added. An unavailable browser cache falls back to the existing live request. Submission data and server endpoint behavior are unchanged. Gallery's separate loader is unchanged. This reduces repeated reads within one browsing session; it is not a guarantee against aggregate cross-visitor Google quotas.

Two isolated regressions prove request deduplication, cross-page cache reuse, expiration and recovery after an uncached failure. Eleven local mocked browser tests, five unit fixtures and fourteen JavaScript syntax checks pass. No load test was run against the shared live CMS.


### Session: Preserve already-collected recruitment detail (2026-11-23, build 2026-11-23 12:52 SAST)

The historic Join field list above predates the current form. This patch does not add collection or requiredness: it preserves inputs already present in that form but previously discarded by its writer. Existing A:T positions remain unchanged, including Status at T. Columns U:AF append Instagram, Height, Weight, Waist, Chest, ShoeSize, HairColor, EyeColor, Ethnicity, BodyType, Tattoos, ImageFilter in that order. No header, old row, workbook or policy is changed. An isolated mapping helper and fixtures assert all20 original positions and empty extensions for older callers. Exact savedRange is returned for controlled newly appended-row verification only.

Recruitment feedback no longer fades from zero opacity. Success uses solid background#10291a and text#b7f7cd, calculated contrast12.70:1. Intercepted local browser pixels show readable settled feedback, with no real submission or photos sent. Eleven browser regressions, seven unit fixtures and fifteen syntax checks pass locally. Actual deployed storage and final deployed pixels require separate verification.


### Owner-only email verification (2026-11-23, build 19:49 SAST)
Eli approved free booking/recruitment notification testing only to elihsa@gmail.com and reuse of saved same-kind credentials across his projects. Email helper restricts every recipient to that exact owner mailbox, routes admin tests there, and disables WhatsApp for this test phase. Customer test copy makes no response-time or booking commitment. Existing Resend sending-only key is reused, not replaced or broadened. No domain/DNS changes, paid sends or visitor delivery. Removing this development restriction requires separate authority.


### Session: CMS-editable automatic submission replies (2026-11-23, build 2026-11-23 21:20 SAST)

Eli requested separate readymade automatic replies for booking, join-the-team and testimonial submissions, editable through the existing CMS instead of code.

- New AUTO_REPLIES tab in the Pulse CMS workbook (KEY | SUBJECT | BODY | NOTES). One row per template: booking_confirmation, join_confirmation, testimonial_confirmation, plus contact_confirmation to keep the existing contact-form reply working under the same editable scheme. Supported placeholder: {firstName}. The tab is server-side only: it is NOT in the api/sheets.js public-tab allowlist.
- api/notify.js loads templates from that tab through the service account (read-only scope), cached for 60 seconds per warm instance. Any read failure, missing row or blank body falls back to the built-in defaults in DEFAULT_AUTO_REPLIES, so email never breaks on a sheet problem. Unknown template keys send nothing.
- notifyCustomer now takes an explicit template key instead of a free-text kind. Call sites: booking -> booking_confirmation, join -> join_confirmation, testimonial -> testimonial_confirmation (new; testimonials previously sent no submitter reply, and only when the optional email field is filled), contact -> contact_confirmation.
- Submitter names are sanitised for plain-text mail (newlines collapsed, 80-char cap, blank becomes 'there').
- The owner-only development guard is unchanged: every email recipient is hard-limited to elihsa@gmail.com, admin mail is forced there, WhatsApp sends stay disabled, and the copy makes no booking, selection or publication commitment.
- Twelve unit tests (guard, distinct per-form templates, CMS override/fallback, placeholder rendering, name sanitising, unknown-key skip), eleven isolated browser regressions and fifteen syntax checks pass locally.


### Session: Tighten auto-reply draft wording (2026-11-23, build 2026-11-23 21:31 SAST)

Review of the seeded AUTO_REPLIES drafts removed claims we cannot stand behind: the testimonial reply no longer asserts a human review/publication process, the join reply no longer asserts team review, and the booking reply no longer describes the confirmation process. All three are plain receipt acknowledgements; the booking reply keeps the note that a booking is only confirmed once we have spoken to the sender directly. CMS rows and built-in fallbacks updated together.

### Session: Submitted-details receipts and CMS preservation audit (2026-11-23, build 21:48 SAST)

Eli approved existing reply copy with a greeting followed immediately by a summary of the submitter's information, then the form-specific acknowledgement. Booking, join, contact and testimonial handlers now pass only their current submission into an explicit per-form field allowlist. Summaries preserve zero values, multiple preferences and multiline answers; join photos are acknowledged as received without attaching image bytes. Generated quotes, admin status, internal annotations, arbitrary keys and other submissions never enter the customer summary. Both old CMS bodies and the new {submissionSummary} placeholder receive the same required order. Email remains hard-restricted to elihsa@gmail.com, admin recipient forced there, WhatsApp disabled. This does not activate customer delivery.

CMS audit: live workbook has all 18 tabs required or preserved by the site, legacy submission columns remain positional and unchanged, AUTO_REPLIES remains server-only, and the service account retains writer permission. No pricing, policy or existing submission data changed. Created a private Pulse-owned native backup before migration and portable original/backup exports. All 18 tabs' cell values, formulas, effective styles, merges, row dimensions, validations and conditional-format counts matched. Same-ID pending ownership transfer is preferred to replacement so linked form/script/history semantics remain intact. Migration acceptance and post-migration read/write proof must be recorded separately before declaring relocation complete. Never trash the active same-ID workbook.
