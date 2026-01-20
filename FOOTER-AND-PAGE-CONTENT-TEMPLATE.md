# FOOTER and PAGE_CONTENT Tab Templates

This document provides the data structure for the two tabs that were missing from your Google Sheet.

## Tab: FOOTER

**Format:** 2 columns (Field | Value)

Copy the table below into your FOOTER tab:

| Field | Value |
|-------|-------|
| copyright | © 2025 Pulse Male Revue - South Africa. |
| email | info@pulsedancers.com |
| facebookURL | https://www.facebook.com/pulseSouthAfrica |
| facebookText | Facebook |
| instagramURL | https://www.instagram.com/pulsesouthafrica |
| instagramText | Instagram |

**What these fields do:**
- `copyright` - The copyright text displayed in the footer
- `email` - Contact email address (creates mailto link)
- `facebookURL` - Link to Facebook page
- `facebookText` - Text shown for Facebook link (default: "Facebook")
- `instagramURL` - Link to Instagram profile
- `instagramText` - Text shown for Instagram link (default: "Instagram")

---

## Tab: PAGE_CONTENT

**Format:** 3 columns (Page | Key | Value)

This tab controls editable text on each page. Copy the tables below into your PAGE_CONTENT tab:

### PRICES Page Content

| Page | Key | Value |
|------|-----|-------|
| PRICES | pageTitle | Pricing |
| PRICES | pricingNotes | All prices are excl. travel and sustenance. Contact us for custom packages. |
| PRICES | howTitle | How Pricing Works |
| PRICES | baseRateTitle | Base Rate |
| PRICES | baseRateText | Show or service price above. |
| PRICES | travelTitle | Travel |
| PRICES | travelText | R4 per km outside 50km radius from Sandton City (round trip). |
| PRICES | customTitle | Custom Packages |
| PRICES | customText | Multi-day events, VIP add-ons, theme packages - contact us for a tailored quote. |
| PRICES | ctaTitle | Ready to Book? |
| PRICES | ctaDescription | Get a personalized quote based on your event details with automatic distance calculation. |
| PRICES | ctaButton | Get a Quote |

### FAQ Page Content

| Page | Key | Value |
|------|-----|-------|
| FAQ | pageTitle | Frequently Asked Questions |
| FAQ | pageDescription | Find answers to common questions about our services, pricing, and booking process. |
| FAQ | footerTitle | Still have questions? |
| FAQ | footerDescription | Contact us directly or submit a booking request for a personalized consultation. |

### MEET Page Content

| Page | Key | Value |
|------|-----|-------|
| MEET | pageTitle | Meet The Guys |
| MEET | pageDescription | Our team consists of professional, hand-picked performers who are screened for personality, professionalism, and crowd control. Each performer brings unique energy and expertise to create an unforgettable experience. |
| MEET | specialTitle | What Makes Our Team Special |
| MEET | specialList | Professionally trained dancers and performers\|Extensive experience in crowd interaction and entertainment\|Respectful, courteous, and adaptable to any event atmosphere\|Diverse team able to match various event themes and preferences\|Regular training and choreography updates |
| MEET | requestTitle | Request Specific Performers |
| MEET | requestDescription | When you book with Pulse, you can request specific performers based on your preferences. Once selected, they're locked in for your event - no last-minute changes without your consent. |
| MEET | requestButton | Book Your Event |
| MEET | joinTitle | Interested in Joining Our Team? |
| MEET | joinDescription | We're always looking for talented, professional performers to join Pulse Male Revue. If you have what it takes, we'd love to hear from you. |
| MEET | joinButton | Apply Now |

### EVENTS Page Content

| Page | Key | Value |
|------|-----|-------|
| EVENTS | pageTitle | Events & Socials |
| EVENTS | pageDescription | Stay connected with Pulse and never miss an update. Follow our upcoming events and latest social media posts below. |
| EVENTS | upcomingTitle | Upcoming Events |
| EVENTS | upcomingDescription | Check out our upcoming shows and events on Facebook. |
| EVENTS | instagramTitle | Follow Us on Instagram |
| EVENTS | instagramDescription | See our latest photos and behind-the-scenes content. |

### BOOK Page Content

| Page | Key | Value |
|------|-----|-------|
| BOOK | pageTitle | Book Pulse for Your Event |
| BOOK | pageDescription | Fill out the form below with your event details. We'll respond within 24 hours with a personalized quote. |

### JOIN Page Content

| Page | Key | Value |
|------|-----|-------|
| JOIN | pageTitle | Join the Pulse Team |
| JOIN | pageDescription | Pulse Dancers, Africa's most sought-after male revue show, is on the lookout for new talent. If you're a professional male dancer, performer or waiter looking for lucrative work, we want to hear from you. |
| JOIN | pageBanner | <strong>📧 Application Form:</strong> Fill out the form below to apply to join the Pulse team. All applications are reviewed carefully and we'll contact you within 5 business days. |

---

## How to Add This Data to Your Google Sheet

### Method 1: Copy & Paste (Easiest)

1. **For FOOTER tab:**
   - Open your Google Sheet
   - Go to the FOOTER tab
   - Copy the FOOTER table from above (including headers)
   - Paste into cell A1
   - Format as needed (bold headers, etc.)

2. **For PAGE_CONTENT tab:**
   - Go to the PAGE_CONTENT tab
   - Copy all the PAGE_CONTENT tables from above
   - Paste into cell A1
   - Make sure all rows are included (about 40+ rows total)

### Method 2: Type Manually

If copy/paste doesn't work well:
1. Add the header row first: Page | Key | Value (for PAGE_CONTENT) or Field | Value (for FOOTER)
2. Type each row of data
3. Make sure spelling and capitalization match exactly

---

## Important Notes

- **Case-Sensitive:** Page names (PRICES, FAQ, MEET, etc.) must match exactly
- **Keys Must Match:** The "Key" column values must match exactly what's in the code
- **Pipe Character:** For `specialList`, use the pipe character `|` to separate list items
- **HTML Allowed:** The `pageBanner` field in JOIN page can contain basic HTML like `<strong>` and `<em>`
- **No Empty Rows:** Make sure there are no empty rows between data entries

---

## Testing After Adding Data

1. Save your Google Sheet
2. Visit your deployed website (not localhost)
3. Open browser console (F12 > Console)
4. Look for: `[Pulse CMS] Initialized successfully`
5. Check each page to see if content loads from sheets
6. Footer should show your contact info on all pages

---

## Troubleshooting

**If content doesn't load:**
- Check tab names are exactly: FOOTER and PAGE_CONTENT (all caps)
- Check spelling of all field names (case-sensitive)
- Make sure sheet is public: Share > Anyone with link can view
- Check browser console for error messages
- Visit /test-cms.html on your deployed site to run diagnostics

**If some pages work but others don't:**
- Double-check the "Page" column values match page names (PRICES, FAQ, etc.)
- Make sure all Keys for that page are present
- Check for typos in Key names
