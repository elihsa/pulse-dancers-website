# How to Edit Your Website - Complete Guide

## Understanding the Forms

### Are they Netlify Forms or Custom?

**All forms on your website are Netlify Forms** - this is a built-in service provided by Netlify that handles form submissions automatically. Here's what this means:

- **No backend code required** - Netlify captures form data automatically
- **Spam protection** - Built-in honeypot fields prevent spam
- **Email notifications** - You can configure email alerts in Netlify settings
- **Data export** - Download submissions as CSV from Netlify dashboard
- **Free tier** - 100 submissions per month on free plan

### How Netlify Forms Work

When someone fills out a form on your site, the data is sent directly to Netlify's servers. You can access submissions at:
`https://app.netlify.com/sites/[your-site-name]/forms`

The forms are standard HTML forms with two special attributes:
```html
<form name="booking" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="booking">
  <!-- form fields here -->
</form>
```

- `data-netlify="true"` - Tells Netlify to handle this form
- `name="form-name"` hidden field - Required for Netlify to identify the form

## How to Make Small Adjustments Without Asking Me

### Option 1: Edit HTML Files Directly (Simple Changes)

**What you can easily change:**
- Form field labels
- Placeholder text
- Help text under fields
- Button text
- Page headings and descriptions

**Where to find the files:**
- Booking form: `book.html`
- Join form: `join.html`
- Homepage: `index.html`
- Other pages: `prices.html`, `faq.html`, `meet-the-guys.html`

**How to edit:**
1. Open the file in a text editor (VS Code, Notepad++, Sublime Text)
2. Find the text you want to change (use Ctrl+F / Cmd+F to search)
3. Change the text between the HTML tags
4. Save the file
5. Commit and push to GitHub (or drag to Netlify for manual deploy)

**Example - Changing a form label:**
```html
<!-- Find this: -->
<label for="full-name">Full Name *</label>

<!-- Change to: -->
<label for="full-name">Your Full Name *</label>
```

### Option 2: Use the CMS (Best for Most Content)

**What you can change via CMS:**
- ✅ Homepage content (title, subtitle, about text, services)
- ✅ Logo image (NEW!)
- ✅ Hero background image (NEW!)
- ✅ Pricing table (services, prices, notes)
- ✅ FAQ questions and answers
- ✅ Testimonials
- ✅ Performer profiles (photos, bios, specialties)
- ✅ Social media links

**How to access:**
1. Go to `https://yoursite.com/admin/`
2. Log in with Netlify Identity
3. Click on the section you want to edit
4. Make changes
5. Click "Save" then "Publish"

**Changes go live immediately** after publishing!

### Option 3: Edit CSS for Styling (Visual Changes)

**What you can change:**
- Colors
- Font sizes
- Spacing
- Layout widths
- Hover effects

**Where:** `assets/css/styles.css`

**Common changes:**

**Change the accent color (red):**
```css
/* Find this variable at the top: */
/* Current: #FF2D55 */

/* Change all instances to your color, example: */
color: #FF2D55;  /* Change to: #0066CC */
border-color: #FF2D55;  /* Change to: #0066CC */
```

**Change form field width:**
```css
/* Find: */
.input-compact {
  max-width: 200px;
}

/* Change to: */
.input-compact {
  max-width: 250px;  /* Make wider */
}
```

**Change textarea height:**
```css
/* Find textareas with rows="3" in HTML */
<textarea rows="3">

/* Change to: */
<textarea rows="5">  /* Taller */
```

### Option 4: Add/Remove Form Fields

**Simple changes you can make:**

**Add a new text field:**
```html
<div class="form-group">
  <label for="new-field">New Field Label *</label>
  <input type="text" id="new-field" name="new-field" required>
</div>
```

**Add a dropdown:**
```html
<div class="form-group">
  <label for="new-dropdown">Select Option *</label>
  <select id="new-dropdown" name="new-dropdown" required>
    <option value="">Choose...</option>
    <option value="Option 1">Option 1</option>
    <option value="Option 2">Option 2</option>
  </select>
</div>
```

**Make a field optional:**
- Remove the `required` attribute
- Remove the `*` from the label

**Hide a field you don't want:**
- Add `style="display: none;"` to the form-group div
- Or delete the entire field

### Option 5: Use GitHub to Edit (Advanced but Safe)

**Recommended workflow:**
1. Go to your GitHub repository
2. Click on the file you want to edit
3. Click the pencil icon (Edit)
4. Make your changes
5. Scroll down and add a commit message
6. Click "Commit changes"
7. Netlify will auto-deploy (takes 1-2 minutes)

**Benefits:**
- Change history is saved
- Can revert if something breaks
- Can preview changes in a branch first

## Common Tasks

### Task: Change Service Prices (CMS - Easiest!)

