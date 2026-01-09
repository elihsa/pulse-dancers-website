# Testing Guide - JotForm Integration & Google Sheets CMS

This document outlines how to test the changes made for JotForm integration and Google Sheets CMS fixes.

## Changes Summary

### 1. JotForm Integration
- ✅ Replaced Web3Forms with JotForm on `book.html` (Form ID: 253636457639571)
- ✅ Replaced Web3Forms with JotForm on `join.html` (URL: Buns_info/NewGuy)
- ✅ Removed all Web3Forms placeholders and references
- ✅ Added JotForm embed styling to `assets/css/styles.css`
- ✅ Created documentation in `JOTFORM-INTEGRATION.md`

### 2. Google Sheets CMS Fixes
- ✅ Fixed API URL format - now uses sheet names (PRICES, FAQS, DANCERS, etc.) instead of GIDs
- ✅ Added detailed console logging for debugging
- ✅ Added test function `window.testGoogleSheetsAPI()` for browser console testing
- ✅ Enhanced error handling and display

### 3. Quote Calculator
- ✅ Updated `booking-calculator.js` to work independently from the booking form
- ✅ Calculator loads services from Google Sheets and displays live quotes
- ✅ Removed form submission handling (now handled by JotForm)

## How to Test

### Test 1: Booking Form (book.html)

1. Navigate to `/book.html`
2. **Quote Calculator Should Display:**
   - Service checkboxes loaded from Google Sheets
   - Number of performers field
   - Event address field (with Google Maps autocomplete)
   - Live quote calculation showing:
     - Performance Fee
     - Distance (round trip)
     - Travel Fee
     - Estimated Total
3. **JotForm Should Display:**
   - JotForm iframe embedded below the quote calculator
   - Form should be responsive and fit the page width
   - Form should have dark styling matching the site theme

**Expected Behavior:**
- Services load from Google Sheets SERVICES tab
- Quote updates in real-time as you select services and performers
- Address autocomplete works when typing an address
- JotForm displays correctly and can be filled out

### Test 2: Join Form (join.html)

1. Navigate to `/join.html`
2. **JotForm Should Display:**
   - JotForm iframe embedded on the page
   - Form should be responsive
   - Form should have dark styling matching the site theme

**Expected Behavior:**
- JotForm displays correctly
- Form is fully functional and can be submitted

### Test 3: Prices Page (prices.html)

1. Navigate to `/prices.html`
2. **Pricing Table Should Display:**
   - All services from Google Sheets PRICES tab
   - Three columns: Service, Duration, Price (R)
   - Properly formatted prices

**Expected Behavior:**
- Pricing data loads from Google Sheets
- Table displays all 7+ services
- No "Loading prices..." message remains
- Prices show in South African Rand format (R)

### Test 4: FAQ Page (faq.html)

1. Navigate to `/faq.html`
2. **FAQ Accordion Should Display:**
   - All questions from Google Sheets FAQS tab
   - Accordion-style expandable items
   - Click to expand/collapse

**Expected Behavior:**
- All 47 FAQ items load from Google Sheets
- Clicking a question expands to show the answer
- Only one item can be open at a time
- + icon changes to − when expanded

### Test 5: Meet The Guys Page (meet-the-guys.html)

1. Navigate to `/meet-the-guys.html`
2. **Performers Grid Should Display:**
   - Performer cards loaded from Google Sheets DANCERS tab
   - Each card shows: name, initial, genres, experience, bio
   - Images if available (or hidden if not found)

**Expected Behavior:**
- Performer data loads from Google Sheets
- Grid displays in responsive layout
- Missing images don't break the layout

### Test 6: Browser Console Testing

Open browser console (F12) on any page and run:

```javascript
// Test Google Sheets API
await window.testGoogleSheetsAPI()
```

**Expected Output:**
```
🧪 Testing Google Sheets API...
📊 Fetching Google Sheet: {sheetName: "PRICES", url: "https://..."}
📥 Response status: 200
✅ Data received: {values: Array(8)}
Prices: [{id: "1", name: "Full Routine Show", ...}, ...]
... (similar for FAQs, Dancers, Services)
```

**If there are errors:**
- Check the console for detailed error messages
- Verify API key is valid and enabled for Google Sheets API v4
- Verify the spreadsheet is published or publicly accessible
- Check that sheet names match exactly (PRICES, FAQS, DANCERS, SERVICES, TESTIMONIALS, SOCIAL, HOME)

## Common Issues & Solutions

### Issue: Google Sheets data not loading

**Symptoms:**
- "Loading..." messages never disappear
- Console shows 400 or 403 errors
- Empty tables/grids

**Solutions:**
1. **Check API Key:** Verify the API key is enabled for Google Sheets API v4
2. **Check Sheet Access:** Sheet must be "Published to web" or "Anyone with link can view"
3. **Check Sheet Names:** Tab names in the spreadsheet must match exactly:
   - PRICES
   - FAQS
   - DANCERS
   - SERVICES
   - TESTIMONIALS
   - SOCIAL
   - HOME
4. **Check Console:** Run `window.testGoogleSheetsAPI()` to see detailed error messages

### Issue: JotForm not displaying

**Symptoms:**
- Empty space where form should be
- Console shows iframe errors
- Form doesn't load

**Solutions:**
1. **Check Network:** Ensure jotform.com is not blocked by firewall/ad blocker
2. **Check iframe:** Verify iframe src URL is correct
3. **Check JotForm Status:** Visit JotForm URLs directly to ensure forms are published:
   - https://form.jotform.com/253636457639571
   - https://www.jotform.com/form/Buns_info/NewGuy

### Issue: Quote calculator not working

**Symptoms:**
- Services not loading
- Quote showing R0.00 even after selections
- Distance calculation not working

**Solutions:**
1. **Check Services Loading:** Services must load from Google Sheets SERVICES tab
2. **Check Google Maps API:** Verify Google Maps API key is valid for Places API
3. **Check Console:** Look for JavaScript errors in booking-calculator.js

## Files Changed

- `book.html` - Replaced form with JotForm, kept quote calculator
- `join.html` - Replaced form with JotForm
- `assets/js/sheets-cms.js` - Fixed API URLs, added debugging, changed GIDs to sheet names
- `assets/js/booking-calculator.js` - Simplified to work without form submission
- `assets/css/styles.css` - Added JotForm embed styling
- `JOTFORM-INTEGRATION.md` - New documentation file

## Next Steps

After testing and verifying all functionality:

1. **Monitor Console Logs:** Check for any API errors or warnings
2. **Test Form Submissions:** Submit test bookings and applications through JotForms
3. **Verify Email Notifications:** Ensure submissions reach the correct email addresses
4. **Update Google Sheets:** Ensure data in sheets is accurate and up-to-date
5. **Remove Console Logging:** Once verified working, consider reducing console.log verbosity for production

## Support

For issues with:
- **JotForm:** See `JOTFORM-INTEGRATION.md` for form management
- **Google Sheets:** Verify sheet structure matches expected format in sheets-cms.js
- **API Keys:** Ensure both Google Sheets API and Google Maps API keys are valid
