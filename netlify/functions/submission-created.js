/**
 * Netlify Function: Form Submission Handler
 * 
 * Purpose: Intercept Netlify form submissions and send formatted emails
 * with automation features (calendar links, dancer brief)
 * 
 * Trigger: Netlify form submission event (submission-created)
 * 
 * Note: Email sending is currently handled by Netlify's built-in form notifications.
 * This function prepares the email content and logs it. To send emails programmatically,
 * integrate an email service (SendGrid, Mailgun, etc.) - see AUTOMATION-SETUP-GUIDE.md
 */

const {
  calculatePerformanceFee,
  calculateTravelFee,
  formatDate,
  formatTime,
  formatDateTimeForCalendar,
  DEFAULT_WAITER_HOURS
} = require('./utils');

exports.handler = async (event, context) => {
  // This function is triggered by Netlify's form submission event
  // The event.body contains the form submission data
  
  try {
    const submissionData = JSON.parse(event.body);
    const payload = submissionData.payload;
    
    console.log('Form submission received:', payload);

    // Extract form data
    const formData = payload.data;
    const formName = payload.form_name;

    // Only handle booking form submissions
    if (formName !== 'booking') {
      console.log('Ignoring non-booking form:', formName);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Not a booking form' })
      };
    }

    // Generate dancer brief
    const brief = generateBrief(formData);
    
    // Generate Google Calendar link
    const calendarUrl = generateGoogleCalendarLink(formData);

    // Send email to owner
    await sendOwnerEmail(formData, brief, calendarUrl);

    // Send confirmation email to customer (if enabled)
    if (process.env.CUSTOMER_CONFIRMATION_EMAIL_ENABLED === 'true') {
      await sendCustomerEmail(formData);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Booking processed successfully',
        success: true 
      })
    };

  } catch (error) {
    console.error('Error processing submission:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process booking',
        message: error.message 
      })
    };
  }
};

/**
 * Generate dancer brief from form data
 */
function generateBrief(data) {
  const {
    'full-name': customerName = 'Not provided',
    email = 'Not provided',
    phone = 'Not provided',
    city = 'Not provided',
    'event-type': eventType = 'Not specified',
    'event-date': eventDate = 'Not specified',
    'event-time': eventTime = 'Not specified',
    'event-address': eventAddress,
    'event-area': eventArea,
    'location-type': locationType,
    'service-type': services = 'Not specified',
    'num-performers': numPerformers = '1',
    'num-guests': numGuests = 'Not specified',
    'waiter-hours': waiterHours = '0',
    notes = 'None',
    'calculated-distance': distance = '0'
  } = data;

  const location = locationType === 'area' 
    ? (eventArea || 'Not specified')
    : (eventAddress || 'Not specified');

  const distanceKm = parseFloat(distance) || 0;
  const performanceFee = calculatePerformanceFee(services, waiterHours);
  const travelFee = calculateTravelFee(distanceKm);
  const totalEstimate = performanceFee + travelFee;

  return `🎉 NEW BOOKING - ${eventType}

📅 Date: ${formatDate(eventDate)}
⏰ Time: ${formatTime(eventTime)}
📍 Location: ${location}
🏙️ City: ${city}
🚗 Distance: ${distanceKm.toFixed(1)} km from Sandton City (round trip)

👤 Customer: ${customerName}
📞 Phone: ${phone}
✉️ Email: ${email}

💼 Service Details:
- Services: ${services}
- Performers Needed: ${numPerformers}
- Guest Count: ${numGuests}
${waiterHours && waiterHours !== '0' ? `- Waiter Hours: ${waiterHours}` : ''}

🗒️ Special Requests:
${notes}

💰 Quote:
- Performance Fee: R${performanceFee.toFixed(2)}
- Travel Fee: R${travelFee.toFixed(2)}
- Total Estimate: R${totalEstimate.toFixed(2)}

---
⚠️ NEXT STEPS:
1. Confirm availability with customer
2. Assign performers
3. Send confirmation email to customer
4. Share this brief with assigned dancers`;
}

/**
 * Generate Google Calendar link
 */
