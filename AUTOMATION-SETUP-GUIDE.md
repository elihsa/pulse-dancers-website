# Pulse Dancers Website - Automation Setup Guide

## 📋 Overview

This guide will walk you through setting up the booking automation system for Pulse Dancers. The automation includes:

- ✅ Automatic booking email notifications to owner
- ✅ Formatted dancer brief (ready for WhatsApp)
- ✅ One-click "Add to Google Calendar" button
- ✅ Customer confirmation emails
- ✅ All running on **Netlify FREE tier** (no monthly costs)

---

## 🚀 Quick Start

### Prerequisites
- Netlify account (free tier is sufficient)
- Access to the Pulse Dancers GitHub repository
- Email address for receiving booking notifications

### Deployment Steps

1. **Connect Repository to Netlify**
   - Log in to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select the `pulse-dancers-website` repository
   - Netlify will automatically detect settings from `netlify.toml`

2. **Configure Environment Variables**
   - In Netlify dashboard, go to: **Site settings** → **Environment variables**
   - Click "Add a variable" and add the following:

   ```
   OWNER_EMAIL=bookings@pulsedancers.com
   CUSTOMER_CONFIRMATION_EMAIL_ENABLED=true
   SITE_URL=https://your-site-name.netlify.app
   ```

3. **Enable Netlify Forms**
   - Forms are automatically enabled when you use `data-netlify="true"` in your HTML
   - The booking form in `book.html` is already configured
   - Go to: **Forms** tab in Netlify dashboard to see submissions

