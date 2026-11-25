// Visible build stamp. Updated with every site change (standing requirement).
// One edit here updates every page.
window.PULSE_BUILD = '2026-11-25 17:27 SAST';

document.addEventListener('DOMContentLoaded', () => {
  const stamp = document.createElement('div');
  stamp.className = 'build-stamp';
  stamp.textContent = 'Build ' + window.PULSE_BUILD;
  stamp.style.cssText =
    'text-align:center;font-size:0.85rem;color:rgba(229,229,229,0.75);padding:0.75rem 0 1.25rem;letter-spacing:0.02em;';
  const footer = document.querySelector('footer');
  (footer || document.body).appendChild(stamp);
});
