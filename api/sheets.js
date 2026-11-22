// Public CMS read proxy for the Pulse site.
//
// SECURITY: only the explicitly public CMS tabs listed in PUBLIC_TABS may be
// read through this endpoint. Submission tabs (BOOKINGS, CONTACT_MESSAGES,
// JOIN_APPLICATIONS, and the private fields of TESTIMONIALS) contain personal
// information. They are written by the api/submit-* endpoints through the
// service account and must never be readable here. Any tab not on the list is
// refused with a generic 404 that does not reveal whether the tab exists.

// NOTE: This API key is intentionally hard-coded for now as it's a CLIENT-SIDE API key
// that is meant to be publicly visible (it will be in browser requests anyway).
// The key should be restricted in Google Cloud Console to only allow:
// 1. HTTP referrers (website domains only)
// 2. Google Sheets API only
// 3. Read-only access
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY || "AIzaSyA9nqewwfsfb3lC9OBFFcLi4zRtd8YApLM";
const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4";

// Tabs the public site is allowed to read (used by assets/js/sheets-cms.js,
// assets/js/banner.js and gallery.html). Everything else is private.
const PUBLIC_TABS = new Set([
  'HOME',
  'PRICES',
  'FAQS',
  'DANCERS',
  'SERVICES',
  'TESTIMONIALS',
  'SOCIAL',
  'PAGE_CONTENT',
  'FOOTER',
  'GALLERY',
]);

const MAX_ROWS_PER_REQUEST = 1000;

// TESTIMONIALS column indexes (A=0 ... G=6), matching api/submit-testimonial.js
const TESTIMONIAL_EMAIL_COLUMN = 5; // F: submitter email - never public
const TESTIMONIAL_STATUS_COLUMN = 6; // G: moderation status

export default async (req, res) => {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sheetName = 'PRICES' } = req.query;

  // Containment: only allowlisted public tabs, and only simple tab names.
  if (
    typeof sheetName !== 'string' ||
    !/^[A-Z0-9_]+$/.test(sheetName) ||
    !PUBLIC_TABS.has(sheetName)
  ) {
    return res.status(404).json({ error: 'Not found' });
  }

  // Validate and clamp the row window.
  let startRow = parseInt(req.query.startRow, 10);
  let endRow = parseInt(req.query.endRow, 10);
  if (!Number.isFinite(startRow) || startRow < 1) startRow = 1;
  if (!Number.isFinite(endRow) || endRow < startRow) endRow = startRow;
  if (endRow - startRow + 1 > MAX_ROWS_PER_REQUEST) {
    endRow = startRow + MAX_ROWS_PER_REQUEST - 1;
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

      // Detect if the API key is invalid
      const isInvalidKey = helpfulMessage.includes('API key not valid') ||
                          helpfulMessage.includes('API key invalid') ||
                          response.status === 400 && helpfulMessage.includes('key');

      return res.status(response.status).json({
        error: 'Failed to fetch from Google Sheets',
        details: helpfulMessage,
        sheetName: sheetName,
        status: response.status,
        help: isInvalidKey
          ? '🚨 CRITICAL: The Google Sheets API key is INVALID. See API-KEY-SETUP-GUIDE.md for instructions on getting a valid key. The CMS cannot work without a valid API key.'
          : response.status === 400
          ? `The "${sheetName}" tab may not exist or is misspelled. Tab names are case-sensitive.`
          : response.status === 403
          ? 'The Google Sheet may not be public. Go to Share > Anyone with the link can view.'
          : 'Check that the Sheet ID and API key are correct. See API-KEY-SETUP-GUIDE.md for setup instructions.'
      });
    }

    const data = await response.json();

    // TESTIMONIALS: return only approved rows and never expose the submitter
    // email column. A row is kept as the header only when it is the first row
    // of the sheet AND its status cell is the literal "Status" label, so a
    // pending row can never slip through as a fake header (previously the
    // first returned row was kept unconditionally).
    if (sheetName === 'TESTIMONIALS' && data.values) {
      data.values = data.values
        .filter((row, index) => {
          const status = (row[TESTIMONIAL_STATUS_COLUMN] || '').toString().trim().toLowerCase();
          const isRealHeader = index === 0 && startRow === 1 && status === 'status';
          return isRealHeader || status === 'approved';
        })
        .map((row, index) => {
          if (index === 0 && (row[TESTIMONIAL_STATUS_COLUMN] || '').toString().trim().toLowerCase() === 'status') {
            return row; // header row, no personal data
          }
          const safe = [...row];
          safe[TESTIMONIAL_EMAIL_COLUMN] = '';
          return safe;
        });
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
