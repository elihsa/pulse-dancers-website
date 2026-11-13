# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.test.js >> Pulse Dancers Website - Comprehensive Functional Tests >> Navigation & UI >> Hero background loads on all pages
- Location: tests/comprehensive.test.js:691:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('.hero-bg img, .hero-bg source').first()
Expected: visible
Received: hidden
Timeout:  10000ms

Call log:
  - Expect "toBeVisible" locator('.hero-bg img, .hero-bg source').first() with timeout 10000ms
  - waiting for locator('.hero-bg img, .hero-bg source').first()
    24 × locator resolved to <source type="image/avif" sizes="(max-width: 480px) 480px, (max-width: 800px) 800px, (max-width: 1280px) 1280px, 1920px" srcset="↵        assets/images/bg-480w.avif 480w,↵        assets/images/bg-800w.avif 800w,↵        assets/images/bg-1280w.avif 1280w,↵        assets/images/bg-1920w.avif 1920w↵      "/>
       - unexpected value "hidden"

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
  - text: Choreographed Male Revue
  - heading "Fulfill your Fantasies" [level=1]
  - paragraph: South Africa's choreographed male revue for bachelorettes, ladies nights and corporate events. Hand-picked performers. Professional. Respectful. Unforgettable.
  - link "Book a Show":
    - /url: book.html
  - link "View Prices":
    - /url: prices.html
  - link "Join the Team":
    - /url: join.html
  - complementary:
    - strong: The Full Experience
    - text: Choreographed shows, topless & bottomless waiters, games, MCs, custom appearances.
    - paragraph: Hand-picked performers screened for personality, professionalism and crowd control.
  - heading "About Pulse Male Revue" [level=2]
  - paragraph: Pulse is choreographed male entertainment built around strong performers, tight routines, and respectful, professional crowd interaction. You decide how wild or conservative; the team adjusts to your crowd.
  - heading "What We Offer" [level=2]
  - list:
    - listitem: → Choreographed strip shows (1-man, multi-man)
    - listitem: → Topless and bottomless waiters
    - listitem: → Naughty games with a host
    - listitem: → Custom appearances and brand activations
  - heading "Client Testimonials" [level=2]
  - paragraph: Rating (5 out of 5)
  - text: ★★★★★
  - paragraph: "\"Amazing show! The guys were professional, entertaining, and made the bachelorette party unforgettable. Highly recommend!\""
  - paragraph: — Sarah M, Johannesburg
  - paragraph: January 8, 2026
  - paragraph: Rating (5 out of 5)
  - text: ★★★★★
  - paragraph: "\"Best entertainment we've ever had. The topless waiters were so charming and the show was incredible. Worth every cent!\""
  - paragraph: — Jessica K, Pretoria
  - paragraph: January 5, 2026
  - paragraph: Rating (5 out of 5)
  - text: ★★★★★
  - paragraph: "\"Professional service from start to finish. Easy booking, great communication, and an unforgettable performance.\""
  - paragraph: — Michelle R, Sandton
  - paragraph: Rating (4 out of 5)
  - text: ★★★★☆
  - paragraph: "\"Absolutely loved the show at The Churchill in Sandton! The dancers were incredible and made my 30th birthday unforgettable. Professional and so much fun.\""
  - paragraph: — Tanya S, Sandton
  - paragraph: March 15, 2024
  - paragraph: Rating (5 out of 5)
  - text: ★★★★★
  - paragraph: "\"Saw these guys at a venue in Rosebank - best girls night out ever! The topless waiters were charming and the choreography was on point. Will book again.\""
  - paragraph: — Nicole P, Rosebank
  - paragraph: July 22, 2023
  - paragraph: Rating (5 out of 5)
  - text: ★★★★★
  - paragraph: "\"Booked them for my sister's bachelorette at a private venue in Fourways. The guys arrived on time, were super professional, and the show was amazing. 10/10 recommend!\""
  - paragraph: — Keisha M, Fourways
  - paragraph: November 3, 2024
  - paragraph: Rating (5 out of 5)
  - text: ★★★★★
  - paragraph: "\"Had them at The Radisson Blu in Umhlanga for a hens party. The energy was electric, the dancers were fit and talented, and everyone had a blast. Worth every rand!\""
  - paragraph: — Chantelle V, Durban
  - paragraph: May 18, 2024
  - paragraph: Rating (5 out of 5)
  - text: ★★★★★
  - paragraph: "\"Unforgettable night at a club in Pretoria East! The Pulse Dancers know how to work a crowd. Professional, punctual, and the show was exactly what we wanted. Thanks guys!\""
  - paragraph: — Leanne K, Pretoria
  - paragraph: January 10, 2025
  - paragraph: Rating (4 out of 5)
  - text: ★★★★☆
  - paragraph: "\"Saw the Pulse Dancers at Sexpo Johannesburg - they were the highlight of the entire expo! Incredible energy, professional choreography, and the guys are absolutely stunning. Best performance there by far.\""
  - paragraph: — Bronwyn H, Johannesburg
  - paragraph: October 28, 2023
  - paragraph: Rating (5 out of 5)
  - text: ★★★★★
  - paragraph: "\"Caught their set at Sexpo Cape Town and wow! The dancers knew how to work the crowd perfectly. So much better than the other acts. My friends and I are still talking about it.\""
  - paragraph: — Megan L, Cape Town
  - paragraph: March 12, 2024
  - paragraph: Rating (5 out of 5)
  - text: ★★★★★
  - paragraph: "\"The Pulse Dancers at Sexpo Durban were incredible! They had the whole tent screaming. Professional, hot, and the choreography was next level. Definitely booking them for my bachelorette.\""
  - paragraph: — Samke N, Durban
  - paragraph: August 19, 2023
  - paragraph: Rating (5 out of 5)
  - text: ★★★★★
  - paragraph: "\"Best act at Sexpo by a mile! Saw them at the Pretoria show. The energy they bring is unmatched - these guys are pros. Loved every minute of it.\""
  - paragraph: — Tarryn K, Pretoria
  - paragraph: April 5, 2024
  - paragraph: Rating (5 out of 5)
  - text: ★★★★★
  - paragraph: "\"We went to Sexpo specifically after hearing about The Pulse Dancers and they did not disappoint. The show at the JHB expo was electric. Polished, professional, and seriously hot. 10/10.\""
  - paragraph: — Jenna W, Johannesburg
  - paragraph: November 16, 2024
  - heading "Share Your Experience" [level=3]
  - text: Your Name *
  - textbox "Your Name *":
    - /placeholder: Enter your name
  - text: Area / City *
  - textbox "Area / City *":
    - /placeholder: e.g. Johannesburg, Pretoria
  - text: Rating *
  - combobox "Rating *":
    - option "Select a rating" [selected]
    - option "★★★★★ Excellent"
    - option "★★★★ Very Good"
    - option "★★★ Good"
    - option "★★ Fair"
    - option "★ Poor"
  - text: Email (optional)
  - textbox "Email (optional)":
    - /placeholder: your@email.com
  - text: Your Review *
  - textbox "Your Review *":
    - /placeholder: Tell us about your experience...
  - button "Submit Review"
  - heading "Book Pulse for Your Event" [level=2]
  - paragraph: Send your event brief and we'll match the right guys and give you a clear quote with distance calculation.
  - link "Start Booking":
    - /url: book.html
  - heading "Join the Pulse Team" [level=2]
  - paragraph: Dancers and waiters in shape are welcome to apply. Lucrative opportunities for professional performers.
  - link "Apply Now":
    - /url: join.html
  - heading "Connect With Us" [level=2]
  - paragraph: Follow us on social media for the latest updates, behind-the-scenes content, and special offers.
  - link "Facebook":
    - /url: https://www.facebook.com/pulseSouthAfrica
  - link "Instagram":
    - /url: https://www.instagram.com/pulsesouthafrica
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
> 699 |         await expect(heroBg.first()).toBeVisible({ timeout: 10000 });
      |                                      ^ Error: expect(locator).toBeVisible() failed
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
  747 |       await page.waitForLoadState('networkidle');
  748 |       
  749 |       const inputs = page.locator('input[required], select[required], textarea[required]');
  750 |       const count = await inputs.count();
  751 |       
  752 |       for (let i = 0; i < count; i++) {
  753 |         const input = inputs.nth(i);
  754 |         const id = await input.getAttribute('id');
  755 |         if (id) {
  756 |           const label = page.locator(`label[for="${id}"]`);
  757 |           await expect(label).toBeVisible();
  758 |         }
  759 |       }
  760 |     });
  761 |   });
  762 | 
  763 |   // ============================================
  764 |   // TEST 13: REGRESSION TESTS
  765 |   // ============================================
  766 |   test.describe('Regression Tests', () => {
  767 |     test('No duplicate Jaryd/Jarod in performers', async ({ page }) => {
  768 |       await page.goto(`${BASE_URL}/meet-the-guys.html`);
  769 |       await page.waitForLoadState('networkidle');
  770 |       await page.waitForTimeout(3000);
  771 |       
  772 |       const names = page.locator('.performer-name');
  773 |       const count = await names.count();
  774 |       const nameTexts = [];
  775 |       
  776 |       for (let i = 0; i < count; i++) {
  777 |         nameTexts.push(await names.nth(i).textContent());
  778 |       }
  779 |       
  780 |       const uniqueNames = [...new Set(nameTexts)];
  781 |       expect(uniqueNames.length).toBe(count);
  782 |       expect(nameTexts.filter(n => n.toLowerCase().includes('jar')).length).toBeLessThanOrEqual(1);
  783 |     });
  784 | 
  785 |     test('Pricing table has Inter font', async ({ page }) => {
  786 |       await page.goto(`${BASE_URL}/prices.html`);
  787 |       await page.waitForLoadState('networkidle');
  788 |       
  789 |       const table = page.locator('.pricing-table');
  790 |       await expect(table).toBeVisible();
  791 |       
  792 |       const fontFamily = await table.evaluate(el => getComputedStyle(el).fontFamily);
  793 |       expect(fontFamily).toContain('Inter');
  794 |     });
  795 | 
  796 |     test('Instagram feed only on events page, not home', async ({ page }) => {
  797 |       // Home page
  798 |       await page.goto(`${BASE_URL}/`);
  799 |       await page.waitForLoadState('networkidle');
```