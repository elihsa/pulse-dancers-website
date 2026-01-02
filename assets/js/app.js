// Pulse Dancers Website - Main JavaScript File

// ===== FAQ ACCORDION =====
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isActive = header.classList.contains('active');
      
      // Close all accordions
      accordionHeaders.forEach(h => {
        h.classList.remove('active');
        h.nextElementSibling.classList.remove('active');
      });
      
      // Open clicked accordion if it wasn't active
      if (!isActive) {
        header.classList.add('active');
        body.classList.add('active');
      }
    });
  });
}

// ===== BOOKING FORM - DISTANCE CALCULATOR =====
const GOOGLE_MAPS_API_KEY = 'AIzaSyDmIhz0iWcB8R-BBXkFFGi36bCQIm7fgA8';
const BASE_LOCATION = 'Sandton City, Johannesburg, South Africa';
const FREE_KM = 50;
const RAND_PER_KM = 4;
const DEFAULT_WAITER_HOURS = 2;

let autocomplete;
let distanceService;
let geocoder;

function initGoogleMaps() {
  if (typeof google === 'undefined') {
    console.log('Google Maps not loaded yet');
    return;
  }

  // Initialize autocomplete for address input
  const addressInput = document.getElementById('event-address');
  if (addressInput) {
    autocomplete = new google.maps.places.Autocomplete(addressInput, {
      componentRestrictions: { country: 'za' },
      fields: ['formatted_address', 'geometry', 'name']
    });
    
    autocomplete.addListener('place_changed', calculateDistance);
  }

  // Initialize distance service
  distanceService = new google.maps.DistanceMatrixService();
  geocoder = new google.maps.Geocoder();

  // Also listen to the area input for geocoding
  const areaInput = document.getElementById('event-area');
  if (areaInput) {
    areaInput.addEventListener('blur', () => {
      if (areaInput.value) {
        geocodeArea(areaInput.value);
      }
    });
  }
}

function geocodeArea(area) {
  if (!geocoder) return;
  
  geocoder.geocode({ 
    address: area + ', Gauteng, South Africa' 
  }, (results, status) => {
    if (status === 'OK' && results[0]) {
      calculateDistanceFromCoords(results[0].geometry.location);
    }
  });
}

function calculateDistance() {
  const place = autocomplete.getPlace();
  if (!place || !place.geometry) {
    return;
  }
  
  calculateDistanceFromCoords(place.geometry.location);
}

function calculateDistanceFromCoords(destination) {
  if (!distanceService) return;

  distanceService.getDistanceMatrix({
    origins: [BASE_LOCATION],
    destinations: [destination],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.METRIC
  }, (response, status) => {
    if (status === 'OK') {
      const result = response.rows[0].elements[0];
      if (result.status === 'OK') {
        const distanceKm = result.distance.value / 1000; // Convert meters to km
        const roundTripKm = distanceKm * 2; // Round trip
        updateQuoteWithDistance(roundTripKm);
      }
    }
  });
}

function updateQuoteWithDistance(roundTripKm) {
  // Store distance for quote calculation
  const distanceInput = document.getElementById('calculated-distance');
  if (distanceInput) {
    distanceInput.value = roundTripKm.toFixed(2);
  }
  
  // Trigger quote update
  updateQuote();
}

