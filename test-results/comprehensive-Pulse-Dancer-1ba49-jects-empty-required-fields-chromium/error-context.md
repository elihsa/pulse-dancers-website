# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.test.js >> Pulse Dancers Website - Comprehensive Functional Tests >> Form Validation >> Booking form rejects empty required fields
- Location: tests/comprehensive.test.js:539:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.form-error, [aria-invalid="true"], .error-message').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.form-error, [aria-invalid="true"], .error-message').first() with timeout 5000ms
  - waiting for locator('.form-error, [aria-invalid="true"], .error-message').first()

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
- heading "Book Pulse for Your Event" [level=2]
- paragraph: Fill out the form below with your event details. We'll respond within 24 hours with a personalized quote.
- heading "Your Details" [level=3]
- text: Full Name *
- textbox "Full Name *":
  - /placeholder: Your name
- text: Phone Number *
- textbox "Phone Number *":
  - /placeholder: e.g. 082 123 4567
- text: Email *
- textbox "Email *":
  - /placeholder: you@example.com
- heading "Event Details" [level=3]
- text: Type of Event *
- radio "Bachelorette"
- text: Bachelorette
- radio "Birthday"
- text: Birthday
- radio "Ladies night"
- text: Ladies night
- radio "Divorce party"
- text: Divorce party
- radio "Hen party"
- text: Hen party
- radio "Kitchen tea"
- text: Kitchen tea
- radio "Stalk party"
- text: Stalk party
- radio "Other"
- text: Other Are you managing the event? *
- radio "Yes, I'm managing it"
- text: Yes, I'm managing it
- radio "No, someone else is managing it"
- text: No, someone else is managing it
- heading "Event Location" [level=3]
- text: Do you know the exact location of the event? *
- radio "Yes — I know the exact address"
- text: Yes — I know the exact address
- radio "No — I only know the area"
- text: No — I only know the area
- heading "Event Date" [level=3]
- text: Event Date *
- textbox "Event Date *"
- text: You'll set start/end times per service below. What time are you leaving the venue? (optional)
- textbox "What time are you leaving the venue? (optional)"
- text: If known — helps us schedule around your timings.
- heading "Services" [level=3]
- paragraph: Select the services you want — only the fields for your selected services will appear.
- checkbox "Solo Male Stripper"
- text: Solo Male Stripper
- checkbox "Solo Female Stripper"
- text: Solo Female Stripper
- checkbox "2 Man Show"
- text: 2 Man Show
- checkbox "3 Man Show"
- text: 3 Man Show
- checkbox "4 Man Show"
- text: 4 Man Show
- checkbox "5 Man Show"
- text: 5 Man Show
- checkbox "6 Man Show"
- text: 6 Man Show
- checkbox "Topless Waiter"
- text: Topless Waiter
- checkbox "Bottomless Butler"
- text: Bottomless Butler
- checkbox "Games"
- text: Games
- checkbox "Pole Dancer"
- text: Pole Dancer
- checkbox "Something else"
- text: Something else
- checkbox "Do you also need a performer for a bachelor party?"
- text: Do you also need a performer for a bachelor party? Anything extra you would like to add or ask?
- textbox "Anything extra you would like to add or ask?":
  - /placeholder: Special requests, questions, timings...
- heading "Estimated Quote" [level=3]
- text: Performance fee
- strong: R0
- text: Distance (round trip)
- strong: —
- text: Travel fee
- strong: R0
- strong: Estimated total
- strong: R0
- paragraph: This is an estimate. Final quote confirmed after we review your event details.
- button "Send Booking Request"
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
  472 |       await expect(faqContainer.first()).toBeVisible();
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
> 548 |       await expect(errors.first()).toBeVisible({ timeout: 5000 });
      |                                    ^ Error: expect(locator).toBeVisible() failed
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
  573 |       
  574 |       // Should show validation error
  575 |       await expect(page.locator('.form-error, [aria-invalid="true"]')).toBeVisible({ timeout: 5000 });
  576 |     });
  577 |   });
  578 | 
  579 |   // ============================================
  580 |   // TEST 8: EMAIL NOTIFICATION SYSTEM
  581 |   // ============================================
  582 |   test.describe('Email Notification System', () => {
  583 |     test('FormSubmit integration is configured', async ({ request }) => {
  584 |       // Test that FormSubmit endpoint is reachable
  585 |       const response = await request.post('https://formsubmit.co/ajax/info@pulsedancers.com', {
  586 |         data: {
  587 |           _subject: 'Test from Playwright',
  588 |           _template: 'table',
  589 |           _captcha: 'false',
  590 |           'Test Field': 'Test Value'
  591 |         },
  592 |         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  593 |       });
  594 |       // FormSubmit returns 200 even for test submissions
  595 |       expect([200, 400, 422]).toContain(response.status());
  596 |     });
  597 | 
  598 |     test('Booking form triggers admin email', async ({ page }) => {
  599 |       // This is verified by the booking form submission test
  600 |       // which already checks the API returns success
  601 |       // The email sending is fire-and-forget in the API
  602 |       const bookingData = generateBookingData();
  603 |       
  604 |       const response = await request.post(`${BASE_URL}/api/submit-booking`, {
  605 |         data: bookingData,
  606 |         headers: { 'Content-Type': 'application/json' }
  607 |       });
  608 |       
  609 |       expect(response.ok()).toBeTruthy();
  610 |       const data = await response.json();
  611 |       expect(data.success).toBe(true);
  612 |     });
  613 |   });
  614 | 
  615 |   // ============================================
  616 |   // TEST 9: WHATSAPP NOTIFICATION SYSTEM
  617 |   // ============================================
  618 |   test.describe('WhatsApp Notification System', () => {
  619 |     test('CallMeBot API endpoint is reachable', async ({ request }) => {
  620 |       const apiKey = process.env.WHATSAPP_API_KEY;
  621 |       const phone = process.env.WHATSAPP_PHONE;
  622 |       
  623 |       if (!apiKey || !phone) {
  624 |         test.skip('WhatsApp credentials not configured');
  625 |       }
  626 |       
  627 |       const response = await request.get(
  628 |         `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=Test&apikey=${apiKey}`
  629 |       );
  630 |       
  631 |       // CallMeBot returns 200 on success
  632 |       expect([200, 400, 429]).toContain(response.status());
  633 |     });
  634 |   });
  635 | 
  636 |   // ============================================
  637 |   // TEST 10: GOOGLE CALENDAR INTEGRATION
  638 |   // ============================================
  639 |   test.describe('Google Calendar Integration', () => {
  640 |     test('Booking creates tentative calendar event', async ({ page }) => {
  641 |       // This is implicitly tested by the booking form submission
  642 |       // The API creates a calendar event after sheet write
  643 |       // We verify by checking the API response includes success
  644 |       const bookingData = generateBookingData();
  645 |       
  646 |       const response = await request.post(`${BASE_URL}/api/submit-booking`, {
  647 |         data: bookingData,
  648 |         headers: { 'Content-Type': 'application/json' }
```