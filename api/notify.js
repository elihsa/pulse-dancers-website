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

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@pulsedancers.com';
const FROM_EMAIL = process.env.NOTIFY_FROM_EMAIL || 'Pulse Website <onboarding@resend.dev>';

function summarize(kind, fields) {
  const lines = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(([k, v]) => `${k}: ${v}`);
  return { text: `New ${kind} on pulsedancers.com\n` + lines.join('\n'), lines };
}

async function sendWhatsApp(text) {
  const phone = process.env.CALLMEBOT_PHONE_NUMBER;
  const apikey = process.env.CALLMEBOT_API_KEY;
  if (!phone || !apikey) return false;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
  const res = await fetch(url);
  return res.ok;
}

async function sendEmail(to, subject, text) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !to) return false;
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
export async function notifyCustomer(kind, toEmail, firstName) {
  try {
    if (process.env.SEND_CUSTOMER_CONFIRMATION !== '1' || !toEmail) return;
    const text =
      `Hi ${firstName || 'there'},\n\n` +
      `Thank you - we received your ${kind} and will get back to you within 24 hours.\n\n` +
      `Pulse Male Revue\ninfo@pulsedancers.com\nWhatsApp: +27 84 019 7733`;
    await sendEmail(toEmail, `We received your ${kind} - Pulse`, text);
  } catch (e) {
    console.error('notifyCustomer failed:', e.message);
  }
}
