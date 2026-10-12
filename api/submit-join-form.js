1|// Form submission handler for join.html - with file upload support
2|// Uses Google Service Account for write access to Google Sheets
3|
4|const { google } = require('googleapis');
5|const fs = require('fs');
6|const path = require('path');
7|
8|// Load service account credentials from environment
9|const getServiceAccountAuth = () => {
10|  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
11|  if (!serviceAccountJson) {
12|    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set in environment');
13|  }
12|  const credentials = JSON.parse(serviceAccountJson);
14|  return new google.auth.GoogleAuth({
15|    credentials,
16|    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
17|  });
18|};
19|
20|const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4';
21|
22|// Maximum image size after resizing (200KB)
23|const MAX_IMAGE_SIZE = 200 * 1024;
24|
25|export default async (req, res) => {
26|  // Handle CORS
27|  res.setHeader('Access-Control-Allow-Credentials', 'true');
28|  res.setHeader('Access-Control-Allow-Origin', '*');
29|  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
30|  res.setHeader(
31|    'Access-Control-Allow-Headers',
31|    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
32|  );
33|
34|  if (req.method === 'OPTIONS') {
35|    res.status(200).end();
36|    return;
37|  }
38|
38|  if (req.method !== 'POST') {
39|    return res.status(405).json({ error: 'Method not allowed' });
40|  }
41|
42|  try {
43|    const auth = getServiceAccountAuth();
44|    const sheets = google.sheets({ version: 'v4', auth });
45|
46|    // Parse multipart form data
47|    const contentType = req.headers['content-type'] || '';
47|    if (!contentType.includes('multipart/form-data')) {
48|      return res.status(400).json({ error: 'Expected multipart/form-data' });
48|    }
49|
50|    // Simple multipart parser for Vercel
50|    const boundary = contentType.split('boundary=')[1];
51|    if (!boundary) {
52|      return res.status(400).json({ error: 'Missing boundary' });
52|    }
52|
53|    const chunks = [];
54|    for await (const chunk of req) {
55|      chunks.push(chunk);
56|    }
57|    const body = Buffer.concat(chunks);
57|
58|    const fields = {};
59|    const files = {};
60|    const boundaryBuffer = Buffer.from(`--${boundary}`);
61|    const endBoundaryBuffer = Buffer.from(`--${boundary}--`);
62|
63|    let pos = 0;
64|    while (pos < body.length) {
65|      const nextBoundary = body.indexOf(boundaryBuffer, pos);
65|      if (nextBoundary === -1) break;
66|      const partStart = nextBoundary + boundaryBuffer.length + 2; // skip \r\n
67|      const partEnd = body.indexOf(Buffer.from('\r\n--'), partStart);
67|      if (partEnd === -1) break;
68|
68|      const part = body.slice(partStart, partEnd);
69|      const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'));
69|      if (headerEnd === -1) continue;
70|
70|      const headers = part.slice(0, headerEnd).toString();
71|      const content = part.slice(headerEnd + 4);
71|
72|      const nameMatch = headers.match(/name="([^"]+)"/);
73|      if (!nameMatch) continue;
73|      const name = nameMatch[1];
73|
74|      const filenameMatch = headers.match(/filename="([^"]+)"/);
74|      if (filenameMatch) {
75|        // It's a file
75|        const filename = filenameMatch[1];
76|        const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]+)/);
76|        files[name] = {
77|          filename,
77|          contentType: contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream',
78|          data: content
78|        };
78|      } else {
79|        // It's a field
79|        fields[name] = content.toString('utf8');
79|      }
79|      pos = partEnd;
79|    }
79|
80|    // Validate required fields
80|    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
81|    for (const field of requiredFields) {
81|      if (!fields[field]) {
82|        return res.status(400).json({ error: `Missing required field: ${field}` });
82|      }
82|    }
82|
83|    // Process file uploads (resize if needed)
83|    const uploadedFiles = {};
84|    for (const [name, file] of Object.entries(files)) {
84|      if (file.data && file.data.length > 0) {
85|        // Convert to base64 for storage in sheet (or upload to Cloud Storage)
85|        // For now, store as base64 data URL in sheet
85|        let fileData = file.data;
85|        if (fileData.length > MAX_IMAGE_SIZE) {
85|          // Resize using Sharp if available, or reject
85|          try {
85|            const sharp = require('sharp');
85|            fileData = await sharp(fileData)
85|              .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
85|              .jpeg({ quality: 80 })
85|              .toBuffer();
85|          } catch (e) {
85|            // Sharp not available, skip resize
85|            console.warn('Sharp not available, accepting large file');
85|          }
85|        }
85|        const base64 = fileData.toString('base64');
85|        uploadedFiles[name] = `data:${file.contentType};base64,${base64}`;
85|      }
85|    }
85|
86|    // Format preference as comma-separated
86|    const preferences = fields.preference 
86|      ? (Array.isArray(fields.preference) ? fields.preference.join(', ') : fields.preference)
86|      : 'Not specified';
86|
87|    // Prepare row data for JOIN_APPLICATIONS tab
87|    const timestamp = new Date().toISOString();
87|    const rowData = [
87|      timestamp,
87|      fields.firstName,
87|      fields.lastName,
87|      fields.birthMonth || '',
87|      fields.birthDay || '',
87|      fields.birthYear || '',
87|      fields.streetAddress || '',
87|      fields.city || '',
87|      fields.email,
87|      fields.phone,
87|      preferences,
87|      fields.danceExperience || 'Not answered',
87|      fields.promoExperience || 'Not answered',
87|      fields.transport || 'Not answered',
87|      fields.gymLocation || 'Not specified',
87|      fields.otherWork || 'Not specified',
87|      fields.skills || 'Not specified',
87|      uploadedFiles['fullBodyShot'] || '',
87|      uploadedFiles['fullFacePhoto'] || '',
87|      'Pending' // Status
87|    ];
87|
88|    // Append to Google Sheets JOIN_APPLICATIONS tab
88|    const sheetName = 'JOIN_APPLICATIONS';
88|    const range = `${sheetName}!A1`;
88|    const rangeEncoded = encodeURIComponent(range);
88|
89|    await sheets.spreadsheets.values.append({
89|      spreadsheetId: SHEET_ID,
89|      range: rangeEncoded,
89|      valueInputOption: 'USER_ENTERED',
89|      insertDataOption: 'INSERT_ROWS',
89|      requestBody: { values: [rowData] }
89|    });
89|
90|    res.status(200).json({
90|      success: true,
90|      message: 'Application submitted successfully. We will review your submission within 5 business days.'
90|    });
90|
91|  } catch (error) {
91|    console.error('Form submission error:', error);
92|    res.status(500).json({ 
93|      error: 'Internal server error', 
93|      message: error.message,
93|      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
93|    });
93|  }
94|};
94|