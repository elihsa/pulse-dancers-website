# CMS Data - CSV Files for Google Sheets Import

This folder contains CSV files ready to import into your Google Sheet CMS.

## Files

- **HOME.csv** - Homepage content (hero title, subtitle, about text)
- **PRICES.csv** - Service pricing table
- **FAQS.csv** - Frequently asked questions
- **SERVICES.csv** - Service descriptions and active flags
- **DANCERS.csv** - Performer profiles template
- **TESTIMONIALS.csv** - Customer testimonials
- **SOCIAL.csv** - Social media links

## How to Import

### Method 1: Direct Import
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/12zPYBbpdDLhqTPylP0oUgPqimy5fXIfg/edit
2. Create a new tab for each CSV file (or use existing tabs)
3. Go to File > Import
4. Upload the CSV file
5. Choose "Replace current sheet" or "Append to current sheet"
6. Click "Import data"

### Method 2: Copy/Paste
Alternatively, you can copy content from the `GOOGLE-SHEETS-TEMPLATE.md` file which has the same data formatted as markdown tables.

## Notes

- Each CSV file has headers in the first row
- Make sure tab names in Google Sheets match the expected names (HOME, PRICES, FAQS, DANCERS, SERVICES, TESTIMONIALS, SOCIAL)
- After importing, get each tab's GID from the URL and update `/assets/js/sheets-cms.js`

## See Also

- `GOOGLE-SHEETS-TEMPLATE.md` - Full template with tables and instructions
- `COMPREHENSIVE-SPEC.md` - Complete site documentation
