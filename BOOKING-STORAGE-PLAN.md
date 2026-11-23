# Booking storage extension plan, preparation only

Prepared for the current existing-sheet test environment. No header insertion, history edits, migration or backfill are included.

## Grounded source contract

The only production BOOKINGS writer found in this repository is api/submit-booking.js. BOOKING-FORM.md documents31 positional fields, A:AE. The current handler appends exactly those31 values, with Status in AE. The browser already sends eventDate, eventTime and guestCount, but the handler discards them when assembling the stored row.

Do not insert fields before Status, despite an earlier spec note saying to do so. That would move Status and could break existing positional consumers. Do not assume row1 is a header or add labels over its current contents.

## Prepared backward-compatible code

lib/booking-row.js extracts the existing31 expressions without changing their order or defaults. It appends EventDate at AF, EventTime at AG and GuestCount at AH. Older callers write empty extension values. tests/booking-row.unit.mjs checks the entire legacy mapping against a fixed fixture, extension order and preservation of zero values. Three tests pass locally.

This mapping needs no existing-row reads, no header writes and no history edits. It would affect only future rows appended by this handler. The endpoint still uses the existing append behavior and notification behavior, neither enabled nor tested with real sends here.

## Owner clarification and final plan

Eli's23 November12:20 authenticated voice clarification says the existing entries are test data, keep the existing setup and make it work as for public use. No isolated workbook will be created, and no current purge is approved. The compatible append-only extension preserves all existing positions and records without relying on header detection. There is no workbook schema mutation or header creation step.

1. Keep the existing workbook target, credentials and access unchanged.
2. Append34 fields for future bookings only, with Status still in AE.
3. Return the exact savedRange supplied by Sheets for narrowly scoped verification of a new controlled test, not a scan of past submissions.
4. Keep notification configuration unchanged. Do not send to arbitrary/legacy recipients. Actual controlled test sends remain limited to the owner's approved address.
5. Local unit tests establish mapping, not actual persistence. Verify a controlled newly written row only within the approved test scope before claiming live persistence.
6. Rollback is code-only. Already appended values stay in place. No cleanup, backfill or purge is implied.