function generateGoogleCalendarLink(data) {
  const {
    'full-name': customerName = '',
    'event-type': eventType = 'Event',
    'event-date': eventDate = '',
    'event-time': eventTime = '',
    'event-address': eventAddress,
    'event-area': eventArea,
    'location-type': locationType,
    'service-type': services = '',
    'calculated-distance': distance = '0'
  } = data;

  const location = locationType === 'area' 
    ? (eventArea || 'Not specified')
    : (eventAddress || 'Not specified');

  // Create event title
  const title = encodeURIComponent(`${eventType} - ${customerName}`);

  // Calculate start and end times
  let startDateTime = '';
  let endDateTime = '';
  
  if (eventDate && eventTime) {
    const [hours, minutes] = eventTime.split(':');
    const start = new Date(eventDate);
    start.setHours(parseInt(hours), parseInt(minutes), 0);
    
    // Event duration: 1 hour default
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    
    // Format: YYYYMMDDTHHmmSSZ
    startDateTime = formatDateTimeForCalendar(start);
    endDateTime = formatDateTimeForCalendar(end);
  }

  // Create event description
  const distanceKm = parseFloat(distance) || 0;
  const performanceFee = calculatePerformanceFee(services, data['waiter-hours']);
  const travelFee = calculateTravelFee(distanceKm);
  const totalEstimate = performanceFee + travelFee;

  const description = encodeURIComponent(
    `Event Type: ${data['event-type']}\n` +
    `Customer: ${customerName}\n` +
    `Phone: ${data.phone}\n` +
    `Email: ${data.email}\n` +
    `City: ${data.city}\n\n` +
    `Services: ${services}\n` +
    `Performers: ${data['num-performers']}\n` +
    `Guests: ${data['num-guests']}\n\n` +
    `Distance: ${distanceKm.toFixed(1)} km (round trip)\n` +
    `Quote: R${totalEstimate.toFixed(2)}\n\n` +
    `Notes: ${data.notes || 'None'}`
  );

  const locationParam = encodeURIComponent(location);

  // Construct Google Calendar URL
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${title}` +
    `&dates=${startDateTime}/${endDateTime}` +
    `&details=${description}` +
    `&location=${locationParam}`;

  return calendarUrl;
}

/**
 * Send email to owner with booking details
 * 
 * Note: This function currently logs email content to console.
 * Email delivery is handled by Netlify's built-in form notifications.
 * 
 * To send emails programmatically, integrate an email service:
 * - SendGrid: https://www.npmjs.com/package/@sendgrid/mail
 * - Mailgun: https://www.npmjs.com/package/mailgun-js
 * - AWS SES: https://www.npmjs.com/package/aws-sdk
 */
async function sendOwnerEmail(formData, brief, calendarUrl) {
  // For Netlify, we'll use fetch to call a mail service
  // This could be Netlify's own email service or a third-party service
  
  const {
    'full-name': customerName = 'Not provided',
    email: customerEmail = 'Not provided',
    phone: customerPhone = 'Not provided',
    city: customerCity = 'Not provided',
    'event-type': eventType = 'Not specified',
    'event-date': eventDate = 'Not specified',
    'event-time': eventTime = 'Not specified',
    'event-address': eventAddress,
    'event-area': eventArea,
    'location-type': locationType,
    'service-type': services = 'Not specified',
    'num-performers': numPerformers = '1',
    'num-guests': numGuests = 'Not specified',
    'waiter-hours': waiterHours = '0',
    notes = 'None',
    'calculated-distance': distance = '0'
  } = formData;

  const location = locationType === 'area' 
    ? (eventArea || 'Not specified')
    : (eventAddress || 'Not specified');

  const distanceKm = parseFloat(distance) || 0;
  const performanceFee = calculatePerformanceFee(services, waiterHours);
  const travelFee = calculateTravelFee(distanceKm);
  const totalEstimate = performanceFee + travelFee;

  const htmlEmail = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #FF2D55; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
    .button { display: inline-block; padding: 12px 24px; background: #FF2D55; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
    .brief { background: #fff; border: 2px solid #FF2D55; padding: 15px; margin: 20px 0; white-space: pre-wrap; font-family: monospace; font-size: 13px; }
    .detail { margin: 10px 0; }
    .label { font-weight: bold; color: #FF2D55; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 New Booking Request</h1>
    </div>
    
    <div class="content">
      <h2>Customer Information</h2>
      <div class="detail"><span class="label">Name:</span> ${customerName}</div>
      <div class="detail"><span class="label">Email:</span> ${customerEmail}</div>
      <div class="detail"><span class="label">Phone:</span> ${customerPhone}</div>
      <div class="detail"><span class="label">City:</span> ${customerCity}</div>
      
      <h2>Event Details</h2>
      <div class="detail"><span class="label">Type:</span> ${eventType}</div>
      <div class="detail"><span class="label">Date:</span> ${formatDate(eventDate)}</div>
      <div class="detail"><span class="label">Time:</span> ${formatTime(eventTime)}</div>
      <div class="detail"><span class="label">Location:</span> ${location}</div>
      <div class="detail"><span class="label">Distance:</span> ${distanceKm.toFixed(1)} km (round trip)</div>
      
      <h2>Service Requirements</h2>
      <div class="detail"><span class="label">Services:</span> ${services}</div>
      <div class="detail"><span class="label">Performers:</span> ${numPerformers}</div>
      <div class="detail"><span class="label">Guests:</span> ${numGuests}</div>
      ${waiterHours && waiterHours !== '0' ? `<div class="detail"><span class="label">Waiter Hours:</span> ${waiterHours}</div>` : ''}
      
      <h2>Quote</h2>
      <div class="detail"><span class="label">Performance Fee:</span> R${performanceFee.toFixed(2)}</div>
      <div class="detail"><span class="label">Travel Fee:</span> R${travelFee.toFixed(2)}</div>
      <div class="detail"><span class="label">Total Estimate:</span> <strong>R${totalEstimate.toFixed(2)}</strong></div>
      
      <h2>Special Requests</h2>
      <div class="detail">${notes}</div>
      
      <h2>Quick Actions</h2>
      <a href="${calendarUrl}" class="button">📅 Add to Google Calendar</a>
      
      <h2>Dancer Brief (Copy & Send to WhatsApp)</h2>
      <div class="brief">${brief}</div>
      <p><em>Copy the brief above and paste into your WhatsApp group when ready.</em></p>
    </div>
  </div>
</body>
</html>`;

  // Log the email content (in production, this would send via email service)
  console.log('Owner Email HTML:', htmlEmail);
  console.log('Calendar URL:', calendarUrl);
  
  // Note: Actual email sending would require integration with an email service
  // For Netlify, you might use:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Or Netlify's built-in form notifications
  
  return true;
}

