// Contact form submission handler
// Writes contact messages to the Google Sheets CONTACT_MESSAGES tab using the
// service account (API keys are read-only; writes require a service account).

import { google } from 'googleapis';

const getServiceAccountAuth = () => {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set in environment');
  }
  const credentials = JSON.parse(serviceAccountJson);
  return new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

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
      'Unread', // Status column
    ]];

    // Append to Google Sheets CONTACT_MESSAGES tab using the Service Account
    const auth = getServiceAccountAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const range = encodeURIComponent('CONTACT_MESSAGES!A1');
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    // Helpful error if the service account is not configured
    if (error.message && error.message.includes('GOOGLE_SERVICE_ACCOUNT_JSON')) {
      return res.status(500).json({
        error: 'Server not configured for contact messages yet',
        message: 'The contact backend is being finalized. Please email bookings@pulsedancers.com for now.',
      });
    }
    if (error.message && error.message.includes('Unable to parse range')) {
      return res.status(500).json({
        error: 'CONTACT_MESSAGES tab missing',
        message: 'The CONTACT_MESSAGES tab does not exist in the spreadsheet yet.',
      });
    }
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};