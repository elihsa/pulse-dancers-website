import test from 'node:test';
import assert from 'node:assert/strict';
import { addFormField } from '../lib/form-fields.js';

test('single multipart values keep their existing scalar contract', () => {
  const fields = {};
  addFormField(fields, 'firstName', 'Local QA');
  addFormField(fields, 'email', 'qa@example.invalid');
  assert.deepEqual(fields, { firstName: 'Local QA', email: 'qa@example.invalid' });
});

test('multiple recruitment preferences are all retained in request order', () => {
  const fields = {};
  for (const value of ['Dancing', 'Topless Waitering', 'Bottomless Waitering']) {
    addFormField(fields, 'preference', value);
  }
  assert.deepEqual(fields.preference, ['Dancing', 'Topless Waitering', 'Bottomless Waitering']);
  assert.equal(fields.preference.join(', '), 'Dancing, Topless Waitering, Bottomless Waitering');
});
