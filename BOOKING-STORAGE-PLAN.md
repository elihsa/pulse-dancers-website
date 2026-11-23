# Booking storage extension plan, preparation only

Not deployed. No spreadsheet reads, writes, header insertion, migration or backfill are part of this preparation.

## Grounded source contract

The only production BOOKINGS writer found in this repository is api/submit-booking.js. BOOKING-FORM.md documents31 positional fields, A:AE. The current handler appends exactly those31 values, with Status in AE. The browser already sends eventDate, eventTime and guestCount, but the handler discards them when assembling the stored row.

Do not insert fields before Status, despite an earlier spec note saying to do so. That would move Status and could break existing positional consumers. Do not assume row1 is a header or add labels over its current contents.

## Prepared backward-compatible code

lib/booking-row.js extracts the existing31 expressions without changing their order or defaults. It appends EventDate at AF, EventTime at AG and GuestCount at AH. Older callers write empty extension values. tests/booking-row.unit.mjs checks the entire legacy mapping against a fixed fixture, extension order and preservation of zero values. Three tests pass locally.

This mapping needs no existing-row reads, no header writes and no history edits. It would affect only future rows appended by this handler. The endpoint still uses the existing append behavior and notification behavior, neither enabled nor tested with real sends here.

## Unresolved before deployment

Source inspection cannot prove that the shared workbook has no external Apps Script, formula, integration or other writer relying on the31-column width or claiming AF:AH. The workbook's current business-use boundary also remains unverified. Therefore do not deploy this preparation merely because the first31 positions are preserved.

Needed confirmation: AF:AH are available for these optional new values, extending future rows is acceptable for all workbook consumers, and this handler targets the intended development CMS. If that cannot be established without reading submissions, ask Eli or the workbook owner for that narrow layout/integration confirmation, not permission to overwrite existing rows.

## Proposed application after confirmation

1. Revalidate current main/source and the target workbook configuration without printing secrets.
2. Confirm metadata-only column capacity. If fewer than34 columns exist, append only the necessary empty columns at the right edge after checking compatibility. No row/data deletion or shifts.
3. Update BOOKING-FORM.md and the active spec with the explicit A:AE + AF:AH contract and no-backfill limitation. Bump visible timestamped build.
4. Run unit/syntax and isolated browser regressions. Keep CI free of real submissions.
5. Merge/deploy only this source change under the approved scope. A controlled persistence test needs a separately grounded destination and permission for any resulting notifications; never call a mock success live end-to-end proof.
6. Rollback is code-only. Existing appended values remain, no data cleanup or backfill is implied.
