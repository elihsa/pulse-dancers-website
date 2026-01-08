# Pulse Dancers - Complete Google Sheets CMS Template

Copy each section below into the corresponding tab in your Google Sheet:
https://docs.google.com/spreadsheets/d/12zPYBbpdDLhqTPylP0oUgPqimy5fXIfg/edit

---

## Tab 1: HOME

| Field | Value |
|-------|-------|
| heroTitle | Fulfill your Fantasies |
| heroSubtitle | PULSE Male Revue INTERNATIONAL - South Africa's Most Desired Men |
| aboutTitle | About Pulse Male Revue |
| aboutText | Pulse is South Africa's premier male entertainment service, providing professional dancers and entertainers for bachelorette parties, ladies nights, and special events. Our hand-picked team of performers are screened for personality, professionalism, and crowd control abilities. |

---

## Tab 2: PRICES

| Service | Price | Duration | Description |
|---------|-------|----------|-------------|
| Male Stripper Show | 2500 | 20 minutes | Full choreographed performance with costume and music |
| Topless Waiter | 800 | Per hour | Professional, well-groomed waiter in black pants |
| Bottomless Waiter | 1000 | Per hour | Waiter wearing apron and g-string |
| Naughty Games / MC | 1500 | 30-45 minutes | Interactive games and entertainment |
| Female Stripper | 2500 | 20 minutes | For bachelor parties |
| Hot Promoters | 600 | Per hour | Professional promotional models |
| Fitness Models | 800 | Per hour | Professional fitness talent |

**Additional Info:**
- Travel: R4/km (round trip) outside 50km radius from Sandton City
- All prices exclude travel fees

---

## Tab 3: FAQS

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

---

## Tab 4: SERVICES

| Name | Description | Active |
|------|-------------|--------|
| Male Strippers | Professional choreographed shows with costume, music, and crowd interaction. Perfect for bachelorette parties and ladies nights. | TRUE |
| Topless Waiters | Well-mannered, good-looking guys in black pants serving drinks and entertaining your guests with charm and professionalism. | TRUE |
| Bottomless Waiters | The naughtier option - waiters in aprons and g-strings providing drinks and entertainment for adult parties. | TRUE |
| Naughty Games / MC | Interactive 30-45 minute entertainment package including party games, challenges, and professional MC services. | TRUE |
| Female Strippers | Professional female entertainers for bachelor parties and mixed events. | TRUE |
| Hot Promoters | Professional promotional models for events, brand activations, and parties. | TRUE |
| Fitness Models | Professional fitness talent for events, photo shoots, and promotions. | TRUE |

---

## Tab 5: DANCERS (Performers)

| Name | Bio | Specialties | Photo | Active |
|------|-----|------------|-------|--------|
| [To be filled with performer names] | [Bio text] | [Specialties] | assets/images/performers/[name].jpg | TRUE |

**Note:** After organizing performer photos, add their information here.

**Example Row:**
| Name | Bio | Specialties | Photo | Active |
|------|-----|------------|-------|--------|
| Thunder | Professional dancer with 5+ years experience. Known for high-energy performances and crowd engagement. | Choreography, MC, Topless Waiter | assets/images/performers/thunder.jpg | TRUE |

---

## Tab 6: TESTIMONIALS

| Name | Rating | Text | Location |
|------|--------|------|----------|
| Sarah M | 5 | Amazing show! The guys were professional, entertaining, and made the bachelorette party unforgettable. Highly recommend! | Johannesburg |
| Jessica K | 5 | Best entertainment we've ever had. The topless waiters were so charming and the show was incredible. Worth every cent! | Pretoria |
| Michelle R | 5 | Professional service from start to finish. Easy booking, great communication, and an unforgettable performance. | Sandton |

---

## Tab 7: SOCIAL

| Field | Value |
|-------|-------|
| facebookURL | https://www.facebook.com/pulseSouthAfrica |
| instagramUsername | pulsesouthafrica |
| instagramPost1 | [Paste Instagram post URL] |
| instagramPost2 | [Paste Instagram post URL] |

---

## How to Import This Data

### Method 1: Copy/Paste (Easiest)
1. Create a tab in your Google Sheet for each section above
2. Copy the table from this file
3. Paste into the Google Sheet tab
4. Format as needed

### Method 2: Use CSV Files (Faster)
1. Import the CSV files from `/cms-data/` folder
2. Each CSV corresponds to a tab

---

## Getting Sheet GIDs

Each tab has a unique GID needed for the website to fetch data:

1. Click on a tab (e.g., "PRICES")
2. Look at URL: `...edit#gid=123456789`
3. The number after `gid=` is that tab's GID
4. Update these in `/assets/js/sheets-cms.js`:

```javascript
const SHEET_GIDS = {
  HOME: '0',
  PRICES: 'your-prices-gid',
  FAQS: 'your-faqs-gid',
  DANCERS: 'your-dancers-gid',
  SERVICES: 'your-services-gid',
  TESTIMONIALS: 'your-testimonials-gid',
  SOCIAL: 'your-social-gid'
};
```

---

## Next Steps

1. ✅ Copy tables above into your Google Sheet
2. ✅ Upload performer photos to `/assets/images/performers/`
3. ✅ Fill in DANCERS tab with performer info
4. ✅ Get each tab's GID from URLs
5. ✅ Update `sheets-cms.js` with correct GIDs
6. ✅ Test your site!

---

## Notes

- Make sure each tab name in Google Sheets matches the names used above (HOME, PRICES, FAQS, etc.)
- Keep the first row as headers in each sheet
- Data rows start from row 2
- For TRUE/FALSE values, use capital letters
- For prices, use numbers only (no currency symbols in the cell)
- For active performers, set Active column to TRUE
