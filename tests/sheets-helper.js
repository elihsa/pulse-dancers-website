/**
 * Google Sheets Test Helper
 * Provides utilities for verifying form submissions in Google Sheets
 */

import { google } from 'googleapis';

const SHEET_ID = '1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4';

/**
 * Verify a form submission exists in the specified Google Sheet
 * @param {string} sheetName - Name of the sheet tab (e.g., 'BOOKINGS', 'TESTIMONIALS')
 * @param {string} searchValue - Value to search for (e.g., name, email)
 * @param {number} columnIndex - Column index to search (0-based)
 * @returns {Promise<{verified: boolean, row?: Array, reason?: string}>}
 */
async function verifySheetEntry(sheetName, searchValue, columnIndex = 0) {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) {
    console.warn('GOOGLE_SHEETS_API_KEY not set, skipping sheet verification');
    return { verified: false, reason: 'No API key' };
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth: apiKey });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${sheetName}!A:Z`
    });

    const rows = response.data.values || [];
    for (let i = 1; i < rows.length; i++) { // Skip header row
      if (rows[i][columnIndex] && rows[i][columnIndex].includes(searchValue)) {
        return { verified: true, row: rows[i] };
      }
    }
    return { verified: false, reason: 'Entry not found' };
  } catch (error) {
    return { verified: false, reason: error.message };
  }
}

/**
 * Wait for a sheet entry to appear (handles async propagation)
 * @param {string} sheetName 
 * @param {string} searchValue 
 * @param {number} maxAttempts 
 * @param {number} delayMs 
 * @returns {Promise<{verified: boolean, row?: Array, reason?: string}>}
 */
async function waitForSheetEntry(sheetName, searchValue, maxAttempts = 12, delayMs = 5000) {
  // Check API key first - if not set, return immediately without retrying
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const hasApiKey = !!apiKey;
  console.log('[SHEETS-HELPER] waitForSheetEntry called, hasApiKey:', hasApiKey);
  if (!hasApiKey) {
    return { verified: false, reason: 'No API key', debug: { hasApiKey, checkedAt: Date.now() } };
  }

  for (let i = 0; i < maxAttempts; i++) {
    const result = await verifySheetEntry(sheetName, searchValue);
    if (result.verified) return result;
    console.log(`  Waiting for ${sheetName} entry (${searchValue})... attempt ${i + 1}/${maxAttempts}`);
    await new Promise(r => setTimeout(r, delayMs));
  }
  return { verified: false, reason: `Timeout after ${maxAttempts} attempts` };
}

/**
 * Verify multiple form submissions across all sheets
 * @returns {Promise<Object>} Summary of all verifications
 */
async function verifyAllFormSubmissions(testData) {
  const results = {
    booking: { verified: false, reason: 'Not tested' },
    testimonial: { verified: false, reason: 'Not tested' },
    contact: { verified: false, reason: 'Not tested' },
    join: { verified: false, reason: 'Not tested' }
  };

  if (testData.booking) {
    results.booking = await waitForSheetEntry('BOOKINGS', testData.booking.name, 1);
  }
  
  if (testData.testimonial) {
    results.testimonial = await waitForSheetEntry('TESTIMONIALS', testData.testimonial.name, 0);
  }
  
  if (testData.contact) {
    results.contact = await waitForSheetEntry('CONTACT_MESSAGES', testData.contact.name, 1);
  }
  
  if (testData.join) {
    results.join = await waitForSheetEntry('JOIN_APPLICATIONS', testData.join.firstName, 1);
  }

  return results;
}

export { verifySheetEntry, waitForSheetEntry, verifyAllFormSubmissions, SHEET_ID };