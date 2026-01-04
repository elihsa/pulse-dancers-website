# Netlify Functions

This directory contains serverless functions for the Pulse Dancers booking automation system.

## Functions

### submission-created.js
**Purpose:** Main form submission handler triggered by Netlify form submissions

**Trigger:** Netlify form submission event (booking form)

**What it does:**
- Intercepts booking form submissions
- Generates formatted dancer brief
- Creates Google Calendar link
- Sends formatted email to owner with booking details and automation buttons
- Optionally sends customer confirmation email

**Environment Variables Used:**
- `OWNER_EMAIL` - Email address to receive booking notifications
- `CUSTOMER_CONFIRMATION_EMAIL_ENABLED` - Enable/disable customer emails (true/false)
- `SITE_URL` - Your site URL for links in emails

### generate-brief.js
**Purpose:** Format booking details into professional dancer brief

**Method:** POST endpoint (`/api/generate-brief`)

**Input:** Booking form data (JSON)

**Output:** 
- `brief` - Plain text dancer brief (for WhatsApp)
- `html` - HTML formatted brief (for email)

**Use Case:** Can be called independently to regenerate briefs from stored booking data

## Testing

Run the test script from the project root:
```bash
node test-functions.js
```

This will verify:
- Functions load correctly
- Basic functionality works
- All required files exist
- Configuration is valid

## Deployment

Functions are automatically deployed by Netlify when you push to the repository.

**Configuration:** See `netlify.toml` in project root

**Logs:** View function execution logs in Netlify dashboard → Functions tab

## Development

### Local Testing with Netlify CLI

Install Netlify CLI:
```bash
npm install -g netlify-cli
```

Run functions locally:
```bash
netlify dev
```

This starts a local server that simulates the Netlify environment.

### Function Structure

All functions must export a `handler` function:

```javascript
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' })
  };
};
```

**event object contains:**
- `httpMethod` - HTTP method (GET, POST, etc.)
- `body` - Request body (string, needs JSON.parse for JSON)
- `headers` - Request headers
- `queryStringParameters` - URL query parameters

## Email Integration

Currently, the functions log email content to console. To actually send emails, integrate an email service:

### Option 1: SendGrid (Recommended)
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: process.env.OWNER_EMAIL,
  from: 'bookings@pulsedancers.com',
  subject: 'New Booking Request',
  html: htmlEmail
});
```

### Option 2: Netlify Forms Email Notifications
Use Netlify's built-in form notifications (configured in dashboard) - **No code needed!**

## Security

- Never commit `.env` files
- Use Netlify dashboard to set environment variables
- Validate all user inputs
- Use honeypot for spam protection (already implemented in form)

## Troubleshooting

### Function not executing
1. Check Netlify dashboard → Functions → Logs
2. Verify `netlify.toml` configuration
3. Ensure function exports `handler`
4. Check for syntax errors

### Form submission not triggering function
1. Verify form has `data-netlify="true"`
2. Check form name matches in function
3. Review Netlify dashboard → Forms for submissions
4. Check function logs for errors

### Calendar link not working
1. Verify date/time format in form data
2. Check URL encoding
3. Test link in different browsers
4. Review formatDateTimeForCalendar function

## Support

For more information, see:
- `/AUTOMATION-SETUP-GUIDE.md` - Complete setup guide
- `/COMPREHENSIVE-SPEC.md` - Full system documentation
- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
