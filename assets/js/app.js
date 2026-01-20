// ===========================
// PULSE DANCERS - Main JavaScript
// ===========================

// ===== NAVIGATION TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking on a nav link
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

// ===== LOGO ERROR HANDLING =====
const logoImg = document.querySelector('.logo');
if (logoImg) {
  logoImg.addEventListener('error', function() {
    this.style.display = 'none';
    const brandText = this.nextElementSibling;
    if (brandText && brandText.classList.contains('brand')) {
      brandText.style.display = 'block';
    }
  });
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== LOADING OVERLAY =====
window.addEventListener('load', () => {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 300);
  }
});

// ===== HERO PARALLAX EFFECT =====
// Throttle function to limit scroll event frequency
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttled scroll handler to prevent performance issues
const handleScroll = throttle(() => {
  const scrolled = window.pageYOffset;
  const heroContent = document.querySelector('.hero-content');
  
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    heroContent.style.opacity = 1 - (scrolled / 500);
  }
}, 16); // ~60fps

window.addEventListener('scroll', handleScroll, { passive: true });

// ===== INTERSECTION OBSERVER FOR FADE-IN =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .gallery-item, .about-content, .contact-info').forEach(el => {
  observer.observe(el);
});

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-lightbox');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentImageIndex = 0;
const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    currentImageIndex = index;
    openLightbox(images[currentImageIndex]);
  });
});

function openLightbox(src) {
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function showPrevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  lightboxImg.src = images[currentImageIndex];
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  lightboxImg.src = images[currentImageIndex];
}

if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
if (nextBtn) nextBtn.addEventListener('click', showNextImage);

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('active')) return;
  
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrevImage();
  if (e.key === 'ArrowRight') showNextImage();
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      // Replace with your actual form submission endpoint
      const response = await fetch('YOUR_FORM_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        showFormStatus('Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      showFormStatus('Oops! Something went wrong. Please try again.', 'error');
      console.error('Form submission error:', error);
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

function showFormStatus(message, type) {
  if (formStatus) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 5000);
  }
}

// ===== BOOKING FORM HANDLING =====
const bookingForm = document.getElementById('booking-form');
const bookingStatus = document.getElementById('booking-status');
const totalCostElement = document.getElementById('total-cost');

