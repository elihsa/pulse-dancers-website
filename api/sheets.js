const API_KEY = 'AIzaSyBqmw5wBmz54vV7AUvH91UNqW6_gDLwrmw';
const SHEET_ID = '1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4';

export default async (req, res) => {
  const { sheetName = 'PRICES', startRow = 1, endRow = 20 } = req.query;
  
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!A${startRow}:Z${endRow}?key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Sheets API] Error fetching ${sheetName}: ${response.status} - ${errorText}`);
      
      // Parse error for better messages
      let helpfulMessage = 'Failed to fetch from Google Sheets';
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          helpfulMessage = errorData.error.message;
        }
      } catch (e) {
        // If we can't parse JSON, use the raw text
        helpfulMessage = errorText;
      }
      
      return res.status(response.status).json({ 
        error: 'Failed to fetch from Google Sheets',
        details: helpfulMessage,
        sheetName: sheetName,
        status: response.status,
        help: response.status === 400 
          ? `The "${sheetName}" tab may not exist or is misspelled. Tab names are case-sensitive.`
          : response.status === 403
          ? 'The Google Sheet may not be public. Go to Share > Anyone with the link can view.'
          : 'Check that the Sheet ID and API key are correct.'
      });
    }
    
    const data = await response.json();
    
    // Filter testimonials to only show approved ones
    if (sheetName === 'TESTIMONIALS' && data.values) {
      // Keep header row (index 0) and filter rows where status (column G, index 6) is 'Approved'
      const headerRow = data.values[0];
      const statusColumnIndex = 6; // Column G is index 6 (0-based)
      
      const filteredRows = data.values.filter((row, index) => {
        // Always include header row
        if (index === 0) return true;
        // Include rows where status column contains 'Approved'
        return row[statusColumnIndex]?.includes('Approved') || row[statusColumnIndex] === 'Approved';
      });
      
      data.values = filteredRows;
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('[Sheets API] Endpoint error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      sheetName: sheetName,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      help: 'Check the server logs for more details. Visit /test-cms.html to diagnose issues.'
    });
  }
};
