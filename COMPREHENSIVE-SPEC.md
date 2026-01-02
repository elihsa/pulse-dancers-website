# COMPREHENSIVE SITE SPECIFICATION - Pulse Dancers Website

## Document Purpose
This specification consolidates ALL requirements, changes, and features for the Pulse Dancers website. It serves as the complete blueprint for rebuilding or maintaining the site.

## Project Overview
- **Site Name:** Pulse Male Revue / Pulse Dancers
- **Purpose:** Professional male entertainment booking website for South Africa
- **Technology:** Static HTML/CSS/JS with Netlify CMS, hosted on Netlify
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
7. **/admin/** - Netlify CMS dashboard (login-protected)

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
- Travel Fee (R4/km beyond 50km free radius)
- **Estimated Total**

**Additional:**
- Notes (textarea, optional)
- Submit button

**Technical Implementation:**
- Native Netlify Forms
- Google Maps API: Distance Matrix + Places Autocomplete
- API Key: AIzaSyDmIhz0iWcB8R-BBXkFFGi36bCQIm7fgA8
- Base Location: Sandton City, Johannesburg
- Free Radius: 50km
- Rate: R4/km (round trip)

**Form Submission:**
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
- Destination: info@pulsedancers.com
- Native Netlify Forms with file upload support

---

### 4. Pricing Page (prices.html)

**Content:**
- Pricing table (CMS-editable)
  - Columns: Service | Duration | Price (R)
  - Rows loaded from /data/prices.json
- General notes (CMS-editable)
- "How Pricing Works" section
  - Base Rate
  - Travel (R4/km outside 50km)
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

## CMS Configuration (Netlify CMS / Decap v3)

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

### Netlify Forms Configuration
Both forms use native Netlify Forms with these attributes:
```html
<form name="form-name" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="form-name">
  <p style="display:none;">
    <label>Don't fill this out: <input name="bot-field" /></label>
  </p>
  <!-- form fields -->
</form>
```

### Form Destinations
- **Booking Form:** bookings@pulsedancers.com
- **Join Form:** info@pulsedancers.com

### Accessing Submissions
- Netlify Dashboard → Site → Forms tab
- Email notifications configured in Netlify
- CSV export available
- Free tier: 100 submissions/month

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
├── index.html
├── book.html
├── join.html
├── prices.html
├── faq.html
├── meet-the-guys.html
│
├── admin/
│   ├── index.html (Netlify CMS interface)
│   └── config.yml (CMS configuration)
│
├── assets/
│   ├── css/
│   │   └── styles.css (all site styles)
│   ├── js/
│   │   └── app.js (all JavaScript)
│   └── images/
│       └── uploads/ (CMS-uploaded images)
│
├── data/
│   ├── home.json
│   ├── prices.json
│   ├── faq.json
│   ├── services.json
│   ├── performers.json
│   ├── testimonials.json
│   ├── social.json
│   └── booking.json
│
├── public_html/ (old Website X5 site - reference only)
│
├── CMS-SETUP.md
├── CMS-GUIDE.md
├── EDITING-GUIDE.md
├── IMPLEMENTATION-SUMMARY.txt
├── README.md
└── COMPREHENSIVE-SPEC.md (this file)
```

---

## Deployment & Hosting

### Netlify Configuration
- **Hosting:** Netlify (free tier)
- **Build Command:** None (static site)
- **Publish Directory:** / (root)
- **Branch:** main

### Required Netlify Settings
1. **Netlify Identity:** Enabled (invite-only)
2. **Git Gateway:** Enabled
3. **Forms:** Active (test by submitting once)
4. **Environment Variables:** None required (API keys in frontend)

### DNS/Domain
- Custom domain configuration in Netlify
- SSL automatically provided by Netlify

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

## Document Version
- **Version:** 2.0
- **Last Updated:** 2026-01-02
- **Author:** GitHub Copilot
- **Status:** Active Development

---

END OF SPECIFICATION DOCUMENT