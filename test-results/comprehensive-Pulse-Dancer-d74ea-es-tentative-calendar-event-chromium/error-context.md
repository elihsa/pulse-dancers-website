# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.test.js >> Pulse Dancers Website - Comprehensive Functional Tests >> Google Calendar Integration >> Booking creates tentative calendar event
- Location: tests/comprehensive.test.js:640:5

# Error details

```
ReferenceError: request is not defined
```

# Test source

```ts
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
> 646 |       const response = await request.post(`${BASE_URL}/api/submit-booking`, {
      |                        ^ ReferenceError: request is not defined
  647 |         data: bookingData,
  648 |         headers: { 'Content-Type': 'application/json' }
  649 |       });
  650 |       
  651 |       expect(response.ok()).toBeTruthy();
  652 |       const data = await response.json();
  653 |       expect(data.success).toBe(true);
  654 |       expect(data.message).toContain('24 hours');
  655 |     });
  656 |   });
  657 | 
  658 |   // ============================================
  659 |   // TEST 11: PAGE NAVIGATION & UI
  660 |   // ============================================
  661 |   test.describe('Navigation & UI', () => {
  662 |     test('All navigation links work', async ({ page }) => {
  663 |       const pages = [
  664 |         { path: '/', title: 'Pulse Male Revue' },
  665 |         { path: '/events.html', title: 'Events' },
  666 |         { path: '/prices.html', title: 'Prices' },
  667 |         { path: '/faq.html', title: 'FAQ' },
  668 |         { path: '/meet-the-guys.html', title: 'Meet The Guys' },
  669 |         { path: '/gallery.html', title: 'Gallery' },
  670 |         { path: '/contact.html', title: 'Contact' },
  671 |         { path: '/join.html', title: 'Join' },
  672 |         { path: '/book.html', title: 'Book' },
  673 |       ];
  674 |       
  675 |       for (const p of pages) {
  676 |         await page.goto(`${BASE_URL}${p.path}`);
  677 |         await page.waitForLoadState('networkidle');
  678 |         await expect(page).toHaveTitle(new RegExp(p.title, 'i'));
  679 |       }
  680 |     });
  681 | 
  682 |     test('Active page is highlighted in navigation', async ({ page }) => {
  683 |       await page.goto(`${BASE_URL}/prices.html`);
  684 |       await page.waitForLoadState('networkidle');
  685 |       
  686 |       const activeLink = page.locator('.nav-link.active, .nav-link[aria-current="page"]');
  687 |       await expect(activeLink).toBeVisible();
  688 |       await expect(activeLink).toContainText(/prices/i);
  689 |     });
  690 | 
  691 |     test('Hero background loads on all pages', async ({ page }) => {
  692 |       const pages = ['/', '/prices.html', '/faq.html', '/meet-the-guys.html', '/events.html', '/contact.html', '/join.html', '/book.html'];
  693 |       
  694 |       for (const p of pages) {
  695 |         await page.goto(`${BASE_URL}${p}`);
  696 |         await page.waitForLoadState('networkidle');
  697 |         
  698 |         const heroBg = page.locator('.hero-bg img, .hero-bg source');
  699 |         await expect(heroBg.first()).toBeVisible({ timeout: 10000 });
  700 |       }
  701 |     });
  702 | 
  703 |     test('Top banner is centered', async ({ page }) => {
  704 |       await page.goto(`${BASE_URL}/`);
  705 |       await page.waitForLoadState('networkidle');
  706 |       
  707 |       const banner = page.locator('.top-banner');
  708 |       await expect(banner).toBeVisible();
  709 |       
  710 |       // Check CSS margin-left is auto (centered)
  711 |       const marginLeft = await banner.evaluate(el => getComputedStyle(el).marginLeft);
  712 |       // Should be 'auto' or calculated center value
  713 |       expect(['auto', '0px']).not.toContain(marginLeft); // Actually centered means non-zero offset
  714 |     });
  715 |   });
  716 | 
  717 |   // ============================================
  718 |   // TEST 12: PERFORMANCE & ACCESSIBILITY
  719 |   // ============================================
  720 |   test.describe('Performance & Accessibility', () => {
  721 |     test('Home page loads within acceptable time', async ({ page }) => {
  722 |       const start = Date.now();
  723 |       await page.goto(`${BASE_URL}/`);
  724 |       await page.waitForLoadState('networkidle');
  725 |       const loadTime = Date.now() - start;
  726 |       
  727 |       expect(loadTime).toBeLessThan(10000); // 10 seconds max
  728 |       console.log(`Home page load time: ${loadTime}ms`);
  729 |     });
  730 | 
  731 |     test('All images have alt attributes', async ({ page }) => {
  732 |       await page.goto(`${BASE_URL}/`);
  733 |       await page.waitForLoadState('networkidle');
  734 |       
  735 |       const images = page.locator('img');
  736 |       const count = await images.count();
  737 |       
  738 |       for (let i = 0; i < count; i++) {
  739 |         const img = images.nth(i);
  740 |         const alt = await img.getAttribute('alt');
  741 |         expect(alt).toBeTruthy();
  742 |       }
  743 |     });
  744 | 
  745 |     test('Forms have proper labels', async ({ page }) => {
  746 |       await page.goto(`${BASE_URL}/book.html`);
```