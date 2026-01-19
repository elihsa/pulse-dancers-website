#!/usr/bin/env node

/**
 * Comprehensive CMS Test Suite
 * 
 * This script performs thorough testing of the Google Sheets CMS integration.
 * Run this script to verify that the CMS is properly configured and working.
 * 
 * Usage: node test-cms-complete.js
 */

const SHEET_ID = '1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4';
const API_KEY = 'AIzaSyBqmw5wBmz54vV7AUvH91UNqW6_gDLwrmw';

const SHEET_NAMES = [
  'HOME',
  'PRICES',
  'FAQS',
  'DANCERS',
  'SERVICES',
  'TESTIMONIALS',
  'SOCIAL',
  'PAGE_CONTENT',
  'FOOTER'
];

const REQUIRED_COLUMNS = {
  'HOME': ['Field', 'Value'],
  'PRICES': ['Service', 'Price', 'Duration', 'Description'],
  'FAQS': ['Question', 'Answer'],
  'DANCERS': ['Name', 'Bio', 'Specialties', 'Photo', 'Active'],
  'SERVICES': ['Service', 'Price'],
  'TESTIMONIALS': ['Name', 'Rating', 'Text', 'Area'],
  'SOCIAL': ['Platform', 'URL'],
  'PAGE_CONTENT': ['Page', 'Key', 'Value'],
  'FOOTER': ['Field', 'Value']
};

let testResults = [];
let criticalErrors = [];
let warnings = [];

function logTest(category, name, status, message = '') {
  const statusSymbol = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${statusSymbol} [${category}] ${name}${message ? ': ' + message : ''}`);
  
  testResults.push({ category, name, status, message });
  
  if (status === 'FAIL') {
    criticalErrors.push({ category, name, message });
  } else if (status === 'WARN') {
    warnings.push({ category, name, message });
  }
}

async function testAPIKey() {
  console.log('\n🔑 Testing API Key...\n');
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/HOME!A1:B1?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      logTest('API', 'API Key Validation', 'PASS', 'Key is valid and working');
      return true;
    } else {
      const errorMsg = data.error?.message || 'Unknown error';
      
      if (errorMsg.includes('API key not valid')) {
        logTest('API', 'API Key Validation', 'FAIL', 'API key is INVALID - see API-KEY-SETUP-GUIDE.md');
        criticalErrors.push({
          category: 'CRITICAL',
          name: 'Invalid API Key',
          message: 'The Google Sheets API key is invalid. CMS cannot work without a valid key. See API-KEY-SETUP-GUIDE.md for setup instructions.'
        });
      } else if (response.status === 403) {
        logTest('API', 'API Key Validation', 'FAIL', 'Permission denied - sheet may not be public');
      } else {
        logTest('API', 'API Key Validation', 'FAIL', errorMsg);
      }
      return false;
    }
  } catch (error) {
    logTest('API', 'API Key Validation', 'FAIL', `Network error: ${error.message}`);
    return false;
  }
}

async function testSheetAccess() {
  console.log('\n📊 Testing Sheet Access...\n');
  
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;
  logTest('Sheet', 'Sheet ID', 'INFO', url);
  
  // Test if we can access the sheet metadata
  try {
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}`;
    const response = await fetch(metadataUrl);
    const data = await response.json();
    
    if (response.ok) {
      logTest('Sheet', 'Sheet Accessibility', 'PASS', `Title: "${data.properties?.title}"`);
      
      // Check which tabs exist
      const existingSheets = data.sheets?.map(s => s.properties.title) || [];
      const missingSheets = SHEET_NAMES.filter(name => !existingSheets.includes(name));
      const extraSheets = existingSheets.filter(name => !SHEET_NAMES.includes(name));
      
      if (missingSheets.length === 0) {
        logTest('Sheet', 'Required Tabs', 'PASS', 'All 9 required tabs exist');
      } else {
        logTest('Sheet', 'Required Tabs', 'FAIL', `Missing tabs: ${missingSheets.join(', ')}`);
      }
      
      if (extraSheets.length > 0) {
        logTest('Sheet', 'Extra Tabs', 'INFO', `Extra tabs found: ${extraSheets.join(', ')}`);
      }
      
      return true;
    } else {
      logTest('Sheet', 'Sheet Accessibility', 'FAIL', data.error?.message || 'Cannot access sheet');
      return false;
    }
  } catch (error) {
    logTest('Sheet', 'Sheet Accessibility', 'FAIL', error.message);
    return false;
  }
}

async function testSheetData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!A1:Z100?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      const rowCount = data.values ? data.values.length : 0;
      
      if (rowCount === 0) {
        logTest('Data', `${sheetName} Sheet`, 'WARN', 'Sheet exists but is empty');
        return { status: 'WARN', rows: 0, hasData: false };
      } else if (rowCount === 1) {
        logTest('Data', `${sheetName} Sheet`, 'WARN', 'Only header row exists, no data');
        return { status: 'WARN', rows: 1, hasData: false };
      } else {
        logTest('Data', `${sheetName} Sheet`, 'PASS', `${rowCount} rows (including header)`);
        
        // Validate column structure
        if (REQUIRED_COLUMNS[sheetName]) {
          const headerRow = data.values[0];
          const requiredCols = REQUIRED_COLUMNS[sheetName];
          const hasCorrectHeaders = requiredCols.every((col, idx) => 
            headerRow[idx]?.toLowerCase().includes(col.toLowerCase())
          );
          
          if (!hasCorrectHeaders) {
            logTest('Data', `${sheetName} Columns`, 'WARN', 
              `Expected columns: [${requiredCols.join(', ')}], got: [${headerRow.join(', ')}]`);
          }
        }
        
        return { status: 'PASS', rows: rowCount, hasData: true, data: data.values };
      }
    } else {
      const errorMsg = data.error?.message || 'Unknown error';
      logTest('Data', `${sheetName} Sheet`, 'FAIL', errorMsg);
      return { status: 'FAIL', error: errorMsg };
    }
  } catch (error) {
    logTest('Data', `${sheetName} Sheet`, 'FAIL', error.message);
    return { status: 'FAIL', error: error.message };
  }
}

