// Form submission handler for join.html
// This endpoint receives form submissions and stores them in Google Sheets

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.GOOGLE_SHEETS_JOIN_FORM_ID;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@pulsedancers.com';

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
    const { firstName, lastName, birthMonth, birthDay, birthYear, streetAddress, city, email, phone, danceExperience, promoExperience, transport, gymLocation, otherWork, skills, preference } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format preference as comma-separated values
    const preferences = Array.isArray(preference) ? preference.join(', ') : preference || 'Not specified';

    // Format the row data for Google Sheets
    const timestamp = new Date().toISOString();
    const values = [[
      timestamp,
      firstName,
      lastName,
      `${birthMonth}/${birthDay}/${birthYear}`,
      streetAddress,
      city,
      email,
      phone,
      preferences,
      danceExperience || 'Not answered',
      promoExperience || 'Not answered',
      transport || 'Not answered',
      gymLocation || 'Not specified',
      otherWork || 'Not specified',
      skills || 'Not specified',
      'Pending' // Status column for approval
    ]];

    // Append to Google Sheets
    const sheetName = 'Responses';
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
      return res.status(500).json({ error: 'Failed to save form submission' });
    }

    // Send confirmation email (optional - requires email service setup)
    // For now, we'll just return success

    res.status(200).json({ 
      success: true,
      message: 'Application submitted successfully. We will review your submission within 5 business days.'
    });

  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
