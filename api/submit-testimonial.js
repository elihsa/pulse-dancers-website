// Testimonial submission handler
// Adds testimonial to Google Sheets with Pending status

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.GOOGLE_SHEETS_ID;

export default async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, area, rating, message, email } = req.body;

    // Validate required fields
    if (!name || !area || !rating || !message || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate rating is a number between 1-5
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Format the row data for Google Sheets
    const timestamp = new Date().toISOString();
    const values = [[
      name,
      ratingNum,
      message,
      area,
      timestamp.split('T')[0], // Date only (YYYY-MM-DD)
      email,
      'Pending' // Status starts as Pending - must be manually approved
    ]];

    // Append to Google Sheets "Testimonials" sheet
    const sheetName = 'Testimonials';
    const range = `${sheetName}!A1`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

    const fetchResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: values
      })
    });

    if (!fetchResponse.ok) {
      const error = await fetchResponse.text();
      console.error('Google Sheets API Error:', error);
      return res.status(500).json({ error: 'Failed to save testimonial' });
    }

    res.status(200).json({ 
      success: true,
      message: 'Thank you for your testimonial! We appreciate your feedback and will review it shortly.'
    });

  } catch (error) {
    console.error('Testimonial submission error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
