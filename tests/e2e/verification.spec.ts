import { test, expect } from '@playwright/test';

test.describe('ID Verification Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000');
  });

  test('Verification page accessible from user menu when logged in as renter', async ({ page }) => {
    // Login as renter
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'renter123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*renter-dashboard/);
    
    // Open user menu and click verification
    await page.click('button:has(svg.lucide-user)');
    await page.click('text=ID Verification');
    
    await expect(page).toHaveURL(/.*verification/);
    await expect(page.locator('h3')).toContainText('ID Verification');
  });

  test('Verification form shows 3 steps', async ({ page }) => {
    await page.goto('http://localhost:4000/verification');
    
    // Check step indicators
    await expect(page.locator('text=Personal Info')).toBeVisible();
    await expect(page.locator('text=Documents')).toBeVisible();
    await expect(page.locator('text=Review & Submit')).toBeVisible();
  });

  test('Step 1 - Personal Info form validation', async ({ page }) => {
    await page.goto('http://localhost:4000/verification');
    
    // Try to continue without filling required fields
    await page.click('button:has-text("Continue")');
    
    // Should show validation errors
    await expect(page.locator('text=Full name is required')).toBeVisible();
    await expect(page.locator('text=SA ID number is required')).toBeVisible();
    await expect(page.locator('text=Phone number is required')).toBeVisible();
  });

  test('Step 1 - Valid SA ID number format', async ({ page }) => {
    await page.goto('http://localhost:4000/verification');
    
    await page.fill('input[name="full_name"]', 'John Doe');
    await page.fill('input[name="id_number"]', 'invalid');
    await page.fill('input[name="phone"]', '+27 72 123 4567');
    await page.click('button:has-text("Continue")');
    
    await expect(page.locator('text=SA ID number must be 13 digits')).toBeVisible();
    
    // Fix ID number
    await page.fill('input[name="id_number"]', '9001015009087');
    await page.click('button:has-text("Continue")');
    
    // Should advance to step 2
    await expect(page.locator('text=Documents')).toHaveClass(/active|text-blue-600/);
  });

  test('Step 2 - Document upload required', async ({ page }) => {
    await page.goto('http://localhost:4000/verification');
    
    // Fill step 1
    await page.fill('input[name="full_name"]', 'John Doe');
    await page.fill('input[name="id_number"]', '9001015009087');
    await page.fill('input[name="phone"]', '+27 72 123 4567');
    await page.click('button:has-text("Continue")');
    
    // Try to continue without uploading files
    await page.click('button:has-text("Continue")');
    
    await expect(page.locator('text=ID document front is required')).toBeVisible();
    await expect(page.locator('text=ID document back is required')).toBeVisible();
    await expect(page.locator('text=Selfie with ID is required')).toBeVisible();
  });

  test('Step 2 - File upload preview', async ({ page }) => {
    await page.goto('http://localhost:4000/verification');
    
    // Fill step 1
    await page.fill('input[name="full_name"]', 'John Doe');
    await page.fill('input[name="id_number"]', '9001015009087');
    await page.fill('input[name="phone"]', '+27 72 123 4567');
    await page.click('button:has-text("Continue")');
    
    // Create test file using DataTransfer
    await page.evaluate(() => {
      const dt = new DataTransfer();
      const file = new File(['fake image data'], 'id_front.jpg', { type: 'image/jpeg' });
      dt.items.add(file);
      const input = document.querySelector('input[name="id_front"]') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    await page.evaluate(() => {
      const dt = new DataTransfer();
      const file = new File(['fake image data'], 'id_back.jpg', { type: 'image/jpeg' });
      dt.items.add(file);
      const input = document.querySelector('input[name="id_back"]') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    await page.evaluate(() => {
      const dt = new DataTransfer();
      const file = new File(['fake image data'], 'selfie.jpg', { type: 'image/jpeg' });
      dt.items.add(file);
      const input = document.querySelector('input[name="selfie"]') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Check previews appear
    await expect(page.locator('img[alt="ID Document Front Preview"]')).toBeVisible();
    await expect(page.locator('img[alt="ID Document Back Preview"]')).toBeVisible();
    await expect(page.locator('img[alt="Selfie Preview"]')).toBeVisible();
    
    await page.click('button:has-text("Continue")');
    
    // Should advance to step 3
    await expect(page.locator('text=Review & Submit')).toHaveClass(/active|text-blue-600/);
  });

  test('Step 3 - Review and submit', async ({ page }) => {
    await page.goto('http://localhost:4000/verification');
    
    // Fill all steps
    await page.fill('input[name="full_name"]', 'John Doe');
    await page.fill('input[name="id_number"]', '9001015009087');
    await page.fill('input[name="phone"]', '+27 72 123 4567');
    await page.click('button:has-text("Continue")');
    
    // Upload files using evaluate
    await page.evaluate(() => {
      const dt = new DataTransfer();
      const file = new File(['fake image data'], 'id_front.jpg', { type: 'image/jpeg' });
      dt.items.add(file);
      const input = document.querySelector('input[name="id_front"]') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    await page.evaluate(() => {
      const dt = new DataTransfer();
      const file = new File(['fake image data'], 'id_back.jpg', { type: 'image/jpeg' });
      dt.items.add(file);
      const input = document.querySelector('input[name="id_back"]') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    await page.evaluate(() => {
      const dt = new DataTransfer();
      const file = new File(['fake image data'], 'selfie.jpg', { type: 'image/jpeg' });
      dt.items.add(file);
      const input = document.querySelector('input[name="selfie"]') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    await page.click('button:has-text("Continue")');
    
    // Check review step shows summary
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=9001015009087')).toBeVisible();
    await expect(page.locator('text=+27 72 123 4567')).toBeVisible();
    
    // Submit
    await page.click('button:has-text("Submit for Verification")');
    
    // Should show success or pending status
    await expect(page.locator('text=Verification submitted')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Verification Gate on Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000');
  });

  test('Shows verification gate when booking listing requiring ID verification', async ({ page }) => {
    // Login as renter
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'renter123');
    await page.click('button[type="submit"]');
    
    // Search for a listing that requires verification
    await page.fill('input[placeholder*="estate" i]', 'Test Estate');
    await page.click('button:has-text("Search")');
    
    // Click on a listing that requires verification
    await page.click('[data-testid="listing-requires-verification"]');
    
    // Should show verification gate modal
    await expect(page.locator('text=ID Verification Required')).toBeVisible();
    await expect(page.locator('text=This parking bay is in a residential/private area')).toBeVisible();
  });

  test('Verification gate allows submitting verification', async ({ page }) => {
    await page.goto('http://localhost:4000/checkout');
    
    // Trigger verification gate
    await page.click('button:has-text("Pay")');
    
    await expect(page.locator('text=ID Verification Required')).toBeVisible();
    
    // Fill verification form in modal
    await page.fill('input[name="full_name"]', 'John Doe');
    await page.fill('input[name="id_number"]', '9001015009087');
    await page.fill('input[name="phone"]', '+27 72 123 4567');
    
    // Upload files using evaluate
    await page.evaluate(() => {
      const dt = new DataTransfer();
      const file = new File(['fake image data'], 'id_front.jpg', { type: 'image/jpeg' });
      dt.items.add(file);
      const input = document.querySelector('input[name="id_front"]') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    await page.evaluate(() => {
      const dt = new DataTransfer();
      const file = new File(['fake image data'], 'id_back.jpg', { type: 'image/jpeg' });
      dt.items.add(file);
      const input = document.querySelector('input[name="id_back"]') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    await page.evaluate(() => {
      const dt = new DataTransfer();
      const file = new File(['fake image data'], 'selfie.jpg', { type: 'image/jpeg' });
      dt.items.add(file);
      const input = document.querySelector('input[name="selfie"]') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    await page.click('button:has-text("Submit for Verification")');
    
    // Modal should close after successful submission
    await expect(page.locator('text=ID Verification Required')).not.toBeVisible({ timeout: 10000 });
  });
});

test.describe('Host Verification Gate on Create Listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000');
  });

  test('Shows verification gate when creating residential driveway listing', async ({ page }) => {
    // Login as host
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'host@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'host123');
    await page.click('button[type="submit"]');
    
    await page.click('text=New Listing');
    
    // Select residential driveway
    await page.click('text=Residential Driveway');
    await page.click('button:has-text("Continue")');
    
    // Fill location
    await page.fill('input[placeholder*="Street"]', '123 Main Street');
    await page.fill('input[placeholder*="Space"]', 'Space A1');
    await page.click('button:has-text("Continue")');
    
    // Skip map
    await page.click('button:has-text("Skip")');
    
    // Fill pricing
    await page.fill('input[placeholder="50"]', '100');
    await page.click('button:has-text("Continue")');
    
    // Go to step 5
    await page.click('button:has-text("Continue")');
    
    // Try to publish
    await page.click('button:has-text("Publish Listing")');
    
    // Should show verification gate
    await expect(page.locator('text=Host ID Verification Required')).toBeVisible();
    await expect(page.locator('text=This listing type (Residential Driveway) requires host ID verification')).toBeVisible();
  });

  test('Verification gate links to verification page', async ({ page }) => {
    await page.goto('http://localhost:4000/create-listing');
    
    // Trigger verification gate by selecting residential driveway
    await page.click('text=Residential Driveway');
    await page.click('button:has-text("Continue")');
    await page.fill('input[placeholder*="Street"]', '123 Main Street');
    await page.fill('input[placeholder*="Space"]', 'Space A1');
    await page.click('button:has-text("Continue")');
    await page.click('button:has-text("Skip")');
    await page.fill('input[placeholder="50"]', '100');
    await page.click('button:has-text("Continue")');
    await page.click('button:has-text("Continue")');
    await page.click('button:has-text("Publish Listing")');
    
    await expect(page.locator('text=Host ID Verification Required')).toBeVisible();
    
    // Click "Go to Verification"
    await page.click('button:has-text("Go to Verification")');
    
    await expect(page).toHaveURL(/.*verification/);
  });
});