4. **Set Up Form Notifications** (Using Netlify's Built-in Notifications)
   - Go to: **Site settings** → **Forms** → **Form notifications**
   - Click "Add notification" → "Email notification"
   - Configure:
     - **Event to listen for:** New form submission
     - **Form:** booking
     - **Email to notify:** bookings@pulsedancers.com
     - **Custom email subject:** 🎉 New Pulse Booking Request
     - **Custom email body:** (Leave blank - our function will handle this)

---

## 🎯 How It Works

### Booking Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Customer fills out booking form on website              │
│    - Event details, services, location, etc.               │
│    - Live quote calculation with distance                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Netlify captures form submission                        │
│    - Data stored in Netlify Forms dashboard                │
│    - Triggers submission-created function                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. submission-created.js function processes data           │
│    - Extracts all booking information                      │
│    - Generates formatted dancer brief                      │
│    - Creates Google Calendar link                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Owner receives beautifully formatted email              │
│    ✅ All customer details                                  │
│    ✅ Event information                                     │
│    ✅ Service requirements                                  │
│    ✅ Automatic quote calculation                          │
│    ✅ "Add to Calendar" button                             │
│    ✅ Dancer brief (copy/paste ready)                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Owner takes action                                       │
│    → Click "Add to Calendar" (pre-filled event)            │
│    → Copy dancer brief                                      │
│    → Paste into WhatsApp group (10 seconds!)               │
│    → Confirm with customer                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📧 Email Configuration (Optional Enhancement)

### Current Implementation (FREE)
The current setup uses **Netlify Forms' built-in email notifications**. This is free and doesn't require any additional setup beyond enabling it in the Netlify dashboard.

### Future Enhancement: Custom Email Service

If you want more control over email formatting and delivery, you can integrate a third-party email service:

#### Option 1: SendGrid (Recommended)
**Free Tier:** 100 emails/day forever

**Setup Steps:**
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key:
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name it "Pulse Dancers Netlify"
   - Select "Full Access"
   - Copy the API key
3. Add to Netlify environment variables:
   ```
   SENDGRID_API_KEY=your_api_key_here
   ```

#### Option 2: Mailgun
**Free Tier:** 5,000 emails/month for 3 months

**Setup Steps:**
1. Sign up at [Mailgun](https://www.mailgun.com)
2. Verify your domain (or use sandbox domain for testing)
3. Get your API key from Settings
4. Add to Netlify environment variables:
   ```
   MAILGUN_API_KEY=your_api_key_here
   MAILGUN_DOMAIN=your_domain_here
   ```

#### Option 3: AWS SES
**Free Tier:** 62,000 emails/month (when sending from EC2)

**Setup Steps:**
1. Create AWS account
2. Set up SES and verify email
3. Create IAM user with SES permissions
4. Add credentials to Netlify environment variables

---

## 📅 Google Calendar Integration

### Current Implementation: Calendar Link (FREE)
The booking email includes a special "Add to Google Calendar" link that:
- Opens Google Calendar with pre-filled event details
- Includes all booking information
- Saves the event with one click
- **No API required** - completely free!

### Future Enhancement: Direct API Integration

If you want events to be automatically created in your calendar (without clicking a link):

#### Step-by-Step: Get Google Calendar API Credentials

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Click "New Project"
   - Name it "Pulse Dancers Calendar"
   - Click "Create"

2. **Enable Google Calendar API**
   - In the project, go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click on it and click "Enable"

3. **Create Service Account**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name it "pulse-dancers-automation"
   - Click "Create and Continue"
   - Grant role: "Editor"
   - Click "Done"

4. **Generate Private Key**
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose JSON format
   - Click "Create" (downloads JSON file)

5. **Extract Credentials**
   - Open the downloaded JSON file
   - Copy these values to Netlify environment variables:
   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
   ```
   - **Important:** Keep the `\n` in the private key string

6. **Share Your Calendar**
   - Open Google Calendar
   - Click settings (gear icon) → Settings
   - Click on the calendar you want to use
   - Scroll to "Share with specific people"
   - Add your service account email
   - Give it "Make changes to events" permission

7. **Get Calendar ID**
   - Still in calendar settings
   - Scroll to "Integrate calendar"
   - Copy the "Calendar ID" (usually your email or "primary")
   - Add to Netlify environment variables:
   ```
   GOOGLE_CALENDAR_ID=your_calendar_id_here
   ```

---

## 📱 WhatsApp Integration

### Current Implementation: Manual Copy/Paste (FREE)
The booking email includes a **formatted dancer brief** that you can:
1. Copy from the email
2. Open WhatsApp Web or App
3. Paste into your dancer group chat
4. Send!

**Time required:** About 10 seconds ⚡

### Future Enhancement: Automatic WhatsApp Messages

If you want to send dancer briefs automatically to WhatsApp:

#### Option 1: Twilio WhatsApp API
**Cost:** Pay-as-you-go (about $0.005 per message)

**Setup:**
1. Sign up at [Twilio](https://www.twilio.com)
2. Set up WhatsApp Sandbox or get approved for WhatsApp Business API
3. Add credentials to Netlify environment variables

#### Option 2: WhatsApp Business API
**Cost:** Free, but requires business verification

---

## 🧪 Testing Your Setup

### Test Booking Submission

1. **Go to your website's booking page**
   - Navigate to `/book.html`

2. **Fill out the form completely**
   - Use real information
   - Select services
   - Enter an address for distance calculation

3. **Submit the form**
   - You should see a success message
   - Check your email (configured in OWNER_EMAIL)

4. **Verify Email Contents**
   - ✅ All form fields are present
   - ✅ Dancer brief is formatted correctly
   - ✅ Calendar link works
   - ✅ Quote calculations are accurate

5. **Test Calendar Link**
   - Click "Add to Google Calendar" button
   - Verify event details are pre-filled
   - Save the test event

6. **Check Netlify Dashboard**
   - Go to Forms tab
   - Verify submission was captured
   - Check Functions tab for logs (if using custom functions)

### Testing Checklist

- [ ] Booking form submits successfully
- [ ] Owner receives email notification
- [ ] Email contains all booking details
- [ ] Dancer brief is properly formatted
- [ ] Calendar link opens and pre-fills correctly
- [ ] Quote calculations match live quote on form
- [ ] Distance calculation is accurate
- [ ] Customer receives confirmation (if enabled)
- [ ] All form data appears in Netlify Forms dashboard
- [ ] No console errors in browser

---

## 🔧 Troubleshooting

### Issue: Not Receiving Emails

**Solution:**
1. Check Netlify dashboard → Forms → Form notifications
2. Verify email address is correct
3. Check spam folder
4. Test with a different email address
5. Enable form notifications if not already enabled

### Issue: Calendar Link Not Working

**Solution:**
1. Check that event date and time are provided
2. Verify URL encoding is correct
3. Try opening link in different browser
4. Check browser console for errors

### Issue: Form Not Submitting

**Solution:**
1. Open browser console (F12)
2. Look for JavaScript errors
3. Verify `data-netlify="true"` is present in form tag
4. Check that all required fields are filled
5. Ensure Google Maps API is loading (for distance calculation)

### Issue: Distance Not Calculating

**Solution:**
1. Verify Google Maps API key is valid
2. Check browser console for API errors
3. Ensure address autocomplete is working
4. Try entering a different address
5. Check that `calculated-distance` hidden field is being populated

### Issue: Functions Not Deploying

**Solution:**
1. Check Netlify build logs
2. Verify `netlify.toml` has functions configuration
3. Ensure functions are in `netlify/functions/` directory
4. Check function syntax (must export `handler`)
5. Review function logs in Netlify dashboard

---

## 📊 Monitoring & Analytics

### Netlify Dashboard

**View Form Submissions:**
- Go to: Forms tab
- See all submissions with timestamps
- Export data to CSV
- Set up email notifications

**View Function Logs:**
- Go to: Functions tab
- Select a function
- View recent invocations
- Check for errors

**Monitor Site Performance:**
- Go to: Analytics (free tier includes basic analytics)
- View page views, unique visitors
- Monitor form conversion rates

---

## 🔐 Security Best Practices

1. **Never commit environment variables**
   - `.env` is in `.gitignore`
   - Only use Netlify dashboard for sensitive data

2. **Validate form inputs**
   - Already handled by browser HTML5 validation
   - Server-side validation in functions

3. **Use honeypot for spam protection**
   - Already enabled: `netlify-honeypot="bot-field"`

4. **Limit form submission rate**
   - Consider enabling Netlify's rate limiting

5. **Keep dependencies updated**
   - No external dependencies currently
   - Review if adding email services

---

## 💰 Cost Breakdown

### Current Setup: 100% FREE ✅

| Service | Cost | Usage |
|---------|------|-------|
| Netlify Hosting | FREE | Static site hosting |
| Netlify Forms | FREE | Up to 100 submissions/month |
| Netlify Functions | FREE | 125K requests/month |
| Google Calendar Link | FREE | URL-based, no API |
| WhatsApp (Manual) | FREE | Copy/paste to WhatsApp |
| **TOTAL** | **R0/month** | 🎉 |

### Optional Enhancements (Paid)

| Service | Cost | When Needed |
|---------|------|-------------|
| Netlify Forms (Extra) | $19/month | >100 submissions/month |
| SendGrid | FREE | 100 emails/day (free forever) |
| Twilio WhatsApp | ~R0.10/message | Automatic WhatsApp sending |
| Google Workspace | From R99/month | Professional email address |

---

## 🚀 Future Enhancements

### Phase 1: Current (FREE)
- ✅ Automated email notifications
- ✅ Formatted dancer brief
- ✅ Google Calendar links
- ✅ Manual WhatsApp posting

### Phase 2: Enhanced Email (FREE)
- [ ] Integrate SendGrid for custom email templates
- [ ] Add email tracking and analytics
- [ ] Include performer availability in emails

### Phase 3: Full Automation (Paid)
- [ ] Direct Google Calendar API integration
- [ ] Automatic WhatsApp messages via Twilio
- [ ] SMS notifications to dancers
- [ ] Customer booking portal

### Phase 4: Advanced Features
- [ ] Payment integration (PayFast/PayGate)
- [ ] Performer assignment automation
- [ ] Customer feedback collection
- [ ] Analytics dashboard

---

## 📞 Support

### Getting Help

**Documentation:**
- This guide (you're reading it!)
- [Netlify Forms Documentation](https://docs.netlify.com/forms/setup/)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)

**Contact:**
- Email: bookings@pulsedancers.com
- Check GitHub Issues for known problems

### Common Questions

**Q: How do I change the owner email address?**
A: Update `OWNER_EMAIL` in Netlify environment variables.

**Q: Can I receive booking notifications on my phone?**
A: Yes! Enable email notifications for your email app, or forward booking emails to WhatsApp using email-to-WhatsApp services.

**Q: How do I add more services to the booking form?**
A: Edit `/data/prices.json` via the CMS (Admin panel) or directly in GitHub.

**Q: Can I customize the email template?**
A: Yes! Edit `submission-created.js` in the `netlify/functions` directory.

**Q: Do I need a developer to maintain this?**
A: No! Once set up, all content is managed via the CMS. Only advanced features require developer support.

---

## ✅ Setup Complete!

Once you've followed this guide, your booking automation system will be running on 100% free infrastructure. Your workflow will be:

1. **Customer submits booking** → Automatic
2. **You receive formatted email** → Automatic  
3. **Click "Add to Calendar"** → 1 click
4. **Copy brief to WhatsApp** → 10 seconds
5. **Confirm with customer** → Manual
6. **Assign dancers** → Manual

**Total time saved per booking:** ~5-10 minutes
**Monthly cost:** R0 🎉

---

*Last updated: January 2026*
