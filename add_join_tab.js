
const { google } = require('googleapis');

const SHEET_ID = '1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4';
const SERVICE_ACCOUNT_PATH = '/home/eli/Downloads/pulse-dancers-cms-eff98b3a0e8a.json';

const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_PATH,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function addJoinApplicationsTab() {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  
  // Check existing sheets
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const sheets_list = meta.data.sheets.map(s => s.properties.title);
  console.log('Current tabs:', sheets_list.join(', '));
  
  if (sheets_list.includes('JOIN_APPLICATIONS')) {
    console.log('JOIN_APPLICATIONS already exists');
    return;
  }
  
  // Add the tab
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{
        addSheet: {
          properties: {
            title: 'JOIN_APPLICATIONS',
            gridProperties: { frozenRowCount: 1 }
          }
        }
      }]
    }
  });
  console.log('✅ JOIN_APPLICATIONS tab created');
  
  // Get the new sheet ID
  const newMeta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const joinSheet = newMeta.data.sheets.find(s => s.properties.title === 'JOIN_APPLICATIONS');
  const sheetId = joinSheet.properties.sheetId;
  
  // Write headers
  const headers = [
    "Timestamp", "First Name", "Last Name", "Birth Month", "Birth Day", "Birth Year",
    "Street Address", "City", "Email", "Phone", "Preferences",
    "Dance Experience", "Promotional Experience", "Transport",
    "Gym Location", "Other Work", "Skills",
    "Full Body Shot", "Full Face Photo", "Status"
  ];
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'JOIN_APPLICATIONS!A1:S1',
    valueInputOption: 'RAW',
    requestBody: { values: [headers] }
  });
  console.log('✅ Headers written to JOIN_APPLICATIONS');
  
  // Freeze header row
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{
        updateSheetProperties: {
          properties: { sheetId, gridProperties: { frozenRowCount: 1 }},
          fields: 'gridProperties.frozenRowCount'
        }
      }]
    }
  });
  console.log('✅ Header row frozen');
}

addJoinApplicationsTab().catch(console.error);
