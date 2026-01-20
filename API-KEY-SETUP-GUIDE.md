# Google Sheets API Key Setup Guide

## 🚨 CRITICAL ISSUE: Invalid API Key

**The current API key in the code is INVALID and the CMS cannot work without a valid key.**

Current key: `AIzaSyBqmw5wBmz54vV7AUvH91UNqW6_gDLwrmw`  
Status: ❌ Returns "API key not valid" error

## Why This Happened

Previous fixes claimed the CMS was working, but no actual tests were performed to verify the Google Sheets API was accessible. The API key has been invalid all along.

## How to Get a Valid API Key

Follow these steps to create a valid Google Sheets API key:

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account (use the same account that owns the Google Sheet)

### Step 2: Create or Select a Project

1. Click the project dropdown at the top
2. Click "NEW PROJECT"
3. Name it "Pulse Dancers Website"
4. Click "CREATE"

### Step 3: Enable Google Sheets API

1. In the left sidebar, click "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it
4. Click "ENABLE"

### Step 4: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "+ CREATE CREDENTIALS" at the top
3. Select "API key"
4. A key will be generated (it looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
5. **Copy this key immediately**

### Step 5: Restrict the API Key (Recommended for Security)

1. Click "RESTRICT KEY" (or edit the key you just created)
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add: `https://pulse-dancers-website.vercel.app/*`
   - Add: `http://localhost*` (for local testing)
3. Under "API restrictions":
   - Select "Restrict key"
   - Check only "Google Sheets API"
4. Click "SAVE"
5. **Wait 5 minutes** for restrictions to propagate

### Step 6: Update the Code

You have two options for updating the API key:

#### Option A: Environment Variables (Recommended for Production)

Add the key as environment variables in your Vercel deployment:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add two variables:
   - `GOOGLE_SHEETS_API_KEY` = your new API key
   - `GOOGLE_SHEET_ID` = 1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4
4. Redeploy your site

This is more secure and allows different keys for different environments.

#### Option B: Hard-Code in Files (Simpler for Testing)

Replace the API key directly in the code:

**File 1: `/api/sheets.js`** (Line 11)
```javascript
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY || 'YOUR_NEW_API_KEY_HERE';
```

**File 2: `/home/runner/work/pulse-dancers-website/pulse-dancers-website/test-cms.html`** (Line 145)
```javascript
const API_KEY = 'YOUR_NEW_API_KEY_HERE'; // ❌ INVALID KEY
```

Note: Even with hard-coded keys, they're safe if properly restricted in Google Cloud Console.

### Step 7: Make Your Google Sheet Public

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4/edit
2. Click "Share" button (top right)
3. Change from "Restricted" to **"Anyone with the link"**
4. Set permission to **"Viewer"**
5. Click "Done"

### Step 8: Test the Connection

Run the test script to verify everything works:

```bash
node /tmp/test-google-sheets.js
```

You should see:
```
🟢 SUCCESS: CMS is working! Sheets are accessible and have data.
```

If you see errors, check:
- API key is correctly copied (no extra spaces)
- Google Sheet is public
- You waited 5 minutes after adding restrictions
- The sheet has the required 9 tabs: HOME, PRICES, FAQS, DANCERS, SERVICES, TESTIMONIALS, SOCIAL, PAGE_CONTENT, FOOTER

## Alternative: Use Demo Mode

If you can't get an API key right now, you can use demo/fallback mode:

The website already has fallback default content that displays when the API fails. This means:
- The site won't break
- It will show placeholder content
- You can still test the layout and design

However, **the CMS feature won't work** - you won't be able to update content via Google Sheets.

## Security Notes

✅ **Safe:** Having the API key in client-side code is normal and safe when:
- The key is restricted to your website domain
- The key only has read access to Google Sheets API
- Your Google Sheet is already public

❌ **Not Safe:** If you didn't restrict the API key, anyone could use it. Always add restrictions!

## Troubleshooting

### Error: "API key not valid"
- The key is wrong or has expired
- Create a new key following the steps above

### Error: "The caller does not have permission"
- Your Google Sheet is not public
- Go to Share > Anyone with link can view

### Error: "Unable to parse range"
- One of the required sheet tabs is missing
- Create all 9 tabs with exact names (uppercase)

### Works in Test but Not on Website
- API key restrictions are blocking the website domain
- Add your vercel.app domain to the HTTP referrers list
- Wait 5 minutes for restrictions to propagate

## Summary

**What you need:**
1. ✅ Valid Google Sheets API key (follow steps above)
2. ✅ Public Google Sheet (Share > Anyone with link)
3. ✅ 9 sheet tabs with correct names
4. ✅ Data in the sheets

**Current status:**
- ❌ API key is invalid
- ❌ CMS is not working
- ✅ Website displays fallback content (site doesn't break)

**Time required:** 10-15 minutes to set up properly
