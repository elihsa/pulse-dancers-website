# JotForm Setup Guide for Pulse Dancers Website

## Overview
Your booking and join forms are powered by JotForm. This guide shows you how to connect your Google Sheets pricing data to JotForm and add automatic quote calculation.

---

## Part 1: Connect Google Sheets to JotForm

### Step 1: Open Your Booking Form
1. Go to https://www.jotform.com/myforms
2. Click on your **Booking Form** (#253636457639571)
3. Click **Edit Form**

### Step 2: Add Google Sheets Integration
1. In the form editor, click **Settings** (gear icon)
2. Go to **Integrations** tab
3. Search for **Google Sheets**
4. Click **Use Integration**
5. Connect your Google account
6. Select your spreadsheet: **Pulse Dancers CMS**
7. Select sheet: **Services** 
8. Map fields:
   - Service Name → Column B
   - Price → Column C
   - Duration → Column D

### Step 3: Make Service Field Dynamic
1. Click on your **Service Type** field in the form
2. Go to **Advanced** tab
3. Select **Populate field options from**
4. Choose **Google Sheets**
5. Select your connected sheet
6. Map: **Service Name** to display, **Price** as value

---

## Part 2: Add Automatic Quote Calculation

### Step 1: Add Form Calculation Widget
1. In form editor, click **Add Form Element**
2. Go to **Widgets** tab
3. Search for **Form Calculation**
4. Drag it onto your form (after service selection)

### Step 2: Set Up Base Quote Formula
1. Click the calculation widget
2. Go to **Properties**
3. Add formula:
```
{servicePrice} * {numPerformers}
```

4. Check **Show currency** (ZAR - South African Rand)
5. Label it: **Performance Fee**

### Step 3: Add Travel Fee Calculation
1. Add another calculation widget
2. Use conditional formula:
```
IF({distance} > 50, ({distance} - 50) * 4, 0)
```

3. Label it: **Travel Fee**

### Step 4: Add Total Quote
1. Add final calculation widget
2. Formula:
```
{performanceFee} + {travelFee}
```

3. Make it bold and larger
4. Label: **Total Estimated Quote**

---

## Part 3: Add Distance Calculator (Optional)

### Enable Google Maps in JotForm:
1. Add **Address** field type
2. Enable **Google Maps autocomplete**
3. Add **Hidden Field** called `distance`
4. Use JotForm Conditions to calculate distance from your base location

**Your Base Location (for distance calculation):**
- Sandton City, Johannesburg, South Africa

**Formula for travel cost:**
- First 50km: Free
- After 50km: R4/km (round trip)

---

## Part 4: Style Your JotForm to Match Website

### Colors to Use:
- Primary Red: `#FF2D55`
- Dark Background: `#1a1a1f`
- Light Text: `#E5E5E5`

### Steps:
1. In form editor, click **Form Designer** (paint brush icon)
2. Go to **Styles** tab
3. Set **Background Color**: `#1a1a1f`
4. Set **Button Color**: `#FF2D55`
5. Set **Text Color**: `#E5E5E5`
6. Set **Field Background**: `rgba(11, 11, 15, 0.8)`
7. Enable **Transparent Background** option

---

## Part 5: Testing Your Setup

### Test the Booking Form:
1. Select a service → Price should auto-populate
2. Change number of performers → Quote should update
3. Enter address → Travel fee should calculate
4. Check WhatsApp button opens with pre-filled message

### Test Google Sheets Sync:
1. Update a price in your Google Sheet
2. Refresh JotForm
3. Verify new price shows in dropdown

---

## Troubleshooting

**Q: Services not showing in dropdown?**
- Check Google Sheets integration is connected
- Verify sheet name and columns are correct
- Re-authorize Google account access

**Q: Calculations not working?**
- Check field names match formula exactly
- Ensure all referenced fields exist
- Test formula in JotForm conditions tester

**Q: Distance calculator not accurate?**
- Enable Google Maps API
- Check base location is set correctly
- Verify distance field is mapped properly

---

## Support

**JotForm Help:** https://www.jotform.com/help/  
**Google Sheets Integration:** https://www.jotform.com/help/98-how-to-integrate-google-sheets-with-jotform  
**Form Calculation:** https://www.jotform.com/help/127-how-to-add-math-to-your-forms

---

## Your Current Forms

**Booking Form:** https://form.jotform.com/253636457639571  
**Join Form:** https://www.jotform.com/Buns_info/NewGuy

**Google Sheet ID:** 12zPYBbpdDLhqTPylP0oUgPqimy5fXIfg  
**Services Tab GID:** 1118530609  
**Prices Tab GID:** 2117273325

---

*Last Updated: January 2026*