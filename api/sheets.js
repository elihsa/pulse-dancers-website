const API_KEY = AIzaSyBqmw5wBmz54vV7AUvH91UNqW6_gDLwrmw'
const SHEET_ID = '1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4';

export default async (req, res) => {
  const { sheetName = 'PRICES', startRow = 1, endRow = 20 } = req.query;
  
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!A${startRow}:Z${endRow}?key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch' });
    }
    
    const data = await response.json();
    
    // Filter testimonials to only show approved ones
    if (sheetName === 'Testimonials' && data.values) {
      // Keep header row (index 0) and filter rows where status (column H, index 7) is 'Approved'
      const headerRow = data.values[0];
      const statusColumnIndex = 7; // Column H is index 7 (0-based)
      
      const filteredRows = data.values.filter((row, index) => {
        // Always include header row
        if (index === 0) return true;
        // Include rows where status column contains 'Approved'
        return row[statusColumnIndex]?.includes('Approved') || row[statusColumnIndex] === 'Approved';
      });
      
      data.values = filteredRows;
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: error.message });
  }
};
