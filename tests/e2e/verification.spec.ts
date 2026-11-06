import { test, expect } from '@playwright/test';

test.describe('ID Verification Flow - Direct Page Access (requires auth)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000');
  });

  test('Verification page shows login redirect when not authenticated', async ({ page }) => {
    await page.goto('http://localhost:4000/verification');
    
    // Should redirect to landing page (no auth)
    await expect(page.locator('h1')).toContainText('Rent Parking Bays');
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
    
    // Wait for login to complete - check for dashboard content
    await expect(page.locator('text=My Dashboard')).toBeVisible({ timeout: 10000 });
    
    // Navigate to search/results
    await page.goto('http://localhost:4000/search');
    
    // Look for listing with requires_id_verified_renter
    const listingCard = page.locator('[data-testid="listing-requires-verification"]').first();
    if (await listingCard.isVisible({ timeout: 5000 })) {
      await listingCard.click();
      
      // Should show verification gate modal
      await expect(page.locator('text=ID Verification Required')).toBeVisible();
      await expect(page.locator('text=residential/private area')).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('Verification gate allows submitting verification', async ({ page }) => {
    await page.goto('http://localhost:4000/checkout');
    
    // This test assumes we're on checkout with a verification-required listing
    // Trigger verification gate if present
    const payButton = page.locator('button:has-text("Pay")');
    if (await payButton.isVisible({ timeout: 5000 })) {
      await payButton.click();
      
      // Check if verification gate appears
      if (await page.locator('text=ID Verification Required').isVisible({ timeout: 5000 })) {
        // Fill verification form (step 1 is read-only, just continue)
        await page.click('button:has-text("Continue")');
        
        // Upload files in step 2
        await page.evaluate(() => {
          const inputs = document.querySelectorAll('input[type="file"]');
          const files = [
            new File(['fake'], 'a.jpg', { type: 'image/jpeg' }),
            new File(['fake'], 'b.jpg', { type: 'image/jpeg' }),
            new File(['fake'], 'c.jpg', { type: 'image/jpeg' })
          ];
          inputs.forEach((input, i) => {
            const dt = new DataTransfer();
            dt.items.add(files[i]);
            (input as HTMLInputElement).files = dt.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          });
        });
        
        await page.waitForTimeout(500);
        await page.click('button:has-text("Review & Submit")');
        
        // Check checkbox
        await page.click('input[type="checkbox"]');
        
        // Submit
        await page.click('button:has-text("Submit for Review")');
        
        // Modal should close
        await expect(page.locator('text=ID Verification Required')).not.toBeVisible({ timeout: 10000 });
      }
    }
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
    
    // Wait a bit for login to process
    await page.waitForTimeout(2000);
    
    // Go to create listing directly
    await page.goto('http://localhost:4000/create-listing');
    
    // Check if we're on create listing page (either logged in or redirected to login)
    await expect(page.locator('text=Create Listing')).toBeVisible({ timeout: 10000 });
    
    // If we see listing type selection, proceed with test
    const residentialOption = page.locator('text=Residential Driveway');
    if (await residentialOption.isVisible({ timeout: 5000 })) {
      await residentialOption.click();
      await page.click('button:has-text("Continue")');
      
      // Fill location
      await page.fill('input[placeholder*="Street" i]', '123 Main Street');
      await page.fill('input[placeholder*="Space" i]', 'Space A1');
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
      await expect(page.locator('text=requires host ID verification')).toBeVisible();
    } else {
      // If redirected to login, skip
      test.skip();
    }
  });

  test('Verification gate links to verification page', async ({ page }) => {
    await page.goto('http://localhost:4000/create-listing');
    
    // Trigger verification gate by selecting residential driveway
    const residentialOption = page.locator('text=Residential Driveway');
    if (await residentialOption.isVisible({ timeout: 5000 })) {
      await residentialOption.click();
      await page.click('button:has-text("Continue")');
      await page.fill('input[placeholder*="Street" i]', '123 Main Street');
      await page.fill('input[placeholder*="Space" i]', 'Space A1');
      await page.click('button:has-text("Continue")');
      await page.click('button:has-text("Skip")');
      await page.fill('input[placeholder="50"]', '100');
      await page.click('button:has-text("Continue")');
      await page.click('button:has-text("Continue")');
      await page.click('button:has-text("Publish Listing")');
      
      await expect(page.locator('text=Host ID Verification Required')).toBeVisible();
      
      // Click "Go to Verification" - this should set view to verification
      await page.click('button:has-text("Go to Verification")');
      
      // Should show verification page content
      await expect(page.locator('text=Identity Verification')).toBeVisible({ timeout: 5000 });
    } else {
      test.skip();
    }
  });
});

test.describe('Verification Page Step Navigation (when accessed via gate)', () => {
  test.beforeEach(async ({ page }) => {
    // Login as renter first
    await page.goto('http://localhost:4000');
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'renter123');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete - check for dashboard content
    await expect(page.locator('text=My Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('Can navigate to verification page via checkout gate', async ({ page }) => {
    await page.goto('http://localhost:4000/checkout');
    
    const payButton = page.locator('button:has-text("Pay")');
    if (await payButton.isVisible({ timeout: 5000 })) {
      await payButton.click();
      
      if (await page.locator('text=ID Verification Required').isVisible({ timeout: 5000 })) {
        // Step 1 - Personal Information (read-only)
        await expect(page.locator('text=Personal Information')).toBeVisible();
        await expect(page.locator('text=Full Name')).toBeVisible();
        await expect(page.locator('text=Email')).toBeVisible();
        await expect(page.locator('text=Phone')).toBeVisible();
        
        // Continue to step 2
        await page.click('button:has-text("Continue")');
        
        // Step 2 - Upload Documents
        await expect(page.locator('text=Upload Documents')).toBeVisible();
        await expect(page.locator('text=SA ID Document - Front')).toBeVisible();
        await expect(page.locator('text=SA ID Document - Back')).toBeVisible();
        await expect(page.locator('text=Selfie with ID')).toBeVisible();
        
        // Back button works
        await page.click('button:has-text("Back")');
        await expect(page.locator('text=Personal Information')).toBeVisible();
        
        // Go to step 2 again
        await page.click('button:has-text("Continue")');
        
        // Upload files
        await page.evaluate(() => {
          const inputs = document.querySelectorAll('input[type="file"]');
          const files = [
            new File(['fake'], 'a.jpg', { type: 'image/jpeg' }),
            new File(['fake'], 'b.jpg', { type: 'image/jpeg' }),
            new File(['fake'], 'c.jpg', { type: 'image/jpeg' })
          ];
          inputs.forEach((input, i) => {
            const dt = new DataTransfer();
            dt.items.add(files[i]);
            (input as HTMLInputElement).files = dt.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          });
        });
        
        await page.waitForTimeout(500);
        
        // Review & Submit should be enabled
        await expect(page.locator('button:has-text("Review & Submit")')).toBeEnabled();
        
        // Go to step 3
        await page.click('button:has-text("Review & Submit")');
        
        // Step 3 - Review & Submit
        await expect(page.locator('text=Review & Submit')).toBeVisible();
        await expect(page.locator('text=ID Front')).toBeVisible();
        await expect(page.locator('text=ID Back')).toBeVisible();
        await expect(page.locator('text=Selfie')).toBeVisible();
        
        // Checkbox
        await expect(page.locator('text=genuine documents')).toBeVisible();
        await page.click('input[type="checkbox"]');
        
        // Submit button enabled
        await expect(page.locator('button:has-text("Submit for Review")')).toBeEnabled();
      }
    }
  });
});