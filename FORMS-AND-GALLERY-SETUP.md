# Setup Instructions for Forms and Gallery

This document explains what sheets (tabs) need to be added to your Google Sheets CMS for the new features to work.

## Required Google Sheet Tabs

Your Google Sheet (ID: `1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4`) needs the following tabs:

### 1. JOIN_APPLICATIONS (for Join Form)

**Purpose:** Stores applications from people wanting to join the Pulse team

**Columns (Row 1 - Header):**
```
Timestamp | First Name | Last Name | Birth Date | Street Address | City | Email | Phone | Preferences | Dance Experience | Promo Experience | Transport | Gym Location | Other Work | Skills | Status
```

**Example Data:**
```
2025-01-20T10:30:00.000Z | John | Doe | 05/15/1995 | 123 Main St | Johannesburg | john@example.com | +27123456789 | Dancing, Topless waitering | Yes | Yes | Yes | Virgin Active Sandton | Software Developer | DJ, Photography | Pending
```

**Notes:**
- The Status column (last column) is set to "Pending" automatically
- You can manually change status to "Approved", "Rejected", "Contacted", etc.

---

### 2. TESTIMONIALS (already exists, but verify format)

**Purpose:** Stores customer testimonials/reviews

**Columns (Row 1 - Header):**
```
Name | Rating | Text | Area | Date | Email | Status
```

**Example Data:**
```
Sarah Johnson | 5 | Amazing show! The guys were professional and so entertaining. Highly recommend! | Johannesburg | 2025-01-20 | sarah@example.com | Approved
```

**Notes:**
- Status must be "Approved" for testimonials to appear on the website
- Only testimonials with "Approved" status are displayed publicly
- Rating should be 1-5

---

### 3. CONTACT_MESSAGES (for Contact Form)

**Purpose:** Stores messages from the contact form

**Columns (Row 1 - Header):**
```
Timestamp | Name | Email | Phone | Subject | Message | Status
```

**Example Data:**
```
2025-01-20T14:30:00.000Z | Jane Smith | jane@example.com | +27987654321 | Booking Inquiry | I'd like to book for a bachelorette party on March 15th... | Unread
```

**Notes:**
- Status is set to "Unread" automatically
- Change to "Read", "Replied", "Resolved" as needed

---

### 4. GALLERY (for Photo Gallery)

**Purpose:** Manages photos displayed in the gallery page

**Columns (Row 1 - Header):**
```
Title | Description | ImageURL | Category | Date
```

**Example Data:**
```
New Year's Eve Show | Amazing crowd at our NYE performance | https://yourdomain.com/assets/images/gallery/nye-2024.jpg | Events | 2024-12-31
Behind The Scenes | Rehearsal for our latest choreography | https://yourdomain.com/assets/images/gallery/rehearsal.jpg | Behind The Scenes | 2025-01-15
```

**Notes:**
- Upload images to `assets/images/gallery/` on your web server
- Use full URLs or relative paths (e.g., `assets/images/gallery/photo.jpg`)
- Category can be: Events, Behind The Scenes, Performances, Team Photos, etc.

---

### 5. CONTACT (Page Content - Optional)

**Purpose:** Customizes text on the Contact Us page

**Columns (Row 1 - Header):**
```
Page | Key | Value
```

**Example Data:**
```
CONTACT | pageTitle | Get In Touch With Us
CONTACT | pageDescription | Have questions? We're here to help!
CONTACT | email | info@pulsedancers.com
CONTACT | facebook | https://www.facebook.com/pulseSouthAfrica
CONTACT | instagram | https://www.instagram.com/pulsesouthafrica
CONTACT | location | Johannesburg, South Africa<br>Serving all major cities
```

---

### 6. GALLERY Page Content (Optional)

**Purpose:** Customizes text on the Gallery page

**Add to PAGE_CONTENT sheet:**
```
GALLERY | pageTitle | Our Photo Gallery
GALLERY | pageDescription | Browse our collection of photos from events and performances
```

---

## How to Add These Tabs

1. Open your Google Sheet: [https://docs.google.com/spreadsheets/d/1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4/edit](https://docs.google.com/spreadsheets/d/1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4/edit)

2. At the bottom, click the **+** button to add a new sheet

3. Right-click the new sheet tab and select "Rename"

4. Name it exactly as specified above (case-sensitive):
   - JOIN_APPLICATIONS
   - CONTACT_MESSAGES
   - GALLERY

5. In Row 1 of each sheet, add the column headers exactly as shown above

6. Save the sheet (Google Sheets auto-saves)

---

## Testing the Forms

### Test Join Form:
1. Visit: `https://your-site.vercel.app/join.html`
2. Fill out the form completely
3. Click "Submit Application"
4. Check the JOIN_APPLICATIONS tab in your Google Sheet
5. You should see a new row with the submitted data

### Test Review Form:
1. Visit: `https://your-site.vercel.app/` (home page)
2. Scroll to "Submit Your Review" section
3. Fill out the form
4. Click "Submit Review"
5. Check the TESTIMONIALS tab
6. Set Status to "Approved" to make it visible on the site

### Test Contact Form:
1. Visit: `https://your-site.vercel.app/contact.html`
2. Fill out the contact form
3. Click "Send Message"
4. Check the CONTACT_MESSAGES tab
5. You should see the message

---

## Troubleshooting

### "Failed to save" error:
- Check that the sheet tabs are named exactly as specified (case-sensitive)
- Verify the Google Sheet is set to "Anyone with the link can view"
- Check that the API key is valid

### Form submits but data doesn't appear:
- Check the sheet tab name matches exactly
- Look at browser console (F12) for error messages
- Verify column headers are in Row 1

### Gallery images not showing:
- Upload images to your web hosting
- Use full URLs or correct relative paths
- Check image file permissions

---

## Support

For more help:
- See `CMS-TROUBLESHOOTING.md` for CMS issues
- See `API-KEY-SETUP-GUIDE.md` for API key problems
- Check browser console (F12) for error messages
