// assets/js/sheets-cms.js

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
      // Use the serverless API endpoint instead of direct Google Sheets API
      const url = `/api/sheets?sheetName=${sheetName}&startRow=${startRow}&endRow=${endRow}`;
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
    // Check if first row is a header row
    const hasHeader = rows[0]?.[0]?.toLowerCase().includes('service') || rows[0]?.[0]?.toLowerCase().includes('id');
    const startIdx = hasHeader ? 1 : 0;
    
    return rows
      .slice(startIdx)
      .map((row) => {
        // Handle both formats:
        // Format 1: Service, Price, Duration, Description (4 columns)
        // Format 2: ID, Service, Price, Duration, Description (5 columns)
        const hasId = rows[0]?.length > 4;
        if (hasId) {
          return {
            id: row[0],
            name: row[1],
            price: parseFloat(row[2]) || 0,
            duration: row[3],
            description: row[4] || '',
          };
        } else {
          return {
            name: row[0],
            price: parseFloat(row[1]) || 0,
            duration: row[2],
            description: row[3] || '',
          };
        }
      })
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
      answer: row[1],      }))
      .filter((f) => f.question);
  },

  async getDancers() {
    const rows = await this.fetchSheet(SHEET_NAMES.DANCERS, 1, 30);
    // Check if first row is a header
    const hasHeader = rows[0]?.[0]?.toLowerCase() === 'name' || rows[0]?.[0]?.toLowerCase() === 'id';
    const startIdx = hasHeader ? 1 : 0;
    
    return rows
      .slice(startIdx)
      .map((row) => {
        // Handle format: Name | Bio | Specialties | Photo | Active
        return {
          name: row[0],
          bio: row[1] || '',
          specialties: row[2] || '',
          image: row[3] || 'assets/images/performers/placeholder.jpg',
          active: row[4],
          // Keep legacy fields for compatibility
          description: row[1] || '', // bio as description
          genres: row[2] || '', // specialties as genres
        };
      })
      .filter((d) => d.name && d.active !== 'FALSE');
  },

  async getTestimonials() {
    const rows = await this.fetchSheet(SHEET_NAMES.TESTIMONIALS, 1, 20);
    const startIdx = rows[0]?.[0] === 'ID' ? 1 : 0;
    return rows
      .slice(startIdx)
		      .filter((row) => row[6] === 'Approved') // Only show approved testimonials (column G, index 6)
      .map((row) => ({
        name: row[0],
        rating: parseInt(row[1]) || 5,
        text: row[2],
        area: row[3],
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

      async getSocial() {
                const rows = await this.fetchSheet(SHEET_NAMES.SOCIAL, 1, 10);
                const result = {};
                rows.forEach((row, index) => {
                              if (row[0] && row[1]) {
                                                result[row[0].toLowerCase().replace(/\s+/g, '_')] = row[1];
                                            }
                          });
                return result;
            },
  
	async getServices() {
		const rows = await this.fetchSheet(SHEET_NAMES.SERVICES, 1, 20);
		const result = {};
		rows.forEach((row, index) => {
			if (row[0] && row[1]) {
				result[row[0].toLowerCase().replace(/\s+/g, '_')] = row[1];
			}
		});
		return result;
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
 
 // Handle both full path and filename
 const imageUrl = dancer.image.includes('assets/') ? dancer.image : `assets/images/performers/${dancer.image}`;
 
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
 
 const specialties = document.createElement('p');
 specialties.className = 'dancer-specialties';
 specialties.textContent = dancer.specialties || dancer.genres || '';
 specialties.style.cssText = 'margin: 0 0 0.5rem 0; color: #E5E5E5;';
 
 const bio = document.createElement('p');
 bio.className = 'dancer-bio';
 bio.textContent = dancer.bio || dancer.description || '';
 bio.style.cssText = 'margin: 0; color: #E5E5E5; font-size: 0.9rem; line-height: 1.5;';
 
 content.appendChild(name);
 content.appendChild(specialties);
 content.appendChild(bio);
 
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
