# Quick Start - Developer Guide

This is a quick reference for developers working on the Pulse Dancers website.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for local testing)
- Netlify account
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/elihsa/pulse-dancers-website.git
   cd pulse-dancers-website
   ```

2. **Install Netlify CLI (optional, for local testing)**
   ```bash
   npm install -g netlify-cli
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Run locally (optional)**
   ```bash
   netlify dev
   # Site will be available at http://localhost:8888
   ```

## 📁 Project Structure

```
pulse-dancers-website/
├── index.html              # Homepage
├── book.html              # Booking form
├── prices.html            # Service pricing
├── faq.html               # FAQ page
├── meet-the-guys.html     # Performer profiles
├── join.html              # Recruitment form
├── assets/
│   ├── css/
│   │   └── styles.css     # Main stylesheet
│   └── js/
│       └── app.js         # Main JavaScript
├── data/                  # CMS data (JSON files)
│   ├── services.json
│   ├── prices.json
│   ├── faq.json
│   ├── performers.json
│   └── social.json
├── netlify/
│   └── functions/         # Serverless functions
│       ├── submission-created.js
│       └── generate-brief.js
├── admin/                 # Netlify CMS
│   └── config.yml
├── netlify.toml           # Netlify configuration
├── .env.example           # Environment variables template
└── AUTOMATION-SETUP-GUIDE.md  # Complete setup guide
```

## 🔧 Key Technologies

- **Frontend:** Vanilla HTML/CSS/JavaScript
- **CMS:** Netlify CMS (Git-based)
- **Forms:** Netlify Forms
- **Functions:** Netlify Functions (serverless)
- **Hosting:** Netlify
- **APIs:** Google Maps API (distance calculation)

## 📝 Making Changes

### Editing Content
1. **Via CMS:** Go to `/admin` and log in with Netlify Identity
2. **Via Git:** Edit JSON files in `/data` directory

### Editing Code
1. Create a new branch
2. Make your changes
3. Test locally if possible
4. Commit and push
5. Create a pull request

### Adding Services
Edit `/data/prices.json`:
```json
{
  "name": "New Service",
  "duration": "45min",
  "price": "2500",
  "isHourly": false,
  "notes": ""
}
```

### Modifying Email Templates
Edit `/netlify/functions/submission-created.js`
- Find the `sendOwnerEmail` function
- Modify the HTML template

## 🧪 Testing

### Test Functions Locally
```bash
node test-functions.js
```

### Test Forms
1. Navigate to `/book.html`
2. Fill out the form
3. Submit
4. Check Netlify dashboard → Forms

### Test Functions on Netlify
1. Submit a test booking
2. Go to Netlify dashboard → Functions → Logs
3. Check for errors

## 🚢 Deployment

### Automatic Deployment
Pushing to main branch triggers automatic deployment on Netlify.

### Manual Deployment
```bash
netlify deploy --prod
```

## 🐛 Debugging

### Check Browser Console
Open DevTools (F12) and check Console tab for JavaScript errors

### Check Netlify Logs
Netlify Dashboard → Functions → [Select Function] → Logs

### Check Form Submissions
Netlify Dashboard → Forms → [Form Name]

### Common Issues

**Forms not submitting:**
- Check `data-netlify="true"` is present
- Verify form name is unique
- Check browser console for errors

**Distance not calculating:**
- Verify Google Maps API key is valid
- Check browser console for API errors
- Ensure address autocomplete is working

**Functions not executing:**
- Check Netlify dashboard → Functions → Logs
- Verify function syntax (must export handler)
- Check environment variables are set

## 📊 Monitoring

### Analytics
Netlify Dashboard → Analytics

### Form Submissions
Netlify Dashboard → Forms

### Function Executions
Netlify Dashboard → Functions

## 🔐 Security

- Never commit `.env` files
- Use environment variables for secrets
- Keep dependencies updated
- Review form submissions for spam

## 📚 Documentation

- **Complete Setup:** `/AUTOMATION-SETUP-GUIDE.md`
- **Full Specification:** `/COMPREHENSIVE-SPEC.md`
- **CMS Guide:** `/CMS-GUIDE.md`
- **Editing Guide:** `/EDITING-GUIDE.md`

## 🆘 Getting Help

### Resources
- [Netlify Docs](https://docs.netlify.com)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Forms](https://docs.netlify.com/forms/setup/)
- [Google Maps API](https://developers.google.com/maps/documentation)

### Contact
- Email: bookings@pulsedancers.com
- GitHub Issues: [Create an issue](https://github.com/elihsa/pulse-dancers-website/issues)

## ⚡ Quick Commands

```bash
# Install dependencies (if needed)
npm install

# Run local dev server
netlify dev

# Test functions
node test-functions.js

# Deploy to production
netlify deploy --prod

# View function logs
netlify functions:log submission-created

# Link to Netlify site
netlify link
```

## 📋 Checklist for New Developers

- [ ] Clone repository
- [ ] Install Node.js and npm
- [ ] Install Netlify CLI
- [ ] Set up environment variables
- [ ] Run local dev server
- [ ] Test booking form
- [ ] Review code structure
- [ ] Read documentation
- [ ] Make test changes
- [ ] Create first PR

## 💡 Tips

1. **Use Netlify CLI** for local testing
2. **Check function logs** when debugging
3. **Test forms thoroughly** before deploying
4. **Keep documentation updated**
5. **Use semantic commit messages**
6. **Review changes in Netlify deploy previews**

---

*Last updated: January 2026*