if (bookingForm) {
  // Update total cost when services are selected
  const serviceCheckboxes = bookingForm.querySelectorAll('input[name="services"]');
  serviceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateTotalCost);
  });
  
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(bookingForm);
    const services = Array.from(formData.getAll('services'));
    
    if (services.length === 0) {
      showBookingStatus('Please select at least one service.', 'error');
      return;
    }
    
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      time: formData.get('time'),
      services: services,
      message: formData.get('message')
    };
    
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      // Replace with your actual booking endpoint
      const response = await fetch('YOUR_BOOKING_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        showBookingStatus('Booking request sent! We\'ll confirm your booking soon.', 'success');
        bookingForm.reset();
        updateTotalCost();
      } else {
        throw new Error('Booking submission failed');
      }
    } catch (error) {
      showBookingStatus('Oops! Something went wrong. Please try again.', 'error');
      console.error('Booking submission error:', error);
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

function updateTotalCost() {
  const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
  let total = 0;
  
  serviceCheckboxes.forEach(checkbox => {
    total += parseFloat(checkbox.value) || 0;
  });
  
  if (totalCostElement) {
    totalCostElement.textContent = `R${total.toLocaleString('en-ZA')}`;
  }
}

function showBookingStatus(message, type) {
  if (bookingStatus) {
    bookingStatus.textContent = message;
    bookingStatus.className = `form-status ${type}`;
    bookingStatus.style.display = 'block';
    
    setTimeout(() => {
      bookingStatus.style.display = 'none';
    }, 5000);
  }
}

// ===== TESTIMONIALS SLIDER =====
const testimonials = document.querySelectorAll('.testimonial-card');
let currentTestimonial = 0;

function showTestimonial(index) {
  testimonials.forEach((testimonial, i) => {
    testimonial.style.display = i === index ? 'block' : 'none';
  });
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}

if (testimonials.length > 0) {
  showTestimonial(currentTestimonial);
  setInterval(nextTestimonial, 5000); // Change testimonial every 5 seconds
}

// ===== VIDEO PLAYER =====
const videoThumbnails = document.querySelectorAll('.video-thumbnail');

videoThumbnails.forEach(thumbnail => {
  thumbnail.addEventListener('click', function() {
    const videoId = this.dataset.videoId;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    this.innerHTML = '';
    this.appendChild(iframe);
  });
});

// ===== SOCIAL MEDIA FEED =====
async function loadInstagramFeed() {
  const feedContainer = document.getElementById('instagram-feed');
  if (!feedContainer) return;
  
  try {
    // Replace with your Instagram API endpoint
    const response = await fetch('YOUR_INSTAGRAM_API_ENDPOINT');
    const data = await response.json();
    
    feedContainer.innerHTML = data.posts.map(post => `
      <div class="instagram-post">
        <img src="${post.image}" alt="${post.caption}">
        <div class="post-overlay">
          <span class="likes">❤️ ${post.likes}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading Instagram feed:', error);
    feedContainer.innerHTML = '<p>Unable to load Instagram feed.</p>';
  }
}

// ===== NEWSLETTER SIGNUP =====
const newsletterForm = document.getElementById('newsletter-form');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = newsletterForm.querySelector('input[type="email"]').value;
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    try {
      // Replace with your newsletter API endpoint
      const response = await fetch('YOUR_NEWSLETTER_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        alert('Thanks for subscribing to our newsletter!');
        newsletterForm.reset();
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      alert('Oops! Something went wrong. Please try again.');
      console.error('Newsletter subscription error:', error);
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

// ===== LOAD PRICING TABLE FROM CMS =====
async function loadPricingTable() {
  const tableBody = document.getElementById('pricing-table-body');
  const notesElement = document.getElementById('pricing-notes');
  
  if (!tableBody) return;

  try {
    const prices = await PulseSheetsCMS.getPrices();
    
    if (prices.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 2rem; color: #b0b0b0;">No pricing data available.</td></tr>';
      return;
    }

    // Clear loading message
    tableBody.innerHTML = '';

    // Create table rows
    prices.forEach(item => {
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
       
 const descriptionCell = document.createElement('td');
 descriptionCell.textContent = item.description || '';
 
 row.appendChild(descriptionCell);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading prices:', error);
    tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 2rem; color: #b0b0b0;">Error loading pricing data.</td></tr>';
  }
}

// ===== LOAD BOOKING FORM SERVICES FROM CMS =====
async function loadBookingServices() {
  const container = document.getElementById('service-checkboxes-container');
  if (!container) return;

  try {
    const prices = await PulseSheetsCMS.getPrices();
    
    if (prices.length === 0) {
      container.innerHTML = '<p style="color: #b0b0b0; padding: 1rem;">No services available.</p>';
      return;
    }

    // Clear loading message
    container.innerHTML = '';

    // Create checkbox for each service
    prices.forEach(item => {
      const label = document.createElement('label');
      label.className = 'checkbox-label';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'services';
      checkbox.value = item.price || '0';
      checkbox.setAttribute('data-name', `${item.name} (${item.duration})`);
      checkbox.setAttribute('data-hourly', item.duration && item.duration.toLowerCase().includes('hour') ? 'true' : 'false');
      
      const span = document.createElement('span');
      const formattedPrice = parseInt(item.price || 0).toLocaleString('en-ZA');
      span.textContent = `${item.name} (${item.duration}) - R${formattedPrice}`;
      
      label.appendChild(checkbox);
      label.appendChild(span);
      container.appendChild(label);
    });
  } catch (error) {
    console.error('Error loading services:', error);
    container.innerHTML = '<p style="color: #b0b0b0; padding: 1rem;">Error loading services.</p>';
  }
}

// ===== LOAD FAQs FROM CMS =====
async function loadFAQs() {
  const faqContainer = document.getElementById('faq-content');
  if (!faqContainer) return;
  try {
    const faqs = await PulseSheetsCMS.getFAQs();
    
    if (faqs.length === 0) {
      faqContainer.innerHTML = '<p style="color: #b0b0b0; padding: 2rem; text-align: center;">No FAQ data available.</p>';
      return;
    }
    
    // Clear loading message
    faqContainer.innerHTML = '';
    
    // Create accordion for FAQs
    const faqList = document.createElement('div');
    faqList.className = 'faq-list';
    
    faqs.forEach((faq, index) => {
      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item';
      
      const question = document.createElement('button');
      question.className = 'faq-question';
      question.type = 'button';
      question.textContent = faq.question || '';
      question.setAttribute('aria-expanded', 'false');
      
      const answer = document.createElement('div');
      answer.className = 'faq-answer';
      answer.textContent = faq.answer || '';
      answer.style.display = 'none';
      
      // Toggle answer visibility
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        answer.style.display = isExpanded ? 'none' : 'block';
      });
      
      faqItem.appendChild(question);
      faqItem.appendChild(answer);
      faqList.appendChild(faqItem);
    });
    
    faqContainer.appendChild(faqList);
  } catch (error) {
    console.error('Error loading FAQs:', error);
    faqContainer.innerHTML = '<p style="color: #b0b0b0; padding: 2rem; text-align: center;">Error loading FAQ data.</p>';
  }
}

// ===== LOAD DANCERS FROM CMS =====
async function loadDancers() {
  const dancersContainer = document.getElementById('dancers-container');
  if (!dancersContainer) return;
  
  try {
    const dancers = await PulseSheetsCMS.getDancers();
    
    if (dancers.length === 0) {
      dancersContainer.innerHTML = '<p style="color: #b0b0b0; padding: 2rem; text-align: center;">Unable to load performers. Please contact us for more information.</p>';
      return;
    }
    
    // Clear loading message
    dancersContainer.innerHTML = '';
    
    // Create dancer cards
    dancers.forEach(dancer => {
      const card = document.createElement('div');
      card.className = 'dancer-card';
      
      const imageUrl = dancer.image ? `assets/images/performers/${dancer.image}` : 'assets/images/performers/placeholder.jpg';
      
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      imgElement.alt = dancer.name || 'Dancer';
      imgElement.style.width = '100%';
      imgElement.style.height = 'auto';
      imgElement.onerror = function() {
        this.src = 'assets/images/performers/placeholder.jpg';
      };
      
      const content = document.createElement('div');
      content.className = 'dancer-info';
      
      const nameEl = document.createElement('h3');
      nameEl.textContent = dancer.name || '';
      
      const initialEl = document.createElement('p');
      initialEl.className = 'dancer-initial';
      initialEl.textContent = dancer.initial || '';
      
      const genresEl = document.createElement('p');
      genresEl.className = 'dancer-genres';
      genresEl.textContent = dancer.genres || '';
      
      const experienceEl = document.createElement('p');
      experienceEl.className = 'dancer-experience';
      experienceEl.textContent = `${dancer.experience || ''}`;
      
      const bioEl = document.createElement('p');
      bioEl.className = 'dancer-bio';
      bioEl.textContent = dancer.bio || '';
      
      content.appendChild(nameEl);
      content.appendChild(initialEl);
      content.appendChild(genresEl);
      content.appendChild(experienceEl);
      content.appendChild(bioEl);
      
      card.appendChild(imgElement);
      card.appendChild(content);
      dancersContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading dancers:', error);
    dancersContainer.innerHTML = '<p style="color: #b0b0b0; padding: 2rem; text-align: center;">Unable to load performers. Please contact us for more information.</p>';
  }
}

// ===== INITIALIZE CMS CONTENT ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  loadPricingTable();
  loadBookingServices();
//     loadFAQs();
  loadDancers();
  // loadInstagramFeed(); // Uncomment when Instagram API is set up
});

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.getElementById('scroll-top');

if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Add skip to main content link functionality
const skipLink = document.querySelector('.skip-to-content');
if (skipLink) {
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
    }
  });
}

// ===== ANALYTICS TRACKING =====
function trackEvent(category, action, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      'event_category': category,
      'event_label': label
    });
  }
}

// Track button clicks
document.querySelectorAll('.cta-button, .btn').forEach(button => {
  button.addEventListener('click', function() {
    trackEvent('Button', 'Click', this.textContent.trim());
  });
});

// Track form submissions
if (contactForm) {
  contactForm.addEventListener('submit', () => {
    trackEvent('Form', 'Submit', 'Contact Form');
  });
}

if (bookingForm) {
  bookingForm.addEventListener('submit', () => {
    trackEvent('Form', 'Submit', 'Booking Form');
  });
}
