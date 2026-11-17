/**
 * Visual regression baseline: hero, booking, join, contact, faq pages.
 * Captures screenshots of key visual regions; any pixel diff vs baseline
 * is a regression. Baseline stored in tests/visual/baselines/.
 * REGENERATE_ON_CHANGE: <any html>
 */
import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://pulse-dancers-website.vercel.app';

const PAGES = [
  { name: 'hero', url: '/', selector: '.hero-bg, .hero' },
  { name: 'booking', url: '/book.html', selector: '#booking-form' },
  { name: 'join', url: '/join.html', selector: '#joinForm' },
  { name: 'contact', url: '/contact.html', selector: '#contactForm' },
  { name: 'faq', url: '/faq.html', selector: '#faq-content' },
];

for (const p of PAGES) {
  test(`visual baseline: ${p.name}`, async ({ page }) => {
    await page.goto(BASE + p.url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const el = page.locator(p.selector).first();
    await expect(el).toHaveScreenshot(`baseline-${p.name}.png`, { maxDiffPixels: 200 });
  });
}
