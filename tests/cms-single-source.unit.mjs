import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const booking = readFileSync(new URL('../assets/js/booking-form.js', import.meta.url), 'utf8');
const prices = readFileSync(new URL('../prices.html', import.meta.url), 'utf8');

test('booking form holds no numeric travel defaults', () => {
  assert.match(booking, /travelRatePerKm: null/);
  assert.match(booking, /freeRadiusKm: null/);
  assert.doesNotMatch(booking, /freeRadiusKm: \d/);
  assert.doesNotMatch(booking, /travelRatePerKm: \d/);
  assert.doesNotMatch(booking, /num\([^)]*,\s*\d+\)/);
});

test('booking form has no price rule of its own for multi-man shows', () => {
  assert.doesNotMatch(booking, /count \* this\.priceOf/);
});

test('prices page has no numeric travel fallback or static rate text', () => {
  assert.doesNotMatch(prices, /: 5;|: 50;/);
  assert.doesNotMatch(prices, /R5 per km|50km/);
});

test('no rand price figures hardcoded in pages or booking script', () => {
  for (const [name, text] of [['booking-form.js', booking], ['prices.html', prices]]) {
    const hits = text.match(/\bR\s?\d{3,}\b/g) || [];
    assert.deepEqual(hits, [], `${name} has hardcoded rand figures`);
  }
});
