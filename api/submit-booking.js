// Booking form submission handler
// Writes booking requests to the Google Sheets "BOOKINGS" tab using the service account.
//
// Required environment variable:
//   GOOGLE_SERVICE_ACCOUNT_JSON - full service account JSON (one line)
//   GOOGLE_SHEET_ID            - the spreadsheet ID (falls back to the default below)
//
// The sheet must contain a "BOOKINGS" tab. Columns written:
// Timestamp | Name | Phone | Email | EventType | Managing | ManagerName | ManagerPhone |
// ManagerEmail | LocType | Address | Area | DistanceKm | Services | MaleCount | ShowType |
// Race | Costume | FemaleCount | WaiterCount | WaiterHours | ButlerCount | ButlerHours |
// GamesQty | PoleQty | OtherText | Notes | QuotePerformance | QuoteTravel | QuoteTotal | Status

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
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const b = req.body || {};

    // Basic validation
    if (!b.name || !b.email || !b.phone) {
      return res.status(400).json({ error: 'Missing required fields: name, email, phone' });
    }

    const auth = getServiceAccountAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,
      b.name,
      b.phone,
      b.email,
      b.eventType || '',
      b.managing || '',
      b.managerName || '',
      b.managerPhone || '',
      b.managerEmail || '',
      b.locType || '',
      b.address || '',
      b.area || '',
      b.distanceKm != null ? b.distanceKm : '',
      Array.isArray(b.services) ? b.services.join(', ') : (b.services || ''),
      b.maleCount || '',
      b.showType || '',
      b.race || '',
      b.costume || '',
      b.femaleCount || '',
      b.waiterCount || '',
      b.waiterHours || '',
      b.butlerCount || '',
      b.butlerHours || '',
      b.gamesQty || '',
      b.poleQty || '',
      b.otherText || '',
      b.notes || '',
      b.quote?.performance || '',
      b.quote?.travel || '',
      b.quote?.total || '',
      'Pending',
    ];

    const range = encodeURIComponent('BOOKINGS!A1');
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [rowData] },
    });

    res.status(200).json({
      success: true,
      message: 'Thank you! Your booking request has been sent. We will respond within 24 hours.',
    });
  } catch (error) {
    console.error('Booking submission error:', error);
    // Helpful error if the service account is not configured
    if (error.message && error.message.includes('GOOGLE_SERVICE_ACCOUNT_JSON')) {
      return res.status(500).json({
        error: 'Server not configured for bookings yet',
        message: 'The booking backend is being finalized. Please email bookings@pulsedancers.com for now.',
      });
    }
    if (error.message && error.message.includes('Unable to parse range')) {
      return res.status(500).json({
        error: 'BOOKINGS tab missing',
        message: 'The BOOKINGS tab does not exist in the spreadsheet yet.',
      });
    }
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
