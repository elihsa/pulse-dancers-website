# Quick Verification Checklist

After populating the FOOTER and PAGE_CONTENT tabs in your Google Sheet, use this checklist to verify everything works.

## ✅ Before Testing

- [ ] FOOTER tab has 6 rows of data (plus header row)
- [ ] PAGE_CONTENT tab has 37 rows of data (plus header row)
- [ ] Google Sheet is set to "Anyone with the link can view"
- [ ] Tab names are exactly: `FOOTER` and `PAGE_CONTENT` (all caps)

## ✅ Test Footer (appears on all pages)

Visit any page on your deployed site and check the footer:

- [ ] Copyright text shows: "© 2025 Pulse Male Revue - South Africa."
- [ ] Email link shows: "info@pulsedancers.com"
- [ ] Facebook link works and shows "Facebook"
- [ ] Instagram link works and shows "Instagram"

**If footer doesn't update:**
1. Open browser console (F12)
2. Look for errors about FOOTER sheet
3. Verify field names in FOOTER tab match exactly: `copyright`, `email`, `facebookURL`, `facebookText`, `instagramURL`, `instagramText`

## ✅ Test Page Content

Visit each page and verify the content loads from your sheet:

### Prices Page (/prices.html)
- [ ] Page title shows: "Pricing"
- [ ] "How Pricing Works" section appears
- [ ] "Ready to Book?" section appears
- [ ] All text in pricing boxes loads from sheet

### FAQ Page (/faq.html)
- [ ] Page title shows: "Frequently Asked Questions"
- [ ] Description text appears below title
- [ ] "Still have questions?" section at bottom

### Meet The Guys Page (/meet-the-guys.html)
- [ ] Page title shows: "Meet The Guys"
- [ ] "What Makes Our Team Special" section
- [ ] "Request Specific Performers" section
- [ ] "Interested in Joining Our Team?" section
- [ ] All buttons show correct text

### Events Page (/events.html)
- [ ] Page title shows: "Events & Socials"
- [ ] "Upcoming Events" section
- [ ] "Follow Us on Instagram" section

### Book Page (/book.html)
- [ ] Page title shows: "Book Pulse for Your Event"
- [ ] Description text appears

### Join Page (/join.html)
- [ ] Page title shows: "Join the Pulse Team"
- [ ] Banner with email icon appears
- [ ] Description text appears

## ✅ Browser Console Check

1. Visit your deployed site
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for these messages:
   - ✅ `[Pulse CMS] Initialized successfully`
   - ✅ No red errors about FOOTER or PAGE_CONTENT

5. Go to Network tab
6. Reload the page
7. Look for requests to `/api/sheets?sheetName=FOOTER` and `/api/sheets?sheetName=PAGE_CONTENT`
8. Click on each request
9. Check Status: Should be `200 OK`
10. Check Preview: Should show your data

## 🐛 Troubleshooting

### Issue: Content not loading
**Possible causes:**
1. Tab names incorrect (must be exact: `FOOTER`, `PAGE_CONTENT`)
2. Field names have typos
3. Google Sheet not public
4. Testing on localhost instead of deployed site

**Solutions:**
1. Double-check tab names (case-sensitive!)
2. Compare field names with template exactly
3. Share > Anyone with link can view
4. Test on your Vercel deployment URL

### Issue: Some content loads, some doesn't
**Possible cause:** Typo in Page name or Key name in PAGE_CONTENT tab

**Solution:**
1. Check the "Page" column values match exactly: `PRICES`, `FAQ`, `MEET`, `EVENTS`, `BOOK`, `JOIN`
2. Check the "Key" column values match the template exactly
3. Look for extra spaces or different capitalization

### Issue: Footer partially works
**Possible cause:** Some field names are wrong

**Solution:**
Compare your FOOTER tab field names with these exact values:
- `copyright`
- `email`
- `facebookURL`
- `facebookText`
- `instagramURL`
- `instagramText`

## 🎉 Success Indicators

When everything works, you should see:

1. **Footer updates on all pages** - No more hardcoded contact info
2. **Page titles change** - Each page shows its custom title from the sheet
3. **All sections load** - Pricing sections, FAQ sections, etc. all show content from your sheet
4. **No console errors** - Clean console with just the green success message
5. **Network requests succeed** - All `/api/sheets` calls return 200 OK

## 📊 Using /test-cms.html

Your site has a built-in testing page:

1. Visit: `https://your-site.vercel.app/test-cms.html`
2. Click "Test All Sheets" button
3. Verify FOOTER and PAGE_CONTENT show success
4. Check the response data to see what's being loaded

This page tests each sheet individually and shows exactly what data is coming back.

## 🔄 Next Steps After Verification

Once CMS is fully working:

1. **Update content in Google Sheet** - Your changes will appear on the site
2. **No redeployment needed** - Content updates happen instantly
3. **Test after each change** - Refresh the page to see updates
4. **Keep sheet public** - Don't change sharing settings

## 💡 Pro Tips

- **Test in Incognito** - Ensures you're not seeing cached content
- **Hard refresh** - Ctrl+Shift+R (or Cmd+Shift+R on Mac) to clear cache
- **Use Console** - Always check browser console when testing
- **Test each page** - Don't assume if one page works, all work

---

**Need help?** Check the browser console for specific error messages and compare your sheet structure with the templates provided.
