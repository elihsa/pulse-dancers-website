/**
 * Pulse Booking Form — custom form with conditional service fields and live quote.
 *
 * SINGLE SOURCE OF TRUTH: every service price is read from the PRICES tab of
 * the CMS (Service | Price | Duration | Description) — the exact same table
 * the Prices page renders. A price is edited in ONE place and both the page
 * and the quote update. Travel settings live in the PAGE_CONTENT tab
 * (Page = BOOKING) and drive BOTH the quote math and the displayed sentence:
 *
 * CMS keys (PAGE_CONTENT tab, Page=BOOKING):
 *   travelRatePerKm   - travel fee per km beyond the free radius (default 5)
 *   freeRadiusKm      - free travel radius in km (default 50)
 *   baseLocationName  - display name of the base location (default "Sandton City")
 *   googleMapsApiKey  - Google Maps JS API key (enables address autocomplete)
 *
 * Service prices (PRICES tab, matched by Service name — quote looks these up):
 *   "1 Man Xpress Show", "1 Man Show", "2 Man Show" ... "6 Man Show",
 *   "Female Stripper", "Topless Waiter", "Bottomless Waiter",
 *   "Fun Games", "Pole Dancer"
 * Missing price -> the item shows as POA (price on application).
 */

const BookingSettings = {
  travelRatePerKm: 5,
  freeRadiusKm: 50,
  baseLocationName: 'Sandton City',
  baseCoords: { lat: -26.1086, lng: 28.0567 }, // Sandton City
  prices: {}, // Service name -> { price, duration, description } from PRICES tab
  googleMapsApiKey: null,
};

// Approximate coordinates for common areas (fallback when no Maps key).
const AREA_COORDS = {
  'sandton': [-26.1086, 28.0567], 'sandton city': [-26.1086, 28.0567],
  'rosebank': [-26.1470, 28.0410], 'johannesburg': [-26.2041, 28.0473],
  'johannesburg cbd': [-26.2041, 28.0473], 'cbd': [-26.2041, 28.0473],
  'pretoria': [-25.7461, 28.1881], 'centurion': [-25.8601, 28.1894],
  'midrand': [-25.9895, 28.1282], 'soweto': [-26.2678, 27.8585],
  'randburg': [-26.0936, 28.0064], 'roodepoort': [-26.1625, 27.8725],
  'krugersdorp': [-26.1018, 27.7702], 'benoni': [-26.1884, 28.3208],
  'boksburg': [-26.2124, 28.2621], 'kempton park': [-26.1000, 28.2300],
  'germiston': [-26.2280, 28.1700], 'alberton': [-26.2675, 28.1200],
  'fourways': [-26.0210, 28.0090], 'morningside': [-26.0830, 28.0650],
  'melville': [-26.1760, 28.0030], 'parkhurst': [-26.1400, 28.0400],
  'houghton': [-26.1660, 28.0600], 'morningside sandton': [-26.0830, 28.0650],
  'rivonia': [-26.0450, 28.0650], 'lonehill': [-26.0100, 28.0300],
  'kyalami': [-25.9900, 28.0700], 'pretoria east': [-25.7600, 28.2300],
  'hatfield': [-25.7480, 28.2380], 'menlyn': [-25.7830, 28.2760],
  'cape town': [-33.9249, 18.4241], 'cape town cbd': [-33.9249, 18.4241],
  'durban': [-29.8587, 31.0218], 'umhlanga': [-29.7250, 31.0800],
  'bloemfontein': [-29.0852, 26.1596], 'port elizabeth': [-33.9608, 25.6022],
  'gqeberha': [-33.9608, 25.6022], 'east london': [-33.0153, 27.9116],
  'stellenbosch': [-33.9321, 18.8602], 'paarl': [-33.7342, 18.9621],
  'ballito': [-29.5400, 31.2100], 'pietermaritzburg': [-29.6000, 30.3800],
};

