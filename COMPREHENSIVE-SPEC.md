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
- Travel Fee (R4/km beyond 50km free radius)
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
- Rate: R4/km (round trip)

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

## CMS Configuration (Google Sheets)

**Google Sheets CMS Overview:**
- Content managed via Google Sheets
- Real-time updates without redeployment
- Sheet ID: `12zPYBbpdDLhqTPylP0oUgPqimy5fXIfg`
- Access via Google Sheets API with API Key

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
- Travel Fee = (distance - 50km) × R4/km
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
- **Version:** 2.1
- **Last Updated:** 2026-01-04
- **Author:** GitHub Copilot
- **Status:** Active Development
- **Recent Changes:** Added booking automation system documentation

---

END OF SPECIFICATION DOCUMENT