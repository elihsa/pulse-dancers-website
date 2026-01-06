# Pulse Male Revue Website

Professional male entertainment booking website for South Africa.

## 🚀 Live Site
https://pulse-dancers-website.vercel.app

## 📂 Structure
- **HTML Pages:** index, book, join, faq, meet-the-guys, prices
- **CMS:** Google Sheets (see `Pulse CMS.xlsx`)
- **Hosting:** Vercel
- **Forms:** Web3Forms (bookings@pulsedancers.com)

## 🛠️ Development
This is a static HTML/CSS/JS site. No build process needed.

1. Clone repo
2. Edit HTML/CSS files
3. Push to main branch
4. Vercel auto-deploys

## 📝 Content Management
Content managed via Google Sheets. See `COMPREHENSIVE-SPEC.md` for details.

### Google Sheets CMS
- **Sheet ID:** `12zPYBbpdDLhqTPylP0oUgPqimy5fXIfg`
- **API Key:** Configured in `/assets/js/sheets-cms.js`
- **Sheets:**
  - Prices (service pricing)
  - Dancers (performer profiles)
  - Services (booking form options)

## 📧 Contact
- Email: info@pulsedancers.com
- Bookings: bookings@pulsedancers.com

## 🔧 Forms Configuration
Forms use Web3Forms for submission:
1. Get access keys from https://web3forms.com
2. Update `YOUR_ACCESS_KEY_HERE` in:
   - `book.html` (booking form)
   - `join.html` (application form)

## 📋 Features
- ✅ Responsive design
- ✅ Google Sheets CMS integration
- ✅ Distance-based pricing calculator
- ✅ Google Maps autocomplete
- ✅ SEO optimized
- ✅ Performance optimized (caching via vercel.json)
- ✅ Form submissions via Web3Forms

## 📄 Documentation
See `COMPREHENSIVE-SPEC.md` for complete technical specification.
