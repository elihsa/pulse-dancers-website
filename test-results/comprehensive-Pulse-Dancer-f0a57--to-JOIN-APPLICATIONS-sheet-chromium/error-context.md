# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.test.js >> Pulse Dancers Website - Comprehensive Functional Tests >> Join form submits with file uploads and writes to JOIN_APPLICATIONS sheet
- Location: tests/comprehensive.test.js:310:3

# Error details

```
Error: page.fill: Error: Element is not an <input>, <textarea> or [contenteditable] element
Call log:
  - waiting for locator('#birthMonth')
    - locator resolved to <select required="" id="birthMonth" name="birthMonth">…</select>
    - fill("01")
  - attempting fill action
    - waiting for element to be visible, enabled and editable

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
    - heading "Join the Pulse Team" [level=2] [ref=e27]
    - paragraph [ref=e28]: Pulse Dancers, Africa's most sought-after male revue show, is on the lookout for new talent. If you're a professional male dancer, performer or waiter looking for lucrative work, we want to hear from you. All applications are reviewed carefully and we'll contact you within 5 business days.
    - paragraph [ref=e29]:
      - strong [ref=e30]: "📧 Application Form:"
      - text: Fill out the form below to apply to join the Pulse team. All applications are reviewed carefully and we'll contact you within 5 business days.
    - generic [ref=e31]:
      - heading "New Recruit Application Form" [level=2] [ref=e32]
      - generic [ref=e33]:
        - group "Personal Details" [ref=e34]:
          - generic [ref=e36]:
            - generic [ref=e37]:
              - generic [ref=e38]: First Name *
              - textbox "First Name *" [ref=e39]: Test
            - generic [ref=e40]:
              - generic [ref=e41]: Last Name *
              - textbox "Last Name *" [ref=e42]: User 1794568780166
          - generic [ref=e44]:
            - generic [ref=e45]: Date of Birth *
            - generic [ref=e46]:
              - combobox [ref=e47]:
                - option "Month" [selected]
                - option "January"
                - option "February"
                - option "March"
                - option "April"
                - option "May"
                - option "June"
                - option "July"
                - option "August"
                - option "September"
                - option "October"
                - option "November"
                - option "December"
              - combobox [disabled] [ref=e48]:
                - option "Day" [selected]
              - combobox [ref=e49]:
                - option "Year" [selected]
                - option "2008"
                - option "2007"
                - option "2006"
                - option "2005"
                - option "2004"
                - option "2003"
                - option "2002"
                - option "2001"
                - option "2000"
                - option "1999"
                - option "1998"
                - option "1997"
                - option "1996"
                - option "1995"
                - option "1994"
                - option "1993"
                - option "1992"
                - option "1991"
                - option "1990"
                - option "1989"
                - option "1988"
                - option "1987"
                - option "1986"
                - option "1985"
                - option "1984"
                - option "1983"
                - option "1982"
                - option "1981"
                - option "1980"
                - option "1979"
                - option "1978"
                - option "1977"
                - option "1976"
                - option "1975"
                - option "1974"
                - option "1973"
                - option "1972"
                - option "1971"
                - option "1970"
                - option "1969"
                - option "1968"
                - option "1967"
                - option "1966"
                - option "1965"
                - option "1964"
                - option "1963"
                - option "1962"
                - option "1961"
                - option "1960"
                - option "1959"
                - option "1958"
                - option "1957"
                - option "1956"
                - option "1955"
                - option "1954"
                - option "1953"
                - option "1952"
                - option "1951"
                - option "1950"
          - generic [ref=e50]:
            - generic [ref=e51]:
              - generic [ref=e52]: Street Address
              - textbox "Street Address" [ref=e53]
            - generic [ref=e54]:
              - generic [ref=e55]: City
              - textbox "City" [ref=e56]
          - generic [ref=e57]:
            - generic [ref=e58]:
              - generic [ref=e59]: Email *
              - textbox "Email *" [ref=e60]: join-1794568780166@example.com
            - generic [ref=e61]:
              - generic [ref=e62]: Phone Number *
              - textbox "Phone Number *" [active] [ref=e63]:
                - /placeholder: +27 XX XXX XXXX
                - text: "0825555555"
          - generic [ref=e64]:
            - generic [ref=e65]: Instagram Handle *
            - generic [ref=e66]:
              - generic: "@"
              - textbox "Instagram Handle *" [ref=e67]:
                - /placeholder: your_instagram
        - group "Physical Stats" [ref=e68]:
          - generic [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e72]: Height (cm) *
              - spinbutton "Height (cm) *" [ref=e73]
            - generic [ref=e74]:
              - generic [ref=e75]: Weight (kg) *
              - spinbutton "Weight (kg) *" [ref=e76]
          - generic [ref=e77]:
            - generic [ref=e78]:
              - generic [ref=e79]: Waist (cm) *
              - spinbutton "Waist (cm) *" [ref=e80]
            - generic [ref=e81]:
              - generic [ref=e82]: Chest (cm) *
              - spinbutton "Chest (cm) *" [ref=e83]
          - generic [ref=e85]:
            - generic [ref=e86]: Shoe Size *
            - textbox "Shoe Size *" [ref=e87]:
              - /placeholder: e.g. 10 UK / 44 EU
          - generic [ref=e88]:
            - generic [ref=e89]:
              - generic [ref=e90]: Hair Color *
              - combobox "Hair Color *" [ref=e91]:
                - option "Select..." [selected]
                - option "Black"
                - option "Brown"
                - option "Blonde"
                - option "Red/Auburn"
                - option "Other"
            - generic [ref=e92]:
              - generic [ref=e93]: Eye Color *
              - combobox "Eye Color *" [ref=e94]:
                - option "Select..." [selected]
                - option "Brown"
                - option "Blue"
                - option "Green"
                - option "Hazel"
                - option "Other"
          - generic [ref=e95]:
            - generic [ref=e96]:
              - generic [ref=e97]: Ethnicity *
              - combobox "Ethnicity *" [ref=e98]:
                - option "Select..." [selected]
                - option "Black"
                - option "White"
                - option "Asian"
                - option "Mixed Race"
                - option "Other"
            - generic [ref=e99]:
              - generic [ref=e100]: Body Type *
              - combobox "Body Type *" [ref=e101]:
                - option "Select..." [selected]
                - option "Very Toned"
                - option "Muscular"
                - option "Average"
                - option "Lean"
                - option "Other"
          - generic [ref=e102]:
            - generic [ref=e103]: Tattoos (describe locations, sizes, etc.) *
            - textbox "Tattoos (describe locations, sizes, etc.) *" [ref=e104]:
              - /placeholder: e.g. Small cross on left wrist, tribal band on right arm...
        - group "Photos" [ref=e105]:
          - paragraph [ref=e107]: Upload clear photos. Max 200KB each - they will be auto-resized if larger.
          - generic [ref=e108]:
            - generic [ref=e109]:
              - generic [ref=e110]: 1. Full Body Shot (topless) *
              - button "1. Full Body Shot (topless) *" [ref=e112] [cursor=pointer]
              - generic [ref=e113]: Front-facing, full body, well-lit
            - generic [ref=e114]:
              - generic [ref=e115]: 2. Full Face Photo *
              - button "2. Full Face Photo *" [ref=e117] [cursor=pointer]
              - generic [ref=e118]: Clear face shot, smiling
        - group "What Would You Like To Do? *" [ref=e119]:
          - paragraph [ref=e121]: Select one or more options
          - generic [ref=e122]:
            - generic [ref=e123] [cursor=pointer]:
              - checkbox "Dancing (Stage Shows)" [ref=e124]
              - text: Dancing (Stage Shows)
            - generic [ref=e125] [cursor=pointer]:
              - checkbox "Topless Waitering" [ref=e126]
              - text: Topless Waitering
            - generic [ref=e127] [cursor=pointer]:
              - checkbox "Bottomless Waitering / Barebut Butler" [ref=e128]
              - text: Bottomless Waitering / Barebut Butler
        - group "Experience & Availability" [ref=e129]:
          - generic [ref=e131]:
            - generic [ref=e132]: Do you have any dance experience? *
            - generic [ref=e133]:
              - generic [ref=e134] [cursor=pointer]:
                - radio "Yes" [ref=e135]
                - generic [ref=e136]: "Yes"
              - generic [ref=e137] [cursor=pointer]:
                - radio "No" [ref=e138]
                - generic [ref=e139]: "No"
          - generic [ref=e140]:
            - generic [ref=e141]: Do you have any promotional experience? *
            - generic [ref=e142]:
              - generic [ref=e143] [cursor=pointer]:
                - radio "Yes" [ref=e144]
                - generic [ref=e145]: "Yes"
              - generic [ref=e146] [cursor=pointer]:
                - radio "No" [ref=e147]
                - generic [ref=e148]: "No"
          - generic [ref=e149]:
            - generic [ref=e150]: Do you have your own transport? *
            - generic [ref=e151]:
              - generic [ref=e152] [cursor=pointer]:
                - radio "Yes" [ref=e153]
                - generic [ref=e154]: "Yes"
              - generic [ref=e155] [cursor=pointer]:
                - radio "No" [ref=e156]
                - generic [ref=e157]: "No"
        - group "Additional Information" [ref=e158]:
          - generic [ref=e160]:
            - generic [ref=e161]: Do you gym, if so where?
            - textbox "Do you gym, if so where?" [ref=e162]:
              - /placeholder: Gym name & location...
          - generic [ref=e163]:
            - generic [ref=e164]: What do you do besides Modelling and promos?
            - textbox "What do you do besides Modelling and promos?" [ref=e165]:
              - /placeholder: Current job, studies, other interests...
          - generic [ref=e166]:
            - generic [ref=e167]: Special Skills (Photographer, Graphic editor, DJ, etc.)
            - textbox "Special Skills (Photographer, Graphic editor, DJ, etc.)" [ref=e168]:
              - /placeholder: Any other talents worth mentioning...
          - generic [ref=e169]:
            - generic [ref=e170]: Preferred Image Filter
            - combobox "Preferred Image Filter" [ref=e171]:
              - option "Standard" [selected]
              - option "Sepia"
              - option "Black & White"
              - option "Other"
        - generic [ref=e172]:
          - button "Submit Application" [ref=e173] [cursor=pointer]
          - paragraph [ref=e174]:
            - text: By submitting, you agree to our
            - link "Privacy Policy" [ref=e175] [cursor=pointer]:
              - /url: privacy.html
            - text: and consent to us storing your data for recruitment purposes.
  - contentinfo [ref=e176]:
    - generic [ref=e177]:
      - generic [ref=e178]: © 2026 Pulse Male Revue - South Africa.
      - generic [ref=e179]:
        - link "info@pulsedancers.com" [ref=e180] [cursor=pointer]:
          - /url: mailto:info@pulsedancers.com
        - generic [ref=e181]: ·
        - link "Facebook" [ref=e182] [cursor=pointer]:
          - /url: https://www.facebook.com/pulseSouthAfrica
        - generic [ref=e183]: ·
        - link "Instagram" [ref=e184] [cursor=pointer]:
          - /url: https://www.instagram.com/pulsesouthafrica
```

