# CMS Troubleshooting Guide

This guide helps you diagnose and fix common CMS issues with the Pulse Dancers website.

## Quick Diagnosis

Visit **[Your-Site-URL]/test-cms.html** to run automated tests. This page will:
- Test the API endpoint
- Check all sheet names
- Verify data is loading correctly
- Show detailed error messages

## Common Issues and Solutions

### Issue 1: "Nothing is working" - No content loads

**Symptoms:**
- Pages show default/placeholder content
- No prices, FAQs, or testimonials appear
- Browser console shows errors

**Causes & Solutions:**

#### A. Google Sheet is not public
**Solution:**
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4/edit
2. Click "Share" button (top right)
3. Change from "Restricted" to "Anyone with the link"
4. Set permission to "Viewer"
5. Click "Done"

#### B. Required tabs are missing
The sheet MUST have these exact tab names (case-sensitive):
- HOME
- PRICES
- FAQS
- DANCERS
- SERVICES
- TESTIMONIALS
- SOCIAL
- PAGE_CONTENT
- FOOTER

**Solution:**
1. Open your Google Sheet
2. Check the tabs at the bottom
3. Create any missing tabs (click + button)
4. Name them exactly as shown above (UPPERCASE)

#### C. Tabs are empty
**Solution:**
1. Open CMS-SETUP-GUIDE.md
2. Copy the example data for each tab
3. Paste into your Google Sheet
4. Follow the column structure exactly as shown in the guide

### Issue 2: API Endpoint Errors

**Symptoms:**
- Console shows "Failed to fetch"
- API returns 404 or 500 errors

**Causes & Solutions:**

#### A. Vercel deployment issue
**Solution:**
1. Check if /api/sheets.js file exists in your repository
2. Verify vercel.json is present
3. Redeploy on Vercel (trigger by pushing any change)

#### B. API Key invalid
**Solution:**
The current API key is: `AIzaSyBqmw5wBmz54vV7AUvH91UNqW6_gDLwrmw`

If this doesn't work, you may need to create a new Google Sheets API key:
1. Go to Google Cloud Console
2. Enable Google Sheets API
3. Create a new API key
4. Update the key in `/api/sheets.js`

### Issue 3: Some content loads, but not all

**Symptoms:**
- Homepage works but prices page doesn't
- Some sections show data, others don't

**Causes & Solutions:**

#### A. Specific tab has wrong structure
**Solution:**
1. Open the tab that's not working
2. Compare with the structure in CMS-SETUP-GUIDE.md
3. Check:
   - Column headers match exactly
   - First row is the header row
   - No extra spaces in column names
   - Data starts from row 2

#### B. Data format issues
**Solution:**
- **PRICES**: Make sure Price column contains numbers only (no "R" or "$")
- **TESTIMONIALS**: Status column (column G) must say exactly "Approved"
- **DANCERS**: Active column must be TRUE or FALSE (uppercase)
- **PAGE_CONTENT**: Page names must match exactly (e.g., "PRICES", not "prices")

### Issue 4: Content doesn't update

**Symptoms:**
- Changed data in Google Sheets
- Website still shows old content

**Causes & Solutions:**

#### A. Browser cache
**Solution:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or open in incognito/private window
3. Or clear browser cache

#### B. Vercel cache
**Solution:**
Wait 1-2 minutes after making changes. Vercel caches API responses for performance.

### Issue 5: JavaScript errors in console

**Symptoms:**
- Browser console (F12) shows red error messages
- "PulseSheetsCMS is not defined"
- "Cannot read property of undefined"

**Causes & Solutions:**

#### A. Script loading order issue
**Solution:**
Check that these scripts are loaded in this exact order:
```html
<script src="assets/js/sheets-cms.js" defer></script>
<script src="assets/js/cms-loader.js" defer></script>
<script src="assets/js/app.js" defer></script>
```

#### B. JavaScript syntax error
**Solution:**
1. Check browser console for the specific error
2. Look at the file and line number mentioned
3. Common issues:
   - Missing comma
   - Unclosed bracket
   - Typo in function name

### Issue 6: Testimonials not showing

**Symptoms:**
- Testimonials section is empty
- Message says "No testimonials yet"

**Causes & Solutions:**

#### A. Status column not set to "Approved"
**Solution:**
1. Open TESTIMONIALS tab
2. Find column G (Status)
3. Set to "Approved" (exact spelling, capital A)
4. Any other value (including empty) will hide the testimonial

#### B. Wrong column order
**Solution:**
Columns must be in this exact order:
1. Name (A)
2. Rating (B)
3. Text (C)
4. Area (D)
5. Email (E)
6. Date (F)
7. Status (G)

## Testing Checklist

After making changes, verify:

- [ ] Visit /test-cms.html and check all tests pass
- [ ] Visit index.html - Hero section loads from HOME sheet
- [ ] Visit prices.html - Pricing table loads from PRICES sheet
- [ ] Visit faq.html - Questions load from FAQS sheet
- [ ] Visit meet-the-guys.html - Performers load from DANCERS sheet
- [ ] Check footer on any page - Shows content from FOOTER sheet
- [ ] Browser console (F12) shows no red errors
- [ ] Try in incognito window to avoid cache issues

## Getting Help

If issues persist:

1. Run /test-cms.html and screenshot the results
2. Open browser console (F12) and screenshot any errors
3. Verify Sheet ID matches: `1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4`
4. Check that sheet is public ("Anyone with link can view")
5. Confirm all 9 tabs exist with exact names (UPPERCASE)

## Technical Details

**API Configuration:**
- Sheet ID: `1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4`
- API Key: `AIzaSyBqmw5wBmz54vV7AUvH91UNqW6_gDLwrmw`
- Endpoint: `/api/sheets.js` (Vercel serverless function)
- API URL: `https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{SHEET_NAME}!A{START}:Z{END}?key={API_KEY}`

**Files Involved:**
- `/api/sheets.js` - Serverless function that fetches from Google Sheets
- `/assets/js/sheets-cms.js` - CMS client library with all getter methods
- `/assets/js/cms-loader.js` - Loads footer content on all pages
- Each HTML page has inline scripts that call PulseSheetsCMS methods

**How It Works:**
1. Page loads with default content
2. Browser loads sheets-cms.js (defines PulseSheetsCMS)
3. Page calls PulseSheetsCMS.getXXX() methods
4. Methods call /api/sheets endpoint
5. Serverless function calls Google Sheets API
6. Data returns and replaces default content
7. If any step fails, default content remains (graceful degradation)
