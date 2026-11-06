import { test, expect } from '@playwright/test';

test.describe('New Features - v1.1.0', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Footer exists on landing page', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('ParkBuddy SA');
  });

  test('Can navigate to login view from landing page', async ({ page }) => {
    await page.click('header button:has-text("Log In")');
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=Welcome Back')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('Can navigate to register view via login page toggle', async ({ page }) => {
    await page.click('header button:has-text("Log In")');
    await page.waitForTimeout(500);
    
    await page.click('text="Don\'t have an account? Sign up"');
    await page.waitForTimeout(500);
    
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
    await expect(page.locator('input[name="full_name"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
  });

  test('Login form validation works', async ({ page }) => {
    await page.click('header button:has-text("Log In")');
    await page.waitForTimeout(500);
    
    await page.click('button:has-text("Log In")');
    await page.waitForTimeout(500);
    
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('Register form phone validation', async ({ page }) => {
    await page.click('header button:has-text("Log In")');
    await page.waitForTimeout(500);
    
    await page.click('text="Don\'t have an account? Sign up"');
    await page.waitForTimeout(500);
    
    await page.fill('input[name="full_name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="phone"]', '123');
    
    await page.click('button:has-text("Create Account")');
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=/Enter a valid SA phone number/i')).toBeVisible({ timeout: 5000 });
  });

  test('Register form accepts valid SA phone', async ({ page }) => {
    await page.click('header button:has-text("Log In")');
    await page.waitForTimeout(500);
    
    await page.click('text="Don\'t have an account? Sign up"');
    await page.waitForTimeout(500);
    
    await page.fill('input[name="full_name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="phone"]', '0825550000');
    
    await page.click('button:has-text("Create Account")');
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=/Enter a valid SA phone number/i')).not.toBeVisible({ timeout: 5000 });
  });

  test('Register form name validation', async ({ page }) => {
    await page.click('header button:has-text("Log In")');
    await page.waitForTimeout(500);
    
    await page.click('text="Don\'t have an account? Sign up"');
    await page.waitForTimeout(500);
    
    await page.fill('input[name="full_name"]', 'A');
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="phone"]', '0825550000');
    
    await page.click('button:has-text("Create Account")');
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=/Name must be at least 2 characters/i')).toBeVisible({ timeout: 5000 });
  });

  // Note: Email validation is handled by browser HTML5 validation (type="email")
  // Custom validation runs on submit but browser prevents submit for invalid email

  test('Demo account buttons present on login form', async ({ page }) => {
    await page.click('header button:has-text("Log In")');
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=renter@parkbuddy.co.za')).toBeVisible();
    await expect(page.locator('text=host@parkbuddy.co.za')).toBeVisible();
    await expect(page.locator('text=both@parkbuddy.co.za')).toBeVisible();
  });

  test('Role selection on register form', async ({ page }) => {
    await page.click('header button:has-text("Log In")');
    await page.waitForTimeout(500);
    
    await page.click('text="Don\'t have an account? Sign up"');
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=Rent Parking')).toBeVisible();
    await expect(page.locator('text=List My Bay')).toBeVisible();
    await expect(page.locator('text=Both')).toBeVisible();
  });

  test('Can switch between login and register', async ({ page }) => {
    await page.click('header button:has-text("Log In")');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Welcome Back')).toBeVisible();
    
    await page.click('text="Don\'t have an account? Sign up"');
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
    
    await page.click('text="Already have an account? Log in"');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Welcome Back')).toBeVisible();
  });

  test('Login form toggles password visibility', async ({ page }) => {
    await page.click('header button:has-text("Log In")');
    await page.waitForTimeout(500);
    
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    await page.click('button[aria-label*="password"], button:has(svg.lucide-eye)');
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });
});

test.describe('Protected Pages Require Auth', () => {
  test('Search page shows landing when not authenticated', async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Rent Parking Bays in Your Estate')).toBeVisible();
  });

  test('Dashboard page shows landing when not authenticated', async ({ page }) => {
    await page.goto('/renter-dashboard');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Rent Parking Bays in Your Estate')).toBeVisible();
  });
});

test.describe('Forgot Password Flow', () => {
  test('Forgot password link navigates to forgot password view', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.click('header button:has-text("Log In")');
    await page.waitForTimeout(500);
    
    await page.click('text="Forgot password?"');
    await page.waitForTimeout(2000);
    
    // Forgot password view shows "Forgot Password?" with question mark
    await expect(page.locator('text=Forgot Password?')).toBeVisible();
    
    // Input has placeholder but no name attribute
    await expect(page.locator('input[placeholder="you@email.co.za"]')).toBeVisible();
    await expect(page.locator('button:has-text("Send Reset Link")')).toBeVisible();
  });
});