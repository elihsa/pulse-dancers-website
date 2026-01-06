# Pulse Dancers - Vercel Deployment & Google Sheets CMS Guide

## Overview
This guide explains how to deploy your site to Vercel and use Google Sheets as your CMS, eliminating the need for Netlify credits while keeping your Jotform booking functionality.

## Architecture
```
Vercel (Hosting) <-- GitHub (Source) <-- Your Code
        ^
        |
    Google Sheets CMS (Prices, Dancers, FAQs)
        ^
        |
    Jotform (Booking & Contact Forms)
```

## Step 1: Prepare Your Site

### Files Added:
- `assets/js/sheets-cms.js` - Google Sheets API integration
- `assets/js/booking-calculator.js` - Quote calculator for booking form

### Update Your HTML Files

In `book.html`, add these script tags before `</head>`:
```html
<script src="assets/js/sheets-cms.js"></script>
<script src="assets/js/booking-calculator.js"></script>
```

Also in `book.html`, update the service checkboxes container ID to:
```html
<div id="service-checkboxes-container" class="service-checkboxes">
  <!-- Services load here from Google Sheets -->
</div>
```

### Update prices.html
Add this div where your price list should be:
```html
<div id="prices-container">
  <!-- Prices load dynamically from Google Sheets -->
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    PulseSheetsCMS.loadPrices('prices-container');
  });
</script>
```

### Update meet-the-guys.html  
Add this div for dancers:
```html
<div id="dancers-container">
  <!-- Dancers load dynamically from Google Sheets -->
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    PulseSheetsCMS.loadDancers('dancers-container');
  });
</script>
```

### Update faq.html
Add this div for FAQs:
```html
<div id="faqs-container">
  <!-- FAQs load dynamically from Google Sheets -->
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    PulseSheetsCMS.loadFAQs('faqs-container');
  });
</script>
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select `pulse-dancers-website` repository
5. Click "Deploy"
6. Wait for deployment to complete

### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

## Step 3: Verify Deployment
1. Check your site URL (e.g., pulse-dancers-website.vercel.app)
2. Test the booking form - services should load from Google Sheets
3. Test quote calculation - enter event details and verify quote updates
4. Test other dynamic content (prices, dancers, FAQs)

## Step 4: Domain Setup (Optional)
Point your custom domain to Vercel:
1. In Vercel dashboard, go to Settings > Domains
2. Add your domain
3. Update DNS records at your registrar

## Forms Configuration

### Jotform (Already Working)
- Contact form: Submits to Jotform ID 33116524727553
- No changes needed
- Continues to work on Vercel

### Booking Form (Netlify Forms)
Currently configured with Netlify Forms (`data-netlify="true"`). 

**Option 1 (Recommended):** Keep using Jotform
- Switch booking form from Netlify Forms to Jotform
- Embed Jotform iframe instead of HTML form
- All form handling managed by Jotform

**Option 2:** Use Formspree
- Replace Netlify Forms with Formspree
- Free tier: 50 submissions/month (your use case)
- Paid: $12/month unlimited

## Google Sheets Data Structure

### Sheet ID: 12zPYBbpdDLhqTPylP0oUgPqimy5fXIfg

#### Prices Tab
| ID | Name | Price | Duration | Description |
|----|------|-------|----------|----------|
| 1 | 1 Man Show | 2500 | 20 minutes | One professional dancer |
| 2 | 2 Man Show | 4200 | 25 minutes | Two professional dancers |

#### Dancers Tab  
| ID | Name | Initial | Genres | Experience | Bio | Image |
|----|------|---------|--------|------------|-----|-------|
| 2 | Brendan | B | Hip Hop & Street Jazz | 9+ years | Bio text | brendan.jpg |

#### FAQs Tab
| ID | Question | Answer |
|----|----------|--------|
| 1 | Are you guys strippers? | No, we are exotic dancers... |

## Pricing (Cost Breakdown)

- **Vercel Hosting:** FREE (unlimited deployments, free tier)
- **Google Sheets CMS:** FREE
- **Jotform Contact Form:** FREE (already embedded)
- **Booking Form:** FREE (either Jotform or Formspree free tier)
- **Google Maps API:** FREE (already configured in book.html)
- **Total Monthly Cost:** **$0**

## Monthly Form Submission Analysis

Your current usage: ~20 submissions/month
- Formspree free tier: 50 submissions/month ✅ (covers your needs)
- Jotform free tier: Unlimited ✅
- No credit consumption on Vercel

## Troubleshooting

### Services/Prices not loading
1. Check browser console for errors
2. Verify Google Sheets API key is correct
3. Ensure Sheet ID is correct in sheets-cms.js
4. Check network tab to see if API requests are succeeding

### Quote calculator not working
1. Verify booking-calculator.js is loaded
2. Check that service checkboxes have `data-price` attributes
3. Ensure Google Maps API key is valid
4. Check browser console for errors

### Form not submitting
1. For Jotform: Check form ID is correct
2. For Netlify Forms: They won't work on Vercel without special config
3. Test on actual deployed URL (not localhost)

## Next Steps

1. ✅ Add scripts to HTML files
2. ✅ Test locally (if needed): `python -m http.server 8000`
3. ✅ Push changes to GitHub
4. ✅ Deploy to Vercel
5. ✅ Update DNS/domain records
6. ✅ Test all forms and dynamic content
7. ✅ Monitor Vercel dashboard for any errors

## Support

If you have issues:
1. Check the browser console (F12 > Console tab)
2. Check Vercel deployment logs
3. Verify Google Sheets is set to "Anyone can view" (at least for the API)
4. Confirm all script paths are correct in HTML files
