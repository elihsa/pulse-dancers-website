# Setup Required

This document outlines the remaining setup steps that require user action.

## 1. Web3Forms Access Keys (CRITICAL)

Both the booking form and join form are configured to use Web3Forms for submissions, but the access keys need to be replaced with your actual keys.

**Files to update:**
- `book.html` - Line 60
- `join.html` - Line 55

**Current placeholder:**
```html
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
```

**Steps to get your access keys:**
1. Visit https://web3forms.com
2. Sign up for a free account
3. Create two access keys:
   - One for bookings (will send to bookings@pulsedancers.com)
   - One for applications (will send to info@pulsedancers.com)
4. Replace "YOUR_ACCESS_KEY_HERE" with your actual keys

## 2. Logo Image (OPTIONAL)

The site currently displays "PULSE" as text branding because no logo image exists.

**To add a logo:**
1. Place your logo file at: `assets/images/logo.png` (or .jpg)
2. The logo should include:
   - Pulse branding
   - Heartbeat/EKG line design
   - "INTERNATIONAL" text (if applicable)
   - "South Africa's Most Desired Men" tagline (if applicable)

**Note:** All pages already have a fallback mechanism. If the logo image doesn't exist, it will show "PULSE" text instead.

## 3. Google Sheets Content

The Google Sheets integration is fully configured and will work once the sheet is populated with data.

**Configuration (already set up):**
- Sheet ID: `1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4`
- API Key: `AIzaSyBqmw5wBmz54vV7AUvH91UNqW6_gDLwrmw`

**What will load from Google Sheets:**
- Prices page → PRICES tab (GID: 2117273325)
- FAQ page → FAQS tab (GID: 568464878)
- Meet The Guys page → DANCERS tab (GID: 116112300)
- Booking form services → SERVICES tab (GID: 1118530609)
- Homepage testimonials → TESTIMONIALS tab (GID: 735891537)
- Instagram posts → SOCIAL tab (GID: 1025475414)

**Action required:**
1. Ensure all tabs in your Google Sheet are properly populated
2. Make sure the sheet is publicly viewable (Share → Anyone with the link can view)
3. Test each page to verify data loads correctly

## 4. Performer Photos (OPTIONAL)

If you have performer photos, place them in:
`assets/images/performers/`

The meet-the-guys page will automatically display photos if:
- The DANCERS tab in Google Sheets includes an image filename in column 7
- The image file exists in the performers directory

## 5. Testing Checklist

After completing the setup above, test:

- [ ] Visit prices.html - Data loads from Google Sheets
- [ ] Visit faq.html - FAQs load with working accordion
- [ ] Visit meet-the-guys.html - Performers load (or shows "coming soon")
- [ ] Visit book.html - Services load, quote calculator works
- [ ] Fill out booking form - Submits successfully to Web3Forms
- [ ] Fill out join form - Submits successfully to Web3Forms
- [ ] Check browser console - No errors (except for missing logo)
- [ ] Test on mobile - Responsive design works
- [ ] Click all navigation links - All pages accessible

## 6. Deployment

The site is configured for Vercel deployment. When you push to GitHub:
1. Vercel will automatically build and deploy
2. All static files will be served with proper caching
3. The vercel.json configuration is already set up

## What's Already Working

✅ Google Sheets CMS integration configured
✅ All script loading order corrected
✅ FAQ page with accordion functionality
✅ Booking form with quote calculator
✅ Distance calculator (requires Google Maps API)
✅ Form validation on booking form
✅ Honeypot spam protection on both forms
✅ Responsive navigation on all pages
✅ Social media links and integrations
✅ Consistent navigation across all pages
✅ Logo fallback to text branding
✅ Error handling for failed API calls

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all Google Sheets tabs are properly formatted
3. Ensure Web3Forms access keys are valid
4. Test the Google Sheets API URL directly in your browser
