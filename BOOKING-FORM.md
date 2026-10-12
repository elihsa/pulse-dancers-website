# Booking Form — Custom Implementation (JotForm Replacement)

The old JotForm embed on `book.html` has been replaced with a fully custom form.

## Architecture

| File | Purpose |
|------|---------|
| `book.html` | The form markup: conditional service sections, live quote box |
| `assets/js/booking-form.js` | All form logic: conditional fields, distance calc, live quote, submit |
| `api/submit-booking.js` | Vercel serverless endpoint → writes to the `BOOKINGS` tab in Google Sheets |
| `assets/css/styles.css` | `.option-grid` / `.option-card` styles for the selectable service chips |

## How it works

### 1. Conditional fields
Services are checkboxes: Male Stripper, Female Stripper, Topless Waiter, Bottomless Butler, Games, Pole Dancer, Other. **Only the fields for selected services appear** — exactly like the JotForm logic you asked about. Same pattern for:
- "Are you managing the event?" → manager name/phone/email only shows if someone else manages
- "Do you have the exact address?" → address autocomplete vs area dropdown

### 2. Live quote
The quote box at the bottom of the form updates in real time as the customer changes selections:
- **Performance fee** — calculated per service (rates below)
- **Distance** — one-way × 2 (round trip) from the base location
- **Travel fee** — `max(0, distance − freeRadius) × ratePerKm`
- **Estimated total** — performance + travel

### 3. Distance calculation
- **Exact address + Google Maps key in CMS** → Google Places autocomplete → exact coordinates → haversine distance ×2
- **Area only (no Maps key)** → the form matches the area name against a built-in table of ~60 SA city/suburb coordinates and estimates the distance
- **Within the free radius** → no travel fee is charged

## Rate configuration (all in the CMS)

Rates live in the `PAGE_CONTENT` tab of the Google Sheet (key | value). **Change them there — no code edits needed.**

| CMS key | Default | Meaning |
|---------|---------|---------|
| `travelRatePerKm` | 5 | Travel fee per km beyond free radius (currently **R5/km**) |
| `freeRadiusKm` | 50 | Free travel radius in km (Sandton City base) |
| `baseLocationName` | Sandton City | Display name of the base location |
| `rateMaleXpress` | 1800 | R per male stripper, xpress 13-min show |
| `rateMaleFull` | 2500 | R per male stripper, full 20-min show |
| `rateFemale` | *(empty = POA)* | R per female stripper |
| `rateWaiter1h` | 850 | R per topless waiter, 1 hour |
| `rateWaiterMulti` | 750 | R per topless waiter per hour, 2+ hours |
| `rateButler1h` | 950 | R per bottomless butler, 1 hour |
| `rateButlerMulti` | 850 | R per bottomless butler per hour, 2+ hours |
| `rateGames` | *(empty = POA)* | R per games package |
| `ratePoleDancer` | *(empty = POA)* | R per pole dancer |
| `googleMapsApiKey` | *(empty)* | Google Maps JS API key — enables address autocomplete + exact distance |

> **POA** = "Price on application" — when a rate is empty the quote shows "POA" for that line. Set the CMS key to a number to include it in the quote automatically.

## Bookings destination

Submissions are written to the **`BOOKINGS`** tab of the Google Sheet (same sheet as everything else, ID `1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4`).

**If the tab doesn't exist yet:** create a tab named exactly `BOOKINGS` with these column headers (row 1):

```
Timestamp | Name | Phone | Email | EventType | Managing | ManagerName | ManagerPhone | ManagerEmail | LocType | Address | Area | DistanceKm | Services | MaleCount | ShowType | Race | Costume | FemaleCount | WaiterCount | WaiterHours | ButlerCount | ButlerHours | GamesQty | PoleQty | OtherText | Notes | QuotePerformance | QuoteTravel | QuoteTotal | Status
```

Make sure the service account email is shared on the sheet with **Editor** access (same as for the other forms).

## Optional: Google Maps autocomplete

For exact address autocomplete + precise distance:
1. Enable **Maps JavaScript API** and **Places API** in Google Cloud Console
2. Create an API key, restrict it to your Vercel domains
3. Add a row in the `PAGE_CONTENT` tab: key = `googleMapsApiKey`, value = your key
4. The form picks it up automatically — no deploy needed

Without the key, the area-based distance estimate still works.

## Deploy

Nothing special — push to `main` on GitHub and Vercel auto-deploys. The endpoint works on any Vercel deployment (preview URLs included).

## Retired files

- `assets/js/booking-calculator.js` — deleted (standalone calculator for the old JotForm page; contained a broken API key)
- JotForm embeds on `book.html` — removed
- `JOTFORM-INTEGRATION.md` — superseded by this document
