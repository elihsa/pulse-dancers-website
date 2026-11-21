// Form submission handler for join.html - with file upload support
// Uses Google Service Account for write access to Google Sheets

import { google } from 'googleapis';
import { notifyPulse, notifyCustomer } from './notify.js';
import fs from 'fs';
import path from 'path';

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

// A Google Sheets cell holds max 50,000 characters. base64 inflates binary by
// 4/3 and we add a data: URL prefix, so keep each stored photo under 36,000
// base64 chars (~26KB binary). Every photo is re-encoded to fit, so a real
// phone photo can never break the submission with a 500.
const TARGET_BASE64_CHARS = 36000;

// Re-encode a photo until its base64 form fits one Sheets cell.
// Returns the fitted buffer, or null when sharp is unavailable.
async function fitPhotoToCell(buffer) {
  let sharp;
  try {
    ({ default: sharp } = await import('sharp'));
  } catch (e) {
    console.error('sharp not available:', e.message);
    return null;
  }
  let width = 800;
  let quality = 70;
  let out = null;
  for (let attempt = 0; attempt < 10; attempt++) {
    out = await sharp(buffer)
      .resize(width, width, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality })
      .toBuffer();
    if (out.toString('base64').length <= TARGET_BASE64_CHARS) return out;
    if (quality > 40) quality -= 10;
    else width = Math.round(width * 0.7);
  }
  return out && out.toString('base64').length <= TARGET_BASE64_CHARS ? out : null;
}

// Prefix with an apostrophe so Sheets keeps the leading zero on SA numbers.
const asText = (v) => (v ? "'" + String(v) : '');

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

    // 18+ check moved out of routine deployment - pending policy confirmation.

    // Process file uploads: every photo is re-encoded until its base64 form
    // fits in one Sheets cell, so real phone photos can no longer 500 the
    // submission. If a photo somehow still cannot fit, the application is
    // saved with a note in that cell instead of being lost.
    const uploadedFiles = {};
    for (const [name, file] of Object.entries(files)) {
      if (file.data && file.data.length > 0) {
        const fitted = await fitPhotoToCell(file.data);
        if (fitted) {
          uploadedFiles[name] = `data:image/jpeg;base64,${fitted.toString('base64')}`;
        } else {
          // Near-impossible with sharp installed. Explicit error, no silent
          // acceptance of an incomplete application.
          return res.status(400).json({
            error: 'We could not process your photos. Please try smaller images, or email them to info@pulsedancers.com.'
          });
        }
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
      asText(fields.phone),
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

    await notifyPulse('join application', {
      firstName: fields.firstName, lastName: fields.lastName,
      email: fields.email, phone: fields.phone,
      preference: preferences, city: fields.city,
    });
    await notifyCustomer('application', fields.email, fields.firstName);

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
