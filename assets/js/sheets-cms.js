/**
 * Pulse Dancers CMS - Google Sheets Integration
 * Sheet ID: 12zPYBbpdDLhqTPylP0oUgPqimy5fXIfg
 */

const SHEET_ID = '12zPYBbpdDLhqTPylP0oUgPqimy5fXIfg';
const API_KEY = 'AIzaSyDmIhz0iWcB8R-BBXkFFGi36bCQIm7fgA8';

const PulseSheetsCMS = {
  async fetchSheet(sheetName, startRow = 1, endRow = 1000) {
    try {
      const range = encodeURIComponent(`${sheetName}!A${startRow}:Z${endRow}`);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error(`Error fetching sheet ${sheetName}:`, error);
      return [];
    }
  },

  async getPrices() {
    const rows = await this.fetchSheet('Prices', 1, 10);
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
    const rows = await this.fetchSheet('Dancers', 1, 20);
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

  async getFAQs() {
    const rows = await this.fetchSheet('FAQs', 1, 20);
    if (rows.length === 0) return [];
    const startIdx = rows[0][0] === 'ID' ? 1 : 0;
    return rows.slice(startIdx).map(row => ({
      id: row[0],
      question: row[1],
      answer: row[2]
    })).filter(f => f.question);
  },

  async loadPrices(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const prices = await this.getPrices();
    if (prices.length === 0) { container.innerHTML = '<p>Loading...</p>'; return; }
    container.innerHTML = prices.map(p => `<div class="price-card"><h3>${p.name}</h3><p>R${p.price}</p><p>${p.duration}</p></div>`).join('');
  },

  async loadServices(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const prices = await this.getPrices();
    if (prices.length === 0) return;
    container.innerHTML = prices.map(p => `<label><input type="checkbox" name="service-type" value="${p.name}" data-price="${p.price}" onchange="window.BookingForm?.updateQuote?.()"><span>${p.name} (R${p.price})</span></label>`).join('');
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
  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = PulseSheetsCMS; }
