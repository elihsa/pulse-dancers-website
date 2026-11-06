import { test, expect } from '@playwright/test';

test.describe('Estate Bay Map View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000');
  });

  test('Map view toggle on results page', async ({ page }) => {
    // Login as renter
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'renter123');
    await page.click('button[type="submit"]');
    
    // Search for estate
    await page.fill('input[placeholder*="estate" i]', 'Test Estate');
    await page.click('button:has-text("Search")');
    
    // Wait for results
    await expect(page).toHaveURL(/.*results/);
    
    // Check for List/Map toggle buttons
    await expect(page.locator('button:has-text("List")')).toBeVisible();
    await expect(page.locator('button:has-text("Map")')).toBeVisible();
    
    // Click Map view
    await page.click('button:has-text("Map")');
    
    // Should show map
    await expect(page.locator('.leaflet-container')).toBeVisible();
    
    // URL should have view=map
    await expect(page).toHaveURL(/view=map/);
  });

  test('Map shows bay markers', async ({ page }) => {
    await page.goto('http://localhost:4000/results?view=map');
    
    // Wait for map to load
    await expect(page.locator('.leaflet-container')).toBeVisible();
    
    // Check for bay markers (red X icons)
    const bayMarkers = page.locator('.custom-bay-marker');
    await expect(bayMarkers.first()).toBeVisible({ timeout: 10000 });
  });

  test('Bay marker popup shows details', async ({ page }) => {
    await page.goto('http://localhost:4000/results?view=map');
    
    await expect(page.locator('.leaflet-container')).toBeVisible();
    
    // Click on a bay marker
    const bayMarker = page.locator('.custom-bay-marker').first();
    await bayMarker.click();
    
    // Popup should appear with details
    await expect(page.locator('.leaflet-popup')).toBeVisible();
    await expect(page.locator('.leaflet-popup')).toContainText(/R\d+\/day/);
    await expect(page.locator('.leaflet-popup')).toContainText(/Instant|Request/);
    await expect(page.locator('.leaflet-popup')).toContainText(/min walk/);
  });

  test('Cluster labels show on map', async ({ page }) => {
    await page.goto('http://localhost:4000/results?view=map');
    
    await expect(page.locator('.leaflet-container')).toBeVisible();
    
    // Check for cluster labels
    const clusterLabels = page.locator('.cluster-label');
    await expect(clusterLabels.first()).toBeVisible({ timeout: 10000 });
    
    // Label should show cluster name and count
    await expect(clusterLabels.first()).toContainText(/\(\d+ bays?\)/);
  });

  test('User cluster marker shows on map', async ({ page }) => {
    await page.goto('http://localhost:4000/results?view=map');
    
    await expect(page.locator('.leaflet-container')).toBeVisible();
    
    // Check for user marker (blue pulsing dot)
    const userMarker = page.locator('.user-marker');
    await expect(userMarker.first()).toBeVisible({ timeout: 10000 });
  });

  test('Filter panel opens and filters results', async ({ page }) => {
    await page.goto('http://localhost:4000/results?view=map');
    
    await expect(page.locator('.leaflet-container')).toBeVisible();
    
    // Click filter button
    await page.click('button:has(svg.lucide-filter)');
    
    // Filter panel should open
    await expect(page.locator('text=Filters')).toBeVisible();
    await expect(page.locator('text=Price Range')).toBeVisible();
    await expect(page.locator('text=Booking Type')).toBeVisible();
    await expect(page.locator('text=Verified hosts only')).toBeVisible();
    
    // Set price filter
    await page.fill('input[placeholder="Min"]', '50');
    await page.fill('input[placeholder="Max"]', '200');
    
    // Check markers update (wait for re-render)
    await page.waitForTimeout(1000);
    
    // Close filter
    await page.click('button:has(svg.lucide-x)');
    await expect(page.locator('text=Filters')).not.toBeVisible();
  });

  test('Back to List button returns to list view', async ({ page }) => {
    await page.goto('http://localhost:4000/results?view=map');
    
    await expect(page.locator('.leaflet-container')).toBeVisible();
    
    // Click back to list
    await page.click('button:has-text("Back to List View")');
    
    // Should show list view
    await expect(page.locator('text=Available Bays')).toBeVisible();
    await expect(page.locator('.leaflet-container')).not.toBeVisible();
    
    // URL should have view=list
    await expect(page).toHaveURL(/view=list/);
  });

  test('Map view persists in URL on refresh', async ({ page }) => {
    await page.goto('http://localhost:4000/results?view=map');
    
    await expect(page.locator('.leaflet-container')).toBeVisible();
    
    // Refresh page
    await page.reload();
    
    // Should still show map view
    await expect(page.locator('.leaflet-container')).toBeVisible();
    await expect(page).toHaveURL(/view=map/);
  });

  test('List view persists in URL on refresh', async ({ page }) => {
    await page.goto('http://localhost:4000/results?view=list');
    
    await expect(page.locator('text=Available Bays')).toBeVisible();
    
    // Refresh page
    await page.reload();
    
    // Should still show list view
    await expect(page.locator('text=Available Bays')).toBeVisible();
    await expect(page).toHaveURL(/view=list/);
  });
});

test.describe('Search Page Map Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000');
  });

  test('Search page shows estate map selector', async ({ page }) => {
    // Login as renter
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'renter123');
    await page.click('button[type="submit"]');
    
    // Go to search
    await page.click('text=Search');
    
    // Should show map selector
    await expect(page.locator('text=Select Estate on Map')).toBeVisible();
    await expect(page.locator('.leaflet-container')).toBeVisible();
  });

  test('Clicking estate on map navigates to results with map view', async ({ page }) => {
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'renter123');
    await page.click('button[type="submit"]');
    
    await page.click('text=Search');
    
    // Click on estate marker
    await page.click('.leaflet-marker-icon:has-text("Estate")');
    
    // Should navigate to results with map view
    await expect(page).toHaveURL(/.*results/);
    await expect(page).toHaveURL(/view=map/);
    await expect(page.locator('.leaflet-container')).toBeVisible();
  });
});

test.describe('Map Legend', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000/results?view=map');
  });

  test('Legend shows bay marker explanation', async ({ page }) => {
    await expect(page.locator('.leaflet-container')).toBeVisible();
    
    // Check legend
    await expect(page.locator('text=Bay marker')).toBeVisible();
    await expect(page.locator('text=Your cluster')).toBeVisible();
    await expect(page.locator('text=Verified host')).toBeVisible();
  });

  test('Legend shows mapped bays count', async ({ page }) => {
    await expect(page.locator('.leaflet-container')).toBeVisible();
    
    // Check for bay count in legend
    await expect(page.locator('text=/\\d+ bays mapped/')).toBeVisible();
  });
});