# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: estate-map.spec.ts >> Estate Bay Map View >> Map view toggle on results page
- Location: tests/e2e/estate-map.spec.ts:8:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[placeholder*="estate" i]')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e12]:
        - heading "My Dashboard" [level=1] [ref=e13]
        - paragraph [ref=e14]: Welcome back, Kagiso
      - generic [ref=e15]:
        - button "Book Parking" [ref=e16]
        - button [ref=e19]
  - generic [ref=e23]:
    - tablist [ref=e25]:
      - tab "Upcoming (2)" [selected] [ref=e26]
      - tab "Pending (2)" [ref=e29]
      - tab "History (6)" [ref=e32]
      - tab "Reviews (6)" [ref=e37]
    - generic [ref=e40]:
      - generic [ref=e42]:
        - generic [ref=e43]:
          - generic [ref=e44]:
            - paragraph [ref=e45]: Kagiso Molefe
            - generic [ref=e46]: Active
          - paragraph [ref=e47]: Midrand Estate • Cluster B • C-20
          - paragraph [ref=e48]: 2026-11-06 → 2026-11-08 • 🚗 GP 123 ABC
          - paragraph [ref=e49]:
            - text: "Access Code:"
            - generic [ref=e54]: ACC98765
        - button "Cancel" [ref=e56]
      - generic [ref=e62]:
        - generic [ref=e63]:
          - generic [ref=e64]:
            - paragraph [ref=e65]: Kagiso Molefe
            - generic [ref=e66]: Active
          - paragraph [ref=e67]: Midrand Estate • Cluster B • C-20
          - paragraph [ref=e68]: 2026-11-06 → 2026-11-08 • 🚗 GP 123 ABC
          - paragraph [ref=e69]:
            - text: "Access Code:"
            - generic [ref=e74]: ACC98765
        - button "Cancel" [ref=e76]
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
> 16  |     await page.fill('input[placeholder*="estate" i]', 'Test Estate');
      |                ^ Error: page.fill: Test timeout of 60000ms exceeded.
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
  89  |     await expect(page.locator('.leaflet-container')).toBeVisible();
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
```