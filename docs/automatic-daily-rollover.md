# Automatic daily rollover

## Review and chosen approach
The previous GET /day/today returned the newest saved record, not the current calendar day. POST /day always inserted; the UI supplied a date string. The backend fallback used a fixed UTC+3 clock. No unique day index existed. Creation middleware initializes calorie targets and workouts, so replacing create() with an upsert would skip important behavior.

The server now computes YYYY-MM-DD using its clock and the browser's IANA time zone. GET /day/today gets or creates that key. POST /day delegates to the same operation for older clients; arbitrary dates and submitted journal contents are no longer accepted on creation. Older clients without a zone use Asia/Jerusalem with real DST rules.

## Data safety and concurrency
A partial unique index on (userId, localDate) covers keyed records only. It is explicitly awaited before writes, including when automatic indexing is disabled. Concurrent inserts return the winning document on duplicate-key errors. Initialization still uses create() and save middleware. A missing workout middleware completion callback was fixed.

An existing unkeyed record whose timestamp falls on today in the supplied zone is reused and assigned the key without changing its date, contents or timestamps. Other history is untouched. Existing duplicate historical records are retained, with the latest matching record selected. No destructive backfill or deduplication runs. Legacy dates do not contain their original zone; a timestamp cannot reliably recover that lost information.

After inactivity, only the current date is created. Empty missed days are not invented. Date keys are stable: changing zones can move the active date forward or backward, but returning to an existing calendar date reuses its record. Users in different zones on multiple devices share one record for the same YYYY-MM-DD.

## Browser lifecycle
Queries are scoped to user, local calendar date and zone. They refresh on mount, focus and reconnect. A timer runs at local midnight, with checks at most 30 seconds apart for clock/zone changes; focus and visibility events immediately recheck after sleep. Local midnight is constructed as a calendar boundary, not by adding 24 hours. A new query never displays the previous day's cached data. Late save responses invalidate queries rather than overwrite the current day's cache.

The manual Start New Day button and confirmation are removed. Existing loading/error UI remains available for failed requests; browser reconnect/focus retries the request. Offline clients cannot create server records until connectivity returns.

## Validation
Run backend tests: backend/node_modules/.bin/jest --config backend/jest.rollover.config.json --runInBand
Run frontend tests: frontend/node_modules/.bin/vitest run --config vitest.rollover.config.ts --root frontend
Run both frontend and backend TypeScript checks after building shared types.

Tests cover local midnight, DST, zone offsets, first/return visits, legacy reuse, duplicate conflict recovery, errors, compatibility POST behavior, browser midnight/resume, and removal of the manual action. Database behavior is mocked; production MongoDB concurrency and legacy data should be checked in staging before release. The database account needs createIndex permission; requests fail rather than silently create unprotected records if index creation fails.
