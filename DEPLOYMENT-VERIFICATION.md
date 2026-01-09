# Deployment Verification Checklist

Use this checklist after deploying to verify all changes are working correctly.

## 1. Booking Page Verification

**URL:** `/book.html`

### Visual Checks
- [ ] Page loads without errors
- [ ] Quote calculator section displays at top
- [ ] Service checkboxes load (from Google Sheets)
- [ ] JotForm iframe displays below calculator
- [ ] Page styling matches site theme (dark background, red accents)

### Functional Checks
- [ ] Select a service → Quote updates immediately
- [ ] Change number of performers → Quote recalculates
- [ ] Type an address → Google autocomplete suggests addresses
- [ ] Select address → Distance and travel fee update
- [ ] JotForm is interactive and can be filled out
- [ ] JotForm submit button works (test submission)

### Console Checks
Open browser console (F12) and verify:
- [ ] No red errors displayed
- [ ] See green checkmarks (✅) for successful API calls
- [ ] See messages like "Data received: ..." for services

## 2. Join Page Verification

**URL:** `/join.html`

### Visual Checks
- [ ] Page loads without errors
- [ ] JotForm iframe displays correctly
- [ ] Page styling matches site theme
- [ ] Form is responsive (test on mobile view)

### Functional Checks
- [ ] JotForm is interactive
- [ ] All form fields are accessible
- [ ] Submit button works (test submission)

## 3. Prices Page Verification

**URL:** `/prices.html`

### Visual Checks
- [ ] Page loads without errors
- [ ] Pricing table displays
- [ ] All columns visible: Service, Duration, Price (R)
- [ ] No "Loading..." message remains

### Functional Checks
- [ ] At least 7 services display in table
- [ ] Prices show in format: R1,500 or R2,000
- [ ] Durations display correctly
- [ ] No empty rows or missing data

### Console Checks
- [ ] No errors related to sheets-cms.js
- [ ] See "Fetching Google Sheet: PRICES" log
- [ ] See "Data received" with price data

## 4. FAQ Page Verification

**URL:** `/faq.html`

### Visual Checks
- [ ] Page loads without errors
- [ ] FAQ items display in accordion format
- [ ] Each item has a + icon
- [ ] Styling is consistent with site theme

### Functional Checks
- [ ] Click a question → Answer expands
- [ ] + icon changes to −
- [ ] Click another question → Previous closes, new opens
- [ ] All ~47 FAQs are visible
- [ ] Answers display completely when expanded

### Console Checks
- [ ] No errors related to FAQ loading
- [ ] See "Fetching Google Sheet: FAQS" log
- [ ] See data received with FAQ count

## 5. Meet The Guys Page Verification

**URL:** `/meet-the-guys.html`

### Visual Checks
- [ ] Page loads without errors
- [ ] Performer cards display in grid
- [ ] Each card shows performer info
- [ ] Grid is responsive (adjusts to screen size)

### Functional Checks
- [ ] All performers from Google Sheets display
- [ ] Missing images don't break layout
- [ ] Card information is readable
- [ ] Page scrolls smoothly

### Console Checks
- [ ] No errors related to dancer loading
- [ ] See "Fetching Google Sheet: DANCERS" log

## 6. Advanced Console Testing

On any page, open browser console and run:

```javascript
testGoogleSheetsAPI()
```

### Expected Output
```
🧪 Testing Google Sheets API...
📊 Fetching Google Sheet: {sheetName: "PRICES", url: "https://..."}
📥 Response status: 200
✅ Data received: {range: "PRICES!A1:Z20", majorDimension: "ROWS", values: Array(8)}
Prices: (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]

📊 Fetching Google Sheet: {sheetName: "FAQS", url: "https://..."}
📥 Response status: 200
✅ Data received: {range: "FAQS!A1:Z50", majorDimension: "ROWS", values: Array(48)}
FAQs: (47) [{…}, {…}, ...]

📊 Fetching Google Sheet: {sheetName: "DANCERS", url: "https://..."}
📥 Response status: 200
✅ Data received: {range: "DANCERS!A1:Z30", majorDimension: "ROWS", values: Array(12)}
Dancers: (11) [{…}, {…}, ...]

📊 Fetching Google Sheet: {sheetName: "SERVICES", url: "https://..."}
📥 Response status: 200
✅ Data received: {range: "SERVICES!A1:Z20", majorDimension: "ROWS", values: Array(8)}
Services: (7) [{…}, {…}, ...]
```

### What to Check
- [ ] All 4 sheets return status 200
- [ ] All show "✅ Data received"
- [ ] Arrays contain data (not empty)
- [ ] No ❌ error messages

## 7. Form Submission Testing

### Test Booking Form
1. Go to `/book.html`
2. Use quote calculator to select services
3. Scroll to JotForm
4. Fill out all required fields
5. Submit form
6. Verify:
   - [ ] Submission successful message appears
   - [ ] Email received at bookings@pulsedancers.com
   - [ ] Form data is complete in JotForm dashboard

### Test Join Form
1. Go to `/join.html`
2. Fill out all required fields
3. Submit form
4. Verify:
   - [ ] Submission successful message appears
   - [ ] Email received at info@pulsedancers.com
   - [ ] Form data is complete in JotForm dashboard

## 8. Mobile Responsiveness

Test on mobile device or browser dev tools mobile view:

- [ ] Book page: Quote calculator stacks vertically
- [ ] Book page: JotForm is scrollable and usable
- [ ] Join page: JotForm is scrollable and usable
- [ ] Prices page: Table is responsive or scrollable
- [ ] FAQ page: Accordion works on mobile
- [ ] Meet the Guys: Grid adjusts to single column

## 9. Common Issues to Watch For

### If Google Sheets Data Not Loading

**Symptoms:** Tables show "Loading...", empty grids, console errors

**Check:**
1. Open console and look for error messages
2. Run `testGoogleSheetsAPI()` to see detailed errors
3. Verify API key restrictions in Google Cloud Console
4. Verify spreadsheet is published or publicly accessible
5. Check sheet names match exactly: PRICES, FAQS, DANCERS, SERVICES, etc.

### If JotForm Not Displaying

**Symptoms:** Empty space where form should be, iframe errors

**Check:**
1. Visit JotForm URL directly in browser
2. Check browser console for iframe errors
3. Verify JotForm URLs are correct:
   - Booking: https://form.jotform.com/253636457639571
   - Join: https://www.jotform.com/form/Buns_info/NewGuy
4. Check if ad blocker is blocking JotForm
5. Verify JotForm account is active

### If Quote Calculator Not Working

**Symptoms:** R0.00 shown, services not loading, distance not calculating

**Check:**
1. Services must load from Google Sheets first
2. Check console for sheets-cms.js errors
3. Verify Google Maps API key is valid
4. Test address autocomplete functionality

## 10. Final Sign-Off

Once all checks pass:

- [ ] All pages load without errors
- [ ] Both forms (booking + join) work and submit successfully
- [ ] All CMS data loads from Google Sheets
- [ ] Quote calculator works correctly
- [ ] No console errors
- [ ] Mobile responsiveness verified
- [ ] Test submissions received via email

## Need Help?

- **Documentation:** See TESTING-GUIDE.md for detailed troubleshooting
- **JotForm Issues:** See JOTFORM-INTEGRATION.md
- **Google Sheets Issues:** Check sheet names and API key restrictions
- **Console Debugging:** Use `testGoogleSheetsAPI()` function

---

**Deployment Date:** _________________

**Verified By:** _________________

**Issues Found:** _________________

**Status:** ⬜ Passed ⬜ Failed (specify issues above)
