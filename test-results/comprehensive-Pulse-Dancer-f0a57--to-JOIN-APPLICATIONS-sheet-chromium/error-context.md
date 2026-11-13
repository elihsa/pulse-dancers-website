# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.test.js >> Pulse Dancers Website - Comprehensive Functional Tests >> Join form submits with file uploads and writes to JOIN_APPLICATIONS sheet
- Location: tests/comprehensive.test.js:317:3

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
              - textbox "Last Name *" [ref=e42]: User 1794583989041
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
              - textbox "Email *" [ref=e60]: join-1794583989041@example.com
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
  298 |     const response = await responsePromise;
  299 |     const result = await response.json();
  300 |     
  301 |     expect(result.success).toBe(true);
  302 |     
  303 |     // Verify sheet entry - skip if no API key
  304 |     const sheetResult = await waitForSheetEntry('CONTACT_MESSAGES', contactData.name, 1);
  305 |     if (sheetResult.reason !== 'No API key') {
  306 |       expect(sheetResult.verified).toBe(true);
  307 |       console.log('✅ Contact form verified in Google Sheets');
  308 |     } else {
  309 |       console.log('⚠️ Sheet verification skipped (no API key)');
  310 |     }
  311 |   });
  312 |     
  313 | 
  314 |   // ============================================
  315 |   // TEST 4: JOIN FORM (join.html)
  316 |   // ============================================
  317 |   test('Join form submits with file uploads and writes to JOIN_APPLICATIONS sheet', async ({ page }) => {
  318 |     const joinData = generateJoinData();
  319 |     
  320 |     await page.goto(`${BASE_URL}/join.html`);
  321 |     await page.waitForLoadState('networkidle');
  322 |     
  323 |     // Fill all required fields
  324 |     await page.fill('#firstName', joinData.firstName);
  325 |     await page.fill('#lastName', joinData.lastName);
  326 |     await page.fill('#email', joinData.email);
  327 |     await page.fill('#phone', joinData.phone);
> 328 |     await page.fill('#birthMonth', joinData.birthMonth);
      |                ^ Error: page.fill: Error: Element is not an <input>, <textarea> or [contenteditable] element
  329 |     await page.fill('#birthDay', joinData.birthDay);
  330 |     await page.fill('#birthYear', joinData.birthYear);
  331 |     await page.fill('#streetAddress', joinData.streetAddress);
  332 |     await page.fill('#city', joinData.city);
  333 |     await page.selectOption('#preference', joinData.preference);
  334 |     await page.fill('#danceExperience', joinData.danceExperience);
  335 |     await page.fill('#promoExperience', joinData.promoExperience);
  336 |     await page.selectOption('#transport', joinData.transport);
  337 |     await page.fill('#gymLocation', joinData.gymLocation);
  338 |     await page.fill('#otherWork', joinData.otherWork);
  339 |     await page.fill('#skills', joinData.skills);
  340 |     
  341 |     // Create dummy image files for upload
  342 |     const dummyImage = Buffer.from('fake-image-data');
  343 |     
  344 |     // Submit with file uploads
  345 |     const responsePromise = page.waitForResponse(response => 
  346 |       response.url().includes('/api/submit-join-form') && response.status() === 200
  347 |     );
  348 |     
  349 |     // Use file chooser for file inputs
  350 |     const [fileChooser1] = await Promise.all([
  351 |       page.waitForEvent('filechooser'),
  352 |       page.click('#fullBodyShot')
  353 |     ]);
  354 |     await fileChooser1.setFiles({
  355 |       name: 'body.jpg',
  356 |       mimeType: 'image/jpeg',
  357 |       buffer: dummyImage
  358 |     });
  359 |     
  360 |     const [fileChooser2] = await Promise.all([
  361 |       page.waitForEvent('filechooser'),
  362 |       page.click('#fullFacePhoto')
  363 |     ]);
  364 |     await fileChooser2.setFiles({
  365 |       name: 'face.jpg',
  366 |       mimeType: 'image/jpeg',
  367 |       buffer: dummyImage
  368 |     });
  369 |     
  370 |     await page.click('#joinForm button[type="submit"]');
  371 |     const response = await responsePromise;
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
```