// assets/js/sheets-cms.js
const SHEET_ID = '1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4';
const API_KEY = 'AIzaSyA9nqewwfsfb3lC9OBFFcLi4zRtd8YApLM';

const SHEET_NAMES = {
  HOME: 'HOME',
  PRICES: 'PRICES',
  FAQS: 'FAQS',
  DANCERS: 'DANCERS',
  SERVICES: 'SERVICES',
  TESTIMONIALS: 'TESTIMONIALS',
  SOCIAL: 'SOCIAL',
};

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
};

const PulseSheetsCMS = {
  async fetchSheet(sheetName, startRow = 1, endRow = 1000) {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!A${startRow}:Z${endRow}?key=${API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error(`Error fetching sheet ${sheetName}:`, error);
      return [];
    }
  },

  async getHome() {
    const rows = await this.fetchSheet(SHEET_NAMES.HOME, 1, 10);
    if (rows.length === 0) return {};
    const result = {};
    rows.forEach((row) => {
      if (row[0] && row[1]) result[row[0]] = row[1];
    });
    return result;
  },

  async getPrices() {
    const rows = await this.fetchSheet(SHEET_NAMES.PRICES, 1, 20);
    const startIdx =
      rows[0]?.[0] === 'ID' || rows[0]?.[0]?.toLowerCase().includes('service')
        ? 1
        : 0;
    return rows
      .slice(startIdx)
      .map((row) => ({
        id: row[0],
        name: row[1],
        price: parseFloat(row[2]) || 0,
        duration: row[3],
        description: row[4] || '',
      }))
      .filter((p) => p.name);
  },

  async getFAQs() {
    const rows = await this.fetchSheet(SHEET_NAMES.FAQS, 1, 50);
    const startIdx = rows[0]?.[0] === 'Question' ? 1 : 0;
    return rows
      .slice(startIdx)
      .map((row) => ({
        id: row[0],
        question: row[1],
        answer: row[2],
      }))
      .filter((f) => f.question);
  },

  async getDancers() {
    const rows = await this.fetchSheet(SHEET_NAMES.DANCERS, 1, 30);
    const startIdx = rows[0]?.[0] === 'ID' ? 1 : 0;
    return rows
      .slice(startIdx)
      .map((row) => ({
        id: row[0],
        name: row[1],
        initial: row[2],
        genres: row[3],
        experience: row[4],
        bio: row[5],
        image: row[6] || 'assets/images/performers/placeholder.jpg',
      }))
      .filter((d) => d.name);
  },

  async getTestimonials() {
    const rows = await this.fetchSheet(SHEET_NAMES.TESTIMONIALS, 1, 20);
    const startIdx = rows[0]?.[0] === 'ID' ? 1 : 0;
    return rows
      .slice(startIdx)
      .map((row) => ({
        id: row[0],
        name: row[1],
        text: row[2],
        rating: parseInt(row[3]) || 5,
      }))
      .filter((t) => t.name);
  },

  async getInstagramPosts() {
    const rows = await this.fetchSheet(SHEET_NAMES.SOCIAL, 1, 10);
    const startIdx = rows[0]?.[0] === 'Platform' ? 1 : 0;
    return rows
      .slice(startIdx)
      .filter((row) => row[0] === 'Instagram')
      .map((row) => ({ url: row[1], caption: row[2] || '' }));
  },
};

window.PulseSheetsCMS = PulseSheetsCMS;
console.log('PulseSheetsCMS initialized');
