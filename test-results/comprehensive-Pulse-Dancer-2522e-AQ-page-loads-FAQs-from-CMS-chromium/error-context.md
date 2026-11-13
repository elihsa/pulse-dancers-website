# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.test.js >> Pulse Dancers Website - Comprehensive Functional Tests >> CMS Data Loading >> FAQ page loads FAQs from CMS
- Location: tests/comprehensive.test.js:467:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.accordion, #faq-container, .faq-list').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.accordion, #faq-container, .faq-list').first() with timeout 5000ms
  - waiting for locator('.accordion, #faq-container, .faq-list').first()

```

```yaml
- img "Pulse Male Revue Top Banner"
- banner:
  - link:
    - /url: index.html
  - list:
    - listitem:
      - link "Home":
        - /url: index.html
    - listitem:
      - link "Events":
        - /url: events.html
    - listitem:
      - link "Prices":
        - /url: prices.html
    - listitem:
      - link "FAQ":
        - /url: faq.html
    - listitem:
      - link "Meet The Guys":
        - /url: meet-the-guys.html
    - listitem:
      - link "Join":
        - /url: join.html
    - listitem:
      - link "Gallery":
        - /url: gallery.html
    - listitem:
      - link "Contact":
        - /url: contact.html
    - listitem:
      - link "Book Now":
        - /url: book.html
- main:
  - heading "Frequently Asked Questions" [level=1]
  - paragraph: Find answers to common questions about our services, pricing, and booking process.
  - strong: Are you guys strippers?
  - text: +
  - strong: How far in advance should I book?
  - text: +
  - strong: Do you have refunds?
  - text: +
  - strong: Do you perform corporate events?
  - text: +
  - strong: What is included in the booking?
  - text: +
  - strong: Are you a club?
  - text: +
  - strong: What are naughty games?
  - text: +
  - strong: Can dancers interact with guests?
  - text: +
  - strong: Do you require a private space?
  - text: +
  - strong: Can you perform at restaurants and other public places?
  - text: +
  - strong: Do you offer group discounts?
  - text: +
  - strong: Can we have the performance in private homes?
  - text: +
  - strong: What's included in travel costs?
  - text: +
  - strong: What's the difference between a '2 Man Show' and '2 solo male strippers'?
  - text: +
  - strong: Do you provide stage or platform?
  - text: +
  - strong: Can we extend the performance?
  - text: +
  - strong: Can we combine with catering?
  - text: +
  - strong: How experienced are your dancers?
  - text: +
  - strong: What size groups do you handle?
  - text: +
  - strong: Do you provide transportation?
  - text: +
  - strong: Can we livestream the event?
  - text: +
  - strong: Can dancers do pole dancing?
  - text: +
  - strong: How do we book?
  - text: +
  - strong: What makes your service unique?
  - text: +
  - strong: Do the rates include travel or accommodation?
  - text: +
  - strong: What do I need for a show?
  - text: +
  - heading "Still have questions?" [level=3]
  - paragraph: Contact us directly or submit a booking request for a personalized consultation.
  - link "Book Now":
    - /url: book.html
  - link "Email Us":
    - /url: mailto:info@pulsedancers.com
- contentinfo:
  - text: © 2026 Pulse Male Revue - South Africa.
  - link "info@pulsedancers.com":
    - /url: mailto:info@pulsedancers.com
  - text: ·
  - link "Facebook":
    - /url: https://www.facebook.com/pulseSouthAfrica
  - text: ·
  - link "Instagram":
    - /url: https://www.instagram.com/pulsesouthafrica