// ===== LIVE QUOTE CALCULATOR =====
function updateQuote() {
  // Get form values
  const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
  const performersInput = document.getElementById('num-performers');
  const distanceInput = document.getElementById('calculated-distance');
  const waiterHoursInput = document.getElementById('waiter-hours');
  
  if (!performersInput) return;

  let totalServicePrice = 0;
  let hasWaiterService = false;
  const selectedServices = [];

  // Calculate total service price from checked services
  serviceCheckboxes.forEach(checkbox => {
    const price = parseFloat(checkbox.value) || 0;
    const isHourly = checkbox.getAttribute('data-hourly') === 'true';
    const serviceName = checkbox.getAttribute('data-name');
    
    if (isHourly) {
      hasWaiterService = true;
      const hours = parseInt(waiterHoursInput?.value) || DEFAULT_WAITER_HOURS;
      totalServicePrice += price * hours;
      selectedServices.push(`${serviceName} (${hours}h)`);
    } else {
      totalServicePrice += price;
      selectedServices.push(serviceName);
    }
  });

  // Show/hide waiter hours field
  const waiterHoursField = document.getElementById('waiter-hours-field');
  if (waiterHoursField) {
    waiterHoursField.style.display = hasWaiterService ? 'block' : 'none';
    if (hasWaiterService && waiterHoursInput) {
      waiterHoursInput.setAttribute('required', 'required');
    } else if (waiterHoursInput) {
      waiterHoursInput.removeAttribute('required');
    }
  }

  // Update hidden field with selected services for form submission
  const servicesHidden = document.getElementById('services-hidden');
  if (servicesHidden) {
    servicesHidden.value = selectedServices.join(', ');
  }

  const numPerformers = parseInt(performersInput.value) || 1;
  const distance = parseFloat(distanceInput?.value || 0);

  // Calculate performance fee
  const performanceFee = totalServicePrice;

  // Calculate travel fee (only beyond free km)
  const chargeableKm = Math.max(0, distance - FREE_KM);
  const travelFee = chargeableKm * RAND_PER_KM;

  // Total
  const total = performanceFee + travelFee;

  // Update display
  const performanceDisplay = document.getElementById('quote-performance');
  const travelDisplay = document.getElementById('quote-travel');
  const distanceDisplay = document.getElementById('quote-distance');
  const totalDisplay = document.getElementById('quote-total');

  if (performanceDisplay) {
    performanceDisplay.textContent = `R${performanceFee.toFixed(2)}`;
  }
  
  if (distanceDisplay) {
    distanceDisplay.textContent = `${distance.toFixed(1)} km`;
  }

  if (travelDisplay) {
    travelDisplay.textContent = `R${travelFee.toFixed(2)}`;
  }

  if (totalDisplay) {
    totalDisplay.textContent = `R${total.toFixed(2)}`;
  }
}

// ===== GUEST RECOMMENDATION =====
function updateGuestRecommendation() {
  const guestsSelect = document.getElementById('num-guests');
  const performersInput = document.getElementById('num-performers');
  const recommendationDiv = document.getElementById('guest-recommendation');
  
  if (!guestsSelect || !performersInput || !recommendationDiv) return;

  const guestRange = guestsSelect.value;
  let recommendation = '';

  if (guestRange === '<10' || guestRange === '10-20') {
    recommendation = 'Recommended: 1 performer';
    performersInput.value = 1;
  } else if (guestRange === '20-40') {
    recommendation = 'Recommended: 2 performers (1 per 20 guests)';
    performersInput.value = 2;
  } else if (guestRange === '40+') {
    recommendation = 'Recommended: 2+ performers (1 per 20 guests)';
    performersInput.value = 2;
  }

  recommendationDiv.textContent = recommendation;
  updateQuote();
}

// ===== LOCATION TYPE TOGGLE =====
function initLocationToggle() {
  const exactRadio = document.getElementById('location-exact');
  const areaRadio = document.getElementById('location-area');
  const exactFields = document.getElementById('exact-address-fields');
  const areaFields = document.getElementById('area-fields');

  if (exactRadio && areaRadio && exactFields && areaFields) {
    exactRadio.addEventListener('change', () => {
      exactFields.style.display = 'block';
      areaFields.style.display = 'none';
    });

    areaRadio.addEventListener('change', () => {
      exactFields.style.display = 'none';
      areaFields.style.display = 'block';
    });
  }
}

