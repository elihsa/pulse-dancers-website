/**
 * Netlify Function: Generate Dancer Brief
 * 
 * Purpose: Format booking details into professional dancer brief
 * that can be copied and sent to WhatsApp group
 */

const {
  calculatePerformanceFee,
  calculateTravelFee,
  formatDate,
  formatTime
} = require('./utils');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse booking data from request body
    const bookingData = JSON.parse(event.body);

    // Generate the dancer brief
    const brief = generateBrief(bookingData);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        brief: brief,
        html: generateBriefHTML(bookingData)
      })
    };
  } catch (error) {
    console.error('Error generating brief:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate brief',
        message: error.message 
      })
    };
  }
};

/**
 * Generate plain text dancer brief
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

  // Determine location display
  const location = locationType === 'area' 
    ? (eventArea || 'Not specified')
    : (eventAddress || 'Not specified');

  // Calculate quote (same logic as frontend)
  const distanceKm = parseFloat(distance) || 0;
  const performanceFee = calculatePerformanceFee(services, waiterHours);
  const travelFee = calculateTravelFee(distanceKm);
  const totalEstimate = performanceFee + travelFee;

  // Format the brief
  const brief = `🎉 NEW BOOKING - ${eventType}

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

  return brief;
}

/**
 * Generate HTML version of brief for email
 */
function generateBriefHTML(data) {
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

  return `<div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #FF2D55; font-family: monospace; white-space: pre-wrap;">🎉 NEW BOOKING - ${eventType}

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
4. Share this brief with assigned dancers</div>`;
}
