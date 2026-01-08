/**
 * Pulse Dancers CMS - Google Sheets Integration
 * Sheet ID: 12zPYBbpdDLhqTPylP0oUgPqimy5fXIfg
 */
const SHEET_ID = '12zPYBbpdDLhqTPylP0oUgPqimy5fXIfg';
const API_KEY = 'AIzaSyDmIhz0iWcB8R-BBXkFFGi36bCQIm7fgA8';

// Sheet GIDs - Update these after getting them from the Google Sheet URLs
const SHEET_GIDS = {
  HOME: '664000307',
  PRICES: '2117273325',
  FAQS: '568464878',
  DANCERS: '116112300',
  SERVICES: '1118530609',
  TESTIMONIALS: '735891537',
  SOCIAL: '1025475414'
};

const PulseSheetsCMS = {
  async fetchSheet(gid, startRow = 1, endRow = 1000) {
    try {
      const range = encodeURIComponent(`${startRow}:${endRow}`);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values?ranges=${gid}!A${startRow}:Z${endRow}&key=${API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return (data.valueRanges && data.valueRanges[0] && data.valueRanges[0].values) || [];
    } catch (error) {
      console.error(`Error fetching sheet with GID ${gid}:`, error);
      return [];
    }
  },

  async getHome() {
    const rows = await this.fetchSheet(SHEET_GIDS.HOME, 1, 10);
    if (rows.length === 0) return {};
    const result = {};
    rows.forEach(row => {
      if (row[0] && row[1]) {
        result[row[0]] = row[1];
      }
    });
    return result;
  },

  async getPrices() {
    const rows = await this.fetchSheet(SHEET_GIDS.PRICES, 1, 20);
    if (rows.length === 0) return [];
    const startIdx = rows[0][0] === 'ID' || rows[0][0]?.toLowerCase().includes('service') ? 1 : 0;
    return rows.slice(startIdx).map(row => ({
      id: row[0],
      name: row[1],
      price: parseFloat(row[2]) || 0,
      duration: row[3],
      description: row[4] || ''
    })).filter(p => p.name);
  },

  async getDancers() {
    const rows = await this.fetchSheet(SHEET_GIDS.DANCERS, 1, 30);
    if (rows.length === 0) return [];
    const startIdx = rows[0][0] === 'ID' ? 1 : 0;
    return rows.slice(startIdx).map(row => ({
      id: row[0],
      name: row[1],
      initial: row[2],
      genres: row[3],
      experience: row[4],
      bio: row[5],
      image: row[6] || 'placeholder.jpg'
    })).filter(d => d.name);
  },

  async getServices() {
    const rows = await this.fetchSheet(SHEET_GIDS.SERVICES, 1, 20);
    if (rows.length === 0) return [];
    const startIdx = rows[0][0] === 'ID' ? 1 : 0;
    return rows.slice(startIdx).map(row => ({
      id: row[0],
      name: row[1],
      duration: row[2],
      price: row[3],
      notes: row[4] || ''
    })).filter(s => s.name);
  },

  async getFAQs() {
    const rows = await this.fetchSheet(SHEET_GIDS.FAQS, 1, 50);
    if (rows.length === 0) return [];
    const startIdx = rows[0][0] === 'ID' || rows[0][0]?.toLowerCase().includes('question') ? 1 : 0;
    return rows.slice(startIdx).map(row => ({
      id: row[0],
      question: row[1],
      answer: row[2]
    })).filter(f => f.question);
  },

  async getTestimonials() {
    const rows = await this.fetchSheet(SHEET_GIDS.TESTIMONIALS, 1, 20);
    if (rows.length === 0) return [];
    const startIdx = rows[0][0] === 'ID' ? 1 : 0;
    return rows.slice(startIdx).map(row => ({
      id: row[0],
      name: row[1],
      rating: parseInt(row[2]) || 5,
      text: row[3],
      location: row[4] || ''
    })).filter(t => t.name);
  },

  async getSocial() {
    const rows = await this.fetchSheet(SHEET_GIDS.SOCIAL, 1, 10);
    if (rows.length === 0) return {};
    const result = {};
    rows.forEach(row => {
      if (row[0] && row[1]) {
        result[row[0]] = row[1];
      }
    });
    return result;
  },

  async loadPrices(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const prices = await this.getPrices();
    if (prices.length === 0) { container.innerHTML = '<p>Loading...</p>'; return; }
    
    // Helper function to escape HTML
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text || '';
      return div.innerHTML;
    };
    
    container.innerHTML = prices.map(p => `<div class="price-card"><h3>${escapeHtml(p.name)}</h3><p>R${escapeHtml(String(p.price))}</p><p>${escapeHtml(p.duration)}</p><p>${escapeHtml(p.description)}</p></div>`).join('');
  },

  async loadServices(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const services = await this.getServices();
    if (services.length === 0) return;
    
    // Helper function to escape HTML
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text || '';
      return div.innerHTML;
    };
    
    container.innerHTML = services.map(s => `<label><input type="checkbox" name="service-type" value="${escapeHtml(s.name)}" data-price="${escapeHtml(String(s.price))}" data-id="${escapeHtml(String(s.id))}"><span>${escapeHtml(s.name)} (R${escapeHtml(String(s.price))})</span></label>`).join('');
  },

  async loadDancers(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const dancers = await this.getDancers();
    if (dancers.length === 0) return;
    
    // Helper function to escape HTML
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text || '';
      return div.innerHTML;
    };
    
    // Helper function to escape and validate image filename
    const sanitizeImagePath = (filename) => {
      if (!filename || filename === 'placeholder.jpg') return null;
      // Only allow alphanumeric, dots, dashes, underscores
      return filename.replace(/[^a-zA-Z0-9._-]/g, '');
    };
    
    container.innerHTML = dancers.map(d => {
      const imagePath = sanitizeImagePath(d.image);
      return `
      <div class="dancer-card" style="background-color: #1a1a1f; padding: 1.5rem; border-radius: 8px; border: 1px solid rgba(255, 45, 85, 0.1);">
        ${imagePath ? `<img src="assets/images/performers/${imagePath}" alt="${escapeHtml(d.name)}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;" class="dancer-image">` : ''}
        <h3 style="color: #FF2D55; margin-bottom: 0.5rem;">${escapeHtml(d.name)}</h3>
        ${d.initial ? `<p style="color: #E5E5E5; margin-bottom: 0.5rem;"><strong>Initial:</strong> ${escapeHtml(d.initial)}</p>` : ''}
        ${d.genres ? `<p style="color: #b0b0b0; margin-bottom: 0.5rem;"><strong>Genres:</strong> ${escapeHtml(d.genres)}</p>` : ''}
        ${d.experience ? `<p style="color: #b0b0b0; margin-bottom: 0.5rem;"><strong>Experience:</strong> ${escapeHtml(d.experience)}</p>` : ''}
        ${d.bio ? `<p style="color: #b0b0b0; line-height: 1.6;">${escapeHtml(d.bio)}</p>` : ''}
      </div>
    `;
    }).join('');
    
    // Add error handling for images using event delegation
    container.addEventListener('error', (e) => {
      if (e.target && e.target.classList.contains('dancer-image')) {
        e.target.style.display = 'none';
      }
    }, true);
  },

  async loadFAQs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const faqs = await this.getFAQs();
    if (faqs.length === 0) return;
    container.innerHTML = faqs.map(faq => `<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('active')"><strong>${faq.question}</strong><span>+</span></div><div class="faq-a" style="display:none;">${faq.answer}</div></div>`).join('');
  },

  async loadTestimonials(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const testimonials = await this.getTestimonials();
    if (testimonials.length === 0) return;
    
    // Helper function to escape HTML
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text || '';
      return div.innerHTML;
    };
    
    container.innerHTML = testimonials.map(t => `<div class="testimonial-card"><p>${escapeHtml(t.text)}</p><p><strong>${escapeHtml(t.name)}</strong> - ${escapeHtml(t.location)} <span class="rating">${'★'.repeat(Math.min(5, Math.max(0, parseInt(t.rating) || 5)))}</span></p></div>`).join('');
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PulseSheetsCMS;
}