// ===== FORM LISTENERS =====
function initBookingForm() {
  // Get all service checkboxes once
  const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
  const performersInput = document.getElementById('num-performers');
  const guestsSelect = document.getElementById('num-guests');
  const waiterHoursInput = document.getElementById('waiter-hours');
  const serviceError = document.getElementById('service-error');

  // Add listeners for quote updates
  serviceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateQuote);
  });

  if (performersInput) {
    performersInput.addEventListener('input', updateQuote);
  }

  if (guestsSelect) {
    guestsSelect.addEventListener('change', updateGuestRecommendation);
  }

  if (waiterHoursInput) {
    waiterHoursInput.addEventListener('input', updateQuote);
  }

  // Initialize location toggle
  initLocationToggle();
  
  // Add form validation for at least one service selected
  const form = document.getElementById('booking-form');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      const checkedServices = document.querySelectorAll('input[name="services"]:checked');
      if (checkedServices.length === 0) {
        e.preventDefault();
        if (serviceError) {
          serviceError.style.display = 'block';
        }
        // Scroll to error
        const servicesSection = document.querySelector('.service-checkboxes');
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
      }
    });
    
    // Hide/show error when user changes service selection
    serviceCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (serviceError) {
          const anyChecked = document.querySelectorAll('input[name="services"]:checked').length > 0;
          serviceError.style.display = anyChecked ? 'none' : 'block';
        }
      });
    });
  }
}

