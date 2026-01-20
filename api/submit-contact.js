// Contact form submission handler
// This endpoint receives contact form submissions and stores them in Google Sheets

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.GOOGLE_SHEET_ID || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;

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

  // Check for required environment variables
  if (!API_KEY || !SHEET_ID) {
    console.error('Missing required environment variables: GOOGLE_SHEETS_API_KEY or GOOGLE_SHEET_ID');
    return res.status(500).json({ 
      error: 'Server configuration error',
      message: 'Google Sheets API is not properly configured. Please contact the administrator.'
    });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Format the row data for Google Sheets
    const timestamp = new Date().toISOString();
    const values = [[
      timestamp,
      name,
      email,
      phone || 'Not provided',
      subject,
      message,
      'Unread' // Status column
    ]];

    // Append to Google Sheets CONTACT_MESSAGES tab
    const sheetName = 'CONTACT_MESSAGES';
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
      return res.status(500).json({ error: 'Failed to save contact message' });
    }

    res.status(200).json({ 
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
