65
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
    const startIdx = rows[0]?.[0] === 'Questions' ? 1 : 0;
    return rows
      .slice(startIdx)
      .map((row) => ({
        id: row[0],
        question: row[0],
        answer: row[21,
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
 city: row[5],
 description: row[6],
 image: row[7] || 'assets/images/performers/placeholder.jpg',
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
   loadDancers(containerId) {
 const container = document.getElementById(containerId);
 if (!container) return;
 
 this.getDancers().then(dancers => {
 if (!dancers || dancers.length === 0) {
 container.innerHTML = '<p style="color: #b0b0b0; padding: 2rem; text-align: center;">No performer profiles available at this time.</p>';
 return;
 }
 
 container.innerHTML = '';
 
 dancers.forEach(dancer => {
 const card = document.createElement('div');
 card.className = 'dancer-card';
 card.style.cssText = 'background-color: #1a1a1f; border-radius: 8px; overflow: hidden; padding: 1rem; border: 1px solid rgba(255, 45, 85, 0.1);';
 
 const imageUrl = dancer.image ? `assets/images/performers/${dancer.image}` : 'assets/images/performers/placeholder.jpg';
 
 const img = document.createElement('img');
 img.src = imageUrl;
 img.alt = dancer.name || 'Dancer';
 img.style.cssText = 'width: 100%; height: auto; border-radius: 4px; margin-bottom: 1rem; display: block;';
 img.onerror = function() {
 this.src = 'assets/images/performers/placeholder.jpg';
 };
 
 const content = document.createElement('div');
 content.className = 'dancer-info';
 
 const name = document.createElement('h3');
 name.textContent = dancer.name || '';
 name.style.cssText = 'margin: 0 0 0.5rem 0; color: #FF2D55;';
 
 const initial = document.createElement('p');
 initial.className = 'dancer-initial';
 initial.textContent = dancer.initial || '';
 initial.style.cssText = 'margin: 0 0 0.5rem 0; color: #b0b0b0; font-weight: bold;';
 
 const genres = document.createElement('p');
 genres.className = 'dancer-genres';
 genres.textContent = dancer.genres || '';
 genres.style.cssText = 'margin: 0 0 0.5rem 0; color: #E5E5E5;';
 
 const experience = document.createElement('p');
 experience.className = 'dancer-experience';
 experience.textContent = `Experience: ${dancer.experience || 'N/A'}`;
 experience.style.cssText = 'margin: 0 0 0.5rem 0; color: #E5E5E5; font-size: 0.9rem;';
 
 const city = document.createElement('p');
 city.className = 'dancer-city';
 city.textContent = `Based in: ${dancer.city || 'N/A'}`;
 city.style.cssText = 'margin: 0 0 0.5rem 0; color: #E5E5E5; font-size: 0.9rem;';
 
 const description = document.createElement('p');
 description.className = 'dancer-description';
 description.textContent = dancer.description || '';
 description.style.cssText = 'margin: 0; color: #E5E5E5; font-size: 0.9rem; line-height: 1.5;';
 
 content.appendChild(name);
 content.appendChild(initial);
 content.appendChild(genres);
 content.appendChild(experience);
 content.appendChild(city);
 content.appendChild(description);
 
 card.appendChild(img);
 card.appendChild(content);
 container.appendChild(card);
 });
 }).catch(error => {
 console.error('Error loading dancers:', error);
 container.innerHTML = '<p style="color: #b0b0b0; padding: 2rem; text-align: center;">Unable to load performers. Please contact us for more information.</p>';
 });
 },
};

window.PulseSheetsCMS = PulseSheetsCMS;
console.log('PulseSheetsCMS initialized');
