# JotForm Integration

## Forms

### Booking Form
- **JotForm ID:** 253636457639571
- **URL:** https://form.jotform.com/253636457639571
- **Edit:** https://www.jotform.com/build/253636457639571
- **Page:** book.html

### Join Form (New Performer Application)
- **URL:** https://www.jotform.com/form/Buns_info/NewGuy
- **Page:** join.html

## How to Edit Forms

1. Log into JotForm at https://www.jotform.com
2. Go to "My Forms"
3. Find the form you want to edit
4. Click "Edit Form"
5. Make changes
6. Click "Publish"
7. Changes appear instantly on website (no redeployment needed)

## Submissions

All form submissions go directly to JotForm and are forwarded to your email addresses:
- Booking form → bookings@pulsedancers.com
- Join form → info@pulsedancers.com

## Advantages of JotForm

- ✅ No coding required to edit forms
- ✅ Built-in spam protection
- ✅ File uploads supported
- ✅ Payment integration available
- ✅ Email notifications automatic
- ✅ Submission management dashboard
- ✅ Export to Excel/CSV

## Quote Calculator

The live quote calculator on the booking page is separate from JotForm. It:
- Loads services from Google Sheets
- Calculates distance and travel fees
- Displays estimate before customer fills JotForm
- Does NOT submit data (JotForm handles submission)

## Technical Details

### Embedding JotForms

Both forms are embedded using iframe embeds with JotForm's embed handler script for responsive sizing:

```html
<div class="jotform-embed">
  <iframe
    id="JotFormIFrame-253636457639571"
    title="Pulse Booking Form"
    onload="window.parent.scrollTo(0,0)"
    allowtransparency="true"
    allow="geolocation; microphone; camera; autoplay; encrypted-media"
    src="https://form.jotform.com/253636457639571"
    frameborder="0"
    style="min-width:100%;max-width:100%;height:539px;border:none;"
    scrolling="no"
  >
  </iframe>
  <script src='https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js'></script>
  <script>window.jotformEmbedHandler("iframe[id='JotFormIFrame-253636457639571']", "https://form.jotform.com/")</script>
</div>
```

### Styling

JotForm embeds are styled in `assets/css/styles.css`:
- Dark background matching site theme
- Rounded corners and shadow for depth
- Responsive padding for mobile devices
- Seamless integration with site design

## Support

For JotForm support:
- **Documentation:** https://www.jotform.com/help/
- **Support:** https://www.jotform.com/contact/
