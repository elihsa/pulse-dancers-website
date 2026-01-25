# Instagram Embeds Setup Guide

## Overview
The Events & Socials page now displays proper Instagram post embeds instead of placeholder boxes. This guide explains how to configure Instagram posts in the CMS.

## How It Works
The page reads Instagram post URLs from the Google Sheets CMS (SOCIAL sheet) and automatically creates proper Instagram embeds using Instagram's official embed method.

## Setup Instructions

### Step 1: Get Instagram Post URLs
1. Go to the @pulsesouthafrica Instagram profile: https://www.instagram.com/pulsesouthafrica/
2. Click on a post you want to display
3. Click the three dots (...) menu
4. Select "Copy link"
5. The URL should look like: `https://www.instagram.com/p/ABC123xyz/`

### Step 2: Add URLs to Google Sheets
1. Open your Google Sheets CMS: https://docs.google.com/spreadsheets/d/1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4
2. Go to the **SOCIAL** sheet
3. Add Instagram post URLs with keys that start with "instagram":

| Key | Value |
|-----|-------|
| instagram_1 | https://www.instagram.com/p/ABC123xyz/ |
| instagram_2 | https://www.instagram.com/p/DEF456abc/ |

Alternative naming conventions that work:
- `instagramPost1`, `instagramPost2`
- `instagram-1`, `instagram-2`
- `instagram_url_1`, `instagram_url_2`

### Step 3: Verify
1. Save the Google Sheet
2. Visit https://pulse-dancers-website.vercel.app/events.html
3. Wait a few seconds for the page to load
4. You should see proper Instagram embeds with images and full post content

## Features
- ✅ Displays the **latest 2 posts** (configurable by order in the sheet)
- ✅ Shows full Instagram post content (image/video, caption, likes)
- ✅ Responsive design that works on all devices
- ✅ Compatible with the site's dark theme
- ✅ Auto-updates when you change URLs in the CMS
- ✅ Supports both regular posts (/p/) and reels (/reel/)
- ✅ No API tokens required
- ✅ Secure implementation with URL validation

## Troubleshooting

### Posts not showing?
- Check that the Instagram URLs are valid and start with `https://www.instagram.com/`
- Verify the keys in the SOCIAL sheet start with "instagram"
- Make sure the Google Sheet is published/shared publicly
- Wait a few seconds for the page to load and process embeds

### Only seeing "Follow us on Instagram" message?
- This means no Instagram URLs were found in the CMS
- Check the SOCIAL sheet for Instagram post URLs
- Verify the keys match the pattern (start with "instagram")

### Embeds not loading properly?
- Ensure JavaScript is enabled in the browser
- Check browser console for errors
- Try refreshing the page
- Verify Instagram's embed.js script is not blocked by ad blockers

## Technical Details
- Uses Instagram's official blockquote embed method
- Instagram's embed.js automatically processes the blockquotes
- No API authentication required
- Embeds are dynamically generated from CMS data
- URLs are sanitized to prevent XSS attacks
- Includes error handling and graceful fallbacks

## Need Help?
- Check the CMS-TROUBLESHOOTING.md file for general CMS issues
- Visit /test-cms.html to test CMS connectivity
- Contact the development team for assistance
