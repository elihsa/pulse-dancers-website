/**
 * Pulse Dancers CMS - Google Sheets Integration
 * Sheet ID:  12zPYBbpdDLhqTPylP0oUgPqimy5fXIfg
 * 
 * SECURITY NOTE: The API key below is designed for client-side use with Google Sheets API. 
 * It should have the following restrictions configured in Google Cloud Console: 
 * - Application restrictions: HTTP referrers (set to your domain)
 * - API restrictions:  Restrict to Google Sheets API only
 * This is the standard approach for public read-only spreadsheet data. 
 */
const SHEET_ID = '1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4';
const API_KEY = 'AIzaSyADhHAHqBn8cmg-pDxV2sCnEnRTDrk3IXs';

// Sheet Names - These are the tab names in the Google Sheet
const SHEET_NAMES = {
  HOME: 'HOME',
  PRICES: 'PRICES',
  FAQS: 'FAQS',
  DANCERS: 'DANCERS',
  SERVICES: 'SERVICES',
  TESTIMONIALS: 'TESTIMONIALS',
  SOCIAL: 'SOCIAL'
};

// Utility function to escape HTML and prevent XSS
const escapeHtml = (text) => {
  const div = document. createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
};

const PulseSheetsCMS = {
  async fetchSheet(sheetName, startRow = 1, endRow = 1000) {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!A${startRow}:Z${endRow}?key=${API_KEY}`;
      console.log('📊 Fetching Google Sheet:', { sheetName, url });
      
      const response = await fetch(url);
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response. text();
        console.error('❌ API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Data received:', data);
      
      return data.values || [];
    } catch (error) {
      console.error(`❌ Error fetching sheet ${sheetName}:`, error);
      return [];
    }
  },

  async getHome() {
    const rows = await this.fetchSheet(SHEET_NAMES.HOME, 1, 10);
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
    console.log('💰 Loading prices from Google Sheets...');
    const rows = await this.fetchSheet(SHEET_NAMES.PRICES, 1, 20);
    console.log(`📋 Raw price rows: `, rows);
    
    if (rows.length === 0) {
      console.warn('⚠️ No price data returned');
      return [];
    }
    
    const startIdx = rows[0][0] === 'ID' || rows[0][0]?.toLowerCase().includes('service') ? 1 : 0;
    
    const prices = rows.slice(startIdx).map((row, index) => {
      console.log(`Processing price row ${index}:`, row);
      return {
        id: row[0],
        name: row[1],
        price: parseFloat(row[2]) || 0,
        duration: row[3],
        description: row[4] || ''
      };
    }).filter(p => p.name);
    
    console.log(`✅ Processed ${prices.length} prices: `, prices);
    return prices;
  },

  async getFAQs() {
    console.log('❓ Loading FAQs from Google Sheets...');
    const rows = await this.fetchSheet(SHEET_NAMES.FAQS, 1, 50);
    console.log(`📋 Raw FAQ rows:`, rows);
    
    if (rows.length === 0) {
      console.warn('⚠️ No FAQ data returned');
      return [];
    }
    
    const startIdx = rows[0][0] === 'ID' ?  1 : 0;
    
    const faqs = rows.slice(startIdx).map((row, index) => {
      console.log(`Processing FAQ row ${index}:`, row);
      return {
        id: row[0],
        question: row[1],
        answer: row[2]
      };
    }).filter(f => f.question);
    
    console.log(`✅ Processed ${faqs.length} FAQs:`, faqs);
    return faqs;
  },

  async getDancers() {
    console.log('💃 Loading dancers from Google Sheets.. .');
    const rows = await this.fetchSheet(SHEET_NAMES.DANCERS, 1, 30);
    console.log(`📋 Raw dancer rows:`, rows);
    
    if (rows.length === 0) {
      console.warn('⚠️ No dancer data returned');
      return [];
    }
    
    const startIdx = rows[0][0] === 'ID' ? 1 : 0;
    
    const dancers = rows.slice(startIdx).map((row, index) => {
      console.log(`Processing dancer row ${index}:`, row);
      return {
        id: row[0],
        name: row[1],
        initial: row[2],
        genres: row[3],
        experience: row[4],
        bio: row[5],
        image: row[6] || 'assets/images/performers/placeholder.jpg'
      };
    }).filter(d => d.name);
    
    console.log(`✅ Processed ${dancers.length} dancers:`, dancers);
    return dancers;
  },

  async getTestimonials() {
    console.log('💬 Loading testimonials from Google Sheets...');
    const rows = await this.fetchSheet(SHEET_NAMES.TESTIMONIALS, 1, 20);
    
    if (rows.length === 0) {
      console.warn('⚠️ No testimonial data returned');
      return [];
    }
    
    const startIdx = rows[0][0] === 'ID' ? 1 : 0;
    
    const testimonials = rows. slice(startIdx).map(row => ({
      id: row[0],
      name: row[1],
      text: row[2],
      rating: parseInt(row[3]) || 5
    })).filter(t => t.name);
    
    console.log(`✅ Processed ${testimonials.length} testimonials`);
    return testimonials;
  },

  async getInstagramPosts() {
    console.log('📸 Loading Instagram posts from Google Sheets...');
    const rows = await this.fetchSheet(SHEET_NAMES. SOCIAL, 1, 10);
    
    if (rows.length === 0) {
      console.warn('⚠️ No Instagram data returned');
      return [];
    }
    
    const startIdx = rows[0][0] === 'Platform' ? 1 : 0;
    
    const posts = rows.slice(startIdx)
      .filter(row => row[0] === 'Instagram')
      .map(row => ({
        url: row[1],
        caption: row[2] || ''
      }));
    
    console.log(`✅ Processed ${posts. length} Instagram posts`);
    return posts;
  }
};

// Make globally available
window.PulseSheetsCMS = PulseSheetsCMS;
console.log('✅ PulseSheetsCMS initialized and available globally');
