# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: estate-map.spec.ts >> Estate Bay Map View >> Filter panel opens and filters results
- Location: tests/e2e/estate-map.spec.ts:86:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.leaflet-container')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.leaflet-container') with timeout 10000ms
  - waiting for locator('.leaflet-container')

```

```yaml
- banner:
  - img
  - text: ParkBuddySA
  - button "Log In"
  - button "Sign Up"
- heading "Rent Parking Bays in Your Estate. Simple. Secure." [level=1]
- paragraph: South Africa's first peer-to-peer estate parking platform. Let your visitors park safely while you earn from your spare bay.
- button "Find Parking":
  - text: Find Parking
  - img
- button "List Your Bay"
- paragraph: 2,500+
- paragraph: Active Bays
- paragraph: 150+
- paragraph: Estates
- paragraph: 98%
- paragraph: Satisfaction
- paragraph: R50
- paragraph: Avg. per Day
- heading "How It Works" [level=2]
- paragraph: Whether you're hosting visitors or earning from your spare bay, ParkBuddy makes it effortless.
- img
- heading "For Visitors (Renters)" [level=3]
- img
- text: Search your estate by name or city
- img
- text: Pick dates & select a parking bay
- img
- text: Pay securely via Paystack (escrow)
- img
- text: Share parking details via WhatsApp
- img
- heading "For Bay Owners (Hosts)" [level=3]
- img
- text: Verify your ID & residence (safe & secure)
- img
- text: List your bay with price & availability
- img
- text: Accept or auto-confirm bookings
- img
- text: Get paid after each booking (15% fee)
- heading "Why ParkBuddy SA?" [level=2]
- img
- heading "Verified & Secure" [level=3]
- paragraph: All hosts are ID-verified and residence-verified. Your visitors park in safe, gated estates.
- img
- heading "Escrow Payments" [level=3]
- paragraph: Paystack holds funds in escrow. Hosts only get paid after the booking is completed.
- img
- heading "Instant Book" [level=3]
- paragraph: No waiting for approval. Book instantly and get parking details immediately.
- heading "Ready to Get Started?" [level=2]
- paragraph: Join thousands of South Africans who are already using ParkBuddy to park smarter.
- button "Create Free Account"
- contentinfo:
  - img
  - text: ParkBuddy SA
  - paragraph: © 2026 ParkBuddy SA. All rights reserved. Made with ❤️ in South Africa.
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Estate Bay Map View', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('http://localhost:4000');
  6   |   });
  7   | 
  8   |   test('Map view toggle on results page', async ({ page }) => {
  9   |     // Login as renter
  10  |     await page.click('text=Log In');
  11  |     await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
  12  |     await page.fill('input[type="password"]', 'renter123');
  13  |     await page.click('button[type="submit"]');
  14  |     
  15  |     // Search for estate
  16  |     await page.fill('input[placeholder*="estate" i]', 'Test Estate');
  17  |     await page.click('button:has-text("Search")');
  18  |     
  19  |     // Wait for results
  20  |     await expect(page).toHaveURL(/.*results/);
  21  |     
  22  |     // Check for List/Map toggle buttons
  23  |     await expect(page.locator('button:has-text("List")')).toBeVisible();
  24  |     await expect(page.locator('button:has-text("Map")')).toBeVisible();
  25  |     
  26  |     // Click Map view
  27  |     await page.click('button:has-text("Map")');
  28  |     
  29  |     // Should show map
  30  |     await expect(page.locator('.leaflet-container')).toBeVisible();
  31  |     
  32  |     // URL should have view=map
  33  |     await expect(page).toHaveURL(/view=map/);
  34  |   });
  35  | 
  36  |   test('Map shows bay markers', async ({ page }) => {
  37  |     await page.goto('http://localhost:4000/results?view=map');
  38  |     
  39  |     // Wait for map to load
  40  |     await expect(page.locator('.leaflet-container')).toBeVisible();
  41  |     
  42  |     // Check for bay markers (red X icons)
  43  |     const bayMarkers = page.locator('.custom-bay-marker');
  44  |     await expect(bayMarkers.first()).toBeVisible({ timeout: 10000 });
  45  |   });
  46  | 
  47  |   test('Bay marker popup shows details', async ({ page }) => {
  48  |     await page.goto('http://localhost:4000/results?view=map');
  49  |     
  50  |     await expect(page.locator('.leaflet-container')).toBeVisible();
  51  |     
  52  |     // Click on a bay marker
  53  |     const bayMarker = page.locator('.custom-bay-marker').first();
  54  |     await bayMarker.click();
  55  |     
  56  |     // Popup should appear with details
  57  |     await expect(page.locator('.leaflet-popup')).toBeVisible();
  58  |     await expect(page.locator('.leaflet-popup')).toContainText(/R\d+\/day/);
  59  |     await expect(page.locator('.leaflet-popup')).toContainText(/Instant|Request/);
  60  |     await expect(page.locator('.leaflet-popup')).toContainText(/min walk/);
  61  |   });
  62  | 
  63  |   test('Cluster labels show on map', async ({ page }) => {
  64  |     await page.goto('http://localhost:4000/results?view=map');
  65  |     
  66  |     await expect(page.locator('.leaflet-container')).toBeVisible();
  67  |     
  68  |     // Check for cluster labels
  69  |     const clusterLabels = page.locator('.cluster-label');
  70  |     await expect(clusterLabels.first()).toBeVisible({ timeout: 10000 });
  71  |     
  72  |     // Label should show cluster name and count
  73  |     await expect(clusterLabels.first()).toContainText(/\(\d+ bays?\)/);
  74  |   });
  75  | 
  76  |   test('User cluster marker shows on map', async ({ page }) => {
  77  |     await page.goto('http://localhost:4000/results?view=map');
  78  |     
  79  |     await expect(page.locator('.leaflet-container')).toBeVisible();
  80  |     
  81  |     // Check for user marker (blue pulsing dot)
  82  |     const userMarker = page.locator('.user-marker');
  83  |     await expect(userMarker.first()).toBeVisible({ timeout: 10000 });
  84  |   });
  85  | 
  86  |   test('Filter panel opens and filters results', async ({ page }) => {
  87  |     await page.goto('http://localhost:4000/results?view=map');
  88  |     
> 89  |     await expect(page.locator('.leaflet-container')).toBeVisible();
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  90  |     
  91  |     // Click filter button
  92  |     await page.click('button:has(svg.lucide-filter)');
  93  |     
  94  |     // Filter panel should open
  95  |     await expect(page.locator('text=Filters')).toBeVisible();
  96  |     await expect(page.locator('text=Price Range')).toBeVisible();
  97  |     await expect(page.locator('text=Booking Type')).toBeVisible();
  98  |     await expect(page.locator('text=Verified hosts only')).toBeVisible();
  99  |     
  100 |     // Set price filter
  101 |     await page.fill('input[placeholder="Min"]', '50');
  102 |     await page.fill('input[placeholder="Max"]', '200');
  103 |     
  104 |     // Check markers update (wait for re-render)
  105 |     await page.waitForTimeout(1000);
  106 |     
  107 |     // Close filter
  108 |     await page.click('button:has(svg.lucide-x)');
  109 |     await expect(page.locator('text=Filters')).not.toBeVisible();
  110 |   });
  111 | 
  112 |   test('Back to List button returns to list view', async ({ page }) => {
  113 |     await page.goto('http://localhost:4000/results?view=map');
  114 |     
  115 |     await expect(page.locator('.leaflet-container')).toBeVisible();
  116 |     
  117 |     // Click back to list
  118 |     await page.click('button:has-text("Back to List View")');
  119 |     
  120 |     // Should show list view
  121 |     await expect(page.locator('text=Available Bays')).toBeVisible();
  122 |     await expect(page.locator('.leaflet-container')).not.toBeVisible();
  123 |     
  124 |     // URL should have view=list
  125 |     await expect(page).toHaveURL(/view=list/);
  126 |   });
  127 | 
  128 |   test('Map view persists in URL on refresh', async ({ page }) => {
  129 |     await page.goto('http://localhost:4000/results?view=map');
  130 |     
  131 |     await expect(page.locator('.leaflet-container')).toBeVisible();
  132 |     
  133 |     // Refresh page
  134 |     await page.reload();
  135 |     
  136 |     // Should still show map view
  137 |     await expect(page.locator('.leaflet-container')).toBeVisible();
  138 |     await expect(page).toHaveURL(/view=map/);
  139 |   });
  140 | 
  141 |   test('List view persists in URL on refresh', async ({ page }) => {
  142 |     await page.goto('http://localhost:4000/results?view=list');
  143 |     
  144 |     await expect(page.locator('text=Available Bays')).toBeVisible();
  145 |     
  146 |     // Refresh page
  147 |     await page.reload();
  148 |     
  149 |     // Should still show list view
  150 |     await expect(page.locator('text=Available Bays')).toBeVisible();
  151 |     await expect(page).toHaveURL(/view=list/);
  152 |   });
  153 | });
  154 | 
  155 | test.describe('Search Page Map Integration', () => {
  156 |   test.beforeEach(async ({ page }) => {
  157 |     await page.goto('http://localhost:4000');
  158 |   });
  159 | 
  160 |   test('Search page shows estate map selector', async ({ page }) => {
  161 |     // Login as renter
  162 |     await page.click('text=Log In');
  163 |     await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
  164 |     await page.fill('input[type="password"]', 'renter123');
  165 |     await page.click('button[type="submit"]');
  166 |     
  167 |     // Go to search
  168 |     await page.click('text=Search');
  169 |     
  170 |     // Should show map selector
  171 |     await expect(page.locator('text=Select Estate on Map')).toBeVisible();
  172 |     await expect(page.locator('.leaflet-container')).toBeVisible();
  173 |   });
  174 | 
  175 |   test('Clicking estate on map navigates to results with map view', async ({ page }) => {
  176 |     await page.click('text=Log In');
  177 |     await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
  178 |     await page.fill('input[type="password"]', 'renter123');
  179 |     await page.click('button[type="submit"]');
  180 |     
  181 |     await page.click('text=Search');
  182 |     
  183 |     // Click on estate marker
  184 |     await page.click('.leaflet-marker-icon:has-text("Estate")');
  185 |     
  186 |     // Should navigate to results with map view
  187 |     await expect(page).toHaveURL(/.*results/);
  188 |     await expect(page).toHaveURL(/view=map/);
  189 |     await expect(page.locator('.leaflet-container')).toBeVisible();
```