const BookingForm = {
  distanceKm: null,

  async init() {
    await this.loadSettings();
    this.bindEvents();
    this.updateQuote();
  },

  async loadSettings() {
    // Travel settings from the PAGE_CONTENT tab (Page = BOOKING).
    // NOTE: the map is keyed by the Key column. An earlier version keyed it by
    // the Page column, so no CMS setting ever actually loaded — the form always
    // ran on the hardcoded defaults below.
    try {
      const rows = await PulseSheetsCMS.fetchSheet('PAGE_CONTENT', 1, 100);
      const map = {};
      rows.forEach(r => { if (r[0] && String(r[0]).trim() === 'BOOKING' && r[1]) map[String(r[1]).trim()] = r[2]; });
      const num = (v, d) => { const n = parseFloat(v); return isNaN(n) ? d : n; };
      if (map.travelRatePerKm) BookingSettings.travelRatePerKm = num(map.travelRatePerKm, 5);
      if (map.freeRadiusKm) BookingSettings.freeRadiusKm = num(map.freeRadiusKm, 50);
      if (map.baseLocationName) BookingSettings.baseLocationName = String(map.baseLocationName).trim();
      if (map.googleMapsApiKey) BookingSettings.googleMapsApiKey = String(map.googleMapsApiKey).trim();
    } catch (e) {
      console.warn('[Booking] Could not load settings from CMS, using defaults:', e.message);
    }
    // Service prices — single source of truth: the PRICES tab (the same table
    // the Prices page renders). Services missing a price quote as POA.
    try {
      const rows = await PulseSheetsCMS.fetchSheet('PRICES', 1, 50);
      rows.forEach(r => {
        const name = r[0] ? String(r[0]).trim() : '';
        if (!name || name.toLowerCase().includes('service')) return; // skip header row
        const price = parseFloat(String(r[1] || '').replace(/[^0-9.]/g, ''));
        BookingSettings.prices[name] = {
          price: isNaN(price) ? null : price,
          duration: r[2] || '',
          description: r[3] || '',
        };
      });
    } catch (e) {
      console.warn('[Booking] Could not load prices from CMS, using POA fallbacks:', e.message);
    }
    // Populate area datalist
    const dl = document.getElementById('bf-area-list');
    if (dl) dl.innerHTML = Object.keys(AREA_COORDS).map(a => `<option value="${a}">`).join('');
    // Load Maps if key present
    if (BookingSettings.googleMapsApiKey) {
      this.loadGoogleMaps();
    } else {
      // No Maps key: the exact-address path can't compute distance, so offer
      // the area list only. Adding BOOKING|googleMapsApiKey to the CMS
      // re-enables address autocomplete automatically.
      const exact = document.querySelector('input[name="locType"][value="exact"]');
      if (exact && exact.closest('label')) exact.closest('label').hidden = true;
    }
    this.updateRateNotes();
  },

  // Look up a service price from the PRICES tab; null -> POA.
  priceOf(name) {
    const p = BookingSettings.prices[name];
    return p && p.price ? p.price : null;
  },

  loadGoogleMaps() {
    if (window.google && window.google.maps) return;
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(BookingSettings.googleMapsApiKey)}&libraries=places&callback=initGoogleMapsBooking`;
    s.async = true; s.defer = true;
    document.head.appendChild(s);
    window.initGoogleMapsBooking = () => this.setupAutocomplete();
  },

  setupAutocomplete() {
    const input = document.getElementById('bf-address');
    if (!input || !window.google) return;
    const ac = new google.maps.places.Autocomplete(input, { types: ['geocode'] });
    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      if (place && place.geometry) {
        this.setDistance(this.haversine(BookingSettings.baseCoords, place.geometry.location.toJSON()) * 2);
      }
    });
  },

  haversine(a, b) {
    const R = 6371;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const h = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180) * Math.cos(b.lat*Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h)); // one way
  },

  lookupArea(areaText) {
    const t = areaText.toLowerCase().trim();
    for (const [name, coords] of Object.entries(AREA_COORDS)) {
      if (t === name || t.includes(name) || name.includes(t)) return { lat: coords[0], lng: coords[1] };
    }
    return null;
  },

  setDistance(km) {
    this.distanceKm = km;
    const disp = document.getElementById('bf-distance-display');
    const kmEl = document.getElementById('bf-distance-km');
    const note = document.getElementById('bf-travel-note');
    if (disp) disp.style.display = 'block';
    if (kmEl) kmEl.textContent = `${km.toFixed(0)} km (round trip)`;
    if (note) note.textContent = km <= BookingSettings.freeRadiusKm
      ? ' — within the free travel radius'
      : ` — travel fee applies beyond ${BookingSettings.freeRadiusKm}km`;
    this.updateQuote();
  },

  bindEvents() {
    // Conditional sections
    document.querySelectorAll('input[name="managing"]').forEach(r =>
      r.addEventListener('change', () => {
        document.getElementById('bf-manager-fields').hidden =
          r.value !== 'Yes, but im not managing it.' || !r.checked;
      }));
    document.querySelectorAll('input[name="locType"]').forEach(r =>
      r.addEventListener('change', () => {
        const exact = r.value === 'exact' && r.checked;
        document.getElementById('bf-exact-fields').hidden = !exact;
        document.getElementById('bf-area-fields').hidden = exact;
        if (exact) { this.distanceKm = null; this.clearDistanceDisplay(); }
      }));
    document.querySelectorAll('input[name="service"]').forEach(cb =>
      cb.addEventListener('change', () => {
        document.getElementById(`bf-${cb.value}-fields`).hidden = !cb.checked;
        this.updateQuote();
      }));
    // Area input -> estimate distance
    const area = document.getElementById('bf-area');
    if (area) area.addEventListener('change', () => {
      const coords = this.lookupArea(area.value);
      if (coords) this.setDistance(this.haversine(BookingSettings.baseCoords, coords) * 2);
    });
    // Any input that affects the quote
    document.querySelectorAll('#booking-form input, #booking-form select').forEach(el =>
      el.addEventListener('input', () => this.updateQuote()));
    // Submit
    document.getElementById('booking-form').addEventListener('submit', (e) => this.onSubmit(e));
  },

  clearDistanceDisplay() {
    const disp = document.getElementById('bf-distance-display');
    if (disp) disp.style.display = 'none';
  },

  fmt(n) { return 'R' + Math.round(n).toLocaleString('en-ZA'); },

  updateRateNotes() {
    const P = BookingSettings.prices;
    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    // Notes are generated from the PRICES tab — no rates live in this file.
    const note = (name) => {
      const p = P[name];
      if (!p || !p.price) return 'Price on application';
      return p.duration ? `R${p.price} · ${p.duration}` : `R${p.price}`;
    };
    set('bf-waiter-rate-note', note('Topless Waiter'));
    set('bf-butler-rate-note', note('Bottomless Waiter'));
    set('bf-games-rate-note', note('Fun Games'));
    set('bf-pole-rate-note', note('Pole Dancer'));
  },

  val(id) { const el = document.getElementById(id); return el ? parseFloat(el.value) || 0 : 0; },
  checked(sel) { return Array.from(document.querySelectorAll(sel + ':checked')); },

  updateQuote() {
    const S = BookingSettings;
    let performance = 0;
    let hasPOA = false;

    // Male strippers: package price from the PRICES tab ("1 Man Xpress Show",
    // "1 Man Show", "2 Man Show" ... "6 Man Show"). Multi-man shows have no
    // xpress tier, so the package price applies regardless of show length.
    if (this.checked('input[name="service"][value="male"]').length) {
      const count = this.val('bf-male-count') || 1;
      const xpress = document.getElementById('bf-show-type').value === 'xpress';
      const price = count === 1
        ? this.priceOf(xpress ? '1 Man Xpress Show' : '1 Man Show')
        : (this.priceOf(`${count} Man Show`) || count * this.priceOf('1 Man Show'));
      if (price) performance += price; else hasPOA = true;
    }
    // Everything else: per-unit PRICES price x count/hours/qty.
    const line = (name, count, hours) => {
      const p = this.priceOf(name);
      if (!p) { hasPOA = true; return; }
      performance += count * (hours || 1) * p;
    };
    if (this.checked('input[name="service"][value="female"]').length)
      line('Female Stripper', this.val('bf-female-count') || 1);
    if (this.checked('input[name="service"][value="waiter"]').length)
      line('Topless Waiter', this.val('bf-waiter-count') || 1, this.val('bf-waiter-hours') || 1);
    if (this.checked('input[name="service"][value="butler"]').length)
      line('Bottomless Waiter', this.val('bf-butler-count') || 1, this.val('bf-butler-hours') || 1);
    if (this.checked('input[name="service"][value="games"]').length)
      line('Fun Games', this.val('bf-games-qty') || 1);
    if (this.checked('input[name="service"][value="pole"]').length)
      line('Pole Dancer', this.val('bf-pole-qty') || 1);

    const distance = this.distanceKm || 0;
    const travel = Math.max(0, distance - S.freeRadiusKm) * S.travelRatePerKm;
    const total = performance + travel;

    const t = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    t('bf-quote-performance', this.fmt(performance));
    t('bf-quote-distance', distance > 0 ? `${distance.toFixed(0)} km` : '—');
    t('bf-quote-travel', this.fmt(travel));
    t('bf-quote-total', hasPOA && performance === 0 ? 'POA' : this.fmt(total) + (hasPOA ? ' + POA items' : ''));
  },

  async onSubmit(e) {
    e.preventDefault();
    const status = document.getElementById('bf-form-status');
    const btn = document.getElementById('bf-submit');

    // Validation
    const name = document.getElementById('bf-name').value.trim();
    const email = document.getElementById('bf-email').value.trim();
    const phone = document.getElementById('bf-phone').value.trim();
    const eventType = this.checked('input[name="eventType"]');
    const managing = this.checked('input[name="managing"]');
    const locType = this.checked('input[name="locType"]');
    const services = this.checked('input[name="service"]');

    const missing = [];
    if (!name) missing.push('your name');
    if (!email) missing.push('your email');
    if (!phone) missing.push('your phone number');
    if (!eventType.length) missing.push('event type');
    if (!managing.length) missing.push('who is managing the event');
    if (!locType.length) missing.push('whether you know the address');
    if (!services.length) missing.push('at least one service');
    if (locType[0] && locType[0].value === 'exact' && !this.distanceKm) missing.push('a valid address (select from the suggestions)');
    if (locType[0] && locType[0].value === 'area' && !this.lookupArea(document.getElementById('bf-area').value)) missing.push('a recognizable area');

    if (missing.length) {
      status.style.display = 'block';
      status.style.color = '#ff5276';
      status.textContent = `Please provide: ${missing.join(', ')}.`;
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending...';
    status.style.display = 'block';
    status.style.color = '#b0b0b0';
    status.textContent = 'Sending your booking request...';

    const payload = {
      name, email, phone,
      eventType: eventType[0].value,
      managing: managing[0].value,
      managerName: document.getElementById('bf-manager-name').value.trim(),
      managerPhone: document.getElementById('bf-manager-phone').value.trim(),
      managerEmail: document.getElementById('bf-manager-email').value.trim(),
      locType: locType[0].value,
      address: document.getElementById('bf-address').value.trim(),
      area: document.getElementById('bf-area').value.trim(),
      distanceKm: this.distanceKm,
      services: services.map(s => s.value),
      maleCount: this.val('bf-male-count') || '',
      showType: document.getElementById('bf-show-type') ? document.getElementById('bf-show-type').value : '',
      race: document.getElementById('bf-race') ? document.getElementById('bf-race').value : '',
      costume: document.getElementById('bf-costume') ? document.getElementById('bf-costume').value : '',
      femaleCount: this.val('bf-female-count') || '',
      waiterCount: this.val('bf-waiter-count') || '',
      waiterHours: this.val('bf-waiter-hours') || '',
      butlerCount: this.val('bf-butler-count') || '',
      butlerHours: this.val('bf-butler-hours') || '',
      gamesQty: this.val('bf-games-qty') || '',
      poleQty: this.val('bf-pole-qty') || '',
      otherText: document.getElementById('bf-other-text').value.trim(),
      notes: document.getElementById('bf-notes').value.trim(),
      quote: {
        performance: document.getElementById('bf-quote-performance').textContent,
        distance: document.getElementById('bf-quote-distance').textContent,
        travel: document.getElementById('bf-quote-travel').textContent,
        total: document.getElementById('bf-quote-total').textContent,
      },
    };

    try {
      const res = await fetch('/api/submit-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        status.style.color = '#4ade80';
        status.textContent = data.message || 'Thank you! Your booking request has been sent. We will respond within 24 hours.';
        document.getElementById('booking-form').reset();
        ['bf-manager-fields','bf-exact-fields','bf-area-fields','bf-male-fields','bf-female-fields','bf-waiter-fields','bf-butler-fields','bf-games-fields','bf-pole-fields','bf-other-fields']
          .forEach(id => { const el = document.getElementById(id); if (el) el.hidden = true; });
        this.distanceKm = null;
        this.clearDistanceDisplay();
        this.updateQuote();
      } else {
        throw new Error(data.message || data.error || 'Submission failed');
      }
    } catch (err) {
      status.style.color = '#ff5276';
      status.textContent = `Sorry, something went wrong: ${err.message}. Please try again or email bookings@pulsedancers.com.`;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Booking Request';
    }
  },
};

// Boot
let bookingInitialized = false;
function initBookingForm() {
  if (bookingInitialized) return;
  bookingInitialized = true;
  BookingForm.init();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBookingForm);
} else {
  initBookingForm();
}
