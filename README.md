# Pulse Male Revue Website

Professional male entertainment booking website for South Africa.

## 📅 Version Information

**Last Updated:** January 27, 2026  
**Version:** 1.0.0  
**Status:** Production

## 🚀 Live Site

https://pulse-dancers-website.vercel.app

## 📂 Structure

- **HTML Pages:** index, book, join, faq, meet-the-guys, prices, events
- **CMS:** Google Sheets via API (`sheets-cms.js`)
- **Hosting:** Vercel
- **Forms:** 
  - Booking: JotForm embed
  - Join: Custom form with API integration (`/api/submit-join-form.js`)
  - Testimonials: Custom form with approval workflow (`/api/submit-testimonial.js`)

## 🛠️ Development

This is a static HTML/CSS/JS site with serverless API functions.

1. Clone repo
2. Edit HTML/CSS/JS files
3. Push to main branch
4. Vercel auto-deploys

## 📝 Content Management System

All content is managed via **Google Sheets CMS**:

- **Sheet ID:** `1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4`
- **API Key:** Configured in `/assets/js/sheets-cms.js`
- **Sheets:**
  - HOME (hero content)
  - PRICES (service pricing with descriptions)
  - FAQS (frequently asked questions)
  - DANCERS (performer profiles with photos)
  - SERVICES (service offerings)
  - TESTIMONIALS (client reviews with approval status)
  - SOCIAL (Instagram and social media links)

### CMS Integration

Each page dynamically loads content from Google Sheets:

- **index.html** - Testimonials (approval-filtered)
- **prices.html** - Pricing table with descriptions + Services
- **faq.html** - FAQ accordion
- **meet-the-guys.html** - Dancer profiles
- **events.html** - Social media posts

## 📋 API Endpoints

### Vercel Serverless Functions

- `/api/sheets.js` - Main CMS data fetcher with approval filtering
- `/api/submit-join-form.js` - Recruitment form submission to Google Sheets
- `/api/submit-testimonial.js` - Testimonial submission (pending approval)

### Required Environment Variables (Vercel)

```
GOOGLE_SHEETS_API_KEY=<your-api-key>
GOOGLE_SHEETS_TESTIMONIALS_ID=1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4
GOOGLE_SHEETS_JOIN_FORM_ID=<join-form-sheet-id>
GOOGLE_SERVICE_ACCOUNT_EMAIL=<service-account-email>
GOOGLE_PRIVATE_KEY=<private-key>
NOTIFICATION_EMAIL=info@pulsedancers.com
```

## ✨ Features

- ✅ Fully CMS-controlled content
- ✅ Testimonial approval workflow
- ✅ Responsive design
- ✅ Google Sheets integration
- ✅ SEO optimized
- ✅ Performance optimized (caching via vercel.json)
- ✅ Custom recruitment form with Google Sheets integration
- ✅ JotForm booking integration

## 📧 Contact

- Info: info@pulsedancers.com
- Bookings: bookings@pulsedancers.com

## 📄 Documentation

See additional documentation files:
- `COMPREHENSIVE-SPEC.md` - Complete technical specification
- `SETUP-REQUIRED.md` - Setup instructions
- `VERCEL-DEPLOYMENT-GUIDE.md` - Deployment guide
- `TESTING-GUIDE.md` - Testing procedures