**✅ PRICES ARE NOW CMS-MANAGED!**

All service prices are synchronized between:
- Pricing page (prices.html)
- Booking form (book.html)  
- Quote calculations

**To change prices:**
1. Go to `/admin/` → "Pricing" → "Pricing Table"
2. Click on a service to edit
3. Change the "Price (Rands)" value
4. For per-hour services, check/uncheck "Per Hour Service"
5. Click "Save" → "Publish"
6. **Both the pricing page AND booking form update instantly!**

**To add a new service:**
1. Go to `/admin/` → "Pricing" → "Pricing Table"
2. Click "Add Price Items"
3. Fill in:
   - Service Name (e.g., "5-Man Show")
   - Duration (e.g., "45min" or "Per hour")
   - Price in Rands (numbers only, e.g., "10000")
   - Check "Per Hour Service" if it's hourly
4. Save → Publish
5. New service appears in both pages automatically!

**To remove a service:**
1. Go to `/admin/` → "Pricing" → "Pricing Table"
2. Find the service
3. Click the trash/delete icon
4. Save → Publish

**Old way (NOT NEEDED ANYMORE):**
~~You used to have to edit HTML in multiple places. Now everything is CMS-managed!~~

### Task: Add a New Province to Join Form

1. Open `join.html`
2. Find the province dropdown (around line 64-80)
3. Add a new option:
   ```html
   <option value="New Province">New Province</option>
   ```

### Task: Change Form Submission Email

1. Go to Netlify Dashboard
2. Navigate to Forms → Notifications
3. Add/edit email notification settings
4. No code changes needed!

### Task: Add a New Performer

1. Go to `/admin/`
2. Click "Performers" → "Team Members"
3. Click "Add Performers"
4. Upload photo, fill details
5. Toggle "Active" on
6. Save → Publish

### Task: Upload Logo via CMS (NEW!)

1. Go to `/admin/`
2. Click "Home Page" → "Home Content"
3. Scroll to "Logo Image"
4. Click "Choose an image"
5. Upload your logo (PNG recommended, ~200px wide)
6. Save → Publish
7. Reload your homepage to see the new logo!

### Task: Upload Hero Background Image (NEW!)

1. Go to `/admin/`
2. Click "Home Page" → "Home Content"
3. Scroll to "Hero Background Image"
4. Click "Choose an image"
5. Upload image (recommended: 1920x1080px)
6. Save → Publish
7. Reload homepage - image appears as hero background!

## When to Ask for Help

Ask a developer if you need to:
- Add complex JavaScript functionality
- Change the form validation logic
- Integrate with external APIs
- Add a new page with special features
- Modify the booking quote calculation
- Change the database structure
- Add user authentication

## Quick Reference: File Locations

```
pulse-dancers-website/
├── index.html              → Homepage
├── book.html               → Booking form
├── join.html               → Join/Apply form
├── prices.html             → Pricing page
├── faq.html                → FAQ page
├── meet-the-guys.html      → Performers page
├── admin/
│   └── config.yml          → CMS configuration
├── data/
│   ├── home.json           → Homepage content (editable via CMS)
│   ├── prices.json         → Pricing data (editable via CMS)
│   ├── faq.json            → FAQ data (editable via CMS)
│   ├── performers.json     → Performer profiles (editable via CMS)
│   └── testimonials.json   → Testimonials (editable via CMS)
├── assets/
│   ├── css/
│   │   └── styles.css      → All website styles
│   ├── js/
│   │   └── app.js          → All JavaScript functionality
│   └── images/
│       └── uploads/        → Uploaded images from CMS
└── CMS-GUIDE.md           → CMS usage guide
```

## Pro Tips

1. **Always test locally first** - Run `python3 -m http.server 8000` in your project folder to test changes before deploying

2. **Use browser dev tools** - Press F12 to inspect elements and test CSS changes live

3. **Keep backups** - GitHub keeps your history, but you can also download a ZIP of your site

4. **Small changes at a time** - Make one change, test it, commit it. Don't change 10 things at once.

5. **Read the comments** - Look for comments in the HTML/CSS files that explain what sections do

6. **Search before editing** - Use Ctrl+F to find exactly what you want to change instead of scrolling

7. **Check mobile view** - Always test on mobile after making changes (use browser dev tools mobile view)

## Need More Help?

- **Netlify Forms Docs:** https://docs.netlify.com/forms/setup/
- **Netlify CMS Docs:** https://decapcms.org/docs/
- **HTML Reference:** https://developer.mozilla.org/en-US/docs/Web/HTML
- **CSS Reference:** https://developer.mozilla.org/en-US/docs/Web/CSS
- **GitHub Guide:** https://docs.github.com/en/get-started

Remember: You can always revert changes via GitHub if something breaks!
