# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.test.js >> Pulse Dancers Website - Comprehensive Functional Tests >> Booking wizard form submits successfully
- Location: tests/comprehensive.test.js:177:3

# Error details

```
TimeoutError: page.fill: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('#w-time')

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
  - main [ref=e25]:
    - navigation "Booking progress" [ref=e26]:
      - list [ref=e27]:
        - listitem [ref=e28]: 1 Your Details
        - listitem [ref=e29]: 2 Event Details
        - listitem [ref=e30]: 3 Services
        - listitem [ref=e31]: 4 Location
        - listitem [ref=e32]: 5 Quote & Pay
    - generic [ref=e33]:
      - region "Book Pulse for Your Event" [ref=e34]:
        - generic [ref=e35]:
          - heading "Book Pulse for Your Event" [level=2] [ref=e36]
          - paragraph [ref=e37]: We'll use this to contact you about your booking
        - generic [ref=e38]:
          - generic [ref=e39]:
            - generic [ref=e40]: Full Name *
            - textbox "Full Name *" [ref=e41]:
              - /placeholder: Your full name
              - text: Test Client 1794583984524
          - generic [ref=e42]:
            - generic [ref=e43]: Email *
            - textbox "Email *" [ref=e44]:
              - /placeholder: you@example.com
              - text: test-1794583984524@example.com
          - generic [ref=e45]:
            - generic [ref=e46]: Phone Number *
            - textbox "Phone Number *" [ref=e47]:
              - /placeholder: e.g. 082 123 4567
              - text: "0821234567"
        - generic [ref=e48]:
          - button "Back" [disabled] [ref=e49] [cursor=pointer]
          - button "Continue" [ref=e50] [cursor=pointer]
      - region "Event Details" [ref=e51]:
        - generic [ref=e52]:
          - heading "Event Details" [level=2] [ref=e53]
          - paragraph [ref=e54]: Tell us about your event
        - generic [ref=e55]:
          - generic [ref=e56]: Type of Event *
          - radiogroup "Event type" [ref=e57]:
            - generic [ref=e58] [cursor=pointer]:
              - radio "Bachelorette"
              - generic [ref=e59]: Bachelorette
            - generic [ref=e60] [cursor=pointer]:
              - radio "Birthday"
              - generic [ref=e61]: Birthday
            - generic [ref=e62] [cursor=pointer]:
              - radio "Ladies Night"
              - generic [ref=e63]: Ladies Night
            - generic [ref=e64] [cursor=pointer]:
              - radio "Divorce Party"
              - generic [ref=e65]: Divorce Party
            - generic [ref=e66] [cursor=pointer]:
              - radio "Hen Party"
              - generic [ref=e67]: Hen Party
            - generic [ref=e68] [cursor=pointer]:
              - radio "Kitchen Tea"
              - generic [ref=e69]: Kitchen Tea
            - generic [ref=e70] [cursor=pointer]:
              - radio "Stalk Party"
              - generic [ref=e71]: Stalk Party
            - generic [ref=e72] [cursor=pointer]:
              - radio "Other"
              - generic [ref=e73]: Other
        - generic [ref=e74]:
          - generic [ref=e75]: Are you managing the event? *
          - radiogroup "Event manager" [ref=e76]:
            - generic [ref=e77] [cursor=pointer]:
              - radio "Yes, I'm managing it"
              - generic [ref=e78]: Yes, I'm managing it
            - generic [ref=e79] [cursor=pointer]:
              - radio "No, someone else is managing it"
              - generic [ref=e80]: No, someone else is managing it
        - generic [ref=e81]:
          - generic [ref=e82]: Event Date *
          - textbox "Event Date *" [active] [ref=e83]: 2026-02-15
          - generic [ref=e84]: You'll set start/end times per service in the next step
        - generic [ref=e85]:
          - generic [ref=e86]: What time are you leaving the venue? (optional)
          - textbox "What time are you leaving the venue? (optional)" [ref=e87]
        - generic [ref=e88]:
          - button "Back" [ref=e89] [cursor=pointer]
          - button "Continue" [ref=e90] [cursor=pointer]
      - region "Select Services" [ref=e91]:
        - generic [ref=e92]:
          - heading "Select Services" [level=2] [ref=e93]
          - paragraph [ref=e94]: Choose the entertainment you want — each service has its own time slot
        - group "Available services" [ref=e95]:
          - generic [ref=e96]:
            - generic [ref=e97]: 🎭
            - generic [ref=e98]: Solo Male Stripper
            - generic [ref=e99]: From R2 500
          - generic [ref=e100]:
            - generic [ref=e101]: 💃
            - generic [ref=e102]: Solo Female Stripper
            - generic [ref=e103]: From R2 500
          - generic [ref=e104]:
            - generic [ref=e105]: 👯
            - generic [ref=e106]: 2 Man Show
            - generic [ref=e107]: From R4 500
          - generic [ref=e108]:
            - generic [ref=e109]: 👯‍♂️
            - generic [ref=e110]: 3 Man Show
            - generic [ref=e111]: From R6 500
          - generic [ref=e112]:
            - generic [ref=e113]: 👯‍♂️
            - generic [ref=e114]: 4 Man Show
            - generic [ref=e115]: From R8 500
          - generic [ref=e116]:
            - generic [ref=e117]: 👯‍♂️
            - generic [ref=e118]: 5 Man Show
            - generic [ref=e119]: From R10 500
          - generic [ref=e120]:
            - generic [ref=e121]: 👯‍♂️
            - generic [ref=e122]: 6 Man Show
            - generic [ref=e123]: From R12 500
          - generic [ref=e124]:
            - generic [ref=e125]: 🍾
            - generic [ref=e126]: Topless Waiter
            - generic [ref=e127]: From R800/per hour
          - generic [ref=e128]:
            - generic [ref=e129]: 🍸
            - generic [ref=e130]: Bottomless Butler
            - generic [ref=e131]: From R1 000/per hour
          - generic [ref=e132]:
            - generic [ref=e133]: 🎲
            - generic [ref=e134]: Games Package
            - generic [ref=e135]: From R500
          - generic [ref=e136]:
            - generic [ref=e137]: 💃
            - generic [ref=e138]: Pole Dancer
            - generic [ref=e139]: From R3 000
          - generic [ref=e140]:
            - generic [ref=e141]: ✨
            - generic [ref=e142]: Custom Request
            - generic [ref=e143]: From R0
        - generic [ref=e144]:
          - button "Back" [ref=e145] [cursor=pointer]
          - button "Continue" [ref=e146] [cursor=pointer]
      - region "Event Location" [ref=e147]:
        - generic [ref=e148]:
          - heading "Event Location" [level=2] [ref=e149]
          - paragraph [ref=e150]: Where is your event happening?
        - generic [ref=e151]:
          - generic [ref=e152]: Do you know the exact location? *
          - radiogroup "Location type" [ref=e153]:
            - generic [ref=e154] [cursor=pointer]:
              - radio "Yes — I know the exact address"
              - generic [ref=e155]: Yes — I know the exact address
            - generic [ref=e156] [cursor=pointer]:
              - radio "No — I only know the area"
              - generic [ref=e157]: No — I only know the area
        - generic [ref=e158]:
          - button "Back" [ref=e159] [cursor=pointer]
          - button "Continue" [ref=e160] [cursor=pointer]
      - region "Your Quote" [ref=e161]:
        - generic [ref=e162]:
          - heading "Your Quote" [level=2] [ref=e163]
          - paragraph [ref=e164]: Review and secure your booking with a 50% deposit
        - generic [ref=e165]:
          - button "Back" [ref=e166] [cursor=pointer]
          - button "Pay Deposit & Confirm Booking" [ref=e167] [cursor=pointer]
  - contentinfo [ref=e168]:
    - generic [ref=e169]:
      - generic [ref=e170]: © 2026 Pulse Male Revue - South Africa.
      - generic [ref=e171]:
        - link "info@pulsedancers.com" [ref=e172] [cursor=pointer]:
          - /url: mailto:info@pulsedancers.com
        - generic [ref=e173]: ·
        - link "Facebook" [ref=e174] [cursor=pointer]:
          - /url: https://www.facebook.com/pulseSouthAfrica
        - generic [ref=e175]: ·
        - link "Instagram" [ref=e176] [cursor=pointer]:
          - /url: https://www.instagram.com/pulsesouthafrica
```

