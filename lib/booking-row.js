// Positional contract: A:AE are immutable legacy columns.
// New optional values are appended at AF:AH, never inserted before Status.
// No header detection, existing-row reads or backfill are needed by this builder.
export const BOOKING_EXTENSION_COLUMNS = Object.freeze({
  EventDate: 'AF', EventTime: 'AG', GuestCount: 'AH',
});

export function buildBookingRow(b, timestamp) {
  // Phone numbers are written as text (leading apostrophe) so Sheets keeps
  // the leading zero on SA numbers.
  const asText = (v) => (v ? "'" + String(v) : '');
  return [
    timestamp,
    b.name,
    asText(b.phone),
    b.email,
    b.eventType || '',
    b.managing || '',
    b.managerName || '',
    asText(b.managerPhone),
    b.managerEmail || '',
    b.locType || '',
    b.address || '',
    b.area || '',
    b.distanceKm != null ? b.distanceKm : '',
    Array.isArray(b.services) ? b.services.join(', ') : (b.services || ''),
    b.maleCount || '',
    b.showType || '',
    b.race || '',
    b.costume || '',
    b.femaleCount || '',
    b.waiterCount || '',
    b.waiterHours || '',
    b.butlerCount || '',
    b.butlerHours || '',
    b.gamesQty || '',
    b.poleQty || '',
    b.otherText || '',
    b.notes || '',
    b.quote?.performance || '',
    b.quote?.travel || '',
    b.quote?.total || '',
    'Pending',
    b.eventDate || '',
    b.eventTime || '',
    b.guestCount ?? '',
  ];
}
