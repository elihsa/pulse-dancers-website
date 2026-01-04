/**
 * Shared utility functions for Netlify Functions
 */

// Constants
const FREE_KM = 50;
const RAND_PER_KM = 4;
const DEFAULT_WAITER_HOURS = 2;

/**
 * Calculate performance fee from services string
 * @param {string} servicesStr - Comma-separated services with prices
 * @param {string|number} waiterHours - Hours for waiter services
 * @returns {number} Total performance fee
 */
function calculatePerformanceFee(servicesStr, waiterHours) {
  let total = 0;
  
  const serviceItems = servicesStr.split(',').map(s => s.trim());
  
  serviceItems.forEach(service => {
    // Extract price using regex (format: "Service Name - R1234")
    const priceMatch = service.match(/R(\d+)/);
    if (priceMatch) {
      let price = parseFloat(priceMatch[1]);
      
      // Check if it's an hourly service
      if (service.includes('per hour') || service.includes('Waiter')) {
        const hours = parseInt(waiterHours) || DEFAULT_WAITER_HOURS;
        price = price * hours;
      }
      
      total += price;
    }
  });
  
  return total;
}

/**
 * Calculate travel fee based on distance
 * @param {number} distanceKm - Round trip distance in kilometers
 * @returns {number} Travel fee in Rand
 */
function calculateTravelFee(distanceKm) {
  const chargeableKm = Math.max(0, distanceKm - FREE_KM);
  return chargeableKm * RAND_PER_KM;
}

/**
 * Format date to readable string
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @returns {string} Formatted date
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
 * @param {string} timeStr - Time string (HH:MM)
 * @returns {string} Formatted time
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

/**
 * Format date/time for Google Calendar (YYYYMMDDTHHmmSSZ in UTC)
 * @param {Date} date - JavaScript Date object
 * @returns {string} Formatted datetime for Google Calendar
 */
function formatDateTimeForCalendar(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

// Export functions
module.exports = {
  FREE_KM,
  RAND_PER_KM,
  DEFAULT_WAITER_HOURS,
  calculatePerformanceFee,
  calculateTravelFee,
  formatDate,
  formatTime,
  formatDateTimeForCalendar
};
