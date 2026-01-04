/**
 * Netlify Function: Generate Dancer Brief
 * 
 * Purpose: Format booking details into professional dancer brief
 * that can be copied and sent to WhatsApp group
 */

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

/**
 * Calculate performance fee from services
 */
function calculatePerformanceFee(servicesStr, waiterHours) {
  // This is a simplified calculation
  // In production, you'd parse the service string and match against pricing data
  // For now, we'll try to extract the price from the service string
  let total = 0;
  
  // Service format is like "1-Man Show (45min) - R2200, Topless Waiter (per hour) - R750"
  const serviceItems = servicesStr.split(',').map(s => s.trim());
  
  serviceItems.forEach(service => {
    // Extract price using regex
    const priceMatch = service.match(/R(\d+)/);
    if (priceMatch) {
      let price = parseFloat(priceMatch[1]);
      
      // Check if it's an hourly service
      if (service.includes('per hour') || service.includes('Waiter')) {
        const hours = parseInt(waiterHours) || 2;
        price = price * hours;
      }
      
      total += price;
    }
  });
  
  return total;
}

/**
 * Calculate travel fee (R4/km beyond 50km)
 */
function calculateTravelFee(distanceKm) {
  const FREE_KM = 50;
  const RAND_PER_KM = 4;
  const chargeableKm = Math.max(0, distanceKm - FREE_KM);
  return chargeableKm * RAND_PER_KM;
}

/**
 * Format date to readable string
 */
function formatDate(dateStr) {
  if (!dateStr || dateStr === 'Not specified') return dateStr;
  
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

/**
 * Format time to readable string
 */
function formatTime(timeStr) {
  if (!timeStr || timeStr === 'Not specified') return timeStr;
  
  try {
    // timeStr is in format "HH:MM"
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    
    return date.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return timeStr;
  }
}