async function testAllSheets() {
  console.log('\n📋 Testing All Sheet Data...\n');
  
  const results = {};
  
  for (const sheetName of SHEET_NAMES) {
    const result = await testSheetData(sheetName);
    results[sheetName] = result;
  }
  
  return results;
}

async function testSpecificContent() {
  console.log('\n🔍 Testing Specific Content Requirements...\n');
  
  // Test TESTIMONIALS approval filter
  const testimonialsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/TESTIMONIALS!A1:G100?key=${API_KEY}`;
  try {
    const response = await fetch(testimonialsUrl);
    const data = await response.json();
    
    if (response.ok && data.values && data.values.length > 1) {
      const approvedCount = data.values.slice(1).filter(row => row[6] === 'Approved').length;
      const totalCount = data.values.length - 1;
      
      if (approvedCount > 0) {
        logTest('Content', 'TESTIMONIALS Approved', 'PASS', 
          `${approvedCount} of ${totalCount} testimonials are approved`);
      } else {
        logTest('Content', 'TESTIMONIALS Approved', 'WARN', 
          'No approved testimonials (column G should be "Approved")');
      }
    }
  } catch (error) {
    logTest('Content', 'TESTIMONIALS Approved', 'WARN', 'Could not verify');
  }
  
  // Test DANCERS active filter
  const dancersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/DANCERS!A1:E100?key=${API_KEY}`;
  try {
    const response = await fetch(dancersUrl);
    const data = await response.json();
    
    if (response.ok && data.values && data.values.length > 1) {
      const activeCount = data.values.slice(1).filter(row => row[4] !== 'FALSE').length;
      const totalCount = data.values.length - 1;
      
      if (activeCount > 0) {
        logTest('Content', 'DANCERS Active', 'PASS', 
          `${activeCount} of ${totalCount} dancers are active`);
      } else {
        logTest('Content', 'DANCERS Active', 'WARN', 
          'No active dancers (column E should not be "FALSE")');
      }
    }
  } catch (error) {
    logTest('Content', 'DANCERS Active', 'WARN', 'Could not verify');
  }
}

function printSummary() {
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));
  
  const passed = testResults.filter(r => r.status === 'PASS').length;
  const failed = testResults.filter(r => r.status === 'FAIL').length;
  const warned = testResults.filter(r => r.status === 'WARN').length;
  const total = testResults.length;
  
  console.log(`\n✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${failed}/${total}`);
  console.log(`⚠️  Warnings: ${warned}/${total}`);
  
  if (criticalErrors.length > 0) {
    console.log('\n' + '='.repeat(70));
    console.log('🚨 CRITICAL ERRORS (Must Fix):');
    console.log('='.repeat(70));
    criticalErrors.forEach((err, idx) => {
      console.log(`\n${idx + 1}. [${err.category}] ${err.name}`);
      console.log(`   ${err.message}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log('\n' + '='.repeat(70));
    console.log('⚠️  WARNINGS (Should Fix):');
    console.log('='.repeat(70));
    warnings.forEach((warn, idx) => {
      console.log(`\n${idx + 1}. [${warn.category}] ${warn.name}`);
      console.log(`   ${warn.message}`);
    });
  }
  
  console.log('\n' + '='.repeat(70));
  
  if (failed === 0 && warned === 0) {
    console.log('🟢 ALL TESTS PASSED! CMS is fully functional.');
    console.log('='.repeat(70));
    return true;
  } else if (failed === 0) {
    console.log('🟡 TESTS PASSED WITH WARNINGS. CMS will work but some content may be missing.');
    console.log('='.repeat(70));
    return true;
  } else {
    console.log('🔴 TESTS FAILED. CMS is not working correctly.');
    console.log('\n📖 Next Steps:');
    if (criticalErrors.some(e => e.message.includes('API key'))) {
      console.log('   1. Follow API-KEY-SETUP-GUIDE.md to get a valid Google Sheets API key');
      console.log('   2. Update the API key in api/sheets.js');
      console.log('   3. Run this test again');
    } else {
      console.log('   1. Review the errors above');
      console.log('   2. Fix the issues in your Google Sheet');
      console.log('   3. Run this test again');
    }
    console.log('='.repeat(70));
    return false;
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║           Pulse Dancers CMS - Comprehensive Test Suite              ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  
  console.log('\n📌 Configuration:');
  console.log(`   Sheet ID: ${SHEET_ID}`);
  console.log(`   API Key: ${API_KEY.substring(0, 20)}...${API_KEY.substring(API_KEY.length - 5)}`);
  
  // Test 1: API Key
  const apiKeyValid = await testAPIKey();
  
  if (!apiKeyValid) {
    console.log('\n🛑 Stopping tests: API key is invalid. Fix this first before proceeding.');
    console.log('   See API-KEY-SETUP-GUIDE.md for instructions.\n');
    printSummary();
    process.exit(1);
  }
  
  // Test 2: Sheet Access
  await testSheetAccess();
  
  // Test 3: All Sheet Data
  await testAllSheets();
  
  // Test 4: Specific Content
  await testSpecificContent();
  
  // Print Summary
  const success = printSummary();
  
  process.exit(success ? 0 : 1);
}

// Run tests
main().catch(error => {
  console.error('\n💥 Fatal error running tests:', error);
  process.exit(1);
});
