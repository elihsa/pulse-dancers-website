/**
 * Booking Form Quote Calculator
 * Calculates dynamic quotes based on services and distance
 * Integrates with Google Sheets pricing data
 */

// Global callback for Google Maps API
function initGoogleMaps() {
  console.log('Google Maps API loaded');
}

const BookingForm = {
  distanceCostPerKm: 4, // R4 per km beyond 50km
  freeDistanceKm: 50,
  googleMapsApiKey: 'AIzaSyDmIhz0iWcB8R-BBXkFFGi36bCQIm7fgA8',
  baseLocationJohannesburg: { lat: -26.2023, lng: 28.0436 },
  
  async initializeForm() {
    // Load services from Google Sheets
    await PulseSheetsCMS.loadServices('service-checkboxes-container');
    
    // Setup event listeners for service checkboxes using event delegation
    const container = document.getElementById('service-checkboxes-container');
    if (container) {
      container.addEventListener('change', (e) => {
        if (e.target && e.target.name === 'service-type') {
          this.updateQuote();
        }
      });
    }
    
    // Setup event listeners
    document.getElementById('num-performers')?.addEventListener('change', () => this.updateQuote());
    document.getElementById('num-guests')?.addEventListener('change', () => this.updateQuote());
    
    // Setup location type toggle
    document.querySelectorAll('input[name="location-type"]').forEach(radio => {
      radio.addEventListener('change', () => this.updateLocationFields());
    });
    
    // Setup address autocomplete
    const addressInput = document.getElementById('event-address');
    if (addressInput && window.google && window.google.maps) {
      const autocomplete = new google.maps.places.Autocomplete(addressInput);
      autocomplete.addListener('place_changed', () => this.onPlaceSelected(autocomplete));
    }
    
    this.updateQuote();
  },

  updateLocationFields() {
    const locationType = document.querySelector('input[name="location-type"]:checked')?.value;
    document.getElementById('exact-address-fields').style.display = locationType === 'exact' ? 'block' : 'none';
    document.getElementById('area-fields').style.display = locationType === 'area' ? 'block' : 'none';
  },

  onPlaceSelected(autocomplete) {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const distance = this.calculateDistance(place.geometry.location);
      document.getElementById('calculated-distance').value = distance.toFixed(1);
      this.updateQuote();
    }
  },

  calculateDistance(eventLocation) {
    const R = 6371; // Radius of Earth in km
    const dLat = (eventLocation.lat() - this.baseLocationJohannesburg.lat) * Math.PI / 180;
    const dLng = (eventLocation.lng() - this.baseLocationJohannesburg.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.baseLocationJohannesburg.lat * Math.PI / 180) * Math.cos(eventLocation.lat() * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 2; // Round trip
  },

  updateQuote() {
    try {
      // Get selected services
      const serviceCheckboxes = document.querySelectorAll('input[name="service-type"]:checked');
      let performanceFee = 0;
      serviceCheckboxes.forEach(checkbox => {
        const price = parseFloat(checkbox.getAttribute('data-price')) || 0;
        performanceFee += price;
      });

      // Get number of performers multiplier
      const numPerformers = parseFloat(document.getElementById('num-performers')?.value) || 1;
      performanceFee = performanceFee * numPerformers;

      // Calculate distance and travel fee
      const distance = parseFloat(document.getElementById('calculated-distance')?.value) || 0;
      const travelFee = Math.max(0, (distance - this.freeDistanceKm) * this.distanceCostPerKm);

      // Calculate total
      const total = performanceFee + travelFee;

      // Update display
      document.getElementById('quote-performance').textContent = `R${performanceFee.toLocaleString('en-ZA', {minimumFractionDigits: 2})}`;
      document.getElementById('quote-distance').textContent = `${distance.toFixed(1)} km`;
      document.getElementById('quote-travel').textContent = `R${travelFee.toLocaleString('en-ZA', {minimumFractionDigits: 2})}`;
      document.getElementById('quote-total').textContent = `R${total.toLocaleString('en-ZA', {minimumFractionDigits: 2})}`;
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  }
};

// Add form submission handler to collect services properly
document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      // Collect selected services
      const selectedServices = Array.from(document.querySelectorAll('input[name="service-type"]:checked'))
        .map(cb => cb.value);
      
      if (selectedServices.length === 0) {
        e.preventDefault();
        const errorDiv = document.getElementById('service-error');
        if (errorDiv) {
          errorDiv.style.display = 'block';
          errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
      }
      
      // Hide error if shown
      const errorDiv = document.getElementById('service-error');
      if (errorDiv) {
        errorDiv.style.display = 'none';
      }
      
      // Update hidden field with selected services (comma-separated for email)
      const hiddenField = document.getElementById('services-hidden');
      if (hiddenField) {
        hiddenField.value = selectedServices.join(', ');
      }
    });
  }
});

// Initialize on page load - prevent double initialization
let initialized = false;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!initialized) {
      initialized = true;
      BookingForm.initializeForm();
    }
  });
} else {
  initialized = true;
  BookingForm.initializeForm();
}
