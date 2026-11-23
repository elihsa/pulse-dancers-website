// Notification helper for form submissions.
//
// Everything here is env-gated: with no keys configured it is a no-op and
// submissions still succeed. Notification failures are logged, never thrown,
// so a dead provider can never break a form.
//
// Channels (either or both):
//   WhatsApp to Pulse via CallMeBot (free):
//     CALLMEBOT_API_KEY, CALLMEBOT_PHONE_NUMBER  (e.g. +27840197733)
//   Email via Resend (https://resend.com, free tier):
//     RESEND_API_KEY
//     ADMIN_EMAIL          - where lead notifications go (default info@pulsedancers.com)
//     NOTIFY_FROM_EMAIL    - verified sender (default onboarding@resend.dev,
//                            works on Resend's free tier without a domain)
//     SEND_CUSTOMER_CONFIRMATION=1 - also email the customer a confirmation
//
// Customer confirmation copy is CMS-editable: the AUTO_REPLIES tab in the Pulse
// CMS workbook holds one row per template (KEY | SUBJECT | BODY | NOTES), so
// wording can be changed without a deploy. Supported placeholder: {firstName}.
// The DEFAULT_AUTO_REPLIES below are the fallback when the tab cannot be read
// or a row is missing/empty, so email never breaks on a sheet problem.

import { google } from 'googleapis';

// Development email verification is restricted to Eli, including admin mail.
const TEST_RECIPIENT = 'elihsa@gmail.com';
const ADMIN_EMAIL = TEST_RECIPIENT;
const FROM_EMAIL = process.env.NOTIFY_FROM_EMAIL || 'Pulse Website <onboarding@resend.dev>';

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1NekTQSIICnUECtreDTXycz_yQlYpg48VMjTIA8uUuu4';
const AUTO_REPLIES_TAB = 'AUTO_REPLIES';
const AUTO_REPLIES_CACHE_TTL_MS = 60000;

const SIGNATURE = 'Pulse Male Revue\ninfo@pulsedancers.com\nWhatsApp: +27 84 019 7733';

// Keep these defaults in sync with the seeded AUTO_REPLIES rows.
export const DEFAULT_AUTO_REPLIES = {
  booking_confirmation: {
    subject: 'We received your booking request - Pulse',
    body:
      'Hi {firstName},\n\n' +
      "Thank you for your booking request with Pulse Male Revue. We've received your details and will be in touch to confirm availability and finalise your booking.\n\n" +
      "Please note: your booking is only confirmed once we've spoken to you directly.\n\n" +
      SIGNATURE,
  },
  join_confirmation: {
    subject: 'We received your application - Pulse',
    body:
      'Hi {firstName},\n\n' +
      "Thank you for applying to join the Pulse Male Revue team. We've received your application and our team will review it.\n\n" +
      "If your application is a match, we'll contact you about the next steps. Submitting an application doesn't guarantee selection.\n\n" +
      SIGNATURE,
  },
  contact_confirmation: {
    subject: 'We received your message - Pulse',
    body:
      'Hi {firstName},\n\n' +
      "Thank you for contacting Pulse Male Revue. We've received your message and will get back to you.\n\n" +
      SIGNATURE,
  },
  testimonial_confirmation: {
    subject: 'Thank you for your feedback - Pulse',
    body:
      'Hi {firstName},\n\n' +
      "Thank you for sharing your Pulse Male Revue experience. We've received your testimonial.\n\n" +
      'Every testimonial is read by our team before anything is published on the site.\n\n' +
      SIGNATURE,
  },
};

let autoRepliesCache = { at: 0, rows: null };

const getServiceAccountAuth = () => {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) return null;
  try {
    const credentials = JSON.parse(serviceAccountJson);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  } catch (e) {
    console.error('Auto-reply templates: invalid GOOGLE_SERVICE_ACCOUNT_JSON, using defaults');
    return null;
  }
};

// Read the AUTO_REPLIES rows (KEY in column A, SUBJECT in B, BODY in C).
// Returns null on any problem so callers fall back to DEFAULT_AUTO_REPLIES.
async function fetchAutoReplyRows() {
  if (Date.now() - autoRepliesCache.at < AUTO_REPLIES_CACHE_TTL_MS) return autoRepliesCache.rows;
  let rows = null;
  try {
    const auth = getServiceAccountAuth();
    if (auth) {
      const sheets = google.sheets({ version: 'v4', auth });
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${AUTO_REPLIES_TAB}!A2:C100`,
      });
      rows = res.data.values || [];
    }
  } catch (e) {
    console.error('Auto-reply template read failed, using defaults:', e.message);
  }
  autoRepliesCache = { at: Date.now(), rows };
  return rows;
}

// Pick the template for a key: the CMS row when it has a body, else the default.
export function templateFromRows(rows, key) {
  const fallback = DEFAULT_AUTO_REPLIES[key];
  if (!fallback) return null;
  if (Array.isArray(rows)) {
    const row = rows.find((r) => String((r && r[0]) || '').trim() === key);
    if (row) {
      const body = String(row[2] || '').trim();
      if (body) {
        const subject = String(row[1] || '').trim();
        return { subject: subject || fallback.subject, body };
      }
    }
  }
  return fallback;
}

export function renderTemplate(text, vars) {
  return String(text).replace(/\{firstName\}/g, vars.firstName);
}

// Submitter-controlled names go into plain-text mail: collapse newlines, cap length.
function sanitizeFirstName(name) {
  const clean = String(name || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 80);
  return clean || 'there';
}

function summarize(kind, fields) {
  const lines = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(([k, v]) => `${k}: ${v}`);
  return { text: `New ${kind} on pulsedancers.com\n` + lines.join('\n'), lines };
}

async function sendWhatsApp(text) {
  // No WhatsApp sends are authorised in this owner-only email test phase.
  return false;

}

async function sendEmail(to, subject, text) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || typeof to !== 'string' || to.trim().toLowerCase() !== TEST_RECIPIENT) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, text }),
  });
  if (!res.ok) {
    console.error('Resend email failed:', res.status, await res.text().catch(() => ''));
    return false;
  }
  return true;
}

// Notify Pulse about a new submission. kind e.g. 'booking request'.
export async function notifyPulse(kind, fields) {
  try {
    const { text } = summarize(kind, fields);
    const subject = `New ${kind} - ${fields.name || fields.firstName || 'website'}`;
    const results = await Promise.allSettled([
      sendWhatsApp(text),
      sendEmail(ADMIN_EMAIL, subject, text),
    ]);
    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`notify channel ${i} error:`, r.reason);
    });
  } catch (e) {
    console.error('notifyPulse failed:', e.message);
  }
}

// Optional confirmation email to the person who submitted.
// templateKey is one of DEFAULT_AUTO_REPLIES keys (booking_confirmation,
// join_confirmation, testimonial_confirmation); copy comes from the CMS
// AUTO_REPLIES tab with the defaults as fallback.
export async function notifyCustomer(templateKey, toEmail, firstName) {
  try {
    if (process.env.SEND_CUSTOMER_CONFIRMATION !== '1' || !toEmail) return;
    if (!DEFAULT_AUTO_REPLIES[templateKey]) {
      console.error('notifyCustomer: unknown auto-reply template key:', templateKey);
      return;
    }
    const rows = await fetchAutoReplyRows();
    const template = templateFromRows(rows, templateKey);
    const text = renderTemplate(template.body, { firstName: sanitizeFirstName(firstName) });
    await sendEmail(toEmail, template.subject, text);
  } catch (e) {
    console.error('notifyCustomer failed:', e.message);
  }
}
