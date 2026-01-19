# Google Sheets CMS Setup Guide

This guide shows you exactly what to add to your Google Sheets to make all website content editable via CMS.

## Sheet ID
Your Google Sheet ID: `1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4`

## Required Sheets (Tabs)

You need to create the following tabs in your Google Sheet. The tab names must match exactly (case-sensitive):

1. HOME
2. PRICES
3. FAQS
4. DANCERS
5. SERVICES
6. TESTIMONIALS
7. SOCIAL
8. PAGE_CONTENT
9. FOOTER

---

## 1. HOME Sheet

This controls the homepage hero section, about section, and services list.

| Field | Value |
|-------|-------|
| heroKickerText | Choreographed Male Revue |
| heroTitle | Fulfill your Fantasies |
| heroSubtitle | South Africa's choreographed male revue for bachelorettes, ladies nights and corporate events. Hand-picked performers. Professional. Respectful. Unforgettable. |
| heroCTA1 | Book a Show |
| heroCTA2 | View Prices |
| heroCTA3 | Join the Team |
| heroSideTitle | The Full Experience |
| heroSideDescription | Choreographed shows, topless & bottomless waiters, games, MCs, custom appearances. |
| heroTagline | Hand-picked performers screened for personality, professionalism and crowd control. |
| aboutTitle | About Pulse Male Revue |
| aboutDescription | Pulse is choreographed male entertainment built around strong performers, tight routines, and respectful, professional crowd interaction. You decide how wild or conservative; the team adjusts to your crowd. |
| servicesTitle | What We Offer |
| servicesList | Choreographed strip shows (1-man, multi-man)\|Topless and bottomless waiters\|Naughty games with a host\|Custom appearances and brand activations |
| topBannerImage | assets/images/top.png |

**Note:** For servicesList, separate each item with a pipe character (`|`).

---

## 2. PRICES Sheet

This controls the pricing table on the prices page.

| Service | Price | Duration | Description |
|---------|-------|----------|-------------|
| Male Stripper Show | 2500 | 20 minutes | Full choreographed performance with costume and music |
| Topless Waiter | 800 | Per hour | Professional, well-groomed waiter in black pants |
| Bottomless Waiter | 1000 | Per hour | Waiter wearing apron and g-string |
| Naughty Games / MC | 1500 | 30-45 minutes | Interactive games and entertainment |
| Female Stripper | 2500 | 20 minutes | For bachelor parties |

**Note:** First row is the header row. Price values should be numbers only (no R or currency symbols).

---

## 3. FAQS Sheet

This controls all FAQ questions and answers.

| Question | Answer |
|----------|--------|
| Are rates inclusive of travel? | No, our rates do not include travel. Travel is calculated at R4 per kilometer (round trip) outside a 50km radius from Sandton City, Johannesburg. |
| What's included in a show? | A full show includes choreographed performance, music, costume, and audience interaction. Duration varies by package (typically 20 minutes for stripper shows). |
| How do we book? | Fill out our booking form with your event details. We'll calculate a quote including performance fee and travel. Once confirmed, we lock in your chosen performers. |
| Do you operate outside Gauteng? | Yes! We service all of South Africa. Travel fees apply based on distance from Johannesburg. |
| What do I need for a show? | You need: (1) A change room or prep area near the performance space, (2) Water for performers, (3) A chair without arms (not a bar stool), (4) A sound system louder than your guests, (5) Semi-circle seating arrangement with guest of honor in center. |
| How long does a show take? | Total time is approximately 1 hour: 15 minutes setup, 20 minutes performance, 15 minutes pack up, 15 minutes for photos and mingling. |
| Should we lock away pets? | Yes, please secure all pets during the performance for safety and to avoid distractions. |
| What are topless waiters? | Professional, well-groomed male waiters wearing only black pants. They serve drinks, interact with guests, and add entertainment value to your event. |
| What are bottomless waiters? | A naughtier option where waiters wear an apron and g-string. They serve drinks and provide adult entertainment. |
| Can we request specific guys? | Yes! Once you book and select your performers, they are locked in for your event - no last-minute substitutions. |
| What about bottomless shows? | We offer fully customizable shows. Discuss your preferences when booking and we'll accommodate your requests. |
| What are the naughty games? | Interactive 30-45 minute entertainment including party games, audience participation, and MC services to keep your event lively. |

**Note:** First row is the header row.

---

## 4. DANCERS Sheet

This controls performer profiles on the "Meet The Guys" page.

| Name | Bio | Specialties | Photo | Active |
|------|-----|------------|-------|--------|
| Example Dancer | Professional dancer with 5+ years experience. Known for high-energy performances. | Choreography, MC, Topless Waiter | assets/images/performers/example.jpg | TRUE |

**Instructions:**
- Add one row per performer
- Active must be TRUE or FALSE (case-sensitive)
- Photo should be the path to the image file
- Only performers with Active=TRUE will display on the website

---

## 5. SERVICES Sheet

This controls the services descriptions on the website.

