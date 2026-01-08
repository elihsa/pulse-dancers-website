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
    container.innerHTML = prices.map(p => `<div class="price-card"><h3>${p.name}</h3><p>R${p.price}</p><p>${p.duration}</p><p>${p.description}</p></div>`).join('');
  },

  async loadServices(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const services = await this.getServices();
    if (services.length === 0) return;
    container.innerHTML = services.map(s => `<label><input type="checkbox" name="service-type" value="${s.name}" data-price="${s.price}" onchange="window.BookingForm?.updateQuote?.()"  data-id="${s.id}"><span>${s.name} (R${s.price})</span></label>`).join('');
  },

  async loadDancers(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const dancers = await this.getDancers();
    if (dancers.length === 0) return;
    container.innerHTML = dancers.map(d => `<div class="dancer-card"><h3>${d.name}</h3><p>${d.genres}</p><p>${d.bio}</p></div>`).join('');
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
    container.innerHTML = testimonials.map(t => `<div class="testimonial-card"><p>${t.text}</p><p><strong>${t.name}</strong> - ${t.location} <span class="rating">${'★'.repeat(t.rating)}</span></p></div>`).join('');
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PulseSheetsCMS;
}
