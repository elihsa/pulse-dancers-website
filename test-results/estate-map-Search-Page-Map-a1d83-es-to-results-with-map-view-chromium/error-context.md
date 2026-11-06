# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: estate-map.spec.ts >> Search Page Map Integration >> Clicking estate on map navigates to results with map view
- Location: tests/e2e/estate-map.spec.ts:175:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('text=Search')

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
> 181 |     await page.click('text=Search');
      |                ^ Error: page.click: Test timeout of 60000ms exceeded.
  182 |     
  183 |     // Click on estate marker
  184 |     await page.click('.leaflet-marker-icon:has-text("Estate")');
  185 |     
  186 |     // Should navigate to results with map view
  187 |     await expect(page).toHaveURL(/.*results/);
  188 |     await expect(page).toHaveURL(/view=map/);
  189 |     await expect(page.locator('.leaflet-container')).toBeVisible();
  190 |   });
  191 | });
  192 | 
  193 | test.describe('Map Legend', () => {
  194 |   test.beforeEach(async ({ page }) => {
  195 |     await page.goto('http://localhost:4000/results?view=map');
  196 |   });
  197 | 
  198 |   test('Legend shows bay marker explanation', async ({ page }) => {
  199 |     await expect(page.locator('.leaflet-container')).toBeVisible();
  200 |     
  201 |     // Check legend
  202 |     await expect(page.locator('text=Bay marker')).toBeVisible();
  203 |     await expect(page.locator('text=Your cluster')).toBeVisible();
  204 |     await expect(page.locator('text=Verified host')).toBeVisible();
  205 |   });
  206 | 
  207 |   test('Legend shows mapped bays count', async ({ page }) => {
  208 |     await expect(page.locator('.leaflet-container')).toBeVisible();
  209 |     
  210 |     // Check for bay count in legend
  211 |     await expect(page.locator('text=/\\d+ bays mapped/')).toBeVisible();
  212 |   });
  213 | });
```