# Test source

```ts
  221 |   // ============================================
  222 |   // TEST 2: TESTIMONIAL FORM (index.html)
  223 |   // ============================================
  224 |   test('Testimonial form submits and writes to TESTIMONIALS sheet', async ({ page }) => {
  225 |     const testimonialData = generateTestimonialData();
  226 |     
  227 |     await page.goto(`${BASE_URL}/`);
  228 |     await page.waitForLoadState('networkidle');
  229 |     
  230 |     // Scroll to testimonial form
  231 |     await page.locator('#review-form').scrollIntoViewIfNeeded();
  232 |     
  233 |     // Fill form
  234 |     await page.fill('#review-name', testimonialData.name);
  235 |     await page.fill('#review-area', testimonialData.area);
  236 |     await page.selectOption('#review-rating', testimonialData.rating);
  237 |     await page.fill('#review-message', testimonialData.message);
  238 |     await page.fill('#review-email', testimonialData.email);
  239 |     
  240 |     // Submit and wait
  241 |     const responsePromise = page.waitForResponse(response => 
  242 |       response.url().includes('/api/submit-testimonial') && response.status() === 200
  243 |     );
  244 |     await page.click('#review-form button[type="submit"]');
  245 |     const response = await responsePromise;
  246 |     const result = await response.json();
  247 |     
  248 |     expect(result.success).toBe(true);
  249 |     expect(result.message).toContain('testimonial');
  250 |     
  251 |     // Verify status message appears
  252 |     await expect(page.locator('#review-status')).toBeVisible();
  253 |     await expect(page.locator('#review-status')).toContainText('Thank you for your testimonial');
  254 |     
  255 |     // Verify sheet entry (TESTIMONIALS sheet) - skip if no API key
  256 |     const sheetResult = await waitForSheetEntry('TESTIMONIALS', testimonialData.name, 0);
  257 |     console.log('DEBUG sheetResult:', JSON.stringify(sheetResult));
  258 |     console.log('DEBUG API key in test:', process.env.GOOGLE_SHEETS_API_KEY ? 'SET' : 'NOT SET');
  259 |     if (sheetResult.reason !== 'No API key') {
  260 |       expect(sheetResult.verified).toBe(true);
  261 |       console.log('✅ Testimonial verified in Google Sheets');
  262 |     } else {
  263 |       console.log('⚠️ Sheet verification skipped (no API key)');
  264 |     }
  265 |   });
  266 | 
  267 |   // ============================================
  268 |   // TEST 3: CONTACT FORM (contact.html)
  269 |   // ============================================
  270 |   test('Contact form submits and writes to CONTACT_MESSAGES sheet', async ({ page }) => {
  271 |     const contactData = generateContactData();
  272 |     
  273 |     await page.goto(`${BASE_URL}/contact.html`);
  274 |     await page.waitForLoadState('networkidle');
  275 |     
  276 |     // Verify form
  277 |     await expect(page.locator('#contactForm')).toBeVisible();
  278 |     
  279 |     // Fill form
  280 |     await page.fill('#contact-name', contactData.name);
  281 |     await page.fill('#contact-email', contactData.email);
  282 |     await page.fill('#contact-phone', contactData.phone);
  283 |     await page.fill('#contact-subject', contactData.subject);
  284 |     await page.fill('#contact-message', contactData.message);
  285 |     
  286 |     // Submit
  287 |     const responsePromise = page.waitForResponse(response => 
  288 |       response.url().includes('/api/submit-contact') && response.status() === 200
  289 |     );
  290 |     await page.click('#contactForm button[type="submit"]');
  291 |     const response = await responsePromise;
  292 |     const result = await response.json();
  293 |     
  294 |     expect(result.success).toBe(true);
  295 |     
  296 |     // Verify sheet entry - skip if no API key
  297 |     const sheetResult = await waitForSheetEntry('CONTACT_MESSAGES', contactData.name, 1);
  298 |     if (sheetResult.reason !== 'No API key') {
  299 |       expect(sheetResult.verified).toBe(true);
  300 |       console.log('✅ Contact form verified in Google Sheets');
  301 |     } else {
  302 |       console.log('⚠️ Sheet verification skipped (no API key)');
  303 |     }
  304 |   });
  305 |     
  306 | 
  307 |   // ============================================
  308 |   // TEST 4: JOIN FORM (join.html)
  309 |   // ============================================
  310 |   test('Join form submits with file uploads and writes to JOIN_APPLICATIONS sheet', async ({ page }) => {
  311 |     const joinData = generateJoinData();
  312 |     
  313 |     await page.goto(`${BASE_URL}/join.html`);
  314 |     await page.waitForLoadState('networkidle');
  315 |     
  316 |     // Fill all required fields
  317 |     await page.fill('#firstName', joinData.firstName);
  318 |     await page.fill('#lastName', joinData.lastName);
  319 |     await page.fill('#email', joinData.email);
  320 |     await page.fill('#phone', joinData.phone);
> 321 |     await page.fill('#birthMonth', joinData.birthMonth);
      |                ^ Error: page.fill: Error: Element is not an <input>, <textarea> or [contenteditable] element
  322 |     await page.fill('#birthDay', joinData.birthDay);
  323 |     await page.fill('#birthYear', joinData.birthYear);
  324 |     await page.fill('#streetAddress', joinData.streetAddress);
  325 |     await page.fill('#city', joinData.city);
  326 |     await page.selectOption('#preference', joinData.preference);
  327 |     await page.fill('#danceExperience', joinData.danceExperience);
  328 |     await page.fill('#promoExperience', joinData.promoExperience);
  329 |     await page.selectOption('#transport', joinData.transport);
  330 |     await page.fill('#gymLocation', joinData.gymLocation);
  331 |     await page.fill('#otherWork', joinData.otherWork);
  332 |     await page.fill('#skills', joinData.skills);
  333 |     
  334 |     // Create dummy image files for upload
  335 |     const dummyImage = Buffer.from('fake-image-data');
  336 |     
  337 |     // Submit with file uploads
  338 |     const responsePromise = page.waitForResponse(response => 
  339 |       response.url().includes('/api/submit-join-form') && response.status() === 200
  340 |     );
  341 |     
  342 |     // Use file chooser for file inputs
  343 |     const [fileChooser1] = await Promise.all([
  344 |       page.waitForEvent('filechooser'),
  345 |       page.click('#fullBodyShot')
  346 |     ]);
  347 |     await fileChooser1.setFiles({
  348 |       name: 'body.jpg',
  349 |       mimeType: 'image/jpeg',
  350 |       buffer: dummyImage
  351 |     });
  352 |     
  353 |     const [fileChooser2] = await Promise.all([
  354 |       page.waitForEvent('filechooser'),
  355 |       page.click('#fullFacePhoto')
  356 |     ]);
  357 |     await fileChooser2.setFiles({
  358 |       name: 'face.jpg',
  359 |       mimeType: 'image/jpeg',
  360 |       buffer: dummyImage
  361 |     });
  362 |     
  363 |     await page.click('#joinForm button[type="submit"]');
  364 |     const response = await responsePromise;
  365 |     const result = await response.json();
  366 |     
  367 |     expect(result.success).toBe(true);
  368 |     expect(result.message).toContain('Application submitted');
  369 |     
  370 |     // Verify sheet entry (skip if no API key)
  371 |     const sheetResult = await waitForSheetEntry('JOIN_APPLICATIONS', joinData.firstName, 1);
  372 |     if (sheetResult.reason !== 'No API key') {
  373 |       expect(sheetResult.verified).toBe(true);
  374 |       console.log('✅ Join application verified in Google Sheets');
  375 |     } else {
  376 |       console.log('⚠️ Sheet verification skipped (no API key)');
  377 |     }
  378 |   });
  379 | 
  380 |   // ============================================
  381 |   // TEST 5: API ENDPOINTS HEALTH CHECKS
  382 |   // ============================================
  383 |   test.describe('API Endpoint Health', () => {
  384 |     test('GET /api/sheets?sheetName=BOOKINGS returns 200', async ({ request }) => {
  385 |       const response = await request.get(`${BASE_URL}/api/sheets?sheetName=BOOKINGS`);
  386 |       expect(response.ok()).toBeTruthy();
  387 |       const data = await response.json();
  388 |       expect(data.values).toBeDefined();
  389 |       expect(Array.isArray(data.values)).toBeTruthy();
  390 |     });
  391 | 
  392 |     test('GET /api/sheets?sheetName=TESTIMONIALS returns 200', async ({ request }) => {
  393 |       const response = await request.get(`${BASE_URL}/api/sheets?sheetName=TESTIMONIALS`);
  394 |       expect(response.ok()).toBeTruthy();
  395 |     });
  396 | 
  397 |     test('GET /api/sheets?sheetName=DANCERS returns 200 with performer data', async ({ request }) => {
  398 |       const response = await request.get(`${BASE_URL}/api/sheets?sheetName=DANCERS`);
  399 |       expect(response.ok()).toBeTruthy();
  400 |       const data = await response.json();
  401 |       expect(data.values).toBeDefined();
  402 |       expect(data.values.length).toBeGreaterThan(1); // Header + data
  403 |     });
  404 | 
  405 |     test('POST /api/submit-booking returns 400 for invalid data', async ({ request }) => {
  406 |       const response = await request.post(`${BASE_URL}/api/submit-booking`, {
  407 |         data: { name: 'Test' }, // Missing required fields
  408 |         headers: { 'Content-Type': 'application/json' }
  409 |       });
  410 |       expect(response.status()).toBe(400);
  411 |       const data = await response.json();
  412 |       expect(data.error).toBeDefined();
  413 |     });
  414 | 
  415 |     test('POST /api/submit-testimonial returns 400 for missing fields', async ({ request }) => {
  416 |       const response = await request.post(`${BASE_URL}/api/submit-testimonial`, {
  417 |         data: { name: 'Test' },
  418 |         headers: { 'Content-Type': 'application/json' }
  419 |       });
  420 |       expect(response.status()).toBe(400);
  421 |     });
```