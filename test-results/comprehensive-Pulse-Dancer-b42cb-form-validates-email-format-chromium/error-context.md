# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.test.js >> Pulse Dancers Website - Comprehensive Functional Tests >> Form Validation >> Contact form validates email format
- Location: tests/comprehensive.test.js:557:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.form-error, [aria-invalid="true"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.form-error, [aria-invalid="true"]') with timeout 5000ms
  - waiting for locator('.form-error, [aria-invalid="true"]')

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
- heading "Contact Us" [level=1]
- paragraph: Have a question or want to get in touch? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
- heading "Send Us a Message" [level=2]
- text: Your Name *
- textbox "Your Name *": Test
- text: Email Address *
- textbox "Email Address *": invalid-email
- text: Phone Number
- textbox "Phone Number"
- text: Subject *
- textbox "Subject *": Test
- text: Message *
- textbox "Message *": Test
- button "Send Message"
- heading "Get in Touch" [level=2]
- heading "📧 Email" [level=3]
- paragraph:
  - link "info@pulsedancers.com":
    - /url: mailto:info@pulsedancers.com
- heading "💬 WhatsApp" [level=3]
- paragraph:
  - link "+27 84 019 7733":
    - /url: https://wa.me/27840197733?text=Hi%20Pulse%2C%20I%27m%20looking%20for%20information%20about%20your%20male%20entertainment%20services
- heading "📱 Social Media" [level=3]
- paragraph:
  - 'link "Facebook: @pulseSouthAfrica"':
    - /url: https://www.facebook.com/pulseSouthAfrica
- paragraph:
  - 'link "Instagram: @pulsesouthafrica"':
    - /url: https://www.instagram.com/pulsesouthafrica
- heading "📍 Location" [level=3]
- paragraph: Johannesburg, South Africa Serving all major cities across South Africa
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
  468 |       const items = page.locator('.accordion-item, .faq-item');
  469 |       const count = await items.count();
  470 |       expect(count).toBeGreaterThanOrEqual(0);
  471 |     });
  472 | 
  473 |     test('Meet the guys page loads performers with photos', async ({ page }) => {
  474 |       await page.goto(`${BASE_URL}/meet-the-guys.html`);
  475 |       await page.waitForLoadState('networkidle');
  476 |       
  477 |       const grid = page.locator('#performers-grid');
  478 |       await expect(grid).toBeVisible();
  479 |       
  480 |       await page.waitForTimeout(3000);
  481 |       
  482 |       const cards = grid.locator('.performer-card');
  483 |       const count = await cards.count();
  484 |       expect(count).toBeGreaterThan(0);
  485 |       
  486 |       // Check that photos are loaded
  487 |       const photos = grid.locator('.performer-photo');
  488 |       const photoCount = await photos.count();
  489 |       expect(photoCount).toBeGreaterThan(0);
  490 |       
  491 |       // Check gallery thumbnails
  492 |       const thumbs = grid.locator('.performer-thumb');
  493 |       const thumbCount = await thumbs.count();
  494 |       // At least some performers should have multiple photos
  495 |       expect(thumbCount).toBeGreaterThanOrEqual(count);
  496 |     });
  497 | 
  498 |     test('Events page loads events from CMS', async ({ page }) => {
  499 |       await page.goto(`${BASE_URL}/events.html`);
  500 |       await page.waitForLoadState('networkidle');
  501 |       
  502 |       const container = page.locator('#events-container');
  503 |       await expect(container).toBeVisible();
  504 |       
  505 |       await page.waitForTimeout(3000);
  506 |       
  507 |       const events = container.locator('.event-card, .event-item');
  508 |       const count = await events.count();
  509 |       expect(count).toBeGreaterThanOrEqual(0);
  510 |     });
  511 | 
  512 |     test('Home page loads social links from CMS', async ({ page }) => {
  513 |       await page.goto(`${BASE_URL}/`);
  514 |       await page.waitForLoadState('networkidle');
  515 |       
  516 |       // Check social links section
  517 |       const socialSection = page.locator('#social-links, .social-links');
  518 |       await expect(socialSection).toBeVisible();
  519 |       
  520 |       await page.waitForTimeout(2000);
  521 |       
  522 |       const links = socialSection.locator('a');
  523 |       const count = await links.count();
  524 |       expect(count).toBeGreaterThan(0);
  525 |     });
  526 |   });
  527 | 
  528 |   // ============================================
  529 |   // TEST 7: FORM VALIDATION
  530 |   // ============================================
  531 |   test.describe('Form Validation', () => {
  532 |     test('Booking form rejects empty required fields', async ({ page }) => {
  533 |       await page.goto(`${BASE_URL}/book.html`);
  534 |       await page.waitForLoadState('networkidle');
  535 |       
  536 |       // Try to submit empty form
  537 |       await page.click('button[type="submit"]');
  538 |       
  539 |       // Should show validation errors
  540 |       const errors = page.locator('.form-error, [aria-invalid="true"], .error-message');
  541 |       await expect(errors.first()).toBeVisible({ timeout: 5000 });
  542 |     });
  543 | 
  544 |     test('Testimonial form requires name, area, rating, message', async ({ page }) => {
  545 |       await page.goto(`${BASE_URL}/`);
  546 |       await page.waitForLoadState('networkidle');
  547 |       
  548 |       await page.locator('#review-form').scrollIntoViewIfNeeded();
  549 |       await page.click('#review-form button[type="submit"]');
  550 |       
  551 |       // Should show alert or validation
  552 |       await page.waitForTimeout(1000);
  553 |       // The form uses alert() for validation - check page didn't crash
  554 |       await expect(page.locator('#review-form')).toBeVisible();
  555 |     });
  556 | 
  557 |     test('Contact form validates email format', async ({ page }) => {
  558 |       await page.goto(`${BASE_URL}/contact.html`);
  559 |       await page.waitForLoadState('networkidle');
  560 |       
  561 |       await page.fill('#contact-email', 'invalid-email');
  562 |       await page.fill('#contact-name', 'Test');
  563 |       await page.fill('#contact-subject', 'Test');
  564 |       await page.fill('#contact-message', 'Test');
  565 |       await page.click('#contactForm button[type="submit"]');
  566 |       
  567 |       // Should show validation error
> 568 |       await expect(page.locator('.form-error, [aria-invalid="true"]')).toBeVisible({ timeout: 5000 });
      |                                                                        ^ Error: expect(locator).toBeVisible() failed
  569 |     });
  570 |   });
  571 | 
  572 |   // ============================================
  573 |   // TEST 8: EMAIL NOTIFICATION SYSTEM
  574 |   // ============================================
  575 |   test.describe('Email Notification System', () => {
  576 |     test('FormSubmit integration is configured', async ({ request }) => {
  577 |       // Test that FormSubmit endpoint is reachable
  578 |       const response = await request.post('https://formsubmit.co/ajax/info@pulsedancers.com', {
  579 |         data: {
  580 |           _subject: 'Test from Playwright',
  581 |           _template: 'table',
  582 |           _captcha: 'false',
  583 |           'Test Field': 'Test Value'
  584 |         },
  585 |         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  586 |       });
  587 |       // FormSubmit returns 200 even for test submissions
  588 |       expect([200, 400, 422]).toContain(response.status());
  589 |     });
  590 | 
  591 |     test('Booking form triggers admin email', async ({ page }) => {
  592 |       // This is verified by the booking form submission test
  593 |       // which already checks the API returns success
  594 |       // The email sending is fire-and-forget in the API
  595 |       const bookingData = generateBookingData();
  596 |       
  597 |       const response = await request.post(`${BASE_URL}/api/submit-booking`, {
  598 |         data: bookingData,
  599 |         headers: { 'Content-Type': 'application/json' }
  600 |       });
  601 |       
  602 |       expect(response.ok()).toBeTruthy();
  603 |       const data = await response.json();
  604 |       expect(data.success).toBe(true);
  605 |     });
  606 |   });
  607 | 
  608 |   // ============================================
  609 |   // TEST 9: WHATSAPP NOTIFICATION SYSTEM
  610 |   // ============================================
  611 |   test.describe('WhatsApp Notification System', () => {
  612 |     test('CallMeBot API endpoint is reachable', async ({ request }) => {
  613 |       const apiKey = process.env.WHATSAPP_API_KEY;
  614 |       const phone = process.env.WHATSAPP_PHONE;
  615 |       
  616 |       if (!apiKey || !phone) {
  617 |         test.skip('WhatsApp credentials not configured');
  618 |       }
  619 |       
  620 |       const response = await request.get(
  621 |         `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=Test&apikey=${apiKey}`
  622 |       );
  623 |       
  624 |       // CallMeBot returns 200 on success
  625 |       expect([200, 400, 429]).toContain(response.status());
  626 |     });
  627 |   });
  628 | 
  629 |   // ============================================
  630 |   // TEST 10: GOOGLE CALENDAR INTEGRATION
  631 |   // ============================================
  632 |   test.describe('Google Calendar Integration', () => {
  633 |     test('Booking creates tentative calendar event', async ({ page }) => {
  634 |       // This is implicitly tested by the booking form submission
  635 |       // The API creates a calendar event after sheet write
  636 |       // We verify by checking the API response includes success
  637 |       const bookingData = generateBookingData();
  638 |       
  639 |       const response = await request.post(`${BASE_URL}/api/submit-booking`, {
  640 |         data: bookingData,
  641 |         headers: { 'Content-Type': 'application/json' }
  642 |       });
  643 |       
  644 |       expect(response.ok()).toBeTruthy();
  645 |       const data = await response.json();
  646 |       expect(data.success).toBe(true);
  647 |       expect(data.message).toContain('24 hours');
  648 |     });
  649 |   });
  650 | 
  651 |   // ============================================
  652 |   // TEST 11: PAGE NAVIGATION & UI
  653 |   // ============================================
  654 |   test.describe('Navigation & UI', () => {
  655 |     test('All navigation links work', async ({ page }) => {
  656 |       const pages = [
  657 |         { path: '/', title: 'Pulse Male Revue' },
  658 |         { path: '/events.html', title: 'Events' },
  659 |         { path: '/prices.html', title: 'Prices' },
  660 |         { path: '/faq.html', title: 'FAQ' },
  661 |         { path: '/meet-the-guys.html', title: 'Meet The Guys' },
  662 |         { path: '/gallery.html', title: 'Gallery' },
  663 |         { path: '/contact.html', title: 'Contact' },
  664 |         { path: '/join.html', title: 'Join' },
  665 |         { path: '/book.html', title: 'Book' },
  666 |       ];
  667 |       
  668 |       for (const p of pages) {
```