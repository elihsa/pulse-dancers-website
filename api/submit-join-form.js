// Form submission handler for join.html - with file upload support
// Uses Google Service Account for write access to Google Sheets

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load service account credentials from environment
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

// Maximum image size after resizing (200KB)
const MAX_IMAGE_SIZE = 200 * 1024;

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
    const auth = getServiceAccountAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Parse multipart form data
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Expected multipart/form-data' });
    }

    // Simple multipart parser for Vercel
    const boundary = contentType.split('boundary=')[1];
    if (!boundary) {
      return res.status(400).json({ error: 'Missing boundary' });
    }

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);

    const fields = {};
    const files = {};
    const boundaryBuffer = Buffer.from(`--${boundary}`);
    const endBoundaryBuffer = Buffer.from(`--${boundary}--`);

    let pos = 0;
    while (pos < body.length) {
      const nextBoundary = body.indexOf(boundaryBuffer, pos);
      if (nextBoundary === -1) break;
      const partStart = nextBoundary + boundaryBuffer.length + 2; // skip \r\n
      const partEnd = body.indexOf(Buffer.from('\r\n--'), partStart);
      if (partEnd === -1) break;

      const part = body.slice(partStart, partEnd);
      const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'));
      if (headerEnd === -1) continue;

      const headers = part.slice(0, headerEnd).toString();
      const content = part.slice(headerEnd + 4);

      const nameMatch = headers.match(/name="([^"]+)"/);
      if (!nameMatch) continue;
      const name = nameMatch[1];

      const filenameMatch = headers.match(/filename="([^"]+)"/);
      if (filenameMatch) {
        // It's a file
        const filename = filenameMatch[1];
        const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]+)/);
        files[name] = {
          filename,
          contentType: contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream',
          data: content
        };
      } else {
        // It's a field
        fields[name] = content.toString('utf8');
      }
      pos = partEnd;
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!fields[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Process file uploads (resize if needed)
    const uploadedFiles = {};
    for (const [name, file] of Object.entries(files)) {
      if (file.data && file.data.length > 0) {
        // Convert to base64 for storage in sheet (or upload to Cloud Storage)
        // For now, store as base64 data URL in sheet
        let fileData = file.data;
        if (fileData.length > MAX_IMAGE_SIZE) {
          // Resize using Sharp if available, or reject
          try {
            const sharp = require('sharp');
            fileData = await sharp(fileData)
              .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 80 })
              .toBuffer();
          } catch (e) {
            // Sharp not available, skip resize
            console.warn('Sharp not available, accepting large file');
          }
        }
        const base64 = fileData.toString('base64');
        uploadedFiles[name] = `data:${file.contentType};base64,${base64}`;
      }
    }

    // Format preference as comma-separated
    const preferences = fields.preference 
      ? (Array.isArray(fields.preference) ? fields.preference.join(', ') : fields.preference)
      : 'Not specified';

    // Prepare row data for JOIN_APPLICATIONS tab
    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,
      fields.firstName,
      fields.lastName,
      fields.birthMonth || '',
      fields.birthDay || '',
      fields.birthYear || '',
      fields.streetAddress || '',
      fields.city || '',
      fields.email,
      fields.phone,
      preferences,
      fields.danceExperience || 'Not answered',
      fields.promoExperience || 'Not answered',
      fields.transport || 'Not answered',
      fields.gymLocation || 'Not specified',
      fields.otherWork || 'Not specified',
      fields.skills || 'Not specified',
      uploadedFiles['fullBodyShot'] || '',
      uploadedFiles['fullFacePhoto'] || '',
      'Pending' // Status
    ];

    // Append to Google Sheets JOIN_APPLICATIONS tab
    const sheetName = 'JOIN_APPLICATIONS';
    const range = `${sheetName}!A1`;
    const rangeEncoded = encodeURIComponent(range);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: rangeEncoded,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [rowData] }
    });

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully. We will review your submission within 5 business days.'
    });

  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
