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

const PRICES = [['Service','Price','Duration','Description'],['1 Man Show','2500','20 minutes',''],['2 Man Show','4200','25 minutes','']];
const PAGE = (travel) => [['Page','Key','Value'], ...(travel ? [['BOOKING','travelRatePerKm','5'],['BOOKING','freeRadiusKm','30'],['BOOKING','baseLocationName','Sandton City']] : [])];

async function mock(page, {travel = true, pricesOk = true, prices = PRICES} = {}) {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/sheets') {
      const tab = url.searchParams.get('sheetName');
      if (tab === 'PRICES') return pricesOk ? route.fulfill({json:{values: prices}}) : route.fulfill({status: 500, body: 'fail'});
      if (tab === 'PAGE_CONTENT') return travel ? route.fulfill({json:{values: PAGE(true)}}) : route.fulfill({status: 500, body: 'fail'});
      return route.fulfill({json:{values: []}});
    }
    if (url.pathname.startsWith('/api/')) return route.fulfill({json:{success:true}});
    if (url.origin !== origin) return route.abort();
    return route.continue();
  });
}

async function quote(page, count) {
  await page.goto(origin + '/book.html');
  await page.click('#bf-services label:has(input[value="male"])');
  await page.fill('#bf-male-count', String(count));
  await page.locator('#bf-male-count').dispatchEvent('change');
  await page.click('label:has(input[name="locType"][value="area"])');
  await page.fill('#bf-area', 'Pretoria');
  await page.locator('#bf-area').dispatchEvent('change');
}
const text = (page, id) => page.locator('#' + id).innerText();

test('quote uses CMS price and CMS travel settings', async ({page}) => {
  await mock(page);
  await quote(page, 2);
  await expect(page.locator('#bf-quote-performance')).toHaveText(/^R4\s?200$/);
  const travel = await text(page, 'bf-quote-travel');
  expect(travel).toMatch(/^R\d/);
  await page.locator('#bf-quote-box').screenshot({path: 'test-results/quote-cms-ok.png'});
});

test('CMS price edit flows to the quote with no code change', async ({page}) => {
  await mock(page, {prices: [PRICES[0], ['1 Man Show','2500','',''], ['2 Man Show','4300','','']]});
  await quote(page, 2);
  await expect(page.locator('#bf-quote-performance')).toHaveText(/^R4\s?300$/);
});

test('travel settings unavailable: no invented travel figure', async ({page}) => {
  await mock(page, {travel: false});
  await quote(page, 2);
  await expect(page.locator('#bf-quote-performance')).toHaveText(/^R4\s?200$/);
  await expect(page.locator('#bf-quote-travel')).toHaveText('Confirmed in final quote');
  await expect(page.locator('#bf-quote-total')).toContainText('+ travel');
  await page.locator('#bf-quote-box').screenshot({path: 'test-results/quote-travel-unavailable.png'});
});

test('missing price row quotes POA, not a derived price', async ({page}) => {
  await mock(page);
  await quote(page, 3);
  await expect(page.locator('#bf-quote-total')).toContainText('POA');
  await expect(page.locator('#bf-quote-performance')).toHaveText('R0');
});

test('prices unavailable: POA, no numbers', async ({page}) => {
  await mock(page, {pricesOk: false});
  await quote(page, 2);
  await expect(page.locator('#bf-quote-total')).toContainText('POA');
});

test('prices page travel sentence follows CMS, and has no numeric fallback', async ({page}) => {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/sheets') {
      const tab = url.searchParams.get('sheetName');
      return route.fulfill({json:{values: tab === 'PRICES' ? PRICES : PAGE(true)}});
    }
    if (url.origin !== origin) return route.abort();
    return route.continue();
  });
  await page.goto(origin + '/prices.html');
  await expect(page.locator('#pricing-travel-text')).toHaveText('R5 per km outside 30km radius from Sandton City (round trip).');
  await expect(page.locator('tbody')).toContainText(/R4\s?200/);
  await page.screenshot({path: 'test-results/prices-cms.png', fullPage: false});
});

test('prices page with travel settings unavailable does not show numbers', async ({page}) => {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/sheets') {
      const tab = url.searchParams.get('sheetName');
      return tab === 'PRICES' ? route.fulfill({json:{values: PRICES}}) : route.fulfill({status: 500, body: 'fail'});
    }
    if (url.origin !== origin) return route.abort();
    return route.continue();
  });
  await page.goto(origin + '/prices.html');
  await expect(page.locator('#pricing-travel-text')).toHaveText('Travel is added to your final quote.');
});
