# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.test.js >> Pulse Dancers Website - Comprehensive Functional Tests >> End-to-End Booking Workflow >> Complete booking flow: form -> sheets -> calendar -> WhatsApp -> email
- Location: tests/comprehensive.test.js:827:5

# Error details

```
Error: page.selectOption: Error: Element is not a <select> element
Call log:
  - waiting for locator('#bf-event-type')
    - locator resolved to <div id="bf-event-type" class="option-grid">…</div>
  - attempting select option action
    - waiting for element to be visible and enabled

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - img "Pulse Male Revue Top Banner" [ref=e3]
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic:
        - link:
          - /url: index.html
      - list [ref=e6]:
        - listitem [ref=e7]:
          - link "Home" [ref=e8] [cursor=pointer]:
            - /url: index.html
        - listitem [ref=e9]:
          - link "Events" [ref=e10] [cursor=pointer]:
            - /url: events.html
        - listitem [ref=e11]:
          - link "Prices" [ref=e12] [cursor=pointer]:
            - /url: prices.html
        - listitem [ref=e13]:
          - link "FAQ" [ref=e14] [cursor=pointer]:
            - /url: faq.html
        - listitem [ref=e15]:
          - link "Meet The Guys" [ref=e16] [cursor=pointer]:
            - /url: meet-the-guys.html
        - listitem [ref=e17]:
          - link "Join" [ref=e18] [cursor=pointer]:
            - /url: join.html
        - listitem [ref=e19]:
          - link "Gallery" [ref=e20] [cursor=pointer]:
            - /url: gallery.html
        - listitem [ref=e21]:
          - link "Contact" [ref=e22] [cursor=pointer]:
            - /url: contact.html
        - listitem [ref=e23]:
          - link "Book Now" [ref=e24] [cursor=pointer]:
            - /url: book.html
  - generic [ref=e26]:
    - heading "Book Pulse for Your Event" [level=2] [ref=e27]
    - paragraph [ref=e28]: Fill out the form below with your event details. We'll respond within 24 hours with a personalized quote.
    - generic [ref=e29]:
      - heading "Your Details" [level=3] [ref=e30]
      - generic [ref=e31]:
        - generic [ref=e32]:
          - generic [ref=e33]: Full Name *
          - textbox "Full Name *" [ref=e34]:
            - /placeholder: Your name
            - text: Test Client 1794584080157
        - generic [ref=e35]:
          - generic [ref=e36]: Phone Number *
          - textbox "Phone Number *" [active] [ref=e37]:
            - /placeholder: e.g. 082 123 4567
            - text: "0821234567"
      - generic [ref=e39]:
        - generic [ref=e40]: Email *
        - textbox "Email *" [ref=e41]:
          - /placeholder: you@example.com
          - text: test-1794584080157@example.com
      - heading "Event Details" [level=3] [ref=e42]
      - generic [ref=e43]:
        - generic [ref=e44]: Type of Event *
        - generic [ref=e45]:
          - generic [ref=e46] [cursor=pointer]:
            - radio "Bachelorette"
            - generic [ref=e47]: Bachelorette
          - generic [ref=e48] [cursor=pointer]:
            - radio "Birthday"
            - generic [ref=e49]: Birthday
          - generic [ref=e50] [cursor=pointer]:
            - radio "Ladies night"
            - generic [ref=e51]: Ladies night
          - generic [ref=e52] [cursor=pointer]:
            - radio "Divorce party"
            - generic [ref=e53]: Divorce party
          - generic [ref=e54] [cursor=pointer]:
            - radio "Hen party"
            - generic [ref=e55]: Hen party
          - generic [ref=e56] [cursor=pointer]:
            - radio "Kitchen tea"
            - generic [ref=e57]: Kitchen tea
          - generic [ref=e58] [cursor=pointer]:
            - radio "Stalk party"
            - generic [ref=e59]: Stalk party
          - generic [ref=e60] [cursor=pointer]:
            - radio "Other"
            - generic [ref=e61]: Other
      - generic [ref=e62]:
        - generic [ref=e63]: Are you managing the event? *
        - generic [ref=e64]:
          - generic [ref=e65] [cursor=pointer]:
            - radio "Yes, I'm managing it"
            - generic [ref=e66]: Yes, I'm managing it
          - generic [ref=e67] [cursor=pointer]:
            - radio "No, someone else is managing it"
            - generic [ref=e68]: No, someone else is managing it
      - heading "Event Location" [level=3] [ref=e69]
      - generic [ref=e70]:
        - generic [ref=e71]: Do you know the exact location of the event? *
        - generic [ref=e72]:
          - generic [ref=e73] [cursor=pointer]:
            - radio "Yes — I know the exact address"
            - generic [ref=e74]: Yes — I know the exact address
          - generic [ref=e75] [cursor=pointer]:
            - radio "No — I only know the area"
            - generic [ref=e76]: No — I only know the area
      - heading "Event Date" [level=3] [ref=e77]
      - generic [ref=e78]:
        - generic [ref=e79]:
          - generic [ref=e80]: Event Date *
          - textbox "Event Date *" [ref=e81]
          - generic [ref=e82]: You'll set start/end times per service below.
        - generic [ref=e83]:
          - generic [ref=e84]: What time are you leaving the venue? (optional)
          - textbox "What time are you leaving the venue? (optional)" [ref=e85]
          - generic [ref=e86]: If known — helps us schedule around your timings.
      - heading "Services" [level=3] [ref=e87]
      - paragraph [ref=e88]: Select the services you want — only the fields for your selected services will appear.
      - generic [ref=e89]:
        - generic [ref=e90] [cursor=pointer]:
          - checkbox "Solo Male Stripper"
          - generic [ref=e91]: Solo Male Stripper
        - generic [ref=e92] [cursor=pointer]:
          - checkbox "Solo Female Stripper"
          - generic [ref=e93]: Solo Female Stripper
        - generic [ref=e94] [cursor=pointer]:
          - checkbox "2 Man Show"
          - generic [ref=e95]: 2 Man Show
        - generic [ref=e96] [cursor=pointer]:
          - checkbox "3 Man Show"
          - generic [ref=e97]: 3 Man Show
        - generic [ref=e98] [cursor=pointer]:
          - checkbox "4 Man Show"
          - generic [ref=e99]: 4 Man Show
        - generic [ref=e100] [cursor=pointer]:
          - checkbox "5 Man Show"
          - generic [ref=e101]: 5 Man Show
        - generic [ref=e102] [cursor=pointer]:
          - checkbox "6 Man Show"
          - generic [ref=e103]: 6 Man Show
        - generic [ref=e104] [cursor=pointer]:
          - checkbox "Topless Waiter"
          - generic [ref=e105]: Topless Waiter
        - generic [ref=e106] [cursor=pointer]:
          - checkbox "Bottomless Butler"
          - generic [ref=e107]: Bottomless Butler
        - generic [ref=e108] [cursor=pointer]:
          - checkbox "Games"
          - generic [ref=e109]: Games
        - generic [ref=e110] [cursor=pointer]:
          - checkbox "Pole Dancer"
          - generic [ref=e111]: Pole Dancer
        - generic [ref=e112] [cursor=pointer]:
          - checkbox "Something else"
          - generic [ref=e113]: Something else
      - generic [ref=e115] [cursor=pointer]:
        - checkbox "Do you also need a performer for a bachelor party?" [ref=e116]
        - text: Do you also need a performer for a bachelor party?
      - generic [ref=e117]:
        - generic [ref=e118]: Anything extra you would like to add or ask?
        - textbox "Anything extra you would like to add or ask?" [ref=e119]:
          - /placeholder: Special requests, questions, timings...
      - generic [ref=e120]:
        - heading "Estimated Quote" [level=3] [ref=e121]
        - generic [ref=e122]:
          - generic [ref=e123]: Performance fee
          - strong [ref=e124]: R0
        - generic [ref=e125]:
          - generic [ref=e126]: Distance (round trip)
          - strong [ref=e127]: —
        - generic [ref=e128]:
          - generic [ref=e129]: Travel fee
          - strong [ref=e130]: R0
        - generic [ref=e131]:
          - strong [ref=e132]: Estimated total
          - strong [ref=e133]: R0
        - paragraph [ref=e134]: This is an estimate. Final quote confirmed after we review your event details.
      - button "Send Booking Request" [ref=e136] [cursor=pointer]
  - contentinfo [ref=e137]:
    - generic [ref=e138]:
      - generic [ref=e139]: © 2026 Pulse Male Revue - South Africa.
      - generic [ref=e140]:
        - link "info@pulsedancers.com" [ref=e141] [cursor=pointer]:
          - /url: mailto:info@pulsedancers.com
        - generic [ref=e142]: ·
        - link "Facebook" [ref=e143] [cursor=pointer]:
          - /url: https://www.facebook.com/pulseSouthAfrica
        - generic [ref=e144]: ·
        - link "Instagram" [ref=e145] [cursor=pointer]:
          - /url: https://www.instagram.com/pulsesouthafrica
```

