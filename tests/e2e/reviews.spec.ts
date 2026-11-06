import { test, expect } from '@playwright/test';

test.describe('Review System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000');
  });

  test('Review prompt appears after completed booking', async ({ page }) => {
    // Login as renter
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'renter123');
    await page.click('button[type="submit"]');
    
    // Navigate to dashboard where review prompt should appear
    await expect(page).toHaveURL(/.*renter-dashboard/);
    
    // Check for review prompt modal
    await expect(page.locator('text=How was your stay?')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Rate your experience')).toBeVisible();
  });

  test('Review form - star rating selection', async ({ page }) => {
    await page.goto('http://localhost:4000');
    
    // Trigger review form (assuming there's a way to open it)
    // For testing, we'll check the component directly by navigating to a review page
    // or we can test the ReviewForm component in isolation
    
    // Check star rating interaction
    const stars = page.locator('[data-testid="star-rating"] button');
    await expect(stars.first()).toBeVisible();
    
    // Click 4th star
    await stars.nth(3).click();
    
    // Check that 4 stars are filled
    const filledStars = page.locator('[data-testid="star-rating"] button[aria-checked="true"]');
    await expect(filledStars).toHaveCount(4);
  });

  test('Review form - category ratings', async ({ page }) => {
    await page.goto('http://localhost:4000');
    
    // Check category rating inputs exist
    await expect(page.locator('text=Communication')).toBeVisible();
    await expect(page.locator('text=Cleanliness')).toBeVisible();
    await expect(page.locator('text=Safety')).toBeVisible();
    await expect(page.locator('text=Accuracy')).toBeVisible();
    
    // Each should have star rating
    const categoryStars = page.locator('[data-testid="category-rating"]');
    await expect(categoryStars).toHaveCount(4);
  });

  test('Review form - comment input', async ({ page }) => {
    await page.goto('http://localhost:4000');
    
    const commentInput = page.locator('textarea[placeholder*="comment" i]');
    await expect(commentInput).toBeVisible();
    
    await commentInput.fill('Great parking spot, very convenient!');
    await expect(commentInput).toHaveValue('Great parking spot, very convenient!');
  });

  test('Review form - public/private toggle', async ({ page }) => {
    await page.goto('http://localhost:4000');
    
    const publicToggle = page.locator('input[type="checkbox"]:near(:text("Public"))');
    await expect(publicToggle).toBeVisible();
    
    await publicToggle.click();
    await expect(publicToggle).toBeChecked();
  });

  test('Review form - submit button', async ({ page }) => {
    await page.goto('http://localhost:4000');
    
    // Fill required fields
    await page.click('[data-testid="star-rating"] button:nth-child(4)');
    await page.fill('textarea[placeholder*="comment" i]', 'Great experience!');
    
    const submitButton = page.locator('button:has-text("Submit Review")');
    await expect(submitButton).toBeEnabled();
    
    await submitButton.click();
    
    // Should show success or close modal
    await expect(page.locator('text=Review submitted')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Review Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000');
  });

  test('Review badge shows on listing cards', async ({ page }) => {
    // Login and search
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'renter123');
    await page.click('button[type="submit"]');
    
    await page.click('text=Search');
    await page.fill('input[placeholder*="estate" i]', 'Test Estate');
    await page.click('button:has-text("Search")');
    
    // Check for review badge on listing cards
    const reviewBadges = page.locator('[data-testid="review-badge"]');
    await expect(reviewBadges.first()).toBeVisible();
    
    // Badge should show rating and count
    await expect(reviewBadges.first()).toContainText(/\d\.\d/); // e.g., 4.5
    await expect(reviewBadges.first()).toContainText(/\(\d+\)/); // e.g., (12)
  });

  test('Review display on checkout page', async ({ page }) => {
    // Login and go through booking flow
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'renter123');
    await page.click('button[type="submit"]');
    
    await page.click('text=Search');
    await page.fill('input[placeholder*="estate" i]', 'Test Estate');
    await page.click('button:has-text("Search")');
    
    await page.click('[data-testid="listing-card"]');
    
    // On checkout page, check reviews section
    await expect(page.locator('text=Reviews')).toBeVisible();
    await expect(page.locator('[data-testid="review-display-checkout"]')).toBeVisible();
  });

  test('Review display variant - dashboard', async ({ page }) => {
    // Login as host
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'host@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'host123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*host-dashboard/);
    
    // Click reviews tab
    await page.click('button:has-text("Reviews")');
    
    // Check review display
    await expect(page.locator('[data-testid="review-display-dashboard"]')).toBeVisible();
    
    // Should show aggregate rating
    await expect(page.locator('text=average_rating')).toBeVisible();
  });
});

test.describe('Host Review Response', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000');
  });

  test('Host can respond to reviews on dashboard', async ({ page }) => {
    // Login as host
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'host@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'host123');
    await page.click('button[type="submit"]');
    
    await page.click('button:has-text("Reviews")');
    
    // Click view reviews on a listing
    await page.click('button:has-text("View Reviews")');
    
    // Check for respond button on reviews without host response
    const respondButtons = page.locator('button:has-text("Respond")');
    await expect(respondButtons.first()).toBeVisible();
    
    // Click respond
    await respondButtons.first().click();
    
    // Should show response input
    await expect(page.locator('textarea[placeholder*="response" i]')).toBeVisible();
    
    // Fill and submit response
    await page.fill('textarea[placeholder*="response" i]', 'Thank you for your feedback!');
    await page.click('button:has-text("Submit Response")');
    
    // Response should appear
    await expect(page.locator('text=Thank you for your feedback!')).toBeVisible();
  });
});

test.describe('Renter Dashboard Reviews Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000');
  });

  test('Renter can see reviews tab', async ({ page }) => {
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'renter123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*renter-dashboard/);
    
    // Check reviews tab exists
    await expect(page.locator('button:has-text("Reviews")')).toBeVisible();
  });

  test('Renter can write reviews for completed bookings', async ({ page }) => {
    await page.click('text=Log In');
    await page.fill('input[type="email"]', 'renter@parkbuddy.co.za');
    await page.fill('input[type="password"]', 'renter123');
    await page.click('button[type="submit"]');
    
    await page.click('button:has-text("Reviews")');
    
    // Check write reviews section
    await expect(page.locator('text=Write Reviews')).toBeVisible();
    
    // Should show reviewable bookings
    const reviewableBookings = page.locator('[data-testid="reviewable-booking"]');
    await expect(reviewableBookings.first()).toBeVisible();
    
    // Click write review
    await page.click('button:has-text("Write Review")');
    
    // Should open review form
    await expect(page.locator('text=Rate your experience')).toBeVisible();
  });
});