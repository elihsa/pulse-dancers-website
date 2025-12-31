# Pulse Dancers Website - CMS Setup Guide

This guide explains how to set up and use the Netlify CMS (Decap CMS) for managing website content.

## Overview

The website uses Netlify CMS (Decap CMS v3) to allow non-technical users to edit content through a browser-based interface at `/admin`. All content is stored in JSON files in the `/data` directory.

## CMS Features

### Editable Collections

1. **Home Page** (`/data/home.json`)
   - Hero title and subtitle
   - Call-to-action button text and URL
   - About section title and paragraphs
   - Services list
   - Hero statistics

2. **Pricing** (`/data/prices.json`)
   - Service items (name, duration, price)
   - General pricing notes
   - Travel fee information

3. **FAQ** (`/data/faq.json`)
   - Question groups by category
   - Individual Q&A pairs
   - Add/edit/remove questions

4. **Booking Settings** (`/data/booking.json`)
   - Base location address
   - Free kilometer radius
   - Rate per kilometer
   - Currency settings

5. **Testimonials** (`/data/testimonials.json`)
   - Customer testimonials
   - Ratings, names, locations, dates

6. **Social Media** (`/data/social.json`)
   - Facebook page URL
   - Instagram username
   - Instagram post URLs

## Setup Instructions

### 1. Deploy to Netlify

1. Push this repository to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub account and select this repository
5. Click "Deploy site"

### 2. Enable Netlify Identity

1. In your Netlify site dashboard, go to "Identity"
2. Click "Enable Identity"
3. Under "Registration preferences", select "Invite only"
4. Under "External providers", you can optionally enable Google/GitHub login

### 3. Enable Git Gateway

1. In Netlify Identity settings, scroll to "Services"
2. Click "Enable Git Gateway"
3. This allows the CMS to commit changes to your repository

### 4. Invite Users

1. In the Identity tab, click "Invite users"
2. Enter the email address for each person who should have CMS access
3. They will receive an invitation email with a link to set up their account

### 5. Access the CMS

Once deployed, users can access the CMS at:
```
https://your-site-name.netlify.app/admin
```

## Using the CMS

### Logging In

1. Go to `/admin` on your deployed site
2. Click "Login with Netlify Identity"
3. Enter your email and password
4. You'll be redirected to the CMS dashboard

### Editing Content

1. Click on any collection in the sidebar (Home Page, Pricing, FAQ, etc.)
2. Edit the content in the form fields
3. Click "Save" to commit changes
4. Changes are automatically pushed to your GitHub repository
5. Netlify will automatically rebuild and deploy your site

### Uploading Images

1. In any image field, click "Choose an image"
2. Upload a new image or select from previously uploaded images
3. Images are stored in `/assets/images/uploads/`

## Technical Details

### File Structure

```
/admin/
  ├── index.html       # CMS interface
  └── config.yml       # CMS configuration

/data/
  ├── home.json        # Homepage content
  ├── prices.json      # Pricing information
  ├── faq.json         # FAQ content
  ├── booking.json     # Booking form settings
  ├── testimonials.json # Customer testimonials
  └── social.json      # Social media links

/assets/
  ├── css/
  │   └── styles.css   # Main stylesheet
  ├── js/
  │   └── app.js       # JavaScript functionality
  └── images/
      └── uploads/     # CMS-uploaded images
```

### Design System

**Colors:**
- Background: `#0B0B0F` (dark)
- Accent: `#FF2D55` (red)
- Text: `#E5E5E5` (light gray)

**Typography:**
- Font: Inter, system fonts fallback
- Consistent hierarchy across all pages

### Booking Form Features

The booking form includes:
- **Distance Calculator**: Automatically calculates driving distance from Sandton City using Google Maps API
- **Live Quote**: Updates pricing in real-time based on:
  - Service type and number of performers
  - Distance (R4/km beyond 50km radius)
- **Guest Recommendations**: Suggests performer count based on guest numbers
- **Native Netlify Forms**: Form submissions sent to your email

## Troubleshooting

### Can't access /admin
- Ensure Netlify Identity is enabled
- Check that you've been invited as a user
- Clear browser cache and try again

### Changes not appearing
- Check that you clicked "Save" in the CMS
- Wait a few minutes for Netlify to rebuild the site
- Check the Netlify deploy log for errors

### Images not uploading
- Ensure files are under 5MB
- Check that the media folder path is correct in `admin/config.yml`
- Verify Git Gateway is enabled

## Support

For issues or questions:
- Email: info@pulsedancers.com
- Check Netlify documentation: https://docs.netlify.com
- Decap CMS documentation: https://decapcms.org/docs/