/**
 * Send confirmation email to customer
 */
async function sendCustomerEmail(formData) {
  const {
    'full-name': customerName = '',
    email: customerEmail = '',
    'event-type': eventType = 'Event',
    'event-date': eventDate = '',
    'event-time': eventTime = ''
  } = formData;

  const htmlEmail = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #FF2D55; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Your Booking Request!</h1>
    </div>
    
    <div class="content">
      <p>Dear ${customerName},</p>
      
      <p>Thank you for requesting a booking with Pulse Male Revue! We've received your request for:</p>
      
      <ul>
        <li><strong>Event Type:</strong> ${eventType}</li>
        <li><strong>Date:</strong> ${formatDate(eventDate)}</li>
        <li><strong>Time:</strong> ${formatTime(eventTime)}</li>
      </ul>
      
      <p>Our team will review your booking details and get back to you within 24 hours with:</p>
      <ul>
        <li>Confirmation of availability</li>
        <li>Final quote</li>
        <li>Next steps to confirm your booking</li>
      </ul>
      
      <p>If you have any urgent questions, please contact us at:</p>
      <p>
        📧 <a href="mailto:bookings@pulsedancers.com">bookings@pulsedancers.com</a><br>
        📞 [Your Phone Number]
      </p>
      
      <p>We look forward to making your event unforgettable!</p>
      
      <p>Best regards,<br>
      The Pulse Team</p>
    </div>
  </div>
</body>
</html>`;

  console.log('Customer Email HTML:', htmlEmail);
  console.log('Send to:', customerEmail);
  
  return true;
}
