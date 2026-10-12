// Testimonial submission handler — uses Service Account for write access
// Adds testimonial to Google Sheets with Pending status

const { google } = require('googleapis');

const getServiceAccountAuth = () => {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set in environment');
  }
  const credentials = JSON.parse(serviceAccountJson);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4';

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

    // Append to Google Sheets "TESTIMONIALS" sheet using Service Account
    const auth = getServiceAccountAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const range = encodeURIComponent('TESTIMONIALS!A1');
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for your testimonial! We appreciate your feedback and will review it shortly.',
    });

  } catch (error) {
    console.error('Testimonial submission error:', error);
    // Helpful error if the service account is not configured
    if (error.message && error.message.includes('GOOGLE_SERVICE_ACCOUNT_JSON')) {
      return res.status(500).json({
        error: 'Server not configured for testimonials yet',
        message: 'The testimonial backend is being finalized. Please try again later.',
      });
    }
    res.status(500).json({ error: error.message });
  }
};