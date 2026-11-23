import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

let server, origin;
test.beforeAll(async () => {
  server = createServer(async (req, res) => {
    const file = resolve(process.cwd(), '.' + (req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
    if (!file.startsWith(process.cwd() + '/')) { res.writeHead(404).end(); return; }
    try {
      const data = await readFile(file);
      res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg'})[extname(file)] || 'application/octet-stream');
      res.end(data);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  origin = `http://127.0.0.1:${server.address().port}`;
});
test.afterAll(async () => { await new Promise(r => server.close(r)); });

test.beforeEach(async ({page}) => {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/sheets') {
      const tab = url.searchParams.get('sheet') || url.searchParams.get('tab') || '';
      const values = tab === 'PRICES' ? [['Service','Price','Duration','Description'],['1 Man Show','2500','30 min','Fixture']] : [];
      await route.fulfill({json:{values}});
    } else if (url.pathname.startsWith('/api/')) {
      await route.fulfill({json:{success:true,message:'Test request received'}});
    } else if (url.origin !== origin) {
      await route.abort();
    } else await route.continue();
  });
});

async function fillBooking(page) {
  await page.goto(origin + '/book.html');
  await page.fill('#bf-name', 'Local QA');
  await page.fill('#bf-email', 'qa@example.invalid');
  await page.fill('#bf-phone', '0000000000');
  await page.click('#bf-event-type label:has(input[value="Bachelorette"])');
  await page.click('#bf-services label:has(input[value="male"])');
  await page.click('label:has(input[name="managing"][value="No"])');
  await page.click('label:has(input[name="locType"][value="area"])');
  await page.fill('#bf-area', 'Sandton');
  await page.locator('#bf-area').dispatchEvent('change');
}

test('booking submits once to the real endpoint without a second validation error', async ({page}) => {
  const posts=[];
  page.on('request', req=>{if(req.method()==='POST') posts.push(req.url());});
  await fillBooking(page);
  await page.click('#bf-submit');
  await expect(page.locator('#bf-form-status')).toHaveText('Test request received');
  await expect(page.locator('#bf-submit')).toBeEnabled();
  expect(posts.map(u=>new URL(u).pathname)).toEqual(['/api/submit-booking']);
  await expect(page.locator('#booking-status')).toHaveCount(0);
  await expect(page.locator('#bf-name')).toHaveValue('');
});

test('booking failure preserves entries and allows retry', async ({page})=>{
  await page.route('**/api/submit-booking',route=>route.fulfill({status:503,json:{error:'Temporary test failure'}}));
  await fillBooking(page);
  await page.click('#bf-submit');
  await expect(page.locator('#bf-form-status')).toContainText('Temporary test failure');
  await expect(page.locator('#bf-name')).toHaveValue('Local QA');
  await expect(page.locator('#bf-submit')).toBeEnabled();
});

for(const width of [320,390,768,1280]) test(`contact page fits at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto(origin+'/contact.html');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('#contact-name')).toBeVisible();
  if(width<768) {
    const form=await page.locator('#contactForm').boundingBox();
    const info=await page.locator('#contact-info-title').boundingBox();
    expect(info.y).toBeGreaterThan(form.y+form.height);
  }
});

test('contact failure preserves message, then success clears the form',async({page})=>{
  await page.goto(origin+'/contact.html');
  await page.fill('#contact-name','Local QA');await page.fill('#contact-email','qa@example.invalid');
  await page.fill('#contact-subject','Local test');await page.fill('#contact-message','No real message sent.');
  await page.route('**/api/submit-contact',route=>route.fulfill({status:503,json:{error:'Temporary test failure'}}));
  await page.click('#contactForm button[type=submit]');
  await expect(page.locator('#contact-status')).toContainText('Temporary test failure');
  await expect(page.locator('#contact-message')).toHaveValue('No real message sent.');
  await page.route('**/api/submit-contact',route=>route.fulfill({json:{success:true}}));
  await page.click('#contactForm button[type=submit]');
  await expect(page.locator('#contact-status')).toContainText('Thank you');
  await expect(page.locator('#contact-message')).toHaveValue('');
});

async function fillJoin(page) {
  await page.goto(origin + '/join.html');
  await page.locator('#joinForm input[required]').evaluateAll(inputs => {
    for (const input of inputs) {
      if (['file','radio','checkbox'].includes(input.type)) continue;
      input.value = input.type === 'email' ? 'qa@example.invalid' : input.type === 'number' ? (input.min || '100') : 'Local QA';
    }
  });
  await page.locator('#joinForm select[required]').evaluateAll(selects => {
    for (const select of selects) {
      if (select.options[1]) select.value = select.options[1].value;
      select.dispatchEvent(new Event('change'));
    }
  });
  for (const name of ['danceExperience','promoExperience','transport']) await page.locator(`input[name="${name}"]`).first().check();
  await page.fill('#tattoos', 'Local fixture');
  for (const selector of ['#fullBodyShot', '#fullFacePhoto']) {
    await page.locator(selector).setInputFiles({name:'fixture.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64')});
  }
  await page.locator('input[name="preference"]').nth(0).check();
  await page.locator('input[name="preference"]').nth(1).check();
}

test('join success stays visible below the long form and retains both preferences in its request', async ({page}) => {
  await page.setViewportSize({width:390,height:900});
  await fillJoin(page);
  let body = '';
  await page.route('**/api/submit-join-form', route => {
    body = route.request().postData() || '';
    return route.fulfill({json:{success:true,message:'Local application received'}});
  });
  await page.click('#submitBtn');
  await expect(page.locator('#formMessages')).toHaveText('Local application received');
  await expect(page.locator('#formMessages')).toBeInViewport();
  expect((body.match(/name="preference"/g) || []).length).toBe(2);
  await expect(page.locator('#firstName')).toHaveValue('');
  await page.screenshot({path:'/tmp/pulse-join-success-local.png'});
});

test('join failure remains visible and preserves the application for retry', async ({page}) => {
  await fillJoin(page);
  await page.route('**/api/submit-join-form', route => route.fulfill({status:503,json:{error:'Temporary local failure'}}));
  await page.click('#submitBtn');
  await expect(page.locator('#formMessages')).toContainText('Temporary local failure');
  await expect(page.locator('#firstName')).toHaveValue('Local QA');
  await expect(page.locator('#submitBtn')).toBeEnabled();
});