// ===== LOAD CMS DATA =====
async function loadCMSData(dataFile, callback) {
  try {
    const response = await fetch(`/data/${dataFile}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    callback(data);
  } catch (error) {
    console.error(`Error loading ${dataFile}:`, error);
    callback(null); // Pass null to callback to handle error gracefully
  }
}

// ===== LOAD PERFORMERS =====
function loadPerformers() {
  const performersGrid = document.getElementById('performers-grid');
  if (!performersGrid) return;

  loadCMSData('performers.json', (data) => {
    if (!data || !data.performers || data.performers.length === 0) {
      const message = document.createElement('p');
      message.style.textAlign = 'center';
      message.style.color = '#b0b0b0';
      message.textContent = 'No performers to display yet. Add team members via the CMS.';
      performersGrid.appendChild(message);
      return;
    }

    // Filter to only explicitly active performers
    const activePerformers = data.performers.filter(p => p.active === true);
    
    if (activePerformers.length === 0) {
      const message = document.createElement('p');
      message.style.textAlign = 'center';
      message.style.color = '#b0b0b0';
      message.textContent = 'No active performers at this time. Check back soon!';
      performersGrid.appendChild(message);
      return;
    }

    // Clear grid
    performersGrid.innerHTML = '';

    // Create performer cards using DOM methods for security
    activePerformers.forEach(performer => {
      const card = document.createElement('div');
      card.className = 'performer-card';
      
      // Create and validate photo
      const photo = document.createElement('img');
      photo.className = 'performer-photo';
      photo.loading = 'lazy';
      photo.alt = 'Performer photo';
      
      // Validate photo URL - only allow http/https
      let photoUrl = '/assets/images/placeholder-performer.jpg';
      if (performer.photo && typeof performer.photo === 'string') {
        try {
          const url = new URL(performer.photo, window.location.origin);
          if (url.protocol === 'http:' || url.protocol === 'https:') {
            photoUrl = performer.photo;
          }
        } catch (e) {
          console.warn('Invalid performer photo URL:', performer.photo);
        }
      }
      photo.src = photoUrl;
      
      // Create info container
      const info = document.createElement('div');
      info.className = 'performer-info';
      
      // Add name
      if (performer.name) {
        const name = document.createElement('div');
        name.className = 'performer-name';
        name.textContent = performer.name;
        info.appendChild(name);
      }
      
      // Add stage name
      if (performer.stageName) {
        const stageName = document.createElement('div');
        stageName.className = 'performer-stage-name';
        stageName.textContent = `"${performer.stageName}"`;
        info.appendChild(stageName);
      }
      
      // Add bio
      if (performer.bio) {
        const bio = document.createElement('div');
        bio.className = 'performer-bio';
        bio.textContent = performer.bio;
        info.appendChild(bio);
      }
      
      // Add specialties
      if (performer.specialties) {
        const specialties = document.createElement('div');
        specialties.className = 'performer-specialties';
        specialties.textContent = `💪 ${performer.specialties}`;
        info.appendChild(specialties);
      }
      
      card.appendChild(photo);
      card.appendChild(info);
      performersGrid.appendChild(card);
    });
  });
}

// ===== LOAD FAQ FROM CMS =====
function loadFAQ() {
  const faqContent = document.getElementById('faq-content');
  const faqFooterTitle = document.getElementById('faq-footer-title');
  const faqFooterDescription = document.getElementById('faq-footer-description');
  
  if (!faqContent) return;

  loadCMSData('faq.json', (data) => {
    if (!data || !data.groups || data.groups.length === 0) {
      faqContent.innerHTML = '<p style="text-align: center; color: #b0b0b0;">No FAQ content available.</p>';
      return;
    }

    // Clear loading message
    faqContent.innerHTML = '';

    // Create FAQ groups
    data.groups.forEach(group => {
      // Create group heading
      const heading = document.createElement('h2');
      heading.style.marginTop = '3rem';
      heading.textContent = group.title;
      faqContent.appendChild(heading);

      // Create accordion container
      const accordion = document.createElement('div');
      accordion.className = 'accordion';

      // Create accordion items
      group.qas.forEach(qa => {
        const item = document.createElement('div');
        item.className = 'accordion-item';

        const header = document.createElement('button');
        header.className = 'accordion-header';
        header.textContent = qa.q;

        const body = document.createElement('div');
        body.className = 'accordion-body';
        // Preserve line breaks in answers
        body.style.whiteSpace = 'pre-line';
        body.textContent = qa.a;

        item.appendChild(header);
        item.appendChild(body);
        accordion.appendChild(item);
      });

      faqContent.appendChild(accordion);
    });

    // Update footer text if provided
    if (faqFooterTitle && data.footerText) {
      faqFooterTitle.textContent = data.footerText;
    }
    if (faqFooterDescription && data.footerDescription) {
      faqFooterDescription.textContent = data.footerDescription;
    }

    // Re-initialize accordion after content is loaded
    initAccordion();
  });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  // Load FAQ if on FAQ page
  if (document.getElementById('faq-content')) {
    loadFAQ();
  }

  // Initialize accordion if present (but not on FAQ page since loadFAQ handles it)
  if (document.querySelector('.accordion') && !document.getElementById('faq-content')) {
    initAccordion();
  }

  // Initialize booking form if present
  if (document.getElementById('booking-form')) {
    initBookingForm();
  }

  // Load performers if on meet-the-guys page
  if (document.getElementById('performers-grid')) {
    loadPerformers();
  }

  // Load home page CMS content (logo and hero image)
  if (document.getElementById('site-logo') || document.getElementById('hero-section')) {
    loadHomePageImages();
  }

  // Load pricing table if on prices page
  if (document.getElementById('pricing-table-body')) {
    loadPricingTable();
  }

  // Load booking form services if on booking page
  if (document.getElementById('service-checkboxes-container')) {
    loadBookingServices();
  }

  // Load Instagram posts if on homepage
  if (document.getElementById('instagram-post-1')) {
    loadInstagramPosts();
  }
});

// ===== LOAD PRICING TABLE FROM CMS =====
function loadPricingTable() {
  const tableBody = document.getElementById('pricing-table-body');
  const notesElement = document.getElementById('pricing-notes');
  
  if (!tableBody) return;

  loadCMSData('prices.json', (data) => {
    if (!data || !data.items || data.items.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 2rem; color: #b0b0b0;">No pricing data available.</td></tr>';
      return;
    }

    // Update notes if provided
    if (notesElement && data.notes) {
      notesElement.textContent = data.notes;
    }

    // Clear loading message
    tableBody.innerHTML = '';

    // Create table rows
    data.items.forEach(item => {
      const row = document.createElement('tr');
      
      const nameCell = document.createElement('td');
      nameCell.textContent = item.name || '';
      
      const durationCell = document.createElement('td');
      durationCell.textContent = item.duration || '';
      
      const priceCell = document.createElement('td');
      const formattedPrice = parseInt(item.price || 0).toLocaleString('en-ZA');
      priceCell.textContent = `R${formattedPrice}`;
      
      row.appendChild(nameCell);
      row.appendChild(durationCell);
      row.appendChild(priceCell);
      tableBody.appendChild(row);
    });
  });
}

// ===== LOAD BOOKING FORM SERVICES FROM CMS =====
function loadBookingServices() {
  const container = document.getElementById('service-checkboxes-container');
  if (!container) return;

  loadCMSData('prices.json', (data) => {
    if (!data || !data.items || data.items.length === 0) {
      container.innerHTML = '<p style="color: #b0b0b0; padding: 1rem;">No services available.</p>';
      return;
    }

    // Clear loading message
    container.innerHTML = '';

    // Create checkbox for each service
    data.items.forEach(item => {
      const label = document.createElement('label');
      label.className = 'checkbox-label';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'services';
      checkbox.value = item.price || '0';
      checkbox.setAttribute('data-name', `${item.name} (${item.duration})`);
      checkbox.setAttribute('data-hourly', item.isHourly ? 'true' : 'false');
      
      const span = document.createElement('span');
      const formattedPrice = parseInt(item.price || 0).toLocaleString('en-ZA');
      const priceText = item.isHourly ? ` (per hour) - R${formattedPrice}` : ` (${item.duration}) - R${formattedPrice}`;
      span.textContent = `${item.name}${priceText}`;
      
      label.appendChild(checkbox);
      label.appendChild(span);
      container.appendChild(label);
    });

    // Re-initialize booking form event listeners after services are loaded
    if (document.getElementById('booking-form')) {
      initBookingForm();
    }
  });
}

// ===== LOAD HOME PAGE IMAGES FROM CMS =====
function loadHomePageImages() {
  loadCMSData('home.json', (data) => {
    if (!data) return;

    // Load logo if provided
    const logoElement = document.getElementById('site-logo');
    if (logoElement && data.logoImage && data.logoImage.trim() !== '') {
      // Replace text with image
      logoElement.innerHTML = `<img src="${data.logoImage}" alt="PULSE" style="height: 40px; width: auto;">`;
    }

    // Load hero background image if provided
    const heroSection = document.getElementById('hero-section');
    if (heroSection && data.heroImage && data.heroImage.trim() !== '') {
      heroSection.style.backgroundImage = `url('${data.heroImage}')`;
      heroSection.style.backgroundSize = 'cover';
      heroSection.style.backgroundPosition = 'center';
      heroSection.style.backgroundRepeat = 'no-repeat';
    }
  });
}

// Load Google Maps when needed
window.initGoogleMaps = initGoogleMaps;

// ===== LOAD INSTAGRAM POSTS FROM CMS =====
function loadInstagramPosts() {
  loadCMSData('social.json', (data) => {
    if (!data || !data.instagramPosts || data.instagramPosts.length < 2) {
      console.warn('Not enough Instagram posts in CMS data');
      return;
    }
    
    // Load first two Instagram posts
    const post1 = document.querySelector('#instagram-post-1 .instagram-media');
    const post2 = document.querySelector('#instagram-post-2 .instagram-media');
    
    if (post1 && data.instagramPosts[0] && data.instagramPosts[0].url) {
      post1.setAttribute('data-instgrm-permalink', data.instagramPosts[0].url);
    }
    
    if (post2 && data.instagramPosts[1] && data.instagramPosts[1].url) {
      post2.setAttribute('data-instgrm-permalink', data.instagramPosts[1].url);
    }
    
    // Reload Instagram embed script to render posts
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  });
}