# Test source

```ts
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
  144 |     await page.click('#bf-event-type label:has(input[value="${bookingData.eventType}"])');
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
> 197 |     await page.fill('#w-time', '20:00');
      |                ^ TimeoutError: page.fill: Timeout 60000ms exceeded.
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
  245 |     await page.fill('#review-email', testimonialData.email);
  246 |     
  247 |     // Submit and wait
  248 |     const responsePromise = page.waitForResponse(response => 
  249 |       response.url().includes('/api/submit-testimonial') && response.status() === 200
  250 |     );
  251 |     await page.click('#review-form button[type="submit"]');
  252 |     const response = await responsePromise;
  253 |     const result = await response.json();
  254 |     
  255 |     expect(result.success).toBe(true);
  256 |     expect(result.message).toContain('testimonial');
  257 |     
  258 |     // Verify status message appears
  259 |     await expect(page.locator('#review-status')).toBeVisible();
  260 |     await expect(page.locator('#review-status')).toContainText('Thank you for your testimonial');
  261 |     
  262 |     // Verify sheet entry (TESTIMONIALS sheet) - skip if no API key
  263 |     const sheetResult = await waitForSheetEntry('TESTIMONIALS', testimonialData.name, 0);
  264 |     console.log('DEBUG sheetResult:', JSON.stringify(sheetResult));
  265 |     console.log('DEBUG API key in test:', process.env.GOOGLE_SHEETS_API_KEY ? 'SET' : 'NOT SET');
  266 |     if (sheetResult.reason !== 'No API key') {
  267 |       expect(sheetResult.verified).toBe(true);
  268 |       console.log('✅ Testimonial verified in Google Sheets');
  269 |     } else {
  270 |       console.log('⚠️ Sheet verification skipped (no API key)');
  271 |     }
  272 |   });
  273 | 
  274 |   // ============================================
  275 |   // TEST 3: CONTACT FORM (contact.html)
  276 |   // ============================================
  277 |   test('Contact form submits and writes to CONTACT_MESSAGES sheet', async ({ page }) => {
  278 |     const contactData = generateContactData();
  279 |     
  280 |     await page.goto(`${BASE_URL}/contact.html`);
  281 |     await page.waitForLoadState('networkidle');
  282 |     
  283 |     // Verify form
  284 |     await expect(page.locator('#contactForm')).toBeVisible();
  285 |     
  286 |     // Fill form
  287 |     await page.fill('#contact-name', contactData.name);
  288 |     await page.fill('#contact-email', contactData.email);
  289 |     await page.fill('#contact-phone', contactData.phone);
  290 |     await page.fill('#contact-subject', contactData.subject);
  291 |     await page.fill('#contact-message', contactData.message);
  292 |     
  293 |     // Submit
  294 |     const responsePromise = page.waitForResponse(response => 
  295 |       response.url().includes('/api/submit-contact') && response.status() === 200
  296 |     );
  297 |     await page.click('#contactForm button[type="submit"]');
```