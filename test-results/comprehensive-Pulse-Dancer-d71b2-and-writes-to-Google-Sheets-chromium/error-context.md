# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.test.js >> Pulse Dancers Website - Comprehensive Functional Tests >> Booking form submits successfully and writes to Google Sheets
- Location: tests/comprehensive.test.js:126:3

# Error details

```
TimeoutError: page.click: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('#bf-event-type label:has(input[value="${bookingData.eventType}"])')

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
            - text: Test Client 1794583984484
        - generic [ref=e35]:
          - generic [ref=e36]: Phone Number *
          - textbox "Phone Number *" [active] [ref=e37]:
            - /placeholder: e.g. 082 123 4567
            - text: "0821234567"
      - generic [ref=e39]:
        - generic [ref=e40]: Email *
        - textbox "Email *" [ref=e41]:
          - /placeholder: you@example.com
          - text: test-1794583984484@example.com
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
  44  |   const hasApiKey = !!apiKey;
  45  |   if (!hasApiKey) {
  46  |     return { verified: false, reason: 'No API key' };
  47  |   }
  48  | 
  49  |   for (let i = 0; i < maxAttempts; i++) {
  50  |     const result = await verifySheetEntry(sheetName, searchValue);
  51  |     if (result.verified) return result;
  52  |     console.log(`  Waiting for ${sheetName} entry (${searchValue})... attempt ${i + 1}/${maxAttempts}`);
  53  |     await new Promise(r => setTimeout(r, delayMs));
  54  |   }
  55  |   return { verified: false, reason: `Timeout after ${maxAttempts} attempts` };
  56  | }
  57  | 
  58  | // Test data generators
  59  | function generateBookingData() {
  60  |   return {
  61  |     name: `Test Client ${Date.now()}`,
  62  |     email: `test-${Date.now()}@example.com`,
  63  |     phone: '0821234567',
  64  |     eventType: 'Bachelorette',
  65  |     services: ['show2'],
  66  |     area: 'Sandton',
  67  |     eventDate: '2026-02-15',
  68  |     quote: { performance: 'R4200', travel: 'R0', total: 'R4200' }
  69  |   };
  70  | }
  71  | 
  72  | function generateTestimonialData() {
  73  |   return {
  74  |     name: `Test User ${Date.now()}`,
  75  |     area: 'Johannesburg',
  76  |     rating: '5',
  77  |     message: 'Excellent service! The performers were amazing.',
  78  |     email: `test-${Date.now()}@example.com`
  79  |   };
  80  | }
  81  | 
  82  | function generateContactData() {
  83  |   return {
  84  |     name: `Test Contact ${Date.now()}`,
  85  |     email: `contact-${Date.now()}@example.com`,
  86  |     phone: '0829876543',
  87  |     subject: 'Test Inquiry',
  88  |     message: 'This is a test message from Playwright.'
  89  |   };
  90  | }
  91  | 
  92  | function generateJoinData() {
  93  |   return {
  94  |     firstName: 'Test',
  95  |     lastName: `User ${Date.now()}`,
  96  |     email: `join-${Date.now()}@example.com`,
  97  |     phone: '0825555555',
  98  |     birthMonth: '01',
  99  |     birthDay: '15',
  100 |     birthYear: '1995',
  101 |     streetAddress: '123 Test Street',
  102 |     city: 'Cape Town',
  103 |     preference: 'dancing',
  104 |     danceExperience: '5 years contemporary',
  105 |     promoExperience: 'None',
  106 |     transport: 'own',
  107 |     gymLocation: 'Planet Fitness',
  108 |     otherWork: 'Part-time student',
  109 |     skills: 'Flexibility, choreography'
  110 |   };
  111 | }
  112 | 
  113 | 
  114 | test.describe.configure({ retries: 1 });
  115 | 
  116 | test.describe('Pulse Dancers Website - Comprehensive Functional Tests', () => {
  117 |   
  118 |   test.beforeEach(async ({ page }) => {
  119 |     // Set longer timeout for API calls
  120 |     page.setDefaultTimeout(60000);
  121 |   });
  122 | 
  123 |   // ============================================
  124 |   // TEST 1: BOOKING FORM (book.html)
  125 |   // ============================================
  126 |   test('Booking form submits successfully and writes to Google Sheets', async ({ page }) => {
  127 |     const bookingData = generateBookingData();
  128 |     
  129 |     await page.goto(`${BASE_URL}/book.html`);
  130 |     await page.waitForLoadState('networkidle');
  131 |     
  132 |     // Verify form elements exist
  133 |     await expect(page.locator('#booking-form')).toBeVisible();
  134 |     await expect(page.locator('#bf-name')).toBeVisible();
  135 |     await expect(page.locator('#bf-email')).toBeVisible();
  136 |     await expect(page.locator('#bf-phone')).toBeVisible();
  137 |     
  138 |     // Fill form
  139 |     await page.fill('#bf-name', bookingData.name);
  140 |     await page.fill('#bf-email', bookingData.email);
  141 |     await page.fill('#bf-phone', bookingData.phone);
  142 |     
  143 |     // Event type is a custom option grid, not a select - click the option label (input has opacity: 0)
> 144 |     await page.click('#bf-event-type label:has(input[value="${bookingData.eventType}"])');
      |                ^ TimeoutError: page.click: Timeout 60000ms exceeded.
  145 |     await page.click('label:has(input[value="${bookingData.services[0]}"])');
  146 |     // Select managing: "Yes, I'm managing it" (value="No")
  147 |     await page.click('label:has(input[name="managing"][value="No"])');
  148 |     
  149 |     // Select location type: "area" to show bf-area-fields
  150 |     await page.click('label:has(input[name="locType"][value="area"])');
  151 |     
  152 |     await page.fill('#bf-area', bookingData.area);
  153 |     await page.fill('#bf-date', bookingData.eventDate);
  154 |     
  155 |     // Submit and wait for response
  156 |     const responsePromise = page.waitForResponse(response => 
  157 |       response.url().includes('/api/submit-booking') && response.status() === 200
  158 |     );
  159 |     
  160 |     await page.click('button[type="submit"]');
  161 |     const response = await responsePromise;
  162 |     const result = await response.json();
  163 |     
  164 |     expect(result.success).toBe(true);
  165 |     expect(result.message).toContain('booking request has been sent');
  166 |     
  167 |     // Verify sheet entry (skip if no API key)
  168 |     const sheetResult = await waitForSheetEntry('BOOKINGS', bookingData.name, 1); // Name column
  169 |     if (sheetResult.reason !== 'No API key') {
  170 |       expect(sheetResult.verified).toBe(true);
  171 |       console.log('✅ Booking verified in Google Sheets:', sheetResult.row[1]);
  172 |     } else {
  173 |       console.log('⚠️ Sheet verification skipped (no API key)');
  174 |     }
  175 |   });
  176 | 
  177 |   test('Booking wizard form submits successfully', async ({ page }) => {
  178 |     const bookingData = generateBookingData();
  179 |     
  180 |     await page.goto(`${BASE_URL}/book-wizard.html`);
  181 |     await page.waitForLoadState('networkidle');
  182 |     
  183 |     // Handle age gate if present
  184 |     const ageGate = page.locator('#age-gate:not([hidden])');
  185 |     if (await ageGate.isVisible()) {
  186 |       await page.click('#age-gate-yes');
  187 |     }
  188 |     
  189 |     // Step 1: Client details
  190 |     await page.fill('#w-name', bookingData.name);
  191 |     await page.fill('#w-email', bookingData.email);
  192 |     await page.fill('#w-phone', bookingData.phone);
  193 |     await page.click('[data-next="2"]');
  194 |     
  195 |     // Step 2: Event details
  196 |     await page.fill('#w-date', bookingData.eventDate);
  197 |     await page.fill('#w-time', '20:00');
  198 |     await page.click('[data-next="3"]');
  199 |     
  200 |     // Step 3: Services - click label (input has opacity: 0)
  201 |     await page.click('label:has(input[value="${bookingData.services[0]}"])');
  202 |     await page.click('[data-next="4"]');
  203 |     
  204 |     // Step 4: Location - select "area" to show w-area-fields
  205 |     await page.click('label:has(input[name="locType"][value="area"])');
  206 |     await page.fill('#w-area', bookingData.area);
  207 |     await page.click('[data-next="5"]');
  208 |     
  209 |     // Step 5: Submit
  210 |     const responsePromise = page.waitForResponse(response => 
  211 |       response.url().includes('/api/submit-booking') && response.status() === 200
  212 |     );
  213 |     await page.click('#w-submit-booking');
  214 |     const response = await responsePromise;
  215 |     const result = await response.json();
  216 |     
  217 |     expect(result.success).toBe(true);
  218 |     
  219 |     // Verify sheet entry (skip if no API key)
  220 |     const sheetResult = await waitForSheetEntry('BOOKINGS', bookingData.name, 1);
  221 |     if (sheetResult.reason !== 'No API key') {
  222 |       expect(sheetResult.verified).toBe(true);
  223 |     } else {
  224 |       console.log('⚠️ Sheet verification skipped (no API key)');
  225 |     }
  226 |   });
  227 | 
  228 |   // ============================================
  229 |   // TEST 2: TESTIMONIAL FORM (index.html)
  230 |   // ============================================
  231 |   test('Testimonial form submits and writes to TESTIMONIALS sheet', async ({ page }) => {
  232 |     const testimonialData = generateTestimonialData();
  233 |     
  234 |     await page.goto(`${BASE_URL}/`);
  235 |     await page.waitForLoadState('networkidle');
  236 |     
  237 |     // Scroll to testimonial form
  238 |     await page.locator('#review-form').scrollIntoViewIfNeeded();
  239 |     
  240 |     // Fill form
  241 |     await page.fill('#review-name', testimonialData.name);
  242 |     await page.fill('#review-area', testimonialData.area);
  243 |     await page.selectOption('#review-rating', testimonialData.rating);
  244 |     await page.fill('#review-message', testimonialData.message);
```