| Name | Description | Active |
|------|-------------|--------|
| male_strippers | Professional choreographed shows with costume, music, and crowd interaction. Perfect for bachelorette parties and ladies nights. | TRUE |
| topless_waiters | Well-mannered, good-looking guys in black pants serving drinks and entertaining your guests with charm and professionalism. | TRUE |
| bottomless_waiters | The naughtier option - waiters in aprons and g-strings providing drinks and entertainment for adult parties. | TRUE |
| naughty_games_mc | Interactive 30-45 minute entertainment package including party games, challenges, and professional MC services. | TRUE |
| female_strippers | Professional female entertainers for bachelor parties and mixed events. | TRUE |

**Note:** Service names should use underscores instead of spaces.

---

## 6. TESTIMONIALS Sheet

This controls customer testimonials displayed on the homepage.

| Name | Rating | Text | Area | Email | Date | Status |
|------|--------|------|------|-------|------|--------|
| Sarah M | 5 | Amazing show! The guys were professional, entertaining, and made the bachelorette party unforgettable. Highly recommend! | Johannesburg | sarah@example.com | 2025-01-01 | Approved |
| Jessica K | 5 | Best entertainment we've ever had. The topless waiters were so charming and the show was incredible. Worth every cent! | Pretoria | jessica@example.com | 2025-01-05 | Approved |

**Important:** 
- Status column (column G) must be "Approved" for testimonials to show on website
- Rating should be a number from 1 to 5
- Only testimonials with Status=Approved will display

---

## 7. SOCIAL Sheet

This controls social media links and Instagram posts.

| Field | Value |
|-------|-------|
| facebookURL | https://www.facebook.com/pulseSouthAfrica |
| instagramUsername | pulsesouthafrica |
| instagramPost1 | https://www.instagram.com/p/[POST_ID]/ |
| instagramPost2 | https://www.instagram.com/p/[POST_ID]/ |

**Note:** Replace [POST_ID] with actual Instagram post IDs. First 2 posts will display on homepage and events page.

---

## 8. PAGE_CONTENT Sheet (NEW!)

This controls all page-specific text (headings, descriptions, CTAs) across the website.

Format: | Page | Key | Value |

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

### EVENTS Page Content

| Page | Key | Value |
|------|-----|-------|
| EVENTS | pageTitle | Events & Socials |
| EVENTS | pageDescription | Stay connected with Pulse and never miss an update. Follow our upcoming events and latest social media posts below. |
| EVENTS | upcomingTitle | Upcoming Events |
| EVENTS | upcomingDescription | Check out our upcoming shows and events on Facebook. |
| EVENTS | instagramTitle | Follow Us on Instagram |
| EVENTS | instagramDescription | See our latest photos and behind-the-scenes content. |

**Note:** For lists, separate items with pipe character (`|`). For HTML in pageBanner, you can use basic HTML tags.

---

## 9. FOOTER Sheet (NEW!)

This controls footer content across all pages.

| Field | Value |
|-------|-------|
| copyright | © 2025 Pulse Male Revue - South Africa. |
| email | info@pulsedancers.com |
| facebookURL | https://www.facebook.com/pulseSouthAfrica |
| facebookText | Facebook |
| instagramURL | https://www.instagram.com/pulsesouthafrica |
| instagramText | Instagram |

---

## How to Set Up

### Step 1: Open Your Google Sheet
Open: https://docs.google.com/spreadsheets/d/1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4/edit

### Step 2: Create Tabs
Create these 9 tabs at the bottom of your sheet (click + to add new tabs):
- HOME
- PRICES
- FAQS
- DANCERS
- SERVICES
- TESTIMONIALS
- SOCIAL
- PAGE_CONTENT
- FOOTER

### Step 3: Copy Data
For each tab, copy the table data from this guide into the corresponding tab in your Google Sheet.

### Step 4: Make Sheet Public
1. Click "Share" button (top right)
2. Change "Restricted" to "Anyone with the link"
3. Set permission to "Viewer"
4. Click "Done"

### Step 5: Test
Visit your website and check that content loads correctly. If nothing appears, check:
- Sheet is public (Anyone with link can view)
- Tab names match exactly (case-sensitive)
- First row in each sheet is the header row
- No extra spaces in column names

---

## Updating Content

To update any text on your website:

1. Open your Google Sheet
2. Find the appropriate tab (e.g., PAGE_CONTENT for page headings, HOME for hero section)
3. Edit the Value column for the content you want to change
4. Changes appear on your website within a few minutes (may need to refresh browser)

---

## Troubleshooting

**Content not loading?**
- Check that sheet is set to "Anyone with link can view"
- Verify tab names match exactly (case-sensitive: HOME, not home)
- Check browser console for error messages (F12 key)

**Some content still shows defaults?**
- Make sure you created ALL 9 tabs
- Verify the Key names in PAGE_CONTENT sheet match exactly
- Check for typos in Field names

**Old content caching?**
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Try in incognito/private window

---

## API Key Note

The website uses this API key to fetch data from Google Sheets:
- Key: `AIzaSyBqmw5wBmz54vV7AUvH91UNqW6_gDLwrmw`
- Sheet ID: `1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4`

Both are configured in `/api/sheets.js` file. If you need to change the Google Sheet or API key, update that file.