# Test source

```ts
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
  800 |       
  801 |       const homeInstagram = page.locator('#instagram-feed:not([hidden])');
  802 |       const isVisible = await homeInstagram.isVisible().catch(() => false);
  803 |       expect(isVisible).toBeFalsy();
  804 |       
  805 |       // Events page
  806 |       await page.goto(`${BASE_URL}/events.html`);
  807 |       await page.waitForLoadState('networkidle');
  808 |       
  809 |       const eventsInstagram = page.locator('#instagram-feed');
  810 |       await expect(eventsInstagram).toBeVisible();
  811 |     });
  812 | 
  813 |     test('Events section renamed to "Events and Socials"', async ({ page }) => {
  814 |       await page.goto(`${BASE_URL}/events.html`);
  815 |       await page.waitForLoadState('networkidle');
  816 |       
  817 |       const heading = page.locator('#events-instagram-title');
  818 |       await expect(heading).toBeVisible();
  819 |       await expect(heading).toContainText('Events and Socials');
  820 |     });
  821 |   });
  822 | 
  823 |   // ============================================
  824 |   // TEST 14: END-TO-END WORKFLOW
  825 |   // ============================================
  826 |   test.describe('End-to-End Booking Workflow', () => {
  827 |     test('Complete booking flow: form -> sheets -> calendar -> WhatsApp -> email', async ({ page }) => {
  828 |       const bookingData = generateBookingData();
  829 |       
  830 |       // 1. Submit booking form
  831 |       await page.goto(`${BASE_URL}/book.html`);
  832 |       await page.waitForLoadState('networkidle');
  833 |       
  834 |       await page.fill('#bf-name', bookingData.name);
  835 |       await page.fill('#bf-email', bookingData.email);
  836 |       await page.fill('#bf-phone', bookingData.phone);
> 837 |       await page.selectOption('#bf-event-type', bookingData.eventType);
      |                  ^ Error: page.selectOption: Error: Element is not a <select> element
  838 |       await page.check(`input[value="${bookingData.services[0]}"]`);
  839 |       await page.fill('#bf-area', bookingData.area);
  840 |       await page.fill('#bf-event-date', bookingData.eventDate);
  841 |       
  842 |       const responsePromise = page.waitForResponse(response => 
  843 |         response.url().includes('/api/submit-booking') && response.status() === 200
  844 |       );
  845 |       
  846 |       await page.click('button[type="submit"]');
  847 |       const response = await responsePromise;
  848 |       const result = await response.json();
  849 |       
  850 |       expect(result.success).toBe(true);
  851 |       
  852 |       // 2. Verify sheet entry
  853 |       const sheetResult = await waitForSheetEntry('BOOKINGS', bookingData.name, 1);
  854 |       expect(sheetResult.verified).toBe(true);
  855 |       const row = sheetResult.row;
  856 |       
  857 |       // Verify key fields in sheet
  858 |       expect(row[1]).toBe(bookingData.name); // Name
  859 |       expect(row[3]).toBe(bookingData.email); // Email
  860 |       expect(row[2]).toBe(bookingData.phone); // Phone
  861 |       expect(row[11]).toBe(bookingData.area); // Area
  862 |       
  863 |       // 3. Verify status is 'Pending'
  864 |       const statusCol = row.length - 1; // Status is last column
  865 |       expect(row[statusCol]).toBe('Pending');
  866 |       
  867 |       console.log('✅ Complete end-to-end booking workflow verified');
  868 |     });
  869 |   });
  870 | });
```