```

# Test source

```ts
  372 |     const result = await response.json();
  373 |     
  374 |     expect(result.success).toBe(true);
  375 |     expect(result.message).toContain('Application submitted');
  376 |     
  377 |     // Verify sheet entry (skip if no API key)
  378 |     const sheetResult = await waitForSheetEntry('JOIN_APPLICATIONS', joinData.firstName, 1);
  379 |     if (sheetResult.reason !== 'No API key') {
  380 |       expect(sheetResult.verified).toBe(true);
  381 |       console.log('✅ Join application verified in Google Sheets');
  382 |     } else {
  383 |       console.log('⚠️ Sheet verification skipped (no API key)');
  384 |     }
  385 |   });
  386 | 
  387 |   // ============================================
  388 |   // TEST 5: API ENDPOINTS HEALTH CHECKS
  389 |   // ============================================
  390 |   test.describe('API Endpoint Health', () => {
  391 |     test('GET /api/sheets?sheetName=BOOKINGS returns 200', async ({ request }) => {
  392 |       const response = await request.get(`${BASE_URL}/api/sheets?sheetName=BOOKINGS`);
  393 |       expect(response.ok()).toBeTruthy();
  394 |       const data = await response.json();
  395 |       expect(data.values).toBeDefined();
  396 |       expect(Array.isArray(data.values)).toBeTruthy();
  397 |     });
  398 | 
  399 |     test('GET /api/sheets?sheetName=TESTIMONIALS returns 200', async ({ request }) => {
  400 |       const response = await request.get(`${BASE_URL}/api/sheets?sheetName=TESTIMONIALS`);
  401 |       expect(response.ok()).toBeTruthy();
  402 |     });
  403 | 
  404 |     test('GET /api/sheets?sheetName=DANCERS returns 200 with performer data', async ({ request }) => {
  405 |       const response = await request.get(`${BASE_URL}/api/sheets?sheetName=DANCERS`);
  406 |       expect(response.ok()).toBeTruthy();
  407 |       const data = await response.json();
  408 |       expect(data.values).toBeDefined();
  409 |       expect(data.values.length).toBeGreaterThan(1); // Header + data
  410 |     });
  411 | 
  412 |     test('POST /api/submit-booking returns 400 for invalid data', async ({ request }) => {
  413 |       const response = await request.post(`${BASE_URL}/api/submit-booking`, {
  414 |         data: { name: 'Test' }, // Missing required fields
  415 |         headers: { 'Content-Type': 'application/json' }
  416 |       });
  417 |       expect(response.status()).toBe(400);
  418 |       const data = await response.json();
  419 |       expect(data.error).toBeDefined();
  420 |     });
  421 | 
  422 |     test('POST /api/submit-testimonial returns 400 for missing fields', async ({ request }) => {
  423 |       const response = await request.post(`${BASE_URL}/api/submit-testimonial`, {
  424 |         data: { name: 'Test' },
  425 |         headers: { 'Content-Type': 'application/json' }
  426 |       });
  427 |       expect(response.status()).toBe(400);
  428 |     });
  429 |   });
  430 | 
  431 |   // ============================================
  432 |   // TEST 6: CMS DATA LOADING
  433 |   // ============================================
  434 |   test.describe('CMS Data Loading', () => {
  435 |     test('Home page loads testimonials from CMS', async ({ page }) => {
  436 |       await page.goto(`${BASE_URL}/`);
  437 |       await page.waitForLoadState('networkidle');
  438 |       
  439 |       // Check if testimonials container exists
  440 |       const container = page.locator('#testimonials-container');
  441 |       await expect(container).toBeVisible();
  442 |       
  443 |       // Wait for CMS data to load (should have testimonials)
  444 |       await page.waitForTimeout(3000);
  445 |       
  446 |       // Check if testimonials are rendered (not just loading message)
  447 |       const testimonials = container.locator('[style*="background-color"]');
  448 |       const count = await testimonials.count();
  449 |       expect(count).toBeGreaterThanOrEqual(0); // May be 0 if no approved testimonials
  450 |     });
  451 | 
  452 |     test('Prices page loads pricing from CMS', async ({ page }) => {
  453 |       await page.goto(`${BASE_URL}/prices.html`);
  454 |       await page.waitForLoadState('networkidle');
  455 |       
  456 |       const tbody = page.locator('#pricing-table-body');
  457 |       await expect(tbody).toBeVisible();
  458 |       
  459 |       // Wait for data to load
  460 |       await page.waitForTimeout(3000);
  461 |       
  462 |       const rows = tbody.locator('tr');
  463 |       const count = await rows.count();
  464 |       expect(count).toBeGreaterThan(0);
  465 |     });
  466 | 
  467 |     test('FAQ page loads FAQs from CMS', async ({ page }) => {
  468 |       await page.goto(`${BASE_URL}/faq.html`);
  469 |       await page.waitForLoadState('networkidle');
  470 |       
  471 |       const faqContainer = page.locator('.accordion, #faq-container, .faq-list');
> 472 |       await expect(faqContainer.first()).toBeVisible();
      |                                          ^ Error: expect(locator).toBeVisible() failed
  473 |       
  474 |       await page.waitForTimeout(3000);
  475 |       const items = page.locator('.accordion-item, .faq-item');
  476 |       const count = await items.count();
  477 |       expect(count).toBeGreaterThanOrEqual(0);
  478 |     });
  479 | 
  480 |     test('Meet the guys page loads performers with photos', async ({ page }) => {
  481 |       await page.goto(`${BASE_URL}/meet-the-guys.html`);
  482 |       await page.waitForLoadState('networkidle');
  483 |       
  484 |       const grid = page.locator('#performers-grid');
  485 |       await expect(grid).toBeVisible();
  486 |       
  487 |       await page.waitForTimeout(3000);
  488 |       
  489 |       const cards = grid.locator('.performer-card');
  490 |       const count = await cards.count();
  491 |       expect(count).toBeGreaterThan(0);
  492 |       
  493 |       // Check that photos are loaded
  494 |       const photos = grid.locator('.performer-photo');
  495 |       const photoCount = await photos.count();
  496 |       expect(photoCount).toBeGreaterThan(0);
  497 |       
  498 |       // Check gallery thumbnails
  499 |       const thumbs = grid.locator('.performer-thumb');
  500 |       const thumbCount = await thumbs.count();
  501 |       // At least some performers should have multiple photos
  502 |       expect(thumbCount).toBeGreaterThanOrEqual(count);
  503 |     });
  504 | 
  505 |     test('Events page loads events from CMS', async ({ page }) => {
  506 |       await page.goto(`${BASE_URL}/events.html`);
  507 |       await page.waitForLoadState('networkidle');
  508 |       
  509 |       const container = page.locator('#events-container');
  510 |       await expect(container).toBeVisible();
  511 |       
  512 |       await page.waitForTimeout(3000);
  513 |       
  514 |       const events = container.locator('.event-card, .event-item');
  515 |       const count = await events.count();
  516 |       expect(count).toBeGreaterThanOrEqual(0);
  517 |     });
  518 | 
  519 |     test('Home page loads social links from CMS', async ({ page }) => {
  520 |       await page.goto(`${BASE_URL}/`);
  521 |       await page.waitForLoadState('networkidle');
  522 |       
  523 |       // Check social links section
  524 |       const socialSection = page.locator('#social-links, .social-links');
  525 |       await expect(socialSection).toBeVisible();
  526 |       
  527 |       await page.waitForTimeout(2000);
  528 |       
  529 |       const links = socialSection.locator('a');
  530 |       const count = await links.count();
  531 |       expect(count).toBeGreaterThan(0);
  532 |     });
  533 |   });
  534 | 
  535 |   // ============================================
  536 |   // TEST 7: FORM VALIDATION
  537 |   // ============================================
  538 |   test.describe('Form Validation', () => {
  539 |     test('Booking form rejects empty required fields', async ({ page }) => {
  540 |       await page.goto(`${BASE_URL}/book.html`);
  541 |       await page.waitForLoadState('networkidle');
  542 |       
  543 |       // Try to submit empty form
  544 |       await page.click('button[type="submit"]');
  545 |       
  546 |       // Should show validation errors
  547 |       const errors = page.locator('.form-error, [aria-invalid="true"], .error-message');
  548 |       await expect(errors.first()).toBeVisible({ timeout: 5000 });
  549 |     });
  550 | 
  551 |     test('Testimonial form requires name, area, rating, message', async ({ page }) => {
  552 |       await page.goto(`${BASE_URL}/`);
  553 |       await page.waitForLoadState('networkidle');
  554 |       
  555 |       await page.locator('#review-form').scrollIntoViewIfNeeded();
  556 |       await page.click('#review-form button[type="submit"]');
  557 |       
  558 |       // Should show alert or validation
  559 |       await page.waitForTimeout(1000);
  560 |       // The form uses alert() for validation - check page didn't crash
  561 |       await expect(page.locator('#review-form')).toBeVisible();
  562 |     });
  563 | 
  564 |     test('Contact form validates email format', async ({ page }) => {
  565 |       await page.goto(`${BASE_URL}/contact.html`);
  566 |       await page.waitForLoadState('networkidle');
  567 |       
  568 |       await page.fill('#contact-email', 'invalid-email');
  569 |       await page.fill('#contact-name', 'Test');
  570 |       await page.fill('#contact-subject', 'Test');
  571 |       await page.fill('#contact-message', 'Test');
  572 |       await page.click('#contactForm button[type="submit"]');
```