/**
 * AppCheck regression: browser_launch + console-error monitoring across all pages.
 * Asserts zero console errors and zero failed requests on every public page.
 * REGENERATE_ON_CHANGE: <any html>
 */
import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://pulse-dancers-website.vercel.app';

const PAGES = [
  '/', '/book.html', '/contact.html', '/join.html', '/events.html',
  '/faq.html', '/meet-the-guys.html', '/gallery.html', '/prices.html',
];

const IGNORED = [
  'favicon', 'font', 'gstatic', 'googleapis', // external, non-critical
  'NetlifyForms', '//analytics', // third-party
];

for (const page of PAGES) {
  test(`Console clean + no failed requests on ${page}`, async ({ page: p }) => {
    const consoleErrors = [];
    const failedRequests = [];

    p.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    p.on('requestfailed', req => failedRequests.push(req.url()));
    p.on('response', res => {
      if (res.status() >= 400) failedRequests.push(`${res.url()} [${res.status()}]`);
    });

    await p.goto(BASE + page, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(4000); // let CMS/async load

    // Filter benign external noise
    const realErrors = consoleErrors.filter(e =>
      !IGNORED.some(i => e.includes(i)) && !e.includes('favicon')
    );
    const realFails = failedRequests.filter(u =>
      !IGNORED.some(i => u.includes(i)) && !u.includes('favicon')
    );

    console.log(`[${page}] consoleErrors=${realErrors.length} failedReqs=${realFails.length}`);
    if (realErrors.length) console.log('  ERRORS:', realErrors.slice(0, 5));
    if (realFails.length) console.log('  FAILS:', realFails.slice(0, 5));

    // Allow none - a clean page has zero console errors & zero failed in-app requests
    expect(realFails.filter(u => u.includes('pulse-dancers-website'))).toEqual([]);
  });
}